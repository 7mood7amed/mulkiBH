/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const MyPropertiesPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyProperties().then(r => { setProperties(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Delete this property?')) return;
    setDeleting(id);
    try {
      await deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch { alert('Failed to delete.'); }
    setDeleting(null);
  };

  const statusColors = {
    available: { bg: '#f0fff4', color: '#276749' },
    rented: { bg: '#ebf8ff', color: '#2b6cb0' },
    sold: { bg: '#fff5f5', color: '#e53e3e' },
    pending: { bg: '#fffff0', color: '#744210' },
  };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '1000px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#1a3c5e', margin: '0 0 4px', fontSize: 'clamp(18px, 3vw, 24px)' }}>
            {isRTL ? 'عقاراتي' : 'My Properties'}
          </h2>
          {!loading && <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>{properties.length} {isRTL ? 'عقار' : 'listings'}</p>}
        </div>
        <button onClick={() => navigate('/properties/create')} className="btn-primary" style={{
          background: '#1a3c5e', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
        }}>+ {isRTL ? 'إضافة عقار' : 'Add Property'}</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px', display: 'flex', gap: '16px' }}>
              <div className="skeleton" style={{ width: '100px', height: '75px', borderRadius: '8px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '16px', width: '50%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '13px', width: '30%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
          <h3 style={{ color: '#1a3c5e', marginBottom: '8px' }}>{isRTL ? 'لا توجد عقارات بعد' : 'No properties yet'}</h3>
          <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>{isRTL ? 'أضف أول عقار لك الآن' : 'Add your first listing now'}</p>
          <button onClick={() => navigate('/properties/create')} className="btn-primary" style={{
            background: '#1a3c5e', color: 'white', border: 'none',
            padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
          }}>{isRTL ? 'إضافة عقار' : 'Add Property'}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {properties.map((p, i) => (
            <div key={p.id} className={`fade-in-up delay-${Math.min(i+1, 5)}`} style={{
              background: 'white', borderRadius: '10px', padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex', gap: '14px', alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Image */}
              <div onClick={() => navigate(`/properties/${p.id}`)} style={{
                width: '90px', height: '68px', background: '#e2e8f0', borderRadius: '8px',
                overflow: 'hidden', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
              }}>
                {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '150px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <h4 onClick={() => navigate(`/properties/${p.id}`)} style={{ margin: 0, color: '#1a3c5e', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>
                    {lang === 'ar' ? p.title_ar : p.title_en}
                  </h4>
                  <span style={{
                    background: p.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4',
                    color: p.listing_type === 'rent' ? '#2b6cb0' : '#276749',
                    padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '600'
                  }}>{p.listing_type === 'rent' ? t('forRent') : t('forSale')}</span>
                  <span style={{
                    background: statusColors[p.status]?.bg || '#f7fafc',
                    color: statusColors[p.status]?.color || '#718096',
                    padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '600'
                  }}>{p.status}</span>
                </div>
                <p style={{ margin: '0 0 2px', color: '#718096', fontSize: '12px' }}>📍 {p.city_name}, {p.governorate_name}</p>
                <p style={{ margin: 0, fontWeight: '700', color: '#c8a951', fontSize: '14px' }}>{p.price} {t('bd')}</p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => navigate(`/properties/${p.id}/edit`)} style={{
                  background: '#fffff0', color: '#744210', border: '1px solid #fefcbf',
                  padding: '7px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
                }}>✏️ {t('edit')}</button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{
                  background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7',
                  padding: '7px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                }}>{deleting === p.id ? '...' : '🗑'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;
