import React, { useState } from 'react';
import { 
  LayoutDashboard, HelpCircle, Users, CalendarCheck, CheckCircle, List, Send, 
  IndianRupee, FileText, Calculator, CreditCard, Star, RefreshCw, CheckSquare, 
  Building, Briefcase, IdCard, Settings, MoreVertical, ChevronDown, 
  Calendar, Save, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HRSettings() {
  const navigate = useNavigate();

  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/hr/dashboard' },
    { name: 'Guide', icon: HelpCircle, path: '/hr/guide' },
    { name: 'Staff Directory', icon: Users, path: '/hr/staff' },
    { name: 'Attendance', icon: CalendarCheck, path: '/hr/attendance' },
    { name: 'Approve Leave', icon: CheckCircle, path: '/hr/approve-leave' },
    { name: 'Leave Types', icon: List, path: '/hr/leave-types' },
    { name: 'Apply Leave', icon: Send, path: '/hr/apply-leave' },
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
    { name: 'Settings', icon: Settings, path: '/hr/settings', active: true },
  ];

  const [selectedSaturdayPattern, setSelectedSaturdayPattern] = useState('no-saturdays-off');

  const [weeklyOffs, setWeeklyOffs] = useState(['sun']);

  const toggleWeeklyOff = (dayId) => {
    setWeeklyOffs(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10 relative">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-[#1e293b]">Human Resource</h1>
        <p className="text-[13px] text-slate-500 mt-1">Manage staff, attendance, leaves, payroll, and loans across the school.</p>
      </div>

      {/* HR Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex px-6 gap-6 min-w-max">
          {tabs.slice(0, 11).map((tab) => (
            <button 
              key={tab.name}
              onClick={() => tab.path && navigate(tab.path)}
              className={`flex items-center gap-2 py-3 whitespace-nowrap cursor-pointer transition-colors ${
                tab.active 
                  ? 'text-[#5F52FF] border-b-2 border-[#5F52FF]' 
                  : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="text-[13px] font-bold">{tab.name}</span>
            </button>
          ))}
          
          <div className="relative group flex items-center">
            <button className="flex items-center gap-2 py-3 text-[#5F52FF] font-bold transition-colors whitespace-nowrap cursor-pointer">
              <MoreVertical className="w-4 h-4" />
              <span className="text-[13px]">More Menu</span>
            </button>
            
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-none shadow-lg border border-slate-200 py-1 hidden group-hover:block z-50">
              {tabs.slice(11).map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => tab.path && navigate(tab.path)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 ${
                    tab.active ? 'text-[#5F52FF] font-medium bg-slate-50' : 'text-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Weekly Off Configuration */}
        <div className="flex-1 bg-white border border-slate-200 rounded-none shadow-sm self-start">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5F52FF]" />
            <h2 className="text-[14px] font-bold text-slate-800">Weekly Off Configuration</h2>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Weekly Off Days */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 mb-1">Weekly Off Days</h3>
              <p className="text-[11px] text-slate-500 mb-3">Select which days of the week are off for staff. Sunday is selected by default.</p>
              
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'sun', label: 'Sunday', checked: true },
                  { id: 'mon', label: 'Monday', checked: false },
                  { id: 'tue', label: 'Tuesday', checked: false },
                  { id: 'wed', label: 'Wednesday', checked: false },
                  { id: 'thu', label: 'Thursday', checked: false },
                  { id: 'fri', label: 'Friday', checked: false }
                ].map(day => (
                  <label key={day.id} className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.preventDefault(); toggleWeeklyOff(day.id); }}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded-none border-slate-300 text-[#5F52FF] focus:ring-[#5F52FF]" 
                      checked={weeklyOffs.includes(day.id)} 
                      onChange={() => {}}
                    />
                    <span className="text-[13px] font-bold text-slate-700">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-t border-slate-100"></div>

            {/* Saturday Pattern */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 mb-1">Saturday Pattern</h3>
              <p className="text-[11px] text-slate-500 mb-4">Indian schools often have specific Saturday-off patterns. Choose the one that applies.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                {[
                  { id: 'no-saturdays-off', title: 'No Saturdays Off', desc: 'All Saturdays are working days' },
                  { id: '1st-3rd-off', title: '1st & 3rd Saturday Off', desc: '2nd & 4th Saturdays are working' },
                  { id: 'every-saturday-off', title: 'Every Saturday Off', desc: 'All Saturdays are holidays' },
                  { id: '2nd-4th-off', title: '2nd & 4th Saturday Off', desc: '1st & 3rd Saturdays are working' },
                  { id: 'empty', empty: true },
                  { id: 'last-saturday-off', title: 'Last Saturday Off', desc: 'Only the last Saturday of each month is off' },
                ].map((pattern, idx) => {
                  if (pattern.empty) return <div key={idx} className="hidden md:block"></div>;
                  return (
                    <label 
                      key={pattern.id} 
                      className="flex items-start gap-3 cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSaturdayPattern(pattern.id);
                      }}
                    >
                      <div className="mt-0.5">
                        <div className={`w-4 h-4 rounded-none border flex items-center justify-center transition-colors ${selectedSaturdayPattern === pattern.id ? 'border-[#5F52FF]' : 'border-slate-300'}`}>
                          {selectedSaturdayPattern === pattern.id && (
                            <div className="w-2 h-2 rounded-none bg-[#5F52FF]"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className={`text-[13px] font-bold ${selectedSaturdayPattern === pattern.id ? 'text-slate-800' : 'text-slate-700'}`}>{pattern.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{pattern.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-slate-200 flex justify-end">
            <button className="bg-[#5F52FF] hover:bg-[#4f42e6] text-white px-5 py-2 rounded-none text-[13px] font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[450px] space-y-6">
          
          {/* Working Days Preview */}
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5F52FF]" />
              <h2 className="text-[14px] font-bold text-slate-800">Working Days Preview — August 2026</h2>
            </div>
            
            <div className="p-5">
              <div className="space-y-0 text-[13px] font-bold">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-700">Calendar Days</span>
                  <span className="text-slate-800">31</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-700">Weekly Offs (incl. Saturdays)</span>
                  <span className="text-red-500">- 5</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-700">Holidays (Staff-applicable)</span>
                  <span className="text-red-500">- 3</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#5F52FF] text-white px-3 -mx-3 mt-1 rounded-none">
                  <span>Actual Working Days</span>
                  <span>23</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-[11px] font-bold text-slate-500 mb-2">Staff Holidays This Month:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">17 Aug (Mon)</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">18 Aug (Tue)</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">19 Aug (Wed)</span>
                </div>
              </div>
              
              <div className="mt-5">
                <h4 className="text-[11px] font-bold text-slate-500 mb-2">Weekly Off Dates:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded">02 Aug (Sun)</span>
                  <span className="text-[10px] font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded">09 Aug (Sun)</span>
                  <span className="text-[10px] font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded">16 Aug (Sun)</span>
                  <span className="text-[10px] font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded">23 Aug (Sun)</span>
                  <span className="text-[10px] font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded">30 Aug (Sun)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* How it works */}
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-800" />
              <h2 className="text-[14px] font-bold text-slate-800">How it works</h2>
            </div>
            
            <div className="p-5 text-[12px] text-slate-600 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-none bg-[#5F52FF] mt-1.5 shrink-0"></div>
                <p>Weekly offs and Saturday patterns are used to calculate <strong>actual working days</strong> for payroll.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-none bg-[#5F52FF] mt-1.5 shrink-0"></div>
                <p>Payroll divides salary by working days (not calendar days), so staff aren't penalized for holidays.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-none bg-[#5F52FF] mt-1.5 shrink-0"></div>
                <p>Holidays set as "Students Only" in Events page won't affect staff payroll.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
