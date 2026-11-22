import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BarChart2, Users, HardDrive, TrendingUp, Calendar, 
  CreditCard, CheckCircle, Clock, ShieldCheck, ArrowUpRight, Sparkles,
  Award, Layers, ChevronRight, Activity, Download
} from 'lucide-react';
import { tenantService } from '../../api/tenantService';
import Swal from 'sweetalert2';

export default function SchoolAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getAnalytics(id);
      if (res.success) {
        setData(res.analytics);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to load school analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchLive = async () => {
    try {
      const res = await tenantService.impersonateTenant(id);
      if (res.success && res.token) {
        const liveUrl = `https://sms-frontend-by-raj-school-erp.onrender.com/login?impersonate_token=${encodeURIComponent(res.token)}&user=${encodeURIComponent(JSON.stringify(res.user || {}))}&schoolId=${encodeURIComponent(id)}`;
        window.open(liveUrl, '_blank');
      }
    } catch (e) {
      Swal.fire('Error', 'Unable to launch portal', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <Activity className="w-8 h-8 text-[#008f8c] animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading campus intelligence...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { school, quotas, admissionsTrend, financialHealth, attendanceStats, userBreakdown } = data;

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto pb-12">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/schools')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{school.name}</h1>
              <span className="bg-[#008f8c] text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                {school.plan}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Campus Analytics, Quota Usage & 12-Month Performance Metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/schools/${id}/edit`)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Edit Settings
          </button>
          <button
            onClick={handleLaunchLive}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Login to Dashboard</span>
          </button>
        </div>
      </div>

      {/* KPI Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Student Quota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Limit</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{quotas.enrolledStudents.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {quotas.studentLimit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${quotas.studentPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-blue-600 mt-1 block">{quotas.studentPercent}% quota utilized</span>
          </div>
        </div>

        {/* 2. Storage Quota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cloud Storage</span>
            <HardDrive className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{quotas.usedStorageMB} MB</span>
              <span className="text-xs text-slate-400 font-semibold">/ {quotas.storageLimitMB} MB</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${quotas.storagePercent}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">{quotas.storagePercent}% storage used</span>
          </div>
        </div>

        {/* 3. Attendance Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Attendance</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600">{attendanceStats.overallRate}%</span>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 mt-2">
              <span>Students: <b className="text-slate-800">{attendanceStats.studentsRate}%</b></span>
              <span>Faculty: <b className="text-slate-800">{attendanceStats.teachersRate}%</b></span>
            </div>
          </div>
        </div>

        {/* 4. Financial Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Collection</span>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">₹{(financialHealth.totalCollected / 100000).toFixed(1)}L</span>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${financialHealth.collectionPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">{financialHealth.collectionPercentage}% Collected</span>
          </div>
        </div>
      </div>

      {/* Admissions 12-Month Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">New Student Admissions (Last 12 Months)</h3>
            <p className="text-xs text-slate-500">Monthly enrollment intake trajectory across all academic programs</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg">
            Active Cycle 2026-27
          </span>
        </div>

        <div className="pt-4 flex items-end justify-between gap-2 h-48 border-b border-slate-100 pb-2">
          {admissionsTrend.map((item, idx) => {
            const maxVal = Math.max(...admissionsTrend.map(t => t.count), 1);
            const heightPercent = Math.round((item.count / maxVal) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-blue-600 transition">
                  {item.count}
                </span>
                <div 
                  className="w-full max-w-[28px] bg-gradient-to-t from-blue-600 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-teal-300"
                  style={{ height: `${Math.max(12, heightPercent)}%` }}
                />
                <span className="text-[11px] font-bold text-slate-600">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Directory Breakdown & Storage Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-sm sm:text-base">User Directory Breakdown</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Students', count: userBreakdown.students, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
              { label: 'Teaching Faculty', count: userBreakdown.teachers, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'Administrative Staff', count: userBreakdown.staff, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
              { label: 'Linked Parents', count: userBreakdown.parents, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
            ].map((usr, i) => (
              <div key={i} className={`p-4 rounded-xl border ${usr.bg}`}>
                <span className="text-xs font-semibold text-slate-500 block">{usr.label}</span>
                <span className={`text-xl font-black ${usr.color} block mt-1`}>{usr.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Module Navigation Deck */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-sm sm:text-base">Campus Management Modules</h3>
          <div className="space-y-2">
            {[
              { title: 'School Backups & Recovery', desc: 'Download JSON/SQL snapshots & verify integrity', path: `/schools/${id}/backups` },
              { title: 'School Data Explorer', desc: 'Inspect database tables & export records to CSV', path: `/schools/${id}/explorer` },
              { title: 'Billing Profile & Invoices', desc: 'Manage GST tax invoices & offline payments', path: `/schools/${id}/billing-profile` },
              { title: 'Advanced Settings & Modules', desc: 'Toggle ERP feature switches, domain & branding', path: `/schools/${id}/edit` }
            ].map((mod, i) => (
              <div 
                key={i} 
                onClick={() => navigate(mod.path)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#008f8c] transition">{mod.title}</h4>
                  <p className="text-[11px] text-slate-500">{mod.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#008f8c] transition" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
