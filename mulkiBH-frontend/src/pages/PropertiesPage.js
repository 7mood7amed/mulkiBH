/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getProperties, getCategories, getGovernorates, getCities } from '../api/properties';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useFavorites } from '../context/FavoritesContext';
import Footer from '../components/layout/Footer';

const Icon = ({ name, fill, size = 20, style = {} }) => (
  <span className={`material-symbols-outlined ${fill ? 'ms-fill' : ''}`} style={{ fontSize: size, ...style }}>{name}</span>
);

const selectStyle = {
  width: '100%', padding: '10px 12px', background: 'var(--surface-low)',
  border: '1px solid rgba(196,198,206,0.6)', borderRadius: '8px',
  fontSize: '13px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};
const groupLabel = { fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--outline)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' };

const FilterPanel = ({ ar, filters, setFilters, categories, governorates, cities, handleApply, handleClear }) => (
  <div>
    <p className="label-md" style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon name="tune" size={17} /> {ar ? 'تصفية النتائج' : 'FILTER BY'}
    </p>

    {/* Status toggle */}
    <div style={{ marginBottom: '22px' }}>
      <label style={groupLabel}>{ar ? 'الحالة' : 'Property Status'}</label>
      <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-mid)', padding: '4px', borderRadius: '8px' }}>
        {[{ v: '', l: ar ? 'الكل' : 'All' }, { v: 'rent', l: ar ? 'إيجار' : 'For Rent' }, { v: 'sale', l: ar ? 'بيع' : 'For Sale' }].map(o => (
          <button key={o.v} onClick={() => setFilters({ ...filters, listing_type: o.v })} style={{
            flex: 1, padding: '8px 4px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '12px', fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.2s',
            background: filters.listing_type === o.v ? '#001125' : 'transparent',
            color: filters.listing_type === o.v ? 'white' : 'var(--text-variant)',
          }}>{o.l}</button>
        ))}
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <label style={groupLabel}>{ar ? 'بحث' : 'Search'}</label>
      <input value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} style={selectStyle} placeholder={ar ? 'ابحث...' : 'Keywords...'} />
    </div>

    <div style={{ marginBottom: '20px' }}>
      <label style={groupLabel}>{ar ? 'الموقع' : 'Location'}</label>
      <select value={filters.governorate} onChange={e => setFilters({ ...filters, governorate: e.target.value, city: '' })} style={{ ...selectStyle, marginBottom: '8px' }}>
        <option value="">{ar ? 'كل المحافظات' : 'All Governorates'}</option>
        {governorates.map(g => <option key={g.id} value={g.id}>{ar ? g.name_ar : g.name_en}</option>)}
      </select>
      {cities.length > 0 && (
        <select value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} style={selectStyle}>
          <option value="">{ar ? 'كل المناطق' : 'All Areas'}</option>
          {cities.map(c => <option key={c.id} value={c.id}>{ar ? c.name_ar : c.name_en}</option>)}
        </select>
      )}
    </div>

    <div style={{ marginBottom: '20px' }}>
      <label style={groupLabel}>{ar ? 'نوع العقار' : 'Property Type'}</label>
      <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={selectStyle}>
        <option value="">{ar ? 'كل الأنواع' : 'All Types'}</option>
        {categories.map(c => <option key={c.id} value={c.id}>{ar ? c.name_ar : c.name_en}</option>)}
      </select>
    </div>

    {/* Bedrooms pills */}
    <div style={{ marginBottom: '20px' }}>
      <label style={groupLabel}>{ar ? 'غرف النوم' : 'Bedrooms'}</label>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[{ v: '', l: ar ? 'أي' : 'Any' }, { v: '1', l: '1+' }, { v: '2', l: '2+' }, { v: '3', l: '3+' }, { v: '4', l: '4+' }].map(o => (
          <button key={o.v} onClick={() => setFilters({ ...filters, bedrooms: o.v })} style={{
            padding: '7px 14px', borderRadius: '999px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            fontFamily: 'inherit', transition: 'all 0.2s',
            border: filters.bedrooms === o.v ? '1px solid #001125' : '1px solid rgba(196,198,206,0.6)',
            background: filters.bedrooms === o.v ? '#001125' : 'transparent',
            color: filters.bedrooms === o.v ? 'white' : 'var(--text-variant)',
          }}>{o.l}</button>
        ))}
      </div>
    </div>

    <div style={{ marginBottom: '26px' }}>
      <label style={groupLabel}>{ar ? 'نطاق السعر (BD)' : 'Price Range (BHD)'}</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <input type="number" value={filters.price_min} onChange={e => setFilters({ ...filters, price_min: e.target.value })} style={selectStyle} placeholder={ar ? 'من' : 'Min'} />
        <input type="number" value={filters.price_max} onChange={e => setFilters({ ...filters, price_max: e.target.value })} style={selectStyle} placeholder={ar ? 'إلى' : 'Max'} />
      </div>
    </div>

    <button onClick={handleApply} className="btn-gold" style={{ width: '100%', padding: '13px', marginBottom: '10px' }}>
      {ar ? 'تطبيق الفلاتر' : 'Apply Filters'}
    </button>
    <button onClick={handleClear} style={{
      width: '100%', padding: '11px', background: 'transparent', color: 'var(--outline)',
      border: '1px solid rgba(196,198,206,0.5)', borderRadius: '8px', cursor: 'pointer',
      fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
    }}>{ar ? 'مسح الكل' : 'Reset All'}</button>
  </div>
);

