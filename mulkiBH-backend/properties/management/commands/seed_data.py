from django.core.management.base import BaseCommand
from properties.models import Governorate, City, Category


class Command(BaseCommand):
    help = 'Seed Bahrain governorates, cities, and property categories'

    def handle(self, *args, **kwargs):
        self.seed_locations()
        self.seed_categories()
        self.stdout.write(self.style.SUCCESS('✅ Seed data loaded successfully!'))

    def seed_locations(self):
        locations = [
            {
                'name_en': 'Capital Governorate',
                'name_ar': 'محافظة العاصمة',
                'cities': [
                    ('Manama', 'المنامة'),
                    ('Juffair', 'الجفير'),
                    ('Adliya', 'العدلية'),
                    ('Hoora', 'الحورة'),
                    ('Seef', 'السيف'),
                    ('Diplomatic Area', 'المنطقة الدبلوماسية'),
                    ('Zinj', 'زنج'),
                    ('Qudaibiya', 'قضيبية'),
                    ('Muharraq Road', 'طريق المحرق'),
                ]
            },
            {
                'name_en': 'Muharraq Governorate',
                'name_ar': 'محافظة المحرق',
                'cities': [
                    ('Muharraq', 'المحرق'),
                    ('Hidd', 'الحد'),
                    ('Arad', 'عراد'),
                    ('Dair', 'الدير'),
                    ('Galali', 'القلالي'),
                    ('Busaiteen', 'البسيتين'),
                    ('Amwaj Islands', 'جزر أمواج'),
                    ('Dur', 'دور'),
                ]
            },
            {
                'name_en': 'Northern Governorate',
                'name_ar': 'المحافظة الشمالية',
                'cities': [
                    ('Budaiya', 'البديع'),
                    ('Hamad Town', 'مدينة حمد'),
                    ('Saar', 'سار'),
                    ('Janabiya', 'الجنابية'),
                    ('Barbar', 'بربار'),
                    ('Diraz', 'دراز'),
                    ('Malikiya', 'المالكية'),
                    ('Jasra', 'جسرة'),
                    ('Tubli', 'توبلي'),
                    ('Sanabis', 'السنابس'),
                    ('Bilad Al Qadeem', 'بلاد القديم'),
                    ('Jidhafs', 'جدحفص'),
                    ('Karzakan', 'كرزكان'),
                    ('Sitra', 'سترة'),
                ]
            },
            {
                'name_en': 'Southern Governorate',
                'name_ar': 'المحافظة الجنوبية',
                'cities': [
                    ('Riffa', 'الرفاع'),
                    ('Isa Town', 'مدينة عيسى'),
                    ('Awali', 'عوالي'),
                    ('Zallaq', 'الزلاق'),
                    ('Askar', 'عسكر'),
                    ('Jaw', 'جو'),
                    ('Salman City', 'مدينة سلمان'),
                    ('East Riffa', 'الرفاع الشرقي'),
                    ('West Riffa', 'الرفاع الغربي'),
                    ('Hamalah', 'حمالة'),
                ]
            },
        ]

        for gov_data in locations:
            gov, created = Governorate.objects.get_or_create(
                name_en=gov_data['name_en'],
                defaults={'name_ar': gov_data['name_ar']}
            )
            if created:
                self.stdout.write(f'  Created governorate: {gov.name_en}')
            for city_en, city_ar in gov_data['cities']:
                City.objects.get_or_create(
                    name_en=city_en,
                    governorate=gov,
                    defaults={'name_ar': city_ar}
                )
        self.stdout.write('  ✅ Locations seeded.')

    def seed_categories(self):
        categories = [
            {
                'name_en': 'Residential',
                'name_ar': 'سكني',
                'type': 'residential',
                'subcategories': [
                    ('Apartment', 'شقة'),
                    ('Villa', 'فيلا'),
                    ('House', 'منزل'),
                    ('Building', 'عمارة'),
                    ('Studio', 'استوديو'),
                    ('Duplex', 'دوبلكس'),
                    ('Penthouse', 'بنتهاوس'),
                ]
            },
            {
                'name_en': 'Land',
                'name_ar': 'أرض',
                'type': 'land',
                'subcategories': [
                    ('Residential Land', 'أرض سكنية'),
                    ('Commercial Land', 'أرض تجارية'),
                    ('Industrial Land', 'أرض صناعية'),
                    ('Agricultural Land', 'أرض زراعية'),
                ]
            },
            {
                'name_en': 'Commercial',
                'name_ar': 'تجاري',
                'type': 'commercial',
                'subcategories': [
                    ('Shop', 'محل تجاري'),
                    ('Office', 'مكتب'),
                    ('Warehouse', 'مستودع'),
                    ('Showroom', 'معرض'),
                    ('Restaurant Space', 'مطعم'),
                    ('Commercial Building', 'مبنى تجاري'),
                ]
            },
        ]

        for cat_data in categories:
            parent, created = Category.objects.get_or_create(
                name_en=cat_data['name_en'],
                defaults={
                    'name_ar': cat_data['name_ar'],
                    'type': cat_data['type'],
                    'parent': None
                }
            )
            if created:
                self.stdout.write(f'  Created category: {parent.name_en}')
            for sub_en, sub_ar in cat_data['subcategories']:
                Category.objects.get_or_create(
                    name_en=sub_en,
                    parent=parent,
                    defaults={
                        'name_ar': sub_ar,
                        'type': cat_data['type']
                    }
                )
        self.stdout.write('  ✅ Categories seeded.')
