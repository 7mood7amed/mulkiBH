/* eslint-disable */
import React, { useState } from 'react';

const FloatingField = ({ label, type = 'text', value, onChange, required, dark, rightIcon, onRightIconClick, ...rest }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || !!value;

  const textColor = dark ? 'white' : '#0f2640';
  const idleBorder = dark ? '#1a3c5e' : '#c4c6ce';
  const idleLabel = dark ? 'rgba(255,255,255,0.6)' : '#74777e';

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        style={{
          width: '100%', padding: rightIcon ? '8px 32px 8px 0' : '8px 0', border: 'none',
          borderBottom: `1px solid ${idleBorder}`, background: 'transparent', color: textColor,
          outline: 'none', fontFamily: 'inherit', fontSize: '15px', boxSizing: 'border-box', transition: 'border-color 0.2s ease',
        }}
        {...rest}
      />
      <label style={{
        position: 'absolute', left: 0, top: active ? '-16px' : '8px',
        fontSize: active ? '10px' : '15px', color: active ? '#c8a951' : idleLabel,
        transition: 'all 0.2s ease-out', pointerEvents: 'none', fontWeight: '700',
        letterSpacing: active ? '0.08em' : 'normal', textTransform: active ? 'uppercase' : 'none',
      }}>{label}</label>
      {rightIcon && (
        <button type="button" onClick={onRightIconClick} style={{ position: 'absolute', right: 0, top: '6px', background: 'none', border: 'none', cursor: 'pointer', color: idleLabel, display: 'flex' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{rightIcon}</span>
        </button>
      )}
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: '2px', width: focused ? '100%' : '0%', background: '#c8a951', transition: 'width 0.3s ease' }} />
    </div>
  );
};

export default FloatingField;
