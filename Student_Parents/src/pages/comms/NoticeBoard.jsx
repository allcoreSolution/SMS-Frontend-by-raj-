import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Clock, Calendar, Search, RefreshCw, 
  X, Download, ChevronRight, FileText, Share2, AlertCircle
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const defaultNoticesEn = [
  {
    id: 'n1',
    title: 'Mid-Term Examination Date Sheet Released! Click to view.',
    category: 'Examinations',
    priority: 'Urgent',
    date: '24 Aug 2026',
    publisher: 'Office of the Controller of Examinations',
    body: 'The comprehensive examination schedule for Mid-Term Exams commencing 10th September 2026 has been finalized. All students must report to their assigned examination rooms by 08:30 AM in full school uniform with ID cards.',
    attachment: 'Mid_Term_DateSheet_2026.pdf'
  },
  {
    id: 'n2',
    title: 'Inter-School Science & Technology Fair 2026',
    category: 'Events',
    priority: 'Important',
    date: '20 Aug 2026',
    publisher: 'Department of Science & Innovation',
    body: 'Students of classes 8th to 12th are invited to submit their science project abstracts for the upcoming State Level Innovation Expo. Registration closes on 30th August.',
    attachment: 'Science_Fair_Guidelines.pdf'
  },
  {
    id: 'n3',
    title: 'Independence Day Celebrations & Flag Hoisting Protocol',
    category: 'Holidays',
    priority: 'General',
    date: '12 Aug 2026',
    publisher: 'Principal Dr. Anita Saxena',
    body: 'Students, staff, and parents are cordially invited to celebrate the 80th Independence Day on the campus grounds. Reporting time is 07:45 AM.',
    attachment: null
  },
  {
    id: 'n4',
    title: 'Parent-Teacher Meeting (PTM) Schedule for Term 1',
    category: 'Academics',
    priority: 'Important',
    date: '05 Aug 2026',
    publisher: 'Academic Dean',
    body: 'Parent-Teacher interaction slots have been uploaded. Parents can book 1-on-1 counseling slots with class teachers through the student portal.',
    attachment: 'PTM_TimeSlots.pdf'
  }
];

const defaultNoticesHi = [
  {
    id: 'n1',
    title: 'सत्र-मध्य परीक्षा समय सारणी (डेट शीट) जारी! देखने के लिए क्लिक करें।',
    category: 'Examinations',
    priority: 'Urgent',
    date: '24 अग 2026',
    publisher: 'परीक्षा नियंत्रक कार्यालय',
    body: '10 सितंबर 2026 से प्रारंभ होने वाली अर्धवार्षिक परीक्षाओं की समय सारणी घोषित कर दी गई है। सभी विद्यार्थियों को प्रातः 08:30 बजे तक पूर्ण स्कूल ड्रेस एवं पहचान पत्र के साथ परीक्षा कक्ष में उपस्थित होना अनिवार्य है।',
    attachment: 'Mid_Term_DateSheet_2026.pdf'
  },
  {
    id: 'n2',
    title: 'अन्तर-विद्यालय विज्ञान एवं प्रौद्योगिकी मेला 2026',
    category: 'Events',
    priority: 'Important',
    date: '20 अग 2026',
    publisher: 'विज्ञान एवं नवाचार विभाग',
    body: 'कक्षा 8वीं से 12वीं तक के छात्रों को राज्य स्तरीय नवाचार प्रदर्शनी हेतु विज्ञान प्रोजेक्ट का विवरण जमा करने के लिए आमंत्रित किया जाता है। पंजीकरण 30 अगस्त को बंद होगा।',
    attachment: 'Science_Fair_Guidelines.pdf'
  },
  {
    id: 'n3',
    title: 'स्वतंत्रता दिवस समारोह एवं ध्वजारोहण कार्यक्रम',
    category: 'Holidays',
    priority: 'General',
    date: '12 अग 2026',
    publisher: 'प्राचार्या डॉ. अनिता सक्सेना',
    body: 'सभी विद्यार्थियों, अभिभावकों एवं शिक्षकों को 80वें स्वतंत्रता दिवस के पावन अवसर पर स्कूल परिसर में आमंत्रित किया जाता है। उपस्थिति का समय प्रातः 07:45 बजे है।',
    attachment: null
  },
  {
    id: 'n4',
    title: 'प्रथम सत्र हेतु अभिभावक-शिक्षक बैठक (PTM) समय सारणी',
    category: 'Academics',
    priority: 'Important',
    date: '05 अग 2026',
    publisher: 'शैक्षणिक अधिष्ठाता (डीन)',
    body: 'कक्षाध्यापक के साथ विचार-विमर्श हेतु स्लॉट पोर्टल पर उपलब्ध हैं। अभिभावक छात्र पोर्टल के माध्यम से 1-on-1 संवाद समय आरक्षित कर सकते हैं।',
    attachment: 'PTM_TimeSlots.pdf'
  }
];

