import React, { useEffect, useState } from 'react';
import { getNotifications, markRead, markAllRead } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

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

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a3c5e', margin: 0 }}>{t('notifications')}</h2>
        <button onClick={handleMarkAll} style={{ background: 'none', border: '1px solid #1a3c5e', color: '#1a3c5e', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>{t('markAllRead')}</button>
      </div>

      {loading ? <p>{t('loading')}</p> : notifications.length === 0 ? <p style={{ color: '#666' }}>{t('noNotifications')}</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(n => (
            <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)} style={{
              background: n.is_read ? 'white' : '#ebf8ff', padding: '16px', borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: n.is_read ? 'default' : 'pointer',
              borderLeft: n.is_read ? 'none' : '4px solid #2b6cb0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 6px', color: '#1a3c5e' }}>{lang === 'ar' ? n.title_ar : n.title_en}</h4>
                {!n.is_read && <span style={{ background: '#2b6cb0', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>New</span>}
              </div>
              <p style={{ margin: '0 0 8px', color: '#4a5568', fontSize: '14px' }}>{lang === 'ar' ? n.message_ar : n.message_en}</p>
              <span style={{ color: '#a0aec0', fontSize: '12px' }}>{new Date(n.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
