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

// Helper to purge all Google Translate cookies across all paths and domains
export const purgeGoogleCookies = () => {
  try {
    const host = window.location.hostname;
    const domains = ['', host, '.' + host];
    const parts = host.split('.');
    if (parts.length > 2) {
      domains.push('.' + parts.slice(-2).join('.'));
    }
    const paths = ['/', window.location.pathname, ''];
    domains.forEach((d) => {
      paths.forEach((p) => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=${p}${d ? '; domain=' + d : ''};`;
      });
    });
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0;';
  } catch (_) {}
};

// Trigger Google Translate engine programmatically
export const triggerGoogleTranslate = (langCode) => {
  try {
    const isEn = !langCode || langCode === 'en' || langCode.toLowerCase() === 'english';
    const targetCode = isEn ? 'en' : 'hi';
    const host = window.location.hostname;

    if (isEn) {
      purgeGoogleCookies();
      if (document.documentElement) {
        document.documentElement.lang = 'en';
        document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      }
    } else {
      const val = `/en/${targetCode}`;
      document.cookie = `googtrans=${val}; path=/;`;
      document.cookie = `googtrans=${val}; path=/; domain=${host};`;
      document.cookie = `googtrans=/auto/${targetCode}; path=/;`;
    }

    const applyToCombo = () => {
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo) {
        let matched = false;
        if (combo.options && combo.options.length > 0) {
          for (let i = 0; i < combo.options.length; i++) {
            const optVal = (combo.options[i].value || '').toLowerCase();
            const optText = (combo.options[i].text || '').toLowerCase();
            if (isEn) {
              if (optVal === 'en' || optVal === '' || optText.includes('english') || optText.includes('select')) {
                combo.selectedIndex = i;
                combo.options[i].selected = true;
                combo.value = combo.options[i].value;
                matched = true;
                break;
              }
            } else {
              if (optVal === 'hi' || optText.includes('hindi') || optText.includes('हिन्दी')) {
                combo.selectedIndex = i;
                combo.options[i].selected = true;
                combo.value = combo.options[i].value;
                matched = true;
                break;
              }
            }
          }
        }
        if (!matched) {
          combo.value = isEn ? '' : targetCode;
        }
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        try {
          combo.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (_) {}
        return true;
      }
      return false;
    };

    if (!applyToCombo()) {
      [50, 150, 350, 700, 1200, 2000].forEach((delay) => {
        setTimeout(applyToCombo, delay);
      });
    }
  } catch (e) {
    console.warn('Google translate trigger error:', e);
  }
};

export const LanguageProvider = ({ children }) => {
  // Always default strictly to English on open
  const [currentLang, setCurrentLang] = useState('English');
  const [currentLangCode, setCurrentLangCode] = useState('en');

  // Initialize on mount: ensure default is strictly English and clear any translation cookies
  useEffect(() => {
    try {
      purgeGoogleCookies();
      sessionStorage.setItem('erp_language', 'English');
      sessionStorage.setItem('erp_lang_code', 'en');
      localStorage.setItem('erp_language', 'English');
      localStorage.setItem('erp_lang_code', 'en');
      if (document.documentElement) {
        document.documentElement.lang = 'en';
        document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      }
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo && combo.value !== '') {
        combo.value = '';
      }
    } catch (_) {}
  }, []);

  const changeLanguage = async (langNameOrCode) => {
    const isHindi = (langNameOrCode || '').toLowerCase() === 'hindi' || (langNameOrCode || '').toLowerCase() === 'hi';
    const targetName = isHindi ? 'Hindi' : 'English';
    const targetCode = isHindi ? 'hi' : 'en';

    setCurrentLang(targetName);
    setCurrentLangCode(targetCode);

    try {
      sessionStorage.setItem('erp_language', targetName);
      sessionStorage.setItem('erp_lang_code', targetCode);
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

    // If switching back to English from Hindi, restore combo and cleanup DOM
    if (!isHindi) {
      setTimeout(() => {
        purgeGoogleCookies();
        const combo = document.querySelector('.goog-te-combo');
        if (combo && combo.value !== '') {
          combo.value = '';
          combo.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (document.documentElement) {
          document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
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
