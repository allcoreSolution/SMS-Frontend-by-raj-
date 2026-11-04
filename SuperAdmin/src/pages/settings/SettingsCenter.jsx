import React from 'react';
import { 
  Lock, SlidersHorizontal, Bell, Settings, Palette, Fingerprint, 
  Settings2, UserCheck, CreditCard, MessageCircle, AlertTriangle, 
  ArrowUpRight, ChevronRight, Sparkles, CheckCircle2, ShieldCheck, Mail
} from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import { useNavigate } from 'react-router-dom';

const quickCards = [
  {
    to: '/settings-appearance',
    title: 'Appearance & Themes',
    desc: 'Dashboard palettes, dark mode, sidebar branding & typography presets.',
    icon: Palette,
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  {
    to: '/settings-branding',
    title: 'App Branding',
    desc: 'White-label mobile applications — launcher logo, splash assets & brand colors.',
    icon: Fingerprint,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50'
  },
  {
    to: '/settings-general',
    title: 'General Configuration',
    desc: 'Platform name, legal footer, default currency, timezones & regional locales.',
    icon: Settings2,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    to: '/settings-registration',
    title: 'Registration & Security',
    desc: 'Self-serve school signup rules, 2FA enforcement, captcha & biometric login.',
    icon: UserCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    to: '/settings-payment-gateways',
    title: 'Payment Gateways',
    desc: 'Direct integration with Razorpay, Cashfree, Stripe, PayU, and 30+ regional aggregators.',
    icon: CreditCard,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    to: '/settings-whatsapp',
    title: 'WhatsApp Gateway',
    desc: 'Official Meta Cloud API or Baileys webhook routing for automated alerts & receipts.',
    icon: MessageCircle,
    color: 'text-teal-500',
    bg: 'bg-teal-50'
  },
  {
    to: '/settings-mail-smtp',
    title: 'Mail (SMTP) Server',
    desc: 'System transactional email relay (SendGrid, Amazon SES, Postmark, custom SMTP).',
    icon: Mail,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    to: '/settings-subscriptions',
    title: 'Subscriptions & Tiers',
    desc: 'Freemium vs Paid tier entitlements, module access quotas & auto-expiry rules.',
    icon: ShieldCheck,
    color: 'text-rose-500',
    bg: 'bg-rose-50'
  }
];

export default function SettingsCenter() {
  const navigate = useNavigate();

  return (
    <SettingsLayout activeTab="overview">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto space-y-6">

        {/* Hero Hub Banner */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Platform Settings Hub</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-md uppercase">
                  Central Node
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage global white-labeling, authentication gateways, hardware integrations & billing protocols
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start md:self-auto">
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[70px]">
              <div className="text-base sm:text-lg font-black text-slate-800 leading-none mb-0.5">25</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Modules</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[70px]">
              <div className="text-base sm:text-lg font-black text-emerald-600 leading-none mb-0.5">100%</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Healthy</div>
            </div>
          </div>
        </div>

        {/* Setup Health & Attention Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Circular Progress Gauge */}
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full text-orange-500">
              <path
                className="text-slate-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-orange-500"
                strokeDasharray="92, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-slate-800">
              92%
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Platform Configuration Health: 92% Complete</h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              11 of 12 primary integration channels active. Configure optional Meta DLT headers or Push keys for total coverage.
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => navigate('/settings-push-notif')} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-all"
              >
                <Bell className="w-3.5 h-3.5" /> Push Notifications
              </button>
              <button 
                onClick={() => navigate('/settings-meta-dlt')} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <Settings className="w-3.5 h-3.5" /> Meta / DLT Config
              </button>
            </div>
          </div>
        </div>

        {/* Quick Setup Label */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Core Configuration Suites</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{quickCards.length} Managed Suites</span>
        </div>

        {/* Quick Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {quickCards.map((card, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(card.to)} 
              className="bg-white hover:border-orange-200 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                    {card.title}
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SettingsLayout>
  );
}
