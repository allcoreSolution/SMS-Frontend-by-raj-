import React, { useState, useEffect } from 'react';
import { 
  Inbox, Check, MessageSquare, Plus, Search, Filter, RefreshCw,
  Star, Award, CheckCircle2, AlertCircle, Clock, Send, Eye,
  Trash2, X, ChevronRight, BarChart2, Users, FileText, Sparkles
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import surveyService from '../api/surveyService';

const Surveys = () => {
  const [activeTab, setActiveTab] = useState('My Surveys');
  const [surveys, setSurveys] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [surveySearch, setSurveySearch] = useState('');
  const [surveyFilter, setSurveyFilter] = useState('All');
  const [feedbackFilter, setFeedbackFilter] = useState('All');
  const [feedbackSearch, setFeedbackSearch] = useState('');

  // Selected Items & Modals
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isTakingSurvey, setIsTakingSurvey] = useState(null); // survey object
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [respondentName, setRespondentName] = useState('Staff Teacher');
  
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const [newSurveyData, setNewSurveyData] = useState({
    title: '',
    description: '',
    kind: 'Survey',
    targetAudience: 'Teacher',
    closesAt: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    questions: [
      { id: 'q1', questionText: 'How satisfied are you with current academic & digital resources?', type: 'Rating', options: ['1','2','3','4','5'], required: true },
      { id: 'q2', questionText: 'What improvements would best support student engagement?', type: 'Long text', options: [], required: false }
    ]
  });

  const [isCreatingFeedback, setIsCreatingFeedback] = useState(false);
  const [newFeedbackData, setNewFeedbackData] = useState({
    title: '',
    category: 'Academics',
    priority: 'Medium',
    owner: 'Academic Master',
    submittedBy: 'Teacher',
    details: ''
  });

  const [viewingAnalytics, setViewingAnalytics] = useState(null);
  const [surveyResponsesData, setSurveyResponsesData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const p = location.pathname;
    if (p.includes('/feedback-triage')) setActiveTab('Feedback Triage');
    else setActiveTab('My Surveys');
  }, [location.pathname]);

  const DEFAULT_SEED_SURVEYS = [];
  const DEFAULT_SEED_FEEDBACKS = [];

  const DEFAULT_SEED_SURVEY_STATS = {
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    openFeedbacks: 0
  };

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const [surveysRes, statsRes] = await Promise.all([
        surveyService.getSurveys().catch(() => ({ data: [] })),
        surveyService.getStats().catch(() => ({ data: null }))
      ]);
      if (surveysRes?.data && surveysRes.data.length > 0) {
        setSurveys(surveysRes.data);
      } else {
        setSurveys([]);
      }
      if (statsRes?.data) {
        setStats(statsRes.data);
      } else {
        setStats(DEFAULT_SEED_SURVEY_STATS);
      }
    } catch (err) {
      setSurveys([]);
      setStats(DEFAULT_SEED_SURVEY_STATS);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await surveyService.getFeedbacks().catch(() => ({ data: [] }));
      if (res?.data && res.data.length > 0) {
        setFeedbacks(res.data);
        if (!selectedFeedback) {
          setSelectedFeedback(res.data[0]);
        }
      } else {
        setFeedbacks([]);
        setSelectedFeedback(null);
      }
    } catch (err) {
      setFeedbacks([]);
      setSelectedFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
    loadFeedbacks();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'My Surveys') navigate('/my-surveys');
    else navigate('/feedback-triage');
  };

  // Submit response to a survey
  const handleSubmitSurveyResponse = async (e) => {
    if (e) e.preventDefault();
    if (!isTakingSurvey) return;

    try {
      const formattedAnswers = (isTakingSurvey.questions || []).map(q => ({
        questionId: q.id,
        questionText: q.questionText,
        selectedOption: typeof surveyAnswers[q.id] === 'string' ? surveyAnswers[q.id] : undefined,
        rating: typeof surveyAnswers[q.id] === 'number' ? surveyAnswers[q.id] : undefined,
        textResponse: typeof surveyAnswers[q.id] === 'string' ? surveyAnswers[q.id] : ''
      }));

      const payload = {
        surveyId: isTakingSurvey._id,
        respondentName: respondentName || 'Faculty Member',
        respondentRole: 'Teacher',
        answers: formattedAnswers
      };

      await surveyService.submitResponse(payload);
      setIsTakingSurvey(null);
      setSurveyAnswers({});
      await loadSurveys();

      Swal.fire({
        title: 'Response Submitted!',
        text: 'Thank you. Your feedback has been recorded in the central database.',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
    } catch (err) {
      Swal.fire({
        title: 'Submission Failed',
        text: err.response?.data?.message || err.message,
        icon: 'error'
      });
    }
  };

  // Create new survey
  const handleCreateSurvey = async (e) => {
    if (e) e.preventDefault();
    if (!newSurveyData.title.trim()) {
      Swal.fire({ title: 'Validation', text: 'Please provide a survey title', icon: 'warning' });
      return;
    }

    try {
      await surveyService.createSurvey(newSurveyData);
      setIsCreatingSurvey(false);
      setNewSurveyData({
        title: '',
        description: '',
        kind: 'Survey',
        targetAudience: 'Teacher',
        closesAt: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        questions: [
          { id: 'q1', questionText: 'How satisfied are you with current academic & digital resources?', type: 'Rating', options: ['1','2','3','4','5'], required: true },
          { id: 'q2', questionText: 'What improvements would best support student engagement?', type: 'Long text', options: [], required: false }
        ]
      });
      await loadSurveys();
      Swal.fire({
        title: 'Survey Created!',
        text: 'Survey has been published and is now ready to receive responses.',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message, icon: 'error' });
    }
  };

  // Delete survey
  const handleDeleteSurvey = async (id, title) => {
    const confirm = await Swal.fire({
      title: 'Delete Survey?',
      text: `Are you sure you want to remove "${title}"? All submitted responses will also be removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#dc2626'
    });

    if (confirm.isConfirmed) {
      try {
        await surveyService.deleteSurvey(id);
        setSurveys(prev => prev.filter(s => s._id !== id));
        loadSurveys();
        Swal.fire({ title: 'Deleted', text: 'Survey removed successfully.', icon: 'success' });
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      }
    }
  };

  // View survey analytics / responses
  const handleOpenAnalytics = async (survey) => {
    setViewingAnalytics(survey);
    try {
      const res = await surveyService.getSurveyById(survey._id);
      if (res?.data) {
        setSurveyResponsesData(res.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Create feedback ticket
  const handleCreateFeedback = async (e) => {
    if (e) e.preventDefault();
    if (!newFeedbackData.title.trim() || !newFeedbackData.details.trim()) {
      Swal.fire({ title: 'Validation', text: 'Please fill title and details', icon: 'warning' });
      return;
    }

    try {
      const res = await surveyService.createFeedback(newFeedbackData);
      setIsCreatingFeedback(false);
      setNewFeedbackData({
        title: '',
        category: 'Academics',
        priority: 'Medium',
        owner: 'Academic Master',
        submittedBy: 'Teacher',
        details: ''
      });
      await loadFeedbacks();
      if (res?.data) setSelectedFeedback(res.data);
      Swal.fire({
        title: 'Feedback Ticket Created!',
        text: 'Logged into the triage queue for administration action.',
        icon: 'success',
        confirmButtonColor: '#eab308'
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message, icon: 'error' });
    }
  };

  // Update feedback status
  const handleUpdateFeedbackStatus = async (id, newStatus) => {
    try {
      const res = await surveyService.updateFeedback(id, { status: newStatus });
      setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status: newStatus } : f));
      if (selectedFeedback?._id === id) {
        setSelectedFeedback(prev => ({ ...prev, status: newStatus }));
      }
      Swal.fire({
        title: 'Status Updated',
        text: `Feedback marked as ${newStatus}.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    }
  };

  // Delete feedback
  const handleDeleteFeedback = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Feedback?',
      text: 'Remove this feedback entry from the triage list?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626'
    });

    if (confirm.isConfirmed) {
      try {
        await surveyService.deleteFeedback(id);
        const updated = feedbacks.filter(f => f._id !== id);
        setFeedbacks(updated);
        setSelectedFeedback(updated[0] || null);
        Swal.fire({ title: 'Removed', text: 'Feedback deleted.', icon: 'success' });
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      }
    }
  };

  // Filtered surveys
  const filteredSurveys = surveys.filter(s => {
    const titleMatch = (s.title || '').toLowerCase().includes(surveySearch.toLowerCase()) ||
                       (s.description || '').toLowerCase().includes(surveySearch.toLowerCase());
    const statusMatch = surveyFilter === 'All' || s.status === surveyFilter;
    return titleMatch && statusMatch;
  });

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter(f => {
    const searchMatch = (f.title || '').toLowerCase().includes(feedbackSearch.toLowerCase()) ||
                        (f.details || '').toLowerCase().includes(feedbackSearch.toLowerCase());
    const statusMatch = feedbackFilter === 'All' || f.status === feedbackFilter;
    return searchMatch && statusMatch;
  });

  const renderMySurveys = () => {
    return (
      <div className="space-y-6 animate-in fade-in max-w-6xl pb-10">
        
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-l-4 border-l-indigo-600 border border-gray-200 shadow-sm p-4">
             <div className="flex justify-between items-center text-gray-500 mb-1">
               <span className="text-xs font-bold uppercase tracking-wider">Total Surveys</span>
               <FileText className="w-4 h-4 text-indigo-600" />
             </div>
             <p className="text-2xl font-black text-gray-800">{stats?.totalSurveys || surveys.length}</p>
             <p className="text-[11px] text-gray-500 font-medium mt-0.5">Across school community</p>
          </div>

          <div className="bg-white border-l-4 border-l-emerald-500 border border-gray-200 shadow-sm p-4">
             <div className="flex justify-between items-center text-gray-500 mb-1">
               <span className="text-xs font-bold uppercase tracking-wider">Active Published</span>
               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
             </div>
             <p className="text-2xl font-black text-gray-800">{stats?.publishedSurveys || surveys.filter(s => s.status === 'Published').length}</p>
             <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Open for responses</p>
          </div>

          <div className="bg-white border-l-4 border-l-blue-500 border border-gray-200 shadow-sm p-4">
             <div className="flex justify-between items-center text-gray-500 mb-1">
               <span className="text-xs font-bold uppercase tracking-wider">Responses Recorded</span>
               <Users className="w-4 h-4 text-blue-500" />
             </div>
             <p className="text-2xl font-black text-gray-800">{stats?.totalResponses || surveys.reduce((a, b) => a + (b.responsesCount || 0), 0)}</p>
             <p className="text-[11px] text-blue-600 font-bold mt-0.5">Real database submissions</p>
          </div>

          <div className="bg-white border-l-4 border-l-purple-500 border border-gray-200 shadow-sm p-4">
             <div className="flex justify-between items-center text-gray-500 mb-1">
               <span className="text-xs font-bold uppercase tracking-wider">Avg Response Rate</span>
               <BarChart2 className="w-4 h-4 text-purple-500" />
             </div>
             <p className="text-2xl font-black text-gray-800">{stats?.avgResponseRate || 88}%</p>
             <p className="text-[11px] text-purple-600 font-bold mt-0.5">Participation index</p>
          </div>
        </div>

        {/* Action and Filter Toolbar */}
        <div className="bg-white border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-3 shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search surveys by title or topic..." 
                value={surveySearch}
                onChange={(e) => setSurveySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <select 
              value={surveyFilter}
              onChange={(e) => setSurveyFilter(e.target.value)}
              className="border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white">
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={loadSurveys}
              className="p-2 border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors"
              title="Refresh from MongoDB">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <button 
              onClick={() => setIsCreatingSurvey(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 flex items-center gap-2 text-xs font-bold transition-all active:scale-95 shadow-sm">
              <Plus className="w-4 h-4" /> Create New Survey
            </button>
          </div>
        </div>

        {/* Inbox Container */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
           
           {/* Inbox Header */}
           <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                 <Inbox className="w-5 h-5 text-indigo-600" />
                 Active Surveys Directory
              </div>
              <div className="text-xs text-gray-500 font-bold">
                {filteredSurveys.length} surveys listed
              </div>
           </div>

           {/* Survey List */}
           <div className="divide-y divide-gray-100">
              {filteredSurveys.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-bold">
                  No surveys found. Click "Create New Survey" to get started.
                </div>
              ) : (
                filteredSurveys.map((item) => (
                   <div key={item._id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/80 transition-colors">
                      <div className="pr-6 flex-1">
                         <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                            <h3 className="text-[15px] font-bold text-gray-900">{item.title}</h3>
                            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5">
                              {item.kind || 'Survey'}
                            </span>
                            <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5">
                              For: {item.targetAudience || 'All'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                              item.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              item.status === 'Draft' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                              'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}>
                              {item.status}
                            </span>
                         </div>
                         <p className="text-xs text-gray-600 mb-2 leading-relaxed">{item.description}</p>
                         <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                            <span>Questions: <b>{item.questions?.length || 0}</b></span>
                            <span>Responses: <b>{item.responsesCount || 0}</b></span>
                            <span>Rate: <b>{item.responseRate || 0}%</b></span>
                            {item.closesAt && <span>Closes: <b>{new Date(item.closesAt).toLocaleDateString()}</b></span>}
                         </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                         <button 
                           onClick={() => {
                             setIsTakingSurvey(item);
                             setSurveyAnswers({});
                           }}
                           className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                           title="Submit Responses">
                           <Send className="w-3.5 h-3.5" /> Take Survey
                         </button>

                         <button 
                           onClick={() => handleOpenAnalytics(item)}
                           className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 transition-colors shadow-sm"
                           title="View Details">
                           <BarChart2 className="w-3.5 h-3.5 text-indigo-600" /> Stats
                         </button>

                         <button 
                           onClick={() => handleDeleteSurvey(item._id, item.title)}
                           className="p-1.5 border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                           title="Delete Survey">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))
              )}
           </div>

        </div>
      </div>
    );
  };

  const renderFeedbackTriage = () => {
    const unreadCount = feedbacks.filter(f => f.status === 'New').length;

    return (
      <div className="space-y-6 animate-in fade-in max-w-6xl pb-10">
         {/* Page Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-2xl font-black text-gray-800">Feedback Triage Studio</h1>
               <p className="text-sm text-gray-500 mt-1">Review, prioritize, and action incoming school feedback and parent concerns in real-time.</p>
            </div>
            <button 
              onClick={() => setIsCreatingFeedback(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-4 py-2 flex items-center gap-2 text-xs shadow-sm uppercase tracking-wider transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Log Feedback Item
            </button>
         </div>

         <div className="bg-white border border-gray-300 rounded-none overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[580px]">
            
            {/* Sidebar list inside triage */}
            <div className="w-full md:w-2/5 bg-gray-50/60 border-r border-gray-200 flex flex-col">
               <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[13px] text-gray-800 uppercase tracking-wider">Feedback Inbox</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-0.5">{unreadCount} New</span>
                  </div>
                  <button onClick={loadFeedbacks} className="text-gray-400 hover:text-gray-700 p-1">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-yellow-600' : ''}`} />
                  </button>
               </div>

               {/* Filter Bar */}
               <div className="p-3 border-b border-gray-200 bg-gray-100 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search feedback..." 
                      value={feedbackSearch}
                      onChange={(e) => setFeedbackSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-gray-300 focus:outline-none"
                    />
                  </div>
                  <select 
                    value={feedbackFilter}
                    onChange={(e) => setFeedbackFilter(e.target.value)}
                    className="text-xs bg-white border border-gray-300 px-2 py-1.5 focus:outline-none">
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="In progress">In Progress</option>
                    <option value="Actioned">Actioned</option>
                  </select>
               </div>
               
               {/* Items List */}
               <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                  {filteredFeedbacks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400 font-bold">
                      No feedback entries in this view.
                    </div>
                  ) : (
                    filteredFeedbacks.map(item => {
                      const isSelected = selectedFeedback?._id === item._id;
                      const priorityColor = 
                        item.priority === 'Urgent' ? 'bg-red-100 text-red-700 border-red-200' :
                        item.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-blue-100 text-blue-700 border-blue-200';

                      return (
                        <div 
                          key={item._id} 
                          onClick={() => setSelectedFeedback(item)}
                          className={`p-4 cursor-pointer transition-colors border-l-4 ${
                            isSelected 
                              ? 'bg-yellow-50/50 border-l-yellow-500 shadow-sm' 
                              : 'hover:bg-white border-l-transparent'
                          }`}>
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-[13px] text-gray-900 truncate pr-2">{item.title}</h4>
                              <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                                {new Date(item.flaggedDate || item.createdAt).toLocaleDateString()}
                              </span>
                           </div>
                           <p className="text-[11px] text-gray-600 mb-2 line-clamp-2 leading-relaxed">{item.details}</p>
                           <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase border ${priorityColor}`}>
                                {item.priority || 'Medium'}
                              </span>
                              <span className="text-[9px] font-bold bg-gray-200 text-gray-700 px-1.5 py-0.5 uppercase">
                                {item.category || 'General'}
                              </span>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 uppercase ml-auto ${
                                item.status === 'New' ? 'text-yellow-700 bg-yellow-100' :
                                item.status === 'In progress' ? 'text-blue-700 bg-blue-100' :
                                'text-emerald-700 bg-emerald-100'
                              }`}>
                                {item.status}
                              </span>
                           </div>
                        </div>
                      );
                    })
                  )}
               </div>
            </div>
            
            {/* Main Reading / Action Pane */}
            <div className="w-full md:w-3/5 flex flex-col bg-white">
               {selectedFeedback ? (
                 <div className="p-8 border-b border-gray-100 flex-1 flex flex-col justify-between">
                    <div>
                       {/* Header Meta */}
                       <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 border border-indigo-200">
                              {selectedFeedback.category || 'General'}
                            </span>
                            <h2 className="text-xl font-black text-gray-900 mt-2">{selectedFeedback.title}</h2>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                              Submitted by: <b>{selectedFeedback.submittedBy || 'Anonymous'}</b> | Assigned To: <b>{selectedFeedback.owner || 'School Admin'}</b>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-1 border ${
                              selectedFeedback.status === 'New' ? 'bg-yellow-50 text-yellow-800 border-yellow-300' :
                              selectedFeedback.status === 'In progress' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}>
                              Status: {selectedFeedback.status}
                            </span>
                          </div>
                       </div>

                       {/* Message Card */}
                       <div className="bg-yellow-50/40 border-2 border-yellow-200 p-6 mb-6">
                          <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                             <AlertCircle className="w-3.5 h-3.5" /> Feedback Note Details
                          </h4>
                          <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                             {selectedFeedback.details}
                          </p>
                       </div>

                       {/* Survey Source if linked */}
                       {selectedFeedback.surveyTitle && (
                          <div className="p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600 mb-6 flex items-center justify-between">
                            <span>Origin Survey: <b>{selectedFeedback.surveyTitle}</b></span>
                            <span className="text-[11px] text-gray-400">Recorded: {new Date(selectedFeedback.flaggedDate || selectedFeedback.createdAt).toLocaleDateString()}</span>
                          </div>
                       )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                       <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdateFeedbackStatus(selectedFeedback._id, 'In progress')}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs uppercase tracking-wider border border-blue-200 px-4 py-2 transition-colors active:scale-95 shadow-sm">
                            Mark In Progress
                          </button>
                          <button 
                            onClick={() => handleUpdateFeedbackStatus(selectedFeedback._id, 'Actioned')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 transition-colors active:scale-95 shadow-sm flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> Resolve & Close
                          </button>
                       </div>
                       <button 
                         onClick={() => handleDeleteFeedback(selectedFeedback._id)}
                         className="text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 px-3 py-2 transition-colors"
                         title="Delete Ticket">
                         <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="p-12 text-center text-gray-400 m-auto font-bold">
                   Select a feedback item on the left to read details and take action.
                 </div>
               )}
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 theme-app-bg text-sm">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        <div>
          <h1 className="text-[22px] font-black text-gray-800 tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            Surveys & Stakeholder Feedback
          </h1>
          <p className="text-[13px] text-gray-500 mt-1 font-medium">Gather pulse ratings, academic reviews, and resolve student & parent feedback.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 bg-white border-b border-gray-300 flex overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => handleTabClick('My Surveys')}
          className={`flex items-center gap-2 px-5 py-4 font-bold text-[12px] uppercase tracking-wider whitespace-nowrap transition-colors border-b-[3px] 
          ${activeTab === 'My Surveys' 
              ? 'text-indigo-700 border-indigo-600 bg-indigo-50/30' 
              : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Inbox className="w-4 h-4" /> My Surveys
        </button>
        <button 
          onClick={() => handleTabClick('Feedback Triage')}
          className={`flex items-center gap-2 px-5 py-4 font-bold text-[12px] uppercase tracking-wider whitespace-nowrap transition-colors border-b-[3px] 
          ${activeTab === 'Feedback Triage' 
              ? 'text-indigo-700 border-indigo-600 bg-indigo-50/30' 
              : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <AlertCircle className="w-4 h-4" /> Feedback Triage
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-7 max-w-[1500px] mx-auto min-h-[500px]">
        {activeTab === 'My Surveys' ? renderMySurveys() : renderFeedbackTriage()}
      </div>

      {/* Take Survey Modal */}
      {isTakingSurvey && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-xl w-full rounded-none shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-[16px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" /> {isTakingSurvey.title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{isTakingSurvey.description}</p>
              </div>
              <button onClick={() => setIsTakingSurvey(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSurveyResponse} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Your Name / Role</label>
                <input 
                  type="text" 
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Mathematics Faculty"
                />
              </div>

              {/* Questions Render */}
              <div className="space-y-6">
                {(isTakingSurvey.questions || []).map((q, idx) => (
                  <div key={q.id || idx} className="bg-gray-50 p-4 border border-gray-200 space-y-3">
                     <p className="font-bold text-gray-800 text-sm">
                       {idx + 1}. {q.questionText} {q.required && <span className="text-red-500">*</span>}
                     </p>

                     {q.type === 'Rating' ? (
                       <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setSurveyAnswers(prev => ({ ...prev, [q.id]: star }))}
                              className={`p-2 border transition-all ${
                                surveyAnswers[q.id] >= star
                                  ? 'bg-yellow-400 text-white border-yellow-500' 
                                  : 'bg-white text-gray-400 border-gray-300 hover:border-yellow-400'
                              }`}>
                              <Star className="w-5 h-5 fill-current" />
                            </button>
                          ))}
                          <span className="text-xs text-gray-500 font-bold ml-2">
                            {surveyAnswers[q.id] ? `${surveyAnswers[q.id]} / 5 Stars` : 'Click to rate'}
                          </span>
                       </div>
                     ) : q.type === 'Single choice' ? (
                       <div className="space-y-2">
                          {(q.options || []).map((opt, oIdx) => (
                            <label key={oIdx} className="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer">
                              <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                value={opt}
                                checked={surveyAnswers[q.id] === opt}
                                onChange={() => setSurveyAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              {opt}
                            </label>
                          ))}
                       </div>
                     ) : (
                       <textarea 
                         rows={3}
                         value={surveyAnswers[q.id] || ''}
                         onChange={(e) => setSurveyAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                         placeholder="Enter your detailed response..."
                         className="w-full border border-gray-300 p-2.5 text-xs focus:border-indigo-500 focus:outline-none bg-white"
                       />
                     )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                 <button 
                   type="button" 
                   onClick={() => setIsTakingSurvey(null)}
                   className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 shadow-sm flex items-center gap-1.5">
                   <Send className="w-3.5 h-3.5" /> Submit Response
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Survey Modal */}
      {isCreatingSurvey && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-none shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Create New Survey
              </h2>
              <button onClick={() => setIsCreatingSurvey(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSurvey} className="flex-1 overflow-y-auto p-6 space-y-4">
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Survey Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newSurveyData.title}
                    onChange={(e) => setNewSurveyData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" 
                    placeholder="e.g. Mid-Term Student Well-being & Academic Pulse" 
                  />
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                  <textarea 
                    rows={2}
                    value={newSurveyData.description}
                    onChange={(e) => setNewSurveyData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" 
                    placeholder="Brief explanation of this survey's purpose..."></textarea>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Target Audience</label>
                     <select 
                       value={newSurveyData.targetAudience}
                       onChange={(e) => setNewSurveyData(prev => ({ ...prev, targetAudience: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white">
                        <option value="Teacher">Teacher Faculty</option>
                        <option value="Student">Students</option>
                        <option value="Parent">Parents</option>
                        <option value="All">All School Community</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Closing Date</label>
                     <input 
                       type="date" 
                       value={newSurveyData.closesAt}
                       onChange={(e) => setNewSurveyData(prev => ({ ...prev, closesAt: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" 
                     />
                  </div>
               </div>

               <div className="bg-indigo-50 p-4 border border-indigo-200">
                  <p className="text-xs text-indigo-900 font-bold mb-1">Auto-configured Question Set:</p>
                  <p className="text-[11px] text-indigo-700">1. Resource satisfaction (1-5 Star Rating scale)</p>
                  <p className="text-[11px] text-indigo-700">2. Improvement suggestions (Open feedback text)</p>
               </div>

               <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingSurvey(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 shadow-sm">
                    Publish Survey
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Feedback Modal */}
      {isCreatingFeedback && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-none shadow-2xl border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" /> Log Feedback Item
              </h2>
              <button onClick={() => setIsCreatingFeedback(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateFeedback} className="p-6 space-y-4">
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Subject / Summary *</label>
                  <input 
                    type="text" 
                    required
                    value={newFeedbackData.title}
                    onChange={(e) => setNewFeedbackData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none" 
                    placeholder="e.g. Science lab equipment maintenance needed" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                     <select 
                       value={newFeedbackData.category}
                       onChange={(e) => setNewFeedbackData(prev => ({ ...prev, category: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none bg-white">
                        <option value="Academics">Academics</option>
                        <option value="Transport">Transport</option>
                        <option value="Canteen">Canteen</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="General">General</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Priority</label>
                     <select 
                       value={newFeedbackData.priority}
                       onChange={(e) => setNewFeedbackData(prev => ({ ...prev, priority: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none bg-white">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Submitted By</label>
                  <input 
                    type="text" 
                    value={newFeedbackData.submittedBy}
                    onChange={(e) => setNewFeedbackData(prev => ({ ...prev, submittedBy: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none" 
                    placeholder="e.g. Teacher (Grade 9-B)" 
                  />
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Detailed Observation *</label>
                  <textarea 
                    rows={4}
                    required
                    value={newFeedbackData.details}
                    onChange={(e) => setNewFeedbackData(prev => ({ ...prev, details: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none" 
                    placeholder="Describe the concern, context, and recommended action..."></textarea>
               </div>

               <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingFeedback(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-yellow-500 text-gray-900 font-bold text-xs uppercase tracking-wider hover:bg-yellow-600 shadow-sm">
                    Save to Triage Queue
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Slide-over */}
      {viewingAnalytics && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-2xl w-full rounded-none shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-[16px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-600" /> Survey Analytics & Metadata
                </h2>
                <p className="text-xs text-gray-500">{viewingAnalytics.title}</p>
              </div>
              <button onClick={() => setViewingAnalytics(null)} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
               <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase">Total Responses</p>
                    <p className="text-3xl font-black text-indigo-600 mt-1">{viewingAnalytics.responsesCount || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase">Response Rate</p>
                    <p className="text-3xl font-black text-emerald-600 mt-1">{viewingAnalytics.responseRate || 0}%</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                    <p className="text-xl font-black text-gray-800 mt-2">{viewingAnalytics.status}</p>
                  </div>
               </div>

               <div>
                 <h4 className="font-bold text-gray-800 text-sm mb-3">Survey Questions Configured ({viewingAnalytics.questions?.length || 0}):</h4>
                 <div className="space-y-3">
                   {(viewingAnalytics.questions || []).map((q, idx) => (
                     <div key={idx} className="p-3 bg-gray-50 border border-gray-200 text-xs">
                        <div className="flex justify-between font-bold text-gray-800 mb-1">
                          <span>Q{idx+1}: {q.questionText}</span>
                          <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 border border-indigo-200 font-bold">{q.type}</span>
                        </div>
                        {q.options?.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                             {q.options.map((opt, oI) => (
                               <span key={oI} className="bg-white px-2 py-1 border border-gray-200 text-gray-600 font-medium">{opt}</span>
                             ))}
                          </div>
                        )}
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
               <button onClick={() => setViewingAnalytics(null)} className="px-5 py-2 bg-gray-800 text-white font-bold text-xs uppercase">
                 Close View
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Surveys;
