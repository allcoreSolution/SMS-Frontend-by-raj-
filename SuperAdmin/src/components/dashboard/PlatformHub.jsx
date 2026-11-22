import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Plus, Users, Headphones, ClipboardList,
  BarChart2, CalendarDays, Layers, CreditCard, Banknote,
  Wallet, PhoneCall, MessageSquare, LineChart,
  Layout, Palette, FileText, Menu, BookOpen,
  Map, Award, Brush, LayoutTemplate, Smartphone,
  Activity, ScanFace, Shield, Server, RefreshCw,
  HardDrive, Database, Clock, Code, Settings, Bell, Key, Search, ShoppingBag, Sparkles
} from 'lucide-react';

const tools = [
  { name: 'Schools', icon: Building2, color: 'bg-blue-500', path: '/schools', category: 'Schools' },
  { name: 'Add School', icon: Plus, color: 'bg-emerald-500', path: '/schools/add', category: 'Schools' },
  { name: 'Team', icon: Users, color: 'bg-purple-500', path: '/team', category: 'Schools' },
  { name: 'Support Desk', icon: Headphones, color: 'bg-rose-500', path: '/support', category: 'Schools' },
  { name: 'Onboarding Templates', icon: ClipboardList, color: 'bg-amber-500', path: '/onboarding-templates', category: 'Schools' },
  { name: 'Schools Report', icon: BarChart2, color: 'bg-teal-500', path: '/schools-report', category: 'Schools' },
  { name: 'Attendance Report', icon: CalendarDays, color: 'bg-indigo-500', path: '/attendance-report', category: 'Schools' },

  { name: 'Plans', icon: Layers, color: 'bg-amber-500', path: '/plans', category: 'Billing' },
  { name: 'Payments', icon: CreditCard, color: 'bg-emerald-500', path: '/payments', category: 'Billing' },
  { name: 'License Orders', icon: ShoppingBag, color: 'bg-amber-600', path: '/license-orders', category: 'Billing' },
  { name: 'Payment Gateways', icon: Banknote, color: 'bg-blue-600', path: '/payment-gateways', category: 'Billing' },
  { name: 'Comms Wallet', icon: Wallet, color: 'bg-teal-600', path: '/comms-wallet', category: 'Billing' },
  { name: 'Comms Rates', icon: PhoneCall, color: 'bg-purple-600', path: '/comms-rates', category: 'Billing' },
  { name: 'SMS Gateways', icon: MessageSquare, color: 'bg-pink-600', path: '/sms-gateways', category: 'Billing' },
  { name: 'SMS Report', icon: LineChart, color: 'bg-rose-600', path: '/sms-report', category: 'Billing' },

  { name: 'Landing Page', icon: Layout, color: 'bg-purple-500', path: '/landing-page', category: 'Website' },
  { name: 'Landing Templates', icon: Palette, color: 'bg-pink-500', path: '/landing-templates', category: 'Website' },
  { name: 'Pages', icon: FileText, color: 'bg-blue-500', path: '/website-pages', category: 'Website' },
  { name: 'Website Menu', icon: Menu, color: 'bg-slate-600', path: '/website-menu', category: 'Website' },
  { name: 'Blog', icon: FileText, color: 'bg-amber-500', path: '/blog', category: 'Content' },
  { name: 'Knowledge Base', icon: BookOpen, color: 'bg-indigo-500', path: '/knowledge-base', category: 'Content' },
  { name: 'Sitemap', icon: Map, color: 'bg-emerald-500', path: '/sitemap', category: 'Website' },

  { name: 'Certificate Templates', icon: Award, color: 'bg-blue-500', path: '/templates', category: 'Content' },
  { name: 'Canvas Designer', icon: Brush, color: 'bg-purple-500', path: '/canvas-designer', category: 'Content' },
  { name: 'Ready Templates', icon: LayoutTemplate, color: 'bg-blue-500', path: '/templates', category: 'Content' },
  { name: 'App Distribution', icon: Smartphone, color: 'bg-emerald-500', path: '/app-distribution', category: 'Content' },
  { name: 'AI Analytics', icon: Activity, color: 'bg-pink-500', path: '/ai-analytics', category: 'Content' },
  { name: 'Face Vectors', icon: ScanFace, color: 'bg-teal-500', path: '/face-vectors', category: 'Content' },
  { name: 'Content Safety', icon: Shield, color: 'bg-rose-500', path: '/content-safety', category: 'Content' },

  { name: 'Theme Engine', icon: Palette, color: 'bg-pink-500', path: '/theme-engine', category: 'Admin' },
  { name: 'Server Health', icon: Server, color: 'bg-slate-600', path: '/server', category: 'Server' },
  { name: 'Software Updates', icon: RefreshCw, color: 'bg-blue-500', path: '/software-updates', category: 'Server' },
  { name: 'Backup Center', icon: HardDrive, color: 'bg-indigo-500', path: '/backup-center', category: 'Server' },
  { name: 'Storage Center', icon: Database, color: 'bg-amber-500', path: '/storage-center', category: 'Server' },
  { name: 'Infrastructure', icon: Server, color: 'bg-teal-500', path: '/infrastructure', category: 'Server' },
  { name: 'Cron Monitor', icon: Clock, color: 'bg-purple-500', path: '/cron-monitor', category: 'Server' },

  { name: 'API Docs', icon: Code, color: 'bg-purple-600', path: '/api-docs', category: 'Admin' },
  { name: 'Settings Hub', icon: Settings, color: 'bg-slate-600', path: '/settings', category: 'Admin' },
  { name: 'Appearance', icon: Palette, color: 'bg-pink-500', path: '/theme-engine', category: 'Admin' },
  { name: 'Master Menus', icon: Menu, color: 'bg-blue-500', path: '/master-menus', category: 'Admin' },
  { name: 'Alerts & Notifications', icon: Bell, color: 'bg-amber-500', path: '/alerts', category: 'Admin' },
  { name: 'Login Report', icon: Key, color: 'bg-teal-500', path: '/login-report', category: 'Admin' },
  { name: 'Engagement Report', icon: BarChart2, color: 'bg-purple-500', path: '/engagement-report', category: 'Admin' },
];

const categories = ['All', 'Schools', 'Billing', 'Website', 'Content', 'Server', 'Admin'];

const PlatformHub = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = tools.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-3.5 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-max mb-1 border border-amber-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Platform Operating Hub</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{filtered.length} central modules — everything to operate the cloud ecosystem</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search tools & modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 w-full sm:w-60 transition-all placeholder:text-slate-400"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-amber-400 text-slate-950 shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 sm:p-5 overflow-y-auto h-[440px]">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Search className="w-9 h-9 mx-auto mb-2 opacity-30 text-amber-500" />
            <p className="text-sm font-semibold">No tools found matching "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-3.5">
            {filtered.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(tool.path)}
                  className="flex flex-col items-center justify-center p-3.5 border border-slate-100 rounded-2xl hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-300 bg-white hover:bg-amber-50/15 h-26 group relative"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${tool.color} text-white shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-[11px] text-slate-700 text-center font-black leading-tight group-hover:text-amber-600 transition-colors line-clamp-2">{tool.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformHub;
