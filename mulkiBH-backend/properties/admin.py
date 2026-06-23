from django.contrib import admin
from .models import Governorate, City, Category, Property, PropertyImage

@admin.register(Governorate)
class GovernorateAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_ar')

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_ar', 'governorate')
    list_filter = ('governorate',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_ar', 'type', 'parent')
    list_filter = ('type',)

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'owner', 'category', 'listing_type', 'price', 'status', 'created_at')
    list_filter = ('listing_type', 'status', 'category', 'governorate')
    search_fields = ('title_en', 'title_ar')
    inlines = [PropertyImageInline]
