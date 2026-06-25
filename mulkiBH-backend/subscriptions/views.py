import requests
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
from .models import SubscriptionPlan, Subscription
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer


class PlanListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer


class CurrentSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = Subscription.objects.filter(
            user=request.user, status='active'
        ).order_by('-created_at').first()
        if sub:
            return Response(SubscriptionSerializer(sub).data)
        return Response({'message': 'No active subscription. You are on the free plan.'})


class CreatePaymentView(APIView):
    """
    Step 1: Create a Tap charge and return redirect URL to customer.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')

        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        if plan.price_bd == 0:
            # Free plan — activate directly
            Subscription.objects.filter(user=request.user, status='active').update(status='cancelled')
            Subscription.objects.create(
                user=request.user,
                plan=plan,
                end_date=timezone.now() + timedelta(days=plan.duration_days),
                amount_paid=0
            )
            return Response({'message': 'Free plan activated.', 'redirect': None})

        user = request.user

        # Create charge via Tap Payments API
        payload = {
            "amount": float(plan.price_bd),
            "currency": "BHD",
            "threeDSecure": True,
            "save_card": False,
            "description": f"MulkiBH {plan.name.capitalize()} Subscription",
            "metadata": {
                "user_id": str(user.id),
                "plan_id": str(plan.id),
            },
            "customer": {
                "first_name": user.full_name.split()[0],
                "last_name": " ".join(user.full_name.split()[1:]) or "-",
                "email": user.email,
                "phone": {
                    "country_code": "973",
                    "number": user.phone or "00000000"
                }
            },
            "source": {"id": "src_all"},
            "redirect": {
                "url": f"{settings.FRONTEND_URL}/subscriptions/verify"
            },
            "post": {
                "url": f"{settings.BACKEND_URL}/api/subscriptions/webhook/"
            }
        }

        headers = {
            "Authorization": f"Bearer {settings.TAP_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        try:
            res = requests.post("https://api.tap.company/v2/charges", json=payload, headers=headers)
            data = res.json()

            if data.get('transaction', {}).get('url'):
                return Response({
                    'payment_url': data['transaction']['url'],
                    'charge_id': data['id']
                })
            else:
                return Response({'error': 'Payment initiation failed.', 'detail': data}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyPaymentView(APIView):
    """
    Step 2: After redirect, verify the charge status.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        charge_id = request.data.get('charge_id')
        if not charge_id:
            return Response({'error': 'charge_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        headers = {
            "Authorization": f"Bearer {settings.TAP_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        try:
            res = requests.get(f"https://api.tap.company/v2/charges/{charge_id}", headers=headers)
            data = res.json()

            if data.get('status') == 'CAPTURED':
                metadata = data.get('metadata', {})
                plan_id = metadata.get('plan_id')
                user_id = metadata.get('user_id')

                if str(request.user.id) != str(user_id):
                    return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

                plan = SubscriptionPlan.objects.get(id=plan_id)

                # Cancel existing and create new subscription
                Subscription.objects.filter(user=request.user, status='active').update(status='cancelled')
                sub = Subscription.objects.create(
                    user=request.user,
                    plan=plan,
                    end_date=timezone.now() + timedelta(days=plan.duration_days),
                    payment_reference=charge_id,
                    amount_paid=plan.price_bd
                )
                return Response({
                    'message': f'{plan.name.capitalize()} plan activated successfully!',
                    'subscription': SubscriptionSerializer(sub).data
                })
            else:
                return Response({'error': f'Payment not completed. Status: {data.get("status")}'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WebhookView(APIView):
    """
    Tap Payments webhook — auto-activates subscription on payment.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        if data.get('status') == 'CAPTURED':
            charge_id = data.get('id')
            metadata = data.get('metadata', {})
            plan_id = metadata.get('plan_id')
            user_id = metadata.get('user_id')

            try:
                from users.models import User
                user = User.objects.get(id=user_id)
                plan = SubscriptionPlan.objects.get(id=plan_id)

                if not Subscription.objects.filter(payment_reference=charge_id).exists():
                    Subscription.objects.filter(user=user, status='active').update(status='cancelled')
                    Subscription.objects.create(
                        user=user,
                        plan=plan,
                        end_date=timezone.now() + timedelta(days=plan.duration_days),
                        payment_reference=charge_id,
                        amount_paid=plan.price_bd
                    )
            except Exception:
                pass

        return Response({'status': 'ok'})
