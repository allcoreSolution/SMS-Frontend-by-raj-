import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, Printer, Download, User, Award, CheckCircle, 
  Star, ShieldCheck, BookOpen, Layers, Filter, Sparkles, AlertCircle 
} from 'lucide-react';
import CbcHeader from './CbcHeader';

const SAMPLE_STUDENTS = [];

const CbcReports = () => {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const student = SAMPLE_STUDENTS.find(s => s.id === selectedStudentId) || SAMPLE_STUDENTS[0];

  const handlePrint = () => {
    window.print();
  };

  const getRatingBadge = (rating) => {
    switch (rating) {
      case 4:
        return <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Level 4: EE (Exceeding)</span>;
      case 3:
        return <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Level 3: ME (Meeting)</span>;
      case 2:
        return <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Level 2: AE (Approaching)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Level 1: BE (Below)</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header (Hidden during print) */}
      <div className="print:hidden">
        <CbcHeader activeTab="reports" />
      </div>

      <div className="p-6 sm:p-8 w-full max-w-5xl mx-auto flex flex-col gap-6">
        
        {SAMPLE_STUDENTS.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No CBC Learner Reports Available</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Once CBC assessments and rubric ratings are recorded for students, their official competency portfolios and report cards will be viewable and printable here.
            </p>
          </div>
        ) : (
          <>
            {/* Selector & Print Controls Toolbar (Hidden during print) */}
            <div className="print:hidden bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">Select Learner:</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {SAMPLE_STUDENTS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Roll No: {s.rollNo} · {s.classGrade} - {s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Official Report Card
                </button>
              </div>
            </div>

            {/* OFFICIAL CBC REPORT CARD DOCUMENT (Print Ready) */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 text-slate-850">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-emerald-600 pb-6 mb-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                SE
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  Springdale International Academy
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Ministry of Education Accreditation &bull; Competency-Based Education Center
                </p>
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mt-1">
                  Official Learner Competency Assessment Report
                </div>
              </div>
            </div>

            <div className="sm:text-right text-xs space-y-0.5">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-xs">
                CBC Assessment Portfolio
              </span>
              <p className="text-slate-500 font-bold text-[11px] pt-1">Academic Year: {student.year} · {student.term}</p>
            </div>
          </div>

          {/* Learner Bio Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 mb-8 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Learner Name</span>
              <strong className="text-slate-900 text-sm">{student.name}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">UPI / Learner ID</span>
              <strong className="text-slate-900">{student.upiId}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Class / Section</span>
              <strong className="text-slate-900">{student.classGrade} - {student.section} (Roll: {student.rollNo})</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Term Attendance</span>
              <strong className="text-emerald-700">{student.attendance} Present</strong>
            </div>
          </div>

          {/* Section 1: Subject Strands & Learning Outcomes */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2 border-b border-emerald-100 pb-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              1. Subject Learning Strands & Outcomes Mastery
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Subject / Strand</th>
                    <th className="py-2.5 px-3">Learning Outcome Assessed</th>
                    <th className="py-2.5 px-3">Performance Level</th>
                    <th className="py-2.5 px-3">Teacher Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.outcomes.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{item.subject}</strong>
                        <span className="text-[11px] text-slate-500">{item.strand}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium max-w-xs">
                        {item.outcome}
                      </td>
                      <td className="py-3 px-3">
                        {getRatingBadge(item.rating)}
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px] italic">
                        "{item.remarks}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: 7 Core Competencies Matrix */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2 border-b border-emerald-100 pb-1.5">
              <Star className="w-4 h-4 text-emerald-600" />
              2. Core 21st-Century Competencies Holistic Evaluation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(student.competencies).map(([compName, rating], idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-bold text-slate-800">{compName}</span>
                  <div>{getRatingBadge(rating)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Values & Character Observations */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2 border-b border-emerald-100 pb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Values, Conduct & Co-Curricular Engagement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(student.values).map(([val, desc], idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{val}</span>
                  <strong className="text-slate-800">{desc}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Teacher & Principal Signatures */}
          <div className="pt-6 border-t-2 border-slate-200 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Class Teacher Remarks</span>
                <p className="text-slate-700 italic font-medium">"{student.teacherRemarks}"</p>
                <div className="pt-8 flex justify-between items-center text-[11px] text-slate-400 font-bold border-b border-dashed border-slate-300">
                  <span>Mrs. Caroline Mwangi</span>
                  <span>Signature & Date</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Head of School / Principal Remarks</span>
                <p className="text-slate-700 italic font-medium">"{student.principalRemarks}"</p>
                <div className="pt-8 flex justify-between items-center text-[11px] text-slate-400 font-bold border-b border-dashed border-slate-300">
                  <span>Dr. Anthony Kiprop, Ph.D.</span>
                  <span>Official School Seal</span>
                </div>
              </div>
            </div>
          </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CbcReports;
