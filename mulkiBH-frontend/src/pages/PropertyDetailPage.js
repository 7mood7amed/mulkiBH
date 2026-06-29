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
    getProperty(id).then(r => { setProperty(r.data); setLoading(false); }).catch(() => navigate('/properties'));
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>{t('loading')}</div>;
  if (!property) return null;

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr', maxWidth: '1000px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#1a3c5e', cursor: 'pointer', marginBottom: '16px', fontSize: '15px' }}>← {t('back')}</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Images */}
        <div>
          <div style={{ height: '300px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>
            {property.images?.length > 0
              ? <img src={property.images[activeImage]?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '🏠'}
          </div>
          {property.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {property.images.map((img, i) => (
                <img key={i} src={img.image} alt="" onClick={() => setActiveImage(i)}
                  style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', opacity: activeImage === i ? 1 : 0.6 }} />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, color: '#1a3c5e' }}>{lang === 'ar' ? property.title_ar : property.title_en}</h2>
            <span style={{ background: property.listing_type === 'rent' ? '#ebf8ff' : '#f0fff4', color: property.listing_type === 'rent' ? '#2b6cb0' : '#276749', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {property.listing_type === 'rent' ? t('forRent') : t('forSale')}
            </span>
          </div>

          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#c8a951', margin: '0 0 16px' }}>{property.price} {t('bd')}</p>
          <p style={{ color: '#718096', marginBottom: '16px' }}>📍 {property.city?.name_en}, {property.governorate?.name_en}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {property.bedrooms && <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>🛏 {property.bedrooms} {t('bedrooms')}</div>}
            {property.bathrooms && <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>🚿 {property.bathrooms} {t('bathrooms')}</div>}
            {property.area_sqm && <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>📐 {property.area_sqm} {t('sqm')}</div>}
            {property.floors && <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>🏢 {property.floors} floors</div>}
          </div>

          <p style={{ color: '#4a5568', lineHeight: '1.7', marginBottom: '24px' }}>{lang === 'ar' ? property.description_ar : property.description_en}</p>

          {/* Owner Contact */}
          <div style={{ background: '#f0f4f8', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ margin: '0 0 12px', color: '#1a3c5e' }}>{property.owner_agency || property.owner_name}</h4>
            {property.owner_phone && (
              <a href={`tel:${property.owner_phone}`} style={{ display: 'block', color: '#1a3c5e', textDecoration: 'none', marginBottom: '8px' }}>📞 {property.owner_phone}</a>
            )}
            {property.owner_whatsapp && (
              <a href={`https://wa.me/${property.owner_whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'block', color: '#25d366', textDecoration: 'none' }}>💬 WhatsApp</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
