import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  FolderTree, 
  Bot, 
  Headphones, 
  RefreshCw, 
  Search, 
  Sparkles 
} from 'lucide-react';

export default function HelpCenterNav({ counts = {}, onRefresh, loading = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'articles',
      label: 'Articles & Guides',
      path: '/help-center/articles',
      icon: BookOpen,
      badge: counts.articles != null ? counts.articles : null
    },
    {
      id: 'categories',
      label: 'Manage Categories',
      path: '/help-center/categories',
      icon: FolderTree,
      badge: counts.categories != null ? counts.categories : null
    },
    {
      id: 'ai-chatbot',
      label: 'AI School Assistant',
      path: '/help-center/ai-chatbot',
      icon: Bot,
      isAi: true
    },
    {
      id: 'tickets',
      label: 'Support Tickets Desk',
      path: '/contact-support',
      icon: Headphones,
      badge: counts.tickets != null ? counts.tickets : null
    }
  ];

  const currentPath = location.pathname.toLowerCase().replace(/\/$/, '');

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path.toLowerCase() || 
            (tab.id === 'articles' && (currentPath === '/help-center' || currentPath === '/help-center/articles')) ||
            (tab.id === 'tickets' && currentPath.includes('/contact-support'));

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.isAi ? 'text-indigo-500' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.isAi && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              )}
              {tab.badge !== null && !tab.isAi && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Data"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      )}
    </div>
  );
}
