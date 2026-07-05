/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { getUnreadCount } from '../api/notifications';
import { getCurrentSubscription } from '../api/subscriptions';

const DashboardPage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getUnreadCount().then(r => setUnread(r.data.unread_count)).catch(() => {});
    if (user.role !== 'visitor') {
      getCurrentSubscription().then(r => setSubscription(r.data)).catch(() => {});
    }
  }, []);

  if (!user) return null;

  const visitorCards = [
    { icon: '📋', label: t('myOrders'), path: '/orders', color: '#ebf8ff', iconBg: '#bee3f8', desc: isRTL ? 'طلباتك العقارية' : 'Your property requests' },
    { icon: '🔔', label: t('notifications'), path: '/notifications', color: '#fff5f5', iconBg: '#fed7d7', desc: isRTL ? `${unread} غير مقروء` : `${unread} unread`, badge: unread },
    { icon: '👤', label: t('myAccount'), path: '/profile', color: '#f0fff4', iconBg: '#c6f6d5', desc: isRTL ? 'إعدادات حسابك' : 'Your account settings' },
  ];

  const ownerCards = [
    { icon: '🏠', label: isRTL ? 'عقاراتي' : 'My Properties', path: '/my-properties', color: '#ebf8ff', iconBg: '#bee3f8', desc: isRTL ? 'إدارة إعلاناتك' : 'Manage your listings' },
    { icon: '📋', label: t('openOrders'), path: '/orders', color: '#fffff0', iconBg: '#fefcbf', desc: isRTL ? 'طلبات العملاء' : 'Customer requests' },
    { icon: '🔔', label: t('notifications'), path: '/notifications', color: '#fff5f5', iconBg: '#fed7d7', desc: isRTL ? `${unread} غير مقروء` : `${unread} unread`, badge: unread },
    { icon: '💳', label: t('subscriptions'), path: '/subscriptions', color: '#faf5ff', iconBg: '#e9d8fd', desc: subscription?.plan_name ? `${subscription.plan_name} plan` : isRTL ? 'ترقية خطتك' : 'Upgrade your plan' },
    { icon: '👤', label: t('myAccount'), path: '/profile', color: '#f0fff4', iconBg: '#c6f6d5', desc: isRTL ? 'إعدادات حسابك' : 'Your account settings' },
  ];

  const cards = user.role === 'visitor' ? visitorCards : ownerCards;

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', minHeight: 'calc(100vh - 64px)', background: '#f8f9fa' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3c5e, #2d6a9f)',
        padding: '32px 20px', color: 'white'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>
              {user.profile_image
                ? <img src={user.profile_image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : '👤'}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 'clamp(18px, 3vw, 24px)' }}>
                {isRTL ? `مرحباً، ${user.full_name}` : `Welcome back, ${user.full_name}`} 👋
              </h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
                  {user.role}
                </span>
                {subscription?.plan_name && (
                  <span style={{ background: '#c8a951', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    ⭐ {subscription.plan_name}
                  </span>
                )}
                {user.is_verified && (
                  <span style={{ background: '#48bb78', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    ✓ {isRTL ? 'موثق' : 'Verified'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px' }}>
        <h3 style={{ color: '#1a3c5e', marginBottom: '20px', fontSize: '16px' }}>
          {isRTL ? 'الإجراءات السريعة' : 'Quick Actions'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {cards.map((card, i) => (
            <div key={i} onClick={() => navigate(card.path)}
              className={`feature-card fade-in-up delay-${i+1}`}
              style={{
                background: 'white', padding: '20px', borderRadius: '12px',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                position: 'relative', overflow: 'hidden'
              }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: card.iconBg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '22px', marginBottom: '12px'
              }}>
                {card.icon}
              </div>
              {card.badge > 0 && (
                <span style={{
                  position: 'absolute', top: '12px', right: isRTL ? 'auto' : '12px', left: isRTL ? '12px' : 'auto',
                  background: '#e53e3e', color: 'white', borderRadius: '50%',
                  width: '20px', height: '20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', fontWeight: '700'
                }}>{card.badge}</span>
              )}
              <h4 style={{ margin: '0 0 4px', color: '#1a3c5e', fontSize: '15px' }}>{card.label}</h4>
              <p style={{ margin: 0, color: '#718096', fontSize: '12px' }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick add property button for owners */}
        {user.role !== 'visitor' && (
          <div style={{ marginTop: '24px', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#1a3c5e' }}>{isRTL ? 'أضف عقاراً جديداً' : 'Add a New Property'}</h4>
              <p style={{ margin: 0, color: '#718096', fontSize: '13px' }}>{isRTL ? 'انشر عقارك وابدأ في استقبال العملاء' : 'Post your listing and start receiving inquiries'}</p>
            </div>
            <button onClick={() => navigate('/properties/create')} className="btn-primary" style={{
              background: '#1a3c5e', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
            }}>+ {isRTL ? 'إضافة عقار' : 'Add Property'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
