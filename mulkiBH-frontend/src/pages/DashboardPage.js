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
  const ar = lang === 'ar';
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
    { icon: 'receipt_long', bg: 'rgba(200,169,81,0.1)', iconColor: 'var(--gold-text)', title: ar ? 'طلباتي' : 'My Orders', desc: ar ? 'تتبع طلباتك العقارية الحالية والسابقة.' : 'Track your current and past property requests.', path: '/orders' },
  ] : [
    { icon: 'apartment', bg: 'var(--primary-cont)', iconColor: 'var(--gold)', title: ar ? 'عقاراتي' : 'My Properties', desc: ar ? `إدارة ومراقبة محفظتك المكونة من ${activeListings} عقار نشط.` : `Manage and monitor your portfolio of ${activeListings} active properties.`, path: '/my-properties' },
    { icon: 'receipt_long', bg: 'rgba(200,169,81,0.1)', iconColor: 'var(--gold-text)', title: ar ? 'الطلبات' : 'Orders', desc: ar ? 'تتبع المعاملات الجارية وسجل الاستحواذ.' : 'Track ongoing transactions and historical acquisition logs.', path: '/orders' },
  ];

  const smallCards = [
    { icon: 'notifications_active', title: ar ? 'الإشعارات' : 'Notifications', desc: ar ? 'ابقَ مطلعاً على تحركات السوق والتنبيهات.' : 'Stay updated on market movements and alerts.', path: '/notifications', badge: unread },
    ...(!isVisitor ? [{ icon: 'workspace_premium', dark: true, title: ar ? 'الاشتراك' : 'Subscription', desc: subscription?.plan_name ? (ar ? `خطتك الحالية: ${subscription.plan_name}` : `Current plan: ${subscription.plan_name}`) : (ar ? 'إدارة مزايا وفوترة العضوية المميزة.' : 'Manage your Premium Tier membership benefits and billing.'), path: '/subscriptions' }] : []),
    { icon: 'person', title: ar ? 'الملف الشخصي' : 'Profile', desc: ar ? 'تحديث بيانات الهوية وإعدادات الأمان.' : 'Update your identification and security settings.', path: '/profile' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 72px)', paddingBottom: !isVisitor ? '96px' : '0' }}>
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px clamp(20px,5vw,64px)' }}>
        {/* Welcome Banner */}
        <section style={{ marginBottom: '40px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-cont) 100%)', padding: 'clamp(28px,4vw,48px)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', background: 'rgba(200,169,81,0.12)', borderRadius: '50%', filter: 'blur(40px)' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div>
              <div className="badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--gold-fixed)', color: 'var(--on-gold)', marginBottom: '18px' }}>
                <span className="material-symbols-outlined ms-fill" style={{ fontSize: '14px' }}>workspace_premium</span>
                {isVisitor ? (ar ? 'زائر' : 'Visitor') : (subscription?.plan_name || (ar ? 'مالك' : (user.role === 'agency' ? 'Agency' : 'Owner')))}
              </div>
              <h1 className="headline-xl" style={{ fontSize: 'clamp(26px,4vw,42px)', color: 'white', marginBottom: '10px' }}>
                {ar ? `مرحباً بعودتك، ${user.full_name}` : `Welcome back, ${user.full_name}`}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', maxWidth: '480px' }}>
                {isVisitor
                  ? (ar ? 'تصفح أحدث العقارات وتابع طلباتك من هنا.' : 'Explore the latest listings and track your requests from here.')
                  : (ar ? 'استعرض أصولك العقارية في البحرين أدناه.' : 'Explore your real estate assets in Bahrain below.')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {isVisitor ? (
                <>
                  <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: 'var(--gold-fixed)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{ar ? 'المفضلة' : 'Favorites'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{String(favorites.length).padStart(2, '0')}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: 'var(--gold-fixed)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{ar ? 'الطلبات' : 'Orders'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{String(orderCount).padStart(2, '0')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: 'var(--gold-fixed)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{ar ? 'إعلانات نشطة' : 'Active Listings'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{String(activeListings).padStart(2, '0')}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', minWidth: '140px' }}>
                    <span style={{ display: 'block', color: 'var(--gold-fixed)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{ar ? 'إجمالي التقييم' : 'Total Valuation'}</span>
                    <span className="heading-display" style={{ fontSize: '28px', color: 'white' }}>{formatValuation(totalValuation)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <h2 className="headline-lg" style={{ color: 'var(--primary)', marginBottom: '20px' }}>{ar ? 'نظرة عامة' : 'Dashboard Overview'}</h2>

        {/* Bento Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: `repeat(${bigCards.length === 2 ? 2 : 1}, 1fr)`, gap: '24px', marginBottom: '24px' }} className="bento-big">
          {bigCards.map((c, i) => (
            <div key={i} onClick={() => navigate(c.path)} className="bento-card" style={{ height: '256px', background: 'var(--surface)', border: '1px solid rgba(196,198,206,0.4)', padding: '32px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--luxury-shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: c.iconColor }}>{c.icon}</span>
                </div>
                <span className="material-symbols-outlined bento-arrow" style={{ color: 'var(--outline)' }}>arrow_outward</span>
              </div>
              <div>
                <h3 className="headline-md" style={{ color: 'var(--primary)', fontSize: '22px', marginBottom: '8px' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-variant)', fontSize: '15px' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`, gap: '24px', marginBottom: '56px' }}>
          {smallCards.map((c, i) => (
            <div key={i} onClick={() => navigate(c.path)} className="bento-card" style={{
              background: c.dark ? 'var(--primary)' : 'var(--surface)', border: `1px solid ${c.dark ? 'rgba(255,255,255,0.12)' : 'rgba(196,198,206,0.4)'}`,
              padding: '32px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: c.dark ? 'none' : 'var(--luxury-shadow)', minHeight: '200px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', background: c.dark ? 'var(--gold)' : 'var(--surface-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className={`material-symbols-outlined ${c.dark ? 'ms-fill' : ''}`} style={{ fontSize: '28px', color: c.dark ? 'var(--primary)' : 'var(--navy)' }}>{c.icon}</span>
                  </div>
                  {c.badge > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', background: 'var(--error)', color: 'white', fontSize: '10px', fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.badge}</span>
                  )}
                </div>
                {c.dark && <span className="material-symbols-outlined" style={{ color: 'var(--gold)' }}>arrow_forward</span>}
              </div>
              <div style={{ marginTop: '24px' }}>
                <h3 className="headline-md" style={{ color: c.dark ? 'white' : 'var(--primary)', fontSize: '19px', marginBottom: '6px' }}>{c.title}</h3>
                <p style={{ color: c.dark ? 'rgba(255,255,255,0.65)' : 'var(--text-variant)', fontSize: '14px' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Secondary insights */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(196,198,206,0.4)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
            <h2 className="headline-md" style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--gold-text)' }}>trending_up</span>
              {ar ? 'نظرة على السوق: البحرين' : 'Market Overview: Bahrain'}
            </h2>
            <p style={{ color: 'var(--text-variant)', fontSize: '14px', lineHeight: 1.8 }}>
              {ar
                ? 'تصفح قسم العقارات للاطلاع على أحدث الأسعار والمناطق النشطة في المملكة، وقارن الفرص حسب المحافظة والفئة.'
                : 'Browse the Properties section for the latest pricing and active areas across the Kingdom, and compare opportunities by governorate and category.'}
            </p>
            <button onClick={() => navigate('/properties')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '10px 20px', borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'inherit' }}>
              {ar ? 'استعرض العقارات' : 'Browse Listings'}
            </button>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(196,198,206,0.4)', borderRadius: 'var(--radius-lg)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="headline-md" style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--gold-text)' }}>shield</span>
                {ar ? 'أمان الحساب' : 'Account Security'}
              </h2>
              <p style={{ color: 'var(--text-variant)', fontSize: '14px', lineHeight: 1.8, maxWidth: '360px' }}>
                {ar
                  ? 'راجع بيانات ملفك الشخصي وطرق التواصل بانتظام للحفاظ على أمان حسابك في ملكي.'
                  : 'Review your profile details and contact methods regularly to keep your MulkiBH account secure.'}
              </p>
              <button onClick={() => navigate('/profile')} className="btn-navy" style={{ marginTop: '20px', padding: '11px 22px', borderBottom: '2px solid var(--gold)' }}>
                {ar ? 'مراجعة الملف' : 'Review Profile'}
              </button>
            </div>
            <span className="material-symbols-outlined ms-fill" style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '180px', color: 'var(--primary)', opacity: 0.05 }}>verified_user</span>
          </div>
        </section>
      </main>

      {/* Bottom CTA */}
      {!isVisitor && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(196,198,206,0.4)', padding: '16px', zIndex: 40, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => navigate('/properties/create')} className="btn-gold" style={{
            padding: '15px 48px', textTransform: 'uppercase', letterSpacing: '0.12em',
            display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(200,169,81,0.3)',
          }}>
            <span className="material-symbols-outlined">add_business</span>
            {ar ? 'إضافة إعلان عقاري جديد' : 'Add New Property Listing'}
          </button>
        </div>
      )}

      <style>{`
        .bento-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15,38,64,0.12); }
        .bento-card:hover .bento-arrow { color: var(--gold) !important; }
        @media (max-width: 800px) { .bento-big { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};
export default DashboardPage;
