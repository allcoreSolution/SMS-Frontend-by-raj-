import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, ChevronDown, ChevronUp, Info, X, Sparkles, Puzzle, 
  Cpu, MessageSquare, HardDrive, Users, Smartphone, Network, Navigation, 
  Edit3, Trash2, CheckCircle2, DollarSign, Layers, ShieldCheck, 
  ArrowUpRight, Filter, Check, TrendingUp, Zap
} from 'lucide-react';
import Swal from 'sweetalert2';

const defaultAddons = [
  {
    id: 1,
    name: 'WhatsApp Business API Gateway',
    desc: 'Automated fee receipts, attendance alerts & homework broadcasts via Meta Cloud API',
    type: 'Channel',
    plans: 'Growth & Enterprise',
    grants: '15,000 WhatsApp Msg/mo + Verified Templates',
    monthly: 999,
    yearly: 9990,
    status: 'Active',
    subscribers: 24,
  },
  {
    id: 2,
    name: 'Biometric & RFID Hardware Sync',
    desc: 'Real-time sync daemon for eSSL, Realtime & ZKTeco facial/fingerprint terminals',
    type: 'Module',
    plans: 'All Plans',
    grants: 'Unlimited Terminal Webhooks + Push Sync',
    monthly: 1499,
    yearly: 14990,
    status: 'Active',
    subscribers: 42,
  },
  {
    id: 3,
    name: 'AI Question Paper & Report Cards',
    desc: 'Gemini 2.5 Flash engine for auto-generating CBSE/ICSE exam papers & rubric evaluation',
    type: 'Module',
    plans: 'Enterprise Suite',
    grants: '5,000 AI Generations/mo + LaTeX math formatting',
    monthly: 1999,
    yearly: 19990,
    status: 'Active',
    subscribers: 18,
  },
  {
    id: 4,
    name: 'Live GPS Bus Fleet Telematics',
    desc: 'Driver GPS telemetry app, speed alerts, geofencing & parent live bus radar',
    type: 'Module',
    plans: 'Growth & Enterprise',
    grants: 'Up to 25 Buses + 60s live map polling',
    monthly: 1299,
    yearly: 12990,
    status: 'Active',
    subscribers: 31,
  },
  {
    id: 5,
    name: 'Encrypted S3 Document Vault (+250 GB)',
    desc: 'Enterprise media & report archive storage with AES-256 cloud encryption',
    type: 'Storage',
    plans: 'All Plans',
    grants: '250 GB High-Speed AWS S3 Cloud Storage',
    monthly: 599,
    yearly: 5990,
    status: 'Active',
    subscribers: 56,
  },
  {
    id: 6,
    name: 'Staff & Coordinator Seats (+15 Accounts)',
    desc: 'Additional role-based concurrent login licenses for non-teaching staff & HODs',
    type: 'Seat',
    plans: 'Standard & Growth',
    grants: '15 Staff Accounts with granular RBAC matrix',
    monthly: 499,
    yearly: 4990,
    status: 'Active',
    subscribers: 37,
  },
  {
    id: 7,
    name: 'DLT Verified SMS Bulk Pack (50K)',
    desc: 'Direct SMPP gateway connectivity for instant SMS OTPs & emergency school alerts',
    type: 'Channel',
    plans: 'All Plans',
    grants: '50,000 High-Priority SMS Credits / Year',
    monthly: 1199,
    yearly: 11990,
    status: 'Active',
    subscribers: 29,
  },
  {
    id: 8,
    name: 'Multi-Branch Central Network HQ',
    desc: 'Unified multi-campus reporting, inter-school student transfers & centralized fee ledger',
    type: 'Flat',
    plans: 'Enterprise Suite',
    grants: 'Central HQ Dashboard + Up to 5 Linked Branches',
    monthly: 3499,
    yearly: 34990,
    status: 'Active',
    subscribers: 12,
  },
];

const emptyForm = {
  name: '',
  desc: '',
  type: 'Module',
  plans: 'All Plans',
  grants: '',
  monthly: '',
  yearly: '',
  status: 'Active',
};

