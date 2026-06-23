from django.db import models
from users.models import User
from properties.models import Category, Governorate, City


class Order(models.Model):
    LISTING_TYPE = [
        ('rent', 'Rent'),
        ('buy', 'Buy'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('fulfilled', 'Fulfilled'),
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    governorate = models.ForeignKey(Governorate, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)

    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE)
    price_min = models.DecimalField(max_digits=12, decimal_places=3, null=True, blank=True)
    price_max = models.DecimalField(max_digits=12, decimal_places=3, null=True, blank=True)
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)
    area_sqm_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    phone = models.CharField(max_length=20)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} by {self.customer.full_name}"

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']


class OrderResponse(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='responses')
    responder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_responses')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to Order #{self.order.id} by {self.responder.full_name}"

    class Meta:
        db_table = 'order_responses'
        ordering = ['-created_at']
