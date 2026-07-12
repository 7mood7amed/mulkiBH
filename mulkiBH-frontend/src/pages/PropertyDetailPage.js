/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty, getProperties, updateProperty } from '../api/properties';
import { useLang } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';

const Icon = ({ name, fill, size = 20, style = {} }) => (
  <span className={`material-symbols-outlined ${fill ? 'ms-fill' : ''}`} style={{ fontSize: size, ...style }}>{name}</span>
);

const AMENITIES_EN = ['Private Parking', 'Smart Home System', 'Central AC', 'Security & CCTV', 'Built-in Kitchen', 'Maid\'s Room', 'Balcony / Terrace', 'High-Speed Internet Ready'];
const AMENITIES_AR = ['موقف سيارات خاص', 'نظام منزل ذكي', 'تكييف مركزي', 'أمن وكاميرات مراقبة', 'مطبخ مجهز', 'غرفة خادمة', 'شرفة / تراس', 'جاهز للإنترنت عالي السرعة'];

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { lang } = useLang();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const ar = lang === 'ar';

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
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px clamp(20px,5vw,64px)' }}>
      <div className="skeleton" style={{ height: '480px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }} />
      <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '20px', width: '25%' }} />
    </div>
  );

  if (!property) return null;

  const isOwner = user && (user.id === property.owner_id || user.role === 'admin');
  const statusColors = { available: '#2e7d32', rented: '#2d6a9f', sold: '#ba1a1a', pending: '#a37c1a' };
  const fav = isFavorite(property.id);
  const title = ar ? property.title_ar : property.title_en;
  const description = ar ? property.description_ar : property.description_en;
  const images = property.images || [];
  const amenities = ar ? AMENITIES_AR : AMENITIES_EN;

  const statCard = { background: 'var(--surface-low)', border: '1px solid rgba(196,198,206,0.4)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' };

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 72px)' }} className="fade-in">
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px clamp(20px,5vw,64px) 64px' }}>

        {/* ═══ GALLERY ═══ */}
        <section style={{ marginBottom: '32px' }}>
          {images.length >= 3 ? (
            <div className="detail-gallery" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', height: '520px' }}>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <img src={images[0].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px' }}>
                  <span className="badge-pill" style={{ background: 'var(--gold-fixed)', color: 'var(--on-gold)' }}>
                    {property.listing_type === 'rent' ? (ar ? 'للإيجار' : 'FOR RENT') : (ar ? 'للبيع' : 'FOR SALE')}
                  </span>
                  {property.is_featured && <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--primary)' }}>{ar ? 'حصري' : 'EXCLUSIVE'}</span>}
                </div>
                <button onClick={() => toggleFavorite(property)} style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: fav ? '#ba1a1a' : 'white' }}>
                  <Icon name="favorite" fill={fav} />
                </button>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,17,37,0.75)', backdropFilter: 'blur(6px)', color: 'white', padding: '10px 22px', borderRadius: 'var(--radius)' }} className="heading-display">
                  BHD {Number(property.price).toLocaleString()}{property.listing_type === 'rent' && <span style={{ fontSize: '13px' }}> /{ar ? 'شهر' : 'mo'}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <img src={images[1].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <img src={images[2].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: images.length > 3 ? 'pointer' : 'default' }} onClick={() => images.length > 3 && setActiveImage(3)}>
                    <img src={(images[3] || images[2]).image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {images.length > 4 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                        +{images.length - 4} {ar ? 'المزيد' : 'More'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--primary)' }}>
                {images.length > 0 ? (
                  <img src={images[activeImage]?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Icon name="villa" size={64} style={{ color: 'rgba(255,255,255,0.25)' }} /></div>
                )}
                <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                  <span className="badge-pill" style={{ background: 'var(--gold-fixed)', color: 'var(--on-gold)' }}>
                    {property.listing_type === 'rent' ? (ar ? 'للإيجار' : 'FOR RENT') : (ar ? 'للبيع' : 'FOR SALE')}
                  </span>
                </div>
                <button onClick={() => toggleFavorite(property)} style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: fav ? '#ba1a1a' : 'white' }}>
                  <Icon name="favorite" fill={fav} />
                </button>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,17,37,0.75)', backdropFilter: 'blur(6px)', color: 'white', padding: '10px 22px', borderRadius: 'var(--radius)' }} className="heading-display">
                  BHD {Number(property.price).toLocaleString()}{property.listing_type === 'rent' && <span style={{ fontSize: '13px' }}> /{ar ? 'شهر' : 'mo'}</span>}
                </div>
              </div>
              {images.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                  {images.slice(0, 4).map((img, i) => (
                    <div key={i} onClick={() => setActiveImage(i)} style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: 'var(--radius)', height: '90px', boxShadow: activeImage === i ? '0 0 0 2px var(--gold)' : 'none' }}>
                      <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeImage === i ? 1 : 0.75 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ═══ TITLE / BREADCRUMB / PRICE ═══ */}
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid rgba(196,198,206,0.3)', paddingBottom: '28px', marginBottom: '32px' }}>
          <div>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--outline)', fontSize: '13px' }}>
              <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>{ar ? 'الرئيسية' : 'Home'}</span>
              <span>/</span>
              <span onClick={() => navigate(`/properties?governorate=${property.governorate?.id}`)} style={{ cursor: 'pointer' }}>{ar ? property.governorate?.name_ar : property.governorate?.name_en}</span>
              <span>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{ar ? property.category?.name_ar : property.category?.name_en}</span>
            </nav>
            <h1 className="headline-xl" style={{ color: 'var(--primary)', fontSize: 'clamp(28px,4vw,42px)', marginBottom: '10px' }}>{title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-variant)' }}>
              <Icon name="location_on" size={19} style={{ color: 'var(--gold-text)' }} />
              <span>{ar ? property.city?.name_ar : property.city?.name_en}, {ar ? property.governorate?.name_ar : property.governorate?.name_en}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="label-md" style={{ color: 'var(--gold-text)', fontSize: '11px', marginBottom: '4px' }}>{ar ? 'سعر القائمة' : 'Listing Price'}</p>
            <h2 className="headline-lg" style={{ color: 'var(--primary)' }}>
              BHD {Number(property.price).toLocaleString()}{property.listing_type === 'rent' && <span style={{ fontSize: '15px', fontFamily: 'Inter', fontWeight: 500, color: 'var(--outline)' }}> /{ar ? 'شهر' : 'mo'}</span>}
            </h2>
          </div>
        </section>

        {/* ═══ STATS GRID ═══ */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            property.bedrooms != null && { icon: 'bed', label: ar ? 'غرف النوم' : 'Bedrooms', value: property.bedrooms },
            property.bathrooms != null && { icon: 'bathtub', label: ar ? 'الحمامات' : 'Bathrooms', value: property.bathrooms },
            property.area_sqm && { icon: 'square_foot', label: ar ? 'المساحة الكلية' : 'Total Area', value: `${property.area_sqm} m²` },
            property.floors && { icon: 'layers', label: ar ? 'الطوابق' : 'Floors', value: property.floors },
          ].filter(Boolean).map((s, i) => (
            <div key={i} style={statCard}>
              <Icon name={s.icon} size={32} style={{ color: 'var(--primary)' }} />
              <p className="headline-md" style={{ color: 'var(--primary)', margin: 0 }}>{s.value}</p>
              <p className="label-md" style={{ color: 'var(--outline)', fontSize: '11px', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </section>

        {/* Owner status management */}
        {isOwner && (
          <section style={{ background: 'var(--surface-low)', border: '1px solid rgba(196,198,206,0.4)', padding: '20px', borderRadius: 'var(--radius-lg)', marginBottom: '32px' }}>
            <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: '12px', color: 'var(--text-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ar ? 'تحديث الحالة' : 'Update Status'}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['available', 'rented', 'sold', 'pending'].map(s => (
                <button key={s} onClick={() => handleStatusChange(s)} disabled={updatingStatus || property.status === s} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius)', border: 'none', cursor: property.status === s ? 'default' : 'pointer',
                  background: property.status === s ? statusColors[s] : 'var(--surface-mid)', color: property.status === s ? 'white' : 'var(--text-variant)',
                  fontSize: '12px', fontWeight: 700, textTransform: 'capitalize',
                }}>{s}</button>
              ))}
            </div>
          </section>
        )}

        {/* ═══ CONTENT SPLIT ═══ */}
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {description && (
              <section style={{ marginBottom: '48px' }}>
                <h2 className="headline-lg" style={{ color: 'var(--primary)', marginBottom: '16px' }}>{ar ? 'نظرة عامة على العقار' : 'Property Overview'}</h2>
                <p style={{ color: 'var(--text-variant)', fontSize: '16px', lineHeight: 1.8 }}>{description}</p>
              </section>
            )}

            {/* Amenities (illustrative — full checklist coming soon) */}
            <section style={{ marginBottom: '48px' }}>
              <h3 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '18px' }}>{ar ? 'المرافق والمميزات' : 'Amenities & Features'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {amenities.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', fontSize: '14px' }}>
                    <Icon name="check_circle" fill size={19} style={{ color: 'var(--gold-text)' }} /> {a}
                  </div>
                ))}
              </div>
            </section>

            {/* Location (illustrative map — live map coming soon) */}
            <section>
              <h3 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '18px' }}>{ar ? 'الموقع' : 'Location'}</h3>
              <div style={{ width: '100%', height: '280px', background: 'var(--surface-mid)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(196,198,206,0.4)', position: 'relative', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(196,198,206,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(196,198,206,0.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', borderRadius: 'var(--radius)', boxShadow: '0 12px 30px rgba(0,17,37,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon name="location_on" fill size={20} style={{ color: 'var(--gold-fixed)' }} />
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>{ar ? property.city?.name_ar : property.city?.name_en}, {ar ? property.governorate?.name_ar : property.governorate?.name_en}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right column: Contact card */}
          <aside style={{ position: 'sticky', top: '92px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-cont) 100%)', color: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 50px rgba(0,17,37,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-48px', right: '-48px', width: '140px', height: '140px', background: 'rgba(200,169,81,0.2)', borderRadius: '50%', filter: 'blur(30px)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--gold)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="person" size={28} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <h3 className="heading-display" style={{ fontSize: '19px', marginBottom: '2px' }}>{property.owner_agency || property.owner_name}</h3>
                    <p style={{ color: 'var(--gold-fixed)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                      {property.owner_agency ? property.owner_name : (ar ? 'جهة الاتصال' : 'Property Contact')}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {property.owner_phone && (
                    <a href={`tel:${property.owner_phone}`} className="btn-gold" style={{ textDecoration: 'none', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Icon name="call" size={19} />{ar ? 'اتصل الآن' : 'Call Now'}
                    </a>
                  )}
                  {property.owner_whatsapp && (
                    <a href={`https://wa.me/${property.owner_whatsapp}`} target="_blank" rel="noreferrer" style={{ border: '2px solid var(--gold)', color: 'var(--gold)', textDecoration: 'none', padding: '12px', borderRadius: 'var(--radius)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Icon name="chat" size={19} />{ar ? 'واتساب' : 'WhatsApp Messenger'}
                    </a>
                  )}
                </div>

                {contactSent ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#9be89b', background: 'rgba(46,125,50,0.15)', borderRadius: 'var(--radius)', fontSize: '14px' }}>
                    {ar ? 'تم فتح واتساب للتواصل!' : 'WhatsApp opened for contact!'}
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-fixed)', display: 'block', marginBottom: '4px' }}>{ar ? 'اسمك' : 'Your Name'}</label>
                      <input value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} required placeholder={ar ? 'الاسم الكامل' : 'Full Name'} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderBottom: '1px solid rgba(200,169,81,0.3)', color: 'white', padding: '8px 0', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-fixed)', display: 'block', marginBottom: '4px' }}>{ar ? 'الاستفسار' : 'Inquiry'}</label>
                      <textarea value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} required rows={3} placeholder={ar ? 'أنا مهتم بهذا العقار...' : 'I am interested in this property...'} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderBottom: '1px solid rgba(200,169,81,0.3)', color: 'white', padding: '8px 0', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                    </div>
                    <button type="submit" style={{ width: '100%', background: 'white', color: 'var(--primary)', fontWeight: 700, padding: '13px', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {ar ? 'إرسال طلب آمن' : 'Send Secure Request'}
                    </button>
                  </form>
                )}
                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {ar ? `رقم القائمة الرسمي #BH-${property.id}` : `Official Listing #BH-${property.id}`}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--outline)' }}>
                <Icon name="verified_user" size={16} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{ar ? 'إعلان موثق' : 'Verified Listing'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--outline)' }}>
                <Icon name="visibility" size={16} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{property.views_count} {ar ? 'مشاهدة' : 'Views'}</span>
              </div>
            </div>
          </aside>
        </div>

        {/* ═══ SIMILAR PROPERTIES ═══ */}
        {similar.length > 0 && (
          <section style={{ marginTop: '80px', borderTop: '1px solid rgba(196,198,206,0.3)', paddingTop: '48px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', marginBottom: '32px' }}>
              <h2 className="headline-lg" style={{ color: 'var(--primary)' }}>{ar ? 'عقارات حصرية مشابهة' : 'Similar Exclusive Properties'}</h2>
              <a onClick={() => navigate('/properties')} style={{ color: 'var(--gold-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', textDecoration: 'none' }}>
                {ar ? 'عرض كل المحفظة' : 'View All Portfolio'}
                <Icon name="arrow_forward" size={18} />
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {similar.map(p => (
                <div key={p.id} className="property-card" style={{ overflow: 'hidden' }} onClick={() => { navigate(`/properties/${p.id}`); window.scrollTo(0, 0); }}>
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    {p.main_image
                      ? <img className="card-img" src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-cont))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="villa" size={44} style={{ color: 'rgba(255,255,255,0.25)' }} /></div>}
                    <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(0,17,37,0.75)', backdropFilter: 'blur(6px)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: 700 }}>
                      BHD {Number(p.price).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ padding: '18px' }}>
                    <h4 className="headline-md" style={{ color: 'var(--primary)', fontSize: '17px', marginBottom: '4px' }}>{ar ? p.title_ar : p.title_en}</h4>
                    <p style={{ color: 'var(--text-variant)', fontSize: '13px', marginBottom: '14px' }}>{p.city_name}, {p.governorate_name}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '13px', borderTop: '1px solid rgba(196,198,206,0.25)', fontSize: '12px', color: 'var(--text-variant)' }}>
                      {p.bedrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon name="bed" size={16} style={{ color: 'var(--outline)' }} /> {p.bedrooms}</span>}
                      {p.bathrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon name="bathtub" size={16} style={{ color: 'var(--outline)' }} /> {p.bathrooms}</span>}
                      {p.area_sqm && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon name="square_foot" size={16} style={{ color: 'var(--outline)' }} /> {p.area_sqm} m²</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .detail-gallery { grid-template-columns: 1fr !important; height: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;
