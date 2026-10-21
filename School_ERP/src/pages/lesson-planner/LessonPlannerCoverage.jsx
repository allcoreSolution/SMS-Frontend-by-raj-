import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, ArrowLeft, Save, Check, X, 
  Search, Filter, Plus, Clock, AlertTriangle, BookOpen, 
  TrendingUp, BarChart2, ShieldCheck, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService from '../../api/lessonPlanService';

export default function LessonPlannerCoverage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // View state: 'list' | 'detail'
  const [view, setView] = useState('list');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Filters
  const [coverageFilter, setCoverageFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New Topic Form inside detail view
  const [newTopicText, setNewTopicText] = useState('');
  const [newTopicType, setNewTopicType] = useState('Syllabus');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
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

  const openPlanDetail = (plan) => {
    setSelectedPlan(plan);
    setView('detail');
  };

  const handleTopicStatusChange = async (topicId, newStatus) => {
    if (!selectedPlan) return;
    try {
      const updatedPlan = await lessonPlanService.updateTopicCoverage(selectedPlan.id, topicId, newStatus);
      if (updatedPlan) {
        setSelectedPlan({ ...updatedPlan });
        setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkMarkAllCovered = async () => {
    if (!selectedPlan || !selectedPlan.topicsList) return;
    const updatedTopics = selectedPlan.topicsList.map(t => ({ ...t, status: 'Covered' }));
    const updatedPlan = {
      ...selectedPlan,
      topicsList: updatedTopics,
      coveragePct: 100
    };
    try {
      await lessonPlanService.updateLessonPlan(selectedPlan.id, {
        topicsList: updatedTopics,
        coveragePct: 100
      });
      setSelectedPlan(updatedPlan);
      setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicText.trim() || !selectedPlan) return;

    const newTopic = {
      id: 'top_' + Date.now(),
      text: newTopicText.trim(),
      type: newTopicType,
      status: 'Pending'
    };

    const updatedTopics = [...(selectedPlan.topicsList || []), newTopic];
    const total = updatedTopics.length;
    const covered = updatedTopics.filter(t => t.status === 'Covered').length;
    const newPct = total > 0 ? Math.round((covered / total) * 100) : 0;

    const updatedPlan = {
      ...selectedPlan,
      topicsList: updatedTopics,
      coveragePct: newPct
    };

    try {
      await lessonPlanService.updateLessonPlan(selectedPlan.id, {
        topicsList: updatedTopics,
        coveragePct: newPct
      });
      setSelectedPlan(updatedPlan);
      setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      setNewTopicText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Filter plans
  const filteredPlans = plans.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.className && p.className.toLowerCase().includes(q)) || (p.subjectName && p.subjectName.toLowerCase().includes(q));
    
    if (coverageFilter === 'Needs marking') {
      return matchSearch && (p.coveragePct < 100);
    }
    if (coverageFilter === 'Completed') {
      return matchSearch && (p.coveragePct === 100);
    }
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {view === 'list' ? (
          <>
            {/* Header Banner */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">Syllabus Topic Coverage Reconciliation</h2>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                      Curriculum Audit
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track which planned syllabus units have been taught in class, identify lag or deferrals, and maintain accreditation proof.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/lesson-planner/reports')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BarChart2 className="w-4 h-4 text-slate-500" /> Coverage Analytics
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plan by title, class, or subject..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="w-44">
                  <select 
                    value={coverageFilter}
                    onChange={(e) => setCoverageFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Lesson Plans</option>
                    <option value="Needs marking">Needs Marking (&lt; 100%)</option>
                    <option value="Completed">100% Fully Reconciled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Coverage List Table */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800">Classroom Lesson Coverage Register</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {filteredPlans.length} Plans
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-3.5">Plan / Unit</th>
                      <th className="px-5 py-3.5">Class / Subject</th>
                      <th className="px-5 py-3.5">Teacher</th>
                      <th className="px-5 py-3.5">Target Week</th>
                      <th className="px-5 py-3.5 text-center">Topics Count</th>
                      <th className="px-5 py-3.5">Curriculum Progress</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                          Loading coverage data...
                        </td>
                      </tr>
                    ) : filteredPlans.length > 0 ? (
                      filteredPlans.map((plan) => {
                        const topics = plan.topicsList || [];
                        const totalTopics = topics.length;
                        const covered = topics.filter(t => t.status === 'Covered').length;
                        const pct = plan.coveragePct || (totalTopics > 0 ? Math.round((covered / totalTopics) * 100) : 0);

                        return (
                          <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <div 
                                onClick={() => openPlanDetail(plan)}
                                className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                              >
                                {plan.title}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {plan.chapters && plan.chapters[0] ? plan.chapters[0] : 'Syllabus Chapter'}
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="font-semibold text-slate-800">{plan.className}</div>
                              <div className="text-[11px] text-slate-500">{plan.subjectName}</div>
                            </td>

                            <td className="px-5 py-3.5 font-medium text-slate-700">
                              {plan.teacherName}
                            </td>

                            <td className="px-5 py-3.5 text-slate-600">
                              {plan.weekLabel || `${plan.startDate} — ${plan.endDate}`}
                            </td>

                            <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                              {totalTopics}
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="w-36 space-y-1">
                                <div className="flex justify-between text-[11px] font-semibold">
                                  <span className="text-slate-600">{covered}/{totalTopics} Covered</span>
                                  <span className={pct === 100 ? 'text-emerald-600' : pct > 40 ? 'text-blue-600' : 'text-amber-600'}>
                                    {pct}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      pct === 100 ? 'bg-emerald-500' : pct > 40 ? 'bg-blue-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-3.5 text-right">
                              <button 
                                onClick={() => openPlanDetail(plan)}
                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-all cursor-pointer shadow-2xs"
                              >
                                Reconcile Topics
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                          No plans found matching filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Detail View: Mark Syllabus Coverage */
          <div className="space-y-6">
            
            {/* Top Bar with Back Button */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setView('list')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Coverage Register
              </button>

              <button
                onClick={handleBulkMarkAllCovered}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Mark All Topics Covered
              </button>
            </div>

            {/* Plan Header Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Curriculum Topic Reconciliation
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {selectedPlan.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedPlan.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedPlan.className} · {selectedPlan.subjectName} · Teacher: <span className="font-semibold text-slate-700">{selectedPlan.teacherName}</span> · Target Week: {selectedPlan.weekLabel}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 min-w-[200px] text-center">
                  <div className="text-2xl font-extrabold text-blue-600 mb-0.5">
                    {selectedPlan.coveragePct || 0}%
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Syllabus Completed
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${selectedPlan.coveragePct || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Topics List Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Instructional Topics Breakdown</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Click status buttons to mark progress on each curriculum sub-unit.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {selectedPlan.topicsList?.length || 0} Topics
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {selectedPlan.topicsList && selectedPlan.topicsList.length > 0 ? (
                  selectedPlan.topicsList.map((topic, index) => {
                    const isCovered = topic.status === 'Covered';
                    const isInProgress = topic.status === 'In-Progress';
                    const isNotCovered = topic.status === 'Not Covered';

                    return (
                      <div key={topic.id || index} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-xs font-bold text-slate-400 mt-0.5 w-6">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                              {topic.text}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              {topic.type || 'Syllabus'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Status Toggle Buttons */}
                        <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleTopicStatusChange(topic.id, 'Covered')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isCovered 
                                ? 'bg-emerald-600 text-white shadow-2xs' 
                                : 'text-slate-600 hover:text-emerald-700'
                            }`}
                          >
                            Covered
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTopicStatusChange(topic.id, 'In-Progress')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isInProgress 
                                ? 'bg-amber-600 text-white shadow-2xs' 
                                : 'text-slate-600 hover:text-amber-700'
                            }`}
                          >
                            In-Progress
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTopicStatusChange(topic.id, 'Not Covered')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isNotCovered 
                                ? 'bg-rose-600 text-white shadow-2xs' 
                                : 'text-slate-600 hover:text-rose-700'
                            }`}
                          >
                            Not Covered
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTopicStatusChange(topic.id, 'Pending')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              topic.status === 'Pending' 
                                ? 'bg-slate-700 text-white shadow-2xs' 
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Pending
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    No topics configured for this plan. Add a topic below!
                  </div>
                )}
              </div>

              {/* Add Topic Bar */}
              <form onSubmit={handleAddTopic} className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
                <input 
                  type="text"
                  value={newTopicText}
                  onChange={(e) => setNewTopicText(e.target.value)}
                  placeholder="Add additional syllabus topic / unit taught..."
                  className="w-full sm:flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                />

                <select 
                  value={newTopicType}
                  onChange={(e) => setNewTopicType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="Syllabus">Syllabus Topic</option>
                  <option value="Additional">Additional Topic</option>
                </select>

                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add Topic
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
