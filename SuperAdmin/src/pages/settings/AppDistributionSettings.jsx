import React from 'react';
import { Smartphone, CheckCircle2, ArrowRight, ShieldCheck, DownloadCloud } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import { useNavigate } from 'react-router-dom';

export default function AppDistributionSettings() {
  const navigate = useNavigate();

  return (
    <SettingsLayout activeTab="app-dist">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1150px] mx-auto w-full">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-10 flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-xs">
              <Smartphone className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Mobile App Distribution Center</h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
              Publish Android APKs, Play Store URLs, and iOS App Store distribution packages for School Parent, Teacher, and Driver apps.
            </p>

            <div className="flex flex-col gap-2.5 mb-8 text-left w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              {[
                'Upload and host production Android APK builds directly on platform CDN',
                'Set direct Google Play Store & Apple App Store download URLs',
                'Configure version update enforcement (force update vs optional)',
                'Audience-specific app download banners in School & Parent portals'
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/app-distribution')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
            >
              <span>Launch App Distribution Manager</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </SettingsLayout>
  );
}
