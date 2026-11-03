import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { ExternalLink, Phone, Mail, Shield, Sparkles, Download } from 'lucide-react';

export default function FooterLanding() {
  const { openModal } = useModal();

  return (
    <footer className="w-full bg-slate-950 text-white relative overflow-hidden flex flex-col items-center border-t border-gray-800">
      
      {/* Background massive typography stamp */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
         ALLCORE SOLUTION
      </div>
      
      {/* Absolute Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none transform translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#09B48E]/10 blur-[150px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Top CTA Block */}
      <div className="max-w-4xl mx-auto px-4 text-center z-10 w-full pt-28 pb-20">
         <span className="inline-flex items-center gap-2 bg-transparent text-emerald-400 font-bold uppercase tracking-widest text-[10px] px-4 py-1.5 border border-emerald-500/40 mb-6 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
            Ready to Launch
         </span>
         
         <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tighter mb-6 text-white leading-tight">
           Your EdTech empire <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">starts here.</span>
         </h2>
         <p className="text-gray-400 font-medium text-base sm:text-lg mb-10 max-w-xl mx-auto">
           Complete 100% unencrypted source code. 38 robust modules. 3 native mobile apps. Deploy on unlimited domains today.
         </p>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button 
              onClick={() => openModal('purchase')}
              className="relative group w-full sm:w-auto liquid-btn cursor-pointer focus:outline-none" 
              style={{ '--liquid-bg': '#0f172a', '--liquid-text': '#ffffff' }}
            >
              <div className="absolute inset-0 bg-white translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative bg-amber-500 border-[2px] border-white px-8 sm:px-10 py-3.5 sm:py-4 flex items-center justify-center transition-transform hover:-translate-y-0.5">
                 <span className="text-gray-900 font-black text-sm uppercase tracking-widest z-10 relative flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-gray-900" />
                   <span>Buy Now — ₹10,000</span>
                 </span>
              </div>
            </button>
            
            <a 
              href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20want%20to%20inquire%20about%20Multi-School%20ERP%20Source%20Code" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto relative group"
            >
               <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="relative bg-slate-900 border border-gray-700 hover:border-emerald-500 text-gray-200 px-7 py-3.5 sm:py-4 font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2.5">
                  <span className="text-emerald-400 text-lg">📱</span> WhatsApp Support
               </div>
            </a>

            <button 
              onClick={() => openModal('portals')}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 px-6 py-3.5 sm:py-4 font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Test All Portals</span>
              <span>⚡</span>
            </button>
         </div>
      </div>

      {/* Footer Navigation & Trademark */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 z-10 border-t border-gray-800 pt-12 pb-8">
         <div className="grid grid-cols-1 md:grid-cols-[1.2fr_auto_auto_auto] gap-8 lg:gap-14 mb-14">
            
            {/* Branding Column */}
            <div className="flex flex-col items-start gap-3">
               <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
                 <span className="text-white">MultiSchool</span> 
                 <span className="text-amber-500">ERP</span>
               </div>
               <p className="text-gray-400 font-medium text-xs leading-relaxed max-w-sm">
                 The definitive open-source multi-tenant architecture for modern educational institutions, engineered by <strong>ALL CORE SOLUTION</strong> for IT agencies & founders worldwide.
               </p>
               <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-full px-3.5 py-1.5 w-fit mt-1">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                 <span className="text-[11px] font-bold text-gray-300">V3.6.0 Live Local Ports Ready</span>
               </div>
            </div>

            {/* Live Dedicated Panels Links */}
            <div className="flex flex-col gap-2.5">
               <h4 className="text-amber-400 font-black uppercase tracking-widest text-xs mb-1">Live Dedicated Panels</h4>
               <a href={PORTAL_URLS.teacher} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-amber-400 transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>Teacher & Staff Panel (:5177)</span>
                 <ExternalLink className="w-3 h-3 text-amber-400" />
               </a>
               <a href={PORTAL_URLS.accountant} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-emerald-400 transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>Accountant & Fee Panel (:5178)</span>
                 <ExternalLink className="w-3 h-3 text-emerald-400" />
               </a>
               <a href={PORTAL_URLS.admin} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>School Admin ERP (:5176)</span>
                 <ExternalLink className="w-3 h-3 text-amber-400" />
               </a>
               <a href={PORTAL_URLS.student} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>Student & Parent Portal (:5175)</span>
                 <ExternalLink className="w-3 h-3 text-amber-400" />
               </a>
               <a href="/apk/Teacher.apk" download="Teacher.apk" className="text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>Download Teacher APK (Android)</span>
                 <Download className="w-3 h-3 text-emerald-400" />
               </a>
               <a href="/apk/Student_Parents.apk" download="Student_Parents.apk" className="text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>Download Student & Parent APK (Android)</span>
                 <Download className="w-3 h-3 text-emerald-400" />
               </a>
               <a href="/apk/Driver.apk" download="Driver.apk" className="text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>Download Driver APK (Android)</span>
                 <Download className="w-3 h-3 text-emerald-400" />
               </a>
               <a href={PORTAL_URLS.superAdmin} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>SuperAdmin SaaS (:5179)</span>
                 <ExternalLink className="w-3 h-3 text-blue-400" />
               </a>
               <a href={PORTAL_URLS.branch} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5">
                 <span>Branch Admin Network (:5174)</span>
                 <ExternalLink className="w-3 h-3 text-purple-400" />
               </a>
            </div>

            {/* Product Links */}
            <div className="flex flex-col gap-2.5">
               <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">Product</h4>
               <Link to="/" className="text-gray-400 hover:text-white transition-colors text-xs font-semibold">Overview</Link>
               <Link to="/modules" className="text-gray-400 hover:text-white transition-colors text-xs font-semibold">Module Catalog (38)</Link>
               <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-xs font-semibold">Pricing & Licensing</Link>
               <button onClick={() => openModal('portals')} className="text-left text-gray-400 hover:text-amber-400 transition-colors text-xs font-semibold flex items-center gap-1">
                 <span>All Demos Hub</span>
                 <span className="text-[10px]">⚡</span>
               </button>
            </div>

            {/* Legal & Support Links */}
            <div className="flex flex-col gap-2.5">
               <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">Legal & Support</h4>
               <a href="mailto:contact@allcoresolution.com" className="text-gray-400 hover:text-white transition-colors text-xs font-semibold">contact@allcoresolution.com</a>
               <button onClick={() => openModal('doc', { docTab: 'privacy' })} className="text-left text-gray-400 hover:text-white transition-colors text-xs font-semibold">Privacy Policy</button>
               <button onClick={() => openModal('doc', { docTab: 'license' })} className="text-left text-gray-400 hover:text-white transition-colors text-xs font-semibold">Terms & Commercial License</button>
               <button onClick={() => openModal('doc', { docTab: 'refund' })} className="text-left text-gray-400 hover:text-white transition-colors text-xs font-semibold">Refund Policy</button>
               <button onClick={() => openModal('doc', { docTab: 'spec' })} className="text-left text-gray-400 hover:text-white transition-colors text-xs font-semibold">Quotation & Spec Sheet</button>
            </div>
         </div>
         
         <div className="w-full pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
            <div className="text-gray-400 font-bold text-xs flex items-center gap-2">
               <span className="text-amber-400">Developed by RAJ YADAV @ALLCORE SOLUTION.</span>
               <span className="text-gray-600">All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500 font-medium text-xs">
               <span>React 18 • Node.js • Flutter • MongoDB</span>
               <span>•</span>
               <span className="text-emerald-400">REST API :5050 Online</span>
            </div>
         </div>
      </div>

    </footer>
  );
}
