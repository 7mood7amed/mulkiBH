import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from properties.models import Category, Governorate, City, Property

User = get_user_model()

RESIDENTIAL_TITLES = [
    ("Spacious {n}BR Apartment in {city}", "شقة واسعة {n} غرف في {city}"),
    ("Luxury {n}BR Villa in {city}", "فيلا فاخرة {n} غرف في {city}"),
    ("Modern Studio in {city}", "استوديو حديث في {city}"),
    ("Cozy {n}BR Flat in {city}", "شقة مريحة {n} غرف في {city}"),
    ("Sea View Penthouse in {city}", "بنتهاوس بإطلالة بحرية في {city}"),
]
COMMERCIAL_TITLES = [
    ("Commercial Shop in {city}", "محل تجاري في {city}"),
    ("Office Space in {city}", "مساحة مكتبية في {city}"),
    ("Retail Unit in {city}", "وحدة تجزئة في {city}"),
    ("Warehouse in {city}", "مستودع في {city}"),
]
LAND_TITLES = [
    ("Residential Land in {city}", "أرض سكنية في {city}"),
    ("Commercial Land in {city}", "أرض تجارية في {city}"),
    ("Investment Land Plot in {city}", "قطعة أرض استثمارية في {city}"),
]

DESCRIPTIONS_EN = [
    "A beautiful property in a prime location with modern finishes and great amenities nearby.",
    "This property offers excellent value with easy access to main roads, shops, and schools.",
    "Recently renovated with high-quality fittings throughout, ready for immediate occupancy.",
    "Located in a quiet, family-friendly neighborhood close to all essential services.",
    "An exceptional opportunity in one of Bahrain's most sought-after areas.",
]
DESCRIPTIONS_AR = [
    "عقار جميل في موقع متميز بتشطيبات حديثة وقريب من الخدمات المهمة.",
    "يوفر هذا العقار قيمة ممتازة مع سهولة الوصول إلى الطرق الرئيسية والمحلات والمدارس.",
    "تم تجديده مؤخراً بتجهيزات عالية الجودة، جاهز للسكن الفوري.",
    "يقع في منطقة هادئة ومناسبة للعائلات وقريبة من جميع الخدمات الأساسية.",
    "فرصة استثنائية في واحدة من أكثر المناطق طلباً في البحرين.",
]


class Command(BaseCommand):
    help = "Generate randomized test properties for QA testing"

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=40, help='Number of properties to generate')

    def handle(self, *args, **options):
        count = options['count']

        # Get or create a test owner
        owner, created = User.objects.get_or_create(
            email='testowner@mulkibh.com',
            defaults={
                'full_name': 'Test Owner',
                'role': 'owner',
                'phone': '+973 3300 0000',
                'whatsapp': '+973 3300 0000',
                'is_verified': True,
            }
        )
        if created:
            owner.set_password('TestPass123!')
            owner.save()
            self.stdout.write(self.style.SUCCESS(f'Created test owner: {owner.email}'))

        governorates = list(Governorate.objects.all())
        cities = list(City.objects.all())
        residential_cats = list(Category.objects.filter(type='residential'))
        land_cats = list(Category.objects.filter(type='land'))
        commercial_cats = list(Category.objects.filter(type='commercial'))

        if not governorates or not cities:
            self.stdout.write(self.style.ERROR('No governorates/cities found. Run seed_data first.'))
            return
        if not (residential_cats or land_cats or commercial_cats):
            self.stdout.write(self.style.ERROR('No categories found. Run seed_data first.'))
            return

        created_count = 0
        for i in range(count):
            city = random.choice(cities)
            governorate = city.governorate
            listing_type = random.choice(['rent', 'sale'])

            # Pick a category type and matching title pool
            cat_type = random.choice(['residential', 'commercial', 'land'])
            if cat_type == 'residential' and residential_cats:
                category = random.choice(residential_cats)
                title_pool = RESIDENTIAL_TITLES
                bedrooms = random.choice([1, 2, 3, 4, 5])
                bathrooms = max(1, bedrooms - random.choice([0, 1]))
                area = Decimal(random.randint(45, 600))
                floors = None
            elif cat_type == 'commercial' and commercial_cats:
                category = random.choice(commercial_cats)
                title_pool = COMMERCIAL_TITLES
                bedrooms = None
                bathrooms = random.choice([None, 1, 2])
                area = Decimal(random.randint(60, 800))
                floors = None
            elif land_cats:
                category = random.choice(land_cats)
                title_pool = LAND_TITLES
                bedrooms = None
                bathrooms = None
                area = Decimal(random.randint(200, 2000))
                floors = None
            else:
                continue

            title_en_tpl, title_ar_tpl = random.choice(title_pool)
            title_en = title_en_tpl.format(n=bedrooms or '', city=city.name_en).replace('  ', ' ')
            title_ar = title_ar_tpl.format(n=bedrooms or '', city=city.name_ar).replace('  ', ' ')

            # Price logic: rent = monthly BD, sale = full price BD
            if listing_type == 'rent':
                price = Decimal(random.choice([150, 200, 250, 300, 350, 450, 550, 700, 900, 1200]))
            else:
                price = Decimal(random.choice([35000, 45000, 65000, 85000, 120000, 150000, 185000, 250000, 350000, 500000]))

            desc_idx = random.randint(0, len(DESCRIPTIONS_EN) - 1)

            Property.objects.create(
                owner=owner,
                category=category,
                governorate=governorate,
                city=city,
                title_en=title_en,
                title_ar=title_ar,
                description_en=DESCRIPTIONS_EN[desc_idx],
                description_ar=DESCRIPTIONS_AR[desc_idx],
                listing_type=listing_type,
                price=price,
                area_sqm=area,
                bedrooms=bedrooms,
                bathrooms=bathrooms,
                floors=floors,
                status='available',
                is_featured=random.random() < 0.15,
                views_count=random.randint(0, 500),
            )
            created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} test properties!'))
        self.stdout.write(self.style.SUCCESS(f'Test owner login: testowner@mulkibh.com / TestPass123!'))