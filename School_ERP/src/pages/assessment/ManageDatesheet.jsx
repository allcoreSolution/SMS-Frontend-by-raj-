import React, { useState, useEffect } from 'react';
import { 
  Printer, FileText, Megaphone, ArrowLeft, Calendar, 
  MapPin, AlertTriangle, CheckCircle2, Clock, Layers, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { examService } from '../../api/examService';

export default function ManageDatesheet() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [examDetails, setExamDetails] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      loadExamScheduleData();
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const res = await examService.getExams().catch(() => ({ data: [] }));
      const list = Array.isArray(res) ? res : (res?.data || res?.exams || []);
      setExams(list);
      if (list.length > 0) setSelectedExam(list[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadExamScheduleData = async () => {
    setLoading(true);
    try {
      const currentExam = exams.find(e => e._id === selectedExam);
      setExamDetails(currentExam);
      const res = await examService.getExamSchedules(selectedExam);
      setSchedules(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePublish = () => {
    Swal.fire({
      icon: 'success',
      title: 'Datesheet Published!',
      text: 'Notification sent to students, teachers, and parents.',
      timer: 1800,
      showConfirmButton: false
    });
  };

  // Group schedules by class
  const schedulesByClass = schedules.reduce((acc, curr) => {
    const cls = curr.className || 'General';
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(curr);
    return acc;
  }, {});

  const classList = Object.keys(schedulesByClass);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 font-sans pb-16 print:bg-white print:p-0">
      
      {/* Top Banner (hidden in print) */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Notice Board Timetable
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">Official Consolidated Datesheet</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Master Examination Datesheet
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                Print Notice
              </button>
              <button 
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer"
              >
                <Megaphone className="w-4 h-4" />
                Publish to Noticeboard
              </button>
            </div>
          </div>

          <div className="mt-4">
            <OfflineExamsTabs />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Exam Picker Card (hidden in print) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Select Exam Term:</span>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {Array.isArray(exams) && exams.map(e => (
                <option key={e._id} value={e._id}>{e.examName || e.name} ({e.session || e.academicSession || '2026-27'})</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-slate-500">
            Total {schedules.length} papers scheduled across {classList.length} classrooms
          </div>
        </div>

        {/* Official Printable Notice Board Document */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 print:border-none print:shadow-none print:p-0">
          
          {/* Header for Notice */}
          <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">
              ALL CORE SOLUTIONS & SENIOR SECONDARY SCHOOL
            </h2>
            <p className="text-xs text-slate-600 font-medium uppercase tracking-wider mt-1">
              Affiliated with Central Board of Secondary Education (CBSE) • New Delhi
            </p>
            <div className="inline-block mt-3 px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-wider">
              OFFICIAL EXAMINATION DATESHEET — {examDetails?.name?.toUpperCase() || 'ANNUAL EXAMINATION 2026-27'}
            </div>
            <div className="flex justify-center items-center gap-6 mt-3 text-xs text-slate-600">
              <span><strong>Session:</strong> {examDetails?.academicSession || '2026-2027'}</span>
              <span>•</span>
              <span><strong>Reporting Time:</strong> 08:30 AM</span>
              <span>•</span>
              <span><strong>Commencement:</strong> 09:00 AM SHARP</span>
            </div>
          </div>

          {/* Grouped Timetable Section */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Compiling datesheet...
            </div>
          ) : classList.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No scheduled papers found for this exam</p>
              <p className="text-xs text-slate-400 mt-1">Configure subjects in Schedule & Marks Setup first.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {classList.map(clsName => (
                <div key={clsName} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Class: {clsName}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      {schedulesByClass[clsName].length} Papers
                    </span>
                  </div>

                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                        <th className="py-2.5 px-4 w-12 text-center">S.No</th>
                        <th className="py-2.5 px-4">Subject</th>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Day</th>
                        <th className="py-2.5 px-4">Timing</th>
                        <th className="py-2.5 px-4 text-center">Max Marks</th>
                        <th className="py-2.5 px-4">Room No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                      {schedulesByClass[clsName].map((item, idx) => {
                        const dateObj = item.examDate ? new Date(item.examDate) : null;
                        const dayName = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'long' }) : '-';
                        const dateStr = dateObj ? dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD';

                        return (
                          <tr key={item._id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {item.subjectName}
                              {item.subjectCode && <span className="text-[10px] text-slate-400 font-mono ml-2">({item.subjectCode})</span>}
                            </td>
                            <td className="py-3 px-4 font-semibold text-indigo-700">{dateStr}</td>
                            <td className="py-3 px-4 text-slate-600">{dayName}</td>
                            <td className="py-3 px-4 font-medium">{item.startTime} - {item.endTime}</td>
                            <td className="py-3 px-4 text-center font-bold">{item.maxMarks}</td>
                            <td className="py-3 px-4 font-medium text-slate-600">{item.roomNo || 'Hall-A'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Signatures Footer */}
              <div className="pt-12 mt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs font-bold text-slate-700">
                <div>
                  <div className="h-12 flex items-end justify-center mb-1">
                    <span className="text-[11px] font-serif italic text-slate-400">Exam Incharge</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1">Examination Controller</div>
                </div>
                <div>
                  <div className="h-12 flex items-end justify-center mb-1">
                    <span className="text-[11px] font-serif italic text-slate-400">Head of Academics</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1">Academic Coordinator</div>
                </div>
                <div>
                  <div className="h-12 flex items-end justify-center mb-1">
                    <span className="text-[11px] font-serif italic text-slate-400">Principal Seal</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1">Principal Signature & Stamp</div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
