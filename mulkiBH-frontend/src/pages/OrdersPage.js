/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getMyOrders, closeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const OrdersPage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchFn = user.role === 'visitor' ? getMyOrders : getOrders;
    fetchFn().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const handleClose = async (id) => {
    await closeOrder(id);
    setOrders(orders.map(o => o.id === id ? {...o, status: 'closed'} : o));
  };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '900px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a3c5e', margin: 0 }}>{user?.role === 'visitor' ? t('myOrders') : t('openOrders')}</h2>
        {user?.role === 'visitor' && (
          <button onClick={() => navigate('/orders/create')} style={{ background: '#1a3c5e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>+ {t('postOrder')}</button>
        )}
      </div>

      {loading ? <p>{t('loading')}</p> : orders.length === 0 ? <p style={{ color: '#666' }}>{t('noOrders')}</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#1a3c5e' }}>#{order.id}</span>
                    <span style={{ background: order.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4', color: order.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '2px 8px', borderRadius: '4px', fontSize: '13px' }}>
                      {order.listing_type === 'rent' ? t('rent') : t('buy')}
                    </span>
                    <span style={{ background: order.status === 'open' ? '#f0fff4' : '#fff5f5', color: order.status === 'open' ? '#276749' : '#e53e3e', padding: '2px 8px', borderRadius: '4px', fontSize: '13px' }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px', color: '#4a5568' }}>📍 {order.city_name || ''} {order.governorate_name}</p>
                  {order.price_min && <p style={{ margin: '0', color: '#4a5568' }}>💰 {order.price_min} - {order.price_max} {t('bd')}</p>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => navigate(`/orders/${order.id}`)} style={{ background: '#1a3c5e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>{t('viewDetails')}</button>
                  {user?.role === 'visitor' && order.status === 'open' && (
                    <button onClick={() => handleClose(order.id)} style={{ background: 'white', color: '#e53e3e', border: '1px solid #e53e3e', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>{t('closeOrder')}</button>
                  )}
                </div>
              </div>
              <p style={{ margin: '8px 0 0', color: '#718096', fontSize: '13px' }}>💬 {order.responses_count} {t('responses')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
