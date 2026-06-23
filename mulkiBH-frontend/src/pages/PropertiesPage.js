import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProperties, getCategories, getGovernorates, getCities } from '../api/properties';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const PropertiesPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    listing_type: '', category: '', governorate: '', city: '',
    price_min: '', price_max: '', bedrooms: '',
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

  const handleFilter = () => fetchProperties(filters);
  const handleClear = () => {
    const empty = { search: '', listing_type: '', category: '', governorate: '', city: '', price_min: '', price_max: '', bedrooms: '' };
    setFilters(empty);
    fetchProperties(empty);
  };

  const selectStyle = { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' };
  const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar Filters */}
      <div style={{ width: '260px', background: 'white', padding: '24px', borderRight: isRTL ? 'none' : '1px solid #eee', borderLeft: isRTL ? '1px solid #eee' : 'none', flexShrink: 0 }}>
        <h3 style={{ marginBottom: '20px', color: '#1a3c5e' }}>{t('filters')}</h3>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('search')}</label>
          <input value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} style={inputStyle} placeholder={t('searchPlaceholder')} />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('type')}</label>
          <select value={filters.listing_type} onChange={e => setFilters({...filters, listing_type: e.target.value})} style={selectStyle}>
            <option value="">-- {t('type')} --</option>
            <option value="rent">{t('forRent')}</option>
            <option value="sale">{t('forSale')}</option>
          </select>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('category')}</label>
          <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={selectStyle}>
            <option value="">-- {t('category')} --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('governorate')}</label>
          <select value={filters.governorate} onChange={e => setFilters({...filters, governorate: e.target.value, city: ''})} style={selectStyle}>
            <option value="">-- {t('governorate')} --</option>
            {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
          </select>
        </div>

        {cities.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('city')}</label>
            <select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} style={selectStyle}>
              <option value="">-- {t('city')} --</option>
              {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('bedrooms')}</label>
          <input type="number" value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})} style={inputStyle} min="1" />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('minPrice')}</label>
            <input type="number" value={filters.price_min} onChange={e => setFilters({...filters, price_min: e.target.value})} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>{t('maxPrice')}</label>
            <input type="number" value={filters.price_max} onChange={e => setFilters({...filters, price_max: e.target.value})} style={inputStyle} />
          </div>
        </div>

        <button onClick={handleFilter} style={{ width: '100%', padding: '10px', background: '#1a3c5e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '8px' }}>{t('applyFilters')}</button>
        <button onClick={handleClear} style={{ width: '100%', padding: '10px', background: 'white', color: '#1a3c5e', border: '1px solid #1a3c5e', borderRadius: '6px', cursor: 'pointer' }}>{t('clearFilters')}</button>
      </div>

      {/* Property Grid */}
      <div style={{ flex: 1, padding: '24px', background: '#f8f9fa' }}>
        <h2 style={{ marginBottom: '24px', color: '#1a3c5e' }}>{t('allProperties')}</h2>
        {loading ? (
          <p>{t('loading')}</p>
        ) : properties.length === 0 ? (
          <p style={{ color: '#666' }}>{t('noProperties')}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {properties.map(p => (
              <div key={p.id} onClick={() => navigate(`/properties/${p.id}`)} style={{
                background: 'white', borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.07)', cursor: 'pointer',
                transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' }
              }}>
                {/* Image */}
                <div style={{ height: '180px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                  {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
                </div>
                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ background: p.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4', color: p.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      {p.listing_type === 'rent' ? t('forRent') : t('forSale')}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#1a3c5e' }}>{p.price} {t('bd')}</span>
                  </div>
                  <h4 style={{ margin: '0 0 8px', color: '#2d3748' }}>{lang === 'ar' ? p.title_ar : p.title_en}</h4>
                  <p style={{ color: '#718096', fontSize: '13px', margin: '0 0 8px' }}>📍 {p.city_name}, {p.governorate_name}</p>
                  <div style={{ display: 'flex', gap: '12px', color: '#718096', fontSize: '13px' }}>
                    {p.bedrooms && <span>🛏 {p.bedrooms}</span>}
                    {p.bathrooms && <span>🚿 {p.bathrooms}</span>}
                    {p.area_sqm && <span>📐 {p.area_sqm} {t('sqm')}</span>}
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

export default PropertiesPage;
