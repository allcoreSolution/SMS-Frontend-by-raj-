import React, { useState } from 'react';
import { 
  Settings, SlidersHorizontal, Bell, 
  MessageSquare, Mail, Send, Volume2, Wallet, 
  LayoutList, BrainCircuit, Camera, Plug, HeartPulse,
  ExternalLink, Palette, CreditCard, Monitor,
  Fingerprint, UserCheck, MessageCircle, ChevronDown, Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navCategories = [
  {
    category: 'Overview',
    items: [
      { id: 'overview', to: '/settings-center', label: 'Overview', icon: Settings }
    ]
  },
  {
    category: 'Look & Feel',
    items: [
      { id: 'appearance', to: '/settings-appearance', label: 'Appearance & Themes', icon: Palette },
      { id: 'branding', to: '/settings-branding', label: 'App Branding', icon: Fingerprint },
      { id: 'wording', to: '/settings-terminology', label: 'Academic Terminology', icon: SlidersHorizontal },
      { id: 'themes', to: '/settings-dashboard-themes', label: 'Dashboard Themes', icon: Palette },
      { id: 'login-designs', to: '/settings-login-designs', label: 'Login Page Designs', icon: Monitor }
    ]
  },
  {
    category: 'Platform & Security',
    items: [
      { id: 'general', to: '/settings-general', label: 'General Configuration', icon: SlidersHorizontal },
      { id: 'registration', to: '/settings-registration', label: 'Registration & Security', icon: UserCheck },
      { id: 'subscriptions', to: '/settings-subscriptions', label: 'Subscriptions & Tiers', icon: CreditCard },
      { id: 'app-dist', to: '/settings-app-distribution', label: 'App Distribution', icon: ExternalLink, external: true },
      { id: 'payment-settings', to: '/settings-payment-settings', label: 'Payment Settings', icon: CreditCard }
    ]
  },
  {
    category: 'Gateways & Comms',
    items: [
      { id: 'payment-gateways', to: '/settings-payment-gateways', label: 'Payment Gateways', icon: CreditCard },
      { id: 'whatsapp', to: '/settings-whatsapp', label: 'WhatsApp Gateway', icon: MessageCircle },
      { id: 'sms-gateways', to: '/settings-sms-gateways', label: 'SMS Gateways', icon: MessageSquare },
      { id: 'mail-smtp', to: '/settings-mail-smtp', label: 'Mail (SMTP) Server', icon: Mail },
      { id: 'push-notif', to: '/settings-push-notif', label: 'Push Notifications', icon: Bell },
      { id: 'telegram', to: '/settings-telegram', label: 'Telegram Bot', icon: Send },
      { id: 'notif-types', to: '/settings-notif-types', label: 'Notification Types', icon: Volume2 }
    ]
  },
  {
    category: 'Comms Wallet',
    items: [
      { id: 'comms-wallet', to: '/settings-comms-wallet', label: 'Wallet Oversight', icon: Wallet },
      { id: 'comms-wallet-rates', to: '/comms/rate-cards', label: 'Rate Cards', icon: CreditCard },
      { id: 'comms-wallet-meta', to: '/settings-meta-dlt', label: 'Meta / DLT Config', icon: Settings }
    ]
  },
  {
    category: 'Advanced Services',
    items: [
      { id: 'menu-builder', to: '/settings-menu', label: 'Menu Builder', icon: LayoutList },
      { id: 'ai-mgmt', to: '/settings-ai-mgmt', label: 'AI Management', icon: BrainCircuit },
      { id: 'face-vectors', to: '/settings-face-vectors', label: 'Face Vectors AI', icon: Camera },
      { id: 'api-docs', to: '/settings-api-docs', label: 'API Documentation', icon: Plug },
      { id: 'server-health', to: '/settings-server-health', label: 'Server Health', icon: HeartPulse }
    ]
  }
];

export default function SettingsLayout({ children, activeTab = 'overview' }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Find active item name
  let activeItemName = 'Overview';
  for (const group of navCategories) {
    const found = group.items.find(i => i.id === activeTab);
    if (found) {
      activeItemName = found.label;
      break;
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#f8fafc]">
      
      {/* Mobile Header / Quick Category Switcher (< lg) */}
      <div className="lg:hidden bg-white border-b border-slate-200/80 p-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
              <Settings className="w-4 h-4" />
            </span>
            <div className="text-xs">
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Settings Module</span>
              <span className="font-bold text-slate-800">{activeItemName}</span>
            </div>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            <span>Navigation</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileMenuOpen ? 'rotate-180 text-orange-500' : ''}`} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 max-h-[60vh] overflow-y-auto">
            {navCategories.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  {group.category}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.to);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-semibold transition-all ${
                        activeTab === item.id 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-xs' 
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Left Inner Sidebar (visible >= lg) */}
      <aside className="hidden lg:flex w-[260px] bg-white border-r border-slate-200/80 flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-xs">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 leading-tight">Settings Hub</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Controls</p>
          </div>
        </div>

        <nav className="p-3 flex-1 space-y-4">
          {navCategories.map((group, idx) => (
            <div key={idx}>
              <div className="px-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                {group.category}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.to)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-semibold transition-all ${
                        isActive
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.external && <ExternalLink className="w-3 h-3 text-slate-300" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
