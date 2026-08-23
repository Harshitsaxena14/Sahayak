import React, { createContext, useContext, useState } from 'react';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';

const LanguageContext = createContext();

const translations = {
  en: enTranslations,
  hi: hiTranslations
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_lang');
      return saved && (saved === 'hi' || saved === 'en') ? saved : 'hi';
    } catch (e) {
      return 'hi';
    }
  });

  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let current = translations[language] || translations.en;
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English key
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) fallback = fallback[fk];
          else return keyPath;
        }
        return fallback;
      }
    }
    return current;
  };

  const switchLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      try {
        localStorage.setItem('sahayak_lang', lang);
      } catch (e) {}
    }
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
