import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Filter, FileText, Download, Printer, 
  Search, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService, { CLASSES_LIST, TEACHERS_LIST } from '../../api/lessonPlanService';

export default function LessonPlannerReports() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [classFilter, setClassFilter] = useState('All');
  const [teacherFilter, setTeacherFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await lessonPlanService.getLessonPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.subjectName && p.subjectName.toLowerCase().includes(q));
    const matchClass = classFilter === 'All' || (p.className && p.className.includes(classFilter));
    const matchTeacher = teacherFilter === 'All' || (p.teacherName && p.teacherName.includes(teacherFilter));
    return matchSearch && matchClass && matchTeacher;
  });

  // Calculate live report stats
  let totalTopics = 0;
  let coveredTopics = 0;
  let totalApproved = 0;

  plans.forEach(p => {
    if (p.status === 'Approved') totalApproved++;
    if (p.topicsList) {
      totalTopics += p.topicsList.length;
      coveredTopics += p.topicsList.filter(t => t.status === 'Covered').length;
    }
  });

  const overallCoverageRate = totalTopics > 0 ? Math.round((coveredTopics / totalTopics) * 100) : 65;

  const handleExportCSV = () => {
    if (filteredPlans.length === 0) {
      alert('No lesson plan data to export.');
      return;
    }

    const headers = ['#', 'Plan Title', 'Class', 'Subject', 'Teacher', 'Schedule Week', 'Periods', 'Topics Count', 'Coverage (%)', 'Status'];
    const rows = filteredPlans.map((p, idx) => [
      idx + 1,
      `"${p.title}"`,
      `"${p.className}"`,
      `"${p.subjectName}"`,
      `"${p.teacherName}"`,
      `"${p.weekLabel || p.startDate}"`,
      p.periods || 4,
      p.topicsList?.length || 0,
      `${p.coveragePct || 0}%`,
      `"${p.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Curriculum_Coverage_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Top Control Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Curriculum Coverage & Audit Reports</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive analytics on syllabus pacing, planned vs. covered topics, and teacher compliance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print Report
            </button>
          </div>
        </div>

        {/* Analytics KPI Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block mb-1">
                Syllabus Topic Coverage
              </span>
              <div className="text-3xl font-extrabold">{overallCoverageRate}%</div>
              <div className="text-xs text-blue-100 mt-1">
                {coveredTopics} of {totalTopics} curriculum topics completed
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Approved Teaching Plans
              </span>
              <div className="text-3xl font-extrabold text-emerald-600">{totalApproved}</div>
              <div className="text-xs text-slate-500 mt-1">
                Out of {plans.length} total submitted plans
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Instructional Units
              </span>
              <div className="text-3xl font-extrabold text-indigo-600">{plans.length}</div>
              <div className="text-xs text-slate-500 mt-1">
                Across Nursery to Senior Secondary
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plan or subject..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="w-44">
              <select 
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Classes</option>
                {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="w-48">
              <select 
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Teachers</option>
                {TEACHERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Report Breakdown Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800">Syllabus Completion Ledger</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {filteredPlans.length} Plans Analyzed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Plan Title</th>
                  <th className="px-5 py-3.5">Class / Subject</th>
                  <th className="px-5 py-3.5">Teacher</th>
                  <th className="px-5 py-3.5">Target Week</th>
                  <th className="px-5 py-3.5 text-center">Topics</th>
                  <th className="px-5 py-3.5">Coverage Progress</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => {
                    const pct = plan.coveragePct || 0;
                    return (
                      <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {plan.title}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{plan.className}</div>
                          <div className="text-[11px] text-slate-500">{plan.subjectName}</div>
                        </td>

                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {plan.teacherName}
                        </td>

                        <td className="px-5 py-3.5 text-slate-600">
                          {plan.weekLabel || plan.startDate}
                        </td>

                        <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                          {plan.topicsList?.length || 0}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="w-36 space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold">
                              <span className="text-slate-600">{pct}% Complete</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  pct === 100 ? 'bg-emerald-500' : pct > 40 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            plan.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                      No records match the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
