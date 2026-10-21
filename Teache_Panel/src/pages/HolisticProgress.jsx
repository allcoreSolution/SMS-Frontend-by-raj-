import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, LayoutDashboard, Target, Users, BookOpen, Sparkles, 
  Filter, Download, Plus, ChevronRight, BarChart2, Accessibility, 
  CheckCircle, HelpCircle, Palette, List, ChevronDown, X, Trash2, 
  Printer, Edit3, Award, Star, RefreshCw, Search, Check, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import hpcService from '../api/hpcService';

const HolisticProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Active Tab
  const getActiveTab = () => {
    if (location.pathname.includes('activities')) return 'activities';
    if (location.pathname.includes('progress-cards')) return 'cards';
    return 'dashboard';
  };
  const activeTab = getActiveTab();

  // Data States
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [cards, setCards] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [cardClassFilter, setCardClassFilter] = useState('All');
  const [cardStatusFilter, setCardStatusFilter] = useState('All');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');
  const [activityClassFilter, setActivityClassFilter] = useState('All');

  // Modals
  const [isCreatingCards, setIsCreatingCards] = useState(false);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [evaluatingCard, setEvaluatingCard] = useState(null);
  const [printingCard, setPrintingCard] = useState(null);

  // Batch Generation Form
  const [batchForm, setBatchForm] = useState({
    className: 'Class VI',
    section: 'A',
    term: 'Term 1',
    templateVersion: 'HPC Standard v2.0 (Latest)',
    academicYear: '2026-2027'
  });

  // New Activity Form
  const [activityForm, setActivityForm] = useState({
    title: '',
    type: 'Project',
    className: 'Class VI',
    section: 'A',
    subject: 'Experiential Science',
    abilityFocus: 'Creativity',
    description: '',
    totalLearnersCount: 30
  });

  // Handle Tab Changing via React Router
  const handleTabChange = (tabName) => {
    if (tabName === 'dashboard') navigate('/hpc-dashboard');
    if (tabName === 'activities') navigate('/hpc-activities');
    if (tabName === 'cards') navigate('/progress-cards');
  };

  // Load All Data from Backend
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, activitiesRes, cardsRes, classesRes] = await Promise.all([
        hpcService.getStats(),
        hpcService.getActivities(),
        hpcService.getCards(),
        hpcService.getClasses()
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (activitiesRes?.data) setActivities(activitiesRes.data);
      if (cardsRes?.data) setCards(cardsRes.data);
      if (classesRes?.data) setClassesList(classesRes.data);
    } catch (err) {
      console.error('Failed to load HPC data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter Cards when filter changes
  const loadFilteredCards = async () => {
    try {
      const params = {};
      if (cardClassFilter !== 'All') params.className = cardClassFilter;
      if (cardStatusFilter !== 'All') params.status = cardStatusFilter;
      const res = await hpcService.getCards(params);
      if (res?.data) setCards(res.data);
    } catch (err) {
      console.error('Filter cards error:', err);
    }
  };

  useEffect(() => {
    loadFilteredCards();
  }, [cardClassFilter, cardStatusFilter]);

  // Batch Generate Cards
  const handleBatchGenerateCards = async (e) => {
    if (e) e.preventDefault();
    if (!batchForm.className) {
      Swal.fire({ title: 'Validation', text: 'Please select a class', icon: 'warning' });
      return;
    }

    try {
      const res = await hpcService.createCardsForClass(batchForm);
      setIsCreatingCards(false);
      await loadInitialData();
      Swal.fire({
        title: 'Cards Generated!',
        text: res.message || `Holistic Progress Cards created for ${batchForm.className} learners.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
      handleTabChange('cards');
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message, icon: 'error' });
    }
  };

  // Create Activity
  const handleCreateActivity = async (e) => {
    if (e) e.preventDefault();
    if (!activityForm.title.trim()) {
      Swal.fire({ title: 'Validation', text: 'Please provide activity title', icon: 'warning' });
      return;
    }

    try {
      await hpcService.createActivity(activityForm);
      setIsCreatingActivity(false);
      setActivityForm({
        title: '',
        type: 'Project',
        className: 'Class VI',
        section: 'A',
        subject: 'Experiential Science',
        abilityFocus: 'Creativity',
        description: '',
        totalLearnersCount: 30
      });
      const [actRes, statsRes] = await Promise.all([
        hpcService.getActivities(),
        hpcService.getStats()
      ]);
      if (actRes?.data) setActivities(actRes.data);
      if (statsRes?.data) setStats(statsRes.data);

      Swal.fire({
        title: 'Activity Registered!',
        text: 'Classroom activity is now ready for learner evaluation.',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message, icon: 'error' });
    }
  };

  // Delete Activity
  const handleDeleteActivity = async (id, title) => {
    const confirm = await Swal.fire({
      title: 'Remove Activity?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#dc2626'
    });

    if (confirm.isConfirmed) {
      try {
        await hpcService.deleteActivity(id);
        setActivities(prev => prev.filter(a => a._id !== id));
        hpcService.getStats().then(s => s?.data && setStats(s.data));
        Swal.fire({ title: 'Deleted', text: 'Activity removed.', icon: 'success' });
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      }
    }
  };

  // Save Card Evaluation
  const handleSaveEvaluation = async (e) => {
    if (e) e.preventDefault();
    if (!evaluatingCard) return;

    try {
      const res = await hpcService.updateCard(evaluatingCard._id, evaluatingCard);
      if (res?.data) {
        setCards(prev => prev.map(c => c._id === evaluatingCard._id ? res.data : c));
      }
      setEvaluatingCard(null);
      await hpcService.getStats().then(s => s?.data && setStats(s.data));

      Swal.fire({
        title: 'Evaluation Saved!',
        text: `HPC assessment updated for ${evaluatingCard.studentName}.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message, icon: 'error' });
    }
  };

  // Delete Progress Card
  const handleDeleteCard = async (id, name) => {
    const confirm = await Swal.fire({
      title: 'Delete Progress Card?',
      text: `Are you sure you want to remove ${name}'s progress card?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626'
    });

    if (confirm.isConfirmed) {
      try {
        await hpcService.deleteCard(id);
        setCards(prev => prev.filter(c => c._id !== id));
        hpcService.getStats().then(s => s?.data && setStats(s.data));
        Swal.fire({ title: 'Deleted', text: 'Card removed.', icon: 'success' });
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      }
    }
  };

  // Filtered Activities
  const filteredActivities = activities.filter(a => {
    const typeMatch = activityTypeFilter === 'All' || a.type === activityTypeFilter;
    const classMatch = activityClassFilter === 'All' || a.className === activityClassFilter;
    return typeMatch && classMatch;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 theme-app-bg text-sm">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-[24px] font-black text-gray-800 tracking-tight flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center shadow-sm">
                  <Accessibility className="w-4 h-4 text-white" />
                </div>
                Holistic Progress Card (HPC) Studio
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-medium">NEP 2020 360-degree multidimensional assessment across Awareness, Sensitivity & Creativity.</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={loadInitialData}
                className="p-2 border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors"
                title="Refresh from MongoDB">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
              <button 
                onClick={() => setIsCreatingCards(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                <Plus className="w-4 h-4" /> Create Cards
              </button>
            </div>
          </div>
          
          <div className="flex px-1 space-x-6 border-b border-gray-200">
             <button 
               onClick={() => handleTabChange('dashboard')}
               className={`pb-3 text-[14px] font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'dashboard' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
               <LayoutDashboard className="w-4 h-4" /> HPC Dashboard
             </button>
             <button 
               onClick={() => handleTabChange('activities')}
               className={`pb-3 text-[14px] font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'activities' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
               <Target className="w-4 h-4" /> HPC Activities ({activities.length})
             </button>
             <button 
               onClick={() => handleTabChange('cards')}
               className={`pb-3 text-[14px] font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'cards' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
               <FileText className="w-4 h-4" /> Progress Cards ({cards.length})
             </button>
          </div>
        </div>

        {/* Tab 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
           <div className="space-y-8 animate-in fade-in">
              
              {/* Vibrant Banner */}
              <div className="bg-gradient-to-r from-[#4f46e5] via-[#8b5cf6] to-[#d946ef] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-none text-white shadow-sm relative overflow-hidden">
                 <div className="flex items-center gap-4 z-10">
                    <div className="bg-white/20 p-2.5 rounded-none">
                       <Accessibility className="w-6 h-6" />
                    </div>
                    <div>
                       <h2 className="text-[22px] font-black tracking-tight">Holistic Progress Card (HPC)</h2>
                       <p className="text-white/80 font-medium text-[13px] mt-1">A whole-child report — the three abilities, no marks or grades</p>
                    </div>
                 </div>
                 <button onClick={() => handleTabChange('cards')} className="mt-4 sm:mt-0 bg-white text-[#d946ef] font-bold text-[13px] px-4 py-2.5 rounded-none flex items-center gap-2 shadow-sm focus:outline-none hover:bg-gray-50 transition-colors z-10 active:scale-95">
                    <FileText className="w-4 h-4" /> View Progress Cards ({cards.length})
                 </button>
                 <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              </div>

              {/* How it works */}
              <div>
                 <h3 className="text-[14px] font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <span className="text-indigo-600"><CheckCircle className="w-4 h-4" /></span> How it works — your 3 steps
                 </h3>
                 <div className="space-y-3">
                    <div className="bg-white border border-indigo-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none shadow-sm hover:border-indigo-400 transition-colors">
                       <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 shrink-0 bg-indigo-50 text-indigo-600 font-black text-[14px] flex items-center justify-center rounded-none border border-indigo-100">1</div>
                          <div>
                             <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-800 text-[15px]">Create cards for a class</h4>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider">Start here</span>
                             </div>
                             <p className="text-gray-500 font-medium text-[13px] mt-1">One click makes a card for every learner in the class.</p>
                          </div>
                       </div>
                       <button onClick={() => setIsCreatingCards(true)} className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-[13px] font-bold rounded-none flex items-center gap-2 transition-colors active:scale-95">
                          Create cards <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="bg-white border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none shadow-sm hover:border-gray-300 transition-colors">
                       <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 shrink-0 bg-gray-50 text-gray-500 font-black text-[14px] flex items-center justify-center rounded-none border border-gray-200">2</div>
                          <div>
                             <h4 className="font-bold text-gray-800 text-[15px]">Fill in the parts & Observe Activities</h4>
                             <p className="text-gray-500 font-medium text-[13px] mt-1">Review Awareness, Sensitivity, and Creativity descriptors with zero marks or rank pressure.</p>
                          </div>
                       </div>
                       <button onClick={() => handleTabChange('activities')} className="shrink-0 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2 text-[13px] font-bold rounded-none flex items-center gap-2 transition-colors active:scale-95">
                          View Activities <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="bg-white border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none shadow-sm hover:border-gray-300 transition-colors">
                       <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 shrink-0 bg-gray-50 text-gray-500 font-black text-[14px] flex items-center justify-center rounded-none border border-gray-200">3</div>
                          <div>
                             <h4 className="font-bold text-gray-800 text-[15px]">Review, publish & print official report</h4>
                             <p className="text-gray-500 font-medium text-[13px] mt-1">Publish to student portal and print the official card for government inspection or parent sharing.</p>
                          </div>
                       </div>
                       <button onClick={() => handleTabChange('cards')} className="shrink-0 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2 text-[13px] font-bold rounded-none flex items-center gap-2 transition-colors active:scale-95">
                          Progress Cards <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Dynamic KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-white border border-indigo-200 p-4 rounded-none shadow-sm flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#8b5cf6] text-white rounded-[4px] flex justify-center items-center shrink-0">
                       <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-indigo-900">{stats?.editionsAdopted || 2}</h3>
                       <p className="text-gray-800 font-bold text-[12px]">Editions adopted</p>
                    </div>
                 </div>

                 <div className="bg-white border border-blue-200 p-4 rounded-none shadow-sm flex gap-4 items-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-[4px] flex justify-center items-center shrink-0">
                       <Users className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-blue-900 flex items-center gap-2">
                         {stats?.classesOnEdition || 1} <span className="text-[12px] font-bold text-gray-800">Classes on edition</span>
                       </h3>
                       <p className="text-gray-400 font-bold text-[11px]">{stats?.classesUnassigned || 14} not yet assigned</p>
                    </div>
                 </div>

                 <div className="bg-white border border-green-200 p-4 rounded-none shadow-sm flex gap-4 items-center">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-[4px] flex justify-center items-center shrink-0">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-green-900 flex items-center gap-2">
                         {stats?.totalCards || cards.length} <span className="text-[12px] font-bold text-gray-800">Cards registered</span>
                       </h3>
                       <p className="text-emerald-600 font-bold text-[11px]">
                         {stats?.publishedCards || cards.filter(c => c.status === 'Ready to Print').length} ready - {stats?.draftCards || cards.filter(c => c.status !== 'Ready to Print').length} draft
                       </p>
                    </div>
                 </div>

                 <div className="bg-white border border-orange-200 p-4 rounded-none shadow-sm flex gap-4 items-center">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-[4px] flex justify-center items-center shrink-0">
                       <Target className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-orange-900 flex items-center gap-2">
                         {stats?.totalActivities || activities.length} <span className="text-[12px] font-bold text-gray-800">Activities set up</span>
                       </h3>
                       <p className="text-orange-600 font-bold text-[11px]">{stats?.activeActivities || activities.length} currently active</p>
                    </div>
                 </div>
              </div>

              {/* What the card is */}
              <div>
                 <h3 className="text-[14px] font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <span className="text-gray-400"><HelpCircle className="w-4 h-4" /></span> What the card is
                 </h3>
                 <p className="text-[13px] text-gray-700 font-medium leading-relaxed bg-white border border-gray-200 p-5 rounded-none shadow-sm">
                    The Holistic Progress Card describes how a child is growing across three core developmental abilities — <strong className="text-blue-600">Awareness</strong>, <strong className="text-pink-600">Sensitivity</strong> and <strong className="text-orange-500">Creativity</strong> — with <strong>no marks, grades or percentages</strong>, by design. Every card has <strong>two printouts</strong>: the plain <em>official</em> card that matches the government form for inspection, and a warm, school-branded <em>colour</em> card the teacher prints for the family.
                 </p>
              </div>

           </div>
        )}

        {/* Tab 2: ACTIVITIES */}
        {activeTab === 'activities' && (
           <div className="space-y-6 animate-in fade-in">
              {/* Vibrant Banner */}
              <div className="bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#f43f5e] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-none text-white shadow-sm relative overflow-hidden">
                 <div className="flex items-center gap-4 z-10">
                    <div className="bg-white/20 p-2.5 rounded-none">
                       <Palette className="w-6 h-6" />
                    </div>
                    <div>
                       <h2 className="text-[22px] font-black tracking-tight">Experiential Classroom Activities</h2>
                       <p className="text-white/90 font-medium text-[13px] mt-1">The practical tasks and collaborative inquiries learners are observed on</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsCreatingActivity(true)} 
                   className="mt-4 sm:mt-0 bg-white text-purple-700 font-bold text-[13px] px-4 py-2.5 rounded-none flex items-center gap-2 shadow-sm focus:outline-none hover:bg-gray-50 transition-colors z-10 active:scale-95">
                    <Plus className="w-4 h-4" /> Add Activity
                 </button>
                 <div className="absolute left-[80%] bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>

              {/* Table Area */}
              <div className="bg-white border border-gray-300 rounded-none shadow-sm flex flex-col min-h-[400px]">
                 <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                       <List className="w-4 h-4 text-indigo-700" />
                       <h2 className="font-black text-gray-900 text-[14px]">Activities Directory</h2>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs px-2.5 py-0.5">
                      {filteredActivities.length} registered
                    </span>
                 </div>
                 
                 {/* Filters */}
                 <div className="p-4 border-b border-gray-200 bg-white flex flex-wrap gap-3">
                    <select 
                      value={activityTypeFilter}
                      onChange={(e) => setActivityTypeFilter(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-700 py-2 px-3 text-xs font-bold focus:outline-none">
                       <option value="All">All Types</option>
                       <option value="Project">Project</option>
                       <option value="Observation">Observation</option>
                       <option value="Group Discussion">Group Discussion</option>
                       <option value="Inquiry">Inquiry</option>
                    </select>

                    <select 
                      value={activityClassFilter}
                      onChange={(e) => setActivityClassFilter(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-700 py-2 px-3 text-xs font-bold focus:outline-none">
                       <option value="All">All Classes</option>
                       <option value="Class VI">Class VI</option>
                       <option value="Class VII">Class VII</option>
                       <option value="Class X">Class X</option>
                    </select>
                 </div>

                 {/* Table */}
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-black text-gray-600 uppercase tracking-wider h-11">
                             <th className="px-5 py-2.5 border-r border-gray-200">Activity Title & Description</th>
                             <th className="px-5 py-2.5 border-r border-gray-200 text-center">Type</th>
                             <th className="px-5 py-2.5 border-r border-gray-200 text-center">Class / Section</th>
                             <th className="px-5 py-2.5 border-r border-gray-200 text-center">Domain Focus</th>
                             <th className="px-5 py-2.5 border-r border-gray-200 text-center">Assessed Learners</th>
                             <th className="px-5 py-2.5 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-200 text-xs">
                          {filteredActivities.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">
                                No activities found matching filter.
                              </td>
                            </tr>
                          ) : (
                            filteredActivities.map((act) => (
                              <tr key={act._id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-5 py-3.5 border-r border-gray-200">
                                    <h4 className="font-bold text-gray-900 text-[13px]">{act.title}</h4>
                                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">{act.description}</p>
                                    <span className="text-[10px] text-indigo-600 font-bold">Subject: {act.subject}</span>
                                 </td>
                                 <td className="px-5 py-3.5 text-center border-r border-gray-200">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[11px]">
                                       {act.type}
                                    </span>
                                 </td>
                                 <td className="px-5 py-3.5 text-center border-r border-gray-200 font-bold text-gray-800">
                                    {act.className} - {act.section}
                                 </td>
                                 <td className="px-5 py-3.5 text-center border-r border-gray-200">
                                    <span className={`px-2 py-0.5 font-bold border text-[10px] uppercase ${
                                       act.abilityFocus === 'Creativity' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                       act.abilityFocus === 'Awareness' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                       'bg-pink-50 text-pink-700 border-pink-200'
                                    }`}>
                                       {act.abilityFocus}
                                    </span>
                                 </td>
                                 <td className="px-5 py-3.5 text-center border-r border-gray-200">
                                    <div className="font-bold text-gray-800 mb-1">{act.assessedLearnersCount} / {act.totalLearnersCount}</div>
                                    <div className="w-24 h-1.5 bg-gray-200 mx-auto rounded-full overflow-hidden">
                                       <div 
                                         className="h-full bg-emerald-500" 
                                         style={{ width: `${Math.round((act.assessedLearnersCount / (act.totalLearnersCount || 30)) * 100)}%` }}
                                       ></div>
                                    </div>
                                 </td>
                                 <td className="px-5 py-3.5 text-right">
                                    <button 
                                      onClick={() => handleDeleteActivity(act._id, act.title)}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-300 transition-colors"
                                      title="Delete Activity">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                 </td>
                              </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {/* Tab 3: PROGRESS CARDS */}
        {activeTab === 'cards' && (
           <div className="space-y-6 animate-in fade-in">
              {/* Vibrant Banner */}
              <div className="bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#f43f5e] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-none text-white shadow-sm relative overflow-hidden">
                 <div className="flex items-center gap-4 z-10">
                    <div className="bg-white/20 p-2.5 rounded-none">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div>
                       <h2 className="text-[22px] font-black tracking-tight">Learner Progress Cards Registry</h2>
                       <p className="text-white/90 font-medium text-[13px] mt-1">Multi-domain evaluations, parental reviews, and official NEP card exports</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsCreatingCards(true)} 
                   className="mt-4 sm:mt-0 bg-white text-purple-700 font-bold text-[13px] px-4 py-2.5 rounded-none flex items-center gap-2 shadow-sm focus:outline-none hover:bg-gray-50 transition-colors z-10 active:scale-95">
                    <Plus className="w-4 h-4" /> Batch Generate Cards
                 </button>
                 <div className="absolute left-[80%] bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>

              {/* Table Area */}
              <div className="bg-white border border-gray-300 rounded-none shadow-sm min-h-[500px]">
                 <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                       <FileText className="w-4 h-4 text-indigo-700" />
                       <h2 className="font-black text-gray-900 text-[14px]">Student Progress Cards ({cards.length})</h2>
                    </div>
                 </div>
                 
                 <div className="p-6">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                       <div className="w-full sm:w-64">
                           <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Filter by Class</label>
                           <select 
                             value={cardClassFilter}
                             onChange={(e) => setCardClassFilter(e.target.value)}
                             className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-3 text-xs font-bold focus:border-indigo-500 focus:outline-none">
                              <option value="All">All Classes</option>
                              {classesList.map(c => (
                                <option key={c._id} value={c.className}>{c.className}</option>
                              ))}
                              <option value="Class VI">Class VI</option>
                              <option value="Class VII">Class VII</option>
                           </select>
                       </div>
                       
                       <div className="w-full sm:w-64">
                           <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Filter by Status</label>
                           <select 
                             value={cardStatusFilter}
                             onChange={(e) => setCardStatusFilter(e.target.value)}
                             className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-3 text-xs font-bold focus:border-indigo-500 focus:outline-none">
                              <option value="All">All Statuses</option>
                              <option value="Ready to Print">Ready to Print</option>
                              <option value="Pending Evaluation">Pending Evaluation</option>
                              <option value="Reviewing Draft">Reviewing Draft</option>
                           </select>
                       </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-gray-200">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-black text-indigo-700 uppercase tracking-wider h-11">
                                <th className="px-5 py-2.5 border-r border-gray-200">Student & Roll No</th>
                                <th className="px-5 py-2.5 border-r border-gray-200 text-center">Class / Term</th>
                                <th className="px-5 py-2.5 border-r border-gray-200 text-center">Awareness</th>
                                <th className="px-5 py-2.5 border-r border-gray-200 text-center">Sensitivity</th>
                                <th className="px-5 py-2.5 border-r border-gray-200 text-center">Creativity</th>
                                <th className="px-5 py-2.5 border-r border-gray-200 text-center">Status</th>
                                <th className="px-5 py-2.5 text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs">
                             {cards.length === 0 ? (
                               <tr>
                                 <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-bold">
                                   No cards found. Click "Batch Generate Cards" to create for a class.
                                 </td>
                               </tr>
                             ) : (
                               cards.map((student) => {
                                  const isReady = student.status === 'Ready to Print' || student.status === 'Published';
                                  return (
                                     <tr key={student._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-5 py-3.5 border-r border-gray-200">
                                           <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-xs border border-indigo-200">
                                                 {student.studentName.charAt(0)}
                                              </div>
                                              <div>
                                                 <h4 className="font-bold text-gray-900 text-[13px]">{student.studentName}</h4>
                                                 <p className="text-[11px] text-gray-500 font-medium">Roll: {student.rollNo}</p>
                                              </div>
                                           </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-center border-r border-gray-200 font-bold text-gray-700">
                                           {student.className} - {student.section} ({student.term})
                                        </td>
                                        <td className="px-5 py-3.5 text-center border-r border-gray-200">
                                           <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                                             {student.awareness?.level || 'Developing'} ({student.awareness?.scorePercent || 75}%)
                                           </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center border-r border-gray-200">
                                           <span className="px-2 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-bold">
                                             {student.sensitivity?.level || 'Developing'} ({student.sensitivity?.scorePercent || 70}%)
                                           </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center border-r border-gray-200">
                                           <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold">
                                             {student.creativity?.level || 'Proficient'} ({student.creativity?.scorePercent || 85}%)
                                           </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center border-r border-gray-200">
                                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                              isReady ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                           }`}>
                                              <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></div> 
                                              {student.status}
                                           </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                           <div className="flex justify-end items-center gap-2">
                                              <button 
                                                 onClick={() => setEvaluatingCard(student)}
                                                 className="px-2.5 py-1 text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 font-bold text-[11px] uppercase transition-colors"
                                                 title="Evaluate 3 Domains">
                                                 <Edit3 className="w-3 h-3 inline mr-1" /> Review
                                              </button>
                                              <button 
                                                 onClick={() => setPrintingCard(student)}
                                                 className="p-1 text-gray-500 hover:text-indigo-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                                                 title="Print / View Official Card">
                                                 <Printer className="w-3.5 h-3.5" />
                                              </button>
                                              <button 
                                                 onClick={() => handleDeleteCard(student._id, student.studentName)}
                                                 className="p-1 text-gray-400 hover:text-red-600 border border-gray-200 hover:bg-red-50 transition-colors"
                                                 title="Delete Card">
                                                 <Trash2 className="w-3.5 h-3.5" />
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
              </div>
           </div>
        )}

      </div>
      
      {/* Modal 1: BATCH GENERATE CARDS */}
      {isCreatingCards && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white max-w-lg w-full rounded-none shadow-2xl border-t-4 border-indigo-600 flex flex-col">
               <div className="px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-200">
                  <h2 className="font-black text-gray-800 text-[15px] uppercase tracking-tight flex items-center gap-2">
                     <FileText className="w-4 h-4 text-indigo-600" /> Generate Class Progress Cards
                  </h2>
                  <button onClick={() => setIsCreatingCards(false)} className="text-gray-400 hover:text-red-500">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               <form onSubmit={handleBatchGenerateCards} className="p-6 space-y-4">
                  <p className="text-gray-500 text-xs font-medium">Select a class to generate holistic progress cards for all enrolled learners in MongoDB.</p>
                  
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Target Class *</label>
                     <select 
                       value={batchForm.className}
                       onChange={(e) => setBatchForm(prev => ({ ...prev, className: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm font-bold focus:border-indigo-500 focus:outline-none bg-white">
                        {classesList.map(c => (
                          <option key={c._id} value={c.className}>{c.className}</option>
                        ))}
                        <option value="Class VI">Class VI</option>
                        <option value="Class VII">Class VII</option>
                        <option value="Class X">Class X</option>
                     </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Section</label>
                        <input 
                          type="text" 
                          value={batchForm.section}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, section: e.target.value }))}
                          className="w-full border-2 border-gray-300 px-3 py-2 text-sm font-bold focus:border-indigo-500 focus:outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Evaluation Term</label>
                        <select 
                          value={batchForm.term}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, term: e.target.value }))}
                          className="w-full border-2 border-gray-300 px-3 py-2 text-sm font-bold focus:border-indigo-500 focus:outline-none bg-white">
                           <option value="Term 1">Term 1</option>
                           <option value="Term 2">Term 2</option>
                           <option value="Annual Final">Annual Final</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">HPC Template Framework</label>
                     <select 
                       value={batchForm.templateVersion}
                       onChange={(e) => setBatchForm(prev => ({ ...prev, templateVersion: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm font-bold focus:border-indigo-500 focus:outline-none bg-white">
                        <option value="HPC Standard v2.0 (Latest)">NEP 2020 Standard v2.0 (Three Abilities: Awareness, Sensitivity, Creativity)</option>
                        <option value="HPC Legacy v1.4">HPC Legacy v1.4 (CBSE Standard)</option>
                     </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                     <button 
                       type="button" 
                       onClick={() => setIsCreatingCards(false)}
                       className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                       Cancel
                     </button>
                     <button 
                       type="submit"
                       className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                       Generate Cards <ChevronRight className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Modal 2: CREATE NEW ACTIVITY */}
      {isCreatingActivity && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white max-w-lg w-full rounded-none shadow-2xl border-t-4 border-purple-600 flex flex-col">
               <div className="px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-200">
                  <h2 className="font-black text-gray-800 text-[15px] uppercase tracking-tight flex items-center gap-2">
                     <Target className="w-4 h-4 text-purple-600" /> Register Classroom Activity
                  </h2>
                  <button onClick={() => setIsCreatingActivity(false)} className="text-gray-400 hover:text-red-500">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               <form onSubmit={handleCreateActivity} className="p-6 space-y-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Activity Title *</label>
                     <input 
                       type="text" 
                       required
                       value={activityForm.title}
                       onChange={(e) => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
                       placeholder="e.g. Environmental Biodiversity Field Journal"
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Task Type</label>
                        <select 
                          value={activityForm.type}
                          onChange={(e) => setActivityForm(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white">
                           <option value="Project">Project</option>
                           <option value="Observation">Observation</option>
                           <option value="Group Discussion">Group Discussion</option>
                           <option value="Inquiry">Inquiry</option>
                           <option value="Classroom Presentation">Classroom Presentation</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Domain Focus</label>
                        <select 
                          value={activityForm.abilityFocus}
                          onChange={(e) => setActivityForm(prev => ({ ...prev, abilityFocus: e.target.value }))}
                          className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white">
                           <option value="Awareness">Awareness (Physical & Cognitive)</option>
                           <option value="Sensitivity">Sensitivity (Socio-Emotional & Empathy)</option>
                           <option value="Creativity">Creativity (Divergent Thinking & Arts)</option>
                           <option value="All Domains">All 3 Domains</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Class</label>
                        <select 
                          value={activityForm.className}
                          onChange={(e) => setActivityForm(prev => ({ ...prev, className: e.target.value }))}
                          className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white">
                           {classesList.map(c => (
                             <option key={c._id} value={c.className}>{c.className}</option>
                           ))}
                           <option value="Class VI">Class VI</option>
                           <option value="Class VII">Class VII</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Learners Count</label>
                        <input 
                          type="number" 
                          value={activityForm.totalLearnersCount}
                          onChange={(e) => setActivityForm(prev => ({ ...prev, totalLearnersCount: Number(e.target.value) }))}
                          className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Task Instructions / Description</label>
                     <textarea 
                       rows={3}
                       value={activityForm.description}
                       onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                       placeholder="Explain what learners are expected to do..."
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"></textarea>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                     <button 
                       type="button" 
                       onClick={() => setIsCreatingActivity(false)}
                       className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                       Cancel
                     </button>
                     <button 
                       type="submit"
                       className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm">
                       Save Activity
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Modal 3: REVIEW & EVALUATE STUDENT HPC (3 DOMAINS) */}
      {evaluatingCard && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white max-w-3xl w-full rounded-none shadow-2xl border-t-4 border-indigo-600 flex flex-col max-h-[90vh]">
               <div className="px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-200">
                  <div>
                    <h2 className="font-black text-gray-900 text-[16px] uppercase tracking-tight flex items-center gap-2">
                       <Award className="w-5 h-5 text-indigo-600" /> Evaluate Learner: {evaluatingCard.studentName}
                    </h2>
                    <p className="text-xs text-gray-500">Roll: {evaluatingCard.rollNo} | {evaluatingCard.className} - {evaluatingCard.section} ({evaluatingCard.term})</p>
                  </div>
                  <button onClick={() => setEvaluatingCard(null)} className="text-gray-400 hover:text-red-500">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               <form onSubmit={handleSaveEvaluation} className="p-6 overflow-y-auto space-y-6">
                  
                  {/* Domain 1: AWARENESS */}
                  <div className="bg-blue-50/50 p-4 border border-blue-200 space-y-3">
                     <div className="flex justify-between items-center">
                        <h4 className="font-black text-blue-900 text-sm flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> 1. Ability to Be Aware (Physical & Cognitive)
                        </h4>
                        <select 
                          value={evaluatingCard.awareness?.level || 'Developing'}
                          onChange={(e) => setEvaluatingCard(prev => ({
                            ...prev,
                            awareness: { ...prev.awareness, level: e.target.value }
                          }))}
                          className="bg-white border border-blue-300 text-xs font-bold text-blue-900 px-2 py-1">
                           <option value="Beginning">Beginning</option>
                           <option value="Developing">Developing</option>
                           <option value="Proficient">Proficient</option>
                           <option value="Exemplary">Exemplary</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-blue-800 uppercase mb-1">Teacher Observation Remarks</label>
                        <input 
                          type="text" 
                          value={evaluatingCard.awareness?.teacherRemarks || ''}
                          onChange={(e) => setEvaluatingCard(prev => ({
                            ...prev,
                            awareness: { ...prev.awareness, teacherRemarks: e.target.value }
                          }))}
                          className="w-full bg-white border border-blue-300 px-3 py-1.5 text-xs focus:outline-none"
                          placeholder="e.g. Shows acute observation and personal hygiene routines..."
                        />
                     </div>
                  </div>

                  {/* Domain 2: SENSITIVITY */}
                  <div className="bg-pink-50/50 p-4 border border-pink-200 space-y-3">
                     <div className="flex justify-between items-center">
                        <h4 className="font-black text-pink-900 text-sm flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-600"></span> 2. Ability to Be Sensitive (Socio-Emotional & Empathy)
                        </h4>
                        <select 
                          value={evaluatingCard.sensitivity?.level || 'Developing'}
                          onChange={(e) => setEvaluatingCard(prev => ({
                            ...prev,
                            sensitivity: { ...prev.sensitivity, level: e.target.value }
                          }))}
                          className="bg-white border border-pink-300 text-xs font-bold text-pink-900 px-2 py-1">
                           <option value="Beginning">Beginning</option>
                           <option value="Developing">Developing</option>
                           <option value="Proficient">Proficient</option>
                           <option value="Exemplary">Exemplary</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-pink-800 uppercase mb-1">Teacher Observation Remarks</label>
                        <input 
                          type="text" 
                          value={evaluatingCard.sensitivity?.teacherRemarks || ''}
                          onChange={(e) => setEvaluatingCard(prev => ({
                            ...prev,
                            sensitivity: { ...prev.sensitivity, teacherRemarks: e.target.value }
                          }))}
                          className="w-full bg-white border border-pink-300 px-3 py-1.5 text-xs focus:outline-none"
                          placeholder="e.g. Demonstrates active kindness and peer collaboration..."
                        />
                     </div>
                  </div>

                  {/* Domain 3: CREATIVITY */}
                  <div className="bg-orange-50/50 p-4 border border-orange-200 space-y-3">
                     <div className="flex justify-between items-center">
                        <h4 className="font-black text-orange-900 text-sm flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> 3. Ability to Be Creative (Expression & Problem Solving)
                        </h4>
                        <select 
                          value={evaluatingCard.creativity?.level || 'Developing'}
                          onChange={(e) => setEvaluatingCard(prev => ({
                            ...prev,
                            creativity: { ...prev.creativity, level: e.target.value }
                          }))}
                          className="bg-white border border-orange-300 text-xs font-bold text-orange-900 px-2 py-1">
                           <option value="Beginning">Beginning</option>
                           <option value="Developing">Developing</option>
                           <option value="Proficient">Proficient</option>
                           <option value="Exemplary">Exemplary</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-orange-800 uppercase mb-1">Teacher Observation Remarks</label>
                        <input 
                          type="text" 
                          value={evaluatingCard.creativity?.teacherRemarks || ''}
                          onChange={(e) => setEvaluatingCard(prev => ({
                            ...prev,
                            creativity: { ...prev.creativity, teacherRemarks: e.target.value }
                          }))}
                          className="w-full bg-white border border-orange-300 px-3 py-1.5 text-xs focus:outline-none"
                          placeholder="e.g. Exceptional divergent thinking and creative solutions..."
                        />
                     </div>
                  </div>

                  {/* General Summary & Readiness Status */}
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Overall Card Status</label>
                        <select 
                          value={evaluatingCard.status}
                          onChange={(e) => setEvaluatingCard(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:outline-none bg-white">
                           <option value="Pending Evaluation">Pending Evaluation</option>
                           <option value="Reviewing Draft">Reviewing Draft</option>
                           <option value="Ready to Print">Ready to Print (Published)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Attendance Record (%)</label>
                        <input 
                          type="number" 
                          value={evaluatingCard.attendancePercentage || 90}
                          onChange={(e) => setEvaluatingCard(prev => ({ ...prev, attendancePercentage: Number(e.target.value) }))}
                          className="w-full border-2 border-gray-300 px-3 py-1.5 text-xs font-bold focus:outline-none"
                        />
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                     <button 
                       type="button" 
                       onClick={() => setEvaluatingCard(null)}
                       className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                       Cancel
                     </button>
                     <button 
                       type="submit"
                       className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                       <Check className="w-4 h-4" /> Save Evaluation to Database
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Modal 4: PRINT / EXPORT OFFICIAL PROGRESS CARD */}
      {printingCard && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white max-w-2xl w-full rounded-none shadow-2xl border border-gray-300 flex flex-col max-h-[90vh]">
               <div className="px-6 py-3.5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <span className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                     <Printer className="w-4 h-4 text-indigo-600" /> Official NEP 2020 Holistic Progress Card Preview
                  </span>
                  <button onClick={() => setPrintingCard(null)} className="text-gray-400 hover:text-red-500">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Printable Card Canvas */}
               <div className="p-8 overflow-y-auto space-y-6 bg-white border m-4 border-gray-300" id="printable-hpc-card">
                  {/* School Header */}
                  <div className="text-center border-b-2 border-gray-900 pb-4">
                     <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">All Core Solutions</h2>
                     <p className="text-xs text-gray-600 font-medium">Affiliated to Central Board of Secondary Education (CBSE) • NEP 2020 Holistic Assessment</p>
                     <div className="mt-2 inline-block px-4 py-1 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest">
                        Holistic Progress Card (HPC) • {printingCard.term} ({printingCard.academicYear})
                     </div>
                  </div>

                  {/* Student Details Grid */}
                  <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 border border-gray-200 text-xs">
                     <div><span className="text-gray-400 uppercase font-bold text-[10px]">Student Name</span><p className="font-black text-gray-900 text-sm">{printingCard.studentName}</p></div>
                     <div><span className="text-gray-400 uppercase font-bold text-[10px]">Roll Number</span><p className="font-black text-gray-900">{printingCard.rollNo}</p></div>
                     <div><span className="text-gray-400 uppercase font-bold text-[10px]">Class & Section</span><p className="font-black text-gray-900">{printingCard.className} - {printingCard.section}</p></div>
                     <div><span className="text-gray-400 uppercase font-bold text-[10px]">Attendance</span><p className="font-black text-emerald-600">{printingCard.attendancePercentage || 94}%</p></div>
                  </div>

                  {/* Three Abilities Matrix */}
                  <div className="space-y-4">
                     <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider border-b border-gray-200 pb-1">
                        Developmental Abilities Assessment (Zero Marks • Whole-Child Learning)
                     </h3>

                     {/* Ability 1 */}
                     <div className="border border-blue-200 p-3.5 bg-blue-50/20">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-black text-blue-900 text-xs uppercase">Ability 1: Awareness (Physical & Cognitive)</span>
                           <span className="font-black text-xs px-2 py-0.5 bg-blue-100 text-blue-800 uppercase">{printingCard.awareness?.level || 'Proficient'}</span>
                        </div>
                        <p className="text-xs text-gray-700 italic">"{printingCard.awareness?.teacherRemarks || 'Shows acute sensory observation and curiosity.'}"</p>
                     </div>

                     {/* Ability 2 */}
                     <div className="border border-pink-200 p-3.5 bg-pink-50/20">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-black text-pink-900 text-xs uppercase">Ability 2: Sensitivity (Socio-Emotional & Empathy)</span>
                           <span className="font-black text-xs px-2 py-0.5 bg-pink-100 text-pink-800 uppercase">{printingCard.sensitivity?.level || 'Developing'}</span>
                        </div>
                        <p className="text-xs text-gray-700 italic">"{printingCard.sensitivity?.teacherRemarks || 'Demonstrates kindness and cooperative teamwork.'}"</p>
                     </div>

                     {/* Ability 3 */}
                     <div className="border border-orange-200 p-3.5 bg-orange-50/20">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-black text-orange-900 text-xs uppercase">Ability 3: Creativity (Originality & Expression)</span>
                           <span className="font-black text-xs px-2 py-0.5 bg-orange-100 text-orange-800 uppercase">{printingCard.creativity?.level || 'Exemplary'}</span>
                        </div>
                        <p className="text-xs text-gray-700 italic">"{printingCard.creativity?.teacherRemarks || 'Inventive thinker with exceptional problem-solving agility.'}"</p>
                     </div>
                  </div>

                  {/* Parent Feedback & Signatures */}
                  <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs">
                     <div>
                        <span className="text-gray-400 uppercase font-bold text-[10px]">Parent Observations & Feedback</span>
                        <p className="text-gray-700 mt-1 italic font-medium">{printingCard.parentFeedback || 'Parent commended holistic growth.'}</p>
                     </div>
                     <div className="flex justify-between items-end pt-8">
                        <div className="text-center border-t border-gray-400 w-28 pt-1 text-[10px] font-bold text-gray-600">Class Teacher</div>
                        <div className="text-center border-t border-gray-400 w-28 pt-1 text-[10px] font-bold text-gray-600">Principal</div>
                     </div>
                  </div>
               </div>

               {/* Print Actions */}
               <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button 
                    onClick={() => setPrintingCard(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                    Close
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5" /> Print Official Card
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default HolisticProgress;
