import React from 'react';
import { useModal } from '../../context/ModalContext';
import { Phone, Mail, Play, Check, Sparkles } from 'lucide-react';

export default function Pricing() {
  const { openModal } = useModal();

  return (
    <section id="pricing" className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Compact Luxury SaaS Pricing Card */}
      <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 lg:p-7 text-white grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 sm:gap-7 shadow-xl overflow-hidden">
         
         {/* Subtle Ambient Glow */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

         {/* Left: Pricing Details */}
         <div className="flex flex-col gap-2.5 relative z-10 w-full">
           <div className="flex items-center gap-2">
             <span className="bg-amber-400/10 text-amber-400 font-black text-[9px] sm:text-[10px] tracking-wider px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase">
               Flat Annual SaaS License for Schools &amp; Colleges
             </span>
           </div>
           
           <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black leading-snug text-white">
             All-Inclusive School Digital Operating System
           </h2>
           
           <div className="flex items-end gap-2.5 pt-0.5">
              <span className="text-slate-500 font-bold text-xs sm:text-sm line-through decoration-slate-600 decoration-2 mb-0.5">
                ₹39,999/yr
              </span>
              <span className="text-amber-400 font-black text-3xl sm:text-4xl tracking-tight leading-none">
                ₹24,999
              </span>
              <span className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">
                / year (Annual School License)
              </span>
           </div>
           
           <p className="text-slate-400 text-[11px] sm:text-xs font-medium tracking-wide border-b border-slate-800 pb-2">
              Flat yearly institutional license · All 38 modules &amp; mobile apps included · Zero per-student headache
           </p>
           
           {/* 2-Column Compact Features Grid */}
           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-slate-300 font-medium text-[11px] sm:text-xs pt-1">
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> School Admin &amp; Principal ERP Portal (HR, Admissions &amp; Academics)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> Teacher Panel with AI Exam Generator &amp; Smart Attendance
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> Accountant Portal with Razorpay Payment Gateway &amp; Auto-Receipts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> Student &amp; Parent App (Android APK &amp; Responsive Web)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> Driver GPS Fleet App (Live bus tracking for parents)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> Super Admin SaaS Panel for Multi-Campus School Groups
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> Zero Biometric Cost (Smart Camera &amp; QR code attendance)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> 1-Click Roster Import, Complete Onboarding &amp; 24/7 Support
              </li>
              <li className="flex items-center gap-2 sm:col-span-2">
                <span className="text-amber-400 font-bold text-xs shrink-0">✓</span> 99.9% Uptime Cloud SLA, Daily Backups &amp; SSL Security
              </li>
           </ul>
           
           <button 
             onClick={() => openModal('purchase', { plan: 'School Subscription Onboarding' })}
             className="w-full mt-2 px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-[13px] uppercase tracking-wider rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
           >
             <Sparkles className="w-3.5 h-3.5 text-slate-950" />
             <span>Book Free School Demo &amp; Consultation →</span>
           </button>
         </div>
         
         {/* Right: Contact Support Box */}
         <div className="relative z-10 flex flex-col justify-center mt-2 lg:mt-0">
           <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-2.5 shadow-lg">
              <h3 className="text-slate-200 font-bold text-[11px] uppercase tracking-wider">
                Need a customized plan for your school?
              </h3>
              
              <a 
                href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20want%20to%20book%20a%20live%20demo%20for%20my%20school%20ERP" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-2.5 rounded-lg transition-all group"
              >
                <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform text-xs flex-shrink-0">
                   📱
                </div>
                <div className="min-w-0">
                   <span className="text-slate-200 font-bold text-[11px] block group-hover:text-emerald-400 transition-colors">WhatsApp Consultation</span>
                   <span className="text-[9.5px] text-slate-400 block truncate">Direct instant chat with our specialist</span>
                </div>
              </a>
              
              <a 
                href="mailto:contact@allcoresolution.com" 
                className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-2.5 rounded-lg transition-all group"
              >
                <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform text-xs flex-shrink-0">
                   ✉️
                </div>
                <div className="min-w-0">
                   <span className="text-slate-200 font-bold text-[11px] block group-hover:text-amber-400 transition-colors">Email Proposals</span>
                   <span className="text-[9.5px] text-slate-400 block truncate">contact@allcoresolution.com</span>
                </div>
              </a>
              
              <button 
                onClick={() => openModal('portals')}
                className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-2.5 rounded-lg transition-all group cursor-pointer text-left w-full"
              >
                <div className="w-7 h-7 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform text-xs flex-shrink-0">
                   💻
                </div>
                <div className="min-w-0">
                   <span className="text-slate-200 font-bold text-[11px] block group-hover:text-indigo-400 transition-colors">Launch Live Demo Hub ⚡</span>
                   <span className="text-[9.5px] text-slate-400 block truncate">Test all 7 live portals in real time</span>
                </div>
              </button>
              
              <div className="text-[8.5px] font-bold tracking-widest uppercase text-slate-500 pt-1.5 border-t border-slate-800 flex justify-between items-center">
                <span>REF: ACS-ERP-2026</span>
                <span className="text-emerald-400">● 100% Cloud Verified</span>
              </div>
           </div>
         </div>
         
      </div>
      
    </section>
  );
}
