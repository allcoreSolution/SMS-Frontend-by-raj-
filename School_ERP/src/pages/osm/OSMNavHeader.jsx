import React from 'react';
import { 
  LayoutDashboard, Layers, FileSignature, Scale, LineChart, BookOpen, Plus, Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OSMNavHeader({ extraRightAction }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/osm-module/dashboard', icon: LayoutDashboard },
    { label: 'Sessions', path: '/osm-module/sessions', icon: Layers },
    { label: 'Evaluate', path: '/osm-module/evaluate', icon: FileSignature },
    { label: 'Moderation', path: '/osm-module/moderation', icon: Scale },
    { label: 'Reports', path: '/osm-module/reports', icon: LineChart },
    { label: 'Guide', path: '/osm-module/guide', icon: BookOpen },
  ];

  const isActive = (itemPath) => {
    if (itemPath === '/osm-module/sessions' && location.pathname.startsWith('/osm-module/sessions/')) {
      return true;
    }
    return location.pathname === itemPath;
  };

  return (
    <div className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Digital Evaluation (OSM)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                On-Screen Marking
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Digitized answer sheet grading, question-by-question scoring, moderation audits & sync.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {extraRightAction}
          <button
            onClick={() => navigate('/osm-module/sessions/new')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center gap-2 transition-all cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" /> New Evaluation Session
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 sm:gap-6 text-xs font-bold overflow-x-auto no-scrollbar border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-purple-600 text-purple-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-purple-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
