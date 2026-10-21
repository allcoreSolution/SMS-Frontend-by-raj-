import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Bell, Layers, Book, Columns, LayoutDashboard, 
  Save, Trash2, Plus, Target, CheckCircle, Smartphone, FolderCheck, User, 
  Check, AlertCircle, Eye, Sparkles
} from 'lucide-react';
import LeadHeader from './LeadHeader';

const DEFAULT_STAGES = [
  { id: 1, name: 'New Enquiry', color: 'bg-slate-500', kind: 'Lead (entry)', active: true },
  { id: 2, name: 'Contacted / Qualified', color: 'bg-[#3b82f6]', kind: 'Contact', active: true },
  { id: 3, name: 'Application Received', color: 'bg-[#8b5cf6]', kind: 'Application', active: true },
  { id: 4, name: 'Document Verification', color: 'bg-[#a855f7]', kind: 'Documents', active: true },
  { id: 5, name: 'Entrance Test', color: 'bg-[#f59e0b]', kind: 'Entrance test', active: true },
  { id: 6, name: 'Counselling / Interview', color: 'bg-[#ec4899]', kind: 'Counselling', active: true },
  { id: 7, name: 'Offer / Selected', color: 'bg-[#06b6d4]', kind: 'Offer', active: true },
  { id: 8, name: 'Enrolled', color: 'bg-[#10b981]', kind: 'Won (enrolled)', active: true },
  { id: 9, name: 'Lost / Rejected', color: 'bg-[#ef4444]', kind: 'Lost', active: true },
];

const DEFAULT_SOURCES = [
  { id: 1, name: 'Walk-in', category: 'Walk-in', active: true },
  { id: 2, name: 'Website', category: 'Website', active: true },
  { id: 3, name: 'Facebook', category: 'Social Media', active: true },
  { id: 4, name: 'Google Ads', category: 'Search', active: true },
  { id: 5, name: 'Referral', category: 'Referral', active: true },
  { id: 6, name: 'Sibling / Existing', category: 'Sibling', active: true },
  { id: 7, name: 'Newspaper / Print', category: 'Print', active: true },
  { id: 8, name: 'Other', category: 'Other', active: true },
];

const DEFAULT_DOCUMENTS = [
  { id: 1, name: 'Student Aadhaar / National ID', class: 'All classes', required: true, active: true },
  { id: 2, name: 'Birth Certificate', class: 'All classes', required: true, active: true },
  { id: 3, name: 'Parent / Guardian ID Proof', class: 'All classes', required: true, active: true },
  { id: 4, name: 'Previous School Transfer Certificate', class: 'Grade 1 - 12', required: false, active: true },
  { id: 5, name: 'Previous Year Marksheet / Report Card', class: 'Grade 2 - 12', required: false, active: true },
];

