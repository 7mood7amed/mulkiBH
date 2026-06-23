from rest_framework import serializers
from .models import Order, OrderResponse


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'category', 'governorate', 'city', 'listing_type',
            'price_min', 'price_max', 'bedrooms', 'bathrooms',
            'area_sqm_min', 'description', 'notes', 'phone'
        ]


class OrderResponseSerializer(serializers.ModelSerializer):
    responder_name = serializers.CharField(source='responder.full_name', read_only=True)
    responder_phone = serializers.CharField(source='responder.phone', read_only=True)
    responder_whatsapp = serializers.CharField(source='responder.whatsapp', read_only=True)
    responder_agency = serializers.CharField(source='responder.agency_name', read_only=True)

    class Meta:
        model = OrderResponse
        fields = [
            'id', 'message', 'status', 'created_at',
            'responder_name', 'responder_phone',
            'responder_whatsapp', 'responder_agency'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_en', read_only=True)
    city_name = serializers.CharField(source='city.name_en', read_only=True)
    governorate_name = serializers.CharField(source='governorate.name_en', read_only=True)
    responses_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'listing_type', 'price_min', 'price_max',
            'bedrooms', 'status', 'phone',
            'category_name', 'city_name', 'governorate_name',
            'responses_count', 'created_at'
        ]

    def get_responses_count(self, obj):
        return obj.responses.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    responses = OrderResponseSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name_en', read_only=True)
    city_name = serializers.CharField(source='city.name_en', read_only=True)
    governorate_name = serializers.CharField(source='governorate.name_en', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'listing_type', 'price_min', 'price_max',
            'bedrooms', 'bathrooms', 'area_sqm_min',
            'description', 'notes', 'phone', 'status',
            'category_name', 'city_name', 'governorate_name',
            'responses', 'created_at', 'updated_at'
        ]
