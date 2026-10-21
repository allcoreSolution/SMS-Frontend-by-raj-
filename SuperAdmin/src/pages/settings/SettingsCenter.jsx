import React from 'react';
import { Lock, SlidersHorizontal, Bell, Settings, Palette, Fingerprint, Settings2, UserCheck, CreditCard, MessageCircle, AlertTriangle } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import { useNavigate } from 'react-router-dom';

export default function SettingsCenter() {
  const navigate = useNavigate();
  return (
    <SettingsLayout activeTab="overview">
      <div className="flex-1 overflow-y-auto">
      <div className="p-8 pb-8 max-w-[1150px] mx-auto w-full">


        {/* Big Stat Card */}
        <div className="bg-white border border-gray-100 rounded-none-none p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-none-none bg-blue-50 flex items-center justify-center flex-shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Everything, in one place</h3>
              <p className="text-sm text-gray-500">Configure your whole platform from one panel — common settings save here, advanced tools open their workspace.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="bg-gray-50 border border-gray-100 rounded-none-none px-4 py-3 text-center min-w-[90px]">
              <div className="text-xl font-bold text-blue-600 leading-none mb-1">25</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Sections</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-none-none px-4 py-3 text-center min-w-[90px]">
              <div className="text-xl font-bold text-blue-600 leading-none mb-1">12</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Edit Here</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-none-none px-4 py-3 text-center min-w-[90px]">
              <div className="text-xl font-bold text-blue-600 leading-none mb-1">13</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Workspaces</div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white border border-gray-100 rounded-none-none p-6 shadow-sm mb-8 flex items-center gap-6">
          {/* Circular Gauge Mockup */}
          <div className="relative w-[70px] h-[70px] flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full text-amber-500 drop-shadow-sm">
              <path
                className="text-gray-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-amber-500"
                strokeDasharray="83, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-[15px] text-gray-800">
              83%
            </div>
          </div>
          
          <div>
            <h3 className="text-[17px] font-bold text-gray-800 mb-1">Setup 83% complete</h3>
            <p className="text-sm text-gray-500 mb-3">10 of 12 key integrations configured.</p>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" strokeWidth={3} /> Needs Attention
              </span>
              <button onClick={() => navigate('/settings-push-notif')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-none-none bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200/50 transition-colors">
                <Bell className="w-3.5 h-3.5" /> Push Notifications
              </button>
              <button onClick={() => navigate('/settings-meta-dlt')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-none-none bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200/50 transition-colors">
                <Settings className="w-3.5 h-3.5" /> Meta / DLT Config
              </button>
            </div>
          </div>
        </div>

        {/* Quick Setup Label */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-4 bg-amber-400 rounded-none-none"></div>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Quick Setup</h3>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1 */}
          <div onClick={() => navigate('/settings-appearance')} className="bg-white hover:border-blue-200 border border-gray-100 rounded-none-none p-5 shadow-sm transition-colors cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-none-none bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
              <Palette className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Appearance</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Dashboard theme, dark mode, sidebar & navbar styling a...</p>
            </div>
            <div className="text-gray-300 group-hover:text-blue-500 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

          {/* Card 2 */}
          <div onClick={() => navigate('/settings-branding')} className="bg-white hover:border-blue-200 border border-gray-100 rounded-none-none p-5 shadow-sm transition-colors cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-none-none bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
              <Fingerprint className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">App Branding</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">White-label the mobile apps — name, logo and brand pal...</p>
            </div>
            <div className="text-gray-300 group-hover:text-indigo-500 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

          {/* Card 3 */}
          <div onClick={() => navigate('/settings-general')} className="bg-white hover:border-blue-200 border border-gray-100 rounded-none-none p-5 shadow-sm transition-colors cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-none-none bg-cyan-50 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-100 transition-colors">
              <Settings2 className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-gray-800 mb-1 group-hover:text-cyan-600 transition-colors">General</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Platform name, footer, default currency and country.</p>
            </div>
            <div className="text-gray-300 group-hover:text-cyan-500 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

          {/* Card 4 */}
          <div onClick={() => navigate('/settings-registration')} className="bg-white hover:border-blue-200 border border-gray-100 rounded-none-none p-5 shadow-sm transition-colors cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-none-none bg-sky-50 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
              <UserCheck className="w-5 h-5 text-sky-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-gray-800 mb-1 group-hover:text-sky-600 transition-colors">Registration & Security</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Email/OTP verification, captcha and face login.</p>
            </div>
            <div className="text-gray-300 group-hover:text-sky-500 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

          {/* Card 5 */}
          <div onClick={() => navigate('/settings-payment-gateways')} className="bg-white hover:border-blue-200 border border-gray-100 rounded-none-none p-5 shadow-sm transition-colors cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-none-none bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
              <CreditCard className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Payment Gateways</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Configure the 40+ payment gateways schools can use to...</p>
            </div>
            <div className="text-gray-300 group-hover:text-blue-500 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>

          {/* Card 6 */}
          <div onClick={() => navigate('/settings-whatsapp')} className="bg-white hover:border-blue-200 border border-gray-100 rounded-none-none p-5 shadow-sm transition-colors cursor-pointer group flex items-start gap-4">
            <div className="w-10 h-10 rounded-none-none bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">WhatsApp Gateway</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Platform WhatsApp API URL, key and sender for OTP & al...</p>
            </div>
            <div className="text-gray-300 group-hover:text-emerald-500 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
      </div>
    </SettingsLayout>
  );
}
