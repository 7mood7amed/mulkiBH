import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    // Only set the lang attribute for font rendering
    // Do NOT change document direction globally
    document.documentElement.lang = lang;
    // Apply Arabic font class to body when Arabic
    if (lang === 'ar') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  }, [lang]);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  // isRTL is available but pages should use it only for TEXT alignment
  // not for flipping the entire layout
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
