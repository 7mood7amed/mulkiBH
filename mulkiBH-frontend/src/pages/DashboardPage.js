/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { getUnreadCount } from '../api/notifications';
import { getCurrentSubscription } from '../api/subscriptions';

const DashboardPage = () => {
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

  const cards = user.role === 'visitor' ? [
    { icon: '📋', label: lang === 'ar' ? 'طلباتي' : 'My Orders', path: '/orders', iconBg: '#dbeafe', desc: lang === 'ar' ? 'طلباتك العقارية' : 'Your property requests' },
    { icon: '🔔', label: lang === 'ar' ? 'الإشعارات' : 'Notifications', path: '/notifications', iconBg: '#fee2e2', desc: `${unread} ${lang === 'ar' ? 'غير مقروء' : 'unread'}`, badge: unread },
    { icon: '👤', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile', path: '/profile', iconBg: '#dcfce7', desc: lang === 'ar' ? 'إعدادات حسابك' : 'Account settings' },
  ] : [
    { icon: '🏠', label: lang === 'ar' ? 'عقاراتي' : 'My Properties', path: '/my-properties', iconBg: '#dbeafe', desc: lang === 'ar' ? 'إدارة إعلاناتك' : 'Manage your listings' },
    { icon: '📋', label: lang === 'ar' ? 'الطلبات' : 'Open Orders', path: '/orders', iconBg: '#fef9c3', desc: lang === 'ar' ? 'طلبات العملاء' : 'Customer requests' },
    { icon: '🔔', label: lang === 'ar' ? 'الإشعارات' : 'Notifications', path: '/notifications', iconBg: '#fee2e2', desc: `${unread} ${lang === 'ar' ? 'غير مقروء' : 'unread'}`, badge: unread },
    { icon: '💳', label: lang === 'ar' ? 'الاشتراك' : 'Subscription', path: '/subscriptions', iconBg: '#ede9fe', desc: subscription?.plan_name || (lang === 'ar' ? 'ترقية خطتك' : 'Upgrade plan') },
    { icon: '👤', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile', path: '/profile', iconBg: '#dcfce7', desc: lang === 'ar' ? 'إعدادات حسابك' : 'Account settings' },
  ];

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>
      {/* Header */}
      <div style={{ background: isDark ? '#0a1929' : '#0f2640', padding: '36px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid rgba(200,169,81,0.1)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'linear-gradient(135deg, #c8a951, #ddc06b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '800', color: '#0f2640', flexShrink: 0 }}>
            {user.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="heading-display" style={{ margin: '0 0 6px', fontSize: 'clamp(18px, 3vw, 26px)', color: 'white' }}>
              {lang === 'ar' ? `مرحباً، ${user.full_name} 👋` : `Welcome back, ${user.full_name} 👋`}
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(200,169,81,0.15)', border: '1px solid rgba(200,169,81,0.3)', color: '#c8a951', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{user.role}</span>
              {subscription?.plan_name && <span style={{ background: 'rgba(200,169,81,0.2)', color: '#ddc06b', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>⭐ {subscription.plan_name}</span>}
              {user.is_verified && <span style={{ background: 'rgba(72,187,120,0.15)', color: '#68d391', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>✓ {lang === 'ar' ? 'موثق' : 'Verified'}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <p style={{ color: subtext, fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
          {lang === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {cards.map((card, i) => (
            <div key={i} onClick={() => navigate(card.path)} className={`feature-card fade-in-up delay-${i+1}`} style={{
              background: isDark ? '#0a1929' : 'white', padding: '20px', borderRadius: '14px',
              cursor: 'pointer', border: `1px solid ${border}`,
              boxShadow: isDark ? 'none' : 'var(--shadow-sm)', position: 'relative',
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                {card.icon}
              </div>
              {card.badge > 0 && (
                <span style={{ position: 'absolute', top: '14px', right: '14px', background: '#e53e3e', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{card.badge}</span>
              )}
              <h4 style={{ margin: '0 0 4px', color: heading, fontSize: '14px', fontWeight: '700' }}>{card.label}</h4>
              <p style={{ margin: 0, color: subtext, fontSize: '12px' }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {user.role !== 'visitor' && (
          <div style={{ marginTop: '20px', background: isDark ? '#0a1929' : 'white', borderRadius: '14px', padding: '20px 24px', border: `1px solid rgba(200,169,81,0.2)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', boxShadow: isDark ? 'none' : '0 0 0 1px rgba(200,169,81,0.08), var(--shadow-sm)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8a951' }} />
                <h4 style={{ margin: 0, color: heading, fontSize: '15px', fontWeight: '700' }}>{lang === 'ar' ? 'أضف عقاراً جديداً' : 'Add a New Property'}</h4>
              </div>
              <p style={{ margin: 0, color: subtext, fontSize: '13px' }}>{lang === 'ar' ? 'انشر عقارك وابدأ في استقبال العملاء' : 'Post your listing and start receiving inquiries'}</p>
            </div>
            <button onClick={() => navigate('/properties/create')} className="btn-gold" style={{ padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
              + {lang === 'ar' ? 'إضافة عقار' : 'Add Property'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
