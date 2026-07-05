/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty, getProperties, updateProperty } from '../api/properties';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const t = useT();
  const { isRTL, lang } = useLang();
  const { isDark } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const cardBg = isDark ? '#1a2535' : 'white';
  const textColor = isDark ? '#e2e8f0' : '#2d3748';
  const subColor = isDark ? '#a0aec0' : '#718096';
  const bgColor = isDark ? '#0f1923' : '#f8f9fa';

  useEffect(() => {
    setLoading(true);
    getProperty(id)
      .then(r => {
        setProperty(r.data);
        setLoading(false);
        // Load similar properties
        getProperties({ category: r.data.category?.id, listing_type: r.data.listing_type }).then(res => {
          setSimilar(res.data.filter(p => p.id !== parseInt(id)).slice(0, 3));
        }).catch(() => {});
      })
      .catch(() => navigate('/properties'));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateProperty(id, { status: newStatus });
      setProperty({ ...property, status: newStatus });
    } catch {}
    setUpdatingStatus(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Open WhatsApp with the message
    const msg = encodeURIComponent(
      `Hi ${property.owner_agency || property.owner_name},\n${contactForm.message}\n\nProperty: ${property.title_en}\n${window.location.href}\n\nContact: ${contactForm.name} - ${contactForm.phone}`
    );
    window.open(`https://wa.me/${property.owner_whatsapp || property.owner_phone}?text=${msg}`, '_blank');
    setContactSent(true);
  };

  const handleShare = () => {
    const msg = encodeURIComponent(`Check out this property on MulkiBH:\n${lang === 'ar' ? property.title_ar : property.title_en}\n${property.price} BD\n\n${window.location.href}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (loading) return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
      <div className="skeleton" style={{ height: '32px', width: '120px', marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }} />
        <div>
          <div className="skeleton" style={{ height: '28px', marginBottom: '12px' }} />
          <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '12px' }} />
          <div className="skeleton" style={{ height: '100px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );

  if (!property) return null;

  const isOwner = user && (user.id === property.owner_id || user.role === 'admin');
  const statusColors = { available: '#48bb78', rented: '#4299e1', sold: '#e53e3e', pending: '#ed8936' };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', background: bgColor, minHeight: 'calc(100vh - 64px)' }} className="dm-bg fade-in">
      {/* Breadcrumb */}
      <div style={{ background: cardBg, padding: '12px 20px', borderBottom: `1px solid ${isDark ? '#2d3748' : '#eee'}` }} className="dm-card">
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: subColor }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>🏠</span>
          <span>›</span>
          <span onClick={() => navigate('/properties')} style={{ cursor: 'pointer', color: '#1a3c5e' }}>{t('properties')}</span>
          <span>›</span>
          <span style={{ color: textColor }}>{lang === 'ar' ? property.title_ar : property.title_en}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '32px' }}>

          {/* Images */}
          <div className="fade-in-up">
            <div style={{ position: 'relative', height: '300px', background: '#e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
              {property.images?.length > 0
                ? <img src={property.images[activeImage]?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '60px' }}>🏠</div>}
              {/* Favorite & Share buttons on image */}
              <div style={{ position: 'absolute', top: '12px', right: isRTL ? 'auto' : '12px', left: isRTL ? '12px' : 'auto', display: 'flex', gap: '8px' }}>
                <button onClick={() => toggleFavorite(property)} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  {isFavorite(property.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={handleShare} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  📤
                </button>
              </div>
            </div>
            {property.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {property.images.map((img, i) => (
                  <img key={i} src={img.image} alt="" onClick={() => setActiveImage(i)} style={{ width: '70px', height: '52px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, opacity: activeImage === i ? 1 : 0.6, border: activeImage === i ? '2px solid #1a3c5e' : '2px solid transparent', transition: 'all 0.2s' }} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="fade-in-up delay-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ margin: 0, color: isDark ? '#e2e8f0' : '#1a3c5e', fontSize: 'clamp(18px, 3vw, 24px)' }}>{lang === 'ar' ? property.title_ar : property.title_en}</h2>
              <span style={{ background: property.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4', color: property.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '13px' }}>
                {property.listing_type === 'rent' ? t('forRent') : t('forSale')}
              </span>
            </div>

            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#c8a951', margin: '0 0 6px' }}>
              {property.price} {t('bd')}
              {property.listing_type === 'rent' && <span style={{ fontSize: '14px', color: subColor, fontWeight: 'normal' }}> /{isRTL ? 'شهر' : 'mo'}</span>}
            </p>
            <p style={{ color: subColor, marginBottom: '16px', fontSize: '14px' }}>📍 {property.city?.name_en}, {property.governorate?.name_en}</p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px', marginBottom: '18px' }}>
              {[
                property.bedrooms && { icon: '🛏', label: t('bedrooms'), value: property.bedrooms },
                property.bathrooms && { icon: '🚿', label: t('bathrooms'), value: property.bathrooms },
                property.area_sqm && { icon: '📐', label: t('area'), value: `${property.area_sqm}m²` },
                property.floors && { icon: '🏢', label: 'Floors', value: property.floors },
              ].filter(Boolean).map((stat, i) => (
                <div key={i} style={{ background: isDark ? '#0f1923' : '#f8f9fa', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', marginBottom: '3px' }}>{stat.icon}</div>
                  <div style={{ fontWeight: '700', color: isDark ? '#e2e8f0' : '#1a3c5e', fontSize: '14px' }}>{stat.value}</div>
                  <div style={{ fontSize: '10px', color: subColor }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {(property.description_en || property.description_ar) && (
              <p style={{ color: isDark ? '#cbd5e0' : '#4a5568', lineHeight: '1.7', fontSize: '14px', background: isDark ? '#0f1923' : '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                {lang === 'ar' ? property.description_ar : property.description_en}
              </p>
            )}

            {/* Status management for owner */}
            {isOwner && (
              <div style={{ background: isDark ? '#0f1923' : '#f8f9fa', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 10px', fontWeight: '600', fontSize: '13px', color: subColor }}>{isRTL ? 'تحديث الحالة:' : 'Update Status:'}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['available', 'rented', 'sold', 'pending'].map(s => (
                    <button key={s} onClick={() => handleStatusChange(s)} disabled={updatingStatus || property.status === s} style={{
                      padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: property.status === s ? 'default' : 'pointer',
                      background: property.status === s ? statusColors[s] : isDark ? '#1a2535' : '#e2e8f0',
                      color: property.status === s ? 'white' : subColor,
                      fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
                      transition: 'all 0.2s'
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Owner contact */}
            <div style={{ background: 'linear-gradient(135deg, #1a3c5e, #2d6a9f)', padding: '16px', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>{property.owner_agency || property.owner_name}</h4>
              {property.owner_agency && <p style={{ margin: '0 0 12px', opacity: 0.7, fontSize: '12px' }}>{property.owner_name}</p>}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {property.owner_phone && (
                  <a href={`tel:${property.owner_phone}`} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                    📞 {property.owner_phone}
                  </a>
                )}
                {property.owner_whatsapp && (
                  <a href={`https://wa.me/${property.owner_whatsapp}`} target="_blank" rel="noreferrer" style={{ background: '#25d366', color: 'white', textDecoration: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={handleShare} style={{ background: '#25d366', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                📤 {isRTL ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}
              </button>
              <span style={{ color: subColor, fontSize: '12px' }}>👁 {property.views_count} {isRTL ? 'مشاهدة' : 'views'}</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        {!isOwner && (property.owner_whatsapp || property.owner_phone) && (
          <div style={{ background: cardBg, borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px' }} className="dm-card">
            <h3 style={{ color: '#1a3c5e', marginBottom: '20px', fontSize: '18px' }} className="dm-heading">
              💬 {isRTL ? 'تواصل مع المالك' : 'Contact Owner'}
            </h3>
            {contactSent ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#276749', background: '#f0fff4', borderRadius: '8px' }}>
                ✅ {isRTL ? 'تم فتح واتساب للتواصل!' : 'WhatsApp opened for contact!'}
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: subColor }}>{isRTL ? 'الاسم' : 'Your Name'}</label>
                    <input value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} required style={{ width: '100%', padding: '10px', border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`, borderRadius: '8px', background: isDark ? '#0f1923' : 'white', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: subColor }}>{t('phone')}</label>
                    <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} required style={{ width: '100%', padding: '10px', border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`, borderRadius: '8px', background: isDark ? '#0f1923' : 'white', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: subColor }}>{isRTL ? 'الرسالة' : 'Message'}</label>
                  <textarea value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} required style={{ width: '100%', padding: '10px', border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`, borderRadius: '8px', background: isDark ? '#0f1923' : 'white', color: textColor, boxSizing: 'border-box', minHeight: '90px', resize: 'vertical' }}
                    placeholder={isRTL ? 'أنا مهتم بهذا العقار...' : "I'm interested in this property..."} />
                </div>
                <button type="submit" style={{ background: '#25d366', color: 'white', border: 'none', padding: '11px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                  💬 {isRTL ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div>
            <h3 style={{ color: isDark ? '#e2e8f0' : '#1a3c5e', marginBottom: '16px', fontSize: '18px' }}>
              {isRTL ? 'عقارات مشابهة' : 'Similar Properties'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
              {similar.map(p => (
                <div key={p.id} onClick={() => { navigate(`/properties/${p.id}`); window.scrollTo(0,0); }} className="property-card dm-card" style={{ background: cardBg, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer' }}>
                  <div style={{ height: '150px', background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                    {p.main_image ? <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ margin: '0 0 4px', color: isDark ? '#e2e8f0' : '#2d3748', fontSize: '13px' }}>{lang === 'ar' ? p.title_ar : p.title_en}</h4>
                    <p style={{ margin: '0', color: '#c8a951', fontWeight: '700', fontSize: '14px' }}>{p.price} {t('bd')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailPage;
