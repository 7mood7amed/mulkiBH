/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const statusColors = {
  available: '#2e7d32', rented: '#2d6a9f', sold: '#ba1a1a', pending: '#a37c1a',
};

const MyPropertiesPage = () => {
  const { lang } = useLang();
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
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Delete this property?')) return;
    setDeleting(id);
    try { await deleteProperty(id); setProperties(properties.filter(p => p.id !== id)); } catch {}
    setDeleting(null);
  };

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 className="heading-display" style={{ fontSize: 'clamp(26px,4vw,36px)', color: '#0f2640', marginBottom: '6px' }}>
              {lang === 'ar' ? 'عقاراتي' : 'My Properties'}
            </h1>
            {!loading && <p style={{ color: '#44474d' }}>{lang === 'ar' ? `${properties.length} إعلان` : `${properties.length} listings`}</p>}
          </div>
          <button onClick={() => navigate('/properties/create')} style={{ background: '#c8a951', color: '#0f2640', fontWeight: '700', padding: '12px 24px', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.background = '#c8a951'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_business</span>
            {lang === 'ar' ? 'إضافة عقار' : 'Add Property'}
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: '2px', padding: '20px', display: 'flex', gap: '16px', border: '1px solid rgba(196,198,206,0.4)' }}>
                <div className="skeleton" style={{ width: '100px', height: '76px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div className="skeleton" style={{ height: '15px', width: '50%', marginBottom: '10px' }} /><div className="skeleton" style={{ height: '12px', width: '30%' }} /></div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '90px 20px', background: 'white', border: '1px solid rgba(196,198,206,0.4)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#c8a951' }}>apartment</span>
            <h3 className="heading-display" style={{ color: '#0f2640', margin: '16px 0 8px', fontSize: '22px' }}>{lang === 'ar' ? 'لا توجد عقارات بعد' : 'No properties yet'}</h3>
            <p style={{ color: '#74777e', marginBottom: '24px', fontSize: '14px' }}>{lang === 'ar' ? 'أضف أول عقار لك الآن' : 'Add your first listing now'}</p>
            <button onClick={() => navigate('/properties/create')} style={{ background: '#0f2640', color: 'white', padding: '12px 28px', border: 'none', borderBottom: '2px solid #c8a951', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lang === 'ar' ? 'إضافة عقار' : 'Add Property'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {properties.map((p, i) => (
              <div key={p.id} className="fade-in-up" style={{ background: 'white', padding: '20px', border: '1px solid rgba(196,198,206,0.4)', boxShadow: '0 1px 3px rgba(15,38,64,0.06)', display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div onClick={() => navigate(`/properties/${p.id}`)} style={{ width: '110px', height: '80px', background: '#f0f4f8', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h4 onClick={() => navigate(`/properties/${p.id}`)} className="heading-display" style={{ margin: 0, color: '#0f2640', cursor: 'pointer', fontSize: '17px' }}>
                      {lang === 'ar' ? p.title_ar : p.title_en}
                    </h4>
                    <span style={{ background: p.listing_type === 'sale' ? '#c8a951' : '#0f2640', color: p.listing_type === 'sale' ? '#0f2640' : 'white', padding: '3px 9px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                      {p.listing_type === 'rent' ? (lang === 'ar' ? 'إيجار' : 'Rent') : (lang === 'ar' ? 'بيع' : 'Sale')}
                    </span>
                    <span style={{ background: `${statusColors[p.status]}18`, color: statusColors[p.status], padding: '3px 9px', fontSize: '10px', fontWeight: '700', textTransform: 'capitalize' }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px', color: '#74777e', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#c8a951' }}>location_on</span>{p.city_name}, {p.governorate_name}
                  </p>
                  <p style={{ margin: 0, fontWeight: '800', color: '#c8a951', fontSize: '16px' }}>BHD {p.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => navigate(`/properties/${p.id}/edit`)} style={{ background: '#f0f4f8', color: '#0f2640', border: '1px solid #dfe3e7', padding: '9px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>{lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: 'rgba(186,26,26,0.06)', color: '#ba1a1a', border: '1px solid rgba(186,26,26,0.2)', padding: '9px 12px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{deleting === p.id ? 'hourglass_empty' : 'delete'}</span>
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
