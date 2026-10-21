import React, { useState } from 'react';
import { 
  BookOpen, Plus, Lightbulb, FileText, CheckCircle2, ShieldCheck, 
  Scale, PenTool, Sparkles, ChevronDown, ChevronUp, Layers, Award, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';

export default function OSMGuide() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Session Setup & Blueprint',
      role: 'Exam Controller / Admin',
      desc: 'Define class, subject, and evaluation deadline. Set up the question paper with maximum marks and compulsory flags.',
      badge: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      num: '02',
      title: 'Answer Sheet Digitization',
      role: 'Scanning Team',
      desc: 'Scan physical answer sheets at 200–300 DPI into PDF or high-resolution images. Upload them paired with student IDs.',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      num: '03',
      title: 'Digital Grading Studio',
      role: 'Subject Evaluators',
      desc: 'Grade on-screen question-by-question. Stamp checkmarks, cross marks, and remarks directly onto the student paper.',
      badge: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      num: '04',
      title: 'Department Moderation',
      role: 'Head of Department (HOD)',
      desc: 'Inspect flagged borderline passes or sample audits. Compare evaluator marks against standard rubrics and authorize revisions.',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      num: '05',
      title: 'Marks Roster & Report Sync',
      role: 'Academic Administration',
      desc: 'Export CBSE/ICSE-compliant merit scorecards to CSV, print official marks registers, and sync to final report cards with 1 click.',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  const faqs = [
    {
      q: 'What is On-Screen Marking (OSM) and why is it preferred over manual red-pen checking?',
      a: 'On-Screen Marking (OSM) digitizes paper evaluation. Answer scripts are scanned and securely served to evaluators on computer screens. Benefits include zero mathematical totaling errors, anonymous bias prevention, automatic step-by-step audit trails, and instant gradebook aggregation.'
    },
    {
      q: 'How does Anonymous Evaluation protect student privacy?',
      a: 'When Anonymous Evaluation is enabled in session settings, student names and roll numbers are dynamically masked with random barcode IDs (such as #ANON-8812). Evaluators grade scripts strictly based on pedagogical merit without knowing the candidate identity.'
    },
    {
      q: 'What happens when an evaluator flags a paper for moderation?',
      a: 'If an evaluator encounters an ambiguous proof, unusual handwriting, or a borderline pass/fail score, they click "Flag for Moderation". The paper is routed into the Department Moderation Desk where the HOD can review the script and adjust marks with an audit trail.'
    },
    {
      q: 'What file formats and scanner settings are recommended?',
      a: 'Standard multi-page PDF or JPEG/PNG files are supported. For crisp legibility, scan student copies in Grayscale or Color at 200 to 300 DPI, keeping total file sizes under 20MB per booklet.'
    },
    {
      q: 'Can finalized OSM scores be synced directly into student report cards?',
      a: 'Yes! In the OSM Reports tab, clicking "Sync to Report Card" pushes all moderated marks directly into the school examination marks register and report card printing engine.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <OSMNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-purple-100 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Examination Technology Standard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              On-Screen Marking (OSM) Protocol Guide
            </h1>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Eliminate totaling discrepancies, enforce uniform grading standards, speed up paper checking cycles, and generate verifiable audit trails.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/osm-module/sessions/new')}
                className="px-5 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create New Session
              </button>
              <button
                onClick={() => navigate('/osm-module/evaluate')}
                className="px-5 py-2.5 bg-purple-600/70 hover:bg-purple-600 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PenTool className="w-4 h-4" /> Open Grading Studio
              </button>
              <button
                onClick={() => navigate('/osm-module/moderation')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4" /> Moderation Desk
              </button>
            </div>
          </div>

          <div className="absolute right-[-30px] bottom-[-30px] opacity-10 pointer-events-none">
            <Award className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* 5 Lifecycle Steps */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" /> Five-Phase Digital Marking Lifecycle
            </h2>
            <p className="text-xs text-slate-500">From sheet scanning and question rubric configuration through final gradebook sync.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((st, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-slate-300 tracking-wider">
                      {st.num}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${st.badge}`}>
                      {st.role}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{st.desc}</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Best Practice Callout */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Examination Integrity Tip
            </h4>
            <p className="text-xs text-purple-800 leading-relaxed">
              Always enable <strong>Anonymous Marking</strong> for high-stakes term exams and pre-boards. Hiding candidate names and roll numbers ensures objective evaluation and complies with CBSE and ICSE on-screen marking standards.
            </p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" /> Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">Key information on On-Screen Marking workflows and technical specifications.</p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i}
                  className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
