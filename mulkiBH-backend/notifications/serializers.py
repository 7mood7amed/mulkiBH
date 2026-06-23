from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'channel', 'title_en', 'title_ar',
                  'message_en', 'message_ar', 'is_read', 'created_at']
