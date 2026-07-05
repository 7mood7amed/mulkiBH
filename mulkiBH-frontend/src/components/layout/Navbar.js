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
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) getUnreadCount().then(res => setUnread(res.data.unread_count)).catch(() => {});
  }, [user]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    logoutUser();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navBg = isDark ? '#0d2137' : '#1a3c5e';
  const activeStyle = { color: '#c8a951', fontWeight: '700' };
  const linkStyle = { color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '6px 2px', borderBottom: '2px solid transparent', transition: 'all 0.2s ease' };

  return (
    <>
      <nav style={{ background: navBg, position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.25)', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '24px' }}>🏠</span>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>
              {lang === 'ar' ? 'ملكي' : 'MulkiBH'}
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'center' }} className="desktop-nav">
            <Link to="/" style={{ ...linkStyle, ...(isActive('/') ? activeStyle : {}) }}>
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/properties" style={{ ...linkStyle, ...(isActive('/properties') ? activeStyle : {}) }}>
              {t('properties')}
            </Link>
            <Link to="/orders/create" style={{ ...linkStyle, ...(isActive('/orders/create') ? activeStyle : {}) }}>
              {t('postOrder')}
            </Link>
          </div>

          {/* ── Desktop Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="desktop-nav">

            {/* Language toggle */}
            <button onClick={toggleLang} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.85)', padding: '5px 10px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              transition: 'all 0.2s', letterSpacing: '0.3px'
            }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>

            {/* Theme toggle */}
            <button onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', width: '34px', height: '34px', borderRadius: '8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', transition: 'all 0.2s'
            }}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                {/* Favorites */}
                <button onClick={() => navigate('/favorites')} title="Favorites" style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', width: '34px', height: '34px', borderRadius: '8px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', position: 'relative', transition: 'all 0.2s'
                }}>
                  ❤️
                  {favorites.length > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e53e3e', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {favorites.length > 9 ? '9+' : favorites.length}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <button onClick={() => navigate('/notifications')} title="Notifications" style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', width: '34px', height: '34px', borderRadius: '8px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', position: 'relative', transition: 'all 0.2s'
                }}>
                  🔔
                  {unread > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e53e3e', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>

                {/* Divider */}
                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

                {/* Profile dropdown */}
                <div ref={profileRef} style={{ position: 'relative' }}>
                  <button onClick={() => setProfileOpen(!profileOpen)} style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white', padding: '5px 12px 5px 8px', borderRadius: '8px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '14px', transition: 'all 0.2s'
                  }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#c8a951', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                      {user.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                      {user.full_name?.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>▼</span>
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="slide-in-down" style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: isDark ? '#1a2535' : 'white', borderRadius: '10px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.2)', border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                      minWidth: '200px', overflow: 'hidden', zIndex: 100
                    }}>
                      {/* User info */}
                      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${isDark ? '#2d3748' : '#f0f0f0'}` }}>
                        <p style={{ margin: '0 0 2px', fontWeight: '700', color: isDark ? '#e2e8f0' : '#1a3c5e', fontSize: '14px' }}>{user.full_name}</p>
                        <p style={{ margin: 0, color: isDark ? '#a0aec0' : '#718096', fontSize: '12px' }}>{user.email}</p>
                        <span style={{ display: 'inline-block', marginTop: '6px', background: '#ebf8ff', color: '#2b6cb0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' }}>{user.role}</span>
                      </div>

                      {/* Menu items */}
                      {[
                        { icon: '🏠', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', path: '/dashboard' },
                        { icon: '👤', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile', path: '/profile' },
                        ...(user.role !== 'visitor' ? [{ icon: '📋', label: lang === 'ar' ? 'عقاراتي' : 'My Properties', path: '/my-properties' }] : []),
                        { icon: '📝', label: lang === 'ar' ? 'طلباتي' : 'My Orders', path: '/orders' },
                        ...(user.role !== 'visitor' ? [{ icon: '💳', label: lang === 'ar' ? 'الاشتراك' : 'Subscription', path: '/subscriptions' }] : []),
                      ].map(item => (
                        <button key={item.path} onClick={() => { navigate(item.path); setProfileOpen(false); }} style={{
                          width: '100%', padding: '10px 16px', background: 'transparent', border: 'none',
                          color: isDark ? '#e2e8f0' : '#2d3748', cursor: 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
                          transition: 'background 0.15s'
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#243147' : '#f8f9fa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span>{item.icon}</span> {item.label}
                        </button>
                      ))}

                      <div style={{ borderTop: `1px solid ${isDark ? '#2d3748' : '#f0f0f0'}` }}>
                        <button onClick={handleLogout} style={{
                          width: '100%', padding: '10px 16px', background: 'transparent', border: 'none',
                          color: '#e53e3e', cursor: 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
                          transition: 'background 0.15s'
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#2d1515' : '#fff5f5'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span>🚪</span> {lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '7px 14px', fontSize: '14px', fontWeight: '500', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }}>
                  {t('login')}
                </Link>
                <Link to="/register" style={{ background: '#c8a951', color: 'white', textDecoration: 'none', padding: '7px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s' }}>
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <div style={{ alignItems: 'center', gap: '8px' }} className="mobile-nav">
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', padding: '4px' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            {user && (
              <button onClick={() => navigate('/notifications')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', padding: '4px', position: 'relative' }}>
                🔔
                {unread > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#e53e3e', color: 'white', borderRadius: '50%', width: '14px', height: '14px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
              </button>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', padding: '8px 10px', borderRadius: '8px' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="slide-in-down" style={{ background: isDark ? '#0a1a2e' : '#152c47', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '8px 0 16px' }}>
            {[
              { to: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
              { to: '/properties', label: t('properties') },
              { to: '/orders/create', label: t('postOrder') },
              { to: '/favorites', label: `❤️ ${lang === 'ar' ? 'المفضلة' : 'Favorites'}` },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '12px 20px', display: 'block', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '12px 20px', display: 'block', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</Link>
                <Link to="/profile" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '12px 20px', display: 'block', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</Link>
                <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button onClick={toggleLang} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    {lang === 'en' ? 'العربية' : 'English'}
                  </button>
                  <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(229,62,62,0.5)', color: '#fc8181', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    {lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '12px 20px', display: 'flex', gap: '10px' }}>
                <button onClick={toggleLang} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  {lang === 'en' ? 'العربية' : 'English'}
                </button>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '13px' }}>{t('login')}</Link>
                <Link to="/register" style={{ background: '#c8a951', color: 'white', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '13px' }}>{t('register')}</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
