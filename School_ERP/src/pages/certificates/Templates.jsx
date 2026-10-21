import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Edit2, Trash2, User, Users, FileText, Receipt, 
  GraduationCap, Award, Plus, Sparkles, X, CheckCircle, RefreshCw, 
  ExternalLink, Printer, Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { certificateService } from '../../api/certificateService';

const TABS = [
  { id: 'All', label: 'All', icon: null },
  { id: 'Student', label: 'Student', icon: User },
  { id: 'Merit', label: 'Merit & Awards', icon: Award },
  { id: 'Admit Card', label: 'Admit Card', icon: FileText },
  { id: 'Fee Receipt', label: 'Fee Clearance', icon: Receipt },
  { id: 'Staff', label: 'Staff', icon: Users },
];

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Student',
    layout: 'Landscape',
    paperSize: 'A4',
    schoolName: 'ALL CORE SOLUTIONS',
    headerSubtitle: 'CERTIFICATE OF ACHIEVEMENT',
    bodyTemplate: 'This is to certify that {{studentName}}, student of {{className}} (Adm No: {{admissionNo}}), has successfully demonstrated commendable merit in {{academicYear}}.',
    primaryColor: '#1e3a8a',
    accentColor: '#f59e0b',
    signatoryTitle1: 'Class Teacher',
    signatoryTitle2: 'Principal'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await certificateService.getTemplates();
      if (res.success) {
        setTemplates(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await certificateService.deleteTemplate(id);
      fetchTemplates();
      showToast('Template deleted successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await certificateService.updateTemplate(editingTemplate._id, formData);
        showToast('Template updated successfully');
      } else {
        await certificateService.createTemplate(formData);
        showToast('New template created successfully');
      }
      setIsModalOpen(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (tpl) => {
    setEditingTemplate(tpl);
    setFormData({
      title: tpl.title,
      type: tpl.type,
      layout: tpl.layout,
      paperSize: tpl.paperSize,
      schoolName: tpl.schoolName,
      headerSubtitle: tpl.headerSubtitle,
      bodyTemplate: tpl.bodyTemplate,
      primaryColor: tpl.primaryColor || '#1e3a8a',
      accentColor: tpl.accentColor || '#f59e0b',
      signatoryTitle1: tpl.signatoryTitle1 || 'Class Teacher',
      signatoryTitle2: tpl.signatoryTitle2 || 'Principal'
    });
    setIsModalOpen(true);
  };

  // Filter logic
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.headerSubtitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || t.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [templates, activeTab, searchQuery]);

  const getTabCount = (tabId) => {
    if (tabId === 'All') return templates.length;
    return templates.filter(t => t.type === tabId).length;
  };

  return (
    <div className="bg-slate-50/70 min-h-screen font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Certificate & Document Templates</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  Official Formats
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Standardized templates for Bonafide, Transfer (TC), Merit, Character, and Admit Cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/certificates/documents')}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Auto-Generate Certificate
            </button>
            <button
              onClick={() => {
                setEditingTemplate(null);
                setFormData({
                  title: '',
                  type: 'Student',
                  layout: 'Landscape',
                  paperSize: 'A4',
                  schoolName: 'ALL CORE SOLUTIONS',
                  headerSubtitle: 'CERTIFICATE OF RECOGNITION',
                  bodyTemplate: 'This is to certify that {{studentName}}, student of {{className}} (Adm No: {{admissionNo}}), has shown exemplary participation in {{academicYear}}.',
                  primaryColor: '#1e3a8a',
                  accentColor: '#f59e0b',
                  signatoryTitle1: 'Class Teacher',
                  signatoryTitle2: 'Principal'
                });
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-indigo-600" /> New Template
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search certificate templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = getTabCount(tab.id);
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading certificate formats...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No Templates Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try another category tab or create a new template.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div 
                key={template._id || template.templateId} 
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Visual Certificate Miniature */}
                <div 
                  className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative cursor-pointer"
                  onClick={() => navigate(`/certificates/documents?template=${template.templateId}`)}
                  title="Click to auto-generate with this template"
                >
                  <div 
                    className="w-full h-44 rounded-2xl border-4 p-3.5 flex flex-col justify-between text-center shadow-inner relative overflow-hidden transition-transform group-hover:scale-[1.02]"
                    style={{ borderColor: template.primaryColor || '#1e3a8a', backgroundColor: '#fffdfa' }}
                  >
                    {/* Corner Ornaments */}
                    <div className="absolute top-1 left-1 text-[8px] font-serif text-amber-500 opacity-60">⚜</div>
                    <div className="absolute top-1 right-1 text-[8px] font-serif text-amber-500 opacity-60">⚜</div>
                    <div className="absolute bottom-1 left-1 text-[8px] font-serif text-amber-500 opacity-60">⚜</div>
                    <div className="absolute bottom-1 right-1 text-[8px] font-serif text-amber-500 opacity-60">⚜</div>

                    {/* School Name & Header */}
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 line-clamp-1">
                        {template.schoolName}
                      </div>
                      <div 
                        className="text-[9px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full inline-block"
                        style={{ color: template.primaryColor, backgroundColor: `${template.primaryColor}15` }}
                      >
                        {template.headerSubtitle}
                      </div>
                    </div>

                    {/* Body preview */}
                    <div className="text-[9px] text-slate-600 line-clamp-3 leading-relaxed px-2 font-serif italic">
                      "{template.bodyTemplate.replace(/{{[a-zA-Z]+}}/g, '_______')}"
                    </div>

                    {/* Signatures Row */}
                    <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold border-t border-slate-200 pt-1">
                      <span>{template.signatoryTitle1}</span>
                      <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[8px] text-amber-700">★</span>
                      <span>{template.signatoryTitle2}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {template.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {template.layout} · {template.paperSize}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1" title={template.title}>
                      {template.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/certificates/documents?template=${template.templateId}`)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Auto-Generate
                    </button>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEditModal(template)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit Template"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(template._id, template.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Edit / Create Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-700 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingTemplate ? 'Edit Certificate Template' : 'Create Custom Certificate Template'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Template Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Fair Distinction Award"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Student">Student General</option>
                    <option value="Merit">Merit & Scholastic</option>
                    <option value="Admit Card">Admit Card</option>
                    <option value="Fee Receipt">Fee Clearance</option>
                    <option value="Staff">Staff Recognition</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Header Subtitle</label>
                  <input
                    type="text"
                    value={formData.headerSubtitle}
                    onChange={e => setFormData({ ...formData, headerSubtitle: e.target.value })}
                    placeholder="e.g. CERTIFICATE OF SCHOLASTIC HONOUR"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Certificate Body Content (Use Placeholders: <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">{"{{studentName}}"}</code>, <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">{"{{fatherName}}"}</code>, <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">{"{{className}}"}</code>, <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">{"{{admissionNo}}"}</code>, <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">{"{{academicYear}}"}</code>)
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.bodyTemplate}
                  onChange={e => setFormData({ ...formData, bodyTemplate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Signatory Title 1</label>
                  <input
                    type="text"
                    value={formData.signatoryTitle1}
                    onChange={e => setFormData({ ...formData, signatoryTitle1: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Signatory Title 2</label>
                  <input
                    type="text"
                    value={formData.signatoryTitle2}
                    onChange={e => setFormData({ ...formData, signatoryTitle2: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Border Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600 font-bold">{formData.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Layout</label>
                  <select
                    value={formData.layout}
                    onChange={e => setFormData({ ...formData, layout: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Landscape">Landscape (Recommended)</option>
                    <option value="Portrait">Portrait</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                >
                  {editingTemplate ? 'Update Template' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
