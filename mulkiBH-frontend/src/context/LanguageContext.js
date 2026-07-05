import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    document.documentElement.lang = lang;
    // Never change layout direction - keep LTR always
    // Only font changes for Arabic
    if (lang === 'ar') {
      document.body.classList.add('arabic');
    } else {
      document.body.classList.remove('arabic');
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
