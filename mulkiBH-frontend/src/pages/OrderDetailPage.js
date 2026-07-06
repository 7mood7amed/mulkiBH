/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, respondToOrder, closeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';

const OrderDetailPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
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
      // Refresh order to show new response
      const res = await getOrder(id);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || (isRTL ? 'فشل الإرسال.' : 'Failed to send response.'));
    } finally {
      setResponding(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm(isRTL ? 'هل تريد إغلاق هذا الطلب؟' : 'Close this order?')) return;
    try {
      await closeOrder(id);
      setOrder({ ...order, status: 'closed' });
    } catch { alert('Failed to close order.'); }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>{t('loading')}</div>;
  if (!order) return null;

  const isOwner = user?.role === 'owner' || user?.role === 'agency';
  const isCustomer = order.customer === user?.id;

  return (
    <div style={{  maxWidth: '800px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: '#0f2640', cursor: 'pointer', marginBottom: '16px', fontSize: '15px' }}>
        ← {t('back')}
      </button>

      {/* Order Header */}
      <div style={{ background: 'white', borderRadius: '12px', padding: 'clamp(16px, 4vw, 28px)', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h2 className="heading-display" style={{color: '#0f2640', margin: '0 0 8px' }}>
              {isRTL ? `طلب عقار #${order.id}` : `Property Order #${order.id}`}
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: order.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4', color: order.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '3px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>
                {order.listing_type === 'rent' ? t('forRent') : t('forSale')}
              </span>
              <span style={{ background: order.status === 'open' ? '#f0fff4' : '#fff5f5', color: order.status === 'open' ? '#276749' : '#e53e3e', padding: '3px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {isOwner && order.status === 'open' && (
              <button onClick={() => setShowForm(!showForm)} style={{
                background: '#0f2640', color: 'white', border: 'none',
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
              }}>{showForm ? t('cancel') : `💬 ${t('respond')}`}</button>
            )}
            {isCustomer && order.status === 'open' && (
              <button onClick={handleClose} style={{
                background: 'white', color: '#e53e3e', border: '1px solid #e53e3e',
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
              }}>{t('closeOrder')}</button>
            )}
          </div>
        </div>

        {/* Order Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {order.category_name && (
            <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 4px', color: '#718096', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{t('category')}</p>
              <p style={{ margin: 0, color: '#2d3748', fontWeight: '500' }}>{order.category_name}</p>
            </div>
          )}
          {order.governorate_name && (
            <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 4px', color: '#718096', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{t('location')}</p>
              <p style={{ margin: 0, color: '#2d3748', fontWeight: '500' }}>
                {order.city_name ? `${order.city_name}, ` : ''}{order.governorate_name}
              </p>
            </div>
          )}
          {(order.price_min || order.price_max) && (
            <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 4px', color: '#718096', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{t('priceRange')}</p>
              <p style={{ margin: 0, color: '#2d3748', fontWeight: '500' }}>
                {order.price_min || '0'} - {order.price_max || '∞'} {t('bd')}
              </p>
            </div>
          )}
          {order.bedrooms && (
            <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 4px', color: '#718096', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{t('bedrooms')}</p>
              <p style={{ margin: 0, color: '#2d3748', fontWeight: '500' }}>🛏 {order.bedrooms}</p>
            </div>
          )}
          {order.phone && (
            <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 4px', color: '#718096', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{t('phone')}</p>
              <a href={`tel:${order.phone}`} style={{ margin: 0, color: '#0f2640', fontWeight: '500', textDecoration: 'none' }}>📞 {order.phone}</a>
            </div>
          )}
          <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px', color: '#718096', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{isRTL ? 'تاريخ الطلب' : 'Posted'}</p>
            <p style={{ margin: 0, color: '#2d3748', fontWeight: '500' }}>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Description & Notes */}
        {order.description && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>{isRTL ? 'الوصف' : 'Description'}</p>
            <p style={{ color: '#718096', lineHeight: '1.7', background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>{order.description}</p>
          </div>
        )}
        {order.notes && (
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>{t('notes')}</p>
            <p style={{ color: '#718096', lineHeight: '1.7', background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>{order.notes}</p>
          </div>
        )}
      </div>

      {/* Success/Error messages */}
      {success && (
        <div style={{ background: '#f0fff4', color: '#276749', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #c6f6d5' }}>
          ✅ {success}
        </div>
      )}
      {error && (
        <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fed7d7' }}>
          ❌ {error}
        </div>
      )}

      {/* Respond Form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
          <h3 style={{ color: '#0f2640', marginBottom: '16px' }}>💬 {isRTL ? 'إرسال رد' : 'Send Response'}</h3>
          <form onSubmit={handleRespond}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={isRTL ? 'اكتب ردك هنا... أخبر العميل عن العقارات المتاحة لديك' : 'Write your response... Tell the customer about your available properties'}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '120px', resize: 'vertical', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit' }}
              required
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="submit" disabled={responding} style={{
                background: '#0f2640', color: 'white', border: 'none',
                padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
              }}>{responding ? t('loading') : t('submit')}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                background: 'white', color: '#718096', border: '1px solid #ddd',
                padding: '10px 24px', borderRadius: '8px', cursor: 'pointer'
              }}>{t('cancel')}</button>
            </div>
          </form>
        </div>
      )}

      {/* Responses */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <h3 style={{ color: '#0f2640', marginBottom: '20px' }}>
          {t('responses')} ({order.responses?.length || 0})
        </h3>

        {!order.responses || order.responses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#a0aec0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
            <p>{isRTL ? 'لا توجد ردود بعد' : 'No responses yet'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {order.responses.map((r, i) => (
              <div key={i} style={{ background: '#f8f9fa', borderRadius: '10px', padding: '18px', borderLeft: isRTL ? 'none' : '4px solid #1a3c5e', borderRight: isRTL ? '4px solid #1a3c5e' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#0f2640' }}>
                      {r.responder_agency || r.responder_name}
                    </p>
                    {r.responder_agency && (
                      <p style={{ margin: 0, color: '#718096', fontSize: '13px' }}>{r.responder_name}</p>
                    )}
                  </div>
                  <span style={{ color: '#a0aec0', fontSize: '12px' }}>{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <p style={{ margin: '0 0 14px', color: '#4a5568', lineHeight: '1.7' }}>{r.message}</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {r.responder_phone && (
                    <a href={`tel:${r.responder_phone}`} style={{ color: '#0f2640', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                      📞 {r.responder_phone}
                    </a>
                  )}
                  {r.responder_whatsapp && (
                    <a href={`https://wa.me/${r.responder_whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#25d366', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                      💬 WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
