import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { ExternalLink, Phone, Mail, Shield, Sparkles, Download, Smartphone, Globe, Layers, FileText } from 'lucide-react';

export default function FooterLanding() {
  const { openModal } = useModal();

  return (
    <footer className="w-full bg-slate-950 text-white relative overflow-hidden flex flex-col items-center border-t border-slate-800/80">
      
      {/* Background massive typography stamp */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none tracking-tighter">
         ALLCORE SOLUTION
      </div>
      
      {/* Absolute Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none transform translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#09B48E]/10 blur-[140px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Top CTA Block */}
      <div className="max-w-4xl mx-auto px-4 text-center z-10 w-full pt-16 sm:pt-20 pb-14">
         <span className="inline-flex items-center gap-2 bg-slate-900/80 text-emerald-400 font-bold uppercase tracking-widest text-[10px] px-3.5 py-1.5 border border-emerald-500/40 mb-5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
            Ready to Launch
         </span>
         
         <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight mb-4 text-white leading-tight">
           Your EdTech empire <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">starts here.</span>
         </h2>
         <p className="text-slate-400 font-medium text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
           Complete 100% unencrypted source code. 38 robust modules. 3 native mobile apps. Deploy on unlimited domains today.
         </p>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <button 
              onClick={() => openModal('purchase')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
               <Sparkles className="w-4 h-4 text-slate-950" />
               <span>Buy Now — ₹10,000</span>
            </button>
            
            <a 
              href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20want%20to%20inquire%20about%20Multi-School%20ERP%20Source%20Code" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
               <span className="text-emerald-400 text-base">📱</span> WhatsApp Support
            </a>

            <button 
              onClick={() => openModal('portals')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-amber-400 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
               <span>Test Portals</span>
               <span>⚡</span>
            </button>
         </div>
      </div>

      {/* Footer Navigation & Trademark */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10 border-t border-slate-800/80 pt-12 pb-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-6 mb-12">
            
            {/* Column 1: Branding & Mission (4 Columns) */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-start gap-3">
               <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
                 <span className="text-white">MultiSchool</span> 
                 <span className="text-amber-500">ERP</span>
               </div>
               <p className="text-slate-400 font-medium text-xs leading-relaxed max-w-sm">
                 The definitive open-source multi-tenant architecture for modern educational institutions, engineered by <strong className="text-slate-200">ALL CORE SOLUTION</strong> for IT agencies & founders worldwide.
               </p>
               
               <div className="flex flex-wrap items-center gap-2 mt-1">
                 <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-[11px] font-bold text-slate-300">V3.6.0 Multi-School Ready</span>
                 </div>
               </div>

               <a 
                 href="mailto:contact@allcoresolution.com" 
                 className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors mt-2"
               >
                 <Mail className="w-3.5 h-3.5 text-amber-500" />
                 <span>contact@allcoresolution.com</span>
               </a>
            </div>

            {/* Column 2: Live Dedicated Web Portals (2 Columns) */}
            <div className="lg:col-span-2 flex flex-col gap-2.5">
               <h4 className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-1.5">
                 <Globe className="w-3.5 h-3.5 text-amber-400" />
                 <span>Web Portals</span>
               </h4>
               <a href={PORTAL_URLS.admin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>School Admin</span>
                 <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
               </a>
               <a href={PORTAL_URLS.superAdmin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>SuperAdmin SaaS</span>
                 <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
               </a>
               <a href={PORTAL_URLS.teacher} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>Teacher & Staff</span>
                 <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
               </a>
               <a href={PORTAL_URLS.accountant} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>Accountant & Fee</span>
                 <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
               </a>
               <a href={PORTAL_URLS.student} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>Student & Parent</span>
                 <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
               </a>
               <a href={PORTAL_URLS.branch} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>Branch Admin</span>
                 <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
               </a>
            </div>

            {/* Column 3: Mobile Apps & APK Downloads (2 Columns) */}
            <div className="lg:col-span-2 flex flex-col gap-2.5">
               <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-1.5">
                 <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                 <span>Mobile Apps</span>
               </h4>
               <a href="/apk/Teacher.apk" download="Teacher.apk" className="text-slate-300 hover:text-emerald-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>Teacher APK</span>
                 <Download className="w-3 h-3 text-emerald-400/70 group-hover:text-emerald-400 transition-colors" />
               </a>
               <a href="/apk/Student_Parents.apk" download="Student_Parents.apk" className="text-slate-300 hover:text-emerald-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>Student/Parent APK</span>
                 <Download className="w-3 h-3 text-emerald-400/70 group-hover:text-emerald-400 transition-colors" />
               </a>
               <a href="/apk/Driver.apk" download="Driver.apk" className="text-slate-300 hover:text-emerald-400 transition-colors text-xs font-medium flex items-center justify-between group">
                 <span>Driver GPS APK</span>
                 <Download className="w-3 h-3 text-emerald-400/70 group-hover:text-emerald-400 transition-colors" />
               </a>
               
               <div className="mt-2 p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                 <span className="text-[10px] font-bold text-emerald-400 block uppercase">Android 14+ Ready</span>
                 <span className="text-[11px] text-slate-400 block mt-0.5">Offline cache & push sync</span>
               </div>
            </div>

            {/* Column 4: Product & Modules (2 Columns) */}
            <div className="lg:col-span-2 flex flex-col gap-2.5">
               <h4 className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-1.5">
                 <Layers className="w-3.5 h-3.5 text-amber-400" />
                 <span>Product</span>
               </h4>
               <Link to="/" className="text-slate-300 hover:text-white transition-colors text-xs font-medium">Overview</Link>
               <Link to="/modules" className="text-slate-300 hover:text-white transition-colors text-xs font-medium">Module Catalog (38)</Link>
               <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors text-xs font-medium">Pricing & License</Link>
               <button onClick={() => openModal('portals')} className="text-left text-slate-300 hover:text-amber-400 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer">
                 <span>All Demos Hub</span>
                 <span className="text-[10px]">⚡</span>
               </button>
            </div>

            {/* Column 5: Legal & Support (2 Columns) */}
            <div className="lg:col-span-2 flex flex-col gap-2.5">
               <h4 className="text-slate-200 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-1.5">
                 <FileText className="w-3.5 h-3.5 text-slate-400" />
                 <span>Legal & Docs</span>
               </h4>
               <button onClick={() => openModal('doc', { docTab: 'privacy' })} className="text-left text-slate-400 hover:text-white transition-colors text-xs font-medium cursor-pointer">Privacy Policy</button>
               <button onClick={() => openModal('doc', { docTab: 'license' })} className="text-left text-slate-400 hover:text-white transition-colors text-xs font-medium cursor-pointer">Commercial License</button>
               <button onClick={() => openModal('doc', { docTab: 'refund' })} className="text-left text-slate-400 hover:text-white transition-colors text-xs font-medium cursor-pointer">Refund Policy</button>
               <button onClick={() => openModal('doc', { docTab: 'spec' })} className="text-left text-slate-400 hover:text-white transition-colors text-xs font-medium cursor-pointer">Spec Sheet</button>
            </div>
         </div>
         
         {/* Bottom Copyright & Tech Stack */}
         <div className="w-full pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
            <div className="text-slate-400 font-semibold text-xs flex flex-wrap items-center justify-center md:justify-start gap-2">
               <span className="text-amber-400 font-bold">Developed by RAJ YADAV @ALLCORE SOLUTION.</span>
               <span className="text-slate-600 hidden sm:inline">•</span>
               <span>All rights reserved.</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500 font-medium text-xs">
               <span>React 18 • Node.js • Flutter • MongoDB</span>
               <span>•</span>
               <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                 REST API Online
               </span>
            </div>
         </div>
      </div>

    </footer>
  );
}
