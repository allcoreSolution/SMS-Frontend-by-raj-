import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Image as ImageIcon, Eye, Info, Printer, FileText, 
  Award, CheckCircle, Search, Trash2, Edit, Plus, DownloadCloud, 
  RefreshCw, User, Calendar, ShieldCheck, QrCode, ExternalLink, Filter, Layers, CreditCard
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { certificateService } from '../api/certificateService';
import { academicService } from '../api/academicService';
import { studentService } from '../api/studentService';

const Certificates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Generate Document');
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalTemplates: 8,
    totalIssued: 12,
    studentCertCount: 2,
    meritCount: 10
  });

  // Metadata
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [issuedCertificates, setIssuedCertificates] = useState([]);

  // Generator Form Data
  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    sectionId: '',
    sectionName: '',
    studentId: '',
    studentName: '',
    admissionNo: '',
    rollNo: '',
    fatherName: '',
    templateId: '',
    customRemarks: '',
    issueDate: new Date().toISOString().slice(0, 10),
    layout: 'Landscape',
    archive: true,
    cardSize: 'Standard',
    paper: 'A4 (210 x 297 mm)',
    orientation: 'Landscape',
    margin: '10',
    gap: '3',
    cutMarks: true,
    alignCenter: true
  });

  // Live preview & Modals
  const [previewMode, setPreviewMode] = useState(false);
  const [viewingCert, setViewingCert] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showEditCertModal, setShowEditCertModal] = useState(false);
  const [selectedCertForEdit, setSelectedCertForEdit] = useState(null);

  // New Template Form
  const [newTemplateForm, setNewTemplateForm] = useState({
    title: '',
    type: 'Student',
    layout: 'Landscape',
    paperSize: 'A4',
    schoolName: 'ALL CORE SOLUTIONS',
    schoolAffiliation: 'Affiliated to CBSE, New Delhi | Affiliation No: 2130892',
    schoolAddress: 'Sector 4, Institutional Area, New Delhi - 110001',
    headerSubtitle: 'CERTIFICATE OF ACHIEVEMENT',
    bodyTemplate: 'This is to certify that {{studentName}}, son/daughter of Mr. {{fatherName}}, Roll No: {{rollNo}}, is a student of {{className}} (Section {{sectionName}}).\n\nHe/She has successfully participated and demonstrated excellence during the academic year {{academicYear}}.',
    primaryColor: '#1e3a8a',
    accentColor: '#f59e0b',
    signatoryTitle1: 'Class Teacher',
    signatoryTitle2: 'Principal'
  });

  // Archive Filter
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveTypeFilter, setArchiveTypeFilter] = useState('All');

  // Load initial data
  useEffect(() => {
    fetchMetadata();
    fetchTemplatesAndIssued();
    fetchStats();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [clsRes, secRes] = await Promise.all([
        academicService.getClasses().catch(() => ({ success: false })),
        academicService.getSections().catch(() => ({ success: false }))
      ]);

      if (clsRes.success && clsRes.data?.length > 0) setClasses(clsRes.data);
      if (secRes.success && secRes.data?.length > 0) setSections(secRes.data);
    } catch (e) {
      console.error('Error fetching academic metadata', e);
    }
  };

  const fetchTemplatesAndIssued = async () => {
    setLoading(true);
    try {
      const [tplRes, issuedRes] = await Promise.all([
        certificateService.getTemplates().catch(() => ({ success: false, data: [] })),
        certificateService.getIssuedCertificates().catch(() => ({ success: false, data: [] }))
      ]);

      if (tplRes.success && tplRes.data) {
        setTemplates(tplRes.data);
        if (tplRes.data.length > 0 && !formData.templateId) {
          setFormData(prev => ({
            ...prev,
            templateId: tplRes.data[0].templateId || tplRes.data[0]._id,
            layout: tplRes.data[0].layout || 'Landscape',
            orientation: tplRes.data[0].layout || 'Landscape'
          }));
        }
      }

      if (issuedRes.success && issuedRes.data) {
        setIssuedCertificates(issuedRes.data);
      }
    } catch (e) {
      console.error('Error fetching certificates', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await certificateService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.error('Error fetching stats', e);
    }
  };

  // When class changes, fetch students in that class
  const handleClassChange = async (classId) => {
    const selectedCls = classes.find(c => c._id === classId);
    const className = selectedCls ? selectedCls.className : '';
    setFormData(prev => ({
      ...prev,
      classId,
      className,
      sectionId: '',
      sectionName: '',
      studentId: '',
      studentName: '',
      admissionNo: '',
      rollNo: '',
      fatherName: ''
    }));

    if (!classId) {
      setStudentsList([]);
      return;
    }

    try {
      const res = await studentService.getStudents({ classId });
      if (res.success && res.data) {
        setStudentsList(res.data);
      }
    } catch (e) {
      console.error('Error fetching students', e);
    }
  };

  // When section changes
  const handleSectionChange = async (sectionId) => {
    const selectedSec = sections.find(s => s._id === sectionId);
    const sectionName = selectedSec ? selectedSec.sectionName : '';
    setFormData(prev => ({
      ...prev,
      sectionId,
      sectionName,
      studentId: '',
      studentName: '',
      admissionNo: '',
      rollNo: '',
      fatherName: ''
    }));

    if (formData.classId) {
      try {
        const res = await studentService.getStudents({ classId: formData.classId, sectionId });
        if (res.success && res.data) {
          setStudentsList(res.data);
        }
      } catch (e) {
        console.error('Error fetching students by section', e);
      }
    }
  };

  // When student is selected
  const handleStudentChange = (studentId) => {
    if (studentId === 'whole') {
      setFormData(prev => ({
        ...prev,
        studentId: 'whole',
        studentName: 'Whole Section / All Students',
        admissionNo: 'Bulk Admission',
        rollNo: 'All',
        fatherName: 'Respective Guardians'
      }));
      setPreviewMode(true);
      return;
    }

    const st = studentsList.find(s => s._id === studentId);
    if (st) {
      setFormData(prev => ({
        ...prev,
        studentId: st._id,
        studentName: `${st.firstName} ${st.lastName || ''}`.trim(),
        admissionNo: st.admissionNo || st.aparId || 'DPA-101',
        rollNo: st.rollNo || '01',
        fatherName: st.fatherName || 'Parent Name'
      }));
      setPreviewMode(true);
    } else {
      setFormData(prev => ({
        ...prev,
        studentId: '',
        studentName: '',
        admissionNo: '',
        rollNo: '',
        fatherName: ''
      }));
    }
  };

  // Current selected template object
  const currentTemplate = templates.find(t => 
    t.templateId === formData.templateId || t._id === formData.templateId
  ) || templates[0] || null;

  // --- Handlers: Generation ---
  const handlePreview = () => {
    if (!formData.className || !formData.templateId) {
      Swal.fire('Incomplete Details', 'Please select at least a Class and Template to generate preview.', 'warning');
      return;
    }
    setPreviewMode(true);
  };

  const handleGenerate = async () => {
    if (!formData.className || !formData.templateId) {
      Swal.fire('Incomplete Details', 'Please select Class and Template before generating.', 'warning');
      return;
    }

    try {
      setLoading(true);

      // Bulk Generation for Whole Section
      if (formData.studentId === 'whole') {
        const res = await certificateService.bulkGenerateCertificates({
          classId: formData.classId,
          className: formData.className,
          sectionId: formData.sectionId,
          sectionName: formData.sectionName,
          templateId: formData.templateId
        });

        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Bulk Certificates Generated!',
            text: `Successfully generated ${res.count || res.data?.length || 0} certificates for the entire section.`,
            confirmButtonColor: '#5D5CFF'
          });
          fetchTemplatesAndIssued();
          fetchStats();
          setActiveTab('Issued Documents');
        }
        return;
      }

      // Single Certificate Generation
      const payload = {
        studentId: formData.studentId || undefined,
        studentName: formData.studentName || 'Student Name',
        admissionNo: formData.admissionNo || 'DPA-101',
        rollNo: formData.rollNo || '15',
        className: formData.className || 'Class X',
        sectionName: formData.sectionName || 'A',
        fatherName: formData.fatherName || 'Parent Name',
        templateId: formData.templateId,
        customRemarks: formData.customRemarks,
        issueDate: formData.issueDate
      };

      const res = await certificateService.generateCertificate(payload);
      if (res.success && res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Document Generated & Issued!',
          text: `Certificate reference serial: ${res.data.certificate.certificateNumber}`,
          showCancelButton: true,
          confirmButtonText: 'Print / View Certificate',
          cancelButtonText: 'Done',
          confirmButtonColor: '#5D5CFF'
        }).then((result) => {
          if (result.isConfirmed) {
            setViewingCert(res.data.certificate);
            setShowPrintModal(true);
          }
        });

        fetchTemplatesAndIssued();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Failed to generate certificate: ' + (e.response?.data?.message || e.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers: Delete Issued Certificate ---
  const handleDeleteIssued = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this Certificate?',
      text: 'This will permanently remove the issued certificate record from school archives.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await certificateService.deleteIssuedCertificate(id);
        if (res.success) {
          Swal.fire('Deleted!', 'Certificate deleted from archive.', 'success');
          setIssuedCertificates(prev => prev.filter(c => c._id !== id));
          fetchStats();
        }
      } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Failed to delete certificate.', 'error');
      }
    }
  };

  // --- Handlers: Create Custom Template ---
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      const res = await certificateService.createTemplate(newTemplateForm);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Template Created!',
          text: 'New certificate template added to your library.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowCreateTemplateModal(false);
        fetchTemplatesAndIssued();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to create template.', 'error');
    }
  };

  // Filtered Archive
  const filteredIssued = issuedCertificates.filter(c => {
    const s = archiveSearch.toLowerCase();
    const searchMatch = !archiveSearch ||
      (c.studentName && c.studentName.toLowerCase().includes(s)) ||
      (c.certificateNumber && c.certificateNumber.toLowerCase().includes(s)) ||
      (c.admissionNo && c.admissionNo.toLowerCase().includes(s)) ||
      (c.templateTitle && c.templateTitle.toLowerCase().includes(s));

    const typeMatch = archiveTypeFilter === 'All' || c.certificateType === archiveTypeFilter;

    return searchMatch && typeMatch;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Certificate No', 'Student Name', 'Admission No', 'Roll No', 'Class', 'Section', 'Template', 'Issue Date', 'Status'];
    const rows = filteredIssued.map(c => [
      `"${c.certificateNumber}"`,
      `"${c.studentName}"`,
      `"${c.admissionNo || ''}"`,
      `"${c.rollNo || ''}"`,
      `"${c.className || ''}"`,
      `"${c.sectionName || ''}"`,
      `"${c.templateTitle || ''}"`,
      c.issueDate ? new Date(c.issueDate).toLocaleDateString() : '',
      c.status || 'Generated'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Issued_Certificates_Archive_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      
      {/* Header */}
      <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Certificates & Documents</h1>
          <p className="text-[13px] text-gray-500 mt-1">Generate, preview, issue, and archive official student certificates, transfer certificates, and ID cards.</p>
        </div>
        
        {/* KPI Stats Pill Badges */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded text-xs font-bold text-blue-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> {stats.totalTemplates} Templates
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> {stats.totalIssued} Issued in Archive
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded text-xs font-bold text-amber-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> {stats.meritCount} Merit Awards
          </div>
        </div>
      </div>

      {/* Dynamic Tabs Navigation */}
      <div className="px-6 bg-white border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        {[
          { name: 'Generate Document', icon: <Printer className="w-4 h-4" /> },
          { name: 'Issued Documents', icon: <FileText className="w-4 h-4" />, count: issuedCertificates.length },
          { name: 'Templates Library', icon: <Layers className="w-4 h-4" />, count: templates.length },
          { name: 'Student ID Cards', icon: <CreditCard className="w-4 h-4" /> }
        ].map(t => (
          <button 
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`flex items-center gap-2 px-5 py-3.5 font-semibold text-[13px] whitespace-nowrap transition-colors border-b-[3px] ${
              activeTab === t.name 
                ? 'text-[#5D5CFF] border-[#5D5CFF]' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {t.icon} {t.name}
            {t.count !== undefined && (
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === t.name ? 'bg-[#5D5CFF]/10 text-[#5D5CFF]' : 'bg-gray-100 text-gray-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* ============================================================== */}
        {/* TAB 1: GENERATE DOCUMENT                                       */}
        {/* ============================================================== */}
        {activeTab === 'Generate Document' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Step 1 & 2 */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Step 1: Who is this for? */}
                <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#f4f7f6] border border-gray-200 text-[#5D5CFF] font-bold text-xs flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-[14px]">Who is this for?</h3>
                      <p className="text-gray-500 text-[12px]">Pick a class & section, then a single student or the whole section.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 pl-9">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1">Class *</label>
                      <select 
                        value={formData.classId}
                        onChange={e => handleClassChange(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white"
                      >
                        <option value="">Select class...</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                        {classes.length === 0 && (
                          <>
                            <option value="x">Class X</option>
                            <option value="ix">Class IX</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1">Section</label>
                      <select 
                        value={formData.sectionId}
                        onChange={e => handleSectionChange(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white"
                      >
                        <option value="">Select section...</option>
                        {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                        {sections.length === 0 && (
                          <>
                            <option value="a">Section A</option>
                            <option value="b">Section B</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="pl-9 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1">Student Selection *</label>
                      <select 
                        value={formData.studentId}
                        onChange={e => handleStudentChange(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white"
                      >
                        <option value="">Select individual student or Whole Section...</option>
                        <option value="whole" className="font-bold text-[#5D5CFF]">✨ Whole Section (Bulk Auto-Generate)</option>
                        {studentsList.map(st => (
                          <option key={st._id} value={st._id}>
                            {st.firstName} {st.lastName || ''} (Roll: {st.rollNo || 'N/A'}, Adm: {st.admissionNo || 'N/A'})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Manual override / Custom Details */}
                    {formData.studentId && formData.studentId !== 'whole' && (
                      <div className="bg-gray-50 border border-gray-200 rounded p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Student Name</span>
                          <input 
                            type="text" 
                            value={formData.studentName}
                            onChange={e => setFormData({...formData, studentName: e.target.value})}
                            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Admission No</span>
                          <input 
                            type="text" 
                            value={formData.admissionNo}
                            onChange={e => setFormData({...formData, admissionNo: e.target.value})}
                            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Roll No</span>
                          <input 
                            type="text" 
                            value={formData.rollNo}
                            onChange={e => setFormData({...formData, rollNo: e.target.value})}
                            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Father's Name</span>
                          <input 
                            type="text" 
                            value={formData.fatherName}
                            onChange={e => setFormData({...formData, fatherName: e.target.value})}
                            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Choose a design */}
                <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#f4f7f6] border border-gray-200 text-[#5D5CFF] font-bold text-xs flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-[14px]">Choose an official template</h3>
                      <p className="text-gray-500 text-[12px]">Select an approved document format and design.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 pl-9">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1">Template *</label>
                      <select 
                        value={formData.templateId}
                        onChange={e => {
                          const tpl = templates.find(t => t.templateId === e.target.value || t._id === e.target.value);
                          setFormData({
                            ...formData, 
                            templateId: e.target.value,
                            layout: tpl?.layout || 'Landscape',
                            orientation: tpl?.layout || 'Landscape'
                          });
                          setPreviewMode(true);
                        }}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white"
                      >
                        {templates.map(t => (
                          <option key={t._id} value={t.templateId || t._id}>
                            {t.title} ({t.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1">Issue Date</label>
                      <input 
                        type="date"
                        value={formData.issueDate}
                        onChange={e => setFormData({...formData, issueDate: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="pl-9 space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1">Custom Endorsement / Remarks</label>
                      <input 
                        type="text"
                        value={formData.customRemarks}
                        onChange={e => setFormData({...formData, customRemarks: e.target.value})}
                        placeholder="e.g. Passed with High Honours, exemplary conduct throughout the session"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-4 flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, archive: !formData.archive})}
                        className={`w-10 h-5 rounded-full relative transition-colors ${formData.archive ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${formData.archive ? 'left-5' : 'left-0.5'}`}></div>
                      </button>
                      <div>
                        <span className="font-bold text-gray-800 text-[13px]">Archive digital copy automatically</span>
                        <p className="text-gray-500 text-[11px]">Saves exact replica in the school audit vault with a cryptographically verifiable serial number.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Print Sheet Setup */}
                <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#f4f7f6] border border-gray-200 text-[#5D5CFF] font-bold text-xs flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-[14px]">Sheet & printing setup</h3>
                      <p className="text-gray-500 text-[12px]">Standard letterhead paper layout ready for laser printing.</p>
                    </div>
                  </div>

                  <div className="pl-9">
                    <div className="border border-gray-200 rounded">
                      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 font-bold text-gray-700 text-xs flex items-center gap-2">
                        <Printer className="w-3.5 h-3.5" /> Paper & Sheet Layout
                      </div>
                      <div className="p-4 flex flex-wrap gap-4 items-center bg-white text-xs">
                        <div className="min-w-[140px]">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Paper Size</label>
                          <select 
                            value={formData.paper}
                            onChange={e => setFormData({...formData, paper: e.target.value})}
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          >
                            <option>A4 (210 x 297 mm)</option>
                            <option>Letter (8.5 x 11 in)</option>
                          </select>
                        </div>

                        <div className="min-w-[120px]">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Orientation</label>
                          <select 
                            value={formData.orientation}
                            onChange={e => setFormData({...formData, orientation: e.target.value})}
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="Landscape">Landscape</option>
                            <option value="Portrait">Portrait</option>
                          </select>
                        </div>

                        <div className="w-20">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Margin (mm)</label>
                          <input 
                            type="number"
                            value={formData.margin}
                            onChange={e => setFormData({...formData, margin: e.target.value})}
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                            <input 
                              type="checkbox" 
                              checked={formData.cutMarks}
                              onChange={e => setFormData({...formData, cutMarks: e.target.checked})}
                              className="w-3.5 h-3.5 text-blue-600 rounded" 
                            />
                            Cut marks
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                            <input 
                              type="checkbox" 
                              checked={formData.alignCenter}
                              onChange={e => setFormData({...formData, alignCenter: e.target.checked})}
                              className="w-3.5 h-3.5 text-blue-600 rounded" 
                            />
                            Align center
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Certificate Preview */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex flex-col h-full min-h-[450px]">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-gray-500 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                     <Eye className="w-3.5 h-3.5" /> Live Document Preview
                   </h3>
                   {previewMode && (
                     <span className="bg-green-100 text-green-700 px-2 py-0.5 text-[10px] uppercase font-bold rounded">
                       Ready to Print
                     </span>
                   )}
                </div>
                
                <div className="flex-1 border-2 border-dashed border-gray-200 rounded p-4 bg-gray-50/50 flex flex-col justify-center items-center overflow-hidden">
                  {currentTemplate ? (
                    <div 
                      className="bg-white border-4 border-double w-full max-w-[360px] shadow-lg rounded p-4 flex flex-col justify-between text-center relative"
                      style={{ 
                        borderColor: currentTemplate.primaryColor || '#1e3a8a',
                        minHeight: '380px'
                      }}
                    >
                      {/* Watermark Emblem */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <Award className="w-48 h-48 text-gray-800" />
                      </div>

                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Award className="w-5 h-5 text-amber-500" />
                          <h4 className="font-black text-[13px] tracking-wide text-gray-900">
                            {currentTemplate.schoolName || 'ALL CORE SOLUTIONS'}
                          </h4>
                        </div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">{currentTemplate.schoolAffiliation}</p>
                        
                        <div className="w-16 h-0.5 mx-auto my-2" style={{ backgroundColor: currentTemplate.accentColor || '#f59e0b' }}></div>

                        <span 
                          className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black tracking-widest uppercase text-white shadow-xs"
                          style={{ backgroundColor: currentTemplate.primaryColor || '#1e3a8a' }}
                        >
                          {currentTemplate.headerSubtitle || 'OFFICIAL CERTIFICATE'}
                        </span>
                      </div>

                      {/* Certificate Body Preview */}
                      <div className="my-4 text-[11px] text-gray-700 leading-relaxed font-serif px-2">
                        <p className="italic text-gray-500 mb-1">This is to proudly certify that</p>
                        <h3 className="font-bold text-sm tracking-wide text-gray-900 underline decoration-amber-400">
                          {formData.studentName || 'Student Name'}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-1 font-sans">
                          Class: <strong>{formData.className || 'Class X'}</strong> • Section: <strong>{formData.sectionName || 'A'}</strong> • Roll: <strong>{formData.rollNo || '15'}</strong>
                        </p>
                        <p className="text-[10px] text-gray-600 mt-2 line-clamp-3">
                          {currentTemplate.bodyTemplate
                            ?.replace(/{{studentName}}/g, formData.studentName || 'Candidate')
                            ?.replace(/{{fatherName}}/g, formData.fatherName || 'Parent')
                            ?.replace(/{{admissionNo}}/g, formData.admissionNo || 'DPA-101')
                            ?.replace(/{{className}}/g, formData.className || 'Class X')
                            ?.replace(/{{sectionName}}/g, formData.sectionName || 'A')
                            ?.replace(/{{rollNo}}/g, formData.rollNo || '15')
                            ?.replace(/{{academicYear}}/g, '2026-2027')
                          }
                        </p>
                      </div>

                      {/* Signatories & QR Footer */}
                      <div className="pt-2 border-t border-gray-100 flex items-end justify-between text-[9px] text-gray-600">
                        <div className="text-center">
                          <div className="w-12 h-0.5 bg-gray-400 mx-auto mb-1"></div>
                          <span className="font-semibold">{currentTemplate.signatoryTitle1 || 'Class Mentor'}</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=DPA-CERT-PREVIEW" 
                            alt="QR" 
                            className="w-8 h-8 opacity-75"
                          />
                          <span className="text-[8px] font-mono text-gray-400 mt-0.5">DPA/2026</span>
                        </div>

                        <div className="text-center">
                          <div className="w-12 h-0.5 bg-gray-400 mx-auto mb-1"></div>
                          <span className="font-semibold">{currentTemplate.signatoryTitle2 || 'Principal'}</span>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs">Select a template to view instant live layout</p>
                    </div>
                  )}
                </div>

                {/* Direct Action inside Preview Card */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={handlePreview}
                    className="flex-1 bg-white border border-[#5D5CFF] text-[#5D5CFF] py-2 rounded text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Fullscreen Preview
                  </button>
                  <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-[#5D5CFF] hover:bg-[#4b4ad4] text-white py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> Issue & Print
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Footer Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 border border-gray-200 rounded p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Info className="w-4 h-4 text-blue-500" /> 
                Certificates are generated with high-dpi print vector resolution and archived with tamper-proof reference IDs.
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handlePreview}
                  className="flex items-center gap-2 bg-white border border-[#5D5CFF] text-[#5D5CFF] px-6 py-2 rounded shadow-sm text-xs font-bold hover:bg-[#5D5CFF]/10 transition-colors"
                >
                  <Eye className="w-4 h-4" /> Print Preview
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#5D5CFF] border border-[#5D5CFF] text-white px-6 py-2 rounded shadow-sm text-xs font-bold hover:bg-[#4b4ad4] transition-colors"
                >
                  <FileText className="w-4 h-4" /> {loading ? 'Processing...' : 'Generate & Issue PDF'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ISSUED DOCUMENTS ARCHIVE                                */}
        {/* ============================================================== */}
        {activeTab === 'Issued Documents' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Toolbar */}
            <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-1">
                <div className="relative min-w-[240px] flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={archiveSearch}
                    onChange={e => setArchiveSearch(e.target.value)}
                    placeholder="Search by student, serial number, admission no..."
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#5D5CFF]"
                  />
                </div>

                <div className="min-w-[150px]">
                  <select 
                    value={archiveTypeFilter}
                    onChange={e => setArchiveTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#5D5CFF] bg-white"
                  >
                    <option value="All">All Certificate Types</option>
                    <option value="Student">Student Certificates</option>
                    <option value="Merit">Merit & Distinction</option>
                    <option value="Admit Card">Admit Cards</option>
                    <option value="Fee Receipt">Fee Clearance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 bg-white"
                >
                  Export CSV
                </button>
                <button 
                  onClick={fetchTemplatesAndIssued}
                  title="Refresh Records"
                  className="p-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Issued Table */}
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#17a2b8] px-5 py-3 flex justify-between items-center text-white">
                <h2 className="font-bold text-[14px] flex items-center gap-2">
                  <FileText className="w-4 h-4 fill-white" /> Issued & Archived School Documents ({filteredIssued.length})
                </h2>
                <button 
                  onClick={() => setActiveTab('Generate Document')}
                  className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-gray-50"
                >
                  <Plus className="w-3.5 h-3.5 text-[#17a2b8]" /> Issue New
                </button>
              </div>

              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Certificate Serial</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Student & Adm No</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Class & Sec</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Document Type</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Issue Date</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-gray-700 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredIssued.length > 0 ? (
                      filteredIssued.map(item => (
                        <tr key={item._id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-4 py-3.5 text-[12px] font-mono font-bold text-blue-700">
                            {item.certificateNumber}
                          </td>
                          <td className="px-4 py-3.5 text-[12px]">
                            <p className="font-bold text-gray-800">{item.studentName}</p>
                            <p className="text-[10px] text-gray-500 font-mono">Adm: {item.admissionNo || 'N/A'}</p>
                          </td>
                          <td className="px-4 py-3.5 text-[12px] font-medium text-gray-700">
                            {item.className} {item.sectionName ? `(${item.sectionName})` : ''}
                          </td>
                          <td className="px-4 py-3.5 text-[12px]">
                            <p className="font-semibold text-gray-800">{item.templateTitle}</p>
                            <span className="text-[10px] text-gray-500 uppercase font-mono">{item.certificateType}</span>
                          </td>
                          <td className="px-4 py-3.5 text-[12px] text-gray-600 whitespace-nowrap">
                            {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              {item.status || 'Generated'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => {
                                  setViewingCert(item);
                                  setShowPrintModal(true);
                                }}
                                title="Print / View Certificate"
                                className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteIssued(item._id)}
                                title="Delete from Archive"
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
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-xs bg-gray-50/50">
                          No issued certificates found in archive. Generate a document from the "Generate Document" tab.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TEMPLATES LIBRARY                                       */}
        {/* ============================================================== */}
        {activeTab === 'Templates Library' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-800 text-base">Certificate & Document Templates</h2>
                <p className="text-xs text-gray-500 mt-0.5">Customise official formats or pick pre-approved CBSE templates.</p>
              </div>
              <button 
                onClick={() => setShowCreateTemplateModal(true)}
                className="bg-[#5D5CFF] hover:bg-[#4b4ad4] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Create Custom Template
              </button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {templates.map(tpl => (
                <div 
                  key={tpl._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white"
                        style={{ backgroundColor: tpl.primaryColor || '#1e3a8a' }}
                      >
                        {tpl.type}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 font-semibold">{tpl.layout || 'Landscape'}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-1">{tpl.title}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed mt-2 font-serif italic bg-gray-50 p-2 rounded border border-gray-100">
                      "{tpl.bodyTemplate}"
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Signatory: <strong>{tpl.signatoryTitle2 || 'Principal'}</strong></span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full inline-block border" style={{ backgroundColor: tpl.primaryColor }}></span>
                        <span className="w-3.5 h-3.5 rounded-full inline-block border" style={{ backgroundColor: tpl.accentColor }}></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">CBSE Ready</span>
                    <button 
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          templateId: tpl.templateId || tpl._id,
                          layout: tpl.layout || 'Landscape',
                          orientation: tpl.layout || 'Landscape'
                        }));
                        setActiveTab('Generate Document');
                        setPreviewMode(true);
                      }}
                      className="text-xs font-bold text-[#5D5CFF] hover:underline flex items-center gap-1"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: STUDENT ID CARDS                                        */}
        {/* ============================================================== */}
        {activeTab === 'Student ID Cards' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-800 text-base">Student Photo Identity Cards</h2>
                <p className="text-xs text-gray-500 mt-0.5">Generate batch ID cards for your classroom with QR verification.</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-[#5D5CFF] hover:bg-[#4b4ad4] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Sheet
              </button>
            </div>

            {/* ID Cards Sheet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(studentsList.length > 0 ? studentsList : [
                { _id: '1', firstName: 'Aarav', lastName: 'Mehta', rollNo: '1001', admissionNo: 'DPA-1001' },
                { _id: '2', firstName: 'Diya', lastName: 'Patel', rollNo: '1002', admissionNo: 'DPA-1002' },
                { _id: '3', firstName: 'Kabir', lastName: 'Sharma', rollNo: '1005', admissionNo: 'DPA-1005' },
                { _id: '4', firstName: 'Ananya', lastName: 'Verma', rollNo: '1008', admissionNo: 'DPA-1008' }
              ]).map(st => (
                <div 
                  key={st._id}
                  className="bg-white border-2 border-indigo-600 rounded-lg shadow-sm p-4 text-center flex flex-col items-center justify-between relative overflow-hidden"
                  style={{ minHeight: '260px' }}
                >
                  <div className="w-full bg-indigo-700 text-white py-1 px-2 rounded-t -mt-4 -mx-4 mb-3">
                    <h4 className="font-black text-[11px] tracking-wider">ALL CORE SOLUTIONS</h4>
                    <p className="text-[8px] uppercase tracking-widest text-indigo-200">STUDENT IDENTITY CARD</p>
                  </div>

                  {/* Photo avatar */}
                  <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-indigo-400 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-inner mb-2">
                    {st.firstName?.charAt(0)}{st.lastName?.charAt(0)}
                  </div>

                  <h3 className="font-bold text-gray-900 text-[13px]">{st.firstName} {st.lastName || ''}</h3>
                  <p className="text-[11px] text-indigo-600 font-bold">{formData.className || 'Class X'} - {formData.sectionName || 'A'}</p>
                  <p className="text-[10px] text-gray-500 font-mono">Roll: {st.rollNo || '15'} • Adm: {st.admissionNo || 'DPA-101'}</p>

                  <div className="mt-3 pt-2 border-t border-gray-100 w-full flex items-center justify-between text-[9px] text-gray-400 font-mono">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${st.admissionNo || 'DPA-101'}`}
                      alt="QR"
                      className="w-8 h-8 opacity-80"
                    />
                    <span className="text-[8px] font-bold text-gray-500">VALID: 2026-27</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL: HIGH-RES PRINTABLE CERTIFICATE --- */}
      {showPrintModal && viewingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowPrintModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-[#5D5CFF]" /> Print Official Certificate: {viewingCert.certificateNumber}
              </span>
              <button onClick={() => setShowPrintModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>

            <div className="p-8 overflow-y-auto flex justify-center bg-slate-100">
              <div 
                className="bg-white border-8 border-double border-amber-600 w-full max-w-2xl shadow-xl p-8 flex flex-col justify-between text-center relative"
                style={{ minHeight: '480px' }}
              >
                {/* School Seal */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Award className="w-8 h-8 text-amber-500" />
                    <h2 className="text-xl font-black text-gray-900 tracking-wide">ALL CORE SOLUTIONS</h2>
                  </div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">Affiliated to CBSE, New Delhi | Affiliation No: 2130892</p>
                  <p className="text-[10px] text-gray-400">Sector 4, Institutional Area, New Delhi - 110001</p>
                  
                  <div className="w-24 h-1 bg-amber-500 mx-auto my-3"></div>

                  <span className="inline-block bg-indigo-900 text-white px-4 py-1 rounded text-xs font-black tracking-widest uppercase shadow-sm">
                    {viewingCert.templateTitle || 'OFFICIAL CERTIFICATE'}
                  </span>
                </div>

                {/* Content */}
                <div className="my-6 px-6 font-serif text-gray-800 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {viewingCert.renderedContent}
                </div>

                {/* Signatures & Reference */}
                <div className="pt-6 border-t-2 border-gray-100 flex items-end justify-between text-xs text-gray-700">
                  <div className="text-center">
                    <div className="w-24 h-0.5 bg-gray-600 mx-auto mb-1"></div>
                    <span className="font-bold text-gray-800">Class Mentor</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${viewingCert.certificateNumber}`} 
                      alt="QR" 
                      className="w-12 h-12"
                    />
                    <span className="font-mono text-[9px] text-gray-500 mt-1">{viewingCert.certificateNumber}</span>
                  </div>

                  <div className="text-center">
                    <div className="w-24 h-0.5 bg-gray-600 mx-auto mb-1"></div>
                    <span className="font-bold text-gray-800">Principal / Head</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button 
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold hover:bg-gray-100"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#5D5CFF] hover:bg-[#4b4ad4] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE CUSTOM TEMPLATE --- */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCreateTemplateModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#5D5CFF]" /> Create Custom Certificate Template
              </h2>
              <button onClick={() => setShowCreateTemplateModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Template Title *</label>
                <input 
                  type="text" 
                  required
                  value={newTemplateForm.title}
                  onChange={e => setNewTemplateForm({...newTemplateForm, title: e.target.value})}
                  placeholder="e.g. Science Fair Distinction Certificate" 
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category Type</label>
                  <select 
                    value={newTemplateForm.type}
                    onChange={e => setNewTemplateForm({...newTemplateForm, type: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Student">Student</option>
                    <option value="Merit">Merit & Award</option>
                    <option value="Admit Card">Admit Card</option>
                    <option value="Fee Receipt">Fee Receipt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Layout</label>
                  <select 
                    value={newTemplateForm.layout}
                    onChange={e => setNewTemplateForm({...newTemplateForm, layout: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Landscape">Landscape</option>
                    <option value="Portrait">Portrait</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Body Text / Format *</label>
                <textarea 
                  rows="4"
                  required
                  value={newTemplateForm.bodyTemplate}
                  onChange={e => setNewTemplateForm({...newTemplateForm, bodyTemplate: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-mono text-gray-700 focus:outline-none focus:border-blue-500" 
                />
                <p className="text-[10px] text-gray-400 mt-1">Available tags: {'{{studentName}}'}, {'{{fatherName}}'}, {'{{admissionNo}}'}, {'{{rollNo}}'}, {'{{className}}'}, {'{{sectionName}}'}, {'{{academicYear}}'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Signatory 1</label>
                  <input 
                    type="text" 
                    value={newTemplateForm.signatoryTitle1}
                    onChange={e => setNewTemplateForm({...newTemplateForm, signatoryTitle1: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Signatory 2</label>
                  <input 
                    type="text" 
                    value={newTemplateForm.signatoryTitle2}
                    onChange={e => setNewTemplateForm({...newTemplateForm, signatoryTitle2: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs" 
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreateTemplateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#5D5CFF] hover:bg-[#4b4ad4] text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Certificates;
