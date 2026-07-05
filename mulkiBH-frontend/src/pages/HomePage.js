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
  const { bg, surface, border, text, subtext, heading, isDark } = useThemeColors();
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

  const selectStyle = { padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer', outline: 'none', width: '100%', color: '#4a5568' };

  return (
    <div style={{ background: bg }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a3c5e 0%, #2d6a9f 100%)', color: 'white', padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(200,169,81,0.08)', pointerEvents: 'none' }} />

        <h1 className="fade-in-up" style={{ fontSize: 'clamp(22px, 5vw, 38px)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('heroTitle')}
        </h1>
        <p className="fade-in-up delay-1" style={{ fontSize: 'clamp(14px, 3vw, 18px)', marginBottom: '36px', opacity: 0.85, maxWidth: '600px', margin: '0 auto 36px' }}>
          {t('heroSubtitle')}
        </p>

        {/* Search Box */}
        <div className="fade-in-up delay-2" style={{ background: 'white', borderRadius: '16px', padding: '20px', maxWidth: '860px', margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', marginBottom: '16px', background: '#f0f4f8', borderRadius: '8px', padding: '4px' }}>
            {['rent', 'sale'].map(type => (
              <button key={type} onClick={() => setFilters({...filters, listing_type: type})} style={{
                flex: 1, padding: '9px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px', transition: 'all 0.25s ease',
                background: filters.listing_type === type ? '#1a3c5e' : 'transparent',
                color: filters.listing_type === type ? 'white' : '#718096',
              }}>{type === 'rent' ? t('forRent') : t('forSale')}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <input value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder={t('searchPlaceholder')} style={selectStyle} />
            <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={selectStyle}>
              <option value="">{t('category')}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
            <select value={filters.governorate} onChange={e => setFilters({...filters, governorate: e.target.value})} style={selectStyle}>
              <option value="">{t('governorate')}</option>
              {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
            </select>
            <select value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})} style={selectStyle}>
              <option value="">{t('bedrooms')}</option>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
            <input type="number" value={filters.price_max} onChange={e => setFilters({...filters, price_max: e.target.value})} placeholder={t('maxPrice')} style={selectStyle} />
          </div>
          <button onClick={handleSearch} className="btn-gold" style={{ width: '100%', padding: '14px', background: '#c8a951', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>
            🔍 {t('search')}
          </button>
        </div>

        <div className="fade-in-up delay-3" style={{ marginTop: '24px' }}>
          <p style={{ opacity: 0.7, fontSize: '14px', marginBottom: '10px' }}>{lang === 'ar' ? "لا تجد ما تبحث عنه؟" : "Can't find what you're looking for?"}</p>
          <button onClick={() => navigate('/orders/create')} className="btn-primary" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.6)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            {t('postYourOrder')} →
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '56px 20px', background: isDark ? '#0d1c2b' : '#f0f4f8' }}>
        <h2 style={{ textAlign: 'center', color: heading, marginBottom: '8px', fontSize: 'clamp(20px, 3vw, 28px)' }}>
          {lang === 'ar' ? 'لماذا ملكي؟' : 'Why MulkiBH?'}
        </h2>
        <p style={{ textAlign: 'center', color: subtext, marginBottom: '36px', fontSize: '15px' }}>
          {lang === 'ar' ? 'المنصة العقارية الأولى في البحرين' : "Bahrain's premier real estate platform"}
        </p>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🏠', title: lang === 'ar' ? 'تصفح العقارات' : 'Browse Properties', desc: lang === 'ar' ? 'اعثر على عقارك المثالي من بين آلاف الإعلانات في البحرين' : 'Find your perfect property from thousands of listings across Bahrain' },
            { icon: '📋', title: lang === 'ar' ? 'أضف طلبك' : 'Post Your Order', desc: lang === 'ar' ? 'أخبرنا بما تريد ودع أصحاب العقارات يتواصلون معك' : 'Tell us what you need and let property owners come to you' },
            { icon: '🔔', title: lang === 'ar' ? 'تنبيهات فورية' : 'Instant Notifications', desc: lang === 'ar' ? 'احصل على تنبيهات فورية عبر البريد أو واتساب أو الموقع' : 'Get notified instantly via email, WhatsApp, or dashboard' },
          ].map((f, i) => (
            <div key={i} className={`feature-card fade-in-up delay-${i+1}`} style={{ background: surface, padding: '28px 20px', borderRadius: '12px', textAlign: 'center', boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${border}` }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '10px', color: heading, fontSize: '17px' }}>{f.title}</h3>
              <p style={{ color: subtext, lineHeight: '1.6', fontSize: '14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: '#1a3c5e', padding: '48px 20px', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px' }}>
          {[
            { num: '4', suffix: '', label: lang === 'ar' ? 'محافظات' : 'Governorates' },
            { num: '40', suffix: '+', label: lang === 'ar' ? 'منطقة' : 'Areas' },
            { num: '3', suffix: '', label: lang === 'ar' ? 'فئات عقارية' : 'Property Types' },
            { num: '100', suffix: '%', label: lang === 'ar' ? 'بحريني' : 'Bahrain Focused' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px', color: '#c8a951' }}>
                <AnimatedCounter target={s.num} suffix={s.suffix} />
              </p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
