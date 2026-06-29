import React, { useEffect, useState } from 'react';
import { getPlans, getCurrentSubscription } from '../api/subscriptions';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const SubscriptionsPage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getPlans().then(r => setPlans(r.data));
    getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {});

    // Check if redirected back from Tap payment
    const chargeId = searchParams.get('tap_id');
    if (chargeId) {
      verifyPayment(chargeId);
    }
  }, []);

  const verifyPayment = async (chargeId) => {
    setVerifying(true);
    try {
      const res = await API.post('/subscriptions/verify/', { charge_id: chargeId });
      setMessage(res.data.message);
      getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {});
    } catch (err) {
      setError(err.response?.data?.error || 'Payment verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (plan.price_bd == 0) {
      // Free plan
      setLoading(true);
      try {
        const res = await API.post('/subscriptions/pay/', { plan_id: plan.id });
        setMessage(isRTL ? 'تم تفعيل الخطة المجانية!' : 'Free plan activated!');
        getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {});
      } catch (err) {
        setError(err.response?.data?.error || 'Failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Paid plan — redirect to Tap
    setLoading(true);
    try {
      const res = await API.post('/subscriptions/pay/', { plan_id: plan.id });
      if (res.data.payment_url) {
        // Redirect to Tap payment page
        window.location.href = res.data.payment_url;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  const planColors = { free: '#718096', silver: '#a0aec0', gold: '#c8a951' };
  const planIcons = { free: '🆓', silver: '🥈', gold: '🥇' };

  if (verifying) return (
    <div style={{ textAlign: 'center', padding: '80px', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <h3 style={{ color: '#1a3c5e' }}>{isRTL ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}</h3>
      <p style={{ color: '#718096' }}>{isRTL ? 'يرجى الانتظار' : 'Please wait...'}</p>
    </div>
  );

  // If redirected back from Tap with tap_id but not verifying anymore, show result
  const tapId = searchParams.get('tap_id');
  if (tapId && !verifying && !message && !error) return (
    <div style={{ textAlign: 'center', padding: '80px', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <h3 style={{ color: '#1a3c5e' }}>{isRTL ? 'جاري معالجة الدفع...' : 'Processing payment...'}</h3>
    </div>
  );

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '900px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <h2 style={{ color: '#1a3c5e', marginBottom: '8px', textAlign: 'center' }}>{t('subscriptions')}</h2>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '32px' }}>
        {isRTL ? 'اختر الخطة المناسبة لك لنشر عقاراتك واستقبال الطلبات' : 'Choose a plan to post listings and receive orders'}
      </p>

      {/* Current Plan Banner */}
      {current?.plan_name && (
        <div style={{ background: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '10px', padding: '14px 20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#2b6cb0', fontWeight: '600' }}>
            {isRTL ? `خطتك الحالية: ${current.plan_name}` : `Current plan: ${current.plan_name}`}
          </span>
          {current.end_date && (
            <span style={{ color: '#718096', fontSize: '13px' }}>
              {isRTL ? 'تنتهي في: ' : 'Expires: '}{new Date(current.end_date).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Success / Error */}
      {message && (
        <div style={{ background: '#f0fff4', color: '#276749', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #c6f6d5', textAlign: 'center', fontWeight: '600' }}>
          ✅ {message}
        </div>
      )}
      {error && (
        <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #fed7d7', textAlign: 'center' }}>
          ❌ {error}
        </div>
      )}

      {/* Plan Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {plans.map(plan => {
          const isCurrent = current?.plan_name === plan.name;
          return (
            <div key={plan.id} style={{
              background: 'white', borderRadius: '14px', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)', textAlign: 'center',
              boxShadow: isCurrent ? `0 0 0 3px ${planColors[plan.name]}` : '0 4px 16px rgba(0,0,0,0.08)',
              border: `2px solid ${isCurrent ? planColors[plan.name] : '#e2e8f0'}`,
              position: 'relative'
            }}>
              {isCurrent && (
                <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: planColors[plan.name], color: 'white', padding: '3px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                  ✓ {isRTL ? 'خطتك الحالية' : 'Current Plan'}
                </span>
              )}

              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{planIcons[plan.name]}</div>
              <h3 style={{ color: planColors[plan.name], margin: '0 0 8px', fontSize: '22px', textTransform: 'capitalize' }}>{t(plan.name)}</h3>

              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a3c5e', margin: '0 0 4px' }}>
                {plan.price_bd == 0 ? (isRTL ? 'مجاني' : 'Free') : `${plan.price_bd} ${t('bd')}`}
              </p>
              {plan.price_bd > 0 && <p style={{ color: '#718096', margin: '0 0 24px', fontSize: '14px' }}>{t('perMonth')}</p>}
              {plan.price_bd == 0 && <p style={{ color: '#718096', margin: '0 0 24px', fontSize: '14px' }}> </p>}

              <div style={{ marginBottom: '24px', textAlign: isRTL ? 'right' : 'left' }}>
                <p style={{ color: '#4a5568', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: planColors[plan.name] }}>✓</span>
                  {plan.listings_limit === 0 ? t('unlimited') : plan.listings_limit} {t('listingsLimit')}
                </p>
                <p style={{ color: '#4a5568', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: planColors[plan.name] }}>✓</span>
                  {plan.orders_limit === 0 ? t('unlimited') : plan.orders_limit} {t('ordersLimit')}
                </p>
              </div>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading || isCurrent}
                style={{
                  width: '100%', padding: '12px',
                  background: isCurrent ? '#e2e8f0' : planColors[plan.name] || '#1a3c5e',
                  color: isCurrent ? '#718096' : 'white',
                  border: 'none', borderRadius: '8px', cursor: isCurrent ? 'default' : 'pointer',
                  fontWeight: '600', fontSize: '15px'
                }}
              >
                {isCurrent ? (isRTL ? '✓ خطتك الحالية' : '✓ Current Plan') : loading ? t('loading') : plan.price_bd == 0 ? (isRTL ? 'تفعيل' : 'Activate') : (isRTL ? 'اشترك الآن' : 'Subscribe Now')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Info */}
      <div style={{ marginTop: '32px', background: '#f8f9fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
        <p style={{ color: '#718096', fontSize: '13px', margin: 0 }}>
          🔒 {isRTL ? 'المدفوعات محمية ومشفرة عبر Tap Payments — تدعم Visa, Mastercard, KNET, Benefit Pay' : 'Payments secured by Tap Payments — Visa, Mastercard, KNET, Benefit Pay supported'}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
