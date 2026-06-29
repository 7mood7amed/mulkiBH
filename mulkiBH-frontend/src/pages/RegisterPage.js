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
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500' };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '12px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', direction: isRTL ? 'rtl' : 'ltr' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1a3c5e' }}>{t('registerTitle')}</h2>

        <form onSubmit={handleSubmit}>
          {[['email','email',t('email')],['text','full_name',t('fullName')],['text','phone',t('phone')],['text','whatsapp',t('whatsapp')]].map(([type, name, label]) => (
            <div key={name} style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{label}</label>
              <input type={type} value={form[name]} onChange={e => setForm({...form, [name]: e.target.value})} style={inputStyle} />
              {errors[name] && <span style={{ color: '#e53e3e', fontSize: '13px' }}>{errors[name]}</span>}
            </div>
          ))}

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>{t('role')}</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={inputStyle}>
              <option value="visitor">{t('visitor')}</option>
              <option value="owner">{t('owner')}</option>
              <option value="agency">{t('agency')}</option>
            </select>
          </div>

          {form.role === 'agency' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{t('agencyName')}</label>
              <input value={form.agency_name} onChange={e => setForm({...form, agency_name: e.target.value})} style={inputStyle} />
            </div>
          )}

          {[['password','password',t('password')],['password','password2',t('confirmPassword')]].map(([type, name, label]) => (
            <div key={name} style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{label}</label>
              <input type={type} value={form[name]} onChange={e => setForm({...form, [name]: e.target.value})} style={inputStyle} />
              {errors[name] && <span style={{ color: '#e53e3e', fontSize: '13px' }}>{errors[name]}</span>}
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: '#1a3c5e', color: 'white',
            border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginTop: '8px'
          }}>{loading ? t('loading') : t('register')}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          {t('alreadyHaveAccount')} <Link to="/login" style={{ color: '#1a3c5e', fontWeight: '600' }}>{t('login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
