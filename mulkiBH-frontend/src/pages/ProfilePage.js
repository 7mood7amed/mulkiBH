/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, changePassword } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import PageHeader from '../components/common/PageHeader';

const ProfilePage = () => {
  const t = useT();
  const { lang } = useLang();
  const { user, setUser, logoutUser } = useAuth();
  const { bg, surface, border, subtext, heading, isDark } = useThemeColors();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '', whatsapp: user?.whatsapp || '', agency_name: user?.agency_name || '', agency_name_ar: user?.agency_name_ar || '' });
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', new_password2: '' });

  if (!user) { navigate('/login'); return null; }

  const handleProfileSave = async (e) => {
    e.preventDefault(); setLoading(true); setErrors({}); setSuccess('');
    try { const res = await updateProfile(form); setUser(res.data); setSuccess(lang === 'ar' ? 'تم التحديث بنجاح!' : 'Profile updated!'); }
    catch (err) { setErrors(err.response?.data || {}); }
    setLoading(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.new_password2) { setErrors({ new_password2: lang === 'ar' ? 'كلمتا المرور غير متطابقتان' : 'Passwords do not match.' }); return; }
    setLoading(true); setErrors({}); setSuccess('');
    try { await changePassword(passwordForm); setSuccess(lang === 'ar' ? 'تم تغيير كلمة المرور. يرجى تسجيل الدخول مجدداً.' : 'Password changed. Logging you out...'); setTimeout(() => { logoutUser(); navigate('/login'); }, 2000); }
    catch (err) { setErrors(err.response?.data || {}); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '11px 14px', border: `1px solid ${isDark ? '#1a3c5e' : '#e2e8f0'}`, borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px', background: isDark ? '#0a1929' : 'white', color: isDark ? '#e2e8f0' : '#2d3748', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '11px', color: subtext, letterSpacing: '0.5px', textTransform: 'uppercase' };
  const errorStyle = { color: '#e53e3e', fontSize: '11px', marginTop: '3px' };

  const tabs = [
    { key: 'profile', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile Info' },
    { key: 'password', label: lang === 'ar' ? 'كلمة المرور' : 'Password' },
  ];

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 68px)' }}>
      <PageHeader title={lang === 'ar' ? 'الملف الشخصي' : 'My Profile'} subtitle={user.email} />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '28px 24px' }}>
        {/* Avatar card */}
        <div style={{ background: surface, borderRadius: '16px', padding: '24px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}`, boxShadow: isDark ? 'none' : 'var(--shadow-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: 'linear-gradient(135deg, #c8a951, #ddc06b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#0f2640', flexShrink: 0 }}>
            {user.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ color: heading, margin: '0 0 4px', fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>{user.full_name}</h3>
            <p style={{ color: subtext, margin: '0 0 8px', fontSize: '13px' }}>{user.email}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(200,169,81,0.1)', color: '#c8a951', border: '1px solid rgba(200,169,81,0.25)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize' }}>{user.role}</span>
              {user.is_verified && <span style={{ background: 'rgba(72,187,120,0.1)', color: '#48bb78', border: '1px solid rgba(72,187,120,0.25)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>✓ {lang === 'ar' ? 'موثق' : 'Verified'}</span>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: isDark ? '#0a1929' : '#f0f4f8', borderRadius: '10px', padding: '4px', marginBottom: '20px', border: `1px solid ${isDark ? '#1a3c5e' : '#e2e8f0'}` }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSuccess(''); setErrors({}); }} style={{
              flex: 1, padding: '9px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: '600', fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s',
              background: activeTab === tab.key ? (isDark ? '#0f2640' : 'white') : 'transparent',
              color: activeTab === tab.key ? (isDark ? '#c8a951' : '#0f2640') : subtext,
              boxShadow: activeTab === tab.key ? (isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.08)') : 'none',
            }}>{tab.label}</button>
          ))}
        </div>

        {success && <div className="fade-in" style={{ background: '#f0fff4', color: '#276749', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', border: '1px solid #c6f6d5', fontWeight: '600' }}>✅ {success}</div>}

        <div style={{ background: surface, borderRadius: '16px', padding: '24px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}`, boxShadow: isDark ? 'none' : 'var(--shadow-sm)' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t('fullName')}</label>
                <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} required />
                {errors.full_name && <p style={errorStyle}>{errors.full_name}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div><label style={labelStyle}>{t('phone')}</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>{t('whatsapp')}</label><input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} style={inputStyle} /></div>
              </div>
              {user.role === 'agency' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div><label style={labelStyle}>{t('agencyName')} (EN)</label><input value={form.agency_name} onChange={e => setForm({...form, agency_name: e.target.value})} style={inputStyle} /></div>
                  <div><label style={labelStyle}>{t('agencyName')} (AR)</label><input value={form.agency_name_ar} onChange={e => setForm({...form, agency_name_ar: e.target.value})} style={inputStyle} /></div>
                </div>
              )}
              <div style={{ background: isDark ? '#060e18' : '#f8f9fa', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: `1px solid ${isDark ? '#1a3c5e' : '#e8edf2'}` }}>
                <p style={{ margin: '0 0 4px', color: subtext, fontSize: '12px' }}>📧 {t('email')}: <strong style={{ color: isDark ? '#e2e8f0' : '#0f2640' }}>{user.email}</strong></p>
                <p style={{ margin: 0, color: subtext, fontSize: '12px' }}>👤 {t('role')}: <strong style={{ color: isDark ? '#e2e8f0' : '#0f2640', textTransform: 'capitalize' }}>{user.role}</strong></p>
              </div>
              <button type="submit" disabled={loading} className="btn-navy" style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px' }}>
                {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSave}>
              {[['old_password', lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'], ['new_password', lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'], ['new_password2', lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password']].map(([field, label]) => (
                <div key={field} style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>{label}</label>
                  <input type="password" value={passwordForm[field]} onChange={e => setPasswordForm({...passwordForm, [field]: e.target.value})} style={inputStyle} required />
                  {errors[field] && <p style={errorStyle}>{errors[field]}</p>}
                </div>
              ))}
              <div style={{ background: 'rgba(200,169,81,0.08)', border: '1px solid rgba(200,169,81,0.2)', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '12px', color: '#c8a951', fontWeight: '500' }}>
                ⚠️ {lang === 'ar' ? 'سيتم تسجيل خروجك بعد تغيير كلمة المرور.' : 'You will be signed out after changing your password.'}
              </div>
              <button type="submit" disabled={loading} className="btn-navy" style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px' }}>
                {loading ? '...' : (lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
