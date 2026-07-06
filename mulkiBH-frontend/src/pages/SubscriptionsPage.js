/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { getPlans, getCurrentSubscription } from '../api/subscriptions';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useT } from '../hooks/useTranslation';
import PageHeader from '../components/common/PageHeader';

const planConfig = {
  free:   { icon: '🆓', color: '#718096', gradient: 'linear-gradient(135deg, #f8f9fa, #e2e8f0)' },
  silver: { icon: '🥈', color: '#a0aec0', gradient: 'linear-gradient(135deg, #f7fafc, #edf2f7)' },
  gold:   { icon: '🥇', color: '#c8a951', gradient: 'linear-gradient(135deg, #fffbeb, #fef3c7)', popular: true },
};

const SubscriptionsPage = () => {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const { bg, surface, border, subtext, heading, isDark } = useThemeColors();
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
    } catch (err) { setError(err.response?.data?.error || 'Verification failed.'); }
    setVerifying(false);
  };

  const handleSubscribe = async (plan) => {
    if (plan.price_bd == 0) {
      setLoading(true);
      try { await API.post('/subscriptions/pay/', { plan_id: plan.id }); setMessage(lang === 'ar' ? 'تم تفعيل الخطة المجانية!' : 'Free plan activated!'); getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {}); }
      catch (err) { setError('Failed.'); }
      setLoading(false); return;
    }
    setLoading(true);
    try { const res = await API.post('/subscriptions/pay/', { plan_id: plan.id }); if (res.data.payment_url) window.location.href = res.data.payment_url; }
    catch (err) { setError('Payment failed.'); setLoading(false); }
  };

  if (verifying) return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(200,169,81,0.3)', borderTop: '3px solid #c8a951', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <h3 style={{ color: heading, fontFamily: "'Playfair Display', serif" }}>{lang === 'ar' ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}</h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>
      <PageHeader
        title={lang === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans'}
        subtitle={current?.plan_name ? (lang === 'ar' ? `خطتك الحالية: ${current.plan_name}` : `Current plan: ${current.plan_name}`) : (lang === 'ar' ? 'اختر الخطة المناسبة لك' : 'Choose the plan that works for you')}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {(message || error) && (
          <div className="fade-in" style={{ background: message ? '#f0fff4' : '#fff5f5', color: message ? '#276749' : '#e53e3e', padding: '14px 20px', borderRadius: '12px', marginBottom: '28px', border: `1px solid ${message ? '#c6f6d5' : '#fed7d7'}`, textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
            {message ? `✅ ${message}` : `❌ ${error}`}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {plans.map((plan, i) => {
            const config = planConfig[plan.name] || planConfig.free;
            const isCurrent = current?.plan_name === plan.name;
            return (
              <div key={plan.id} className={`fade-in-up delay-${i+1}`} style={{
                background: isDark ? '#0a1929' : 'white',
                borderRadius: '16px', padding: '28px 24px', textAlign: 'center',
                border: `2px solid ${isCurrent ? config.color : (isDark ? '#1a3c5e' : '#e8edf2')}`,
                boxShadow: isCurrent ? `0 0 0 4px ${config.color}22` : (isDark ? 'none' : 'var(--shadow-sm)'),
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}>
                {/* Gold accent for popular */}
                {config.popular && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #c8a951, #ddc06b)' }} />}

                {config.popular && !isCurrent && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: '#c8a951', color: '#0f2640', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                    {lang === 'ar' ? 'الأشهر' : 'POPULAR'}
                  </div>
                )}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', background: config.color, color: 'white', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px' }}>
                    ✓ {lang === 'ar' ? 'خطتك' : 'CURRENT'}
                  </div>
                )}

                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{config.icon}</div>
                <h3 style={{ color: config.color, margin: '0 0 6px', fontSize: '20px', fontWeight: '800', textTransform: 'capitalize' }}>{plan.name}</h3>
                <div style={{ margin: '0 0 20px' }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', color: isDark ? '#e2e8f0' : '#0f2640' }}>
                    {plan.price_bd == 0 ? (lang === 'ar' ? 'مجاني' : 'Free') : plan.price_bd}
                  </span>
                  {plan.price_bd > 0 && <span style={{ color: subtext, fontSize: '14px' }}> BD/{lang === 'ar' ? 'شهر' : 'mo'}</span>}
                </div>

                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  {[
                    `${plan.listings_limit === 0 ? '∞' : plan.listings_limit} ${lang === 'ar' ? 'إعلان' : 'listings'}`,
                    `${plan.orders_limit === 0 ? '∞' : plan.orders_limit} ${lang === 'ar' ? 'طلب مستلم' : 'orders received'}`,
                  ].map((feat, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: isDark ? '#e2e8f0' : '#2d3748' }}>
                      <span style={{ color: config.color, fontWeight: '700', fontSize: '14px' }}>✓</span> {feat}
                    </div>
                  ))}
                </div>

                <button onClick={() => handleSubscribe(plan)} disabled={loading || isCurrent} style={{
                  width: '100%', padding: '12px',
                  background: isCurrent ? (isDark ? '#1a2535' : '#f0f4f8') : (plan.name === 'gold' ? 'linear-gradient(135deg, #c8a951, #ddc06b)' : config.color),
                  color: isCurrent ? subtext : (plan.name === 'gold' ? '#0f2640' : 'white'),
                  border: 'none', borderRadius: '10px',
                  cursor: isCurrent ? 'default' : 'pointer',
                  fontWeight: '700', fontSize: '14px', fontFamily: 'inherit',
                  boxShadow: !isCurrent && plan.name === 'gold' ? '0 4px 16px rgba(200,169,81,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {isCurrent ? (lang === 'ar' ? '✓ خطتك الحالية' : '✓ Current Plan') : loading ? '...' : plan.price_bd == 0 ? (lang === 'ar' ? 'تفعيل مجاناً' : 'Get Started Free') : (lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now')}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '28px', background: isDark ? '#0a1929' : 'white', padding: '16px 20px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
          <p style={{ color: subtext, fontSize: '13px', margin: 0 }}>
            🔒 {lang === 'ar' ? 'مدفوعات آمنة عبر Tap Payments — Visa, Mastercard, KNET, Benefit Pay' : 'Secured by Tap Payments — Visa, Mastercard, KNET, Benefit Pay'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
