/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useT } from '../hooks/useTranslation';

const statusConfig = {
  available: { color: '#48bb78', label: 'Available' },
  rented:    { color: '#3d82bc', label: 'Rented' },
  sold:      { color: '#e53e3e', label: 'Sold' },
  pending:   { color: '#c8a951', label: 'Pending' },
};

const MyPropertiesPage = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const { bg, surface, border, text, subtext, heading, isDark } = useThemeColors();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyProperties().then(r => { setProperties(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Delete this property?')) return;
    setDeleting(id);
    try { await deleteProperty(id); setProperties(properties.filter(p => p.id !== id)); } catch {}
    setDeleting(null);
  };

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>
      <PageHeader
        title={lang === 'ar' ? 'عقاراتي' : 'My Properties'}
        subtitle={!loading ? `${properties.length} ${lang === 'ar' ? 'عقار' : 'listings'}` : ''}
        action={
          <button onClick={() => navigate('/properties/create')} className="btn-gold" style={{ padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(200,169,81,0.4)' }}>
            + {lang === 'ar' ? 'إضافة عقار' : 'Add Property'}
          </button>
        }
      />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: surface, borderRadius: '12px', padding: '18px', display: 'flex', gap: '14px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
                <div className="skeleton" style={{ width: '90px', height: '68px', borderRadius: '8px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div className="skeleton" style={{ height: '15px', width: '50%', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '12px', width: '30%' }} /></div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: surface, borderRadius: '16px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🏠</div>
            <h3 style={{ color: heading, fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>{lang === 'ar' ? 'لا توجد عقارات بعد' : 'No properties yet'}</h3>
            <p style={{ color: subtext, marginBottom: '24px', fontSize: '14px' }}>{lang === 'ar' ? 'أضف أول عقار لك الآن' : 'Add your first listing now'}</p>
            <button onClick={() => navigate('/properties/create')} className="btn-navy" style={{ padding: '11px 28px', borderRadius: '8px', fontSize: '14px' }}>
              {lang === 'ar' ? 'إضافة عقار' : 'Add Property'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {properties.map((p, i) => (
              <div key={p.id} className={`fade-in-up delay-${Math.min(i+1,5)}`} style={{ background: surface, borderRadius: '12px', padding: '16px 18px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}`, boxShadow: isDark ? 'none' : 'var(--shadow-sm)', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div onClick={() => navigate(`/properties/${p.id}`)} style={{ width: '90px', height: '68px', background: isDark ? '#0a1929' : '#f0f4f8', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h4 onClick={() => navigate(`/properties/${p.id}`)} style={{ margin: 0, color: heading, cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>
                      {lang === 'ar' ? p.title_ar : p.title_en}
                    </h4>
                    <span style={{ background: p.listing_type === 'rent' ? (isDark ? '#0a1929' : '#ebf8ff') : (isDark ? '#0a1929' : '#f0fff4'), color: p.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                      {p.listing_type === 'rent' ? (lang === 'ar' ? 'إيجار' : 'RENT') : (lang === 'ar' ? 'بيع' : 'SALE')}
                    </span>
                    <span style={{ background: `${statusConfig[p.status]?.color}18`, color: statusConfig[p.status]?.color, padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 2px', color: subtext, fontSize: '12px' }}>📍 {p.city_name}, {p.governorate_name}</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#c8a951', fontSize: '14px' }}>{p.price} BD</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => navigate(`/properties/${p.id}/edit`)} style={{ background: isDark ? '#0a1929' : '#f0f4f8', color: '#c8a951', border: `1px solid ${isDark ? '#1a3c5e' : '#e2e8f0'}`, padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'inherit' }}>
                    ✏️ {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: 'rgba(229,62,62,0.08)', color: '#e53e3e', border: '1px solid rgba(229,62,62,0.2)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
                    {deleting === p.id ? '...' : '🗑'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertiesPage;
