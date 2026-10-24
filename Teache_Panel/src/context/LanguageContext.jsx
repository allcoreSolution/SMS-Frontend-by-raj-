import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axios';
import Swal from 'sweetalert2';
import { HINDI_MAP, HINDI_MAP_LOWER, translateString } from '../utils/translations';

const LanguageContext = createContext();

// Strictly English and Hindi only
export const supportedLanguages = [
  { code: 'en', name: 'English', native: 'English', region: 'Global', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India', flag: '🇮🇳' }
];

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

  const isTranslatingRef = useRef(false);

  // Clean any old Google Translate cookies or elements
  const cleanGoogleCookies = () => {
    try {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const el = document.getElementById('google_translate_element');
      if (el) el.remove();
    } catch (e) {}
  };

  // Initialize from storage or backend on mount
  useEffect(() => {
    cleanGoogleCookies();

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
    };

    initLang();
  }, []);

  // Global Full-Page Real-Time Translation Walker
  // Translates ALL DATA, tables, lists, cards, widgets, and dynamic content on screen
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (currentLang !== 'Hindi') {
      // Restore original English text across all modified DOM nodes
      isTranslatingRef.current = true;
      try {
        const textNodesWithOrig = document.querySelectorAll('[data-erp-orig-text]');
        textNodesWithOrig.forEach(el => {
          el.textContent = el.getAttribute('data-erp-orig-text');
          el.removeAttribute('data-erp-orig-text');
        });

        const inputsWithOrig = document.querySelectorAll('[data-erp-orig-placeholder]');
        inputsWithOrig.forEach(input => {
          input.placeholder = input.getAttribute('data-erp-orig-placeholder');
          input.removeAttribute('data-erp-orig-placeholder');
        });
      } finally {
        isTranslatingRef.current = false;
      }
      return;
    }

    // Translate DOM nodes recursively
    const translateNode = (node) => {
      if (!node || isTranslatingRef.current) return;

      const tag = node.nodeName ? node.nodeName.toUpperCase() : '';
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'CODE', 'PRE', 'NOSCRIPT'].includes(tag)) return;

      // Translate Input Placeholders
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.placeholder && typeof node.placeholder === 'string' && !node.getAttribute('data-erp-orig-placeholder')) {
          const original = node.placeholder.trim();
          const translated = translateString(original);
          if (translated !== original) {
            node.setAttribute('data-erp-orig-placeholder', node.placeholder);
            node.placeholder = translated;
          }
        }
      }

      // Translate Text Nodes
      if (node.nodeType === Node.TEXT_NODE) {
        const val = node.nodeValue;
        if (val && typeof val === 'string') {
          const trimmed = val.trim();
          if (trimmed.length >= 2) {
            const parent = node.parentElement;
            if (parent && !parent.getAttribute('data-erp-orig-text')) {
              const translated = translateString(trimmed);
              if (translated !== trimmed) {
                parent.setAttribute('data-erp-orig-text', val);
                node.nodeValue = val.replace(trimmed, translated);
              }
            }
          }
        }
        return;
      }

      // Recurse child nodes
      let child = node.firstChild;
      while (child) {
        translateNode(child);
        child = child.nextSibling;
      }
    };

    // Perform initial page-wide pass
    isTranslatingRef.current = true;
    try {
      translateNode(document.body);
    } finally {
      isTranslatingRef.current = false;
    }

    // Observe dynamic changes (route transitions, modals, API fetches, pagination)
    let timeoutId;
    const observer = new MutationObserver((mutations) => {
      if (isTranslatingRef.current) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isTranslatingRef.current = true;
        try {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((added) => {
              translateNode(added);
            });
          });
        } finally {
          isTranslatingRef.current = false;
        }
      }, 50);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [currentLang]);

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

    cleanGoogleCookies();

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
  };

  const t = (key, fallback = '') => {
    if (!key) return fallback || '';

    if (currentLang === 'Hindi') {
      const match = HINDI_MAP[key] || HINDI_MAP_LOWER[key.toLowerCase()];
      if (match) return match;
      if (fallback) {
        const fallbackMatch = HINDI_MAP[fallback] || HINDI_MAP_LOWER[fallback.toLowerCase()];
        if (fallbackMatch) return fallbackMatch;
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
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
