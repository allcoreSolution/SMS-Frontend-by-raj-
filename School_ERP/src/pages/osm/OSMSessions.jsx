import React, { useState, useEffect } from 'react';
import { 
  Eye, Edit2, Trash2, Layers, PenTool, Scale, LineChart, Filter, 
  Plus, Search, ArrowRight, CheckCircle2, Clock, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';
import osmService, { CLASSES_LIST } from '../../api/osmService';

export default function OSMSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await osmService.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this evaluation session? This will remove all associated answer sheets and markings.')) {
      await osmService.deleteSession(id);
      loadSessions();
    }
  };

  const filtered = sessions.filter(s => {
    const matchesSearch = 
      !search || 
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      s.className?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesClass = classFilter === 'All' || s.className?.toLowerCase() === classFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesClass;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">All Evaluation Sessions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage question papers, upload student answer sheets, and track digital grading progress.
            </p>
          </div>
          <button
            onClick={() => navigate('/osm-module/sessions/new')}
            className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center gap-2 transition-all cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" /> Create New Session
          </button>
        </div>

        {/* Filter Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            {/* Search */}
            <div className="relative min-w-[240px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search session title or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-[160px]">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Evaluating">Evaluating</option>
                <option value="Moderation">Moderation</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Class Filter */}
            <div className="min-w-[160px]">
              <select 
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">All Classes</option>
                {CLASSES_LIST.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-400">
            Showing {filtered.length} of {sessions.length} sessions
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading sessions...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No matching evaluation sessions found</p>
              <p className="text-xs text-slate-400">Adjust your search parameters or create a new session.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Session Title</th>
                    <th className="py-3.5 px-4">Class & Subject</th>
                    <th className="py-3.5 px-4 text-center">Sheets</th>
                    <th className="py-3.5 px-6">Evaluation Progress</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => {
                    const stats = osmService.calculateStats(s);
                    const sessionId = s._id || s.id;

                    return (
                      <tr 
                        key={sessionId}
                        onClick={() => navigate(`/osm-module/sessions/details?id=${sessionId}`)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors text-xs sm:text-sm">
                            {s.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Max {s.totalMarks} Marks</span>
                            <span>•</span>
                            <span>{s.examType || 'Term Exam'}</span>
                            {s.anonymous && (
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-sm border border-indigo-100">
                                Anonymous
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-700">{s.className} / {s.section}</span>
                          <div className="text-[11px] text-slate-500">{s.subjectName}</div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-slate-800">{stats.evaluatedSheets}</span>
                          <span className="text-slate-400">/{stats.totalSheets}</span>
                        </td>

                        <td className="py-4 px-6 min-w-[160px]">
                          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-600">
                            <span>{stats.progressPct}%</span>
                            <span className="text-slate-400">{stats.pendingSheets} pending</span>
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
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(s.status)}`}>
                            {s.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate(`/osm-module/evaluate?id=${sessionId}`)}
                              className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Start Grading Sheets"
                            >
                              <PenTool className="w-3.5 h-3.5" /> Grade
                            </button>
                            <button
                              onClick={() => navigate(`/osm-module/sessions/details?id=${sessionId}`)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Manage Question Paper & Sheets"
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
