/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import Logo from '../components/common/Logo';

const RegisterPage = () => {
  const { lang } = useLang();
  const { border, subtext, heading, isDark } = useThemeColors();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', full_name: '', phone: '', whatsapp: '', role: 'visitor', agency_name: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErrors({});
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) { setErrors(err.response?.data || {}); } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: `1px solid ${border}`,
    borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit',
    background: isDark ? '#0a1929' : 'white',
    color: isDark ? '#e2e8f0' : '#2d3748', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', marginBottom: '5px', fontWeight: '600',
    fontSize: '12px', color: subtext, textTransform: 'uppercase', letterSpacing: '0.5px',
  };
  const errStyle = { color: '#e53e3e', fontSize: '12px', marginTop: '4px' };

  const roles = [
    { value: 'visitor', icon: '👤', label: lang === 'ar' ? 'زائر' : 'Visitor', desc: lang === 'ar' ? 'تصفح وأضف طلبات' : 'Browse & request' },
    { value: 'owner', icon: '🏠', label: lang === 'ar' ? 'مالك' : 'Owner', desc: lang === 'ar' ? 'انشر عقاراتك' : 'List properties' },
    { value: 'agency', icon: '🏢', label: lang === 'ar' ? 'وكالة' : 'Agency', desc: lang === 'ar' ? 'مكتب عقاري' : 'Real estate firm' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#060e18' : '#0f2640', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(200,169,81,0.07)', pointerEvents: 'none' }} />

      <div className="fade-in-up" style={{ background: isDark ? '#0a1929' : 'white', padding: 'clamp(24px,4vw,40px)', borderRadius: '20px', width: '100%', maxWidth: '500px', border: `1px solid ${isDark ? '#1a3c5e' : 'rgba(200,169,81,0.15)'}`, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Logo size="sm" dark={isDark} />
          </div>
          <h2 className="heading-display" style={{ fontSize: '22px', color: isDark ? '#f7fafc' : '#0f2640', marginBottom: '4px' }}>
            {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create your account'}
          </h2>
          <p style={{ color: subtext, fontSize: '13px' }}>
            {lang === 'ar' ? 'انضم إلى ملكي اليوم' : 'Join MulkiBH today — free to start'}
          </p>
        </div>

        {errors.non_field_errors && (
          <div style={{ background: '#fff5f5', color: '#c53030', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', border: '1px solid #fed7d7' }}>
            {errors.non_field_errors}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'نوع الحساب' : 'Account type'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {roles.map(r => (
                <div key={r.value} onClick={() => setForm({...form, role: r.value})} style={{ padding: '12px 8px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${form.role === r.value ? '#c8a951' : border}`, background: form.role === r.value ? (isDark ? 'rgba(200,169,81,0.08)' : 'rgba(200,169,81,0.06)') : 'transparent', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{r.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: form.role === r.value ? '#c8a951' : (isDark ? '#e2e8f0' : '#0f2640') }}>{r.label}</div>
                  <div style={{ fontSize: '10px', color: subtext, marginTop: '2px' }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'الاسم الكامل' : 'Full name'}</label>
            <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} required />
            {errors.full_name && <p style={errStyle}>{errors.full_name}</p>}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} required />
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'الهاتف' : 'Phone'}</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>WhatsApp</label>
              <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} style={inputStyle} />
            </div>
          </div>

          {form.role === 'agency' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{lang === 'ar' ? 'اسم المكتب' : 'Agency name'}</label>
              <input value={form.agency_name} onChange={e => setForm({...form, agency_name: e.target.value})} style={inputStyle} required />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} required />
              {errors.password && <p style={errStyle}>{errors.password}</p>}
            </div>
            <div>
              <label style={labelStyle}>{lang === 'ar' ? 'تأكيد' : 'Confirm'}</label>
              <input type="password" value={form.password2} onChange={e => setForm({...form, password2: e.target.value})} style={inputStyle} required />
              {errors.password2 && <p style={errStyle}>{errors.password2}</p>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-navy" style={{ width: '100%', padding: '13px', fontSize: '15px', borderRadius: '10px', fontWeight: '700', background: loading ? '#718096' : '#0f2640' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                {lang === 'ar' ? 'جاري الإنشاء...' : 'Creating account...'}
              </span>
            ) : (lang === 'ar' ? 'إنشاء الحساب' : 'Create account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${border}` }}>
          <p style={{ fontSize: '14px', color: subtext }}>
            {lang === 'ar' ? 'لديك حساب؟ ' : 'Already have an account? '}
            <Link to="/login" style={{ color: '#c8a951', fontWeight: '700', textDecoration: 'none' }}>
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default RegisterPage;
