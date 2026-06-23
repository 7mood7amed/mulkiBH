from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from datetime import timedelta
from .models import SubscriptionPlan, Subscription
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer


class PlanListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer


class CurrentSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = Subscription.objects.filter(
            user=request.user, status='active'
        ).order_by('-created_at').first()
        if sub:
            return Response(SubscriptionSerializer(sub).data)
        return Response({'message': 'No active subscription. You are on the free plan.'})


class UpgradeSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        payment_reference = request.data.get('payment_reference', '')

        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Cancel existing active subscriptions
        Subscription.objects.filter(user=request.user, status='active').update(status='cancelled')

        # Create new subscription
        sub = Subscription.objects.create(
            user=request.user,
            plan=plan,
            end_date=timezone.now() + timedelta(days=plan.duration_days),
            payment_reference=payment_reference,
            amount_paid=plan.price_bd
        )
        return Response({
            'message': f'Subscribed to {plan.name} plan successfully.',
            'subscription': SubscriptionSerializer(sub).data
        }, status=status.HTTP_201_CREATED)
