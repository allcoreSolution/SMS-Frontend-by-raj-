import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  Info, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Save, 
  Check, 
  Database,
  User,
  Heart,
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sliders,
  FileText
} from "lucide-react";
import settingsService from "../api/settingsService";

const DEFAULT_FIELDS = {
  // Academic section
  biometricId: true,
  prevSchool: true,
  tcNumber: true,
  
  // Personal Info section
  aadhaarId: true,
  penSssmId: true,
  religion: true,
  caste: true,
  subCaste: true,
  motherTongue: true,
  bloodGroup: true,
  placeOfBirth: true,
  bplRteQuota: true,

  // Parents section
  fatherAadhaar: true,
  motherAadhaar: true,
  fatherIncome: true,
  guardianDetails: true,

  // Health & Bank section
  heightWeight: true,
  bankDetails: true,
  medicalHistory: true
};

export default function AdmissionFormFields() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fields, setFields] = useState(DEFAULT_FIELDS);

  // Fetch settings from MongoDB
  const fetchFormFields = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting("admission_form_fields");
      if (res?.success && res.data) {
        setFields(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error("Could not fetch admission form fields:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormFields();
  }, [fetchFormFields]);

  // Handle individual toggle
  const handleToggle = (key) => {
    setFields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Bulk actions
  const handleShowAll = () => {
    const updated = {};
    Object.keys(fields).forEach(key => { updated[key] = true; });
    setFields(updated);
  };

  const handleHideAll = () => {
    const updated = {};
    Object.keys(fields).forEach(key => { updated[key] = false; });
    setFields(updated);
  };

  // Save to MongoDB
  const handleSaveChanges = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.saveSetting("admission_form_fields", fields);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Visibility Matrix Saved!",
          text: "Admission form field visibility updated in MongoDB.",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not save field settings."
      });
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      id: "academic",
      title: "Academic & Enrollment",
      icon: Database,
      iconColor: "text-blue-600 bg-blue-50",
      items: [
        { key: "biometricId", label: "Biometric ID / Fingerprint Key", desc: "Machine biometric punch mapping code" },
        { key: "prevSchool", label: "Previous School Name & Board", desc: "Transfer background & last school passed" },
        { key: "tcNumber", label: "Transfer Certificate (TC) Number", desc: "Official verification document reference" }
      ]
    },
    {
      id: "personal",
      title: "Student Personal Identity",
      icon: User,
      iconColor: "text-indigo-600 bg-indigo-50",
      items: [
        { key: "aadhaarId", label: "Aadhaar / National ID Card", desc: "12-digit UIDAI / national identity number" },
        { key: "penSssmId", label: "Permanent Education No. (PEN) / SSSM", desc: "State portal or government tracking ID" },
        { key: "religion", label: "Religion", desc: "Required for state minority grant reports" },
        { key: "caste", label: "Caste / Category (Gen / OBC / SC / ST)", desc: "Mandatory statutory social category" },
        { key: "subCaste", label: "Sub-Caste Details", desc: "Specific community classification" },
        { key: "motherTongue", label: "Primary Mother Tongue", desc: "Language spoken at home" },
        { key: "bloodGroup", label: "Blood Group", desc: "Emergency medical classification" },
        { key: "placeOfBirth", label: "Place of Birth & Domicile", desc: "City, district and state of birth" },
        { key: "bplRteQuota", label: "BPL / RTE Quota Eligibility", desc: "Below poverty line & free quota indicators" }
      ]
    },
    {
      id: "parents",
      title: "Parents & Family Coordinates",
      icon: Users,
      iconColor: "text-emerald-600 bg-emerald-50",
      items: [
        { key: "fatherAadhaar", label: "Father's Aadhaar Number", desc: "Verification ID of father/legal guardian" },
        { key: "motherAadhaar", label: "Mother's Aadhaar Number", desc: "Verification ID of mother" },
        { key: "fatherIncome", label: "Annual Family Income", desc: "Income bracket for scholarship evaluation" },
        { key: "guardianDetails", label: "Local Guardian Contact & Address", desc: "Alternate contact in case parents are unavailable" }
      ]
    },
    {
      id: "healthBank",
      title: "Health & Bank Accounts",
      icon: Heart,
      iconColor: "text-rose-600 bg-rose-50",
      items: [
        { key: "heightWeight", label: "Height & Weight Metrics", desc: "BMI tracking for school sports and health cards" },
        { key: "medicalHistory", label: "Allergies & Medical History", desc: "Chronic illness, medication or dietary alerts" },
        { key: "bankDetails", label: "Student Bank Account & IFSC", desc: "Direct benefit transfer (DBT) and fee refunds" }
      ]
    }
  ];

  // Active count
  const totalFields = Object.keys(fields).length;
  const activeFields = Object.values(fields).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Form Schema Builder
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Field Visibility Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-indigo-400 inline" />
            Admission Form Field Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Toggle optional data fields on or off across the admission intake form, student profile cards, and print application dockets.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <button
            onClick={fetchFormFields}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-white cursor-pointer border border-white/10"
            title="Reload from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleSaveChanges}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 border-none"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Visibility Matrix"}</span>
          </button>
        </div>
      </div>

      {/* ─── Informational Alert Banner ─── */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3.5 text-indigo-900 shadow-xs">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="font-black text-indigo-950">How optional field visibility works:</strong> Unticking a field hides it from the student registration page, public admission docket, and student profile editor. 
          <span className="font-bold text-indigo-950 ml-1">Existing saved data in MongoDB is never deleted</span>; toggling only hides or reveals the field input in active forms. Essential fields (Student Name, Class, DOB, Gender, Primary Phone) are permanent and cannot be hidden.
        </div>
      </div>

      {/* ─── Search & Bulk Toolbar ─── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search fields by label or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-xs font-bold text-slate-500">
            <span className="text-indigo-600 font-black">{activeFields}</span> of {totalFields} fields visible
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShowAll}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Show All
            </button>
            <button
              onClick={handleHideAll}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-500" /> Hide All
            </button>
          </div>
        </div>
      </div>

      {/* ─── Sections Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          const filteredItems = section.items.filter(item => 
            !searchQuery.trim() || 
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${section.iconColor}`}>
                  <SectionIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 tracking-tight">{section.title}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">{filteredItems.length} configurable fields</p>
                </div>
              </div>

              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const isChecked = !!fields[item.key];

                  return (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isChecked 
                          ? "bg-white border-slate-200/80 hover:border-indigo-300" 
                          : "bg-slate-50/70 border-slate-200/40 opacity-70"
                      }`}
                    >
                      <div className="space-y-0.5 pr-4">
                        <div className="text-xs font-bold text-slate-800">{item.label}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{item.desc}</div>
                      </div>

                      {/* iOS Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggle(item.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isChecked ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            isChecked ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSaveChanges}
          disabled={saving || loading}
          className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm rounded-full shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all cursor-pointer border-none"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Visibility Matrix"}</span>
        </button>
      </div>

    </div>
  );
}
