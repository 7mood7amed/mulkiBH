import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const HomePage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search.trim()) navigate(`/properties?search=${search}`);
    else navigate('/properties');
  };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3c5e 0%, #2d6a9f 100%)',
        color: 'white', padding: '80px 24px', textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 'bold' }}>{t('heroTitle')}</h1>
        <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.85 }}>{t('heroSubtitle')}</p>

        {/* Search Bar */}
        <div style={{ display: 'flex', maxWidth: '560px', margin: '0 auto', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={t('searchPlaceholder')}
            style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', fontSize: '15px' }}
          />
          <button onClick={handleSearch} style={{
            background: '#c8a951', color: 'white', border: 'none',
            padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px'
          }}>{t('search')}</button>
        </div>

        {/* CTA Buttons */}
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/properties')} style={{
            background: 'white', color: '#1a3c5e', border: 'none',
            padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px'
          }}>{t('browseProperties')}</button>
          <button onClick={() => navigate('/orders/create')} style={{
            background: '#c8a951', color: 'white', border: 'none',
            padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px'
          }}>{t('postYourOrder')}</button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 24px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          {[
            { icon: '🏠', title: isRTL ? 'تصفح العقارات' : 'Browse Properties', desc: isRTL ? 'اعثر على عقارك المثالي من بين آلاف الإعلانات في البحرين' : 'Find your perfect property from thousands of listings across Bahrain' },
            { icon: '📋', title: isRTL ? 'أضف طلبك' : 'Post Your Order', desc: isRTL ? 'أخبرنا بما تريد ودع أصحاب العقارات يتواصلون معك' : 'Tell us what you need and let property owners come to you' },
            { icon: '🔔', title: isRTL ? 'تنبيهات فورية' : 'Instant Notifications', desc: isRTL ? 'احصل على تنبيهات فورية عبر البريد أو واتساب أو الموقع' : 'Get notified instantly via email, WhatsApp, or dashboard' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'white', padding: '32px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '12px', color: '#1a3c5e' }}>{f.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
