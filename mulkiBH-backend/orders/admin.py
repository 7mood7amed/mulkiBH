from django.contrib import admin
from .models import Order, OrderResponse

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'category', 'listing_type', 'status', 'created_at')
    list_filter = ('listing_type', 'status', 'category')
    search_fields = ('customer__full_name', 'customer__email')

@admin.register(OrderResponse)
class OrderResponseAdmin(admin.ModelAdmin):
    list_display = ('order', 'responder', 'status', 'created_at')
    list_filter = ('status',)
