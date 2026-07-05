/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { getNotifications, markRead, markAllRead } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const typeIcons = { order: '📋', response: '💬', subscription: '💳', system: '⚙️' };
const typeColors = { order: '#ebf8ff', response: '#f0fff4', subscription: '#faf5ff', system: '#f7fafc' };

const NotificationsPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getNotifications().then(r => { setNotifications(r.data); setLoading(false); });
  }, []);

  const handleMarkRead = async (id) => {
    await markRead(id);
    setNotifications(notifications.map(n => n.id === id ? {...n, is_read: true} : n));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifications(notifications.map(n => ({...n, is_read: true})));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{  maxWidth: '700px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#1a3c5e', margin: '0 0 4px', fontSize: 'clamp(18px, 3vw, 24px)' }}>{t('notifications')}</h2>
          {unreadCount > 0 && (
            <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
              {unreadCount} {isRTL ? 'إشعار غير مقروء' : 'unread'}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} style={{
            background: 'white', border: '1px solid #1a3c5e', color: '#1a3c5e',
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
          }}>✓ {t('markAllRead')}</button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '16px' }}>
              <div className="skeleton" style={{ height: '16px', width: '50%', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '13px', width: '80%' }} />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
          <p style={{ color: '#718096' }}>{t('noNotifications')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((n, i) => (
            <div key={n.id}
              onClick={() => !n.is_read && handleMarkRead(n.id)}
              className={`fade-in-up delay-${Math.min(i+1, 5)}`}
              style={{
                background: n.is_read ? 'white' : (typeColors[n.type] || '#ebf8ff'),
                padding: '16px', borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: n.is_read ? 'default' : 'pointer',
                borderLeft: isRTL ? 'none' : (n.is_read ? '4px solid #e2e8f0' : '4px solid #1a3c5e'),
                borderRight: isRTL ? (n.is_read ? '4px solid #e2e8f0' : '4px solid #1a3c5e') : 'none',
                transition: 'transform 0.2s ease'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{typeIcons[n.type] || '🔔'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, color: '#1a3c5e', fontSize: '14px', fontWeight: '700' }}>
                        {lang === 'ar' ? n.title_ar : n.title_en}
                      </h4>
                      {!n.is_read && (
                        <span style={{ background: '#1a3c5e', color: 'white', fontSize: '10px', padding: '2px 7px', borderRadius: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {isRTL ? 'جديد' : 'New'}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 6px', color: '#4a5568', fontSize: '13px', lineHeight: '1.5' }}>
                      {lang === 'ar' ? n.message_ar : n.message_en}
                    </p>
                    <span style={{ color: '#a0aec0', fontSize: '11px' }}>
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
