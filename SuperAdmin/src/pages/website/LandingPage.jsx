import React, { useState, useEffect, useMemo } from 'react';
import {
  GripVertical, Lock, Pencil, Trash2, ExternalLink, Ban, Plus,
  CheckCircle, RefreshCw, Smartphone, Monitor, Eye, Sparkles,
  ArrowRight, Palette, Layers, Check, X, Shield, ChevronUp,
  ChevronDown, Send, Phone, Mail, Award, BookOpen, GraduationCap,
  Users, Bus, Calculator, DollarSign, QrCode, Sliders, Maximize2
} from 'lucide-react';
import Swal from 'sweetalert2';
import landingPageService from '../../api/landingPageService';
import LandingTemplates from './LandingTemplates';

// Section Types matching Multischool ERP
const SECTION_TYPES = [
  'Hero (Image Carousel)',
  'Modules Showcase (50+ Grid)',
  'Apps Showcase (Native Android)',
  'Tech Showcase (Script Seller)',
  'Pricing Table (School Subscriptions)',
  'Contact Form (Tech Dark)',
  'Testimonials (Verified Schools)',
  'FAQ Section (Accordion)',
  'CTA Banner (High Conversion)',
  'Stats Counter (Key Metrics)'
];

const PRESETS = [
  {
    key: 'sunrise',
    name: 'Sunrise',
    tagline: 'Warm, high-energy modern education palette',
    primaryColor: '#f97316',
    palette: ['#f97316', '#fb923c', '#fdba74', '#0f172a'],
    font: 'Outfit, sans-serif',
    accent: 'from-orange-500 to-amber-500',
    description: 'Perfect for dynamic K-12 schools, CBSE academies and active educational institutions.'
  },
  {
    key: 'midnight',
    name: 'Midnight',
    tagline: 'High-tech dark SaaS aesthetic with vibrant neon highlights',
    primaryColor: '#6366f1',
    palette: ['#6366f1', '#8b5cf6', '#06b6d4', '#090d16'],
    font: 'Plus Jakarta Sans, sans-serif',
    accent: 'from-indigo-600 via-purple-600 to-cyan-500',
    description: 'Engineered for technology-forward group institutions and international schools.'
  },
  {
    key: 'scholar',
    name: 'Scholar',
    tagline: 'Prestigious academic heritage with gold & deep navy accents',
    primaryColor: '#1e3a8a',
    palette: ['#1e3a8a', '#d97706', '#f59e0b', '#ffffff'],
    font: 'Playfair Display, serif',
    accent: 'from-blue-900 to-amber-600',
    description: 'Designed for universities, boarding institutions, and prestigious convent colleges.'
  },
  {
    key: 'launch',
    name: 'Launch',
    tagline: 'Clean emerald tech with ultra-modern conversion architecture',
    primaryColor: '#10b981',
    palette: ['#10b981', '#14b8a6', '#0284c7', '#0f172a'],
    font: 'Inter, sans-serif',
    accent: 'from-emerald-600 to-teal-500',
    description: 'High conversion layout optimized for school admissions, inquiries, and demo bookings.'
  }
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'presets' | 'templates'
  const [sections, setSections] = useState([]);
  const [landingEnabled, setLandingEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'

  // Modals & Editors
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [activePresetKey, setActivePresetKey] = useState('midnight');

  // Form for new section
  const [newSection, setNewSection] = useState({
    title: '',
    type: SECTION_TYPES[0],
    badge: 'ALL CORE SOLUTION',
    heading: '',
    subheading: '',
    ctaText: 'Explore Features',
    ctaLink: '/#explore-50-powerful-modules'
  });

  // Fetch sections from MongoDB backend
  const fetchSections = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await landingPageService.getSections();
      if (data && data.sections) {
        setSections(data.sections);
        if (data.landingPageEnabled !== undefined) {
          setLandingEnabled(data.landingPageEnabled);
        }
      }
    } catch (err) {
      console.error('Error fetching landing sections:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Toggle Visibility
  const handleToggleActive = async (section, e) => {
    e?.stopPropagation();
    try {
      const updated = !section.active;
      // Optimistic update
      setSections(prev => prev.map(s => s._id === section._id ? { ...s, active: updated } : s));
      await landingPageService.updateSection(section._id, { active: updated });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      fetchSections(true);
    }
  };

  // Move section Up or Down
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setSections(newSections);
    try {
      const orderIds = newSections.map(s => s._id);
      await landingPageService.reorderSections(orderIds);
    } catch (err) {
      console.error('Reorder error:', err);
      fetchSections(true);
    }
  };

  // Delete Section
  const handleDelete = (section, e) => {
    e?.stopPropagation();
    Swal.fire({
      title: 'Delete Section?',
      text: `Are you sure you want to delete "${section.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await landingPageService.deleteSection(section._id);
          setSections(prev => prev.filter(s => s._id !== section._id));
          Swal.fire({
            icon: 'success',
            title: 'Section Deleted',
            timer: 1200,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || err.message, 'error');
        }
      }
    });
  };

  // Toggle Site Status
  const handleToggleSiteStatus = async () => {
    try {
      const res = await landingPageService.toggleStatus();
      setLandingEnabled(res.landingPageEnabled);
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

  // Apply Preset
  const handleApplyPreset = async (preset) => {
    Swal.fire({
      title: `Apply "${preset.name}" Design?`,
      text: `This will update your landing page theme, colors, and layout sections.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: preset.primaryColor,
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Apply Design'
    }).then(async (r) => {
      if (r.isConfirmed) {
        try {
          setLoading(true);
          const res = await landingPageService.applyPreset(preset.key);
          setActivePresetKey(preset.key);
          if (res && res.sections) setSections(res.sections);
          setActiveTab('builder');
          Swal.fire({
            icon: 'success',
            title: `Design "${preset.name}" Applied!`,
            text: 'Your landing page sections and live view have been updated.',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (err) {
          Swal.fire('Error', err.message, 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Save Edited Section
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingSection) return;
    try {
      const res = await landingPageService.updateSection(editingSection._id, editingSection);
      if (res && res.section) {
        setSections(prev => prev.map(s => s._id === res.section._id ? res.section : s));
        setEditingSection(null);
        Swal.fire({
          icon: 'success',
          title: 'Section Updated!',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Add New Section
  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSection.title.trim()) {
      Swal.fire('Error', 'Please enter a section title', 'error');
      return;
    }
    try {
      const res = await landingPageService.createSection(newSection);
      if (res && res.section) {
        setSections(prev => [...prev, res.section]);
        setShowAddModal(false);
        setNewSection({
          title: '',
          type: SECTION_TYPES[0],
          badge: 'ALL CORE SOLUTION',
          heading: '',
          subheading: '',
          ctaText: 'Explore Features',
          ctaLink: '/#explore-50-powerful-modules'
        });
        Swal.fire({
          icon: 'success',
          title: 'New Section Added!',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Helper to render headline with {highlight} formatted in gradient
  const renderFormattedHeading = (text) => {
    if (!text) return null;
    const parts = text.split(/(\{.*?\})/g);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.startsWith('{') && part.endsWith('}')) {
            const clean = part.slice(1, -1);
            return (
              <span
                key={i}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent font-extrabold"
              >
                {clean}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  };

  // Live Canvas View Component
  const renderLiveViewContent = () => {
    const activeSections = sections.filter(s => s.active);

    return (
      <div className="w-full bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12">
        {/* Live Mini Navigation Bar */}
        <nav className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs shadow-md">
              ACS
            </div>
            <div className="leading-tight">
              <span className="font-black text-xs tracking-wider text-white">ALL CORE SOLUTION</span>
              <span className="hidden sm:inline-block ml-1 text-[9px] text-cyan-400 font-bold">ERP v3.8</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] font-semibold text-slate-300">
            <a href="#hero-slider" className="hover:text-cyan-400 transition">Home</a>
            <a href="#explore-50-powerful-modules" className="hover:text-cyan-400 transition">50+ Modules</a>
            <a href="#mobile-apps-ecosystem" className="hover:text-cyan-400 transition">4 Android Apps</a>
            <a href="#pricing" className="hover:text-cyan-400 transition">Pricing</a>
            <a href="#get-in-touch" className="hover:text-cyan-400 transition">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#get-in-touch"
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow-sm transition"
            >
              Book Demo
            </a>
          </div>
        </nav>

        {/* Dynamic Active Sections */}
        {activeSections.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-xs">All landing sections are currently hidden.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {activeSections.map((sec) => {
              const type = sec.type || '';

              // 1. Hero Section
              if (type.includes('Hero')) {
                return (
                  <section key={sec._id} id={sec.hash?.replace('/#', '')} className="px-4 py-8 text-center bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 relative overflow-hidden">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-extrabold mb-3">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{sec.badge || 'ALL CORE SOLUTION • MULTI SCHOOL ERP'}</span>
                    </div>

                    <h2 className="text-lg sm:text-2xl font-black text-white max-w-xl mx-auto leading-snug tracking-tight">
                      {renderFormattedHeading(sec.heading || sec.title)}
                    </h2>

                    <p className="text-[11px] sm:text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                      {sec.subheading || 'India’s complete School Management Software with 4 dedicated Android Mobile Apps.'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
                      {sec.ctaText && (
                        <a
                          href={sec.ctaLink || '#get-in-touch'}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[11px] font-bold shadow-md shadow-indigo-500/20 hover:opacity-95"
                        >
                          {sec.ctaText}
                        </a>
                      )}
                      {sec.secondaryCtaText && (
                        <a
                          href={sec.secondaryCtaLink || '#explore-50-powerful-modules'}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-[11px] font-bold"
                        >
                          {sec.secondaryCtaText}
                        </a>
                      )}
                    </div>

                    {/* Trust pills */}
                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> 700+ Schools</span>
                      <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-cyan-400" /> 4 Native Android APKs</span>
                      <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-amber-400" /> 100% Data Security</span>
                    </div>
                  </section>
                );
              }

              // 2. Modules Showcase
              if (type.includes('Modules')) {
                return (
                  <section key={sec._id} id={sec.hash?.replace('/#', '')} className="px-4 py-8 bg-slate-950">
                    <div className="text-center mb-5">
                      <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest block mb-1">
                        {sec.badge || 'ENTERPRISE CAPABILITIES'}
                      </span>
                      <h3 className="text-base sm:text-xl font-black text-white">
                        {renderFormattedHeading(sec.heading || sec.title)}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-400 max-w-md mx-auto mt-1">
                        {sec.subheading}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { title: 'Admissions & Desk', icon: GraduationCap, color: 'text-cyan-400' },
                        { title: 'Fees & POS Challans', icon: DollarSign, color: 'text-amber-400' },
                        { title: 'NEP 360° Marksheets', icon: Award, color: 'text-indigo-400' },
                        { title: 'Bus GPS Fleet Tracking', icon: Bus, color: 'text-emerald-400' },
                        { title: 'Biometric Attendance', icon: Users, color: 'text-pink-400' },
                        { title: 'Digital Library RFID', icon: BookOpen, color: 'text-blue-400' },
                        { title: 'Canvas ID Designer', icon: QrCode, color: 'text-purple-400' },
                        { title: 'Multi-Branch Central HQ', icon: Shield, color: 'text-rose-400' }
                      ].map((mod, i) => {
                        const Icon = mod.icon;
                        return (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition">
                            <Icon className={`w-4 h-4 ${mod.color} mb-1.5`} />
                            <h4 className="text-[11px] font-bold text-slate-200">{mod.title}</h4>
                            <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Complete end-to-end automation module.</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              }

              // 3. Android Apps Showcase
              if (type.includes('Apps')) {
                return (
                  <section key={sec._id} id={sec.hash?.replace('/#', '')} className="px-4 py-8 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950">
                    <div className="text-center mb-5">
                      <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                        {sec.badge || 'MOBILE-FIRST ECOSYSTEM'}
                      </span>
                      <h3 className="text-base sm:text-xl font-black text-white">
                        {renderFormattedHeading(sec.heading || sec.title)}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-400 max-w-md mx-auto mt-1">
                        {sec.subheading}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'Teacher App', role: 'FACULTY & STAFF', apk: 'Teacher.apk', desc: 'Attendance, marks entry, homework, remarks.' },
                        { name: 'Student & Parent App', role: 'STUDENTS & GUARDIANS', apk: 'Student_Parents.apk', desc: 'Live fees, exam cards, bus tracking, chat.' },
                        { name: 'Driver App', role: 'TRANSPORT FLEET', apk: 'Driver.apk', desc: 'Live GPS route, pickup/drop passenger checkin.' },
                        { name: 'Accountant App', role: 'FEE BILLING', apk: 'Accountant.apk', desc: 'POS fee collection, receipt thermal print, cash ledger.' }
                      ].map((app, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-left flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Smartphone className="w-5 h-5 text-indigo-400" />
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                APK READY
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-white">{app.name}</h4>
                            <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase">{app.role}</p>
                            <p className="text-[9px] text-slate-400 mt-1.5 leading-snug">{app.desc}</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[8px] text-slate-500 font-mono">
                            <span>{app.apk}</span>
                            <span className="text-emerald-400 font-bold">PROD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              // 4. Tech / Services Showcase
              if (type.includes('Tech')) {
                return (
                  <section key={sec._id} id={sec.hash?.replace('/#', '')} className="px-4 py-8 bg-slate-950">
                    <div className="text-center mb-5">
                      <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest block mb-1">
                        {sec.badge || 'SERVICES & HOSTING'}
                      </span>
                      <h3 className="text-base sm:text-xl font-black text-white">
                        {renderFormattedHeading(sec.heading || sec.title)}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-400 max-w-md mx-auto mt-1">
                        {sec.subheading}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Custom Domain & White-Label', desc: 'Your school runs on your own domain (e.g., portal.yourschool.com) with SSL.' },
                        { title: '40+ Payment Gateways', desc: 'Direct online fee settlements via Razorpay, PayU, PhonePe, Paytm, Stripe.' },
                        { title: 'Approved DLT WhatsApp & SMS', desc: 'Instant OTPs, absent alerts and fee reminder push notifications directly to parent phones.' },
                        { title: 'Encrypted Cloud Backups', desc: 'Nightly automated snapshots with instant 1-click restore to keep student records safe forever.' }
                      ].map((item, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                          <h4 className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              // 5. Pricing Plans
              if (type.includes('Pricing')) {
                return (
                  <section key={sec._id} id={sec.hash?.replace('/#', '')} className="px-4 py-8 bg-slate-950 text-center">
                    <div className="mb-5">
                      <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-widest block mb-1">
                        {sec.badge || 'TRANSPARENT LICENSING'}
                      </span>
                      <h3 className="text-base sm:text-xl font-black text-white">
                        {renderFormattedHeading(sec.heading || sec.title)}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-400 max-w-md mx-auto mt-1">
                        {sec.subheading}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                      {[
                        { name: 'Starter Plan', price: '₹9,999', period: '/ year', limit: 'Up to 500 Students', feat: ['Admissions & Fees', 'Web Parent Portal', 'Email Alerts', 'Regular Updates'] },
                        { name: 'Growth Pro', price: '₹24,999', period: '/ year', limit: 'Up to 2,000 Students', popular: true, feat: ['All 50+ Modules', '4 Android Apps Included', 'WhatsApp Gateway', 'Canvas ID Card Studio'] },
                        { name: 'Enterprise HQ', price: 'Custom Quote', period: '', limit: 'Unlimited Campuses', feat: ['Multi-Branch Central HQ', 'Custom Domain & White-Label', 'Dedicated Database', '24/7 Priority Support'] }
                      ].map((plan, i) => (
                        <div key={i} className={`p-4 rounded-2xl border flex flex-col justify-between ${plan.popular ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-slate-900 border-slate-800'}`}>
                          <div>
                            {plan.popular && (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-500 text-white font-extrabold text-[9px] uppercase tracking-wider mb-2">
                                MOST POPULAR
                              </span>
                            )}
                            <h4 className="text-xs font-black text-white">{plan.name}</h4>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-base sm:text-lg font-black text-white">{plan.price}</span>
                              <span className="text-[9px] text-slate-400">{plan.period}</span>
                            </div>
                            <p className="text-[9px] font-bold text-cyan-400 mt-0.5">{plan.limit}</p>
                            <ul className="mt-3 space-y-1 text-[9px] text-slate-300">
                              {plan.feat.map((f, fi) => (
                                <li key={fi} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            type="button"
                            className={`w-full mt-4 py-1.5 rounded-xl font-bold text-[10px] transition ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm' : 'border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'}`}
                          >
                            Choose {plan.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              // 6. Contact Form
              if (type.includes('Contact')) {
                return (
                  <section key={sec._id} id={sec.hash?.replace('/#', '')} className="px-4 py-8 bg-gradient-to-t from-indigo-950/40 to-slate-950">
                    <div className="text-center mb-5">
                      <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest block mb-1">
                        {sec.badge || 'VIP DEMO CONSULTATION'}
                      </span>
                      <h3 className="text-base sm:text-xl font-black text-white">
                        {renderFormattedHeading(sec.heading || sec.title)}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-400 max-w-md mx-auto mt-1">
                        Speak directly with lead developer <strong className="text-white">RAJ YADAV</strong> and get your campus online in 24 hours.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                      <input
                        type="text"
                        disabled
                        placeholder="School / Institution Name"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
                      />
                      <input
                        type="text"
                        disabled
                        placeholder="Principal / Admin WhatsApp Number"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs opacity-90 cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Book Instant Demo & Get Free APKs</span>
                      </button>
                      <p className="text-[8px] text-slate-500 text-center font-mono">
                        Powered by ALL CORE SOLUTION • Developed by RAJ YADAV
                      </p>
                    </div>
                  </section>
                );
              }

              // Default Section Fallback
              return (
                <section key={sec._id} id={sec.hash?.replace('/#', '')} className="px-4 py-6 text-center bg-slate-950">
                  <h3 className="text-xs font-bold text-slate-300">{sec.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1">{sec.subheading || sec.type}</p>
                </section>
              );
            })}
          </div>
        )}

        {/* Live Mini Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-800/80 px-4 text-center text-slate-500 text-[10px] space-y-1">
          <p className="font-bold text-slate-400">ALL CORE SOLUTION — Multi-School Enterprise Cloud</p>
          <p>Lead Developer: <strong>RAJ YADAV</strong> • 4 Native Android APKs • 24/7 Dedicated Support</p>
          <p className="text-[9px] text-slate-600">© {new Date().getFullYear()} All Rights Reserved.</p>
        </footer>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto min-h-[85vh] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Visual Builder
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                landingEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {landingEnabled ? '🟢 LIVE' : '🔴 DISABLED'}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            Your landing page, block by block — drag to reorder, changes go live immediately
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>Preview Site</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSiteStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
              landingEnabled
                ? 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'
                : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>{landingEnabled ? 'Disable Landing Page' : 'Enable Landing Page'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8b3dff] via-[#5b47fb] to-[#00c4cc] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Section</span>
          </button>
        </div>
      </div>

      {/* 2. SUBNAV PILLS (Visual Builder | Ready-Made Designs | Full Templates) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'builder'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Visual Builder</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'builder' ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {sections.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Ready-Made Designs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Full Templates</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VISUAL BUILDER (SPLIT SCREEN) */}
      {/* ======================================================== */}
      {activeTab === 'builder' && (
        <div className="space-y-4">
          {/* Preset Recommendation Banner */}
          <div
            onClick={() => setActiveTab('presets')}
            className="group p-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-cyan-50/70 hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Start from a ready-made design
                </strong>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Preview complete landing pages live — colours, fonts and sections — and apply one in a click.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-white text-indigo-700 text-xs font-bold shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
              <span>Browse Designs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* 2-Column Split: Left Section List + Right Live View Aside */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Section List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Landing Sections ({sections.length})
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {sections.filter(s => s.active).length} visible on site
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : sections.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-sm font-bold text-slate-700">No Sections Added</p>
                  <p className="text-xs text-slate-400 mt-1">Click Add New Section to build your landing page.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sections.map((section, idx) => (
                    <div
                      key={section._id}
                      className={`group bg-white rounded-2xl border transition-all p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3 ${
                        section.active
                          ? 'border-slate-200/90 hover:border-indigo-400 hover:shadow-md'
                          : 'border-slate-200/60 bg-slate-50/70 opacity-60'
                      }`}
                    >
                      {/* Left Reorder & Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Up/Down and Grip */}
                        <div className="flex flex-col items-center gap-0.5 text-slate-300 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMove(idx, -1)}
                            className="p-0.5 hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <GripVertical className="w-4 h-4 text-slate-300" />
                          <button
                            type="button"
                            disabled={idx === sections.length - 1}
                            onClick={() => handleMove(idx, 1)}
                            className="p-0.5 hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400">#{idx + 1}</span>
                            <h4
                              className={`text-xs sm:text-sm font-black truncate ${
                                section.active ? 'text-slate-900 group-hover:text-indigo-600' : 'text-slate-500 line-through'
                              }`}
                            >
                              {section.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {section.type}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {section.hash}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Row Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Visibility Toggle Switch */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleActive(section, e)}
                          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                            section.active ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                          title={section.active ? 'Visible on site' : 'Hidden on site'}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              section.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingSection({ ...section })}
                          className="p-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition cursor-pointer"
                          title="Edit Section Content"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(section, e)}
                          className="p-2 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition cursor-pointer"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Live View Aside (5 cols sticky) */}
            <div className="lg:col-span-5 sticky top-6 space-y-3">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                {/* Live View Head */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <strong className="text-xs sm:text-sm font-black text-slate-900">Live view</strong>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      Real-time interactive canvas of your services landing page
                    </p>
                  </div>

                  {/* Device Toggles & Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setDeviceMode('desktop')}
                        className={`p-1.5 rounded-md transition cursor-pointer ${
                          deviceMode === 'desktop' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Desktop View"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeviceMode('mobile')}
                        className={`p-1.5 rounded-md transition cursor-pointer ${
                          deviceMode === 'mobile' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Mobile View"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => fetchSections(true)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                      title="Refresh Preview"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFullscreenPreview(true)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                      title="Fullscreen Preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Live View Stage Canvas */}
                <div className="bg-slate-900/90 p-3 sm:p-4 flex items-center justify-center min-h-[520px] max-h-[70vh] overflow-y-auto">
                  <div
                    className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${
                      deviceMode === 'mobile'
                        ? 'w-[320px] border-4 border-slate-800 rounded-[28px]'
                        : 'w-full'
                    }`}
                  >
                    {renderLiveViewContent()}
                  </div>
                </div>

                {/* Live View Foot */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
                  Click a section on the left to toggle · hidden sections aren't shown
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: READY-MADE DESIGNS (PRESETS) */}
      {/* ======================================================== */}
      {activeTab === 'presets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Ready-Made Designs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a professionally curated design tailored for education ERP platforms. One-click apply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRESETS.map((preset) => {
              const isActive = activePresetKey === preset.key;
              return (
                <div
                  key={preset.key}
                  className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between ${
                    isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${preset.accent} flex items-center justify-center text-white shadow-md font-bold text-xs`}>
                          {preset.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900">{preset.name}</h3>
                          <p className="text-[11px] text-slate-400">{preset.font}</p>
                        </div>
                      </div>

                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[10px] uppercase">
                          CURRENTLY ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {preset.description}
                    </p>

                    {/* Color Palette Swatches */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Brand Palette
                      </span>
                      <div className="flex items-center gap-2">
                        {preset.palette.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span
                              className="w-6 h-6 rounded-lg border border-slate-200 shadow-2xs"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Includes 6 Pre-configured Sections
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      Apply "{preset.name}"
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FULL TEMPLATES */}
      {/* ======================================================== */}
      {activeTab === 'templates' && (
        <div className="pt-2">
          <LandingTemplates />
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT SECTION CONTENT */}
      {/* ======================================================== */}
      {editingSection && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setEditingSection(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Head */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Edit Section Content</h3>
                  <p className="text-[11px] text-slate-400">Configure text, headlines and CTA buttons</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    required
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Type</label>
                  <select
                    value={editingSection.type}
                    onChange={(e) => setEditingSection({ ...editingSection, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    {SECTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Anchor Slug (for URL hash)
                </label>
                <input
                  type="text"
                  value={editingSection.hash}
                  onChange={(e) => setEditingSection({ ...editingSection, hash: e.target.value })}
                  placeholder="e.g. /#explore-50-powerful-modules"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge Text (Top Pill)
                </label>
                <input
                  type="text"
                  value={editingSection.badge || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, badge: e.target.value })}
                  placeholder="e.g. ✨ ALL CORE SOLUTION • SAAS ERP"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Headline (use {'{word}'} for gradient accent)
                </label>
                <input
                  type="text"
                  value={editingSection.heading || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, heading: e.target.value })}
                  placeholder="e.g. Empower Your Institution with {Next-Gen} Cloud ERP"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subheading / Description
                </label>
                <textarea
                  rows={3}
                  value={editingSection.subheading || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subheading: e.target.value })}
                  placeholder="Write a clear value proposition for school owners and principals..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={editingSection.ctaText || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, ctaText: e.target.value })}
                    placeholder="e.g. Book Free Live Demo"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={editingSection.ctaLink || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, ctaLink: e.target.value })}
                    placeholder="e.g. /#get-in-touch"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW SECTION */}
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
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Add New Section</h3>
                  <p className="text-[11px] text-slate-400">Insert custom block into landing page</p>
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

            <form onSubmit={handleCreateSection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="e.g. Student Safety & GPS Transport"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Type</label>
                <select
                  value={newSection.type}
                  onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  {SECTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={newSection.heading}
                  onChange={(e) => setNewSection({ ...newSection, heading: e.target.value })}
                  placeholder="e.g. Next-Gen Student {Safety} & Transport"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newSection.subheading}
                  onChange={(e) => setNewSection({ ...newSection, subheading: e.target.value })}
                  placeholder="Brief description for this section..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: FULLSCREEN LIVE PREVIEW */}
      {/* ======================================================== */}
      {showFullscreenPreview && (
        <div
          className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-200"
        >
          <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-black text-white">Full Live Preview — ALL CORE SOLUTION</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-md transition ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-md transition ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowFullscreenPreview(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950">
            <div className={deviceMode === 'mobile' ? 'w-[360px] border-4 border-slate-800 rounded-[32px] overflow-hidden my-auto' : 'w-full max-w-5xl'}>
              {renderLiveViewContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
