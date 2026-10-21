import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { 
  CreditCard, List, Share2, HelpCircle, Copy, ExternalLink, 
  Plus, Edit2, Trash2, Upload, Info, Image as ImageIcon, Download,
  CheckCircle2, Globe, QrCode, Sparkles, Save, RefreshCw, Smartphone,
  Check, ArrowRight, ShieldCheck, FileText, CheckCircle
} from 'lucide-react';
import settingsService from '../api/settingsService';

export default function AdmissionSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [enableFee, setEnableFee] = useState(true);
  const [feeAmount, setFeeAmount] = useState(1500);
  const [customSlug, setCustomSlug] = useState('greenwood-international');
  const [allowOnlineEnquiry, setAllowOnlineEnquiry] = useState(true);
  const [autoGenerateAdmNo, setAutoGenerateAdmNo] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Custom Form Fields State
  const [customFields, setCustomFields] = useState([
    { id: 1, order: 1, label: 'Father Photo', type: 'File Upload', required: false, options: '' },
    { id: 2, order: 2, label: 'Blood Group', type: 'Dropdown', required: true, options: 'A+, A-, B+, B-, O+, O-, AB+, AB-' },
    { id: 3, order: 3, label: 'CWSN Category', type: 'Dropdown', required: false, options: 'None, Visual, Hearing, Physical' },
    { id: 4, order: 4, label: 'Mother Tongue', type: 'Text Input', required: true, options: '' }
  ]);

  // New field input states
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState('Text Input');
  const [newOptions, setNewOptions] = useState('');
  const [newRequired, setNewRequired] = useState(false);
  const [newOrder, setNewOrder] = useState('');

  // Fetch settings from MongoDB
  const fetchAdmissionSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting('admission_settings');
      if (res?.success && res.data) {
        const d = res.data;
        if (d.enableFee !== undefined) setEnableFee(d.enableFee);
        if (d.registrationFee !== undefined) setFeeAmount(d.registrationFee);
        if (d.customSlug) setCustomSlug(d.customSlug);
        if (d.allowOnlineEnquiry !== undefined) setAllowOnlineEnquiry(d.allowOnlineEnquiry);
        if (d.autoGenerateAdmNo !== undefined) setAutoGenerateAdmNo(d.autoGenerateAdmNo);
        if (d.qrCodeUrl) setQrCodeUrl(d.qrCodeUrl);
        if (d.customFields && Array.isArray(d.customFields)) setCustomFields(d.customFields);
      }
    } catch (err) {
      console.error('Failed to fetch admission settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmissionSettings();
  }, [fetchAdmissionSettings]);

  // Save settings to MongoDB
  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const payload = {
        enableFee,
        registrationFee: Number(feeAmount),
        customSlug,
        allowOnlineEnquiry,
        autoGenerateAdmNo,
        qrCodeUrl,
        customFields,
        updatedAt: new Date().toISOString()
      };

      const res = await settingsService.saveSetting('admission_settings', payload);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Configuration Saved!',
          text: 'Admission rules, online fee criteria and custom fields updated in MongoDB.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.response?.data?.message || 'Could not save admission settings.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Add custom field
  const handleAddField = () => {
    if (!newLabel.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Label', text: 'Please enter a field label.' });
      return;
    }

    const fieldObj = {
      id: Date.now(),
      order: Number(newOrder) || (customFields.length + 1),
      label: newLabel.trim(),
      type: newType,
      required: newRequired,
      options: newType === 'Dropdown' ? newOptions.trim() : ''
    };

    setCustomFields(prev => [...prev, fieldObj]);
    setNewLabel('');
    setNewOptions('');
    setNewRequired(false);
    setNewOrder('');

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Field added to form',
      showConfirmButton: false,
      timer: 1800
    });
  };

  // Delete custom field
  const handleDeleteField = (id) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  const admissionUrl = `https://school.domain.com/admission/${customSlug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(admissionUrl);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Admission URL copied!',
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Top Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Public Portal Gateway
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Live Enrollment Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-indigo-400 inline" />
            Online Admission Form Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Configure registration processing fees, custom public URL slugs, dynamic applicant fields, and digital promotional QR posters.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <button
            onClick={fetchAdmissionSettings}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-white cursor-pointer border border-white/10"
            title="Reload from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 border-none"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>
      </div>

      {/* ─── Main 2-Column Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Portal Parameters & Fee (lg:col-span-4) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Fee & Parameters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Fee & Portal Settings
                </h3>
                <p className="text-xs text-slate-400">Manage payment requirements and access rules</p>
              </div>
            </div>

            {/* Toggle 1: Enable Fee */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div>
                <div className="text-xs font-bold text-slate-800">Mandatory Application Fee</div>
                <div className="text-[11px] text-slate-400">Require parents to pay online upon form submit</div>
              </div>
              <button
                type="button"
                onClick={() => setEnableFee(!enableFee)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  enableFee ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    enableFee ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Fee Amount (conditional) */}
            {enableFee && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                <label className="text-xs font-bold text-slate-700">Application Fee Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Processed automatically through configured Payment Gateway.</p>
              </div>
            )}

            {/* Public URL Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Custom Public Portal Slug</label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-mono text-slate-500">
                  /admission/
                </span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="school-name"
                />
              </div>
            </div>

            {/* Direct Copy Bar */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
              <div className="text-[11px] font-bold text-indigo-900 flex items-center justify-between">
                <span>Public Admission URL:</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="text-indigo-600 hover:text-indigo-800 text-[11px] font-black flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs"
                >
                  <Copy className="w-3 h-3" /> Copy Link
                </button>
              </div>
              <div className="text-[11px] font-mono text-indigo-800 break-all select-all font-semibold">
                {admissionUrl}
              </div>
            </div>

            {/* Toggles: Auto Adm No & Online Inquiry */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Auto-Generate Admission No.</div>
                  <div className="text-[11px] text-slate-400">Automatically assign next sequential roll number</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoGenerateAdmNo(!autoGenerateAdmNo)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    autoGenerateAdmNo ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      autoGenerateAdmNo ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Allow Online Inquiries</div>
                  <div className="text-[11px] text-slate-400">Accept non-paid preliminary inquiry submissions</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowOnlineEnquiry(!allowOnlineEnquiry)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    allowOnlineEnquiry ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      allowOnlineEnquiry ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Fee & Portal Configuration
            </button>
          </div>

          {/* Card 2: Digital Admission Poster */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-purple-600" />
                  Digital Admission Flyer & QR
                </h3>
                <p className="text-xs text-slate-400">Live printable flyer card for marketing</p>
              </div>
            </div>

            {/* Flyer Mockup */}
            <div className="p-4 bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white rounded-2xl shadow-md space-y-4 text-center">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-widest">
                  Admissions Open 2026-27
                </span>
                <h4 className="text-base font-black tracking-tight mt-1">Greenwood International</h4>
                <p className="text-[11px] text-indigo-200">Excellence in Academics & Sports</p>
              </div>

              <div className="bg-white p-3 rounded-xl inline-block shadow-inner mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(admissionUrl)}`}
                  alt="Admission QR"
                  className="w-28 h-28 mx-auto"
                />
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Scan with Camera or GPay / UPI</div>
                <div className="text-[10px] text-indigo-200">Direct instant registration portal</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </button>
              <button
                type="button"
                onClick={() => window.open(admissionUrl, '_blank')}
                className="flex-1 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-100"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview Form
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Custom Form Fields Manager (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
                  <List className="w-4 h-4 text-emerald-600" />
                  Custom Registration Form Fields ({customFields.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Add bespoke questions (e.g. Previous School, Blood Group, Transport Requirement) to the public admission form
                </p>
              </div>
            </div>

            {/* Field Creator Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" /> Add New Field to Form
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Field Label / Question *</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Mother Tongue / Allergy Details"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Input Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Text Input">Text Input</option>
                    <option value="Dropdown">Dropdown (Select Option)</option>
                    <option value="File Upload">File / Document Upload</option>
                    <option value="Date Picker">Date Picker</option>
                    <option value="Checkbox">Checkbox (Yes / No)</option>
                  </select>
                </div>

                {newType === 'Dropdown' && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-600">Dropdown Options (Comma separated)</label>
                    <input
                      type="text"
                      value={newOptions}
                      onChange={(e) => setNewOptions(e.target.value)}
                      placeholder="e.g. Bus Route A, Bus Route B, Self Commute"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="reqField"
                    checked={newRequired}
                    onChange={(e) => setNewRequired(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="reqField" className="font-bold text-slate-700 cursor-pointer">
                    Mandatory (Required Field)
                  </label>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Field
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Fields List */}
            <div className="space-y-2.5">
              {customFields.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs font-bold">
                  No custom fields configured yet. Standard fields (Name, Class, Gender, DOB) are always included.
                </div>
              ) : (
                customFields.map((field, idx) => (
                  <div
                    key={field.id || idx}
                    className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-indigo-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <span>{field.label}</span>
                          {field.required ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                              Required
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-500">
                              Optional
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Type: <span className="font-semibold text-slate-600">{field.type}</span>
                          {field.options && <span className="ml-2 font-mono text-[10px]">({field.options})</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteField(field.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                      title="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">
                {customFields.length} custom fields configured
              </span>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save All Fields
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
