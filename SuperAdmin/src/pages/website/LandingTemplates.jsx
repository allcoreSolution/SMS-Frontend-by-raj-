import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code, Puzzle, Plus, Lock, Download, Layers, Check, Edit, Trash2,
  FileDown, CheckCircle, ExternalLink, ToggleLeft, ToggleRight,
  Eye, RefreshCw, X, Monitor, Smartphone, Save, Sparkles, Copy,
  ArrowRight, Shield, Award, Terminal, Sliders
} from 'lucide-react';
import Swal from 'sweetalert2';
import landingPageService from '../../api/landingPageService';

// Available Dynamic Merge Variables for Landing Page HTML
const BLADE_VARIABLES = [
  { tag: '{{ $app_name }}', label: 'Platform Name', sample: 'ALL CORE SOLUTION' },
  { tag: '{{ $app_tagline }}', label: 'Tagline', sample: 'Next-Gen Multi-School ERP Cloud Platform' },
  { tag: '{{ $schools_count }}', label: 'Total Schools', sample: '700+' },
  { tag: '{{ $students_count }}', label: 'Total Students', sample: '250,000+' },
  { tag: '{{ $contact_phone }}', label: 'Contact Phone', sample: '+91 98765 43210' },
  { tag: '{{ $contact_email }}', label: 'Support Email', sample: 'support@allcoresolution.com' },
  { tag: '{{ $login_url }}', label: 'Super Admin Login', sample: '/login' },
  { tag: '{{ $teacher_apk }}', label: 'Teacher App APK', sample: 'Teacher.apk' },
  { tag: '{{ $student_apk }}', label: 'Student Parent APK', sample: 'Student_Parents.apk' },
  { tag: '{{ $driver_apk }}', label: 'Bus Driver App APK', sample: 'Driver.apk' },
  { tag: '{{ $accountant_apk }}', label: 'Accountant App APK', sample: 'Accountant.apk' },
];

