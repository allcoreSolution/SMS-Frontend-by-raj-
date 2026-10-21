import React, { useState, useEffect } from 'react';
import { 
  Users, Building, Briefcase, CalendarCheck, CheckCircle, 
  IndianRupee, CreditCard, Plus, RefreshCw, Clock, 
  ArrowRight, ShieldCheck, AlertCircle, FileText, 
  UserCheck, HeartHandshake, Sparkles, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';

const PIE_COLORS = ['#f59e0b', '#10b981', '#ef4444'];

export default function HRDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStaff: 0,
      departmentsCount: 0,
      designationsCount: 0,
      pendingLeaves: 0,
      approvedLeaves: 0,
      activeLoans: 0,
      totalLoanBalance: 0,
      monthlyPayrollEstimate: 0,
      attendanceRate: '95%'
    },
    deptChart: [],
    leaveStatusData: [],
    recentStaff: [],
    recentLeaves: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await hrService.getHRDashboardStats();
      if (res?.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error fetching HR stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const { stats, deptChart, leaveStatusData, recentStaff, recentLeaves } = dashboardData;

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
                Human Resource Management
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Staff directory, attendance records, leaves, payroll structures, and performance appraisals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={fetchDashboardStats}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => navigate('/hr/staff/new')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Staff
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-800">{stats.totalStaff || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Staff</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-blue-700">{stats.departmentsCount || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departments</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-indigo-700">{stats.designationsCount || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designations</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-amber-600">{stats.pendingLeaves || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Leaves</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-emerald-600">
                ₹{((stats.monthlyPayrollEstimate || 0) / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Payroll</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-rose-600">{stats.activeLoans || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Loans</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Staff Distribution */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Staff by Department</h3>
                <p className="text-[11px] text-slate-400">Headcount distribution across operational units</p>
              </div>
              <button
                onClick={() => navigate('/hr/departments')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Manage &rarr;
              </button>
            </div>

            <div className="h-64 w-full">
              {deptChart && deptChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: '#64748b' }} 
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
                    />
                    <Bar dataKey="staffCount" name="Staff Members" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading department analytics...
                </div>
              )}
            </div>
          </div>

          {/* Leave Status Pie */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Leave Applications</h3>
              <p className="text-[11px] text-slate-400">Approval ratio across requests</p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              {leaveStatusData && leaveStatusData.some(d => d.count > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveStatusData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={75}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {leaveStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-1.5 opacity-60" />
                  No pending leave backlog
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Operations Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => navigate('/hr/staff')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl w-fit group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 mt-2.5">Staff Directory</div>
            <div className="text-[11px] text-slate-400">Browse & manage employees</div>
          </button>

          <button
            onClick={() => navigate('/hr/approve-leave')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl w-fit group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 mt-2.5">Approve Leaves</div>
            <div className="text-[11px] text-slate-400">Review pending requests</div>
          </button>

          <button
            onClick={() => navigate('/hr/salary-templates')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 mt-2.5">Salary Templates</div>
            <div className="text-[11px] text-slate-400">Pay bands & allowances</div>
          </button>

          <button
            onClick={() => navigate('/hr/manage-loans')}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl w-fit group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-800 mt-2.5">Staff Loans</div>
            <div className="text-[11px] text-slate-400">Advances & repayments</div>
          </button>
        </div>

        {/* Recent Data Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Staff Members */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Recently Joined Staff</span>
              </div>
              <button 
                onClick={() => navigate('/hr/staff')}
                className="text-xs text-purple-600 hover:text-purple-700 font-bold hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentStaff.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No staff members found.</div>
              ) : (
                recentStaff.map((staff) => (
                  <div key={staff._id} className="p-4 flex items-center justify-between hover:bg-slate-50/75 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-black flex items-center justify-center text-xs">
                        {staff.fullName ? staff.fullName.charAt(0) : 'S'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{staff.fullName}</div>
                        <div className="text-[11px] text-slate-400">{staff.designation} • {staff.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 text-slate-600">
                        {staff.staffId}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{staff.phone || staff.email}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Leave Requests */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <CalendarCheck className="w-4 h-4 text-purple-600" />
                <span>Leave Applications Feed</span>
              </div>
              <button 
                onClick={() => navigate('/hr/approve-leave')}
                className="text-xs text-purple-600 hover:text-purple-700 font-bold hover:underline"
              >
                Review All &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentLeaves.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No leave requests currently logged.</div>
              ) : (
                recentLeaves.map((leave) => (
                  <div key={leave._id} className="p-4 flex items-center justify-between hover:bg-slate-50/75 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          {leave.staffId?.fullName || 'Staff Member'}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full">
                          {leave.leaveType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 max-w-xs truncate">
                        {leave.reason}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      leave.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : leave.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
