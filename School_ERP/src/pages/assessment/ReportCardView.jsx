import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Printer, ArrowLeft, Download, Award, ShieldCheck, 
  CheckCircle2, FileText, User, AlertCircle
} from 'lucide-react';
import { examService } from '../../api/examService';

export default function ReportCardView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get('studentId');
  const examId = searchParams.get('examId');

  const [marksheetData, setMarksheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentId) {
      fetchMarksheet();
    } else {
      setError('Please provide a valid student identifier.');
      setLoading(false);
    }
  }, [studentId, examId]);

  const fetchMarksheet = async () => {
    try {
      setLoading(true);
      const res = await examService.getMarksheet({ studentId, examId: examId || undefined });
      if (res.success && res.data) {
        setMarksheetData(res.data);
      } else {
        setError('Marksheet records not found.');
      }
    } catch (err) {
      console.error('Failed to load marksheet:', err);
      setError('Failed to fetch marksheet details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Compiling official marksheet...</p>
        </div>
      </div>
    );
  }

  if (error || !marksheetData) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-rose-700">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-rose-500" />
          <h2 className="text-lg font-bold">Marksheet Not Found</h2>
          <p className="text-sm mt-1">{error || 'Unable to generate student report card.'}</p>
          <button
            onClick={() => navigate('/offline-exams/generate-marksheet')}
            className="mt-5 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
          >
            Back to Marksheets
          </button>
        </div>
      </div>
    );
  }

  const { student, summary, subjects } = marksheetData;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate('/offline-exams/generate-marksheet')}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition shadow-sm cursor-pointer flex items-center gap-2 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marksheets
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Official Marksheet
          </button>
        </div>
      </div>

      {/* Official Printable Report Card Document */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-sm space-y-6 print:border-black print:rounded-none print:shadow-none print:p-6">
        
        {/* School Header */}
        <div className="text-center border-b-2 border-slate-800 pb-5">
          <span className="text-xs font-black tracking-widest text-indigo-700 uppercase">
            AFFILIATED TO CENTRAL BOARD OF SECONDARY EDUCATION
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
            ALL CORE SOLUTION
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Campus Road, Institutional Area, City - 110001</p>
          <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-full print:bg-black">
            ANNUAL STUDENT PROGRESS REPORT CARD
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 print:bg-white print:border-black">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Name</span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {student.firstName} {student.lastName || ''}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Section</span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {student.class || 'Class I'} - {student.section || 'A'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Roll Number</span>
            <span className="text-xs font-mono font-bold text-indigo-700 mt-0.5 block">
              {student.rollNo || '1'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Admission / Scholar No</span>
            <span className="text-xs font-mono font-bold text-slate-700 mt-0.5 block">
              {student.admissionNo || student.aparId}
            </span>
          </div>
        </div>

        {/* Scholastic Marks Table */}
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" /> Part 1: Scholastic Performance
          </h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden print:rounded-none print:border-black">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] print:bg-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-black">
                {subjects && subjects.length > 0 ? (
                  subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {sub.subjectName}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-600">
                        {sub.maxMarks || 100}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-indigo-700">
                        {sub.marksObtained}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-black rounded-md text-[11px] border border-indigo-200">
                          {sub.grade || 'A'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                        {sub.remarks || 'Satisfactory progress'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-slate-400">
                      No subjects recorded for this examination yet.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200 print:bg-slate-100 print:border-black">
                <tr>
                  <td className="py-3 px-3 uppercase text-slate-800">Grand Total</td>
                  <td className="py-3 px-3 text-center font-mono">{summary.totalMax}</td>
                  <td className="py-3 px-3 text-center font-mono font-black text-indigo-700 text-sm">
                    {summary.totalObtained}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-1 bg-slate-900 text-white font-black rounded-lg text-xs print:bg-black">
                      {summary.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">
                    {summary.percentage}% — {summary.resultStatus}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Co-Scholastic & Non-Academic Performance */}
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
            Part 2: Co-Scholastic & Behavioral Assessment (3-Point Scale)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs border border-slate-200 rounded-2xl p-4 bg-slate-50 print:bg-white print:border-black">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Art & Craft</span>
              <span className="font-bold text-slate-800 block mt-0.5">A (Outstanding)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Physical Fitness & Sports</span>
              <span className="font-bold text-slate-800 block mt-0.5">A (Very Good)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Discipline & Attendance</span>
              <span className="font-bold text-slate-800 block mt-0.5">A+ (Punctual)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Social Values & Conduct</span>
              <span className="font-bold text-slate-800 block mt-0.5">A (Courteous)</span>
            </div>
          </div>
        </div>

        {/* Evaluation Summary & Signatures */}
        <div className="pt-8 border-t-2 border-slate-800 flex justify-between items-end text-xs text-slate-600 print:pt-12">
          <div className="text-center">
            <div className="w-28 border-b-2 border-slate-400 mb-2"></div>
            <span className="font-bold block text-slate-800">Class Teacher</span>
            <span className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="text-center">
            <div className="w-28 border-b-2 border-slate-400 mb-2"></div>
            <span className="font-bold block text-slate-800">Exam Incharge</span>
            <span className="text-[10px] text-slate-400">Seal & Verification</span>
          </div>

          <div className="text-center">
            <div className="w-28 border-b-2 border-slate-400 mb-2"></div>
            <span className="font-bold block text-slate-800">Principal</span>
            <span className="text-[10px] text-slate-400">ALL CORE SOLUTION</span>
          </div>
        </div>

      </div>
    </div>
  );
}
