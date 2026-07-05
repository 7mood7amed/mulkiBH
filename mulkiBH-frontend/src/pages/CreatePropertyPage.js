/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, updateProperty, getProperty, getCategories, getGovernorates, getCities } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const CreatePropertyPage = () => {
  const t = useT();
  const { isRTL, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // if editing
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
    category: '',       // this is what gets sent to API
    subcategory: '',    // this is just UI state, not sent to API
    governorate: '', city: '',
    listing_type: 'rent', price: '',
    area_sqm: '', bedrooms: '', bathrooms: '', floors: '',
    address_en: '', address_ar: '',
  });

  useEffect(() => {
    if (!user || !['owner', 'agency'].includes(user.role)) {
      navigate('/dashboard');
      return;
    }
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});

    // If editing, load existing property data
    if (isEdit) {
      getProperty(id).then(r => {
        const p = r.data;
        setForm({
          title_en: p.title_en || '',
          title_ar: p.title_ar || '',
          description_en: p.description_en || '',
          description_ar: p.description_ar || '',
          category: p.category?.id || '',
          subcategory: '',
          governorate: p.governorate?.id || '',
          city: p.city?.id || '',
          listing_type: p.listing_type || 'rent',
          price: p.price || '',
          area_sqm: p.area_sqm || '',
          bedrooms: p.bedrooms || '',
          bathrooms: p.bathrooms || '',
          floors: p.floors || '',
          address_en: p.address_en || '',
          address_ar: p.address_ar || '',
        });
      }).catch(() => navigate('/my-properties'));
    }
  }, []);

  // Load cities when governorate changes
  useEffect(() => {
    if (form.governorate) {
      getCities(form.governorate).then(r => setCities(r.data)).catch(() => {});
    } else {
      setCities([]);
    }
  }, [form.governorate]);

  // Load subcategories when parent category changes
  useEffect(() => {
    if (form.category) {
      const parent = categories.find(c => c.id === parseInt(form.category));
      setSubcategories(parent?.subcategories || []);
    } else {
      setSubcategories([]);
    }
    // Reset subcategory when parent changes
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

      // Use subcategory if selected, otherwise use parent category
      const categoryToSend = form.subcategory || form.category;

      const fields = {
        title_en: form.title_en,
        title_ar: form.title_ar,
        description_en: form.description_en,
        description_ar: form.description_ar,
        category: categoryToSend,
        governorate: form.governorate,
        city: form.city,
        listing_type: form.listing_type,
        price: form.price,
        area_sqm: form.area_sqm,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        floors: form.floors,
        address_en: form.address_en,
        address_ar: form.address_ar,
      };

      Object.entries(fields).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
      images.forEach(img => formData.append('images', img));

      if (isEdit) {
        await updateProperty(id, formData);
      } else {
        await createProperty(formData);
      }
      navigate('/my-properties');
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4a5568' };
  const errorStyle = { color: '#e53e3e', fontSize: '12px', marginTop: '4px' };
  const sectionStyle = { background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' };

  return (
    <div style={{  maxWidth: '800px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#1a3c5e', cursor: 'pointer', marginBottom: '16px', fontSize: '15px' }}>← {t('back')}</button>
      <h2 style={{ color: '#1a3c5e', marginBottom: '8px' }}>
        {isEdit ? (isRTL ? 'تعديل العقار' : 'Edit Property') : (isRTL ? 'إضافة عقار جديد' : 'Add New Property')}
      </h2>
      <p style={{ color: '#718096', marginBottom: '28px' }}>{isRTL ? 'أدخل تفاصيل العقار بالكامل' : 'Fill in all property details'}</p>

      <form onSubmit={handleSubmit}>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '20px' }}>{isRTL ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Title (English) *</label>
              <input value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} style={inputStyle} required />
              {errors.title_en && <p style={errorStyle}>{errors.title_en}</p>}
            </div>
            <div>
              <label style={labelStyle}>العنوان (عربي) *</label>
              <input value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} style={{...inputStyle, direction: 'rtl'}} required />
              {errors.title_ar && <p style={errorStyle}>{errors.title_ar}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Description (English)</label>
              <textarea value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} />
            </div>
            <div>
              <label style={labelStyle}>الوصف (عربي)</label>
              <textarea value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} style={{...inputStyle, minHeight: '100px', resize: 'vertical', direction: 'rtl'}} />
            </div>
          </div>
        </div>

        {/* Listing Type & Price */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '20px' }}>{isRTL ? 'النوع والسعر' : 'Type & Price'}</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('listingType')} *</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['rent', 'sale'].map(type => (
                <button key={type} type="button" onClick={() => setForm({...form, listing_type: type})} style={{
                  flex: 1, padding: '10px', border: '2px solid',
                  borderColor: form.listing_type === type ? '#1a3c5e' : '#ddd',
                  borderRadius: '6px',
                  background: form.listing_type === type ? '#1a3c5e' : 'white',
                  color: form.listing_type === type ? 'white' : '#4a5568',
                  cursor: 'pointer', fontWeight: '600'
                }}>{type === 'rent' ? t('forRent') : t('forSale')}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>{t('price')} (BD) *</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle} required min="0" step="0.001" />
              {errors.price && <p style={errorStyle}>{errors.price}</p>}
            </div>
            <div>
              <label style={labelStyle}>{t('area')} (sqm)</label>
              <input type="number" value={form.area_sqm} onChange={e => setForm({...form, area_sqm: e.target.value})} style={inputStyle} min="0" />
            </div>
          </div>
        </div>

        {/* Category & Location */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '20px' }}>{isRTL ? 'الفئة والموقع' : 'Category & Location'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>{t('category')} *</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle} required>
                <option value="">-- {t('category')} --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
              </select>
              {errors.category && <p style={errorStyle}>{errors.category}</p>}
            </div>
            {subcategories.length > 0 && (
              <div>
                <label style={labelStyle}>{isRTL ? 'الفئة الفرعية' : 'Subcategory'}</label>
                {/* FIX: subcategory has its own state, doesn't touch category */}
                <select value={form.subcategory} onChange={e => setForm({...form, subcategory: e.target.value})} style={inputStyle}>
                  <option value="">-- {isRTL ? 'الفئة الفرعية' : 'Subcategory'} --</option>
                  {subcategories.map(s => <option key={s.id} value={s.id}>{lang === 'ar' ? s.name_ar : s.name_en}</option>)}
                </select>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>{t('governorate')} *</label>
              <select value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value, city: ''})} style={inputStyle} required>
                <option value="">-- {t('governorate')} --</option>
                {governorates.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? g.name_ar : g.name_en}</option>)}
              </select>
              {errors.governorate && <p style={errorStyle}>{errors.governorate}</p>}
            </div>
            <div>
              <label style={labelStyle}>{t('city')}</label>
              <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle} disabled={cities.length === 0}>
                <option value="">-- {t('city')} --</option>
                {cities.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Address (English)</label>
              <input value={form.address_en} onChange={e => setForm({...form, address_en: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>العنوان (عربي)</label>
              <input value={form.address_ar} onChange={e => setForm({...form, address_ar: e.target.value})} style={{...inputStyle, direction: 'rtl'}} />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '20px' }}>{isRTL ? 'تفاصيل العقار' : 'Property Details'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={labelStyle}>{t('bedrooms')}</label>
              <input type="number" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} style={inputStyle} min="0" />
            </div>
            <div>
              <label style={labelStyle}>{t('bathrooms')}</label>
              <input type="number" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} style={inputStyle} min="0" />
            </div>
            <div>
              <label style={labelStyle}>{isRTL ? 'الطوابق' : 'Floors'}</label>
              <input type="number" value={form.floors} onChange={e => setForm({...form, floors: e.target.value})} style={inputStyle} min="0" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '20px' }}>{isRTL ? 'صور العقار' : 'Property Images'}</h3>
          <label style={{ display: 'block', padding: '20px', border: '2px dashed #ddd', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', color: '#718096' }}>
            📷 {isRTL ? 'اضغط لرفع الصور' : 'Click to upload images'}
            <input type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
          </label>
          {previews.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt="" style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '6px' }} />
                  {i === 0 && <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#1a3c5e', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>Main</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', background: '#1a3c5e', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600'
        }}>
          {loading ? t('loading') : isEdit ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : (isRTL ? 'نشر العقار' : 'Post Property')}
        </button>
      </form>
    </div>
  );
};

export default CreatePropertyPage;
