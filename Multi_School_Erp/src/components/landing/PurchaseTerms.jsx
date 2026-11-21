import React from 'react';
import { useModal } from '../../context/ModalContext';

export default function PurchaseTerms() {
  const { openModal } = useModal();

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto bg-slate-50/60 border-t border-slate-200">
      
      {/* Clean Header Box */}
      <div className="relative z-10 text-center mb-8 sm:mb-10 flex flex-col items-center max-w-3xl mx-auto py-2 sm:p-3">
        <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[9.5px] sm:text-[11px] px-3.5 py-1 mb-3 rounded-full border border-emerald-200 shadow-xs">
          SMOOTH 3-STEP ONBOARDING
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-[1.15] tracking-tight mb-2">
          How Your School Goes Live in 24 Hours
        </h2>
        <p className="text-slate-600 font-medium text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          Zero IT headaches. We set up your school domain, import your student rosters from Excel, train your teachers, and provide 24/7 priority support.
        </p>
      </div>

      {/* 3 Steps Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-5 sm:mb-6">
        
        {/* Step 1 */}
        <div 
          onClick={() => openModal('purchase')}
          className="bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-left"
        >
           <div>
             <div className="text-[#09B48E] font-black uppercase text-[10px] tracking-widest mb-2 bg-emerald-50 w-max px-2 py-0.5 rounded-full border border-emerald-200">STEP 1</div>
             <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2 group-hover:text-amber-600 transition-colors">
               Book Free Live Demo ↗
             </h3>
           </div>
           <p className="text-slate-500 font-medium text-xs leading-relaxed">
             Schedule an interactive demo for your school management, principal, or IT committee with real student data preview.
           </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between rounded-2xl shadow-xs hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left">
           <div>
             <div className="text-[#09B48E] font-black uppercase text-[10px] tracking-widest mb-2 bg-emerald-50 w-max px-2 py-0.5 rounded-full border border-emerald-200">STEP 2</div>
             <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
               Roster Import &amp; Custom Branding
             </h3>
           </div>
           <p className="text-slate-500 font-medium text-xs leading-relaxed">
             Share your student and teacher lists in Excel. Our team imports all data, configures fee heads, class timetables, and school logo.
           </p>
        </div>

        {/* Step 3 */}
        <a 
          href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20want%20to%20onboard%20my%20school%20on%20Multi-School%20ERP"
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between rounded-2xl shadow-xs hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-left"
        >
           <div>
             <div className="text-[#09B48E] font-black uppercase text-[10px] tracking-widest mb-2 bg-emerald-50 w-max px-2 py-0.5 rounded-full border border-emerald-200">STEP 3</div>
             <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2 group-hover:text-emerald-600 transition-colors">
               Staff Training &amp; Full Go-Live ↗
             </h3>
           </div>
           <p className="text-slate-500 font-medium text-xs leading-relaxed">
             Live training for teachers &amp; accountants, mobile app distribution for parents &amp; drivers, and ongoing priority support.
           </p>
        </a>

      </div>

      {/* 4 Docs Row (Clickable modals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <button 
          onClick={() => openModal('doc', { docTab: 'spec' })}
          className="bg-white border border-slate-200/90 p-4 sm:p-5 flex flex-col items-start rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all group text-left cursor-pointer w-full"
        >
           <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 transition-transform">📄</div>
           <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug group-hover:text-amber-600">
             Module Catalog <br className="hidden sm:block"/>&amp; Feature Spec
           </h4>
           <p className="text-slate-500 text-xs font-medium leading-relaxed">
             38 modules, roles, security layers &amp; portal capabilities
           </p>
        </button>

        <button 
          onClick={() => openModal('doc', { docTab: 'license' })}
          className="bg-white border border-slate-200/90 p-4 sm:p-5 flex flex-col items-start rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all group text-left cursor-pointer w-full"
        >
           <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 transition-transform">📜</div>
           <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-600">
             Service Level Agreement
           </h4>
           <p className="text-slate-500 text-xs font-medium leading-relaxed">
             99.9% cloud uptime, backups &amp; uptime guarantee
           </p>
        </button>

        <button 
          onClick={() => openModal('doc', { docTab: 'refund' })}
          className="bg-white border border-slate-200/90 p-4 sm:p-5 flex flex-col items-start rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all group text-left cursor-pointer w-full"
        >
           <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 transition-transform">↩️</div>
           <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-600">
             Zero-Risk Trial Policy
           </h4>
           <p className="text-slate-500 text-xs font-medium leading-relaxed">
             Test all live portals with your staff before signing up
           </p>
        </button>

        <button 
          onClick={() => openModal('doc', { docTab: 'privacy' })}
          className="bg-white border border-slate-200/90 p-4 sm:p-5 flex flex-col items-start rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all group text-left cursor-pointer w-full"
        >
           <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-lg mb-2.5 group-hover:scale-110 transition-transform">🔒</div>
           <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-600">
             Student Privacy Policy
           </h4>
           <p className="text-slate-500 text-xs font-medium leading-relaxed">
             100% strict institutional data isolation &amp; security
           </p>
        </button>

      </div>

    </section>
  );
}
