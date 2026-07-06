/* eslint-disable */
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
  const { lang } = useLang();
  const { bg, surface, border, text, subtext, heading, isDark } = useThemeColors();
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
    width: '100%', padding: '11px 14px', border: `1px solid ${border}`,
    borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px',
    fontFamily: 'inherit', background: isDark ? '#0a1929' : 'white', color: text,
  };

  const labelStyle = {
    display: 'block', marginBottom: '5px', fontWeight: '600',
    fontSize: '12px', color: subtext, textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)', padding: '32px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <h2 className="heading-display" style={{ color: heading, marginBottom: '6px', fontSize: 'clamp(20px, 4vw, 28px)' }}>
          {lang === 'ar' ? 'أضف طلبك العقاري' : 'Post a Property Order'}
        </h2>
        <p style={{ color: subtext, marginBottom: '28px', fontSize: '14px' }}>
          {lang === 'ar' ? 'أخبرنا بما تريد وسيتواصل معك أصحاب العقارات' : 'Tell us what you need and owners will contact you'}
        </p>

        <div style={{ background: isDark ? '#0a1929' : 'white', padding: '28px', borderRadius: '16px', border: `1px solid ${border}`, boxShadow: isDark ? 'none' : 'var(--shadow)' }}>

          {/* Listing Type */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'نوع العملية' : 'I want to'}</label>
            <div style={{ display: 'flex', gap: '10px', background: isDark ? '#0f2640' : '#f0f4f8', padding: '4px', borderRadius: '10px' }}>
              {['rent', 'buy'].map(type => (
                <button key={type} type="button"
                  onClick={() => setForm({...form, listing_type: type})}
                  style={{
                    flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                    background: form.listing_type === type ? '#0f2640' : 'transparent',
                    color: form.listing_type === type ? 'white' : subtext,
                    cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    boxShadow: form.listing_type === type ? '0 2px 8px rgba(15,38,64,0.3)' : 'none',
                  }}
                >{type === 'rent' ? (lang === 'ar' ? 'استئجار' : 'Rent') : (lang === 'ar' ? 'شراء' : 'Buy')}</button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'الفئة' : 'Category'}</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle} required>
              <option value="">{lang === 'ar' ? '-- اختر الفئة --' : '-- Select category --'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
              ))}
            </select>
          </div>

          {/* Governorate */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
            <select value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value})} style={inputStyle}>
              <option value="">{lang === 'ar' ? '-- اختر المحافظة --' : '-- Select governorate --'}</option>
              {governorates.map(g => (
                <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>
              ))}
            </select>
          </div>

          {/* City */}
          {cities.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{lang === 'ar' ? 'المنطقة' : 'Area'}</label>
              <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle}>
                <option value="">{lang === 'ar' ? '-- اختر المنطقة --' : '-- Select area --'}</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price Range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'أدنى سعر (BD)' : 'Min price (BD)'}</label>
              <input type="number" value={form.price_min} onChange={e => setForm({...form, price_min: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'أقصى سعر (BD)' : 'Max price (BD)'}</label>
              <input type="number" value={form.price_max} onChange={e => setForm({...form, price_max: e.target.value})} style={inputStyle} />
            </div>
          </div>

          {/* Bedrooms/Bathrooms — hidden for land */}
          {!isLand && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>{lang === 'ar' ? 'الغرف' : 'Bedrooms'}</label>
                <input type="number" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} style={inputStyle} min="1" />
              </div>
              <div>
                <label style={labelStyle}>{lang === 'ar' ? 'الحمامات' : 'Bathrooms'}</label>
                <input type="number" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} style={inputStyle} min="1" />
              </div>
            </div>
          )}

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'رقم الهاتف *' : 'Phone number *'}</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} required placeholder="+973 XXXX XXXX" />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'ملاحظات إضافية' : 'Additional notes'}</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder={lang === 'ar' ? 'أي تفاصيل إضافية...' : 'Any additional details...'}
            />
          </div>

          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-navy" style={{ width: '100%', padding: '13px', fontSize: '15px', borderRadius: '10px', fontWeight: '700' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
              </span>
            ) : (lang === 'ar' ? 'إرسال الطلب' : 'Submit Order')}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateOrderPage;
