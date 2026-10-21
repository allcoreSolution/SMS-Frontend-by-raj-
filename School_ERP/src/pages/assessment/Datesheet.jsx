import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  Calendar, Plus, Search, Printer, Clock, MapPin, 
  Trash2, X, Save, BookOpen, AlertCircle, FileText
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';

export default function Datesheet() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialExamId = searchParams.get('examId') || '';

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedExam, setSelectedExam] = useState(initialExamId);
  const [selectedClass, setSelectedClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    exam: '',
    academicClass: '',
    subject: '',
    examDate: new Date().toISOString().slice(0, 10),
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    roomNo: 'Hall 1',
    maxMarks: 100,
    passMarks: 33
  });

  useEffect(() => {
    Promise.all([
      examService.getExams(),
      academicService.getClasses(),
      academicService.getSubjects()
    ]).then(([examsRes, classesRes, subjectsRes]) => {
      const examList = examsRes.data || [];
      setExams(examList);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);

      if (!selectedExam && examList.length > 0) {
        setSelectedExam(examList[0]._id);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchSchedules();
    }
  }, [selectedExam, selectedClass]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await examService.getSchedules({
        examId: selectedExam || undefined,
        classId: selectedClass || undefined
      });
      if (res.success) {
        setSchedules(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!formData.exam || !formData.academicClass || !formData.subject) {
      return Swal.fire('Error', 'Please select Exam, Class, and Subject', 'warning');
    }

    try {
      setSaving(true);
      const res = await examService.saveSchedule(formData);
      if (res.success) {
        Swal.fire({
          title: 'Paper Scheduled!',
          text: 'Exam timetable updated.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIsModalOpen(false);
        fetchSchedules();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to save paper schedule', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Paper?',
      text: 'Remove this paper from datesheet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await examService.deleteSchedule(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Paper schedule removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setSchedules(prev => prev.filter(s => (s._id || s.id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete schedule', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Exam Datesheet & Timetable</h1>
            <p className="text-xs text-slate-500 mt-1">
              Examination date schedules, invigilation rooms, time slots, and pass marks criteria
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" /> Print Datesheet
            </button>
            <button 
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  exam: selectedExam || (exams[0]?._id || ''),
                  academicClass: selectedClass || (classes[0]?._id || ''),
                  subject: subjects[0]?._id || ''
                }));
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Schedule Paper
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="min-w-[220px]">
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Select Examination</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {exams.map(e => (
                  <option key={e._id} value={e._id}>{e.examName} ({e.session})</option>
                ))}
              </select>
            </div>

            <div className="min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Filter Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.className}</option>
                ))}
              </select>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500">
            {schedules.length} Papers Scheduled
          </span>
        </div>

        {/* Schedules Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading datesheet timetable...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Papers Scheduled</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No subjects scheduled for this examination yet. Click "Schedule Paper" to add examination papers.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Class</th>
                    <th className="py-3.5 px-4">Timings</th>
                    <th className="py-3.5 px-4">Room / Hall</th>
                    <th className="py-3.5 px-4">Max Marks</th>
                    <th className="py-3.5 px-4">Pass Marks</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((sch) => {
                    const schId = sch._id || sch.id;
                    return (
                      <tr key={schId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                          {new Date(sch.examDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-indigo-700">
                          {sch.subject?.subjectName || 'Subject'}
                          {sch.subject?.code && <span className="block text-[10px] text-slate-400 font-mono">{sch.subject.code}</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md font-semibold text-slate-700 text-xs">
                            {sch.academicClass?.className || 'Class'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                          {sch.startTime} — {sch.endTime}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {sch.roomNo || 'Main Hall'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {sch.maxMarks}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                          {sch.passMarks}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSchedule(schId)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Remove Paper"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Schedule Paper Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" /> Schedule Paper in Datesheet
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Exam *</label>
                  <select
                    value={formData.exam}
                    onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-bold"
                  >
                    {exams.map(e => <option key={e._id} value={e._id}>{e.examName}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Class *</label>
                  <select
                    value={formData.academicClass}
                    onChange={(e) => setFormData({ ...formData, academicClass: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-bold text-indigo-700"
                >
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.code || 'CODE'})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Time</label>
                  <input
                    type="text"
                    placeholder="09:30 AM"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">End Time</label>
                  <input
                    type="text"
                    placeholder="12:30 PM"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Room / Hall</label>
                  <input
                    type="text"
                    placeholder="Room 101"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Marks</label>
                  <input
                    type="number"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Pass Marks</label>
                  <input
                    type="number"
                    value={formData.passMarks}
                    onChange={(e) => setFormData({ ...formData, passMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  {saving ? 'Saving...' : 'Add Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
