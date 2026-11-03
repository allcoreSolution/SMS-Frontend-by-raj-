import React, { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronDown, Check } from 'lucide-react';

const AcademicYearDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const dropdownRef = useRef(null);

  const years = [
    { label: '2027-2028', badge: 'Next' },
    { label: '2026-2027', badge: 'Current' },
    { label: '2025-2026', badge: '' },
    { label: '2024-2025', badge: '' },
    { label: '2023-2024', badge: '' }
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

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1 sm:px-2 py-1 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer shrink-0"
        title={`Academic Year: ${selectedYear}`}
      >
        <CalendarDays className="w-3.5 h-3.5 text-gray-500 shrink-0" />
        <span className="hidden xs:inline text-[10.5px] sm:text-xs">{selectedYear.replace('20', '').replace('-20', '-')}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform hidden sm:inline shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] right-0 w-[190px] bg-white border border-slate-100 rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Academic Year</p>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto px-1.5 mt-1 space-y-0.5 custom-scrollbar">
            {years.map((year) => (
              <button
                key={year.label}
                onClick={() => {
                  setSelectedYear(year.label);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedYear === year.label 
                  ? 'bg-indigo-50/80 text-indigo-700 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{year.label}</span>
                  {year.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wide leading-none ${
                        year.badge === 'Current' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {year.badge}
                    </span>
                  )}
                </div>
                {selectedYear === year.label && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicYearDropdown;
