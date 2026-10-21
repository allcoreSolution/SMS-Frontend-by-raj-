import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';

export const supportedLanguages = [
  { name: 'English', native: 'English', code: 'en', flag: '🇬🇧' },
  { name: 'Hindi', native: 'हिन्दी', code: 'hi', flag: '🇮🇳' },
  { name: 'Gujarati', native: 'ગુજરાતી', code: 'gu', flag: '🇮🇳' },
  { name: 'Marathi', native: 'मराठी', code: 'mr', flag: '🇮🇳' },
  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', code: 'pa', flag: '🇮🇳' },
  { name: 'Bengali', native: 'বাংলা', code: 'bn', flag: '🇮🇳' },
  { name: 'Tamil', native: 'தமிழ்', code: 'ta', flag: '🇮🇳' },
  { name: 'Telugu', native: 'తెలుగు', code: 'te', flag: '🇮🇳' },
  { name: 'Urdu', native: 'اُردُو', code: 'ur', flag: '🇵🇰' },
  { name: 'Arabic', native: 'العربية', code: 'ar', flag: '🇸🇦' },
  { name: 'Spanish', native: 'Español', code: 'es', flag: '🇪🇸' },
  { name: 'French', native: 'Français', code: 'fr', flag: '🇫🇷' },
  { name: 'German', native: 'Deutsch', code: 'de', flag: '🇩🇪' },
  { name: 'Russian', native: 'Русский', code: 'ru', flag: '🇷🇺' },
  { name: 'Chinese', native: '中文', code: 'zh-CN', flag: '🇨🇳' },
  { name: 'Japanese', native: '日本語', code: 'ja', flag: '🇯🇵' },
];

export const triggerGoogleTranslate = (langCode) => {
  try {
    if (!langCode || langCode === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }
      return;
    }

    const val = `/en/${langCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; path=/; domain=${window.location.hostname};`;

    const applyToCombo = () => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    if (!applyToCombo()) {
      setTimeout(applyToCombo, 300);
      setTimeout(applyToCombo, 800);
      setTimeout(applyToCombo, 1500);
    }
  } catch (e) {
    console.warn('Translate trigger error:', e);
  }
};

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      return localStorage.getItem('app_language') || 'English';
    } catch (e) {
      return 'English';
    }
  });
  const dropdownRef = useRef(null);

  // Initialize language translation on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('app_language_code');
    if (savedCode && savedCode !== 'en') {
      setTimeout(() => triggerGoogleTranslate(savedCode), 600);
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
      localStorage.setItem('app_language', lang.name);
      localStorage.setItem('app_language_code', lang.code);
    } catch (e) {}

    // Trigger full-site DOM translation via Google Translate engine
    triggerGoogleTranslate(lang.code);

    // Trigger global event so all components react immediately
    window.dispatchEvent(new CustomEvent('app_language_changed', { 
      detail: lang.name,
      code: lang.code
    }));

    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return supportedLanguages;
    const q = searchQuery.toLowerCase().trim();
    return supportedLanguages.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.native.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentFlag = useMemo(() => {
    const found = supportedLanguages.find(l => l.name === selectedLang);
    return found ? found.flag : '🌐';
  }, [selectedLang]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
          isOpen 
            ? 'bg-orange-50 text-[#ff5c0a] border-orange-200 ring-2 ring-orange-500/20' 
            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50 hover:text-[#ff5c0a]'
        }`}
        title="Change Portal Language"
      >
        <span className="text-sm leading-none">{currentFlag}</span>
        <span className="hidden sm:inline font-bold">{selectedLang}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[240px] bg-white border border-slate-100 rounded-2xl shadow-2xl ring-1 ring-slate-900/10 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2 py-1 border-b border-slate-100 mb-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Language</p>
          </div>

          {/* Search languages filter */}
          <div className="relative px-1 mb-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#ff5c0a] focus:bg-white text-slate-700"
              autoFocus
            />
          </div>
          
          <div className="max-h-[260px] overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLang === lang.name;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-orange-50 text-[#ff5c0a] font-bold shadow-xs' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base leading-none shrink-0">{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal shrink-0">({lang.native})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ff5c0a] stroke-[3] shrink-0 ml-1" />}
                </button>
              );
            })}
            {filteredLanguages.length === 0 && (
              <div className="p-3 text-center text-xs text-slate-400">
                No language found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
