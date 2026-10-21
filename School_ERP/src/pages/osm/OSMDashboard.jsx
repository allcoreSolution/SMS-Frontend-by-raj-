import React, { useState, useEffect } from 'react';
import { 
  Layers, Clock, CheckCircle2, Award, ChevronRight, Search, 
  Filter, PenTool, Scale, LineChart, FileText, Plus, Eye, Trash2, ArrowUpRight, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';
import osmService from '../../api/osmService';

export default function OSMDashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await osmService.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching OSM sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this evaluation session?')) {
      await osmService.deleteSession(id);
      loadSessions();
    }
  };

  // Metrics calculation
  const totalSessions = sessions.length;
  let totalSheets = 0;
  let totalEvaluated = 0;
  let totalModerated = 0;

  sessions.forEach(s => {
    const stats = osmService.calculateStats(s);
    totalSheets += stats.totalSheets;
    totalEvaluated += stats.evaluatedSheets;
    totalModerated += stats.moderatedSheets;
  });

  const totalPending = totalSheets - totalEvaluated;
  const overallCompletionRate = totalSheets > 0 ? Math.round((totalEvaluated / totalSheets) * 100) : 0;

  // Filtered list
  const filteredSessions = sessions.filter(s => {
    const matchesSearch = 
      !search || 
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      s.className?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'evaluating':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'moderation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'draft':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <OSMNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sessions</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{totalSessions}</h3>
              <p className="text-[11px] text-slate-500">{sessions.filter(s => s.status !== 'Draft').length} active exam batches</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Papers Pending</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600">{totalPending}</h3>
              <p className="text-[11px] text-slate-500">out of {totalSheets} submitted sheets</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluated Sheets</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{totalEvaluated}</h3>
              <p className="text-[11px] text-slate-500">{totalModerated} reviewed in moderation</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Velocity</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{overallCompletionRate}%</h3>
              <p className="text-[11px] text-slate-500">marking rate across batches</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Quick Workflow Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => navigate('/osm-module/evaluate')}
            className="group bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-4">
                <PenTool className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold mb-1">Open Grading Studio</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Grade scanned student answer sheets question-by-question with digital annotation stamps.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-purple-200 group-hover:text-white transition-colors">
              <span>Start Marking</span> <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/osm-module/moderation')}
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">Moderation Queue</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Audit flagged borderline sheets, compare original marks, and approve moderation adjustments.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
              <span>Review Flagged Papers</span> <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/osm-module/reports')}
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <LineChart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">Reports & Gradebook</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate marks rosters, analyze question difficulty histograms, export CSV, and sync to report cards.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
              <span>View Analytics</span> <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Sessions List Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Header & Filters */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Evaluation Sessions</h3>
              <p className="text-xs text-slate-500">Overview of all active and completed on-screen marking batches</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search session or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>

              {/* Status Filters */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                {['All', 'Evaluating', 'Moderation', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-white text-purple-700 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading evaluation sessions...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No evaluation sessions found</p>
              <p className="text-xs text-slate-400">Try adjusting your filters or create a new session.</p>
              <button
                onClick={() => navigate('/osm-module/sessions/new')}
                className="mt-2 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-purple-700 transition-colors cursor-pointer"
              >
                + Create New Session
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Session Title & Exam</th>
                    <th className="py-3 px-4">Class & Subject</th>
                    <th className="py-3 px-4 text-center">Sheets</th>
                    <th className="py-3 px-6">Progress</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSessions.map((session) => {
                    const stats = osmService.calculateStats(session);
                    const sessionId = session._id || session.id;

                    return (
                      <tr 
                        key={sessionId}
                        onClick={() => navigate(`/osm-module/sessions/details?id=${sessionId}`)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                            {session.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{session.examType || 'Regular Exam'}</span>
                            <span>•</span>
                            <span>Max {session.totalMarks} Marks</span>
                            {session.anonymous && (
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-sm border border-indigo-100">
                                Anonymous
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-700">{session.className} - {session.section}</span>
                          <div className="text-[11px] text-slate-500">{session.subjectName}</div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-slate-800">{stats.evaluatedSheets}</span>
                          <span className="text-slate-400">/{stats.totalSheets}</span>
                        </td>

                        <td className="py-4 px-6 min-w-[160px]">
                          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-600">
                            <span>{stats.progressPct}% done</span>
                            <span className="text-slate-400">{stats.pendingSheets} left</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                stats.progressPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                              }`}
                              style={{ width: `${stats.progressPct}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(session.status)}`}>
                            {session.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate(`/osm-module/evaluate?id=${sessionId}`)}
                              className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Grade Sheets"
                            >
                              <PenTool className="w-3.5 h-3.5" /> Grade
                            </button>
                            <button
                              onClick={() => navigate(`/osm-module/sessions/details?id=${sessionId}`)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Session Details & Question Paper"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(sessionId, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Session"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
