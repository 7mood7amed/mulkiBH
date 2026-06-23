from django.urls import path
from .views import (
    OrderCreateView, OrderListView, OrderDetailView,
    OrderResponseView, MyOrdersView, CloseOrderView
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:order_id>/respond/', OrderResponseView.as_view(), name='order-respond'),
    path('<int:order_id>/close/', CloseOrderView.as_view(), name='order-close'),
]
