import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, PhoneCall, Mail, MessageCircle, LogOut } from 'lucide-react';

export default function SchoolLockedScreen({ 
  schoolName = 'School Institution', 
  schoolCode = 'SCH-ERP', 
  reason = 'School account suspended or terminated by SuperAdmin.',
  onLogout 
}) {
  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('schoolId');
      localStorage.removeItem('school_locked');
      localStorage.removeItem('school_lock_message');
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full bg-slate-900/90 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(244,63,94,0.15)] text-center backdrop-blur-xl">
        
        {/* Shield Header */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center text-rose-500 mb-6 shadow-inner">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/15 border border-rose-500/40 rounded-full text-rose-400 text-xs font-black uppercase tracking-wider mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>Access Suspended / Terminated</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          School Account Locked
        </h1>

        <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6">
          All administrative functions, academic records, and portal operations for{' '}
          <strong className="text-white font-bold">{schoolName}</strong> ({schoolCode}) have been locked by platform SuperAdmin authority.
        </p>

        {/* Diagnostic Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 font-semibold">Institutional Code:</span>
            <span className="text-amber-400 font-mono font-bold">{schoolCode}</span>
          </div>
          <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 font-semibold">Security State:</span>
            <span className="text-rose-400 font-bold">Write &amp; Read Restricted</span>
          </div>
          <div className="pt-1">
            <span className="text-[11px] text-slate-400 font-medium block">Reason / Notice:</span>
            <p className="text-xs text-slate-200 font-semibold mt-0.5 leading-snug">
              {reason}
            </p>
          </div>
        </div>

        {/* Reassurance Note */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 mb-6 text-xs text-emerald-300 flex items-center gap-2.5 text-left">
          <AlertTriangle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            <strong>Data Integrity Safe:</strong> All your school data, student dossiers, exam marks, and financial receipts remain securely archived and encrypted.
          </span>
        </div>

        {/* Contact SuperAdmin Actions */}
        <div className="space-y-2.5">
          <a
            href="https://wa.me/?text=Hello%20SuperAdmin%20ALLCORE%2C%20our%20school%20account%20is%20currently%20locked.%20Please%20assist%20in%20reactivation."
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact SuperAdmin via WhatsApp</span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="mailto:contact@allcoresolution.com"
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Email Support</span>
            </a>
            <button
              onClick={handleSignOut}
              className="py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          ALL CORE SOLUTION Platform Governance &bull; Managed by RAJ YADAV
        </div>
      </div>
    </div>
  );
}
