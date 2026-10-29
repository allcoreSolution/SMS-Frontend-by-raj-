import React, { useState, useEffect } from 'react';
import { 
  Plus, BookOpen, Layers, Edit, Video, 
  Calendar, Search, ChevronDown, Eye, Trash2, DownloadCloud,
  FileText, CheckCircle, Clock, ExternalLink, RefreshCw, X, ArrowUpDown, Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { studyService } from '../api/studyService';
import { academicService } from '../api/academicService';
import axiosInstance from '../api/axios';

const Classwork = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Classwork & Logbook');
  const [loading, setLoading] = useState(false);

  // Metadata
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Data
  const [entries, setEntries] = useState([]);
  const [resources, setResources] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [liveList, setLiveList] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Resource Modals
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Form States
  const [entryForm, setEntryForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: 'Classwork',
    topicTaught: '',
    className: 'Class X',
    sectionName: 'Section A',
    subjectName: 'Mathematics',
    period: 1,
    teacherName: '',
    classworkSummary: '',
    homeworkAssigned: '',
    attendanceCount: 38,
    totalStudents: 42,
    attachment: null
  });

  const [resourceForm, setResourceForm] = useState({
    title: '',
    className: 'Class X',
    subjectName: 'Mathematics',
    materialType: 'PDF',
    description: '',
    fileUrl: '',
    tags: '',
    attachment: null
  });

  const tabs = [
    { name: 'Classwork & Logbook', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Manage Resources', icon: <Layers className="w-4 h-4" /> },
    { name: 'Homework & Assignments', icon: <Edit className="w-4 h-4" /> },
    { name: 'Live Classes', icon: <Video className="w-4 h-4" /> },
  ];

  // Initial Data Fetch
  useEffect(() => {
    fetchMetadata();
    fetchAllData();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [clsRes, secRes, subRes] = await Promise.all([
        academicService.getClasses().catch(() => ({ success: false })),
        academicService.getSections().catch(() => ({ success: false })),
        academicService.getSubjects().catch(() => ({ success: false }))
      ]);

      if (clsRes.success && clsRes.data?.length > 0) setClasses(clsRes.data);
      if (secRes.success && secRes.data?.length > 0) setSections(secRes.data);
      if (subRes.success && subRes.data?.length > 0) setSubjects(subRes.data);
    } catch (e) {
      console.error('Error fetching academic metadata', e);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [cwRes, resRes, hwRes] = await Promise.all([
        studyService.getClasswork().catch(() => ({ success: false, data: [] })),
        studyService.getResources().catch(() => ({ success: false, data: [] })),
        studyService.getHomework().catch(() => ({ success: false, data: [] }))
      ]);

      if (cwRes.success && cwRes.data) setEntries(cwRes.data);
      if (resRes.success && resRes.data) setResources(resRes.data);
      if (hwRes.success && hwRes.data) setHomeworkList(hwRes.data);

      // Fetch live classes
      try {
        const liveRes = await axiosInstance.get('/live-classes');
        if (liveRes.data?.success && liveRes.data.data) {
          setLiveList(liveRes.data.data);
        }
      } catch {
        // Fallback or leave empty
      }
    } catch (error) {
      console.error('Error fetching study center data', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Filtered Entries ---
  const filteredEntries = entries.filter(e => {
    const s = searchTerm.toLowerCase();
    const searchMatch = !searchTerm || 
      (e.topicTaught && e.topicTaught.toLowerCase().includes(s)) ||
      (e.classworkSummary && e.classworkSummary.toLowerCase().includes(s)) ||
      (e.teacherName && e.teacherName.toLowerCase().includes(s)) ||
      (e.subjectName && e.subjectName.toLowerCase().includes(s)) ||
      (e.className && e.className.toLowerCase().includes(s));

    const clsPart = classFilter.replace('Class ', '').trim();
    const classMatch = classFilter === 'All Classes' || 
      (e.className && (e.className === classFilter || e.className.includes(clsPart)));

    const typeMatch = typeFilter === 'All' || (e.type && e.type.toLowerCase() === typeFilter.toLowerCase());

    let dateMatch = true;
    if (dateFilter && e.date) {
      const entryDateStr = new Date(e.date).toISOString().slice(0, 10);
      dateMatch = entryDateStr === dateFilter;
    }

    return searchMatch && classMatch && typeMatch && dateMatch;
  });

  // --- Filtered Resources ---
  const filteredResources = resources.filter(r => {
    const s = searchTerm.toLowerCase();
    const searchMatch = !searchTerm ||
      (r.title && r.title.toLowerCase().includes(s)) ||
      (r.description && r.description.toLowerCase().includes(s)) ||
      (r.subjectName && r.subjectName.toLowerCase().includes(s)) ||
      (r.tags && r.tags.some(tag => tag.toLowerCase().includes(s)));

    const clsPart = classFilter.replace('Class ', '').trim();
    const classMatch = classFilter === 'All Classes' || 
      (r.className && (r.className === classFilter || r.className.includes(clsPart)));

    const typeMatch = resourceTypeFilter === 'All' || r.materialType === resourceTypeFilter;

    return searchMatch && classMatch && typeMatch;
  });

  // --- Handlers: Classwork & Logbook CRUD ---
  const handleOpenAddModal = () => {
    setEntryForm({
      date: new Date().toISOString().slice(0, 10),
      type: 'Classwork',
      topicTaught: '',
      className: classes.length > 0 ? classes[0].className : 'Class X',
      sectionName: sections.length > 0 ? sections[0].sectionName : 'Section A',
      subjectName: subjects.length > 0 ? subjects[0].subjectName : 'Mathematics',
      period: 1,
      teacherName: (JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Teacher Faculty'),
      classworkSummary: '',
      homeworkAssigned: '',
      attendanceCount: 38,
      totalStudents: 42,
      attachment: null
    });
    setShowAddModal(true);
  };

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    if (!entryForm.topicTaught || !entryForm.classworkSummary) {
      Swal.fire('Required Fields', 'Please fill in Topic and Classwork Summary.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(entryForm).forEach(key => {
        if (key === 'attachment') {
          if (entryForm.attachment) fd.append('attachment', entryForm.attachment);
        } else {
          fd.append(key, entryForm[key]);
        }
      });

      const res = await studyService.createClasswork(fd);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Entry Saved!',
          text: 'Classwork / logbook record has been created successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowAddModal(false);
        const refRes = await studyService.getClasswork();
        if (refRes.success) setEntries(refRes.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save entry. ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (entry) => {
    setSelectedEntry(entry);
    setEntryForm({
      date: entry.date ? new Date(entry.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      type: entry.type || 'Classwork',
      topicTaught: entry.topicTaught || '',
      className: entry.className || 'Class X',
      sectionName: entry.sectionName || 'Section A',
      subjectName: entry.subjectName || 'Mathematics',
      period: entry.period || 1,
      teacherName: entry.teacherName || (JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Teacher Faculty'),
      classworkSummary: entry.classworkSummary || '',
      homeworkAssigned: entry.homeworkAssigned || '',
      attendanceCount: entry.attendanceCount || 38,
      totalStudents: entry.totalStudents || 42,
      attachment: null
    });
    setShowEditModal(true);
  };

  const handleUpdateEntry = async (e) => {
    e.preventDefault();
    if (!selectedEntry) return;

    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(entryForm).forEach(key => {
        if (key === 'attachment') {
          if (entryForm.attachment) fd.append('attachment', entryForm.attachment);
        } else {
          fd.append(key, entryForm[key]);
        }
      });

      const res = await studyService.updateClasswork(selectedEntry._id, fd);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Entry Updated!',
          text: 'Classwork log entry updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowEditModal(false);
        setSelectedEntry(null);
        const refRes = await studyService.getClasswork();
        if (refRes.success) setEntries(refRes.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update entry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this Logbook Entry?',
      text: 'This action will permanently delete the classwork record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await studyService.deleteClasswork(id);
        if (res.success) {
          Swal.fire('Deleted!', 'Classwork record deleted.', 'success');
          setEntries(entries.filter(e => e._id !== id));
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete record.', 'error');
      }
    }
  };

  // --- Handlers: Resources CRUD ---
  const handleOpenAddResource = () => {
    setResourceForm({
      title: '',
      className: classes.length > 0 ? classes[0].className : 'Class X',
      subjectName: subjects.length > 0 ? subjects[0].subjectName : 'Mathematics',
      materialType: 'PDF',
      description: '',
      fileUrl: '',
      tags: '',
      attachment: null
    });
    setShowAddResourceModal(true);
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!resourceForm.title) {
      Swal.fire('Required', 'Please enter resource title.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(resourceForm).forEach(key => {
        if (key === 'attachment') {
          if (resourceForm.attachment) fd.append('attachment', resourceForm.attachment);
        } else {
          fd.append(key, resourceForm[key]);
        }
      });

      const res = await studyService.createResource(fd);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Resource Uploaded!',
          text: 'Study resource has been uploaded successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowAddResourceModal(false);
        const refRes = await studyService.getResources();
        if (refRes.success) setResources(refRes.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to upload resource.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditResource = (resource) => {
    setSelectedResource(resource);
    setResourceForm({
      title: resource.title || '',
      className: resource.className || 'Class X',
      subjectName: resource.subjectName || 'Mathematics',
      materialType: resource.materialType || 'PDF',
      description: resource.description || '',
      fileUrl: resource.fileUrl || '',
      tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : '',
      attachment: null
    });
    setShowEditResourceModal(true);
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    if (!selectedResource) return;

    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(resourceForm).forEach(key => {
        if (key === 'attachment') {
          if (resourceForm.attachment) fd.append('attachment', resourceForm.attachment);
        } else {
          fd.append(key, resourceForm[key]);
        }
      });

      const res = await studyService.updateResource(selectedResource._id, fd);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Resource Updated!',
          text: 'Study material details updated.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowEditResourceModal(false);
        setSelectedResource(null);
        const refRes = await studyService.getResources();
        if (refRes.success) setResources(refRes.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update resource.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this Resource?',
      text: 'This action will permanently remove the study material.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await studyService.deleteResource(id);
        if (res.success) {
          Swal.fire('Deleted!', 'Study resource deleted.', 'success');
          setResources(resources.filter(r => r._id !== id));
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete resource.', 'error');
      }
    }
  };

  const handleDownloadResource = async (r) => {
    try {
      await studyService.downloadResource(r._id);
      // update local state download counter
      setResources(prev => prev.map(item => item._id === r._id ? { ...item, downloadsCount: (item.downloadsCount || 0) + 1 } : item));

      // open url
      let url = r.fileUrl;
      if (url.startsWith('uploads/')) {
        url = `http://localhost:5050/${url}`;
      }
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
      window.open(r.fileUrl, '_blank');
    }
  };

  // --- Export Utilities ---
  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Topic', 'Class', 'Section', 'Subject', 'Teacher', 'Summary'];
    const rows = filteredEntries.map(e => [
      e.date ? new Date(e.date).toLocaleDateString() : '',
      e.type || 'Classwork',
      `"${(e.topicTaught || '').replace(/"/g, '""')}"`,
      `"${e.className || ''}"`,
      `"${e.sectionName || ''}"`,
      `"${e.subjectName || ''}"`,
      `"${e.teacherName || ''}"`,
      `"${(e.classworkSummary || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Classwork_Logbook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Tab Content Rendering ---
  const renderTabContent = () => {
    if (activeTab === 'Manage Resources') {
      return (
        <div className="space-y-5 animate-in fade-in">
          {/* Filters & Actions Header */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <div className="min-w-[160px]">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Class Filter</label>
                <select 
                  value={classFilter} 
                  onChange={e => setClassFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
                >
                  <option value="All Classes">All Classes</option>
                  {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                </select>
              </div>

              <div className="min-w-[140px]">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Material Type</label>
                <select 
                  value={resourceTypeFilter} 
                  onChange={e => setResourceTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
                >
                  <option value="All">All Types</option>
                  <option value="PDF">PDF Document</option>
                  <option value="Video">Video</option>
                  <option value="Doc">Word / Doc</option>
                  <option value="E-Book">E-Book</option>
                  <option value="Link">Web Link</option>
                </select>
              </div>

              <div className="min-w-[200px] flex-1 max-w-xs">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Search Resources</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by title, tags, description..."
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleOpenAddResource}
              className="bg-[#008cba] hover:bg-[#007399] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Upload Study Material
            </button>
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#008cba] px-5 py-3 flex justify-between items-center text-white">
              <h2 className="font-bold text-[14px] flex items-center gap-2">
                <Layers className="w-4 h-4 fill-white" /> Learning Resources & Study Materials ({filteredResources.length})
              </h2>
            </div>
            
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Resource Title</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Type & Size</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Class & Subject</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Uploaded By</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700 text-center">Downloads</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResources.length > 0 ? (
                    filteredResources.map(r => (
                      <tr key={r._id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-gray-800 text-[13px]">{r.title}</p>
                          {r.description && <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{r.description}</p>}
                          {r.tags && r.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {r.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-[12px]">
                          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            r.materialType === 'PDF' ? 'bg-red-50 text-red-600 border border-red-200' :
                            r.materialType === 'Video' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                            r.materialType === 'Doc' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          }`}>
                            {r.materialType}
                          </span>
                          <span className="text-gray-400 text-[11px] ml-1.5">{r.fileSize || 'Standard'}</span>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] font-medium text-gray-700">
                          {r.className} • <span className="text-blue-600">{r.subjectName}</span>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-gray-600">
                          {r.authorTeacher || 'Academic Faculty'}
                        </td>
                        <td className="px-4 py-3.5 text-center text-[12px] font-mono font-bold text-gray-700">
                          {r.downloadsCount || 0}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => handleDownloadResource(r)}
                              title="Download / View"
                              className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                            >
                              <DownloadCloud className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleOpenEditResource(r)}
                              title="Edit Material"
                              className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteResource(r._id)}
                              title="Delete Material"
                              className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-xs">
                        No study resources found matching the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Homework & Assignments') {
      return (
        <div className="space-y-5 animate-in fade-in">
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-800 text-base">Homework & Assignments Center</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage tasks assigned to students across classes and check submissions.</p>
            </div>
            <button 
              onClick={() => navigate('/assignments')} 
              className="bg-[#fd7e14] hover:bg-[#e86a0b] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Full Assignments Portal
            </button>
          </div>

          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#fd7e14] px-5 py-3 flex justify-between items-center text-white">
              <h2 className="font-bold text-[14px] flex items-center gap-2">
                <Edit className="w-4 h-4 fill-white" /> Recent Assignments & Worksheets
              </h2>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Assignment Title</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Class & Subject</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Due Date</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Submissions</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {homeworkList.map(h => (
                    <tr key={h._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-[#008cba] text-[13px]">{h.title}</p>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{h.description}</p>
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-gray-700 font-medium">
                        {h.className} {h.sectionName ? `(${h.sectionName})` : ''} • {h.subjectName}
                      </td>
                      <td className="px-4 py-3.5 text-[12px] font-medium text-gray-700">
                        {h.dueDate ? new Date(h.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3.5 text-[12px] font-mono font-bold text-gray-700">
                        {h.submissionCount || 0} / {h.totalStudents || 40}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 text-[11px] rounded font-bold uppercase ${
                          h.status === 'Active' ? 'bg-green-100 text-green-700' :
                          h.status === 'Closed' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {h.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Live Classes') {
      return (
        <div className="space-y-5 animate-in fade-in">
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-800 text-base">Live Interactive Classrooms</h2>
              <p className="text-xs text-gray-500 mt-0.5">Start Zoom or Google Meet sessions directly for scheduled classes.</p>
            </div>
            <button 
              onClick={() => navigate('/live/manage')} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Manage Live Class Schedules
            </button>
          </div>

          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-purple-600 px-5 py-3 flex justify-between items-center text-white">
              <h2 className="font-bold text-[14px] flex items-center gap-2">
                <Video className="w-4 h-4 fill-white" /> Scheduled Live Sessions
              </h2>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Class Topic</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Platform</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Class & Subject</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800">Status</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-800 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {liveList.length > 0 ? (
                    liveList.map(l => (
                      <tr key={l._id} className="hover:bg-purple-50/20">
                        <td className="px-4 py-3.5 text-[13px] font-bold text-gray-800">{l.title || l.topic}</td>
                        <td className="px-4 py-3.5 text-[12px] font-semibold text-purple-700">{l.platform || 'Zoom Meeting'}</td>
                        <td className="px-4 py-3.5 text-[12px] text-gray-600">{l.className || 'Class X'} - {l.subject || 'All Subjects'}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded ${
                            l.status === 'Live' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {l.status || 'Scheduled'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {l.meetingUrl || l.joinUrl ? (
                            <a 
                              href={l.meetingUrl || l.joinUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                            >
                              Join Meet <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <button onClick={() => navigate('/live/manage')} className="text-purple-600 font-bold hover:underline text-xs">
                              Open Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-xs">
                        No live classes currently scheduled. You can schedule one from the Live Classes module.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Default: Classwork & Daily Teacher Logbook
    return (
      <div className="space-y-5 animate-in fade-in">
        {/* Filter Area */}
        <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-3 items-end flex-1">
            <div className="min-w-[150px]">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Filter By Class</label>
              <select 
                value={classFilter}
                onChange={e => setClassFilter(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
              >
                <option value="All Classes">All Classes</option>
                {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
              </select>
            </div>

            <div className="min-w-[130px]">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Entry Type</label>
              <select 
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
              >
                <option value="All">All Types</option>
                <option value="Classwork">Classwork</option>
                <option value="Logbook">Logbook</option>
                <option value="Assignment">Assignment</option>
              </select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Date</label>
              <div className="flex items-center gap-1">
                <input 
                  type="date"
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400" 
                />
                {dateFilter && (
                  <button 
                    onClick={() => setDateFilter('')}
                    title="Clear date"
                    className="p-1 text-gray-400 hover:text-red-500 border border-gray-300 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={fetchAllData}
            title="Refresh Records"
            className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Main Classwork Table Card */}
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#17a2b8] px-5 py-3 flex justify-between items-center text-white">
            <h2 className="font-bold text-[14px] flex items-center gap-2">
              <BookOpen className="w-4 h-4 fill-white" /> Entries List — Daily Classwork & Teacher Logbook ({filteredEntries.length})
            </h2>
            <button 
              onClick={handleOpenAddModal}
              className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-gray-50"
            >
              <Plus className="w-3.5 h-3.5 text-[#17a2b8]" /> Add New Log
            </button>
          </div>

          <div className="p-5">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center flex-wrap gap-1.5">
                <button 
                  onClick={handleExportCSV}
                  className="px-3 py-1 text-xs border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-50 bg-white"
                >
                  Export CSV
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-3 py-1 text-xs border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-50 bg-white"
                >
                  Print
                </button>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="text-xs text-gray-600 font-semibold">Search:</label>
                <div className="relative w-full md:w-56">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search topics, summary..."
                    className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#17a2b8]" 
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-t border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Topic Taught</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Class & Section</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Teacher</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map(e => (
                      <tr key={e._id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-4 py-3.5 text-[12px] font-medium text-gray-800 whitespace-nowrap">
                          {e.date ? new Date(e.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3.5 text-[12px]">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            e.type === 'Logbook' ? 'bg-purple-100 text-purple-700' :
                            e.type === 'Assignment' ? 'bg-amber-100 text-amber-700' :
                            'bg-teal-100 text-teal-800'
                          }`}>
                            {e.type || 'Classwork'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-[13px]">
                          <p className="font-bold text-gray-800">{e.topicTaught}</p>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{e.classworkSummary}</p>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-gray-700 font-medium">
                          {e.className} {e.sectionName ? `(${e.sectionName})` : ''}
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-gray-600 font-medium">{e.subjectName}</td>
                        <td className="px-4 py-3.5 text-[12px] text-gray-600">{e.teacherName || 'Faculty'}</td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => {
                                setSelectedEntry(e);
                                setShowViewModal(true);
                              }}
                              title="View Details"
                              className="text-gray-500 hover:text-[#008cba] p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleOpenEditModal(e)}
                              title="Edit Entry"
                              className="text-gray-500 hover:text-green-600 p-1 rounded hover:bg-green-50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteEntry(e._id)}
                              title="Delete Entry"
                              className="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-xs bg-gray-50/50">
                        No classwork entries found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-4 flex justify-between items-center text-xs text-gray-500">
              <span>Showing {filteredEntries.length} entries</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      {/* Page Header */}
      <div className="px-6 py-5 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Study Center</h1>
          <p className="text-[13px] text-gray-500 mt-1">Manage syllabus, learning resources, classwork, homework, and live sessions.</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'Classwork & Logbook' && (
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-[#008cba] hover:bg-[#007399] text-white px-4 py-2 rounded shadow-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> Create New Log Entry
            </button>
          )}
          {activeTab === 'Manage Resources' && (
            <button 
              onClick={handleOpenAddResource}
              className="flex items-center gap-2 bg-[#008cba] hover:bg-[#007399] text-white px-4 py-2 rounded shadow-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> Upload Study Material
            </button>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="px-6 bg-white border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        {tabs.map(t => (
          <button 
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`flex items-center gap-2 px-5 py-3.5 font-semibold text-[13px] whitespace-nowrap transition-colors border-b-[3px] ${
              activeTab === t.name 
                ? 'text-[#008cba] border-[#008cba]' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {/* Main Body */}
      <div className="p-6 max-w-[1400px] mx-auto min-h-[500px]">
        {renderTabContent()}
      </div>

      {/* --- MODAL: CREATE CLASSWORK / LOGBOOK ENTRY --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#008cba]" /> Create Daily Classwork / Logbook Entry
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCreateEntry} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date *</label>
                  <input 
                    type="date" 
                    required
                    value={entryForm.date}
                    onChange={e => setEntryForm({...entryForm, date: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Log Type *</label>
                  <select 
                    value={entryForm.type}
                    onChange={e => setEntryForm({...entryForm, type: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Classwork">Classwork</option>
                    <option value="Logbook">Teacher Logbook</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Topic Taught *</label>
                <input 
                  type="text" 
                  required
                  value={entryForm.topicTaught}
                  onChange={e => setEntryForm({...entryForm, topicTaught: e.target.value})}
                  placeholder="e.g. Elimination Method for Linear Equations" 
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class *</label>
                  <select 
                    value={entryForm.className}
                    onChange={e => setEntryForm({...entryForm, className: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                    {classes.length === 0 && <option value="Class X">Class X</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <select 
                    value={entryForm.sectionName}
                    onChange={e => setEntryForm({...entryForm, sectionName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {sections.map(s => <option key={s._id} value={s.sectionName}>{s.sectionName}</option>)}
                    {sections.length === 0 && (
                      <>
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <select 
                    value={entryForm.subjectName}
                    onChange={e => setEntryForm({...entryForm, subjectName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {subjects.map(sub => <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>)}
                    {subjects.length === 0 && (
                      <>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Period</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={entryForm.period}
                    onChange={e => setEntryForm({...entryForm, period: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Present Count</label>
                  <input 
                    type="number"
                    value={entryForm.attendanceCount}
                    onChange={e => setEntryForm({...entryForm, attendanceCount: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Students</label>
                  <input 
                    type="number"
                    value={entryForm.totalStudents}
                    onChange={e => setEntryForm({...entryForm, totalStudents: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Classwork Summary *</label>
                <textarea 
                  required
                  rows="3"
                  value={entryForm.classworkSummary}
                  onChange={e => setEntryForm({...entryForm, classworkSummary: e.target.value})}
                  placeholder="Detail concepts explained, board work, exercises solved, or lab demonstration conducted..." 
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Homework Assigned (Optional)</label>
                <input 
                  type="text"
                  value={entryForm.homeworkAssigned}
                  onChange={e => setEntryForm({...entryForm, homeworkAssigned: e.target.value})}
                  placeholder="e.g. Solve Ex 3.4 Q2 in fair copy."
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Attachment (Document / Worksheet)</label>
                <input 
                  type="file"
                  onChange={e => setEntryForm({...entryForm, attachment: e.target.files[0]})}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 bg-[#008cba] hover:bg-[#007399] text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT CLASSWORK / LOGBOOK ENTRY --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-600" /> Edit Logbook Entry
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleUpdateEntry} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date *</label>
                  <input 
                    type="date" 
                    required
                    value={entryForm.date}
                    onChange={e => setEntryForm({...entryForm, date: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Log Type *</label>
                  <select 
                    value={entryForm.type}
                    onChange={e => setEntryForm({...entryForm, type: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Classwork">Classwork</option>
                    <option value="Logbook">Teacher Logbook</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Topic Taught *</label>
                <input 
                  type="text" 
                  required
                  value={entryForm.topicTaught}
                  onChange={e => setEntryForm({...entryForm, topicTaught: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                  <select 
                    value={entryForm.className}
                    onChange={e => setEntryForm({...entryForm, className: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                    {classes.length === 0 && <option value="Class X">Class X</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <input 
                    type="text" 
                    value={entryForm.sectionName}
                    onChange={e => setEntryForm({...entryForm, sectionName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={entryForm.subjectName}
                    onChange={e => setEntryForm({...entryForm, subjectName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Classwork Summary *</label>
                <textarea 
                  required
                  rows="3"
                  value={entryForm.classworkSummary}
                  onChange={e => setEntryForm({...entryForm, classworkSummary: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Homework Assigned</label>
                <input 
                  type="text"
                  value={entryForm.homeworkAssigned}
                  onChange={e => setEntryForm({...entryForm, homeworkAssigned: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Replace Attachment</label>
                <input 
                  type="file"
                  onChange={e => setEntryForm({...entryForm, attachment: e.target.files[0]})}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" 
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: VIEW CLASSWORK DETAILS --- */}
      {showViewModal && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-teal-50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-teal-600 text-white">
                  {selectedEntry.type || 'Classwork'}
                </span>
                <h2 className="text-base font-bold text-gray-800">
                  {selectedEntry.topicTaught}
                </h2>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded text-xs text-gray-700">
                <div><span className="font-bold text-gray-500">Date:</span> {selectedEntry.date ? new Date(selectedEntry.date).toLocaleDateString() : 'N/A'}</div>
                <div><span className="font-bold text-gray-500">Period:</span> Period {selectedEntry.period || 1}</div>
                <div><span className="font-bold text-gray-500">Class & Sec:</span> {selectedEntry.className} ({selectedEntry.sectionName || 'A'})</div>
                <div><span className="font-bold text-gray-500">Subject:</span> {selectedEntry.subjectName}</div>
                <div><span className="font-bold text-gray-500">Teacher:</span> {selectedEntry.teacherName}</div>
                <div>
                  <span className="font-bold text-gray-500">Attendance:</span> {selectedEntry.attendanceCount || 0}/{selectedEntry.totalStudents || 40} ({Math.round(((selectedEntry.attendanceCount || 0)/(selectedEntry.totalStudents || 40))*100)}%)
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Classwork / Lesson Summary</h4>
                <div className="bg-blue-50/50 border border-blue-100 rounded p-3 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEntry.classworkSummary}
                </div>
              </div>

              {selectedEntry.homeworkAssigned && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Homework Assigned</h4>
                  <div className="bg-amber-50/50 border border-amber-100 rounded p-3 text-xs text-amber-900 leading-relaxed">
                    {selectedEntry.homeworkAssigned}
                  </div>
                </div>
              )}

              {selectedEntry.attachments && selectedEntry.attachments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Attachments</h4>
                  <div className="space-y-1">
                    {selectedEntry.attachments.map((att, idx) => (
                      <a 
                        key={idx}
                        href={att.startsWith('http') ? att : `http://localhost:5050/${att}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded font-medium"
                      >
                        <DownloadCloud className="w-3.5 h-3.5" /> Download Attachment #{idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-1.5 bg-gray-800 text-white rounded text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: UPLOAD STUDY RESOURCE --- */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddResourceModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#008cba]" /> Upload Study Material
              </h2>
              <button onClick={() => setShowAddResourceModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCreateResource} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Resource Title *</label>
                <input 
                  type="text" 
                  required
                  value={resourceForm.title}
                  onChange={e => setResourceForm({...resourceForm, title: e.target.value})}
                  placeholder="e.g. Class 10 Chemistry Balanced Equations & Notes" 
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class *</label>
                  <select 
                    value={resourceForm.className}
                    onChange={e => setResourceForm({...resourceForm, className: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                    {classes.length === 0 && <option value="Class X">Class X</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <select 
                    value={resourceForm.subjectName}
                    onChange={e => setResourceForm({...resourceForm, subjectName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {subjects.map(sub => <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>)}
                    {subjects.length === 0 && <option value="Mathematics">Mathematics</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type *</label>
                  <select 
                    value={resourceForm.materialType}
                    onChange={e => setResourceForm({...resourceForm, materialType: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">Video Stream</option>
                    <option value="Doc">Word Document</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Link">Web Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="2"
                  value={resourceForm.description}
                  onChange={e => setResourceForm({...resourceForm, description: e.target.value})}
                  placeholder="Summary of contents covered in this material..." 
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Upload File OR External URL</label>
                <input 
                  type="file"
                  onChange={e => setResourceForm({...resourceForm, attachment: e.target.files[0]})}
                  className="w-full mb-2 text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" 
                />
                <input 
                  type="text"
                  value={resourceForm.fileUrl}
                  onChange={e => setResourceForm({...resourceForm, fileUrl: e.target.value})}
                  placeholder="Or paste external URL (e.g. YouTube video, Google Drive, Archive.org)"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tags (Comma-separated)</label>
                <input 
                  type="text"
                  value={resourceForm.tags}
                  onChange={e => setResourceForm({...resourceForm, tags: e.target.value})}
                  placeholder="e.g. Formulas, Exam Notes, Practice"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 bg-[#008cba] hover:bg-[#007399] text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  {loading ? 'Uploading...' : 'Save Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT STUDY RESOURCE --- */}
      {showEditResourceModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEditResourceModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-600" /> Edit Study Material
              </h2>
              <button onClick={() => setShowEditResourceModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleUpdateResource} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Resource Title *</label>
                <input 
                  type="text" 
                  required
                  value={resourceForm.title}
                  onChange={e => setResourceForm({...resourceForm, title: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                  <select 
                    value={resourceForm.className}
                    onChange={e => setResourceForm({...resourceForm, className: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                    {classes.length === 0 && <option value="Class X">Class X</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Material Type</label>
                  <select 
                    value={resourceForm.materialType}
                    onChange={e => setResourceForm({...resourceForm, materialType: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">Video Stream</option>
                    <option value="Doc">Word Document</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Link">Web Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="2"
                  value={resourceForm.description}
                  onChange={e => setResourceForm({...resourceForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">External URL</label>
                <input 
                  type="text"
                  value={resourceForm.fileUrl}
                  onChange={e => setResourceForm({...resourceForm, fileUrl: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Replace File</label>
                <input 
                  type="file"
                  onChange={e => setResourceForm({...resourceForm, attachment: e.target.files[0]})}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" 
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditResourceModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Classwork;