export default function NoticeBoard() {
  const { currentLang } = useLanguage();
  const [notices, setNotices] = useState(currentLang === 'hi' ? defaultNoticesHi : defaultNoticesEn);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

  const CATEGORIES = [
    { key: 'All', label: currentLang === 'hi' ? 'सभी' : 'All' },
    { key: 'Examinations', label: currentLang === 'hi' ? 'परीक्षाएं' : 'Examinations' },
    { key: 'Academics', label: currentLang === 'hi' ? 'शैक्षणिक' : 'Academics' },
    { key: 'Events', label: currentLang === 'hi' ? 'कार्यक्रम' : 'Events' },
    { key: 'Holidays', label: currentLang === 'hi' ? 'अवकाश' : 'Holidays' }
  ];

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await parentService.getNotices();
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setNotices(res.data.map(item => ({
          id: item._id || item.id,
          title: item.title,
          category: item.category || 'General',
          priority: item.priority || 'General',
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString(currentLang === 'hi' ? 'hi-IN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '24 Aug 2026',
          publisher: item.postedBy || (currentLang === 'hi' ? 'स्कूल प्रशासन' : 'School Administration'),
          body: item.content || item.body || item.description,
          attachment: item.attachment || null
        })));
      } else {
        setNotices(currentLang === 'hi' ? defaultNoticesHi : defaultNoticesEn);
      }
    } catch (err) {
      console.warn('Notice fetch:', err);
      setNotices(currentLang === 'hi' ? defaultNoticesHi : defaultNoticesEn);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentLang]);

  const filteredNotices = notices.filter(n => {
    if (selectedCategory !== 'All' && n.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner shrink-0">
              <Megaphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {currentLang === 'hi' ? 'सूचना पट्ट एवं बुलेटिन' : 'Notice Board & Bulletins'}
                </h1>
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {currentLang === 'hi' ? 'आधिकारिक परिपत्र' : 'Official Advisories'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">
                {currentLang === 'hi' 
                  ? 'आधिकारिक घोषणाएं, परिपत्र, कार्यक्रम एवं शैक्षणिक सूचनाएं' 
                  : 'Official announcements, circulars, schedules & academic advisories'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchNotices}
            disabled={loading}
            className="p-2.5 bg-white/15 hover:bg-white/25 text-white transition-all rounded-2xl border border-white/25 backdrop-blur-md cursor-pointer shrink-0 shadow-sm"
            title={currentLang === 'hi' ? 'सूचनाएं ताज़ा करें' : 'Refresh Bulletins'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={currentLang === 'hi' ? 'परिपत्र, परीक्षा, समय सारणी खोजें...' : 'Search circulars, exams, schedules...'}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
        />
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── NOTICES LIST ── */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">
              {currentLang === 'hi' ? 'आपकी खोज से मेल खाती कोई सूचना नहीं मिली' : 'No circulars match your search'}
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isUrgent = notice.priority === 'Urgent';
            const isImportant = notice.priority === 'Important';

            return (
              <div
                key={notice.id}
                onClick={() => setActiveNoticeModal(notice)}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-start gap-3.5 cursor-pointer hover:border-blue-300 transition-all group"
              >
                {/* Megaphone icon squircle */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isUrgent 
                    ? 'bg-red-50 text-red-500 border-red-200' 
                    : isImportant
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-blue-50 text-[#2563EB] border-blue-200'
                }`}>
                  <Megaphone className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md">
                      {currentLang === 'hi' 
                        ? (notice.category === 'Examinations' ? 'परीक्षाएं' : notice.category === 'Academics' ? 'शैक्षणिक' : notice.category === 'Events' ? 'कार्यक्रम' : notice.category === 'Holidays' ? 'अवकाश' : notice.category) 
                        : notice.category}
                    </span>
                    {isUrgent && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                        {currentLang === 'hi' ? 'अति आवश्यक ⚠️' : 'Urgent ⚠️'}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium">
                      {notice.date}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                    {notice.body}
                  </p>

                  <p className="text-[10.5px] text-slate-400 font-medium mt-1.5">
                    {currentLang === 'hi' ? 'जारीकर्ता: ' : 'Published by: '}{notice.publisher}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 mt-3" />
              </div>
            );
          })
        )}
      </div>

      {/* ── NOTICE DETAIL MODAL ── */}
      {activeNoticeModal && (
        <div 
          onClick={() => setActiveNoticeModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  {currentLang === 'hi' 
                    ? `${activeNoticeModal.category === 'Examinations' ? 'परीक्षा' : activeNoticeModal.category === 'Academics' ? 'शैक्षणिक' : activeNoticeModal.category === 'Events' ? 'कार्यक्रम' : activeNoticeModal.category === 'Holidays' ? 'अवकाश' : activeNoticeModal.category} परिपत्र` 
                    : `${activeNoticeModal.category} Circular`}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif leading-tight">
                  {currentLang === 'hi' ? 'आधिकारिक स्कूल सूचना' : 'Official School Notice'}
                </h3>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="text-base font-black text-slate-900 font-serif leading-snug">
                  {activeNoticeModal.title}
                </h4>
                <div className="flex items-center gap-3 text-slate-400 font-medium text-[11px] mt-1">
                  <span>📅 {activeNoticeModal.date}</span>
                  <span>•</span>
                  <span>{currentLang === 'hi' ? 'जारीकर्ता: ' : 'Issued by: '}{activeNoticeModal.publisher}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 leading-relaxed text-slate-700 font-medium">
                {activeNoticeModal.body}
              </div>

              {activeNoticeModal.attachment && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-bold text-[#1E3A8A] truncate max-w-[220px]">
                      {activeNoticeModal.attachment}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(currentLang === 'hi' ? `संलग्न फाइल डाउनलोड हो रही है: ${activeNoticeModal.attachment}` : `Downloading attachment: ${activeNoticeModal.attachment}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-[#2563EB] text-white font-bold rounded-lg cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{currentLang === 'hi' ? 'डाउनलोड करें' : 'Download'}</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setActiveNoticeModal(null)}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {currentLang === 'hi' ? 'सूचना बंद करें' : 'Close Notice'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
