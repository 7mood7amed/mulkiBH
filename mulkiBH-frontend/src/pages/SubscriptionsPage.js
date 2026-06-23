import React, { useEffect, useState } from 'react';
import { getPlans, getCurrentSubscription, upgradePlan } from '../api/subscriptions';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const SubscriptionsPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getPlans().then(r => setPlans(r.data));
    getCurrentSubscription().then(r => setCurrent(r.data)).catch(() => {});
  }, []);

  const handleSubscribe = async (planId) => {
    setLoading(true);
    try {
      await upgradePlan({ plan_id: planId });
      getCurrentSubscription().then(r => setCurrent(r.data));
      alert('Subscribed successfully!');
    } catch { alert('Subscription failed.'); }
    setLoading(false);
  };

  const planColors = { free: '#718096', silver: '#a0aec0', gold: '#c8a951' };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <h2 style={{ color: '#1a3c5e', marginBottom: '8px', textAlign: 'center' }}>{t('subscriptions')}</h2>
      {current?.plan_name && (
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: '32px' }}>
          {t('currentPlan')}: <strong style={{ color: '#1a3c5e' }}>{current.plan_name}</strong>
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background: 'white', borderRadius: '14px', padding: '32px 24px', textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: `2px solid ${planColors[plan.name] || '#ddd'}`
          }}>
            <h3 style={{ color: planColors[plan.name], margin: '0 0 8px', fontSize: '22px', textTransform: 'capitalize' }}>{t(plan.name)}</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a3c5e', margin: '0 0 4px' }}>
              {plan.price_bd == 0 ? t('free') : `${plan.price_bd} ${t('bd')}`}
            </p>
            {plan.price_bd > 0 && <p style={{ color: '#718096', margin: '0 0 24px', fontSize: '14px' }}>{t('perMonth')}</p>}

            <div style={{ marginBottom: '24px', textAlign: isRTL ? 'right' : 'left' }}>
              <p style={{ color: '#4a5568', margin: '0 0 8px' }}>✓ {plan.listings_limit === 0 ? t('unlimited') : plan.listings_limit} {t('listingsLimit')}</p>
              <p style={{ color: '#4a5568', margin: '0' }}>✓ {plan.orders_limit === 0 ? t('unlimited') : plan.orders_limit} {t('ordersLimit')}</p>
            </div>

            <button onClick={() => handleSubscribe(plan.id)} disabled={loading || current?.plan_name === plan.name} style={{
              width: '100%', padding: '12px', background: current?.plan_name === plan.name ? '#e2e8f0' : planColors[plan.name] || '#1a3c5e',
              color: current?.plan_name === plan.name ? '#718096' : 'white',
              border: 'none', borderRadius: '8px', cursor: current?.plan_name === plan.name ? 'default' : 'pointer',
              fontWeight: '600', fontSize: '15px'
            }}>
              {current?.plan_name === plan.name ? '✓ Current' : t('subscribe')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
