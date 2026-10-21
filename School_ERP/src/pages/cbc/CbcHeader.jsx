import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, LayoutDashboard, Layers, ListChecks, Star, Route, 
  FileSpreadsheet, ShieldCheck, Plus, RefreshCw 
} from 'lucide-react';

const CbcHeader = ({ activeTab, onRefresh }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', name: 'CBC Dashboard', icon: LayoutDashboard, path: '/cbc/dashboard' },
    { id: 'strands', name: 'Strands & Outcomes', icon: Layers, path: '/cbc/strands-outcomes' },
    { id: 'assessments', name: 'Assessments', icon: ListChecks, path: '/cbc/assessments' },
    { id: 'competencies', name: 'Core Competencies', icon: Star, path: '/cbc/core-competencies' },
    { id: 'pathways', name: 'Pathways & Tracks', icon: Route, path: '/cbc/pathways-tracks' },
    { id: 'reports', name: 'CBC Reports', icon: FileSpreadsheet, path: '/cbc/reports' },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-6 sm:px-8 pt-6 pb-0 shrink-0 shadow-3xs">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight flex items-center gap-2">
              Competency-Based Curriculum (CBC)
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wider">
                Outcomes Assessment
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Assess mastery and student capabilities against standardized learning outcomes and core 21st-century competencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh data"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {activeTab !== 'assessments' && (
            <button 
              type="button"
              onClick={() => navigate('/cbc/assessments')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ListChecks className="w-3.5 h-3.5 text-emerald-600" /> Grade Assessments
            </button>
          )}

          {activeTab !== 'reports' && (
            <button 
              type="button"
              onClick={() => navigate('/cbc/reports')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-100 flex items-center gap-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4" /> View Report Cards
            </button>
          )}
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
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CbcHeader;
