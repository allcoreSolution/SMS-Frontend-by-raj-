import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const supportedLanguages = [
  { name: 'English', native: 'English', code: 'en', flag: '🇬🇧' },
  { name: 'Hindi', native: 'हिन्दी', code: 'hi', flag: '🇮🇳' },
];

export const hideGoogleTranslateElements = () => {
  try {
    if (typeof document === 'undefined') return;
    document.body.style.top = '0px';
    document.body.style.marginTop = '0px';
    document.body.style.position = 'static';
    
    const selectors = [
      '.goog-te-banner-frame',
      '#goog-gt-tt',
      '#goog-gt-vt',
      '.goog-te-balloon-frame',
      '.goog-tooltip',
      '.goog-te-gadget',
      '.goog-te-gadget-icon',
      '.skiptranslate',
      'iframe.skiptranslate',
      'div.skiptranslate',
      '[class*="VIpgJd"]',
      '[id*="goog-gt-"]'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('width', '0px', 'important');
        el.style.setProperty('height', '0px', 'important');
      });
    });
  } catch (e) {}
};

export const triggerGoogleTranslate = (langCode) => {
  try {
    const host = window.location.hostname;
    hideGoogleTranslateElements();

    if (!langCode || langCode === 'en' || (typeof langCode === 'string' && langCode.toLowerCase() === 'english')) {
      const domains = ['', host, '.' + host];
      const paths = ['/', window.location.pathname];
      domains.forEach(d => {
        paths.forEach(p => {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}${d ? '; domain=' + d : ''};`;
        });
      });
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setTimeout(hideGoogleTranslateElements, 100);
      setTimeout(hideGoogleTranslateElements, 500);
      return;
    }

    const val = `/en/${langCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; path=/; domain=${host};`;

    const applyToCombo = () => {
      hideGoogleTranslateElements();
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo) {
        const desiredVal = (!langCode || langCode === 'en') ? '' : langCode.toLowerCase();
        if (combo.options && combo.options.length > 0) {
          for (let i = 0; i < combo.options.length; i++) {
            const optVal = (combo.options[i].value || '').toLowerCase();
            if (optVal === desiredVal || (desiredVal === '' && (optVal === 'en' || optVal === ''))) {
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
        setTimeout(hideGoogleTranslateElements, 150);
        return true;
      }
      return false;
    };

    if (!applyToCombo()) {
      setTimeout(applyToCombo, 200);
      setTimeout(applyToCombo, 600);
      setTimeout(applyToCombo, 1200);
    }
  } catch (e) {
    console.warn('Translate trigger error:', e);
  }
};

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      // By default open in English, unless user explicitly switched to Hindi in this session
      const isHindi = sessionStorage.getItem('app_user_selected_hindi') === 'true';
      return isHindi ? 'Hindi' : 'English';
    } catch (e) {
      return 'English';
    }
  });
  const dropdownRef = useRef(null);

  // Auto-hide any Google Translate floating widget or banner elements dynamically
  useEffect(() => {
    hideGoogleTranslateElements();
    const observer = new MutationObserver(() => {
      hideGoogleTranslateElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Initialize translation strictly based on session state (default English)
  useEffect(() => {
    const isHindi = sessionStorage.getItem('app_user_selected_hindi') === 'true';
    if (!isHindi) {
      triggerGoogleTranslate('en');
    } else {
      triggerGoogleTranslate('hi');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang) => {
    setSelectedLang(lang.name);
    try {
      if (lang.name === 'Hindi' || lang.code === 'hi') {
        sessionStorage.setItem('app_user_selected_hindi', 'true');
        localStorage.setItem('app_language', 'Hindi');
        localStorage.setItem('app_language_code', 'hi');
      } else {
        sessionStorage.removeItem('app_user_selected_hindi');
        localStorage.setItem('app_language', 'English');
        localStorage.setItem('app_language_code', 'en');
      }
    } catch (e) {}

    // Trigger full-site DOM translation via Google Translate engine
    triggerGoogleTranslate(lang.code);

    // Trigger global event so all components react immediately
    window.dispatchEvent(new CustomEvent('app_language_changed', { 
      detail: lang.name,
      code: lang.code
    }));

    setIsOpen(false);
  };

  const currentFlag = useMemo(() => {
    const found = supportedLanguages.find(l => l.name === selectedLang);
    return found ? found.flag : '🇬🇧';
  }, [selectedLang]);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer shrink-0 ${
          isOpen 
            ? 'bg-orange-50 text-[#ff5c0a] border-orange-200 ring-2 ring-orange-500/20' 
            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50 hover:text-[#ff5c0a]'
        }`}
        title={`Language: ${selectedLang}`}
      >
        <span className="text-sm leading-none shrink-0">{currentFlag}</span>
        <span className="hidden sm:inline font-bold">{selectedLang}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform hidden sm:inline shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] right-0 w-44 bg-white border border-slate-200/90 rounded-2xl shadow-xl ring-1 ring-slate-900/10 z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1 border-b border-slate-100 mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Language</p>
          </div>

          <div className="space-y-0.5">
            {supportedLanguages.map((lang) => {
              const isSelected = selectedLang === lang.name;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-orange-50 text-[#ff5c0a] font-bold shadow-xs' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none shrink-0">{lang.flag}</span>
                    <span className="font-semibold">{lang.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({lang.native})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ff5c0a] stroke-[3] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
