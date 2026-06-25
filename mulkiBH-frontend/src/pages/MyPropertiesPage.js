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

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyProperties().then(r => { setProperties(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Are you sure you want to delete this property?')) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch { alert('Failed to delete.'); }
  };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a3c5e', margin: 0 }}>{isRTL ? 'عقاراتي' : 'My Properties'}</h2>
        <button onClick={() => navigate('/properties/create')} style={{
          background: '#1a3c5e', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
        }}>+ {isRTL ? 'إضافة عقار' : 'Add Property'}</button>
      </div>

      {loading ? <p>{t('loading')}</p> : properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>{isRTL ? 'لم تضف أي عقارات بعد' : 'No properties yet'}</p>
          <button onClick={() => navigate('/properties/create')} style={{
            background: '#1a3c5e', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', cursor: 'pointer'
          }}>{isRTL ? 'أضف أول عقار' : 'Add Your First Property'}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {properties.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* Image */}
              <div style={{ width: '100px', height: '75px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <h4 style={{ margin: 0, color: '#1a3c5e' }}>{lang === 'ar' ? p.title_ar : p.title_en}</h4>
                  <span style={{ background: p.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4', color: p.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {p.listing_type === 'rent' ? t('forRent') : t('forSale')}
                  </span>
                  <span style={{ background: p.status === 'available' ? '#f0fff4' : '#fff5f5', color: p.status === 'available' ? '#276749' : '#e53e3e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ margin: '0 0 4px', color: '#718096', fontSize: '13px' }}>📍 {p.city_name}, {p.governorate_name}</p>
                <p style={{ margin: 0, fontWeight: '600', color: '#c8a951' }}>{p.price} {t('bd')}</p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => navigate(`/properties/${p.id}`)} style={{ background: '#ebf8ff', color: '#2b6cb0', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>👁 {t('viewDetails')}</button>
                <button onClick={() => navigate(`/properties/${p.id}/edit`)} style={{ background: '#fefcbf', color: '#744210', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>✏️ {t('edit')}</button>
                <button onClick={() => handleDelete(p.id)} style={{ background: '#fff5f5', color: '#e53e3e', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>🗑 {t('delete')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;
