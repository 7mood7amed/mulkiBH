/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const Icon = ({ name, size = 20, style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

const LoginPage = () => {
  const { lang, toggleLang } = useLang();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const ar = lang === 'ar';
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
      setError(err.response?.data?.non_field_errors?.[0] || (ar ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'));
    } finally { setLoading(false); }
  };

  const fieldWrap = { position: 'relative' };
  const fieldInput = {
    width: '100%', padding: '13px 16px 13px 44px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(200,169,81,0.25)', borderRadius: 'var(--radius)', color: 'white',
    fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const fieldIcon = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' };
  const fieldLabel = { fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' };

  return (
    <div style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(circle at center, #0f2640 0%, #001125 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="hero-circle" style={{ width: '600px', height: '600px', top: '-240px', right: '-200px' }} />
        <div className="hero-circle" style={{ width: '420px', height: '420px', bottom: '-160px', left: '-140px' }} />
      </div>

      <div className="fade-in-up" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="heading-display" style={{ fontSize: '34px', color: 'var(--gold-fixed)' }}>{ar ? 'ملكي' : 'MulkiBH'}</span>
        </div>

        {/* Glass card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(200,169,81,0.2)', borderRadius: 'var(--radius-lg)', padding: '40px 32px',
          boxShadow: '0 30px 80px rgba(0,5,15,0.5)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="headline-lg" style={{ color: 'var(--gold-fixed)', marginBottom: '8px' }}>{ar ? 'أهلاً بعودتك' : 'Welcome Back'}</h1>
            <p className="label-md" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>{ar ? 'عقارات البحرين الفاخرة' : 'Premium Bahrain Real Estate'}</p>
          </div>

          {error && (
            <div className="fade-in" style={{ background: 'rgba(186,26,26,0.15)', border: '1px solid rgba(186,26,26,0.3)', color: '#ff8a80', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="error" size={17} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={fieldLabel}>{ar ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div style={fieldWrap}>
                <Icon name="mail" size={19} style={fieldIcon} />
                <input type="email" style={fieldInput} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="name@luxury.com"
                  onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 1px var(--gold)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(200,169,81,0.25)'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={fieldLabel}>{ar ? 'كلمة المرور' : 'Password'}</label>
              <div style={fieldWrap}>
                <Icon name="lock" size={19} style={fieldIcon} />
                <input type={showPw ? 'text' : 'password'} style={{ ...fieldInput, paddingRight: '44px' }} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••"
                  onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 1px var(--gold)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(200,169,81,0.25)'; e.target.style.boxShadow = 'none'; }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                  <Icon name={showPw ? 'visibility_off' : 'visibility'} size={19} />
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '12px' }}>
                <Link to="/forgot-password" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '999px',
                  border: '1px solid rgba(200,169,81,0.35)', background: 'rgba(200,169,81,0.08)',
                  color: 'var(--gold-fixed)', fontSize: '12px', fontWeight: 600,
                }}>
                  <Icon name="key" size={14} /> {ar ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', padding: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {loading ? (ar ? 'جاري الدخول...' : 'Signing in...') : (ar ? 'تسجيل الدخول' : 'Sign In')}
              {!loading && <Icon name="arrow_forward" size={18} />}
            </button>
          </form>

          <div style={{ position: 'relative', margin: '28px 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
            <span style={{ position: 'relative', background: 'transparent', padding: '0 12px' }}>
              <span className="label-md" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', background: '#0f2640' }}>{ar ? 'دخول آمن' : 'Secure Login'}</span>
            </span>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            {ar ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
            <Link to="/register" style={{ color: 'var(--gold-fixed)', fontWeight: 700 }}>{ar ? 'إنشاء حساب' : 'Register'}</Link>
          </p>
        </div>

        {/* Quick actions */}
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontFamily: 'inherit' }} className="label-md">
            <Icon name="language" size={17} /> {ar ? 'English' : 'العربية'}
          </button>
        </div>
      </div>

      <footer style={{ position: 'relative', zIndex: 1, marginTop: '48px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
          © 2026 MulkiBH. {ar ? 'جميع الحقوق محفوظة.' : 'All rights reserved. Premium Real Estate Bahrain.'}
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{ar ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{ar ? 'شروط الاستخدام' : 'Terms of Service'}</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
