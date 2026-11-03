import React from 'react';
import Navbar from '../components/Navbar';
import FooterLanding from '../components/landing/FooterLanding';
import { useModal } from '../context/ModalContext';
import { ExternalLink, Check, Sparkles, Phone, Mail } from 'lucide-react';

export default function PricingPage() {
  const { openModal } = useModal();

  return (
    <div className="min-h-screen bg-[#fdfdfd] overflow-hidden">
      <Navbar />
      
      <main className="mt-[68px] sm:mt-[80px] bg-[#111827]">
        {/* Header Section */}
        <section className="py-8 lg:py-10 px-4 w-full border-b-[2px] border-gray-900 bg-gray-950 relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-pattern opacity-20" />
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
           
           <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center gap-2 bg-transparent text-cyan-400 font-bold uppercase tracking-widest text-[9px] px-2 py-1 border border-cyan-500/40 mb-3 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                 Transparent One-Time Pricing
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-3 text-white leading-[1.1]">
                 Own the source code.<br /> 
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">No monthly SaaS taxes.</span>
              </h1>
              
              <div className="h-0.5 w-12 bg-gray-800 mb-3" />
              
              <p className="text-gray-400 font-medium text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mt-2">
                 Get the entire 38-module Multi-School ERP, Android/iOS Flutter apps, and Node.js backend. Pay once. Host anywhere. Scale limitlessly.
              </p>
           </div>
        </section>

        {/* Pricing Tier */}
        <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto">
          <div className="bg-[#1F2937] border-2 border-gray-700 shadow-[8px_8px_0_0_#F59E0B]">
             <div className="bg-amber-400 px-6 py-3 flex justify-between border-b-2 border-gray-700">
               <span className="font-black text-gray-900 tracking-widest uppercase text-xs sm:text-sm">Full Commercial License</span>
               <span className="font-black text-gray-900 animate-pulse text-xs sm:text-sm">Save ₹5,000 Today</span>
             </div>
             
             <div className="p-6 sm:p-12 text-white flex flex-col md:flex-row gap-8 sm:gap-12">
                <div className="flex-1 flex flex-col">
                   <div className="flex items-end gap-3 mb-2">
                     <span className="text-gray-500 font-bold text-2xl line-through decoration-2">₹15,000</span>
                     <span className="text-white font-black text-5xl sm:text-6xl tracking-tight leading-none">₹10,000</span>
                   </div>
                   <div className="text-gray-400 font-medium text-sm border-b border-gray-700 pb-6 mb-6">
                     One-time payment. Instant Download & GitHub Access.
                   </div>
                   
                   <ul className="space-y-3.5 text-gray-200 font-bold text-[14px] sm:text-[15px] mb-8">
                     <li className="flex items-center gap-3">
                       <span className="text-[#09B48E] text-xl">✓</span> Unencrypted Source Code Included (Zero Obfuscation)
                     </li>
                     <li className="flex items-center gap-3">
                       <span className="text-[#09B48E] text-xl">✓</span> All 3 Flutter Apps (Parent, Staff, Driver)
                     </li>
                     <li className="flex items-center gap-3">
                       <span className="text-[#09B48E] text-xl">✓</span> React JS Super Admin + Tenant Panels
                     </li>
                     <li className="flex items-center gap-3">
                       <span className="text-[#09B48E] text-xl">✓</span> Biometric Cloud Sync (.EXE included)
                     </li>
                     <li className="flex items-center gap-3">
                       <span className="text-[#09B48E] text-xl">✓</span> 1 Year Technical Support & Free Updates
                     </li>
                     <li className="flex items-center gap-3">
                       <span className="text-[#09B48E] text-xl">✓</span> Unlimited School Onboarding & 0% Royalties
                     </li>
                   </ul>
                   
                   <button 
                     onClick={() => openModal('purchase', { plan: '₹10,000 — Full Commercial Source Code' })}
                     className="relative group w-full liquid-btn cursor-pointer focus:outline-none" 
                     style={{ '--liquid-bg': '#0f172a', '--liquid-text': '#ffffff' }}
                   >
                     <div className="absolute inset-0 bg-white translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                     <div className="relative bg-amber-500 border-[2px] border-white py-4 sm:py-5 flex items-center justify-center transition-transform hover:-translate-y-0.5">
                       <span className="text-gray-900 font-black uppercase tracking-widest text-base sm:text-lg z-10 relative flex items-center gap-2">
                         <Sparkles className="w-5 h-5 text-gray-900" />
                         <span>Purchase Now — ₹10,000</span>
                       </span>
                     </div>
                   </button>
                </div>
                
                <div className="w-full md:w-1/3 bg-[#111827] border-[1.5px] border-gray-700 p-6 flex flex-col justify-between">
                   <div>
                     <h4 className="font-black text-gray-100 uppercase tracking-widest text-xs mb-3">Accepted Payments</h4>
                     <div className="flex flex-wrap gap-2 mb-6">
                        <div className="bg-gray-800 border border-gray-700 px-3 py-1 text-xs font-bold text-gray-300">UPI / QR</div>
                        <div className="bg-gray-800 border border-gray-700 px-3 py-1 text-xs font-bold text-gray-300">Credit Card</div>
                        <div className="bg-gray-800 border border-gray-700 px-3 py-1 text-xs font-bold text-gray-300">NetBanking</div>
                        <div className="bg-gray-800 border border-gray-700 px-3 py-1 text-xs font-bold text-gray-300">Bank Wire</div>
                     </div>

                     <h4 className="font-black text-gray-100 uppercase tracking-widest text-xs mb-3">Live Testing</h4>
                     <button
                       onClick={() => openModal('portals')}
                       className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-amber-400 font-black text-xs uppercase tracking-wider border border-gray-600 mb-6 flex items-center justify-center gap-1.5 cursor-pointer"
                     >
                       <span>Test Live Portals Hub</span>
                       <span>⚡</span>
                     </button>
                   </div>
                   
                   <div>
                     <h4 className="font-black text-gray-100 uppercase tracking-widest text-xs mb-3">Direct Support</h4>
                     <a 
                       href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20want%20to%20purchase%20Multi-School%20ERP%20Source%20Code" 
                       target="_blank" 
                       rel="noreferrer" 
                       className="flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-green-400 transition-colors mb-3"
                     >
                       <span className="text-lg">📱</span> WhatsApp Support
                     </a>
                     <a 
                       href="mailto:contact@allcoresolution.com" 
                       className="flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-blue-400 transition-colors"
                     >
                       <span className="text-lg">✉️</span> contact@allcoresolution.com
                     </a>
                   </div>
                </div>
             </div>
          </div>
        </section>

      </main>

      <FooterLanding />
    </div>
  );
}
