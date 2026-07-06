/* eslint-disable */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useT } from '../hooks/useTranslation';

const FavoritesPage = () => {
  const t = useT();
  const { lang } = useLang();
  const { bg, surface, border, text, subtext, heading, isDark } = useThemeColors();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: surface, borderRadius: '16px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>❤️</div>
            <h3 style={{ color: heading, marginBottom: '8px', fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
              {lang === 'ar' ? 'لا توجد عقارات محفوظة' : 'No saved properties yet'}
            </h3>
            <p style={{ color: subtext, marginBottom: '24px', fontSize: '14px' }}>
              {lang === 'ar' ? 'اضغط على ❤️ على أي عقار لحفظه هنا' : 'Click ❤️ on any property to save it here'}
            </p>
            <button onClick={() => navigate('/properties')} className="btn-navy" style={{ padding: '12px 28px', borderRadius: '10px', fontSize: '14px' }}>
              {t('browseProperties')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
            {favorites.map((p, i) => (
              <div key={p.id} className={`property-card fade-in-up delay-${Math.min(i+1,5)}`} style={{ background: surface, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}`, boxShadow: isDark ? 'none' : 'var(--shadow-sm)', position: 'relative' }}>
                <button onClick={e => { e.stopPropagation(); toggleFavorite(p); }} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 1 }}>
                  {isFavorite(p.id) ? '❤️' : '🤍'}
                </button>

                <div onClick={() => navigate(`/properties/${p.id}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ height: '190px', background: isDark ? '#0a1929' : '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', overflow: 'hidden', position: 'relative' }}>
                    {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>🏠</span>}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: p.listing_type === 'rent' ? '#0f2640' : '#7a5c10', color: 'white', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                      {p.listing_type === 'rent' ? (lang === 'ar' ? 'إيجار' : 'FOR RENT') : (lang === 'ar' ? 'بيع' : 'FOR SALE')}
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ color: text, fontSize: '14px', fontWeight: '600', margin: 0, maxWidth: '170px', lineHeight: '1.3' }}>{lang === 'ar' ? p.title_ar : p.title_en}</h4>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ color: '#c8a951', fontWeight: '700', fontSize: '15px', margin: 0 }}>{p.price}</p>
                        <p style={{ color: subtext, fontSize: '10px', margin: 0 }}>BD</p>
                      </div>
                    </div>
                    <p style={{ color: subtext, fontSize: '12px', margin: 0 }}>📍 {p.city_name}, {p.governorate_name}</p>
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

export default FavoritesPage;
