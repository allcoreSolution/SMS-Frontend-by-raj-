import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, Star, ListChecks, FileSpreadsheet, Activity, Lightbulb, 
  Globe2, Layers, ShieldCheck, CheckCircle2, FileText, Settings, Rocket, 
  ArrowRight, Users, Award, BookOpen, ChevronRight, Sparkles 
} from 'lucide-react';
import CbcHeader from './CbcHeader';
import cbcService from '../../api/cbcService';

const CbcDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await cbcService.getStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load CBC stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const strandsCount = stats?.strandsCount || 14;
  const competenciesCount = stats?.competenciesCount || 7;
  const assessmentsCount = stats?.assessmentsCount || 8;
  const proficiencyRate = stats?.proficiencyRate || 88;

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Unified Header */}
      <CbcHeader activeTab="dashboard" onRefresh={fetchStats} />

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-md p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/10 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Competency-Based Assessment System
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Assess What Students Can Do, Not Just What They Memorize
            </h2>
            <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed mb-6 font-medium">
              Move beyond traditional rote tests. CBC tracks individual learner mastery across learning strands, sub-strands, observable behavior rubrics, and senior secondary pathways.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="bg-white/10 text-white border border-white/15 px-3 py-1 rounded-xl">🇰🇪 Kenya CBC</span>
              <span className="bg-white/10 text-white border border-white/15 px-3 py-1 rounded-xl">🇮🇳 India NEP 2020 CBE</span>
              <span className="bg-white/10 text-white border border-white/15 px-3 py-1 rounded-xl">🇳🇬 Nigeria CBT</span>
              <span className="bg-white/10 text-white border border-white/15 px-3 py-1 rounded-xl">🇿🇦 South Africa CAPS</span>
              <span className="bg-white/10 text-white border border-white/15 px-3 py-1 rounded-xl">🇬🇭 Ghana SBA</span>
              <span className="bg-white/10 text-white border border-white/15 px-3 py-1 rounded-xl">🇷🇼 Rwanda CBC</span>
            </div>
          </div>
        </div>

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" /> Strands Defined
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-850 mt-1">{strandsCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Across core subjects</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-teal-500" /> Core Competencies
            </span>
            <div className="text-2xl sm:text-3xl font-black text-teal-600 mt-1">{competenciesCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">21st-century skill domains</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-amber-500" /> Planned Assessments
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{assessmentsCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Formative & Summative</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-500" /> Proficiency Rate
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{proficiencyRate}%</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Meeting / Exceeding levels</p>
          </div>
        </div>

        {/* 4-Level Performance Rubric Explanation Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Standard 4-Level Competency Rubric
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                CBC replaces arbitrary percentages with standardized behavioral mastery levels:
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 self-start">
              Criterion-Referenced Scale
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-800">Level 4: Exceeding</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800">EE</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-snug">
                Demonstrates mastery independently, applies concept innovatively in novel scenarios.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-800">Level 3: Meeting</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-200 text-blue-800">ME</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-snug">
                Demonstrates the required competency accurately according to expected grade benchmark.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800">Level 2: Approaching</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800">AE</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-snug">
                Demonstrates competency with occasional support or prompting from teacher.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-800">Level 1: Below</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-rose-200 text-rose-800">BE</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-snug">
                Requires constant guidance, remedial coaching, and intensive practice.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Step Setup Workflow Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600" /> CBC Workflow & Implementation
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Follow these stages to configure your school's curriculum & assess learners</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Step 1 */}
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="text-[10px] font-black text-blue-500 mb-2 tracking-wider">STEP 1</div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-850 mb-1">Strands & Outcomes</h4>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                    Map subjects into broad Strands and granular Sub-strands with target learning outcomes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/cbc/strands-outcomes')}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  Setup Strands <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 bg-white hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="text-[10px] font-black text-teal-500 mb-2 tracking-wider">STEP 2</div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition">
                    <Star className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-850 mb-1">Core Competencies</h4>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                    Define cross-cutting abilities like Critical Thinking, Digital Literacy & Collaboration.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/cbc/core-competencies')}
                  className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  Manage Competencies <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="text-[10px] font-black text-amber-500 mb-2 tracking-wider">STEP 3</div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-850 mb-1">Grade Assessments</h4>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                    Record formative tasks, observations & grade learners using interactive 4-level rubrics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/cbc/assessments')}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  Grade Assessments <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="text-[10px] font-black text-emerald-500 mb-2 tracking-wider">STEP 4</div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-850 mb-1">Generate Reports</h4>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                    Print parent-friendly Competency Portfolios & comprehensive learner report cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/cbc/reports')}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  Generate Reports <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Senior Secondary Pathways Strip */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Senior School Pathways & Specialized Tracks (Grade 10 - 12)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Allocate students to STEM, Arts & Sports Science, or Social Sciences pathways.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/cbc/pathways-tracks')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0"
              >
                Configure Pathways <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CbcDashboard;
