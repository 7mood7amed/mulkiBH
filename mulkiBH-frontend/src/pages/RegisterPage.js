/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import FloatingField from '../components/common/FloatingField';

const RegisterPage = () => {
  const { lang } = useLang();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', full_name: '', phone: '', whatsapp: '', role: 'visitor', agency_name: '', password: '', password2: '' });
  const [agreed, setAgreed] = useState(false);
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

  const roles = [
    { value: 'visitor', icon: 'person', label: lang === 'ar' ? 'زائر' : 'Visitor', desc: lang === 'ar' ? 'تصفح العقارات المميزة ورؤى السوق' : 'Explore premium listings & market insights' },
    { value: 'owner', icon: 'real_estate_agent', label: lang === 'ar' ? 'مالك' : 'Owner', desc: lang === 'ar' ? 'أدر محفظتك بأدوات مؤسسية' : 'Manage your portfolio with institutional tools' },
    { value: 'agency', icon: 'domain', label: lang === 'ar' ? 'وكالة' : 'Agency', desc: lang === 'ar' ? 'وساطة احترافية وحلول مؤسسية' : 'Professional brokerage & enterprise solutions' },
  ];

  const errStyle = { color: '#ff8a8a', fontSize: '11px', marginTop: '4px' };

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'radial-gradient(circle at top right, #1A3C5E 0%, #060E18 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px',
    }}>
      <div className="fade-in-up" style={{
        width: '100%', maxWidth: '780px',
        background: 'rgba(15,38,64,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(200,169,81,0.2)', borderRadius: '2px',
        padding: 'clamp(24px,4vw,48px)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="heading-display" style={{ fontSize: 'clamp(28px,4vw,40px)', color: 'white', marginBottom: '10px' }}>
            {lang === 'ar' ? 'ابنِ إرثك' : 'Create Your Legacy'}
          </h1>
          <p style={{ color: '#94a9c9', maxWidth: '440px', margin: '0 auto', fontSize: '15px' }}>
            {lang === 'ar'
              ? "انضم إلى منظومة العقارات الأكثر تميزاً في البحرين. التميز السيادي يبدأ من هنا."
              : "Join Bahrain's most exclusive real estate ecosystem. Sovereign excellence begins here."}
          </p>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {roles.map(r => {
            const active = form.role === r.value;
            return (
              <div key={r.value} onClick={() => setForm({ ...form, role: r.value })} style={{
                cursor: 'pointer', border: `1px solid ${active ? '#c8a951' : '#1a3c5e'}`, padding: '24px',
                borderRadius: '2px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: active ? 'rgba(200,169,81,0.1)' : 'transparent',
                transform: active ? 'translateY(-4px)' : 'none',
                boxShadow: active ? '0 10px 25px -5px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#0f2640', border: `1px solid ${active ? '#c8a951' : '#1a3c5e'}`, marginBottom: '16px',
                }}>
                  <span className="material-symbols-outlined" style={{ color: active ? '#c8a951' : '#94a9c9' }}>{r.icon}</span>
                </div>
                <h3 className="heading-display" style={{ color: 'white', fontSize: '15px', marginBottom: '6px' }}>{r.label}</h3>
                <p style={{ color: '#94a9c9', fontSize: '12px', lineHeight: '1.4' }}>{r.desc}</p>
              </div>
            );
          })}
        </div>

        {errors.non_field_errors && (
          <div style={{ background: 'rgba(186,26,26,0.12)', color: '#ff8a8a', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', border: '1px solid rgba(186,26,26,0.3)' }}>
            {errors.non_field_errors}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px' }}>
            <div>
              <FloatingField dark label={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
              {errors.full_name && <p style={errStyle}>{errors.full_name}</p>}
            </div>
            <div>
              <FloatingField dark label={lang === 'ar' ? 'البريد الإلكتروني المؤسسي' : 'Institutional Email'} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              {errors.email && <p style={errStyle}>{errors.email}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px' }}>
            <FloatingField dark label={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <FloatingField dark label={lang === 'ar' ? 'واتساب (اختياري)' : 'WhatsApp (Optional)'} value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
          </div>

          {form.role === 'agency' && (
            <FloatingField dark label={lang === 'ar' ? 'اسم المكتب' : 'Agency Name'} value={form.agency_name} onChange={e => setForm({ ...form, agency_name: e.target.value })} required />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px' }}>
            <div>
              <FloatingField dark label={lang === 'ar' ? 'كلمة مرور آمنة' : 'Secure Password'} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              {errors.password && <p style={errStyle}>{errors.password}</p>}
            </div>
            <div>
              <FloatingField dark label={lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} type="password" value={form.password2} onChange={e => setForm({ ...form, password2: e.target.value })} required />
              {errors.password2 && <p style={errStyle}>{errors.password2}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingTop: '4px' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#c8a951', flexShrink: 0 }} />
            <label style={{ fontSize: '12px', color: '#94a9c9', lineHeight: '1.6' }}>
              {lang === 'ar' ? 'أوافق على ' : 'I agree to the '}
              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#ddc06b' }}>{lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}</a>
              {lang === 'ar' ? ' و' : ' and '}
              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#ddc06b' }}>{lang === 'ar' ? 'بروتوكول الخصوصية' : 'Privacy Protocol'}</a>
              {lang === 'ar' ? '. وأقر بأن ملكي خدمة متميزة للمستخدمين الموثقين.' : '. I acknowledge that MulkiBH is a premier service for verified users.'}
            </label>
          </div>

          <button type="submit" disabled={loading || !agreed} style={{
            width: '100%', background: '#001125', color: 'white', fontWeight: '700', fontSize: '14px',
            textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px', border: 'none',
            borderBottom: '2px solid #c8a951', cursor: (loading || !agreed) ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            opacity: !agreed ? 0.5 : 1, transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => { if (!loading && agreed) e.currentTarget.style.background = '#0f2640'; }}
            onMouseLeave={e => e.currentTarget.style.background = '#001125'}
          >
            {loading ? (
              <span style={{ animation: 'pulse 1.2s ease-in-out infinite' }}>{lang === 'ar' ? 'جارٍ الإنشاء...' : 'ESTABLISHING...'}</span>
            ) : (
              <>
                <span>{lang === 'ar' ? 'إنشاء الحساب' : 'Establish Account'}</span>
                <span className="material-symbols-outlined" style={{ color: '#c8a951' }}>arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '36px', textAlign: 'center', borderTop: '1px solid #1a3c5e', paddingTop: '24px' }}>
          <p style={{ color: '#94a9c9', fontSize: '15px' }}>
            {lang === 'ar' ? 'عضو بالفعل؟ ' : 'Already a member? '}
            <Link to="/login" style={{ color: '#c8a951', fontWeight: '700', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', textDecoration: 'none', marginLeft: '4px' }}>
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
