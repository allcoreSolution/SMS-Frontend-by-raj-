import React, { useState } from 'react';
import { 
  Plus, ArrowLeft, Layers, Sparkles, Check, HelpCircle, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';
import osmService, { CLASSES_LIST, SECTIONS_LIST, SUBJECTS_LIST, EXAM_TYPES } from '../../api/osmService';

export default function OSMNewSession() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    className: 'Class X',
    section: 'A',
    subjectName: 'Mathematics',
    examType: 'Term 1 Exam',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    evaluatorName: 'Senior Subject Evaluator',
    anonymous: false,
    allowAnnotations: true,
    moderationEnabled: true,
    initialQuestionsCount: 5,
    defaultMarksPerQuestion: 10
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a session title');
      return;
    }

    setSubmitting(true);
    try {
      // Build default questions based on initial count
      const initialQuestions = [];
      const count = Number(formData.initialQuestionsCount) || 5;
      const marks = Number(formData.defaultMarksPerQuestion) || 10;
      
      for (let i = 1; i <= count; i++) {
        initialQuestions.push({
          qNo: `Q${i}`,
          label: `Question ${i}`,
          maxMarks: marks,
          compulsory: true,
          text: `Enter question ${i} prompt and instructions here.`,
          rubric: `Scoring criteria for Question ${i}`
        });
      }

      const sessionPayload = {
        title: formData.title.trim(),
        className: formData.className,
        section: formData.section,
        subjectName: formData.subjectName,
        examType: formData.examType,
        deadline: formData.deadline,
        evaluatorName: formData.evaluatorName,
        anonymous: formData.anonymous,
        allowAnnotations: formData.allowAnnotations,
        moderationEnabled: formData.moderationEnabled,
        status: 'Draft',
        questions: initialQuestions,
        sheets: []
      };

      const created = await osmService.createSession(sessionPayload);
      const newId = created._id || created.id;
      navigate(`/osm-module/sessions/details?id=${newId}`);
    } catch (err) {
      console.error('Failed to create session:', err);
      alert('Failed to create session. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <OSMNavHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/osm-module/sessions')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create Digital Evaluation Session</h2>
            <p className="text-xs text-slate-500">
              Configure exam parameters, grading policy, and initialize question rubric.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title & Evaluator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Session Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="e.g. Term 1 Exam — Mathematics — Class 10A"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Evaluator Name / Lead
                </label>
                <input 
                  type="text" 
                  name="evaluatorName"
                  value={formData.evaluatorName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Class, Section, Subject, Exam Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Class <span className="text-rose-500">*</span>
                </label>
                <select 
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                >
                  {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Section
                </label>
                <select 
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                >
                  {SECTIONS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <select 
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                >
                  {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Exam Type
                </label>
                <select 
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                >
                  {EXAM_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            {/* Deadline & Initial Setup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1.5">Evaluation Deadline</label>
                <input 
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1.5">Initial Question Count</label>
                <input 
                  type="number"
                  name="initialQuestionsCount"
                  min="1"
                  max="50"
                  value={formData.initialQuestionsCount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1.5">Marks Per Question</label>
                <input 
                  type="number"
                  name="defaultMarksPerQuestion"
                  min="1"
                  max="100"
                  value={formData.defaultMarksPerQuestion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600"
                />
                <p className="text-[10px] text-purple-700 mt-1">Total: {formData.initialQuestionsCount * formData.defaultMarksPerQuestion} Marks (editable later)</p>
              </div>
            </div>

            {/* Policy Toggles */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Evaluation Policies & Privacy</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Anonymous Marking */}
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 accent-purple-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Anonymous Marking</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                      Mask student names and roll numbers with coded IDs (#ANON-XXXX) to prevent evaluator bias.
                    </span>
                  </div>
                </label>

                {/* Digital Annotations */}
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox"
                    name="allowAnnotations"
                    checked={formData.allowAnnotations}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 accent-purple-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Allow Digital Annotations</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                      Enable digital stamps (✔️ Tick, ❌ Cross, comments) directly onto the scanned answer sheet preview.
                    </span>
                  </div>
                </label>

                {/* Moderation Step */}
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input 
                    type="checkbox"
                    name="moderationEnabled"
                    checked={formData.moderationEnabled}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 accent-purple-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Enable Moderation Queue</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                      Route flagged papers and borderline passes to the Head of Department for review before final release.
                    </span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Form Actions Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/osm-module/sessions')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 border-none"
            >
              <Plus className="w-4 h-4" /> {submitting ? 'Creating...' : 'Create & Configure Questions'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
