/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const Icon = ({ name, size = 20, style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

const RegisterPage = () => {
  const { lang } = useLang();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const ar = lang === 'ar';
  const [form, setForm] = useState({ email: '', full_name: '', phone: '', whatsapp: '', role: 'visitor', agency_name: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErrors({});
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) { setErrors(err.response?.data || {}); } finally { setLoading(false); }
  };

  const labelStyle = { fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' };
  const inputStyle = {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(200,169,81,0.25)', borderRadius: 'var(--radius)', color: 'white',
    fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const focusHandlers = {
    onFocus: e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 1px var(--gold)'; },
    onBlur: e => { e.target.style.borderColor = 'rgba(200,169,81,0.25)'; e.target.style.boxShadow = 'none'; },
  };
  const errStyle = { color: '#ff8a80', fontSize: '12px', marginTop: '4px' };

  const roles = [
    { value: 'visitor', icon: 'person', label: ar ? 'زائر' : 'Visitor' },
    { value: 'owner', icon: 'real_estate_agent', label: ar ? 'مالك' : 'Owner' },
    { value: 'agency', icon: 'business', label: ar ? 'مكتب' : 'Agency' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'radial-gradient(circle at top right, #1a2a44 0%, #001125 100%)', paddingTop: '96px', paddingBottom: '48px' }}>
      {/* Minimal floating header */}
      <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50, padding: '24px clamp(20px,5vw,64px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="heading-display" style={{ fontSize: '22px', color: 'var(--gold-fixed)', textDecoration: 'none' }}>{ar ? 'ملكي' : 'MulkiBH'}</Link>
        <Link to="/" className="label-md" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none' }}>{ar ? 'العودة للرئيسية' : 'Back to Home'}</Link>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }} className="register-grid">
        {/* Left: marketing copy */}
        <div className="desktop-nav" style={{ flexDirection: 'column', gap: '32px', paddingRight: '32px', borderRight: '1px solid rgba(196,198,206,0.15)' }}>
          <h1 className="headline-xl" style={{ color: 'white', lineHeight: 1.2 }}>
            {ar ? <>انضم إلى نخبة<br /><span style={{ color: 'var(--gold-fixed)' }}>السوق البحريني</span></> : <>Join the Elite<br /><span style={{ color: 'var(--gold-fixed)' }}>Bahraini Market</span></>}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: 1.7 }}>
            {ar
              ? 'اكتشف أفخم العقارات في المنامة والسيف وأمواج. سواء كنت تبحث عن منزل الأحلام أو تدير محفظة عقارية، ملكي يوفر لك الأدوات اللازمة.'
              : "Access exclusive properties in Manama, Seef, and Amwaj. Whether you're searching for a dream home or managing a portfolio, MulkiBH provides the tools for premium real estate."}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Icon name="verified_user" size={22} style={{ color: 'var(--gold-fixed)' }} />
              <span className="label-md" style={{ color: 'white', fontSize: '13px' }}>{ar ? 'إعلانات موثقة' : 'Verified Listings'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Icon name="hub" size={22} style={{ color: 'var(--gold-fixed)' }} />
              <span className="label-md" style={{ color: 'white', fontSize: '13px' }}>{ar ? 'تواصل مباشر مع الملاك والوكالات' : 'Direct Owner & Agency Connect'}</span>
            </div>
          </div>
        </div>

        {/* Right: form card */}
        <div className="fade-in-up" style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(200,169,81,0.2)', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px,4vw,40px)',
          boxShadow: '0 30px 80px rgba(0,5,15,0.5)',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 className="headline-lg" style={{ color: 'var(--gold-fixed)', marginBottom: '6px' }}>{ar ? 'إنشاء حساب' : 'Create Account'}</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{ar ? 'مجاني تماماً للبدء' : 'Free to get started — no credit card needed'}</p>
          </div>

          {errors.non_field_errors && (
            <div style={{ background: 'rgba(186,26,26,0.15)', border: '1px solid rgba(186,26,26,0.3)', color: '#ff8a80', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '13px' }}>
              {errors.non_field_errors}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role cards */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>{ar ? 'نوع الحساب' : 'Select Your Role'}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {roles.map(r => (
                  <div key={r.value} onClick={() => setForm({ ...form, role: r.value })} style={{
                    padding: '14px 8px', borderRadius: 'var(--radius)', textAlign: 'center', cursor: 'pointer',
                    border: form.role === r.value ? '1px solid var(--gold-fixed)' : '1px solid rgba(196,198,206,0.2)',
                    background: form.role === r.value ? 'rgba(255,224,141,0.06)' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    <Icon name={r.icon} size={24} style={{ color: 'var(--gold-fixed)', marginBottom: '4px' }} />
                    <div className="label-md" style={{ fontSize: '11px', color: 'white' }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>{ar ? 'الاسم الكامل' : 'Full Name'}</label>
                <input style={inputStyle} {...focusHandlers} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required placeholder={ar ? 'أحمد آل خليفة' : 'Ahmed Al-Khalifa'} />
                {errors.full_name && <p style={errStyle}>{errors.full_name}</p>}
              </div>
              <div>
                <label style={labelStyle}>{ar ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input type="email" style={inputStyle} {...focusHandlers} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="ahmed@example.bh" />
                {errors.email && <p style={errStyle}>{errors.email}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>{ar ? 'الهاتف' : 'Phone Number'}</label>
                <input style={inputStyle} {...focusHandlers} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="3344 5566" />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp</label>
                <input style={inputStyle} {...focusHandlers} value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="3344 5566" />
              </div>
            </div>

            {form.role === 'agency' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{ar ? 'اسم المكتب' : 'Agency Name'}</label>
                <input style={inputStyle} {...focusHandlers} value={form.agency_name} onChange={e => setForm({ ...form, agency_name: e.target.value })} required />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>{ar ? 'كلمة المرور' : 'Password'}</label>
                <input type="password" style={inputStyle} {...focusHandlers} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
                {errors.password && <p style={errStyle}>{errors.password}</p>}
              </div>
              <div>
                <label style={labelStyle}>{ar ? 'التأكيد' : 'Confirm'}</label>
                <input type="password" style={inputStyle} {...focusHandlers} value={form.password2} onChange={e => setForm({ ...form, password2: e.target.value })} required placeholder="••••••••" />
                {errors.password2 && <p style={errStyle}>{errors.password2}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '22px' }}>
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} required style={{ marginTop: '3px', accentColor: 'var(--gold-fixed)' }} />
              <label htmlFor="agree" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                {ar ? 'أوافق على شروط الخدمة وسياسة الخصوصية الخاصة بملكي.' : "I agree to MulkiBH's Terms of Service and Privacy Policy."}
              </label>
            </div>

            <button type="submit" disabled={loading || !agreed} className="btn-gold" style={{ width: '100%', padding: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: (loading || !agreed) ? 0.6 : 1 }}>
              {loading ? (ar ? 'جاري الإنشاء...' : 'Creating account...') : (ar ? 'إنشاء الحساب' : 'Create Account')}
              {!loading && <Icon name="arrow_forward" size={18} />}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              {ar ? 'لديك حساب؟ ' : 'Already have an account? '}
              <Link to="/login" style={{ color: 'var(--gold-fixed)', fontWeight: 700 }}>{ar ? 'تسجيل الدخول' : 'Sign In'}</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .register-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
