/* eslint-disable */
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
    const chargeId = searchParams.get('tap_id');
    if (chargeId) verifyPayment(chargeId);
  }, []);

  const verifyPayment = async (chargeId) => {
    setVerifying(true);
    try {
      const res = await API.post('/subscriptions/verify/', { charge_id: chargeId });
      setMessage(res.data.message);
      getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {});
    } catch (err) {
      setError(err.response?.data?.error || 'Payment verification failed.');
    } finally { setVerifying(false); }
  };

  const handleSubscribe = async (plan) => {
    if (plan.price_bd == 0) {
      setLoading(true);
      try {
        await API.post('/subscriptions/pay/', { plan_id: plan.id });
        setMessage(isRTL ? 'تم تفعيل الخطة المجانية!' : 'Free plan activated!');
        getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {});
      } catch (err) {
        setError(err.response?.data?.error || 'Failed.');
      } finally { setLoading(false); }
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/subscriptions/pay/', { plan_id: plan.id });
      if (res.data.payment_url) window.location.href = res.data.payment_url;
    } catch (err) {
      setError(err.response?.data?.error || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  const planConfig = {
    free: { color: '#718096', bg: 'white', icon: '🆓', popular: false },
    silver: { color: '#a0aec0', bg: 'white', icon: '🥈', popular: false },
    gold: { color: '#c8a951', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', icon: '🥇', popular: true },
  };

  if (verifying) return (
    <div style={{ textAlign: 'center', padding: '80px 20px', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
      <h3 style={{ color: '#1a3c5e' }}>{isRTL ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}</h3>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', background: '#f8f9fa', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a3c5e, #2d6a9f)', padding: '40px 20px', textAlign: 'center', color: 'white' }}>
        <h2 className="fade-in-up" style={{ fontSize: 'clamp(20px, 4vw, 28px)', marginBottom: '8px' }}>{t('subscriptions')}</h2>
        <p className="fade-in-up delay-1" style={{ opacity: 0.8, fontSize: '15px', margin: 0 }}>
          {isRTL ? 'اختر الخطة المناسبة لك' : 'Choose the plan that works for you'}
        </p>
        {current?.plan_name && (
          <div className="fade-in-up delay-2" style={{ marginTop: '16px', background: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>
            {isRTL ? `خطتك الحالية: ${current.plan_name}` : `Current plan: ${current.plan_name}`}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        {message && (
          <div className="fade-in" style={{ background: '#f0fff4', color: '#276749', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #c6f6d5', textAlign: 'center', fontWeight: '600' }}>
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="fade-in" style={{ background: '#fff5f5', color: '#e53e3e', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #fed7d7', textAlign: 'center' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {plans.map((plan, i) => {
            const config = planConfig[plan.name] || planConfig.free;
            const isCurrent = current?.plan_name === plan.name;
            return (
              <div key={plan.id} className={`fade-in-up delay-${i+1}`} style={{
                background: config.bg, borderRadius: '16px', padding: '28px 22px',
                textAlign: 'center', position: 'relative', overflow: 'hidden',
                boxShadow: isCurrent ? `0 0 0 3px ${config.color}` : '0 4px 16px rgba(0,0,0,0.08)',
                border: `2px solid ${isCurrent ? config.color : '#e2e8f0'}`,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}>
                {config.popular && !isCurrent && (
                  <div style={{ position: 'absolute', top: '12px', right: isRTL ? 'auto' : '12px', left: isRTL ? '12px' : 'auto', background: '#c8a951', color: 'white', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>
                    {isRTL ? 'الأكثر شيوعاً' : 'Most Popular'}
                  </div>
                )}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: '12px', right: isRTL ? 'auto' : '12px', left: isRTL ? '12px' : 'auto', background: config.color, color: 'white', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>
                    ✓ {isRTL ? 'خطتك' : 'Current'}
                  </div>
                )}

                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{config.icon}</div>
                <h3 style={{ color: config.color, margin: '0 0 6px', fontSize: '20px', textTransform: 'capitalize' }}>{t(plan.name)}</h3>
                <p style={{ fontSize: '34px', fontWeight: 'bold', color: '#1a3c5e', margin: '0 0 4px' }}>
                  {plan.price_bd == 0 ? (isRTL ? 'مجاني' : 'Free') : `${plan.price_bd} ${t('bd')}`}
                </p>
                {plan.price_bd > 0 && <p style={{ color: '#718096', margin: '0 0 20px', fontSize: '13px' }}>{t('perMonth')}</p>}
                {plan.price_bd == 0 && <div style={{ marginBottom: '20px' }} />}

                <div style={{ marginBottom: '22px', textAlign: isRTL ? 'right' : 'left' }}>
                  {[
                    `${plan.listings_limit === 0 ? '∞' : plan.listings_limit} ${t('listingsLimit')}`,
                    `${plan.orders_limit === 0 ? '∞' : plan.orders_limit} ${t('ordersLimit')}`,
                  ].map((feat, j) => (
                    <p key={j} style={{ color: '#4a5568', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ color: config.color, fontWeight: '700' }}>✓</span> {feat}
                    </p>
                  ))}
                </div>

                <button onClick={() => handleSubscribe(plan)} disabled={loading || isCurrent} style={{
                  width: '100%', padding: '12px',
                  background: isCurrent ? '#e2e8f0' : config.color,
                  color: isCurrent ? '#718096' : 'white',
                  border: 'none', borderRadius: '8px',
                  cursor: isCurrent ? 'default' : 'pointer',
                  fontWeight: '700', fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}>
                  {isCurrent ? (isRTL ? '✓ خطتك الحالية' : '✓ Current Plan') : loading ? '...' : plan.price_bd == 0 ? (isRTL ? 'تفعيل' : 'Activate') : (isRTL ? 'اشترك الآن' : 'Subscribe Now')}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '28px', background: 'white', padding: '16px 20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ color: '#718096', fontSize: '13px', margin: 0 }}>
            🔒 {isRTL ? 'المدفوعات محمية عبر Tap Payments — Visa, Mastercard, KNET, Benefit Pay' : 'Payments secured by Tap Payments — Visa, Mastercard, KNET, Benefit Pay'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
