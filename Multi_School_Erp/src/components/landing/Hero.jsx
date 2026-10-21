import React from 'react';
import { useModal } from '../../context/ModalContext';
import { ExternalLink, Sparkles, Play } from 'lucide-react';

export default function Hero() {
  const { openModal } = useModal();

  return (
    <section className="relative pt-6 lg:pt-10 pb-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
        
        {/* Left Content */}
        <div className="flex flex-col items-start text-left space-y-4 relative w-full">
          {/* Tech Stack Tag pinned to Top */}
          <div className="absolute -top-4 lg:-top-5 left-0 flex gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#09B48E] bg-[#E8F8F5] px-2.5 py-1 border border-gray-900 shadow-[1px_1px_0_0_#111827]">
            <span>Node.js</span> <span className="text-gray-900">•</span>
            <span>React</span> <span className="text-gray-900">•</span>
            <span>MongoDB</span> <span className="text-gray-900">•</span>
            <span>Flutter</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black leading-tight tracking-tight text-gray-900 w-full mb-3">
            Complete Multi-School ERP — <br className="hidden lg:block"/>
            <span className="text-amber-500 text-2xl sm:text-[28px] font-extrabold block mt-2">with full source code you own.</span>
          </h1>

          <p className="text-sm sm:text-[15px] text-gray-600 font-semibold leading-relaxed max-w-lg mb-2">
            The ultimate white-label school operating system. Features a high-speed React dashboard, native Flutter apps for Parents/Staff/Drivers, and a robust Node.js backend. Equipped with live GPS, biometric sync, secure fee gateways, and an AI assistant.
          </p>

          <div className="bg-amber-50 border-[1.5px] border-gray-900 p-3 relative group w-full mb-1">
            <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 -z-10 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            <p className="text-gray-900 text-xs sm:text-[13px] font-semibold leading-tight">
              <span className="font-black bg-gray-900 text-white px-1.5 py-0.5 mr-2">PRO</span>
              Built exclusively for <span className="font-black">software agencies & edtech founders.</span> Rebrand, resell, and deploy as your own Multi-School SaaS platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-bold text-[#09B48E]">
            <span className="flex items-center gap-1.5"><span className="text-sm">✓</span> 100% Open Source</span>
            <span className="flex items-center gap-1.5"><span className="text-sm">✓</span> No Domain Restrictions</span>
            <span className="flex items-center gap-1.5"><span className="text-sm">✓</span> Zero Royalties</span>
            <span className="flex items-center gap-1.5"><span className="text-sm">✓</span> Lifetime Commercial Use</span>
          </div>

          <div className="flex items-end gap-3 pt-2">
            <span className="text-lg font-bold text-gray-400 line-through decoration-2 mb-1">₹15,000</span>
            <span className="text-3xl sm:text-4xl font-black text-gray-900">₹10,000</span>
            <span className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider mb-1">one-time<br/>no royalties</span>
          </div>

          <div className="flex items-center gap-4 pt-3 w-full sm:w-auto">
            <button 
              onClick={() => openModal('purchase')}
              className="relative group w-full sm:w-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-active:translate-x-0 group-active:translate-y-0" />
              <div className="relative bg-amber-400 border-[1.5px] border-gray-900 px-6 py-2.5 flex items-center justify-center transition-transform group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] group-active:translate-x-0 group-active:translate-y-0 liquid-btn" style={{ '--liquid-bg': '#0f172a', '--liquid-text': '#ffffff' }}>
                <span className="text-gray-900 font-black text-[12px] uppercase tracking-widest whitespace-nowrap z-10 relative flex items-center gap-1.5">
                  <span>Buy Source Code</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
            
            <button 
              onClick={() => openModal('portals')}
              className="relative group w-full sm:w-auto cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-active:translate-x-0 group-active:translate-y-0" />
              <div className="relative bg-white border-[1.5px] border-gray-900 px-6 py-2.5 flex items-center justify-center transition-transform group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] group-active:translate-x-0 group-active:translate-y-0 liquid-btn" style={{ '--liquid-bg': '#0f172a', '--liquid-text': '#ffffff' }}>
                <span className="text-gray-900 font-black text-[12px] uppercase tracking-widest whitespace-nowrap z-10 relative flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-gray-900" />
                  <span>Live Demo Hub</span>
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Content - Mockup with Live Deep-Links */}
        <div className="relative lg:h-[450px] w-full flex items-center justify-center mt-12 lg:mt-0 group">
           <div className="absolute inset-x-2 inset-y-2 lg:inset-x-4 lg:-inset-y-0 bg-gray-900 translate-x-3 translate-y-3 transition-transform group-hover:translate-x-5 group-hover:translate-y-5" />
           
           {/* Clickable Web Panel Preview */}
           <a 
              href="http://localhost:5176" 
              target="_blank" 
              rel="noreferrer"
              className="relative w-full h-full bg-slate-50 border-2 border-gray-900 p-3 lg:p-4 flex flex-col overflow-hidden cursor-pointer"
              title="Click to launch School Admin ERP on http://localhost:5176"
           >
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b-2 border-gray-900">
                 <div className="flex items-center gap-1.5">
                   <div className="w-3 h-3 rounded-full border-[1.5px] border-gray-900 bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full border-[1.5px] border-gray-900 bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full border-[1.5px] border-gray-900 bg-green-400"></div>
                 </div>
                 <div className="font-black text-gray-900 uppercase tracking-widest text-[10px] sm:text-xs bg-amber-300 border-[1.5px] border-gray-900 px-3 py-1 flex items-center gap-1">
                   <span>School Admin ERP :5176</span>
                   <ExternalLink className="w-3 h-3" />
                 </div>
              </div>
              <div className="flex-1 w-full bg-grid-pattern relative flex items-center justify-center bg-[#fdfdfd]">
                 <div className="absolute inset-3 border-[1.5px] border-gray-900 bg-white grid grid-cols-4 gap-3 p-3">
                    <div className="col-span-1 border-[1.5px] border-gray-900 bg-blue-50 p-2 flex flex-col gap-2">
                       <div className="w-full h-3 bg-gray-900" />
                       <div className="w-3/4 h-2 bg-amber-400" />
                       <div className="w-full h-2 bg-gray-200" />
                       <div className="w-1/2 h-2 bg-gray-200" />
                    </div>
                    <div className="col-span-3 grid grid-rows-3 gap-3">
                       <div className="row-span-1 border-[1.5px] border-gray-900 bg-amber-50 p-2 flex items-center justify-between">
                         <span className="font-black text-[10px] text-gray-800">5 Branches Active</span>
                         <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 font-bold">● Online</span>
                       </div>
                       <div className="row-span-2 grid grid-cols-2 gap-3">
                          <div className="border-[1.5px] border-gray-900 bg-green-50 p-2 flex flex-col justify-end">
                            <span className="text-[9px] text-gray-500 font-bold">Fee Collections</span>
                            <span className="text-sm font-black text-gray-900">₹8,45,000</span>
                          </div>
                          <div className="border-[1.5px] border-gray-900 bg-purple-50 p-2 flex flex-col justify-end">
                            <span className="text-[9px] text-gray-500 font-bold">Total Students</span>
                            <span className="text-sm font-black text-gray-900">1,485 Enrolled</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </a>
           
           {/* Clickable Mobile App Preview */}
           <a 
              href="http://localhost:5175" 
              target="_blank" 
              rel="noreferrer"
              className="absolute -bottom-6 -left-6 w-[140px] h-[270px] bg-white border-2 border-gray-900 shadow-[6px_6px_0px_0px_#111827] z-20 flex flex-col p-1.5 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all cursor-pointer"
              title="Click to launch Student & Parent Portal on http://localhost:5175"
           >
              <div className="w-full h-3 border-b-[1.5px] border-gray-900 mb-1.5 flex justify-center">
                 <div className="w-6 h-[3px] bg-gray-900 rounded-full" />
              </div>
              <div className="w-full flex-1 border-[1.5px] border-gray-900 bg-emerald-50 flex flex-col items-center justify-center p-2 text-center">
                 <span className="text-xl mb-1">📱</span>
                 <span className="font-black text-[10px] uppercase text-emerald-900 leading-tight">
                   Student<br/>Portal<br/>:5175 ↗
                 </span>
                 <span className="text-[8px] text-gray-500 mt-1 font-bold">Click to Test</span>
              </div>
           </a>

           {/* Floating Badge for Teacher Panel :5177 */}
           <a
              href="http://localhost:5177"
              target="_blank"
              rel="noreferrer"
              className="absolute -top-4 -right-2 sm:-right-4 bg-white border-2 border-gray-900 shadow-[3px_3px_0_0_#111827] z-20 px-3 py-1.5 flex items-center gap-2 hover:bg-amber-100 transition-all hover:scale-105 cursor-pointer"
              title="Click to launch Teacher Panel on http://localhost:5177"
           >
              <span className="text-base">👨‍🏫</span>
              <div className="text-left">
                <div className="text-[8px] font-black uppercase tracking-wider text-gray-500">Teacher & Staff</div>
                <div className="text-[10px] font-black text-gray-900 leading-none">Teacher Panel :5177 ↗</div>
              </div>
           </a>

           {/* Floating Badge for Accountant Panel :5178 */}
           <a
              href="http://localhost:5178"
              target="_blank"
              rel="noreferrer"
              className="absolute -bottom-4 right-4 sm:right-6 bg-white border-2 border-gray-900 shadow-[3px_3px_0_0_#111827] z-20 px-3 py-1.5 flex items-center gap-2 hover:bg-emerald-100 transition-all hover:scale-105 cursor-pointer"
              title="Click to launch Accountant & Fee Desk on http://localhost:5178"
           >
              <span className="text-base">💼</span>
              <div className="text-left">
                <div className="text-[8px] font-black uppercase tracking-wider text-gray-500">Fee & Accounts</div>
                <div className="text-[10px] font-black text-emerald-800 leading-none">Accountant & Fee Desk :5178 ↗</div>
              </div>
           </a>
        </div>

      </div>
    </section>
  );
}
