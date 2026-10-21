import React, { useState, useEffect } from 'react';
import { 
  Plus, LayoutDashboard, List, UserCheck, CheckSquare, BarChart, BookOpen,
  ClipboardList, Edit3, Hourglass, CheckCircle2, RotateCcw, Calendar, Leaf, 
  Filter, Eye, Copy, Trash2, LineChart, FileText, RefreshCw, X, Check, AlertCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { lessonPlanService } from '../api/lessonPlanService';

const LessonPlanner = () => {
  const [activeTab, setActiveTab] = useState('Lesson Plans');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlanForCoverage, setSelectedPlanForCoverage] = useState(null);
  const [viewingPlan, setViewingPlan] = useState(null);

  // Form State for creating a new lesson plan
  const [newPlan, setNewPlan] = useState({
    title: '',
    className: 'Class 10',
    sectionName: 'Section A',
    subjectName: 'Mathematics',
    topic: '',
    subTopics: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
    periods: 5,
    chapters: '',
    objectives: '',
    teachingMethods: 'Lecture, Smart Board, Problem Solving',
    homework: '',
    status: 'Approved'
  });
  
  // Filters for Lesson Plans Tab
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [classFilter, setClassFilter] = useState('All classes');
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const p = location.pathname;
    if (p.includes('/lesson-plans')) setActiveTab('Lesson Plans');
    else if (p.includes('/lesson-planner-guide')) setActiveTab('Guide');
    else if (p.includes('/lesson-plan-review')) setActiveTab('Review (HOD)');
    else if (p.includes('/lesson-plan-coverage')) setActiveTab('Coverage');
    else if (p.includes('/lesson-plan-reports')) setActiveTab('Reports');
    else setActiveTab('Dashboard');
  }, [location.pathname]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await lessonPlanService.getPlans();
      setPlans(res?.data || []);
    } catch (err) {
      console.error('Failed to load lesson plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (t) => {
    let p = '/lesson-planner';
    if (t.name === 'Lesson Plans') p = '/lesson-plans';
    if (t.name === 'Guide') p = '/lesson-planner-guide';
    if (t.name === 'Review (HOD)') p = '/lesson-plan-review';
    if (t.name === 'Coverage') p = '/lesson-plan-coverage';
    if (t.name === 'Reports') p = '/lesson-plan-reports';
    navigate(p);
  };

  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-orange-500" /> },
    { name: 'Lesson Plans', icon: <List className="w-4 h-4 text-blue-500" /> },
    { name: 'Review (HOD)', icon: <UserCheck className="w-4 h-4 text-pink-500" /> },
    { name: 'Coverage', icon: <CheckSquare className="w-4 h-4 text-green-500" /> },
    { name: 'Reports', icon: <BarChart className="w-4 h-4 text-purple-500" /> },
    { name: 'Guide', icon: <BookOpen className="w-4 h-4 text-cyan-500" /> },
  ];

  // Create new lesson plan
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPlan.title) {
      Swal.fire({ icon: 'warning', title: 'Title required', text: 'Please provide a title for the lesson plan.' });
      return;
    }
    
    try {
      const payload = {
        title: newPlan.title,
        className: newPlan.className,
        sectionName: newPlan.sectionName,
        subjectName: newPlan.subjectName,
        topic: newPlan.topic || newPlan.title,
        subTopics: newPlan.subTopics ? newPlan.subTopics.split(',').map(s => s.trim()) : [],
        startDate: newPlan.startDate,
        endDate: newPlan.endDate,
        weekLabel: `${new Date(newPlan.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${new Date(newPlan.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        periods: Number(newPlan.periods) || 5,
        chapters: newPlan.chapters ? [newPlan.chapters] : ['Chapter 1'],
        objectives: newPlan.objectives || 'Cover syllabus requirements and problem-solving techniques.',
        teachingMethods: newPlan.teachingMethods.split(',').map(m => m.trim()),
        homework: newPlan.homework,
        status: newPlan.status,
        coveragePct: 0,
        topicsList: newPlan.subTopics 
          ? newPlan.subTopics.split(',').map(t => ({ text: t.trim(), type: 'Syllabus', status: 'Pending' }))
          : [{ text: newPlan.topic || 'Main Unit Concepts', type: 'Syllabus', status: 'Pending' }]
      };

      await lessonPlanService.createPlan(payload);
      setShowAddModal(false);
      Swal.fire({
        title: 'Plan Created!',
        text: 'Lesson plan successfully registered in MongoDB.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
      loadPlans();
      setNewPlan({
        title: '',
        className: 'Class 10',
        sectionName: 'Section A',
        subjectName: 'Mathematics',
        topic: '',
        subTopics: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
        periods: 5,
        chapters: '',
        objectives: '',
        teachingMethods: 'Lecture, Smart Board, Problem Solving',
        homework: '',
        status: 'Approved'
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  // Delete plan
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this lesson plan?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc2626'
    });
    if (confirm.isConfirmed) {
      try {
        await lessonPlanService.deletePlan(id);
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'Plan removed.', timer: 1200, showConfirmButton: false });
        loadPlans();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
      }
    }
  };

  // HOD Approval Action
  const handleReviewAction = async (planId, newStatus) => {
    try {
      await lessonPlanService.updatePlan(planId, { status: newStatus });
      Swal.fire({
        icon: 'success',
        title: `Plan ${newStatus}`,
        text: `Lesson plan has been updated to ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false
      });
      loadPlans();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message });
    }
  };

  // Toggle Topic Coverage
  const handleToggleTopic = async (topicIdx) => {
    if (!selectedPlanForCoverage) return;
    const updatedTopics = [...(selectedPlanForCoverage.topicsList || [])];
    const current = updatedTopics[topicIdx].status;
    updatedTopics[topicIdx].status = current === 'Covered' ? 'Pending' : 'Covered';

    const coveredCount = updatedTopics.filter(t => t.status === 'Covered').length;
    const newCoveragePct = Math.round((coveredCount / updatedTopics.length) * 100);

    try {
      await lessonPlanService.updatePlan(selectedPlanForCoverage._id, {
        topicsList: updatedTopics,
        coveragePct: newCoveragePct
      });
      setSelectedPlanForCoverage(prev => ({
        ...prev,
        topicsList: updatedTopics,
        coveragePct: newCoveragePct
      }));
      setPlans(prev => prev.map(p => p._id === selectedPlanForCoverage._id ? { ...p, topicsList: updatedTopics, coveragePct: newCoveragePct } : p));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to update topic', text: err.message });
    }
  };

  // Filtered Plans
  const filteredPlans = plans.filter(p => {
    const sMatch = statusFilter === 'All statuses' || p.status === statusFilter;
    const cMatch = classFilter === 'All classes' || p.className?.includes(classFilter) || p.className === classFilter;
    const qMatch = !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.subjectName?.toLowerCase().includes(searchQuery.toLowerCase());
    return sMatch && cMatch && qMatch;
  });

  // KPIs
  const totalPlans = plans.length;
  const approvedPlans = plans.filter(p => p.status === 'Approved').length;
  const pendingPlans = plans.filter(p => p.status === 'Pending HOD' || p.status === 'Pending' || p.status === 'Draft').length;
  const avgCoverage = totalPlans > 0 ? Math.round(plans.reduce((acc, p) => acc + (p.coveragePct || 0), 0) / totalPlans) : 0;

  // --------------------------------------------------------------------------
  // TAB: LESSON PLANS LIST
  // --------------------------------------------------------------------------
  const renderPlansTab = () => (
    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
      {/* Filter Bar */}
      <div className="p-4 border-b border-gray-200 bg-white flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-gray-700 mb-1 tracking-wide">Status</label>
          <select 
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
          >
            <option>All statuses</option>
            <option>Approved</option>
            <option>Pending HOD</option>
            <option>Draft</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-gray-700 mb-1 tracking-wide">Class</label>
          <select 
            value={classFilter} onChange={e => setClassFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
          >
            <option>All classes</option>
            <option>Class 10</option>
            <option>Class 9</option>
            <option>Class 8</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-gray-700 mb-1 tracking-wide">Search</label>
          <input 
            type="text"
            placeholder="Search plan or topic..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setStatusFilter('All statuses'); setClassFilter('All classes'); setSearchQuery(''); }}
            className="text-gray-500 hover:text-gray-800 text-[13px] font-medium cursor-pointer"
          >
            Reset
          </button>
          <button 
            onClick={loadPlans}
            className="p-1.5 text-gray-600 hover:text-blue-600 border border-gray-300 bg-gray-50 cursor-pointer"
            title="Reload from DB"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">
              <th className="px-5 py-3">Plan Title</th>
              <th className="px-5 py-3">Class / Subject</th>
              <th className="px-5 py-3">Timeline</th>
              <th className="px-5 py-3 text-center">Periods</th>
              <th className="px-5 py-3 text-center">Coverage</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.length > 0 ? filteredPlans.map(plan => (
              <tr key={plan._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[13px] text-gray-800">{plan.title}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 truncate max-w-xs">{plan.objectives}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-[13px] text-gray-800 font-semibold">{plan.className} ({plan.sectionName || 'A'})</div>
                  <div className="text-[12px] text-gray-500">{plan.subjectName}</div>
                </td>
                <td className="px-5 py-4 text-[13px] text-gray-600 font-mono text-xs">{plan.weekLabel || 'Ongoing'}</td>
                <td className="px-5 py-4 text-center text-[13px] font-bold text-gray-700">{plan.periods || 5}</td>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${plan.coveragePct || 0}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{plan.coveragePct || 0}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                    plan.status === 'Approved' ? 'bg-green-100 text-green-700 border border-green-300' :
                    plan.status === 'Pending HOD' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {plan.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button 
                      onClick={() => setViewingPlan(plan)}
                      className="text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 p-1.5 cursor-pointer"
                      title="View Plan Overview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setSelectedPlanForCoverage(plan)}
                      className="text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:bg-emerald-50 p-1.5 cursor-pointer"
                      title="Mark Topic Coverage"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan._id)} 
                      className="text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 p-1.5 cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-500 text-[13px]">
                  No lesson plans match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // TAB: REVIEW (HOD)
  // --------------------------------------------------------------------------
  const renderReviewTab = () => {
    const pendingReviewPlans = plans.filter(p => p.status !== 'Approved');

    return (
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden animate-in fade-in rounded-none">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-[15px] text-gray-800 tracking-tight">Lesson Plans Awaiting HOD / Academic Review</h3>
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 font-bold">{pendingReviewPlans.length} pending</span>
        </div>
        
        {pendingReviewPlans.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
            <h4 className="font-bold text-gray-700 text-sm">All Lesson Plans Approved!</h4>
            <p className="text-gray-400 text-xs mt-1">There are no pending lesson plans awaiting review.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingReviewPlans.map(plan => (
              <div key={plan._id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{plan.title}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 uppercase">{plan.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Class: <strong>{plan.className}</strong> • Subject: <strong>{plan.subjectName}</strong> • Week: <strong>{plan.weekLabel}</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1 italic">
                    Objectives: "{plan.objectives}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleReviewAction(plan._id, 'Approved')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Plan
                  </button>
                  <button 
                    onClick={() => handleReviewAction(plan._id, 'Needs Revision')}
                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer border border-gray-300"
                  >
                    Request Revision
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // TAB: COVERAGE
  // --------------------------------------------------------------------------
  const renderCoverageTab = () => (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden animate-in fade-in rounded-none">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-[15px] text-gray-800 tracking-tight inline-block">Curriculum Syllabus Coverage Matrix</h3>
          <span className="text-[12px] text-gray-400 ml-2">(Live syllabus progress)</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">
              <th className="px-5 py-3">Lesson Plan</th>
              <th className="px-5 py-3">Class / Subject</th>
              <th className="px-5 py-3">Week</th>
              <th className="px-5 py-3 w-[260px]">Syllabus Coverage Progress</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => {
              const totalTopics = plan.topicsList?.length || 1;
              const coveredTopics = plan.topicsList?.filter(t => t.status === 'Covered').length || 0;
              const pct = plan.coveragePct || Math.round((coveredTopics / totalTopics) * 100);

              return (
                <tr key={plan._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4 font-bold text-gray-800 text-xs">{plan.title}</td>
                  <td className="px-5 py-4 text-xs">
                    <div className="font-semibold text-gray-800">{plan.className}</div>
                    <div className="text-gray-400">{plan.subjectName}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">{plan.weekLabel || 'Ongoing'}</td>
                  <td className="px-5 py-4">
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-1">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold">{coveredTopics}/{totalTopics} topics covered ({pct}%)</div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      onClick={() => setSelectedPlanForCoverage(plan)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" /> Mark coverage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // TAB: REPORTS & ANALYTICS
  // --------------------------------------------------------------------------
  const renderReportsTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Lesson Plans</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{totalPlans}</h3>
        </div>
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-emerald-600 uppercase">Approved Plans</p>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">{approvedPlans}</h3>
        </div>
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-amber-600 uppercase">Pending Review</p>
          <h3 className="text-2xl font-black text-amber-700 mt-1">{pendingPlans}</h3>
        </div>
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-indigo-600 uppercase">Average Coverage</p>
          <h3 className="text-2xl font-black text-indigo-700 mt-1">{avgCoverage}%</h3>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 text-sm mb-4">Subject-wise Syllabus Execution Index</h3>
        <div className="space-y-4">
          {['Mathematics', 'Physics', 'English', 'Economics'].map(subj => {
            const subjPlans = plans.filter(p => p.subjectName === subj);
            const count = subjPlans.length;
            const avg = count > 0 ? Math.round(subjPlans.reduce((acc, p) => acc + (p.coveragePct || 0), 0) / count) : 75;

            return (
              <div key={subj}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{subj} ({count} Plans)</span>
                  <span>{avg}% Syllabus Covered</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${avg}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] text-sm pb-16">
      
      {/* Page Header */}
      <div className="bg-white px-8 py-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            Lesson Planner
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">Structure, review, and track curriculum pacing across all grade levels.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded-sm flex items-center gap-2 text-[13px] font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Lesson Plan
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="px-8 bg-white border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        {tabs.map(t => (
          <button 
            key={t.name}
            onClick={() => handleTabClick(t)}
            className={`flex items-center gap-2 px-5 py-3.5 font-bold text-[13px] whitespace-nowrap transition-colors border-b-[3px] cursor-pointer ${
              activeTab === t.name 
                ? 'text-gray-900 border-gray-900 bg-gray-50/50' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {t.icon}
            {t.name}
          </button>
        ))}
      </div>

      {/* Body Content */}
      <div className="px-8 py-6 max-w-7xl mx-auto">
        {activeTab === 'Lesson Plans' && renderPlansTab()}
        {activeTab === 'Dashboard' && renderReportsTab()}
        {activeTab === 'Review (HOD)' && renderReviewTab()}
        {activeTab === 'Coverage' && renderCoverageTab()}
        {activeTab === 'Reports' && renderReportsTab()}
        {activeTab === 'Guide' && (
          <div className="bg-white p-8 border border-gray-200 text-xs text-gray-700 space-y-4">
            <h3 className="font-bold text-base text-gray-900">National Curriculum Framework Pedagogical Guidelines</h3>
            <p>1. <strong>Lesson Structure:</strong> Every lesson plan should open with clear learning objectives, followed by teaching aids and interactive pair exercises.</p>
            <p>2. <strong>Coverage Reconciliation:</strong> Teachers must mark topic coverage weekly in the Coverage tab so HODs can monitor syllabus pacing before mid-term assessments.</p>
            <p>3. <strong>Homework Alignment:</strong> Homework must be directly linked to the topics covered during the classroom period.</p>
          </div>
        )}
      </div>

      {/* ADD PLAN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-none border border-gray-300 w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h3 className="font-bold text-gray-800 text-base">Create New Lesson Plan</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Plan Title</label>
                <input 
                  type="text" 
                  value={newPlan.title} 
                  onChange={e => setNewPlan({ ...newPlan, title: e.target.value })}
                  placeholder="e.g. Mathematics — Week of 28 Oct" 
                  className="w-full border border-gray-300 p-2 rounded-none text-xs focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class</label>
                  <select 
                    value={newPlan.className} 
                    onChange={e => setNewPlan({ ...newPlan, className: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-none text-xs focus:border-blue-500 outline-none bg-white"
                  >
                    <option>Class 10</option>
                    <option>Class 9</option>
                    <option>Class 8</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject</label>
                  <select 
                    value={newPlan.subjectName} 
                    onChange={e => setNewPlan({ ...newPlan, subjectName: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-none text-xs focus:border-blue-500 outline-none bg-white"
                  >
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>English</option>
                    <option>Social Science</option>
                    <option>Chemistry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Main Topic & Subtopics (comma separated)</label>
                <input 
                  type="text" 
                  value={newPlan.subTopics} 
                  onChange={e => setNewPlan({ ...newPlan, subTopics: e.target.value })}
                  placeholder="e.g. Factoring, Quadratic Formula, Discriminant analysis" 
                  className="w-full border border-gray-300 p-2 rounded-none text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={newPlan.startDate} 
                    onChange={e => setNewPlan({ ...newPlan, startDate: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={newPlan.endDate} 
                    onChange={e => setNewPlan({ ...newPlan, endDate: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Learning Objectives</label>
                <textarea 
                  rows="2" 
                  value={newPlan.objectives} 
                  onChange={e => setNewPlan({ ...newPlan, objectives: e.target.value })}
                  placeholder="What will the students learn and demonstrate?"
                  className="w-full border border-gray-300 p-2 rounded-none text-xs outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MARK TOPIC COVERAGE MODAL */}
      {selectedPlanForCoverage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSelectedPlanForCoverage(null)}>
          <div className="bg-white rounded-none border border-gray-300 w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Reconcile Topic Coverage</h3>
                <p className="text-xs text-gray-500">{selectedPlanForCoverage.title} ({selectedPlanForCoverage.className})</p>
              </div>
              <button onClick={() => setSelectedPlanForCoverage(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <p className="text-xs text-gray-500">Check off the syllabus topics completed during classroom periods:</p>
              {selectedPlanForCoverage.topicsList?.map((topic, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleToggleTopic(idx)}
                  className={`p-3 border flex items-center justify-between cursor-pointer transition-colors ${
                    topic.status === 'Covered' ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 flex items-center justify-center border font-bold text-xs ${
                      topic.status === 'Covered' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-400 bg-white'
                    }`}>
                      {topic.status === 'Covered' && '✓'}
                    </div>
                    <span className={`text-xs ${topic.status === 'Covered' ? 'font-bold text-emerald-900' : 'text-gray-700'}`}>
                      {topic.text}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${
                    topic.status === 'Covered' ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {topic.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
              <button onClick={() => setSelectedPlanForCoverage(null)} className="px-5 py-2 bg-blue-600 text-white font-bold text-xs cursor-pointer">
                Done Reconciling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PLAN OVERVIEW MODAL */}
      {viewingPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setViewingPlan(null)}>
          <div className="bg-white rounded-none border border-gray-300 w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-base">{viewingPlan.title}</h3>
                <p className="text-xs text-gray-500">{viewingPlan.className} • {viewingPlan.subjectName}</p>
              </div>
              <button onClick={() => setViewingPlan(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="bg-gray-50 p-3 border border-gray-200">
                <span className="font-bold text-gray-500 uppercase text-[10px] block mb-1">Learning Objectives</span>
                <p className="font-medium text-gray-800">{viewingPlan.objectives}</p>
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase text-[10px] block mb-1">Teaching Aids & Methodologies</span>
                <p>{viewingPlan.teachingMethods?.join(', ') || 'Smart Board, Practice Questions'}</p>
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase text-[10px] block mb-1">Homework / Assignment Task</span>
                <p>{viewingPlan.homework || 'Textbook exercise problems'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
              <button onClick={() => setViewingPlan(null)} className="px-4 py-1.5 bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LessonPlanner;
