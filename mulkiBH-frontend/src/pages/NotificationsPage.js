/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markRead, markAllRead } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const typeConfig = {
  order: { icon: 'assignment', color: '#2d6a9f' },
  response: { icon: 'forum', color: '#2e7d32' },
  subscription: { icon: 'workspace_premium', color: '#a37c1a' },
  system: { icon: 'settings', color: '#74777e' },
};

const NotificationsPage = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getNotifications().then(r => { setNotifications(r.data); setLoading(false); });
  }, []);

  const handleMarkRead = async (id) => { await markRead(id); setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n)); };
  const handleMarkAll = async () => { await markAllRead(); setNotifications(notifications.map(n => ({ ...n, is_read: true }))); };
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 className="heading-display" style={{ fontSize: 'clamp(26px,4vw,36px)', color: '#0f2640', marginBottom: '6px' }}>
              {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
            </h1>
            {!loading && <p style={{ color: '#44474d' }}>{unreadCount > 0 ? (lang === 'ar' ? `${unreadCount} غير مقروء` : `${unreadCount} unread`) : (lang === 'ar' ? 'كل شيء محدث' : 'All caught up')}</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAll} style={{ background: 'transparent', border: '1px solid #0f2640', color: '#0f2640', padding: '10px 20px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'inherit' }}>
              {lang === 'ar' ? 'تعليم الكل كمقروء' : 'Mark All Read'}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: 'white', padding: '20px', border: '1px solid rgba(196,198,206,0.4)' }}>
                <div className="skeleton" style={{ height: '14px', width: '50%', marginBottom: '10px' }} />
                <div className="skeleton" style={{ height: '12px', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '90px 20px', background: 'white', border: '1px solid rgba(196,198,206,0.4)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#c8a951' }}>notifications</span>
            <h3 className="heading-display" style={{ color: '#0f2640', margin: '16px 0 8px', fontSize: '22px' }}>{lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</h3>
            <p style={{ color: '#74777e', fontSize: '14px' }}>{lang === 'ar' ? 'ستظهر إشعاراتك هنا' : "You're all caught up — new alerts will appear here"}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notifications.map((n) => {
              const config = typeConfig[n.type] || typeConfig.system;
              return (
                <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className="fade-in-up"
                  style={{
                    background: 'white', padding: '20px', border: '1px solid rgba(196,198,206,0.4)',
                    boxShadow: '0 1px 3px rgba(15,38,64,0.06)', cursor: n.is_read ? 'default' : 'pointer',
                    borderLeft: `4px solid ${n.is_read ? 'rgba(196,198,206,0.4)' : config.color}`,
                    opacity: n.is_read ? 0.7 : 1, transition: 'opacity 0.2s',
                  }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', background: `${config.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ color: config.color, fontSize: '22px' }}>{config.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                        <h4 className="heading-display" style={{ margin: 0, color: '#0f2640', fontSize: '16px' }}>{lang === 'ar' ? (n.title_ar || n.title) : (n.title_en || n.title)}</h4>
                        {!n.is_read && <span style={{ background: '#c8a951', color: '#0f2640', fontSize: '9px', padding: '3px 8px', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: '700', textTransform: 'uppercase' }}>{lang === 'ar' ? 'جديد' : 'New'}</span>}
                      </div>
                      <p style={{ margin: '0 0 8px', color: '#44474d', fontSize: '14px', lineHeight: '1.6' }}>{lang === 'ar' ? (n.message_ar || n.message) : (n.message_en || n.message)}</p>
                      <span style={{ color: '#74777e', fontSize: '11px' }}>{new Date(n.created_at).toLocaleString()}</span>
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
