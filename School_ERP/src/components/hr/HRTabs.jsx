import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserPlus, CalendarCheck, CheckCircle, 
  List, IndianRupee, FileText, Calculator, CreditCard, 
  Star, RefreshCw, CheckSquare, Building, Briefcase, 
  IdCard, Settings
} from 'lucide-react';

const tabs = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/hr/dashboard' },
  { name: 'Staff Directory', icon: Users, path: '/hr/staff' },
  { name: 'Add Staff', icon: UserPlus, path: '/hr/staff/new' },
  { name: 'Attendance', icon: CalendarCheck, path: '/hr/attendance' },
  { name: 'Approve Leave', icon: CheckCircle, path: '/hr/approve-leave' },
  { name: 'Leave Types', icon: List, path: '/hr/leave-types' },
  { name: 'Set Salary', icon: IndianRupee, path: '/hr/set-salary' },
  { name: 'Salary Templates', icon: FileText, path: '/hr/salary-templates' },
  { name: 'Payroll', icon: Calculator, path: '/hr/payroll' },
  { name: 'Loans', icon: CreditCard, path: '/hr/manage-loans' },
  { name: 'Appraisals', icon: Star, path: '/hr/appraisals' },
  { name: 'Appraisal Cycles', icon: RefreshCw, path: '/hr/appraisal-cycles' },
  { name: 'Criteria', icon: CheckSquare, path: '/hr/appraisal-criteria' },
  { name: 'Departments', icon: Building, path: '/hr/departments' },
  { name: 'Designations', icon: Briefcase, path: '/hr/designations' },
  { name: 'ID Cards', icon: IdCard, path: '/hr/id-cards' },
  { name: 'Settings', icon: Settings, path: '/hr/settings' },
];

const HRTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path || 
          (tab.path === '/hr/staff' && location.pathname.startsWith('/hr/staff/profile'));

        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-100'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default HRTabs;
