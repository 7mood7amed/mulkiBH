from rest_framework import serializers
from .models import SubscriptionPlan, Subscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'price_bd', 'listings_limit',
            'orders_limit', 'duration_days',
            'description_en', 'description_ar'
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='plan.price_bd', max_digits=8, decimal_places=3, read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id', 'plan_name', 'plan_price', 'status',
            'start_date', 'end_date', 'amount_paid'
        ]
