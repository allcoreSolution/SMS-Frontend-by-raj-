import React, { useState, useEffect } from 'react';
import HRTabs from '../../components/hr/HRTabs';
import { 
  LayoutDashboard, HelpCircle, Users, CalendarCheck, CheckCircle, List, Send, 
  IndianRupee, FileText, Calculator, CreditCard, Star, RefreshCw, CheckSquare, 
  Building, Briefcase, IdCard, Settings, Plus, MoreVertical, ChevronDown, 
  Calendar, User, Clock, Search, Edit, X, Check, ArrowRightToLine, ArrowLeftFromLine
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hrService } from '../../api/hrService';
import { attendanceService } from '../../api/attendanceService';
import Swal from 'sweetalert2';

export default function HRAttendance() {
  const navigate = useNavigate();

  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/hr/dashboard' },
    { name: 'Guide', icon: HelpCircle, path: '/hr/guide' },
    { name: 'Staff Directory', icon: Users, path: '/hr/staff' },
    { name: 'Attendance', icon: CalendarCheck, path: '/hr/attendance', active: true },
    { name: 'Approve Leave', icon: CheckCircle, path: '/hr/leaves/approve' },
    { name: 'Leave Types', icon: List, path: '/hr/leaves/types' },
    { name: 'Apply Leave', icon: Send, path: '/hr/leaves/apply' },
    { name: 'Set Salary', icon: IndianRupee, path: '/hr/salary/set' },
    { name: 'Salary Templates', icon: FileText, path: '/hr/salary/templates' },
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

  const [activeTab, setActiveTab] = useState('Daily');
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMarks, setAttendanceMarks] = useState({});

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await hrService.getStaff();
      if(res.data) {
         setStaffList(res.data.map((s, i) => {
           const staffName = (s.fullName || `${s.firstName||''} ${s.lastName||''}`).trim() || 'Staff Member';
           return {
             id: s._id,
             name: staffName,
             role: s.designation || 'Staff',
             dept: s.department || 'General',
             initial: staffName.charAt(0) || 'S',
             color: ['bg-teal-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500'][i%4],
           };
         }));
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Failed to load staff list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (staffId, status) => {
     setAttendanceMarks(prev => ({...prev, [staffId]: status}));
  };

  const handleSaveAll = async () => {
    const payload = Object.entries(attendanceMarks).map(([staffId, status]) => ({
       staff: staffId,
       status: status,
       date: date
    }));
    
    if(payload.length === 0) return Swal.fire('Notice', 'No attendance marked yet', 'info');
    
    try {
       await attendanceService.markStaffAttendance({ attendanceData: payload });
       Swal.fire({title: 'Saved', text: 'Attendance saved successfully', icon: 'success', timer: 2000, showConfirmButton: false});
    } catch(err) {
       Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const openMarkModal = (staff = null) => {
    setSelectedStaff(staff);
    setShowMarkModal(true);
  };

  const renderDailyView = () => (
    <div className="bg-white border border-slate-200 rounded-none shadow-sm">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-slate-700">Marking: {new Date(date).toLocaleDateString()}</h3>
        <button onClick={handleSaveAll} className="px-4 py-1.5 bg-[#6f42c1] text-white text-[12px] font-bold rounded-none flex items-center gap-2 hover:bg-[#59339e] transition-colors cursor-pointer border-none shadow-sm">
          <Check className="w-3.5 h-3.5" /> Save All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
              <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
              <th className="px-4 py-3">Staff Name</th>
              <th className="px-4 py-3">Role / Dept</th>
              <th className="px-4 py-3 text-center">Status Marking</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-[12px] text-slate-700">
            {loading ? <tr><td colSpan="5" className="p-5 text-center text-slate-500 text-[13px] font-bold">Loading staff directory...</td></tr> : staffList.map(staff => (
              <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-300 accent-[#6f42c1]" /></td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-none text-white flex items-center justify-center font-bold ${staff.color}`}>{staff.initial}</div>
                  <span className="font-bold">{staff.name}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] text-slate-500 mb-0.5">{staff.role}</div>
                  <div className="inline-block px-2 py-0.5 border border-slate-200 rounded-none text-[10px] bg-white">{staff.dept}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center border border-slate-200 rounded-none overflow-hidden w-fit mx-auto">
                    <button onClick={()=>handleMarkChange(staff.id, 'Present')} className={`px-4 py-1.5 text-[11px] font-bold border-r border-slate-200 cursor-pointer transition-colors ${attendanceMarks[staff.id]==='Present'?'bg-green-100 text-green-700':'bg-white text-slate-600 hover:bg-slate-50'}`}>P</button>
                    <button onClick={()=>handleMarkChange(staff.id, 'Absent')} className={`px-4 py-1.5 text-[11px] font-bold border-r border-slate-200 cursor-pointer transition-colors ${attendanceMarks[staff.id]==='Absent'?'bg-red-100 text-red-700':'bg-white text-slate-600 hover:bg-slate-50'}`}>A</button>
                    <button onClick={()=>handleMarkChange(staff.id, 'Late')} className={`px-4 py-1.5 text-[11px] font-bold border-r border-slate-200 cursor-pointer transition-colors ${attendanceMarks[staff.id]==='Late'?'bg-yellow-100 text-yellow-700':'bg-white text-slate-600 hover:bg-slate-50'}`}>L</button>
                    <button onClick={()=>handleMarkChange(staff.id, 'Half Day')} className={`px-4 py-1.5 text-[11px] font-bold cursor-pointer transition-colors ${attendanceMarks[staff.id]==='Half Day'?'bg-blue-100 text-blue-700':'bg-white text-slate-600 hover:bg-slate-50'}`}>HD</button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openMarkModal(staff)} className="px-3 py-1 bg-white border border-slate-200 rounded-none hover:bg-slate-50 text-[11px] font-bold text-[#6f42c1] inline-flex items-center gap-1 cursor-pointer">
                    <Edit className="w-3 h-3" /> Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSummaryView = () => {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    
    return (
      <div className="bg-white border border-slate-200 rounded-none shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-slate-800">Monthly Summary - August 2026</h3>
          <div className="flex items-center gap-4 text-[11px] font-bold">
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Present</span>
            <span className="flex items-center gap-1"><X className="w-3 h-3 text-red-500" /> Absent</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-500" /> Late</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-none border border-teal-500 overflow-hidden relative"><div className="absolute top-0 bottom-0 left-0 w-1/2 bg-teal-500"></div></div> Half Day</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-[12px] font-bold text-slate-700 text-left w-48 sticky left-0 bg-slate-50 border-r border-slate-200 z-10">Employee</th>
                {days.map(d => (
                  <th key={d} className="min-w-[32px] py-2 border-r border-slate-200 last:border-r-0">
                    <div className="text-[12px] font-bold text-slate-800">{d}</div>
                    <div className="text-[9px] text-slate-400 uppercase">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(d+5)%7]}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-[12px] font-bold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {staffList.map((staff, idx) => (
                <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 text-left sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-200">
                    <div className="font-bold text-slate-700 leading-tight">{staff.name}</div>
                    <div className="inline-block px-1.5 py-0.5 border border-slate-200 rounded-none text-[9px] text-slate-500 mt-1">{staff.role}</div>
                  </td>
                  {days.map(d => {
                    let content = <span className="text-slate-300">-</span>;
                    if(idx === 0) {
                      if(d===1) content = <Clock className="w-3.5 h-3.5 text-yellow-500 mx-auto" />;
                      else if([4,7,8,9,11,12,13,21,22].includes(d)) content = <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />;
                      else if(d===6) content = <X className="w-3.5 h-3.5 text-red-500 mx-auto" />;
                      else if(d===23) content = <div className="w-3.5 h-3.5 rounded-none border border-teal-500 overflow-hidden relative mx-auto"><div className="absolute top-0 bottom-0 left-0 w-1/2 bg-teal-500"></div></div>;
                    } else if(idx === 1 && [11].includes(d)) content = <X className="w-3.5 h-3.5 text-red-500 mx-auto" />;
                    else if(idx === 1 && [22].includes(d)) content = <Clock className="w-3.5 h-3.5 text-yellow-500 mx-auto" />;
                    else if(idx === 2 && [11, 22].includes(d)) content = <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />;
                    else if(idx === 3 && [7].includes(d)) content = <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />;
                    else if(idx === 3 && [11].includes(d)) content = <X className="w-3.5 h-3.5 text-red-500 mx-auto" />;
                    else if(idx === 3 && [22].includes(d)) content = <Clock className="w-3.5 h-3.5 text-yellow-500 mx-auto" />;
                    else if(idx === 4 && [6, 11, 22].includes(d)) content = <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />;
                    else if(idx === 5 && [11].includes(d)) content = <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />;
                    else if(idx === 5 && [22].includes(d)) content = <Clock className="w-3.5 h-3.5 text-yellow-500 mx-auto" />;
                    else if(idx === 6 && [22].includes(d)) content = <Clock className="w-3.5 h-3.5 text-yellow-500 mx-auto" />;
                    else if(idx === 6 && [23].includes(d)) content = <X className="w-3.5 h-3.5 text-red-500 mx-auto" />;
                    
                    return (
                      <td key={d} className="border-r border-slate-100 last:border-r-0 py-2">
                        {content}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 font-bold text-slate-700 border-l border-slate-200">
                    {idx === 0 ? '9.5/31' : (idx===1?'0/31':(idx===2?'2/31':(idx===3?'1/31':(idx===4?'3/31':(idx===5?'1/31':'0/31')))))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMemberView = () => (
    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-16 text-center">
      <div className="max-w-md mx-auto">
        <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-[16px] font-bold text-slate-700 mb-2">Select a Staff Member</h3>
        <p className="text-[13px] text-slate-500">Please select a staff member and month from the filter criteria above to view detailed individual attendance records.</p>
      </div>
    </div>
  );

  const renderHourView = () => {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    
    return (
      <div className="bg-white border border-slate-200 rounded-none shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-slate-800">Attendance by Hour - August 2026</h3>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5" /> Working Hours per Day
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-[12px] font-bold text-slate-700 text-left w-48 sticky left-0 bg-slate-50 border-r border-slate-200 z-10">Employee</th>
                {days.map(d => (
                  <th key={d} className="min-w-[32px] py-2 border-r border-slate-200 last:border-r-0">
                    <div className="text-[12px] font-bold text-slate-800">{d}</div>
                    <div className="text-[9px] text-slate-400 uppercase">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(d+5)%7]}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-[12px] font-bold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {staffList.map((staff, idx) => (
                <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 text-left sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-200">
                    <div className="font-bold text-slate-700 leading-tight">{staff.name}</div>
                    <div className="inline-block px-1.5 py-0.5 border border-slate-200 rounded-none text-[9px] text-slate-500 mt-1">{staff.role}</div>
                  </td>
                  {days.map(d => {
                    let content = <span className="text-slate-300">-</span>;
                    if (idx === 0 && [4,6,7,8,11,12,13,21,22,23].includes(d)) {
                      content = <div className="text-[9px] leading-tight font-bold text-slate-600">0h<br/><span className="text-slate-400 font-normal">0m</span></div>;
                    } else if (idx === 1 && [11, 22].includes(d)) {
                      content = <div className="text-[9px] leading-tight font-bold text-slate-600">0h<br/><span className="text-slate-400 font-normal">0m</span></div>;
                    } else if (idx === 2 && [11, 22].includes(d)) {
                      content = <div className="text-[9px] leading-tight font-bold text-slate-600">0h<br/><span className="text-slate-400 font-normal">0m</span></div>;
                    } else if (idx === 3 && [7, 11, 22].includes(d)) {
                      content = <div className="text-[9px] leading-tight font-bold text-slate-600">0h<br/><span className="text-slate-400 font-normal">0m</span></div>;
                    } else if (idx === 4 && [6, 11, 22].includes(d)) {
                      content = <div className="text-[9px] leading-tight font-bold text-slate-600">0h<br/><span className="text-slate-400 font-normal">0m</span></div>;
                    } else if (idx === 5 && [11, 22].includes(d)) {
                      content = <div className="text-[9px] leading-tight font-bold text-slate-600">0h<br/><span className="text-slate-400 font-normal">0m</span></div>;
                    } else if (idx === 6 && [22, 23].includes(d)) {
                      content = <div className="text-[9px] leading-tight font-bold text-slate-600">0h<br/><span className="text-slate-400 font-normal">0m</span></div>;
                    }
                    
                    return (
                      <td key={d} className="border-r border-slate-100 last:border-r-0 py-1.5">
                        {content}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 font-bold text-slate-700 border-l border-slate-200">
                    0h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Human Resource</h1>
          <p className="text-[11px] text-slate-500 mt-1">Manage staff, attendance, leaves, payroll, and loans across the school.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <HRTabs />

      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        
        {/* Top Controls */}
        <div className="flex justify-end mb-4 gap-4">
          <div className="flex border border-slate-300 rounded-none overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveTab('Daily')}
              className={`px-4 py-1.5 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'Daily' ? 'bg-[#5F52FF] text-white border-r border-[#5F52FF]' : 'bg-white text-slate-600 hover:bg-slate-50 border-r border-slate-300'}`}
            >
              <Calendar className="w-3.5 h-3.5" /> Daily
            </button>
            <button 
              onClick={() => setActiveTab('Summary')}
              className={`px-4 py-1.5 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'Summary' ? 'bg-[#5F52FF] text-white border-r border-[#5F52FF]' : 'bg-white text-slate-600 hover:bg-slate-50 border-r border-slate-300'}`}
            >
              <List className="w-3.5 h-3.5" /> Summary
            </button>
            <button 
              onClick={() => setActiveTab('Member')}
              className={`px-4 py-1.5 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'Member' ? 'bg-[#5F52FF] text-white border-r border-[#5F52FF]' : 'bg-white text-slate-600 hover:bg-slate-50 border-r border-slate-300'}`}
            >
              <User className="w-3.5 h-3.5" /> Member
            </button>
            <button 
              onClick={() => setActiveTab('Hour')}
              className={`px-4 py-1.5 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'Hour' ? 'bg-[#5F52FF] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <Clock className="w-3.5 h-3.5" /> Hour
            </button>
          </div>
          <button 
            onClick={() => openMarkModal()}
            className="px-4 py-1.5 bg-[#5F52FF] hover:bg-[#4f42e6] text-white font-bold text-[12px] rounded-none flex items-center gap-2 transition-colors shadow-sm cursor-pointer border-none"
          >
            <Plus className="w-3.5 h-3.5" /> Mark Attendance
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm">
          <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
            <h2 className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <Search className="w-4 h-4" /> Filter Criteria
            </h2>
            <button className="text-slate-400 hover:text-slate-600"><ChevronDown className="w-4 h-4" /></button>
          </div>
          <div className="p-5 flex gap-6 items-end">
            {activeTab !== 'Member' ? (
              <>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-none text-[12px] bg-white focus:outline-none focus:border-[#5F52FF]">
                    <option>All Departments</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-none text-[12px] bg-white focus:outline-none focus:border-[#5F52FF]">
                    <option>All Designations</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {activeTab === 'Daily' ? 'Date' : 'Month'}
                  </label>
                  <div className="relative">
                    <input 
                      type={activeTab === 'Daily' ? 'date' : 'month'} 
                      value={activeTab === 'Daily' ? date : date.slice(0, 7)}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-none text-[12px] bg-white focus:outline-none focus:border-[#5F52FF]" 
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Staff Member</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-none text-[12px] bg-white focus:outline-none focus:border-[#5F52FF]">
                    <option>Select Staff</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Month</label>
                  <div className="relative">
                    <input 
                      type="month"
                      defaultValue="2026-08"
                      className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-none text-[12px] bg-white focus:outline-none focus:border-[#5F52FF]" 
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1"></div>
              </>
            )}
            <button className="px-6 py-2 bg-[#5F52FF] hover:bg-[#4f42e6] text-white font-bold text-[12px] rounded-none flex items-center justify-center gap-2 transition-colors cursor-pointer h-[34px] min-w-[120px]">
              <Search className="w-3.5 h-3.5" /> Apply
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Daily' && renderDailyView()}
        {activeTab === 'Summary' && renderSummaryView()}
        {activeTab === 'Member' && renderMemberView()}
        {activeTab === 'Hour' && renderHourView()}

      </div>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">Mark Attendance</h2>
              <button onClick={() => setShowMarkModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Employee</div>
                  <div className="text-[16px] font-bold text-[#1e293b] mt-0.5">{selectedStaff ? selectedStaff.name : 'Amit Sharma'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Date</div>
                  <div className="text-[14px] font-bold text-[#1e293b] mt-0.5">24 Aug, 2026</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[13px] font-bold text-slate-700">Status <span className="text-red-500">*</span></label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-[#5F52FF]"></div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-bold">Admin Override</span>
                  </label>
                </div>
                <div className="flex border border-slate-200 rounded-none overflow-hidden">
                  <button className="flex-1 py-2 text-[12px] font-bold bg-white text-slate-600 border-r border-slate-200 hover:bg-slate-50">Present</button>
                  <button className="flex-1 py-2 text-[12px] font-bold bg-white text-slate-600 border-r border-slate-200 hover:bg-slate-50">Absent</button>
                  <button className="flex-1 py-2 text-[12px] font-bold bg-white text-slate-600 border-r border-slate-200 hover:bg-slate-50">Late</button>
                  <button className="flex-1 py-2 text-[12px] font-bold bg-white text-slate-600 hover:bg-slate-50">Half Day</button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Clock In Time</label>
                  <div className="relative">
                    <ArrowRightToLine className="w-4 h-4 text-green-500 absolute left-3 top-2.5" />
                    <input type="text" placeholder="--:--" className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-none text-[13px] focus:outline-none focus:border-[#5F52FF]" />
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Clock Out Time</label>
                  <div className="relative">
                    <ArrowLeftFromLine className="w-4 h-4 text-red-500 absolute left-3 top-2.5" />
                    <input type="text" placeholder="--:--" className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-none text-[13px] focus:outline-none focus:border-[#5F52FF]" />
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Remarks</label>
                <textarea 
                  rows="3" 
                  placeholder="Add optional remarks..."
                  className="w-full p-3 border border-slate-300 rounded-none text-[13px] focus:outline-none focus:border-[#5F52FF] resize-none"
                ></textarea>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50">
              <button className="w-full py-2.5 bg-[#5F52FF] hover:bg-[#4f42e6] text-white font-bold text-[13px] rounded-none transition-colors uppercase tracking-wide cursor-pointer">
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
