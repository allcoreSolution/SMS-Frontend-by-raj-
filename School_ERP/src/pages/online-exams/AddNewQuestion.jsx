import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, HelpCircle, CheckCircle, ArrowLeft, 
  Sparkles, Save, RefreshCw, BookOpen, Layers, 
  ListPlus, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OnlineExamsTabs from '../../components/assessment/OnlineExamsTabs';
import { onlineExamService } from '../../api/onlineExamService';
import { academicService } from '../../api/academicService';

export default function AddNewQuestion() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Form State
  const [questionType, setQuestionType] = useState('Multiple Choice - Single Answer');
  const [className, setClassName] = useState('Class 10');
  const [subjectName, setSubjectName] = useState('Science');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    'Option A',
    'Option B',
    'Option C',
    'Option D'
  ]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');
  const [status, setStatus] = useState('Published');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const [clsRes, subRes] = await Promise.all([
        academicService.getClasses().catch(() => ({ data: [] })),
        academicService.getSubjects().catch(() => ({ data: [] }))
      ]);
      const clsList = Array.isArray(clsRes) ? clsRes : (clsRes?.data || []);
      const subList = Array.isArray(subRes) ? subRes : (subRes?.data || []);
      setClasses(clsList);
      setSubjects(subList);
      if (clsList.length > 0) setClassName(clsList[0].className || clsList[0].name);
      if (subList.length > 0) setSubjectName(subList[0].subjectName || subList[0].name);
    } catch (err) {
      console.warn('Could not load academic classes/subjects', err);
    }
  };

  const handleTypeChange = (newType) => {
    setQuestionType(newType);
    if (newType === 'True / False') {
      setOptions(['True', 'False']);
      setCorrectOptionIndex(0);
    } else if (newType.includes('Multiple Choice')) {
      if (options.length < 4) {
        setOptions(['Option A', 'Option B', 'Option C', 'Option D']);
      }
    } else {
      setOptions(['Correct Answer']);
      setCorrectOptionIndex(0);
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
      if (correctOptionIndex >= updated.length) {
        setCorrectOptionIndex(0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Text', text: 'Please enter question text' });
      return;
    }

    const payload = {
      text: questionText,
      questionType,
      options,
      correctOptionIndex,
      marks: Number(marks),
      difficultyLevel,
      className,
      subjectName,
      chapter,
      topic,
      explanation,
      status
    };

    try {
      setSubmitting(true);
      await onlineExamService.createQuestion(payload);
      
      const result = await Swal.fire({
        icon: 'success',
        title: 'Question Added Successfully!',
        text: 'The question has been added to your live Question Bank.',
        showCancelButton: true,
        confirmButtonColor: '#7c3aed',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Add Another Question',
        cancelButtonText: 'Go to Question Bank'
      });

      if (result.isConfirmed) {
        setQuestionText('');
        setExplanation('');
        if (questionType.includes('Multiple Choice')) {
          setOptions(['', '', '', '']);
        }
      } else {
        navigate('/online-exams/question-bank');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error Saving Question',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                  Add New CBT Question
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Author online questions with automatic scoring options and explanation
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/online-exams/question-bank')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Question Bank
          </button>
        </div>

        {/* Navigation Tabs */}
        <OnlineExamsTabs />

        {/* Main Authoring Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          
          {/* Classification Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-600" /> 1. Question Classification & Subject
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question Type <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={questionType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="Multiple Choice - Single Answer">Multiple Choice (Single Answer)</option>
                  <option value="Multiple Choice - Multiple Answers">Multiple Choice (Multiple Answers)</option>
                  <option value="True / False">True / False</option>
                  <option value="Short Answer">Short Answer</option>
                  <option value="Fill in the Blanks">Fill in the Blanks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Class <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {classes.map((c, i) => (
                    <option key={c._id || i} value={c.className || c.name}>{c.className || c.name}</option>
                  ))}
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 8">Class 8</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {subjects.map((s, i) => (
                    <option key={s._id || i} value={s.subjectName || s.name}>{s.subjectName || s.name}</option>
                  ))}
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Chapter (Optional)</label>
                <input 
                  type="text" 
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Chemical Reactions, Optics, Grammar" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Topic (Optional)</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Oxidation, Tenses, Reflection" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> 2. Question Statement
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Question Statement / Prompt <span className="text-rose-500">*</span>
              </label>
              <textarea 
                rows="3"
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question statement clearly here..." 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              ></textarea>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Options & Answer Key */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 3. Options & Correct Answer Key
              </h3>
              {questionType.includes('Multiple Choice') && options.length < 6 && (
                <button 
                  type="button"
                  onClick={addOption}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                >
                  <ListPlus className="w-3.5 h-3.5" /> Add Option
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Select the radio button next to the <strong>correct answer</strong> to set automated scoring.
            </p>

            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    correctOptionIndex === idx
                      ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio"
                      name="correctOption"
                      checked={correctOptionIndex === idx}
                      onChange={() => setCorrectOptionIndex(idx)}
                      className="w-4 h-4 text-purple-600 accent-purple-600 cursor-pointer"
                    />
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </label>

                  <input 
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />

                  {questionType.includes('Multiple Choice') && options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Scoring & Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> 4. Marks & Grading
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Marks Allocated</label>
                <input 
                  type="number"
                  min="1"
                  max="50"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Difficulty Level</label>
                <select 
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Publish Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Published">Published (Active in Bank)</option>
                  <option value="Draft">Draft (Save for Review)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Solution / Explanation (Shown in Student Review)
              </label>
              <textarea 
                rows="2"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why the answer is correct for student feedback after exam submission..." 
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/online-exams/question-bank')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{submitting ? 'Saving Question...' : 'Save Question to Bank'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
