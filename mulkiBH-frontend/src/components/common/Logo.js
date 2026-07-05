/* eslint-disable */
import React from 'react';
import { useLang } from '../../context/LanguageContext';

const Logo = ({ size = 'md', dark = true }) => {
  const { lang } = useLang();
  const sizes = { sm: 28, md: 36, lg: 48 };
  const iconSize = sizes[size] || 36;
  const textSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 19;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Icon */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* House shape */}
        <path d="M18 4L3 16h3.5v16h8v-9h7v9h8V16H33L18 4z" fill="#c8a951"/>
        {/* Door */}
        <rect x="15" y="23" width="6" height="9" rx="1" fill={dark ? '#0f2640' : 'white'} opacity="0.5"/>
        {/* Window left */}
        <rect x="7" y="19" width="5" height="4" rx="0.8" fill={dark ? '#0f2640' : 'white'} opacity="0.4"/>
        {/* Window right */}
        <rect x="24" y="19" width="5" height="4" rx="0.8" fill={dark ? '#0f2640' : 'white'} opacity="0.4"/>
        {/* Roof shine */}
        <path d="M18 4L33 16h-2L18 6.5 7 16H5L18 4z" fill="white" opacity="0.15"/>
      </svg>

      {/* Text */}
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontSize: `${textSize}px`,
          fontWeight: '800',
          letterSpacing: '-0.4px',
          color: dark ? 'white' : '#0f2640',
          fontFamily: "'Inter', sans-serif",
        }}>
          {lang === 'ar' ? 'ملكي' : 'MulkiBH'}
        </div>
        <div style={{
          fontSize: '9px',
          fontWeight: '600',
          letterSpacing: '1.5px',
          color: '#c8a951',
          textTransform: 'uppercase',
          marginTop: '1px',
          opacity: 0.9,
        }}>
          {lang === 'ar' ? 'عقارات البحرين' : 'Bahrain Real Estate'}
        </div>
      </div>
    </div>
  );
};

export default Logo;
