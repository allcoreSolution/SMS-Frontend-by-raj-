import React from 'react';
import { useModal } from '../../context/ModalContext';
import { Phone, Mail, Play, Check, Sparkles } from 'lucide-react';

export default function Pricing() {
  const { openModal } = useModal();

  return (
    <section id="pricing" className="py-8 lg:py-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      
      {/* Outer wrapper with offset brutalist shadow for the dark block */}
      <div className="relative group w-full">
        <div className="absolute inset-0 bg-amber-400 translate-x-3 translate-y-4 transition-transform duration-300" />
        
        <div className="relative w-full bg-[#111827] border-[2px] border-gray-900 p-5 sm:p-6 lg:p-8 text-white grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 bg-grid-pattern overflow-hidden">
           
           {/* Left: Pricing Details */}
           <div className="flex flex-col gap-3 relative z-10 w-full lg:max-w-xl">
             <div className="flex items-center gap-3">
               <span className="bg-amber-400/20 text-amber-400 font-black text-[10px] tracking-widest px-3 py-1 border border-amber-400/30 uppercase">
                 Limited-Time Offer — Save ₹5,000 Today
               </span>
             </div>
             
             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
               Complete Source Code Package
             </h2>
             
             <div className="flex items-end gap-3 translate-y-1">
                <span className="text-gray-400 font-bold text-sm line-through decoration-gray-500 decoration-2">
                  ₹15,000
                </span>
                <span className="text-amber-400 font-black text-4xl sm:text-5xl tracking-tight leading-none">
                  ₹10,000
                </span>
             </div>
             
             <p className="text-gray-400 text-[11px] font-semibold tracking-wide border-b border-gray-800 pb-3">
                One-time payment · inclusive of all 38 modules & 3 mobile apps · instant delivery & Git access
             </p>
             
             <ul className="space-y-1.5 text-gray-200 font-bold text-[13px]">
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> Multi-School ERP Web Panel (React/Node)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> Student & Parent App (Flutter iOS/Android)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> Staff & Admin App (Flutter iOS/Android)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> Driver GPS Fleet App (Flutter iOS/Android)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> Windows Biometric Sync Agent (.NET Executable)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> Super Admin SaaS Panel — unlimited schools
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> Perpetual, worldwide commercial license
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> 1 year software updates & technical support
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-400 text-lg leading-none">✓</span> No royalties, no restrictions, no hidden fees
                </li>
             </ul>
             
             <button 
               onClick={() => openModal('purchase', { plan: '₹10,000 — Full Commercial Source Code' })}
               className="relative group w-full mt-2 cursor-pointer focus:outline-none"
             >
               <div className="absolute inset-0 bg-white translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-active:translate-x-0 group-active:translate-y-0" />
               <div className="relative bg-amber-500 border-[1.5px] border-white px-5 py-3 flex items-center justify-center transition-transform group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] group-active:translate-x-0 group-active:translate-y-0 liquid-btn" style={{ '--liquid-bg': '#ffffff', '--liquid-text': '#111827' }}>
                 <div className="flex items-center w-full z-10 relative pointer-events-none justify-center gap-2">
                   <Sparkles className="w-4 h-4 text-gray-900" />
                   <span className="text-gray-900 font-black text-xs uppercase tracking-widest transition-colors duration-300">
                     Buy Now — ₹10,000 →
                   </span>
                 </div>
               </div>
             </button>
           </div>
           
           {/* Right: Contact Support Box */}
           <div className="relative z-10 flex flex-col justify-center">
             <div className="bg-[#1F2937] border-[1.5px] border-gray-700 p-4 sm:p-5 flex flex-col gap-3 w-full shadow-[3px_3px_0_0_rgba(255,255,255,0.05)] text-sm">
                <h3 className="text-gray-300 font-bold text-xs tracking-wide">
                  Have questions before buying?
                </h3>
                
                <a 
                  href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20want%20to%20purchase%20Multi-School%20ERP%20Source%20Code" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 bg-[#111827] border-[1.5px] border-gray-600 p-2.5 hover:border-amber-400 hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-green-900/40 border border-green-500/30 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform text-xs">
                     📱
                  </div>
                  <span className="text-gray-100 font-bold text-[12px]">WhatsApp Support</span>
                </a>
                
                <a 
                  href="mailto:contact@allcoresolution.com" 
                  className="flex items-center gap-3 bg-[#111827] border-[1.5px] border-gray-600 p-2.5 hover:border-amber-400 hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform text-xs">
                     ✉️
                  </div>
                  <span className="text-gray-100 font-bold text-[12px]">contact@allcoresolution.com</span>
                </a>
                
                <button 
                  onClick={() => openModal('portals')}
                  className="flex items-center gap-3 bg-[#111827] border-[1.5px] border-gray-600 p-2.5 hover:border-amber-400 hover:bg-gray-800 transition-colors group cursor-pointer text-left w-full"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-900/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform text-xs">
                     💻
                  </div>
                  <span className="text-gray-100 font-bold text-[12px]">Launch Live Demo Hub ⚡</span>
                </button>
                
                <div className="text-[10px] font-black tracking-widest uppercase text-gray-500 mt-2 flex justify-between items-center">
                  <span>REF: ACS-ERP-2026-002</span>
                  <span className="text-emerald-400">● 100% Verified</span>
                </div>
             </div>
           </div>
           
        </div>
      </div>
      
    </section>
  );
}
