from django.db import models
from users.models import User


class SubscriptionPlan(models.Model):
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
    ]

    name = models.CharField(max_length=20, choices=PLAN_CHOICES, unique=True)
    price_bd = models.DecimalField(max_digits=8, decimal_places=3, default=0)
    listings_limit = models.PositiveIntegerField(default=10)  # 0 = unlimited
    orders_limit = models.PositiveIntegerField(default=5)     # 0 = unlimited
    duration_days = models.PositiveIntegerField(default=30)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name.capitalize()

    class Meta:
        db_table = 'subscription_plans'


class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    payment_reference = models.CharField(max_length=255, blank=True)
    amount_paid = models.DecimalField(max_digits=8, decimal_places=3, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.plan.name}"

    class Meta:
        db_table = 'subscriptions'
        ordering = ['-created_at']
