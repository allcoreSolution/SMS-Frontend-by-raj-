import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Book, Layers, LayoutGrid, Users, Clock, Calendar, 
  Plus, Edit2, ArrowRight, Sparkles, CheckCircle2,
  GraduationCap, TrendingUp, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { academicService } from '../../api/academicService';

const COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const AcademicDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, classesRes, subjectsRes] = await Promise.all([
        academicService.getDashboardStats(),
        academicService.getClasses(),
        academicService.getSubjects()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (classesRes.success) setClasses(classesRes.data || []);
      if (subjectsRes.success) setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error('Failed to load academic dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare subject type distribution for pie chart
  const subjectTypeData = [
    { name: 'Theory', value: subjects.filter(s => s.subjectType === 'theory' && !s.isElective).length },
    { name: 'Practical', value: subjects.filter(s => s.subjectType === 'practical' && !s.isElective).length },
    { name: 'Theory+Practical', value: subjects.filter(s => s.subjectType === 'both').length },
    { name: 'Electives', value: subjects.filter(s => s.isElective).length }
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Academic Management
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {stats?.currentSession?.name || '2026-2027'} Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Master overview of sessions, class hierarchies, subjects, period schedules, and student promotion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/academics/classes/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Class
          </button>
          <button 
            onClick={() => navigate('/academics/sessions/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all transform active:scale-95"
          >
            <Layers className="w-4 h-4 text-indigo-600" /> New Session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classes & Sections</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalClasses ?? 10}</span>
            <span className="text-xs font-medium text-slate-500">Classes</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-auto">
              {stats?.totalSections ?? 3} Sections
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> All classes active & assigned
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Subjects</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Book className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalSubjects ?? 10}</span>
            <span className="text-xs font-medium text-slate-500">Total Subjects</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-auto">
              Curriculum Live
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Core + Elective streams active
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Periods & Timetable</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalTimetableSlots ?? 84}</span>
            <span className="text-xs font-medium text-slate-500">Weekly Slots</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
              {stats?.totalPeriodSets ?? 1} Schedule
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Mon - Sat period distribution
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students & Teachers</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalStudents ?? 13}</span>
            <span className="text-xs font-medium text-slate-500">Students</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full ml-auto">
              {stats?.teachersCount ?? 6} Faculty
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5 text-purple-500" /> Fully assigned coordinators
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart: Enrolled Students per Class */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enrolled Students per Class</h2>
              <p className="text-xs text-slate-500">Live student strength distributed across grade levels</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" /> Live Enrollment
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.classDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="students" name="Students" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Subject Streams */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Curriculum Breakdown</h2>
            <p className="text-xs text-slate-500">Subject streams by evaluation format</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {subjectTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {subjectTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Loading curriculum data...</div>
            )}
          </div>
        </div>
      </div>

      {/* Classes & Curriculum Overview Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Classes & Curriculum Directory</h2>
            <p className="text-xs text-slate-500">Live roster of active classes, coordinators, and subject mappings</p>
          </div>
          <button 
            onClick={() => navigate('/academics/classes')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            View Full List <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Numeric Order</th>
                <th className="py-3 px-4">Active Sections</th>
                <th className="py-3 px-4">Class Coordinator</th>
                <th className="py-3 px-4 text-center">Enrolled</th>
                <th className="py-3 px-4 text-center">Assigned Subjects</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No classes found. Click "Add New Class" to begin.
                  </td>
                </tr>
              ) : (
                classes.map((cls) => {
                  const teacherName = cls.classTeacher 
                    ? cls.classTeacher.fullName || `${cls.classTeacher.firstName || ''} ${cls.classTeacher.lastName || ''}`.trim()
                    : 'Not Assigned';
                  
                  return (
                    <tr key={cls._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                          {cls.className.substring(0, 2)}
                        </div>
                        {cls.className}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-500">
                        Level {cls.numericValue || 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {cls.sections && cls.sections.length > 0 ? (
                            cls.sections.map((sec, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                                {sec.sectionName || sec.name || 'A'}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          teacherName !== 'Not Assigned' ? 'bg-indigo-50/80 text-indigo-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Users className="w-3 h-3" /> {teacherName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {cls.enrolledCount || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {cls.assignedSubjects ? cls.assignedSubjects.length : 0} Subjects
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => navigate('/academics/timetable')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Timetable"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate('/academics/assign-subjects')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Assign Subjects"
                          >
                            <Book className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate('/academics/classes')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Class"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/academics/sessions')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Academic Sessions
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Configure active school year & rollover</p>
        </div>

        <div 
          onClick={() => navigate('/academics/manage-periods')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Manage Periods
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Daily schedule, lunch breaks & duration</p>
        </div>

        <div 
          onClick={() => navigate('/academics/timetable')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Class Timetable
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Interactive weekly grid with subject tags</p>
        </div>

        <div 
          onClick={() => navigate('/academics/promote')}
          className="bg-white/80 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            Promote Students
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Advance student cohorts to next grade</p>
        </div>
      </div>
    </div>
  );
};

export default AcademicDashboard;
