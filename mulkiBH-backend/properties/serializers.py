from rest_framework import serializers
from .models import Governorate, City, Category, Property, PropertyImage


class GovernorateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Governorate
        fields = ['id', 'name_en', 'name_ar']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name_en', 'name_ar', 'governorate']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name_en', 'name_ar', 'type', 'parent', 'subcategories']

    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'is_main']


class PropertyListSerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name_en', read_only=True)
    city_name = serializers.CharField(source='city.name_en', read_only=True)
    governorate_name = serializers.CharField(source='governorate.name_en', read_only=True)
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title_en', 'title_ar', 'listing_type', 'price',
            'area_sqm', 'bedrooms', 'bathrooms', 'status',
            'category_name', 'city_name', 'governorate_name',
            'owner_name', 'main_image', 'is_featured', 'views_count', 'created_at'
        ]

    def get_main_image(self, obj):
        main = obj.images.filter(is_main=True).first()
        if main:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(main.image.url)
        return None


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    city = CitySerializer(read_only=True)
    governorate = GovernorateSerializer(read_only=True)
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    owner_phone = serializers.CharField(source='owner.phone', read_only=True)
    owner_whatsapp = serializers.CharField(source='owner.whatsapp', read_only=True)
    owner_agency = serializers.CharField(source='owner.agency_name', read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title_en', 'title_ar', 'description_en', 'description_ar',
            'listing_type', 'price', 'area_sqm', 'bedrooms', 'bathrooms', 'floors',
            'address_en', 'address_ar', 'status', 'is_featured', 'views_count',
            'category', 'city', 'governorate', 'images',
            'owner_name', 'owner_phone', 'owner_whatsapp', 'owner_agency',
            'created_at', 'updated_at'
        ]


class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'title_en', 'title_ar', 'description_en', 'description_ar',
            'category', 'governorate', 'city',
            'listing_type', 'price', 'area_sqm', 'bedrooms', 'bathrooms', 'floors',
            'address_en', 'address_ar',
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        property_obj = Property.objects.create(**validated_data)
        if request:
            images = request.FILES.getlist('images')
            for i, image in enumerate(images):
                PropertyImage.objects.create(
                    property=property_obj,
                    image=image,
                    is_main=(i == 0)
                )
        return property_obj
