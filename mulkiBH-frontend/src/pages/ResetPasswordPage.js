/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import { useLang } from '../context/LanguageContext';

const Icon = ({ name, size = 20, style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

const ResetPasswordPage = () => {
  const { lang, toggleLang } = useLang();
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const ar = lang === 'ar';
  const [form, setForm] = useState({ new_password: '', new_password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await resetPassword({ uid, token, ...form });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.detail || data?.new_password?.[0] || data?.non_field_errors?.[0]
        || (ar ? 'تعذر إعادة تعيين كلمة المرور. قد يكون الرابط غير صالح أو منتهي الصلاحية.' : 'Could not reset your password. The link may be invalid or expired.');
      setError(msg);
    } finally { setLoading(false); }
  };

  const fieldWrap = { position: 'relative' };
  const fieldInput = {
    width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.06)',
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="heading-display" style={{ fontSize: '34px', color: 'var(--gold-fixed)' }}>{ar ? 'ملكي' : 'MulkiBH'}</span>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(200,169,81,0.2)', borderRadius: 'var(--radius-lg)', padding: '40px 32px',
          boxShadow: '0 30px 80px rgba(0,5,15,0.5)',
        }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon name="check_circle" size={40} style={{ color: 'var(--gold-fixed)' }} />
              </div>
              <h1 className="headline-lg" style={{ color: 'var(--gold-fixed)', marginBottom: '12px' }}>{ar ? 'تم تحديث كلمة المرور' : 'Password Updated'}</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6 }}>
                {ar ? 'جاري تحويلك لتسجيل الدخول...' : 'Redirecting you to sign in...'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 className="headline-lg" style={{ color: 'var(--gold-fixed)', marginBottom: '8px' }}>{ar ? 'تعيين كلمة مرور جديدة' : 'Set New Password'}</h1>
                <p className="label-md" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>
                  {ar ? 'اختر كلمة مرور جديدة لحسابك' : 'Choose a new password for your account'}
                </p>
              </div>

              {error && (
                <div className="fade-in" style={{ background: 'rgba(186,26,26,0.15)', border: '1px solid rgba(186,26,26,0.3)', color: '#ff8a80', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="error" size={17} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={fieldLabel}>{ar ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                  <div style={fieldWrap}>
                    <Icon name="lock" size={19} style={fieldIcon} />
                    <input type={showPw ? 'text' : 'password'} style={fieldInput} value={form.new_password} onChange={e => setForm({ ...form, new_password: e.target.value })} required minLength={8} placeholder="••••••••"
                      onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 1px var(--gold)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(200,169,81,0.25)'; e.target.style.boxShadow = 'none'; }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                      <Icon name={showPw ? 'visibility_off' : 'visibility'} size={19} />
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: '28px' }}>
                  <label style={fieldLabel}>{ar ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                  <div style={fieldWrap}>
                    <Icon name="lock" size={19} style={fieldIcon} />
                    <input type={showPw ? 'text' : 'password'} style={fieldInput} value={form.new_password2} onChange={e => setForm({ ...form, new_password2: e.target.value })} required minLength={8} placeholder="••••••••"
                      onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 1px var(--gold)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(200,169,81,0.25)'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', padding: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {loading ? (ar ? 'جاري الحفظ...' : 'Saving...') : (ar ? 'حفظ كلمة المرور' : 'Reset Password')}
                  {!loading && <Icon name="arrow_forward" size={18} />}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '24px' }}>
                <Link to="/login" style={{ color: 'var(--gold-fixed)', fontWeight: 700 }}>{ar ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}</Link>
              </p>
            </>
          )}
        </div>

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontFamily: 'inherit' }} className="label-md">
            <Icon name="language" size={17} /> {ar ? 'English' : 'العربية'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
