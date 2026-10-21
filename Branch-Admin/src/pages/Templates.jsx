import React, { useEffect, useState } from 'react';
import { 
  Search, Plus, Wand2, Calculator, Printer, Eye, Trash2, 
  Copy, FileText, CheckCircle2, Award, X, Sparkles, Filter, ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sample customizable variables for live preview
  const [previewVars, setPreviewVars] = useState({
    schoolName: 'Yug International School',
    studentName: 'Aarav Sharma',
    admNo: 'YUG-2026-0842',
    className: 'Class X - Section A',
    session: '2026 - 2027',
    date: '12 Oct, 2026',
    remarks: 'Exemplary Conduct & Academic Distinction'
  });

  // Add Template Form State
  const initialForm = {
    title: '',
    category: 'Certificate',
    tag: 'Standard',
    color: '#0b1329',
    type: 'landscape'
  };
  const [formData, setFormData] = useState(initialForm);

  const loadTemplates = () => {
    try {
      const data = branchLocalDb.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // Compute categories dynamically
  const categoriesList = [
    'All',
    'Certificate',
    'Id Card',
    'Staff Id Card',
    'Marksheet',
    'Transfer Certificate',
    'Bonafide',
    'Character Certificate',
    'Fee Receipt',
    'Admit Card',
    'Festival Banner',
    'General'
  ];

  const categories = categoriesList.map(cat => ({
    name: cat,
    count: cat === 'All' ? templates.length : templates.filter(t => t.category === cat).length
  }));

  // Filtered
  const filteredTemplates = templates.filter(t => {
    const matchesCat = activeCategory === 'All' ? true : t.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      t.title?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.tag?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Handlers
  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!formData.title) {
      Swal.fire('Title Required', 'Please provide a name for this template.', 'warning');
      return;
    }

    branchLocalDb.addTemplate(formData);
    loadTemplates();
    setIsAddModalOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Template Added!',
      text: `"${formData.title}" added to the catalog.`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleDeleteTemplate = (id, title) => {
    Swal.fire({
      title: 'Remove Template?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete'
    }).then(res => {
      if (res.isConfirmed) {
        branchLocalDb.deleteTemplate(id);
        loadTemplates();
        Swal.fire('Deleted', 'Template removed from the catalog.', 'success');
      }
    });
  };

  const handleDuplicate = (tmpl) => {
    branchLocalDb.addTemplate({
      ...tmpl,
      title: `${tmpl.title} (Copy)`
    });
    loadTemplates();
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Template cloned successfully!',
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-70px)] bg-[#f4f7fa]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <Award className="w-4 h-4" /> System Artifacts & Certificates
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Ready Templates & Document Catalog
            <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold">
              {templates.length} Ready
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Pre-designed, dynamic certificates, student ID cards, fee receipts & report card layouts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => {
              if (templates.length > 0) setPreviewTemplate(templates[0]);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            <Eye className="w-4 h-4 text-purple-600" /> Live Demo Preview
          </button>
          <button 
            onClick={() => { setFormData(initialForm); setIsAddModalOpen(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add New Template
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="relative max-w-md mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-[12px] text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search template title, category or format..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-[10px] text-xs text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={i}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isActive 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-purple-800 text-purple-100' : 'bg-gray-100 text-gray-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Templates */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-medium">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          Loading templates catalog...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-gray-200 p-8">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-bold text-gray-700">No templates found</p>
          <p className="text-xs text-gray-400 mt-1">Try selecting another category or clear the search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((t, i) => (
            <div 
              key={t.id || i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col"
            >
              {/* Thumbnail Mockup */}
              <div className="h-52 bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative flex items-center justify-center border-b border-gray-100">
                {/* Overlay Action Buttons */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={() => setPreviewTemplate(t)}
                    title="Live Preview & Print"
                    className="w-8 h-8 rounded-lg bg-white/95 text-purple-700 shadow-sm flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDuplicate(t)}
                    title="Clone Template"
                    className="w-8 h-8 rounded-lg bg-white/95 text-gray-700 shadow-sm flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(t.id, t.title)}
                    title="Delete Template"
                    className="w-8 h-8 rounded-lg bg-white/95 text-rose-600 shadow-sm flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Mockup Card Render */}
                {t.category === 'Id Card' || t.category === 'Staff Id Card' ? (
                  <div className="w-32 h-44 bg-white border-2 border-indigo-200 rounded-lg shadow-sm flex flex-col items-center p-2 text-center text-[8px] transform group-hover:scale-105 transition-transform">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[9px] mb-1">
                      Y
                    </div>
                    <div className="font-bold text-gray-800 text-[9px] leading-tight">[SCHOOL NAME]</div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full my-1.5 flex items-center justify-center text-gray-400">
                      👤
                    </div>
                    <div className="font-bold text-gray-900">[STUDENT NAME]</div>
                    <div className="text-gray-400 text-[7px]">[CLASS & SEC]</div>
                    <div className="mt-auto w-full border-t border-gray-100 pt-1 flex justify-between text-[6px] text-gray-400">
                      <span>ID: 2026-X</span>
                      <span>VALID: 2027</span>
                    </div>
                  </div>
                ) : t.category === 'Marksheet' ? (
                  <div className="w-40 h-44 bg-white border-2 border-blue-200 rounded shadow-sm p-2 flex flex-col text-[7px] transform group-hover:scale-105 transition-transform">
                    <div className="text-center font-bold text-blue-900 border-b pb-0.5 mb-1">[PROGRESS REPORT]</div>
                    <div className="grid grid-cols-2 gap-0.5 text-[6px] text-gray-500 mb-1">
                      <span>Roll: 14</span>
                      <span>Term: Final</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-2 bg-blue-50 rounded"></div>
                      <div className="h-2 bg-gray-50 rounded"></div>
                      <div className="h-2 bg-blue-50 rounded"></div>
                      <div className="h-2 bg-gray-50 rounded"></div>
                    </div>
                    <div className="mt-auto border-t pt-1 flex justify-between text-[6px] text-blue-800 font-bold">
                      <span>GRADE: A+</span>
                      <span>PASSED</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-44 h-32 bg-amber-50/50 border-2 border-amber-300 rounded shadow-sm p-3 flex flex-col items-center justify-center text-center transform group-hover:scale-105 transition-transform">
                    <div className="text-amber-600 text-lg mb-0.5">🎖️</div>
                    <div className="font-serif font-black text-amber-900 text-[10px] tracking-wide uppercase">CERTIFICATE</div>
                    <div className="text-[7px] text-amber-700 font-serif italic mt-0.5">Of Merit & Excellence</div>
                    <div className="text-[7px] text-gray-600 mt-1 font-bold">[STUDENT_NAME]</div>
                    <div className="mt-auto w-full flex justify-between text-[6px] text-gray-400 border-t border-amber-200 pt-1">
                      <span>Principal Sign</span>
                      <span>Seal</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      {t.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {t.tag || 'Standard'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
                    {t.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Auto-Populated
                  </span>
                  <button 
                    onClick={() => setPreviewTemplate(t)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    Customize & Print →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= LIVE PREVIEW & PRINT MODAL ================= */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Live Document Preview & Print</h3>
                  <p className="text-xs text-purple-200">{previewTemplate.title} ({previewTemplate.category})</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Document Visualizer */}
              <div className="lg:col-span-8 bg-gray-100 p-6 rounded-xl flex items-center justify-center min-h-[360px] border border-gray-200 overflow-hidden" id="certificate-print-area">
                {previewTemplate.category === 'Id Card' || previewTemplate.category === 'Staff Id Card' ? (
                  <div className="w-72 bg-white rounded-2xl shadow-xl border-4 border-indigo-600 overflow-hidden text-center p-6 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xl mb-2 shadow-md">
                      Y
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">{previewVars.schoolName}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-4">STUDENT IDENTITY CARD</p>
                    
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-indigo-200 flex items-center justify-center text-4xl shadow-inner mb-4">
                      👨‍🎓
                    </div>
                    
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{previewVars.studentName}</h3>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{previewVars.className}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1">Adm: {previewVars.admNo}</p>
                    
                    <div className="w-full mt-6 pt-3 border-t border-gray-200 flex justify-between text-[10px] text-gray-500 font-bold">
                      <span>SESSION: {previewVars.session}</span>
                      <span className="text-emerald-600">STATUS: ACTIVE</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-lg bg-amber-50/70 border-8 border-double border-amber-600 rounded-xl p-8 shadow-xl text-center relative font-serif">
                    <div className="text-amber-700 text-3xl mb-1">🎖️</div>
                    <h2 className="text-2xl font-black text-amber-950 uppercase tracking-widest mb-1">
                      {previewVars.schoolName}
                    </h2>
                    <p className="text-xs text-amber-800 uppercase tracking-widest font-sans font-bold mb-4">
                      {previewTemplate.title}
                    </p>
                    
                    <p className="text-xs text-gray-600 italic">This is proudly presented to</p>
                    <h1 className="text-2xl font-bold text-gray-900 underline decoration-amber-400 my-2 font-sans">
                      {previewVars.studentName}
                    </h1>
                    <p className="text-xs text-gray-700 max-w-md mx-auto leading-relaxed">
                      Of <span className="font-bold">{previewVars.className}</span> (Adm No: <span className="font-mono">{previewVars.admNo}</span>) in recognition of {previewVars.remarks} during academic year {previewVars.session}.
                    </p>

                    <div className="mt-8 pt-6 border-t border-amber-300 flex justify-between items-end text-xs font-sans text-gray-600">
                      <div>
                        <p className="font-bold">{previewVars.date}</p>
                        <p className="text-[10px] text-gray-400">Date of Issue</p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex items-center justify-center text-[10px] text-amber-800 font-bold uppercase rotate-[-12deg]">
                        OFFICIAL SEAL
                      </div>
                      <div>
                        <p className="font-bold border-b border-gray-400 pb-1">Dr. Anand Verma</p>
                        <p className="text-[10px] text-gray-400">Principal Sign</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Variable Editor */}
              <div className="lg:col-span-4 space-y-3.5">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Customize Live Fields
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">School Name</label>
                  <input 
                    type="text" 
                    value={previewVars.schoolName}
                    onChange={(e) => setPreviewVars({...previewVars, schoolName: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Student / Recipient Name</label>
                  <input 
                    type="text" 
                    value={previewVars.studentName}
                    onChange={(e) => setPreviewVars({...previewVars, studentName: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Class / Grade</label>
                    <input 
                      type="text" 
                      value={previewVars.className}
                      onChange={(e) => setPreviewVars({...previewVars, className: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Adm No</label>
                    <input 
                      type="text" 
                      value={previewVars.admNo}
                      onChange={(e) => setPreviewVars({...previewVars, admNo: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Citation Remarks</label>
                  <textarea 
                    rows={2}
                    value={previewVars.remarks}
                    onChange={(e) => setPreviewVars({...previewVars, remarks: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Print / Save as PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(null)}
                    className="w-full py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-semibold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD NEW TEMPLATE MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            <div className="px-6 py-4.5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold">Register New Template</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Template Title *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. CBSE Annual Merit Certificate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Category Type
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="Certificate">Certificate</option>
                  <option value="Id Card">Student ID Card</option>
                  <option value="Staff Id Card">Staff ID Card</option>
                  <option value="Marksheet">Marksheet / Report Card</option>
                  <option value="Fee Receipt">Fee Receipt</option>
                  <option value="Transfer Certificate">Transfer Certificate</option>
                  <option value="Bonafide">Bonafide Certificate</option>
                  <option value="Character Certificate">Character Certificate</option>
                  <option value="Admit Card">Admit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Badge Tag / Format
                </label>
                <input 
                  type="text"
                  placeholder="e.g. High Distinction / A4 Landscape"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-purple-600/20"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Templates;
