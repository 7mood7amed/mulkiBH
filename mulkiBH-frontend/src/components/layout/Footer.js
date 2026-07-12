/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';

const Footer = () => {
  const { lang } = useLang();
  const ar = lang === 'ar';

  const linkStyle = {
    color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'inline-block',
    transition: 'color 0.2s, transform 0.2s',
  };

  return (
    <footer style={{ background: '#001125', padding: '64px clamp(20px,5vw,64px) 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>

          {/* Brand */}
          <div>
            <div className="heading-display" style={{ fontSize: '26px', color: '#ffe08d', marginBottom: '16px' }}>
              {ar ? 'ملكي' : 'MulkiBH'}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px' }}>
              {ar
                ? 'إعادة تعريف العقارات الفاخرة في البحرين من خلال الابتكار الرقمي والتميز التقليدي.'
                : 'Redefining luxury real estate in Bahrain through digital innovation and traditional excellence.'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="label-md" style={{ color: 'white', marginBottom: '16px' }}>{ar ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/properties" style={linkStyle} onMouseEnter={e => { e.currentTarget.style.color = '#ffe08d'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'none'; }}>{ar ? 'تصفح العقارات' : 'Browse Properties'}</Link></li>
              <li><Link to="/orders/create" style={linkStyle} onMouseEnter={e => { e.currentTarget.style.color = '#ffe08d'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'none'; }}>{ar ? 'أضف طلبك' : 'Post Your Order'}</Link></li>
              <li><Link to="/register" style={linkStyle} onMouseEnter={e => { e.currentTarget.style.color = '#ffe08d'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'none'; }}>{ar ? 'انضم كمالك' : 'Join as Owner'}</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="label-md" style={{ color: 'white', marginBottom: '16px' }}>{ar ? 'الحساب' : 'Account'}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/dashboard" style={linkStyle} onMouseEnter={e => { e.currentTarget.style.color = '#ffe08d'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'none'; }}>{ar ? 'لوحة التحكم' : 'Dashboard'}</Link></li>
              <li><Link to="/favorites" style={linkStyle} onMouseEnter={e => { e.currentTarget.style.color = '#ffe08d'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'none'; }}>{ar ? 'المفضلة' : 'Favorites'}</Link></li>
              <li><Link to="/subscriptions" style={linkStyle} onMouseEnter={e => { e.currentTarget.style.color = '#ffe08d'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'none'; }}>{ar ? 'خطط الاشتراك' : 'Subscription Plans'}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-md" style={{ color: 'white', marginBottom: '16px' }}>{ar ? 'تواصل معنا' : 'Contact'}</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.8 }}>
              {ar ? 'مملكة البحرين' : 'Kingdom of Bahrain'}<br />
              info@mulkibh.com
            </p>
          </div>
        </div>

        <div style={{ paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            © 2026 MulkiBH. {ar ? 'جميع الحقوق محفوظة.' : 'All rights reserved. Premium Real Estate Bahrain.'}
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{ar ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{ar ? 'شروط الاستخدام' : 'Terms of Service'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
