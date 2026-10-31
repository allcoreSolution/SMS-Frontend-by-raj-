import React, { useState, useEffect } from 'react';
import { 
  BookMarked, Calendar, Search, RefreshCw, User, 
  Clock, CheckCircle2, FileText, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { parentService } from '../../api/parentService';

const defaultClasswork = [];

export default function Classwork() {
  const [classworkList, setClassworkList] = useState(defaultClasswork);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const SUBJECTS = ['All', 'Mathematics', 'Science (Biology)', 'Social Science (History)', 'English Literature'];

  const filtered = classworkList.filter(cw => {
    if (selectedSubject !== 'All' && cw.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return cw.topic.toLowerCase().includes(q) || cw.notes.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            Daily Classwork &amp; Diary
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Daily lecture summaries, board notes &amp; classroom teachings
          </p>
        </div>
      </div>

      {/* ── 1. TODAY'S CLASSROOM HERO CARD ── */}
      <div className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl p-5 sm:p-6 text-white shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35)] border border-white/20 relative overflow-hidden">
        <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider">
          Classroom Diary Log
        </span>
        <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight mt-1.5">
          Daily Schedule
        </h2>
        <div className="mt-3 flex items-center gap-3 text-xs text-blue-100 font-medium">
          <span>📅 Today</span>
          <span>•</span>
          <span>✅ Periods Logged</span>
          <span>•</span>
          <span>📝 Homework Assigned</span>
        </div>
      </div>

      {/* ── 2. SEARCH & SUBJECT FILTERS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUBJECTS.map((sub) => {
          const isSelected = selectedSubject === sub;
          return (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* ── 3. CLASSWORK CARDS LIST ── */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200 self-start sm:self-auto">
                {item.subject}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400 self-start sm:self-auto">
                {item.period}
              </span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-black font-serif text-slate-900 leading-snug">
                {item.topic}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Faculty: {item.teacher}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
              <p className="font-bold text-slate-900 mb-0.5">Teacher's Classroom Note:</p>
              <p>{item.notes}</p>
            </div>

            {item.homeworkGiven && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                <span className="font-bold text-amber-700 shrink-0">Homework:</span>
                <span className="font-semibold">{item.homeworkGiven}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
