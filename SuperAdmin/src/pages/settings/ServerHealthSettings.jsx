import React from 'react';
import { HeartPulse, CheckCircle2, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import { useNavigate } from 'react-router-dom';

export default function ServerHealthSettings() {
  const navigate = useNavigate();

  return (
    <SettingsLayout activeTab="server-health">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1150px] mx-auto w-full">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-10 flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-600 shadow-xs">
              <HeartPulse className="w-8 h-8 animate-pulse" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Live Server Health &amp; Telemetry</h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
              Real-time Node.js execution runtime, heap memory usage, active event-loop uptime, and MongoDB cluster latency metrics.
            </p>

            <div className="flex flex-col gap-2.5 mb-8 text-left w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              {[
                'Live Node.js V8 Heap & Process RAM tracking',
                'Real-time MongoDB Atlas ping latency & operational status',
                'Production Uptime counter with active process ID inspection',
                'Instant memory garbage-collection stress check'
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/server')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
            >
              <span>Launch Live Telemetry Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </SettingsLayout>
  );
}
