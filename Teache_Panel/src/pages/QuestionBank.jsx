import React, { useState, useMemo, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  List, Plus, Search, Eye, Edit, Trash2, 
  Filter, X, BookOpen, Tag, Target, CheckCircle,
  HelpCircle, Upload, Download, Copy, Loader2
} from 'lucide-react';
import { onlineExamService } from '../api/onlineExamService';
import { academicService } from '../api/academicService';

const defaultSubjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'General'];
const defaultClasses = ['Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII', 'Class I'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const questionTypes = ['All', 'MCQ', 'Subjective', 'True/False'];

const difficultyStyle = {
  Easy: 'bg-green-100 text-green-700 border border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Hard: 'bg-red-100 text-red-600 border border-red-200',
};

const typeStyle = {
  'MCQ': 'bg-blue-50 text-blue-600 border border-blue-100',
  'Subjective': 'bg-purple-50 text-purple-600 border border-purple-100',
  'True/False': 'bg-teal-50 text-teal-600 border border-teal-100',
};

const QuestionBank = () => {
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [viewQuestion, setViewQuestion] = useState(null);

  const [subjects, setSubjects] = useState(defaultSubjects);
  const [classesList, setClassesList] = useState(defaultClasses);

  const [form, setForm] = useState({
    subject: defaultSubjects[0], 
    class: defaultClasses[2] || defaultClasses[0], 
    topic: '', 
    type: 'MCQ',
    difficulty: 'Medium', 
    marks: '1', 
    question: '', 
    options: ['', '', '', ''], 
    answer: ''
  });

  useEffect(() => {
    fetchQuestions();
    fetchAcademicDropdowns();
  }, []);

  const fetchAcademicDropdowns = async () => {
    try {
      const [clsRes, subRes] = await Promise.all([
        academicService.getClasses().catch(() => ({ data: [] })),
        academicService.getSubjects().catch(() => ({ data: [] }))
      ]);

      const clsArr = Array.isArray(clsRes) ? clsRes : (clsRes?.data || []);
      const subArr = Array.isArray(subRes) ? subRes : (subRes?.data || []);

      if (clsArr.length > 0) {
        const clsNames = clsArr.map(c => c.className || c.name).filter(Boolean);
        if (clsNames.length > 0) setClassesList(clsNames);
      }
      if (subArr.length > 0) {
        const subNames = subArr.map(s => s.subjectName || s.name).filter(Boolean);
        if (subNames.length > 0) setSubjects(subNames);
      }
    } catch (err) {
      console.warn('Could not load academic classes/subjects', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await onlineExamService.getQuestionBank();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setQuestionsList(list);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return questionsList.filter(q => {
      const qSub = q.subject || q.subjectName || '';
      const qCls = q.class || q.className || '';
      const qDiff = q.difficulty || q.difficultyLevel || '';
      const qText = q.question || q.text || '';
      const qTopic = q.topic || q.chapter || '';
      const qId = q.id || q._id || '';

      const matchSub = filterSubject === 'All' || qSub === filterSubject;
      const matchCls = filterClass === 'All' || qCls === filterClass;
      const matchDiff = filterDifficulty === 'All' || qDiff === filterDifficulty;

      const qQuery = search.toLowerCase();
      const matchSearch = 
        qText.toLowerCase().includes(qQuery) ||
        qTopic.toLowerCase().includes(qQuery) ||
        String(qId).toLowerCase().includes(qQuery);

      return matchSub && matchCls && matchDiff && matchSearch;
    });
  }, [questionsList, search, filterSubject, filterClass, filterDifficulty]);

  const stats = [
    { label: 'Total Questions', val: questionsList.length, icon: List, color: 'text-cyan-500 bg-cyan-50' },
    { label: 'MCQs', val: questionsList.filter(q => q.type === 'MCQ').length, icon: CheckCircle, color: 'text-blue-500 bg-blue-50' },
    { label: 'Subjective', val: questionsList.filter(q => q.type === 'Subjective').length, icon: BookOpen, color: 'text-purple-500 bg-purple-50' },
    { label: 'Hard Level', val: questionsList.filter(q => q.difficulty === 'Hard').length, icon: Target, color: 'text-red-500 bg-red-50' },
  ];

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setForm({
      subject: subjects[0] || 'Mathematics', 
      class: classesList[0] || 'Class X', 
      topic: '', 
      type: 'MCQ',
      difficulty: 'Medium', 
      marks: '1', 
      question: '', 
      options: ['', '', '', ''], 
      answer: ''
    });
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setForm({
      subject: q.subject || subjects[0],
      class: q.class || classesList[0],
      topic: q.topic || '',
      type: q.type || 'MCQ',
      difficulty: q.difficulty || 'Medium',
      marks: String(q.marks || 1),
      question: q.question || '',
      options: Array.isArray(q.options) && q.options.length > 0 ? q.options : ['', '', '', ''],
      answer: q.answer || ''
    });
    setShowModal(true);
  };

  const handleDuplicate = (q) => {
    setEditingQuestion(null);
    setForm({
      subject: q.subject || subjects[0],
      class: q.class || classesList[0],
      topic: q.topic || '',
      type: q.type || 'MCQ',
      difficulty: q.difficulty || 'Medium',
      marks: String(q.marks || 1),
      question: `${q.question} (Copy)`,
      options: Array.isArray(q.options) ? [...q.options] : ['', '', '', ''],
      answer: q.answer || ''
    });
    setShowModal(true);
  };

  const handleDelete = (q) => {
    const qId = q._id || q.id;
    Swal.fire({
      title: 'Delete Question?',
      text: 'Are you sure you want to delete this question from the Question Bank?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onlineExamService.deleteQuestion(q._id || qId);
          setQuestionsList(prev => prev.filter(item => (item._id || item.id) !== qId));
          Swal.fire('Deleted!', 'The question has been removed.', 'success');
        } catch (err) {
          Swal.fire('Error', err?.response?.data?.message || 'Failed to delete question', 'error');
        }
      }
    });
  };

  const handleSaveQuestion = async () => {
    if (!form.question.trim()) {
      Swal.fire('Required Field', 'Please enter Question Text', 'warning');
      return;
    }

    if (form.type === 'MCQ' && (!form.answer || !form.options.some(o => o.trim()))) {
      Swal.fire('Options Required', 'Please provide options and select the correct answer for the MCQ', 'warning');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        question: form.question.trim(),
        text: form.question.trim(),
        subject: form.subject,
        subjectName: form.subject,
        class: form.class,
        className: form.class,
        topic: form.topic.trim(),
        type: form.type,
        questionType: form.type,
        difficulty: form.difficulty,
        difficultyLevel: form.difficulty,
        marks: parseInt(form.marks) || 1,
        options: form.type === 'MCQ' ? form.options.filter(o => o.trim()) : [],
        answer: form.answer
      };

      if (editingQuestion) {
        const qId = editingQuestion._id || editingQuestion.id;
        await onlineExamService.updateQuestion(qId, payload);
        Swal.fire('Updated!', 'Question updated successfully.', 'success');
      } else {
        await onlineExamService.createQuestion(payload);
        Swal.fire('Saved!', 'New question added to Question Bank.', 'success');
      }

      await fetchQuestions();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving question:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to save question', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImportCSV = async () => {
    const { value: text } = await Swal.fire({
      title: 'Import Questions (CSV / JSON)',
      input: 'textarea',
      inputLabel: 'Paste CSV or JSON formatted question records below:',
      inputPlaceholder: 'question,subject,class,topic,type,difficulty,marks,answer\nWhat is H2O?,Science,Class IX,Chemistry,MCQ,Easy,1,Water',
      showCancelButton: true,
      confirmButtonText: 'Import Now',
      confirmButtonColor: '#0891b2',
      inputValidator: (val) => {
        if (!val) return 'Please paste data to import';
      }
    });

    if (text) {
      try {
        let questionsToUpload = [];
        if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
          const parsed = JSON.parse(text);
          questionsToUpload = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          // Parse CSV
          const lines = text.trim().split('\n');
          const dataLines = lines.slice(lines[0].toLowerCase().includes('question') ? 1 : 0);
          questionsToUpload = dataLines.map(line => {
            const parts = line.split(',');
            return {
              text: parts[0]?.trim() || 'Sample Question',
              question: parts[0]?.trim() || 'Sample Question',
              subjectName: parts[1]?.trim() || 'General',
              className: parts[2]?.trim() || 'Class X',
              topic: parts[3]?.trim() || 'General',
              questionType: parts[4]?.trim() || 'MCQ',
              difficultyLevel: parts[5]?.trim() || 'Medium',
              marks: parseInt(parts[6]) || 1,
              answer: parts[7]?.trim() || '',
              options: parts[7] ? [parts[7].trim(), 'Option B', 'Option C', 'Option D'] : []
            };
          });
        }

        if (questionsToUpload.length > 0) {
          await onlineExamService.bulkUploadQuestions(questionsToUpload);
          Swal.fire('Success!', `${questionsToUpload.length} questions imported successfully.`, 'success');
          await fetchQuestions();
        }
      } catch (err) {
        Swal.fire('Parse Error', 'Could not parse the provided data. Please ensure valid CSV or JSON.', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    if (questionsList.length === 0) {
      Swal.fire('No Data', 'No questions available to export', 'info');
      return;
    }
    const headers = ['ID', 'Question', 'Subject', 'Class', 'Topic', 'Type', 'Difficulty', 'Marks', 'Correct Answer'];
    const rows = filtered.map(q => [
      `"${q.id || ''}"`,
      `"${(q.question || '').replace(/"/g, '""')}"`,
      `"${q.subject || ''}"`,
      `"${q.class || ''}"`,
      `"${q.topic || ''}"`,
      `"${q.type || ''}"`,
      `"${q.difficulty || ''}"`,
      q.marks || 1,
      `"${(q.answer || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `question_bank_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: 'Downloaded',
      text: 'Question Bank exported successfully!',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <List className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Question Bank</h1>
              <p className="text-sm text-gray-500">Manage and organize all exam questions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV}
              title="Export questions"
              className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex items-center gap-1 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={handleImportCSV}
              className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex items-center gap-1 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Import CSV
            </button>
            <button 
              onClick={openCreateModal}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 flex items-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-4">
              <div className={`w-11 h-11 flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-800">{val}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by question, topic or ID..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40 bg-white" 
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filterSubject} 
              onChange={e => setFilterSubject(e.target.value)} 
              className="border border-gray-200 px-3 py-2 text-sm focus:outline-none text-gray-600 bg-white"
            >
              <option value="All">Subject: All</option>
              {subjects.map(o => <option key={o} value={o}>Subject: {o}</option>)}
            </select>
            <select 
              value={filterClass} 
              onChange={e => setFilterClass(e.target.value)} 
              className="border border-gray-200 px-3 py-2 text-sm focus:outline-none text-gray-600 bg-white"
            >
              <option value="All">Class: All</option>
              {classesList.map(o => <option key={o} value={o}>Class: {o}</option>)}
            </select>
            <select 
              value={filterDifficulty} 
              onChange={e => setFilterDifficulty(e.target.value)} 
              className="border border-gray-200 px-3 py-2 text-sm focus:outline-none text-gray-600 bg-white"
            >
              {difficulties.map(o => <option key={o} value={o}>Difficulty: {o}</option>)}
            </select>
            <button 
              onClick={() => { setSearch(''); setFilterSubject('All'); setFilterClass('All'); setFilterDifficulty('All'); }}
              className="text-xs text-gray-400 hover:text-red-500 border border-dashed border-gray-200 px-2 py-2 hover:border-red-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mb-2" />
              <p className="text-sm font-semibold">Loading questions from database...</p>
            </div>
          ) : (
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-gray-50">
                  {['ID', 'Question & Topic', 'Subject & Class', 'Type', 'Difficulty', 'Marks', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr key={q._id || q.id || i} className="hover:bg-cyan-50/20 transition-colors">
                    <td className="px-4 py-3 border border-gray-200 text-gray-500 font-semibold text-xs">{q.id || `Q-${String(i+1).padStart(3, '0')}`}</td>
                    <td className="px-4 py-3 border border-gray-200 max-w-sm">
                      <p className="font-semibold text-gray-800 line-clamp-2">{q.question}</p>
                      {q.topic && (
                        <p className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 mt-1 inline-flex rounded-full border border-gray-200 items-center gap-1">
                          <Tag className="w-2.5 h-2.5" />{q.topic}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <p className="font-semibold text-gray-700">{q.subject}</p>
                      <p className="text-xs text-gray-500">{q.class}</p>
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-none ${typeStyle[q.type] || typeStyle.MCQ}`}>{q.type}</span>
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-none ${difficultyStyle[q.difficulty] || difficultyStyle.Medium}`}>{q.difficulty}</span>
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-700 font-bold">{q.marks}</td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex gap-1 flex-wrap">
                        <button 
                          onClick={() => setViewQuestion(q)} 
                          className="p-1.5 bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" 
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => openEditModal(q)} 
                          className="p-1.5 bg-indigo-50 text-indigo-500 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDuplicate(q)} 
                          className="p-1.5 bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" 
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(q)} 
                          className="p-1.5 bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer" 
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-14 text-gray-400 border border-gray-200">
                      <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-semibold">No questions match the current filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ===== Add / Edit Question Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-3xl shadow-2xl my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-600" /> {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subject</label>
                <select 
                  value={form.subject} 
                  onChange={e => setForm({ ...form, subject: e.target.value })} 
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Class</label>
                <select 
                  value={form.class} 
                  onChange={e => setForm({ ...form, class: e.target.value })} 
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                >
                  {classesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Polynomials, Optics, Tenses" 
                  value={form.topic} 
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Question Type</label>
                <select 
                  value={form.type} 
                  onChange={e => setForm({ ...form, type: e.target.value })} 
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                >
                  {questionTypes.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Difficulty</label>
                <select 
                  value={form.difficulty} 
                  onChange={e => setForm({ ...form, difficulty: e.target.value })} 
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                >
                  {difficulties.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Marks</label>
                <input 
                  type="number" 
                  min="1" 
                  value={form.marks} 
                  onChange={e => setForm({ ...form, marks: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Question Text *</label>
                <textarea 
                  rows={3} 
                  placeholder="Type the question here..." 
                  value={form.question} 
                  onChange={e => setForm({ ...form, question: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-300/40" 
                />
              </div>
              
              {form.type === 'MCQ' && (
                <div className="md:col-span-2 border border-blue-100 bg-blue-50/30 p-4">
                  <p className="text-xs font-bold text-blue-700 uppercase mb-3">Options &amp; Correct Answer</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {form.options.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Option {idx + 1}</label>
                        <input 
                          type="text" 
                          value={opt} 
                          onChange={e => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          className="w-full border border-gray-200 px-3 py-1.5 text-sm focus:outline-none bg-white" 
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Correct Answer *</label>
                    <select 
                      value={form.answer} 
                      onChange={e => setForm({ ...form, answer: e.target.value })} 
                      className="w-full md:w-1/2 border border-gray-200 px-3 py-1.5 text-sm focus:outline-none bg-white"
                    >
                      <option value="">Select Correct Option...</option>
                      {form.options.map((opt, idx) => opt.trim() && <option key={idx} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {form.type === 'True/False' && (
                <div className="md:col-span-2 border border-teal-100 bg-teal-50/30 p-4">
                  <label className="block text-xs font-bold text-teal-700 uppercase mb-2">Correct Answer *</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="tf" 
                        value="True" 
                        checked={form.answer === 'True'} 
                        onChange={e => setForm({ ...form, answer: e.target.value })} 
                        className="w-4 h-4 accent-cyan-600" 
                      />
                      True
                    </label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="tf" 
                        value="False" 
                        checked={form.answer === 'False'} 
                        onChange={e => setForm({ ...form, answer: e.target.value })} 
                        className="w-4 h-4 accent-cyan-600" 
                      />
                      False
                    </label>
                  </div>
                </div>
              )}

              {form.type === 'Subjective' && (
                <div className="md:col-span-2 border border-purple-100 bg-purple-50/30 p-4">
                  <label className="block text-xs font-bold text-purple-700 uppercase mb-2">Sample Answer / Marking Scheme</label>
                  <textarea 
                    rows={3} 
                    placeholder="Expected answer points or marking criteria..." 
                    value={form.answer} 
                    onChange={e => setForm({ ...form, answer: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none bg-white" 
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button 
                disabled={saving}
                onClick={handleSaveQuestion} 
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Save Question')}
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== View Question Modal ===== */}
      {viewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewQuestion(null)}>
          <div className="bg-white w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">
                Question Details <span className="text-gray-400 font-normal ml-1">({viewQuestion.id})</span>
              </h2>
              <button onClick={() => setViewQuestion(null)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle[viewQuestion.type] || typeStyle.MCQ}`}>{viewQuestion.type}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyStyle[viewQuestion.difficulty] || difficultyStyle.Medium}`}>{viewQuestion.difficulty}</span>
                {viewQuestion.topic && (
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 inline-flex items-center gap-1 rounded-full">
                    <Tag className="w-2.5 h-2.5" />{viewQuestion.topic}
                  </span>
                )}
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 ml-auto rounded-full">{viewQuestion.marks} Marks</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 relative top-2">
                <p className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-cyan-500" /> QUESTION</p>
                <p className="text-base text-gray-900 leading-relaxed font-semibold">{viewQuestion.question}</p>
              </div>
              {viewQuestion.type === 'MCQ' && viewQuestion.options && viewQuestion.options.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4 ml-1">
                  {viewQuestion.options.map((opt, idx) => (
                    <div key={idx} className={`p-2 text-sm border ${opt === viewQuestion.answer ? 'bg-green-50 border-green-200 font-bold text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </div>
                  ))}
                </div>
              )}
              {viewQuestion.answer && (
                <div className="border border-green-100 bg-green-50/50 p-4 mt-4">
                  <p className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> CORRECT ANSWER</p>
                  <p className="text-sm text-gray-800 font-medium">{viewQuestion.answer}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setViewQuestion(null)} 
                className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
