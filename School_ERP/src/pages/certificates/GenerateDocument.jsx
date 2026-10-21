import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Eye, Image as ImageIcon, LayoutGrid, Info, FileText, 
  Printer, Sparkles, CheckCircle, Award, Users, Download, 
  Trash2, Search, Calendar, RefreshCw, X, ShieldCheck
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { certificateService } from '../../api/certificateService';

export default function GenerateDocument() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active top tab: 'generate' or 'archive'
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Metadata from backend
  const [classesList, setClassesList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [templatesList, setTemplatesList] = useState([]);
  const [issuedHistory, setIssuedHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState('');

  // Form State
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [customRemarks, setCustomRemarks] = useState('');

  // Current Generated / Preview Certificate Object
  const [previewCert, setPreviewCert] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Initial Load of Metadata & Templates
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [{ classes, students }, templatesRes, issuedRes] = await Promise.all([
          certificateService.getMetadata(),
          certificateService.getTemplates(),
          certificateService.getIssued()
        ]);

        setClassesList(classes);
        setStudentsList(students);
        setTemplatesList(templatesRes.data || []);
        setIssuedHistory(issuedRes.data || []);

        // Check URL search params for pre-selected template
        const params = new URLSearchParams(location.search);
        const paramTemplateId = params.get('template');

        const initialTpl = paramTemplateId && templatesRes.data?.some(t => t.templateId === paramTemplateId)
          ? paramTemplateId
          : templatesRes.data?.[0]?.templateId || 'bonafide-cert';

        setSelectedTemplateId(initialTpl);

        // Pre-select first student if available
        if (students.length > 0) {
          setSelectedStudentId(students[0]._id);
        }
      } catch (err) {
        console.error('Failed to load certificate data:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [location.search]);

  // Filter students by selected class
  const filteredStudents = studentsList.filter(s => {
    if (selectedClass === 'All') return true;
    const cName = s.classId?.className || s.className;
    return cName === selectedClass;
  });

  // Active Selected Student & Template Objects
  const activeStudent = studentsList.find(s => s._id === selectedStudentId) || studentsList[0] || {
    firstName: 'Arjun',
    lastName: 'Kapoor',
    admissionNo: 'DPA-2024-101',
    rollNo: '15',
    fatherName: 'Vikram Chauhan',
    motherName: 'Anjali Chauhan',
    classId: { className: 'Class X' },
    sectionId: { sectionName: 'A' }
  };

  const activeTemplate = templatesList.find(t => t.templateId === selectedTemplateId) || templatesList[0] || {
    templateId: 'bonafide-cert',
    title: 'Bonafide Student Certificate',
    schoolName: 'ALL CORE SOLUTIONS',
    schoolAffiliation: 'Affiliated to CBSE, New Delhi | Affiliation No: 2130892',
    schoolAddress: 'Sector 4, Institutional Area, New Delhi - 110001',
    headerSubtitle: 'BONAFIDE CERTIFICATE',
    bodyTemplate: 'This is to certify that {{studentName}}, son/daughter of Mr. {{fatherName}} and Mrs. {{motherName}}, bearing Admission No: {{admissionNo}} and Roll No: {{rollNo}}, is a bonafide regular student of {{className}}, Section {{sectionName}} in our institution during the academic session {{academicYear}}.\n\nTo the best of our knowledge and school records, he/she bears an exemplary moral character and pleasant conduct. This certificate is issued on his/her request for official purposes.',
    primaryColor: '#1e3a8a',
    accentColor: '#f59e0b',
    signatoryTitle1: 'Class Teacher',
    signatoryTitle2: 'Principal / Head of School',
    layout: 'Landscape'
  };

  // Real-time Dynamic Certificate Content
  const renderedLiveText = (() => {
    if (!activeTemplate?.bodyTemplate) return '';
    const sName = `${activeStudent.firstName || ''} ${activeStudent.lastName || ''}`.trim() || 'Arjun Kapoor';
    const admNo = activeStudent.admissionNo || activeStudent.aparId || 'DPA-2024-101';
    const rNo = activeStudent.rollNo || '15';
    const cName = activeStudent.classId?.className || activeStudent.className || 'Class X';
    const secName = activeStudent.sectionId?.sectionName || activeStudent.sectionName || 'A';
    const fName = activeStudent.fatherName || 'Vikram Chauhan';
    const mName = activeStudent.motherName || 'Mrs. Chauhan';
    const formattedDate = new Date(issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const serial = previewCert?.certificateNumber || 'DPA/2026/CERT-SAMPLE';

    return activeTemplate.bodyTemplate
      .replace(/{{studentName}}/g, sName)
      .replace(/{{fatherName}}/g, fName)
      .replace(/{{motherName}}/g, mName)
      .replace(/{{admissionNo}}/g, admNo)
      .replace(/{{rollNo}}/g, rNo)
      .replace(/{{className}}/g, cName)
      .replace(/{{sectionName}}/g, secName)
      .replace(/{{academicYear}}/g, '2026-2027')
      .replace(/{{referenceNumber}}/g, serial)
      .replace(/{{issueDate}}/g, formattedDate);
  })();

  // Action: Auto-Generate and Save to DB Archive
  const handleAutoGenerate = async () => {
    try {
      setGenerating(true);

      if (selectedStudentId === 'bulk_all') {
        // Bulk generation for class
        const bulkRes = await certificateService.bulkAutoGenerate({
          className: selectedClass !== 'All' ? selectedClass : 'Class X',
          templateId: selectedTemplateId
        });
        showToast(`Successfully bulk auto-generated ${bulkRes.count} certificates!`);
        refreshIssued();
        setActiveTab('archive');
      } else {
        // Single student auto-generate
        const res = await certificateService.autoGenerate({
          studentId: selectedStudentId || undefined,
          templateId: selectedTemplateId,
          customRemarks,
          issueDate,
          manualStudent: {
            name: `${activeStudent.firstName} ${activeStudent.lastName || ''}`.trim(),
            admissionNo: activeStudent.admissionNo,
            rollNo: activeStudent.rollNo,
            className: activeStudent.classId?.className || 'Class X',
            sectionName: activeStudent.sectionId?.sectionName || 'A',
            fatherName: activeStudent.fatherName,
            motherName: activeStudent.motherName
          }
        });

        if (res.success && res.data) {
          setPreviewCert(res.data.certificate);
          showToast(`Certificate ${res.data.certificate.certificateNumber} generated & saved!`);
          refreshIssued();
        }
      }
    } catch (err) {
      console.error('Failed to generate certificate:', err);
      showToast('Error generating certificate');
    } finally {
      setGenerating(false);
    }
  };

  const refreshIssued = async () => {
    try {
      const res = await certificateService.getIssued();
      if (res.success) setIssuedHistory(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIssued = async (id, certNum) => {
    if (!window.confirm(`Delete certificate "${certNum}" from archive?`)) return;
    try {
      await certificateService.deleteIssued(id);
      refreshIssued();
      showToast('Archived certificate deleted');
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Print Window
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-slate-600 font-bold text-xs">Loading certificate generator engine...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 min-h-screen font-sans p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Only Header */}
      <div className="print:hidden max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Generate Official Certificates</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Auto-Merge Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Automatically populate student records into official certificate designs with instant print & archiving
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/certificates/templates')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Templates
            </button>
          </div>
        </div>

        {/* Tab Toggle: Generator vs History */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'generate' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" /> Auto-Generate Certificate
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'archive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-600" /> Issued & Archived Certificates ({issuedHistory.length})
          </button>
        </div>

        {/* TAB 1: Auto-Generate Studio */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Controls Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Step 1: Student Selection */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Select Student</h3>
                    <p className="text-[11px] text-slate-400">Choose class and student from active admissions</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Class
                    </label>
                    <select
                      value={selectedClass}
                      onChange={e => {
                        setSelectedClass(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="All">All Classes</option>
                      {classesList.map(c => (
                        <option key={c._id} value={c.className}>{c.className}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Section
                    </label>
                    <select
                      value={selectedSection}
                      onChange={e => setSelectedSection(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="All">All Sections</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Student Name
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="bulk_all">👥 Entire Class (Bulk Auto-Generate All)</option>
                    {filteredStudents.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.firstName} {s.lastName || ''} (Adm: {s.admissionNo || s.aparId || 'N/A'}, Roll: {s.rollNo || '-'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Student Quick Info Badge */}
                {selectedStudentId !== 'bulk_all' && (
                  <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100/80 text-[11px] space-y-1">
                    <div className="font-bold text-indigo-950 flex items-center justify-between">
                      <span>{activeStudent.firstName} {activeStudent.lastName}</span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-mono text-indigo-700 font-bold">
                        {activeStudent.admissionNo || activeStudent.aparId || 'DPA-101'}
                      </span>
                    </div>
                    <div className="text-indigo-800 font-medium">
                      Father: <strong>{activeStudent.fatherName || 'Vikram Chauhan'}</strong>
                    </div>
                    <div className="text-indigo-700">
                      Class: {activeStudent.classId?.className || activeStudent.className || 'Class X'} ({activeStudent.sectionId?.sectionName || 'A'}) · Roll: {activeStudent.rollNo || '15'}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Template Selection */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Pick Certificate Format</h3>
                    <p className="text-[11px] text-slate-400">Select certificate or award template</p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Template Format
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={e => setSelectedTemplateId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {templatesList.map(t => (
                      <option key={t.templateId} value={t.templateId}>
                        {t.title} ({t.type} · {t.layout})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={e => setIssueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Paper Format
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${activeTemplate.paperSize || 'A4'} ${activeTemplate.layout || 'Landscape'}`}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Official Authority Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Issued on student request for passport application"
                    value={customRemarks}
                    onChange={e => setCustomRemarks(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAutoGenerate}
                  disabled={generating}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating Certificate...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Auto-Generate & Save
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                  title="Print Certificate"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>

            </div>

            {/* Right Preview Column (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Real-Time High Resolution Canvas Preview</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black">
                  Ready to Print A4
                </span>
              </div>

              {/* LIVE CERTIFICATE FRAME (Printable Target) */}
              <div id="printable-certificate-area" className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden p-6 md:p-10 relative">
                
                {/* Certificate Border Container */}
                <div 
                  className="w-full rounded-2xl p-6 md:p-8 relative flex flex-col justify-between text-center min-h-[460px]"
                  style={{
                    border: `6px double ${activeTemplate.primaryColor || '#1e3a8a'}`,
                    backgroundColor: '#fffdf9'
                  }}
                >
                  {/* Ornate Corner Accents */}
                  <div className="absolute top-2 left-2 text-base text-amber-500 font-serif opacity-70">⚜</div>
                  <div className="absolute top-2 right-2 text-base text-amber-500 font-serif opacity-70">⚜</div>
                  <div className="absolute bottom-2 left-2 text-base text-amber-500 font-serif opacity-70">⚜</div>
                  <div className="absolute bottom-2 right-2 text-base text-amber-500 font-serif opacity-70">⚜</div>

                  {/* Header Area */}
                  <div className="space-y-1">
                    {/* Serial & Date Bar */}
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-b border-slate-200 pb-2 mb-2 font-mono">
                      <span>Ref No: {previewCert?.certificateNumber || 'DPA/2026/CERT-SAMPLE'}</span>
                      <span>Date: {new Date(issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* School Name */}
                    <h2 
                      className="text-xl md:text-2xl font-black uppercase tracking-wider font-serif"
                      style={{ color: activeTemplate.primaryColor || '#1e3a8a' }}
                    >
                      {activeTemplate.schoolName || 'ALL CORE SOLUTIONS'}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {activeTemplate.schoolAffiliation}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {activeTemplate.schoolAddress}
                    </p>

                    {/* Certificate Badge Subtitle */}
                    <div className="pt-2">
                      <span 
                        className="inline-block px-5 py-1 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm"
                        style={{
                          color: activeTemplate.primaryColor || '#1e3a8a',
                          backgroundColor: `${activeTemplate.primaryColor || '#1e3a8a'}12`,
                          borderColor: `${activeTemplate.primaryColor || '#1e3a8a'}40`
                        }}
                      >
                        {activeTemplate.headerSubtitle}
                      </span>
                    </div>
                  </div>

                  {/* Body Content with Elegant Typography */}
                  <div className="my-6 px-4 md:px-8 space-y-4">
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-serif text-justify md:text-center whitespace-pre-line">
                      {renderedLiveText}
                    </p>
                  </div>

                  {/* Dual Signatures & Gold Watermark Seal */}
                  <div className="pt-6 border-t border-slate-200/80 flex items-end justify-between px-4">
                    {/* Signatory 1 */}
                    <div className="text-center w-36">
                      <div className="h-8 flex items-end justify-center font-serif italic text-xs text-indigo-900 border-b border-slate-300 pb-1">
                        Staff Signature
                      </div>
                      <div className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                        {activeTemplate.signatoryTitle1 || 'Class Teacher'}
                      </div>
                    </div>

                    {/* Gold Seal Emblem */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-500 bg-amber-50 flex items-center justify-center text-amber-700 shadow-sm relative">
                        <div className="text-[9px] font-black uppercase tracking-tighter text-center">
                          SEAL<br/>★ ACADEMY ★
                        </div>
                      </div>
                    </div>

                    {/* Signatory 2 */}
                    <div className="text-center w-36">
                      <div className="h-8 flex items-end justify-center font-serif italic text-xs text-indigo-900 border-b border-slate-300 pb-1 font-bold">
                        Dr. R.K. Varma
                      </div>
                      <div className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                        {activeTemplate.signatoryTitle2 || 'Principal / Head'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Instructions Bar */}
              <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Info className="w-4 h-4 text-slate-400" /> Click "Auto-Generate & Save" to store in permanent archives.
                </span>
                <span className="font-bold text-indigo-700">A4 Laser Print Ready</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Issued & Archived History */}
        {activeTab === 'archive' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Official Certificate Issue Register</h3>
                <p className="text-xs text-slate-500">Search and reprint all verified certificates issued this session</p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by student, ref no, class..."
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            {issuedHistory.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                No certificates have been issued yet. Use "Auto-Generate Certificate" above to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3.5">Ref Serial</th>
                      <th className="px-5 py-3.5">Student Name</th>
                      <th className="px-5 py-3.5">Class & Roll</th>
                      <th className="px-5 py-3.5">Certificate Format</th>
                      <th className="px-5 py-3.5">Issue Date</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {issuedHistory
                      .filter(c => {
                        const q = historySearch.toLowerCase().trim();
                        return !q || 
                          c.studentName?.toLowerCase().includes(q) ||
                          c.certificateNumber?.toLowerCase().includes(q) ||
                          c.className?.toLowerCase().includes(q) ||
                          c.templateTitle?.toLowerCase().includes(q);
                      })
                      .map(cert => (
                        <tr key={cert._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-indigo-700">
                            {cert.certificateNumber}
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900">{cert.studentName}</div>
                            <div className="text-[10px] text-slate-400">Adm: {cert.admissionNo || 'N/A'}</div>
                          </td>
                          <td className="px-5 py-4 font-bold text-slate-700">
                            {cert.className} ({cert.sectionName})
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-lg text-xs">
                              {cert.templateTitle}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setPreviewCert(cert);
                                  setActiveTab('generate');
                                  showToast(`Loaded ${cert.certificateNumber} into preview canvas`);
                                }}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" /> View / Print
                              </button>
                              <button
                                onClick={() => handleDeleteIssued(cert._id, cert.certificateNumber)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Print Specific Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate-area, #printable-certificate-area * {
            visibility: visible;
          }
          #printable-certificate-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

    </div>
  );
}
