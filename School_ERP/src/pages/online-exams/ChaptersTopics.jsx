import React, { useState, useEffect } from 'react';
import { 
  GitFork, Folder, Plus, Trash2, ArrowLeft, 
  RefreshCw, BookOpen, Tag, HelpCircle, Layers, 
  ChevronRight, ChevronDown, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OnlineExamsTabs from '../../components/assessment/OnlineExamsTabs';
import { onlineExamService } from '../../api/onlineExamService';
import { academicService } from '../../api/academicService';

export default function ChaptersTopics() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'chapter', // 'chapter', 'topic', 'subtopic'
    parentId: null,
    parentName: '',
    name: '',
    subject: 'Science',
    academicClass: 'Class 10'
  });

  useEffect(() => {
    fetchSubjects();
    fetchChapters();
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const res = await academicService.getSubjects().catch(() => ({ data: [] }));
      const list = Array.isArray(res) ? res : (res?.data || []);
      setSubjects(list);
    } catch (err) {
      console.warn('Could not load subjects', err);
    }
  };

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await onlineExamService.getChaptersTopics({
        subject: selectedSubject !== 'All' ? selectedSubject : undefined
      });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setItems(list);
    } catch (err) {
      console.error('Error fetching chapters/topics:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Chapters',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = (type, parent = null) => {
    setModalConfig({
      type,
      parentId: parent ? parent._id : null,
      parentName: parent ? parent.name : '',
      name: '',
      subject: parent?.subject || (selectedSubject !== 'All' ? selectedSubject : 'Science'),
      academicClass: parent?.academicClass || 'Class 10'
    });
    setModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!modalConfig.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Name Required', text: 'Please enter a name.' });
      return;
    }

    try {
      setSaving(true);
      await onlineExamService.createChapterTopic({
        name: modalConfig.name.trim(),
        type: modalConfig.type,
        subject: modalConfig.subject,
        academicClass: modalConfig.academicClass,
        parentId: modalConfig.parentId || null
      });

      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully',
        text: `${modalConfig.type === 'chapter' ? 'Chapter' : 'Topic'} has been recorded.`,
        timer: 1400,
        showConfirmButton: false
      });

      setModalOpen(false);
      fetchChapters();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name, type) => {
    const result = await Swal.fire({
      title: `Delete ${type}?`,
      text: `Are you sure you want to delete "${name}"? Nested topics will also be removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await onlineExamService.deleteChapterTopic(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          timer: 1300,
          showConfirmButton: false
        });
        fetchChapters();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err?.response?.data?.message || err.message,
          confirmButtonColor: '#7c3aed'
        });
      }
    }
  };

  // Build hierarchical structure
  const chapters = items.filter(i => i.type === 'chapter');
  const getTopics = (chapterId) => items.filter(i => i.type === 'topic' && i.parentId === chapterId);
  const getSubtopics = (topicId) => items.filter(i => i.type === 'subtopic' && i.parentId === topicId);

  // Distinct subjects
  const subjectList = Array.from(new Set([
    ...subjects.map(s => s.subjectName || s.name),
    ...items.map(i => i.subject)
  ])).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                <GitFork className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                  Syllabus Chapters & Topics
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Organize question classification taxonomy into Chapters, Topics, and Sub-units
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => openCreateModal('chapter')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Chapter
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <OnlineExamsTabs />

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500">Filter by Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="All">All Subjects</option>
              {subjectList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Folder className="w-4 h-4 text-purple-600" />
            <span>{chapters.length} Chapters</span>
            <span>•</span>
            <span>{items.filter(i => i.type === 'topic').length} Topics</span>
            <button 
              onClick={fetchChapters}
              className="p-1 text-slate-400 hover:text-purple-600 rounded-lg ml-2 cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hierarchical Tree Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" /> Subject Taxonomy Hierarchy
            </h3>
            <span className="text-xs text-slate-400">Expandable structure</span>
          </div>

          {loading ? (
            <div className="py-14 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span className="font-medium text-xs">Loading Chapters & Topics...</span>
            </div>
          ) : chapters.length === 0 ? (
            <div className="py-14 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <span className="font-semibold text-slate-700 text-sm">No Chapters Found</span>
              <span className="text-xs text-slate-400">Click "Add Chapter" above to create your first syllabus unit.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map(chapter => {
                const topics = getTopics(chapter._id);

                return (
                  <div 
                    key={chapter._id} 
                    className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50 hover:border-purple-200 transition-all"
                  >
                    {/* Chapter Header Card */}
                    <div className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                          <Folder className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <span>{chapter.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                              {chapter.subject}
                            </span>
                            {chapter.academicClass && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                {chapter.academicClass}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {topics.length} Sub-topics registered • {chapter.questionsCount || 0} Questions Linked
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => openCreateModal('topic', chapter)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Topic
                        </button>
                        <button
                          onClick={() => handleDelete(chapter._id, chapter.name, 'Chapter')}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Topics Nested List */}
                    {topics.length > 0 && (
                      <div className="p-4 space-y-2.5 pl-6 sm:pl-10">
                        {topics.map(topic => {
                          const subtopics = getSubtopics(topic._id);

                          return (
                            <div key={topic._id} className="space-y-2">
                              <div className="p-3 bg-white rounded-xl border border-slate-200/70 flex items-center justify-between gap-3 shadow-xs">
                                <div className="flex items-center gap-2.5">
                                  <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                                  <span className="font-semibold text-slate-700 text-xs">{topic.name}</span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold">
                                    Topic
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openCreateModal('subtopic', topic)}
                                    className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Sub-unit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(topic._id, topic.name, 'Topic')}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Subtopics Nested */}
                              {subtopics.length > 0 && (
                                <div className="pl-6 space-y-1.5">
                                  {subtopics.map(sub => (
                                    <div 
                                      key={sub._id} 
                                      className="p-2 bg-slate-50/80 rounded-lg border border-slate-100 text-xs flex items-center justify-between text-slate-600"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                        <span>{sub.name}</span>
                                      </div>
                                      <button
                                        onClick={() => handleDelete(sub._id, sub.name, 'Subtopic')}
                                        className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ===================== ADD MODAL ===================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-200">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Add {modalConfig.type === 'chapter' ? 'Chapter' : modalConfig.type === 'topic' ? 'Topic' : 'Subtopic'}
                  </h3>
                  {modalConfig.parentName && (
                    <p className="text-[11px] text-purple-600 font-semibold">Under: {modalConfig.parentName}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {modalConfig.type === 'chapter' ? 'Chapter Name' : 'Topic Name'} <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Thermodynamics, Algebra, Organic Chemistry"
                  value={modalConfig.name}
                  onChange={(e) => setModalConfig({...modalConfig, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              {modalConfig.type === 'chapter' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                    <select
                      value={modalConfig.subject}
                      onChange={(e) => setModalConfig({...modalConfig, subject: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                      {subjectList.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      <option value="Science">Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Class</label>
                    <input 
                      type="text"
                      placeholder="e.g. Class 10"
                      value={modalConfig.academicClass}
                      onChange={(e) => setModalConfig({...modalConfig, academicClass: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving...' : 'Save Unit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
