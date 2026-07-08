/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, updateProperty, getProperty, getCategories, getGovernorates, getCities } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const CreatePropertyPage = () => {
  const { isRTL, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    title_en: '', title_ar: '',
    description_en: '', description_ar: '',
    category: '', subcategory: '',
    governorate: '', city: '',
    listing_type: 'rent', price: '',
    area_sqm: '', bedrooms: '', bathrooms: '', floors: '',
    address_en: '', address_ar: '',
  });

  useEffect(() => {
    if (!user || !['owner', 'agency'].includes(user.role)) { navigate('/dashboard'); return; }
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
    if (isEdit) {
      getProperty(id).then(r => {
        const p = r.data;
        setForm({
          title_en: p.title_en || '', title_ar: p.title_ar || '',
          description_en: p.description_en || '', description_ar: p.description_ar || '',
          category: p.category?.id || '', subcategory: '',
          governorate: p.governorate?.id || '', city: p.city?.id || '',
          listing_type: p.listing_type || 'rent', price: p.price || '',
          area_sqm: p.area_sqm || '', bedrooms: p.bedrooms || '', bathrooms: p.bathrooms || '', floors: p.floors || '',
          address_en: p.address_en || '', address_ar: p.address_ar || '',
        });
      }).catch(() => navigate('/my-properties'));
    }
  }, []);

  useEffect(() => {
    if (form.governorate) getCities(form.governorate).then(r => setCities(r.data)).catch(() => {});
    else setCities([]);
  }, [form.governorate]);

  useEffect(() => {
    if (form.category) {
      const parent = categories.find(c => c.id === parseInt(form.category));
      setSubcategories(parent?.subcategories || []);
    } else setSubcategories([]);
    setForm(f => ({ ...f, subcategory: '' }));
  }, [form.category, categories]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
      const categoryToSend = form.subcategory || form.category;
      const fields = {
        title_en: form.title_en, title_ar: form.title_ar,
        description_en: form.description_en, description_ar: form.description_ar,
        category: categoryToSend, governorate: form.governorate, city: form.city,
        listing_type: form.listing_type, price: form.price, area_sqm: form.area_sqm,
        bedrooms: form.bedrooms, bathrooms: form.bathrooms, floors: form.floors,
        address_en: form.address_en, address_ar: form.address_ar,
      };
      Object.entries(fields).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
      images.forEach(img => formData.append('images', img));
      if (isEdit) await updateProperty(id, formData);
      else await createProperty(formData);
      navigate('/my-properties');
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally { setLoading(false); }
  };

  const fieldStyle = { width: '100%', padding: '11px 12px', border: '1px solid #c4c6ce', borderRadius: '2px', boxSizing: 'border-box', fontSize: '14px', background: '#f6fafe', color: '#171c1f', fontFamily: 'inherit', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '11px', color: '#44474d', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const errorStyle = { color: '#ba1a1a', fontSize: '12px', marginTop: '4px' };
  const sectionStyle = { background: 'white', padding: '28px', border: '1px solid rgba(196,198,206,0.4)', marginBottom: '20px' };

  const SectionTitle = ({ children }) => (
    <h3 className="heading-display" style={{ color: '#0f2640', fontSize: '19px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #c8a951', display: 'inline-block' }}>{children}</h3>
  );

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#2d6a9f', cursor: 'pointer', marginBottom: '16px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>{isRTL ? 'رجوع' : 'Back'}
        </button>
        <h1 className="heading-display" style={{ color: '#0f2640', fontSize: 'clamp(26px,4vw,36px)', marginBottom: '8px' }}>
          {isEdit ? (isRTL ? 'تعديل العقار' : 'Edit Property') : (isRTL ? 'إضافة عقار جديد' : 'Add New Property')}
        </h1>
        <p style={{ color: '#74777e', marginBottom: '32px' }}>{isRTL ? 'أدخل تفاصيل العقار بالكامل' : 'Fill in the complete property details'}</p>

        <form onSubmit={handleSubmit}>
          <div style={sectionStyle}>
            <SectionTitle>{isRTL ? 'المعلومات الأساسية' : 'Basic Information'}</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Title (English) *</label>
                <input value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} style={fieldStyle} required />
                {errors.title_en && <p style={errorStyle}>{errors.title_en}</p>}
              </div>
              <div>
                <label style={labelStyle}>العنوان (عربي) *</label>
                <input value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} style={{ ...fieldStyle, direction: 'rtl' }} required />
                {errors.title_ar && <p style={errorStyle}>{errors.title_ar}</p>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Description (English)</label>
                <textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>الوصف (عربي)</label>
                <textarea value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical', direction: 'rtl' }} />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <SectionTitle>{isRTL ? 'النوع والسعر' : 'Type & Price'}</SectionTitle>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>{isRTL ? 'نوع العرض' : 'Listing Type'} *</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['rent', 'sale'].map(type => (
                  <button key={type} type="button" onClick={() => setForm({ ...form, listing_type: type })} style={{
                    flex: 1, padding: '11px', border: `2px solid ${form.listing_type === type ? '#0f2640' : '#c4c6ce'}`,
                    background: form.listing_type === type ? '#0f2640' : 'white', color: form.listing_type === type ? 'white' : '#44474d',
                    cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit',
                  }}>{type === 'rent' ? (isRTL ? 'للإيجار' : 'For Rent') : (isRTL ? 'للبيع' : 'For Sale')}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{isRTL ? 'السعر' : 'Price'} (BHD) *</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={fieldStyle} required min="0" step="0.001" />
                {errors.price && <p style={errorStyle}>{errors.price}</p>}
              </div>
              <div>
                <label style={labelStyle}>{isRTL ? 'المساحة' : 'Area'} (m²)</label>
                <input type="number" value={form.area_sqm} onChange={e => setForm({ ...form, area_sqm: e.target.value })} style={fieldStyle} min="0" />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <SectionTitle>{isRTL ? 'الفئة والموقع' : 'Category & Location'}</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>{isRTL ? 'الفئة' : 'Category'} *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={fieldStyle} required>
                  <option value="">-- {isRTL ? 'اختر الفئة' : 'Select category'} --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
                </select>
                {errors.category && <p style={errorStyle}>{errors.category}</p>}
              </div>
              {subcategories.length > 0 && (
                <div>
                  <label style={labelStyle}>{isRTL ? 'الفئة الفرعية' : 'Subcategory'}</label>
                  <select value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} style={fieldStyle}>
                    <option value="">-- {isRTL ? 'الفئة الفرعية' : 'Subcategory'} --</option>
                    {subcategories.map(s => <option key={s.id} value={s.id}>{lang === 'ar' ? s.name_ar : s.name_en}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>{isRTL ? 'المحافظة' : 'Governorate'} *</label>
                <select value={form.governorate} onChange={e => setForm({ ...form, governorate: e.target.value, city: '' })} style={fieldStyle} required>
                  <option value="">-- {isRTL ? 'اختر المحافظة' : 'Select governorate'} --</option>
                  {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
                </select>
                {errors.governorate && <p style={errorStyle}>{errors.governorate}</p>}
              </div>
              <div>
                <label style={labelStyle}>{isRTL ? 'المنطقة' : 'City'}</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={fieldStyle} disabled={cities.length === 0}>
                  <option value="">-- {isRTL ? 'اختر المنطقة' : 'Select city'} --</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Address (English)</label>
                <input value={form.address_en} onChange={e => setForm({ ...form, address_en: e.target.value })} style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>العنوان (عربي)</label>
                <input value={form.address_ar} onChange={e => setForm({ ...form, address_ar: e.target.value })} style={{ ...fieldStyle, direction: 'rtl' }} />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <SectionTitle>{isRTL ? 'تفاصيل العقار' : 'Property Details'}</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{isRTL ? 'غرف النوم' : 'Bedrooms'}</label>
                <input type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} style={fieldStyle} min="0" />
              </div>
              <div>
                <label style={labelStyle}>{isRTL ? 'الحمامات' : 'Bathrooms'}</label>
                <input type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} style={fieldStyle} min="0" />
              </div>
              <div>
                <label style={labelStyle}>{isRTL ? 'الطوابق' : 'Floors'}</label>
                <input type="number" value={form.floors} onChange={e => setForm({ ...form, floors: e.target.value })} style={fieldStyle} min="0" />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <SectionTitle>{isRTL ? 'صور العقار' : 'Property Images'}</SectionTitle>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '32px', border: '2px dashed #c4c6ce', textAlign: 'center', cursor: 'pointer', color: '#74777e' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#c8a951' }}>add_photo_alternate</span>
              {isRTL ? 'اضغط لرفع الصور' : 'Click to upload images'}
              <input type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
            </label>
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={src} alt="" style={{ width: '100px', height: '75px', objectFit: 'cover' }} />
                    {i === 0 && <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#0f2640', color: 'white', fontSize: '10px', padding: '2px 6px', fontWeight: '700' }}>{isRTL ? 'رئيسية' : 'Main'}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px', background: loading ? 'rgba(200,169,81,0.5)' : '#c8a951', color: '#0f2640',
            border: 'none', fontSize: '15px', cursor: loading ? 'default' : 'pointer', fontWeight: '700', fontFamily: 'inherit',
            textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = '#ddc06b')}
            onMouseLeave={e => !loading && (e.currentTarget.style.background = '#c8a951')}
          >
            {loading ? (isRTL ? 'جارٍ الحفظ...' : 'Saving...') : isEdit ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : (isRTL ? 'نشر العقار' : 'Post Property')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePropertyPage;
