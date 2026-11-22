import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Wand2, Edit3, ZoomIn, Eye, Copy, Trash2, Printer,
  Sparkles, X, LayoutGrid, FileText, QrCode, Award, Shield, Check,
  ChevronDown, ExternalLink, RefreshCw, Sliders, Calendar, DollarSign,
  GraduationCap, UserCheck, Heart, PartyPopper, BookOpen, Layers
} from 'lucide-react';
import Swal from 'sweetalert2';
import templateService from '../api/templateService';

// 14 Standard Multischool Categories
const CATEGORIES = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'id_card', label: 'Id Card', icon: UserCheck },
  { key: 'staff_id_card', label: 'Staff Id Card', icon: Shield },
  { key: 'marksheet', label: 'Marksheet', icon: GraduationCap },
  { key: 'fee_receipt', label: 'Fee Receipt', icon: DollarSign },
  { key: 'bonafide', label: 'Bonafide', icon: FileText },
  { key: 'transfer_certificate', label: 'Transfer Certificate', icon: FileText },
  { key: 'character_certificate', label: 'Character Certificate', icon: Award },
  { key: 'birthday_card', label: 'Birthday Card', icon: Heart },
  { key: 'festival_banner', label: 'Festival Banner', icon: PartyPopper },
  { key: 'interactive', label: 'Interactive', icon: QrCode },
  { key: 'course_certificate', label: 'Course Certificate', icon: Award },
  { key: 'admit_card', label: 'Admit Card', icon: Calendar },
  { key: 'academic', label: 'Academic', icon: BookOpen },
  { key: 'general', label: 'General', icon: Layers },
];

const PRESET_DIMENSIONS = [
  { label: 'CR80 ID Card Landscape (85.6 × 54 mm)', widthMm: 85.6, heightMm: 54, orientation: 'landscape', category: 'id_card' },
  { label: 'CR80 ID Card Portrait (54 × 85.6 mm)', widthMm: 54, heightMm: 85.6, orientation: 'portrait', category: 'id_card' },
  { label: 'A4 Certificate Landscape (297 × 210 mm)', widthMm: 297, heightMm: 210, orientation: 'landscape', category: 'bonafide' },
  { label: 'A4 Marksheet / TC Portrait (210 × 297 mm)', widthMm: 210, heightMm: 297, orientation: 'portrait', category: 'marksheet' },
  { label: 'POS Thermal Receipt (80 × 160 mm)', widthMm: 80, heightMm: 160, orientation: 'portrait', category: 'fee_receipt' },
  { label: 'Social / Banner Square (210 × 210 mm)', widthMm: 210, heightMm: 210, orientation: 'landscape', category: 'festival_banner' },
];

