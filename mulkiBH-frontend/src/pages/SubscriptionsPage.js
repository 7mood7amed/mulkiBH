/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { getPlans, getCurrentSubscription } from '../api/subscriptions';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const planConfig = {
  free: { icon: 'star_outline', popular: false },
  silver: { icon: 'star_half', popular: false },
  gold: { icon: 'workspace_premium', popular: true },
};

const SubscriptionsPage = () => {
  const { lang } = useLang();
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
    } catch (err) { setError(err.response?.data?.error || 'Verification failed.'); }
    setVerifying(false);
  };

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      const res = await API.post('/subscriptions/pay/', { plan_id: plan.id });
      if (res.data.payment_url) window.location.href = res.data.payment_url;
      else { setMessage(lang === 'ar' ? 'تم تفعيل الخطة!' : 'Plan activated!'); getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {}); }
    } catch (err) { setError('Payment failed.'); }
    setLoading(false);
  };

  if (verifying) return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(200,169,81,0.3)', borderTop: '3px solid #c8a951', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <h3 className="heading-display" style={{ color: '#0f2640' }}>{lang === 'ar' ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}</h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="heading-display" style={{ fontSize: 'clamp(26px,4vw,38px)', color: '#0f2640', marginBottom: '10px' }}>
            {lang === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans'}
          </h1>
          <p style={{ color: '#44474d' }}>{lang === 'ar' ? 'اختر الخطة التي تناسب أعمالك العقارية' : 'Choose the plan that fits your real estate business'}</p>
        </div>

        {(message || error) && (
          <div className="fade-in" style={{ background: message ? 'rgba(46,125,50,0.08)' : 'rgba(186,26,26,0.08)', color: message ? '#2e7d32' : '#ba1a1a', padding: '14px 20px', marginBottom: '28px', border: `1px solid ${message ? 'rgba(46,125,50,0.25)' : 'rgba(186,26,26,0.25)'}`, textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
            {message || error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {plans.map((plan) => {
            const config = planConfig[plan.name?.toLowerCase()] || planConfig.free;
            const isCurrent = current?.plan_name?.toLowerCase() === plan.name?.toLowerCase();
            return (
              <div key={plan.id} className="fade-in-up" style={{
                background: 'white', padding: '32px 28px', textAlign: 'center', position: 'relative',
                border: `1px solid ${isCurrent ? '#c8a951' : 'rgba(196,198,206,0.4)'}`,
                boxShadow: config.popular ? '0 20px 50px rgba(15,38,64,0.1)' : '0 1px 3px rgba(15,38,64,0.06)',
              }}>
                {config.popular && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#c8a951' }} />}
                {(config.popular || isCurrent) && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: isCurrent ? '#0f2640' : '#c8a951', color: isCurrent ? 'white' : '#0f2640', fontSize: '10px', fontWeight: '800', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isCurrent ? (lang === 'ar' ? 'الحالية' : 'Current') : (lang === 'ar' ? 'الأشهر' : 'Popular')}
                  </div>
                )}

                <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', background: '#0f2640', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c8a951', fontSize: '28px' }}>{config.icon}</span>
                </div>
                <h3 className="heading-display" style={{ color: '#0f2640', fontSize: '20px', marginBottom: '10px', textTransform: 'capitalize' }}>{plan.name}</h3>
                <div style={{ marginBottom: '24px' }}>
                  <span className="heading-display" style={{ fontSize: '38px', color: '#0f2640' }}>
                    {(!plan.price_bd || plan.price_bd == 0) ? (lang === 'ar' ? 'مجاني' : 'Free') : `BHD ${plan.price_bd}`}
                  </span>
                  {plan.price_bd > 0 && <span style={{ color: '#74777e', fontSize: '14px' }}>/{lang === 'ar' ? 'شهر' : 'mo'}</span>}
                </div>

                <div style={{ marginBottom: '28px', textAlign: 'left' }}>
                  {[
                    `${!plan.listings_limit ? '∞' : plan.listings_limit} ${lang === 'ar' ? 'إعلان نشط' : 'active listings'}`,
                    `${!plan.orders_limit ? '∞' : plan.orders_limit} ${lang === 'ar' ? 'طلب مستلم' : 'orders received'}`,
                  ].map((feat, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px', color: '#44474d' }}>
                      <span className="material-symbols-outlined" style={{ color: '#c8a951', fontSize: '18px' }}>check_circle</span>{feat}
                    </div>
                  ))}
                </div>

                <button onClick={() => handleSubscribe(plan)} disabled={loading || isCurrent} style={{
                  width: '100%', padding: '13px',
                  background: isCurrent ? '#f0f4f8' : (config.popular ? '#c8a951' : '#0f2640'),
                  color: isCurrent ? '#74777e' : (config.popular ? '#0f2640' : 'white'),
                  border: 'none', cursor: isCurrent ? 'default' : 'pointer',
                  fontWeight: '700', fontSize: '13px', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}
                  onMouseEnter={e => { if (!isCurrent && !loading) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {isCurrent ? (lang === 'ar' ? 'خطتك الحالية' : 'Current Plan') : loading ? '...' : (!plan.price_bd ? (lang === 'ar' ? 'ابدأ مجاناً' : 'Get Started Free') : (lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now'))}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '32px', background: 'white', padding: '18px 24px', textAlign: 'center', border: '1px solid rgba(196,198,206,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: '#c8a951', fontSize: '18px' }}>lock</span>
          <p style={{ color: '#44474d', fontSize: '13px', margin: 0 }}>
            {lang === 'ar' ? 'مدفوعات آمنة عبر Tap Payments — Visa, Mastercard, KNET, Benefit Pay' : 'Secured by Tap Payments — Visa, Mastercard, KNET, Benefit Pay'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