const typeConfig = {
  Module: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    dot: 'bg-indigo-500',
    icon: Puzzle,
  },
  Channel: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
    icon: MessageSquare,
  },
  Storage: {
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    dot: 'bg-cyan-500',
    icon: HardDrive,
  },
  Seat: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    icon: Users,
  },
  Flat: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
    dot: 'bg-purple-500',
    icon: Network,
  },
};

export default function PlanAddons() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [addons, setAddons] = useState(() => {
    try {
      const saved = localStorage.getItem('plan_addons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return defaultAddons;
    } catch {
      return defaultAddons;
    }
  });

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem('plan_addons', JSON.stringify(addons));
  }, [addons]);

  // Compute metrics
  const metrics = useMemo(() => {
    const total = addons.length;
    const active = addons.filter(a => a.status === 'Active').length;
    const totalSubs = addons.reduce((sum, a) => sum + (Number(a.subscribers) || 0), 0);
    const estMRR = addons.reduce((sum, a) => {
      const price = Number(a.monthly) || 0;
      const subs = Number(a.subscribers) || 1;
      return sum + (price * subs);
    }, 0);
    return { total, active, totalSubs, estMRR };
  }, [addons]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Add-on name is required.',
        confirmButtonColor: '#f97316'
      });
    }
    if (form.monthly === '' || form.monthly === null || Number(form.monthly) < 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid monthly price (0 or more).',
        confirmButtonColor: '#f97316'
      });
    }

    const payload = {
      name: form.name.trim(),
      desc: form.desc.trim() || 'Custom modular extension for school tenants',
      type: form.type || 'Module',
      plans: form.plans.trim() || 'All Plans',
      grants: form.grants.trim() || 'Standard Feature Entitlement',
      monthly: Number(form.monthly) || 0,
      yearly: Number(form.yearly) || (Number(form.monthly) * 10),
      status: form.status || 'Active',
      subscribers: editItem ? (editItem.subscribers || 0) : 0,
    };

    if (editItem) {
      setAddons((prev) => prev.map((a) => (a.id === editItem.id ? { ...a, ...payload } : a)));
      Swal.fire({
        icon: 'success',
        title: 'Add-on Updated!',
        text: `${payload.name} configuration saved successfully.`,
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      setAddons((prev) => [{ ...payload, id: Date.now() }, ...prev]);
      Swal.fire({
        icon: 'success',
        title: 'Add-on Created!',
        text: `${payload.name} is now available in plan catalogs.`,
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }

    setShowAdd(false);
    setEditItem(null);
    setForm(emptyForm);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete Add-on?',
      text: `Are you sure you want to remove "${name || 'this add-on'}"? Existing subscriptions will be archived.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl font-bold',
        cancelButton: 'rounded-xl font-bold'
      }
    }).then((r) => {
      if (r.isConfirmed) {
        setAddons((prev) => prev.filter((a) => a.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Add-on has been permanently removed.',
          timer: 1400,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  };

  const handleToggleStatus = (addon) => {
    const nextStatus = addon.status === 'Active' ? 'Inactive' : 'Active';
    setAddons((prev) => prev.map((a) => a.id === addon.id ? { ...a, status: nextStatus } : a));
    Swal.fire({
      icon: 'info',
      title: `Status: ${nextStatus}`,
      text: `"${addon.name}" is now ${nextStatus.toLowerCase()}.`,
      timer: 1400,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const openEdit = (addon) => {
    setForm({
      name: addon.name || '',
      desc: addon.desc || '',
      type: addon.type || 'Module',
      plans: addon.plans || 'All Plans',
      grants: addon.grants || '',
      monthly: String(addon.monthly ?? '').replace(/,/g, ''),
      yearly: String(addon.yearly ?? '').replace(/,/g, ''),
      status: addon.status || 'Active',
    });
    setEditItem(addon);
    setShowAdd(true);
  };

  const handleAutoYearly = () => {
    if (form.monthly) {
      const val = Math.round(Number(form.monthly) * 10);
      setForm(prev => ({ ...prev, yearly: String(val) }));
    }
  };

  const filtered = useMemo(() => {
    return addons.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        (p.name || '').toLowerCase().includes(q) ||
        (p.desc || '').toLowerCase().includes(q) ||
        (p.type || '').toLowerCase().includes(q) ||
        (p.grants || '').toLowerCase().includes(q) ||
        (p.plans || '').toLowerCase().includes(q);

      const matchType = 
        filter === 'All' ? true :
        filter === 'Modules' ? p.type === 'Module' :
        filter === 'Channels' ? p.type === 'Channel' :
        filter === 'Storage' ? p.type === 'Storage' :
        filter === 'Seats' ? p.type === 'Seat' :
        filter === 'Flat' ? p.type === 'Flat' : true;

      const matchStatus = 
        statusFilter === 'All' ? true :
        statusFilter === 'Active' ? p.status === 'Active' :
        statusFilter === 'Inactive' ? p.status === 'Inactive' : true;

      return matchSearch && matchType && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (Number(a.monthly) || 0) - (Number(b.monthly) || 0);
      if (sortBy === 'price_desc') return (Number(b.monthly) || 0) - (Number(a.monthly) || 0);
      if (sortBy === 'subscribers') return (Number(b.subscribers) || 0) - (Number(a.subscribers) || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return b.id - a.id;
    });
  }, [addons, search, filter, statusFilter, sortBy]);

  const categories = [
    { label: 'All', count: addons.length },
    { label: 'Modules', count: addons.filter((a) => a.type === 'Module').length },
    { label: 'Channels', count: addons.filter((a) => a.type === 'Channel').length },
    { label: 'Storage', count: addons.filter((a) => a.type === 'Storage').length },
    { label: 'Seats', count: addons.filter((a) => a.type === 'Seat').length },
    { label: 'Flat', count: addons.filter((a) => a.type === 'Flat').length },
  ];

  return (
    <div className="max-w-[1300px] w-full mx-auto min-h-[85vh] p-3 sm:p-5 md:p-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 border border-white/10 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SaaS Monetization & Extensibility</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Plan Add-ons & Extensions</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
              Configure modular upgrades, WhatsApp/SMS channels, extra cloud storage, and staff seat packs sold to school institutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>How Add-ons Work</span>
              {isHelpOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditItem(null);
                setForm(emptyForm);
                setShowAdd(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-orange-400/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Add-on</span>
            </button>
          </div>
        </div>

        {/* Collapsible Explainer Drawer */}
        {isHelpOpen && (
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase mb-1">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-300 font-black">1</span>
                <span>Tenant Selection</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                School admins can browse and opt-in to add-ons from their Billing & Subscriptions portal at any point in their cycle.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] text-cyan-300 font-black">2</span>
                <span>Instant Entitlement</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Features like WhatsApp keys, hardware sync APIs, and storage quotas are immediately provisioned across tenant instances.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-300 font-black">3</span>
                <span>Automated Invoicing</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Add-on costs are prorated or bundled into the school's monthly or annual recurring SaaS subscription automatically.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Catalog</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.total} Add-ons</p>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {metrics.active} active for sale
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Puzzle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Subscriptions</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.totalSubs} Units</p>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">Across enrolled schools</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Projected MRR</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">₹{metrics.estMRR.toLocaleString()}</p>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">Monthly add-on revenue</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivery Mode</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Automated</p>
            <span className="text-[11px] font-bold text-indigo-600 mt-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Zero-touch instant API
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-5">
        
        {/* Navigation Categories Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
          {categories.map((c) => {
            const isActive = filter === c.label;
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => setFilter(c.label)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span>{c.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar: Search, Status, Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by add-on name, description, plan, or quota..."
              className="w-full pl-10 pr-9 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="subscribers">Most Subscribers</option>
            </select>

            {(search || filter !== 'All' || statusFilter !== 'All' || sortBy !== 'default') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilter('All');
                  setStatusFilter('All');
                  setSortBy('default');
                }}
                className="px-2.5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                title="Reset all filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Add-ons List: Modern Table */}
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Add-on & Features</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Included Grants</th>
                  <th className="py-3 px-3">Eligible Plans</th>
                  <th className="py-3 px-3">Pricing (₹)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center">
                      <div className="max-w-sm mx-auto space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                          <Puzzle className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-800 text-sm">No Add-ons Found</h3>
                        <p className="text-slate-400 text-xs">
                          {search ? `No results matching "${search}". Try adjusting your keywords.` : 'No add-ons exist in this category yet.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setEditItem(null);
                            setForm(emptyForm);
                            setShowAdd(true);
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Create Add-on
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const typeStyle = typeConfig[item.type] || typeConfig.Module;
                    const IconComponent = typeStyle.icon;
                    const isItemActive = item.status === 'Active';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                        
                        {/* Add-on Name + Description */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${typeStyle.bg}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                                {item.desc}
                              </p>
                              {item.subscribers > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1">
                                  <Users className="w-3 h-3 text-slate-400" />
                                  <span>{item.subscribers} active institutions</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${typeStyle.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${typeStyle.dot}`} />
                            <span>{item.type}</span>
                          </span>
                        </td>

                        {/* Grants */}
                        <td className="py-3.5 px-3 max-w-[200px]">
                          <p className="font-semibold text-slate-700 text-xs leading-snug truncate" title={item.grants}>
                            {item.grants || '—'}
                          </p>
                        </td>

                        {/* Plans */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>{item.plans}</span>
                          </span>
                        </td>

                        {/* Pricing */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <p className="font-black text-slate-900 text-xs">
                              ₹{Number(item.monthly).toLocaleString()}
                              <span className="text-[10px] font-semibold text-slate-400">/mo</span>
                            </p>
                            <p className="font-bold text-emerald-600 text-[11px]">
                              ₹{Number(item.yearly).toLocaleString()}
                              <span className="text-[10px] text-emerald-600/70">/yr</span>
                            </p>
                          </div>
                        </td>

                        {/* Status Toggle Badge */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider border cursor-pointer transition-all active:scale-95 ${
                              isItemActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click to toggle status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isItemActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span>{item.status}</span>
                          </button>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit add-on configuration"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Manage</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-1.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete add-on"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modern Modal Dialog for Add / Edit */}
      {showAdd && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => {
            setShowAdd(false);
            setEditItem(null);
            setForm(emptyForm);
          }}
        >
          <div 
            className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                  <Puzzle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    {editItem ? 'Edit Add-on Configuration' : 'Create New Plan Add-on'}
                  </h3>
                  <p className="text-slate-300 text-[11px] font-medium mt-0.5">
                    Define pricing tiers, quota entitlements, and eligible subscription plans
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setEditItem(null);
                  setForm(emptyForm);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Add-on Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Add-on Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. WhatsApp Business Cloud Gateway"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description & Value Proposition
                </label>
                <textarea
                  rows={2}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Explain what this extension does for school principals & administrators..."
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 resize-none"
                />
              </div>

              {/* Type & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Extension Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Module">Module (Feature Extension)</option>
                    <option value="Channel">Channel (SMS/WhatsApp)</option>
                    <option value="Storage">Storage (Cloud S3 Quota)</option>
                    <option value="Seat">Seat (Staff Licenses)</option>
                    <option value="Flat">Flat (Enterprise Network)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Active">Active (Available for purchase)</option>
                    <option value="Inactive">Inactive (Hidden / Discontinued)</option>
                  </select>
                </div>
              </div>

              {/* System Grants & Included Plans */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    System Grants / Quota Details
                  </label>
                  <input
                    type="text"
                    value={form.grants}
                    onChange={(e) => setForm({ ...form, grants: e.target.value })}
                    placeholder="e.g. 15,000 Msg/mo or 250 GB"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Eligible Subscription Plans
                  </label>
                  <input
                    type="text"
                    value={form.plans}
                    onChange={(e) => setForm({ ...form, plans: e.target.value })}
                    placeholder="e.g. All Plans, or Growth & Enterprise"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pricing In Indian Rupees (₹)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoYearly}
                    className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    ⚡ Auto 10x Yearly
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 mb-1">
                      Monthly Price (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.monthly}
                      onChange={(e) => setForm({ ...form, monthly: e.target.value })}
                      placeholder="999"
                      className="w-full px-3 py-2 text-xs font-black bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 mb-1">
                      Yearly Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.yearly}
                      onChange={(e) => setForm({ ...form, yearly: e.target.value })}
                      placeholder="9990"
                      className="w-full px-3 py-2 text-xs font-black bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdd(false);
                    setEditItem(null);
                    setForm(emptyForm);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editItem ? 'Save Changes' : 'Create Add-on'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
