import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(true);
    setProgress(0);
    const t1 = setTimeout(() => setProgress(70), 50);
    const t2 = setTimeout(() => setProgress(100), 400);
    const t3 = setTimeout(() => setVisible(false), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [location]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      height: '3px', background: 'transparent', pointerEvents: 'none'
    }}>
      <div style={{
        height: '100%', background: '#c8a951',
        width: `${progress}%`,
        transition: progress === 0 ? 'none' : 'width 0.4s ease',
        boxShadow: '0 0 8px rgba(200,169,81,0.6)'
      }} />
    </div>
  );
};

export default ProgressBar;
