import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { openModal } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-[#fdfdfd] border-b-2 border-gray-900 z-50">
      <div className="w-full px-3 sm:px-6 lg:px-12 mx-auto">
        <div className="flex justify-between items-center h-[72px] sm:h-[80px]">

          {/* Logo Section (Left) */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0">
            <div className="flex-shrink-0 relative transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1">
              <div className="absolute inset-0 bg-gray-900 translate-y-1 sm:translate-y-1.5 translate-x-1 sm:translate-x-1.5 transition-all duration-300 group-hover:translate-y-2 group-hover:translate-x-2" />

              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-10 bg-white border-2 border-gray-900 sm:w-8 sm:h-8" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="8" height="8" fill="#F59E0B" />
                <rect x="12" y="12" width="8" height="8" fill="#0F172A" />
                <path d="M4 12H20M12 4V20" stroke="#0F172A" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-2xl tracking-tighter text-gray-900 leading-none">
                MultiSchool<span className="text-amber-500">ERP</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-gray-500 uppercase mt-0.5">
                Enterprise Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Center) */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            <Link
              to="/"
              className="relative text-[13px] xl:text-[14px] font-black uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors duration-200 group py-2"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
            </Link>

            <Link
              to="/modules"
              className="relative text-[13px] xl:text-[14px] font-black uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors duration-200 group py-2"
            >
              Modules (38)
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
            </Link>

            <Link
              to="/pricing"
              className="relative text-[13px] xl:text-[14px] font-black uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors duration-200 group py-2"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
            </Link>

            <button
              onClick={() => openModal('portals')}
              className="relative text-[13px] xl:text-[14px] font-black uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors duration-200 group py-2 cursor-pointer"
            >
              Live Demo
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
            </button>

            <button
              onClick={() => openModal('doc')}
              className="relative text-[13px] xl:text-[14px] font-black uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors duration-200 group py-2 cursor-pointer"
            >
              Docs & Spec
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
            </button>
          </div>

          {/* Square Neo-Brutalist CTA Button (Right) */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => openModal('purchase')}
              className="relative group focus:outline-none cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-900 translate-x-[2.5px] sm:translate-x-[4px] translate-y-[2.5px] sm:translate-y-[4px] transition-transform duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-active:translate-x-0 group-active:translate-y-0" />

              <div
                className="relative flex items-center bg-amber-400 border-2 border-gray-900 px-2.5 sm:px-5 py-2 sm:py-2.5 transition-transform duration-200 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-active:translate-x-0 group-active:translate-y-0 liquid-btn"
                style={{ '--liquid-bg': '#0F172A', '--liquid-text': '#ffffff' }}
              >
                <div className="flex items-center w-full z-10 relative">
                  <span className="text-gray-900 font-black text-[10px] sm:text-[12.5px] uppercase tracking-wider sm:tracking-widest flex items-center gap-1 sm:gap-2 transition-colors duration-300">
                    <span>Start Engine</span>
                    <span className="w-1.5 h-1.5 bg-gray-900 animate-ping" />
                  </span>

                  <div className="ml-1.5 sm:ml-3 pl-1.5 sm:pl-3 border-l-2 border-gray-900 flex items-center gap-1">
                    <span className="text-gray-900 font-bold text-[10px] line-through decoration-2 opacity-60 hidden sm:inline">₹15K</span>
                    <span className="text-gray-900 font-black text-[11px] sm:text-[13px] transition-colors duration-300">₹10K</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-gray-900 border-2 border-gray-900 bg-white ml-0.5 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-gray-900 px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-gray-900 bg-gray-50 text-center"
            >
              Home
            </Link>
            <Link
              to="/modules"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-gray-900 bg-gray-50 text-center"
            >
              Modules (38)
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-gray-900 bg-gray-50 text-center"
            >
              Pricing (₹10K)
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); openModal('doc'); }}
              className="p-2 border border-gray-900 bg-gray-50 text-center cursor-pointer"
            >
              Docs & Spec
            </button>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal('portals');
              }}
              className="w-full py-2.5 bg-gray-900 text-white font-black text-xs uppercase tracking-wider border border-gray-900 flex items-center justify-center gap-1.5 hover:bg-amber-400 hover:text-gray-900 transition-colors"
            >
              <span>Open Live Demo Hub</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
