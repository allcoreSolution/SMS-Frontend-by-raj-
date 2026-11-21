import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { ChevronDown, Sparkles, MessageCircle, HelpCircle, ShieldCheck, Zap } from 'lucide-react';

export default function FAQ() {
  const { openModal } = useModal();

  const faqs = [
    {
      q: "How does school onboarding and data migration work?",
      a: "Our dedicated onboarding engineers handle 100% of the migration for you. We configure your institutional domain, setup academic classes, sections, and fee structures, and bulk-import your entire student, teacher, and parent roster directly from Excel/CSV. Your institution can go fully live in under 24 hours.",
      icon: "🚀"
    },
    {
      q: "Do we need to buy servers or maintain an IT team?",
      a: "No physical servers or expensive IT personnel are required. ALL CORE SOLUTION MultiSchool ERP runs entirely on enterprise-grade, high-availability cloud infrastructure. Principals, teachers, accountants, and parents simply log in via web browser or native Android mobile apps.",
      icon: "☁️"
    },
    {
      q: "Can we manage multiple school branches or colleges?",
      a: "Yes! Our centralized SuperAdmin SaaS architecture allows educational trusts, societies, and multi-branch school groups to manage unlimited campuses from one dashboard, switch between branches with 1-click, and analyze consolidated fee collections and academic reports.",
      icon: "🏢"
    },
    {
      q: "What training and ongoing support do you provide?",
      a: "We provide complete live video training for your principal, teachers, and accounting staff, detailed Hindi & English step-by-step user guides, and dedicated priority support via WhatsApp, phone, and email with 99.9% resolution SLA.",
      icon: "🎓",
      highlight: true
    },
    {
      q: "How secure is our student and financial data?",
      a: "Your institutional data is strictly tenant-isolated with 256-bit SSL encryption, automated daily encrypted backups, and granular Role-Based Access Control (RBAC). We never share, monetize, or expose your student, staff, or financial records.",
      icon: "🔒"
    },
    {
      q: "Can parents pay school fees online through the app?",
      a: "Yes. Parents can view overdue fee breakdowns, pay instantly using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking, and instantly download auto-generated, tax-compliant digital fee receipts on their smartphones.",
      icon: "💳"
    },
    {
      q: "Does bus live GPS tracking require special devices?",
      a: "No expensive hardware needed! School bus drivers can simply run our dedicated Driver Android APK on any budget Android smartphone to livestream real-time GPS coordinates directly to parents, or you can seamlessly link vehicle OBD GPS trackers via our cloud API.",
      icon: "🚌"
    }
  ];

  const [openIdx, setOpenIdx] = useState(0); // Default first question open

  return (
    <section id="faq" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header Block */}
      <div className="text-center mb-10 sm:mb-14 flex flex-col items-center max-w-3xl mx-auto px-2">
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 font-black uppercase tracking-widest text-[10px] sm:text-xs px-3.5 py-1 mb-3 rounded-full shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Frequently Asked Questions</span>
        </span>
        
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-3">
          Everything You <span className="text-amber-500">Need to Know.</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
          Got questions about implementing ALL CORE SOLUTION ERP for your school or college? Find clear answers below or connect directly with our engineering team.
        </p>
      </div>

      {/* Modern Accordion Cards List */}
      <div className="space-y-3.5 sm:space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div 
              key={i} 
              className={`rounded-2xl transition-all duration-300 border ${
                isOpen 
                  ? 'bg-amber-50/20 border-amber-400 shadow-md ring-1 ring-amber-400/30' 
                  : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <button 
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none group cursor-pointer gap-3"
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 transition-colors ${
                    isOpen ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700 group-hover:bg-amber-50'
                  }`}>
                    {faq.icon}
                  </div>
                  
                  <span className={`text-sm sm:text-base lg:text-[17px] font-black leading-snug transition-colors ${
                    isOpen ? 'text-amber-950' : 'text-slate-900 group-hover:text-amber-600'
                  }`}>
                    {faq.q}
                  </span>
                </div>

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen 
                    ? 'bg-amber-500 text-slate-950 rotate-180 shadow-xs' 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-800'
                }`}>
                  <ChevronDown className="w-4 h-4 font-bold" />
                </div>
              </button>
              
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                  <div className="pt-3 border-t border-slate-200/70 text-slate-600 font-medium text-xs sm:text-sm lg:text-[15px] leading-relaxed pl-12 sm:pl-14">
                    {faq.a}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Help Banner */}
      <div className="mt-10 sm:mt-14 bg-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl shrink-0 font-black shadow-md">
            💬
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white">Have more questions about migration or features?</h4>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Talk directly with our school onboarding experts on WhatsApp or phone.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20have%20questions%20about%20MultiSchool%20ERP"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md whitespace-nowrap cursor-pointer"
          >
            <span>WhatsApp Us</span>
            <span>📱</span>
          </a>
          
          <button
            onClick={() => openModal('purchase', { plan: 'Book Free School Demo & Consultation' })}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md whitespace-nowrap cursor-pointer"
          >
            <span>Book Free Demo</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </section>
  );
}
