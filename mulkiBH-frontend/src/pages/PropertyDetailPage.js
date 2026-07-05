/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty } from '../api/properties';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const t = useT();
  const { isRTL, lang } = useLang();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getProperty(id)
      .then(r => { setProperty(r.data); setLoading(false); })
      .catch(() => navigate('/properties'));
  }, [id]);

  if (loading) return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
      <div className="skeleton" style={{ height: '32px', width: '120px', marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }} />
        <div>
          <div className="skeleton" style={{ height: '28px', marginBottom: '12px' }} />
          <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '12px' }} />
          <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '24px' }} />
          <div className="skeleton" style={{ height: '100px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );

  if (!property) return null;

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in your property: ${property.title_en} - ${window.location.href}`
  );

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }} className="fade-in">
      {/* Breadcrumb */}
      <div style={{ background: 'white', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: '#718096' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>🏠</span>
          <span>›</span>
          <span onClick={() => navigate('/properties')} style={{ cursor: 'pointer', color: '#1a3c5e' }}>{t('properties')}</span>
          <span>›</span>
          <span style={{ color: '#2d3748' }}>{lang === 'ar' ? property.title_ar : property.title_en}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

          {/* Images */}
          <div className="fade-in-up">
            <div style={{
              height: '300px', background: '#e2e8f0', borderRadius: '12px',
              overflow: 'hidden', marginBottom: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px'
            }}>
              {property.images?.length > 0
                ? <img src={property.images[activeImage]?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }} />
                : '🏠'}
            </div>
            {property.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {property.images.map((img, i) => (
                  <img key={i} src={img.image} alt="" onClick={() => setActiveImage(i)}
                    style={{
                      width: '70px', height: '52px', objectFit: 'cover', borderRadius: '6px',
                      cursor: 'pointer', flexShrink: 0,
                      opacity: activeImage === i ? 1 : 0.6,
                      border: activeImage === i ? '2px solid #1a3c5e' : '2px solid transparent',
                      transition: 'all 0.2s ease'
                    }} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="fade-in-up delay-1">
            {/* Title & Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ margin: 0, color: '#1a3c5e', fontSize: 'clamp(18px, 3vw, 24px)' }}>
                {lang === 'ar' ? property.title_ar : property.title_en}
              </h2>
              <span style={{
                background: property.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4',
                color: property.listing_type === 'rent' ? '#2b6cb0' : '#276749',
                padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap'
              }}>
                {property.listing_type === 'rent' ? t('forRent') : t('forSale')}
              </span>
            </div>

            {/* Price */}
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#c8a951', margin: '0 0 8px' }}>
              {property.price} {t('bd')}
              {property.listing_type === 'rent' && <span style={{ fontSize: '14px', color: '#718096', fontWeight: 'normal' }}> /{isRTL ? 'شهر' : 'month'}</span>}
            </p>

            {/* Location */}
            <p style={{ color: '#718096', marginBottom: '16px', fontSize: '14px' }}>
              📍 {property.city?.name_en}, {property.governorate?.name_en}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {[
                property.bedrooms && { icon: '🛏', label: t('bedrooms'), value: property.bedrooms },
                property.bathrooms && { icon: '🚿', label: t('bathrooms'), value: property.bathrooms },
                property.area_sqm && { icon: '📐', label: t('area'), value: `${property.area_sqm} ${t('sqm')}` },
                property.floors && { icon: '🏢', label: isRTL ? 'طوابق' : 'Floors', value: property.floors },
              ].filter(Boolean).map((stat, i) => (
                <div key={i} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontWeight: '700', color: '#1a3c5e', fontSize: '15px' }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: '#718096' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {(property.description_en || property.description_ar) && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#1a3c5e', marginBottom: '8px' }}>{isRTL ? 'الوصف' : 'Description'}</h4>
                <p style={{ color: '#4a5568', lineHeight: '1.7', fontSize: '14px', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                  {lang === 'ar' ? property.description_ar : property.description_en}
                </p>
              </div>
            )}

            {/* Owner Contact */}
            <div style={{ background: 'linear-gradient(135deg, #1a3c5e, #2d6a9f)', padding: '18px', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '16px' }}>{property.owner_agency || property.owner_name}</h4>
              {property.owner_agency && <p style={{ margin: '0 0 12px', opacity: 0.7, fontSize: '13px' }}>{property.owner_name}</p>}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {property.owner_phone && (
                  <a href={`tel:${property.owner_phone}`} style={{
                    background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none',
                    padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                    transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
                  }}>📞 {property.owner_phone}</a>
                )}
                {property.owner_whatsapp && (
                  <a href={`https://wa.me/${property.owner_whatsapp}?text=${whatsappMsg}`}
                    target="_blank" rel="noreferrer" style={{
                      background: '#25d366', color: 'white', textDecoration: 'none',
                      padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>💬 WhatsApp</a>
                )}
              </div>
            </div>

            {/* Share */}
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: property.title_en, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert(isRTL ? 'تم نسخ الرابط!' : 'Link copied!');
                }
              }} style={{
                background: 'white', border: '1px solid #e2e8f0', color: '#4a5568',
                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                transition: 'all 0.2s ease'
              }}>
                🔗 {isRTL ? 'مشاركة' : 'Share'}
              </button>
              <span style={{ color: '#a0aec0', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                👁 {property.views_count} {isRTL ? 'مشاهدة' : 'views'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
