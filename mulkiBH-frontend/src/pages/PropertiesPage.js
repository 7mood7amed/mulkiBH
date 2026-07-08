/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProperties, getCategories, getGovernorates, getCities } from '../api/properties';
import { useLang } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import Logo from '../components/common/Logo';

const PAGE_SIZE = 9;

const PropertiesPage = () => {
  const { lang } = useLang();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
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
      setPage(1);
    } catch {}
    setLoading(false);
  };

  const handleFilter = () => fetchProperties(filters);
  const handleClear = () => {
    const empty = { search: '', listing_type: '', category: '', governorate: '', city: '', price_min: '', price_max: '', bedrooms: '' };
    setFilters(empty); fetchProperties(empty);
  };

  const sorted = useMemo(() => {
    const list = [...properties];
    if (sort === 'price_asc') list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    else if (sort === 'price_desc') list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return list;
  }, [properties, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fieldStyle = { width: '100%', padding: '9px 12px', border: '1px solid #c4c6ce', borderRadius: '2px', background: '#f6fafe', fontSize: '13px', color: '#171c1f', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#44474d', marginBottom: '6px' };

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px 60px', display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) 1fr', gap: '24px', alignItems: 'start' }} className="properties-grid">
        {/* Sidebar */}
        <aside className="filters-sidebar" style={{ background: 'white', padding: '24px', borderRadius: '2px', boxShadow: '0 1px 3px rgba(15,38,64,0.08)', border: '1px solid rgba(196,198,206,0.3)', position: 'sticky', top: '88px' }}>
          <h2 className="heading-display" style={{ fontSize: '22px', color: '#0f2640', marginBottom: '24px' }}>
            {lang === 'ar' ? 'تحسين البحث' : 'Refine Search'}
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'كلمات مفتاحية' : 'Keywords'}</label>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#74777e', fontSize: '19px' }}>search</span>
              <input value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleFilter()} placeholder={lang === 'ar' ? 'فيلا، الجفير، إطلالة بحرية...' : 'Villa, Juffair, Sea View...'} style={{ ...fieldStyle, paddingLeft: '36px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'نوع العرض' : 'Listing Type'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[{ v: 'sale', l: lang === 'ar' ? 'بيع' : 'For Sale' }, { v: 'rent', l: lang === 'ar' ? 'إيجار' : 'For Rent' }].map(o => (
                <button key={o.v} onClick={() => setFilters({ ...filters, listing_type: filters.listing_type === o.v ? '' : o.v })} style={{
                  padding: '9px 8px', fontSize: '13px', fontWeight: '700', borderRadius: '2px', cursor: 'pointer', fontFamily: 'inherit',
                  border: `2px solid ${filters.listing_type === o.v ? '#0f2640' : '#c4c6ce'}`,
                  background: filters.listing_type === o.v ? '#0f2640' : 'transparent',
                  color: filters.listing_type === o.v ? 'white' : '#44474d', transition: 'all 0.2s ease',
                }}>{o.l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'الفئة' : 'Category'}</label>
            <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={fieldStyle}>
              <option value="">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
            <select value={filters.governorate} onChange={e => setFilters({ ...filters, governorate: e.target.value, city: '' })} style={fieldStyle}>
              <option value="">{lang === 'ar' ? 'اختر المحافظة' : 'Select Governorate'}</option>
              {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
            </select>
          </div>

          {cities.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>{lang === 'ar' ? 'المنطقة' : 'Area'}</label>
              <select value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} style={fieldStyle}>
                <option value="">{lang === 'ar' ? 'الكل' : 'All Areas'}</option>
                {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'نطاق السعر (د.ب)' : 'Price Range (BHD)'}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" value={filters.price_min} onChange={e => setFilters({ ...filters, price_min: e.target.value })} placeholder={lang === 'ar' ? 'أدنى' : 'Min'} style={fieldStyle} />
              <span style={{ color: '#74777e' }}>—</span>
              <input type="number" value={filters.price_max} onChange={e => setFilters({ ...filters, price_max: e.target.value })} placeholder={lang === 'ar' ? 'أقصى' : 'Max'} style={fieldStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'غرف النوم' : 'Bedrooms'}</label>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setFilters({ ...filters, bedrooms: filters.bedrooms === String(n) ? '' : String(n) })} style={{
                  flex: '0 0 auto', width: '40px', height: '40px', borderRadius: '2px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${filters.bedrooms === String(n) ? '#0f2640' : '#c4c6ce'}`,
                  background: filters.bedrooms === String(n) ? '#0f2640' : 'transparent',
                  color: filters.bedrooms === String(n) ? 'white' : '#44474d', transition: 'all 0.2s ease',
                }}>{n}+</button>
              ))}
            </div>
          </div>

          <button onClick={handleFilter} style={{ width: '100%', padding: '13px', background: '#c8a951', color: '#0f2640', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', boxShadow: '0 2px 10px rgba(200,169,81,0.3)', marginBottom: '10px' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.background = '#c8a951'}
          >{lang === 'ar' ? 'تطبيق الفلاتر' : 'Apply Filters'}</button>
          <button onClick={handleClear} style={{ width: '100%', background: 'none', border: 'none', color: '#74777e', fontSize: '13px', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '4px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {lang === 'ar' ? 'إعادة تعيين' : 'Reset All'}
          </button>
        </aside>

        {/* Content */}
        <section>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h1 className="heading-display" style={{ fontSize: 'clamp(28px,4vw,40px)', color: '#0f2640' }}>
                {lang === 'ar' ? 'قوائم حصرية' : 'Exclusive Listings'}
              </h1>
              {!loading && <p style={{ color: '#44474d', marginTop: '4px' }}>
                {lang === 'ar' ? `اكتشف ${sorted.length} عقاراً سيادياً سكنياً وتجارياً في البحرين.` : `Discover ${sorted.length} sovereign residential & commercial properties in Bahrain.`}
              </p>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#74777e', fontWeight: '600' }}>{lang === 'ar' ? 'ترتيب حسب:' : 'Sort By:'}</span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: 'transparent', border: 'none', fontWeight: '700', color: '#0f2640', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>
                <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest First'}</option>
                <option value="price_asc">{lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
                <option value="price_desc">{lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ background: 'white', borderRadius: '2px', overflow: 'hidden', border: '1px solid rgba(196,198,206,0.3)' }}>
                  <div className="skeleton" style={{ height: '224px' }} />
                  <div style={{ padding: '20px' }}>
                    <div className="skeleton" style={{ height: '14px', marginBottom: '12px', width: '70%' }} />
                    <div className="skeleton" style={{ height: '24px', width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#c4c6ce' }}>home_work</span>
              <h3 className="heading-display" style={{ color: '#0f2640', margin: '16px 0 8px', fontSize: '22px' }}>
                {lang === 'ar' ? 'لا توجد عقارات' : 'No properties found'}
              </h3>
              <p style={{ color: '#74777e', fontSize: '14px' }}>{lang === 'ar' ? 'جرب تغيير الفلاتر' : 'Try adjusting your filters'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
              {pageItems.map((p, i) => {
                const badge = p.is_featured ? (lang === 'ar' ? 'حصري' : 'Exclusive') : (p.listing_type === 'sale' ? (lang === 'ar' ? 'للبيع' : 'For Sale') : (lang === 'ar' ? 'للإيجار' : 'For Rent'));
                const badgeGold = p.is_featured || p.listing_type === 'sale';
                const fav = isFavorite(p.id);
                return (
                  <div key={p.id} className={`property-card fade-in-up delay-${Math.min(i + 1, 5)}`} style={{ background: 'white', borderRadius: '2px', border: '1px solid rgba(196,198,206,0.3)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,38,64,0.06)' }}>
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
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: fav ? '#ba1a1a' : 'white', transition: 'all 0.2s ease',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
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

          {!loading && totalPages > 1 && (
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: '40px', height: '40px', border: '1px solid #c4c6ce', borderRadius: '2px', background: 'white', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ width: '40px', height: '40px', borderRadius: '2px', fontWeight: '700', cursor: 'pointer', border: n === page ? 'none' : '1px solid #c4c6ce', background: n === page ? '#0f2640' : 'white', color: n === page ? 'white' : '#44474d' }}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: '40px', height: '40px', border: '1px solid #c4c6ce', borderRadius: '2px', background: 'white', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#0f2640', borderTop: '4px solid #c8a951', padding: '48px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
          <div>
            <div style={{ marginBottom: '16px' }}><Logo size="md" dark /></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7' }}>
              {lang === 'ar'
                ? 'الارتقاء بتجربة العقارات في مملكة البحرين من خلال الثقة السيادية وإدارة المحافظ الحصرية والتميز المعماري.'
                : 'Elevating the real estate experience in the Kingdom of Bahrain through sovereign trust, exclusive portfolio management, and architectural excellence.'}
            </p>
          </div>
          <div>
            <h4 style={{ color: '#ddc06b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '13px', marginBottom: '16px' }}>{lang === 'ar' ? 'التنقل' : 'Navigation'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[lang === 'ar' ? 'من نحن' : 'About Us', lang === 'ar' ? 'العقارات' : 'Properties', lang === 'ar' ? 'دليل العقارات' : 'Bahrain Real Estate Guide', lang === 'ar' ? 'أضف طلباً' : 'Post Order'].map((l, i) => (
                <a key={i} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#ddc06b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '13px', marginBottom: '16px' }}>{lang === 'ar' ? 'قانوني' : 'Legal'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service', lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', lang === 'ar' ? 'الدعم الفني' : 'Contact Support'].map((l, i) => (
                <a key={i} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#ddc06b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '13px', marginBottom: '16px' }}>{lang === 'ar' ? 'تواصل' : 'Connect'}</h4>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
              {['public', 'share', 'mail'].map(icon => <span key={icon} className="material-symbols-outlined" style={{ color: 'white', cursor: 'pointer' }}>{icon}</span>)}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px' }}>{lang === 'ar' ? 'اشترك للحصول على قوائم حصرية' : 'Subscribe for exclusive listings'}</p>
            <div style={{ display: 'flex' }}>
              <input type="email" placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} style={{ background: '#1a3c5e', border: 'none', color: 'white', fontSize: '12px', padding: '9px 10px', flexGrow: 1, outline: 'none', minWidth: 0 }} />
              <button style={{ background: '#c8a951', color: '#0f2640', border: 'none', padding: '9px 14px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>{lang === 'ar' ? 'اشترك' : 'Join'}</button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1280px', margin: '32px auto 0', paddingTop: '24px', borderTop: '1px solid #1a3c5e', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{lang === 'ar' ? '© 2026 ملكي. جميع الحقوق محفوظة.' : '© 2026 MulkiBH. All rights reserved. Sovereign Real Estate Excellence.'}</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            <span>RERA License: B202400/001</span>
            <span>CR: 123456-7</span>
          </div>
        </div>
      </footer>

      <style>{`
        .property-card:hover .property-image { transform: scale(1.05); }
        @media (max-width: 900px) {
          .properties-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
export default PropertiesPage;
