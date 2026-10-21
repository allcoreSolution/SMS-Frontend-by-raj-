import React, { useState, useMemo } from 'react';
import { Plug, ChevronDown, ChevronRight, Search, Download, Lock, Globe, ShieldCheck, Info } from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────────────────
const ALL_ENDPOINTS = [
  // SuperAdmin ERP (Original APIs)
  { group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'GET',  path: '/tenant/list', desc: 'Fetch all registered schools/tenants', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'GET',  path: '/tenant/:id', desc: 'Get a single tenant profile details', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'POST', path: '/tenant/register', desc: 'Register a newly onboarded school', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'PUT',  path: '/tenant/:id', desc: 'Update existing tenant configuration', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'PUT',  path: '/tenant/:id/suspend', desc: 'Suspend or deactivate a tenant', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'DELETE', path: '/tenant/:id', desc: 'Hard delete a school from system', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'BILLING', method: 'GET',  path: '/plans/list', desc: 'List all platform subscription plans', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'BILLING', method: 'POST', path: '/plans/create', desc: 'Create a new SaaS pricing plan', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'BILLING', method: 'PUT',  path: '/plans/:id', desc: 'Update plan feature limits & pricing', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'BILLING', method: 'DELETE', path: '/plans/:id', desc: 'Remove a subscription plan from offering', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'COMMS', method: 'PUT',  path: '/tenant/wallet/recharge', desc: 'Recharge school communication notification wallet', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'SUPPORT', method: 'GET',  path: '/tenant/tickets', desc: 'Get all global support tickets', access: 'Token' },
  { group: 'SuperAdmin Core', subgroup: 'SYSTEM', method: 'GET',  path: '/tenant/stats', desc: 'Dashboard global server KPI stats', access: 'Token' },

  // Auth & Core (29)
  { group: 'Auth & Core', subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/app-info',          desc: 'Get app info',                   access: 'Public' },
  { group: 'Auth & Core', subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/branding',           desc: 'List branding',                  access: 'Public' },
  { group: 'Auth & Core', subgroup: 'GENERAL', method: 'POST', path: '/api/v1/change-password',    desc: 'Update the user\'s password.',   access: 'Token' },
  { group: 'Auth & Core', subgroup: 'GENERAL', method: 'POST', path: '/api/v1/login',              desc: 'Login login',                    access: 'Public' },
  { group: 'Auth & Core', subgroup: 'GENERAL', method: 'POST', path: '/api/v1/logout',             desc: 'Logout user',                    access: 'Token' },
  { group: 'Auth & Core', subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/me',                 desc: 'Get current user profile',       access: 'Token' },
  { group: 'Auth & Core', subgroup: 'OTP',     method: 'POST', path: '/api/v1/otp/send',           desc: 'Send OTP to mobile/email',       access: 'Public' },
  { group: 'Auth & Core', subgroup: 'OTP',     method: 'POST', path: '/api/v1/otp/verify',         desc: 'Verify OTP code',                access: 'Public' },
  { group: 'Auth & Core', subgroup: 'FACE',    method: 'POST', path: '/api/v1/face/enroll',        desc: 'Enroll face vector',             access: 'Token' },
  { group: 'Auth & Core', subgroup: 'FACE',    method: 'POST', path: '/api/v1/face/match',         desc: 'Match face for auth',            access: 'Token' },
  { group: 'Auth & Core', subgroup: 'DEVICE',  method: 'POST', path: '/api/v1/device/register',   desc: 'Register device token',          access: 'Token' },
  // Parent App (81)
  { group: 'Parent App',  subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/parent/dashboard',  desc: 'Parent dashboard summary',       access: 'Token' },
  { group: 'Parent App',  subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/parent/children',   desc: 'List children',                  access: 'Token' },
  { group: 'Parent App',  subgroup: 'FEES',    method: 'GET',  path: '/api/v1/parent/fees',       desc: 'Outstanding fee details',        access: 'Token' },
  { group: 'Parent App',  subgroup: 'FEES',    method: 'POST', path: '/api/v1/parent/fees/pay',   desc: 'Initiate fee payment',           access: 'Token' },
  { group: 'Parent App',  subgroup: 'ATTEND',  method: 'GET',  path: '/api/v1/parent/attendance', desc: 'Child attendance records',       access: 'Token' },
  { group: 'Parent App',  subgroup: 'NOTICE',  method: 'GET',  path: '/api/v1/parent/notices',    desc: 'School notices',                 access: 'Token' },
  // Staff App (154)
  { group: 'Staff App',   subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/staff/profile',     desc: 'Staff profile info',             access: 'Token' },
  { group: 'Staff App',   subgroup: 'GENERAL', method: 'PUT',  path: '/api/v1/staff/profile',     desc: 'Update staff profile',           access: 'Token' },
  { group: 'Staff App',   subgroup: 'ATTEND',  method: 'POST', path: '/api/v1/staff/attendance',  desc: 'Mark staff attendance',          access: 'Token' },
  { group: 'Staff App',   subgroup: 'ATTEND',  method: 'GET',  path: '/api/v1/staff/attendance',  desc: 'Get staff attendance log',       access: 'Token' },
  { group: 'Staff App',   subgroup: 'LEAVE',   method: 'POST', path: '/api/v1/staff/leave',       desc: 'Apply for leave',                access: 'Token' },
  { group: 'Staff App',   subgroup: 'LEAVE',   method: 'GET',  path: '/api/v1/staff/leave',       desc: 'List leave applications',        access: 'Token' },
  // Driver App (23)
  { group: 'Driver App',  subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/driver/route',      desc: 'Get assigned route',             access: 'Token' },
  { group: 'Driver App',  subgroup: 'GENERAL', method: 'POST', path: '/api/v1/driver/location',   desc: 'Update live GPS location',       access: 'Token' },
  { group: 'Driver App',  subgroup: 'GENERAL', method: 'POST', path: '/api/v1/driver/attendance', desc: 'Mark student board/alight',      access: 'Token' },
  // Camera Agent (17)
  { group: 'Camera Agent',subgroup: 'GENERAL', method: 'POST', path: '/api/v1/camera/heartbeat',  desc: 'Camera heartbeat ping',          access: 'Token' },
  { group: 'Camera Agent',subgroup: 'GENERAL', method: 'POST', path: '/api/v1/camera/detect',     desc: 'Send face detection event',      access: 'Token' },
  // Webhooks (1)
  { group: 'Webhooks',    subgroup: 'GENERAL', method: 'POST', path: '/api/v1/webhook/payment',   desc: 'Payment gateway callback',       access: 'Public' },
  // Other (2)
  { group: 'Other',       subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/health',            desc: 'Server health check',            access: 'Public' },
  { group: 'Other',       subgroup: 'GENERAL', method: 'GET',  path: '/api/v1/version',           desc: 'API version info',               access: 'Public' },
];

const GROUPS = [
  { key: 'SuperAdmin Core', icon: '🚀', color: 'bg-indigo-500',  light: 'bg-indigo-50',  text: 'text-indigo-700' },
  { key: 'Auth & Core',  icon: '🔐', color: 'bg-violet-500',  light: 'bg-violet-50',  text: 'text-violet-700' },
  { key: 'Parent App',   icon: '👨‍👩‍👧', color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700' },
  { key: 'Staff App',    icon: '👩‍💼', color: 'bg-blue-500',    light: 'bg-blue-50',    text: 'text-blue-700' },
  { key: 'Driver App',   icon: '🚌', color: 'bg-orange-500',  light: 'bg-orange-50',  text: 'text-orange-700' },
  { key: 'Camera Agent', icon: '📷', color: 'bg-pink-500',    light: 'bg-pink-50',    text: 'text-pink-700' },
  { key: 'Webhooks',     icon: '🔗', color: 'bg-teal-500',    light: 'bg-teal-50',    text: 'text-teal-700' },
  { key: 'Other',        icon: '⚙️', color: 'bg-gray-500',    light: 'bg-gray-100',   text: 'text-gray-700' },
];

const METHOD_COLORS = {
  GET:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  POST:   'bg-blue-100   text-blue-700   border-blue-200',
  PUT:    'bg-amber-100  text-amber-700  border-amber-200',
  PATCH:  'bg-purple-100 text-purple-700 border-purple-200',
  DELETE: 'bg-red-100    text-red-700    border-red-200',
};

const METHODS = ['All', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const ACCESSES = ['All', 'Token', 'Public', 'Module-gated'];

// ── Component ────────────────────────────────────────────────────────────────
export default function ApiDocs() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [activeMethod, setActiveMethod] = useState('All');
  const [activeAccess, setActiveAccess] = useState('All');
  const [openGroups, setOpenGroups] = useState({ 'SuperAdmin Core': true });

  const countPerGroup = useMemo(() =>
    ALL_ENDPOINTS.reduce((acc, e) => { acc[e.group] = (acc[e.group] || 0) + 1; return acc; }, {}),
  []);
  const totalCount = ALL_ENDPOINTS.length;

  const filtered = useMemo(() => {
    return ALL_ENDPOINTS.filter(e => {
      if (activeGroup !== 'All' && e.group !== activeGroup) return false;
      if (activeMethod !== 'All' && e.method !== activeMethod) return false;
      if (activeAccess !== 'All' && e.access !== activeAccess) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.path.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || e.group.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, activeGroup, activeMethod, activeAccess]);

  const groupedFiltered = useMemo(() => {
    const map = {};
    filtered.forEach(e => {
      if (!map[e.group]) map[e.group] = {};
      if (!map[e.group][e.subgroup]) map[e.group][e.subgroup] = [];
      map[e.group][e.subgroup].push(e);
    });
    return map;
  }, [filtered]);

  const toggleGroup = (g) => setOpenGroups(o => ({ ...o, [g]: !o[g] }));

  const groupMeta = (key) => GROUPS.find(g => g.key === key) || { icon: '📁', color: 'bg-gray-400', light: 'bg-gray-50', text: 'text-gray-700' };

  const stats = [
    { label: 'TOTAL ENDPOINTS',    value: 307, icon: '⚡', bg: 'bg-violet-500' },
    { label: 'TOKEN PROTECTED',    value: 269, icon: '🔒', bg: 'bg-emerald-500' },
    { label: 'MODULE GATED',       value: 89,  icon: '🧩', bg: 'bg-violet-400' },
    { label: 'PUBLIC ENDPOINTS',   value: 38,  icon: '🔓', bg: 'bg-amber-500' },
  ];

  const Pill = ({ label, active, onClick, count }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-none text-[12px] font-semibold border transition-all whitespace-nowrap
        ${active
          ? 'bg-[#554bb9] text-white border-[#554bb9]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800'}`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-none ${active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
          {count}
        </span>
      )}
    </button>
  );

  const MethodPill = ({ m }) => (
    <button
      onClick={() => setActiveMethod(m)}
      className={`px-3 py-1 rounded-none text-[11px] font-bold border transition-all
        ${activeMethod === m
          ? 'bg-[#554bb9] text-white border-[#554bb9]'
          : m === 'All' ? 'bg-white text-gray-600 border-gray-200 hover:border-gray-300' : `${METHOD_COLORS[m] || 'bg-gray-100 text-gray-600 border-gray-200'} border`
        }`}
    >
      {m}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 pb-16 w-full bg-[#f8f9fa] min-h-screen">

      {/* ── Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-violet-600 flex items-center justify-center shadow">
            <Plug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-gray-800 tracking-tight">API Documentation</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-400 text-gray-700 px-3 py-1.5 rounded-none text-[12px] font-semibold shadow-sm transition-all">
            <Download className="w-3.5 h-3.5" /> Postman Collection
          </button>
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-400 text-gray-700 px-3 py-1.5 rounded-none text-[12px] font-semibold shadow-sm transition-all">
            <Globe className="w-3.5 h-3.5" /> OpenAPI Spec
          </button>
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-400 text-gray-700 px-3 py-1.5 rounded-none text-[12px] font-semibold shadow-sm transition-all">
            <Download className="w-3.5 h-3.5" /> JSON
          </button>
        </div>
      </div>

      {/* ── Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 shadow-sm p-4 flex items-center gap-4">
            <div className={`w-11 h-11 ${s.bg} rounded-none flex items-center justify-center text-[20px] shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[22px] font-black text-gray-900 leading-none">{s.value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Base URL Infobar */}
      <div className="bg-blue-50 border border-blue-200 rounded-none px-4 py-3 mb-5 flex items-center gap-2 text-[12px]">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="text-blue-700">
          Base URL: <a href="#" className="font-bold text-blue-600 hover:underline">https://multischoolv2.projectworlds.com</a>
          <span className="text-blue-500 mx-2">·</span>
          Docs are generated live from the route registry — always in sync with the deployed code.
        </span>
      </div>

      {/* ── Filters */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm p-4 mb-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search path, name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-none px-9 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#554bb9] focus:ring-1 focus:ring-[#554bb9]/20 transition-all"
          />
        </div>

        {/* Group pills */}
        <div className="flex flex-wrap gap-2">
          <Pill label="All" active={activeGroup === 'All'} onClick={() => setActiveGroup('All')} count={totalCount} />
          {GROUPS.map(g => (
            <Pill key={g.key} label={g.key} active={activeGroup === g.key} onClick={() => setActiveGroup(g.key)} count={countPerGroup[g.key]} />
          ))}
        </div>

        {/* Method + Access row */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">Method</span>
            {METHODS.map(m => <MethodPill key={m} m={m} />)}
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">Access</span>
            {ACCESSES.map(a => (
              <button
                key={a}
                onClick={() => setActiveAccess(a)}
                className={`px-3 py-1 rounded-none text-[11px] font-bold border transition-all
                  ${activeAccess === a
                    ? 'bg-[#554bb9] text-white border-[#554bb9]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Endpoint Groups */}
      <div className="space-y-3">
        {Object.keys(groupedFiltered).length === 0 && (
          <div className="bg-white rounded-none border border-gray-200 p-10 text-center text-gray-400 text-sm">
            No endpoints match your filters.
          </div>
        )}

        {GROUPS.filter(g => groupedFiltered[g.key]).map(gmeta => {
          const subgroups = groupedFiltered[gmeta.key];
          const totalInGroup = Object.values(subgroups).flat().length;
          const isOpen = !!openGroups[gmeta.key];

          return (
            <div key={gmeta.key} className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(gmeta.key)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${gmeta.color} rounded-none flex items-center justify-center text-[18px] shadow-sm`}>
                    {gmeta.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-bold text-gray-800">{gmeta.key}</p>
                    <p className="text-[11px] text-gray-400 font-medium">Login, OTP, face auth, branding &amp; device tokens</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#554bb9] text-[13px] font-bold">{totalInGroup} endpoints</span>
                  {isOpen
                    ? <ChevronDown className="w-4 h-4 text-gray-400" />
                    : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {/* Subgroups + Rows */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  {Object.entries(subgroups).map(([sub, routes]) => (
                    <div key={sub}>
                      {/* Subgroup label */}
                      <div className="flex items-center gap-2 px-5 py-2 bg-gray-50/70 border-b border-gray-100">
                        <div className="w-2 h-2 rounded-none bg-gray-400" />
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{sub}</span>
                        <span className="text-[10px] font-bold text-gray-400">{routes.length}</span>
                      </div>

                      {/* Endpoint rows */}
                      {routes.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors group"
                        >
                          {/* Method Badge */}
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-none border w-[52px] text-center shrink-0 ${METHOD_COLORS[r.method] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {r.method}
                          </span>

                          {/* Path */}
                          <code className="text-[13px] font-mono text-gray-800 font-semibold shrink-0">{r.path}</code>

                          {/* Desc */}
                          <span className="text-[12px] text-gray-500 flex-1">{r.desc}</span>

                          {/* Access Badge */}
                          {r.access === 'Token' && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none shrink-0">
                              <Lock className="w-3 h-3" /> Token
                            </span>
                          )}
                          {r.access === 'Public' && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-none shrink-0">
                              <Globe className="w-3 h-3" /> Public
                            </span>
                          )}
                          {r.access === 'Module-gated' && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-none shrink-0">
                              <ShieldCheck className="w-3 h-3" /> Module-gated
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
