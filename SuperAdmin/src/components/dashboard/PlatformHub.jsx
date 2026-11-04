import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Plus, Users, Headphones, ClipboardList,
  BarChart2, CalendarDays, Layers, CreditCard, Banknote,
  Wallet, PhoneCall, MessageSquare, LineChart,
  Layout, Palette, FileText, Menu, BookOpen,
  Map, Award, Brush, LayoutTemplate, Smartphone,
  Activity, ScanFace, Shield, Server, RefreshCw,
  HardDrive, Database, Clock, Code, Settings, Bell, Key, Search, ShoppingBag
} from 'lucide-react';

const tools = [
  { name: 'Schools', icon: Building2, color: 'text-blue-500', path: '/schools', category: 'Schools' },
  { name: 'Add School', icon: Plus, color: 'text-green-500', path: '/schools/add', category: 'Schools' },
  { name: 'Team', icon: Users, color: 'text-purple-500', path: '/team', category: 'Schools' },
  { name: 'Support Desk', icon: Headphones, color: 'text-red-500', path: '/support', category: 'Schools' },
  { name: 'Onboarding Templates', icon: ClipboardList, color: 'text-orange-500', path: '/onboarding-templates', category: 'Schools' },
  { name: 'Schools Report', icon: BarChart2, color: 'text-teal-500', path: '/schools-report', category: 'Schools' },
  { name: 'Attendance Report', icon: CalendarDays, color: 'text-blue-400', path: '/attendance-report', category: 'Schools' },

  { name: 'Plans', icon: Layers, color: 'text-orange-500', path: '/plans', category: 'Billing' },
  { name: 'Payments', icon: CreditCard, color: 'text-green-500', path: '/payments', category: 'Billing' },
  { name: 'License Orders', icon: ShoppingBag, color: 'text-amber-500', path: '/license-orders', category: 'Billing' },
  { name: 'Payment Gateways', icon: Banknote, color: 'text-blue-500', path: '/payment-gateways', category: 'Billing' },
  { name: 'Comms Wallet', icon: Wallet, color: 'text-teal-500', path: '/comms-wallet', category: 'Billing' },
  { name: 'Comms Rates', icon: PhoneCall, color: 'text-purple-500', path: '/comms-rates', category: 'Billing' },
  { name: 'SMS Gateways', icon: MessageSquare, color: 'text-pink-500', path: '/sms-gateways', category: 'Billing' },
  { name: 'SMS Report', icon: LineChart, color: 'text-red-500', path: '/sms-report', category: 'Billing' },

  { name: 'Landing Page', icon: Layout, color: 'text-purple-500', path: '/landing-page', category: 'Website' },
  { name: 'Landing Templates', icon: Palette, color: 'text-pink-500', path: '/landing-templates', category: 'Website' },
  { name: 'Pages', icon: FileText, color: 'text-blue-500', path: '/website-pages', category: 'Website' },
  { name: 'Website Menu', icon: Menu, color: 'text-gray-500', path: '/website-menu', category: 'Website' },
  { name: 'Blog', icon: FileText, color: 'text-orange-500', path: '/blog', category: 'Content' },
  { name: 'Knowledge Base', icon: BookOpen, color: 'text-blue-400', path: '/knowledge-base', category: 'Content' },
  { name: 'Sitemap', icon: Map, color: 'text-green-500', path: '/sitemap', category: 'Website' },

  { name: 'Certificate Templates', icon: Award, color: 'text-blue-500', path: '/templates', category: 'Content' },
  { name: 'Canvas Designer', icon: Brush, color: 'text-purple-500', path: '/canvas-designer', category: 'Content' },
  { name: 'Ready Templates', icon: LayoutTemplate, color: 'text-blue-500', path: '/templates', category: 'Content' },
  { name: 'App Distribution', icon: Smartphone, color: 'text-green-500', path: '/app-distribution', category: 'Content' },
  { name: 'AI Analytics', icon: Activity, color: 'text-pink-500', path: '/ai-analytics', category: 'Content' },
  { name: 'Face Vectors', icon: ScanFace, color: 'text-teal-500', path: '/face-vectors', category: 'Content' },
  { name: 'Content Safety', icon: Shield, color: 'text-red-500', path: '/content-safety', category: 'Content' },

  { name: 'Theme Engine', icon: Palette, color: 'text-pink-500', path: '/theme-engine', category: 'Admin' },
  { name: 'Server Health', icon: Server, color: 'text-gray-500', path: '/server', category: 'Server' },
  { name: 'Software Updates', icon: RefreshCw, color: 'text-blue-500', path: '/software-updates', category: 'Server' },
  { name: 'Backup Center', icon: HardDrive, color: 'text-blue-400', path: '/backup-center', category: 'Server' },
  { name: 'Storage Center', icon: Database, color: 'text-orange-500', path: '/storage-center', category: 'Server' },
  { name: 'Infrastructure', icon: Server, color: 'text-teal-500', path: '/infrastructure', category: 'Server' },
  { name: 'Cron Monitor', icon: Clock, color: 'text-purple-500', path: '/cron-monitor', category: 'Server' },

  { name: 'API Docs', icon: Code, color: 'text-purple-500', path: '/api-docs', category: 'Admin' },
  { name: 'Settings Hub', icon: Settings, color: 'text-gray-500', path: '/settings', category: 'Admin' },
  { name: 'Appearance', icon: Palette, color: 'text-pink-500', path: '/theme-engine', category: 'Admin' },
  { name: 'Master Menus', icon: Menu, color: 'text-blue-500', path: '/master-menus', category: 'Admin' },
  { name: 'Alerts & Notifications', icon: Bell, color: 'text-orange-500', path: '/alerts', category: 'Admin' },
  { name: 'Login Report', icon: Key, color: 'text-teal-500', path: '/login-report', category: 'Admin' },
  { name: 'Engagement Report', icon: BarChart2, color: 'text-purple-500', path: '/engagement-report', category: 'Admin' },
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3.5 bg-gradient-to-r from-slate-50/50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full w-max mb-1 border border-orange-100">
              <ClipboardList className="w-3.5 h-3.5 text-orange-500" />
              Platform Hub
            </div>
            <p className="text-xs text-slate-500 font-medium">{filtered.length} tools — everything you run the platform with, in one place</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/20 focus:border-[#ff5c0a] w-full sm:w-56 transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-[11px] transition-all ${activeCategory === cat ? 'bg-[#ff5c0a] text-white shadow-sm shadow-orange-500/20' : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/60'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 overflow-y-auto h-[440px]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No tools found for "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {filtered.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(tool.path)}
                  className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:border-orange-300 hover:shadow-md cursor-pointer transition-all bg-white hover:bg-orange-50/20 h-24 group relative"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${tool.color.replace('text-', 'bg-')} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-[11px] text-slate-700 text-center font-bold leading-tight group-hover:text-[#ff5c0a] transition-colors line-clamp-2">{tool.name}</span>
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
