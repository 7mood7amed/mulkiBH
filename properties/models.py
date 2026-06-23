from django.db import models
from users.models import User


class Governorate(models.Model):
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)

    def __str__(self):
        return self.name_en

    class Meta:
        db_table = 'governorates'


class City(models.Model):
    governorate = models.ForeignKey(Governorate, on_delete=models.CASCADE, related_name='cities')
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)

    def __str__(self):
        return self.name_en

    class Meta:
        db_table = 'cities'


class Category(models.Model):
    CATEGORY_CHOICES = [
        ('residential', 'Residential'),
        ('land', 'Land'),
        ('commercial', 'Commercial'),
    ]
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    # e.g. Flat, House, Villa, Shop (subcategory under residential/commercial)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')

    def __str__(self):
        return self.name_en

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'


class Property(models.Model):
    LISTING_TYPE = [
        ('rent', 'Rent'),
        ('sale', 'Sale'),
    ]
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('rented', 'Rented'),
        ('sold', 'Sold'),
        ('pending', 'Pending'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    governorate = models.ForeignKey(Governorate, on_delete=models.SET_NULL, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)

    title_en = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)

    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE)
    price = models.DecimalField(max_digits=12, decimal_places=3)  # BD currency
    area_sqm = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)
    floors = models.PositiveIntegerField(null=True, blank=True)

    address_en = models.CharField(max_length=255, blank=True)
    address_ar = models.CharField(max_length=255, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title_en

    class Meta:
        db_table = 'properties'
        verbose_name_plural = 'Properties'
        ordering = ['-created_at']


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/')
    is_main = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title_en}"

    class Meta:
        db_table = 'property_images'
