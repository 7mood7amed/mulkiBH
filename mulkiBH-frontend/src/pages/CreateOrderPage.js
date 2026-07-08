/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { getCategories, getGovernorates, getCities } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const CreateOrderPage = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: '', governorate: '', city: '',
    listing_type: 'rent', price_min: '', price_max: '',
    bedrooms: '', bathrooms: '', area_sqm_min: '',
    description: '', notes: '', phone: '',
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
    } finally { setLoading(false); }
  };

  const fieldStyle = { width: '100%', padding: '11px 12px', border: '1px solid #c4c6ce', borderRadius: '2px', boxSizing: 'border-box', fontSize: '14px', background: '#f6fafe', color: '#171c1f', fontFamily: 'inherit', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '11px', color: '#44474d', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px' }}>
        <h1 className="heading-display" style={{ color: '#0f2640', marginBottom: '8px', fontSize: 'clamp(24px,4vw,34px)' }}>
          {lang === 'ar' ? 'أضف طلبك العقاري' : 'Post a Property Order'}
        </h1>
        <p style={{ color: '#74777e', marginBottom: '28px' }}>
          {lang === 'ar' ? 'أخبرنا بما تريد وسيتواصل معك أصحاب العقارات' : 'Tell us what you need and property owners will reach out to you'}
        </p>

        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', border: '1px solid rgba(196,198,206,0.4)', boxShadow: '0 1px 3px rgba(15,38,64,0.06)' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'أرغب في' : 'I want to'}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['rent', 'buy'].map(type => (
                <button key={type} type="button" onClick={() => setForm({ ...form, listing_type: type })} style={{
                  flex: 1, padding: '11px', border: `2px solid ${form.listing_type === type ? '#0f2640' : '#c4c6ce'}`,
                  background: form.listing_type === type ? '#0f2640' : 'white', color: form.listing_type === type ? 'white' : '#44474d',
                  cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit',
                }}>{type === 'rent' ? (lang === 'ar' ? 'استئجار' : 'Rent') : (lang === 'ar' ? 'شراء' : 'Buy')}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'الفئة' : 'Category'}</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={fieldStyle} required>
              <option value="">-- {lang === 'ar' ? 'اختر الفئة' : 'Select category'} --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: cities.length > 0 ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
              <select value={form.governorate} onChange={e => setForm({ ...form, governorate: e.target.value })} style={fieldStyle}>
                <option value="">-- {lang === 'ar' ? 'اختر المحافظة' : 'Select governorate'} --</option>
                {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
              </select>
            </div>
            {cities.length > 0 && (
              <div>
                <label style={labelStyle}>{lang === 'ar' ? 'المنطقة' : 'Area'}</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={fieldStyle}>
                  <option value="">-- {lang === 'ar' ? 'اختر المنطقة' : 'Select area'} --</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'أدنى سعر (BHD)' : 'Min Price (BHD)'}</label>
              <input type="number" value={form.price_min} onChange={e => setForm({ ...form, price_min: e.target.value })} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'أقصى سعر (BHD)' : 'Max Price (BHD)'}</label>
              <input type="number" value={form.price_max} onChange={e => setForm({ ...form, price_max: e.target.value })} style={fieldStyle} />
            </div>
          </div>

          {!isLand && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>{lang === 'ar' ? 'غرف النوم' : 'Bedrooms'}</label>
                <input type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} style={fieldStyle} min="1" />
              </div>
              <div>
                <label style={labelStyle}>{lang === 'ar' ? 'الحمامات' : 'Bathrooms'}</label>
                <input type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} style={fieldStyle} min="1" />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={fieldStyle} required placeholder="+973 XXXX XXXX" />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} placeholder={lang === 'ar' ? 'أي تفاصيل إضافية...' : 'Any additional details...'} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px', background: loading ? 'rgba(200,169,81,0.5)' : '#c8a951', color: '#0f2640',
            border: 'none', fontSize: '15px', cursor: loading ? 'default' : 'pointer', fontWeight: '700', fontFamily: 'inherit',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = '#ddc06b')}
            onMouseLeave={e => !loading && (e.currentTarget.style.background = '#c8a951')}
          >
            {loading ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إرسال الطلب' : 'Submit Order')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
