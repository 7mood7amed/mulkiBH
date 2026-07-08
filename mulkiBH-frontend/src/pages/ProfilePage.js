/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, changePassword } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const ProfilePage = () => {
  const { lang } = useLang();
  const { user, setUser, logoutUser } = useAuth();
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

  const fieldStyle = { width: '100%', padding: '11px 12px', border: '1px solid #c4c6ce', borderRadius: '2px', boxSizing: 'border-box', fontSize: '14px', background: '#f6fafe', color: '#171c1f', fontFamily: 'inherit', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '11px', color: '#44474d', letterSpacing: '0.05em', textTransform: 'uppercase' };
  const errorStyle = { color: '#ba1a1a', fontSize: '11px', marginTop: '4px' };

  const tabs = [
    { key: 'profile', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile Info' },
    { key: 'password', label: lang === 'ar' ? 'كلمة المرور' : 'Password' },
  ];

  return (
    <div style={{ background: '#f6fafe', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px' }}>
        {/* Identity card */}
        <div style={{ background: '#0f2640', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{ width: '68px', height: '68px', background: '#c8a951', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#0f2640', flexShrink: 0 }}>
            {user.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="heading-display" style={{ color: 'white', margin: '0 0 6px', fontSize: '22px' }}>{user.full_name}</h2>
            <p style={{ color: '#94a9c9', margin: '0 0 10px', fontSize: '13px' }}>{user.email}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(200,169,81,0.15)', color: '#c8a951', border: '1px solid rgba(200,169,81,0.3)', padding: '3px 10px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize' }}>{user.role}</span>
              {user.is_verified && <span style={{ background: 'rgba(46,125,50,0.15)', color: '#7fd88f', border: '1px solid rgba(46,125,50,0.3)', padding: '3px 10px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>verified</span>{lang === 'ar' ? 'موثق' : 'Verified'}</span>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid rgba(196,198,206,0.4)', marginBottom: '24px' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSuccess(''); setErrors({}); }} style={{
              padding: '12px 4px', border: 'none', borderBottom: `2px solid ${activeTab === tab.key ? '#c8a951' : 'transparent'}`, background: 'transparent',
              cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.05em',
              color: activeTab === tab.key ? '#0f2640' : '#74777e',
            }}>{tab.label}</button>
          ))}
        </div>

        {success && <div className="fade-in" style={{ background: 'rgba(46,125,50,0.08)', color: '#2e7d32', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', border: '1px solid rgba(46,125,50,0.25)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>{success}
        </div>}

        <div style={{ background: 'white', padding: '32px', border: '1px solid rgba(196,198,206,0.4)', boxShadow: '0 1px 3px rgba(15,38,64,0.06)' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={fieldStyle} required />
                {errors.full_name && <p style={errorStyle}>{errors.full_name}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div><label style={labelStyle}>{lang === 'ar' ? 'الهاتف' : 'Phone'}</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={fieldStyle} /></div>
                <div><label style={labelStyle}>WhatsApp</label><input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} style={fieldStyle} /></div>
              </div>
              {user.role === 'agency' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div><label style={labelStyle}>{lang === 'ar' ? 'اسم المكتب (EN)' : 'Agency Name (EN)'}</label><input value={form.agency_name} onChange={e => setForm({ ...form, agency_name: e.target.value })} style={fieldStyle} /></div>
                  <div><label style={labelStyle}>{lang === 'ar' ? 'اسم المكتب (AR)' : 'Agency Name (AR)'}</label><input value={form.agency_name_ar} onChange={e => setForm({ ...form, agency_name_ar: e.target.value })} style={fieldStyle} /></div>
                </div>
              )}
              <div style={{ background: '#f0f4f8', padding: '16px', marginBottom: '24px', borderLeft: '3px solid #c8a951' }}>
                <p style={{ margin: '0 0 6px', color: '#44474d', fontSize: '13px' }}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}: <strong style={{ color: '#0f2640' }}>{user.email}</strong></p>
                <p style={{ margin: 0, color: '#44474d', fontSize: '13px' }}>{lang === 'ar' ? 'الدور' : 'Role'}: <strong style={{ color: '#0f2640', textTransform: 'capitalize' }}>{user.role}</strong></p>
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(200,169,81,0.5)' : '#c8a951', color: '#0f2640', border: 'none', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: loading ? 'default' : 'pointer' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = '#ddc06b')} onMouseLeave={e => !loading && (e.currentTarget.style.background = '#c8a951')}
              >
                {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSave}>
              {[['old_password', lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'], ['new_password', lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'], ['new_password2', lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password']].map(([field, label]) => (
                <div key={field} style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>{label}</label>
                  <input type="password" value={passwordForm[field]} onChange={e => setPasswordForm({ ...passwordForm, [field]: e.target.value })} style={fieldStyle} required />
                  {errors[field] && <p style={errorStyle}>{errors[field]}</p>}
                </div>
              ))}
              <div style={{ background: 'rgba(200,169,81,0.08)', border: '1px solid rgba(200,169,81,0.25)', padding: '14px', marginBottom: '24px', fontSize: '13px', color: '#a37c1a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>warning</span>{lang === 'ar' ? 'سيتم تسجيل خروجك بعد تغيير كلمة المرور.' : 'You will be signed out after changing your password.'}
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(200,169,81,0.5)' : '#c8a951', color: '#0f2640', border: 'none', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: loading ? 'default' : 'pointer' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = '#ddc06b')} onMouseLeave={e => !loading && (e.currentTarget.style.background = '#c8a951')}
              >
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