export default function Templates() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);

  // New Template Form State
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'id_card',
    presetIndex: 0,
    widthMm: 85.6,
    heightMm: 54,
    orientation: 'landscape'
  });

  // Fetch templates from MongoDB backend API
  const fetchTemplates = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await templateService.getTemplates();
      if (data && data.templates) {
        setTemplates(data.templates);
        setCategoryCounts(data.categoryCounts || {});
      }
    } catch (err) {
      console.error('Error fetching ready templates:', err);
      // Fallback: If network issue, use local cache
      try {
        const cached = localStorage.getItem('sa_ready_templates');
        if (cached) {
          const parsed = JSON.parse(cached);
          setTemplates(parsed);
        }
      } catch (_) {}
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchCat =
        activeCategory === 'all' ||
        tpl.category === activeCategory ||
        tpl.category === activeCategory.replace(/\s+/g, '_');

      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        (tpl.tags && tpl.tags.some((t) => t.toLowerCase().includes(q))) ||
        (tpl.category && tpl.category.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [templates, activeCategory, search]);

  // Handle Create Blank Template
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplate.name.trim()) {
      Swal.fire('Error', 'Please enter a template name', 'error');
      return;
    }

    try {
      const payload = {
        name: newTemplate.name.trim(),
        category: newTemplate.category,
        dimensions: {
          widthMm: Number(newTemplate.widthMm) || 85.6,
          heightMm: Number(newTemplate.heightMm) || 54,
          orientation: newTemplate.orientation
        },
        tags: [newTemplate.category.replace(/_/g, ' ')],
        isDesignerMade: true
      };

      const res = await templateService.createTemplate(payload);
      if (res && res.template) {
        setShowAddModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Template Created!',
          text: 'Opening in Canvas Designer...',
          timer: 1200,
          showConfirmButton: false
        });
        setTimeout(() => {
          navigate(`/templates/${res.template._id}/edit`);
        }, 1200);
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Handle Clone / Duplicate
  const handleClone = async (tpl, e) => {
    e?.stopPropagation();
    try {
      const res = await templateService.cloneTemplate(tpl._id);
      if (res && res.template) {
        Swal.fire({
          icon: 'success',
          title: 'Template Cloned!',
          text: `"${res.template.name}" added to list.`,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        fetchTemplates(true);
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Handle Delete Template
  const handleDelete = (tpl, e) => {
    e?.stopPropagation();
    Swal.fire({
      title: 'Delete Template?',
      text: `Are you sure you want to permanently delete "${tpl.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await templateService.deleteTemplate(tpl._id);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Template has been removed.',
            timer: 1200,
            showConfirmButton: false
          });
          setTemplates((prev) => prev.filter((t) => t._id !== tpl._id));
          if (previewModalTemplate?._id === tpl._id) {
            setPreviewModalTemplate(null);
          }
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || err.message, 'error');
        }
      }
    });
  };

  // Format category badge title
  const formatCategory = (cat) => {
    if (!cat) return 'General';
    return cat
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Helper to render high fidelity CSS visual preview of template
  const renderTemplateVisual = (tpl) => {
    if (tpl.thumbnailUrl) {
      return (
        <img
          src={tpl.thumbnailUrl}
          alt={tpl.name}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      );
    }

    const cat = tpl.category || 'general';

    // 1. ID Cards (Landscape & Portrait)
    if (cat === 'id_card' || cat === 'staff_id_card') {
      const isStaff = cat === 'staff_id_card';
      const isLandscape = tpl.dimensions?.orientation === 'landscape';
      return (
        <div
          className={`w-full h-full flex flex-col justify-between p-3.5 transition-all duration-300 ${
            isStaff
              ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white'
              : 'bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 text-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center text-slate-950 font-black text-[9px]">
                ACS
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-black tracking-wider uppercase">ALL CORE ACADEMY</p>
                <p className="text-[8px] text-white/70">Affiliated to CBSE</p>
              </div>
            </div>
            <span
              className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                isStaff ? 'bg-purple-500/30 text-purple-200' : 'bg-sky-500/30 text-sky-200'
              }`}
            >
              {isStaff ? 'STAFF' : 'STUDENT'}
            </span>
          </div>

          {/* Body */}
          <div className={`flex ${isLandscape ? 'flex-row' : 'flex-col'} items-center gap-3 my-auto`}>
            <div className="w-14 h-16 rounded-lg bg-white/10 border-2 border-dashed border-white/30 flex flex-col items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6 text-white/60" />
              <span className="text-[7px] text-white/50 mt-1">PHOTO</span>
            </div>
            <div className="flex-1 min-w-0 space-y-1 w-full text-left">
              <p className="text-xs font-black truncate text-amber-300">
                {isStaff ? 'Dr. Rajesh Sharma' : 'Aarav Patel'}
              </p>
              <p className="text-[9px] text-white/80 font-medium truncate">
                {isStaff ? 'Dept: Computer Science' : 'Class: 10th - Section A'}
              </p>
              <p className="text-[8px] text-white/60 font-mono">
                {isStaff ? 'EMP ID: ACS-EMP-2026' : 'Roll: 24 | Adm: 2026-9041'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[8px] text-white/60">
            <span className="font-mono">VALID: 2026-27</span>
            <div className="flex items-center gap-1">
              <QrCode className="w-4 h-4 text-white/80" />
            </div>
          </div>
        </div>
      );
    }

    // 2. Marksheets
    if (cat === 'marksheet') {
      return (
        <div className="w-full h-full bg-amber-50/40 p-3.5 border-4 border-double border-amber-900/30 flex flex-col justify-between text-slate-800">
          <div className="text-center border-b border-amber-900/20 pb-1.5">
            <p className="text-[9px] font-black uppercase tracking-wider text-amber-950">
              CENTRAL BOARD OF SECONDARY EDUCATION
            </p>
            <p className="text-[8px] font-bold text-slate-600">ANNUAL ACADEMIC PROGRESS REPORT</p>
          </div>
          <div className="my-auto space-y-1">
            <div className="flex justify-between text-[8px] font-bold text-slate-700">
              <span>Candidate: Aarav Patel</span>
              <span>Roll: 104820</span>
            </div>
            <div className="border border-slate-300 rounded overflow-hidden text-[7px]">
              <div className="grid grid-cols-4 bg-slate-200/80 font-bold p-1 text-center">
                <span>Subject</span>
                <span>Max</span>
                <span>Obt</span>
                <span>Grade</span>
              </div>
              <div className="grid grid-cols-4 p-0.5 text-center border-t border-slate-200">
                <span>Mathematics</span>
                <span>100</span>
                <span>98</span>
                <span className="font-bold text-emerald-600">A1</span>
              </div>
              <div className="grid grid-cols-4 p-0.5 text-center border-t border-slate-200 bg-slate-50">
                <span>Science</span>
                <span>100</span>
                <span>96</span>
                <span className="font-bold text-emerald-600">A1</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-amber-900/20 text-[7px] text-slate-600">
            <span className="font-bold text-emerald-700">RESULT: PASSED (DISTINCTION)</span>
            <span>Controller of Exams</span>
          </div>
        </div>
      );
    }

    // 3. Fee Receipts
    if (cat === 'fee_receipt') {
      return (
        <div className="w-full h-full bg-white p-3.5 border border-dashed border-slate-300 flex flex-col justify-between font-mono text-slate-800">
          <div className="text-center border-b border-dashed border-slate-300 pb-1.5">
            <p className="text-[10px] font-black tracking-tight">ALL CORE SOLUTION SCHOOL</p>
            <p className="text-[8px] text-slate-500">OFFICIAL FEE RECEIPT (ORIGINAL)</p>
          </div>
          <div className="my-auto space-y-1 text-[8px]">
            <div className="flex justify-between text-slate-600">
              <span>Receipt: #REC-8924</span>
              <span>Date: 22/11/2026</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Student: Aarav Patel</span>
              <span>Class X-A</span>
            </div>
            <div className="border-t border-b border-dashed border-slate-200 py-1 space-y-0.5">
              <div className="flex justify-between">
                <span>Tuition Fee (Q3)</span>
                <span>₹ 18,500</span>
              </div>
              <div className="flex justify-between">
                <span>Computer & Lab</span>
                <span>₹ 4,200</span>
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-black text-emerald-700">
              <span>TOTAL PAID</span>
              <span>₹ 22,700</span>
            </div>
          </div>
          <div className="text-center text-[7px] text-slate-400 border-t border-dashed border-slate-300 pt-1">
            THANK YOU FOR YOUR PAYMENT • PAID VIA UPI
          </div>
        </div>
      );
    }

    // 4. Certificates (Bonafide, Transfer, Character, Course)
    if (
      cat === 'bonafide' ||
      cat === 'transfer_certificate' ||
      cat === 'character_certificate' ||
      cat === 'course_certificate'
    ) {
      return (
        <div className="w-full h-full bg-[#fdfbf7] p-3.5 border-4 border-double border-amber-700/40 flex flex-col justify-between text-center text-slate-800 relative">
          <div className="absolute top-2 right-2">
            <Award className="w-5 h-5 text-amber-500/80" />
          </div>
          <div>
            <p className="text-[8px] font-serif font-black uppercase tracking-widest text-amber-900">
              ALL CORE ACADEMY
            </p>
            <div className="w-12 h-0.5 bg-amber-600 mx-auto mt-0.5" />
          </div>
          <div className="my-auto space-y-1">
            <p className="text-[11px] font-serif font-extrabold text-slate-900 uppercase tracking-wide">
              {formatCategory(cat)}
            </p>
            <p className="text-[8px] text-slate-600 italic">This is proudly awarded to</p>
            <p className="text-xs font-serif font-bold text-amber-800">Aarav Patel</p>
            <p className="text-[7px] text-slate-500 leading-tight px-2">
              For exemplary conduct, academic excellence and active scholastic participation.
            </p>
          </div>
          <div className="flex justify-between items-end border-t border-amber-900/20 pt-1 text-[7px] text-slate-500">
            <span>Date: 22-Nov-2026</span>
            <div className="text-right">
              <span className="font-serif italic font-bold">Rajesh Varma</span>
              <p className="text-[6px] text-slate-400">Principal & Director</p>
            </div>
          </div>
        </div>
      );
    }

    // 5. Birthday Cards & Festival Banners
    if (cat === 'birthday_card' || cat === 'festival_banner') {
      const isBday = cat === 'birthday_card';
      return (
        <div
          className={`w-full h-full p-3.5 flex flex-col justify-between text-white text-center ${
            isBday
              ? 'bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400'
              : 'bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[8px] uppercase tracking-wider font-bold opacity-80">
              ALL CORE CELEBRATION
            </span>
            {isBday ? <Heart className="w-4 h-4 text-white" /> : <PartyPopper className="w-4 h-4 text-white" />}
          </div>
          <div className="my-auto space-y-1">
            <p className="text-sm font-black tracking-tight drop-shadow-sm">
              {isBday ? 'HAPPY BIRTHDAY! 🎂' : 'ANNUAL FESTIVAL 2026 🎉'}
            </p>
            <p className="text-[9px] font-medium opacity-90">
              {isBday ? 'Wishing you a joyful year of learning!' : 'Grand Sports Meet & Cultural Showcase'}
            </p>
          </div>
          <div className="text-[8px] opacity-75 font-mono">
            {isBday ? 'Best Wishes from Principal & Teachers' : 'Main Campus Grounds • 10:00 AM'}
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="w-full h-full bg-slate-50 p-4 border border-slate-200 flex flex-col items-center justify-center text-center">
        <FileText className="w-10 h-10 text-slate-400 mb-2" />
        <p className="text-xs font-bold text-slate-700">{tpl.name}</p>
        <span className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          {formatCategory(cat)}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-[1350px] w-full mx-auto min-h-[85vh] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ready Templates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs">
              {templates.length} total
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            Certificates, ID cards & documents with 1-click Canvas Designer
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => fetchTemplates(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs cursor-pointer"
            title="Refresh Templates"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5] text-slate-600" />
            <span>Add Blank Template</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/templates/designer')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b3dff] via-[#5b47fb] to-[#00c4cc] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95"
          >
            <Wand2 className="w-4 h-4 stroke-[2.5]" />
            <span>Canvas Designer</span>
          </button>
        </div>
      </div>

      {/* 2. CATEGORY PILL FILTER ROW & SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by name, tags, or document type..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 15 Category Filter Pills with Dynamic Counts */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => {
            const count =
              cat.key === 'all'
                ? templates.length
                : categoryCounts[cat.key] ||
                  templates.filter((t) => t.category === cat.key).length;

            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TEMPLATE CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse"
            >
              <div className="h-56 bg-slate-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Templates Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No templates match the selected filter or search query. Click below to create a blank template.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Blank Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Preview Box with Hover Zoom */}
              <div
                onClick={() => setPreviewModalTemplate(template)}
                className="relative h-56 bg-slate-100/70 overflow-hidden cursor-zoom-in flex items-center justify-center border-b border-slate-100"
              >
                {/* Designer Badge */}
                {template.isDesignerMade && (
                  <span
                    className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold shadow-xs pointer-events-none"
                    title="Made with Canvas Designer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Canvas</span>
                  </span>
                )}

                {/* Render Visual Preview */}
                {renderTemplateVisual(template)}

                {/* Hover Zoom Overlay */}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 shadow-lg flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-200">
                    <ZoomIn className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3 bg-white">
                <div className="min-w-0">
                  <h3
                    className="text-xs sm:text-sm font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors"
                    title={template.name}
                  >
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {formatCategory(template.category)}
                    </span>
                    {template.dimensions && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {template.dimensions.widthMm}×{template.dimensions.heightMm}mm
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-slate-500">
                  <div className="flex items-center gap-1">
                    {/* Open in Canvas Designer */}
                    <button
                      type="button"
                      onClick={() => navigate(`/templates/${template._id}/edit`)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition cursor-pointer"
                      title="Open in Canvas Designer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Quick Preview */}
                    <button
                      type="button"
                      onClick={() => setPreviewModalTemplate(template)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 text-slate-500 transition cursor-pointer"
                      title="Zoom Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Duplicate / Clone */}
                    <button
                      type="button"
                      onClick={(e) => handleClone(template, e)}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 transition cursor-pointer"
                      title="Duplicate Template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(template, e)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition cursor-pointer"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FULLSCREEN / HIGH-RES ZOOM PREVIEW MODAL */}
      {/* ======================================================== */}
      {previewModalTemplate && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setPreviewModalTemplate(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                    {previewModalTemplate.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase">
                    {formatCategory(previewModalTemplate.category)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Dimensions:{' '}
                  <span className="font-mono font-bold text-slate-700">
                    {previewModalTemplate.dimensions?.widthMm}mm ×{' '}
                    {previewModalTemplate.dimensions?.heightMm}mm (
                    {previewModalTemplate.dimensions?.orientation || 'landscape'})
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalTemplate(null)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Canvas Body */}
            <div className="p-6 bg-slate-100 flex items-center justify-center min-h-[380px] max-h-[65vh] overflow-auto">
              <div className="w-full max-w-[560px] aspect-[1.4] bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                {renderTemplateVisual(previewModalTemplate)}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleClone(previewModalTemplate)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Preview</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewModalTemplate(null)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/templates/${previewModalTemplate._id}/edit`);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#8b3dff] via-[#5b47fb] to-[#00c4cc] hover:opacity-95 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 transition cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Open in Canvas Designer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ADD BLANK TEMPLATE MODAL */}
      {/* ======================================================== */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Add Blank Template</h3>
                  <p className="text-[11px] text-slate-500">Create new custom document</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Template Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g. Annual Sports Merit Certificate 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Canvas Size Preset
                </label>
                <select
                  onChange={(e) => {
                    const preset = PRESET_DIMENSIONS[Number(e.target.value)];
                    if (preset) {
                      setNewTemplate({
                        ...newTemplate,
                        presetIndex: Number(e.target.value),
                        widthMm: preset.widthMm,
                        heightMm: preset.heightMm,
                        orientation: preset.orientation
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  {PRESET_DIMENSIONS.map((preset, idx) => (
                    <option key={idx} value={idx}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Width (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTemplate.widthMm}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, widthMm: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTemplate.heightMm}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, heightMm: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Create & Open Designer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
