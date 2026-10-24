import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import Swal from 'sweetalert2';
import { HINDI_MAP, HINDI_MAP_LOWER, translateString } from '../utils/translations';

const LanguageContext = createContext();

// Strictly English and Hindi only
export const supportedLanguages = [
  { code: 'en', name: 'English', native: 'English', region: 'Global', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India', flag: '🇮🇳' }
];

// Trigger Google Translate engine programmatically
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

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_language') || localStorage.getItem('portal_language') || 'English';
      return (saved.toLowerCase() === 'hindi' || saved.toLowerCase() === 'hi') ? 'Hindi' : 'English';
    } catch (e) {
      return 'English';
    }
  });

  const [currentLangCode, setCurrentLangCode] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_language') || localStorage.getItem('portal_language') || 'English';
      return (saved.toLowerCase() === 'hindi' || saved.toLowerCase() === 'hi') ? 'hi' : 'en';
    } catch (e) {
      return 'en';
    }
  });

  // Initialize on mount and apply Google Translate if Hindi is active
  useEffect(() => {
    const initLang = async () => {
      let selectedLang = localStorage.getItem('erp_language') || localStorage.getItem('portal_language') || 'English';

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosInstance.get('/profile/me');
          const backendLang = res.data?.data?.preferences?.language;
          if (backendLang) {
            selectedLang = backendLang;
          }
        } catch (err) {}
      }

      const isHindi = selectedLang.toLowerCase() === 'hindi' || selectedLang.toLowerCase() === 'hi';
      const targetName = isHindi ? 'Hindi' : 'English';
      const targetCode = isHindi ? 'hi' : 'en';

      setCurrentLang(targetName);
      setCurrentLangCode(targetCode);
      localStorage.setItem('erp_language', targetName);
      localStorage.setItem('erp_lang_code', targetCode);

      if (isHindi) {
        setTimeout(() => triggerGoogleTranslate('hi'), 600);
      } else {
        triggerGoogleTranslate('en');
      }
    };

    initLang();
  }, []);

  const changeLanguage = async (langNameOrCode) => {
    const isHindi = (langNameOrCode || '').toLowerCase() === 'hindi' || (langNameOrCode || '').toLowerCase() === 'hi';
    const targetName = isHindi ? 'Hindi' : 'English';
    const targetCode = isHindi ? 'hi' : 'en';

    setCurrentLang(targetName);
    setCurrentLangCode(targetCode);

    try {
      localStorage.setItem('erp_language', targetName);
      localStorage.setItem('erp_lang_code', targetCode);
      localStorage.setItem('portal_language', targetCode);
    } catch (e) {}

    // Trigger Google Translate engine
    triggerGoogleTranslate(targetCode);

    // Custom events so any component or window listener can sync
    window.dispatchEvent(new CustomEvent('erp_language_changed', { detail: { name: targetName, code: targetCode } }));

    // Persist to MongoDB backend User Profile if authenticated
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axiosInstance.put('/profile/preferences', {
          preferences: { language: targetName }
        });
      } catch (err) {
        console.warn('Backend language sync warning:', err.message);
      }
    }

    // Show confirmation Toast
    const toastTitle = targetName === 'Hindi' 
      ? 'भाषा बदलकर हिंदी कर दी गई है!' 
      : 'Language switched to English successfully!';

    Swal.fire({
      title: toastTitle,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });

    // If switching back to English from Hindi, reload if needed to restore DOM completely
    if (!isHindi) {
      setTimeout(() => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo && combo.value !== '') {
          combo.value = '';
          combo.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 300);
    }
  };

  const t = (key, fallback = '') => {
    if (!key) return fallback || '';

    if (currentLang === 'Hindi') {
      if (HINDI_MAP[key]) return HINDI_MAP[key];
      const lowerKey = typeof key === 'string' ? key.toLowerCase().trim() : '';
      if (HINDI_MAP_LOWER[lowerKey]) return HINDI_MAP_LOWER[lowerKey];

      if (fallback) {
        if (HINDI_MAP[fallback]) return HINDI_MAP[fallback];
        const lowerFb = typeof fallback === 'string' ? fallback.toLowerCase().trim() : '';
        if (HINDI_MAP_LOWER[lowerFb]) return HINDI_MAP_LOWER[lowerFb];
      }

      return translateString(fallback || key);
    }

    // English
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      currentLangCode, 
      changeLanguage, 
      languages: supportedLanguages.map(l => l.name), 
      supportedLanguages,
      triggerGoogleTranslate,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
