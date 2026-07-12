/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { getCategories, getGovernorates, getProperties } from '../api/properties';
import { useFavorites } from '../context/FavoritesContext';
import Footer from '../components/layout/Footer';

const Icon = ({ name, fill, size = 20, style = {} }) => (
  <span className={`material-symbols-outlined ${fill ? 'ms-fill' : ''}`} style={{ fontSize: size, ...style }}>{name}</span>
);

const HomePage = () => {
  const { lang } = useLang();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const ar = lang === 'ar';

  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [filters, setFilters] = useState({ listing_type: 'rent', category: '', governorate: '', bedrooms: '', price_max: '' });

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
    getProperties({}).then(r => setFeatured(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  };

  const selectStyle = {
    width: '100%', padding: '12px 14px',
    background: 'var(--surface-low)', border: '1px solid rgba(196,198,206,0.6)',
    borderRadius: '8px', fontSize: '14px', color: 'var(--text)',
    fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
  };
  const labelStyle = { fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--outline)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' };

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        position: 'relative', background: '#001125', color: 'white',
        minHeight: '560px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'visible', paddingBottom: '140px', paddingTop: '64px',
      }}>
        {/* Circles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="hero-circle" style={{ width: '800px', height: '800px', top: '-384px', right: '-384px' }} />
          <div className="hero-circle" style={{ width: '600px', height: '600px', bottom: '-192px', left: '-192px' }} />
          <div className="hero-circle" style={{ width: '400px', height: '400px', top: '50%', left: '25%', opacity: 0.5 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '1024px', padding: '0 20px', width: '100%' }}>
          {/* Badge */}
          <div className="fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(228,195,104,0.35)', background: 'rgba(228,195,104,0.08)', borderRadius: '999px', padding: '6px 18px', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e4c368' }} />
            <span className="label-md" style={{ color: '#e4c368', fontSize: '11px' }}>
              {ar ? 'المنصة العقارية الأولى في البحرين' : "Bahrain's #1 Premium Real Estate Platform"}
            </span>
          </div>

          <h1 className="headline-xl fade-in-up" style={{ color: 'white', marginBottom: '20px' }}>
            {ar ? 'ابحث عن منزل أحلامك في المملكة' : 'Find Your Dream Home in the Kingdom'}
          </h1>
          <p className="fade-in-up delay-1" style={{ fontSize: 'clamp(15px,2.4vw,18px)', color: 'rgba(255,255,255,0.75)', maxWidth: '640px', margin: '0 auto 56px', lineHeight: 1.7 }}>
            {ar
              ? 'اكتشف مجموعة حصرية من المساكن الراقية والأصول التجارية في أرقى محافظات البحرين.'
              : "Discover an exclusive collection of high-end residences and commercial assets across Bahrain's most prestigious governorates."}
          </p>

          {/* ── Search card (overlapping) ── */}
          <div className="fade-in-up delay-2 luxury-shadow" style={{
            background: 'var(--surface)', color: 'var(--text)', textAlign: 'left',
            borderRadius: '12px', padding: 'clamp(20px, 3vw, 32px)',
            border: '1px solid rgba(196,198,206,0.3)',
            maxWidth: '1000px', margin: '0 auto', marginBottom: '-190px',
            position: 'relative', zIndex: 20,
            boxShadow: '0 24px 64px rgba(0,10,25,0.35)',
          }}>
            {/* Rent / Sale toggle */}
            <div style={{ display: 'inline-flex', gap: '4px', background: 'var(--surface-mid)', padding: '4px', borderRadius: '8px', marginBottom: '24px' }}>
              {['sale', 'rent'].map(type => (
                <button key={type} onClick={() => setFilters({ ...filters, listing_type: type })} className="label-md" style={{
                  padding: '9px 26px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                  background: filters.listing_type === type ? '#001125' : 'transparent',
                  color: filters.listing_type === type ? 'white' : 'var(--text-variant)',
                }}>
                  {type === 'rent' ? (ar ? 'إيجار' : 'Rent') : (ar ? 'بيع' : 'Sale')}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              <div>
                <label style={labelStyle}>{ar ? 'الفئة' : 'Category'}</label>
                <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={selectStyle}>
                  <option value="">{ar ? 'الكل' : 'All'}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{ar ? c.name_ar : c.name_en}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{ar ? 'المحافظة' : 'Governorate'}</label>
                <select value={filters.governorate} onChange={e => setFilters({ ...filters, governorate: e.target.value })} style={selectStyle}>
                  <option value="">{ar ? 'الكل' : 'All'}</option>
                  {governorates.map(g => <option key={g.id} value={g.id}>{ar ? g.name_ar : g.name_en}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{ar ? 'الغرف' : 'Bedrooms'}</label>
                <select value={filters.bedrooms} onChange={e => setFilters({ ...filters, bedrooms: e.target.value })} style={selectStyle}>
                  <option value="">{ar ? 'أي عدد' : 'Any'}</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{ar ? 'أقصى سعر (BD)' : 'Max Price (BHD)'}</label>
                <input type="number" value={filters.price_max}
                  onChange={e => setFilters({ ...filters, price_max: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder={ar ? 'بدون حد' : 'No Max'} style={selectStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={handleSearch} className="btn-navy" style={{ width: '100%', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Icon name="search" size={18} />
                  {ar ? 'بحث' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section style={{ padding: '240px clamp(20px,5vw,64px) 48px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '32px',
          textAlign: 'center', borderTop: '1px solid rgba(196,198,206,0.3)', borderBottom: '1px solid rgba(196,198,206,0.3)',
          padding: '48px 0',
        }}>
          {[
            { num: '4', label: ar ? 'محافظات' : 'Governorates' },
            { num: '40+', label: ar ? 'منطقة مغطاة' : 'Areas Covered' },
            { num: '3', label: ar ? 'فئات عقارية' : 'Property Types' },
            { num: '100%', label: ar ? 'تركيز بحريني' : 'Bahrain Focused' },
          ].map((s, i) => (
            <div key={i} className={`fade-in-up delay-${i + 1}`}>
              <div className="headline-lg" style={{ color: 'var(--primary)' }}>{s.num}</div>
              <div className="label-md" style={{ color: 'var(--outline)', marginTop: '4px', fontSize: '12px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURED PROPERTIES ═══ */}
      {featured.length > 0 && (
        <section style={{ padding: '24px clamp(20px,5vw,64px) 64px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="label-md" style={{ color: 'var(--gold-text)', marginBottom: '12px', fontSize: '11px' }}>
              {ar ? 'مجموعات مختارة' : 'CURATED COLLECTIONS'}
            </p>
            <h2 className="headline-lg" style={{ color: 'var(--primary)' }}>
              {ar ? 'استكشف عقاراتنا الحصرية' : 'Explore Our Exclusive Properties'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
            {featured.map((p, i) => (
              <div key={p.id} className={`property-card fade-in-up delay-${i + 1}`} onClick={() => navigate(`/properties/${p.id}`)}>
                <div style={{ position: 'relative', height: '256px', overflow: 'hidden' }}>
                  {p.main_image
                    ? <img className="card-img" src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f2640, #1a3c5e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="villa" size={56} style={{ color: 'rgba(255,255,255,0.25)' }} /></div>}
                  <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                    <span className="badge-pill" style={{ background: p.listing_type === 'rent' ? '#001125' : '#745b04', color: 'white' }}>
                      {p.listing_type === 'rent' ? (ar ? 'للإيجار' : 'FOR RENT') : (ar ? 'للبيع' : 'FOR SALE')}
                    </span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFavorite(p); }} style={{
                    position: 'absolute', top: '16px', right: '16px', width: '40px', height: '40px',
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                    border: 'none', borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isFavorite(p.id) ? '#ba1a1a' : 'white', transition: 'all 0.3s',
                  }}>
                    <Icon name="favorite" fill={isFavorite(p.id)} size={20} />
                  </button>
                </div>
                <div style={{ padding: '18px' }}>
                  <h3 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '19px' }}>
                    {ar ? p.title_ar : p.title_en}
                  </h3>
                  <p className="heading-display" style={{ color: 'var(--gold-text)', fontSize: '20px', marginBottom: '12px' }}>
                    BHD {Number(p.price).toLocaleString()}{p.listing_type === 'rent' && <span style={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: 500, color: 'var(--outline)' }}> /{ar ? 'شهر' : 'mo'}</span>}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-variant)', fontSize: '13px', marginBottom: '16px' }}>
                    <Icon name="location_on" size={15} style={{ color: 'var(--outline)' }} />
                    {p.city_name}, {p.governorate_name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(196,198,206,0.25)' }}>
                    {p.bedrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-variant)' }}><Icon name="bed" size={17} style={{ color: 'var(--outline)' }} /> {p.bedrooms}</span>}
                    {p.bathrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-variant)' }}><Icon name="bathtub" size={17} style={{ color: 'var(--outline)' }} /> {p.bathrooms}</span>}
                    {p.area_sqm && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-variant)' }}><Icon name="square_foot" size={17} style={{ color: 'var(--outline)' }} /> {p.area_sqm} m²</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ WHY MULKIBH ═══ */}
      <section style={{ padding: '48px clamp(20px,5vw,64px) 64px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
          <div>
            <p className="label-md" style={{ color: 'var(--gold-text)', marginBottom: '12px', fontSize: '11px' }}>
              {ar ? 'معيار ملكي' : 'THE MULKIBH STANDARD'}
            </p>
            <h2 className="headline-lg" style={{ color: 'var(--primary)', marginBottom: '12px' }}>
              {ar ? 'التميز السيادي' : 'Sovereign Excellence'}
            </h2>
            <p style={{ color: 'var(--text-variant)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
              {ar ? 'نجمع بين التراث المحلي والمعايير العالمية لتقديم تجربة عقارية لا مثيل لها في البحرين.' : 'We combine local heritage with global standards to deliver an unparalleled real estate experience in Bahrain.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: 'verified', title: ar ? 'إعلانات موثقة' : 'Verified Listings', desc: ar ? 'كل عقار على منصتنا يخضع لعملية تدقيق صارمة لضمان الدقة والمصداقية وراحة البال.' : 'Every property on our platform undergoes a rigorous vetting process to ensure accuracy, authenticity, and peace of mind.' },
            { icon: 'campaign', title: ar ? 'نشر الطلبات مباشرة' : 'Direct Order Posting', desc: ar ? 'انشر ما تبحث عنه ودع أصحاب العقارات والوكالات يتواصلون معك مباشرة بعروضهم.' : 'Post what you need and let property owners and agencies come directly to you with their offers.' },
            { icon: 'workspace_premium', title: ar ? 'تجربة مميزة' : 'Premium Experience', desc: ar ? 'واجهة ثنائية اللغة وتنبيهات فورية وتواصل مباشر عبر واتساب لتجربة سلسة.' : 'A bilingual interface, instant notifications, and direct WhatsApp contact for a seamless journey.' },
          ].map((f, i) => (
            <div key={i} className={`luxury-card fade-in-up delay-${i + 1}`} style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(to right, #c8a951, #e4c368)' }} />
              <div style={{ width: '56px', height: '56px', background: '#001125', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Icon name={f.icon} fill size={24} style={{ color: 'white' }} />
              </div>
              <h3 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '14px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-variant)', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '0 clamp(20px,5vw,64px) 80px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          background: '#001125', borderRadius: '24px', padding: 'clamp(40px, 6vw, 80px)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px',
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}>
            <div className="hero-circle" style={{ width: '400px', height: '400px', top: '-80px', right: '-80px' }} />
            <div className="hero-circle" style={{ width: '250px', height: '250px', bottom: '-60px', right: '120px' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '560px' }}>
            <h2 className="headline-xl" style={{ color: 'white', marginBottom: '18px', fontSize: 'clamp(26px,4vw,40px)' }}>
              {ar ? 'هل أنت صاحب عقار؟' : 'Ready to List Your Property?'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: 1.7 }}>
              {ar ? 'انضم إلى شبكة العقارات النخبوية في المملكة. اوصل إلى آلاف المشترين والمستثمرين المؤهلين.' : "Join the Kingdom's most elite real estate network. Reach thousands of qualified buyers and investors seeking premium opportunities."}
            </p>
          </div>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} className="btn-gold" style={{ padding: '16px 40px', fontSize: '14px' }}>
              {ar ? 'انشر عقارك' : 'List Your Property'}
            </button>
            <button onClick={() => navigate('/properties')} className="btn-ghost" style={{ padding: '16px 40px', fontSize: '14px' }}>
              {ar ? 'تصفح العقارات' : 'Browse Listings'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
