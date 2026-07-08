/* eslint-disable */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useLang } from '../context/LanguageContext';

const FavoritesPage = () => {
  const { lang } = useLang();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 className="heading-display" style={{ fontSize: 'clamp(28px,4vw,40px)', color: '#0f2640', marginBottom: '8px' }}>
            {lang === 'ar' ? 'المفضلة' : 'My Favorites'}
          </h1>
          <p style={{ color: '#44474d' }}>
            {lang === 'ar' ? `${favorites.length} عقاراً محفوظاً` : `${favorites.length} saved ${favorites.length === 1 ? 'property' : 'properties'}`}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', border: '1px solid rgba(196,198,206,0.3)', borderRadius: '2px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#c8a951' }}>favorite</span>
            <h3 className="heading-display" style={{ color: '#0f2640', margin: '16px 0 8px', fontSize: '24px' }}>
              {lang === 'ar' ? 'لا توجد عقارات محفوظة بعد' : 'No saved properties yet'}
            </h3>
            <p style={{ color: '#74777e', marginBottom: '28px', fontSize: '15px' }}>
              {lang === 'ar' ? 'اضغط على أيقونة القلب في أي عقار لحفظه هنا' : 'Tap the heart icon on any property to save it here'}
            </p>
            <button onClick={() => navigate('/properties')} style={{ padding: '13px 32px', background: '#c8a951', color: '#0f2640', fontWeight: '700', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.background = '#c8a951'}
            >
              {lang === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
            {favorites.map((p, i) => {
              const badge = p.is_featured ? (lang === 'ar' ? 'حصري' : 'Exclusive') : (p.listing_type === 'sale' ? (lang === 'ar' ? 'للبيع' : 'For Sale') : (lang === 'ar' ? 'للإيجار' : 'For Rent'));
              const badgeGold = p.is_featured || p.listing_type === 'sale';
              return (
                <div key={p.id} className="property-card fade-in-up" style={{ background: 'white', borderRadius: '2px', border: '1px solid rgba(196,198,206,0.3)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,38,64,0.06)' }}>
                  <div onClick={() => navigate(`/properties/${p.id}`)} style={{ position: 'relative', height: '224px', overflow: 'hidden', cursor: 'pointer' }}>
                    <div className="property-image" style={{
                      width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.7s ease',
                      background: p.main_image ? `url('${p.main_image}') center/cover` : 'linear-gradient(135deg, #0f2640, #1a3c5e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
                    }}>{!p.main_image && '🏠'}</div>
                    <div style={{
                      position: 'absolute', top: '14px', left: '14px', padding: '5px 12px', fontWeight: '700', fontSize: '11px',
                      textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      background: badgeGold ? '#c8a951' : '#0f2640', color: badgeGold ? '#0f2640' : 'white',
                    }}>{badge}</div>
                    <button onClick={e => { e.stopPropagation(); toggleFavorite(p); }} style={{
                      position: 'absolute', top: '14px', right: '14px', width: '38px', height: '38px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ba1a1a',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                  </div>
                  <div onClick={() => navigate(`/properties/${p.id}`)} style={{ padding: '20px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#c8a951', marginBottom: '6px', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>{p.city_name}, {p.governorate_name}</span>
                    </div>
                    <h3 className="heading-display" style={{ color: '#0f2640', fontSize: '19px', marginBottom: '10px' }}>
                      {lang === 'ar' ? p.title_ar : p.title_en}
                    </h3>
                    <p style={{ color: '#c8a951', fontWeight: '800', fontSize: '20px', marginBottom: '14px' }}>
                      BHD {p.price}{p.listing_type === 'rent' && <span style={{ fontSize: '13px', fontWeight: '400', color: '#44474d' }}> /{lang === 'ar' ? 'شهرياً' : 'month'}</span>}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', paddingTop: '14px', borderTop: '1px solid rgba(196,198,206,0.3)' }}>
                      {p.bedrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#44474d' }}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bed</span>{p.bedrooms}</span>}
                      {p.bathrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#44474d' }}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bathtub</span>{p.bathrooms}</span>}
                      {p.area_sqm && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#44474d' }}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>straighten</span>{p.area_sqm}m²</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`.property-card:hover .property-image { transform: scale(1.05); }`}</style>
    </div>
  );
};

export default FavoritesPage;
