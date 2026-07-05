/* eslint-disable */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const FavoritesPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { isDark } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const cardBg = isDark ? '#1a2535' : 'white';
  const textColor = isDark ? '#e2e8f0' : '#2d3748';
  const subColor = isDark ? '#a0aec0' : '#718096';

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '1000px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }} className="dm-bg">
      <h2 style={{ color: '#1a3c5e', marginBottom: '8px', fontSize: 'clamp(18px, 3vw, 24px)' }} className="dm-heading">
        ❤️ {isRTL ? 'المفضلة' : 'Favorites'}
      </h2>
      <p style={{ color: subColor, marginBottom: '24px', fontSize: '14px' }}>
        {favorites.length} {isRTL ? 'عقار محفوظ' : 'saved properties'}
      </p>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: cardBg, borderRadius: '12px' }} className="dm-card">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
          <h3 style={{ color: '#1a3c5e', marginBottom: '8px' }} className="dm-heading">
            {isRTL ? 'لا توجد عقارات محفوظة' : 'No saved properties yet'}
          </h3>
          <p style={{ color: subColor, marginBottom: '24px', fontSize: '14px' }}>
            {isRTL ? 'اضغط على ❤️ على أي عقار لحفظه هنا' : 'Click ❤️ on any property to save it here'}
          </p>
          <button onClick={() => navigate('/properties')} className="btn-primary" style={{
            background: '#1a3c5e', color: 'white', border: 'none',
            padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
          }}>{t('browseProperties')}</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {favorites.map((p, i) => (
            <div key={p.id} className={`property-card fade-in-up delay-${Math.min(i+1,5)} dm-card`} style={{
              background: cardBg, borderRadius: '10px', overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)', position: 'relative'
            }}>
              {/* Remove button */}
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p); }} style={{
                position: 'absolute', top: '10px', right: isRTL ? 'auto' : '10px', left: isRTL ? '10px' : 'auto',
                background: 'white', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 1
              }}>❤️</button>

              <div onClick={() => navigate(`/properties/${p.id}`)} style={{ cursor: 'pointer' }}>
                <div style={{ height: '180px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', overflow: 'hidden' }}>
                  {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ background: p.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4', color: p.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      {p.listing_type === 'rent' ? t('forRent') : t('forSale')}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#c8a951', fontSize: '15px' }}>{p.price} {t('bd')}</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px', color: textColor, fontSize: '14px' }}>{lang === 'ar' ? p.title_ar : p.title_en}</h4>
                  <p style={{ color: subColor, fontSize: '12px', margin: 0 }}>📍 {p.city_name}, {p.governorate_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
