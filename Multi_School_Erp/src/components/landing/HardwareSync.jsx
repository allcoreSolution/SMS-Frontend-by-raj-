import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { useModal } from '../../context/ModalContext';
import { Cpu, Terminal, ExternalLink, Zap } from 'lucide-react';

export default function HardwareSync() {
  const { openModal } = useModal();

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t-[1.5px] border-gray-900 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        
        {/* Left Content - Graphic Mockup (Clickable) */}
        <div 
          onClick={() => openModal('hardware')}
          className="relative group w-full max-w-[600px] mx-auto lg:mx-0 h-[340px] sm:h-[450px] cursor-pointer"
          title="Click to launch live Biometric API Terminal"
        >
          {/* Brutalist Shadow */}
          <div className="absolute inset-2 sm:inset-4 lg:inset-6 bg-gray-900 -translate-x-2 translate-y-3 sm:-translate-x-3 sm:translate-y-4 transition-transform duration-300 group-hover:-translate-x-4 group-hover:translate-y-5" />
          
          <div className="relative w-full h-full bg-white border-[2px] border-gray-900 p-2.5 sm:p-5 flex items-center justify-center overflow-hidden bg-grid-pattern">
            {/* Desktop Screen Mock */}
            <div className="relative w-full max-w-[400px] h-[240px] sm:h-[300px] bg-slate-100 border-[2px] border-gray-900 flex flex-col shadow-[3px_3px_0_0_#111827] z-10 hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform">
              <div className="w-full h-6 border-b-[1.5px] border-gray-900 bg-gray-200 flex items-center justify-between px-2 flex-shrink-0">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full border border-gray-900 bg-red-400" />
                   <div className="w-2 h-2 rounded-full border border-gray-900 bg-amber-400" />
                   <div className="w-2 h-2 rounded-full border border-gray-900 bg-green-400" />
                   <span className="ml-1 sm:ml-2 text-[7.5px] sm:text-[8px] font-black tracking-widest text-gray-700 uppercase truncate">Biometric Cloud Sync</span>
                 </div>
                 <span className="text-[7.5px] sm:text-[8px] font-black uppercase text-amber-600 bg-amber-100 px-1 border border-amber-900/30">CLICK TO TEST</span>
              </div>
              <div className="flex-1 bg-white p-2 sm:p-3 flex flex-col gap-2 sm:gap-3 overflow-hidden">
                 <div className="w-full bg-[#09B48E] text-white border-[1.5px] border-gray-900 px-2 sm:px-3 py-1 sm:py-1.5 font-bold text-[9px] sm:text-[10px] flex justify-between uppercase tracking-wider flex-shrink-0">
                    <span className="truncate">☁️ Connected to Cloud Hardware API</span>
                    <span className="text-green-100 animate-pulse ml-1">● Live</span>
                 </div>
                 <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="border border-gray-900 bg-gray-50 p-1 sm:p-2 text-center shadow-[1px_1px_0_0_#111827]">
                       <div className="text-[7px] sm:text-[8px] text-gray-500 font-bold uppercase mb-0.5 sm:mb-1">Devices</div>
                       <div className="font-black text-gray-900 text-[10px] sm:text-xs">2 Online</div>
                    </div>
                    <div className="border border-gray-900 bg-gray-50 p-1 sm:p-2 text-center shadow-[1px_1px_0_0_#111827]">
                       <div className="text-[7px] sm:text-[8px] text-gray-500 font-bold uppercase mb-0.5 sm:mb-1">Last Sync</div>
                       <div className="font-black text-gray-900 text-[10px] sm:text-xs">Just Now</div>
                    </div>
                    <div className="border border-gray-900 bg-gray-50 p-1 sm:p-2 text-center shadow-[1px_1px_0_0_#111827]">
                       <div className="text-[7px] sm:text-[8px] text-gray-500 font-bold uppercase mb-0.5 sm:mb-1">Records</div>
                       <div className="font-black text-gray-900 text-[10px] sm:text-xs text-amber-600">228</div>
                    </div>
                 </div>
                 <div className="flex-1 border border-gray-900 p-1.5 sm:p-2 overflow-hidden text-[8px] sm:text-[9px]">
                    <div className="font-bold border-b border-gray-200 pb-0.5 sm:pb-1 mb-1 truncate">Recent Attendance Punches</div>
                    <div className="flex justify-between text-gray-500 font-semibold mb-0.5 truncate"><span className="text-green-600">IN</span> 09:48 <span>Aarav (RFID)</span></div>
                    <div className="flex justify-between text-gray-500 font-semibold mb-0.5 truncate"><span className="text-green-600">IN</span> 09:47 <span>Priya (Finger)</span></div>
                    <div className="flex justify-between text-gray-500 font-semibold truncate"><span className="text-red-500">OUT</span> 09:46 <span>Rohan (Face)</span></div>
                 </div>
              </div>
            </div>

            {/* Hardware Device Mock */}
            <div className="absolute bottom-2 sm:bottom-8 left-2 sm:left-4 w-[65px] sm:w-[90px] h-[125px] sm:h-[160px] bg-gray-800 border-[2px] border-gray-900 rounded-lg shadow-[4px_4px_0_0_#0F172A] z-20 flex flex-col items-center pt-2 sm:pt-3 pb-1.5 sm:pb-2 px-1 hover:-translate-y-2 sm:hover:-translate-y-4 transition-transform duration-500">
               <div className="w-[85%] aspect-square bg-blue-100 border border-gray-600 mb-1 sm:mb-2 flex items-center justify-center flex-col">
                  <span className="text-[11px] sm:text-[14px] font-black text-blue-900 mt-0.5">09:48</span>
                  <span className="text-[5px] sm:text-[6px] text-blue-700 font-bold">LIVE ADMS</span>
               </div>
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#09B48E] flex items-center justify-center mt-1 sm:mt-2 group relative">
                  <div className="absolute inset-0 bg-[#09B48E] rounded-full animate-ping opacity-20" />
                  <span className="text-base sm:text-xl">👆</span>
               </div>
               <div className="w-full flex-1 border-t border-gray-700 mt-1 sm:mt-2 flex justify-center items-end">
                  <span className="text-[5.5px] sm:text-[6px] font-bold text-gray-400 uppercase">ZK Teco</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div>
          <span className="inline-block bg-amber-100 text-amber-600 font-black uppercase tracking-widest text-[9px] sm:text-xs px-2.5 sm:px-3 py-1 border-[1.5px] border-gray-900 mb-4 sm:mb-6 shadow-[2px_2px_0_0_#111827]">
            HARDWARE INTEGRATION & ADMS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-black text-gray-900 leading-[1.15] tracking-tight mb-4 sm:mb-6">
            True ADMS. Two-way device sync — no middleware.
          </h2>
          <p className="text-gray-600 font-semibold text-xs sm:text-[15px] leading-relaxed mb-4 sm:mb-6">
            Real ZKTeco / eSSL <strong className="text-gray-900">iclock</strong> push protocol, implemented natively. Point the device at your domain and it reports in on its own — and the server talks back, pushing users, fingerprint templates and time-sync down to the device. No polling, no USB drives, no manual imports.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-6">
            <button
              onClick={() => openModal('hardware')}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-amber-400 text-gray-900 font-black text-xs uppercase tracking-wider border-[2px] border-gray-900 shadow-[2px_2px_0_0_#111827] hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Biometric Terminal ⚡</span>
            </button>

            <a
              href={`${PORTAL_URLS.student}/school-visit`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-white text-gray-800 font-bold text-xs uppercase tracking-wider border-[2px] border-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Test QR Gate Pass ↗</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <ul className="space-y-2.5 sm:space-y-3.5 text-gray-800 font-bold text-xs sm:text-[14px]">
            <li className="flex items-start gap-2.5 sm:gap-3">
              <span className="text-[#09B48E] text-base sm:text-lg leading-none mt-0.5">✓</span> 
              <span><strong>Two-way sync:</strong> punches flow up, users & commands flow down</span>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <span className="text-[#09B48E] text-base sm:text-lg leading-none mt-0.5">✓</span> 
              <span>Native <code className="bg-gray-200 border border-gray-900 px-1.5 py-0.5 text-[10px] sm:text-[11px]">/iclock/cdata</code> + <code className="bg-gray-200 border border-gray-900 px-1.5 py-0.5 text-[10px] sm:text-[11px]">/getrequest</code> — genuine ADMS</span>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <span className="text-[#09B48E] text-base sm:text-lg leading-none mt-0.5">✓</span> 
              <span><strong>Built-in API Playground</strong> — fire test punches, ping devices, inspect real latency</span>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <span className="text-[#09B48E] text-base sm:text-lg leading-none mt-0.5">✓</span> 
              <span>Device brand catalog, per-device IP allowlisting, timestamp-based dedup</span>
            </li>
          </ul>
        </div>
        
      </div>
    </section>
  );
}
