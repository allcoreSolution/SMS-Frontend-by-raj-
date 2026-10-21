import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Compass, UserPlus, IndianRupee, Calendar, Send, 
  BookOpen, BarChart3, Settings, Grid, RefreshCw, 
  CheckCircle2, ShieldCheck, ArrowRight, Layers, Globe
} from 'lucide-react';

const CommandCenterModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (path, category = null) => {
    if (category) {
      window.dispatchEvent(new CustomEvent('command_center_set_category', { detail: category }));
    }
    if (path) {
      navigate(path);
    }
    onClose();
  };

  const handleSyncData = () => {
    window.dispatchEvent(new CustomEvent('command_center_refresh_data'));
    onClose();
  };

  const handleLanguageSwitch = (lang) => {
    try {
      localStorage.setItem('app_language', lang);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('app_language_changed', { detail: lang }));
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Command Center</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Quick Operations, Presets & School Diagnostics</p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 custom-scrollbar">
          
          {/* 1. Operational Focus Presets */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Focus Mode & Ecosystem Presets
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                onClick={() => handleAction('/', 'All')}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600">🏫 Full Cockpit</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">All 236 modules</span>
              </button>
              
              <button 
                onClick={() => handleAction('/', 'Finance')}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 block group-hover:text-emerald-600">💰 Finance Focus</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Fees & Collections</span>
              </button>

              <button 
                onClick={() => handleAction('/', 'Academics')}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600">🎓 Academics Focus</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Exams & Timetable</span>
              </button>

              <button 
                onClick={() => handleAction('/', 'Students')}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all text-left cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 block group-hover:text-purple-600">👥 Student Focus</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Admissions & Roll</span>
              </button>
            </div>
          </div>

          {/* 2. Fast Launch Actions */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              High-Frequency Operations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button 
                onClick={() => handleAction('/students/admission')}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/90 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">New Student Admission</h4>
                    <p className="text-[10px] text-slate-500">Enroll pupil into session 2026-2027</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button 
                onClick={() => handleAction('/finance/collect')}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/90 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Collect Student Fee</h4>
                    <p className="text-[10px] text-slate-500">Instant receipt counter</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button 
                onClick={() => handleAction('/students/attendance')}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/20 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Mark Student Attendance</h4>
                    <p className="text-[10px] text-slate-500">Daily classroom roll call</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
              </button>

              <button 
                onClick={() => handleAction('/communicate/compose-broadcast')}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/90 hover:border-purple-400 hover:bg-purple-50/20 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Broadcast Notice / Circular</h4>
                    <p className="text-[10px] text-slate-500">Send updates to students & parents</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors" />
              </button>

              <button 
                onClick={() => handleAction('/offline-exams/manage')}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/20 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Examination Center</h4>
                    <p className="text-[10px] text-slate-500">Datesheet, Marks & Cards</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </button>

              <button 
                onClick={() => handleAction('/erp-navigator')}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/90 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">ERP Navigator (All Modules)</h4>
                    <p className="text-[10px] text-slate-500">Full directory of 39 departments</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* 3. System Health & Quick Tools */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Backend Port 5050 Synced
              </span>
              <span>•</span>
              <span className="font-medium text-slate-600">Session 2026-27 Active</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleLanguageSwitch('Hindi')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                title="Switch UI to Hindi"
              >
                <Globe className="w-3 h-3 text-indigo-600" /> हिंदी
              </button>
              <button 
                onClick={() => handleLanguageSwitch('English')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                title="Switch UI to English"
              >
                English
              </button>

              <button 
                onClick={handleSyncData}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Sync Real Data
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommandCenterModal;
