/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import Logo from '../components/common/Logo';

const LoginPage = () => {
  const t = useT();
  const { lang } = useLang();
  const { surface, border, subtext, isDark } = useThemeColors();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

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

  const inputStyle = { width: '100%', padding: '12px 14px', border: `1px solid ${border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', background: isDark ? '#0a1929' : 'white', color: isDark ? '#e2e8f0' : '#2d3748', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: subtext };

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#060e18' : '#0f2640', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Background circles */}
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', border: '1px solid rgba(200,169,81,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(200,169,81,0.06)', pointerEvents: 'none' }} />

      <div className="fade-in-up" style={{ background: isDark ? '#0a1929' : 'white', padding: 'clamp(28px,5vw,44px)', borderRadius: '20px', width: '100%', maxWidth: '420px', border: `1px solid ${isDark ? '#1a3c5e' : 'rgba(200,169,81,0.15)'}`, boxShadow: '0 32px 80px rgba(0,0,0,0.4)', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '20px' }}>
            <Logo size="md" dark={isDark} />
          </div>
          <h2 className="heading-display" style={{ fontSize: '24px', color: isDark ? '#f7fafc' : '#0f2640', marginBottom: '6px' }}>
            {lang === 'ar' ? 'أهلاً بعودتك' : 'Welcome back'}
          </h2>
          <p style={{ color: subtext, fontSize: '14px' }}>{lang === 'ar' ? 'سجل دخولك للمتابعة' : 'Sign in to your account'}</p>
        </div>

        {error && (
          <div className="fade-in" style={{ background: '#fff5f5', color: '#c53030', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', border: '1px solid #fed7d7', display: 'flex', gap: '8px', alignItems: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email address'}</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} required placeholder="you@email.com" />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ ...inputStyle, paddingRight: '44px' }} required />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: subtext, fontSize: '16px' }}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-navy" style={{ width: '100%', padding: '13px', fontSize: '15px', borderRadius: '10px', fontWeight: '700', background: loading ? '#718096' : '#0f2640' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                {lang === 'ar' ? 'جاري الدخول...' : 'Signing in...'}
              </span>
            ) : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign in')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', padding: '16px 0 0', borderTop: `1px solid ${border}` }}>
          <p style={{ fontSize: '14px', color: subtext }}>
            {lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
            <Link to="/register" style={{ color: '#c8a951', fontWeight: '700', textDecoration: 'none' }}>{lang === 'ar' ? 'إنشاء حساب' : 'Create one'}</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default LoginPage;
