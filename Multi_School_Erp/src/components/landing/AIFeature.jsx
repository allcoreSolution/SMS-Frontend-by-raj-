import React from 'react';
import { ExternalLink, Bot, Sparkles } from 'lucide-react';

export default function AIFeature() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t-[1.5px] border-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Content */}
        <div className="order-2 lg:order-1">
          <span className="inline-block bg-amber-200 text-amber-900 font-black uppercase tracking-widest text-[10px] sm:text-xs px-3 py-1 border-[1.5px] border-gray-900 mb-6 shadow-[2px_2px_0_0_#111827]">
            AI-POWERED ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-gray-900 leading-[1.15] tracking-tight mb-6">
            AI assistant grounded on your school's actual data.
          </h2>
          <p className="text-gray-600 font-semibold text-[15px] leading-relaxed mb-6">
            Ask natural-language questions and get answers backed by your school's real records — not hallucinated data. Supports Gemini and OpenAI with role-based access controls and automatic Hinglish / Hindi detection.
          </p>

          <div className="mb-6">
            <a
              href="http://localhost:5175/ai-assistant"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-gray-900 font-black text-xs uppercase tracking-wider border-[2px] border-gray-900 shadow-[3px_3px_0_0_#111827] hover:bg-amber-300 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Live AI Assistant (:5175) ↗</span>
            </a>
          </div>

          <ul className="space-y-3.5 text-gray-800 font-bold text-[14px]">
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-lg leading-none mt-0.5">✓</span> 
              <span>"What's today's attendance summary?" — answered in seconds</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-lg leading-none mt-0.5">✓</span> 
              <span>"Which students have pending fees over ₹5,000?"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-lg leading-none mt-0.5">✓</span> 
              <span>Dynamic Language Detection: English, Hindi Devanagari, and Hinglish</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-lg leading-none mt-0.5">✓</span> 
              <span>Zero hallucination — grounded on your active database</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-lg leading-none mt-0.5">✓</span> 
              <span>Role-based privacy: teachers can't access admin queries</span>
            </li>
          </ul>
        </div>
        
        {/* Right Content - Mockup (Clickable to open AI Assistant) */}
        <div className="order-1 lg:order-2 relative group">
          <div className="absolute inset-0 bg-gray-900 translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5" />
          
          <a
            href="http://localhost:5175/ai-assistant"
            target="_blank"
            rel="noreferrer"
            className="relative bg-white border-[2px] border-gray-900 p-2 sm:p-4 flex flex-col h-[400px] sm:h-[450px] cursor-pointer block"
            title="Click to launch real AI Assistant Desk"
          >
            {/* Fake Dashboard Header */}
            <div className="flex border-b-[1.5px] border-gray-900 pb-2 mb-2 gap-2">
              <div className="w-1/4 bg-[#0F172A] border-[1.5px] border-gray-900 text-white flex items-center px-3 py-1 font-black text-[10px]">
                EduPortal
              </div>
              <div className="flex-1 border-[1.5px] border-gray-900 bg-gray-50 flex justify-between items-center px-3 py-1 text-gray-400 text-xs">
                <span>🔍 Search records...</span>
                <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-1 border border-amber-900/40">CLICK TO TEST AI</span>
              </div>
            </div>

            {/* Fake Dashboard Body with Chat popup */}
            <div className="flex flex-1 relative gap-2">
              <div className="w-1/4 bg-[#0F172A] border-[1.5px] border-gray-900 hidden sm:block p-2">
                 <div className="h-6 w-full bg-indigo-500/20 border border-indigo-400 mb-2" />
                 <div className="h-2 w-3/4 bg-gray-700 mb-4" />
                 <div className="h-2 w-1/2 bg-gray-700 mb-4" />
                 <div className="h-2 w-2/3 bg-gray-700 mb-4" />
              </div>
              <div className="flex-1 bg-grid-pattern border-[1.5px] border-gray-900 relative">
                 {/* Dashboard placeholder UI */}
                 <div className="absolute inset-2 grid grid-cols-2 gap-2 opacity-50 pointer-events-none">
                    <div className="bg-white border-[1.5px] border-gray-900 h-20" />
                    <div className="bg-white border-[1.5px] border-gray-900 h-20" />
                    <div className="col-span-2 bg-white border-[1.5px] border-gray-900 h-32" />
                 </div>

                 {/* The AI Assistant Chatbox hovering over dashboard */}
                 <div className="absolute top-2 right-2 bottom-2 w-[240px] sm:w-[280px] bg-white border-[2px] border-gray-900 flex flex-col shadow-[4px_4px_0_0_#111827] z-10 transition-transform group-hover:-translate-y-1">
                    <div className="bg-amber-100 border-b-[1.5px] border-gray-900 px-3 py-2 flex justify-between items-center">
                       <span className="font-black text-gray-900 text-[11px] flex items-center gap-1.5">
                         <span className="text-amber-500">✨</span> AI Assistant (:5175)
                       </span>
                       <span className="text-gray-900 font-bold text-xs">↗</span>
                    </div>
                    
                    <div className="flex-1 p-3 overflow-y-hidden flex flex-col gap-3 text-[9px] sm:text-[10px]">
                       <div className="flex justify-end">
                         <div className="bg-[#0F172A] text-white px-2.5 py-1.5 rounded-l-md rounded-tr-md max-w-[85%] font-medium border border-gray-900 shadow-[1px_1px_0_0_#F59E0B]">
                           Leave apply kaise karein portal se?
                         </div>
                       </div>
                       
                       <div className="flex justify-start items-start gap-2">
                         <div className="w-5 h-5 rounded-full bg-purple-100 border border-purple-900 flex items-center justify-center text-[8px] flex-shrink-0 font-bold text-purple-900">
                           AI
                         </div>
                         <div className="bg-gray-50 border border-gray-900 px-2.5 py-1.5 rounded-r-md rounded-tl-md font-semibold text-gray-700 shadow-[2px_2px_0_0_#111827]">
                           Leave apply karne ke liye:<br/>
                           1. Sidebar me <span className="font-bold text-gray-900">Leave Management</span> par jayein.<br/>
                           2. <span className="font-bold text-emerald-600">Apply Leave</span> button par click karein.<br/>
                           3. Dates aur reason chunein aur Submit karein!
                         </div>
                       </div>
                    </div>
                    
                    <div className="p-2 border-t-[1.5px] border-gray-900 bg-gray-50">
                       <div className="w-full bg-white border border-gray-900 h-7 flex items-center px-2 justify-between">
                          <span className="text-gray-400 text-[9px]">Click to launch live AI Assistant...</span>
                          <div className="w-4 h-4 bg-[#0F172A] flex items-center justify-center text-white text-[8px]">↗</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}
