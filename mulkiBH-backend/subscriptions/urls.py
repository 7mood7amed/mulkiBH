from django.urls import path
from .views import PlanListView, CurrentSubscriptionView, CreatePaymentView, VerifyPaymentView, WebhookView

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('current/', CurrentSubscriptionView.as_view(), name='current-subscription'),
    path('pay/', CreatePaymentView.as_view(), name='create-payment'),
    path('verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('webhook/', WebhookView.as_view(), name='webhook'),
]
