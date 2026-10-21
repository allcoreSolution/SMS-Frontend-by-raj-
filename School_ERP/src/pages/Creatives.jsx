import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Palette,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Search,
  Sparkles,
  X,
  Sliders,
  Check,
  Tag,
  Gift,
  Cake,
  Megaphone
} from 'lucide-react';
import Swal from 'sweetalert2';
import engagementService from '../api/engagementService';
import EngagementTabs from './engagement/EngagementTabs';

export default function Creatives() {
  const [loading, setLoading] = useState(true);
  const [creatives, setCreatives] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Birthday Card', 'Festival Banner', 'Event Flyer'
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCreative, setEditingCreative] = useState(null);
  const [previewCreative, setPreviewCreative] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Birthday Card',
    style: 'balloon-blue',
    title: 'HAPPY BIRTHDAY',
    placeholder: '[student_name]',
    greetingText: 'Wishing you a fantastic year filled with joy, success and learning!',
    subText: 'From Greenwood International School',
    backgroundGradient: 'from-blue-600 via-indigo-600 to-purple-700',
    textColor: '#ffffff'
  });
  const [saving, setSaving] = useState(false);

  // Fetch creatives from API
  const fetchCreatives = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await engagementService.getCreatives();
      if (res?.success) {
        setCreatives(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load creatives:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to load creative templates.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreatives();
  }, [fetchCreatives]);

  // Filtered creatives
  const filteredCreatives = useMemo(() => {
    return creatives.filter((c) => {
      const matchType =
        activeTab === 'All' ||
        c.type === activeTab ||
        (activeTab === 'Birthday' && c.type === 'Birthday Card') ||
        (activeTab === 'Festival' && c.type === 'Festival Banner');

      const matchSearch =
        !searchTerm ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.style?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchType && matchSearch;
    });
  }, [creatives, activeTab, searchTerm]);

  // Open Add/Edit Modal
  const handleOpenAdd = () => {
    setEditingCreative(null);
    setFormData({
      name: '',
      type: 'Birthday Card',
      style: 'balloon-blue',
      title: 'HAPPY BIRTHDAY',
      placeholder: '[student_name]',
      greetingText: 'Wishing you an inspiring year filled with curiosity and achievements!',
      subText: 'From Greenwood International School',
      backgroundGradient: 'from-blue-600 via-indigo-600 to-purple-700',
      textColor: '#ffffff'
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingCreative(item);
    setFormData({
      name: item.name || '',
      type: item.type || 'Birthday Card',
      style: item.style || 'balloon-blue',
      title: item.title || '',
      placeholder: item.placeholder || '[student_name]',
      greetingText: item.greetingText || '',
      subText: item.subText || '',
      backgroundGradient: item.backgroundGradient || 'from-indigo-600 to-purple-700',
      textColor: item.textColor || '#ffffff'
    });
    setIsFormModalOpen(true);
  };

  // Submit Save
  const handleSaveCreative = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Required Field', 'Please enter a template name.', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingCreative) {
        await engagementService.updateCreative(editingCreative._id, formData);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Template updated',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await engagementService.addCreative(formData);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'New template created',
          timer: 1500,
          showConfirmButton: false
        });
      }
      setIsFormModalOpen(false);
      fetchCreatives(true);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Could not save template', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Creative
  const handleDeleteCreative = (item) => {
    Swal.fire({
      title: 'Delete Template?',
      text: `Are you sure you want to delete "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await engagementService.deleteCreative(item._id);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Template deleted',
            timer: 1500,
            showConfirmButton: false
          });
          fetchCreatives(true);
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
        }
      }
    });
  };

  const gradientPresets = [
    { label: 'Deep Indigo', val: 'from-blue-600 via-indigo-600 to-purple-700' },
    { label: 'Bold Midnight', val: 'from-slate-900 via-indigo-950 to-purple-900' },
    { label: 'Pastel Teal', val: 'from-emerald-500 via-teal-500 to-cyan-600' },
    { label: 'Warm Sunset', val: 'from-amber-500 via-orange-500 to-rose-600' },
    { label: 'Royal Gold', val: 'from-purple-900 via-indigo-900 to-amber-700' },
    { label: 'Diya Red', val: 'from-amber-700 via-orange-700 to-red-800' },
    { label: 'Rose Pink', val: 'from-rose-600 via-pink-600 to-purple-800' },
    { label: 'Cosmic Blue', val: 'from-blue-950 via-indigo-900 to-slate-900' }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-64px)] font-sans p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-7 h-7 text-indigo-600" />
            Creatives & Greetings Gallery
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Design, preview and customize creative cards for student birthdays, faculty milestones, and festival greetings
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Create New Design
        </button>
      </div>

      {/* Tabs */}
      <EngagementTabs
        counts={{
          creatives: creatives.length
        }}
        onRefresh={() => fetchCreatives(false)}
        loading={loading}
      />

      {/* Filter Row */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
          {['All', 'Birthday Card', 'Festival Banner', 'Event Flyer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'All' ? `All Designs (${creatives.length})` : tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates, styles, titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Creatives Visual Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCreatives.map((tpl) => (
          <div
            key={tpl._id}
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
          >
            {/* Visual Card Canvas */}
            <div
              className={`h-48 p-4 bg-gradient-to-br ${
                tpl.backgroundGradient || 'from-blue-600 to-indigo-700'
              } text-white flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md uppercase">
                  {tpl.type}
                </span>
                <span className="opacity-75 font-mono">GREENWOOD</span>
              </div>

              <div className="text-center my-auto">
                <div className="text-xs font-black uppercase tracking-widest text-yellow-200">
                  {tpl.title}
                </div>
                <div className="text-base font-extrabold text-white mt-1">
                  {tpl.placeholder || '[Celebrant Name]'}
                </div>
                <p className="text-[11px] text-white/80 line-clamp-2 mt-1 px-2 italic">
                  "{tpl.greetingText}"
                </p>
              </div>

              <div className="text-[10px] text-white/70 text-center">
                {tpl.subText || 'From School Management'}
              </div>
            </div>

            {/* Template Info & Actions */}
            <div className="p-4 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{tpl.name}</h3>
                  <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">
                    Style: <strong className="text-indigo-600">{tpl.style}</strong>
                  </span>
                </div>
                {tpl.isDefault && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Default
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setPreviewCreative(tpl)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleOpenEdit(tpl)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
                  title="Edit Template"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCreative(tpl)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                  title="Delete Template"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-800">
                  {editingCreative ? 'Edit Creative Template' : 'Create New Creative Card'}
                </h2>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreative} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Balloon Blue (Birthday)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Template Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Birthday Card">Birthday Card</option>
                    <option value="Festival Banner">Festival Banner</option>
                    <option value="Event Flyer">Event Flyer</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Style Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. balloon-blue / gold-purple"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Main Title Header</label>
                <input
                  type="text"
                  placeholder="e.g. HAPPY BIRTHDAY or HAPPY DIWALI"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Greeting Message</label>
                <textarea
                  rows={2}
                  value={formData.greetingText}
                  onChange={(e) => setFormData({ ...formData, greetingText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Color Gradient Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {gradientPresets.map((g) => (
                    <button
                      type="button"
                      key={g.label}
                      onClick={() => setFormData({ ...formData, backgroundGradient: g.val })}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 ${
                        formData.backgroundGradient === g.val
                          ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${g.val}`}></div>
                      <span className="font-semibold text-slate-700 text-[11px]">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCreative ? 'Update Design' : 'Create Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE PREVIEW MODAL */}
      {previewCreative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">{previewCreative.name} — Live Card View</h2>
              <button
                onClick={() => setPreviewCreative(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div
                className={`rounded-2xl p-8 bg-gradient-to-br ${
                  previewCreative.backgroundGradient || 'from-blue-600 to-indigo-700'
                } text-white shadow-xl text-center space-y-3 relative overflow-hidden`}
              >
                <div className="text-[10px] font-mono opacity-80 uppercase tracking-widest">
                  GREENWOOD INTERNATIONAL SCHOOL
                </div>
                <Sparkles className="w-10 h-10 text-yellow-300 mx-auto animate-pulse" />
                <h3 className="text-2xl font-black uppercase tracking-wider text-yellow-200">
                  {previewCreative.title}
                </h3>
                <div className="text-lg font-extrabold text-white">
                  Aarav Sharma (Class VIII A)
                </div>
                <p className="text-xs text-white/90 italic max-w-sm mx-auto">
                  "{previewCreative.greetingText}"
                </p>
                <div className="text-[11px] text-white/75 pt-3 border-t border-white/20">
                  {previewCreative.subText}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setPreviewCreative(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
