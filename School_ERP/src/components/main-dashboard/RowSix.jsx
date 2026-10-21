import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Archive, Calculator, ArrowRight, LayoutGrid, Users, Briefcase, FileSignature, AlertCircle, ArrowUp, ArrowDown, Wallet } from 'lucide-react';

const WidgetHeader = ({ title, icon: Icon, link }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-2">
      <div className="bg-[#1e3a5f] p-1.5 rounded-none text-white">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
    </div>
    {link ? (
      <Link to={link} className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </Link>
    ) : (
      <button className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </button>
    )}
  </div>
);

const AdmissionsWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Admissions" icon={UserPlus}  link="/front-office/admission-enquiries" />
    
    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Enquiries</div>
      </div>
      <div>
        <div className="text-amber-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Pending Follow-up</div>
      </div>
      <div>
        <div className="text-emerald-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Admitted</div>
      </div>
    </div>

    <div className="flex border-b border-slate-100 mb-4 text-[11px] font-bold">
      <button className="flex-1 pb-2 border-b-2 border-slate-800 text-slate-800">Pipeline</button>
      <button className="flex-1 pb-2 text-slate-400">Recent</button>
    </div>

    <div className="flex-1 space-y-4 mb-4 flex items-center justify-center">
      <div className="text-slate-400 text-xs">No recent enquiries</div>
    </div>
    
    <div className="flex gap-2">
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <LayoutGrid className="w-3 h-3 text-slate-400" /> Front Office Dashboard
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <Users className="w-3 h-3 text-slate-400" /> Admission Enquiries
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <Briefcase className="w-3 h-3 text-slate-400" /> Visitor Book
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <FileSignature className="w-3 h-3 text-slate-400" /> Complaints
      </button>
    </div>
  </div>
);

const AssetManagementWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Asset Management" icon={Archive}  link="/asset-management/dashboard" />
    
    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Total Assets</div>
      </div>
      <div>
        <div className="text-orange-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Under Repair</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Retired</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">₹0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Total Cost</div>
      </div>
    </div>

    <div className="flex border-b border-slate-100 mb-4 text-[11px] font-bold">
      <button className="flex-1 pb-2 border-b-2 border-slate-800 text-slate-800">Categories</button>
      <button className="flex-1 pb-2 text-slate-400">Condition</button>
    </div>

    <div className="flex-1 space-y-3 mb-4 flex items-center justify-center">
      <div className="text-slate-400 text-xs">No assets recorded</div>
    </div>

    <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-3 py-2 rounded-none flex items-center gap-1.5 border border-amber-100 mt-auto">
      <AlertCircle className="w-3 h-3 text-amber-500" />
      0 maintenance schedule(s) overdue
    </div>
  </div>
);

const AccountsWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Accounts" icon={Calculator}  link="/accounts/dashboard" />
    
    <div className="grid grid-cols-4 gap-2 mb-6 text-center">
      <div>
        <div className="text-emerald-500 font-extrabold text-sm">₹0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Today</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">₹0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Income (MTD)</div>
      </div>
      <div>
        <div className="text-orange-500 font-extrabold text-sm">₹0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Expense (MTD)</div>
      </div>
      <div>
        <div className="text-blue-500 font-extrabold text-sm">₹0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Cash & Bank</div>
      </div>
    </div>

    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Vouchers</div>
    
    <div className="flex-1 space-y-4 mb-4 flex items-center justify-center">
      <div className="text-slate-400 text-xs">No recent vouchers</div>
    </div>
    
    <div className="flex gap-2 mt-auto">
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <LayoutGrid className="w-3 h-3 text-slate-400" /> Accounts Dashboard
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <ArrowDown className="w-3 h-3 text-emerald-500" /> Income
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <ArrowUp className="w-3 h-3 text-red-500" /> Expense
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <Wallet className="w-3 h-3 text-slate-400" /> Income Heads
      </button>
    </div>
  </div>
);

const RowSix = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <AdmissionsWidget />
      <AssetManagementWidget />
      <AccountsWidget />
    </div>
  );
};

export default RowSix;
