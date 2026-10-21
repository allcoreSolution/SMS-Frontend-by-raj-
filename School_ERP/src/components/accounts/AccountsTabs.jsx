import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, ArrowDownToLine, ArrowUpFromLine, 
  Calendar, FileText, Tags, Wallet, PieChart
} from 'lucide-react';

const AccountsTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: 'Dashboard', path: '/accounts/dashboard', icon: LayoutDashboard },
    { name: 'Income', path: '/accounts/income', icon: ArrowDownToLine },
    { name: 'Expense', path: '/accounts/expense', icon: ArrowUpFromLine },
    { name: 'Income Heads', path: '/accounts/income-heads', icon: Tags },
    { name: 'Expense Heads', path: '/accounts/expense-heads', icon: Tags },
    { name: 'Bank Accounts', path: '/accounts/bank-accounts', icon: Wallet },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-1.5 shadow-xs mb-6 overflow-hidden print:hidden">
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-1 scrollbar-none">
        <style dangerouslySetInnerHTML={{__html: `.scrollbar-none::-webkit-scrollbar { display: none; } .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }`}} />
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path || (currentPath.startsWith(tab.path + '/') && tab.path !== '/accounts/dashboard');
          
          if (isActive) {
            return (
              <div 
                key={index} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 cursor-default shrink-0 transition-all"
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
              className="text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 shrink-0 transition-all"
            >
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsTabs;
