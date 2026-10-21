import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, LayoutDashboard, Columns, Users, Bell, Layers, Book, Plus, RefreshCw, Sparkles 
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';

const LeadHeader = ({ activeTab, onLeadCreated, stats, onRefresh }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/leads/dashboard' },
    { id: 'pipeline', name: 'Pipeline Board', icon: Columns, path: '/leads/pipeline' },
    { id: 'all', name: 'All Leads', icon: Users, path: '/leads/all', badge: stats?.total },
    { id: 'follow-ups', name: 'Follow-ups', icon: Bell, path: '/leads/follow-ups', badge: (stats?.followUps?.today || 0) + (stats?.followUps?.overdue || 0) },
    { id: 'sources-stages', name: 'Sources & Stages', icon: Layers, path: '/leads/sources-stages' },
    { id: 'guide', name: 'Guide', icon: Book, path: '/leads/guide' },
  ];

  const handleLeadCreatedInternal = (newLead) => {
    setShowModal(false);
    if (onLeadCreated) onLeadCreated(newLead);
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200/80 px-6 sm:px-8 pt-6 pb-0 shrink-0 shadow-3xs">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5F52FF] to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight flex items-center gap-2">
                Lead Management
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-[#5F52FF] border border-indigo-100 tracking-wider">
                  Admissions CRM
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Capture every admission lead, work it through the pipeline, and convert the winners into students.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                title="Refresh leads"
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {activeTab !== 'pipeline' && (
              <button 
                type="button"
                onClick={() => navigate('/leads/pipeline')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Columns className="w-3.5 h-3.5 text-[#5F52FF]" /> Pipeline Board
              </button>
            )}

            <button 
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#5F52FF] to-[#7B68EE] hover:from-[#4E41E6] hover:to-[#6C5CE7] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-2 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> New Lead
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-6 mt-6 overflow-x-auto no-scrollbar border-b border-transparent">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 pb-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all relative ${
                  isActive
                    ? 'border-[#5F52FF] text-[#5F52FF]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#5F52FF]' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isActive 
                      ? 'bg-indigo-100 text-[#5F52FF]' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <NewLeadModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onLeadCreated={handleLeadCreatedInternal} 
      />
    </>
  );
};

export default LeadHeader;
