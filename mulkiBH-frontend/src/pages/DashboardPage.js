import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const DashboardPage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const cards = user.role === 'visitor' ? [
    { icon: '📋', label: t('myOrders'), path: '/orders' },
    { icon: '🔔', label: t('notifications'), path: '/notifications' },
    { icon: '👤', label: t('myAccount'), path: '/profile' },
  ] : [
    { icon: '🏠', label: t('properties'), path: '/my-properties' },
    { icon: '📋', label: t('openOrders'), path: '/orders' },
    { icon: '🔔', label: t('notifications'), path: '/notifications' },
    { icon: '💳', label: t('subscriptions'), path: '/subscriptions' },
    { icon: '👤', label: t('myAccount'), path: '/profile' },
  ];

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '900px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <h2 style={{ color: '#1a3c5e', marginBottom: '8px' }}>{t('dashboard')}</h2>
      <p style={{ color: '#718096', marginBottom: '32px' }}>
        {isRTL ? `مرحباً، ${user.full_name}` : `Welcome, ${user.full_name}`}
        {' · '}
        <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '13px' }}>{user.role}</span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {cards.map((card, i) => (
          <div key={i} onClick={() => navigate(card.path)} style={{
            background: 'white', padding: '28px 20px', borderRadius: '12px',
            textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.2s'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{card.icon}</div>
            <p style={{ margin: 0, fontWeight: '600', color: '#1a3c5e' }}>{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
