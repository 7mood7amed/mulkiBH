from django.urls import path
from .views import (
    GovernorateListView, CityListView, CategoryListView,
    PropertyListView, PropertyDetailView, PropertyCreateView,
    MyPropertiesView, PropertyUpdateDeleteView
)

urlpatterns = [
    path('governorates/', GovernorateListView.as_view(), name='governorates'),
    path('cities/', CityListView.as_view(), name='cities'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('', PropertyListView.as_view(), name='property-list'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    path('create/', PropertyCreateView.as_view(), name='property-create'),
    path('my-properties/', MyPropertiesView.as_view(), name='my-properties'),
    path('<int:pk>/manage/', PropertyUpdateDeleteView.as_view(), name='property-manage'),
]
