import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { getCategories, getGovernorates, getCities } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';

const CreateOrderPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: '', governorate: '', city: '',
    listing_type: 'rent', price_min: '', price_max: '',
    bedrooms: '', bathrooms: '', area_sqm_min: '',
    description: '', notes: '', phone: ''
  });

  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedCategory = categories.find(c => c.id === parseInt(form.category));
  const isLand = selectedCategory?.type === 'land';

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    if (form.governorate) getCities(form.governorate).then(r => setCities(r.data)).catch(() => {});
    else setCities([]);
  }, [form.governorate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''));
      await createOrder(clean);
      navigate('/orders');
    } catch {
      alert('Failed to submit order.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px', border: '1px solid #ddd',
    borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px',
    fontFamily: 'inherit'
  };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' };

  return (
    <div style={{
      
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px 16px',
    }}>
      <h2 className="heading-display" style={{color: \'#0f2640\', marginBottom: '8px', fontSize: 'clamp(18px, 4vw, 24px)' }}>{t('orderTitle')}</h2>
      <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>{t('orderSubtitle')}</p>

      <form onSubmit={handleSubmit} style={{
        background: 'white', padding: '20px',
        borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>

        {/* Listing Type */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('listingType')}</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['rent', 'buy'].map(type => (
              <button key={type} type="button"
                onClick={() => setForm({...form, listing_type: type})}
                style={{
                  flex: 1, padding: '10px', border: '2px solid',
                  borderColor: form.listing_type === type ? '#1a3c5e' : '#ddd',
                  borderRadius: '6px',
                  background: form.listing_type === type ? '#1a3c5e' : 'white',
                  color: form.listing_type === type ? 'white' : '#4a5568',
                  cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                }}
              >{t(type)}</button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('category')}</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle} required>
            <option value="">-- {t('category')} --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
            ))}
          </select>
        </div>

        {/* Governorate */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('governorate')}</label>
          <select value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value})} style={inputStyle}>
            <option value="">-- {t('governorate')} --</option>
            {governorates.map(g => (
              <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>
            ))}
          </select>
        </div>

        {/* City */}
        {cities.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('city')}</label>
            <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle}>
              <option value="">-- {t('city')} --</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>{t('minPrice')}</label>
            <input type="number" value={form.price_min} onChange={e => setForm({...form, price_min: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('maxPrice')}</label>
            <input type="number" value={form.price_max} onChange={e => setForm({...form, price_max: e.target.value})} style={inputStyle} />
          </div>
        </div>

        {/* Bedrooms/Bathrooms — hidden for land */}
        {!isLand && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
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

        {/* Phone */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('phone')} *</label>
          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} required />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>{t('notes')}</label>
          <textarea
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '12px', background: '#0f2640', color: 'white',
          border: 'none', borderRadius: '6px', fontSize: '16px',
          cursor: 'pointer', fontWeight: '600'
        }}>
          {loading ? t('loading') : t('submitOrder')}
        </button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
