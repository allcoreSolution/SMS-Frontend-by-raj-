import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Save, CheckCircle, User, Globe, 
  CreditCard, ShieldCheck, Sparkles, RefreshCw, FileText, Layers, Check, Copy
} from 'lucide-react';
import { tenantService } from '../../api/tenantService';
import Swal from 'sweetalert2';

export default function AddSchool() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [form, setForm] = useState({
    // Step 1: School & Admin Details
    schoolName: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    slug: '',

    // Step 2: Subscription
    plan: 'Enterprise',
    subscriptionType: 'Yearly',
    customSubscriptionEndsAt: '',

    // Step 3: Onboarding Starter Template
    onboardingTemplate: 'cbse-standard',

    // Step 4: Billing & Tax Profile
    billingMode: 'paid_in_full',
    billingCharge: 'standard',
    billingCustomAmount: 50000,
    billingDiscount: 0,
    billingDiscountReason: '',
    billingLegalName: '',
    billingStateCode: '07',
    billingTaxId: '',
    billingPaidAmount: 50000,
    billingMethod: 'Bank Transfer (NEFT)',
    billingReference: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'schoolName' && !prev.slug) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14);
      }
      if (name === 'schoolName' && !prev.billingLegalName) {
        next.billingLegalName = value;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.schoolName.trim() || !form.adminEmail.trim()) {
      return Swal.fire('Required Fields', 'Please fill School Name and Admin Email.', 'warning');
    }

    try {
      setLoading(true);
      const res = await tenantService.createSchoolAdvanced(form);
      if (res.success) {
        setSuccessData(res);
        Swal.fire({
          icon: 'success',
          title: 'School Created!',
          text: `${form.schoolName} has been provisioned and is live.`,
          timer: 2000
        });
      }
    } catch (err) {
      Swal.fire('Creation Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    const { tenant, adminCredentials } = successData;
    return (
      <div className="max-w-2xl mx-auto my-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">School Provisioned Successfully!</h2>
          <p className="text-xs text-slate-500 mt-1">Tenant ID: <b>{tenant.schoolCode || tenant._id}</b> | Plan: <b>{tenant.plan}</b></p>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">Primary Administrator Login</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 block text-[10px]">Email Address</span>
              <span className="font-bold text-slate-900">{adminCredentials?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Initial Password</span>
              <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                {adminCredentials?.password}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`School: ${tenant.schoolName}\nAdmin: ${adminCredentials?.email}\nPassword: ${adminCredentials?.password}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
          </button>

          <button
            onClick={() => navigate('/schools')}
            className="flex-1 py-3 bg-[#008f8c] hover:bg-[#007a78] text-white font-black rounded-xl text-xs transition cursor-pointer"
          >
            View in Schools Directory →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/schools')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New School Campus</h1>
            <p className="text-xs text-slate-500 font-medium">Multi-Tenant Onboarding, Academic Starter Template & Billing Setup</p>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { num: 1, title: 'School Details', desc: 'Identity & Admin' },
          { num: 2, title: 'Subscription', desc: 'Plan & Validity' },
          { num: 3, title: 'Starter Template', desc: 'Curriculum Preset' },
          { num: 4, title: 'Billing & Tax', desc: 'Payment Collection' }
        ].map(s => (
          <div 
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              step === s.num
                ? 'bg-white border-[#008f8c] shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                step === s.num ? 'bg-[#008f8c] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {s.num}
              </span>
              <span className="font-bold text-xs text-slate-900">{s.title}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 ml-8">{s.desc}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Step 1: School & Admin Details */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm sm:text-base">Step 1: School & Administrator Identity</h3>
              <p className="text-xs text-slate-500">Provide official campus name and primary administrative login</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">School Name *</label>
                <input
                  type="text"
                  name="schoolName"
                  placeholder="e.g. Greenwood International School"
                  value={form.schoolName}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus Subdomain Slug *</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="slug"
                    placeholder="greenwood"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-l-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:border-[#008f8c]"
                  />
                  <span className="bg-slate-100 border border-l-0 border-slate-200 px-3 py-2.5 text-xs text-slate-500 rounded-r-xl font-mono">
                    .allcoresolution.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">School Admin Full Name *</label>
                <input
                  type="text"
                  name="adminName"
                  placeholder="Dr. Rajesh Sharma"
                  value={form.adminName}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">School Admin Official Email *</label>
                <input
                  type="email"
                  name="adminEmail"
                  placeholder="principal@greenwood.edu"
                  value={form.adminEmail}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  name="adminPhone"
                  placeholder="+91 98765 43210"
                  value={form.adminPhone}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#008f8c]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Password</label>
                <input
                  type="text"
                  name="adminPassword"
                  placeholder="School@123"
                  value={form.adminPassword}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:border-[#008f8c]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-[#008f8c] hover:bg-[#007a78] text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Proceed to Subscription →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Subscription */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm sm:text-base">Step 2: Subscription Plan & Validity</h3>
              <p className="text-xs text-slate-500">Select tier quotas and initial subscription duration</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subscription Plan *</label>
                <select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold bg-white"
                >
                  <option value="Enterprise">Enterprise Plan (Unlimited Modules + AI)</option>
                  <option value="Standard">Standard Plan</option>
                  <option value="Basic">Basic Plan</option>
                  <option value="Trial">Trial Plan (30 Days)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Subscription Period *</label>
                <select
                  name="subscriptionType"
                  value={form.subscriptionType}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold bg-white"
                >
                  <option value="Yearly">Yearly (Annual 365 Days)</option>
                  <option value="Monthly">Monthly (30 Days)</option>
                  <option value="Custom">Custom Expiration Date</option>
                </select>
              </div>

              {form.subscriptionType === 'Custom' && (
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Custom Expiration Date</label>
                  <input
                    type="date"
                    name="customSubscriptionEndsAt"
                    value={form.customSubscriptionEndsAt}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-[#008f8c] hover:bg-[#007a78] text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Proceed to Template →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Starter Template */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm sm:text-base">Step 3: Onboarding Starter Template</h3>
              <p className="text-xs text-slate-500">Pick an academic curriculum starter pack to pre-configure classes & subjects</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'cbse-standard', name: 'CBSE Standard Pack', desc: 'Pre-configures Grades 1 to 12, NCERT subjects, grading scales & CBSE report card rubrics.' },
                { id: 'icse-starter', name: 'ICSE / CISCE Pack', desc: 'Pre-provisions ICSE standard departments, bifurcated science/humanities and ICSE assessment weights.' },
                { id: 'state-board', name: 'State Board Pack', desc: 'Bilingual subjects, regional language streams and state scholarship categories ready-to-go.' }
              ].map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => setForm({ ...form, onboardingTemplate: tpl.id })}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    form.onboardingTemplate === tpl.id
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{tpl.name}</span>
                    {form.onboardingTemplate === tpl.id && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{tpl.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 bg-[#008f8c] hover:bg-[#007a78] text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Proceed to Billing Setup →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Billing & Payment Mode */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm sm:text-base">Step 4: Billing, Payment & GST Treatment</h3>
              <p className="text-xs text-slate-500">Configure how this school is billed upon initial registration</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Billing Mode *</label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'paid_in_full', label: 'Paid in full', desc: 'Money already received' },
                    { id: 'part_paid', label: 'Part paid', desc: 'Some received; balance due' },
                    { id: 'not_paid_yet', label: 'Not paid yet', desc: 'Invoice now, collect later' },
                    { id: 'complimentary', label: 'Complimentary', desc: 'Free ₹0 invoice for record' }
                  ].map(b => (
                    <div
                      key={b.id}
                      onClick={() => setForm({ ...form, billingMode: b.id })}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        form.billingMode === b.id
                          ? 'bg-[#008f8c]/10 border-[#008f8c] text-slate-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="block text-xs">{b.label}</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  name="billingCustomAmount"
                  value={form.billingCustomAmount}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">State (for GST Calculation)</label>
                <select
                  name="billingStateCode"
                  value={form.billingStateCode}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white"
                >
                  <option value="07">07 - Delhi</option>
                  <option value="09">09 - Uttar Pradesh</option>
                  <option value="27">27 - Maharashtra</option>
                  <option value="29">29 - Karnataka</option>
                  <option value="06">06 - Haryana</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">GSTIN / VAT Number (Optional)</label>
                <input
                  type="text"
                  name="billingTaxId"
                  placeholder="07AAAAA0000A1Z5"
                  value={form.billingTaxId}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Reference / UTR #</label>
                <input
                  type="text"
                  name="billingReference"
                  placeholder="NEFT-AXIS-992144"
                  value={form.billingReference}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#008f8c] hover:bg-[#007a78] active:bg-[#006664] text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Provisioning School...' : 'Complete Registration & Go Live'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
