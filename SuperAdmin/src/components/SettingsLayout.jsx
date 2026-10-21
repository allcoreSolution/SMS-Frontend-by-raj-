import React from 'react';
import { 
  Settings, SlidersHorizontal, Bell, 
  MessageSquare, Mail, Send, Volume2, Wallet, 
  LayoutList, BrainCircuit, Camera, Plug, HeartPulse,
  ExternalLink, Palette, CreditCard, Monitor,
  Fingerprint, UserCheck, MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsLayout({ children, activeTab = 'overview' }) {
  const navigate = useNavigate();

  const getMenuClass = (id) => {
    if (activeTab === id) {
      return "px-4 py-2.5 bg-blue-50/80 cursor-pointer flex items-center justify-between group border-l-3 border-blue-600 transition-colors";
    }
    return "px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors";
  };

  const getTextClass = (id) => {
    if (activeTab === id) return "flex items-center gap-3 text-xs flex-1 font-bold text-blue-600";
    return "flex items-center gap-3 text-xs font-semibold text-gray-700 group-hover:text-gray-900";
  };

  const getIconClass = (id, baseColor = "text-gray-400 group-hover:text-gray-600") => {
    if (activeTab === id) return "w-4 h-4 text-blue-600 flex-shrink-0";
    return `w-4 h-4 ${baseColor} flex-shrink-0`;
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-white">
      
      {/* Left Inner Sidebar - Full Height */}
      <div className="w-full lg:w-[260px] bg-white border-r border-gray-200/80 flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="w-8 h-8 bg-blue-600 rounded-none-none flex items-center justify-center text-white shadow-xs">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900 leading-tight">Settings</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">COMMAND CENTER</p>
          </div>
        </div>

        <div className="py-2 flex-1 space-y-0.5">
          
          <div onClick={() => navigate('/settings-center')} className={getMenuClass('overview')}>
            <div className={getTextClass('overview')}>
              <svg className={getIconClass('overview')} viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              Overview
            </div>
          </div>

          <div className="mt-3 mb-1 px-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">
            Look & Feel
          </div>

          <div onClick={() => navigate('/settings-appearance')} className={getMenuClass('appearance')}>
            <div className={getTextClass('appearance')}>
              <Palette className={getIconClass('appearance')} fill="none" />
              Appearance
            </div>
          </div>

          <div onClick={() => navigate('/settings-branding')} className={getMenuClass('branding')}>
            <div className={getTextClass('branding')}>
              <Fingerprint className={getIconClass('branding')} fill="none" />
              App Branding
            </div>
          </div>

          <div onClick={() => navigate('/settings-terminology')} className={getMenuClass('wording')}>
            <div className={getTextClass('wording')}>
              <svg className={getIconClass('wording')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
              Academic Wording
            </div>
          </div>

          <div onClick={() => navigate('/settings-dashboard-themes')} className={getMenuClass('themes')}>
            <div className={getTextClass('themes')}>
              <svg className={getIconClass('themes')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard Themes
            </div>
          </div>

          <div onClick={() => navigate('/settings-login-designs')} className={getMenuClass('login-designs')}>
            <div className={getTextClass('login-designs')}>
              <Monitor className={getIconClass('login-designs')} fill="none" />
              Login Page Designs
            </div>
          </div>

          <div className="mt-4 mb-1 px-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">
            Platform
          </div>

          <div onClick={() => navigate('/settings-general')} className={getMenuClass('general')}>
            <div className={getTextClass('general')}>
              <SlidersHorizontal className={getIconClass('general')} fill="none" />
              General
            </div>
          </div>

          <div onClick={() => navigate('/settings-registration')} className={getMenuClass('registration')}>
            <div className={getTextClass('registration')}>
              <UserCheck className={getIconClass('registration')} fill="none" />
              Registration & Security
            </div>
          </div>

          <div onClick={() => navigate('/settings-subscriptions')} className={getMenuClass('subscriptions')}>
            <div className={getTextClass('subscriptions')}>
              <svg className={getIconClass('subscriptions')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24"></path><path d="M21 3v9h-9"></path></svg>
              Subscriptions
            </div>
          </div>

          <div onClick={() => navigate('/settings-app-distribution')} className={getMenuClass('app-dist')}>
            <div className={getTextClass('app-dist')}>
              <svg className={getIconClass('app-dist')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
              App Distribution
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-payment-settings')} className={getMenuClass('payment-settings')}>
            <div className={getTextClass('payment-settings')}>
              <CreditCard className={getIconClass('payment-settings')} fill="none" />
              Payment Settings
            </div>
          </div>

          <div className="mt-4 mb-1 px-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">
            Payments & Messaging
          </div>

          <div onClick={() => navigate('/settings-payment-gateways')} className={getMenuClass('payment-gateways')}>
            <div className={getTextClass('payment-gateways')}>
              <CreditCard className={getIconClass('payment-gateways')} fill="none" />
              Payment Gateways
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>
          
          <div onClick={() => navigate('/settings-whatsapp')} className={getMenuClass('whatsapp')}>
            <div className={getTextClass('whatsapp')}>
              <MessageCircle className={getIconClass('whatsapp')} fill="none" />
              WhatsApp Gateway
            </div>
          </div>

          <div onClick={() => navigate('/settings-sms-gateways')} className={getMenuClass('sms-gateways')}>
            <div className={getTextClass('sms-gateways')}>
              <MessageSquare className={getIconClass('sms-gateways')} fill="none" />
              SMS Gateways
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>
          
          <div onClick={() => navigate('/settings-mail-smtp')} className={getMenuClass('mail-smtp')}>
            <div className={getTextClass('mail-smtp')}>
              <Mail className={getIconClass('mail-smtp')} fill="none" />
              Mail (SMTP)
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-push-notif')} className={getMenuClass('push-notif')}>
            <div className={getTextClass('push-notif')}>
              <Bell className={`w-4 h-4 ${activeTab === 'push-notif' ? 'text-blue-600' : 'text-amber-500'}`} />
              Push Notifications
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-telegram')} className={getMenuClass('telegram')}>
            <div className={getTextClass('telegram')}>
              <Send className={getIconClass('telegram')} fill="none" />
              Telegram Bot
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-notif-types')} className={getMenuClass('notif-types')}>
            <div className={getTextClass('notif-types')}>
              <Volume2 className={getIconClass('notif-types')} fill="none" />
              Notification Types
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div className="mt-4 mb-1 px-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">
            Communications
          </div>

          <div onClick={() => navigate('/settings-comms-wallet')} className={getMenuClass('comms-wallet')}>
            <div className={getTextClass('comms-wallet')}>
              <Wallet className={getIconClass('comms-wallet')} fill="none" />
              Comms Wallet
            </div>
          </div>

          {/* Comms Wallet Sub-items */}
          <div onClick={() => navigate('/settings-comms-wallet')} className={`pl-8 ${getMenuClass('comms-wallet-overview')}`}>
            <div className={getTextClass('comms-wallet-overview')}>
              <svg className={getIconClass('comms-wallet-overview')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
              Wallet Oversight
            </div>
          </div>

          <div onClick={() => navigate('/comms/rate-cards')} className={`pl-8 ${getMenuClass('comms-wallet-rates')}`}>
            <div className={getTextClass('comms-wallet-rates')}>
              <svg className={getIconClass('comms-wallet-rates')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              Rate Cards
            </div>
          </div>

          <div onClick={() => navigate('/settings-meta-dlt')} className={`pl-8 ${getMenuClass('comms-wallet-meta')}`}>
            <div className={getTextClass('comms-wallet-meta')}>
              <Settings className={getIconClass('comms-wallet-meta')} fill="none" />
              Meta / DLT Config
            </div>
          </div>

          <div className="mt-4 mb-1 px-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">
            Advanced
          </div>

          <div onClick={() => navigate('/settings-menu')} className={getMenuClass('menu-builder')}>
            <div className={getTextClass('menu-builder')}>
              <LayoutList className={getIconClass('menu-builder')} fill="none" />
              Menu Builder
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-ai-mgmt')} className={getMenuClass('ai-mgmt')}>
            <div className={getTextClass('ai-mgmt')}>
              <BrainCircuit className={getIconClass('ai-mgmt')} fill="none" />
              AI Management
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-face-vectors')} className={getMenuClass('face-vectors')}>
            <div className={getTextClass('face-vectors')}>
              <Camera className={getIconClass('face-vectors')} fill="none" />
              Face Vectors
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-api-docs')} className={getMenuClass('api-docs')}>
            <div className={getTextClass('api-docs')}>
              <Plug className={getIconClass('api-docs')} fill="none" />
              API Documentation
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

          <div onClick={() => navigate('/settings-server-health')} className={getMenuClass('server-health')}>
            <div className={getTextClass('server-health')}>
              <HeartPulse className={getIconClass('server-health')} fill="none" />
              Server Health
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </div>

        </div>
      </div>

      {/* Right Main Content (Full height & width) */}
      <div className="flex-1 bg-[#f8fafc] flex flex-col overflow-y-auto">
        {children}
      </div>

    </div>
  );
}
