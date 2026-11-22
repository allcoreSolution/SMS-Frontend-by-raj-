import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Plus, Users, Headphones, ClipboardList,
  BarChart2, CalendarDays, Layers, CreditCard, Banknote,
  Wallet, PhoneCall, MessageSquare, LineChart,
  Layout, Palette, FileText, Menu, BookOpen,
  Map, Award, Brush, LayoutTemplate, Smartphone,
  Activity, Shield, Server, RefreshCw,
  HardDrive, Database, Clock, Code, Settings, Bell, Key, Search, ShoppingBag, Sparkles,
  Megaphone, ShieldCheck, Zap, ArrowRight, Printer
} from 'lucide-react';
import GstInvoiceModal from '../GstInvoiceModal';
import BroadcastModal from '../BroadcastModal';

const coreActions = [
  { 
    name: 'Schools Registry', 
    desc: 'Manage all connected school campuses & branches', 
    icon: Building2, 
    color: 'bg-indigo-500', 
    badge: 'Core', 
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200', 
    path: '/schools' 
  },
  { 
    name: 'Add New School', 
    desc: 'Instant tenant provisioning & admin onboarding', 
    icon: Plus, 
    color: 'bg-emerald-500', 
    badge: 'Fast Setup', 
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    path: '/schools/add' 
  },
  { 
    name: 'Audit & Governance', 
    desc: 'Tamper-proof immutable ledger of admin actions', 
    icon: ShieldCheck, 
    color: 'bg-rose-500', 
    badge: 'Security', 
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200', 
    path: '/audit-logs' 
  },
  { 
    name: 'SaaS Plans & Tiers', 
    desc: 'Configure student quotas, add-ons and pricing', 
    icon: Layers, 
    color: 'bg-amber-500', 
    badge: 'Pricing', 
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200', 
    path: '/plans' 
  },
  { 
    name: 'License Orders & GST', 
    desc: 'View subscription invoices & generate tax receipts', 
    icon: ShoppingBag, 
    color: 'bg-blue-600', 
    badge: 'Billing', 
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200', 
    path: '/license-orders',
    isInvoiceTrigger: true
  },
  { 
    name: 'Broadcast Dispatcher', 
    desc: 'Push emergency announcements across all portals', 
    icon: Megaphone, 
    color: 'bg-amber-600', 
    badge: 'Alerts', 
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200', 
    isBroadcastTrigger: true
  },
  { 
    name: 'Support Tickets Desk', 
    desc: 'Handle multi-school queries and bug reports', 
    icon: Headphones, 
    color: 'bg-purple-500', 
    badge: 'Help Desk', 
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200', 
    path: '/support' 
  },
  { 
    name: 'Server Infrastructure', 
    desc: 'RAM heap, cron jobs, backups & storage nodes', 
    icon: Server, 
    color: 'bg-slate-700', 
    badge: 'Telemetry', 
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200', 
    path: '/server' 
  },
];

const secondaryTools = [
  { name: 'SuperAdmin Team', icon: Users, color: 'bg-purple-500', path: '/team', category: 'Operations' },
  { name: 'Payment Gateways', icon: Banknote, color: 'bg-emerald-600', path: '/payment-gateways', category: 'Billing' },
  { name: 'Comms Wallet', icon: Wallet, color: 'bg-teal-600', path: '/comms-wallet', category: 'Billing' },
  { name: 'SMS Gateways', icon: MessageSquare, color: 'bg-pink-600', path: '/sms-gateways', category: 'Billing' },
  { name: 'Fee Collections', icon: LineChart, color: 'bg-blue-600', path: '/reports/fee-collections', category: 'Billing' },
  { name: 'Schools Usage', icon: BarChart2, color: 'bg-teal-500', path: '/reports/schools-usage', category: 'Operations' },
  { name: 'Login Logs', icon: Key, color: 'bg-indigo-500', path: '/reports/login-logs', category: 'Security' },
  { name: 'Backup Center', icon: HardDrive, color: 'bg-indigo-500', path: '/backup-center', category: 'System' },
  { name: 'Storage Center', icon: Database, color: 'bg-amber-500', path: '/storage-center', category: 'System' },
  { name: 'Cron Monitor', icon: Clock, color: 'bg-purple-500', path: '/cron-monitor', category: 'System' },
  { name: 'Software Updates', icon: RefreshCw, color: 'bg-blue-500', path: '/software-updates', category: 'System' },
  { name: 'Settings Hub', icon: Settings, color: 'bg-slate-600', path: '/settings-center', category: 'Operations' },
  { name: 'Master Menus', icon: Menu, color: 'bg-blue-500', path: '/master-menus', category: 'Security' },
  { name: 'Landing Builder', icon: Layout, color: 'bg-pink-500', path: '/landing-page', category: 'Operations' },
  { name: 'Knowledge Base', icon: BookOpen, color: 'bg-indigo-500', path: '/knowledge-base', category: 'Operations' }
];

