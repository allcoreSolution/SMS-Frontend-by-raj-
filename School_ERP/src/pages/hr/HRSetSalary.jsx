import React, { useState } from 'react';
import HRTabs from '../../components/hr/HRTabs';
import { 
  LayoutDashboard, HelpCircle, Users, CalendarCheck, CheckCircle, List, Send, 
  IndianRupee, FileText, Calculator, CreditCard, Star, RefreshCw, CheckSquare, 
  Building, Briefcase, IdCard, Settings, MoreVertical, ChevronDown, 
  User, Settings2, Trash2, Plus, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hrService } from '../../api/hrService';

export default function HRSetSalary() {
  const navigate = useNavigate();

  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/hr/dashboard' },
    { name: 'Guide', icon: HelpCircle, path: '/hr/guide' },
    { name: 'Staff Directory', icon: Users, path: '/hr/staff' },
    { name: 'Attendance', icon: CalendarCheck, path: '/hr/attendance' },
    { name: 'Approve Leave', icon: CheckCircle, path: '/hr/approve-leave' },
    { name: 'Leave Types', icon: List, path: '/hr/leave-types' },
    { name: 'Apply Leave', icon: Send, path: '/hr/apply-leave' },
    { name: 'Set Salary', icon: IndianRupee, path: '/hr/set-salary', active: true },
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

  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffOptions, setStaffOptions] = useState([]);
  
  const [allowances, setAllowances] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [basicSalary, setBasicSalary] = useState("0");
  const [pfRate, setPfRate] = useState("12.00");
  const [esiRate, setEsiRate] = useState("0.75");
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
     hrService.getStaff().then(res => setStaffOptions(res.data || [])).catch(console.error);
  }, []);

  React.useEffect(() => {
    if (selectedStaff) {
      hrService.getStaffSalary(selectedStaff).then(res => {
         const data = res.data || {};
         setBasicSalary(data.basicSalary || "0");
         setPfRate(data.pfRate || "12.00");
         setEsiRate(data.esiRate || "0.75");
         setAllowances(data.allowances || []);
         setDeductions(data.deductions || []);
      }).catch(console.error);
    } else {
      setAllowances([]);
      setDeductions([]);
      setBasicSalary("0");
      setPfRate("12.00");
      setEsiRate("0.75");
    }
  }, [selectedStaff]);

  const handleAddAllowance = () => {
    setAllowances([...allowances, { id: Date.now(), name: '', amount: '' }]);
  };

  const handleRemoveAllowance = (id) => {
    setAllowances(allowances.filter(a => a.id !== id));
  };

  const handleAllowanceChange = (id, field, value) => {
    setAllowances(allowances.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleAddDeduction = () => {
    setDeductions([...deductions, { id: Date.now(), name: '', amount: '' }]);
  };

  const handleRemoveDeduction = (id) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const handleDeductionChange = (id, field, value) => {
    setDeductions(deductions.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSaveStructure = async () => {
     if(!selectedStaff) return alert('Select staff');
     setIsSaving(true);
     try {
       await hrService.setStaffSalary(selectedStaff, { basicSalary, pfRate, esiRate, allowances, deductions });
       alert('Salary structure saved successfully!');
     } catch (err) {
       alert(err.message || 'Error occurred');
     } finally {
       setIsSaving(false);
     }
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

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Select Staff Block */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <User className="w-4 h-4 text-[#5F52FF]" />
            <h2 className="text-[13px] font-bold text-slate-700">Select Staff Member</h2>
          </div>
          <div className="p-5">
            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Staff</label>
            <select 
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]"
            >
              <option value="">-- Select Staff --</option>
              {staffOptions.map(staff => (
                <option key={staff._id} value={staff._id}>
                  {staff.firstName} {staff.lastName} - {staff.designation || 'Staff'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Configuration Form (Visible when staff selected) */}
        {selectedStaff && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Column (Main Config) */}
            <div className="flex-1 space-y-6 w-full">
              
              {/* Header and Base Config */}
              <div className="bg-white border border-slate-200 rounded-none shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-[#5F52FF]" />
                    <h2 className="text-[14px] font-bold text-slate-800">Salary Details</h2>
                  </div>
                  <button className="px-4 py-1.5 bg-white border border-slate-300 rounded-none text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Settings2 className="w-3.5 h-3.5" /> Manage Templates
                  </button>
                </div>
                <div className="p-5 flex gap-6">
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Apply Salary Template</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]">
                      <option>Administrative Officer (₹25,000)</option>
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1">Selecting a template auto-populates salary and statutory parameters instantly.</p>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Basic Salary (₹) <span className="text-red-500">*</span></label>
                    <input type="text" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" />
                    <p className="text-[10px] text-slate-500 mt-1">The foundational monthly pay rate for this staff.</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Grids (Earnings & Deductions) */}
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Earnings */}
                <div className="flex-1 bg-white border border-slate-200 rounded-none shadow-sm flex flex-col">
                  <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 rounded-t-lg">
                    <div className="w-4 h-4 text-[#5F52FF] flex items-center justify-center font-bold text-[14px]">+</div>
                    <h2 className="text-[13px] font-bold text-slate-800">Earnings (Allowances)</h2>
                  </div>
                  <div className="p-5 flex-1">
                    <div className="grid grid-cols-[1fr_120px_40px] gap-3 mb-2">
                      <div className="text-[11px] font-bold text-slate-700">Allowance Name</div>
                      <div className="text-[11px] font-bold text-slate-700">Amount</div>
                      <div></div>
                    </div>
                    <div className="space-y-3">
                      {allowances.map((allowance) => (
                        <div key={allowance.id} className="grid grid-cols-[1fr_120px_40px] gap-3 items-center">
                          <input 
                            type="text" 
                            value={allowance.name}
                            onChange={(e) => handleAllowanceChange(allowance.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-none text-[12px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" 
                            placeholder="e.g., DA"
                          />
                          <input 
                            type="text" 
                            value={allowance.amount}
                            onChange={(e) => handleAllowanceChange(allowance.id, 'amount', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-none text-[12px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" 
                            placeholder="Amount"
                          />
                          <button 
                            onClick={() => handleRemoveAllowance(allowance.id)}
                            className="w-full h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-none border border-red-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-slate-200 mt-auto">
                    <button 
                      onClick={handleAddAllowance}
                      className="px-4 py-1.5 bg-white border border-slate-300 rounded-none text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Allowance
                    </button>
                  </div>
                </div>

                {/* Deductions */}
                <div className="flex-1 bg-white border border-slate-200 rounded-none shadow-sm flex flex-col">
                  <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 rounded-t-lg">
                    <div className="w-4 h-4 text-[#5F52FF] flex items-center justify-center font-bold text-[16px]">-</div>
                    <h2 className="text-[13px] font-bold text-slate-800">Custom Deductions</h2>
                  </div>
                  <div className="p-5 flex-1">
                    <div className="grid grid-cols-[1fr_120px_40px] gap-3 mb-2">
                      <div className="text-[11px] font-bold text-slate-700">Deduction Name</div>
                      <div className="text-[11px] font-bold text-slate-700">Amount</div>
                      <div></div>
                    </div>
                    <div className="space-y-3">
                      {deductions.map((deduction) => (
                        <div key={deduction.id} className="grid grid-cols-[1fr_120px_40px] gap-3 items-center">
                          <input 
                            type="text" 
                            value={deduction.name}
                            onChange={(e) => handleDeductionChange(deduction.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-none text-[12px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" 
                            placeholder="e.g., Staff Association"
                          />
                          <input 
                            type="text" 
                            value={deduction.amount}
                            onChange={(e) => handleDeductionChange(deduction.id, 'amount', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-none text-[12px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" 
                            placeholder="Amount"
                          />
                          <button 
                            onClick={() => handleRemoveDeduction(deduction.id)}
                            className="w-full h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-none border border-red-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-slate-200 mt-auto">
                    <button 
                      onClick={handleAddDeduction}
                      className="px-4 py-1.5 bg-white border border-slate-300 rounded-none text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Deduction
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column (Statutory Override Config) */}
            <div className="w-full lg:w-[350px] shrink-0 space-y-4">
              <div className="bg-white border border-slate-200 rounded-none shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#5F52FF]" />
                  <h2 className="text-[14px] font-bold text-slate-800">Statutory Override Config</h2>
                </div>
                <div className="p-5 space-y-6">
                  
                  {/* PF */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-[#5F52FF]"></div>
                      </div>
                      <span className="text-[13px] text-slate-800 font-bold">Provident Fund (PF)</span>
                    </label>
                    <div className="pl-10 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">PF Rate (%)</label>
                      <input type="text" value={pfRate} onChange={(e) => setPfRate(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" />
                      <p className="text-[9px] text-slate-400">Standard rate is 12% on Basic Salary.</p>
                    </div>
                  </div>

                  {/* ESI */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-[#5F52FF]"></div>
                      </div>
                      <span className="text-[13px] text-slate-800 font-bold">State Insurance (ESI)</span>
                    </label>
                    <div className="pl-10 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">ESI Employee Rate (%)</label>
                      <input type="text" value={esiRate} onChange={(e) => setEsiRate(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" />
                      <p className="text-[9px] text-slate-400">Statutory employee rate is 0.75% of Gross pay.</p>
                    </div>
                  </div>

                  {/* PT */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-[#5F52FF]"></div>
                      </div>
                      <span className="text-[13px] text-slate-800 font-bold">Professional Tax (PT)</span>
                    </label>
                    <div className="pl-10 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">PT Slabs State</label>
                      <select className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-700 focus:outline-none focus:border-[#5F52FF]">
                        <option>Karnataka</option>
                        <option>Maharashtra</option>
                      </select>
                      <p className="text-[9px] text-slate-400">Deducted according to state's gross salary slab.</p>
                    </div>
                  </div>

                  {/* TDS */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-[#5F52FF]"></div>
                      </div>
                      <span className="text-[13px] text-slate-800 font-bold">Income Tax (TDS)</span>
                    </label>
                  </div>

                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSaveStructure}
                disabled={isSaving}
                className="w-full py-3 bg-[#5F52FF] hover:bg-[#4f42e6] disabled:bg-gray-400 text-white font-bold text-[14px] rounded-none flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-none"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Salary Structure'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
