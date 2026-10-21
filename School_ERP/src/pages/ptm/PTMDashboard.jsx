import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, ClipboardList, Plus, 
  Handshake, MessageSquare, ArrowRight, CheckCircle2, Clock, 
  Video, MapPin, AlertCircle, Sparkles, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PTMNavHeader from './PTMNavHeader';
import ptmService from '../../api/ptmService';

export default function PTMDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    upcomingCount: 0,
    completedCount: 0,
    attendanceRate: 0,
    totalInvited: 0,
    totalPresent: 0,
    openFollowUpsCount: 0,
    remarkRate: 0,
    totalWithRemarks: 0,
    upcomingMeetings: [],
    recentMeetings: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await ptmService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load PTM dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'notified':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">Notified</span>;
      case 'draft':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">Draft</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">Scheduled</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-12">
      <PTMNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Welcome & Quick Action Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1 rounded-md bg-white/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  PTM Coordination Desk
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Parent-Teacher Engagement Overview</h2>
              <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
                Active session overview. Track attendance records, write guardian feedback remarks, coordinate appointment slots, and resolve parent action plans.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/ptm/schedule')}
                className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" /> Schedule New PTM
              </button>
              <button
                onClick={() => navigate('/ptm/attendance')}
                className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" /> Record Attendance
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Meetings */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Total Meetings
                </span>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {loading ? '...' : stats.totalMeetings}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{stats.completedCount} completed sessions</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <Handshake className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Upcoming Meetings
                </span>
                <div className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                  {loading ? '...' : stats.upcomingCount}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Next scheduled active</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Parent Attendance Rate */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Guardian Attendance
                </span>
                <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {loading ? '...' : `${stats.attendanceRate}%`}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{stats.totalPresent} of {stats.totalInvited} attended</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Open Follow-ups */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Open Follow-ups
                </span>
                <div className="text-3xl font-extrabold text-amber-600 tracking-tight">
                  {loading ? '...' : stats.openFollowUpsCount}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Action plans pending</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </div>

        </div>

        {/* Remark Progress Meter Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-800">
                Teacher Remark & Feedback Completion (Current Session)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600">{stats.remarkRate}%</span>
              <span className="text-xs text-slate-400">({stats.totalWithRemarks} recorded)</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.max(stats.remarkRate, 2)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
            <span>Progress calculated across enrolled student roster</span>
            <button 
              onClick={() => navigate('/ptm/attendance')}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
            >
              Write student remarks <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Two-Column Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Upcoming Meetings Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800">Upcoming Meetings Schedule</h2>
              </div>
              <button 
                onClick={() => navigate('/ptm/attendance')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 flex-1">
              {stats.upcomingMeetings.length > 0 ? (
                stats.upcomingMeetings.slice(0, 4).map((meeting) => (
                  <div 
                    key={meeting.id}
                    onClick={() => navigate(`/ptm/details/${meeting.id}`)}
                    className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {meeting.title}
                        </h3>
                        {getStatusBadge(meeting.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {meeting.meetingDate}
                        </span>
                        <span className="flex items-center gap-1">
                          {meeting.mode === 'Online' ? <Video className="w-3.5 h-3.5 text-purple-500" /> : <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                          {meeting.mode} {meeting.venue ? `· ${meeting.venue}` : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-700">
                          {meeting.roster?.length || meeting.invitedCount || 0} Guardians
                        </div>
                        <div className="text-[11px] text-slate-400">Invited Roster</div>
                      </div>
                      <span className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">No upcoming meetings scheduled</p>
                  <button 
                    onClick={() => navigate('/ptm/schedule')}
                    className="mt-3 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Schedule Meeting Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Meetings Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-800">Recent & Historical Sessions</h2>
              </div>
              <button 
                onClick={() => navigate('/ptm/reports')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 flex-1">
              {stats.recentMeetings.length > 0 ? (
                stats.recentMeetings.slice(0, 5).map((meeting) => (
                  <div 
                    key={meeting.id}
                    onClick={() => navigate(`/ptm/details/${meeting.id}`)}
                    className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {meeting.title}
                        </h3>
                        {getStatusBadge(meeting.status)}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {meeting.meetingDate} · {meeting.scope || 'Whole school'} · {meeting.roster?.length || meeting.invitedCount || 0} invited
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ptm/details/${meeting.id}`);
                      }}
                      className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 px-2.5 py-1 rounded-md group-hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      Details
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-xs">No recent meetings on record.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
