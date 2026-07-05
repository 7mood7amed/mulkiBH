/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProperties, getCategories, getGovernorates, getCities } from '../api/properties';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';

const PropertiesPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { isDark } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    listing_type: searchParams.get('listing_type') || '',
    category: searchParams.get('category') || '',
    governorate: searchParams.get('governorate') || '',
    city: searchParams.get('city') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });

  const bgColor = isDark ? '#0f1923' : '#f8f9fa';
  const cardBg = isDark ? '#1a2535' : 'white';
  const textColor = isDark ? '#e2e8f0' : '#2d3748';
  const subColor = isDark ? '#a0aec0' : '#718096';
  const borderColor = isDark ? '#2d3748' : '#eee';

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
    fetchProperties();
  }, []);

  useEffect(() => {
    if (filters.governorate) getCities(filters.governorate).then(r => setCities(r.data)).catch(() => {});
    else setCities([]);
  }, [filters.governorate]);

  const fetchProperties = async (params = filters) => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
      const res = await getProperties(clean);
      setProperties(res.data);
    } catch {}
    setLoading(false);
  };

  const handleFilter = () => { fetchProperties(filters); setShowFilters(false); };
  const handleClear = () => {
    const empty = { search: '', listing_type: '', category: '', governorate: '', city: '', price_min: '', price_max: '', bedrooms: '' };
    setFilters(empty);
    fetchProperties(empty);
    setShowFilters(false);
  };

  const selectStyle = { width: '100%', padding: '9px', border: `1px solid ${borderColor}`, borderRadius: '6px', background: cardBg, fontSize: '14px', color: textColor };
  const inputStyle = { width: '100%', padding: '9px', border: `1px solid ${borderColor}`, borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px', background: cardBg, color: textColor };
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: subColor };

  const FilterContent = () => (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#1a3c5e', fontSize: '16px' }}>{t('filters')}</h3>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>{t('search')}</label>
        <input value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} style={inputStyle} placeholder={t('searchPlaceholder')} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>{t('type')}</label>
        <select value={filters.listing_type} onChange={e => setFilters({...filters, listing_type: e.target.value})} style={selectStyle}>
          <option value="">-- {t('type')} --</option>
          <option value="rent">{t('forRent')}</option>
          <option value="sale">{t('forSale')}</option>
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>{t('category')}</label>
        <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={selectStyle}>
          <option value="">-- {t('category')} --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>{t('governorate')}</label>
        <select value={filters.governorate} onChange={e => setFilters({...filters, governorate: e.target.value, city: ''})} style={selectStyle}>
          <option value="">-- {t('governorate')} --</option>
          {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
        </select>
      </div>
      {cities.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>{t('city')}</label>
          <select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} style={selectStyle}>
            <option value="">-- {t('city')} --</option>
            {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
          </select>
        </div>
      )}
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>{t('bedrooms')}</label>
        <input type="number" value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})} style={inputStyle} min="1" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>{t('minPrice')}</label>
          <input type="number" value={filters.price_min} onChange={e => setFilters({...filters, price_min: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{t('maxPrice')}</label>
          <input type="number" value={filters.price_max} onChange={e => setFilters({...filters, price_max: e.target.value})} style={inputStyle} />
        </div>
      </div>
      <button onClick={handleFilter} style={{ width: '100%', padding: '10px', background: '#1a3c5e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '8px', fontWeight: '600' }}>{t('applyFilters')}</button>
      <button onClick={handleClear} style={{ width: '100%', padding: '10px', background: 'transparent', color: '#1a3c5e', border: '1px solid #1a3c5e', borderRadius: '6px', cursor: 'pointer' }}>{t('clearFilters')}</button>
    </div>
  );

  return (
    <div style={{  minHeight: 'calc(100vh - 64px)', background: bgColor }} className="dm-bg">
      {/* Mobile filter bar */}
      <div style={{ padding: '12px 16px', background: cardBg, borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="dm-card">
        <h2 style={{ margin: 0, color: '#1a3c5e', fontSize: '17px' }} className="dm-heading">
          {t('allProperties')} {!loading && <span style={{ color: subColor, fontWeight: '400', fontSize: '14px' }}>({properties.length})</span>}
        </h2>
        <button onClick={() => setShowFilters(!showFilters)} style={{ background: '#1a3c5e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          ⚙ {t('filters')}
        </button>
      </div>

      {showFilters && (
        <div style={{ background: cardBg, padding: '20px', borderBottom: `2px solid ${borderColor}` }} className="dm-card">
          <FilterContent />
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {/* Desktop Sidebar */}
        <div style={{ width: '260px', background: cardBg, padding: '20px', borderRight: isRTL ? 'none' : `1px solid ${borderColor}`, borderLeft: isRTL ? `1px solid ${borderColor}` : 'none', flexShrink: 0 }} className="desktop-sidebar dm-card">
          <FilterContent />
        </div>

        {/* Grid */}
        <div style={{ flex: 1, padding: '20px', background: bgColor }} className="dm-bg">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: cardBg, borderRadius: '10px', overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: '180px' }} />
                  <div style={{ padding: '14px' }}>
                    <div className="skeleton" style={{ height: '14px', marginBottom: '8px', width: '60%' }} />
                    <div className="skeleton" style={{ height: '12px', marginBottom: '6px', width: '80%' }} />
                    <div className="skeleton" style={{ height: '12px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: subColor }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <p>{t('noProperties')}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {properties.map((p, i) => (
                <div key={p.id} className={`property-card fade-in-up delay-${Math.min(i+1,5)} dm-card`} style={{
                  background: cardBg, borderRadius: '10px', overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.07)', position: 'relative'
                }}>
                  {/* Favorite button */}
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p); }} style={{
                    position: 'absolute', top: '10px', right: isRTL ? 'auto' : '10px', left: isRTL ? '10px' : 'auto',
                    background: 'white', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', cursor: 'pointer', fontSize: '15px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 1,
                    transition: 'transform 0.2s ease'
                  }}>
                    {isFavorite(p.id) ? '❤️' : '🤍'}
                  </button>

                  <div onClick={() => navigate(`/properties/${p.id}`)}>
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
                      <p style={{ color: subColor, fontSize: '12px', margin: '0 0 8px' }}>📍 {p.city_name}, {p.governorate_name}</p>
                      <div style={{ display: 'flex', gap: '10px', color: subColor, fontSize: '12px' }}>
                        {p.bedrooms && <span>🛏 {p.bedrooms}</span>}
                        {p.bathrooms && <span>🚿 {p.bathrooms}</span>}
                        {p.area_sqm && <span>📐 {p.area_sqm} {t('sqm')}</span>}
                      </div>
                    </div>
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

export default PropertiesPage;
