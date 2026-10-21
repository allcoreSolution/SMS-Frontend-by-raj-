import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, Plus, GitMerge, List, Grid, Search, 
  FileText, Download, Printer, Check, Trash2, 
  Calendar, CheckCircle2, Archive, ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AcademicSessions = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await academicService.getSessions();
      if (res.success) {
        setSessions(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load academic sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSetCurrent = async (id, sessionName) => {
    const result = await Swal.fire({
      title: 'Set as Current Session?',
      text: `Do you want to activate "${sessionName}" as the primary academic session? All fee, attendance, and exam entries will default to this year.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Set Current',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await academicService.setCurrentSession(id);
        if (res.success) {
          Swal.fire({
            title: 'Activated!',
            text: `Session "${sessionName}" is now active.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchSessions();
        }
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to update session',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  const handleDelete = async (id, sessionName) => {
    const result = await Swal.fire({
      title: 'Delete Session?',
      text: `Are you sure you want to delete "${sessionName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await academicService.deleteSession(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Academic session deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchSessions();
        }
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete session',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  const handleCopy = () => {
    const text = filteredSessions.map(s => 
      `${s.name}\t${new Date(s.startDate).toLocaleDateString()} - ${new Date(s.endDate).toLocaleDateString()}\t${s.studentsCount || 0}\t${s.status}`
    ).join('\n');
    navigator.clipboard.writeText(`NAME\tPERIOD\tSTUDENTS\tSTATUS\n${text}`);
    Swal.fire({
      title: 'Copied!',
      text: 'Session records copied to clipboard.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-2xl' }
    });
  };

  const handleExportCSV = () => {
    const header = "NAME,START DATE,END DATE,STUDENTS,STATUS\n";
    const csvContent = filteredSessions.map(s => 
      `"${s.name}","${new Date(s.startDate).toLocaleDateString()}","${new Date(s.endDate).toLocaleDateString()}","${s.studentsCount || 0}","${s.status}"`
    ).join('\n');
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'academic_sessions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Sessions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage school academic calendar years, activate current sessions, and run year-end rollovers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/academics/rollover')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all transform active:scale-95"
          >
            <GitMerge className="w-4 h-4 text-indigo-600" /> Year-End Rollover
          </button>
          <button 
            onClick={() => navigate('/academics/sessions/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Action Bar & Search */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search academic session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button 
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Copy
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" /> Print
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: List or Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading academic sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No academic sessions found matching your search.
        </div>
      ) : viewMode === 'list' ? (
        /* Table View */
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Session Title</th>
                  <th className="py-3.5 px-4">Period Range</th>
                  <th className="py-3.5 px-4">Enrolled Students</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSessions.map((session) => {
                  const isCurrent = session.isCurrent || session.status === 'Current';
                  return (
                    <tr key={session._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                            isCurrent ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm">{session.name}</span>
                            {isCurrent && (
                              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-600">
                        {new Date(session.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-1.5 text-slate-400">→</span>
                        {new Date(session.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        {session.studentsCount || 0} Students
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isCurrent 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : session.status === 'Upcoming'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {session.status || (isCurrent ? 'Current' : 'Active')}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                        {session.description || '—'}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          {!isCurrent && (
                            <button
                              onClick={() => handleSetCurrent(session._id, session.name)}
                              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs flex items-center gap-1 transition-colors"
                              title="Set as Current Session"
                            >
                              <Check className="w-3.5 h-3.5" /> Set Current
                            </button>
                          )}
                          {!isCurrent && (
                            <button
                              onClick={() => handleDelete(session._id, session.name)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Session"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSessions.map((session) => {
            const isCurrent = session.isCurrent || session.status === 'Current';
            return (
              <div 
                key={session._id} 
                className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 border shadow-xs transition-all relative overflow-hidden ${
                  isCurrent ? 'border-emerald-200 ring-2 ring-emerald-500/10' : 'border-slate-200/80 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{session.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(session.startDate).toLocaleDateString()} – {new Date(session.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isCurrent 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {session.status || (isCurrent ? 'Current' : 'Active')}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-5 min-h-[36px] line-clamp-2">
                  {session.description || 'Standard school curriculum cycle and exam term.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700">
                    {session.studentsCount || 0} Students
                  </div>
                  <div className="flex items-center gap-2">
                    {!isCurrent && (
                      <button
                        onClick={() => handleSetCurrent(session._id, session.name)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Make Current
                      </button>
                    )}
                    {!isCurrent && (
                      <button
                        onClick={() => handleDelete(session._id, session.name)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AcademicSessions;
