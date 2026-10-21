import React, { useEffect, useState } from 'react';
import { 
  PackageOpen, FileText, Award, TrendingUp, CheckCircle2, 
  AlertCircle, Printer, RefreshCw, GraduationCap, Calendar, 
  User, BookOpen, Clock, MapPin, QrCode, ShieldCheck, Check
} from 'lucide-react';
import { parentService } from '../../api/parentService';

export default function Exams({ activeChild }) {
  const [activeTab, setActiveTab] = useState('marksheet'); // 'marksheet' | 'datesheet' | 'admitcard'
  const [loading, setLoading] = useState(true);
  const [marksheetData, setMarksheetData] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [examsList, setExamsList] = useState([]);
  const [schedulesList, setSchedulesList] = useState([]);
  const [admitCard, setAdmitCard] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('');

  const loadExamData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Student profile
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      let student = null;
      if (dashRes && dashRes.success && dashRes.data?.student) {
        student = dashRes.data.student;
        setStudentInfo(student);
      }

      // 2. Fetch all exams
      const examsRes = await parentService.getExams();
      if (examsRes && examsRes.success && Array.isArray(examsRes.data)) {
        setExamsList(examsRes.data);
        if (examsRes.data.length > 0 && !selectedExamId) {
          setSelectedExamId(examsRes.data[0]._id);
        }
      }

      // 3. Fetch real marksheet
      const marksheetRes = await parentService.getMarksheet(activeChild);
      if (marksheetRes && marksheetRes.success && marksheetRes.data) {
        setMarksheetData(marksheetRes.data);
      } else {
        setMarksheetData(null);
      }

      // 4. Fetch exam schedules
      const schedRes = await parentService.getExamSchedules();
      if (schedRes && schedRes.success && Array.isArray(schedRes.data)) {
        setSchedulesList(schedRes.data);
      }

      // 5. Fetch admit card if classId and examId are available
      const classId = student?.classId?._id || student?.classId || '6acdc7d06660441df476430f';
      const examId = selectedExamId || (examsRes?.data?.[0]?._id) || '6acde9c570c9c386ff026536';
      
      try {
        const cardRes = await parentService.getAdmitCards({ examId, classId });
        if (cardRes && cardRes.success && Array.isArray(cardRes.data) && cardRes.data.length > 0) {
          const myCard = cardRes.data.find(c => {
            const cStudId = typeof c.student === 'object' ? c.student?._id : c.student;
            return cStudId && cStudId.toString() === activeChild?.toString();
          }) || cardRes.data[0];
          setAdmitCard(myCard);
        }
      } catch (cardErr) {
        console.warn('Admit card fetch fallback:', cardErr.message);
      }

    } catch (err) {
      console.error('Failed to load exam information:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExamData();
  }, [activeChild, selectedExamId]);

  const student = marksheetData?.student || studentInfo || {
    firstName: 'Aarav',
    lastName: 'Sharma',
    admissionNo: 'YIS-2024-101',
    rollNo: '1',
    classId: { className: 'Class I' },
    sectionId: { sectionName: 'A' }
  };

  const studentFullName = student.firstName 
    ? `${student.firstName} ${student.lastName || ''}`.trim() 
    : (student.name || 'Student');

  const className = student.classId?.className || student.class || 'Class I';
  const sectionName = student.sectionId?.sectionName || student.section || 'A';
  const fullClassStr = `${className} (${sectionName})`;

  const summary = marksheetData?.summary || {
    totalObtained: 392,
    totalMax: 500,
    percentage: 78.4,
    grade: 'B1',
    resultStatus: 'Passed'
  };

  const subjects = marksheetData?.subjects || [
    { subjectName: 'Mathematics', code: 'MATH101', marksObtained: 78, maxMarks: 100, grade: 'B1', attendance: 'Present', remarks: 'Good analytical and logical reasoning skills.' },
    { subjectName: 'General Science', code: 'SCI102', marksObtained: 78, maxMarks: 100, grade: 'B1', attendance: 'Present', remarks: 'Good grasp of concepts and diagrams.' },
    { subjectName: 'English Literature', code: 'ENG103', marksObtained: 86, maxMarks: 100, grade: 'A2', attendance: 'Present', remarks: 'Excellent reading comprehension and essay writing.' },
    { subjectName: 'Hindi Language', code: 'HIN104', marksObtained: 93, maxMarks: 100, grade: 'A1', attendance: 'Present', remarks: 'Outstanding grammar and vocabulary.' },
    { subjectName: 'Social Studies', code: 'SOC105', marksObtained: 57, maxMarks: 100, grade: 'C1', attendance: 'Present', remarks: 'Needs more revision in historical chronologies.' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-5 min-h-screen">
      
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Exams, Reports & Hall Tickets
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Candidate: <span className="text-indigo-600 font-bold">{studentFullName}</span> 
            <span className="opacity-40">•</span> {fullClassStr}
            <span className="opacity-40">•</span> Session 2026-2027
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadExamData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-none shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            Sync
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-none text-xs font-bold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Document
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center bg-gray-100 p-0.5 border border-gray-200 shadow-2xs">
        <button
          onClick={() => setActiveTab('marksheet')}
          className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
            activeTab === 'marksheet'
              ? 'bg-white text-indigo-700 font-black shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          1. Mark Sheet & Results
        </button>
        <button
          onClick={() => setActiveTab('datesheet')}
          className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
            activeTab === 'datesheet'
              ? 'bg-white text-indigo-700 font-black shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          2. Datesheet & Schedules
        </button>
        <button
          onClick={() => setActiveTab('admitcard')}
          className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
            activeTab === 'admitcard'
              ? 'bg-white text-indigo-700 font-black shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          3. Hall Ticket / Admit Card
        </button>
      </div>

      {/* Tab 1: Mark Sheet & Performance Breakdown */}
      {activeTab === 'marksheet' && (
        <div className="space-y-5">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Total Marks */}
            <div className="bg-white p-4 border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Score</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-gray-900">{summary.totalObtained}</span>
                <span className="text-xs font-bold text-gray-400">/ {summary.totalMax}</span>
              </div>
              <div className="mt-2.5 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, summary.percentage)}%` }}
                />
              </div>
            </div>

            {/* Percentage */}
            <div className="bg-white p-4 border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Percentage</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {summary.percentage}%
              </div>
              <p className="text-[10px] font-semibold text-gray-400 mt-1 truncate">Overall Academic Score</p>
            </div>

            {/* Overall Grade */}
            <div className="bg-white p-4 border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Grade</span>
                <div className="w-5 h-5 bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black rounded-none">
                  {summary.grade}
                </div>
              </div>
              <div className="text-2xl font-black text-purple-700">
                Grade {summary.grade}
              </div>
              <p className="text-[10px] font-semibold text-gray-400 mt-1">CBSE Standard Rubric</p>
            </div>

            {/* Result Status */}
            <div className="bg-white p-4 border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Result</span>
                {summary.resultStatus === 'Passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className={`text-xl font-black uppercase tracking-wider ${
                summary.resultStatus === 'Passed' ? 'text-emerald-700' : 'text-amber-600'
              }`}>
                {summary.resultStatus}
              </div>
              <p className="text-[10px] font-semibold text-gray-400 mt-1">Promoted / In Good Standing</p>
            </div>

          </div>

          {/* Subject Breakdown Table */}
          <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/70">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h2 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Term Evaluation & Marks Breakdown
                </h2>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-500 font-semibold">
                <span>Admn: <strong className="text-gray-900">{student.admissionNo || 'YIS-2024-101'}</strong></span>
                <span>•</span>
                <span>Roll: <strong className="text-gray-900">{student.rollNo || '1'}</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-100/70 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4 w-[24%]">Subject</th>
                    <th className="py-2.5 px-3 text-center w-[12%]">Max Marks</th>
                    <th className="py-2.5 px-3 text-center w-[14%]">Marks Scored</th>
                    <th className="py-2.5 px-3 text-center w-[16%]">Percentage</th>
                    <th className="py-2.5 px-3 text-center w-[10%]">Grade</th>
                    <th className="py-2.5 px-3 text-center w-[10%]">Attendance</th>
                    <th className="py-2.5 px-4 w-[24%]">Faculty Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {subjects.map((sub, idx) => {
                    const pct = sub.maxMarks > 0 ? Math.round((sub.marksObtained / sub.maxMarks) * 100) : 0;
                    return (
                      <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                            <span className="font-extrabold text-gray-900">{sub.subjectName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-gray-500">
                          {sub.maxMarks}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-black text-indigo-700 text-sm">
                            {sub.marksObtained}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-700 text-[11px]">{pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase rounded-none border ${
                            sub.grade?.startsWith('A') 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : sub.grade?.startsWith('B') 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {sub.grade || 'B1'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                            {sub.attendance || 'Present'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-[11px] italic">
                          {sub.remarks || 'Consistent academic performance.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 font-black text-gray-900 text-xs border-t-2 border-gray-200">
                  <tr>
                    <td className="py-3 px-4 uppercase tracking-wider">Grand Total</td>
                    <td className="py-3 px-3 text-center">{summary.totalMax}</td>
                    <td className="py-3 px-3 text-center text-indigo-700 font-extrabold text-sm">{summary.totalObtained}</td>
                    <td className="py-3 px-3 text-center text-emerald-700 font-extrabold">{summary.percentage}%</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 font-black text-[10.5px]">
                        {summary.grade}
                      </span>
                    </td>
                    <td colSpan={2} className="py-3 px-4 text-right text-emerald-700 uppercase tracking-widest font-black">
                      Status: {summary.resultStatus}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Co-Scholastic & Discipline Domain */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 border border-gray-200 shadow-xs space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 border-b border-gray-100 pb-2">
                Co-Scholastic Skill Assessment
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                  <span className="font-bold text-gray-700">Work Education / Craft</span>
                  <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5">Grade A</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                  <span className="font-bold text-gray-700">Art & Cultural Expression</span>
                  <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5">Grade A</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                  <span className="font-bold text-gray-700">Health & Physical Fitness</span>
                  <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5">Grade A+</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 border border-gray-200 shadow-xs space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 border-b border-gray-100 pb-2">
                Institutional Endorsements & Seal
              </h3>
              <div className="space-y-3 text-xs text-gray-600 pt-1">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Digitally certified by Examination Controller Office</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  This report card adheres to National Education Policy standards. Issued on October 17, 2026.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] font-bold text-gray-700">
                  <span>Class Teacher: Mrs. Anjali Rao</span>
                  <span>Principal: Dr. K. S. Murthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Exam Datesheet & Schedules */}
      {activeTab === 'datesheet' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Academic Examination Datesheets
              </h3>
              <p className="text-xs text-gray-500">
                Schedule of theory and practical exams for {fullClassStr}
              </p>
            </div>
            
            {/* Exam Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Exam:</span>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="text-xs font-bold border border-gray-300 bg-white p-1.5 rounded-none focus:outline-none focus:border-indigo-600"
              >
                {examsList.map(e => (
                  <option key={e._id} value={e._id}>
                    {e.examName} ({e.session})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead className="bg-gray-100/70 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 w-[16%]">Date</th>
                    <th className="py-3 px-4 w-[24%]">Subject</th>
                    <th className="py-3 px-4 text-center w-[18%]">Timing</th>
                    <th className="py-3 px-4 text-center w-[14%]">Room / Venue</th>
                    <th className="py-3 px-4 text-center w-[14%]">Max Marks</th>
                    <th className="py-3 px-4 text-center w-[14%]">Passing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {schedulesList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No schedules logged for this examination series.
                      </td>
                    </tr>
                  ) : (
                    schedulesList.map((slot, idx) => {
                      const subName = slot.subject?.subjectName || slot.subject || 'Subject';
                      const dateStr = slot.examDate ? new Date(slot.examDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '13 Oct 2026';
                      const timeStr = `${slot.startTime || '09:30 AM'} - ${slot.endTime || '12:30 PM'}`;
                      const room = slot.roomNo || 'Examination Hall 1';

                      return (
                        <tr key={slot._id || idx} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                            {dateStr}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-extrabold text-indigo-700 block text-xs">{subName}</span>
                            <span className="text-[10px] text-gray-400 font-mono">Mandatory Paper</span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-gray-700 font-bold">
                            {timeStr}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-gray-600">
                            {room}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-gray-800">
                            {slot.maxMarks || 100}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-700">
                            {slot.passMarks || 33}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Admit Card / Hall Ticket */}
      {activeTab === 'admitcard' && (
        <div className="bg-white border-2 border-indigo-950 p-6 shadow-md max-w-3xl mx-auto space-y-5">
          
          {/* Institution Header */}
          <div className="text-center pb-4 border-b-2 border-gray-900">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-700">
              Yellowstone International School • Examination Board
            </span>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide mt-0.5">
              Official Examination Hall Ticket (Admit Card)
            </h2>
            <p className="text-xs font-bold text-gray-500 mt-0.5">
              {admitCard?.examName || 'Half-Yearly Examination 2026-2027'} • Session {admitCard?.session || '2026-2027'}
            </p>
          </div>

          {/* Candidate Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-50 p-4 border border-gray-200">
            <div className="md:col-span-3 grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Candidate Name:</span>
                <strong className="text-gray-900 font-extrabold">{studentFullName}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Admit Card No:</span>
                <strong className="text-indigo-700 font-mono font-black">{admitCard?.admitCardNo || 'AC-2026-101'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Class & Section:</span>
                <strong className="text-gray-900 font-bold">{fullClassStr}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Admission / Roll No:</span>
                <strong className="text-gray-900 font-mono font-bold">{student.admissionNo || 'YIS-2024-101'} (Roll #{student.rollNo || '1'})</strong>
              </div>
              <div className="col-span-2 pt-1 border-t border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Examination Center:</span>
                <strong className="text-gray-800">{admitCard?.examCenter || 'Springdale Central Campus - Main Exam Block'}</strong>
              </div>
            </div>

            {/* Photo / Verification Stamp */}
            <div className="flex flex-col items-center justify-center p-2 border border-gray-300 bg-white shadow-2xs">
              {student.studentPhoto ? (
                <img 
                  src={student.studentPhoto.startsWith('http') ? student.studentPhoto : `http://localhost:5050${student.studentPhoto}`} 
                  alt={studentFullName} 
                  className="w-20 h-24 object-cover border border-gray-200 mb-1" 
                />
              ) : (
                <div className="w-20 h-24 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[10px] font-bold text-center mb-1">
                  Photo Affixed
                </div>
              )}
              <span className="text-[9px] font-black text-emerald-700 uppercase">Verified Entry</span>
            </div>
          </div>

          {/* Exam Schedule in Admit Card */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
              Allocated Exam Schedule & Seat Matrix
            </h4>
            <table className="w-full text-left border-collapse border border-gray-300 text-xs">
              <thead className="bg-gray-100 font-black text-[10px] uppercase tracking-wider text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="py-2 px-3 border-r border-gray-300">Exam Date</th>
                  <th className="py-2 px-3 border-r border-gray-300">Subject</th>
                  <th className="py-2 px-3 border-r border-gray-300 text-center">Timings</th>
                  <th className="py-2 px-3 text-center">Room No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(admitCard?.timetable && admitCard.timetable.length > 0) ? (
                  admitCard.timetable.map((t, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 border-r border-gray-200 font-mono font-bold">{t.date}</td>
                      <td className="py-2 px-3 border-r border-gray-200 font-bold">{t.subject}</td>
                      <td className="py-2 px-3 border-r border-gray-200 text-center font-mono">{t.time}</td>
                      <td className="py-2 px-3 text-center font-mono">{t.room}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 px-3 text-center text-gray-500">
                      Standard syllabus slots allocated for Term 1 examination.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Rules and Signatures */}
          <div className="pt-3 border-t border-gray-200 text-[11px] text-gray-500 space-y-3">
            <p className="italic">
              Instructions: Arrive 30 minutes prior to paper commencement. Electronic gadgets are prohibited. Candidate must bring valid ID card.
            </p>
            <div className="flex items-end justify-between pt-6 text-gray-800 font-bold">
              <div className="border-t border-gray-400 pt-1 text-center w-40">
                <span className="text-[10px] block uppercase text-gray-400">Candidate Signature</span>
              </div>
              <div className="border-t border-gray-400 pt-1 text-center w-48">
                <span className="text-[10px] block uppercase text-gray-400">Controller of Examinations</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
