import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Save, Globe, Shield, ToggleLeft, ToggleRight, 
  Palette, Smartphone, Check, Sparkles, CheckCircle, Info, RefreshCw
} from 'lucide-react';
import { tenantService } from '../../api/tenantService';
import Swal from 'sweetalert2';

export default function SchoolSettingsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, [id]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getSettingsFull(id);
      if (res && res.success) {
        setForm(res.settings);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load school settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await tenantService.updateSettingsFull(id, form);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Settings Saved!',
          text: 'School identity, module switches & branding updated.',
          timer: 2000
        });
      }
    } catch (err) {
      Swal.fire('Save Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleModule = (modKey) => {
    setForm(prev => ({
      ...prev,
      moduleOverrides: {
        ...prev.moduleOverrides,
        [modKey]: !prev.moduleOverrides?.[modKey]
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 text-[#008f8c] animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading comprehensive school configuration...</span>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const modulesList = [
    { key: 'homework', label: 'Homework & Digital Assignments', desc: 'Online submissions, grading & teacher reviews' },
    { key: 'library', label: 'Library Management System', desc: 'Book cataloging, barcode scanning & overdue fines' },
    { key: 'transport', label: 'Transport & GPS Vehicle Tracking', desc: 'Live bus tracking, route optimization & parent notifications' },
    { key: 'hostel', label: 'Hostel & Dormitory Allocation', desc: 'Room allotment, warden reports & mess scheduling' },
    { key: 'inventory', label: 'Store & Inventory Management', desc: 'Stock registers, item requests & vendor supplies' },
    { key: 'assetManagement', label: 'Campus Asset Management', desc: 'School infrastructure, labs, depreciation & maintenance' },
    { key: 'aiAssistant', label: 'AI Assistant & Predictive Analytics', desc: 'Auto lesson planner, performance forecast & chatbot' },
    { key: 'liveClasses', label: 'Live Virtual Classrooms', desc: 'Zoom/Google Meet video sessions & auto recording' },
    { key: 'frontOffice', label: 'Front Desk & Visitor Management', desc: 'Visitor badges, postal dispatch & phone call logs' },
    { key: 'leadManagement', label: 'Admissions CRM & Lead Pipeline', desc: 'Online inquiry capture, stage pipeline & follow-up calls' },
    { key: 'onlineExams', label: 'Online Computer-Based Exams', desc: 'MCQ tests, question banks, negative marking & results' },
    { key: 'biometricAttendance', label: 'Biometric & RFID Attendance', desc: 'Hardware machine sync, facial recognition logs' },
    { key: 'cbcAcademics', label: 'CBC / Competency-Based Academics', desc: 'Skill rubrics, learning outcomes & formative assessments' },
    { key: 'holisticReportCard', label: 'Holistic Progress Card (HPC 360°)', desc: 'CBSE/NEP aligned 360-degree self & peer assessment' },
  ];

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/schools')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit School Settings</h1>
              <span className="bg-[#008f8c] text-white font-bold text-xs px-2.5 py-0.5 rounded shadow-2xs">
                {form.schoolName}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Modular Overrides, Custom Domains, Branding & Identity</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#008f8c] hover:bg-[#007a78] active:bg-[#006664] text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition cursor-pointer disabled:opacity-60"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none">
        {[
          { id: 'identity', label: 'School Identity' },
          { id: 'subscription', label: 'Subscription & Status' },
          { id: 'modules', label: 'Module Overrides (Feature Control)' },
          { id: 'domain', label: 'Custom Domain (White-Label)' },
          { id: 'loginBranding', label: 'Custom Login Design' },
          { id: 'appBranding', label: 'Mobile App Branding' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: School Identity */}
      {activeTab === 'identity' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">School Identity & Profile</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">School Name *</label>
              <input
                type="text"
                value={form.schoolName || ''}
                onChange={e => setForm({ ...form, schoolName: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">URL Identifier / Slug (Subdomain) *</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-slate-200 rounded-l-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:border-[#008f8c]"
                />
                <span className="bg-slate-100 border border-l-0 border-slate-200 px-3 py-2.5 text-xs text-slate-500 rounded-r-xl font-mono">
                  .allcoresolution.com
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Official School Email *</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={form.phone || ''}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Website</label>
              <input
                type="text"
                value={form.website || ''}
                onChange={e => setForm({ ...form, website: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Campus City & State</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={form.city || ''}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={form.state || ''}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Campus Physical Address</label>
              <textarea
                rows={2}
                value={form.address || ''}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Subscription & Status */}
      {activeTab === 'subscription' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">Subscription Quotas & Status</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Subscription Plan</label>
              <select
                value={form.plan}
                onChange={e => setForm({ ...form, plan: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold bg-white"
              >
                <option value="Enterprise">Enterprise Plan (Unlimited)</option>
                <option value="Standard">Standard Plan</option>
                <option value="Basic">Basic Plan</option>
                <option value="Trial">Trial Plan</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Account Operational Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold bg-white"
              >
                <option value="Active">Active (Full Access)</option>
                <option value="Suspended">Suspended (Grace Notice)</option>
                <option value="Inactive">Inactive (Locked)</option>
                <option value="Pending">Pending Setup</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Student Enrollment Limit (Capacity)</label>
              <input
                type="number"
                value={form.studentLimit || 2500}
                onChange={e => setForm({ ...form, studentLimit: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Cloud Storage Quota (MB)</label>
              <input
                type="number"
                value={form.storageLimitMB || 5120}
                onChange={e => setForm({ ...form, storageLimitMB: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Module Overrides (Feature Control) */}
      {activeTab === 'modules' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base">ERP Feature Control & Module Switches</h3>
              <p className="text-xs text-slate-500">Enable or disable specific modules for this school campus</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const allOn = {};
                modulesList.forEach(m => { allOn[m.key] = true; });
                setForm(prev => ({ ...prev, moduleOverrides: allOn }));
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
            >
              Enable All Modules
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modulesList.map(mod => {
              const isEnabled = form.moduleOverrides?.[mod.key] ?? true;
              return (
                <div 
                  key={mod.key}
                  onClick={() => toggleModule(mod.key)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isEnabled 
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                  }`}
                >
                  <div className="pr-3">
                    <span className="font-bold text-xs block">{mod.label}</span>
                    <span className="text-[11px] text-slate-500 block">{mod.desc}</span>
                  </div>
                  {isEnabled ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wide shrink-0">
                      ENABLED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] tracking-wide shrink-0">
                      DISABLED
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Custom Domain */}
      {activeTab === 'domain' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">Custom Domain & White-Labeling</h3>
          
          <div className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Custom Domain Name</label>
              <input
                type="text"
                placeholder="e.g. erp.greenwoodschool.edu.in"
                value={form.customDomain?.domain || ''}
                onChange={e => setForm({
                  ...form,
                  customDomain: { ...form.customDomain, domain: e.target.value }
                })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#008f8c]"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">DNS Setup Instructions (CNAME Record):</span>
              <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                <p><b>Type:</b> CNAME</p>
                <p><b>Name/Host:</b> {form.customDomain?.domain ? form.customDomain.domain.split('.')[0] : 'erp'}</p>
                <p><b>Target:</b> sms-frontend-by-raj-school-erp.onrender.com</p>
                <p><b>TTL:</b> Auto / 3600</p>
              </div>
              <span className="text-[11px] text-slate-500 block">SSL certificates are automatically generated upon DNS propagation.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Custom Login Design */}
      {activeTab === 'loginBranding' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">Custom Login Design & Theme</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Brand Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.loginBranding?.primaryColor || '#008f8c'}
                  onChange={e => setForm({
                    ...form,
                    loginBranding: { ...form.loginBranding, primaryColor: e.target.value }
                  })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={form.loginBranding?.primaryColor || '#008f8c'}
                  onChange={e => setForm({
                    ...form,
                    loginBranding: { ...form.loginBranding, primaryColor: e.target.value }
                  })}
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Custom Portal Title</label>
              <input
                type="text"
                value={form.loginBranding?.heroTitle || ''}
                placeholder="e.g. Greenwood Campus Portal"
                onChange={e => setForm({
                  ...form,
                  loginBranding: { ...form.loginBranding, heroTitle: e.target.value }
                })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Mobile App Branding */}
      {activeTab === 'appBranding' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">Mobile App White-Label Overrides</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Student & Parent App</span>
              <input
                type="text"
                value={form.appBranding?.studentAppName || ''}
                placeholder="e.g. Greenwood Connect"
                onChange={e => setForm({
                  ...form,
                  appBranding: { ...form.appBranding, studentAppName: e.target.value }
                })}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Teacher & Staff App</span>
              <input
                type="text"
                value={form.appBranding?.staffAppName || ''}
                placeholder="e.g. Greenwood Staff"
                onChange={e => setForm({
                  ...form,
                  appBranding: { ...form.appBranding, staffAppName: e.target.value }
                })}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Driver & Transport App</span>
              <input
                type="text"
                value={form.appBranding?.driverAppName || ''}
                placeholder="e.g. Greenwood Fleet"
                onChange={e => setForm({
                  ...form,
                  appBranding: { ...form.appBranding, driverAppName: e.target.value }
                })}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
