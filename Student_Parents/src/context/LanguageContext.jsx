import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, getT } from '../utils/translations';

const LanguageContext = createContext();

export const triggerGoogleTranslate = (langCode) => {
  try {
    const isEn = !langCode || langCode === 'en' || langCode.toLowerCase() === 'english';
    if (isEn) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    const val = `/en/${langCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; path=/; domain=${window.location.hostname};`;

    const applyToCombo = () => {
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo) {
        const desiredVal = langCode.toLowerCase();
        if (combo.options && combo.options.length > 0) {
          for (let i = 0; i < combo.options.length; i++) {
            const optVal = (combo.options[i].value || '').toLowerCase();
            if (optVal === desiredVal) {
              combo.selectedIndex = i;
              combo.options[i].selected = true;
              break;
            }
          }
        }
        combo.value = desiredVal;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        try {
          combo.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (_) {}
        return true;
      }
      return false;
    };

    if (!applyToCombo()) {
      setTimeout(applyToCombo, 100);
      setTimeout(applyToCombo, 300);
      setTimeout(applyToCombo, 700);
      setTimeout(applyToCombo, 1500);
      setTimeout(applyToCombo, 3000);
    }
  } catch (e) {
    console.warn('Google translate trigger error:', e);
  }
};

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_language') || localStorage.getItem('app_language');
      return saved === 'hi' ? 'hi' : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Initialize on mount
  useEffect(() => {
    if (currentLang === 'hi') {
      setTimeout(() => triggerGoogleTranslate('hi'), 600);
    } else {
      triggerGoogleTranslate('en');
    }
  }, []);

  const setLanguage = (langCode) => {
    const validCode = langCode === 'hi' ? 'hi' : 'en';
    setCurrentLangState(validCode);
    try {
      localStorage.setItem('portal_language', validCode);
      localStorage.setItem('app_language', validCode);
      localStorage.setItem('app_language_code', validCode);
    } catch (e) {}

    // Trigger Google Translate engine
    triggerGoogleTranslate(validCode);

    // Global custom events for any listener
    window.dispatchEvent(new CustomEvent('portal_language_changed', { detail: validCode }));
    window.dispatchEvent(new CustomEvent('app_language_changed', { detail: validCode, code: validCode }));

    // Instant toast notification for visual confirmation
    const langObj = LANGUAGES.find(l => l.code === validCode);
    if (langObj) {
      setToastMessage(`${langObj.flag} ${langObj.native} (${langObj.name}) active`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  useEffect(() => {
    const handleExternalChange = (e) => {
      if (e.detail && (e.detail === 'en' || e.detail === 'hi') && e.detail !== currentLang) {
        setCurrentLangState(e.detail);
        triggerGoogleTranslate(e.detail);
      }
    };
    window.addEventListener('portal_language_changed', handleExternalChange);
    return () => window.removeEventListener('portal_language_changed', handleExternalChange);
  }, [currentLang]);

  const t = (key, defaultText) => {
    return getT(key, currentLang) || defaultText || key;
  };

  const currentLanguageObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      currentLang,
      setLanguage,
      t,
      currentLanguageObj,
      languages: LANGUAGES
    }}>
      {children}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[99999] bg-slate-900/95 text-white px-4 py-2.5 rounded shadow-2xl text-xs font-bold flex items-center gap-2.5 border border-indigo-500/40 animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-xs pointer-events-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="tracking-wide">{toastMessage}</span>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    const fallbackLang = (typeof window !== 'undefined' && (localStorage.getItem('portal_language') || 'en')) || 'en';
    const validFallback = fallbackLang === 'hi' ? 'hi' : 'en';
    return {
      currentLang: validFallback,
      setLanguage: () => {},
      t: (key, defaultText) => getT(key, validFallback) || defaultText || key,
      currentLanguageObj: LANGUAGES.find(l => l.code === validFallback) || LANGUAGES[0],
      languages: LANGUAGES
    };
  }
  return context;
};