const categories = ['All', 'Operations', 'Billing', 'Security', 'System'];

export default function PlatformHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showGstModal, setShowGstModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const filteredSecondary = secondaryTools.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleActionClick = (item) => {
    if (item.isInvoiceTrigger) {
      setShowGstModal(true);
    } else if (item.isBroadcastTrigger) {
      setShowBroadcastModal(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col h-full overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-3 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-max mb-1 border border-amber-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Platform Command Deck</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Streamlined mission control for multi-campus cloud governance
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Filter modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 w-full sm:w-60 transition-all placeholder:text-slate-400"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 overflow-y-auto space-y-6">
        
        {/* 1. Core Operations High-Power Deck */}
        {!search && activeCategory === 'All' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Primary Executive Actions
              </span>
              <span className="text-[10px] text-amber-600 font-bold">100% Free & Unlimited Built-in</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {coreActions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleActionClick(item)}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between h-36"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${item.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                        <span>{item.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Secondary Tools with Category Tabs */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              System Modules & Services
            </span>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {filteredSecondary.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(tool.path)}
                  className="flex items-center gap-2.5 p-2.5 border border-slate-100 rounded-xl hover:border-amber-300 hover:bg-amber-50/20 cursor-pointer transition-all group bg-white"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tool.color} text-white shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-amber-600 transition-colors">
                      {tool.name}
                    </p>
                    <p className="text-[9.5px] text-slate-400 font-medium">{tool.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* GST Tax Invoice Generator Modal */}
      <GstInvoiceModal
        isOpen={showGstModal}
        onClose={() => setShowGstModal(false)}
        invoiceData={{
          invoiceNumber: `INV-ACS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          invoiceDate: new Date(),
          seller: {
            companyName: 'ALL CORE SOLUTION',
            tagline: 'Enterprise Cloud ERP & SaaS Platforms',
            gstin: '07AAAAA0000A1Z5',
            hsnSac: '998313',
            address: 'Tower B, Tech City, New Delhi - 110001, India',
            supportEmail: 'billing@allcoresolution.com',
            phone: '+91 98765 43210'
          },
          buyer: {
            schoolName: 'All Registered Campuses',
            schoolCode: 'SCH-MULTI',
            email: 'admin@schoolcloud.in',
            address: 'Multi-Tenant Cloud Registry',
            gstin: 'Unregistered'
          },
          items: [
            {
              description: 'Annual Cloud SaaS License & Campus Automation Engine',
              hsnSac: '998313',
              taxableAmount: 50000,
              cgstRate: '9%',
              cgstAmount: 4500,
              sgstRate: '9%',
              sgstAmount: 4500,
              totalAmount: 59000
            }
          ],
          financials: {
            taxableAmount: 50000,
            cgst: 4500,
            sgst: 4500,
            totalGst: 9000,
            totalPayable: 59000,
            currency: 'INR'
          },
          digitalSignature: {
            authorizedSignatory: 'RAJ YADAV',
            title: 'Founder & Chief Architect',
            brand: 'ALL CORE SOLUTION'
          }
        }}
      />

      {/* Broadcast Dispatcher Modal */}
      <BroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
      />
    </div>
  );
}
