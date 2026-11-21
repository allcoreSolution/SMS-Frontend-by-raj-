import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { useModal } from '../../context/ModalContext';
import { Cpu, Terminal, ExternalLink, Zap } from 'lucide-react';

export default function HardwareSync() {
  const { openModal } = useModal();

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200 bg-slate-50/50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        
        {/* Left Content - Graphic Mockup (Clickable) */}
        <div 
          onClick={() => openModal('hardware')}
          className="relative group w-full max-w-[600px] mx-auto lg:mx-0 h-[340px] sm:h-[450px] cursor-pointer"
          title="Click to launch live Biometric API Terminal"
        >
          <div className="relative w-full h-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-xl">
            {/* Desktop Screen Mock */}
            <div className="relative w-full max-w-[420px] bg-slate-950 text-white rounded-2xl border border-slate-800 flex flex-col shadow-2xl z-10 hover:-translate-y-1 transition-transform overflow-hidden">
              <div className="w-full h-8 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-3 flex-shrink-0">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                   <span className="ml-2 text-[9px] font-black tracking-wider text-slate-300 uppercase">ALL CORE SOLUTION • ADMS Cloud Sync</span>
                 </div>
                 <span className="text-[8px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">CLICK TO TEST</span>
              </div>
              <div className="p-3 sm:p-4 flex flex-col gap-3">
                 <div className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold text-[10px] flex justify-between items-center uppercase tracking-wider">
                    <span>☁️ Biometric Push Protocol Online</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live Stream
                    </span>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center">
                       <div className="text-[8px] text-slate-400 font-bold uppercase mb-0.5">Connected</div>
                       <div className="font-black text-white text-xs">2 Devices</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center">
                       <div className="text-[8px] text-slate-400 font-bold uppercase mb-0.5">Last Sync</div>
                       <div className="font-black text-emerald-400 text-xs">Just Now</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center">
                       <div className="text-[8px] text-slate-400 font-bold uppercase mb-0.5">Punches Today</div>
                       <div className="font-black text-amber-400 text-xs">1,842</div>
                    </div>
                 </div>
                 <div className="border border-slate-800 rounded-xl p-2.5 bg-slate-900/60 text-[9.5px] font-mono space-y-1">
                    <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1">Recent Ingress Logs:</div>
                    <div className="flex justify-between text-slate-300"><span className="text-emerald-400 font-bold">IN</span> 08:14 <span>Aarav S. (RFID Smartcard)</span></div>
                    <div className="flex justify-between text-slate-300"><span className="text-emerald-400 font-bold">IN</span> 08:12 <span>Sunita P. (Fingerprint)</span></div>
                    <div className="flex justify-between text-slate-300"><span className="text-amber-400 font-bold">OUT</span> 08:09 <span>Rohan M. (Facial Scan)</span></div>
                 </div>
              </div>
            </div>

            {/* Hardware Device Mock */}
            <div className="absolute bottom-4 left-4 w-20 sm:w-24 h-36 sm:h-44 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-20 flex flex-col items-center pt-2.5 pb-2 px-1 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-[85%] aspect-square bg-slate-950 border border-slate-800 rounded-lg mb-2 flex items-center justify-center flex-col">
                  <span className="text-xs sm:text-sm font-black text-cyan-400">08:14</span>
                  <span className="text-[6px] text-slate-400 font-bold">PUSH SYNC</span>
               </div>
               <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-emerald-400 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                  <span className="text-sm sm:text-base">👆</span>
               </div>
               <div className="w-full flex-1 border-t border-slate-800 mt-2 flex justify-center items-end">
                  <span className="text-[7px] font-bold text-slate-400 uppercase">ZK Teco ADMS</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div>
          <span className="inline-block bg-amber-50 text-amber-800 font-black uppercase tracking-widest text-[10px] sm:text-xs px-3.5 py-1 rounded-full border border-amber-200 mb-4 sm:mb-6 shadow-xs">
            HARDWARE INTEGRATION &amp; ADMS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-black text-slate-900 leading-[1.15] tracking-tight mb-4 sm:mb-6">
            True ADMS. Two-way biometric device sync — zero middleware.
          </h2>
          <p className="text-slate-600 font-medium text-xs sm:text-base leading-relaxed mb-5 sm:mb-6">
            Real ZKTeco / eSSL <strong className="text-slate-900">iclock</strong> push protocol implemented natively into ALL CORE SOLUTION cloud. Point the device at your school domain and it reports in instantly on its own. No USB drives, no manual CSV imports.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => openModal('hardware')}
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Biometric Terminal ⚡</span>
            </button>

            <a
              href={`${PORTAL_URLS.student}/school-visit`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-white text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Test QR Gate Pass ↗</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <ul className="space-y-3 text-slate-800 font-bold text-xs sm:text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span><strong>Two-way sync:</strong> student attendance logs flow up, user biometric templates flow down</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span>Native <code className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-xs">/iclock/cdata</code> + <code className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-xs">/getrequest</code> — authentic ADMS</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span><strong>Built-in API Playground:</strong> fire test punches, ping devices, inspect real latency</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#09B48E] text-base leading-none mt-0.5">✓</span> 
              <span>Device brand catalog, per-device IP allowlisting &amp; automatic duplicate punch filter</span>
            </li>
          </ul>
        </div>
        
      </div>
    </section>
  );
}
