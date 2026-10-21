import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Calendar, Award, Edit3, Star, MessageSquare, 
  CheckCircle2, ArrowRight, Sparkles, BookOpen, PenTool, LayoutGrid
} from 'lucide-react';
import OfflineExamsLayout from './OfflineExamsLayout';

export default function OfflineExamsGuide() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Exam Master & Types Setup",
      desc: "Configure academic terms (e.g., Half-Yearly, Final Term, Periodic Test 1) and define weightage percentages for terminal report cards.",
      actionText: "Manage Exam Types",
      actionPath: "/offline-exams/types",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      tips: [
        "Create standard exam types matching your board syllabus (CBSE/ICSE/State).",
        "Set passing thresholds and minimum marks required.",
        "Link exams to the active academic session."
      ]
    },
    {
      title: "2. Schedule & Marks Setup",
      desc: "Set timetable dates for each subject, maximum theory/practical marks, and assign invigilator rooms and timings.",
      actionText: "Open Schedule & Marks",
      actionPath: "/offline-exams/schedule-marks",
      icon: Calendar,
      color: "from-purple-500 to-violet-600",
      tips: [
        "Auto-populate subjects configured in Class Academics.",
        "Generate student admit cards / hall tickets with 1 click.",
        "Print datesheet posters for school notice boards."
      ]
    },
    {
      title: "3. Marks Entry & Cocurricular Areas",
      desc: "Streamlined single-screen grid to enter subject marks, student attendance on exam days, and grades for Arts, Physical Education, and Discipline.",
      actionText: "Enter Marks",
      actionPath: "/offline-exams/enter-marks",
      icon: Edit3,
      color: "from-emerald-500 to-teal-600",
      tips: [
        "Instant validation prevents entering marks higher than max marks.",
        "Support for Absent (AB) and Medical Leave (ML) flags.",
        "Grade boundaries auto-calculated based on configured grading scales."
      ]
    },
    {
      title: "4. Report Cards & Teacher Remarks",
      desc: "Generate professional CBSE/ICSE aligned marksheet templates with school logo, principal signature block, QR validation, and teacher remarks.",
      actionText: "Generate Marksheets",
      actionPath: "/offline-exams/generate-marksheet",
      icon: Award,
      color: "from-amber-500 to-orange-600",
      tips: [
        "Add personalized teacher remarks per student.",
        "Bulk PDF download or publish directly to student portal.",
        "Automatic percentile and class rank calculation."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Offline Examinations Guidebook</h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete walkthrough for setting up exams, scheduling datesheets, recording marks, and generating report cards.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/offline-exams/dashboard')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Exams Dashboard
          </button>
          <button 
            onClick={() => navigate('/offline-exams/manage')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Manage Exams
          </button>
        </div>
      </div>

      <div className="p-6 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${sec.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-slate-800">{sec.title}</h2>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{sec.desc}</p>
                  <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Operational Steps
                    </p>
                    <ul className="space-y-1.5">
                      {sec.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(sec.actionPath)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{sec.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
