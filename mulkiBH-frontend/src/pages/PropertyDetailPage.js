/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty, getProperties, updateProperty } from '../api/properties';
import { useLang } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { lang } = useLang();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProperty(id)
      .then(r => {
        setProperty(r.data);
        setActiveImage(0);
        setLoading(false);
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
    const msg = encodeURIComponent(
      `Hi ${property.owner_agency || property.owner_name},\n${contactForm.message}\n\nProperty: ${property.title_en}\n${window.location.href}\n\nFrom: ${contactForm.name}`
    );
    window.open(`https://wa.me/${property.owner_whatsapp || property.owner_phone}?text=${msg}`, '_blank');
    setContactSent(true);
  };

  if (loading) return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px' }}>
      <div className="skeleton" style={{ height: '480px', borderRadius: '2px', marginBottom: '24px' }} />
      <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '20px', width: '25%' }} />
    </div>
  );

  if (!property) return null;

  const isOwner = user && (user.id === property.owner_id || user.role === 'admin');
  const statusColors = { available: '#2e7d32', rented: '#2d6a9f', sold: '#ba1a1a', pending: '#a37c1a' };
  const fav = isFavorite(property.id);
  const title = lang === 'ar' ? property.title_ar : property.title_en;
  const description = lang === 'ar' ? property.description_ar : property.description_en;

  const statStyle = { background: '#f0f4f8', padding: '16px', borderRadius: '2px', borderLeft: '3px solid #c8a951', display: 'flex', flexDirection: 'column', gap: '6px' };

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }} className="fade-in">
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px 60px' }}>
        {/* Breadcrumbs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#44474d', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          <span onClick={() => navigate('/properties')} style={{ cursor: 'pointer' }}>{lang === 'ar' ? 'العقارات' : 'Properties'}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          <span style={{ color: '#c8a951' }}>{title}</span>
        </nav>

        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Gallery */}
            <section>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '2px', background: '#0f2640' }}>
                {property.images?.length > 0 ? (
                  <img src={property.images[activeImage]?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '64px' }}>🏠</div>
                )}
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#c8a951', color: '#0f2640', fontWeight: '700', padding: '6px 16px', borderRadius: '2px', fontSize: '13px', textTransform: 'uppercase' }}>
                  {property.listing_type === 'rent' ? (lang === 'ar' ? 'للإيجار' : 'For Rent') : (lang === 'ar' ? 'للبيع' : 'For Sale')}
                </div>
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15,38,64,0.8)', backdropFilter: 'blur(6px)', color: 'white', padding: '10px 24px', borderRadius: '2px' }} className="heading-display">
                  BHD {property.price}{property.listing_type === 'rent' && <span style={{ fontSize: '13px' }}> /{lang === 'ar' ? 'شهر' : 'mo'}</span>}
                </div>
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => toggleFavorite(property)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: fav ? '#ba1a1a' : 'white' }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                </div>
              </div>
              {property.images?.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                  {property.images.slice(0, 4).map((img, i) => (
                    <div key={i} onClick={() => setActiveImage(i)} style={{
                      position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: '2px', height: '90px',
                      boxShadow: activeImage === i ? '0 0 0 2px #c8a951' : 'none',
                    }}>
                      <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeImage === i ? 1 : 0.75 }} />
                      {i === 3 && property.images.length > 4 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>
                          +{property.images.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Header */}
            <section style={{ borderBottom: '1px solid #dfe3e7', paddingBottom: '32px' }}>
              <h1 className="heading-display" style={{ fontSize: 'clamp(28px,4vw,42px)', color: '#0f2640', marginBottom: '10px' }}>{title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#44474d' }}>
                <span className="material-symbols-outlined" style={{ color: '#c8a951' }}>location_on</span>
                <span>{property.city?.name_en}, {property.governorate?.name_en}</span>
                <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#74777e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>{property.views_count}
                </span>
              </div>
            </section>

            {/* Stats */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
              {[
                property.bedrooms != null && { icon: 'bed', label: lang === 'ar' ? 'غرف النوم' : 'Bedrooms', value: String(property.bedrooms).padStart(2, '0') },
                property.bathrooms != null && { icon: 'bathtub', label: lang === 'ar' ? 'الحمامات' : 'Bathrooms', value: String(property.bathrooms).padStart(2, '0') },
                property.area_sqm && { icon: 'square_foot', label: lang === 'ar' ? 'المساحة الكلية' : 'Total Area', value: `${property.area_sqm} m²` },
                property.floors && { icon: 'layers', label: lang === 'ar' ? 'الطوابق' : 'Floors', value: String(property.floors).padStart(2, '0') },
              ].filter(Boolean).map((s, i) => (
                <div key={i} style={statStyle}>
                  <span style={{ color: '#44474d', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#2d6a9f' }}>{s.icon}</span>
                    <span className="heading-display" style={{ color: '#0f2640', fontSize: '20px' }}>{s.value}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* Owner status management */}
            {isOwner && (
              <section style={{ background: '#f0f4f8', padding: '16px', borderRadius: '2px' }}>
                <p style={{ margin: '0 0 10px', fontWeight: '700', fontSize: '12px', color: '#44474d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lang === 'ar' ? 'تحديث الحالة' : 'Update Status'}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['available', 'rented', 'sold', 'pending'].map(s => (
                    <button key={s} onClick={() => handleStatusChange(s)} disabled={updatingStatus || property.status === s} style={{
                      padding: '7px 14px', borderRadius: '2px', border: 'none', cursor: property.status === s ? 'default' : 'pointer',
                      background: property.status === s ? statusColors[s] : '#e4e9ed', color: property.status === s ? 'white' : '#44474d',
                      fontSize: '12px', fontWeight: '700', textTransform: 'capitalize',
                    }}>{s}</button>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            {description && (
              <section>
                <h2 className="heading-display" style={{ fontSize: '26px', color: '#0f2640', marginBottom: '16px' }}>
                  {lang === 'ar' ? 'نظرة عامة على العقار' : 'Property Overview'}
                </h2>
                <p style={{ color: '#44474d', fontSize: '16px', lineHeight: '1.8' }}>{description}</p>
              </section>
            )}
          </div>

          {/* Right column: Sidebar */}
          <aside style={{ position: 'sticky', top: '88px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f2640 0%, #1a3c5e 100%)', color: 'white', padding: '32px', borderRadius: '2px', boxShadow: '0 20px 50px rgba(15,38,64,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #c8a951', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#c8a951' }}>person</span>
                </div>
                <div>
                  <h3 className="heading-display" style={{ fontSize: '19px', marginBottom: '2px' }}>{property.owner_agency || property.owner_name}</h3>
                  <p style={{ color: '#ddc06b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                    {property.owner_agency ? property.owner_name : (lang === 'ar' ? 'جهة الاتصال' : 'Property Contact')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {property.owner_phone && (
                  <a href={`tel:${property.owner_phone}`} style={{ background: '#c8a951', color: '#0f2640', textDecoration: 'none', padding: '14px', borderRadius: '2px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined">call</span>{lang === 'ar' ? 'اتصل الآن' : 'Call Now'}
                  </a>
                )}
                {property.owner_whatsapp && (
                  <a href={`https://wa.me/${property.owner_whatsapp}`} target="_blank" rel="noreferrer" style={{ border: '2px solid #c8a951', color: '#c8a951', textDecoration: 'none', padding: '13px', borderRadius: '2px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined">chat</span>{lang === 'ar' ? 'واتساب' : 'WhatsApp Messenger'}
                  </a>
                )}
              </div>

              {contactSent ? (
                <div style={{ textAlign: 'center', padding: '16px', color: '#9be89b', background: 'rgba(46,125,50,0.15)', borderRadius: '2px', fontSize: '14px' }}>
                  {lang === 'ar' ? 'تم فتح واتساب للتواصل!' : 'WhatsApp opened for contact!'}
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ddc06b', display: 'block', marginBottom: '4px' }}>{lang === 'ar' ? 'اسمك' : 'Your Name'}</label>
                    <input value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} required placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderBottom: '1px solid rgba(200,169,81,0.3)', color: 'white', padding: '8px 0', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ddc06b', display: 'block', marginBottom: '4px' }}>{lang === 'ar' ? 'الاستفسار' : 'Inquiry'}</label>
                    <textarea value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} required rows={3} placeholder={lang === 'ar' ? 'أنا مهتم بهذا العقار...' : 'I am interested in this property...'} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderBottom: '1px solid rgba(200,169,81,0.3)', color: 'white', padding: '8px 0', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', background: 'white', color: '#0f2640', fontWeight: '700', padding: '13px', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {lang === 'ar' ? 'إرسال طلب آمن' : 'Send Secure Request'}
                  </button>
                </form>
              )}
              <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {lang === 'ar' ? `رقم القائمة الرسمي #BH-${property.id}` : `Official Listing #BH-${property.id}`}
              </p>
            </div>
          </aside>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <section style={{ marginTop: '80px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', marginBottom: '40px' }}>
              <div>
                <span style={{ color: '#c8a951', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '8px' }}>
                  {lang === 'ar' ? 'مجموعة مختارة' : 'Curated Collection'}
                </span>
                <h2 className="heading-display" style={{ fontSize: 'clamp(26px,4vw,36px)', color: '#0f2640' }}>
                  {lang === 'ar' ? 'عقارات حصرية مشابهة' : 'Similar Exclusive Properties'}
                </h2>
              </div>
              <a onClick={() => navigate('/properties')} style={{ color: '#2d6a9f', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', textDecoration: 'none' }}>
                {lang === 'ar' ? 'عرض كل المحفظة' : 'View All Portfolio'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {similar.map(p => (
                <div key={p.id} className="similar-card" style={{ background: 'white', border: '1px solid #dfe3e7', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <div className="similar-image" style={{ width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease', background: p.main_image ? `url('${p.main_image}') center/cover` : 'linear-gradient(135deg,#0f2640,#1a3c5e)' }} />
                    {p.is_featured && <div style={{ position: 'absolute', top: '14px', right: '14px', background: '#0f2640', color: 'white', fontSize: '11px', fontWeight: '700', padding: '5px 12px' }}>{lang === 'ar' ? 'حصري' : 'EXCLUSIVE'}</div>}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                      <h3 className="heading-display" style={{ color: '#0f2640', fontSize: '18px' }}>{lang === 'ar' ? p.title_ar : p.title_en}</h3>
                      <span style={{ color: '#c8a951', fontWeight: '700', flexShrink: 0 }}>BHD {p.price}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', color: '#44474d', fontSize: '13px', marginBottom: '20px' }}>
                      {p.bedrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>bed</span>{p.bedrooms}</span>}
                      {p.bathrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>bathtub</span>{p.bathrooms}</span>}
                      {p.area_sqm && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>square_foot</span>{p.area_sqm}m²</span>}
                    </div>
                    <button onClick={() => { navigate(`/properties/${p.id}`); window.scrollTo(0, 0); }} className="similar-details-btn" style={{ width: '100%', padding: '11px', border: '1px solid #0f2640', background: 'transparent', color: '#0f2640', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      {lang === 'ar' ? 'التفاصيل' : 'Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#0f2640', padding: '48px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          <div>
            <Logo size="md" dark />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: '1.8', marginTop: '16px' }}>
              {lang === 'ar' ? 'التميز العقاري السيادي. تنسيق أرقى المحافظ في المملكة.' : "Sovereign Real Estate Excellence. Curating the Kingdom's most prestigious portfolios."}
            </p>
          </div>
          <div>
            <h4 style={{ color: '#c8a951', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '13px', marginBottom: '16px' }}>{lang === 'ar' ? 'وصول سريع' : 'Quick Access'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[lang === 'ar' ? 'من نحن' : 'About Us', lang === 'ar' ? 'دليل العقارات' : 'Bahrain Real Estate Guide', lang === 'ar' ? 'تقارير السوق' : 'Market Reports'].map((l, i) => (
                <a key={i} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'underline', textUnderlineOffset: '4px' }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#c8a951', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '13px', marginBottom: '16px' }}>{lang === 'ar' ? 'قانوني' : 'Legal'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service', lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'].map((l, i) => (
                <a key={i} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'underline', textUnderlineOffset: '4px' }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#c8a951', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '13px', marginBottom: '16px' }}>{lang === 'ar' ? 'الدعم' : 'Support'}</h4>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginBottom: '12px' }}>{lang === 'ar' ? 'خدمة كونسيرج على مدار الساعة للعملاء المؤسسيين' : '24/7 Concierge Service for Institutional Clients'}</p>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.85)', fontWeight: '700', borderBottom: '1px solid #c8a951', paddingBottom: '2px', textDecoration: 'none' }}>{lang === 'ar' ? 'تواصل مع الدعم' : 'Contact Support'}</a>
          </div>
        </div>
        <div style={{ maxWidth: '1280px', margin: '32px auto 0', paddingTop: '24px', borderTop: '1px solid #1a3c5e', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{lang === 'ar' ? '© 2026 ملكي. جميع الحقوق محفوظة.' : '© 2026 MulkiBH. All rights reserved. Sovereign Real Estate Excellence.'}</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['public', 'share', 'mail'].map(icon => <span key={icon} className="material-symbols-outlined" style={{ color: '#c8a951', cursor: 'pointer' }}>{icon}</span>)}
          </div>
        </div>
      </footer>

      <style>{`
        .similar-card:hover .similar-image { transform: scale(1.1); }
        .similar-card:hover .similar-details-btn { background: #0f2640; color: white; }
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;
