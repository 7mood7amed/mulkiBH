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
  };

  return (
    <nav style={{
      background: '#1a3c5e', color: 'white', padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '64px', position: 'sticky', top: 0, zIndex: 1000,
      flexDirection: isRTL ? 'row-reverse' : 'row'
    }}>
      {/* Logo */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' }}>
        🏠 {isRTL ? 'ملكي' : 'MulkiBH'}
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <Link to="/properties" style={{ color: 'white', textDecoration: 'none' }}>{t('properties')}</Link>
        <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>{t('postOrder')}</Link>

        {user ? (
          <>
            <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
              🔔
              {unread > 0 && (
                <span style={{
                  background: '#e53e3e', borderRadius: '50%', fontSize: '11px',
                  padding: '2px 5px', position: 'absolute', top: '-8px', right: '-8px'
                }}>{unread}</span>
              )}
            </Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>{t('dashboard')}</Link>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid white',
              color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer'
            }}>{t('logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>{t('login')}</Link>
            <Link to="/register" style={{
              background: '#c8a951', color: 'white', textDecoration: 'none',
              padding: '6px 14px', borderRadius: '6px'
            }}>{t('register')}</Link>
          </>
        )}

        {/* Language Toggle */}
        <button onClick={toggleLang} style={{
          background: 'transparent', border: '1px solid white',
          color: 'white', padding: '4px 10px', borderRadius: '6px',
          cursor: 'pointer', fontSize: '13px'
        }}>
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
