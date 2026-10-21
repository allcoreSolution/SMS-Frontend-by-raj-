import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Cake, Megaphone, Zap, Search, ScanLine, LayoutGrid, CalendarRange, UserPlus, FileSignature, ArrowRight, FileBadge, IndianRupee } from 'lucide-react';

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

const HumanResourceWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Human Resource" icon={Users} actionText="View all"  link="/hr/dashboard" />
    
    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Teaching</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Non-Teach</div>
      </div>
      <div>
        <div className="text-emerald-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">New Join</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Left</div>
      </div>
    </div>

    <div className="flex border-b border-slate-100 mb-4 text-[11px] font-bold">
      <button className="flex-1 pb-2 border-b-2 border-slate-800 text-slate-800">Attendance</button>
      <button className="flex-1 pb-2 text-slate-400">Departments</button>
    </div>

    <div className="flex-1 flex flex-col justify-end">
      <div className="text-[11px] text-slate-500 mb-1">Today's attendance (staff) <span className="float-right font-bold text-slate-800">0%</span></div>
      <div className="w-full bg-slate-100 h-2 rounded-none mb-1 overflow-hidden"></div>
      <div className="text-[9px] font-bold text-slate-400 mb-4 flex gap-3">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-none bg-emerald-500"></div> 0 present</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-none bg-slate-300"></div> 0 absent</span>
      </div>

      <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-3 py-2 rounded-none flex items-center gap-1.5 border border-amber-100">
        <div className="w-3 h-3 bg-amber-500 text-white rounded-none flex items-center justify-center text-[8px]">!</div>
        0 unpaid payslip(s) - 0 leave(s) pending approval
      </div>
    </div>
  </div>
);

const BirthdaysWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Birthdays" icon={Cake}  link="/engagement/birthday-manager" />
    
    <div className="flex-1 space-y-4 flex items-center justify-center">
      <div className="text-slate-400 text-xs">No birthdays today</div>
    </div>
  </div>
);

const OfficialNoticesWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Official Notices" icon={Megaphone}  link="/communicate/notice-board" />
    
    <div className="flex-1 space-y-4 overflow-hidden flex items-center justify-center">
      <div className="text-slate-400 text-xs">No active notices</div>
    </div>
  </div>
);

const TodaysSnapshotWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <div className="text-amber-500">
          <Zap className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Today's Snapshot</h2>
      </div>
      <div className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-none border border-red-100">LIVE</div>
    </div>

    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Users className="w-4 h-4 text-slate-400" /> Active On Campus
        </div>
        <div className="text-[#5F52FF] font-extrabold text-sm">0</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <FileBadge className="w-4 h-4 text-slate-400" /> Attendance Rate
        </div>
        <div className="text-emerald-500 font-extrabold text-sm">0.0%</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <IndianRupee className="w-4 h-4 text-slate-400" /> Fees Collected Today
        </div>
        <div className="text-red-500 font-extrabold text-sm">₹0</div>
      </div>
    </div>
  </div>
);

const QuickActionsWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <div className="text-amber-500">
          <Zap className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Find an app... (e.g. Fees)" 
            className="pl-8 pr-4 py-1.5 text-xs border border-slate-200 rounded-none w-48 outline-none focus:border-[#5F52FF]"
          />
        </div>
        <button className="text-[11px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-none hover:bg-slate-50">
          View All
        </button>
      </div>
    </div>

    <div className="flex gap-4">
      {[
        { icon: IndianRupee, color: 'text-blue-500', label: 'Collect Fees' },
        { icon: ScanLine, color: 'text-emerald-500', label: 'QR Attendance' },
        { icon: LayoutGrid, color: 'text-pink-500', label: 'Academic Dashboard' },
        { icon: CalendarRange, color: 'text-amber-500', label: 'QR Attendance Setting' },
        { icon: UserPlus, color: 'text-[#5F52FF]', label: 'Assign Class Teacher' },
        { icon: FileSignature, color: 'text-red-500', label: 'Assign Subjects' },
      ].map((action, i) => (
        <button key={i} className="flex flex-col items-center justify-center gap-3 p-3 border border-slate-100 rounded-none hover:border-slate-300 transition-colors w-[100px] hover:shadow-sm">
          <div className={`${action.color} bg-slate-50 p-3 rounded-none`}>
            <action.icon className="w-6 h-6" />
          </div>
          <div className="text-[10px] font-bold text-slate-600 text-center leading-tight">{action.label}</div>
        </button>
      ))}
    </div>
  </div>
);

const RowFour = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HumanResourceWidget />
        <BirthdaysWidget />
        <OfficialNoticesWidget />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <TodaysSnapshotWidget />
        </div>
        <div className="md:col-span-2">
          <QuickActionsWidget />
        </div>
      </div>
    </div>
  );
};

export default RowFour;
