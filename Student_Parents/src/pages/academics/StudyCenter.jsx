import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Download, Eye, FileText, 
  RefreshCw, Layers, CheckCircle2, X, Sparkles, Filter 
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const defaultResourcesEn = [
  {
    id: 'res-1',
    title: 'Class 10 Mathematics Complete Formula Book & Theorems',
    subject: 'Mathematics',
    type: 'Formula Sheet',
    size: '3.4 MB',
    author: 'Mr. Sharma (HOD Math)',
    date: '18 Aug 2026',
    downloads: 142
  },
  {
    id: 'res-2',
    title: 'NCERT Science Chapter 6 — Life Processes Comprehensive Notes',
    subject: 'Science',
    type: 'Lecture Notes',
    size: '5.1 MB',
    author: 'Mr. Verma (Science Dept)',
    date: '15 Aug 2026',
    downloads: 98
  },
  {
    id: 'res-3',
    title: 'CBSE Social Science Map Work & History Timeline Compendium',
    subject: 'Social Science',
    type: 'Study Guide',
    size: '4.2 MB',
    author: 'Mr. Gupta',
    date: '10 Aug 2026',
    downloads: 85
  },
  {
    id: 'res-4',
    title: 'English Communicative Formal Letter Writing & Grammar Guide',
    subject: 'English',
    type: 'Reference Guide',
    size: '2.1 MB',
    author: 'Mrs. Johnson',
    date: '05 Aug 2026',
    downloads: 110
  },
  {
    id: 'res-5',
    title: 'Computer Science Python Programming Lab Exercises & Solutions',
    subject: 'Computer Science',
    type: 'Lab Manual',
    size: '6.8 MB',
    author: 'Mr. Das',
    date: '02 Aug 2026',
    downloads: 165
  }
];

const defaultResourcesHi = [
  {
    id: 'res-1',
    title: 'कक्षा 10 गणित सम्पूर्ण सूत्र पुस्तिका एवं प्रमेय संग्रह',
    subject: 'Mathematics',
    type: 'सूत्र पुस्तिका (Formula Sheet)',
    size: '3.4 MB',
    author: 'श्री शर्मा (विभागाध्यक्ष गणित)',
    date: '18 अग 2026',
    downloads: 142
  },
  {
    id: 'res-2',
    title: 'एनसीईआरटी विज्ञान अध्याय 6 — जैव प्रक्रम सम्पूर्ण हस्तलिखित नोट्स',
    subject: 'Science',
    type: 'कक्षा नोट्स (Lecture Notes)',
    size: '5.1 MB',
    author: 'श्री वर्मा (विज्ञान विभाग)',
    date: '15 अग 2026',
    downloads: 98
  },
  {
    id: 'res-3',
    title: 'सीबीएसई सामाजिक विज्ञान मानचित्र कार्य एवं ऐतिहासिक समयरेखा',
    subject: 'Social Science',
    type: 'गाइड (Study Guide)',
    size: '4.2 MB',
    author: 'श्री गुप्ता',
    date: '10 अग 2026',
    downloads: 85
  },
  {
    id: 'res-4',
    title: 'अंग्रेजी औपचारिक पत्र लेखन एवं व्याकरण अध्ययन संदर्शिका',
    subject: 'English',
    type: 'संदर्भ गाइड (Reference Guide)',
    size: '2.1 MB',
    author: 'श्रीमती जॉनसन',
    date: '05 अग 2026',
    downloads: 110
  },
  {
    id: 'res-5',
    title: 'कंप्यूटर विज्ञान पायथन प्रोग्रामिंग व्यावहारिक अभ्यास एवं समाधान',
    subject: 'Computer Science',
    type: 'प्रयोगशाला नियमावली (Lab Manual)',
    size: '6.8 MB',
    author: 'श्री दास',
    date: '02 अग 2026',
    downloads: 165
  }
];

