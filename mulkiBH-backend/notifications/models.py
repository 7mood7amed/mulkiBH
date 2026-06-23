from django.db import models
from users.models import User


class Notification(models.Model):
    TYPE_CHOICES = [
        ('order', 'New Order'),
        ('response', 'Order Response'),
        ('subscription', 'Subscription'),
        ('system', 'System'),
    ]
    CHANNEL_CHOICES = [
        ('dashboard', 'Dashboard'),
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='dashboard')
    title_en = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255)
    message_en = models.TextField()
    message_ar = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} notification for {self.user.full_name}"

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
