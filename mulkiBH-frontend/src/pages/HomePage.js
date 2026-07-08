/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { getCategories, getGovernorates } from '../api/properties';
import Logo from '../components/common/Logo';

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
  const { lang } = useLang();
  const { border, subtext, heading, isDark } = useThemeColors();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [filters, setFilters] = useState({ listing_type: 'sale', category: '', governorate: '', bedrooms: '', price_max: '' });

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  };

  const fieldStyle = {
    background: 'rgba(6,14,24,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', padding: '12px', borderRadius: '6px', fontSize: '14px',
    outline: 'none', width: '100%', fontFamily: 'inherit', appearance: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s ease',
  };
  const fieldLabelStyle = { color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500', marginBottom: '8px', display: 'block' };

  const stats = [
    { num: '4', suffix: '', label: lang === 'ar' ? 'محافظات' : 'Governorates' },
    { num: '40', suffix: '+', label: lang === 'ar' ? 'منطقة مغطاة' : 'Areas covered' },
    { num: '2.5', suffix: 'k', label: lang === 'ar' ? 'عقار نشط' : 'Active Listings', static: true },
    { num: '98', suffix: '%', label: lang === 'ar' ? 'رضا العملاء' : 'Client Satisfaction' },
  ];

  const features = [
    {
      icon: 'verified_user',
      title: lang === 'ar' ? 'عقارات موثقة' : 'Verified Listings',
      desc: lang === 'ar'
        ? 'تخضع كل قائمة لعملية تحقق دقيقة تضمن صحة البيانات والامتثال القانوني لراحة بالك.'
        : 'Every listing undergoes a rigorous verification process ensuring data accuracy and legal compliance for your peace of mind.',
    },
    {
      icon: 'real_estate_agent',
      title: lang === 'ar' ? 'وصول حصري' : 'Exclusive Access',
      desc: lang === 'ar'
        ? 'احصل على وصول مبكر للمشاريع خارج السوق والعقارات الفاخرة قبل وصولها للجمهور.'
        : 'Gain early access to off-market developments and luxury estates before they reach the general public market.',
    },
    {
      icon: 'insights',
      title: lang === 'ar' ? 'تحليلات السوق' : 'Market Analytics',
      desc: lang === 'ar'
        ? 'رؤى مبنية على البيانات واتجاهات الأسعار التاريخية لتمكين قراراتك الاستثمارية في اقتصاد المملكة المزدهر.'
        : "Data-driven insights and historical pricing trends to empower your investment decisions in the Kingdom's thriving economy.",
    },
  ];

  return (
    <div>

      {/* ── Hero ── */}
      <section style={{
        background: 'radial-gradient(circle at top right, #1A3C5E 0%, #0F2640 40%, #060E18 100%)',
        color: 'white',
        padding: '110px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '86vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Ambient glow blobs */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: '384px', height: '384px', background: '#c8a951', borderRadius: '50%', filter: 'blur(128px)', top: '-80px', left: '-80px', animation: 'pulse 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: '320px', height: '320px', background: '#2d6a9f', borderRadius: '50%', filter: 'blur(128px)', bottom: '40px', right: '40px', animation: 'pulse 3s ease-in-out infinite', animationDelay: '2s' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          {/* Badge */}
          <div className="fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(26,60,94,0.5)', border: '1px solid rgba(200,169,81,0.3)', borderRadius: '999px', padding: '6px 16px', marginBottom: '32px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8a951', boxShadow: '0 0 8px #c8a951', display: 'inline-block' }} />
            <span style={{ color: '#c8a951', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              {lang === 'ar' ? 'المنصة العقارية الأولى في البحرين' : "Bahrain's #1 Real Estate Platform"}
            </span>
          </div>

          {/* Heading — Playfair Display */}
          <h1 className="fade-in-up heading-display" style={{
            fontSize: 'clamp(32px, 6vw, 60px)',
            marginBottom: '32px',
            lineHeight: '1.15',
            color: 'white',
          }}>
            {lang === 'ar' ? (
              <>ابحث عن <span style={{ color: '#c8a951', fontStyle: 'italic' }}>منزل أحلامك</span> في المملكة</>
            ) : (
              <>Find Your Dream <span style={{ color: '#c8a951', fontStyle: 'italic' }}>Home</span><br className="hide-mobile" /> in the Kingdom</>
            )}
          </h1>

          {/* Search Bento — glass card */}
          <div className="fade-in-up delay-2" style={{
            width: '100%',
            maxWidth: '900px',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(200,169,81,0.2)',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            boxSizing: 'border-box',
          }}>
            {/* Buy / Rent toggle */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {['sale', 'rent'].map(type => (
                <button key={type} onClick={() => setFilters({ ...filters, listing_type: type })} style={{
                  padding: '10px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '14px',
                  fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s ease',
                  background: filters.listing_type === type ? '#c8a951' : 'transparent',
                  color: filters.listing_type === type ? '#0f2640' : 'white',
                  border: filters.listing_type === type ? 'none' : '1px solid rgba(255,255,255,0.2)',
                }}>
                  {type === 'sale' ? (lang === 'ar' ? 'شراء' : 'Buy') : (lang === 'ar' ? 'إيجار' : 'Rent')}
                </button>
              ))}
            </div>

            {/* Filters Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', alignItems: 'end', textAlign: 'left' }}>
              <div>
                <label style={fieldLabelStyle}>{lang === 'ar' ? 'الفئة' : 'Category'}</label>
                <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={fieldStyle}>
                  <option value="">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
                </select>
              </div>
              <div>
                <label style={fieldLabelStyle}>{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
                <select value={filters.governorate} onChange={e => setFilters({ ...filters, governorate: e.target.value })} style={fieldStyle}>
                  <option value="">{lang === 'ar' ? 'كل المحافظات' : 'All Governorates'}</option>
                  {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
                </select>
              </div>
              <div>
                <label style={fieldLabelStyle}>{lang === 'ar' ? 'غرف النوم' : 'Bedrooms'}</label>
                <select value={filters.bedrooms} onChange={e => setFilters({ ...filters, bedrooms: e.target.value })} style={fieldStyle}>
                  <option value="">{lang === 'ar' ? 'أي عدد' : 'Any'}</option>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+ {lang === 'ar' ? 'غرف' : 'Beds'}</option>)}
                </select>
              </div>
              <div>
                <label style={fieldLabelStyle}>{lang === 'ar' ? 'أقصى سعر (د.ب)' : 'Max Price (BHD)'}</label>
                <input type="number" value={filters.price_max} onChange={e => setFilters({ ...filters, price_max: e.target.value })} placeholder={lang === 'ar' ? 'بدون حد' : 'No Max'} style={fieldStyle} />
              </div>
              <button onClick={handleSearch} style={{
                width: '100%', background: '#c8a951', color: '#0f2640', fontWeight: '700',
                padding: '14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#ddc06b'}
                onMouseLeave={e => e.currentTarget.style.background = '#c8a951'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                <span>{lang === 'ar' ? 'ابحث عن عقار' : 'Search Properties'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: isDark ? '#0a1929' : 'white', padding: '48px 20px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-item" style={{ textAlign: 'center', padding: '0 16px', borderLeft: i > 0 ? `1px solid ${border}` : 'none' }}>
              <p className="heading-display stat-number" style={{ fontSize: '36px', color: heading, margin: '0 0 6px', transition: 'color 0.2s ease' }}>
                {s.static ? `${s.num}${s.suffix}` : <AnimatedCounter target={s.num} suffix={s.suffix} />}
              </p>
              <p style={{ margin: 0, color: subtext, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features: Sovereign Excellence ── */}
      <section style={{ padding: '96px 20px', background: isDark ? '#060e18' : '#f0f4f8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto 64px', textAlign: 'center' }}>
          <h2 className="heading-display" style={{ fontSize: 'clamp(26px, 4vw, 36px)', color: heading, marginBottom: '16px' }}>
            {lang === 'ar' ? 'التميز السيادي' : 'Sovereign Excellence'}
          </h2>
          <p style={{ color: subtext, maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}>
            {lang === 'ar'
              ? 'اكتشف الركائز التي تجعل ملكي البوابة الأكثر موثوقية للاستثمار العقاري في البحرين.'
              : 'Discover the pillars that make MulkiBH the most trusted gateway to real estate investments in Bahrain.'}
          </p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <div key={i} className={`feature-card fade-in-up delay-${i + 1}`} style={{
              background: isDark ? '#0a1929' : 'white',
              padding: '32px',
              borderTop: '4px solid #c8a951',
              boxShadow: isDark ? 'none' : 'var(--shadow-sm)',
            }}>
              <div style={{ width: '48px', height: '48px', background: '#0f2640', color: '#c8a951', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', marginBottom: '24px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{f.icon}</span>
              </div>
              <h3 className="heading-display" style={{ color: heading, fontSize: '22px', marginBottom: '16px' }}>{f.title}</h3>
              <p style={{ color: subtext, lineHeight: '1.7', fontSize: '15px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA: Ready to List? ── */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#0f2640', display: 'flex', flexWrap: 'wrap', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ flex: '1 1 420px', padding: '56px 40px', position: 'relative', zIndex: 1 }}>
            <h2 className="heading-display" style={{ fontSize: 'clamp(26px, 4vw, 36px)', color: 'white', marginBottom: '20px' }}>
              {lang === 'ar' ? 'هل أنت مستعد للإدراج؟' : 'Ready to List?'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', lineHeight: '1.7', marginBottom: '36px', maxWidth: '440px' }}>
              {lang === 'ar'
                ? 'سواء كنت مالكاً أو وسيطاً، انضم إلى شبكة البحرين النخبوية واعرض عقارك أمام آلاف العملاء المؤهلين يومياً.'
                : 'Whether you are an owner or a broker, join Bahrain’s elite network and showcase your property to thousands of qualified leads daily.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} className="btn-gold" style={{ padding: '14px 32px', borderRadius: '6px', fontSize: '15px' }}>
                {lang === 'ar' ? 'أدرج عقارك' : 'List Your Property'}
              </button>
              <button onClick={() => window.location.href = 'mailto:info@mulkibh.com'} style={{
                background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                padding: '14px 32px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', fontFamily: 'inherit',
              }}>
                {lang === 'ar' ? 'تواصل مع وكيل' : 'Contact Agent'}
              </button>
            </div>
          </div>
          <div className="cta-image" style={{
            flex: '1 1 380px', minHeight: '360px', position: 'relative',
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3xNAYLcr-lKwgcgUE3PtoUvDsqNvdU2kB6lEM8CYNRC1C1kzVSfN8Ykq8mCbj4ecxzKg69yKKvk-ww4667CrfcaMjblLTSWrifi7dnsxjH0t7fad6GgjtZX1NRiHcLXslB6-5fze_4OipI8JBgeSNqe7dDVds5dzrIbKIg1dthwv5GKgrN4DTa74o1uUlwRnDjZpdTbBWSYBbsxfdft23UQ5zisnsgLPE8BtUNiAH7rJnDdAGKCwiPsm4x6nC3OYN9eTCcuvzYsE')",
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0f2640, transparent)' }} />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: isDark ? '#060e18' : '#0f2640', borderTop: '1px solid #1a3c5e' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px' }}>
          <div>
            <div style={{ marginBottom: '20px' }}><Logo size="lg" dark /></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7' }}>
              {lang === 'ar'
                ? 'المعيار الأمثل للعقارات في مملكة البحرين. نربط المستثمرين المميزين بالعقارات السيادية.'
                : 'The definitive standard for real estate in the Kingdom of Bahrain. Connecting discerning investors with sovereign properties.'}
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px', marginBottom: '18px' }}>
              {lang === 'ar' ? 'الشركة' : 'Company'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                lang === 'ar' ? 'من نحن' : 'About Us',
                lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service',
                lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
              ].map((l, i) => <a key={i} href="#" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{l}</a>)}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px', marginBottom: '18px' }}>
              {lang === 'ar' ? 'الموارد' : 'Resources'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                lang === 'ar' ? 'الدعم الفني' : 'Contact Support',
                lang === 'ar' ? 'دليل العقارات في البحرين' : 'Bahrain Real Estate Guide',
                lang === 'ar' ? 'تقارير السوق' : 'Market Reports',
              ].map((l, i) => <a key={i} href="#" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{l}</a>)}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px', marginBottom: '18px' }}>
              {lang === 'ar' ? 'ابق على اطلاع' : 'Stay Informed'}
            </h4>
            <div style={{ display: 'flex' }}>
              <input type="email" placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} style={{
                background: '#0f2640', border: '1px solid #1a3c5e', color: 'white', padding: '10px 12px',
                flexGrow: 1, outline: 'none', fontSize: '13px', fontFamily: 'inherit', minWidth: 0,
              }} />
              <button style={{ background: '#c8a951', color: '#0f2640', border: 'none', padding: '10px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                {lang === 'ar' ? 'اشترك' : 'Join'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              {['public', 'share', 'hub'].map(icon => (
                <span key={icon} className="material-symbols-outlined" style={{ color: 'white', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.color = 'white'}>{icon}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(26,60,94,0.5)', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', margin: 0 }}>
            {lang === 'ar' ? '© 2026 ملكي. جميع الحقوق محفوظة. التميز العقاري السيادي.' : '© 2026 MulkiBH. All rights reserved. Sovereign Real Estate Excellence.'}
          </p>
        </div>
      </footer>

      <style>{`
        .stat-item:hover .stat-number { color: #c8a951 !important; }
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .cta-image { min-height: 240px; order: -1; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
