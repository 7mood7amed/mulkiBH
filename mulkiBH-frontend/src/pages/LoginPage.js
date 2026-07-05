/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const LoginPage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || (isRTL ? 'بيانات خاطئة' : 'Invalid credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a3c5e 0%, #2d6a9f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="fade-in-up" style={{
        background: 'white', padding: 'clamp(24px, 5vw, 40px)',
        borderRadius: '16px', width: '100%', maxWidth: '420px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        direction: isRTL ? 'rtl' : 'ltr'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏠</div>
          <h2 style={{ color: '#1a3c5e', margin: '0 0 4px', fontSize: '24px' }}>{t('loginTitle')}</h2>
          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>MulkiBH</p>
        </div>

        {error && (
          <div className="fade-in" style={{
            background: '#fff5f5', color: '#e53e3e', padding: '12px 14px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
            border: '1px solid #fed7d7', display: 'flex', alignItems: 'center', gap: '8px'
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#4a5568' }}>{t('email')}</label>
            <input
              type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px' }}
              required placeholder="you@email.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#4a5568' }}>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                style={{ width: '100%', padding: '12px', paddingRight: isRTL ? '12px' : '44px', paddingLeft: isRTL ? '44px' : '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px' }}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: isRTL ? 'auto' : '12px', left: isRTL ? '12px' : 'auto',
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#718096', fontSize: '16px'
              }}>{showPassword ? '🙈' : '👁'}</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{
            width: '100%', padding: '13px', background: '#1a3c5e', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer',
            fontWeight: '700', letterSpacing: '0.3px'
          }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                {isRTL ? 'جاري الدخول...' : 'Signing in...'}
              </span>
            ) : t('login')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#718096' }}>
          {t('dontHaveAccount')}{' '}
          <Link to="/register" style={{ color: '#1a3c5e', fontWeight: '700' }}>{t('register')}</Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginPage;
