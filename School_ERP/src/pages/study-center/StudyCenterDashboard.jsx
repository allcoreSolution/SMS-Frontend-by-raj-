import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, BookOpen, Video, FileText, ClipboardList, 
  BarChart2, Edit, Trash2, Calendar, LayoutDashboard,
  FolderOpen, List, GraduationCap, ChevronDown, Upload,
  AlertTriangle, Search, Plus, CheckCircle, Clock, ExternalLink,
  Users, Check, X, Sparkles, Download, Eye, Award, Play, RefreshCw
} from 'lucide-react';
import { studyCenterService } from '../../api/studyCenterService';

export default function StudyCenterDashboard({ initialTab = 'Dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  // Modals state
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isClassworkModalOpen, setIsClassworkModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [evaluatingHomework, setEvaluatingHomework] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Manage Syllabus', icon: FolderOpen },
    { name: 'Classwork & Logbook', icon: FileText },
    { name: 'Manage Resources', icon: BookOpen },
    { name: 'Homework & Assignments', icon: List },
    { name: 'Live Classes', icon: Video },
  ];

  return (
    <div className="bg-slate-50/70 min-h-screen font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Academic Study Center</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  E-Learning & Curriculum
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage syllabus units, digital learning materials, daily classwork logbook, and homework grading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {activeTab === 'Dashboard' && (
              <>
                <button 
                  onClick={() => setActiveTab('Manage Syllabus')}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <FolderOpen className="w-4 h-4 text-indigo-600" /> Manage Syllabus
                </button>
                <button 
                  onClick={() => navigate('/live-classes/manage')}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all"
                >
                  <Video className="w-4 h-4" /> Live Classes Hub
                </button>
              </>
            )}

            {activeTab === 'Manage Syllabus' && (
              <button 
                onClick={() => setIsSyllabusModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Syllabus Unit
              </button>
            )}

            {activeTab === 'Classwork & Logbook' && (
              <button 
                onClick={() => setIsClassworkModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> New Logbook Entry
              </button>
            )}

            {activeTab === 'Manage Resources' && (
              <button 
                onClick={() => setIsResourceModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <Upload className="w-4 h-4" /> Upload Material
              </button>
            )}

            {activeTab === 'Homework & Assignments' && (
              <button 
                onClick={() => setIsHomeworkModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Assign Homework
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-100 overflow-x-auto pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  if (tab.name === 'Live Classes') {
                    navigate('/live-classes/manage');
                  } else {
                    setActiveTab(tab.name);
                  }
                }}
                className={`flex items-center whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === 'Dashboard' && (
          <DashboardTab 
            onOpenEvaluate={(hw) => setEvaluatingHomework(hw)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'Manage Syllabus' && (
          <ManageSyllabusTab 
            isOpenModal={isSyllabusModalOpen}
            onCloseModal={() => setIsSyllabusModalOpen(false)}
            showToast={showToast}
          />
        )}
        {activeTab === 'Classwork & Logbook' && (
          <ClassworkTab 
            isOpenModal={isClassworkModalOpen}
            onCloseModal={() => setIsClassworkModalOpen(false)}
            showToast={showToast}
          />
        )}
        {activeTab === 'Manage Resources' && (
          <ManageResourcesTab 
            isOpenModal={isResourceModalOpen}
            onCloseModal={() => setIsResourceModalOpen(false)}
            showToast={showToast}
          />
        )}
        {activeTab === 'Homework & Assignments' && (
          <HomeworkTab 
            isOpenModal={isHomeworkModalOpen}
            onCloseModal={() => setIsHomeworkModalOpen(false)}
            evaluatingHomework={evaluatingHomework}
            onCloseEvaluate={() => setEvaluatingHomework(null)}
            showToast={showToast}
          />
        )}
      </div>

      {/* Homework Evaluation Modal (Global) */}
      {evaluatingHomework && (
        <EvaluateHomeworkModal 
          homework={evaluatingHomework}
          onClose={() => setEvaluatingHomework(null)}
          onSuccess={() => {
            showToast('Submission evaluated successfully!');
            setEvaluatingHomework(null);
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 1. Dashboard Tab Component
// -------------------------------------------------------------
function DashboardTab({ onOpenEvaluate, onNavigateTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await studyCenterService.getStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load study center stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-slate-200/80 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Loading Academic Study Center Analytics...</p>
      </div>
    );
  }

  const { kpis, recentHomework, upcomingLiveClasses, submissionAnalytics } = data;

  return (
    <div className="space-y-6">
      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Syllabus Units */}
        <div 
          onClick={() => onNavigateTab('Manage Syllabus')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FolderOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Curriculum
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.syllabusUnits || 0}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Syllabus Chapters</div>
          <p className="text-[11px] text-emerald-600 font-bold mt-2">
            ✓ {kpis.completedUnits || 0} Completed Units
          </p>
        </div>

        {/* Study Materials */}
        <div 
          onClick={() => onNavigateTab('Manage Resources')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              E-Library
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.studyMaterials || 0}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Learning Materials</div>
          <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-500">
            <span className="px-1.5 py-0.5 bg-slate-100 rounded">PDF: {kpis.materialBreakdown?.pdf || 0}</span>
            <span className="px-1.5 py-0.5 bg-slate-100 rounded">Video: {kpis.materialBreakdown?.video || 0}</span>
            <span className="px-1.5 py-0.5 bg-slate-100 rounded">Doc: {kpis.materialBreakdown?.doc || 0}</span>
          </div>
        </div>

        {/* Active Homework */}
        <div 
          onClick={() => onNavigateTab('Homework & Assignments')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <List className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
              Assignments
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.activeHomework || 0}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Homework</div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            {kpis.totalHomework || 0} total assignments created
          </p>
        </div>

        {/* Live Classes */}
        <div 
          onClick={() => onNavigateTab('Live Classes')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Live Now
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.liveNow || 0}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Live Sessions</div>
          <p className="text-[11px] text-indigo-600 font-bold mt-2">
            {kpis.scheduledLive || 0} upcoming virtual lectures
          </p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Homework & Assignments */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Edit className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Homework & Submissions</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('Homework & Assignments')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Homework Title</th>
                  <th className="px-5 py-3.5">Class & Subject</th>
                  <th className="px-5 py-3.5">Submission Rate</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {recentHomework.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                      No assignments found. Click "Assign Homework" to post your first task.
                    </td>
                  </tr>
                ) : (
                  recentHomework.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800 line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Max Marks: {item.totalMarks}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{item.className}</div>
                        <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md mt-0.5">
                          {item.subjectName}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {item.submissionCount || item.submissions?.length || 0} / {item.totalStudents || 40}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">
                            ({Math.round(((item.submissionCount || 0) / (item.totalStudents || 40)) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                          {new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => onOpenEvaluate(item)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" /> Evaluate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Live Classes */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Virtual Classroom Sessions</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('Live Classes')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800"
            >
              All Hub →
            </button>
          </div>

          <div className="p-4 space-y-3 flex-grow overflow-y-auto max-h-[380px]">
            {upcomingLiveClasses.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                No active live sessions right now.
              </div>
            ) : (
              upcomingLiveClasses.map((cls) => (
                <div key={cls._id} className="p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-2xl flex items-center justify-between hover:bg-slate-100/70 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {cls.status === 'Live' ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Live
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-black uppercase tracking-wider">
                          Scheduled
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-500">{cls.provider}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{cls.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {cls.subjectName} · {cls.className} · {cls.teacherName}
                    </p>
                  </div>

                  <a
                    href={cls.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Enter
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Bottom Performance Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" /> Homework Submission Rates by Class
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3.5">
            {submissionAnalytics.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{s.className}</span>
                  <span className="text-indigo-600">{s.ratePct}% Submitted</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${s.ratePct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" /> Average Evaluated Score (Out of 25)
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Class Performance</span>
          </div>

          <div className="space-y-3.5">
            {submissionAnalytics.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{s.className}</span>
                  <span className="text-emerald-700 font-black">{s.avgMarks} / 25</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(s.avgMarks / 25) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. Manage Syllabus Tab Component
// -------------------------------------------------------------
function ManageSyllabusTab({ isOpenModal, onCloseModal, showToast }) {
  const [units, setUnits] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  // Form State for Adding Syllabus Unit
  const [newUnit, setNewUnit] = useState({
    unitNumber: 1,
    title: '',
    className: 'Class X',
    subjectName: 'Mathematics',
    periodsEstimated: 8,
    learningObjectives: '',
    topicsInput: ''
  });

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const res = await studyCenterService.getSyllabus({
        className: selectedClass !== 'All' ? selectedClass : undefined,
        subjectName: selectedSubject !== 'All' ? selectedSubject : undefined
      });
      if (res.success) {
        setUnits(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load syllabus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, [selectedClass, selectedSubject]);

  const handleToggleTopic = async (unit, topicIndex) => {
    const updatedTopics = [...unit.topics];
    const currentStatus = updatedTopics[topicIndex].status;
    const nextStatus = currentStatus === 'Covered' ? 'Pending' : 'Covered';
    updatedTopics[topicIndex].status = nextStatus;

    // Recalculate percent
    const coveredCount = updatedTopics.filter(t => t.status === 'Covered').length;
    const completionPct = Math.round((coveredCount / updatedTopics.length) * 100);
    const status = completionPct === 100 ? 'Completed' : completionPct > 0 ? 'In-Progress' : 'Pending';

    try {
      await studyCenterService.updateSyllabusUnit(unit._id, {
        topics: updatedTopics,
        completionPct,
        status
      });
      fetchSyllabus();
      showToast('Topic status updated!');
    } catch (err) {
      console.error('Failed to update topic status', err);
    }
  };

  const handleCreateUnit = async (e) => {
    e.preventDefault();
    try {
      const topics = newUnit.topicsInput
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .map(t => ({ name: t, status: 'Pending' }));

      await studyCenterService.createSyllabusUnit({
        ...newUnit,
        topics,
        completionPct: 0,
        status: 'Pending'
      });
      onCloseModal();
      fetchSyllabus();
      showToast('Syllabus unit created successfully!');
    } catch (err) {
      console.error('Failed to create syllabus unit', err);
    }
  };

  const handleDeleteUnit = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await studyCenterService.deleteSyllabusUnit(id);
      fetchSyllabus();
      showToast('Syllabus unit deleted');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Filter Class
            </label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Classes</option>
              <option value="Class X">Class X</option>
              <option value="Class IX">Class IX</option>
              <option value="Class XI">Class XI</option>
              <option value="Class XII">Class XII</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Filter Subject
            </label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Social Sciences">Social Sciences</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-600">
          Showing <span className="text-indigo-600 font-black">{units.length}</span> Curriculum Chapters
        </div>
      </div>

      {/* Syllabus Units Cards */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading syllabus units...</p>
        </div>
      ) : units.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Syllabus Units Found</h3>
          <p className="text-xs text-slate-500 mt-1">Add curriculum chapters using "+ Add Syllabus Unit".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => (
            <div key={unit._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">
                      Unit {unit.unitNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {unit.className} · {unit.subjectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      unit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                      unit.status === 'In-Progress' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {unit.status}
                    </span>
                    <button
                      onClick={() => handleDeleteUnit(unit._id, unit.title)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      title="Delete Unit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{unit.title}</h3>
                {unit.learningObjectives && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{unit.learningObjectives}</p>
                )}

                {/* Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Coverage Completion</span>
                    <span className="text-indigo-600">{unit.completionPct || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${unit.completionPct || 0}%` }}
                    />
                  </div>
                </div>

                {/* Topics Checklist */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Topics & Subtopics Checklist (Click to Toggle)
                  </div>
                  {unit.topics?.map((topic, tIdx) => {
                    const isCovered = topic.status === 'Covered';
                    return (
                      <div 
                        key={tIdx}
                        onClick={() => handleToggleTopic(unit, tIdx)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          isCovered ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-white ${isCovered ? 'bg-emerald-600' : 'border border-slate-300'}`}>
                            {isCovered && <Check className="w-3 h-3" />}
                          </div>
                          <span>{topic.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold ${isCovered ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {isCovered ? 'Covered' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>Estimated: {unit.periodsEstimated || 8} periods</span>
                <span>Taken: {unit.periodsTaken || 0} periods</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Syllabus Unit Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Add New Syllabus Unit</h3>
              <button onClick={onCloseModal} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class</label>
                  <select
                    value={newUnit.className}
                    onChange={e => setNewUnit({ ...newUnit, className: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Class X">Class X</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class XI">Class XI</option>
                    <option value="Class XII">Class XII</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newUnit.subjectName}
                    onChange={e => setNewUnit({ ...newUnit, subjectName: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit Number</label>
                  <input
                    type="number"
                    min="1"
                    value={newUnit.unitNumber}
                    onChange={e => setNewUnit({ ...newUnit, unitNumber: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 4: Quadratic Equations"
                    value={newUnit.title}
                    onChange={e => setNewUnit({ ...newUnit, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Topics to Cover (One per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="Quadratic formula derivation&#10;Nature of roots discriminant&#10;Application word problems"
                  value={newUnit.topicsInput}
                  onChange={e => setNewUnit({ ...newUnit, topicsInput: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Learning Objectives</label>
                <input
                  type="text"
                  placeholder="Key student learning outcomes"
                  value={newUnit.learningObjectives}
                  onChange={e => setNewUnit({ ...newUnit, learningObjectives: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. Classwork & Logbook Tab Component
// -------------------------------------------------------------
function ClassworkTab({ isOpenModal, onCloseModal, showToast }) {
  const [logs, setLogs] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [loading, setLoading] = useState(true);

  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().slice(0, 10),
    className: 'Class X',
    sectionName: 'Section A',
    subjectName: 'Mathematics',
    period: 1,
    teacherName: 'Amit Sharma',
    topicTaught: '',
    classworkSummary: '',
    homeworkAssigned: '',
    attendanceCount: 35
  });

  const fetchClasswork = async () => {
    try {
      setLoading(true);
      const res = await studyCenterService.getClasswork({
        className: selectedClass !== 'All' ? selectedClass : undefined
      });
      if (res.success) {
        setLogs(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasswork();
  }, [selectedClass]);

  const handleCreateLog = async (e) => {
    e.preventDefault();
    try {
      await studyCenterService.createClasswork(newLog);
      onCloseModal();
      fetchClasswork();
      showToast('Classwork log entry saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Delete this log entry?')) return;
    try {
      await studyCenterService.deleteClasswork(id);
      fetchClasswork();
      showToast('Log entry removed');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Filter By Class:</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="All">All Classes</option>
            <option value="Class X">Class X</option>
            <option value="Class IX">Class IX</option>
            <option value="Class XI">Class XI</option>
            <option value="Class XII">Class XII</option>
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Total Logged Entries: <span className="text-teal-700 font-black">{logs.length}</span>
        </div>
      </div>

      {/* Log Feed */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading daily logbook entries...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Classwork Entries Recorded</h3>
          <p className="text-xs text-slate-500 mt-1">Use "+ New Logbook Entry" to track daily classroom teaching.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-xl text-xs font-black">
                    Period {log.period}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{log.topicTaught}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {log.className} ({log.sectionName}) · {log.subjectName} · Faculty: {log.teacherName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {log.attendanceCount} Students
                  </span>
                  <button
                    onClick={() => handleDeleteLog(log._id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="font-bold text-slate-700 block mb-1">Classwork Notes:</span>
                  <p className="text-slate-600 leading-relaxed font-medium">{log.classworkSummary}</p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                  <span className="font-bold text-indigo-900 block mb-1">Homework Assigned:</span>
                  <p className="text-indigo-800 leading-relaxed font-medium">
                    {log.homeworkAssigned || 'No homework assigned today.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Logbook Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">New Daily Classwork Entry</h3>
              <button onClick={onCloseModal} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newLog.date}
                    onChange={e => setNewLog({ ...newLog, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class</label>
                  <select
                    value={newLog.className}
                    onChange={e => setNewLog({ ...newLog, className: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Class X">Class X</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class XI">Class XI</option>
                    <option value="Class XII">Class XII</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Period</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newLog.period}
                    onChange={e => setNewLog({ ...newLog, period: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={newLog.subjectName}
                    onChange={e => setNewLog({ ...newLog, subjectName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teacher</label>
                  <input
                    type="text"
                    required
                    value={newLog.teacherName}
                    onChange={e => setNewLog({ ...newLog, teacherName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Topic Taught</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Formula & Discriminant"
                  value={newLog.topicTaught}
                  onChange={e => setNewLog({ ...newLog, topicTaught: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Classwork Activity Summary</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Questions solved in class, diagrams drawn on board..."
                  value={newLog.classworkSummary}
                  onChange={e => setNewLog({ ...newLog, classworkSummary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Homework Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. NCERT Exercise 4.3 Q1 to Q4"
                  value={newLog.homeworkAssigned}
                  onChange={e => setNewLog({ ...newLog, homeworkAssigned: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 4. Manage Resources Tab Component
// -------------------------------------------------------------
function ManageResourcesTab({ isOpenModal, onCloseModal, showToast }) {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    className: 'Class X',
    subjectName: 'Mathematics',
    materialType: 'PDF',
    fileUrl: '',
    fileSize: '2.4 MB',
    authorTeacher: 'Faculty Staff',
    tagsInput: 'Revision, Notes'
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await studyCenterService.getResources({
        materialType: filterType !== 'All' ? filterType : undefined,
        search: search.trim() || undefined
      });
      if (res.success) {
        setResources(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filterType, search]);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      const tags = newResource.tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await studyCenterService.createResource({
        ...newResource,
        tags
      });
      onCloseModal();
      fetchResources();
      showToast('Learning material uploaded successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (resource) => {
    try {
      await studyCenterService.incrementDownload(resource._id);
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
      fetchResources();
      showToast('Opening document / link');
    } catch (err) {
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await studyCenterService.deleteResource(id);
      fetchResources();
      showToast('Resource removed');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes, textbooks, videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'PDF', 'Video', 'Doc', 'E-Book'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Materials */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading learning materials...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Learning Materials Found</h3>
          <p className="text-xs text-slate-500 mt-1">Click "+ Upload Material" to add documents or video links.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(res => (
            <div key={res._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    res.materialType === 'PDF' ? 'bg-rose-50 text-rose-700' :
                    res.materialType === 'Video' ? 'bg-blue-50 text-blue-700' :
                    res.materialType === 'E-Book' ? 'bg-purple-50 text-purple-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {res.materialType}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400">{res.fileSize}</span>
                    <button
                      onClick={() => handleDeleteResource(res._id, res.title)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2" title={res.title}>
                  {res.title}
                </h3>
                {res.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{res.description}</p>
                )}

                <div className="flex flex-wrap gap-1 pt-1">
                  {res.tags?.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-medium">
                  {res.className} · {res.subjectName} · {res.downloadsCount || 0} downloads
                </div>
                <button
                  onClick={() => handleDownload(res)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Open / Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Resource Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Upload Study Material</h3>
              <button onClick={onCloseModal} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trigonometry Identities Complete Guide"
                  value={newResource.title}
                  onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class</label>
                  <select
                    value={newResource.className}
                    onChange={e => setNewResource({ ...newResource, className: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Class X">Class X</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class XI">Class XI</option>
                    <option value="Class XII">Class XII</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Mathematics"
                    value={newResource.subjectName}
                    onChange={e => setNewResource({ ...newResource, subjectName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Material Type</label>
                  <select
                    value={newResource.materialType}
                    onChange={e => setNewResource({ ...newResource, materialType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Video">Video Link</option>
                    <option value="Doc">Word Doc</option>
                    <option value="E-Book">E-Book</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Resource URL / Attachment Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://... (Drive link, PDF url, YouTube link)"
                  value={newResource.fileUrl}
                  onChange={e => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Brief Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief synopsis of what this resource covers..."
                  value={newResource.description}
                  onChange={e => setNewResource({ ...newResource, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Author / Teacher</label>
                  <input
                    type="text"
                    value={newResource.authorTeacher}
                    onChange={e => setNewResource({ ...newResource, authorTeacher: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newResource.tagsInput}
                    onChange={e => setNewResource({ ...newResource, tagsInput: e.target.value })}
                    placeholder="Revision, Formulas, Solved"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 5. Homework & Assignments Tab Component
// -------------------------------------------------------------
function HomeworkTab({ isOpenModal, onCloseModal, evaluatingHomework, onCloseEvaluate, showToast }) {
  const [homeworks, setHomeworks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [loading, setLoading] = useState(true);

  const [newHw, setNewHw] = useState({
    title: '',
    description: '',
    className: 'Class X',
    sectionName: 'Section A',
    subjectName: 'Mathematics',
    teacherName: 'Amit Sharma',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    totalMarks: 20
  });

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const res = await studyCenterService.getHomework({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        className: selectedClass !== 'All' ? selectedClass : undefined
      });
      if (res.success) {
        setHomeworks(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, [statusFilter, selectedClass]);

  const handleCreateHw = async (e) => {
    e.preventDefault();
    try {
      await studyCenterService.createHomework(newHw);
      onCloseModal();
      fetchHomework();
      showToast('Homework assigned successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHw = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await studyCenterService.deleteHomework(id);
      fetchHomework();
      showToast('Homework deleted');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Classes</option>
              <option value="Class X">Class X</option>
              <option value="Class IX">Class IX</option>
              <option value="Class XI">Class XI</option>
              <option value="Class XII">Class XII</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active / Open</option>
              <option value="Closed">Past Due / Closed</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-600">
          Total Assignments: <span className="text-purple-600 font-black">{homeworks.length}</span>
        </div>
      </div>

      {/* Homework Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading homework assignments...</p>
        </div>
      ) : homeworks.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80">
          <List className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Homework Assignments Found</h3>
          <p className="text-xs text-slate-500 mt-1">Click "+ Assign Homework" to post a task.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homeworks.map(hw => {
            const submissionsCount = hw.submissionCount || hw.submissions?.length || 0;
            const totalStudents = hw.totalStudents || 35;
            const submissionPct = Math.round((submissionsCount / totalStudents) * 100);

            return (
              <div key={hw._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      hw.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {hw.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Due: {new Date(hw.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <button
                        onClick={() => handleDeleteHw(hw._id, hw.title)}
                        className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{hw.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{hw.description}</p>

                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>{hw.className} ({hw.sectionName}) · {hw.subjectName}</span>
                    <span className="font-bold text-slate-900">Total Marks: {hw.totalMarks}</span>
                  </div>

                  {/* Submission Rate Meter */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Submissions Turned In</span>
                      <span className="text-purple-700">{submissionsCount} / {totalStudents} ({submissionPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${submissionPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Assigned by: {hw.teacherName}</span>
                  <button
                    onClick={() => {
                      if (onCloseEvaluate) {
                        onCloseEvaluate(); // reset
                      }
                      // Open evaluation modal for this item
                      window.dispatchEvent(new CustomEvent('open-eval-modal', { detail: hw }));
                    }}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" /> Grade & Evaluate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Homework Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Assign New Homework</h3>
              <button onClick={onCloseModal} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHw} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Homework Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maths Worksheet: Quadratic Polynomials"
                  value={newHw.title}
                  onChange={e => setNewHw({ ...newHw, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class</label>
                  <select
                    value={newHw.className}
                    onChange={e => setNewHw({ ...newHw, className: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Class X">Class X</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class XI">Class XI</option>
                    <option value="Class XII">Class XII</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Section</label>
                  <select
                    value={newHw.sectionName}
                    onChange={e => setNewHw({ ...newHw, sectionName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Mathematics"
                    value={newHw.subjectName}
                    onChange={e => setNewHw({ ...newHw, subjectName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={newHw.dueDate}
                    onChange={e => setNewHw({ ...newHw, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newHw.totalMarks}
                    onChange={e => setNewHw({ ...newHw, totalMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Instructions</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Questions to solve, format of submission, guidelines..."
                  value={newHw.description}
                  onChange={e => setNewHw({ ...newHw, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
                >
                  Post Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 6. Evaluate Homework Modal Component
// -------------------------------------------------------------
function EvaluateHomeworkModal({ homework, onClose, onSuccess }) {
  const [submissions, setSubmissions] = useState(homework.submissions || []);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [marks, setMarks] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  const handleGrade = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    try {
      setSaving(true);
      await studyCenterService.evaluateHomework(homework._id, {
        studentName,
        rollNumber,
        marksObtained: Number(marks),
        remarks
      });
      // Append locally
      setSubmissions(prev => [
        ...prev.filter(s => s.rollNumber !== rollNumber),
        { studentName, rollNumber, marksObtained: Number(marks), remarks, status: 'Evaluated' }
      ]);
      setStudentName('');
      setRollNumber('');
      setMarks('');
      setRemarks('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Evaluate Student Submissions</h3>
              <p className="text-xs text-purple-200">{homework.title} (Max Marks: {homework.totalMarks})</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Submissions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Graded & Turned-In Submissions ({submissions.length})
            </h4>

            {submissions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-400 text-xs">
                No evaluated submissions yet. Add grades on the right.
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{sub.studentName}</div>
                      <div className="text-[10px] text-slate-400">Roll: {sub.rollNumber || 'N/A'}</div>
                      {sub.remarks && <p className="text-[11px] text-slate-500 mt-0.5 italic">"{sub.remarks}"</p>}
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black rounded-lg text-xs">
                        {sub.marksObtained !== null ? `${sub.marksObtained}/${homework.totalMarks}` : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grading Input Form */}
          <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/70 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Score New Student Submission
            </h4>

            <form onSubmit={handleGrade} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Patel"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    placeholder="1002"
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Score ({homework.totalMarks})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max={homework.totalMarks}
                    placeholder="19"
                    value={marks}
                    onChange={e => setMarks(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Teacher Remarks / Feedback</label>
                <textarea
                  rows="2"
                  placeholder="Great step-by-step working, minor slip on Q3..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {saving ? 'Saving Grade...' : 'Save & Grade Student'}
              </button>
            </form>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
