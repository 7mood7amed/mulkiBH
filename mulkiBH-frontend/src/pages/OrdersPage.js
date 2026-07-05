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
  const [closing, setClosing] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchFn = user.role === 'visitor' ? getMyOrders : getOrders;
    fetchFn().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleClose = async (id) => {
    if (!window.confirm(isRTL ? 'هل تريد إغلاق هذا الطلب؟' : 'Close this order?')) return;
    setClosing(id);
    try {
      await closeOrder(id);
      setOrders(orders.map(o => o.id === id ? {...o, status: 'closed'} : o));
    } catch {}
    setClosing(null);
  };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '900px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#1a3c5e', margin: '0 0 4px', fontSize: 'clamp(18px, 3vw, 24px)' }}>
            {user?.role === 'visitor' ? t('myOrders') : t('openOrders')}
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
            {!loading && `${orders.length} ${isRTL ? 'طلب' : 'orders'}`}
          </p>
        </div>
        {user?.role === 'visitor' && (
          <button onClick={() => navigate('/orders/create')} className="btn-primary" style={{
            background: '#1a3c5e', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
          }}>+ {t('postOrder')}</button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px' }}>
              <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '10px' }} />
              <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '14px', width: '30%' }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>{t('noOrders')}</p>
          {user?.role === 'visitor' && (
            <button onClick={() => navigate('/orders/create')} className="btn-primary" style={{
              background: '#1a3c5e', color: 'white', border: 'none',
              padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
            }}>{isRTL ? 'أضف طلبك الأول' : 'Post Your First Order'}</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((order, i) => (
            <div key={order.id} className={`fade-in-up delay-${Math.min(i+1, 5)}`} style={{
              background: 'white', borderRadius: '10px', padding: '18px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderLeft: isRTL ? 'none' : `4px solid ${order.status === 'open' ? '#48bb78' : '#e53e3e'}`,
              borderRight: isRTL ? `4px solid ${order.status === 'open' ? '#48bb78' : '#e53e3e'}` : 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', color: '#1a3c5e', fontSize: '15px' }}>#{order.id}</span>
                    <span style={{
                      background: order.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4',
                      color: order.listing_type === 'rent' ? '#2b6cb0' : '#276749',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                    }}>{order.listing_type === 'rent' ? t('rent') : t('buy')}</span>
                    <span style={{
                      background: order.status === 'open' ? '#f0fff4' : '#fff5f5',
                      color: order.status === 'open' ? '#276749' : '#e53e3e',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                    }}>{order.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#718096' }}>
                    {order.governorate_name && <span>📍 {order.city_name ? `${order.city_name}, ` : ''}{order.governorate_name}</span>}
                    {order.price_min && <span>💰 {order.price_min} - {order.price_max} {t('bd')}</span>}
                    {order.bedrooms && <span>🛏 {order.bedrooms}</span>}
                  </div>
                  <p style={{ margin: '6px 0 0', color: '#a0aec0', fontSize: '12px' }}>
                    💬 {order.responses_count} {t('responses')} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => navigate(`/orders/${order.id}`)} style={{
                    background: '#ebf8ff', color: '#2b6cb0', border: 'none',
                    padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                  }}>{t('viewDetails')}</button>
                  {user?.role === 'visitor' && order.status === 'open' && (
                    <button onClick={() => handleClose(order.id)} disabled={closing === order.id} style={{
                      background: '#fff5f5', color: '#e53e3e', border: 'none',
                      padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                    }}>{closing === order.id ? '...' : t('closeOrder')}</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
