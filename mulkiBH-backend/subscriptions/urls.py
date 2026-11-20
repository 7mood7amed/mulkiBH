from django.urls import path
from .views import PlanListView, CurrentSubscriptionView

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('current/', CurrentSubscriptionView.as_view(), name='current-subscription'),
]
