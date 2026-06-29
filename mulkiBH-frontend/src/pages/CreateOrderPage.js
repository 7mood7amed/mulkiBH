import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { getCategories, getGovernorates, getCities } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const CreateOrderPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if selected category is Land
  const selectedCategory = categories.find(c => c.id === parseInt(form.category));
  const isLand = selectedCategory?.type === 'land';
  const [form, setForm] = useState({ category: '', governorate: '', city: '', listing_type: 'rent', price_min: '', price_max: '', bedrooms: '', bathrooms: '', area_sqm_min: '', description: '', notes: '', phone: '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.governorate) getCities(form.governorate).then(r => setCities(r.data)).catch(() => {});
  }, [form.governorate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''));
      await createOrder(clean);
      navigate('/orders');
    } catch (err) {
      alert('Failed to submit order.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500' };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '600px', margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box', width: '100%' }}>
      <h2 style={{ color: '#1a3c5e', marginBottom: '8px' }}>{t('orderTitle')}</h2>
      <p style={{ color: '#718096', marginBottom: '32px' }}>{t('orderSubtitle')}</p>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 'clamp(16px, 4vw, 32px)', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('listingType')}</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['rent', 'buy'].map(type => (
              <button key={type} type="button" onClick={() => setForm({...form, listing_type: type})} style={{
                flex: 1, padding: '10px', border: '2px solid', borderColor: form.listing_type === type ? '#1a3c5e' : '#ddd',
                borderRadius: '6px', background: form.listing_type === type ? '#1a3c5e' : 'white',
                color: form.listing_type === type ? 'white' : '#4a5568', cursor: 'pointer', fontWeight: '600'
              }}>{t(type)}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('category')}</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle} required>
            <option value="">-- {t('category')} --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('governorate')}</label>
          <select value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value})} style={inputStyle}>
            <option value="">-- {t('governorate')} --</option>
            {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
          </select>
        </div>

        {cities.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('city')}</label>
            <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle}>
              <option value="">-- {t('city')} --</option>
              {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>{t('minPrice')}</label>
            <input type="number" value={form.price_min} onChange={e => setForm({...form, price_min: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('maxPrice')}</label>
            <input type="number" value={form.price_max} onChange={e => setForm({...form, price_max: e.target.value})} style={inputStyle} />
          </div>
        </div>

        {!isLand && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>{t('bedrooms')}</label>
              <input type="number" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} style={inputStyle} min="1" />
            </div>
            <div>
              <label style={labelStyle}>{t('bathrooms')}</label>
              <input type="number" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} style={inputStyle} min="1" />
            </div>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('phone')} *</label>
          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('notes')}</label>
          <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#1a3c5e', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' }}>
          {loading ? t('loading') : t('submitOrder')}
        </button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
