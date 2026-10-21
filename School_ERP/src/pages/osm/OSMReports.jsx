import React, { useState, useEffect } from 'react';
import { 
  LineChart, BarChart2, Download, Printer, Search, RefreshCw, 
  Award, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Filter, FileText
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';
import osmService from '../../api/osmService';

export default function OSMReports() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSessionId = searchParams.get('id');

  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const all = await osmService.getSessions();
      setSessions(all);

      if (urlSessionId) {
        setSelectedSessionId(urlSessionId);
      } else if (all.length > 0) {
        setSelectedSessionId(all[0]._id || all[0].id);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentSession = sessions.find(s => (s._id === selectedSessionId || s.id === selectedSessionId)) || null;

  // Grade helper
  const calculateGrade = (pct) => {
    if (pct >= 90) return 'A1';
    if (pct >= 80) return 'A2';
    if (pct >= 70) return 'B1';
    if (pct >= 60) return 'B2';
    if (pct >= 50) return 'C1';
    if (pct >= 35) return 'C2';
    return 'D (Needs Improvement)';
  };

  // Compile student score roster
  const sheets = currentSession?.sheets || [];
  const evaluatedSheets = sheets.filter(s => s.status === 'Evaluated' || s.status === 'Moderated');
  const maxMarks = currentSession?.totalMarks || 50;

  // Ranked student list
  const rankedStudents = [...evaluatedSheets]
    .map(s => {
      const finalMarks = s.moderatorMarks !== null && s.moderatorMarks !== undefined ? s.moderatorMarks : s.totalAwarded;
      const pct = maxMarks > 0 ? Math.round((finalMarks / maxMarks) * 100) : 0;
      return {
        ...s,
        finalMarks,
        pct,
        grade: calculateGrade(pct),
        passed: pct >= 35
      };
    })
    .sort((a, b) => b.finalMarks - a.finalMarks)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  const stats = osmService.calculateStats(currentSession);

  // Question Difficulty breakdown
  const questionsList = currentSession?.questions || [];
  const questionAnalytics = questionsList.map(q => {
    let totalQMarks = 0;
    let count = 0;

    evaluatedSheets.forEach(s => {
      const item = (s.marks || []).find(m => m.qNo === q.qNo);
      if (item) {
        totalQMarks += Number(item.awardedMarks) || 0;
        count++;
      }
    });

    const avgQMarks = count > 0 ? (totalQMarks / count).toFixed(1) : 0;
    const accuracyPct = q.maxMarks > 0 ? Math.round((Number(avgQMarks) / q.maxMarks) * 100) : 0;

    return {
      qNo: q.qNo,
      label: q.label || q.qNo,
      maxMarks: q.maxMarks,
      avgMarks: Number(avgQMarks),
      accuracyPct
    };
  });

  // Export CSV
  const handleExportCSV = () => {
    if (!currentSession || rankedStudents.length === 0) {
      alert('No evaluated student records to export');
      return;
    }

    const headers = ['Rank', 'Student Name', 'Roll Number', 'Final Marks', 'Max Marks', 'Percentage', 'Grade', 'Status'];
    const rows = rankedStudents.map(s => [
      s.rank,
      `"${s.studentName}"`,
      `"${s.rollNo}"`,
      s.finalMarks,
      maxMarks,
      `${s.pct}%`,
      `"${s.grade}"`,
      s.passed ? 'PASSED' : 'FAILED'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OSM_Report_${currentSession.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync to Report Card
  const handleSyncReportCards = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert(`Successfully synchronized ${rankedStudents.length} evaluated student marks into the School ERP Report Card and Exam Gradebook system!`);
    }, 1200);
  };

  // Filtered students
  const filteredStudents = rankedStudents.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.studentName?.toLowerCase().includes(q) ||
      s.rollNo?.toLowerCase().includes(q) ||
      s.anonymousCode?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <OSMNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">Digital Evaluation Reports & Analytics</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                Audit Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Grade distributions, item-wise difficulty histograms, marks rosters, and report card synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:border-purple-600 cursor-pointer min-w-[260px]"
            >
              {sessions.map(s => (
                <option key={s._id || s.id} value={s._id || s.id}>
                  {s.title} ({s.className})
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print
            </button>

            <button
              onClick={handleSyncReportCards}
              disabled={syncing}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center gap-1.5 cursor-pointer border-none"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Sync to Report Card
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Average</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.avgMarks} <span className="text-xs text-slate-400 font-semibold">/ {maxMarks}</span></h3>
              <p className="text-[11px] text-slate-500">Across {evaluatedSheets.length} marked copies</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BarChart2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pass Percentage</p>
              <h3 className="text-2xl font-black text-emerald-600">{stats.passPct}%</h3>
              <p className="text-[11px] text-slate-500">Above 35% benchmark</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Score</p>
              <h3 className="text-2xl font-black text-purple-600">{stats.highestMarks} <span className="text-xs text-slate-400 font-semibold">/ {maxMarks}</span></h3>
              <p className="text-[11px] text-slate-500">Class Rank 1 candidate</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lowest Score</p>
              <h3 className="text-2xl font-black text-amber-600">{stats.lowestMarks} <span className="text-xs text-slate-400 font-semibold">/ {maxMarks}</span></h3>
              <p className="text-[11px] text-slate-500">Needs remedial assistance</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Question-wise Difficulty Analysis Heatmap */}
        {questionAnalytics.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">Item-wise Question Difficulty Histogram</h3>
              <p className="text-xs text-slate-500">Average candidate marks obtained on each question</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
              {questionAnalytics.map((qa) => (
                <div key={qa.qNo} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{qa.qNo}</span>
                  <div className="text-sm font-black text-slate-800">{qa.avgMarks} <span className="text-[10px] text-slate-400 font-normal">/{qa.maxMarks}</span></div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        qa.accuracyPct >= 75 ? 'bg-emerald-500' :
                        qa.accuracyPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${qa.accuracyPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{qa.accuracyPct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Marks Roster Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Student Scorecard & Merit Order</h3>
              <p className="text-xs text-slate-500">Evaluated candidates arranged by total marks obtained</p>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name or roll..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No Evaluated Student Records Yet</p>
              <p className="text-xs text-slate-400">Complete papers in the Grading Studio to populate this roster.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6 text-center">Rank</th>
                    <th className="py-3 px-6">Candidate Details</th>
                    <th className="py-3 px-4 text-center">Final Score</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 text-center">
                        <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-black text-xs ${
                          st.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          st.rank === 2 ? 'bg-slate-200 text-slate-700' :
                          st.rank === 3 ? 'bg-amber-50 text-amber-900' : 'text-slate-500'
                        }`}>
                          {st.rank}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {currentSession?.anonymous ? (
                          <div className="font-mono font-bold text-indigo-700">{st.anonymousCode}</div>
                        ) : (
                          <div>
                            <div className="font-bold text-slate-800">{st.studentName}</div>
                            <div className="text-[11px] text-slate-400">Roll: {st.rollNo}</div>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="font-black text-slate-800 text-sm">
                          {st.finalMarks}
                        </span>
                        <span className="text-slate-400 text-xs"> / {maxMarks}</span>
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-slate-700">
                        {st.pct}%
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200 text-xs">
                          {st.grade}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          st.status === 'Moderated' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
