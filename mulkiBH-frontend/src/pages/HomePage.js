/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { getCategories, getGovernorates } from '../api/properties';

const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseInt(target);
        if (isNaN(num)) { setCount(target); return; }
        const steps = 40;
        let current = 0;
        const timer = setInterval(() => {
          current += num / steps;
          if (current >= num) { setCount(num); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 1500 / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{typeof count === 'number' ? count : target}{suffix}</span>;
};

const HomePage = () => {
  const t = useT();
  const { lang } = useLang();
  const { bg, surface, border, subtext, heading, isDark } = useThemeColors();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [filters, setFilters] = useState({ listing_type: 'rent', search: '', category: '', governorate: '', price_max: '', bedrooms: '' });

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  };

  const selectStyle = {
    padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', background: 'white', cursor: 'pointer', outline: 'none',
    width: '100%', color: '#4a5568', fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div style={{ background: bg }}>

      {/* ── Hero ── */}
      <div style={{
        background: isDark
          ? 'linear-gradient(160deg, #060e18 0%, #0f2640 50%, #1a3c5e 100%)'
          : 'linear-gradient(160deg, #0a1929 0%, #0f2640 40%, #1a3c5e 100%)',
        color: 'white',
        padding: '80px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(200,169,81,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', border: '1px solid rgba(200,169,81,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', border: '1px solid rgba(200,169,81,0.06)', pointerEvents: 'none' }} />

        {/* Badge */}
        <div className="fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(200,169,81,0.12)', border: '1px solid rgba(200,169,81,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '24px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8a951', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#c8a951', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'المنصة العقارية الأولى في البحرين' : "Bahrain's #1 Real Estate Platform"}
          </span>
        </div>

        {/* Heading — Playfair Display */}
        <h1 className="fade-in-up heading-display" style={{
          fontSize: 'clamp(28px, 5vw, 52px)',
          marginBottom: '16px',
          lineHeight: '1.15',
          maxWidth: '700px',
          margin: '0 auto 16px',
          color: 'white',
        }}>
          {lang === 'ar' ? 'ابحث عن عقارك المثالي في البحرين' : 'Find Your Perfect Property in Bahrain'}
        </h1>

        <p className="fade-in-up delay-1" style={{
          fontSize: 'clamp(15px, 2.5vw, 18px)',
          marginBottom: '40px',
          opacity: 0.7,
          maxWidth: '520px',
          margin: '0 auto 40px',
          lineHeight: '1.7',
        }}>
          {lang === 'ar' ? 'تصفح العقارات أو أضف طلبك ودع أصحاب العقارات يتواصلون معك' : 'Browse listings or post what you need and let owners come to you'}
        </p>

        {/* Search Box */}
        <div className="fade-in-up delay-2" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          maxWidth: '880px',
          margin: '0 auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}>
          {/* Rent / Sale toggle */}
          <div style={{ display: 'flex', marginBottom: '16px', background: '#f0f4f8', borderRadius: '10px', padding: '4px', gap: '4px' }}>
            {['rent', 'sale'].map(type => (
              <button key={type} onClick={() => setFilters({...filters, listing_type: type})} style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px', fontFamily: 'inherit',
                background: filters.listing_type === type ? '#0f2640' : 'transparent',
                color: filters.listing_type === type ? 'white' : '#718096',
                transition: 'all 0.2s ease',
                boxShadow: filters.listing_type === type ? '0 2px 8px rgba(15,38,64,0.3)' : 'none',
              }}>{type === 'rent' ? (lang === 'ar' ? '🏠 للإيجار' : '🏠 For Rent') : (lang === 'ar' ? '🔑 للبيع' : '🔑 For Sale')}</button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <input value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder={lang === 'ar' ? 'ابحث...' : 'Search properties...'} style={selectStyle} />
            <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={selectStyle}>
              <option value="">{lang === 'ar' ? 'الفئة' : 'Category'}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
            <select value={filters.governorate} onChange={e => setFilters({...filters, governorate: e.target.value})} style={selectStyle}>
              <option value="">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</option>
              {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
            </select>
            <select value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})} style={selectStyle}>
              <option value="">{lang === 'ar' ? 'الغرف' : 'Bedrooms'}</option>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
            <input type="number" value={filters.price_max} onChange={e => setFilters({...filters, price_max: e.target.value})} placeholder={lang === 'ar' ? 'أقصى سعر (BD)' : 'Max price (BD)'} style={selectStyle} />
          </div>

          <button onClick={handleSearch} className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '10px', fontWeight: '700', letterSpacing: '0.3px' }}>
            🔍 {lang === 'ar' ? 'بحث عن العقارات' : 'Search Properties'}
          </button>
        </div>

        {/* Order CTA */}
        <div className="fade-in-up delay-3" style={{ marginTop: '28px' }}>
          <p style={{ opacity: 0.5, fontSize: '13px', marginBottom: '10px' }}>
            {lang === 'ar' ? 'لا تجد ما تبحث عنه؟' : "Can't find what you're looking for?"}
          </p>
          <button onClick={() => navigate('/orders/create')} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', fontSize: '14px', fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(200,169,81,0.4)'; e.currentTarget.style.color = '#c8a951'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          >
            {lang === 'ar' ? '📋 أضف طلبك الآن' : '📋 Post Your Order'} →
          </button>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div style={{ background: isDark ? '#0a1929' : '#0f2640', padding: '20px', borderBottom: '1px solid rgba(200,169,81,0.15)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', textAlign: 'center' }}>
          {[
            { num: '4', suffix: '', label: lang === 'ar' ? 'محافظات' : 'Governorates' },
            { num: '40', suffix: '+', label: lang === 'ar' ? 'منطقة' : 'Areas' },
            { num: '3', suffix: '', label: lang === 'ar' ? 'فئات عقارية' : 'Property Types' },
            { num: '100', suffix: '%', label: lang === 'ar' ? 'بحريني' : 'Bahrain Focused' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '10px' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 2px', color: '#c8a951', fontFamily: "'Playfair Display', serif" }}>
                <AnimatedCounter target={s.num} suffix={s.suffix} />
              </p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: '500', letterSpacing: '0.3px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ padding: '72px 20px', background: isDark ? '#060e18' : '#f0f4f8' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '2px', color: '#c8a951', textTransform: 'uppercase', marginBottom: '12px' }}>
            {lang === 'ar' ? 'لماذا تختارنا' : 'Why Choose Us'}
          </p>
          <h2 className="heading-display" style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: heading, marginBottom: '12px' }}>
            {lang === 'ar' ? 'المنصة العقارية الأذكى في البحرين' : 'The Smartest Way to Find Property'}
          </h2>
          <p style={{ color: subtext, fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
            {lang === 'ar' ? 'نوفر لك تجربة عقارية استثنائية' : "We've reimagined real estate for Bahrain"}
          </p>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {[
            {
              icon: '🏠',
              title: lang === 'ar' ? 'تصفح بذكاء' : 'Smart Browse',
              desc: lang === 'ar' ? 'فلاتر متقدمة للبحث حسب الموقع، السعر، الغرف والمزيد' : 'Advanced filters by location, price, bedrooms and more',
            },
            {
              icon: '📋',
              title: lang === 'ar' ? 'اطلب ما تريد' : 'Post Your Request',
              desc: lang === 'ar' ? 'أضف طلبك وسيتواصل معك أصحاب العقارات مباشرة' : 'Post what you need and let owners come directly to you',
            },
            {
              icon: '🔔',
              title: lang === 'ar' ? 'تنبيهات فورية' : 'Instant Alerts',
              desc: lang === 'ar' ? 'احصل على إشعارات فورية عند الرد على طلباتك' : 'Get notified the moment someone responds to your requests',
            },
          ].map((f, i) => (
            <div key={i} className={`feature-card fade-in-up delay-${i+1}`} style={{
              background: isDark ? '#0a1929' : 'white',
              padding: '32px 28px',
              borderRadius: '16px',
              border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}`,
              boxShadow: isDark ? 'none' : 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Gold accent line */}
              <div style={{ position: 'absolute', top: 0, left: '28px', right: '28px', height: '3px', background: 'linear-gradient(to right, #c8a951, #ddc06b)', borderRadius: '0 0 3px 3px' }} />
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ color: heading, fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: subtext, lineHeight: '1.7', fontSize: '14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ background: isDark ? '#0a1929' : '#0f2640', padding: '64px 20px', textAlign: 'center' }}>
        <h2 className="heading-display" style={{ fontSize: 'clamp(22px, 4vw, 36px)', color: 'white', marginBottom: '14px' }}>
          {lang === 'ar' ? 'هل أنت صاحب عقار أو مكتب عقاري؟' : 'Are you a property owner or agency?'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '28px', fontSize: '15px', maxWidth: '480px', margin: '0 auto 28px' }}>
          {lang === 'ar' ? 'انشر عقاراتك الآن واستقبل آلاف العملاء يومياً' : 'List your properties and reach thousands of potential tenants and buyers'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} className="btn-gold" style={{ padding: '13px 28px', fontSize: '15px', borderRadius: '10px', boxShadow: '0 4px 16px rgba(200,169,81,0.4)' }}>
            {lang === 'ar' ? 'ابدأ مجاناً' : 'Get Started Free'}
          </button>
          <button onClick={() => navigate('/properties')} style={{
            background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            padding: '13px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit',
          }}>
            {lang === 'ar' ? 'تصفح العقارات' : 'Browse Listings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
