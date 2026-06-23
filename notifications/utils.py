from users.models import User
from .models import Notification


def send_notification_to_owners(order):
    """
    When a customer places an order, notify all owners and agencies.
    """
    owners = User.objects.filter(role__in=['owner', 'agency'], is_active=True)

    title_en = f"New Property Order #{order.id}"
    title_ar = f"طلب عقار جديد #{order.id}"
    message_en = (
        f"A customer is looking for a {order.get_listing_type_display()} property. "
        f"Price range: {order.price_min} - {order.price_max} BD. "
        f"Contact: {order.phone}"
    )
    message_ar = (
        f"عميل يبحث عن عقار للـ{order.get_listing_type_display()}. "
        f"نطاق السعر: {order.price_min} - {order.price_max} دينار. "
        f"التواصل: {order.phone}"
    )

    notifications = [
        Notification(
            user=owner,
            type='order',
            channel='dashboard',
            title_en=title_en,
            title_ar=title_ar,
            message_en=message_en,
            message_ar=message_ar,
        )
        for owner in owners
    ]
    Notification.objects.bulk_create(notifications)


def send_notification(user, type, title_en, title_ar, message_en, message_ar, channel='dashboard'):
    """
    Send a single notification to a specific user.
    """
    Notification.objects.create(
        user=user,
        type=type,
        channel=channel,
        title_en=title_en,
        title_ar=title_ar,
        message_en=message_en,
        message_ar=message_ar,
    )
