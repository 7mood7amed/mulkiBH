/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProperties, getCategories, getGovernorates, getCities } from '../api/properties';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useFavorites } from '../context/FavoritesContext';

const PropertiesPage = () => {
  const { lang } = useLang();
  const { bg, surface, border, text, subtext, heading, isDark } = useThemeColors();
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
    city: '', price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });

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
    setFilters(empty); fetchProperties(empty); setShowFilters(false);
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: `1px solid ${border}`, borderRadius: '8px', background: isDark ? '#0a1929' : 'white', fontSize: '13px', color: text, fontFamily: 'inherit', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '11px', fontWeight: '600', color: subtext, textTransform: 'uppercase', letterSpacing: '0.5px' };

  const FilterPanel = () => (
    <div>
      <h3 style={{ marginBottom: '20px', color: heading, fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>⚙</span> {lang === 'ar' ? 'الفلاتر' : 'Filters'}
      </h3>
      {[
        { label: lang === 'ar' ? 'بحث' : 'Search', content: <input value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} style={inputStyle} placeholder={lang === 'ar' ? 'ابحث...' : 'Search...'} /> },
      ].map((f, i) => <div key={i} style={{ marginBottom: '14px' }}><label style={labelStyle}>{f.label}</label>{f.content}</div>)}

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{lang === 'ar' ? 'النوع' : 'Type'}</label>
        <select value={filters.listing_type} onChange={e => setFilters({...filters, listing_type: e.target.value})} style={inputStyle}>
          <option value="">— {lang === 'ar' ? 'الكل' : 'All'} —</option>
          <option value="rent">{lang === 'ar' ? 'إيجار' : 'For Rent'}</option>
          <option value="sale">{lang === 'ar' ? 'بيع' : 'For Sale'}</option>
        </select>
      </div>
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{lang === 'ar' ? 'الفئة' : 'Category'}</label>
        <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={inputStyle}>
          <option value="">— {lang === 'ar' ? 'الكل' : 'All'} —</option>
          {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
        <select value={filters.governorate} onChange={e => setFilters({...filters, governorate: e.target.value, city: ''})} style={inputStyle}>
          <option value="">— {lang === 'ar' ? 'الكل' : 'All'} —</option>
          {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
        </select>
      </div>
      {cities.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'المنطقة' : 'Area'}</label>
          <select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} style={inputStyle}>
            <option value="">— {lang === 'ar' ? 'الكل' : 'All'} —</option>
            {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
          </select>
        </div>
      )}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{lang === 'ar' ? 'الغرف' : 'Bedrooms'}</label>
        <input type="number" value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})} style={inputStyle} min="1" placeholder="e.g. 2" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>{lang === 'ar' ? 'أدنى سعر' : 'Min price'}</label>
          <input type="number" value={filters.price_min} onChange={e => setFilters({...filters, price_min: e.target.value})} style={inputStyle} placeholder="BD" />
        </div>
        <div>
          <label style={labelStyle}>{lang === 'ar' ? 'أقصى سعر' : 'Max price'}</label>
          <input type="number" value={filters.price_max} onChange={e => setFilters({...filters, price_max: e.target.value})} style={inputStyle} placeholder="BD" />
        </div>
      </div>
      <button onClick={handleFilter} className="btn-navy" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
        {lang === 'ar' ? 'تطبيق الفلاتر' : 'Apply Filters'}
      </button>
      <button onClick={handleClear} style={{ width: '100%', padding: '9px', background: 'transparent', color: subtext, border: `1px solid ${border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
        {lang === 'ar' ? 'مسح الكل' : 'Clear all'}
      </button>
    </div>
  );

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>
      {/* Top bar */}
      <div style={{ background: isDark ? '#0a1929' : 'white', padding: '14px 20px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="heading-display" style={{ margin: 0, color: heading, fontSize: '20px' }}>
            {lang === 'ar' ? 'جميع العقارات' : 'All Properties'}
          </h2>
          {!loading && <p style={{ margin: '2px 0 0', color: subtext, fontSize: '13px' }}>{properties.length} {lang === 'ar' ? 'عقار' : 'listings'}</p>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-navy" style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ⚙ {lang === 'ar' ? 'الفلاتر' : 'Filters'}
        </button>
      </div>

      {showFilters && (
        <div style={{ background: isDark ? '#0a1929' : 'white', padding: '20px', borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: '800px' }}><FilterPanel /></div>
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {/* Desktop sidebar */}
        <div className="desktop-sidebar" style={{ width: '260px', background: isDark ? '#0a1929' : 'white', padding: '24px 20px', borderRight: `1px solid ${border}`, flexShrink: 0, minHeight: 'calc(100vh - 110px)' }}>
          <FilterPanel />
        </div>

        {/* Grid */}
        <div style={{ flex: 1, padding: '24px 20px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: isDark ? '#0a1929' : 'white', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${border}` }}>
                  <div className="skeleton" style={{ height: '190px' }} />
                  <div style={{ padding: '16px' }}>
                    <div className="skeleton" style={{ height: '14px', marginBottom: '10px', width: '70%' }} />
                    <div className="skeleton" style={{ height: '12px', marginBottom: '8px', width: '50%' }} />
                    <div className="skeleton" style={{ height: '12px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>🏠</div>
              <h3 className="heading-display" style={{ color: heading, marginBottom: '8px', fontSize: '22px' }}>
                {lang === 'ar' ? 'لا توجد عقارات' : 'No properties found'}
              </h3>
              <p style={{ color: subtext, fontSize: '14px' }}>{lang === 'ar' ? 'جرب تغيير الفلاتر' : 'Try adjusting your filters'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
              {properties.map((p, i) => (
                <div key={p.id} className={`property-card fade-in-up delay-${Math.min(i+1,5)}`} style={{
                  background: isDark ? '#0a1929' : 'white', borderRadius: '14px', overflow: 'hidden',
                  border: `1px solid ${border}`, boxShadow: isDark ? 'none' : 'var(--shadow-sm)', position: 'relative',
                }}>
                  {/* Favorite */}
                  <button onClick={e => { e.stopPropagation(); toggleFavorite(p); }} style={{
                    position: 'absolute', top: '12px', right: '12px', zIndex: 1,
                    background: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px',
                    cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >{isFavorite(p.id) ? '❤️' : '🤍'}</button>

                  {/* Type badge */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1 }}>
                    <span style={{
                      background: p.listing_type === 'rent' ? '#0f2640' : '#7a5c10',
                      color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px',
                    }}>{p.listing_type === 'rent' ? (lang === 'ar' ? 'إيجار' : 'RENT') : (lang === 'ar' ? 'بيع' : 'SALE')}</span>
                  </div>

                  <div onClick={() => navigate(`/properties/${p.id}`)}>
                    <div style={{ height: '190px', background: isDark ? '#0f2640' : '#e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', overflow: 'hidden' }}>
                      {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, color: text, fontSize: '14px', fontWeight: '700', flex: 1, paddingRight: '8px', lineHeight: '1.3' }}>
                          {lang === 'ar' ? p.title_ar : p.title_en}
                        </h4>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ margin: 0, fontWeight: '800', color: '#c8a951', fontSize: '16px' }}>{p.price}</p>
                          <p style={{ margin: 0, color: subtext, fontSize: '10px' }}>BD{p.listing_type === 'rent' ? '/mo' : ''}</p>
                        </div>
                      </div>
                      <p style={{ color: subtext, fontSize: '12px', margin: '0 0 10px' }}>📍 {p.city_name}, {p.governorate_name}</p>
                      <div style={{ display: 'flex', gap: '12px', paddingTop: '10px', borderTop: `1px solid ${border}` }}>
                        {p.bedrooms && <span style={{ fontSize: '12px', color: subtext }}>🛏 {p.bedrooms}</span>}
                        {p.bathrooms && <span style={{ fontSize: '12px', color: subtext }}>🚿 {p.bathrooms}</span>}
                        {p.area_sqm && <span style={{ fontSize: '12px', color: subtext }}>📐 {p.area_sqm}m²</span>}
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
