import React, { useState } from 'react';
import { 
  BookOpen, Calendar as CalendarIcon, Save, Send, 
  ArrowLeft, CheckCircle2, AlertCircle, Plus, Sparkles, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService, { TEACHERS_LIST, CLASSES_LIST, SUBJECTS_MAP } from '../../api/lessonPlanService';

export default function NewLessonPlan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teacherName: TEACHERS_LIST[0],
    className: 'Class X / A',
    sectionName: 'Section A',
    subjectName: 'Mathematics Standard',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    periods: 5,
    title: '',
    chapters: '',
    objectives: '',
    teachingMethods: ['Lecture', 'Activity'],
    teachingAids: ['Smart board', 'Textbook'],
    resources: 'NCERT Textbook, interactive slides, and practice worksheets.',
    additionalTopics: '',
    homework: '',
    selectedSyllabusTopics: []
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Available teaching methods & aids
  const availableMethods = [
    'Lecture', 'Activity', 'Demonstration', 'Discussion', 
    'Group work', 'Audio-visual', 'Experiment / Lab'
  ];

  const availableAids = [
    'Textbook', 'Projector', 'Smart board', 'Lab equipment', 
    'Charts / Models', 'Worksheets', 'Digital content'
  ];

  // Syllabus sample topics for selected class
  const sampleSyllabusTopics = [
    'Foundational concepts and principles introduction',
    'Core theorems / textual breakdown and contextual comprehension',
    'Guided practice and collaborative problem solving',
    'Independent evaluation and inquiry-based exercises',
    'Formative chapter quiz and recap review'
  ];

  const handleClassChange = (selectedClass) => {
    let subjectGroup = 'Secondary';
    if (selectedClass.includes('Nursery')) subjectGroup = 'Nursery';
    else if (selectedClass.includes('LKG')) subjectGroup = 'LKG';
    else if (selectedClass.includes('UKG')) subjectGroup = 'UKG';
    else if (selectedClass.includes('Class I') || selectedClass.includes('Class II') || selectedClass.includes('Class III') || selectedClass.includes('Class IV') || selectedClass.includes('Class V')) subjectGroup = 'Primary';
    else if (selectedClass.includes('Class XI') || selectedClass.includes('Class XII')) subjectGroup = 'Senior';

    const subjects = SUBJECTS_MAP[subjectGroup] || SUBJECTS_MAP['Secondary'];
    setFormData(prev => ({
      ...prev,
      className: selectedClass,
      subjectName: subjects[0] || 'Mathematics'
    }));
  };

  const toggleMethod = (method) => {
    setFormData(prev => ({
      ...prev,
      teachingMethods: prev.teachingMethods.includes(method)
        ? prev.teachingMethods.filter(m => m !== method)
        : [...prev.teachingMethods, method]
    }));
  };

  const toggleAid = (aid) => {
    setFormData(prev => ({
      ...prev,
      teachingAids: prev.teachingAids.includes(aid)
        ? prev.teachingAids.filter(a => a !== aid)
        : [...prev.teachingAids, aid]
    }));
  };

  const toggleSyllabusTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      selectedSyllabusTopics: prev.selectedSyllabusTopics.includes(topic)
        ? prev.selectedSyllabusTopics.filter(t => t !== topic)
        : [...prev.selectedSyllabusTopics, topic]
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.teacherName) newErrors.teacherName = 'Please select teacher';
    if (!formData.className) newErrors.className = 'Please select class';
    if (!formData.subjectName) newErrors.subjectName = 'Please select subject';
    if (!formData.startDate) newErrors.startDate = 'Start date required';
    if (!formData.endDate) newErrors.endDate = 'End date required';
    if (!formData.objectives.trim()) newErrors.objectives = 'Learning objectives are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (submitStatus) => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const generatedTitle = formData.title.trim() || 
        `${formData.subjectName} — ${formData.className} (${new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;

      const chapterList = formData.chapters.split('\n').map(c => c.trim()).filter(Boolean);
      const additionalList = formData.additionalTopics.split('\n').map(t => t.trim()).filter(Boolean);

      // Build structured topic checklist
      const topicsList = [
        ...formData.selectedSyllabusTopics.map((text, i) => ({
          id: `top_s_${i + 1}`,
          text,
          type: 'Syllabus',
          status: 'Pending'
        })),
        ...additionalList.map((text, i) => ({
          id: `top_a_${i + 1}`,
          text,
          type: 'Additional',
          status: 'Pending'
        }))
      ];

      // If no topics manually chosen, provide default from title
      if (topicsList.length === 0) {
        topicsList.push({
          id: 'top_def_1',
          text: `Comprehensive study: ${generatedTitle}`,
          type: 'Syllabus',
          status: 'Pending'
        });
      }

      await lessonPlanService.createLessonPlan({
        ...formData,
        title: generatedTitle,
        chapters: chapterList,
        topicsList,
        status: submitStatus,
        coveragePct: 0,
        weekLabel: `${formData.startDate} — ${formData.endDate}`
      });

      setSuccessNotice(true);
      setTimeout(() => {
        navigate('/lesson-planner/plans');
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Failed to save lesson plan.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-28">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1100px] mx-auto space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/lesson-planner/plans')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Lesson Plans
          </button>
          <span className="text-xs text-slate-400 font-medium">Weekly Curriculum Formulation</span>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-sm font-medium">
              Lesson plan successfully created! Redirecting to plans directory...
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Draft New Curriculum Lesson Plan</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify pedagogical methods, syllabus learning objectives, and period breakdown.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              Instructional Unit
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* Row 1: Teacher, Class, Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assigned Teacher <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                >
                  {TEACHERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Class / Grade <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={formData.className}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                >
                  {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  placeholder="e.g. Mathematics Standard"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Row 2: Period Dates & Periods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> Start Date <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> End Date <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Planned Periods
                </label>
                <input 
                  type="number"
                  min="1"
                  max="20"
                  value={formData.periods}
                  onChange={(e) => setFormData({ ...formData, periods: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Plan Title <span className="text-slate-400 font-normal">(Auto-generated if left blank)</span>
              </label>
              <input 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Trigonometric Ratios & Height Estimations"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Chapters */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Chapter / Unit Names <span className="text-slate-400 font-normal">(one per line)</span>
              </label>
              <textarea 
                rows="2"
                value={formData.chapters}
                onChange={(e) => setFormData({ ...formData, chapters: e.target.value })}
                placeholder="Chapter 8: Introduction to Trigonometry&#10;Chapter 9: Some Applications of Trigonometry"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

            {/* Learning Objectives */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Learning Objectives & Outcomes <span className="text-rose-500">*</span>
              </label>
              <textarea 
                rows="3"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="What skills, core concepts, or problem-solving methods should students master by the end of this period?"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-y ${
                  errors.objectives ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              {errors.objectives && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.objectives}
                </p>
              )}
            </div>

            {/* Teaching Methods & Aids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2.5">
                  Teaching Methods
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableMethods.map(method => {
                    const active = formData.teachingMethods.includes(method);
                    return (
                      <button
                        type="button"
                        key={method}
                        onClick={() => toggleMethod(method)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          active 
                            ? 'bg-blue-600 text-white shadow-2xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2.5">
                  Teaching Aids & Technology
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableAids.map(aid => {
                    const active = formData.teachingAids.includes(aid);
                    return (
                      <button
                        type="button"
                        key={aid}
                        onClick={() => toggleAid(aid)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          active 
                            ? 'bg-indigo-600 text-white shadow-2xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {aid}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Syllabus Topics Checklist Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Curriculum Topics To Include in Coverage Tracker:
              </label>
              <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                {sampleSyllabusTopics.map((topic, idx) => {
                  const isChecked = formData.selectedSyllabusTopics.includes(topic);
                  return (
                    <label key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-100/60 p-1.5 rounded-lg transition-colors">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSyllabusTopic(topic)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={isChecked ? 'font-semibold text-slate-900' : 'text-slate-600'}>
                        {topic}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Additional Topics */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Additional Non-Syllabus Topics <span className="text-slate-400 font-normal">(one per line — revision, Olympiad questions, etc.)</span>
              </label>
              <textarea 
                rows="2"
                value={formData.additionalTopics}
                onChange={(e) => setFormData({ ...formData, additionalTopics: e.target.value })}
                placeholder="Revision of previous week formulas&#10;Quick surprise concept check"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

            {/* Homework */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Homework / Assignments Planned
              </label>
              <textarea 
                rows="2"
                value={formData.homework}
                onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                placeholder="e.g. Exercise 8.2 Questions 1-5, Practice paper problem sets..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

          </div>

        </div>

      </div>

      {/* Floating Bottom Sticky Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20">
        <button 
          type="button"
          onClick={() => navigate('/lesson-planner/plans')}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('Draft')}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <button 
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('Pending HOD')}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Submit for HOD Review</span>
          </button>
        </div>
      </div>

    </div>
  );
}
