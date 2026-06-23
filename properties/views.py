from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Governorate, City, Category, Property
from .serializers import (
    GovernorateSerializer, CitySerializer, CategorySerializer,
    PropertyListSerializer, PropertyDetailSerializer, PropertyCreateSerializer
)


class GovernorateListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Governorate.objects.all()
    serializer_class = GovernorateSerializer


class CityListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CitySerializer

    def get_queryset(self):
        governorate_id = self.request.query_params.get('governorate')
        if governorate_id:
            return City.objects.filter(governorate_id=governorate_id)
        return City.objects.all()


class CategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Category.objects.filter(parent=None)
    serializer_class = CategorySerializer


class PropertyListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        queryset = Property.objects.filter(status='available')
        params = self.request.query_params

        # Filters
        if params.get('listing_type'):
            queryset = queryset.filter(listing_type=params['listing_type'])
        if params.get('category'):
            queryset = queryset.filter(category_id=params['category'])
        if params.get('governorate'):
            queryset = queryset.filter(governorate_id=params['governorate'])
        if params.get('city'):
            queryset = queryset.filter(city_id=params['city'])
        if params.get('price_min'):
            queryset = queryset.filter(price__gte=params['price_min'])
        if params.get('price_max'):
            queryset = queryset.filter(price__lte=params['price_max'])
        if params.get('bedrooms'):
            queryset = queryset.filter(bedrooms=params['bedrooms'])
        if params.get('bathrooms'):
            queryset = queryset.filter(bathrooms=params['bathrooms'])
        if params.get('search'):
            queryset = queryset.filter(
                title_en__icontains=params['search']
            ) | queryset.filter(
                title_ar__icontains=params['search']
            )

        return queryset


class PropertyDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertyDetailSerializer
    queryset = Property.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class PropertyCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyCreateSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MyPropertiesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)


class PropertyUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyCreateSerializer

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)
