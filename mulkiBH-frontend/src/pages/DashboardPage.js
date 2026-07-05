/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { getUnreadCount } from '../api/notifications';
import { getCurrentSubscription } from '../api/subscriptions';

const DashboardPage = () => {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const { bg, surface, text, subtext, heading, border, isDark } = useThemeColors();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getUnreadCount().then(r => setUnread(r.data.unread_count)).catch(() => {});
    if (user.role !== 'visitor') getCurrentSubscription().then(r => setSubscription(r.data)).catch(() => {});
  }, []);

  if (!user) return null;

  const allCards = {
    visitor: [
      { icon: '📋', label: t('myOrders'), path: '/orders', iconBg: '#bee3f8', desc: lang === 'ar' ? 'طلباتك العقارية' : 'Your property requests' },
      { icon: '🔔', label: t('notifications'), path: '/notifications', iconBg: '#fed7d7', desc: `${unread} ${lang === 'ar' ? 'غير مقروء' : 'unread'}`, badge: unread },
      { icon: '👤', label: t('myAccount'), path: '/profile', iconBg: '#c6f6d5', desc: lang === 'ar' ? 'إعدادات حسابك' : 'Account settings' },
    ],
    owner: [
      { icon: '🏠', label: lang === 'ar' ? 'عقاراتي' : 'My Properties', path: '/my-properties', iconBg: '#bee3f8', desc: lang === 'ar' ? 'إدارة إعلاناتك' : 'Manage listings' },
      { icon: '📋', label: t('openOrders'), path: '/orders', iconBg: '#fefcbf', desc: lang === 'ar' ? 'طلبات العملاء' : 'Customer requests' },
      { icon: '🔔', label: t('notifications'), path: '/notifications', iconBg: '#fed7d7', desc: `${unread} ${lang === 'ar' ? 'غير مقروء' : 'unread'}`, badge: unread },
      { icon: '💳', label: t('subscriptions'), path: '/subscriptions', iconBg: '#e9d8fd', desc: subscription?.plan_name || (lang === 'ar' ? 'ترقية خطتك' : 'Upgrade plan') },
      { icon: '👤', label: t('myAccount'), path: '/profile', iconBg: '#c6f6d5', desc: lang === 'ar' ? 'إعدادات حسابك' : 'Account settings' },
    ],
  };

  const cards = allCards[user.role] || allCards.owner;

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a3c5e, #2d6a9f)', padding: '32px 20px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
            {user.profile_image ? <img src={user.profile_image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
          </div>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(18px, 3vw, 24px)' }}>
              {lang === 'ar' ? `مرحباً، ${user.full_name}` : `Welcome back, ${user.full_name}`} 👋
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{user.role}</span>
              {subscription?.plan_name && <span style={{ background: '#c8a951', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>⭐ {subscription.plan_name}</span>}
              {user.is_verified && <span style={{ background: '#48bb78', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>✓ {lang === 'ar' ? 'موثق' : 'Verified'}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px' }}>
        <h3 style={{ color: heading, marginBottom: '20px', fontSize: '16px' }}>{lang === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {cards.map((card, i) => (
            <div key={i} onClick={() => navigate(card.path)} className={`feature-card fade-in-up delay-${i+1}`} style={{
              background: surface, padding: '20px', borderRadius: '12px',
              cursor: 'pointer', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
              border: `1px solid ${border}`, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>
                {card.icon}
              </div>
              {card.badge > 0 && (
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#e53e3e', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{card.badge}</span>
              )}
              <h4 style={{ margin: '0 0 4px', color: heading, fontSize: '14px' }}>{card.label}</h4>
              <p style={{ margin: 0, color: subtext, fontSize: '12px' }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {user.role !== 'visitor' && (
          <div style={{ marginTop: '20px', background: surface, borderRadius: '12px', padding: '18px 20px', border: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', color: heading }}>{lang === 'ar' ? 'أضف عقاراً جديداً' : 'Add a New Property'}</h4>
              <p style={{ margin: 0, color: subtext, fontSize: '13px' }}>{lang === 'ar' ? 'انشر عقارك وابدأ في استقبال العملاء' : 'Post your listing and start receiving inquiries'}</p>
            </div>
            <button onClick={() => navigate('/properties/create')} className="btn-primary" style={{ background: '#1a3c5e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              + {lang === 'ar' ? 'إضافة عقار' : 'Add Property'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
