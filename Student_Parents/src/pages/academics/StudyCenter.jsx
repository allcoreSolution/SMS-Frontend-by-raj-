import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, FolderTree, Folder, Search, GraduationCap, 
  CheckCircle2, Clock, AlertCircle, FileText, Video, 
  Download, Eye, ExternalLink, RefreshCw, Layers,
  ChevronDown, ChevronUp, BookCheck, Sparkles, Filter, X
} from 'lucide-react';
import { parentService } from '../../api/parentService';

export default function StudyCenter() {
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus' | 'resources'
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  
  // Data states
  const [syllabusUnits, setSyllabusUnits] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('All');
  const [expandedUnits, setExpandedUnits] = useState({});

  // Preview Modal
  const [previewResource, setPreviewResource] = useState(null);

  // 1. Initial Load: Get active child & data
  useEffect(() => {
    loadChildrenAndData();
  }, []);

  const loadChildrenAndData = async () => {
    try {
      setLoading(true);
      const kids = await parentService.getChildren();
      if (kids && kids.length > 0) {
        setChildren(kids);
        const current = kids[0];
        setActiveChild(current);
        await fetchData(current.className || 'Class I');
      } else {
        // Fallback default
        const fallback = { firstName: 'Aarav', lastName: 'Sharma', className: 'Class I', section: 'A' };
        setActiveChild(fallback);
        await fetchData('Class I');
      }
    } catch (err) {
      console.error('Error loading study center:', err);
      // Fallback
      await fetchData('Class I');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (clsName) => {
    try {
      const classNameParam = clsName || activeChild?.className || 'Class I';
      const [sylRes, resRes] = await Promise.all([
        parentService.getSyllabus({ className: classNameParam }),
        parentService.getStudyResources({ className: classNameParam })
      ]);

      if (sylRes?.success && Array.isArray(sylRes.data)) {
        setSyllabusUnits(sylRes.data);
        // Expand first 2 units by default
        const initExpanded = {};
        sylRes.data.slice(0, 2).forEach(u => { initExpanded[u._id] = true; });
        setExpandedUnits(initExpanded);
      }

      if (resRes?.success && Array.isArray(resRes.data)) {
        setResources(resRes.data);
      }
    } catch (error) {
      console.error('Error fetching syllabus & resources:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(activeChild?.className || 'Class I');
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleChildChange = async (child) => {
    setActiveChild(child);
    setLoading(true);
    await fetchData(child.className || 'Class I');
    setLoading(false);
  };

  // Toggle unit accordion
  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  // Expand / Collapse all
  const expandAll = () => {
    const all = {};
    syllabusUnits.forEach(u => { all[u._id] = true; });
    setExpandedUnits(all);
  };

  const collapseAll = () => {
    setExpandedUnits({});
  };

  // Handle resource download
  const handleDownload = async (resource) => {
    try {
      await parentService.downloadResource(resource._id);
      // Increment local count
      setResources(prev => prev.map(r => 
        r._id === resource._id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r
      ));
      if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Download error:', err);
      if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank');
      }
    }
  };

  // Distinct subjects for filter
  const subjectsList = useMemo(() => {
    const set = new Set();
    syllabusUnits.forEach(u => { if (u.subjectName) set.add(u.subjectName); });
    resources.forEach(r => { if (r.subjectName) set.add(r.subjectName); });
    return ['All', ...Array.from(set)];
  }, [syllabusUnits, resources]);

  // Filtered Syllabus
  const filteredSyllabus = useMemo(() => {
    return syllabusUnits.filter(u => {
      const matchSubject = selectedSubject === 'All' || u.subjectName?.toLowerCase() === selectedSubject.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        u.title?.toLowerCase().includes(q) || 
        u.subjectName?.toLowerCase().includes(q) ||
        u.learningObjectives?.toLowerCase().includes(q) ||
        u.topics?.some(t => t.name?.toLowerCase().includes(q));
      return matchSubject && matchSearch;
    });
  }, [syllabusUnits, selectedSubject, searchQuery]);

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchSubject = selectedSubject === 'All' || r.subjectName?.toLowerCase() === selectedSubject.toLowerCase();
      const matchType = resourceTypeFilter === 'All' || r.materialType?.toLowerCase() === resourceTypeFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        r.title?.toLowerCase().includes(q) || 
        r.description?.toLowerCase().includes(q) ||
        r.authorTeacher?.toLowerCase().includes(q) ||
        r.tags?.some(tag => tag.toLowerCase().includes(q));
      return matchSubject && matchType && matchSearch;
    });
  }, [resources, selectedSubject, resourceTypeFilter, searchQuery]);

  // Overall Statistics Calculation
  const stats = useMemo(() => {
    const totalUnits = syllabusUnits.length;
    let totalTopics = 0;
    let coveredTopics = 0;

    syllabusUnits.forEach(u => {
      if (Array.isArray(u.topics)) {
        totalTopics += u.topics.length;
        coveredTopics += u.topics.filter(t => t.status === 'Covered').length;
      }
    });

    const completionRate = totalTopics > 0 ? Math.round((coveredTopics / totalTopics) * 100) : 0;
    const totalResources = resources.length;
    const subjectsCount = subjectsList.length > 1 ? subjectsList.length - 1 : 0;

    return {
      totalUnits,
      totalTopics,
      coveredTopics,
      completionRate,
      totalResources,
      subjectsCount
    };
  }, [syllabusUnits, resources, subjectsList]);

  // Color helper for badges
  const getSubjectBadge = (subj) => {
    const s = (subj || '').toLowerCase();
    if (s.includes('math')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('sci') || s.includes('evs') || s.includes('environ')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('eng')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (s.includes('hin')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s.includes('comp')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'In-Progress':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> In Progress</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200"><AlertCircle className="w-3 h-3" /> Pending</span>;
    }
  };

  const getResourceTypeIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'e-book':
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-6">
      {/* 1. Header with Student Badge & Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <BookCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Syllabus & Study Materials</h1>
          </div>
          <p className="text-[13px] text-gray-500 mt-1 pl-10">
            Official curriculum topics, chapter completion tracking, and downloadable academic resources for{' '}
            <span className="font-semibold text-gray-700">{activeChild?.firstName} {activeChild?.lastName}</span>
          </p>
        </div>

        {/* Right side: Child switcher / Class badge */}
        <div className="flex items-center gap-3 self-start md:self-auto pl-10 md:pl-0">
          {children.length > 1 ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase px-2">Child:</span>
              {children.map(c => (
                <button
                  key={c._id}
                  onClick={() => handleChildChange(c)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeChild?._id === c._id ? 'bg-[#353A40] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {c.firstName} ({c.className || 'Class I'})
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-[#0ea5e9] text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold shadow-xs">
              <GraduationCap className="w-4 h-4" />
              <span>{activeChild?.className || 'Class I'} {activeChild?.section ? `- ${activeChild.section}` : ''}</span>
            </div>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh Data"
            className="p-2 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Syllabus Units */}
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] text-white rounded-xl p-4 md:p-5 relative overflow-hidden shadow-xs">
          <h3 className="text-[10px] font-bold tracking-widest opacity-90 uppercase">Syllabus Units</h3>
          <p className="text-3xl font-black mt-1 leading-none">{stats.totalUnits}</p>
          <p className="text-[11px] opacity-80 mt-1.5">{stats.subjectsCount} registered subjects</p>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-xs">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Topics Completion Rate */}
        <div className="bg-gradient-to-br from-[#10b981] to-[#059669] text-white rounded-xl p-4 md:p-5 relative overflow-hidden shadow-xs">
          <h3 className="text-[10px] font-bold tracking-widest opacity-90 uppercase">Topics Covered</h3>
          <p className="text-3xl font-black mt-1 leading-none">{stats.coveredTopics}<span className="text-lg font-medium opacity-80">/{stats.totalTopics}</span></p>
          <p className="text-[11px] opacity-80 mt-1.5">{stats.completionRate}% syllabus progress</p>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-xs">
            <FolderTree className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Total Study Materials */}
        <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white rounded-xl p-4 md:p-5 relative overflow-hidden shadow-xs">
          <h3 className="text-[10px] font-bold tracking-widest opacity-90 uppercase">Study Materials</h3>
          <p className="text-3xl font-black mt-1 leading-none">{stats.totalResources}</p>
          <p className="text-[11px] opacity-80 mt-1.5">PDFs, Videos, Books</p>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-xs">
            <Folder className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white rounded-xl p-4 md:p-5 relative overflow-hidden shadow-xs">
          <h3 className="text-[10px] font-bold tracking-widest opacity-90 uppercase">Curriculum Pace</h3>
          <p className="text-2xl font-black mt-1 leading-none">On Schedule</p>
          <p className="text-[11px] opacity-80 mt-1.5">Term 1 syllabus active</p>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-xs">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* 3. Search and Subject Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters, unit titles, topics, or notes..."
            className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Subject Filter Dropdown */}
        <div className="w-full md:w-56">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            {subjectsList.map(subj => (
              <option key={subj} value={subj}>{subj === 'All' ? 'All Subjects' : subj}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Tab Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all shadow-xs ${
              activeTab === 'syllabus'
                ? 'bg-[#353A40] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus Tracker</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'syllabus' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {filteredSyllabus.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all shadow-xs ${
              activeTab === 'resources'
                ? 'bg-[#353A40] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Digital Study Library</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'resources' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {filteredResources.length}
            </span>
          </button>
        </div>

        {/* Sub-actions based on active tab */}
        {activeTab === 'syllabus' ? (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={expandAll}
              className="text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              Expand All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-gray-500 hover:text-gray-700 font-semibold px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Collapse All
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'PDF', 'Video', 'Doc', 'E-Book'].map(type => (
              <button
                key={type}
                onClick={() => setResourceTypeFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  resourceTypeFilter === type
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Main Content Area */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-700">Loading syllabus & resources...</p>
          <p className="text-xs text-gray-400 mt-1">Fetching latest curriculum from school database</p>
        </div>
      ) : activeTab === 'syllabus' ? (
        /* SYLLABUS TAB CONTENT */
        <div className="space-y-4">
          {filteredSyllabus.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-700">No syllabus units match your criteria</h3>
              <p className="text-xs text-gray-400 mt-1">Try resetting the subject filter or search query.</p>
              <button
                onClick={() => { setSelectedSubject('All'); setSearchQuery(''); }}
                className="mt-4 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredSyllabus.map(unit => {
              const isExpanded = !!expandedUnits[unit._id];
              const topics = Array.isArray(unit.topics) ? unit.topics : [];
              const coveredCount = topics.filter(t => t.status === 'Covered').length;
              const calcPct = unit.completionPct !== undefined ? unit.completionPct : (topics.length > 0 ? Math.round((coveredCount / topics.length) * 100) : 0);

              return (
                <div
                  key={unit._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:border-gray-300 transition-all"
                >
                  {/* Card Header Accordion Trigger */}
                  <div
                    onClick={() => toggleUnit(unit._id)}
                    className="p-4 md:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold border mt-0.5 ${getSubjectBadge(unit.subjectName)}`}>
                        {unit.subjectName}
                      </span>
                      <div>
                        <h3 className="text-sm md:text-base font-bold text-gray-800 leading-snug">
                          {unit.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            {topics.length} Topics
                          </span>
                          <span>•</span>
                          <span className="font-medium">
                            {unit.periodsTaken || 0} of {unit.periodsEstimated || 8} Periods
                          </span>
                          {unit.referenceBooks && (
                            <>
                              <span>•</span>
                              <span className="text-gray-400 truncate max-w-xs" title={unit.referenceBooks}>
                                📖 {unit.referenceBooks}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Status */}
                    <div className="flex items-center gap-4 self-end md:self-center pl-10 md:pl-0">
                      <div className="w-32 md:w-36 text-right">
                        <div className="flex justify-between items-center text-[11px] font-bold text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{calcPct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              calcPct === 100 ? 'bg-emerald-500' : calcPct > 40 ? 'bg-blue-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${calcPct}%` }}
                          />
                        </div>
                      </div>

                      {getStatusBadge(unit.status || (calcPct === 100 ? 'Completed' : calcPct > 0 ? 'In-Progress' : 'Pending'))}

                      <button className="p-1 text-gray-400 hover:text-gray-700 rounded-md">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Accordion Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 md:p-5 bg-gray-50/40 space-y-4">
                      {/* Learning Objectives Callout */}
                      {unit.learningObjectives && (
                        <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3.5">
                          <h4 className="text-[11px] font-bold text-blue-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Key Learning Objectives
                          </h4>
                          <p className="text-xs text-blue-900 leading-relaxed">
                            {unit.learningObjectives}
                          </p>
                        </div>
                      )}

                      {/* Topic Checklist */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                          Detailed Topic Checklist ({coveredCount}/{topics.length} Covered)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {topics.map((t, idx) => {
                            const isCovered = t.status === 'Covered';
                            const isInProgress = t.status === 'In-Progress';
                            return (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                                  isCovered
                                    ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-900'
                                    : isInProgress
                                    ? 'bg-amber-50/40 border-amber-200/80 text-amber-900'
                                    : 'bg-white border-gray-200 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {isCovered ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : isInProgress ? (
                                    <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                                  )}
                                  <span className={`font-semibold truncate ${isCovered ? 'line-through text-gray-500' : ''}`}>
                                    {t.name}
                                  </span>
                                </div>

                                <div className="shrink-0 flex items-center gap-1.5">
                                  {isCovered && t.completedDate && (
                                    <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded font-medium">
                                      Done {new Date(t.completedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                  )}
                                  {!isCovered && isInProgress && (
                                    <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-bold">
                                      In Class
                                    </span>
                                  )}
                                  {!isCovered && !isInProgress && (
                                    <span className="text-[10px] text-gray-400 font-medium">Upcoming</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* RESOURCES / MATERIALS TAB CONTENT */
        <div className="space-y-4">
          {filteredResources.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-700">No study materials found</h3>
              <p className="text-xs text-gray-400 mt-1">Try choosing another subject or file type filter.</p>
              <button
                onClick={() => { setSelectedSubject('All'); setResourceTypeFilter('All'); setSearchQuery(''); }}
                className="mt-4 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => {
                return (
                  <div
                    key={resource._id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Type & Subject Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${getSubjectBadge(resource.subjectName)}`}>
                          {resource.subjectName}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] font-bold text-gray-700">
                          {getResourceTypeIcon(resource.materialType)}
                          <span>{resource.materialType || 'PDF'}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug hover:text-blue-600 cursor-pointer" onClick={() => setPreviewResource(resource)}>
                        {resource.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {resource.description || 'Supplementary revision guide and practice exercises prepared by school faculty.'}
                      </p>

                      {/* Author & File Details */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-gray-600 truncate max-w-[140px]" title={resource.authorTeacher}>
                          👤 {resource.authorTeacher || 'Faculty'}
                        </span>
                        <span className="font-semibold text-gray-400">
                          {resource.fileSize || '1.5 MB'}
                        </span>
                      </div>

                      {/* Tags */}
                      {Array.isArray(resource.tags) && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {resource.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(resource)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-extrabold ml-1">
                          {resource.downloadsCount || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => setPreviewResource(resource)}
                        title="Preview Details"
                        className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Resource Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  {getResourceTypeIcon(previewResource.materialType)}
                </span>
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getSubjectBadge(previewResource.subjectName)}`}>
                    {previewResource.subjectName}
                  </span>
                  <h3 className="text-base font-bold text-gray-800 mt-1 leading-snug">
                    {previewResource.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="leading-relaxed text-gray-700 font-medium">
                {previewResource.description || 'Comprehensive curriculum study material provided by academic department.'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Author / Teacher</span>
                  <span className="font-semibold text-gray-800">{previewResource.authorTeacher || 'Academic Department'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">File Size</span>
                  <span className="font-semibold text-gray-800">{previewResource.fileSize || '1.8 MB'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Material Type</span>
                  <span className="font-semibold text-gray-800">{previewResource.materialType || 'PDF'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Downloads</span>
                  <span className="font-semibold text-gray-800">{previewResource.downloadsCount || 0} times</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleDownload(previewResource)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" /> Download / Open Resource
              </button>
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
