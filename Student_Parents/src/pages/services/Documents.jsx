import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  FileImage,
  Eye,
  Download,
  X,
  Printer,
  Search,
  UploadCloud,
  Plus,
  Award,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Trash2,
  RotateCw,
  AlertCircle,
  FileCheck,
  Calendar,
  User,
  Building,
  QrCode,
  LayoutGrid,
  List,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function Documents({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [docData, setDocData] = useState(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [requestCertModalOpen, setRequestCertModalOpen] = useState(false);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    documentName: '',
    category: 'Identity Proof',
    fileType: 'PDF',
    remarks: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  // Certificate Request Form State
  const [certRequestForm, setCertRequestForm] = useState({
    certificateType: 'Bonafide Student Certificate',
    purpose: '',
    deliveryMode: 'Digital PDF Download',
    urgentProcessing: false,
    additionalNotes: ''
  });
  const [requestingCert, setRequestingCert] = useState(false);

  // Fetch Documents Data
  const fetchDocuments = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const params = {};
      if (activeChild) params.studentId = activeChild;

      const res = await parentService.getDocuments(params);
      if (res && res.success && res.data) {
        setDocData(res.data);
      } else {
        setError('Failed to fetch student documents');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err?.response?.data?.message || err?.message || 'Error connecting to documents API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [activeChild]);

  // Handle Document Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.documentName.trim()) {
      alert('Please enter a document title');
      return;
    }

    try {
      setUploading(true);
      const studentId = docData?.student?.id || activeChild;

      let payload;
      if (uploadForm.file) {
        payload = new FormData();
        payload.append('attachment', uploadForm.file);
        payload.append('documentName', uploadForm.documentName.trim());
        payload.append('category', uploadForm.category);
        payload.append('remarks', uploadForm.remarks);
        if (studentId) payload.append('studentId', studentId);
      } else {
        payload = {
          studentId,
          documentName: uploadForm.documentName.trim(),
          category: uploadForm.category,
          fileType: uploadForm.fileType,
          fileSize: '1.25 MB',
          remarks: uploadForm.remarks || 'Uploaded via Parent Portal Document Desk'
        };
      }

      const res = await parentService.uploadDocument(payload);
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Document uploaded and verified successfully!'
        });
        setUploadModalOpen(false);
        setUploadForm({
          documentName: '',
          category: 'Identity Proof',
          fileType: 'PDF',
          remarks: '',
          file: null
        });
        fetchDocuments(true);
      } else {
        alert(res?.message || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      alert(err?.response?.data?.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  // Handle Document Deletion
  const handleDeleteDoc = async (docId, docName) => {
    if (!window.confirm(`Are you sure you want to remove "${docName}" from the student record?`)) {
      return;
    }

    try {
      const studentId = docData?.student?.id || activeChild;
      const res = await parentService.deleteDocument(docId, { studentId });
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: `Document "${docName}" has been removed.`
        });
        fetchDocuments(true);
      } else {
        alert(res?.message || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      alert(err?.response?.data?.message || 'Error deleting document');
    }
  };

  // Handle Certificate Request Submit
  const handleCertRequestSubmit = async (e) => {
    e.preventDefault();
    if (!certRequestForm.purpose.trim()) {
      alert('Please specify the purpose for requesting this certificate');
      return;
    }

    try {
      setRequestingCert(true);
      const studentName = docData?.student?.name || 'Aarav Sharma';
      const payload = {
        ...certRequestForm,
        studentName
      };

      const res = await parentService.requestCertificate(payload);
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Certificate application submitted successfully!'
        });
        setRequestCertModalOpen(false);
        setCertRequestForm({
          certificateType: 'Bonafide Student Certificate',
          purpose: '',
          deliveryMode: 'Digital PDF Download',
          urgentProcessing: false,
          additionalNotes: ''
        });
        fetchDocuments(true);
      } else {
        alert(res?.message || 'Failed to submit certificate request');
      }
    } catch (err) {
      console.error('Error submitting certificate request:', err);
      alert(err?.response?.data?.message || 'Error submitting certificate request');
    } finally {
      setRequestingCert(false);
    }
  };

  // Download Action Simulator
  const handleDownload = (doc) => {
    // If it's a real file URL or simulated PDF, trigger download
    const filename = `${doc.documentName || doc.templateTitle || 'Document'}.${(doc.fileType || 'PDF').toLowerCase()}`;
    const blob = new Blob([
      `ALL CORE SOLUTIONS - OFFICIAL VERIFIED DOCUMENT ARCHIVE\n\n` +
      `Document Title: ${doc.documentName || doc.templateTitle}\n` +
      `Category: ${doc.category || doc.certificateType}\n` +
      `Student Name: ${docData?.student?.name || 'Aarav Sharma'}\n` +
      `Admission No: ${docData?.student?.admissionNo || 'YIS-2024-101'}\n` +
      `Status: VERIFIED & SEALED BY SCHOOL ADMINISTRATION\n` +
      `Date: ${new Date().toLocaleDateString('en-GB')}\n\n` +
      (doc.renderedContent || doc.remarks || 'Official student archival document.')
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = doc.fileUrl && doc.fileUrl.startsWith('http') ? doc.fileUrl : url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const student = docData?.student || {
    name: 'Aarav Sharma',
    admissionNo: 'YIS-2024-101',
    className: 'Class I (A)',
    fatherName: 'Rajesh Kumar Gupta',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  };

  const documents = docData?.documents || [];
  const certificates = docData?.certificates || [];
  const certificateRequests = docData?.certificateRequests || [];
  const stats = docData?.stats || {
    totalDocuments: documents.length,
    verifiedDocuments: documents.length,
    pendingDocuments: 0,
    issuedCertificates: certificates.length
  };

  // Filter documents by category & search query
  const filteredDocuments = documents.filter((doc) => {
    const matchesCat =
      selectedCategory === 'All Documents' ||
      doc.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      doc.documentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.remarks?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    'All Documents',
    'Identity Proof',
    'Academic & Marksheet',
    'Health & Medical',
    'Administrative',
    'Official Certificates'
  ];

  return (
    <div className="p-3 sm:p-5 max-w-[1440px] mx-auto min-h-screen bg-slate-50 space-y-5 pb-24">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-all animate-in fade-in ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Royal Blue Hero Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-blue-400/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Glow circle */}
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md text-amber-300 flex items-center justify-center flex-shrink-0 font-bold shadow-md border border-white/20">
              <Folder className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
                  Student Documents & Certificates Vault
                </h1>
                <span className="bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  Verified Records
                </span>
              </div>
              <p className="text-[12px] text-blue-100 mt-1">
                Official identification records, academic grade sheets, verified certificates & administrative documents for <strong className="text-white">{student.name || 'Kabir Singh'}</strong> ({student.className || 'Class 10th (A)'})
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={() => fetchDocuments(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
            title="Refresh Documents"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => setRequestCertModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-950 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border border-white/10 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Request Certificate</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Documents
            </span>
            <span className="text-xl font-black text-gray-900">{stats.totalDocuments}</span>
            <span className="text-[10px] text-gray-500 block">Archived in student vault</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Verified by School
            </span>
            <span className="text-xl font-black text-emerald-700">{stats.verifiedDocuments}</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">100% Authenticated</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Issued Certificates
            </span>
            <span className="text-xl font-black text-gray-900">{stats.issuedCertificates}</span>
            <span className="text-[10px] text-amber-700 font-semibold block">Official digital seals</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Certificate Requests
            </span>
            <span className="text-xl font-black text-blue-800">{certificateRequests.length}</span>
            <span className="text-[10px] text-blue-600 font-semibold block">In-processing tracking</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center text-center space-y-3 shadow-sm min-h-[400px]">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-base font-bold text-gray-800">Loading Student Documents Vault...</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Fetching verified academic records, identity proofs, and official school certificates from MongoDB.
          </p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 p-10 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-base font-bold text-gray-800">{error}</h3>
          <button
            onClick={() => fetchDocuments(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="bg-white border border-gray-200 p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input & View Switch */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="pl-8 pr-3 py-1.5 border border-gray-300 text-xs w-[180px] sm:w-[220px] focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="border border-gray-300 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION: OFFICIAL ISSUED CERTIFICATES (If Selected or All) */}
          {(selectedCategory === 'All Documents' || selectedCategory === 'Official Certificates') && (
            <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Official Certificates Issued by School ({certificates.length})
                    </h3>
                    <p className="text-xs text-gray-500">
                      Digitally sealed certificates generated by the Office of the Principal and Board of Examinations
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRequestCertModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" /> Apply New Certificate
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div 
                    key={cert._id}
                    className="border-2 border-amber-200/80 bg-gradient-to-br from-amber-50/30 to-white p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                  >
                    {/* Ornamental Watermark Tag */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-200 inline-block mb-1">
                          {cert.certificateNumber}
                        </span>
                        <h4 className="text-base font-extrabold text-gray-900">
                          {cert.templateTitle}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium">
                          Session {cert.academicYear} • Issued on {new Date(cert.issueDate).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Award className="w-6 h-6" />
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 line-clamp-2 italic bg-white/80 p-3 border border-amber-100 mb-4">
                      "{cert.renderedContent}"
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-amber-200/60">
                      <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                        <Building className="w-3 h-3 text-indigo-600" /> {cert.issuedBy}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewCert(cert)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Certificate
                        </button>
                        <button
                          onClick={() => handleDownload(cert)}
                          className="px-2.5 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: UPLOADED STUDENT DOCUMENTS */}
          {selectedCategory !== 'Official Certificates' && (
            <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {selectedCategory} ({filteredDocuments.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Official records deposited during admission and academic progression
                  </p>
                </div>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload Supporting Document
                </button>
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-gray-300">
                  <Folder className="w-12 h-12 text-gray-300" />
                  <h4 className="text-sm font-bold text-gray-700">No documents found matching this filter</h4>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Try changing the category or clearing your search query.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => {
                    const isImg = doc.fileType === 'PNG' || doc.fileType === 'JPEG' || doc.fileType === 'JPG';
                    return (
                      <div 
                        key={doc._id}
                        className="border border-gray-200 p-4.5 bg-white shadow-xs hover:border-indigo-400 hover:shadow-sm transition-all flex flex-col justify-between space-y-3 group"
                      >
                        {/* Card Header & Icon */}
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 border ${
                            isImg 
                              ? 'bg-purple-50 border-purple-200 text-purple-600' 
                              : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                          }`}>
                            {isImg ? (
                              <FileImage className="w-6 h-6" />
                            ) : (
                              <FileText className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">
                              {doc.category}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors" title={doc.documentName}>
                              {doc.documentName}
                            </h4>
                            <span className="text-[11px] text-gray-500 font-medium block">
                              {doc.fileType} • {doc.fileSize}
                            </span>
                          </div>
                        </div>

                        {/* Status & Remarks */}
                        <div className="bg-gray-50 p-2.5 border border-gray-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Verification:</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 truncate" title={doc.remarks}>
                            {doc.remarks || 'Archived in student electronic file.'}
                          </p>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(doc.uploadDate).toLocaleDateString('en-GB')}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-1 border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            {doc.uploadedBy?.includes('Parent') && (
                              <button
                                onClick={() => handleDeleteDoc(doc._id, doc.documentName)}
                                className="p-1 border border-red-200 hover:bg-red-50 text-red-500 transition-colors"
                                title="Delete Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f2f4ff] border-b border-gray-200 text-[#4f46e5] font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="p-3">Document Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Type & Size</th>
                        <th className="p-3">Uploaded Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              {doc.fileType === 'PNG' || doc.fileType === 'JPG' ? (
                                <FileImage className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              )}
                              <span className="font-bold text-gray-900">{doc.documentName}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-gray-700">{doc.category}</span>
                          </td>
                          <td className="p-3 text-gray-600 font-mono text-[11px]">
                            {doc.fileType} • {doc.fileSize}
                          </td>
                          <td className="p-3 text-gray-700">
                            {new Date(doc.uploadDate).toLocaleDateString('en-GB')}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {doc.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-1 border border-gray-300 hover:bg-gray-100 text-gray-600"
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              {doc.uploadedBy?.includes('Parent') && (
                                <button
                                  onClick={() => handleDeleteDoc(doc._id, doc.documentName)}
                                  className="p-1 border border-red-200 hover:bg-red-50 text-red-500"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
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

          {/* SECTION: CERTIFICATE REQUESTS TRACKER */}
          <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Official Certificate Application Tracker ({certificateRequests.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Live status of certificates submitted to the administrative desk for principal seal and dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRequestCertModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> New Certificate Request
              </button>
            </div>

            <div className="space-y-3">
              {certificateRequests.map((req) => (
                <div 
                  key={req.requestId}
                  className="border border-gray-200 p-4 bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5">
                        #{req.requestId}
                      </span>
                      <span className="font-bold text-gray-900 text-sm">{req.certificateType}</span>
                    </div>
                    <p className="text-gray-600 font-medium">
                      Purpose: <span className="text-gray-900 font-semibold">{req.purpose}</span> • Delivery: <span className="font-semibold text-gray-800">{req.deliveryMode}</span>
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Applied on: {req.requestedDate} • Est. Ready Date: <span className="font-bold text-indigo-700">{req.estimatedReadyDate}</span>
                    </p>
                    {req.adminRemarks && (
                      <p className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 border border-emerald-200 font-medium mt-1">
                        Admin Note: {req.adminRemarks}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 border ${
                      req.status?.includes('Ready') || req.status?.includes('Approved')
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {req.status}
                    </span>
                    {req.urgentProcessing && (
                      <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5">
                        Priority Dispatch
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: VIEW UPLOADED DOCUMENT PREVIEW                   */}
      {/* ========================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-300" />
                <div>
                  <h3 className="text-sm font-bold text-white">{previewDoc.documentName}</h3>
                  <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-medium">
                    {previewDoc.category} • {previewDoc.fileType} DOCUMENT
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-6 flex items-center justify-center">
              {previewDoc.fileType === 'PNG' || previewDoc.fileType === 'JPG' || previewDoc.fileType === 'JPEG' ? (
                <div className="bg-white p-4 shadow border max-w-md w-full text-center space-y-3">
                  <img
                    src={previewDoc.fileUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"}
                    alt={previewDoc.documentName}
                    className="max-h-[50vh] mx-auto object-contain border"
                  />
                  <div className="text-xs font-bold text-gray-800">{previewDoc.documentName}</div>
                  <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5">
                    Verified Digital Photo
                  </span>
                </div>
              ) : (
                /* PDF Document Layout */
                <div className="w-full max-w-2xl bg-white shadow-xl border border-gray-300 p-8 space-y-6 text-gray-900">
                  {/* Document Header */}
                  <div className="text-center border-b-2 border-indigo-900 pb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">
                      Official Verified Institutional Archive
                    </span>
                    <h2 className="text-xl font-black text-gray-900 mt-0.5">
                      ALL CORE SOLUTIONS
                    </h2>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Sector 14, Phase II, New Delhi - 110025 • Regn #CBSE-2130849
                    </p>
                    <div className="inline-block mt-2 px-3 py-0.5 bg-gray-100 border text-[11px] font-bold uppercase tracking-wider text-gray-800">
                      {previewDoc.documentName}
                    </div>
                  </div>

                  {/* Document Meta Table */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 border border-gray-200">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Student Name</span>
                      <span className="font-bold text-gray-900">{student.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Admission Number</span>
                      <span className="font-bold text-indigo-700">{student.admissionNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Class & Section</span>
                      <span className="font-bold text-gray-800">{student.className}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Verification Status</span>
                      <span className="font-bold text-emerald-700">{previewDoc.status} ({previewDoc.verifiedBy})</span>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="text-xs text-gray-700 leading-relaxed space-y-3">
                    <p>
                      This electronic record confirms that the document titled <strong>"{previewDoc.documentName}"</strong> was deposited with the Registrar and verified against original credentials.
                    </p>
                    <p className="p-3 bg-indigo-50/50 border border-indigo-100 font-medium text-gray-800">
                      {previewDoc.remarks || 'Document authenticated and stored in the encrypted Student Record Repository.'}
                    </p>
                  </div>

                  {/* QR & Verification Footer */}
                  <div className="pt-6 border-t border-gray-200 grid grid-cols-2 items-end text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-gray-900">Admissions & Records Authority</div>
                      <div className="text-[10px] text-gray-500">All Core Solutions Central Archive</div>
                      <div className="text-[10px] text-gray-400">Date Verified: {new Date(previewDoc.uploadDate).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block border-2 border-emerald-600 bg-emerald-50 px-3 py-1.5 text-emerald-900 font-bold text-[10px] uppercase">
                        ✓ VERIFIED & VALID
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: VIEW OFFICIAL ISSUED CERTIFICATE (PRINTABLE)    */}
      {/* ========================================================= */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">{previewCert.templateTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
                <button
                  onClick={() => handleDownload(previewCert)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Print View */}
            <div className="p-8 sm:p-12 space-y-6 text-gray-900 bg-gradient-to-br from-amber-50/20 via-white to-amber-50/20 border-8 border-double border-amber-300 m-4 shadow-inner">
              {/* Top Banner */}
              <div className="text-center space-y-1 border-b-2 border-amber-400 pb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                  Affiliated to CBSE, New Delhi | Affiliation No: 2130892
                </span>
                <h2 className="text-3xl font-black text-indigo-950 tracking-tight">
                  ALL CORE SOLUTIONS
                </h2>
                <p className="text-xs text-gray-600 font-medium">
                  Institutional Area, Sector 14, New Delhi - 110001 • Tel: +91 11 2808 9000
                </p>
                <div className="pt-2">
                  <span className="inline-block px-6 py-1 bg-amber-500 text-white text-xs font-black uppercase tracking-widest shadow-xs">
                    {previewCert.templateTitle}
                  </span>
                </div>
              </div>

              {/* Certificate Identification */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Certificate No: <span className="text-indigo-950 font-mono">{previewCert.certificateNumber}</span></span>
                <span>Issue Date: <span className="text-gray-900">{new Date(previewCert.issueDate).toLocaleDateString('en-GB')}</span></span>
              </div>

              {/* Main Statement */}
              <div className="py-4 text-center space-y-4">
                <p className="text-sm text-gray-600 font-serif italic">This is proudly presented and certified to</p>
                <h3 className="text-2xl font-black text-indigo-900 tracking-wide underline underline-offset-8 decoration-amber-400">
                  {previewCert.studentName || student.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Admission No: <strong className="text-gray-800">{previewCert.admissionNo || student.admissionNo}</strong> • Class: <strong className="text-gray-800">{previewCert.className || student.className}</strong>
                </p>

                <p className="text-sm text-gray-800 leading-relaxed font-medium max-w-lg mx-auto pt-2">
                  {previewCert.renderedContent}
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-10 grid grid-cols-3 items-end text-xs border-t border-amber-300">
                <div className="text-left space-y-1">
                  <div className="font-serif italic text-gray-800 font-bold text-sm">Anita Roy</div>
                  <div className="font-bold text-gray-900">Class Teacher</div>
                  <div className="text-[10px] text-gray-500">Class I (A)</div>
                </div>
                <div className="text-center">
                  <div className="inline-block border-2 border-amber-500 bg-amber-50/80 rounded-full w-20 h-20 p-2 flex flex-col items-center justify-center text-[9px] font-black uppercase text-amber-900 shadow-xs mx-auto">
                    <span>OFFICIAL</span>
                    <span>SCHOOL</span>
                    <span>SEAL</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-serif italic text-gray-800 font-bold text-sm">Dr. Rajeshwar Sen</div>
                  <div className="font-bold text-gray-900">Principal</div>
                  <div className="text-[10px] text-gray-500">All Core Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: UPLOAD NEW SUPPORTING DOCUMENT                   */}
      {/* ========================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">Upload Supporting Student Document</h3>
              </div>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div className="bg-indigo-50 border border-indigo-200 p-3 text-indigo-900">
                <p className="font-bold">Student Record: {student.name} ({student.admissionNo})</p>
                <p className="text-[11px] text-indigo-800">
                  Uploaded files will be deposited into the student's electronic dossier and verified by administration.
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Document Title / Name</label>
                <input
                  type="text"
                  value={uploadForm.documentName}
                  onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Passport Copy, Residence Utility Bill, Medical Prescription"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Document Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-semibold bg-white focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Identity Proof">Identity Proof</option>
                    <option value="Academic & Marksheet">Academic & Marksheet</option>
                    <option value="Health & Medical">Health & Medical</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Other">Other Supporting Document</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Document Format</label>
                  <select
                    value={uploadForm.fileType}
                    onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-semibold bg-white focus:outline-none focus:border-indigo-600"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="PNG">PNG Image (.png)</option>
                    <option value="JPEG">JPEG Image (.jpg/.jpeg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Select File from Device (Optional)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  className="w-full p-1.5 border border-gray-300 text-xs font-medium focus:outline-none focus:border-indigo-600 bg-gray-50"
                />
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Supported formats: PDF, PNG, JPG (Max file size: 5 MB)
                </span>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Remarks / Document Notes</label>
                <textarea
                  rows={2}
                  value={uploadForm.remarks}
                  onChange={(e) => setUploadForm({ ...uploadForm, remarks: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="Additional context or purpose of this document..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {uploading ? 'Uploading...' : 'Upload & Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: REQUEST OFFICIAL CERTIFICATE APPLICATION         */}
      {/* ========================================================= */}
      {requestCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-indigo-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-bold">Apply for Official Certificate from School</h3>
              </div>
              <button 
                onClick={() => setRequestCertModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCertRequestSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Certificate Type Required</label>
                <select
                  value={certRequestForm.certificateType}
                  onChange={(e) => setCertRequestForm({ ...certRequestForm, certificateType: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-bold bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="Bonafide Student Certificate">Bonafide Student Certificate</option>
                  <option value="Character & Conduct Certificate">Character & Conduct Certificate</option>
                  <option value="Fee Clearance & No Dues Certificate">Fee Clearance & No Dues Certificate</option>
                  <option value="Transfer Certificate (TC)">Transfer Certificate (TC)</option>
                  <option value="Study & Medium of Instruction Certificate">Study & Medium of Instruction Certificate</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Purpose / Reason for Request</label>
                <input
                  type="text"
                  value={certRequestForm.purpose}
                  onChange={(e) => setCertRequestForm({ ...certRequestForm, purpose: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Passport application, Visa processing, Bank account, Coaching"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Delivery Preference</label>
                  <select
                    value={certRequestForm.deliveryMode}
                    onChange={(e) => setCertRequestForm({ ...certRequestForm, deliveryMode: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-semibold bg-white focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Digital PDF Download">Digital PDF Download</option>
                    <option value="Physical Collect from School Desk">Physical Hardcopy from School Desk</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={certRequestForm.urgentProcessing}
                      onChange={(e) => setCertRequestForm({ ...certRequestForm, urgentProcessing: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded-none"
                    />
                    <span>Urgent (24h Turnaround)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Additional Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={certRequestForm.additionalNotes}
                  onChange={(e) => setCertRequestForm({ ...certRequestForm, additionalNotes: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="Any special remarks or authority to address..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRequestCertModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestingCert}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  {requestingCert ? 'Submitting Application...' : 'Submit Certificate Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
