from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
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

