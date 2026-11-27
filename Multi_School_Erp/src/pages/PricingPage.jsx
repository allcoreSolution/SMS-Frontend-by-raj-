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
      
      <main className="mt-[72px] sm:mt-[80px] bg-[#111827]">
        {/* Header Section */}
        <section className="py-8 lg:py-10 px-4 w-full border-b-[2px] border-gray-900 bg-gray-950 relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-pattern opacity-20" />
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
           
           <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center gap-2 bg-transparent text-cyan-400 font-bold uppercase tracking-widest text-[9px] px-2 py-1 border border-cyan-500/40 mb-3 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                 Transparent School Subscriptions
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-3 text-white leading-[1.1]">
                 Digitalize your entire school.<br /> 
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Zero hardware costs. Complete cloud peace.</span>
              </h1>
              
              <div className="h-0.5 w-12 bg-gray-800 mb-3" />
              
              <p className="text-gray-400 font-medium text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mt-2">
                 Get the full 38-module Multi-School ERP, Android mobile apps for parents/staff/drivers, and high-speed Node.js cloud backend. Complete onboarding and dedicated institutional support.
              </p>
           </div>
        </section>

        {/* Pricing Tiers Grid */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Top Banner */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 font-black text-xs uppercase tracking-wider rounded-full mb-3 animate-pulse">
              🎉 100% Free 30-Day Trial • First Month Free For All Schools • Zero Upfront Cost
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Start Free for 30 Days — Upgrade Anytime
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
              Get full enterprise access for the first 30 days completely free. When your trial ends, simply choose a plan below to keep uninterrupted operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            
            {/* 1. Starter Annual */}
            <div className="bg-[#1F2937] border-2 border-gray-700 rounded-2xl flex flex-col justify-between overflow-hidden shadow-lg hover:border-gray-500 transition-all">
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-bold text-[11px] uppercase tracking-wider rounded-md border border-slate-700">
                    Starter Campus
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">Starter Annual</h3>
                  <p className="text-xs text-slate-400 mt-1">For single-campus schools starting digital transformation</p>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 leading-none">₹0 FREE</span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">/ 1st month 100% free trial</span>
                </div>

                <div className="text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg mb-6">
                  ✓ 1 Month Free Trial • Up to 500 Students
                </div>

                <ul className="space-y-2.5 text-xs text-slate-200 font-semibold mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span> School Admin &amp; Principal ERP Portal
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span> Student Admissions &amp; Full Directory
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span> Fees Management &amp; Due Slips
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span> Smart QR Code &amp; Camera Attendance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span> Offline Exam Marksheets &amp; Report Cards
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span> 5 GB Secure Cloud Storage &amp; Backups
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span> Free Roster Import &amp; Email Support
                  </li>
                </ul>

                <button 
                  onClick={() => openModal('purchase', { plan: 'Starter Campus — 1st Month Free Trial (₹0)' })}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                >
                  Start Free Trial →
                </button>
              </div>
            </div>

            {/* 2. Pro School Annual (Featured / Most Popular) */}
            <div className="bg-[#1e293b] border-2 border-amber-400 rounded-2xl flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.2)] relative -translate-y-1 sm:-translate-y-2 transition-all">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 py-1.5 px-4 text-center text-slate-950 font-black text-[11px] uppercase tracking-widest">
                ⭐ Most Popular • Complete Institutional Suite
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 font-bold text-[11px] uppercase tracking-wider rounded-md border border-amber-400/30">
                    K-12 Full Suite
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-2">Pro School Annual</h3>
                  <p className="text-xs text-slate-300 mt-1">Complete digital ERP with all Android apps &amp; online fees</p>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-slate-400 line-through text-sm font-bold">₹49,999</span>
                  <span className="text-3xl sm:text-4xl font-black text-amber-400 leading-none">₹0</span>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">/ 1st month free</span>
                </div>

                <div className="text-xs text-amber-300 font-bold bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg mb-6">
                  ✓ 1 Month Free Trial • Up to 1,500 Students
                </div>

                <ul className="space-y-2.5 text-xs text-slate-100 font-semibold mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> <b>All 38 ERP Modules</b> + All 7 Live Portals
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> <b>Android Mobile Apps</b> for Parents &amp; Teachers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> <b>Driver Fleet GPS App</b> with live bus tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> <b>Razorpay Online Payment Gateway</b> &amp; Auto-Receipts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> AI Exam Paper Generator &amp; Question Bank
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> Automated SMS &amp; WhatsApp Fee Due Alerts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> Biometric &amp; RFID Machine Cloud Sync
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span> 25 GB High-Speed Cloud Storage + Daily Backups
                  </li>
                </ul>

                <button 
                  onClick={() => openModal('purchase', { plan: 'Pro School — 1st Month Free Trial (₹0)' })}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
                >
                  Start Pro Free Trial →
                </button>
              </div>
            </div>

            {/* 3. Enterprise Multi-Campus */}
            <div className="bg-[#1F2937] border-2 border-gray-700 rounded-2xl flex flex-col justify-between overflow-hidden shadow-lg hover:border-gray-500 transition-all">
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 font-bold text-[11px] uppercase tracking-wider rounded-md border border-cyan-800">
                    Group of Institutions
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">Enterprise Multi-Campus</h3>
                  <p className="text-xs text-slate-400 mt-1">For multi-branch school groups, colleges &amp; trusts</p>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-slate-500 line-through text-sm font-bold">₹89,999</span>
                  <span className="text-3xl sm:text-4xl font-black text-cyan-400 leading-none">₹0</span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">/ 1st month free</span>
                </div>

                <div className="text-xs text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg mb-6">
                  ✓ 1 Month Free Trial • Multi-Campus &amp; Custom Domain
                </div>

                <ul className="space-y-2.5 text-xs text-slate-200 font-semibold mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span> <b>Unlimited Students &amp; Multi-Campus Branches</b>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span> <b>SuperAdmin Master Oversight Panel</b>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span> <b>Custom School Domain &amp; White-Label Branding</b>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span> Dedicated High-Performance Server with 99.9% SLA
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span> Custom Marksheet &amp; Report Card Template Builder
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span> Dedicated Institutional Account Manager
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span> On-Site or Remote Faculty Training Included
                  </li>
                </ul>

                <button 
                  onClick={() => openModal('purchase', { plan: 'Enterprise Multi-Campus — 1st Month Free Trial (₹0)' })}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Start Enterprise Free Trial →
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Trust & Contact Bar */}
          <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-white font-black text-base sm:text-lg">Need a custom quote for your trust or chain of schools?</h4>
              <p className="text-xs text-slate-400">Talk directly with our institutional software architect &amp; get a tailor-made proposal.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a 
                href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20want%20to%20inquire%20about%20Yearly%20School%20ERP%20Plans" 
                target="_blank" 
                rel="noreferrer" 
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2"
              >
                <span>📱 WhatsApp Support</span>
              </a>
              <button 
                onClick={() => openModal('portals')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <span>⚡ Test Live Demo Hub</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      <FooterLanding />
    </div>
  );
}
