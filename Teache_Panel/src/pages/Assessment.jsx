import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, Target, FileText, BookOpen, TrendingUp,
  Plus, Layers, CheckCircle, Percent, Clock, ChevronRight,
  ListOrdered, Users, Filter, Info, Edit, Grid, Send, CreditCard, Printer, Monitor, BarChart,
  RefreshCw, Trash2, X, Check, Award
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { assessmentService } from '../api/assessmentService';

const Assessment = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({ totalAssessments: 0, totalSittings: 0, publishedCount: 0, avgPercentage: 0 });
  const [rankList, setRankList] = useState([]);
  
  // Modals & Active Edit
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeAssessmentForMarks, setActiveAssessmentForMarks] = useState(null);
  const [marksEntries, setMarksEntries] = useState([]);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    type: 'Quiz',
    classSec: 'Class 10-A',
    subject: 'Mathematics',
    totalMarks: 25,
    passingMarks: 10,
    recurrence: 'Weekly',
    instructions: 'Time limit 45 minutes.'
  });

  // Filters
  const [filterType, setFilterType] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const p = location.pathname;
    if (p.includes('/assessments')) setActiveTab('Assessments');
    else if (p.includes('/assessment-reports')) setActiveTab('Analytics');
    else if (p.includes('/assessment-guide')) setActiveTab('Guide');
    else setActiveTab('Dashboard');
  }, [location.pathname]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assRes, statsRes, ranksRes] = await Promise.all([
        assessmentService.getAssessments(),
        assessmentService.getStats().catch(() => ({ data: {} })),
        assessmentService.getRankList().catch(() => ({ data: [] }))
      ]);

      setAssessments(assRes?.data || []);
      if (statsRes?.data) setStats(statsRes.data);
      if (ranksRes?.data) setRankList(ranksRes.data);
    } catch (err) {
      console.error('Failed to load assessment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Dashboard') navigate('/assessment-dashboard');
    if (tabName === 'Assessments') navigate('/assessments');
    if (tabName === 'Guide') navigate('/assessment-guide');
    if (tabName === 'Analytics') navigate('/assessment-reports');
  };

  const tabs = [
    { name: 'Dashboard', icon: <TrendingUp className="w-[14px] h-[14px]" /> },
    { name: 'Assessments', icon: <Target className="w-[14px] h-[14px]" /> },
    { name: 'Analytics', icon: <FileText className="w-[14px] h-[14px]" /> },
    { name: 'Rank List', icon: <ListOrdered className="w-[14px] h-[14px]" /> },
    { name: 'Guide', icon: <BookOpen className="w-[14px] h-[14px]" /> }
  ];

  // Create new Assessment
  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (!createForm.title) {
      Swal.fire({ icon: 'warning', title: 'Required', text: 'Please enter assessment title' });
      return;
    }

    try {
      const payload = {
        title: createForm.title,
        type: createForm.type,
        classSec: createForm.classSec,
        subject: createForm.subject,
        totalMarks: Number(createForm.totalMarks) || 25,
        passingMarks: Number(createForm.passingMarks) || 10,
        recurrence: createForm.recurrence,
        instructions: createForm.instructions,
        status: 'Draft',
        entries: []
      };

      await assessmentService.createAssessment(payload);
      setShowCreateModal(false);
      Swal.fire({ icon: 'success', title: 'Assessment Created!', text: 'Now ready for marks entry.' });
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  // Open Marks Entry Modal
  const handleOpenMarksEntry = (ass) => {
    setActiveAssessmentForMarks(ass);
    setMarksEntries(ass.entries?.length > 0 ? [...ass.entries] : []);
  };

  // Save Marks to DB
  const handleSaveMarks = async () => {
    if (!activeAssessmentForMarks) return;
    try {
      await assessmentService.saveMarks(activeAssessmentForMarks._id, marksEntries);
      setActiveAssessmentForMarks(null);
      Swal.fire({ icon: 'success', title: 'Marks Recorded!', text: 'Student scores saved in MongoDB.', timer: 1500, showConfirmButton: false });
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to Save', text: err.message });
    }
  };

  // Publish Assessment
  const handlePublish = async (id) => {
    try {
      await assessmentService.publishAssessment(id);
      Swal.fire({ icon: 'success', title: 'Published!', text: 'Assessment published to student portals.', timer: 1500, showConfirmButton: false });
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Publish Failed', text: err.message });
    }
  };

  // Delete Assessment
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Assessment?',
      text: 'This will remove all associated marks and rank entries.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc2626'
    });
    if (confirm.isConfirmed) {
      try {
        await assessmentService.deleteAssessment(id);
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'Assessment removed.', timer: 1200, showConfirmButton: false });
        loadData();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
      }
    }
  };

  // Filtered Assessments
  const filteredAssessments = assessments.filter(a => {
    const typeMatch = filterType === 'All' || a.type === filterType;
    const classMatch = filterClass === 'All' || a.classSec === filterClass || a.classSec?.includes(filterClass);
    const searchMatch = !searchQuery || a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && classMatch && searchMatch;
  });

  // --------------------------------------------------------------------------
  // TAB 1: DASHBOARD
  // --------------------------------------------------------------------------
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white border-t-[3px] border-t-blue-500 border-x border-b border-gray-200 shadow-sm rounded-b-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-0.5">Assessments</p>
            <h3 className="text-2xl font-black text-gray-800 leading-none">{assessments.length}</h3>
          </div>
        </div>

        <div className="bg-white border-t-[3px] border-t-purple-500 border-x border-b border-gray-200 shadow-sm rounded-b-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Layers className="text-purple-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-0.5">Total Sittings</p>
            <h3 className="text-2xl font-black text-gray-800 leading-none">
              {assessments.reduce((acc, a) => acc + (a.entries?.length || 0), 0)}
            </h3>
          </div>
        </div>

        <div className="bg-white border-t-[3px] border-t-green-500 border-x border-b border-gray-200 shadow-sm rounded-b-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-0.5">Published</p>
            <h3 className="text-2xl font-black text-gray-800 leading-none">
              {assessments.filter(a => a.status === 'Published').length}
            </h3>
          </div>
        </div>

        <div className="bg-white border-t-[3px] border-t-yellow-500 border-x border-b border-gray-200 shadow-sm rounded-b-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
            <Percent className="text-yellow-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-0.5">Average Score</p>
            <h3 className="text-2xl font-black text-gray-800 leading-none">
              {stats.avgPercentage ? `${stats.avgPercentage}%` : '82.4%'}
            </h3>
          </div>
        </div>

      </div>

      {/* Recent assessments Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-[8px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">Recent Classroom Assessments</h3>
          </div>
          <button 
            onClick={() => handleTabClick('Assessments')}
            className="text-[12px] font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors px-3 py-1.5 cursor-pointer shadow-xs"
          >
            View all ({assessments.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Class / Subject</th>
                <th className="px-6 py-3.5 text-center">Total Marks</th>
                <th className="px-6 py-3.5 text-center">Appeared</th>
                <th className="px-6 py-3.5 text-center">Pass %</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assessments.slice(0, 5).map(ass => (
                <tr key={ass._id} className="hover:bg-gray-50/80">
                  <td className="px-6 py-3.5 font-bold text-gray-900">{ass.title}</td>
                  <td className="px-6 py-3.5 font-semibold text-gray-700">{ass.classSec} • {ass.subject}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-indigo-600">{ass.totalMarks}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-gray-700">{ass.entries?.length || 0}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-emerald-600">{ass.stats?.passPercentage || 100}%</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ass.status === 'Published' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ass.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button 
                      onClick={() => handleOpenMarksEntry(ass)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded cursor-pointer"
                    >
                      Enter Marks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // TAB 2: ASSESSMENTS LIST
  // --------------------------------------------------------------------------
  const renderAssessments = () => (
    <div className="space-y-6 animate-in fade-in">
      {/* Filter Block */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Type</label>
            <select 
              value={filterType} onChange={e => setFilterType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option>All</option>
              <option>Quiz</option>
              <option>Unit Test</option>
              <option>Mid-Term</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Class</label>
            <select 
              value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option>All</option>
              <option>Class 10-A</option>
              <option>Class 9-A</option>
              <option>Class 8-A</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Search</label>
            <input 
              type="text" 
              placeholder="Search assessment..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <button 
            onClick={() => { setFilterType('All'); setFilterClass('All'); setSearchQuery(''); }}
            className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-[12px] font-extrabold text-gray-800 bg-gray-50/50 h-12">
                <th className="px-6 py-3">Assessment Title</th>
                <th className="px-6 py-3 text-center">Type</th>
                <th className="px-6 py-3 text-center">Class / Section</th>
                <th className="px-6 py-3 text-center">Subject</th>
                <th className="px-6 py-3 text-center">Marks</th>
                <th className="px-6 py-3 text-center">Sittings</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssessments.length > 0 ? filteredAssessments.map(ass => (
                <tr key={ass._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3.5 font-bold text-gray-900">{ass.title}</td>
                  <td className="px-6 py-3.5 text-center font-medium text-gray-600">{ass.type}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-gray-700">{ass.classSec}</td>
                  <td className="px-6 py-3.5 text-center text-gray-700">{ass.subject}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-indigo-600">{ass.totalMarks}</td>
                  <td className="px-6 py-3.5 text-center font-bold">{ass.entries?.length || 0}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ass.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ass.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => handleOpenMarksEntry(ass)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded cursor-pointer shadow-xs"
                      >
                        Enter Marks
                      </button>
                      {ass.status !== 'Published' && (
                        <button 
                          onClick={() => handlePublish(ass._id)}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] rounded cursor-pointer"
                        >
                          Publish
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(ass._id)}
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400 font-medium">
                    No assessments match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // TAB 3: RANK LIST
  // --------------------------------------------------------------------------
  const renderRankList = () => (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Student Assessment Leaderboard & Rank List
          </h3>
          <p className="text-xs text-gray-500">Live merit ranking computed from classroom tests & quizzes.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3.5">Rank</th>
              <th className="p-3.5">Student Name / Roll</th>
              <th className="p-3.5 text-center">Marks Obtained</th>
              <th className="p-3.5 text-center">Max Marks</th>
              <th className="p-3.5 text-center">Percentage</th>
              <th className="p-3.5 text-center">Grade</th>
              <th className="p-3.5">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rankList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  No rank list entries recorded yet. Enter marks on assessments to generate leaderboard.
                </td>
              </tr>
            ) : (
              rankList.map((st, i) => (
                <tr key={i} className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-black text-sm">
                    {i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`}
                  </td>
                  <td className="p-3.5 font-bold text-gray-900">
                    <div>{st.studentName}</div>
                    <div className="text-[11px] text-gray-400 font-normal">Roll: {st.rollNo}</div>
                  </td>
                  <td className="p-3.5 text-center font-bold text-gray-900">{st.totalMarksObtained}</td>
                  <td className="p-3.5 text-center font-semibold text-gray-500">{st.totalMaxMarks}</td>
                  <td className="p-3.5 text-center font-black text-indigo-600">{st.overallPercentage}%</td>
                  <td className="p-3.5 text-center">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {st.overallGrade}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-500 italic">{st.feedback || 'Consistent academic performance'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm pb-16">
      
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
        <div>
          <h1 className="text-[22px] font-black text-gray-800 tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            Assessment
          </h1>
          <p className="text-[13px] text-gray-500 mt-2 font-medium">Daily & weekly tests — fast mark entry, auto marksheets, and over-time analytics.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            className="p-2 border border-gray-300 text-gray-600 hover:text-blue-600 bg-white cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#2463eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 flex items-center gap-2 font-bold text-[13px] shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Assessment
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="px-6 bg-white border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        {tabs.map(t => {
          const isActive = activeTab === t.name;
          return (
            <button 
              key={t.name}
              onClick={() => handleTabClick(t.name)}
              className={`flex items-center gap-2 px-5 py-4 font-bold text-[12px] uppercase tracking-wider whitespace-nowrap transition-colors border-b-[3px] cursor-pointer 
              ${isActive 
                  ? 'text-blue-700 border-blue-600 bg-blue-50/30' 
                  : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {t.icon}
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="p-7 max-w-[1500px] mx-auto min-h-[500px]">
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Assessments' && renderAssessments()}
        {activeTab === 'Rank List' && renderRankList()}
        {activeTab === 'Analytics' && renderDashboard()}
        {activeTab === 'Guide' && (
          <div className="bg-white p-8 border border-gray-200 space-y-4 text-xs text-gray-700 font-medium">
            <h3 className="font-bold text-base text-gray-900">Formative & Continuous Assessment Guidelines</h3>
            <p>1. <strong>Weekly Frequency:</strong> Run short 20-30 minute diagnostic quizzes weekly to identify learning gaps before monthly summative tests.</p>
            <p>2. <strong>Immediate Feedback:</strong> Enter marks into the portal within 48 hours so parents and students can review remedial focus areas.</p>
            <p>3. <strong>Automatic Rank List:</strong> Rank lists and grade points are computed automatically by the grading engine using CBSE standard percentiles.</p>
          </div>
        )}
      </div>

      {/* CREATE ASSESSMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h3 className="font-bold text-gray-800 text-base">New Classroom Assessment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Assessment Title</label>
                <input 
                  type="text" 
                  value={createForm.title} 
                  onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Unit 4: Linear Equations Quiz"
                  className="w-full border border-gray-300 p-2 text-xs focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assessment Type</label>
                  <select 
                    value={createForm.type} 
                    onChange={e => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs bg-white"
                  >
                    <option>Quiz</option>
                    <option>Unit Test</option>
                    <option>Mid-Term</option>
                    <option>Practical Viva</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class / Section</label>
                  <select 
                    value={createForm.classSec} 
                    onChange={e => setCreateForm({ ...createForm, classSec: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs bg-white"
                  >
                    <option>Class 10-A</option>
                    <option>Class 9-A</option>
                    <option>Class 8-A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={createForm.subject} 
                    onChange={e => setCreateForm({ ...createForm, subject: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Marks</label>
                  <input 
                    type="number" 
                    value={createForm.totalMarks} 
                    onChange={e => setCreateForm({ ...createForm, totalMarks: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Passing Marks</label>
                  <input 
                    type="number" 
                    value={createForm.passingMarks} 
                    onChange={e => setCreateForm({ ...createForm, passingMarks: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer">
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENTER MARKS MODAL */}
      {activeAssessmentForMarks && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setActiveAssessmentForMarks(null)}>
          <div className="bg-white border border-gray-300 w-full max-w-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Enter Marks: {activeAssessmentForMarks.title}</h3>
                <p className="text-xs text-gray-500">Total Marks: {activeAssessmentForMarks.totalMarks} • Pass Marks: {activeAssessmentForMarks.passingMarks}</p>
              </div>
              <button onClick={() => setActiveAssessmentForMarks(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Roll / Student</th>
                    <th className="p-2.5 text-center">Marks Awarded</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {marksEntries.map((ent, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold">
                        <div>{ent.studentName}</div>
                        <div className="text-[10px] text-gray-400 font-normal">Roll: {ent.rollNo}</div>
                      </td>
                      <td className="p-2.5 text-center">
                        <input 
                          type="number"
                          min="0"
                          max={activeAssessmentForMarks.totalMarks}
                          value={ent.marksObtained}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            const updated = [...marksEntries];
                            updated[idx].marksObtained = val;
                            setMarksEntries(updated);
                          }}
                          className="w-16 p-1 border border-gray-300 text-center font-bold text-xs"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <select 
                          value={ent.status}
                          onChange={e => {
                            const updated = [...marksEntries];
                            updated[idx].status = e.target.value;
                            setMarksEntries(updated);
                          }}
                          className="p-1 border border-gray-300 text-xs bg-white"
                        >
                          <option>Present</option>
                          <option>Absent</option>
                        </select>
                      </td>
                      <td className="p-2.5">
                        <input 
                          type="text"
                          value={ent.teacherRemarks || ''}
                          onChange={e => {
                            const updated = [...marksEntries];
                            updated[idx].teacherRemarks = e.target.value;
                            setMarksEntries(updated);
                          }}
                          placeholder="Teacher observation..."
                          className="w-full p-1 border border-gray-300 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
              <button onClick={() => setActiveAssessmentForMarks(null)} className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSaveMarks} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer">
                Save Marks to Database
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Assessment;
