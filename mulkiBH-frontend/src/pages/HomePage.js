import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { getCategories, getGovernorates } from '../api/properties';

const HomePage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [filters, setFilters] = useState({
    listing_type: 'rent',
    search: '',
    category: '',
    governorate: '',
    price_max: '',
    bedrooms: '',
  });

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
    padding: '12px', border: 'none', borderRadius: '8px',
    fontSize: '14px', background: 'white', cursor: 'pointer',
    outline: 'none', width: '100%'
  };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3c5e 0%, #2d6a9f 100%)',
        color: 'white', padding: '60px 20px 40px', textAlign: 'center'
      }}>
        <h1 style={{ fontSize: 'clamp(22px, 5vw, 36px)', marginBottom: '12px', fontWeight: 'bold' }}>
          {t('heroTitle')}
        </h1>
        <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', marginBottom: '32px', opacity: 0.85 }}>
          {t('heroSubtitle')}
        </p>

        {/* Search Box */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '20px',
          maxWidth: '860px', margin: '0 auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* Rent / Sale Toggle */}
          <div style={{ display: 'flex', marginBottom: '16px', background: '#f0f4f8', borderRadius: '8px', padding: '4px' }}>
            {['rent', 'sale'].map(type => (
              <button key={type} onClick={() => setFilters({...filters, listing_type: type})} style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px', transition: 'all 0.2s',
                background: filters.listing_type === type ? '#1a3c5e' : 'transparent',
                color: filters.listing_type === type ? 'white' : '#718096',
              }}>
                {type === 'rent' ? t('forRent') : t('forSale')}
              </button>
            ))}
          </div>

          {/* Filter Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px', marginBottom: '14px'
          }}>
            {/* Search */}
            <input
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={t('searchPlaceholder')}
              style={{ ...selectStyle, border: '1px solid #e2e8f0', color: '#2d3748' }}
            />

            {/* Category */}
            <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={{ ...selectStyle, border: '1px solid #e2e8f0', color: filters.category ? '#2d3748' : '#a0aec0' }}>
              <option value="">{t('category')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
              ))}
            </select>

            {/* Governorate */}
            <select value={filters.governorate} onChange={e => setFilters({...filters, governorate: e.target.value})} style={{ ...selectStyle, border: '1px solid #e2e8f0', color: filters.governorate ? '#2d3748' : '#a0aec0' }}>
              <option value="">{t('governorate')}</option>
              {governorates.map(g => (
                <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>
              ))}
            </select>

            {/* Bedrooms */}
            <select value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})} style={{ ...selectStyle, border: '1px solid #e2e8f0', color: filters.bedrooms ? '#2d3748' : '#a0aec0' }}>
              <option value="">{t('bedrooms')}</option>
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>

            {/* Max Price */}
            <input
              type="number"
              value={filters.price_max}
              onChange={e => setFilters({...filters, price_max: e.target.value})}
              placeholder={`${t('maxPrice')}`}
              style={{ ...selectStyle, border: '1px solid #e2e8f0', color: '#2d3748' }}
            />
          </div>

          {/* Search Button */}
          <button onClick={handleSearch} style={{
            width: '100%', padding: '14px', background: '#c8a951', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '700', fontSize: '16px', letterSpacing: '0.5px'
          }}>
            🔍 {t('search')}
          </button>
        </div>

        {/* Post Order CTA */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ opacity: 0.7, fontSize: '14px', marginBottom: '10px' }}>
            {isRTL ? "لا تجد ما تبحث عنه؟" : "Can't find what you're looking for?"}
          </p>
          <button onClick={() => navigate('/orders/create')} style={{
            background: 'transparent', color: 'white',
            border: '2px solid rgba(255,255,255,0.6)',
            padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', fontSize: '14px'
          }}>{t('postYourOrder')} →</button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '48px 20px', background: '#f8f9fa' }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: '🏠', title: isRTL ? 'تصفح العقارات' : 'Browse Properties', desc: isRTL ? 'اعثر على عقارك المثالي من بين آلاف الإعلانات في البحرين' : 'Find your perfect property from thousands of listings across Bahrain' },
            { icon: '📋', title: isRTL ? 'أضف طلبك' : 'Post Your Order', desc: isRTL ? 'أخبرنا بما تريد ودع أصحاب العقارات يتواصلون معك' : 'Tell us what you need and let property owners come to you' },
            { icon: '🔔', title: isRTL ? 'تنبيهات فورية' : 'Instant Notifications', desc: isRTL ? 'احصل على تنبيهات فورية عبر البريد أو واتساب أو الموقع' : 'Get notified instantly via email, WhatsApp, or dashboard' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'white', padding: '28px 20px', borderRadius: '12px',
              textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '10px', color: '#1a3c5e', fontSize: '17px' }}>{f.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: '#1a3c5e', padding: '40px 20px', color: 'white', textAlign: 'center' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px'
        }}>
          {[
            { num: '4', label: isRTL ? 'محافظات' : 'Governorates' },
            { num: '40+', label: isRTL ? 'منطقة' : 'Areas' },
            { num: '3', label: isRTL ? 'فئات عقارية' : 'Property Types' },
            { num: '100%', label: isRTL ? 'بحريني' : 'Bahrain Focused' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px', color: '#c8a951' }}>{s.num}</p>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
