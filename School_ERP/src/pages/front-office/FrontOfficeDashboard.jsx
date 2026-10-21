import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontOfficeTabs from '../../components/front-office/FrontOfficeTabs';
import { 
  Users, UserCheck, CreditCard, HardHat, AlertCircle, 
  Mail, Plus, Search, ChevronRight, TrendingUp, 
  Clock, CheckCircle2, ArrowUpRight, Sparkles, LogOut,
  Calendar, ShieldCheck, PhoneCall
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const FrontOfficeDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load front office stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutVisitor = async (id, name) => {
    try {
      const res = await frontOfficeService.checkoutVisitor(id);
      if (res.success) {
        Swal.fire({
          title: 'Checked Out!',
          text: `${name} has been checked out.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        fetchDashboardStats();
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Checkout failed', icon: 'error', customClass: { popup: 'rounded-2xl' } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Front Office & Reception
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Reception Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time reception gate terminal, visitor registration, admission enquiries, and campus pass tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={() => navigate('/front-office/admission-enquiries/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Enquiry
          </button>
          <button 
            onClick={() => navigate('/front-office/visitor-book/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all transform active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-indigo-600" /> Check-in Visitor
          </button>
          <button 
            onClick={() => navigate('/front-office/gate-passes/issue')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all transform active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" /> Issue Gate Pass
          </button>
        </div>
      </div>

      {/* Tabs */}
      <FrontOfficeTabs />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Admission Enquiries */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admission Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalEnquiries ?? 8}</span>
            <span className="text-xs font-medium text-slate-500">Total Leads</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-auto">
              {stats?.pendingEnquiries ?? 2} Pending
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{stats?.admittedEnquiries ?? 2} Admissions confirmed</span>
          </div>
        </div>

        {/* Card 2: Visitor Book */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitors Today</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalVisitors ?? 6}</span>
            <span className="text-xs font-medium text-slate-500">Total Registered</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full ml-auto">
              {stats?.visitorsOnCampus ?? 2} On Campus
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Live badge tracking active
          </div>
        </div>

        {/* Card 3: Gate Passes */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gate Passes</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalGatePasses ?? 8}</span>
            <span className="text-xs font-medium text-slate-500">Issued</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
              {stats?.activeGatePasses ?? 4} Active / Out
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Gate terminal synchronized
          </div>
        </div>

        {/* Card 4: Complaints & Postal */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complaints & Postal</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.openComplaints ?? 3}</span>
            <span className="text-xs font-medium text-slate-500">Open Tickets</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full ml-auto">
              {stats?.totalPostalRecords ?? 6} Postal
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> {stats?.resolvedComplaints ?? 2} resolved this week
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enquiries by Source */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Admission Lead Sources</h2>
            <p className="text-xs text-slate-500">Inquiry conversion channels breakdown</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {stats?.enquirySourceData && stats.enquirySourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.enquirySourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.enquirySourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Loading sources...</div>
            )}
          </div>
        </div>

        {/* Complaints by Category */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Complaints by Department</h2>
            <p className="text-xs text-slate-500">Grievance logs grouped by school operational area</p>
          </div>

          <div className="h-60 w-full">
            {stats?.complaintTypeData && stats.complaintTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.complaintTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="value" name="Complaints" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400">Loading department data...</div>
            )}
          </div>
        </div>
      </div>

      {/* Two Columns Live Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Admission Enquiries */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Admission Enquiries</h2>
              <p className="text-[11px] text-slate-500">Prospective parents & student inquiries</p>
            </div>
            <button
              onClick={() => navigate('/front-office/admission-enquiries')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
              stats.recentEnquiries.map((enq) => (
                <div key={enq._id} className="p-3.5 hover:bg-slate-50/60 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                      {enq.studentName.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{enq.studentName}</div>
                      <div className="text-[11px] text-slate-500">
                        {enq.classApplied} • Parent: {enq.parentName} ({enq.phone})
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    enq.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    enq.status === 'Followed-up' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    enq.status === 'Lost' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {enq.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400">No recent enquiries.</div>
            )}
          </div>
        </div>

        {/* Visitors Logged in Reception */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Campus Visitors</h2>
              <p className="text-[11px] text-slate-500">Logged in visitors & checkout actions</p>
            </div>
            <button
              onClick={() => navigate('/front-office/visitor-book')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              Visitor Book <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {stats?.recentVisitors && stats.recentVisitors.length > 0 ? (
              stats.recentVisitors.map((vis) => {
                const isOnCampus = vis.status === 'On Campus' || !vis.outTime;
                return (
                  <div key={vis._id} className="p-3.5 hover:bg-slate-50/60 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          {vis.name}
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1 rounded">
                            {vis.badgeNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {vis.purpose} • Meeting: {vis.meetingWith}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOnCampus ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isOnCampus ? 'On Campus' : 'Checked Out'}
                      </span>
                      {isOnCampus && (
                        <button
                          onClick={() => handleCheckoutVisitor(vis._id, vis.name)}
                          className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold transition-colors"
                        >
                          Out
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-400">No active visitors.</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/front-office/gate-passes/terminal')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Gate Pass Terminal
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Real-time gate scan, student checkout & return</p>
        </div>

        <div 
          onClick={() => navigate('/front-office/campus-workers')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <HardHat className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Campus Workers
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Security badges, police verification & gate logs</p>
        </div>

        <div 
          onClick={() => navigate('/front-office/complaints')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Complaints & Grievances
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Helpdesk resolution, action notes & tracking</p>
        </div>

        <div 
          onClick={() => navigate('/front-office/postal-records')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Postal & Courier Records
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Inward & outward courier registry with references</p>
        </div>
      </div>
    </div>
  );
};

export default FrontOfficeDashboard;
