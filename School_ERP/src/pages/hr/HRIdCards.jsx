import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, HelpCircle, Users, CalendarCheck, CheckCircle, List, Send, 
  IndianRupee, FileText, Calculator, CreditCard, Star, RefreshCw, CheckSquare, 
  Building, Briefcase, IdCard, Settings, MoreVertical, ChevronDown, 
  Plus, Filter, RotateCcw, Search, Printer, Download, LayoutGrid, Image as ImageIcon, Eye,
  Sparkles, Wand2, Phone, HeartPulse, Check, School
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axios';
import { idCardService } from '../../api/idCardService';

export default function HRIdCards() {
  const navigate = useNavigate();

  const [activeSubTab, setActiveSubTab] = useState('Staff ID Cards');
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('golden-crest-faculty');
  const [selectedStaffPreview, setSelectedStaffPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [loading, setLoading] = useState(false);
  const [archiveCopy, setArchiveCopy] = useState(true);

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
    { name: 'ID Cards', icon: IdCard, path: '/hr/id-cards', active: true },
    { name: 'Settings', icon: Settings, path: '/hr/settings' },
  ];

  const subTabs = [
    { name: 'Student ID Cards', icon: Users, path: '/id-cards/student' },
    { name: 'Staff ID Cards', icon: IdCard, path: '/id-cards/staff' },
    { name: 'Card Designs', icon: LayoutGrid, path: '/id-cards/designs' },
  ];

  useEffect(() => {
    fetchStaffAndTemplates();
  }, []);

  const fetchStaffAndTemplates = async () => {
    setLoading(true);
    try {
      const [staffRes, tplRes] = await Promise.all([
        axiosInstance.get('/academics/teachers'),
        idCardService.getTemplates({ cardType: 'Staff' })
      ]);

      if (staffRes.data?.data) {
        setStaffList(staffRes.data.data);
        if (staffRes.data.data.length > 0) {
          setSelectedStaffPreview(staffRes.data.data[0]);
          setSelectedStaffIds([staffRes.data.data[0]._id]);
        }
      }

      if (tplRes.success && tplRes.data.length > 0) {
        setTemplates(tplRes.data);
        const facultyTpl = tplRes.data.find(t => t.templateId === 'golden-crest-faculty') || tplRes.data[0];
        setSelectedTemplateId(facultyTpl.templateId);
      }
    } catch (err) {
      console.error('Error fetching staff/templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeTemplate = useMemo(() => {
    return templates.find(t => t.templateId === selectedTemplateId) || {
      templateId: 'golden-crest-faculty',
      title: 'Golden Crest Faculty',
      themeColor: '#D97706',
      accentColor: '#FEF3C7',
      inkColor: '#451A03',
      schoolName: 'Greenwood International School',
      schoolTagline: 'Faculty & Administrative Council'
    };
  }, [templates, selectedTemplateId]);

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment;
      const full = `${s.fullName || ''} ${s.staffId || ''} ${s.designation || ''} ${s.phone || ''}`.toLowerCase();
      return matchesDept && full.includes(searchQuery.toLowerCase());
    });
  }, [staffList, selectedDepartment, searchQuery]);

  const toggleStaffSelection = (id) => {
    setSelectedStaffIds(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      const clicked = staffList.find(s => s._id === id);
      if (clicked && !exists) {
        setSelectedStaffPreview(clicked);
      }
      return updated;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStaffIds(filteredStaff.map(s => s._id));
      if (filteredStaff.length > 0) setSelectedStaffPreview(filteredStaff[0]);
    } else {
      setSelectedStaffIds([]);
    }
  };

  const handleAutoGenerate = async (isBulk = false) => {
    try {
      if (!isBulk) {
        if (!selectedStaffPreview?._id) {
          Swal.fire('Select Staff', 'Please select a staff member.', 'warning');
          return;
        }

        const res = await idCardService.autoGenerate({
          personType: 'Staff',
          personId: selectedStaffPreview._id,
          templateId: selectedTemplateId,
          validUntil: '31-Mar-2027',
          academicSession: '2026-2027'
        });

        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Staff ID Card Auto-Generated!',
            text: `Card ${res.data.cardNumber} for ${res.data.fullName} is ready.`,
            confirmButtonColor: '#5F52FF'
          });
        }
      } else {
        const res = await idCardService.bulkAutoGenerate({
          personType: 'Staff',
          department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
          templateId: selectedTemplateId,
          validUntil: '31-Mar-2027',
          academicSession: '2026-2027'
        });

        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Bulk Generation Complete!',
            text: `Generated ${res.count} faculty ID cards successfully.`,
            confirmButtonColor: '#5F52FF'
          });
        }
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 relative">
      
      {/* Hidden Print Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden !important; }
          #hr-id-card-print-target, #hr-id-card-print-target * { visibility: visible !important; }
          #hr-id-card-print-target {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            background: white !important;
            display: flex !important;
            justify-content: center !important;
          }
        }
      `}} />

      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-[#5F52FF] flex items-center gap-2">
          <IdCard className="w-6 h-6" /> Faculty & Staff ID Cards
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">Real-time database auto-generation, QR authorization codes, and printable credentials.</p>
      </div>

      {/* HR Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex px-6 gap-6 min-w-max">
          {tabs.slice(0, 15).map((tab) => (
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
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-white px-6 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-6 text-[13px] font-bold">
          {subTabs.map((tab) => (
            <button 
              key={tab.name}
              onClick={() => {
                setActiveSubTab(tab.name);
                navigate(tab.path);
              }}
              className={`flex items-center gap-2 py-3 border-b-2 transition-colors cursor-pointer ${
                tab.name === 'Staff ID Cards'
                  ? 'text-[#5F52FF] border-[#5F52FF]' 
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
        <button 
          onClick={() => navigate('/id-cards/student')}
          className="bg-[#5F52FF] hover:bg-[#4f42e6] text-white px-4 py-1.5 rounded-none font-bold text-[13px] flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> Open Full Studio
        </button>
      </div>

      <div className="p-6 max-w-full mx-auto space-y-6">
        
        {/* Select Criteria */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#5F52FF]" />
              <h2 className="text-[14px] font-bold text-slate-800">Select Criteria</h2>
            </div>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              Database Synced: {staffList.length} Teachers Active
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Department</label>
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-slate-300 rounded-none px-3 py-2 text-[13px] text-slate-600 focus:outline-none focus:border-[#5F52FF]"
                >
                  <option value="All">-- All Departments --</option>
                  <option value="Science & Math">Science & Math</option>
                  <option value="Languages">Languages</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Creative Arts">Creative Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Search Staff Name / ID</label>
                <input 
                  type="text" 
                  placeholder="Search staff name or STF-101..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-slate-300 rounded-none px-3 py-2 text-[13px] text-slate-600 focus:outline-none focus:border-[#5F52FF]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Print Cards Section */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm">
          <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#5F52FF]" />
              <h2 className="text-[14px] font-bold text-slate-800">Print Cards</h2>
            </div>
            <span className="bg-indigo-50 text-[#5F52FF] text-[11px] font-bold px-2 py-0.5 rounded-none border border-indigo-100">
              {selectedStaffIds.length} selected
            </span>
          </div>

          <div className="p-5 flex flex-col lg:flex-row gap-6">
            
            {/* Left side: Controls */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Card Design <span className="text-red-500">*</span></label>
                  <select 
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full border border-slate-300 rounded-none px-3 py-2 text-[13px] text-slate-600 focus:outline-none focus:border-[#5F52FF]"
                  >
                    {templates.map(t => (
                      <option key={t.templateId} value={t.templateId}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Print Mode</label>
                  <select className="w-full border border-slate-300 rounded-none px-3 py-2 text-[13px] text-slate-600 focus:outline-none focus:border-[#5F52FF]">
                    <option>Single Card Standard CR80</option>
                    <option>Sheet of cards (many per page)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-none flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setArchiveCopy(!archiveCopy)}
                    className={`w-8 h-4 rounded-none flex items-center px-0.5 cursor-pointer ${archiveCopy ? 'bg-[#5F52FF]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-none transition-all ${archiveCopy ? 'ml-auto' : ''}`}></div>
                  </div>
                  <div className="text-[13px]">
                    <span className="font-bold text-slate-800">Archive a digital copy</span>
                    <span className="text-slate-500 ml-2">Saves an exact replica to the database for auditing and re-downloads.</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAutoGenerate(false)}
                    className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-[#5F52FF] text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Auto-Gen Selected
                  </button>
                  <button 
                    onClick={() => handleAutoGenerate(true)}
                    className="px-3 py-1.5 bg-[#5F52FF] text-white text-xs font-bold hover:bg-[#4f42e6] flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Bulk Gen All
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200">
                <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#f8f9fc] text-[11px] font-bold text-[#5F52FF] uppercase border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 w-10">
                          <input 
                            type="checkbox" 
                            onChange={handleSelectAll}
                            checked={selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0}
                          />
                        </th>
                        <th className="px-3 py-2">STAFF</th>
                        <th className="px-3 py-2">STAFF ID</th>
                        <th className="px-3 py-2">DEPARTMENT</th>
                        <th className="px-3 py-2">DESIGNATION</th>
                        <th className="px-3 py-2">PHONE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[12px]">
                      {filteredStaff.map((staff) => {
                        const isSelected = selectedStaffIds.includes(staff._id);
                        const isCurrent = selectedStaffPreview?._id === staff._id;

                        return (
                          <tr 
                            key={staff._id} 
                            onClick={() => setSelectedStaffPreview(staff)}
                            className={`cursor-pointer transition-colors ${
                              isCurrent ? 'bg-indigo-50/60 font-semibold' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => toggleStaffSelection(staff._id)}
                              />
                            </td>
                            <td className="px-3 py-2 flex items-center gap-2">
                              <img 
                                src={staff.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'} 
                                alt={staff.fullName} 
                                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                              />
                              <span className="font-bold text-slate-800">{staff.fullName}</span>
                            </td>
                            <td className="px-3 py-2 font-mono font-bold text-red-500">{staff.staffId}</td>
                            <td className="px-3 py-2 text-slate-600">{staff.department}</td>
                            <td className="px-3 py-2 text-slate-600">{staff.designation}</td>
                            <td className="px-3 py-2 text-slate-500">{staff.phone}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right side: Live Preview */}
            <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Live Card Preview
              </span>

              {selectedStaffPreview ? (
                <div id="hr-id-card-print-target" className="p-3 bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
                  <div className="w-[240px] bg-white border border-slate-300 shadow-md flex flex-col overflow-hidden text-slate-800 text-[10px]">
                    {/* Header */}
                    <div 
                      className="p-3 text-center text-white" 
                      style={{ backgroundColor: activeTemplate.themeColor }}
                    >
                      <h4 className="font-extrabold uppercase tracking-tight text-[11px] leading-tight">
                        {activeTemplate.schoolName}
                      </h4>
                      <p className="text-[7.5px] opacity-80 mt-0.5 leading-none">{activeTemplate.schoolTagline}</p>
                      <div className="mt-1 bg-white/20 inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                        FACULTY ID
                      </div>
                    </div>

                    {/* Photo & Body */}
                    <div className="flex flex-col items-center pt-2 pb-3 px-3">
                      <div className="w-16 h-20 rounded-md overflow-hidden border-2 border-white shadow bg-slate-100">
                        <img 
                          src={selectedStaffPreview.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} 
                          alt="Staff" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-[12px] text-slate-900 mt-1.5 text-center leading-tight">
                        {selectedStaffPreview.fullName}
                      </h3>
                      <p className="text-[9px] font-bold text-[#5F52FF]">{selectedStaffPreview.designation}</p>

                      <div className="w-full mt-2 space-y-1 text-[8.5px] border-t border-slate-100 pt-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Staff ID:</span>
                          <span className="font-bold text-slate-800">{selectedStaffPreview.staffId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Dept:</span>
                          <span className="font-bold text-slate-800">{selectedStaffPreview.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Phone:</span>
                          <span className="font-bold text-slate-800">{selectedStaffPreview.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Valid Thru:</span>
                          <span className="font-bold text-emerald-700">31-Mar-2027</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div 
                        className="h-3 w-24" 
                        style={{ 
                          backgroundImage: `repeating-linear-gradient(90deg, #1e293b 0 2px, transparent 2px 4px, #1e293b 4px 6px, transparent 6px 9px, #1e293b 9px 11px)` 
                        }} 
                      />
                      <span className="text-[7.5px] font-bold text-slate-400">{selectedStaffPreview.staffId}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-300">
                  Select a staff member
                </div>
              )}

              <button 
                onClick={handlePrint}
                className="mt-4 w-full py-2 bg-[#5F52FF] hover:bg-[#4f42e6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Single Card
              </button>
            </div>

          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <span className="text-xs text-slate-500 font-medium">Ready to print • {selectedStaffIds.length} staff selected</span>
        <div className="flex gap-2">
          <button 
            onClick={() => handleAutoGenerate(false)}
            className="px-4 py-1.5 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#5F52FF]" /> Auto-Generate
          </button>
          <button 
            onClick={handlePrint}
            className="px-5 py-1.5 bg-[#5F52FF] hover:bg-[#4f42e6] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print Selected Cards
          </button>
        </div>
      </div>

    </div>
  );
}
