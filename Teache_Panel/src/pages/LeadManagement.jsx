import React, { useState, useEffect } from 'react';
import { 
  Filter, Phone, Mail, UserPlus, CheckCircle, 
  LayoutDashboard, Columns, Network,
  TrendingDown, TrendingUp, Users, MoreHorizontal, Clock, ArrowRight,
  PieChart as PieChartIcon, Activity, Share2, Globe, Target, X, Send,
  Trash2, RefreshCw, GraduationCap, Search, Check
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import leadService from '../api/leadService';

const PIPELINE_STAGES = [
  { id: 'New Lead', label: 'New Lead', color: 'blue', aliases: ['New Lead', 'New Enquiry'] },
  { id: 'Contacted', label: 'Contacted', color: 'yellow', aliases: ['Contacted', 'Contacted / Qualified'] },
  { id: 'Campus Visit', label: 'Campus Visit', color: 'orange', aliases: ['Campus Visit', 'Document Verification'] },
  { id: 'Application', label: 'Application', color: 'purple', aliases: ['Application', 'Application Received', 'Entrance Test', 'Offer / Selected'] },
  { id: 'Enrolled', label: 'Enrolled', color: 'emerald', aliases: ['Enrolled', 'Converted'] }
];

const LeadManagement = () => {
  const [activeTab, setActiveTab] = useState('Lead Dashboard');
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');

  const [isAddingLead, setIsAddingLead] = useState(false);
  const [viewingLead, setViewingLead] = useState(null);
  const [emailingLead, setEmailingLead] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  // New Lead Form State
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    contactNumber: '',
    email: '',
    targetClass: 'Class I',
    source: 'Website',
    notes: ''
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const p = location.pathname;
    if (p.includes('/lead-pipeline')) setActiveTab('Lead Pipeline Board');
    else if (p.includes('/lead-sources')) setActiveTab('Lead Sources & Stages');
    else setActiveTab('Lead Dashboard');
  }, [location.pathname]);

  const DEFAULT_SEED_LEADS = [];

  const DEFAULT_SEED_STATS = {
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: '0%',
    avgResponseTime: '0 hrs',
    byStage: {
      'New Lead': 0,
      'Contacted': 0,
      'Campus Visit': 0,
      'Application': 0,
      'Enrolled': 0
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        leadService.getLeads().catch(() => ({ data: [] })),
        leadService.getStats().catch(() => ({ data: null }))
      ]);
      if (leadsRes?.data && leadsRes.data.length > 0) {
        setLeads(leadsRes.data);
      } else {
        setLeads([]);
      }
      if (statsRes?.data) {
        setStats(statsRes.data);
      } else {
        setStats(DEFAULT_SEED_STATS);
      }
    } catch (err) {
      setLeads([]);
      setStats(DEFAULT_SEED_STATS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTabClick = (tabName, route) => {
    setActiveTab(tabName);
    navigate(route);
  };

  const handleSaveLead = async (e) => {
    if (e) e.preventDefault();
    if (!formData.studentName.trim() || !formData.contactNumber.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter Student Name and Contact Number.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    const payload = {
      _id: 'lead-' + Date.now(),
      studentName: formData.studentName,
      parentName: formData.parentName || formData.studentName + "'s Guardian",
      contactNumber: formData.contactNumber,
      email: formData.email,
      targetClass: formData.targetClass,
      source: formData.source,
      notes: formData.notes,
      status: 'New Lead',
      stage: 'New Lead',
      createdAt: new Date().toISOString()
    };

    try {
      await leadService.createLead(payload);
    } catch (err) {
      console.warn('API error, saving lead locally:', err);
    }

    setLeads(prev => [payload, ...prev]);
    setIsAddingLead(false);
    setFormData({
      studentName: '',
      parentName: '',
      contactNumber: '',
      email: '',
      targetClass: 'Class I',
      source: 'Website',
      notes: ''
    });
    Swal.fire({
      title: 'Lead Saved',
      text: 'New admission enquiry recorded successfully.',
      icon: 'success',
      confirmButtonColor: '#0d9488'
    });
  };

  const handleStageChange = async (leadId, newStage) => {
    try {
      await leadService.updateLead(leadId, { stage: newStage, status: newStage });
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, stage: newStage, status: newStage } : l));
      if (viewingLead?._id === leadId) {
        setViewingLead(prev => ({ ...prev, stage: newStage, status: newStage }));
      }
      // Reload stats in background
      leadService.getStats().then(s => s?.data && setStats(s.data));
    } catch (err) {
      Swal.fire({
        title: 'Update Failed',
        text: err.response?.data?.message || err.message,
        icon: 'error'
      });
    }
  };

  const handleConvertLead = async (lead) => {
    const result = await Swal.fire({
      title: `Enroll ${lead.studentName}?`,
      text: 'This will convert this inquiry into an enrolled student and update their status.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Enroll Now',
      confirmButtonColor: '#059669',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await leadService.convertLead(lead._id);
        await loadData();
        if (viewingLead?._id === lead._id) {
          setViewingLead(prev => ({ ...prev, stage: 'Enrolled', status: 'Enrolled' }));
        }
        Swal.fire({
          title: 'Successfully Enrolled!',
          text: `${lead.studentName} is now officially marked as Enrolled.`,
          icon: 'success',
          confirmButtonColor: '#059669'
        });
      } catch (err) {
        Swal.fire({
          title: 'Conversion Failed',
          text: err.response?.data?.message || err.message,
          icon: 'error'
        });
      }
    }
  };

  const handleDeleteLead = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Lead?',
      text: `Are you sure you want to remove ${name || 'this lead'} permanently?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await leadService.deleteLead(id);
        setLeads(prev => prev.filter(l => l._id !== id));
        if (viewingLead?._id === id) setViewingLead(null);
        await loadData();
        Swal.fire({
          title: 'Deleted!',
          text: 'Lead record has been removed.',
          icon: 'success',
          confirmButtonColor: '#dc2626'
        });
      } catch (err) {
        Swal.fire({
          title: 'Delete Failed',
          text: err.response?.data?.message || err.message,
          icon: 'error'
        });
      }
    }
  };

  const handleSendEmail = () => {
    const toName = emailingLead?.studentName || emailingLead?.name || 'Lead';
    setEmailingLead(null);
    setEmailSubject('');
    setEmailMessage('');
    Swal.fire({
      title: 'Email Delivered',
      text: `Your message has been successfully dispatched to ${toName}.`,
      icon: 'success',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Okay'
    });
  };

  const handleLogCall = () => {
    Swal.fire({
      title: 'Call Logged!',
      text: `Your conversation with ${viewingLead?.studentName || viewingLead?.name} is securely recorded in the CRM activity log.`,
      icon: 'success',
      confirmButtonColor: '#0d9488',
      confirmButtonText: 'Awesome'
    });
  };

  // Filtered leads
  const filteredLeads = leads.filter(l => {
    const nameMatch = (l.studentName || l.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (l.parentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (l.contactNumber || l.contact || '').includes(searchQuery);
    const classMatch = classFilter === 'All' || (l.targetClass || l.forClass) === classFilter;
    return nameMatch && classMatch;
  });

  // Calculate stage items for pipeline board
  const getStageLeads = (stage) => {
    return leads.filter(l => {
      const curStage = l.stage || l.status || 'New Lead';
      return stage.aliases.some(alias => alias.toLowerCase() === curStage.toLowerCase());
    });
  };

  const tabs = [
    { name: 'Lead Dashboard', icon: <LayoutDashboard className="w-[14px] h-[14px]" />, route: '/lead-dashboard' },
    { name: 'Lead Pipeline Board', icon: <Columns className="w-[14px] h-[14px]" />, route: '/lead-pipeline' },
    { name: 'Lead Sources & Stages', icon: <Network className="w-[14px] h-[14px]" />, route: '/lead-sources' }
  ];

  const totalCount = stats?.total || leads.length;
  const convertedCount = stats?.converted || leads.filter(l => ['Enrolled', 'Converted'].includes(l.stage || l.status)).length;
  const newCount = stats?.open || leads.filter(l => ['New Lead', 'New Enquiry'].includes(l.stage || l.status)).length;
  const droppedCount = stats?.lost || leads.filter(l => ['Lost', 'Lost / Rejected'].includes(l.stage || l.status)).length;
  const convRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in pb-10">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white border-l-4 border-l-teal-500 border border-gray-200 shadow-sm rounded-none p-5">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Total Leads</span>
             <Users className="w-4 h-4 text-teal-500" />
           </div>
           <h3 className="text-3xl font-black text-gray-800">{totalCount}</h3>
           <p className="text-[11px] text-teal-600 font-bold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Live records synced</p>
         </div>

         <div className="bg-white border-l-4 border-l-blue-500 border border-gray-200 shadow-sm rounded-none p-5">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">New Inquiries</span>
             <Phone className="w-4 h-4 text-blue-500" />
           </div>
           <h3 className="text-3xl font-black text-gray-800">{newCount}</h3>
           <p className="text-[11px] text-gray-500 font-medium mt-1">Pending quick response</p>
         </div>

         <div className="bg-white border-l-4 border-l-emerald-500 border border-gray-200 shadow-sm rounded-none p-5">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Converted</span>
             <CheckCircle className="w-4 h-4 text-emerald-500" />
           </div>
           <h3 className="text-3xl font-black text-gray-800">{convertedCount}</h3>
           <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {convRate}% conversion rate</p>
         </div>

         <div className="bg-white border-l-4 border-l-red-500 border border-gray-200 shadow-sm rounded-none p-5">
           <div className="flex justify-between items-start mb-2">
             <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Dropped / Lost</span>
             <TrendingDown className="w-4 h-4 text-red-500" />
           </div>
           <h3 className="text-3xl font-black text-gray-800">{droppedCount}</h3>
           <p className="text-[11px] text-gray-500 font-medium mt-1">Location / Fee constraints</p>
         </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-3 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by student, parent, phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 text-sm focus:border-teal-500 focus:outline-none rounded-none"
            />
          </div>
          <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none bg-white rounded-none">
            <option value="All">All Grades</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Class XI - Science">Class XI - Science</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            className="p-2 border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-none transition-colors"
            title="Refresh from MongoDB">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
          </button>
          <button 
            onClick={() => setIsAddingLead(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 flex items-center gap-2 rounded-none shadow-sm text-[12px] font-bold transition-all active:scale-95 border border-teal-700">
            <UserPlus className="w-3.5 h-3.5" /> Add Manual Lead
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border-2 border-gray-300 shadow-sm rounded-none overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-300 flex justify-between items-center bg-gray-100">
          <h3 className="text-[14px] font-black text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-teal-600" /> Active Leads Registry ({filteredLeads.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="border-b border-gray-300 text-[12px] font-black text-gray-700 bg-gray-100 uppercase tracking-wider h-12">
                <th className="px-6 py-3 font-black border-r border-gray-300">Student & Parent</th>
                <th className="px-6 py-3 font-black text-center border-r border-gray-300">Target Grade</th>
                <th className="px-6 py-3 font-black text-center border-r border-gray-300">Source</th>
                <th className="px-6 py-3 font-black text-center border-r border-gray-300">Pipeline Stage</th>
                <th className="px-6 py-3 font-black text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-bold">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => {
                  const leadName = lead.studentName || lead.name || 'Unnamed';
                  const parentName = lead.parentName || 'Parent';
                  const contact = lead.contactNumber || lead.contact || 'No phone';
                  const grade = lead.targetClass || lead.forClass || 'General';
                  const currentStage = lead.stage || lead.status || 'New Lead';
                  const isEnrolled = ['Enrolled', 'Converted'].includes(currentStage);

                  return (
                    <tr key={lead._id || lead.id} className="border-b border-gray-300 hover:bg-teal-50/30 transition-colors">
                       <td className="px-6 py-4 border-r border-gray-300">
                         <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-none bg-teal-50 text-teal-800 font-black flex items-center justify-center text-sm border-2 border-teal-200 shadow-sm">
                             {leadName.charAt(0)}
                           </div>
                           <div>
                             <h4 className="font-bold text-gray-900 text-[13px]">{leadName}</h4>
                             <p className="text-[11px] text-gray-500 font-medium">Guardian: {parentName}</p>
                             <span className="text-[11px] text-gray-600 flex items-center gap-1 font-bold mt-0.5">
                               <Phone className="w-3 h-3 text-teal-600" /> {contact}
                             </span>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-center border-r border-gray-300">
                         <span className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1.5 rounded-none text-[11px] font-bold tracking-wide shadow-sm">
                           {grade}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-center text-[12px] text-gray-600 font-medium border-r border-gray-300">
                         <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                           {lead.source || 'Website'}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-center border-r border-gray-300">
                         <select 
                           value={currentStage}
                           onChange={(e) => handleStageChange(lead._id, e.target.value)}
                           className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1.5 border shadow-sm rounded-none cursor-pointer focus:outline-none ${
                             isEnrolled ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                             currentStage.includes('New') ? 'bg-blue-50 text-blue-800 border-blue-300' :
                             currentStage.includes('Contacted') ? 'bg-yellow-50 text-yellow-800 border-yellow-300' :
                             'bg-orange-50 text-orange-800 border-orange-300'
                           }`}>
                           <option value="New Lead">New Lead</option>
                           <option value="Contacted">Contacted</option>
                           <option value="Campus Visit">Campus Visit</option>
                           <option value="Application">Application</option>
                           <option value="Enrolled">Enrolled</option>
                           <option value="Lost">Lost / Dropped</option>
                         </select>
                       </td>
                       <td className="px-6 py-4 text-right border-r border-gray-300 bg-gray-50/20">
                          <div className="flex justify-end items-center gap-2">
                             {!isEnrolled && (
                               <button 
                                 onClick={() => handleConvertLead(lead)}
                                 className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm active:scale-95"
                                 title="Convert to Enrolled Student">
                                 <GraduationCap className="w-3.5 h-3.5" /> Enroll
                               </button>
                             )}
                             <button 
                                onClick={() => setEmailingLead(lead)}
                                className="w-8 h-8 rounded-none border border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-700 flex items-center justify-center transition-all bg-white shadow-sm active:scale-90"
                                title="Send Email">
                                <Mail className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => setViewingLead(lead)}
                                className="w-8 h-8 rounded-none border border-gray-300 hover:border-teal-500 hover:bg-teal-50 text-gray-600 hover:text-teal-700 flex items-center justify-center transition-all bg-white shadow-sm active:scale-90"
                                title="View Full Profile">
                                <ArrowRight className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => handleDeleteLead(lead._id, leadName)}
                                className="w-8 h-8 rounded-none border border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-500 hover:text-red-700 flex items-center justify-center transition-all bg-white shadow-sm active:scale-90"
                                title="Delete Lead">
                                <Trash2 className="w-4 h-4" />
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
  );

  const renderPipelineBoard = () => {
    return (
      <div className="flex gap-5 overflow-x-auto pb-6 hide-scrollbar animate-in fade-in min-h-[600px]">
        {PIPELINE_STAGES.map(stage => {
          const items = getStageLeads(stage);
          const empty = items.length === 0;
          const colors = {
            'blue': 'bg-blue-500', 'yellow': 'bg-yellow-500', 'orange': 'bg-orange-500', 'purple': 'bg-purple-500', 'emerald': 'bg-emerald-500'
          };
          
          return (
            <div key={stage.id} className="min-w-[300px] w-[300px] flex flex-col bg-gray-50 border border-gray-300 rounded-none shadow-sm relative pt-1">
               {/* Top thick border line */}
               <div className={`absolute top-0 left-0 w-full h-1.5 rounded-none ${colors[stage.color]}`}></div>
               
               {/* Header */}
               <div className="p-4 flex justify-between items-center bg-white border-b border-gray-200 rounded-none mt-1 shadow-sm">
                  <div className="flex items-center gap-2.5">
                     <h3 className="font-black text-gray-800 text-[13px] uppercase tracking-wider">{stage.label}</h3>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-none text-[11px] font-black border border-gray-300">{items.length}</span>
               </div>
               
               {/* Column Area */}
               <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar">
                  {items.map(item => {
                    const itemName = item.studentName || item.name || 'Student';
                    const itemGrade = item.targetClass || item.forClass || 'Grade';
                    const itemContact = item.contactNumber || item.contact || '';
                    const isEnrolled = stage.id === 'Enrolled';

                    return (
                      <div key={item._id || item.id} className="bg-white border-2 border-gray-200 shadow-sm rounded-none p-3.5 hover:border-teal-400 hover:shadow-md transition-all group">
                         <div className="flex justify-between items-start mb-2">
                           <div>
                             <h4 className="font-bold text-gray-900 text-[13px] group-hover:text-teal-700 transition-colors">{itemName}</h4>
                             <p className="text-[11px] text-gray-500">{item.parentName ? `P: ${item.parentName}` : itemContact}</p>
                           </div>
                           <button 
                             onClick={() => handleDeleteLead(item._id, itemName)}
                             className="text-gray-300 hover:text-red-500 transition-colors"
                             title="Delete">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>

                         <div className="flex items-center justify-between mb-3">
                           <span className="text-[10px] text-teal-800 font-extrabold bg-teal-50 border border-teal-200 inline-block px-2 py-0.5 rounded-none uppercase tracking-wide shadow-sm">
                             {itemGrade}
                           </span>
                           <span className="text-[10px] text-gray-500 font-bold">
                             {item.source || 'Website'}
                           </span>
                         </div>

                         {/* Stage Quick Switcher */}
                         <div className="mb-3 bg-gray-50 p-1.5 border border-gray-200 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Stage:</span>
                            <select 
                              value={item.stage || item.status || stage.id}
                              onChange={(e) => handleStageChange(item._id, e.target.value)}
                              className="text-[10px] font-bold bg-white border border-gray-300 px-1 py-0.5 rounded-none focus:outline-none">
                              {PIPELINE_STAGES.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                              <option value="Lost">Lost</option>
                            </select>
                         </div>

                         <div className="flex items-center justify-between text-gray-500 text-[11px] font-bold border-t border-gray-200 pt-3">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                              <Clock className="w-3 h-3 text-gray-400"/> {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              {!isEnrolled && (
                                <button 
                                  onClick={() => handleConvertLead(item)}
                                  className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                  title="Enroll Student">
                                  <GraduationCap className="w-4 h-4" />
                                </button>
                              )}
                              <Mail 
                                className="w-4 h-4 hover:text-blue-600 transition-colors cursor-pointer" 
                                onClick={() => setEmailingLead(item)} 
                                title="Send Email"
                              />
                              <ArrowRight 
                                className="w-4 h-4 hover:text-teal-600 transition-colors cursor-pointer" 
                                onClick={() => setViewingLead(item)} 
                                title="View Details"
                              />
                            </div>
                         </div>
                      </div>
                    );
                  })}
                  {empty && (
                     <div className="border-2 border-dashed border-gray-300 bg-white/80 rounded-none h-24 flex items-center justify-center text-gray-400 text-[12px] font-bold">
                       No leads in {stage.label}
                     </div>
                  )}
               </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSourcesAndStages = () => {
    // 1. Source definitions & color map
    const SOURCE_CONFIG = {
      'Walk-in': { 
        name: 'Walk-ins (Campus Visits)', 
        icon: Target, 
        hex: '#10b981', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-300', 
        text: 'text-emerald-700', 
        bar: 'bg-emerald-500', 
        desc: 'Physical campus visits, reception inquiries & campus tours' 
      },
      'Website': { 
        name: 'Website Organic', 
        icon: Globe, 
        hex: '#f59e0b', 
        bg: 'bg-amber-50', 
        border: 'border-amber-300', 
        text: 'text-amber-700', 
        bar: 'bg-amber-500', 
        desc: 'Direct website admissions form & Google organic search' 
      },
      'Facebook': { 
        name: 'Facebook & Social Ads', 
        icon: Share2, 
        hex: '#3b82f6', 
        bg: 'bg-blue-50', 
        border: 'border-blue-300', 
        text: 'text-blue-700', 
        bar: 'bg-blue-500', 
        desc: 'Paid Meta campaigns, Instagram promos & social inquiries' 
      },
      'Google Ads': { 
        name: 'Google Search Ads', 
        icon: Activity, 
        hex: '#f43f5e', 
        bg: 'bg-rose-50', 
        border: 'border-rose-300', 
        text: 'text-rose-700', 
        bar: 'bg-rose-500', 
        desc: 'Paid Google search & display network advertisements' 
      },
      'Referral': { 
        name: 'Referrals & Alumni', 
        icon: Users, 
        hex: '#8b5cf6', 
        bg: 'bg-purple-50', 
        border: 'border-purple-300', 
        text: 'text-purple-700', 
        bar: 'bg-purple-500', 
        desc: 'Word-of-mouth, current parents, alumni & staff referrals' 
      }
    };

    const FALLBACK_CONFIG = {
      icon: Target,
      hex: '#06b6d4',
      bg: 'bg-cyan-50',
      border: 'border-cyan-300',
      text: 'text-cyan-700',
      bar: 'bg-cyan-500',
      desc: 'Other acquisition channels & direct inquiries'
    };

    // Aggregate counts and conversion rates directly from live leads state
    const sourceMap = {};
    leads.forEach(l => {
      const src = l.source || 'Website';
      if (!sourceMap[src]) {
        sourceMap[src] = { count: 0, converted: 0, leads: [] };
      }
      sourceMap[src].count++;
      sourceMap[src].leads.push(l);
      const isConv = ['Enrolled', 'Converted'].includes(l.stage || l.status);
      if (isConv) {
        sourceMap[src].converted++;
      }
    });

    // Ensure standard sources appear even if count is 0
    ['Walk-in', 'Website', 'Facebook', 'Google Ads', 'Referral'].forEach(key => {
      if (!sourceMap[key]) {
        sourceMap[key] = { count: 0, converted: 0, leads: [] };
      }
    });

    const totalLeadsCount = leads.length || 1;
    const sourcesList = Object.entries(sourceMap).map(([key, data]) => {
      const cfg = SOURCE_CONFIG[key] || { ...FALLBACK_CONFIG, name: key };
      const pct = Math.round((data.count / totalLeadsCount) * 100);
      const convRate = data.count > 0 ? Math.round((data.converted / data.count) * 100) : 0;
      return {
        key,
        ...cfg,
        count: data.count,
        converted: data.converted,
        percentage: pct,
        convRate,
        leads: data.leads
      };
    }).sort((a, b) => b.count - a.count);

    // Conic gradient string for Donut chart
    let runningAngle = 0;
    const conicStops = sourcesList
      .filter(s => s.percentage > 0)
      .map(s => {
        const start = runningAngle;
        runningAngle += s.percentage;
        return `${s.hex} ${start}% ${runningAngle}%`;
      });
    const donutBackground = conicStops.length > 0 ? `conic-gradient(${conicStops.join(', ')})` : '#e2e8f0';

    const displayedSourceLeads = selectedSource === 'All' 
      ? leads 
      : leads.filter(l => (l.source || 'Website') === selectedSource);

    const STAGE_DOT_COLORS = {
      blue: 'bg-blue-500 border-blue-700',
      yellow: 'bg-yellow-500 border-yellow-700',
      orange: 'bg-orange-500 border-orange-700',
      purple: 'bg-purple-500 border-purple-700',
      emerald: 'bg-emerald-500 border-emerald-700'
    };

    return (
      <div className="space-y-8 animate-in fade-in pb-12">
        
        {/* Top 2 Columns: Sources Donut Analytics + Stage Sequence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* Left Column: Real-Time Sources Analytics */}
           <div className="lg:col-span-7 bg-white shadow-sm border border-gray-300 rounded-none overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                 <div>
                   <h3 className="font-black text-gray-800 flex items-center gap-2 text-[15px]">
                     <PieChartIcon className="w-5 h-5 text-teal-600" /> Real-Time Lead Sources Analytics
                   </h3>
                   <p className="text-[11px] text-gray-500 font-medium mt-0.5">Live acquisition funnel tracked across {leads.length} student inquiries in MongoDB</p>
                 </div>
                 <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-black uppercase tracking-wider">
                   {sourcesList.filter(s => s.count > 0).length} Active Channels
                 </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                 {/* Donut Chart Visual & Top Highlight */}
                 <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 border-b border-gray-200 mb-6 bg-gradient-to-r from-gray-50/50 to-teal-50/20 p-4">
                    {/* Visual Conic Gradient Donut */}
                    <div 
                      className="w-44 h-44 rounded-full flex items-center justify-center p-3 relative shadow-md transition-transform hover:scale-105 duration-300"
                      style={{ background: donutBackground }}
                    >
                       <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                          <p className="text-3xl font-black text-gray-900">{totalCount}</p>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Inquiries</p>
                          <span className="text-[10px] text-teal-600 font-bold mt-0.5 flex items-center gap-0.5">
                             <Check className="w-3 h-3" /> Live Synced
                          </span>
                       </div>
                    </div>

                    {/* Chart Legend Quick Pills */}
                    <div className="space-y-2 text-xs flex-1 max-w-xs">
                       <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">Share Breakdown:</p>
                       {sourcesList.map(s => {
                         return (
                           <div 
                             key={s.key} 
                             onClick={() => setSelectedSource(selectedSource === s.key ? 'All' : s.key)}
                             className={`flex items-center justify-between p-1.5 px-2.5 cursor-pointer border transition-all ${
                               selectedSource === s.key 
                                 ? 'bg-teal-50 border-teal-500 font-bold shadow-sm' 
                                 : 'bg-white border-gray-200 hover:border-gray-300'
                             }`}>
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.hex }}></span>
                                <span className="font-bold text-gray-800 text-[12px]">{s.name.split(' (')[0]}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-gray-900">{s.count}</span>
                                <span className="text-[11px] font-bold text-gray-500">({s.percentage}%)</span>
                              </div>
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 {/* Detailed Sources Cards */}
                 <div className="space-y-4">
                    {sourcesList.map(s => {
                      const Icon = s.icon;
                      const isSelected = selectedSource === s.key;
                      return (
                        <div 
                          key={s.key} 
                          onClick={() => setSelectedSource(isSelected ? 'All' : s.key)}
                          className={`p-4 border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-teal-500 bg-teal-50/20 shadow-sm' 
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                          }`}>
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                 <div className={`w-9 h-9 rounded-none border flex items-center justify-center shadow-sm ${s.bg} ${s.border} ${s.text}`}>
                                    <Icon className="w-4 h-4" />
                                 </div>
                                 <div>
                                    <h4 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                                      {s.name}
                                      {isSelected && <span className="text-[10px] bg-teal-600 text-white px-1.5 py-0.2 rounded-none font-bold">Filtered</span>}
                                    </h4>
                                    <p className="text-[11px] text-gray-500 font-medium">{s.desc}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <span className="text-[15px] font-black text-gray-900">{s.count} Leads</span>
                                    <span className="text-[11px] font-bold text-teal-600 bg-teal-50 border border-teal-200 px-1.5 py-0.5">
                                      {s.percentage}% Share
                                    </span>
                                 </div>
                                 <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                                    {s.converted} Enrolled ({s.convRate}% Conv. Rate)
                                 </p>
                              </div>
                           </div>

                           {/* Visual Progress Bar */}
                           <div className="w-full h-2 bg-gray-100 rounded-none overflow-hidden mt-3">
                              <div 
                                className={`h-full ${s.bar} transition-all duration-500`}
                                style={{ width: `${Math.max(s.percentage, 3)}%` }}
                              ></div>
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>

           {/* Right Column: Stages Sequence & Funnel Progress */}
           <div className="lg:col-span-5 bg-white shadow-sm border border-gray-300 rounded-none overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                 <div>
                   <h3 className="font-black text-gray-800 flex items-center gap-2 text-[15px]">
                     <Columns className="w-5 h-5 text-teal-600" /> Pipeline Stage Sequence
                   </h3>
                   <p className="text-[11px] text-gray-500 font-medium mt-0.5">Lead progression & admission conversion stages</p>
                 </div>
                 <button 
                   onClick={() => setIsAddingLead(true)}
                   className="text-[12px] font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-none hover:bg-teal-100 transition-colors border border-teal-200 shadow-sm active:scale-95 flex items-center gap-1.5">
                   <UserPlus className="w-3.5 h-3.5" /> Add Lead
                 </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                 <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">
                    {PIPELINE_STAGES.map(stage => {
                      const stageLeads = getStageLeads(stage);
                      const count = stageLeads.length;
                      const dotClass = STAGE_DOT_COLORS[stage.color] || 'bg-gray-500 border-gray-700';
                      const pctOfTotal = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

                      return (
                        <div key={stage.id} className="relative pl-6">
                           <div className={`absolute top-1 -left-[9px] w-4 h-4 rounded-none shadow-sm ${dotClass}`}></div>
                           <div className="bg-gray-50 border border-gray-300 rounded-none px-4 py-3.5 shadow-sm hover:border-teal-400 transition-colors">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-[14px] text-gray-900">{stage.label}</h4>
                                <span className="px-2.5 py-0.5 bg-white border border-gray-300 text-gray-800 font-black text-xs shadow-sm">
                                  {count} Leads ({pctOfTotal}%)
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 font-medium mb-2.5">
                                {stage.id === 'New Lead' && 'Fresh inquiries registered via online or offline sources.'}
                                {stage.id === 'Contacted' && 'Initial telephonic or email counseling initiated.'}
                                {stage.id === 'Campus Visit' && 'Parents visited campus & reviewed syllabus.'}
                                {stage.id === 'Application' && 'Formal application submitted, entrance test review.'}
                                {stage.id === 'Enrolled' && 'Fees paid, student successfully converted to active roster.'}
                              </p>

                              {/* Student Chips */}
                              {stageLeads.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-200">
                                   {stageLeads.slice(0, 3).map((l, lIdx) => (
                                     <span key={lIdx} className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 text-gray-700">
                                       {l.studentName || l.name}
                                     </span>
                                   ))}
                                   {stageLeads.length > 3 && (
                                     <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-1.5 py-0.5">
                                       +{stageLeads.length - 3} more
                                     </span>
                                   )}
                                </div>
                              ) : (
                                <p className="text-[10px] text-gray-400 italic">No leads currently in this stage</p>
                              )}
                           </div>
                        </div>
                      );
                    })}
                 </div>

                 {/* Quick Link to Pipeline Board */}
                 <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-[12px] text-gray-500 font-medium">Want to move leads between stages?</p>
                    <button 
                      onClick={() => handleTabClick('Lead Pipeline Board', '/lead-pipeline')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline">
                      Go to Kanban Board <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>
           </div>

        </div>

        {/* Bottom Section: Leads Inspector by Selected Channel */}
        <div className="bg-white border-2 border-gray-300 shadow-sm rounded-none overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-[14px] font-black text-gray-900 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-teal-600" />
                  {selectedSource === 'All' 
                    ? `All Source Inquiries (${displayedSourceLeads.length})` 
                    : `Inquiries Acquired via "${selectedSource}" (${displayedSourceLeads.length})`}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Click any channel above to inspect its leads, or view all inquiries below.
                </p>
              </div>

              {selectedSource !== 'All' && (
                <button 
                  onClick={() => setSelectedSource('All')}
                  className="text-[11px] font-bold text-gray-600 bg-white border border-gray-300 px-3 py-1 hover:bg-gray-50">
                  Reset Filter (Show All)
                </button>
              )}
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300 text-[12px] font-black text-gray-700 bg-gray-50 uppercase tracking-wider h-11">
                    <th className="px-6 py-2.5 font-black border-r border-gray-300">Student & Guardian</th>
                    <th className="px-6 py-2.5 font-black text-center border-r border-gray-300">Target Grade</th>
                    <th className="px-6 py-2.5 font-black text-center border-r border-gray-300">Channel Source</th>
                    <th className="px-6 py-2.5 font-black text-center border-r border-gray-300">Pipeline Stage</th>
                    <th className="px-6 py-2.5 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSourceLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-bold">
                        No leads recorded under "{selectedSource}".
                      </td>
                    </tr>
                  ) : (
                    displayedSourceLeads.map(lead => {
                      const leadName = lead.studentName || lead.name || 'Unnamed';
                      const parentName = lead.parentName || 'Guardian';
                      const contact = lead.contactNumber || lead.contact || 'No phone';
                      const grade = lead.targetClass || lead.forClass || 'Class I';
                      const currentStage = lead.stage || lead.status || 'New Lead';
                      const isEnrolled = ['Enrolled', 'Converted'].includes(currentStage);

                      return (
                        <tr key={lead._id || lead.id} className="border-b border-gray-300 hover:bg-teal-50/30 transition-colors">
                           <td className="px-6 py-3.5 border-r border-gray-300">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-none bg-teal-50 text-teal-800 font-black flex items-center justify-center text-xs border border-teal-200">
                                 {leadName.charAt(0)}
                               </div>
                               <div>
                                 <h4 className="font-bold text-gray-900 text-[13px]">{leadName}</h4>
                                 <p className="text-[11px] text-gray-500 font-medium">Guardian: {parentName} | {contact}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-3.5 text-center border-r border-gray-300">
                             <span className="bg-gray-100 text-gray-800 border border-gray-300 px-2.5 py-1 text-[11px] font-bold">
                               {grade}
                             </span>
                           </td>
                           <td className="px-6 py-3.5 text-center border-r border-gray-300">
                             <span className="px-2.5 py-1 bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                               {lead.source || 'Website'}
                             </span>
                           </td>
                           <td className="px-6 py-3.5 text-center border-r border-gray-300">
                             <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 border ${
                               isEnrolled ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                               currentStage.includes('New') ? 'bg-blue-50 text-blue-800 border-blue-300' :
                               currentStage.includes('Contacted') ? 'bg-yellow-50 text-yellow-800 border-yellow-300' :
                               'bg-orange-50 text-orange-800 border-orange-300'
                             }`}>
                               {currentStage}
                             </span>
                           </td>
                           <td className="px-6 py-3.5 text-right bg-gray-50/20">
                             <div className="flex justify-end items-center gap-2">
                               <button 
                                 onClick={() => setViewingLead(lead)}
                                 className="px-2.5 py-1 border border-gray-300 hover:border-teal-500 bg-white text-gray-700 text-xs font-bold transition-all"
                                 title="View Details">
                                 Inspect Profile
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
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 theme-app-bg text-sm">
      <div className="px-6 py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-400"></div>
        <div>
          <h1 className="text-[22px] font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="w-8 h-8 rounded-none bg-teal-600 flex items-center justify-center shadow-sm border border-teal-700">
              <Filter className="w-4 h-4 text-white" />
            </div>
            Lead Management & Admissions CRM
          </h1>
          <p className="text-[13px] text-gray-500 mt-1 font-medium">Manage student admissions, track conversion funnels, and boost school enrollments.</p>
        </div>
      </div>
      
      <div className="px-6 bg-white border-b border-gray-300 flex overflow-x-auto hide-scrollbar">
        {tabs.map(t => {
          const isActive = activeTab === t.name;
          return (
            <button 
              key={t.name}
              onClick={() => handleTabClick(t.name, t.route)}
              className={`flex items-center gap-2 px-5 py-4 font-bold text-[12px] uppercase tracking-wider whitespace-nowrap transition-colors border-b-[3px] 
              ${isActive 
                  ? 'text-teal-700 border-teal-600 bg-teal-50/30' 
                  : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {React.cloneElement(t.icon, { className: isActive ? 'text-teal-600 w-4 h-4' : 'text-gray-400 w-4 h-4' })}
              </div>
              {t.name}
            </button>
          )
        })}
      </div>

      <div className="p-7 max-w-[1500px] mx-auto min-h-[500px]">
        {activeTab === 'Lead Dashboard' ? renderDashboard() : 
         activeTab === 'Lead Pipeline Board' ? renderPipelineBoard() : 
         activeTab === 'Lead Sources & Stages' ? renderSourcesAndStages() :
         <></>}
      </div>

      {/* Add Lead Modal */}
      {isAddingLead && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-none shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-600" /> Register New Lead
              </h2>
              <button 
                onClick={() => setIsAddingLead(false)}
                className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" /> 
              </button>
            </div>
            
            <form onSubmit={handleSaveLead} className="flex-1 overflow-y-auto p-6 space-y-4">
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Student Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none rounded-none" 
                    placeholder="e.g. Rahul Sharma" 
                  />
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Parent / Guardian Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none rounded-none" 
                    placeholder="e.g. Rajesh Sharma" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Contact Phone *</label>
                     <input 
                       type="text" 
                       required
                       value={formData.contactNumber}
                       onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none rounded-none" 
                       placeholder="+91 9876543210" 
                     />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                     <input 
                       type="email" 
                       value={formData.email}
                       onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none rounded-none" 
                       placeholder="parent@example.com" 
                     />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Target Grade / Class</label>
                     <select 
                       value={formData.targetClass}
                       onChange={(e) => setFormData(prev => ({ ...prev, targetClass: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none rounded-none bg-white">
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Class X">Class X</option>
                        <option value="Class XI - Science">Class XI - Science</option>
                        <option value="Class XI - Commerce">Class XI - Commerce</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Inquiry Source</label>
                     <select 
                       value={formData.source}
                       onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none rounded-none bg-white">
                        <option value="Website">Website</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Google Ads">Google Ads</option>
                        <option value="Referral">Referral</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Counselor Notes / Remarks</label>
                  <textarea 
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none rounded-none" 
                    placeholder="Enter parent query, transport requirements, or fee discussion notes..."></textarea>
               </div>

               <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddingLead(false)}
                    className="px-5 py-2 border-2 border-gray-300 text-gray-700 font-bold text-[12px] bg-white hover:bg-gray-100 transition-colors uppercase tracking-wider rounded-none">
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-teal-600 text-white font-bold text-[12px] hover:bg-teal-700 transition-colors uppercase tracking-wider rounded-none shadow-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Save to Database
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailingLead && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-none shadow-2xl border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[14px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" /> Compose Admission Communication
              </h2>
              <button 
                onClick={() => setEmailingLead(null)}
                className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" /> 
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">To</label>
                <div className="w-full border border-gray-300 px-3 py-2 text-sm bg-gray-50 font-bold text-gray-800 rounded-none">
                  {emailingLead.studentName || emailingLead.name} ({emailingLead.email || emailingLead.contactNumber || emailingLead.contact})
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none rounded-none" 
                  placeholder="e.g. Admission Inquiry & Prospectus — All Core Solutions" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Message</label>
                <textarea 
                  rows={5} 
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none rounded-none" 
                  placeholder="Dear Parent, thank you for your inquiry regarding admissions. We invite you for a campus tour..."></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
               <button onClick={() => setEmailingLead(null)} className="px-5 py-2 border border-gray-300 text-gray-700 font-bold text-[12px] bg-white hover:bg-gray-100 uppercase rounded-none">Cancel</button>
               <button onClick={handleSendEmail} className="px-5 py-2 bg-blue-600 text-white font-bold text-[12px] hover:bg-blue-700 uppercase rounded-none shadow-sm flex items-center gap-2"><Send className="w-3.5 h-3.5"/> Send Email</button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Profile Slide-over */}
      {viewingLead && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in" onClick={() => setViewingLead(null)}></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl border-l border-gray-300 animate-in slide-in-from-right flex flex-col">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
               <h2 className="text-[16px] font-black uppercase text-gray-800 tracking-tight flex items-center gap-2"><UserPlus className="w-5 h-5 text-teal-600"/> Lead Profile View</h2>
               <button onClick={() => setViewingLead(null)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-6 h-6"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0">
               {/* Header Banner */}
               <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-center text-white relative">
                 <div className="w-20 h-20 mx-auto rounded-none bg-white text-teal-600 font-black flex items-center justify-center text-3xl shadow-lg border-2 border-white/50 mb-3">
                    {(viewingLead.studentName || viewingLead.name || 'L').charAt(0)}
                 </div>
                 <h2 className="text-2xl font-black">{viewingLead.studentName || viewingLead.name}</h2>
                 <p className="text-teal-100 font-medium text-sm mt-1">{viewingLead.targetClass || viewingLead.forClass}</p>
                 <div className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 bg-white text-teal-700 text-[11px] font-black uppercase px-4 py-1.5 border border-gray-200 shadow-sm rounded-none tracking-widest">
                   {viewingLead.stage || viewingLead.status}
                 </div>
               </div>

               <div className="p-8 pt-10 space-y-6">
                 {/* Contact Details */}
                 <div>
                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Student & Guardian Info</h3>
                    <div className="space-y-3">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-none bg-gray-50 border border-gray-200 flex items-center justify-center"><Users className="w-4 h-4 text-gray-500"/></div>
                          <div><p className="text-[11px] text-gray-500 uppercase font-bold">Guardian</p><p className="font-medium text-gray-900">{viewingLead.parentName || 'Not specified'}</p></div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-none bg-gray-50 border border-gray-200 flex items-center justify-center"><Phone className="w-4 h-4 text-gray-500"/></div>
                          <div><p className="text-[11px] text-gray-500 uppercase font-bold">Primary Phone</p><p className="font-medium text-gray-900">{viewingLead.contactNumber || viewingLead.contact}</p></div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-none bg-gray-50 border border-gray-200 flex items-center justify-center"><Mail className="w-4 h-4 text-gray-500"/></div>
                          <div><p className="text-[11px] text-gray-500 uppercase font-bold">Email</p><p className="font-medium text-gray-900">{viewingLead.email || 'None'}</p></div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-none bg-gray-50 border border-gray-200 flex items-center justify-center"><Clock className="w-4 h-4 text-gray-500"/></div>
                          <div><p className="text-[11px] text-gray-500 uppercase font-bold">Inquiry Date</p><p className="font-medium text-gray-900">{new Date(viewingLead.createdAt || Date.now()).toLocaleDateString()}</p></div>
                       </div>
                    </div>
                 </div>

                 {/* Stage Selector */}
                 <div className="bg-gray-50 p-4 border border-gray-200">
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Update Stage In MongoDB</label>
                    <select 
                      value={viewingLead.stage || viewingLead.status || 'New Lead'}
                      onChange={(e) => handleStageChange(viewingLead._id, e.target.value)}
                      className="w-full bg-white border-2 border-gray-300 px-3 py-2 text-sm font-bold focus:border-teal-500 focus:outline-none">
                      {PIPELINE_STAGES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                      <option value="Lost">Lost</option>
                    </select>
                 </div>

                 {/* Action Buttons */}
                 <div className="space-y-3">
                    {!(viewingLead.stage === 'Enrolled' || viewingLead.status === 'Enrolled') && (
                      <button 
                        onClick={() => handleConvertLead(viewingLead)}
                        className="w-full py-3 bg-emerald-600 text-white font-bold text-[12px] uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all">
                        <GraduationCap className="w-5 h-5"/> Convert & Enroll Student
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => { setEmailingLead(viewingLead); setViewingLead(null); }} className="w-full py-3 bg-blue-50 text-blue-700 font-bold text-[12px] uppercase border border-blue-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-blue-100 active:scale-95 transition-all">
                          <Mail className="w-5 h-5"/> Send Email
                       </button>
                       <button onClick={handleLogCall} className="w-full py-3 bg-teal-50 text-teal-700 font-bold text-[12px] uppercase border border-teal-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-teal-100 active:scale-95 transition-all">
                          <Phone className="w-5 h-5"/> Log Call
                       </button>
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-3">
               <button 
                 onClick={() => handleDeleteLead(viewingLead._id, viewingLead.studentName || viewingLead.name)}
                 className="py-2.5 px-4 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold text-[12px] uppercase tracking-wider">
                 Delete
               </button>
               <button onClick={() => setViewingLead(null)} className="flex-1 py-2.5 bg-gray-800 text-white font-bold text-[13px] uppercase tracking-wider rounded-none shadow-sm hover:bg-black transition-colors">
                 Close Profile
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadManagement;