export default function StudyCenter() {
  const { currentLang } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState(currentLang === 'hi' ? defaultResourcesHi : defaultResourcesEn);
  const [activePreview, setActivePreview] = useState(null);

  useEffect(() => {
    setResources(currentLang === 'hi' ? defaultResourcesHi : defaultResourcesEn);
  }, [currentLang]);

  const SUBJECTS = [
    { key: 'All', label: currentLang === 'hi' ? 'सभी विषय' : 'All' },
    { key: 'Mathematics', label: currentLang === 'hi' ? 'गणित' : 'Mathematics' },
    { key: 'Science', label: currentLang === 'hi' ? 'विज्ञान' : 'Science' },
    { key: 'Social Science', label: currentLang === 'hi' ? 'सामाजिक विज्ञान' : 'Social Science' },
    { key: 'English', label: currentLang === 'hi' ? 'अंग्रेजी' : 'English' },
    { key: 'Computer Science', label: currentLang === 'hi' ? 'कंप्यूटर विज्ञान' : 'Computer Science' }
  ];

  const filtered = resources.filter(res => {
    if (selectedSubject !== 'All' && res.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return res.title.toLowerCase().includes(q) || res.author.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            {currentLang === 'hi' ? 'अध्ययन केंद्र एवं नोट्स' : 'Study Center & Notes'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {currentLang === 'hi' 
              ? 'प्रमाणित पाठ्यक्रम, शिक्षकों के नोट्स एवं पीडीएफ गाइड डाउनलोड करें' 
              : 'Download verified syllabus, faculty lecture notes & PDF guides'}
          </p>
        </div>
      </div>

      {/* ── 1. STUDY CENTER ROYAL BLUE HERO CARD ── */}
      <div className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl p-5 sm:p-6 text-white shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35)] border border-white/20 relative overflow-hidden">
        <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider">
          {currentLang === 'hi' ? 'डिजिटल शैक्षणिक भंडार' : 'Digital Academic Repository'}
        </span>
        <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight mt-1.5">
          {currentLang === 'hi' ? 'कक्षा 10 पाठ्यक्रम एवं अध्ययन सामग्री' : 'Class 10 Syllabus & Study Resources'}
        </h2>
        <div className="mt-3 flex items-center gap-3 text-xs text-blue-100 font-medium">
          <span>📚 {currentLang === 'hi' ? '6 प्रमुख विषय' : '6 Core Subjects'}</span>
          <span>•</span>
          <span>📑 {currentLang === 'hi' ? '25+ प्रमाणित दस्तावेज' : '25+ Verified Documents'}</span>
          <span>•</span>
          <span>📥 {currentLang === 'hi' ? 'निःशुल्क असीमित डाउनलोड' : 'Free Unlimited Downloads'}</span>
        </div>
      </div>

      {/* ── 2. SEARCH BAR ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={currentLang === 'hi' ? 'नोट्स, अध्याय, सूत्र, शिक्षक के नाम से खोजें...' : 'Search notes, chapters, formulas, teachers...'}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
        />
      </div>

      {/* ── 3. SUBJECT FILTER CHIPS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUBJECTS.map((sub) => {
          const isSelected = selectedSubject === sub.key;
          return (
            <button
              key={sub.key}
              onClick={() => setSelectedSubject(sub.key)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* ── 4. RESOURCES CARDS ── */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-blue-300 group"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                  {currentLang === 'hi' 
                    ? (item.subject === 'Mathematics' ? 'गणित' : item.subject === 'Science' ? 'विज्ञान' : item.subject === 'Social Science' ? 'सामाजिक विज्ञान' : item.subject === 'English' ? 'अंग्रेजी' : item.subject === 'Computer Science' ? 'कंप्यूटर' : item.subject) 
                    : item.subject}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {item.type}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.size}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black font-serif text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                <span>{currentLang === 'hi' ? 'द्वारा: ' : 'By '}{item.author}</span>
                <span>•</span>
                <span>{currentLang === 'hi' ? 'अपडेट: ' : 'Updated: '}{item.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto w-full sm:w-auto">
              <button
                onClick={() => setActivePreview(item)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'पूर्वावलोकन' : 'Preview'}</span>
              </button>
              <button
                onClick={() => alert(currentLang === 'hi' ? `डाउनलोड प्रारंभ: ${item.title} (${item.size})...` : `Starting download of ${item.title} (${item.size})...`)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'पीडीएफ डाउनलोड' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── PREVIEW MODAL ── */}
      {activePreview && (
        <div 
          onClick={() => setActivePreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-blue-200 uppercase font-bold">{activePreview.subject}</p>
                <h3 className="text-base font-black font-serif truncate max-w-xs">{activePreview.title}</h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 font-serif">{activePreview.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {currentLang === 'hi' ? 'प्रस्तुतकर्ता:' : 'Prepared by:'} {activePreview.author} • {currentLang === 'hi' ? 'फाइल आकार:' : 'File Size:'} {activePreview.size}
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {currentLang === 'hi' 
                  ? 'इस दस्तावेज में बोर्ड परीक्षा की तैयारी हेतु पूर्ण अध्याय सारांश, एनसीईआरटी पाठ्यपुस्तक समाधान, मॉडल प्रश्न पत्र एवं त्वरित पुनरावृत्ति फ्लैशकार्ड शामिल हैं।' 
                  : 'This document contains complete chapter summaries, NCERT textbook solutions, model questions, and revision flashcards for board exam preparation.'}
              </p>
              <button
                onClick={() => {
                  alert(currentLang === 'hi' ? `डाउनलोड हो रहा है: ${activePreview.title}...` : `Downloading ${activePreview.title}...`);
                  setActivePreview(null);
                }}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'डिवाइस में सहेजें (Save PDF)' : 'Save to Device'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