export default function LandingTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [landingMode, setLandingMode] = useState('html_template'); // 'html_template' | 'sections'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quickImportOpen, setQuickImportOpen] = useState(false);

  // Modals state
  const [editorTemplate, setEditorTemplate] = useState(null); // null or template object
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null); // for live HTML preview modal
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'

  const codeTextareaRef = useRef(null);

  // Fetch templates & active mode from backend
  const fetchTemplatesData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await landingPageService.getHtmlTemplates();
      if (data) {
        setTemplates(data.templates || []);
        if (data.mode) setLandingMode(data.mode);
      }
    } catch (err) {
      console.error('Error fetching landing HTML templates:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTemplatesData();
  }, []);

  // Switch Landing Mode (Sections vs Full HTML)
  const handleSwitchMode = async () => {
    const targetMode = landingMode === 'html_template' ? 'sections' : 'html_template';
    try {
      const res = await landingPageService.switchMode(targetMode);
      setLandingMode(res.mode);
      Swal.fire({
        icon: 'success',
        title: res.message,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  // Activate a Template
  const handleActivateTemplate = async (template) => {
    if (template.active) return;
    try {
      const res = await landingPageService.activateTemplate(template._id);
      Swal.fire({
        icon: 'success',
        title: `Template "${template.name}" Activated!`,
        text: 'Full HTML template is now live for all visitors.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      fetchTemplatesData(true);
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  // Quick Import bundled template
  const handleQuickImport = async () => {
    try {
      setLoading(true);
      const res = await landingPageService.importBundledTemplate();
      Swal.fire({
        icon: 'success',
        title: 'Template Imported!',
        text: res.message,
        confirmButtonColor: '#f97316'
      });
      fetchTemplatesData();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Template
  const handleDeleteTemplate = (template) => {
    if (template.active) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete Active Template',
        text: 'Please activate another template or switch mode before deleting this template.',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    Swal.fire({
      title: 'Delete Template?',
      text: `Are you sure you want to permanently delete "${template.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await landingPageService.deleteHtmlTemplate(template._id);
          Swal.fire({
            icon: 'success',
            title: 'Template Deleted',
            timer: 1200,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          setTemplates((prev) => prev.filter((t) => t._id !== template._id));
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || err.message, 'error');
        }
      }
    });
  };

  // Save in Editor (Create or Update)
  const handleSaveEditor = async (e) => {
    e.preventDefault();
    if (!editorTemplate?.name?.trim()) {
      Swal.fire('Error', 'Template name is required', 'error');
      return;
    }
    if (!editorTemplate?.htmlContent?.trim()) {
      Swal.fire('Error', 'HTML Content cannot be empty', 'error');
      return;
    }

    try {
      if (isNewTemplate) {
        const res = await landingPageService.createHtmlTemplate(editorTemplate);
        Swal.fire({
          icon: 'success',
          title: 'Template Created!',
          text: `"${res.template.name}" saved to library.`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await landingPageService.updateHtmlTemplate(editorTemplate._id, editorTemplate);
        Swal.fire({
          icon: 'success',
          title: 'Template Updated!',
          text: 'Changes saved successfully.',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
      setEditorTemplate(null);
      fetchTemplatesData(true);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Insert variable tag into HTML textarea at cursor
  const insertVariable = (tag) => {
    const textarea = codeTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editorTemplate.htmlContent || '';
    const updated = text.substring(0, start) + tag + text.substring(end);

    setEditorTemplate({ ...editorTemplate, htmlContent: updated });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 50);
  };

  // Open New Template Editor
  const handleOpenNewTemplate = () => {
    setIsNewTemplate(true);
    setEditorTemplate({
      name: 'Custom School ERP Landing Page',
      tag: 'orange',
      description: 'Custom full HTML template for ALL CORE SOLUTION educational SaaS.',
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ $app_name }}</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #fff; text-align: center; padding: 60px 20px; }
    h1 { color: #f97316; font-size: 2.5rem; }
    p { color: #94a3b8; font-size: 1.1rem; }
  </style>
</head>
<body>
  <h1>{{ $app_name }}</h1>
  <p>{{ $app_tagline }}</p>
  <p>Managing {{ $schools_count }} campuses & {{ $students_count }} students.</p>
</body>
</html>`
    });
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto min-h-[85vh] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. TOP HEADER SECTION (Matches multischool templates header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 flex items-center justify-center shadow-md">
            <Code className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Landing Page Templates
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Full HTML landing templates, quick import and code editor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => fetchTemplatesData(true)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs cursor-pointer"
            title="Refresh Templates"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/landing-page')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <Puzzle className="w-4 h-4 text-indigo-600" />
            <span>Section Builder</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNewTemplate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* 2. DEMO / PRODUCTION NOTICE */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm shadow-xs">
        <Shield className="w-4 h-4 text-amber-600 shrink-0" />
        <p>
          <strong>Enterprise Mode:</strong> Landing page templates are synced live with MongoDB Atlas and served instantly to your custom school domain.
        </p>
      </div>

      {/* 3. LANDING PAGE MODE CARD (card-outline card-success) */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 transition-all shadow-xs ${
          landingMode === 'html_template'
            ? 'bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/30 border-emerald-300'
            : 'bg-gradient-to-r from-cyan-50/70 via-white to-cyan-50/30 border-cyan-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-2xs">
                {landingMode === 'html_template' ? (
                  <ToggleRight className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-cyan-600" />
                )}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Landing Page Mode:
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  landingMode === 'html_template'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                }`}
              >
                {landingMode === 'html_template' ? 'Full HTML Template' : 'Section Builder'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 pl-9">
              {landingMode === 'html_template'
                ? 'Your custom HTML template is live. Visitors see the full template (header to footer).'
                : 'Section Builder is active. Visitors see modular block-by-block sections.'}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleSwitchMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs ${
                landingMode === 'html_template'
                  ? 'border-cyan-300 bg-white text-cyan-700 hover:bg-cyan-50'
                  : 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>
                {landingMode === 'html_template'
                  ? 'Switch to Section Builder'
                  : 'Switch to Full HTML Template'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK IMPORT CARD (card-outline card-warning) */}
      <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-xs">
        <div
          onClick={() => setQuickImportOpen((prev) => !prev)}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-amber-50/30 transition bg-amber-50/20 border-b border-amber-100"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Quick Import</h3>
              <p className="text-xs text-slate-500">
                Import bundled production templates from the <code>devx/</code> repository
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-amber-200 flex items-center justify-center text-amber-700 bg-white"
          >
            {quickImportOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {quickImportOpen && (
          <div className="p-5 sm:p-6 space-y-3 bg-white animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm text-slate-600">
              Import the bundled <code className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-amber-800">school-erp-landing.html</code> template from the <code className="px-1.5 py-0.5 rounded bg-slate-100 font-bold">devx/</code> directory as a ready-to-use template for <strong>ALL CORE SOLUTION</strong>.
            </p>
            <div>
              <button
                type="button"
                onClick={handleQuickImport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
              >
                <FileDown className="w-4 h-4" />
                <span>Import school-erp-landing.html</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. SAVED TEMPLATES TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">
              Saved Templates ({templates.length})
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {templates.filter((t) => t.active).length} Active Live
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Templates Found</p>
            <p className="text-xs text-slate-400 mt-1">
              Click Quick Import or New Template to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Template Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 w-32">Last Updated</th>
                  <th className="py-3 px-4 w-64 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.map((tpl) => (
                  <tr
                    key={tpl._id}
                    className={`hover:bg-slate-50/60 transition ${
                      tpl.active ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    {/* Status Column */}
                    <td className="py-4 px-4 text-center align-middle">
                      {tpl.active ? (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 shadow-xs"
                          title="Active Live Template"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-400"
                          title="Inactive"
                        >
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        </span>
                      )}
                    </td>

                    {/* Template Name */}
                    <td className="py-4 px-4 align-middle">
                      <div className="font-extrabold text-slate-900">{tpl.name}</div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-500 mt-0.5">
                        {tpl.tag || 'orange'}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-4 align-middle text-slate-500 text-xs">
                      {tpl.description || 'Full institutional landing page template.'}
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 align-middle text-slate-400 text-xs font-mono">
                      {new Date(tpl.updatedAt || Date.now()).toLocaleDateString()}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewTemplate(false);
                            setEditorTemplate({ ...tpl });
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                          title="Edit HTML & Variables"
                        >
                          <Edit className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Edit</span>
                        </button>

                        {/* Preview Button */}
                        <button
                          type="button"
                          onClick={() => setPreviewTemplate(tpl)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                          title="Live Preview"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>Preview</span>
                        </button>

                        {/* Activate Button */}
                        {tpl.active ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleActivateTemplate(tpl)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                            title="Set this template as active live page"
                          >
                            <span>Activate</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        {!tpl.active && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTemplate(tpl)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete template"
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

      {/* ======================================================== */}
      {/* 6. FULL HTML CODE EDITOR MODAL */}
      {/* ======================================================== */}
      {editorTemplate && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setEditorTemplate(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-6xl w-full overflow-hidden flex flex-col my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Editor Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {isNewTemplate ? 'New Landing Page Template' : `Edit: ${editorTemplate.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Live HTML Editor with dynamic Blade merge variables
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(editorTemplate)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview HTML</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTemplate(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <form onSubmit={handleSaveEditor} className="flex-1 flex flex-col overflow-hidden">
              {/* Meta controls row */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Template Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editorTemplate.name}
                    onChange={(e) => setEditorTemplate({ ...editorTemplate, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tag / Theme</label>
                  <select
                    value={editorTemplate.tag}
                    onChange={(e) => setEditorTemplate({ ...editorTemplate, tag: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white"
                  >
                    <option value="orange">Orange (Default)</option>
                    <option value="blue">Blue Classic</option>
                    <option value="midnight">Midnight Neon Dark</option>
                    <option value="emerald">Emerald Launch</option>
                    <option value="custom">Custom Theme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={editorTemplate.description || ''}
                    onChange={(e) =>
                      setEditorTemplate({ ...editorTemplate, description: e.target.value })
                    }
                    placeholder="Short description of this design..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Main Code Area + Blade Variables Drawer */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[350px]">
                {/* Left Code Textarea (9 cols) */}
                <div className="lg:col-span-9 flex flex-col border-r border-slate-200 bg-slate-950">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">HTML / Blade Template Code</span>
                    <span>Use tags on the right to insert dynamic data</span>
                  </div>
                  <textarea
                    ref={codeTextareaRef}
                    rows={18}
                    required
                    value={editorTemplate.htmlContent || ''}
                    onChange={(e) =>
                      setEditorTemplate({ ...editorTemplate, htmlContent: e.target.value })
                    }
                    className="w-full flex-1 p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-600 selection:text-white"
                    placeholder="Enter full HTML template code..."
                  />
                </div>

                {/* Right Blade Variables Drawer (3 cols) */}
                <div className="lg:col-span-3 bg-slate-900 p-4 border-t lg:border-t-0 border-slate-800 overflow-y-auto space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Blade Variables</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Click any variable below to insert it at cursor position in HTML.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {BLADE_VARIABLES.map((v) => (
                      <button
                        key={v.tag}
                        type="button"
                        onClick={() => insertVariable(v.tag)}
                        className="w-full text-left p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/50 transition cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <code className="text-[11px] font-bold text-amber-300 font-mono group-hover:text-amber-200">
                            {v.tag}
                          </code>
                          <Plus className="w-3 h-3 text-slate-400 group-hover:text-amber-300" />
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
                          <span>{v.label}</span>
                          <span className="font-mono text-slate-500 truncate max-w-[90px]">
                            {v.sample}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
                    <p className="font-bold text-slate-400">Shortcuts</p>
                    <p>• Ctrl+S: Save changes</p>
                    <p>• Ctrl+F: Search inside editor</p>
                  </div>
                </div>
              </div>

              {/* Editor Footer Actions */}
              <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditorTemplate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-wider transition shadow-md shadow-orange-500/20 cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Template</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. FULLSCREEN HTML PREVIEW MODAL */}
      {/* ======================================================== */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-200">
          <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-black text-white">
                  Preview: {previewTemplate.name}
                </h3>
                <p className="text-[10px] text-slate-400">
                  Full HTML template preview with injected platform data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center bg-slate-950">
            <div
              className={`bg-white transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl ${
                previewDevice === 'mobile'
                  ? 'w-[360px] border-4 border-slate-800 rounded-[32px] my-auto h-[680px]'
                  : 'w-full max-w-6xl h-full'
              }`}
            >
              <iframe
                title="Template Live Preview"
                srcDoc={previewTemplate.htmlContent
                  .replace(/\{\{\s*\$app_name\s*\}\}/g, 'ALL CORE SOLUTION')
                  .replace(/\{\{\s*\$app_tagline\s*\}\}/g, 'Next-Gen Multi-School ERP Cloud Platform')
                  .replace(/\{\{\s*\$schools_count\s*\}\}/g, '700+')
                  .replace(/\{\{\s*\$students_count\s*\}\}/g, '250,000+')
                  .replace(/\{\{\s*\$contact_phone\s*\}\}/g, '+91 98765 43210')
                  .replace(/\{\{\s*\$contact_email\s*\}\}/g, 'support@allcoresolution.com')
                  .replace(/\{\{\s*\$login_url\s*\}\}/g, '/login')
                  .replace(/\{\{\s*\$teacher_apk\s*\}\}/g, 'Teacher.apk')
                  .replace(/\{\{\s*\$student_apk\s*\}\}/g, 'Student_Parents.apk')
                  .replace(/\{\{\s*\$driver_apk\s*\}\}/g, 'Driver.apk')
                  .replace(/\{\{\s*\$accountant_apk\s*\}\}/g, 'Accountant.apk')}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
