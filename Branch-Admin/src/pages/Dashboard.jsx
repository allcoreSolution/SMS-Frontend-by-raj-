import React, { useEffect, useState } from 'react';
import { 
  Globe, Users, Handshake, User, BookOpen, Contact, CreditCard, ChevronRight, 
  Key, Scale, Settings, BarChart2, Plus, Building2, TrendingUp, ShieldCheck,
  CheckCircle2, AlertCircle, ArrowUpRight, School, Sparkles, Calendar, Layers,
  LayoutTemplate, RotateCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { branchAdminService } from '../api/branchAdminService';
import branchLocalDb from '../api/branchLocalDb';


const ExecutiveStatCard = ({ title, value, subText, icon: Icon, gradient, badge }) => (
  <div className={`p-5 rounded-xl shadow-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden text-white ${gradient}`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 pointer-events-none" />
    
    <div className="flex justify-between items-start mb-3 relative z-10">
      <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/20 shadow-xs">
        <Icon className="w-6 h-6 text-white" />
      </div>
      {badge && (
        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/25">
          {badge}
        </span>
      )}
    </div>

    <div className="relative z-10">
      <h3 className="text-3xl font-black tracking-tight leading-none mb-1">{value}</h3>
      <p className="text-[13.5px] font-bold opacity-90">{title}</p>
      {subText && <p className="text-[11.5px] opacity-75 mt-0.5 font-medium">{subText}</p>}
    </div>
  </div>
);

const BranchCard = ({ branch = {} }) => {
  const name = branch.name || branch.branchName || 'Campus Branch';
  const status = branch.status || 'Active';
  const students = Number(branch.students || 0);
  const staff = Number(branch.staff || 0);
  const attendance = branch.attendance || '92%';
  const collected = branch.collected || '₹0';
  const renews = branch.renews || 'Annual';

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 font-sans group hover:shadow-md hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-[15.5px] font-bold text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors">
              {name}
            </h3>
            <p className="text-[11.5px] text-gray-400 mt-0.5 flex items-center gap-1.5 font-medium">
              <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center text-[10px]">📅</span> 
              Renews: <strong className="text-gray-600">{renews}</strong>
            </p>
          </div>
          <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
            status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            status === 'Expiring' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-gray-100 text-gray-600'
          }`}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#f0f7ff] p-2.5 rounded-lg flex flex-col items-center justify-center min-h-[64px]">
            <span className="text-[#3c8dbc] font-black text-xl leading-none">{students.toLocaleString()}</span>
            <span className="text-gray-500 text-[11px] mt-1 font-semibold">Students</span>
          </div>
          <div className="bg-[#f9f3ff] p-2.5 rounded-lg flex flex-col items-center justify-center min-h-[64px]">
            <span className="text-[#8b5cf6] font-black text-xl leading-none">{staff.toLocaleString()}</span>
            <span className="text-gray-500 text-[11px] mt-1 font-semibold">Staff & Faculty</span>
          </div>
          <div className="bg-[#faf5ff] p-2.5 rounded-lg flex flex-col items-center justify-center min-h-[64px]">
            <span className="text-amber-600 font-black text-xl leading-none">{attendance}</span>
            <span className="text-gray-500 text-[11px] mt-1 font-semibold">Attendance</span>
          </div>
          <div className="bg-[#f0faeb] p-2.5 rounded-lg flex flex-col items-center justify-center min-h-[64px]">
            <span className="text-[#00a65a] font-black text-xl leading-none">{collected}</span>
            <span className="text-gray-500 text-[11px] mt-1 text-center font-semibold">Collected (MTD)</span>
          </div>
        </div>
      </div>

      <Link 
        to="/branches" 
        className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all flex items-center justify-center gap-1.5 group-hover:shadow-2xs cursor-pointer"
      >
        Manage School Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState(() => {
    try {
      return branchLocalDb.getBranches() || [];
    } catch (_) {
      return [];
    }
  });
  const [stats, setStats] = useState(() => {
    try {
      return branchLocalDb.getDashboardStats() || {
        branchesCount: 4,
        activeBranches: 4,
        totalStudents: 3840,
        totalStaff: 250,
        totalCollected: '₹35.66 Lakhs'
      };
    } catch (_) {
      return {
        branchesCount: 4,
        activeBranches: 4,
        totalStudents: 3840,
        totalStaff: 250,
        totalCollected: '₹35.66 Lakhs'
      };
    }
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loginLogs, setLoginLogs] = useState(() => {
    try {
      return (branchLocalDb.getLoginLogs() || []).slice(0, 4);
    } catch (_) {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch live real-time stats from Central MongoDB via API
      const statsRes = await branchAdminService.getDashboardStats();
      if (statsRes?.data) {
        setStats(statsRes.data);
        if (Array.isArray(statsRes.data.branches) && statsRes.data.branches.length > 0) {
          setBranches(statsRes.data.branches);
        }
        if (Array.isArray(statsRes.data.recentLeads)) {
          setRecentLeads(statsRes.data.recentLeads);
        }
      } else {
        const bRes = await branchAdminService.getBranches();
        if (bRes?.success && Array.isArray(bRes.data) && bRes.data.length > 0) {
          setBranches(bRes.data);
        } else {
          setBranches(branchLocalDb.getBranches());
        }
      }

      const logs = branchLocalDb.getLoginLogs();
      if (logs) setLoginLogs(logs.slice(0, 4));
    } catch (e) {
      console.error('Error loading dashboard data:', e);
      setBranches(branchLocalDb.getBranches());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-12 pt-5 max-w-[1600px] mx-auto font-sans">
      
      {/* Executive Welcome Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-orange-200/80">
              <Globe className="w-3.5 h-3.5 text-orange-600" /> Multi-School Head Office • Network Command Center
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Central Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Executive Branch Manager Dashboard
          </h1>
          <p className="text-gray-500 text-[13px] sm:text-sm font-medium mt-1">
            Active supervision across <strong className="text-gray-800">{branches.length} campus branches</strong> • {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadDashboardData}
            disabled={loading}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2.5 rounded-lg text-[13px] font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            title="Refresh Live Data from Central Database"
          >
            <RotateCw className={`w-4 h-4 text-orange-500 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Syncing...' : 'Live Sync'}</span>
          </button>
          <Link 
            to="/branches" 
            className="bg-gradient-to-r from-[#fd7e14] to-[#f59e0b] hover:from-[#e86e04] hover:to-[#d97706] text-white px-5 py-2.5 rounded-lg text-[13.5px] font-bold shadow-sm flex items-center gap-2 transition-all hover:shadow-md cursor-pointer"
          >
            <Building2 className="w-4 h-4" /> All School Branches
          </Link>
          <Link 
            to="/payments" 
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-[13.5px] font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-orange-500" /> Payment Ledger
          </Link>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <ExecutiveStatCard 
          title="Managed Branches" 
          value={String(stats.branchesCount || branches.length)} 
          subText={`${stats.activeBranches || branches.filter(b => b.status === 'Active').length} Active • Live Synced`}
          icon={Building2} 
          gradient="bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]" 
          badge="100% Online"
        />
        <ExecutiveStatCard 
          title="Total Enrolled Students" 
          value={Number(stats.totalStudents || 3840).toLocaleString('en-IN')} 
          subText={`Across ${branches.length} Linked School Campuses`}
          icon={BookOpen} 
          gradient="bg-gradient-to-br from-[#10b981] to-[#047857]" 
          badge="+8.4% YoY"
        />
        <ExecutiveStatCard 
          title="Active Faculty & Staff" 
          value={Number(stats.totalStaff || 250).toLocaleString('en-IN')} 
          subText="Teaching & Administration Staff"
          icon={Contact} 
          gradient="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]" 
          badge="Full Roster"
        />
        <ExecutiveStatCard 
          title="Total Fee Collection (MTD)" 
          value={stats.totalCollected || '₹36.95 Lakhs'} 
          subText="Tuition, Labs & Route Transport"
          icon={CreditCard} 
          gradient="bg-gradient-to-br from-[#f59e0b] to-[#d97706]" 
          badge="+14.2% MoM"
        />
      </div>


      {/* Branch Network Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Active Branch Network</h2>
            <p className="text-[12.5px] text-gray-500">Live operational overview for each individual campus</p>
          </div>
          <Link to="/branches" className="text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1">
            Manage & Configure <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {branches.map(b => (
            <BranchCard key={b.id || b._id} branch={b} />
          ))}
        </div>
      </div>

      {/* Multi-Branch Comparative Table & Live Audit Logs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Comparative Matrix (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Scale className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Branch Comparative Matrix</h3>
                  <p className="text-[11.5px] text-gray-400 font-medium">Head-to-head performance across enrollments, staff & revenue</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Benchmarking
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 pr-4">School Branch</th>
                    <th className="py-2.5 text-right pr-4">Students</th>
                    <th className="py-2.5 text-right pr-4">Staff</th>
                    <th className="py-2.5 text-center pr-4">Attendance Rate</th>
                    <th className="py-2.5 text-right pr-4">MTD Inflow</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-semibold text-gray-700 divide-y divide-gray-100">
                  {branches.map(b => (
                    <tr key={b.id || b._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-bold text-gray-900">{b.name}</div>
                        <div className="text-[11px] text-gray-400 font-normal">{b.code || b.plan}</div>
                      </td>
                      <td className="py-3 text-right pr-4 font-bold text-blue-600">
                        {Number(b.students || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-right pr-4 font-bold text-purple-600">
                        {Number(b.staff || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-center pr-4">
                        <span className="font-bold text-gray-800">{b.attendance || '92%'}</span>
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full" 
                            style={{ width: b.attendance || '90%' }} 
                          />
                        </div>
                      </td>
                      <td className="py-3 text-right pr-4 font-bold font-mono text-emerald-700">
                        {b.collected || '₹0'}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          b.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
            <span>Showing all {branches.length} registered institutional branches</span>
            <Link to="/reports/schools-usage" className="text-orange-600 hover:underline font-bold flex items-center gap-1">
              Full Usage Report <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Security & Sign-in Logs (1/3 width) */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Key className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Sign-in Security Audit</h3>
                  <p className="text-[11.5px] text-gray-400 font-medium">Recent authenticated admin sessions</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {loginLogs.map((s, i) => (
                <div key={i} className="flex gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs font-bold text-xs">
                    {s.name?.slice(0, 2).toUpperCase() || 'AD'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-[12.5px] font-bold text-gray-900 truncate">
                        {s.name}
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">
                        {s.time}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-gray-500 truncate mt-0.5">
                      🏛️ {s.school}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 font-mono">
                      <span>{s.ip}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">{s.status || 'Verified'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link 
              to="/reports/login-logs" 
              className="w-full block text-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors"
            >
              View Full Login Audit Trail ({loginLogs.length}+ events)
            </Link>
          </div>
        </div>

      </div>

      {/* Live Cross-Campus Leads & Enquiries Pipeline */}
      {recentLeads && recentLeads.length > 0 && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 mb-8 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Live Campus Leads & Inquiries</h3>
                <p className="text-[11.5px] text-gray-400 font-medium">Real-time enquiries received across web portals and admissions CRM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {recentLeads.length} Central Inquiries
              </span>
              <a 
                href="http://localhost:5176/leads/all" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 hover:underline ml-2"
              >
                Open Full CRM Pipeline <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {recentLeads.map((lead, idx) => (
              <div key={lead._id || idx} className="p-3.5 rounded-lg border border-gray-200/90 hover:border-orange-400 hover:shadow-xs transition-all bg-gray-50/40 flex flex-col justify-between min-h-[110px]">
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide truncate max-w-[90px]">
                      {lead.targetClass || 'Admission'}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today'}
                    </span>
                  </div>
                  <h4 className="font-bold text-[13px] text-gray-900 line-clamp-1">{lead.studentName}</h4>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">Parent: {lead.parentName || 'Parent'}</p>
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-200/60 text-[10.5px]">
                  <span className="text-gray-500 font-mono truncate max-w-[85px]">{lead.contactNumber}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9.5px]">
                    {lead.stage || lead.status || 'Enquiry'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enterprise Management Toolkit */}
      <div className="bg-gradient-to-br from-[#f8f9fc] to-white rounded-xl shadow-xs border border-gray-200/80 p-6 sm:p-8 relative overflow-hidden">

        <div className="mb-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Executive Command Toolkit
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Everything You Can Run Across Campuses</h2>
          <p className="text-sm text-gray-500 max-w-2xl">
            Single multi-tenant access gives you instant cross-campus configuration, fee reconciliation, and template publishing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <Link to="/reports/schools-usage" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-blue-600 transition-colors">Campus Analytics</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">Enrolment & system load trends per branch</p>
            </div>
          </Link>

          <Link to="/branches" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-purple-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-purple-600 transition-colors">Manage Campuses</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">Configure plans, domains & principals</p>
            </div>
          </Link>

          <Link to="/reports/fee-collections" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-emerald-600 transition-colors">Global Collections</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">Every receipt across all branches in real-time</p>
            </div>
          </Link>

          <Link to="/reports/attendance-trends" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-amber-600 transition-colors">Attendance Trends</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">Daily presence rates across classrooms</p>
            </div>
          </Link>

          <Link to="/reports/engagement-audit" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-rose-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-rose-600 transition-colors">Engagement Audit</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">Track module adoption & teacher activity</p>
            </div>
          </Link>

          <Link to="/reports/communications" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-teal-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-teal-600 transition-colors">Communications</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">SMS, WhatsApp & email volume monitoring</p>
            </div>
          </Link>

          <Link to="/templates" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-pink-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-pink-600 transition-colors">Print Templates</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">Design certificates, admit cards & ID cards</p>
            </div>
          </Link>

          <Link to="/payments" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-orange-400 transition-all group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[13.5px] text-gray-900 group-hover:text-orange-600 transition-colors">Subscriptions</h4>
              <p className="text-[12px] text-gray-500 leading-snug mt-0.5">Invoices, renewal dates & payment approvals</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
