/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useT } from '../../hooks/useTranslation';
import { logout } from '../../api/auth';
import { getUnreadCount } from '../../api/notifications';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { lang, toggleLang, isRTL } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const t = useT();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) getUnreadCount().then(res => setUnread(res.data.unread_count)).catch(() => {});
  }, [user]);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    logoutUser();
    navigate('/');
    setMenuOpen(false);
  };

  const navBg = isDark ? '#0d2137' : '#1a3c5e';

  const navLink = { color: 'white', textDecoration: 'none', fontSize: '15px', padding: '8px 4px', display: 'block' };

  const IconBtn = ({ onClick, children, badge }) => (
    <button onClick={onClick} style={{
      background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
      width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '16px', position: 'relative', transition: 'background 0.2s'
    }}>
      {children}
      {badge > 0 && (
        <span style={{
          position: 'absolute', top: '-4px', right: '-4px',
          background: '#e53e3e', color: 'white', borderRadius: '50%',
          width: '16px', height: '16px', fontSize: '10px', fontWeight: '700',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{badge > 9 ? '9+' : badge}</span>
      )}
    </button>
  );

  return (
    <nav style={{ background: navBg, color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', transition: 'background 0.3s ease' }}>
      <div style={{ padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>

        {/* Logo */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏠 {isRTL ? 'ملكي' : 'MulkiBH'}
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }} className="desktop-nav">
          <Link to="/properties" className="nav-link" style={{ ...navLink, padding: '8px 12px', borderRadius: '8px' }}>{t('properties')}</Link>
          <Link to="/orders/create" className="nav-link" style={{ ...navLink, padding: '8px 12px', borderRadius: '8px' }}>{t('postOrder')}</Link>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />

          {/* Favorites */}
          <IconBtn onClick={() => navigate('/favorites')} badge={favorites.length}>❤️</IconBtn>

          {/* Dark mode */}
          <IconBtn onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</IconBtn>

          {/* Language */}
          <button onClick={toggleLang} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
          }}>{lang === 'en' ? 'العربية' : 'English'}</button>

          {user ? (
            <>
              <IconBtn onClick={() => navigate('/notifications')} badge={unread}>🔔</IconBtn>
              <Link to="/dashboard" className="nav-link" style={{ ...navLink, padding: '8px 12px', borderRadius: '8px' }}>{t('dashboard')}</Link>
              <button onClick={handleLogout} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
                color: 'white', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
              }}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ ...navLink, padding: '8px 12px', borderRadius: '8px' }}>{t('login')}</Link>
              <Link to="/register" style={{
                background: '#c8a951', color: 'white', textDecoration: 'none',
                padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px'
              }}>{t('register')}</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} className="mobile-nav">
          <IconBtn onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</IconBtn>
          <button onClick={toggleLang} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
            {lang === 'en' ? 'ع' : 'EN'}
          </button>
          {user && <IconBtn onClick={() => { navigate('/notifications'); setMenuOpen(false); }} badge={unread}>🔔</IconBtn>}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="slide-in-down" style={{ background: isDark ? '#0d2137' : '#162f4a', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px 16px', direction: isRTL ? 'rtl' : 'ltr' }}>
          <Link to="/properties" style={navLink} onClick={() => setMenuOpen(false)}>{t('properties')}</Link>
          <Link to="/orders/create" style={navLink} onClick={() => setMenuOpen(false)}>{t('postOrder')}</Link>
          <Link to="/favorites" style={navLink} onClick={() => setMenuOpen(false)}>❤️ {isRTL ? 'المفضلة' : 'Favorites'} {favorites.length > 0 && `(${favorites.length})`}</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={navLink} onClick={() => setMenuOpen(false)}>{t('dashboard')}</Link>
              <Link to="/profile" style={navLink} onClick={() => setMenuOpen(false)}>{t('myAccount')}</Link>
              <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 0', cursor: 'pointer', width: '100%', textAlign: isRTL ? 'right' : 'left', fontSize: '15px', marginTop: '4px' }}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLink} onClick={() => setMenuOpen(false)}>{t('login')}</Link>
              <Link to="/register" style={{ ...navLink, color: '#c8a951', fontWeight: '700' }} onClick={() => setMenuOpen(false)}>{t('register')}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
