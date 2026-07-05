import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, changePassword } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useT } from '../hooks/useTranslation';
import { useLang } from '../context/LanguageContext';

const ProfilePage = () => {
  const t = useT();
  const { isRTL } = useLang();
  const { user, setUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    agency_name: user?.agency_name || '',
    agency_name_ar: user?.agency_name_ar || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });

  if (!user) { navigate('/login'); return null; }

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setSuccess(isRTL ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!');
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.new_password2) {
      setErrors({ new_password2: isRTL ? 'كلمتا المرور غير متطابقتان' : 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    setErrors({});
    setSuccess('');
    try {
      await changePassword(passwordForm);
      setSuccess(isRTL ? 'تم تغيير كلمة المرور. يرجى تسجيل الدخول مجدداً.' : 'Password changed. Please log in again.');
      setTimeout(() => { logoutUser(); navigate('/login'); }, 2000);
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4a5568' };
  const errorStyle = { color: '#e53e3e', fontSize: '12px', marginTop: '4px' };

  const tabs = [
    { key: 'profile', label: isRTL ? 'الملف الشخصي' : 'Profile Info', icon: '👤' },
    { key: 'password', label: isRTL ? 'كلمة المرور' : 'Change Password', icon: '🔒' },
  ];

  return (
    <div style={{  maxWidth: '700px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a3c5e, #2d6a9f)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
          {user.profile_image ? <img src={user.profile_image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
        </div>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '22px' }}>{user.full_name}</h2>
          <p style={{ margin: '0 0 4px', opacity: 0.8, fontSize: '14px' }}>{user.email}</p>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
            {user.role}
          </span>
          {user.is_verified && (
            <span style={{ background: '#c8a951', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginLeft: '8px' }}>
              ✓ {isRTL ? 'موثق' : 'Verified'}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSuccess(''); setErrors({}); }} style={{
            padding: '10px 20px', border: '2px solid',
            borderColor: activeTab === tab.key ? '#1a3c5e' : '#e2e8f0',
            borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            background: activeTab === tab.key ? '#1a3c5e' : 'white',
            color: activeTab === tab.key ? 'white' : '#4a5568',
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Success Message */}
      {success && (
        <div style={{ background: '#f0fff4', color: '#276749', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c6f6d5' }}>
          ✅ {success}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ background: 'white', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '24px' }}>{isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h3>
          <form onSubmit={handleProfileSave}>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{t('fullName')}</label>
              <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} required />
              {errors.full_name && <p style={errorStyle}>{errors.full_name}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>{t('phone')}</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} />
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>
              <div>
                <label style={labelStyle}>{t('whatsapp')}</label>
                <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} style={inputStyle} />
                {errors.whatsapp && <p style={errorStyle}>{errors.whatsapp}</p>}
              </div>
            </div>

            {/* Agency fields */}
            {user.role === 'agency' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>{t('agencyName')} (English)</label>
                  <input value={form.agency_name} onChange={e => setForm({...form, agency_name: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t('agencyName')} (عربي)</label>
                  <input value={form.agency_name_ar} onChange={e => setForm({...form, agency_name_ar: e.target.value})} style={{...inputStyle, direction: 'rtl'}} />
                </div>
              </div>
            )}

            {/* Read-only fields */}
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 8px', color: '#718096', fontSize: '13px' }}>
                📧 {t('email')}: <strong>{user.email}</strong>
              </p>
              <p style={{ margin: 0, color: '#718096', fontSize: '13px' }}>
                👤 {t('role')}: <strong style={{ textTransform: 'capitalize' }}>{user.role}</strong>
              </p>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', background: '#1a3c5e', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600'
            }}>{loading ? t('loading') : t('save')}</button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div style={{ background: 'white', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '24px' }}>{isRTL ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
          <form onSubmit={handlePasswordSave}>
            {[
              ['old_password', isRTL ? 'كلمة المرور الحالية' : 'Current Password'],
              ['new_password', isRTL ? 'كلمة المرور الجديدة' : 'New Password'],
              ['new_password2', isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'],
            ].map(([field, label]) => (
              <div key={field} style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="password"
                  value={passwordForm[field]}
                  onChange={e => setPasswordForm({...passwordForm, [field]: e.target.value})}
                  style={inputStyle}
                  required
                />
                {errors[field] && <p style={errorStyle}>{errors[field]}</p>}
              </div>
            ))}

            <div style={{ background: '#fffbeb', border: '1px solid #fbd38d', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#744210' }}>
              ⚠️ {isRTL ? 'سيتم تسجيل خروجك بعد تغيير كلمة المرور.' : 'You will be logged out after changing your password.'}
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', background: '#1a3c5e', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600'
            }}>{loading ? t('loading') : (isRTL ? 'تغيير كلمة المرور' : 'Change Password')}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
