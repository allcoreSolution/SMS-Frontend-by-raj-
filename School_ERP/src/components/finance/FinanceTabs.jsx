import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Gauge, BookOpen, HandCoins, FileSearch, ArrowRightLeft, Globe, 
  FileText, UserPlus, WalletCards, LayoutGrid, Percent, Hash, Receipt, Clock, ShieldCheck
} from 'lucide-react';

const FinanceTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: 'Dashboard', path: '/finance/dashboard', icon: Gauge },
    { name: 'Collect Fees', path: '/finance/collect', icon: HandCoins },
    { name: 'Search Due Fees', path: '/finance/search-due-fees', icon: FileSearch },
    { name: 'All Transactions', path: '/finance/transactions', icon: ArrowRightLeft },
    { name: 'Online Transactions', path: '/finance/online-transactions', icon: Globe },
    { name: 'Fee Challans', path: '/finance/challans', icon: FileText },
    { name: 'Assign Fees', path: '/finance/assign', icon: UserPlus },
    { name: 'Fee Groups', path: '/finance/groups', icon: LayoutGrid },
    { name: 'Fee Types', path: '/finance/types', icon: Hash },
    { name: 'Fees Discount', path: '/finance/discount', icon: Percent },
    { name: 'Due Slip History', path: '/finance/slip-history', icon: Clock },
    { name: 'Generate Due Slip', path: '/finance/generate-slip', icon: Receipt },
    { name: 'Fees Carry Forward', path: '/finance/carry-forward', icon: WalletCards },
    { name: 'Fee Data Audit', path: '/finance/audit', icon: ShieldCheck },
    { name: 'Finance Guide', path: '/finance/guide', icon: BookOpen }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-1.5 shadow-xs mb-6 overflow-hidden print:hidden">
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-1 scrollbar-none">
        <style dangerouslySetInnerHTML={{__html: `.scrollbar-none::-webkit-scrollbar { display: none; } .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }`}} />
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path || (currentPath.startsWith(tab.path + '/') && tab.path !== '/finance/dashboard');
          
          if (isActive) {
            return (
              <div 
                key={index} 
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 cursor-default shrink-0 transition-all"
              >
                <Icon className="w-4 h-4 text-white" />
                <span>{tab.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse ml-0.5" />
              </div>
            );
          }
          
          return (
            <Link 
              key={index} 
              to={tab.path} 
              className="text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 shrink-0 transition-all"
            >
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FinanceTabs;
