import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Building2, Server, ShieldCheck, FileText, 
  Layers, Users, Bell, ArrowRight, ExternalLink, Sparkles, 
  X, Check, Activity, CreditCard, ShoppingBag, Headphones
} from 'lucide-react';
import { tenantService } from '../api/tenantService';
import { superAdminService } from '../api/superAdminService';
import Swal from 'sweetalert2';
import { toArray } from '../utils/helpers';

export default function SpotlightSearch({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [schools, setSchools] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Quick Action Static Links
  const quickActions = [
    { id: 'act-schools', title: 'Schools Registry', subtitle: 'Manage all connected school campuses', icon: Building2, path: '/schools', color: 'text-indigo-500 bg-indigo-50' },
    { id: 'act-telemetry', title: 'Server & DB Telemetry', subtitle: 'Live RAM, MongoDB status, API ping', icon: Activity, path: '/server', color: 'text-emerald-500 bg-emerald-50' },
    { id: 'act-audit', title: 'Tamper-Proof Audit Logs', subtitle: 'View system logs & admin operations', icon: ShieldCheck, path: '/audit-logs', color: 'text-rose-500 bg-rose-50' },
    { id: 'act-plans', title: 'SaaS Plans & Pricing', subtitle: 'Configure tier quotas and pricing', icon: Layers, path: '/plans', color: 'text-amber-500 bg-amber-50' },
    { id: 'act-orders', title: 'License Orders & GST Invoices', subtitle: 'Manage billing receipts and tax bills', icon: ShoppingBag, path: '/license-orders', color: 'text-blue-500 bg-blue-50' },
    { id: 'act-team', title: 'SuperAdmin Team & Roles', subtitle: 'Manage platform admin credentials', icon: Users, path: '/team', color: 'text-purple-500 bg-purple-50' },
    { id: 'act-support', title: 'Support Tickets Desk', subtitle: 'Review school inquiries and bugs', icon: Headphones, path: '/support', color: 'text-teal-500 bg-teal-50' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchSchools();
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const fetchSchools = async () => {
    try {
      const res = await tenantService.getTenants();
      const list = toArray(res);
      setSchools(list.map(s => ({
        id: s._id,
        name: s.schoolName,
        code: s.schoolCode || 'SCH',
        email: s.email,
        status: s.status || 'Active',
        plan: s.plan || 'Standard'
      })));
    } catch (_) {}
  };

  const filteredSchools = query.trim()
    ? schools.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredActions = query.trim()
    ? quickActions.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  const combinedItems = [
    ...filteredSchools.map(s => ({ ...s, itemType: 'school' })),
    ...filteredActions.map(a => ({ ...a, itemType: 'action' }))
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (combinedItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedItems.length) % (combinedItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = combinedItems[selectedIndex];
      if (current) handleSelect(current);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item) => {
    onClose();
    if (item.itemType === 'school') {
      navigate(`/schools`);
    } else {
      navigate(item.path);
    }
  };

  const handleImpersonate = async (e, schoolId, schoolName) => {
    e.stopPropagation();
    try {
      Swal.fire({
        title: 'Generating Credentials...',
        text: `Creating direct admin session for ${schoolName}`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const res = await superAdminService.impersonateSchool(schoolId);
      if (res.success && res.token) {
        localStorage.setItem('school_impersonation_token', res.token);
        localStorage.setItem('impersonated_school_name', schoolName);

        // Direct Live Deployed URL
        const schoolErpBase = 'https://sms-frontend-by-raj-school-erp.onrender.com';

        const schoolErpUrl = `${schoolErpBase}/login?impersonate_token=${encodeURIComponent(res.token)}&user=${encodeURIComponent(JSON.stringify(res.user || {}))}&schoolId=${encodeURIComponent(schoolId)}&schoolName=${encodeURIComponent(schoolName)}`;

        // Open Live School ERP directly
        window.open(schoolErpUrl, '_blank');

        Swal.fire({
          icon: 'success',
          title: 'Opening Live School ERP Portal',
          html: `
            <div class="text-left space-y-1 text-xs">
              <p class="font-bold text-slate-800">Logging into <b>${schoolName}</b> as Admin.</p>
              <a href="${schoolErpUrl}" target="_blank" class="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-center block mt-2">
                Click here if new tab was blocked
              </a>
            </div>
          `,
          showConfirmButton: false,
          showCloseButton: true,
          timer: 5000
        });
      }
    } catch (err) {
      Swal.fire('Impersonation Error', err.response?.data?.message || err.message, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative border-b border-slate-100 flex items-center px-4 py-3.5 bg-slate-50/70">
          <Search className="w-5 h-5 text-amber-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type school name, code, route, or command (e.g. 'Apex', 'Audit', 'Server')..."
            className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[10px] font-black bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-md">ESC</span>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* Schools Section (if query matches) */}
          {filteredSchools.length > 0 && (
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span>Schools ({filteredSchools.length})</span>
                <span className="text-[10px] text-amber-600 font-bold">1-Click Impersonate Available</span>
              </div>
              <div className="space-y-1">
                {filteredSchools.map((s, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelect({ ...s, itemType: 'school' })}
                      className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected ? 'bg-amber-50/90 border border-amber-200' : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-black text-xs">
                          {s.code.slice(0, 3)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{s.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">{s.code}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">{s.email} · {s.plan}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleImpersonate(e, s.id, s.name)}
                          className="px-2.5 py-1 text-[11px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl hover:from-amber-400 hover:to-amber-500 flex items-center gap-1 shadow-xs cursor-pointer transition-transform hover:scale-105"
                          title="Instant 1-Click Login as School Admin"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Login As Admin</span>
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions & Navigation */}
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1.5">
              Enterprise Commands & Modules
            </div>
            <div className="space-y-1">
              {filteredActions.map((act, aIdx) => {
                const combinedIndex = filteredSchools.length + aIdx;
                const isSelected = selectedIndex === combinedIndex;
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    onClick={() => handleSelect({ ...act, itemType: 'action' })}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected ? 'bg-amber-50/90 border border-amber-200' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{act.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{act.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {combinedItems.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-xs font-semibold">No results matching "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">ENTER</kbd> to select</span>
          </div>
          <span className="font-bold text-slate-700">ALL CORE SOLUTION Spotlight</span>
        </div>
      </div>
    </div>
  );
}
