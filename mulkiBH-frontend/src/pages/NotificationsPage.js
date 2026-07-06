/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markRead, markAllRead } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useT } from '../hooks/useTranslation';
import PageHeader from '../components/common/PageHeader';

const typeConfig = {
  order:        { icon: '📋', color: '#3d82bc' },
  response:     { icon: '💬', color: '#48bb78' },
  subscription: { icon: '💳', color: '#9f7aea' },
  system:       { icon: '⚙️', color: '#718096' },
};

const NotificationsPage = () => {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const { bg, surface, border, subtext, heading, isDark } = useThemeColors();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getNotifications().then(r => { setNotifications(r.data); setLoading(false); });
  }, []);

  const handleMarkRead = async (id) => { await markRead(id); setNotifications(notifications.map(n => n.id === id ? {...n, is_read: true} : n)); };
  const handleMarkAll = async () => { await markAllRead(); setNotifications(notifications.map(n => ({...n, is_read: true}))); };
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>
      <PageHeader
        title={lang === 'ar' ? 'الإشعارات' : 'Notifications'}
        subtitle={unreadCount > 0 ? `${unreadCount} ${lang === 'ar' ? 'غير مقروء' : 'unread'}` : ''}
        action={unreadCount > 0 && (
          <button onClick={handleMarkAll} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit' }}>
            ✓ {lang === 'ar' ? 'تحديد الكل مقروء' : 'Mark all read'}
          </button>
        )}
      />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: surface, borderRadius: '12px', padding: '16px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
                <div className="skeleton" style={{ height: '14px', width: '50%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '12px', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: surface, borderRadius: '16px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🔔</div>
            <h3 style={{ color: heading, fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>{lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</h3>
            <p style={{ color: subtext, fontSize: '14px' }}>{t('noNotifications')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((n, i) => {
              const config = typeConfig[n.type] || typeConfig.system;
              return (
                <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className={`fade-in-up delay-${Math.min(i+1,5)}`}
                  style={{
                    background: surface, borderRadius: '12px', padding: '16px 18px',
                    border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}`,
                    boxShadow: isDark ? 'none' : 'var(--shadow-sm)',
                    cursor: n.is_read ? 'default' : 'pointer',
                    borderLeft: `4px solid ${n.is_read ? (isDark ? '#1a3c5e' : '#e8edf2') : config.color}`,
                    opacity: n.is_read ? 0.75 : 1,
                    transition: 'opacity 0.2s',
                  }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${config.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                      {config.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, color: heading, fontSize: '14px', fontWeight: '700' }}>{lang === 'ar' ? n.title_ar : n.title_en}</h4>
                        {!n.is_read && <span style={{ background: config.color, color: 'white', fontSize: '9px', padding: '2px 7px', borderRadius: '10px', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: '700' }}>{lang === 'ar' ? 'جديد' : 'NEW'}</span>}
                      </div>
                      <p style={{ margin: '0 0 6px', color: subtext, fontSize: '13px', lineHeight: '1.5' }}>{lang === 'ar' ? n.message_ar : n.message_en}</p>
                      <span style={{ color: subtext, fontSize: '11px' }}>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
