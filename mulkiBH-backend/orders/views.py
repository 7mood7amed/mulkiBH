from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Order, OrderResponse
from .serializers import (
    OrderCreateSerializer, OrderListSerializer,
    OrderDetailSerializer, OrderResponseSerializer
)
from notifications.utils import send_notification_to_owners, send_notification


class OrderCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderCreateSerializer

    def perform_create(self, serializer):
        order = serializer.save(customer=self.request.user)
        # Broadcast to all owners and agencies
        send_notification_to_owners(order)


class OrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['owner', 'agency']:
            return Order.objects.filter(status='open')
        return Order.objects.filter(customer=user)


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ['owner', 'agency']:
            return Order.objects.filter(status='open')
        return Order.objects.filter(customer=user)


class OrderResponseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        user = request.user
        if user.role not in ['owner', 'agency']:
            return Response(
                {'error': 'Only owners and agencies can respond to orders.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            order = Order.objects.get(id=order_id, status='open')
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Prevent duplicate responses
        if OrderResponse.objects.filter(order=order, responder=user).exists():
            return Response(
                {'error': 'You have already responded to this order.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OrderResponseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order, responder=user)

            # Notify the customer
            responder_name = user.agency_name if user.role == 'agency' and user.agency_name else user.full_name
            send_notification(
                user=order.customer,
                type='response',
                title_en=f'New Response on Your Order #{order.id}',
                title_ar=f'رد جديد على طلبك #{order.id}',
                message_en=f'{responder_name} has responded to your property order. Contact: {user.phone or user.whatsapp}',
                message_ar=f'قام {responder_name} بالرد على طلب العقار الخاص بك. للتواصل: {user.phone or user.whatsapp}',
                channel='dashboard'
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyOrdersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderListSerializer

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)


class CloseOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, customer=request.user)
            order.status = 'closed'
            order.save()
            return Response({'message': 'Order closed successfully.'})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
