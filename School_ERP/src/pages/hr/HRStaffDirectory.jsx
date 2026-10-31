import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, RefreshCw, Trash2, 
  Eye, Edit, Phone, Mail, Building, Briefcase, 
  Download, Printer, AlertCircle, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';
import { exportToCSV, exportToExcel, printTable } from '../../utils/exportUtils';

export default function HRStaffDirectory() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await hrService.getDepartments();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setDepartments(list);
    } catch (err) {
      console.warn('Could not load departments', err);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await hrService.getStaff({ limit: 100 });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setStaffList(list);
    } catch (err) {
      console.error('Error fetching staff directory:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Staff',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Staff Member?',
      text: `Are you sure you want to remove "${name}" from the system?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Staff'
    });

    if (result.isConfirmed) {
      try {
        await hrService.deleteStaff(id);
        Swal.fire({
          icon: 'success',
          title: 'Staff Member Deleted',
          timer: 1400,
          showConfirmButton: false
        });
        fetchStaff();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err?.response?.data?.message || err.message,
          confirmButtonColor: '#7c3aed'
        });
      }
    }
  };

  const filteredStaff = staffList.filter(s => {
    const nameMatch = !searchQuery || 
      (s.fullName && s.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.staffId && s.staffId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const deptMatch = selectedDept === 'All Departments' || s.department === selectedDept;
    return nameMatch && deptMatch;
  });

  const exportHeaders = ['staffId', 'fullName', 'designation', 'department', 'email', 'phone'];
  const handleCSV = () => exportToCSV(exportHeaders, filteredStaff, 'staff_directory.csv');
  const handleExcel = () => exportToExcel(exportHeaders, filteredStaff, 'staff_directory.xls');
  const handlePrint = () => printTable('Staff Directory Report', exportHeaders, filteredStaff);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Staff Directory
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Comprehensive directory of institutional educators, administrative heads, and operational staff
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={handleCSV}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button 
              onClick={handlePrint}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              title="Print Table"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/hr/staff/new')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Staff Member
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by full name, employee ID, or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full md:w-56 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
          >
            <option value="All Departments">All Departments</option>
            {departments.map((d, i) => (
              <option key={d._id || i} value={d.name}>{d.name}</option>
            ))}
          </select>

          <button 
            onClick={fetchStaff}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Employees Enrolled ({filteredStaff.length})</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Real-time database sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                        <span className="font-medium text-xs">Loading staff records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <span className="font-semibold text-slate-700 text-sm">No Staff Found</span>
                        <span className="text-xs text-slate-400">Click "Add Staff Member" or reset search filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff, idx) => (
                    <tr key={staff._id || idx} className="hover:bg-slate-50/75 transition-colors group">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-black flex items-center justify-center text-xs shadow-xs overflow-hidden">
                            {staff.photo ? (
                              <img 
                                src={staff.photo.startsWith('http') || staff.photo.startsWith('data:') ? staff.photo : `http://localhost:5050/${staff.photo.replace(/^\/+/, '')}`} 
                                alt={staff.fullName} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              staff.fullName ? staff.fullName.charAt(0) : 'S'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                              {staff.fullName || `${staff.firstName || ''} ${staff.lastName || ''}`}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              {staff.gender || 'Employee'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px]">
                          {staff.staffId || 'STF-NEW'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{staff.designation || 'Staff'}</div>
                        <div className="text-[11px] text-purple-600 font-medium mt-0.5">
                          {staff.department || 'General'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{staff.email}</span>
                        </div>
                        {staff.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{staff.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/hr/staff/profile/${staff._id}`)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/hr/staff/edit/${staff._id}`)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Staff"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(staff._id, staff.fullName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Staff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
