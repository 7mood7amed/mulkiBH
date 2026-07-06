/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getMyOrders, closeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useT } from '../hooks/useTranslation';

const OrdersPage = () => {
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();
  const { bg, surface, border, text, subtext, heading, isDark } = useThemeColors();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fn = user.role === 'visitor' ? getMyOrders : getOrders;
    fn().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleClose = async (id) => {
    if (!window.confirm(lang === 'ar' ? 'هل تريد إغلاق هذا الطلب؟' : 'Close this order?')) return;
    setClosing(id);
    try { await closeOrder(id); setOrders(orders.map(o => o.id === id ? {...o, status: 'closed'} : o)); } catch {}
    setClosing(null);
  };

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>
      

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: surface, borderRadius: '12px', padding: '20px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
                <div className="skeleton" style={{ height: '16px', width: '35%', marginBottom: '10px' }} />
                <div className="skeleton" style={{ height: '13px', width: '55%' }} />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: surface, borderRadius: '16px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ color: heading, marginBottom: '8px', fontFamily: "'Playfair Display', serif" }}>{lang === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</h3>
            <p style={{ color: subtext, marginBottom: '24px', fontSize: '14px' }}>{t('noOrders')}</p>
            {user?.role === 'visitor' && (
              <button onClick={() => navigate('/orders/create')} className="btn-navy" style={{ padding: '11px 24px', borderRadius: '8px', fontSize: '14px' }}>
                {lang === 'ar' ? 'أضف طلبك الأول' : 'Post Your First Order'}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((order, i) => (
              <div key={order.id} className={`fade-in-up delay-${Math.min(i+1,5)}`} style={{
                background: surface, borderRadius: '12px', padding: '18px 20px',
                border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}`,
                boxShadow: isDark ? 'none' : 'var(--shadow-sm)',
                borderLeft: `4px solid ${order.status === 'open' ? '#48bb78' : '#718096'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '700', color: '#c8a951', fontSize: '13px' }}>#{order.id}</span>
                      <span style={{ background: order.listing_type === 'rent' ? (isDark ? '#0a1929' : '#ebf8ff') : (isDark ? '#0a1929' : '#f0fff4'), color: order.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', border: `1px solid ${order.listing_type === 'rent' ? '#bee3f8' : '#c6f6d5'}` }}>
                        {order.listing_type === 'rent' ? (lang === 'ar' ? 'إيجار' : 'RENT') : (lang === 'ar' ? 'شراء' : 'BUY')}
                      </span>
                      <span style={{ background: order.status === 'open' ? 'rgba(72,187,120,0.1)' : 'rgba(113,128,150,0.1)', color: order.status === 'open' ? '#48bb78' : '#718096', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: subtext }}>
                      {order.governorate_name && <span>📍 {order.city_name ? `${order.city_name}, ` : ''}{order.governorate_name}</span>}
                      {order.price_min && <span>💰 {order.price_min}–{order.price_max} BD</span>}
                      {order.bedrooms && <span>🛏 {order.bedrooms}</span>}
                    </div>
                    <p style={{ margin: '6px 0 0', color: subtext, fontSize: '11px' }}>
                      💬 {order.responses_count} {lang === 'ar' ? 'رد' : 'responses'} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => navigate(`/orders/${order.id}`)} style={{ background: isDark ? '#0a1929' : '#f0f4f8', color: '#0f2640', border: `1px solid ${isDark ? '#1a3c5e' : '#e2e8f0'}`, padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'inherit' }}>
                      {lang === 'ar' ? 'التفاصيل' : 'View'}
                    </button>
                    {user?.role === 'visitor' && order.status === 'open' && (
                      <button onClick={() => handleClose(order.id)} disabled={closing === order.id} style={{ background: 'rgba(229,62,62,0.08)', color: '#e53e3e', border: '1px solid rgba(229,62,62,0.2)', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
                        {closing === order.id ? '...' : (lang === 'ar' ? 'إغلاق' : 'Close')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
