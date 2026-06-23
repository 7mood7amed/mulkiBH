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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', direction: isRTL ? 'rtl' : 'ltr' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1a3c5e' }}>{t('loginTitle')}</h2>

        {error && <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>{t('email')}</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>{t('password')}</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} required />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: '#1a3c5e', color: 'white',
            border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer'
          }}>{loading ? t('loading') : t('login')}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          {t('dontHaveAccount')} <Link to="/register" style={{ color: '#1a3c5e', fontWeight: '600' }}>{t('register')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
