/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getMyOrders, closeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const OrdersPage = () => {
  const { lang } = useLang();
  const { user } = useAuth();
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
    try { await closeOrder(id); setOrders(orders.map(o => o.id === id ? { ...o, status: 'closed' } : o)); } catch {}
    setClosing(null);
  };

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 className="heading-display" style={{ fontSize: 'clamp(26px,4vw,36px)', color: '#0f2640', marginBottom: '6px' }}>
              {user?.role === 'visitor' ? (lang === 'ar' ? 'طلباتي' : 'My Orders') : (lang === 'ar' ? 'الطلبات المفتوحة' : 'Open Orders')}
            </h1>
            {!loading && <p style={{ color: '#44474d' }}>{lang === 'ar' ? `${orders.length} طلب` : `${orders.length} requests`}</p>}
          </div>
          {user?.role === 'visitor' && (
            <button onClick={() => navigate('/orders/create')} style={{ background: '#c8a951', color: '#0f2640', fontWeight: '700', padding: '12px 24px', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.background = '#c8a951'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>{lang === 'ar' ? 'طلب جديد' : 'New Order'}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: '2px', padding: '24px', border: '1px solid rgba(196,198,206,0.4)' }}>
                <div className="skeleton" style={{ height: '16px', width: '35%', marginBottom: '10px' }} />
                <div className="skeleton" style={{ height: '13px', width: '55%' }} />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '90px 20px', background: 'white', border: '1px solid rgba(196,198,206,0.4)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#c8a951' }}>assignment</span>
            <h3 className="heading-display" style={{ color: '#0f2640', margin: '16px 0 8px', fontSize: '22px' }}>{lang === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</h3>
            <p style={{ color: '#74777e', marginBottom: '24px', fontSize: '14px' }}>{lang === 'ar' ? 'لا توجد طلبات لعرضها حالياً' : 'There are no requests to display right now'}</p>
            {user?.role === 'visitor' && (
              <button onClick={() => navigate('/orders/create')} style={{ background: '#0f2640', color: 'white', padding: '12px 28px', border: 'none', borderBottom: '2px solid #c8a951', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'ar' ? 'أضف طلبك الأول' : 'Post Your First Order'}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div key={order.id} className="fade-in-up" style={{
                background: 'white', padding: '24px', border: '1px solid rgba(196,198,206,0.4)',
                boxShadow: '0 1px 3px rgba(15,38,64,0.06)', borderLeft: `4px solid ${order.status === 'open' ? '#c8a951' : '#74777e'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span className="heading-display" style={{ fontWeight: '700', color: '#0f2640', fontSize: '13px' }}>#{order.id}</span>
                      <span style={{ background: order.listing_type === 'rent' ? '#0f2640' : '#c8a951', color: order.listing_type === 'rent' ? 'white' : '#0f2640', padding: '3px 9px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {order.listing_type === 'rent' ? (lang === 'ar' ? 'إيجار' : 'Rent') : (lang === 'ar' ? 'شراء' : 'Buy')}
                      </span>
                      <span style={{ background: order.status === 'open' ? 'rgba(200,169,81,0.12)' : 'rgba(116,119,126,0.12)', color: order.status === 'open' ? '#a37c1a' : '#44474d', padding: '3px 9px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {order.status}
                      </span>
                    </div>
                    {order.title_en && <p style={{ margin: '0 0 8px', color: '#0f2640', fontWeight: '600', fontSize: '15px' }}>{order.title_en}</p>}
                    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '13px', color: '#44474d' }}>
                      {order.governorate_name && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c8a951' }}>location_on</span>{order.city_name ? `${order.city_name}, ` : ''}{order.governorate_name}</span>}
                      {(order.price_min || order.price_max) && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c8a951' }}>payments</span>{order.price_min || 0}–{order.price_max} BHD</span>}
                      {order.bedrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c8a951' }}>bed</span>{order.bedrooms}</span>}
                    </div>
                    <p style={{ margin: '10px 0 0', color: '#74777e', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>forum</span>{order.responses_count || 0} {lang === 'ar' ? 'رد' : 'responses'} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => navigate(`/orders/${order.id}`)} style={{ background: '#f0f4f8', color: '#0f2640', border: '1px solid #dfe3e7', padding: '9px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'inherit' }}>
                      {lang === 'ar' ? 'التفاصيل' : 'View'}
                    </button>
                    {user?.role === 'visitor' && order.status === 'open' && (
                      <button onClick={() => handleClose(order.id)} disabled={closing === order.id} style={{ background: 'rgba(186,26,26,0.06)', color: '#ba1a1a', border: '1px solid rgba(186,26,26,0.2)', padding: '9px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'inherit' }}>
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
