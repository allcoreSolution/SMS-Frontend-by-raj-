import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Clock, Zap, Check, Phone, X, ShieldCheck } from 'lucide-react';

export default function TrialBannerAndPaywall() {
  const [trialInfo, setTrialInfo] = useState(() => {
    try {
      const uStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (uStr) {
        const u = JSON.parse(uStr);
        if (u.trialInfo) return u.trialInfo;
        if (u.school?.trialInfo) return u.school.trialInfo;
      }
    } catch (_) {}
    return {
      isTrial: true,
      daysRemaining: 29,
      isExpired: false
    };
  });

  const [isExpiredState, setIsExpiredState] = useState(() => {
    try {
      return localStorage.getItem('trial_expired') === 'true';
    } catch (_) {
      return false;
    }
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('trial_banner_dismissed') === 'true';
    } catch (_) {
      return false;
    }
  });

  // Listen for trial events
  useEffect(() => {
    const handleExpiredEvent = () => {
      setIsExpiredState(true);
      setShowUpgradeModal(true);
    };
    window.addEventListener('trial_expired_triggered', handleExpiredEvent);
    return () => window.removeEventListener('trial_expired_triggered', handleExpiredEvent);
  }, []);

  const isExpired = trialInfo.isExpired || isExpiredState;
  const daysLeft = typeof trialInfo.daysRemaining === 'number' ? trialInfo.daysRemaining : 30;

  return (
    <>
      {/* 1. Sleek 30-Day Free Trial Active Header Banner */}
      {!isExpired && trialInfo.isTrial && !bannerDismissed && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm z-20 w-full animate-in fade-in">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-white/20 text-white font-black text-[10px] uppercase px-1.5 py-0.5 rounded">
                1st Month Free
              </span>
              <span>
                30-Day Free Trial Active: <strong>{daysLeft} days remaining</strong>. All 38 modules &amp; mobile apps are fully unlocked!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-black shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Upgrade Plan</span>
            </button>
            <button
              onClick={() => {
                setBannerDismissed(true);
                try { sessionStorage.setItem('trial_banner_dismissed', 'true'); } catch (_) {}
              }}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition cursor-pointer"
              title="Dismiss for this session"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Upgrade Plan / Paywall Modal (Enforced when Trial Expired or clicked) */}
      {(showUpgradeModal || isExpired) && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(245,158,11,0.2)] relative my-8">
            
            {/* Close button only available if not expired */}
            {!isExpired && (
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExpired ? '1-Month Free Trial Concluded' : 'Institutional Subscription Upgrade'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isExpired ? 'Your 30-Day Free Trial Has Ended' : 'Choose an Institutional Plan for Your School'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                {isExpired 
                  ? 'Your first month of complimentary ERP access has concluded. Upgrade to a yearly plan now to continue operations, attendance, exams, fees, and mobile apps without interruption.'
                  : 'Upgrade today to lock in priority cloud bandwidth, dedicated institutional backups, and zero per-student surcharges.'}
              </p>
            </div>

            {/* Plan Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Starter */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Starter Campus</div>
                  <h3 className="text-lg font-black text-white">Starter Annual</h3>
                  <div className="my-3">
                    <span className="text-2xl font-black text-white">₹24,999</span>
                    <span className="text-xs text-slate-400 font-semibold"> / year</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-bold mb-4">✓ Up to 500 Students Included</p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Full School Admin Portal</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> QR Code Smart Attendance</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Fees, Slips &amp; Offline Exams</li>
                  </ul>
                </div>
                <a
                  href="https://wa.me/?text=Hello%20SuperAdmin%2C%20we%20want%20to%20upgrade%20our%20school%20to%20the%20Starter%20Annual%20Plan%20(%E2%82%B924%2C999%2Fyear)."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition text-center block"
                >
                  Select Starter
                </a>
              </div>

              {/* Pro (Featured) */}
              <div className="bg-slate-950 border-2 border-amber-400 rounded-2xl p-5 flex flex-col justify-between relative shadow-[0_0_20px_rgba(245,158,11,0.15)] -translate-y-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Most Popular
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1">Full K-12 Suite</div>
                  <h3 className="text-lg font-black text-white">Pro School Annual</h3>
                  <div className="my-3">
                    <span className="text-2xl font-black text-amber-400">₹49,999</span>
                    <span className="text-xs text-slate-400 font-semibold"> / year</span>
                  </div>
                  <p className="text-xs text-amber-300 font-bold mb-4">✓ Up to 1,500 Students + All Apps</p>
                  <ul className="space-y-2 text-xs text-slate-200">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> All 38 ERP Modules &amp; 7 Portals</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Android Apps for Parents &amp; Teachers</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Driver Bus Fleet Live GPS Tracking</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Razorpay Gateway Auto-Receipts</li>
                  </ul>
                </div>
                <a
                  href="https://wa.me/?text=Hello%20SuperAdmin%2C%20we%20want%20to%20upgrade%20our%20school%20to%20the%20Pro%20School%20Plan%20(%E2%82%B949%2C999%2Fyear)."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition text-center block shadow-md"
                >
                  Upgrade to Pro →
                </a>
              </div>

              {/* Enterprise */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-1">Multi-Campus Trust</div>
                  <h3 className="text-lg font-black text-white">Enterprise Suite</h3>
                  <div className="my-3">
                    <span className="text-2xl font-black text-white">₹89,999</span>
                    <span className="text-xs text-slate-400 font-semibold"> / year</span>
                  </div>
                  <p className="text-xs text-cyan-400 font-bold mb-4">✓ Unlimited Students &amp; Branches</p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Multi-Branch Group Oversight</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Custom Domain &amp; White-Labeling</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Dedicated SLA Cloud Instance</li>
                  </ul>
                </div>
                <a
                  href="https://wa.me/?text=Hello%20SuperAdmin%2C%20we%20want%20to%20upgrade%20our%20institution%20to%20Enterprise%20Multi-Campus%20(%E2%82%B989%2C999%2Fyear)."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition text-center block"
                >
                  Contact Enterprise
                </a>
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-slate-200">Need instant plan activation or an institutional invoice?</span>
                <p className="text-[11px] text-slate-400">SuperAdmin will verify your school and activate your subscription in real time.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://wa.me/?text=Hello%20SuperAdmin%20ALLCORE%2C%20we%20need%20immediate%20plan%20activation%20for%20our%20school%20ERP."
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Instant SuperAdmin WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
