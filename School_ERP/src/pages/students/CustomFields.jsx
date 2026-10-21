import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  Plus, 
  Menu, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Sliders, 
  BookOpen, 
  Check, 
  X,
  PlusCircle,
  FileText,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Layers
} from "lucide-react";
import settingsService from "../../api/settingsService";

const DEFAULT_FIELDS = [
  { 
    id: 1, 
    name: "APAR National Student ID", 
    belongsTo: "Student Admission Form", 
    type: "Textarea", 
    required: "Required"
  },
  { 
    id: 2, 
    name: "Staff EPF / UAN Number", 
    belongsTo: "Staff Form", 
    type: "Number", 
    required: "Optional"
  },
  { 
    id: 3, 
    name: "Blood Group Certificate No.", 
    belongsTo: "Student Admission Form", 
    type: "Text", 
    required: "Optional"
  },
  { 
    id: 4, 
    name: "Emergency Medical Contact", 
    belongsTo: "Student Admission Form", 
    type: "Text", 
    required: "Required"
  },
  { 
    id: 5, 
    name: "Previous School Board Roll No.", 
    belongsTo: "Student Admission Form", 
    type: "Text", 
    required: "Optional"
  }
];

export default function CustomFields() {
  const location = useLocation();
  const [view, setView] = useState(() => {
    return location.pathname.endsWith("/add") ? "add" : "list";
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState(DEFAULT_FIELDS);

  // Form Fields for adding new item
  const [fieldName, setFieldName] = useState("");
  const [belongsTo, setBelongsTo] = useState("Student Admission Form");
  const [fieldType, setFieldType] = useState("Short Text");
  const [isRequired, setIsRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState("");

  // Fetch fields from MongoDB
  const fetchCustomFields = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting("custom_fields");
      if (res?.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setFields(res.data);
      }
    } catch (err) {
      console.error("Could not fetch custom fields from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomFields();
  }, [fetchCustomFields]);

  const persistFields = async (updated) => {
    setSaving(true);
    try {
      await settingsService.saveSetting("custom_fields", updated);
    } catch (e) {
      console.error("Persist failed:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteField = (id) => {
    Swal.fire({
      title: "Delete Custom Field?",
      text: "Existing saved student/staff values for this field will not be shown.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updated = fields.filter(f => f.id !== id);
        setFields(updated);
        await persistFields(updated);
        Swal.fire({ icon: "success", title: "Field Deleted", timer: 1500, showConfirmButton: false });
      }
    });
  };

  const handleSaveField = async (e) => {
    e.preventDefault();
    if (!fieldName.trim()) {
      Swal.fire({ icon: "warning", title: "Label Required", text: "Please enter a field name." });
      return;
    }

    const newField = {
      id: Date.now(),
      name: fieldName.trim(),
      belongsTo,
      type: fieldType,
      required: isRequired ? "Required" : "Optional",
      options: fieldType.includes("Dropdown") ? fieldOptions.trim() : ""
    };

    const updated = [...fields, newField];
    setFields(updated);
    await persistFields(updated);

    Swal.fire({
      icon: "success",
      title: "Field Added!",
      text: `'${fieldName}' added to ${belongsTo}.`,
      timer: 1800,
      showConfirmButton: false
    });

    setFieldName("");
    setBelongsTo("Student Admission Form");
    setFieldType("Short Text");
    setIsRequired(false);
    setFieldOptions("");
    setView("list");
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Extensible Data Schema
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Dynamic Attributes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-400 inline" />
            Custom Profile Attributes & Fields
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Attach custom fields (APAAR ID, Medical Records, Staff PF UAN, Vehicle License No.) to student enrollment and employee master databases.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 self-start md:self-auto">
          {view === "list" ? (
            <button
              onClick={() => setView("add")}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Custom Field</span>
            </button>
          ) : (
            <button
              onClick={() => setView("list")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Fields List</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── 1. ALL CUSTOM FIELDS LIST VIEW ─── */}
      {view === "list" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
                <Menu className="w-4 h-4 text-indigo-600" />
                Active Custom Fields ({fields.length})
              </h3>
              <p className="text-xs text-slate-400">Custom input parameters rendered in Student & Staff entry forms</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">Field Name / Label</th>
                  <th className="p-4">Belongs To Module</th>
                  <th className="p-4">Input Data Type</th>
                  <th className="p-4">Requirement</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {fields.map((field, idx) => (
                  <tr key={field.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-4 font-black text-slate-900">{field.name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        field.belongsTo.includes('Student')
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {field.belongsTo}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">{field.type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        field.required === 'Required'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {field.required}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                        title="Delete field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 2. ADD CUSTOM FIELD VIEW ─── */}
      {view === "add" && (
        <form onSubmit={handleSaveField} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Create Custom Field</h3>
            <p className="text-xs text-slate-400">Specify field characteristics and module assignment</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Field Label *</label>
              <input
                type="text"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. APAAR ID or Vehicle License Number"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Belongs To Module *</label>
                <select
                  value={belongsTo}
                  onChange={(e) => setBelongsTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Student Admission Form">Student Admission Form</option>
                  <option value="Staff Form">Staff Form</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Input Data Type *</label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Short Text">Short Text</option>
                  <option value="Textarea">Long Textarea</option>
                  <option value="Number">Number</option>
                  <option value="Dropdown">Dropdown (Select Option)</option>
                  <option value="Date Picker">Date Picker</option>
                </select>
              </div>
            </div>

            {fieldType === "Dropdown" && (
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Options (Comma separated)</label>
                <input
                  type="text"
                  value={fieldOptions}
                  onChange={(e) => setFieldOptions(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="reqCheck"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="reqCheck" className="font-bold text-slate-700 cursor-pointer">
                Mark as Mandatory (Required field on submission)
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Field..." : "Save Custom Field"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}
