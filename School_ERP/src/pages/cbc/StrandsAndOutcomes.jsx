import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, Plus, Trash2, Edit3, Save, CheckCircle, ChevronDown, ChevronRight, 
  Lightbulb, BookOpen, AlertCircle, Sparkles, X, PlusCircle 
} from 'lucide-react';
import CbcHeader from './CbcHeader';
import cbcService from '../../api/cbcService';

const INITIAL_SUBJECTS = ['English', 'Mathematics', 'Integrated Science', 'Social Studies', 'Creative Arts'];

const INITIAL_STRANDS = [];

const StrandsAndOutcomes = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('English');
  const [strands, setStrands] = useState(() => {
    try {
      const saved = localStorage.getItem('cbc_strands');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(s => s.id === 'str-1' || s.id === 'str-2')) {
        localStorage.removeItem('cbc_strands');
        return [];
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [expandedStrandId, setExpandedStrandId] = useState(null);
  const [isAddStrandOpen, setIsAddStrandOpen] = useState(false);
  const [newStrandName, setNewStrandName] = useState('');

  // Sub-strand Modal
  const [isSubStrandModalOpen, setIsSubStrandModalOpen] = useState(false);
  const [targetStrandId, setTargetStrandId] = useState(null);
  const [subStrandForm, setSubStrandForm] = useState({
    name: '',
    outcome: '',
    lvl4: '',
    lvl3: '',
    lvl2: '',
    lvl1: ''
  });

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const saveStrandsToStorage = (updated) => {
    setStrands(updated);
    localStorage.setItem('cbc_strands', JSON.stringify(updated));
  };

  const handleCreateStrand = (e) => {
    e.preventDefault();
    if (!newStrandName.trim()) return;

    const newStrand = {
      id: `str-${Date.now()}`,
      subject: selectedSubject,
      strandName: newStrandName.trim(),
      subStrands: []
    };

    const updated = [...strands, newStrand];
    saveStrandsToStorage(updated);
    setNewStrandName('');
    setIsAddStrandOpen(false);
    setExpandedStrandId(newStrand.id);
    showToast(`Strand "${newStrand.strandName}" added successfully!`);
  };

  const handleDeleteStrand = (strandId) => {
    if (!window.confirm('Delete this strand and all its learning outcomes?')) return;
    const updated = strands.filter(s => s.id !== strandId);
    saveStrandsToStorage(updated);
    showToast('Strand deleted.');
  };

  const openAddSubStrand = (strandId) => {
    setTargetStrandId(strandId);
    setSubStrandForm({
      name: '',
      outcome: '',
      lvl4: 'Exceeding Expectations: Demonstrates mastery independently and innovatively.',
      lvl3: 'Meeting Expectations: Demonstrates required competency accurately at grade level.',
      lvl2: 'Approaching Expectations: Demonstrates competency with occasional guidance.',
      lvl1: 'Below Expectations: Requires significant assistance to perform task.'
    });
    setIsSubStrandModalOpen(true);
  };

  const handleCreateSubStrand = (e) => {
    e.preventDefault();
    if (!subStrandForm.name.trim() || !subStrandForm.outcome.trim()) {
      alert('Please enter both Sub-strand Title and Learning Outcome.');
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      ...subStrandForm
    };

    const updated = strands.map(s => {
      if (s.id === targetStrandId) {
        return { ...s, subStrands: [...(s.subStrands || []), newSub] };
      }
      return s;
    });

    saveStrandsToStorage(updated);
    setIsSubStrandModalOpen(false);
    showToast(`Learning Outcome "${newSub.name}" added!`);
  };

  const handleDeleteSubStrand = (strandId, subId) => {
    if (!window.confirm('Delete this learning outcome?')) return;
    const updated = strands.map(s => {
      if (s.id === strandId) {
        return { ...s, subStrands: s.subStrands.filter(sub => sub.id !== subId) };
      }
      return s;
    });
    saveStrandsToStorage(updated);
    showToast('Outcome removed.');
  };

  const activeStrands = strands.filter(s => s.subject === selectedSubject);

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <CbcHeader activeTab="strands" />

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Info Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[#5F52FF] shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 leading-relaxed font-medium">
            <strong>Curriculum Mapping:</strong> Strands are broad learning areas (e.g. <em>Listening & Speaking</em>), while Sub-strands are measurable topics with explicit 4-level rubric descriptors. When teachers grade an assessment, these rubrics guide their evaluations.
          </div>
        </div>

        {/* Subject Pills & Add Strand Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Subject:</span>
            {INITIAL_SUBJECTS.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                  selectedSubject === subj
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsAddStrandOpen(true)}
            className="px-4 py-2 bg-[#5F52FF] hover:bg-[#4E41E6] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Strand
          </button>
        </div>

        {/* Strands List Container */}
        <div className="space-y-4">
          {activeStrands.length > 0 ? (
            activeStrands.map((strand) => {
              const isExpanded = expandedStrandId === strand.id;

              return (
                <div 
                  key={strand.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition"
                >
                  {/* Strand Header Row */}
                  <div 
                    onClick={() => setExpandedStrandId(isExpanded ? null : strand.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
                          {strand.strandName}
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {(strand.subStrands || []).length} Sub-strands
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Subject: {strand.subject}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openAddSubStrand(strand.id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Outcome
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStrand(strand.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Strand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="w-6 flex justify-center text-slate-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sub-strands List */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/40 space-y-4">
                      {strand.subStrands && strand.subStrands.length > 0 ? (
                        strand.subStrands.map((sub, idx) => (
                          <div 
                            key={sub.id || idx}
                            className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div>
                                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  {sub.name}
                                </h4>
                                <p className="text-xs text-slate-600 mt-1 pl-7 font-medium">
                                  <strong>Expected Outcome:</strong> {sub.outcome}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteSubStrand(strand.id, sub.id)}
                                className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                                title="Delete Outcome"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* 4 Performance Rubric Descriptors */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-[11px]">
                              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                                <span className="font-bold text-emerald-800 block mb-0.5">Level 4: Exceeding (EE)</span>
                                <p className="text-emerald-900 leading-snug">{sub.lvl4 || 'Demonstrates mastery independently.'}</p>
                              </div>
                              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                                <span className="font-bold text-blue-800 block mb-0.5">Level 3: Meeting (ME)</span>
                                <p className="text-blue-900 leading-snug">{sub.lvl3 || 'Demonstrates accurate competency.'}</p>
                              </div>
                              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                                <span className="font-bold text-amber-800 block mb-0.5">Level 2: Approaching (AE)</span>
                                <p className="text-amber-900 leading-snug">{sub.lvl2 || 'Demonstrates with occasional support.'}</p>
                              </div>
                              <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100">
                                <span className="font-bold text-rose-800 block mb-0.5">Level 1: Below (BE)</span>
                                <p className="text-rose-900 leading-snug">{sub.lvl1 || 'Requires constant assistance.'}</p>
                              </div>
                            </div>

                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                          <p className="mb-2">No learning outcomes added under this strand yet.</p>
                          <button
                            type="button"
                            onClick={() => openAddSubStrand(strand.id)}
                            className="text-xs font-bold text-emerald-700 hover:underline"
                          >
                            + Add First Learning Outcome
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Strands Defined for {selectedSubject}</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">Click below to create the first strand under {selectedSubject}.</p>
              <button
                type="button"
                onClick={() => setIsAddStrandOpen(true)}
                className="px-4 py-2 bg-[#5F52FF] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#4E41E6] transition"
              >
                + Add Strand for {selectedSubject}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Modal: Add Strand */}
      {isAddStrandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#5F52FF] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" /> Add New Strand ({selectedSubject})
              </h3>
              <button 
                type="button"
                onClick={() => setIsAddStrandOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStrand} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Strand Name / Domain <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Geometry & Spatial Sense"
                  value={newStrandName}
                  onChange={(e) => setNewStrandName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStrandOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5F52FF] text-white font-bold hover:bg-[#4E41E6] shadow-sm"
                >
                  Create Strand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Sub-Strand & Rubrics */}
      {isSubStrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Add Sub-strand & Performance Rubrics
              </h3>
              <button 
                type="button"
                onClick={() => setIsSubStrandModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubStrand} className="p-6 space-y-4 text-xs font-medium max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sub-strand Topic Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 2D Shapes & Angular Relationships"
                  value={subStrandForm.name}
                  onChange={(e) => setSubStrandForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specific Learning Outcome <span className="text-red-500">*</span></label>
                <textarea
                  rows="2"
                  placeholder="e.g. Learner identifies, classifies, and constructs triangles based on angles."
                  value={subStrandForm.outcome}
                  onChange={(e) => setSubStrandForm(prev => ({ ...prev, outcome: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  required
                />
              </div>

              {/* Rubric Levels */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Criterion-Referenced Rubrics (4 Levels)
                </span>

                <div>
                  <label className="block font-bold text-emerald-800 mb-0.5">Level 4: Exceeding Expectations (EE)</label>
                  <input
                    type="text"
                    value={subStrandForm.lvl4}
                    onChange={(e) => setSubStrandForm(prev => ({ ...prev, lvl4: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-emerald-200 rounded-lg bg-emerald-50/40 text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-blue-800 mb-0.5">Level 3: Meeting Expectations (ME)</label>
                  <input
                    type="text"
                    value={subStrandForm.lvl3}
                    onChange={(e) => setSubStrandForm(prev => ({ ...prev, lvl3: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-blue-200 rounded-lg bg-blue-50/40 text-blue-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-800 mb-0.5">Level 2: Approaching Expectations (AE)</label>
                  <input
                    type="text"
                    value={subStrandForm.lvl2}
                    onChange={(e) => setSubStrandForm(prev => ({ ...prev, lvl2: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-amber-200 rounded-lg bg-amber-50/40 text-amber-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-rose-800 mb-0.5">Level 1: Below Expectations (BE)</label>
                  <input
                    type="text"
                    value={subStrandForm.lvl1}
                    onChange={(e) => setSubStrandForm(prev => ({ ...prev, lvl1: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-rose-200 rounded-lg bg-rose-50/40 text-rose-950"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubStrandModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Save Learning Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StrandsAndOutcomes;