const SourcesAndStages = () => {
  const navigate = useNavigate();

  // State with localStorage persistence
  const [stages, setStages] = useState(() => {
    const saved = localStorage.getItem('lead_stages');
    return saved ? JSON.parse(saved) : DEFAULT_STAGES;
  });

  const [sources, setSources] = useState(() => {
    const saved = localStorage.getItem('lead_sources');
    return saved ? JSON.parse(saved) : DEFAULT_SOURCES;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('lead_documents');
    return saved ? JSON.parse(saved) : DEFAULT_DOCUMENTS;
  });

  // Inputs for adding new items
  const [newStageName, setNewStageName] = useState('');
  const [newStageKind, setNewStageKind] = useState('Contact');
  const [newStageColor, setNewStageColor] = useState('bg-[#8b5cf6]');

  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState('Walk-in');

  const [newDocName, setNewDocName] = useState('');
  const [newDocClass, setNewDocClass] = useState('All classes');
  const [newDocRequired, setNewDocRequired] = useState(true);

  // Conversion Ledger Setting
  const [trustLedger, setTrustLedger] = useState(true);

  // Parent application form fields state
  const [parentFields, setParentFields] = useState({
    studentFirstName: true,
    studentGender: true,
    studentDob: true,
    studentAadhaar: true,
    fatherName: true,
    fatherPhone: true,
    motherName: true,
    currentAddress: true,
    emergencyPhone: true,
    previousSchool: true,
    bloodGroup: true,
  });

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Save to localStorage
  const saveAllSettings = () => {
    localStorage.setItem('lead_stages', JSON.stringify(stages));
    localStorage.setItem('lead_sources', JSON.stringify(sources));
    localStorage.setItem('lead_documents', JSON.stringify(documents));
    showToast('All pipeline configurations saved successfully!');
  };

  // Stage Handlers
  const handleStageNameChange = (id, newName) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const handleToggleStageActive = (id) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    if (!newStageName.trim()) return;
    const newStage = {
      id: Date.now(),
      name: newStageName.trim(),
      color: newStageColor,
      kind: newStageKind,
      active: true,
    };
    const updated = [...stages, newStage];
    setStages(updated);
    localStorage.setItem('lead_stages', JSON.stringify(updated));
    setNewStageName('');
    showToast(`Stage "${newStage.name}" added successfully!`);
  };

  const handleDeleteStage = (id) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      const updated = stages.filter(s => s.id !== id);
      setStages(updated);
      localStorage.setItem('lead_stages', JSON.stringify(updated));
      showToast('Stage removed');
    }
  };

  // Source Handlers
  const handleSourceNameChange = (id, newName) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const handleToggleSourceActive = (id) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    const newSource = {
      id: Date.now(),
      name: newSourceName.trim(),
      category: newSourceCategory,
      active: true,
    };
    const updated = [...sources, newSource];
    setSources(updated);
    localStorage.setItem('lead_sources', JSON.stringify(updated));
    setNewSourceName('');
    showToast(`Source "${newSource.name}" added!`);
  };

  const handleDeleteSource = (id) => {
    if (window.confirm('Delete this source?')) {
      const updated = sources.filter(s => s.id !== id);
      setSources(updated);
      localStorage.setItem('lead_sources', JSON.stringify(updated));
      showToast('Source removed');
    }
  };

  // Document Handlers
  const handleDocNameChange = (id, newName) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, name: newName } : d));
  };

  const handleToggleDocRequired = (id) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, required: !d.required } : d));
  };

  const handleToggleDocActive = (id) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const newDoc = {
      id: Date.now(),
      name: newDocName.trim(),
      class: newDocClass,
      required: newDocRequired,
      active: true,
    };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    localStorage.setItem('lead_documents', JSON.stringify(updated));
    setNewDocName('');
    showToast(`Document "${newDoc.name}" added!`);
  };

  const handleDeleteDoc = (id) => {
    if (window.confirm('Delete this required document?')) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      localStorage.setItem('lead_documents', JSON.stringify(updated));
      showToast('Document removed');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <LeadHeader activeTab="sources-stages" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Pipeline & Admissions Configuration</h2>
            <p className="text-xs text-slate-500 font-medium">Customize funnel stages, attribution sources, documents and parent form fields</p>
          </div>
          <button
            type="button"
            onClick={saveAllSettings}
            className="bg-[#5F52FF] hover:bg-[#4E41E6] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        {/* Section 1: Stages & Sources Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Pipeline Stages Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F52FF] flex items-center gap-2">
                  <Columns className="w-4 h-4" /> Pipeline Stages ({stages.length})
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Stages drive how cards move across the pipeline and trigger next actions.
                </p>
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-slate-300 transition">
                  <div className={`w-5 h-5 rounded-lg ${stage.color} shrink-0`}></div>
                  <input 
                    type="text" 
                    value={stage.name} 
                    onChange={(e) => handleStageNameChange(stage.id, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20" 
                  />
                  <span className="text-[10px] text-slate-400 font-bold w-20 text-right shrink-0">
                    {stage.kind}
                  </span>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={stage.active} 
                      onChange={() => handleToggleStageActive(stage.id)} 
                      className="rounded text-[#5F52FF] focus:ring-[#5F52FF]" 
                    />
                    Active
                  </label>
                  <button 
                    type="button"
                    onClick={() => handleDeleteStage(stage.id)} 
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded transition" 
                    title="Delete stage"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              
              {/* Add New Stage Form */}
              <form onSubmit={handleAddStage} className="mt-4 pt-4 border-t border-slate-100 flex items-end gap-2.5">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">New Stage Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Home Visit / Verification" 
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20" 
                  />
                </div>
                <div className="w-28">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kind</label>
                  <select 
                    value={newStageKind}
                    onChange={(e) => setNewStageKind(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold focus:outline-none bg-white text-slate-700"
                  >
                    <option value="Lead (entry)">Lead</option>
                    <option value="Contact">Contact</option>
                    <option value="Application">Application</option>
                    <option value="Counselling">Counselling</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="bg-[#5F52FF] text-white p-2 h-9 w-9 rounded-xl hover:bg-[#4E41E6] flex items-center justify-center transition shadow-2xs"
                  title="Add Stage"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

          {/* Lead Sources Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F52FF] flex items-center gap-2">
                  <Target className="w-4 h-4" /> Lead Sources ({sources.length})
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Where candidates come from — used for funnel analytics and ROI.
                </p>
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-slate-300 transition">
                  <input 
                    type="text" 
                    value={source.name} 
                    onChange={(e) => handleSourceNameChange(source.id, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20" 
                  />
                  <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold shrink-0">
                    {source.category}
                  </span>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={source.active} 
                      onChange={() => handleToggleSourceActive(source.id)} 
                      className="rounded text-[#5F52FF] focus:ring-[#5F52FF]" 
                    />
                    Active
                  </label>
                  <button 
                    type="button"
                    onClick={() => handleDeleteSource(source.id)} 
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded transition" 
                    title="Delete source"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add New Source */}
              <form onSubmit={handleAddSource} className="mt-4 pt-4 border-t border-slate-100 flex items-end gap-2.5">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">New Source Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Instagram Ads / Campus Banner" 
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20" 
                  />
                </div>
                <div className="w-28">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={newSourceCategory}
                    onChange={(e) => setNewSourceCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold focus:outline-none bg-white text-slate-700"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Search">Search</option>
                    <option value="Print">Print</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="bg-[#5F52FF] text-white p-2 h-9 w-9 rounded-xl hover:bg-[#4E41E6] flex items-center justify-center transition shadow-2xs"
                  title="Add Source"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
          
        </div>

        {/* Section 2: Required Documents Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F52FF] flex items-center gap-2">
                <FolderCheck className="w-4 h-4" /> Required Admission Documents ({documents.length})
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                The documents candidate families must submit prior to enrollment clearance.
              </p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-slate-300 transition">
                <input 
                  type="text" 
                  value={doc.name} 
                  onChange={(e) => handleDocNameChange(doc.id, e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20" 
                />
                <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded font-bold shrink-0">
                  {doc.class}
                </span>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={doc.required} 
                    onChange={() => handleToggleDocRequired(doc.id)} 
                    className="rounded text-[#5F52FF] focus:ring-[#5F52FF]" 
                  />
                  Required
                </label>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={doc.active} 
                    onChange={() => handleToggleDocActive(doc.id)} 
                    className="rounded text-[#5F52FF] focus:ring-[#5F52FF]" 
                  />
                  Active
                </label>
                <button 
                  type="button"
                  onClick={() => handleDeleteDoc(doc.id)} 
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded transition"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add New Document Form */}
            <form onSubmit={handleAddDocument} className="mt-4 pt-4 border-t border-slate-100 flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">New Document Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Immunization / Vaccination Record" 
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20" 
                />
              </div>
              <div className="w-40">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Applies To</label>
                <select 
                  value={newDocClass}
                  onChange={(e) => setNewDocClass(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold focus:outline-none bg-white text-slate-700"
                >
                  <option value="All classes">All classes</option>
                  <option value="Nursery - UKG">Nursery - UKG</option>
                  <option value="Grade 1 - 5">Grade 1 - 5</option>
                  <option value="Grade 6 - 10">Grade 6 - 10</option>
                  <option value="Grade 11 - 12">Grade 11 - 12</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newDocRequired} 
                    onChange={(e) => setNewDocRequired(e.target.checked)}
                    className="rounded text-[#5F52FF] focus:ring-[#5F52FF]" 
                  />
                  Required
                </label>
              </div>
              <button 
                type="submit"
                className="bg-[#5F52FF] text-white p-2 h-9 w-9 rounded-xl hover:bg-[#4E41E6] flex items-center justify-center transition shadow-2xs"
                title="Add Document"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>

        {/* Section 3: Conversion Ledger Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F52FF] flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" /> Conversion Ledger Settings
          </h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={trustLedger}
              onChange={(e) => setTrustLedger(e.target.checked)}
              className="mt-1 rounded text-[#5F52FF] focus:ring-[#5F52FF]" 
            />
            <div>
              <span className="text-xs font-bold text-slate-800">
                Post verified admission fees directly to student's finance ledger upon 1-click admission
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically issues tuition challan and posts receipt to finance reporting when converted from lead to student.
              </p>
            </div>
          </label>
        </div>

      </div>
    </div>
  );
};

export default SourcesAndStages;
