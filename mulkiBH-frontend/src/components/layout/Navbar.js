import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { useT } from '../../hooks/useTranslation';
import { logout } from '../../api/auth';
import { getUnreadCount } from '../../api/notifications';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { lang, toggleLang, isRTL } = useLang();
  const t = useT();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getUnreadCount().then(res => setUnread(res.data.unread_count)).catch(() => {});
    }
  }, [user]);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    logoutUser();
    navigate('/');
    setMenuOpen(false);
  };

  const navLink = {
    color: 'white', textDecoration: 'none', fontSize: '15px', padding: '8px 4px',
    display: 'block'
  };

  return (
    <nav style={{
      background: '#1a3c5e', color: 'white',
      position: 'sticky', top: 0, zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      {/* Main Bar */}
      <div style={{
        padding: '0 20px', height: '64px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}>
        {/* Logo */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' }}
          onClick={() => setMenuOpen(false)}>
          🏠 {isRTL ? 'ملكي' : 'MulkiBH'}
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'flex', gap: '20px', alignItems: 'center',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }} className="desktop-nav">
          <Link to="/properties" className='nav-link' style={navLink}>{t('properties')}</Link>
          <Link to="/orders/create" className='nav-link' style={navLink}>{t('postOrder')}</Link>

          {user ? (
            <>
              <Link to="/notifications" style={{ ...navLink, position: 'relative' }}>
                🔔
                {unread > 0 && (
                  <span style={{
                    background: '#e53e3e', borderRadius: '50%', fontSize: '11px',
                    padding: '2px 5px', position: 'absolute', top: '-8px',
                    right: isRTL ? 'auto' : '-8px', left: isRTL ? '-8px' : 'auto'
                  }}>{unread}</span>
                )}
              </Link>
              <Link to="/dashboard" className='nav-link' style={navLink}>{t('dashboard')}</Link>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid white',
                color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer'
              }}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLink}>{t('login')}</Link>
              <Link to="/register" style={{
                background: '#c8a951', color: 'white', textDecoration: 'none',
                padding: '6px 14px', borderRadius: '6px', fontWeight: '600'
              }}>{t('register')}</Link>
            </>
          )}

          <button onClick={toggleLang} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.5)',
            color: 'white', padding: '4px 10px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '13px'
          }}>
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* Mobile: lang + hamburger */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="mobile-nav">
          <button onClick={toggleLang} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.5)',
            color: 'white', padding: '4px 8px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '12px'
          }}>
            {lang === 'en' ? 'ع' : 'EN'}
          </button>
          {user && unread > 0 && (
            <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}
              onClick={() => setMenuOpen(false)}>
              🔔
              <span style={{
                background: '#e53e3e', borderRadius: '50%', fontSize: '11px',
                padding: '2px 5px', position: 'absolute', top: '-8px', right: '-8px'
              }}>{unread}</span>
            </Link>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'transparent', border: 'none', color: 'white',
            fontSize: '24px', cursor: 'pointer', padding: '4px'
          }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{
          background: '#1a3c5e', borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 20px', direction: isRTL ? 'rtl' : 'ltr'
        }} className="mobile-menu">
          <Link to="/properties" style={navLink} onClick={() => setMenuOpen(false)}>{t('properties')}</Link>
          <Link to="/orders/create" style={navLink} onClick={() => setMenuOpen(false)}>{t('postOrder')}</Link>
          {user ? (
            <>
              <Link to="/notifications" style={navLink} onClick={() => setMenuOpen(false)}>🔔 {t('notifications')}</Link>
              <Link to="/dashboard" style={navLink} onClick={() => setMenuOpen(false)}>{t('dashboard')}</Link>
              <Link to="/profile" style={navLink} onClick={() => setMenuOpen(false)}>{t('myAccount')}</Link>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.5)',
                color: 'white', padding: '8px 14px', borderRadius: '6px',
                cursor: 'pointer', width: '100%', marginTop: '8px', textAlign: isRTL ? 'right' : 'left'
              }}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLink} onClick={() => setMenuOpen(false)}>{t('login')}</Link>
              <Link to="/register" style={{ ...navLink, color: '#c8a951', fontWeight: '600' }} onClick={() => setMenuOpen(false)}>{t('register')}</Link>
            </>
          )}
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        .mobile-menu { display: block; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
