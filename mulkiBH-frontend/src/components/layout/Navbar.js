/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useT } from '../../hooks/useTranslation';
import { logout } from '../../api/auth';
import { getUnreadCount } from '../../api/notifications';

const Icon = ({ name, fill, size = 22, style = {} }) => (
  <span className={`material-symbols-outlined ${fill ? 'ms-fill' : ''}`} style={{ fontSize: size, ...style }}>{name}</span>
);

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { lang, toggleLang } = useLang();
  const { favorites } = useFavorites();
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) getUnreadCount().then(r => setUnread(r.data.unread_count)).catch(() => {});
  }, [user]);

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = async () => { try { await logout(); } catch {} logoutUser(); navigate('/'); };
  const isActive = (p) => location.pathname === p;

  const Badge = ({ n }) => n > 0 ? (
    <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#c8a951', display: 'block' }} />
  ) : null;

  const NavLink = ({ to, children }) => (
    <Link to={to} className="nav-link label-md" style={{
      color: isActive(to) ? 'var(--gold-text)' : 'var(--text-variant)',
      fontWeight: isActive(to) ? 700 : 600,
      paddingBottom: '4px',
      borderBottom: isActive(to) ? '2px solid var(--gold-dim)' : '2px solid transparent',
    }}>{children}</Link>
  );

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 64px)', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>

        {/* Logo — Playfair wordmark */}
        <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="heading-display" style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: 700 }}>
            {lang === 'ar' ? 'ملكي' : 'MulkiBH'}
          </span>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
        </Link>

        {/* Center links */}
        <nav style={{ gap: '32px', alignItems: 'center' }} className="desktop-nav">
          <NavLink to="/">{lang === 'ar' ? 'الرئيسية' : 'Home'}</NavLink>
          <NavLink to="/properties">{lang === 'ar' ? 'العقارات' : 'Properties'}</NavLink>
          <NavLink to="/orders/create">{lang === 'ar' ? 'أضف طلب' : 'Post Order'}</NavLink>
        </nav>

        {/* Right icons */}
        <div style={{ gap: '4px', alignItems: 'center' }} className="desktop-nav">
          <button className="icon-btn" onClick={toggleLang} title="Language">
            <Icon name="language" />
          </button>

          {user ? (
            <>
              <button className="icon-btn" onClick={() => navigate('/favorites')} title="Favorites">
                <Icon name="favorite" />
                <Badge n={favorites.length} />
              </button>
              <button className="icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
                <Icon name="notifications" />
                <Badge n={unread} />
              </button>

              {/* Avatar dropdown */}
              <div ref={profileRef} style={{ position: 'relative', marginLeft: '8px' }}>
                <button onClick={() => setProfileOpen(!profileOpen)} style={{
                  width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
                  border: profileOpen ? '2px solid var(--gold-dim)' : '1px solid var(--outline-var)',
                  background: 'linear-gradient(135deg, #c8a951, #e4c368)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: 800, color: '#001125', transition: 'border 0.2s',
                }}>
                  {user.full_name?.[0]?.toUpperCase() || '?'}
                </button>

                {profileOpen && (
                  <div className="slide-in-down luxury-shadow" style={{
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                    background: 'var(--surface)', borderRadius: '12px',
                    border: '1px solid rgba(196,198,206,0.4)',
                    minWidth: '230px', overflow: 'hidden', zIndex: 200,
                    boxShadow: '0 16px 48px rgba(15,38,64,0.15)',
                  }}>
                    <div style={{ padding: '16px', background: 'var(--surface-low)', borderBottom: '1px solid rgba(196,198,206,0.3)' }}>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'var(--primary)', fontSize: '14px', fontFamily: "'Playfair Display', serif" }}>{user.full_name}</p>
                      <p style={{ margin: 0, color: 'var(--outline)', fontSize: '11px' }}>{user.email}</p>
                      <span className="badge-pill" style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(200,169,81,0.12)', color: 'var(--gold-text)', border: '1px solid rgba(200,169,81,0.3)' }}>{user.role}</span>
                    </div>
                    {[
                      { icon: 'dashboard', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', path: '/dashboard' },
                      { icon: 'person', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile', path: '/profile' },
                      ...(user.role !== 'visitor' ? [{ icon: 'home_work', label: lang === 'ar' ? 'عقاراتي' : 'My Properties', path: '/my-properties' }] : []),
                      { icon: 'list_alt', label: lang === 'ar' ? 'طلباتي' : 'My Orders', path: '/orders' },
                      ...(user.role !== 'visitor' ? [{ icon: 'workspace_premium', label: lang === 'ar' ? 'الاشتراك' : 'Subscription', path: '/subscriptions' }] : []),
                    ].map(item => (
                      <button key={item.path} onClick={() => navigate(item.path)} style={{
                        width: '100%', padding: '11px 16px', background: 'transparent', border: 'none',
                        color: 'var(--text)', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 500,
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-low)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Icon name={item.icon} size={18} style={{ color: 'var(--outline)' }} /> {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(196,198,206,0.3)' }}>
                      <button onClick={handleLogout} style={{
                        width: '100%', padding: '11px 16px', background: 'transparent', border: 'none',
                        color: '#ba1a1a', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600,
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ffdad6'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Icon name="logout" size={18} /> {lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: '8px' }}>
              <Link to="/login" className="label-md" style={{ color: 'var(--primary)', padding: '10px 18px', borderRadius: '8px', border: '1px solid var(--outline-var)', transition: 'all 0.2s' }}>
                {lang === 'ar' ? 'دخول' : 'Sign In'}
              </Link>
              <Link to="/register" className="btn-gold label-md" style={{ padding: '11px 20px', display: 'inline-block' }}>
                {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div style={{ gap: '4px', alignItems: 'center' }} className="mobile-nav">
          {user && (
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              <Icon name="notifications" size={20} /><Badge n={unread} />
            </button>
          )}
          <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="slide-in-down" style={{ background: 'var(--surface)', borderTop: '1px solid rgba(196,198,206,0.3)', padding: '8px 0 16px' }}>
          {[
            { to: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
            { to: '/properties', label: lang === 'ar' ? 'العقارات' : 'Properties' },
            { to: '/orders/create', label: lang === 'ar' ? 'أضف طلب' : 'Post Order' },
            { to: '/favorites', label: lang === 'ar' ? 'المفضلة' : 'Favorites' },
          ].map(i => (
            <Link key={i.to} to={i.to} style={{
              display: 'block', padding: '13px 24px', fontSize: '14px', fontWeight: isActive(i.to) ? 700 : 500,
              color: isActive(i.to) ? 'var(--gold-text)' : 'var(--text)',
              borderBottom: '1px solid rgba(196,198,206,0.15)',
            }}>{i.label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" style={{ display: 'block', padding: '13px 24px', fontSize: '14px', color: 'var(--text)', borderBottom: '1px solid rgba(196,198,206,0.15)' }}>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</Link>
              <div style={{ padding: '14px 24px', display: 'flex', gap: '10px' }}>
                <button onClick={toggleLang} className="btn-ghost" style={{ color: 'var(--primary)', borderColor: 'var(--outline-var)', padding: '8px 16px' }}>
                  {lang === 'en' ? 'العربية' : 'English'}
                </button>
                <button onClick={handleLogout} style={{ background: '#ffdad6', color: '#93000a', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  {lang === 'ar' ? 'خروج' : 'Sign out'}
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '14px 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={toggleLang} className="btn-ghost" style={{ color: 'var(--primary)', borderColor: 'var(--outline-var)', padding: '8px 16px' }}>
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
              <Link to="/login" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--outline-var)', color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>{lang === 'ar' ? 'دخول' : 'Sign In'}</Link>
              <Link to="/register" className="btn-gold" style={{ padding: '8px 16px', display: 'inline-block' }}>{lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
