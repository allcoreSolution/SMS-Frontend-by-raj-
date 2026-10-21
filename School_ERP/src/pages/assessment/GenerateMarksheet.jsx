import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  FileText, Search, Eye, Printer, Users, 
  CheckCircle2, ArrowUpRight, Award, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';
import { studentService } from '../../api/studentService';
import { examService } from '../../api/examService';

export default function GenerateMarksheet() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      academicService.getClasses(),
      examService.getExams()
    ]).then(([classesRes, examsRes]) => {
      const cList = classesRes.data || [];
      const eList = examsRes.data || [];
      setClasses(cList);
      setExams(eList);
      if (cList.length > 0) setSelectedClass(cList[0].className || cList[0]._id);
      if (eList.length > 0) setSelectedExam(eList[0]._id);
    }).catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (!selectedClass || !selectedExam) {
      return Swal.fire('Error', 'Please select Class and Examination', 'warning');
    }

    setLoading(true);
    setLoaded(true);
    try {
      const clsObj = classes.find(c => c.className === selectedClass || c._id === selectedClass);
      const clsName = clsObj ? clsObj.className : selectedClass;

      const res = await studentService.getStudents({ class: clsName });
      setStudents(res.data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
      Swal.fire('Error', 'Failed to fetch students roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Generate Student Marksheets</h1>
            <p className="text-xs text-slate-500 mt-1">
              Produce official report cards with grade calculations, percentages & performance evaluations
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Selection Criteria Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Select Class & Exam Session
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Examination *</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {exams.map(e => <option key={e._id} value={e._id}>{e.examName} ({e.session})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 cursor-pointer h-[38px]"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Find Students'}
              </button>
            </div>
          </div>
        </div>

        {/* Student Results Table */}
        {loaded && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-16 gap-3">
                <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-xs font-medium">Fetching students for marksheet generation...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Students Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No enrolled students found in this class and section.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 w-20">Roll No</th>
                      <th className="py-3.5 px-4">Admission No</th>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Gender</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {s.rollNo || '-'}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {s.admissionNo || s.aparId}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {s.firstName} {s.lastName || ''}
                        </td>
                        <td className="py-3 px-4 capitalize">
                          {s.gender || 'Not specified'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-600">
                            {s.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => navigate(`/offline-exams/report-card-view?studentId=${s._id}&examId=${selectedExam}`)}
                            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Marksheet
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
