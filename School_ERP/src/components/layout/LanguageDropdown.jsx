import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      return localStorage.getItem('app_language') || 'English';
    } catch (e) {
      return 'English';
    }
  });
  const dropdownRef = useRef(null);

  const languages = [
    { name: 'English', code: 'en-US', flag: '🇬🇧' },
    { name: 'Hindi', code: 'hi', flag: '🇮🇳' },
    { name: 'Spanish', code: 'es', flag: '🇪🇸' },
    { name: 'French', code: 'fr', flag: '🇫🇷' },
    { name: 'Arabic', code: 'ar', flag: '🇸🇦' },
    { name: 'German', code: 'de', flag: '🇩🇪' },
  ];

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

  const handleSelectLanguage = (langName) => {
    setSelectedLang(langName);
    try {
      localStorage.setItem('app_language', langName);
    } catch (e) {}
    // Trigger global event so all components react immediately
    window.dispatchEvent(new CustomEvent('app_language_changed', { detail: langName }));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
        title="Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-gray-500" />
        <span>{selectedLang.split(' ')[0]}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-[200px] bg-white border border-slate-100 rounded-xl shadow-xl ring-1 ring-slate-900/5 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Language</p>
          </div>
          
          <div className="max-h-[260px] overflow-y-auto px-1.5 mt-1 space-y-0.5 custom-scrollbar">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  selectedLang === lang.name 
                  ? 'bg-indigo-50 text-indigo-700 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {selectedLang === lang.name && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
