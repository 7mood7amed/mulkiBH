/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import Logo from '../components/common/Logo';
import FloatingField from '../components/common/FloatingField';

const LoginPage = () => {
  const { lang } = useLang();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || (lang === 'ar' ? 'بيانات خاطئة' : 'Invalid credentials'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1A3C5E 0%, #0F2640 45%, #001125 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 40px',
    }}>
      <main style={{ width: '100%', maxWidth: '460px' }}>
        <div className="fade-in-up" style={{
          background: 'white', borderRadius: '2px', overflow: 'hidden',
          padding: 'clamp(28px,5vw,48px)', boxShadow: '0 10px 40px -10px rgba(15,38,64,0.4)', position: 'relative',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
            <Logo size="lg" dark={false} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h1 className="heading-display" style={{ fontSize: '24px', color: '#0f2640', textAlign: 'center', marginBottom: '8px' }}>
              {lang === 'ar' ? 'أهلاً بعودتك' : 'Welcome Back'}
            </h1>
            <p style={{ color: '#798ead', textAlign: 'center', fontSize: '15px' }}>
              {lang === 'ar' ? 'سجّل دخولك للوصول إلى محفظتك السيادية' : 'Sign in to access your sovereign portfolio'}
            </p>
          </div>

          {error && (
            <div className="fade-in" style={{ background: '#fff5f5', color: '#ba1a1a', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', border: '1px solid #ffdad6', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <FloatingField label={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <FloatingField
              label={lang === 'ar' ? 'كلمة المرور' : 'Password'}
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              rightIcon={showPw ? 'visibility_off' : 'visibility'}
              onRightIconClick={() => setShowPw(!showPw)}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#c8a951' }} />
                <span style={{ fontSize: '12px', color: '#798ead', fontWeight: '500', letterSpacing: '0.03em' }}>{lang === 'ar' ? 'تذكرني' : 'REMEMBER ME'}</span>
              </label>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: '12px', color: '#c8a951', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none' }}>
                {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </a>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: '#0f2640', color: 'white', fontWeight: '700', fontSize: '14px',
              textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px', border: 'none',
              borderBottom: '2px solid #c8a951', cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
              transition: 'transform 0.2s ease, background 0.2s ease', boxShadow: '0 8px 24px rgba(15,38,64,0.25)',
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? (
                <span style={{ animation: 'pulse 1.2s ease-in-out infinite' }}>{lang === 'ar' ? 'جارٍ التحقق...' : 'AUTHENTICATING...'}</span>
              ) : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign in')}
            </button>
          </form>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: '#798ead' }}>
              {lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
              <Link to="/register" style={{ color: '#c8a951', fontWeight: '700', textDecoration: 'underline', textUnderlineOffset: '4px' }}>{lang === 'ar' ? 'إنشاء حساب' : 'Register'}</Link>
            </p>
          </div>

          <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: '1px solid #eaeef2', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#74777e', textTransform: 'uppercase', letterSpacing: '-0.01em', opacity: 0.6 }}>
              {lang === 'ar' ? '© 2026 ملكي — التميز السيادي' : '© 2026 MulkiBH Sovereign Excellence'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default LoginPage;
