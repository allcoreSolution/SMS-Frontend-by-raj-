import React, { useState } from 'react';
import { MessageSquare, Search, ShieldCheck, CheckCheck, Smartphone, Bell, Calendar, Sparkles, Filter, RefreshCw } from 'lucide-react';

const defaultMessages = [
  { 
    id: 1, 
    senderId: 'ACS-SCH',
    title: 'Festival Holiday Advisory', 
    date: '04 Sep 2026, 09:30 AM', 
    category: 'Circular',
    status: 'Delivered',
    operator: 'TRAI-DLT Verified',
    body: 'ACS International School Notice: Hearty greetings on Janmashtami. Campus remains closed tomorrow. Normal timetable resumes Monday.' 
  },
  { 
    id: 2, 
    senderId: 'ACS-ATT',
    title: 'Daily Attendance Punch', 
    date: '04 Sep 2026, 08:15 AM', 
    category: 'Attendance',
    status: 'Delivered',
    operator: 'TRAI-DLT Verified',
    body: 'Dear Parent, Kabir Singh has safely punched IN at ACS Campus at 08:12 AM via Gate #2 Biometric RFID reader.' 
  },
  { 
    id: 3, 
    senderId: 'ACS-FEE',
    title: 'Quarterly Fee Acknowledgment', 
    date: '02 Sep 2026, 04:20 PM', 
    category: 'Accounts',
    status: 'Delivered',
    operator: 'TRAI-DLT Verified',
    body: 'Payment received: INR 12,500 towards Q2 Tuition Fees for Kabir Singh. Receipt #REC-2026-9812 generated. Thank you!' 
  },
  { 
    id: 4, 
    senderId: 'ACS-ADM',
    title: 'Enrollment Confirmation', 
    date: '01 Sep 2026, 11:00 AM', 
    category: 'Admissions',
    status: 'Delivered',
    operator: 'TRAI-DLT Verified',
    body: 'Welcome to ACS International School. Admission successful for Kabir Singh (Class 10th A). Parent portal credentials active.' 
  },
];

export default function SMS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filters = ['All', 'Attendance', 'Accounts', 'Circular', 'Admissions'];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const filtered = defaultMessages.filter(m => {
    const matchCat = selectedFilter === 'All' || m.category === selectedFilter;
    const matchSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-3 sm:p-5 md:p-6 max-w-7xl mx-auto space-y-6 bg-[#F8FAFF] min-h-screen pb-24 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner shrink-0">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  SMS &amp; Telephony Dispatches
                </h1>
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" /> DLT Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">
                Official operator SMS archive delivered to primary registered number: <span className="font-mono font-bold text-white">+91 98765 10000</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold rounded-2xl transition-all shadow-sm self-start sm:self-auto cursor-pointer backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Dispatches</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Total Dispatches</span>
          <span className="text-2xl font-black text-slate-900 leading-none">{defaultMessages.length}</span>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">To Primary Contact</p>
        </div>
        <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Delivered Rate</span>
          <span className="text-2xl font-black text-emerald-600 leading-none">100%</span>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">TRAI Handshake OK</p>
        </div>
        <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Primary Network</span>
          <span className="text-2xl font-black text-blue-600 leading-none">Jio / Airtel</span>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">4G / 5G VoLTE</p>
        </div>
        <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Approved Header</span>
          <span className="text-sm font-black text-slate-800 block mt-1 font-mono">ACS-SCH</span>
          <p className="text-[11px] text-slate-400 font-medium">Govt Principal Entity</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 border border-slate-200/90 rounded-3xl shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer ${
                selectedFilter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search text, ID, alert..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* 4. Messages Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No SMS Messages Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or search keyword.</p>
          </div>
        ) : (
          filtered.map(m => (
            <div 
              key={m.id} 
              className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {m.senderId}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">{m.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {m.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">{m.date}</span>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                  {m.body}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCheck className="w-3.5 h-3.5" /> {m.status} ({m.operator})
                  </span>
                  <span>Primary Sim Delivery</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
