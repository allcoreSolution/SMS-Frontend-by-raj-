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

  const isTranslatingRef = React.useRef(false);

  // Clean any legacy Google Translate artifacts
  useEffect(() => {
    try {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const el = document.getElementById('google_translate_element');
      if (el) el.remove();
    } catch (e) {}

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

  // Safe non-destructive DOM translation for all data, tables, cards and widgets
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const translateTextNode = (node) => {
      if (!node || isTranslatingRef.current) return;
      const tag = node.parentElement ? node.parentElement.tagName.toUpperCase() : '';
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'CODE', 'PRE', 'NOSCRIPT'].includes(tag)) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const currentVal = node.nodeValue;
        if (!currentVal || typeof currentVal !== 'string') return;
        const trimmed = currentVal.trim();
        if (trimmed.length < 2) return;

        if (currentLang === 'Hindi') {
          if (node.__erpOrig === undefined) {
            node.__erpOrig = currentVal;
          }
          const baseToTranslate = node.__erpOrig.trim();
          const translated = translateString(baseToTranslate);
          if (translated !== baseToTranslate) {
            node.nodeValue = node.__erpOrig.replace(baseToTranslate, translated);
          }
        } else {
          if (node.__erpOrig !== undefined) {
            node.nodeValue = node.__erpOrig;
            delete node.__erpOrig;
          }
        }
      }
    };

    const translateInputs = (el) => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.placeholder) {
          if (currentLang === 'Hindi') {
            if (el.__erpOrigPlaceholder === undefined) {
              el.__erpOrigPlaceholder = el.placeholder;
            }
            const translated = translateString(el.__erpOrigPlaceholder);
            if (translated !== el.__erpOrigPlaceholder) {
              el.placeholder = translated;
            }
          } else {
            if (el.__erpOrigPlaceholder !== undefined) {
              el.placeholder = el.__erpOrigPlaceholder;
              delete el.__erpOrigPlaceholder;
            }
          }
        }
      }
    };

    const walk = (root) => {
      if (!root) return;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (n) => {
            if (n.nodeType === Node.ELEMENT_NODE) {
              const tag = n.tagName.toUpperCase();
              if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'CODE', 'PRE', 'NOSCRIPT'].includes(tag)) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let curr = walker.nextNode();
      while (curr) {
        if (curr.nodeType === Node.TEXT_NODE) {
          translateTextNode(curr);
        } else if (curr.nodeType === Node.ELEMENT_NODE) {
          translateInputs(curr);
        }
        curr = walker.nextNode();
      }
    };

    isTranslatingRef.current = true;
    try {
      walk(document.body);
    } finally {
      isTranslatingRef.current = false;
    }

    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
      if (isTranslatingRef.current) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        isTranslatingRef.current = true;
        try {
          mutations.forEach((mut) => {
            mut.addedNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                translateTextNode(node);
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                walk(node);
              }
            });
          });
        } finally {
          isTranslatingRef.current = false;
        }
      }, 60);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
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
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