const PropertiesPage = () => {
  const { lang } = useLang();
  const { isDark } = useThemeColors();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ar = lang === 'ar';

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
    city: '',
    price_min: searchParams.get('price_min') || '',
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

  const handleApply = () => { fetchProperties(filters); setShowFilters(false); };
  const handleClear = () => {
    const empty = { search: '', listing_type: '', category: '', governorate: '', city: '', price_min: '', price_max: '', bedrooms: '' };
    setFilters(empty); fetchProperties(empty); setShowFilters(false);
  };


  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 72px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px clamp(20px,5vw,64px) 64px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--outline)', marginBottom: '20px' }}>
          <Link to="/" style={{ color: 'var(--outline)' }}>{ar ? 'الرئيسية' : 'Home'}</Link>
          <Icon name="chevron_right" size={15} />
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{ar ? 'العقارات' : 'Properties'}</span>
        </div>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <div>
            <h1 className="headline-xl" style={{ color: 'var(--primary)', fontSize: 'clamp(28px,4vw,40px)', marginBottom: '6px' }}>
              {ar ? 'إعلانات حصرية' : 'Exclusive Listings'}
            </h1>
            {!loading && (
              <p style={{ color: 'var(--text-variant)', fontSize: '14px' }}>
                {properties.length} {ar ? 'عقار متاح' : 'exceptional properties available'}
              </p>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="mobile-nav btn-navy" style={{ padding: '10px 20px', display: 'none', alignItems: 'center', gap: '8px' }}>
            <Icon name="tune" size={17} /> {ar ? 'الفلاتر' : 'Filters'}
          </button>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="luxury-card slide-in-down" style={{ padding: '24px', marginBottom: '24px' }}>
            <FilterPanel ar={ar} filters={filters} setFilters={setFilters} categories={categories} governorates={governorates} cities={cities} handleApply={handleApply} handleClear={handleClear} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside className="desktop-sidebar luxury-card" style={{ width: '280px', padding: '26px 22px', flexShrink: 0, position: 'sticky', top: '92px' }}>
            <FilterPanel ar={ar} filters={filters} setFilters={setFilters} categories={categories} governorates={governorates} cities={cities} handleApply={handleApply} handleClear={handleClear} />
          </aside>

          {/* Grid */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="luxury-card" style={{ overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: '256px', borderRadius: 0 }} />
                    <div style={{ padding: '18px' }}>
                      <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '10px' }} />
                      <div className="skeleton" style={{ height: '20px', width: '45%', marginBottom: '10px' }} />
                      <div className="skeleton" style={{ height: '13px', width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="luxury-card" style={{ textAlign: 'center', padding: '80px 24px' }}>
                <Icon name="home_work" size={52} style={{ color: 'var(--outline-var)', marginBottom: '16px' }} />
                <h3 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
                  {ar ? 'لا توجد عقارات' : 'No properties found'}
                </h3>
                <p style={{ color: 'var(--text-variant)', fontSize: '14px' }}>{ar ? 'جرب تعديل الفلاتر' : 'Try adjusting your filters'}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {properties.map((p, i) => (
                  <div key={p.id} className={`property-card fade-in-up delay-${Math.min(i + 1, 5)}`} onClick={() => navigate(`/properties/${p.id}`)}>
                    <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                      {p.main_image
                        ? <img className="card-img" src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f2640, #1a3c5e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="villa" size={48} style={{ color: 'rgba(255,255,255,0.25)' }} /></div>}
                      <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
                        <span className="badge-pill" style={{ background: p.listing_type === 'rent' ? '#001125' : '#745b04', color: 'white' }}>
                          {p.listing_type === 'rent' ? (ar ? 'للإيجار' : 'FOR RENT') : (ar ? 'للبيع' : 'FOR SALE')}
                        </span>
                        {p.status && p.status !== 'available' && (
                          <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: '#001125', border: '1px solid rgba(196,198,206,0.3)' }}>{p.status}</span>
                        )}
                      </div>
                      <button onClick={e => { e.stopPropagation(); toggleFavorite(p); }} style={{
                        position: 'absolute', top: '14px', right: '14px', width: '38px', height: '38px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                        border: 'none', borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isFavorite(p.id) ? '#ba1a1a' : 'white', transition: 'all 0.3s',
                      }}>
                        <Icon name="favorite" fill={isFavorite(p.id)} size={19} />
                      </button>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 className="headline-md" style={{ color: 'var(--primary)', fontSize: '18px', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ar ? p.title_ar : p.title_en}
                      </h3>
                      <p className="heading-display" style={{ color: 'var(--gold-text)', fontSize: '19px', marginBottom: '10px' }}>
                        BHD {Number(p.price).toLocaleString()}{p.listing_type === 'rent' && <span style={{ fontSize: '11px', fontFamily: 'Inter', fontWeight: 500, color: 'var(--outline)' }}> /{ar ? 'شهر' : 'mo'}</span>}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-variant)', fontSize: '13px', marginBottom: '14px' }}>
                        <Icon name="location_on" size={15} style={{ color: 'var(--outline)' }} />
                        {p.city_name}, {p.governorate_name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '13px', borderTop: '1px solid rgba(196,198,206,0.25)' }}>
                        {p.bedrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-variant)', fontWeight: 600 }}><Icon name="bed" size={17} style={{ color: 'var(--outline)' }} /> {p.bedrooms} {ar ? '' : 'Beds'}</span>}
                        {p.bathrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-variant)', fontWeight: 600 }}><Icon name="bathtub" size={17} style={{ color: 'var(--outline)' }} /> {p.bathrooms} {ar ? '' : 'Baths'}</span>}
                        {p.area_sqm && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-variant)', fontWeight: 600 }}><Icon name="square_foot" size={17} style={{ color: 'var(--outline)' }} /> {p.area_sqm} m²</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
