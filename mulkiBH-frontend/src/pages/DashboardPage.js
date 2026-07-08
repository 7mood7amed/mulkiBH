/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { getUnreadCount } from '../api/notifications';
import { getCurrentSubscription } from '../api/subscriptions';
import { getMyProperties } from '../api/properties';
import { getMyOrders } from '../api/orders';

const formatValuation = (total) => {
  if (total >= 1_000_000) return `BHD ${(total / 1_000_000).toFixed(1)}M`;
  if (total >= 1_000) return `BHD ${(total / 1_000).toFixed(0)}K`;
  return `BHD ${total}`;
};

const DashboardPage = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [properties, setProperties] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getUnreadCount().then(r => setUnread(r.data.unread_count)).catch(() => {});
    if (user.role !== 'visitor') {
      getCurrentSubscription().then(r => setSubscription(r.data)).catch(() => {});
      getMyProperties().then(r => setProperties(r.data)).catch(() => {});
    } else {
      getMyOrders().then(r => setOrderCount(r.data.length)).catch(() => {});
    }
  }, []);

  if (!user) return null;

  const isVisitor = user.role === 'visitor';
  const activeListings = properties.filter(p => p.status === 'available').length;
  const totalValuation = properties.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);

  const bigCards = isVisitor ? [
    { icon: 'receipt_long', bg: 'rgba(200,169,81,0.1)', title: lang === 'ar' ? 'طلباتي' : 'My Orders', desc: lang === 'ar' ? 'تتبع طلباتك العقارية الحالية والسابقة.' : 'Track your current and past property requests.', path: '/orders' },
  ] : [
    { icon: 'apartment', bg: '#0f2640', iconColor: '#c8a951', title: lang === 'ar' ? 'عقاراتي' : 'My Properties', desc: lang === 'ar' ? `إدارة ومراقبة محفظتك المكونة من ${activeListings} عقار نشط.` : `Manage and monitor your portfolio of ${activeListings} active properties.`, path: '/my-properties' },
    { icon: 'receipt_long', bg: 'rgba(200,169,81,0.1)', title: lang === 'ar' ? 'الطلبات' : 'Orders', desc: lang === 'ar' ? 'تتبع المعاملات الجارية وسجل الاستحواذ.' : 'Track ongoing transactions and historical acquisition logs.', path: '/orders' },
  ];

  const smallCards = [
    { icon: 'notifications_active', title: lang === 'ar' ? 'الإشعارات' : 'Notifications', desc: lang === 'ar' ? 'ابقَ مطلعاً على تحركات السوق والتنبيهات.' : 'Stay updated on market movements and alerts.', path: '/notifications', badge: unread },
    ...(!isVisitor ? [{ icon: 'workspace_premium', dark: true, title: lang === 'ar' ? 'الاشتراك' : 'Subscription', desc: subscription?.plan_name ? (lang === 'ar' ? `خطتك الحالية: ${subscription.plan_name}` : `Current plan: ${subscription.plan_name}`) : (lang === 'ar' ? 'إدارة مزايا وفوترة العضوية المميزة.' : 'Manage your Premium Tier membership benefits and billing.'), path: '/subscriptions' }] : []),
    { icon: 'person', title: lang === 'ar' ? 'الملف الشخصي' : 'Profile', desc: lang === 'ar' ? 'تحديث بيانات الهوية وإعدادات الأمان.' : 'Update your identification and security settings.', path: '/profile' },
  ];

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)', paddingBottom: !isVisitor ? '90px' : '0' }}>
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px' }}>
        {/* Welcome Banner */}
        <section style={{ marginBottom: '48px', position: 'relative', overflow: 'hidden', background: '#0f2640', padding: 'clamp(28px,4vw,48px)', borderRadius: '4px', border: '1px solid #1a3c5e' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', background: 'rgba(200,169,81,0.06)', borderRadius: '50%', filter: 'blur(40px)' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(200,169,81,0.1)', border: '1px solid rgba(200,169,81,0.3)', color: '#c8a951', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>stars</span>
                {isVisitor ? (lang === 'ar' ? 'زائر' : 'Visitor') : (subscription?.plan_name || (lang === 'ar' ? 'مالك' : (user.role === 'agency' ? 'Agency' : 'Owner')))}
              </div>
              <h1 className="heading-display" style={{ fontSize: 'clamp(26px,4vw,42px)', color: 'white', marginBottom: '10px' }}>
                {lang === 'ar' ? `مرحباً بعودتك، ${user.full_name}` : `Welcome back, ${user.full_name}`}
              </h1>
              <p style={{ color: '#94a9c9', fontSize: '16px', maxWidth: '480px' }}>
                {isVisitor
                  ? (lang === 'ar' ? 'تصفح أحدث العقارات وتابع طلباتك من هنا.' : 'Explore the latest listings and track your requests from here.')
                  : (lang === 'ar' ? 'استعرض أصولك العقارية في البحرين أدناه.' : 'Explore your real estate assets in Bahrain below.')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {isVisitor ? (
                <>
                  <div style={{ background: 'rgba(26,60,94,0.5)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: '#ddc06b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{lang === 'ar' ? 'المفضلة' : 'Favorites'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{String(favorites.length).padStart(2, '0')}</span>
                  </div>
                  <div style={{ background: 'rgba(26,60,94,0.5)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: '#ddc06b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{lang === 'ar' ? 'الطلبات' : 'Orders'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{String(orderCount).padStart(2, '0')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: 'rgba(26,60,94,0.5)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: '#ddc06b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{lang === 'ar' ? 'إعلانات نشطة' : 'Active Listings'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{String(activeListings).padStart(2, '0')}</span>
                  </div>
                  <div style={{ background: 'rgba(26,60,94,0.5)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: '#ddc06b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{lang === 'ar' ? 'إجمالي التقييم' : 'Total Valuation'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{formatValuation(totalValuation)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: `repeat(${bigCards.length === 2 ? 2 : 1}, 1fr)`, gap: '24px', marginBottom: '24px' }} className="bento-big">
          {bigCards.map((c, i) => (
            <div key={i} onClick={() => navigate(c.path)} className="bento-card" style={{ height: '256px', background: 'white', border: '1px solid rgba(196,198,206,0.4)', padding: '32px', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(15,38,64,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: c.iconColor || '#c8a951' }}>{c.icon}</span>
                </div>
                <span className="material-symbols-outlined bento-arrow" style={{ color: '#74777e' }}>arrow_outward</span>
              </div>
              <div>
                <h3 className="heading-display" style={{ color: '#0f2640', fontSize: '22px', marginBottom: '8px' }}>{c.title}</h3>
                <p style={{ color: '#44474d', fontSize: '15px' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`, gap: '24px', marginBottom: '64px' }}>
          {smallCards.map((c, i) => (
            <div key={i} onClick={() => navigate(c.path)} className="bento-card" style={{
              background: c.dark ? '#001125' : 'white', border: `1px solid ${c.dark ? '#1a3c5e' : 'rgba(196,198,206,0.4)'}`,
              padding: '32px', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: c.dark ? 'none' : '0 1px 3px rgba(15,38,64,0.06)', minHeight: '200px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: c.dark ? '#c8a951' : '#eaeef2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: c.dark ? '#0f2640' : '#1a3c5e', fontVariationSettings: c.dark ? "'FILL' 1" : "'FILL' 0" }}>{c.icon}</span>
                  </div>
                  {c.badge > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', background: '#ba1a1a', color: 'white', fontSize: '10px', fontWeight: '700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.badge}</span>
                  )}
                </div>
                {c.dark && <span className="material-symbols-outlined" style={{ color: '#c8a951' }}>arrow_forward</span>}
              </div>
              <div style={{ marginTop: '24px' }}>
                <h3 className="heading-display" style={{ color: c.dark ? 'white' : '#0f2640', fontSize: '19px', marginBottom: '6px' }}>{c.title}</h3>
                <p style={{ color: c.dark ? '#94a9c9' : '#44474d', fontSize: '14px' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Secondary insights */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'white', border: '1px solid rgba(196,198,206,0.4)', borderRadius: '4px', padding: '32px' }}>
            <h2 className="heading-display" style={{ fontSize: '20px', color: '#0f2640', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ color: '#c8a951' }}>trending_up</span>
              {lang === 'ar' ? 'نظرة على السوق: البحرين' : 'Market Overview: Bahrain'}
            </h2>
            <p style={{ color: '#44474d', fontSize: '14px', lineHeight: '1.8' }}>
              {lang === 'ar'
                ? 'تصفح قسم العقارات للاطلاع على أحدث الأسعار والمناطق النشطة في المملكة، وقارن الفرص حسب المحافظة والفئة.'
                : 'Browse the Properties section for the latest pricing and active areas across the Kingdom, and compare opportunities by governorate and category.'}
            </p>
            <button onClick={() => navigate('/properties')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #0f2640', color: '#0f2640', padding: '10px 20px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
              {lang === 'ar' ? 'استعرض العقارات' : 'Browse Listings'}
            </button>
          </div>
          <div style={{ background: 'white', border: '1px solid rgba(196,198,206,0.4)', borderRadius: '4px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="heading-display" style={{ fontSize: '20px', color: '#0f2640', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ color: '#c8a951' }}>shield</span>
                {lang === 'ar' ? 'أمان الحساب' : 'Account Security'}
              </h2>
              <p style={{ color: '#44474d', fontSize: '14px', lineHeight: '1.8', maxWidth: '360px' }}>
                {lang === 'ar'
                  ? 'راجع بيانات ملفك الشخصي وطرق التواصل بانتظام للحفاظ على أمان حسابك في ملكي.'
                  : 'Review your profile details and contact methods regularly to keep your MulkiBH account secure.'}
              </p>
              <button onClick={() => navigate('/profile')} style={{ marginTop: '20px', background: '#0f2640', color: 'white', padding: '11px 22px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', border: 'none', borderBottom: '2px solid #c8a951', cursor: 'pointer' }}>
                {lang === 'ar' ? 'مراجعة الملف' : 'Review Profile'}
              </button>
            </div>
            <span className="material-symbols-outlined" style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '180px', color: '#0f2640', opacity: 0.05, fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          </div>
        </section>
      </main>

      {/* Bottom CTA */}
      {!isVisitor && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(196,198,206,0.4)', padding: '16px', zIndex: 40, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => navigate('/properties/create')} style={{
            background: '#c8a951', color: '#0f2640', padding: '15px 48px', border: 'none', borderRadius: '2px',
            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(200,169,81,0.3)', transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#ddc06b'} onMouseLeave={e => e.currentTarget.style.background = '#c8a951'}
          >
            <span className="material-symbols-outlined">add_business</span>
            {lang === 'ar' ? 'إضافة إعلان عقاري جديد' : 'Add New Property Listing'}
          </button>
        </div>
      )}

      <style>{`
        .bento-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15,38,64,0.12); }
        .bento-card:hover .bento-arrow { color: #c8a951 !important; }
        @media (max-width: 800px) { .bento-big { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};
export default DashboardPage;
