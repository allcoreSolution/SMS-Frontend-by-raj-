import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { ExternalLink, Bot, Sparkles } from 'lucide-react';

export default function AIFeature() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Content */}
        <div className="order-2 lg:order-1">
          <span className="inline-block bg-amber-50 text-amber-800 font-black uppercase tracking-widest text-[10px] sm:text-xs px-3.5 py-1 rounded-full border border-amber-200 mb-4 sm:mb-6 shadow-xs">
            AI-POWERED ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 leading-[1.15] tracking-tight mb-4 sm:mb-6">
            AI assistant grounded on your school's actual database.
          </h2>
          <p className="text-slate-600 font-medium text-xs sm:text-base leading-relaxed mb-6">
            Ask natural-language questions and get instant answers backed by your school's live attendance, fee records, and timetable. Features multilingual Hindi &amp; Hinglish detection with role-based security.
          </p>

          <div className="mb-6">
            <a
              href={`${PORTAL_URLS.student}/ai-assistant`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-amber-500/20"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Live AI Assistant ↗</span>
            </a>
          </div>

          <ul className="space-y-3 text-slate-800 font-bold text-xs sm:text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span>"What's today's attendance summary?" — answered in 0.8 seconds</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span>"Which students have pending fees over ₹5,000?"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span>Dynamic Language Detection: English, Hindi Devanagari, and Hinglish</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span>Zero hallucination — grounded on your active MongoDB instance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span>Role-based privacy: teachers can't query administrative ledgers</span>
            </li>
          </ul>
        </div>
        
        {/* Right Content - Modern Sleek Chat Showcase */}
        <div className="order-1 lg:order-2 relative w-full">
          <div className="w-full bg-slate-950 text-white border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[420px]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                     ✨
                  </div>
                  <div>
                     <div className="text-xs font-black text-white leading-tight flex items-center gap-1.5">
                        <span>ALL CORE SOLUTION AI Assistant</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     </div>
                     <span className="text-[10px] text-slate-400 font-medium">Grounded on Live Institution Records</span>
                  </div>
               </div>
               <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Gemini Flash 2.5
               </span>
            </div>

            {/* Chat Thread */}
            <div className="py-4 space-y-3.5 flex-1">
               {/* User bubble */}
               <div className="flex justify-end">
                  <div className="bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs max-w-[85%] shadow-sm">
                     Today's attendance summary aur bus route updates batao?
                  </div>
               </div>

               {/* AI Response bubble */}
               <div className="flex justify-start items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                     AI
                  </div>
                  <div className="bg-slate-900 border border-slate-800 text-slate-200 p-3.5 rounded-2xl rounded-tl-xs text-xs space-y-2 leading-relaxed shadow-sm max-w-[90%]">
                     <p>
                        Aapke school ka live data:
                     </p>
                     <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between text-emerald-400"><span>● Student Attendance:</span> <strong>98.4% (1,842 / 1,872)</strong></div>
                        <div className="flex justify-between text-cyan-300"><span>● Staff Attendance:</span> <strong>62 / 64 Present</strong></div>
                        <div className="flex justify-between text-amber-300"><span>● Fleet GPS:</span> <strong>14/14 Buses Running On-Time</strong></div>
                     </div>
                     <p className="text-[11px] text-slate-400">
                        Bus Route #04 (Sector 14 Stop) par agle 6 minute me arrive hogi.
                     </p>
                  </div>
               </div>
            </div>

            {/* Quick Interactive Prompt Chips */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-[10px]">
               <span className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 cursor-pointer transition-colors">
                  "Pending fee defaulters list"
               </span>
               <span className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 cursor-pointer transition-colors">
                  "Generate Class 10 Math Exam"
               </span>
               <span className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 cursor-pointer transition-colors">
                  "Tomorrow's Staff Leaves"
               </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
