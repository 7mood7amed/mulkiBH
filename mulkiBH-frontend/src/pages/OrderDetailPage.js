/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, respondToOrder, closeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const OrderDetailPage = () => {
  const { isRTL } = useLang();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getOrder(id)
      .then(r => { setOrder(r.data); setLoading(false); })
      .catch(() => navigate('/orders'));
  }, [id]);

  const handleRespond = async (e) => {
    e.preventDefault();
    setResponding(true);
    setError('');
    try {
      await respondToOrder(id, { message });
      setSuccess(isRTL ? 'تم إرسال ردك بنجاح!' : 'Response sent successfully!');
      setShowForm(false);
      setMessage('');
      const res = await getOrder(id);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || (isRTL ? 'فشل الإرسال.' : 'Failed to send response.'));
    } finally { setResponding(false); }
  };

  const handleClose = async () => {
    if (!window.confirm(isRTL ? 'هل تريد إغلاق هذا الطلب؟' : 'Close this order?')) return;
    try { await closeOrder(id); setOrder({ ...order, status: 'closed' }); } catch { alert('Failed to close order.'); }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#44474d' }}>{isRTL ? 'جارٍ التحميل...' : 'Loading...'}</div>;
  if (!order) return null;

  const isOwner = user?.role === 'owner' || user?.role === 'agency';
  const isCustomer = order.customer === user?.id;
  const cardStyle = { background: 'white', border: '1px solid rgba(196,198,206,0.4)', boxShadow: '0 1px 3px rgba(15,38,64,0.06)', padding: '28px', marginBottom: '24px' };
  const statBox = { background: '#f0f4f8', padding: '16px', borderLeft: '3px solid #c8a951' };
  const statLabel = { margin: '0 0 4px', color: '#44474d', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px' }}>
        <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: '#2d6a9f', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>{isRTL ? 'رجوع' : 'Back'}
        </button>

        {/* Order Header */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h1 className="heading-display" style={{ color: '#0f2640', fontSize: 'clamp(24px,3vw,32px)', marginBottom: '10px' }}>
                {isRTL ? `طلب عقار #${order.id}` : `Property Order #${order.id}`}
              </h1>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: order.listing_type === 'rent' ? '#0f2640' : '#c8a951', color: order.listing_type === 'rent' ? 'white' : '#0f2640', padding: '4px 12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                  {order.listing_type === 'rent' ? (isRTL ? 'إيجار' : 'For Rent') : (isRTL ? 'شراء' : 'For Sale')}
                </span>
                <span style={{ background: order.status === 'open' ? 'rgba(200,169,81,0.12)' : 'rgba(116,119,126,0.12)', color: order.status === 'open' ? '#a37c1a' : '#44474d', padding: '4px 12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                  {order.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {isOwner && order.status === 'open' && (
                <button onClick={() => setShowForm(!showForm)} style={{ background: '#c8a951', color: '#0f2640', border: 'none', padding: '11px 22px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>forum</span>{showForm ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'رد' : 'Respond')}
                </button>
              )}
              {isCustomer && order.status === 'open' && (
                <button onClick={handleClose} style={{ background: 'white', color: '#ba1a1a', border: '1px solid #ba1a1a', padding: '11px 22px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700' }}>
                  {isRTL ? 'إغلاق الطلب' : 'Close Order'}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {order.category_name && (
              <div style={statBox}><p style={statLabel}>{isRTL ? 'الفئة' : 'Category'}</p><p style={{ margin: 0, color: '#0f2640', fontWeight: '700' }}>{order.category_name}</p></div>
            )}
            {order.governorate_name && (
              <div style={statBox}><p style={statLabel}>{isRTL ? 'الموقع' : 'Location'}</p><p style={{ margin: 0, color: '#0f2640', fontWeight: '700' }}>{order.city_name ? `${order.city_name}, ` : ''}{order.governorate_name}</p></div>
            )}
            {(order.price_min || order.price_max) && (
              <div style={statBox}><p style={statLabel}>{isRTL ? 'نطاق السعر' : 'Price Range'}</p><p style={{ margin: 0, color: '#0f2640', fontWeight: '700' }}>{order.price_min || '0'} – {order.price_max || '∞'} BHD</p></div>
            )}
            {order.bedrooms && (
              <div style={statBox}><p style={statLabel}>{isRTL ? 'غرف النوم' : 'Bedrooms'}</p><p style={{ margin: 0, color: '#0f2640', fontWeight: '700' }}>{order.bedrooms}</p></div>
            )}
            {order.phone && (
              <div style={statBox}><p style={statLabel}>{isRTL ? 'الهاتف' : 'Phone'}</p><a href={`tel:${order.phone}`} style={{ color: '#2d6a9f', fontWeight: '700', textDecoration: 'none' }}>{order.phone}</a></div>
            )}
            <div style={statBox}><p style={statLabel}>{isRTL ? 'تاريخ الطلب' : 'Posted'}</p><p style={{ margin: 0, color: '#0f2640', fontWeight: '700' }}>{new Date(order.created_at).toLocaleDateString()}</p></div>
          </div>

          {order.description && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontWeight: '700', color: '#0f2640', marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isRTL ? 'الوصف' : 'Description'}</p>
              <p style={{ color: '#44474d', lineHeight: '1.8', background: '#f0f4f8', padding: '16px' }}>{order.description}</p>
            </div>
          )}
          {order.notes && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontWeight: '700', color: '#0f2640', marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isRTL ? 'ملاحظات' : 'Notes'}</p>
              <p style={{ color: '#44474d', lineHeight: '1.8', background: '#f0f4f8', padding: '16px' }}>{order.notes}</p>
            </div>
          )}
        </div>

        {success && (
          <div style={{ background: 'rgba(46,125,50,0.08)', color: '#2e7d32', padding: '14px 18px', marginBottom: '20px', border: '1px solid rgba(46,125,50,0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>{success}
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(186,26,26,0.08)', color: '#ba1a1a', padding: '14px 18px', marginBottom: '20px', border: '1px solid rgba(186,26,26,0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>{error}
          </div>
        )}

        {showForm && (
          <div style={cardStyle}>
            <h3 className="heading-display" style={{ color: '#0f2640', fontSize: '19px', marginBottom: '16px' }}>{isRTL ? 'إرسال رد' : 'Send Response'}</h3>
            <form onSubmit={handleRespond}>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder={isRTL ? 'اكتب ردك هنا... أخبر العميل عن العقارات المتاحة لديك' : 'Write your response... Tell the customer about your available properties'}
                style={{ width: '100%', padding: '14px', border: '1px solid #c4c6ce', background: '#f6fafe', minHeight: '120px', resize: 'vertical', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
                required
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button type="submit" disabled={responding} style={{ background: '#c8a951', color: '#0f2640', border: 'none', padding: '11px 26px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit' }}>
                  {responding ? (isRTL ? 'جارٍ الإرسال...' : 'Sending...') : (isRTL ? 'إرسال' : 'Submit')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'white', color: '#44474d', border: '1px solid #c4c6ce', padding: '11px 26px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Responses */}
        <div style={cardStyle}>
          <h3 className="heading-display" style={{ color: '#0f2640', fontSize: '19px', marginBottom: '20px' }}>
            {isRTL ? 'الردود' : 'Responses'} ({order.responses?.length || 0})
          </h3>
          {!order.responses || order.responses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#74777e' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#c4c6ce' }}>forum</span>
              <p style={{ marginTop: '10px' }}>{isRTL ? 'لا توجد ردود بعد' : 'No responses yet'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.responses.map((r, i) => (
                <div key={i} style={{ background: '#f0f4f8', padding: '20px', borderLeft: '4px solid #0f2640' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <p className="heading-display" style={{ margin: '0 0 2px', color: '#0f2640', fontSize: '16px' }}>{r.responder_agency || r.responder_name}</p>
                      {r.responder_agency && <p style={{ margin: 0, color: '#74777e', fontSize: '13px' }}>{r.responder_name}</p>}
                    </div>
                    <span style={{ color: '#74777e', fontSize: '12px' }}>{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: '0 0 14px', color: '#44474d', lineHeight: '1.7' }}>{r.message}</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {r.responder_phone && <a href={`tel:${r.responder_phone}`} style={{ color: '#0f2640', textDecoration: 'none', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>call</span>{r.responder_phone}</a>}
                    {r.responder_whatsapp && <a href={`https://wa.me/${r.responder_whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#2e7d32', textDecoration: 'none', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>WhatsApp</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
