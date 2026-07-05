/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useT } from '../../hooks/useTranslation';
import { logout } from '../../api/auth';
import { getUnreadCount } from '../../api/notifications';
import Logo from '../common/Logo';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { lang, toggleLang } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) getUnreadCount().then(r => setUnread(r.data.unread_count)).catch(() => {});
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = async () => { try { await logout(); } catch {} logoutUser(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const navBg = isDark ? '#060e18' : '#0f2640';
  const navBorder = scrolled ? (isDark ? 'rgba(200,169,81,0.15)' : 'rgba(200,169,81,0.2)') : 'transparent';

  const NavLink = ({ to, children }) => (
    <Link to={to} className="nav-link" style={{
      color: isActive(to) ? '#c8a951' : 'rgba(255,255,255,0.8)',
      textDecoration: 'none', fontSize: '14px', fontWeight: isActive(to) ? '600' : '500',
      padding: '6px 0', borderBottom: isActive(to) ? '2px solid #c8a951' : '2px solid transparent',
      transition: 'all 0.2s ease', letterSpacing: '0.1px',
    }}>{children}</Link>
  );

  const IconButton = ({ onClick, children, badge, title }) => (
    <button onClick={onClick} title={title} style={{
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
      color: 'white', width: '34px', height: '34px', borderRadius: '8px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '15px', position: 'relative', transition: 'all 0.2s ease',
      flexShrink: 0,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,169,81,0.15)'; e.currentTarget.style.borderColor = 'rgba(200,169,81,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
    >
      {children}
      {badge > 0 && (
        <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e53e3e', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #0f2640' }}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );

  return (
    <nav style={{
      background: navBg,
      borderBottom: `1px solid ${navBorder}`,
      position: 'sticky', top: 0, zIndex: 1000,
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : '0 1px 0 rgba(255,255,255,0.05)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Logo size="sm" dark={true} />
        </Link>

        {/* Center links */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="desktop-nav">
          <NavLink to="/">{lang === 'ar' ? 'الرئيسية' : 'Home'}</NavLink>
          <NavLink to="/properties">{t('properties')}</NavLink>
          <NavLink to="/orders/create">{t('postOrder')}</NavLink>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="desktop-nav">
          {/* Language */}
          <button onClick={toggleLang} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)', padding: '6px 12px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px',
            transition: 'all 0.2s', fontFamily: 'inherit',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,169,81,0.15)'; e.currentTarget.style.color = '#c8a951'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          >{lang === 'en' ? 'العربية' : 'English'}</button>

          {/* Theme */}
          <IconButton onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? '☀️' : '🌙'}
          </IconButton>

          {/* Divider */}
          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

          {user ? (
            <>
              <IconButton onClick={() => navigate('/favorites')} badge={favorites.length} title="Favorites">❤️</IconButton>
              <IconButton onClick={() => navigate('/notifications')} badge={unread} title="Notifications">🔔</IconButton>

              {/* Profile dropdown */}
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(!profileOpen)} style={{
                  background: profileOpen ? 'rgba(200,169,81,0.15)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${profileOpen ? 'rgba(200,169,81,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  color: 'white', padding: '5px 10px 5px 6px', borderRadius: '8px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}>
                  {/* Avatar */}
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #c8a951, #ddc06b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#0f2640', flexShrink: 0 }}>
                    {user.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '500', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.full_name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '9px', opacity: 0.5, transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="slide-in-down" style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: isDark ? '#0a1929' : 'white',
                    borderRadius: '12px', border: `1px solid ${isDark ? '#1a3c5e' : '#e2e8f0'}`,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)', minWidth: '220px', overflow: 'hidden', zIndex: 200,
                  }}>
                    {/* Header */}
                    <div style={{ padding: '14px 16px', background: isDark ? '#0f2640' : '#f0f4f8', borderBottom: `1px solid ${isDark ? '#1a3c5e' : '#e2e8f0'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #c8a951, #ddc06b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#0f2640', flexShrink: 0 }}>
                          {user.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 2px', fontWeight: '700', color: isDark ? '#e2e8f0' : '#0f2640', fontSize: '14px' }}>{user.full_name}</p>
                          <p style={{ margin: 0, color: '#718096', fontSize: '11px' }}>{user.email}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <span style={{ background: 'rgba(200,169,81,0.15)', color: '#c8a951', border: '1px solid rgba(200,169,81,0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' }}>{user.role}</span>
                      </div>
                    </div>

                    {/* Links */}
                    {[
                      { icon: '🏠', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', path: '/dashboard' },
                      { icon: '👤', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile', path: '/profile' },
                      ...(user.role !== 'visitor' ? [
                        { icon: '📋', label: lang === 'ar' ? 'عقاراتي' : 'My Properties', path: '/my-properties' },
                      ] : []),
                      { icon: '📝', label: lang === 'ar' ? 'طلباتي' : 'My Orders', path: '/orders' },
                      { icon: '❤️', label: lang === 'ar' ? 'المفضلة' : 'Favorites', path: '/favorites' },
                      ...(user.role !== 'visitor' ? [
                        { icon: '💳', label: lang === 'ar' ? 'الاشتراك' : 'Subscription', path: '/subscriptions' },
                      ] : []),
                    ].map(item => (
                      <button key={item.path} onClick={() => navigate(item.path)} style={{
                        width: '100%', padding: '10px 16px', background: 'transparent', border: 'none',
                        color: isDark ? '#e2e8f0' : '#2d3748', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#0f2640' : '#f8f9fa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
                      </button>
                    ))}

                    <div style={{ borderTop: `1px solid ${isDark ? '#1a3c5e' : '#f0f0f0'}` }}>
                      <button onClick={handleLogout} style={{
                        width: '100%', padding: '10px 16px', background: 'transparent', border: 'none',
                        color: '#e53e3e', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#2d1515' : '#fff5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: '16px' }}>🚪</span> {lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                padding: '7px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.18)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >{t('login')}</Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #c8a951, #ddc06b)',
                color: '#0f2640', textDecoration: 'none',
                padding: '7px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '14px',
                transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(200,169,81,0.3)',
              }}>{t('register')}</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div style={{ alignItems: 'center', gap: '8px' }} className="mobile-nav">
          <IconButton onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</IconButton>
          {user && <IconButton onClick={() => navigate('/notifications')} badge={unread}>🔔</IconButton>}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
          }}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="slide-in-down" style={{ background: isDark ? '#060e18' : '#0a1929', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 0 16px' }}>
          {[
            { to: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
            { to: '/properties', label: t('properties') },
            { to: '/orders/create', label: t('postOrder') },
            { to: '/favorites', label: `❤️ ${lang === 'ar' ? 'المفضلة' : 'Favorites'}` },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{
              color: isActive(item.to) ? '#c8a951' : 'rgba(255,255,255,0.8)',
              textDecoration: 'none', padding: '12px 24px', display: 'block', fontSize: '15px',
              fontWeight: isActive(item.to) ? '600' : '400',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>{item.label}</Link>
          ))}

          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '12px 24px', display: 'block', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</Link>
              <Link to="/profile" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '12px 24px', display: 'block', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</Link>
              <div style={{ padding: '12px 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={toggleLang} style={{ background: 'rgba(200,169,81,0.1)', border: '1px solid rgba(200,169,81,0.2)', color: '#c8a951', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                  {lang === 'en' ? 'العربية' : 'English'}
                </button>
                <button onClick={handleLogout} style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)', color: '#fc8181', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                  {lang === 'ar' ? 'خروج' : 'Sign out'}
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '12px 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={toggleLang} style={{ background: 'rgba(200,169,81,0.1)', border: '1px solid rgba(200,169,81,0.2)', color: '#c8a951', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
              <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '13px' }}>{t('login')}</Link>
              <Link to="/register" style={{ background: '#c8a951', color: '#0f2640', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '13px' }}>{t('register')}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
