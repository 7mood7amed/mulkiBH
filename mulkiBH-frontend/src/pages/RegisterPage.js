/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const RegisterPage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', full_name: '', phone: '', whatsapp: '', role: 'visitor', agency_name: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setErrors(err.response?.data || {});
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#4a5568' };
  const errorStyle = { color: '#e53e3e', fontSize: '12px', marginTop: '4px' };

  const roleOptions = [
    { value: 'visitor', icon: '👤', label: t('visitor'), desc: isRTL ? 'تصفح وأضف طلبات' : 'Browse & post orders' },
    { value: 'owner', icon: '🏠', label: t('owner'), desc: isRTL ? 'انشر عقاراتك' : 'List your properties' },
    { value: 'agency', icon: '🏢', label: t('agency'), desc: isRTL ? 'مكتب عقاري' : 'Real estate agency' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a3c5e 0%, #2d6a9f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="fade-in-up" style={{
        background: 'white', padding: 'clamp(24px, 5vw, 40px)',
        borderRadius: '16px', width: '100%', maxWidth: '480px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏠</div>
          <h2 style={{ color: '#1a3c5e', margin: '0 0 4px', fontSize: '22px' }}>{t('registerTitle')}</h2>
          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>MulkiBH</p>
        </div>

        {/* Error */}
        {errors.non_field_errors && (
          <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fed7d7' }}>
            ⚠️ {errors.non_field_errors}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('role')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {roleOptions.map(opt => (
                <div key={opt.value} onClick={() => setForm({...form, role: opt.value})} style={{
                  padding: '10px 8px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
                  border: '2px solid', borderColor: form.role === opt.value ? '#1a3c5e' : '#e2e8f0',
                  background: form.role === opt.value ? '#ebf8ff' : 'white',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '2px' }}>{opt.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#1a3c5e' }}>{opt.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>{t('fullName')}</label>
            <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} required />
            {errors.full_name && <p style={errorStyle}>{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>{t('email')}</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} required />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          {/* Phone & WhatsApp */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>{t('phone')}</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t('whatsapp')}</label>
              <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} style={inputStyle} />
            </div>
          </div>

          {/* Agency name */}
          {form.role === 'agency' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{t('agencyName')}</label>
              <input value={form.agency_name} onChange={e => setForm({...form, agency_name: e.target.value})} style={inputStyle} required />
            </div>
          )}

          {/* Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>{t('password')}</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} required />
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>
            <div>
              <label style={labelStyle}>{t('confirmPassword')}</label>
              <input type="password" value={form.password2} onChange={e => setForm({...form, password2: e.target.value})} style={inputStyle} required />
              {errors.password2 && <p style={errorStyle}>{errors.password2}</p>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{
            width: '100%', padding: '13px', background: '#1a3c5e', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '700'
          }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                {isRTL ? 'جاري الإنشاء...' : 'Creating account...'}
              </span>
            ) : t('register')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#718096' }}>
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" style={{ color: '#1a3c5e', fontWeight: '700' }}>{t('login')}</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RegisterPage;
