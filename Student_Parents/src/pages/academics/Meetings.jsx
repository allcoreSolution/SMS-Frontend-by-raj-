import React, { useState, useEffect } from 'react';
import { 
  Handshake, Calendar, Clock, MapPin, Video, User, 
  CheckCircle2, AlertCircle, RefreshCw, Printer, Plus, 
  X, ExternalLink, ShieldCheck, Tag, FileText, ChevronRight 
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const defaultMeetingsEn = [
  {
    id: 'm1',
    teacher: 'Mrs. Anjali Rao (Class Teacher)',
    subject: 'Overall Academic Progress & Attendance Review',
    date: '30 Aug 2026',
    time: '11:00 AM – 11:30 AM',
    mode: 'In person',
    location: 'Conference Room B, Academic Block',
    status: 'Confirmed',
    agenda: 'Discussion on midterm exam preparation, science project submissions, and student leadership roles.',
    feedback: null
  },
  {
    id: 'm2',
    teacher: 'Mr. Verma (Science Faculty)',
    subject: 'Physics Practical Lab Performance',
    date: '15 Aug 2026',
    time: '02:00 PM – 02:20 PM',
    mode: 'Video Call (Zoom)',
    location: 'Online Meeting ID: 849-231-901',
    status: 'Completed',
    agenda: 'Quarterly review of laboratory observations and scientific diagrams.',
    feedback: 'Student shows great enthusiasm and accurate observation techniques. Recommended to continue practicing equations.'
  }
];

const defaultMeetingsHi = [
  {
    id: 'm1',
    teacher: 'श्रीमती अंजलि राव (कक्षाध्यापिका)',
    subject: 'समग्र शैक्षणिक प्रगति एवं उपस्थिति समीक्षा',
    date: '30 अग 2026',
    time: 'प्रातः 11:00 – पूर्वाह्न 11:30',
    mode: 'प्रत्यक्ष (स्कूल परिसर)',
    location: 'सम्मेलन कक्ष बी, शैक्षणिक ब्लॉक',
    status: 'Confirmed',
    agenda: 'सत्र-मध्य परीक्षा तैयारी, विज्ञान प्रोजेक्ट प्रस्तुति एवं नेतृत्व कौशल पर चर्चा।',
    feedback: null
  },
  {
    id: 'm2',
    teacher: 'श्री वर्मा (विज्ञान प्राध्यापक)',
    subject: 'भौतिकी प्रयोगशाला प्रायोगिक प्रदर्शन',
    date: '15 अग 2026',
    time: 'दोपहर 02:00 – 02:20',
    mode: 'वीडियो कॉल (ज़ूम)',
    location: 'ऑनलाइन बैठक आईडी: 849-231-901',
    status: 'Completed',
    agenda: 'प्रयोगशाला प्रेक्षणों एवं वैज्ञानिक आरेखों की त्रैमासिक समीक्षा।',
    feedback: 'विद्यार्थी ने प्रयोगशाला में उत्कृष्ट उत्साह और सटीक प्रेक्षण प्रस्तुत किए। समीकरणों का निरंतर अभ्यास करने की सलाह दी जाती है।'
  }
];

export default function Meetings({ activeChild }) {
  const { currentLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState(currentLang === 'hi' ? defaultMeetingsHi : defaultMeetingsEn);
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Form
  const [agenda, setAgenda] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-09-05');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [preferredMode, setPreferredMode] = useState(currentLang === 'hi' ? 'प्रत्यक्ष (स्कूल परिसर)' : 'In person');
  const [teacherSelected, setTeacherSelected] = useState(currentLang === 'hi' ? 'कक्षाध्यापिका (श्रीमती अंजलि राव)' : 'Class Teacher (Mrs. Anjali Rao)');

  useEffect(() => {
    setMeetings(currentLang === 'hi' ? defaultMeetingsHi : defaultMeetingsEn);
  }, [currentLang]);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const newM = {
        id: `m-${Date.now()}`,
        teacher: teacherSelected,
        subject: agenda || (currentLang === 'hi' ? 'अभिभावक-शिक्षक परामर्श' : 'Parent-Teacher Consultation'),
        date: preferredDate,
        time: preferredTime,
        mode: preferredMode,
        location: preferredMode.includes('In person') || preferredMode.includes('प्रत्यक्ष') ? (currentLang === 'hi' ? 'कक्ष 102' : 'Room 102') : (currentLang === 'hi' ? 'ज़ूम वीडियो लिंक भेजा जाएगा' : 'Zoom Video Link will be sent'),
        status: 'Requested',
        agenda: agenda,
        feedback: null
      };
      setMeetings(prev => [newM, ...prev]);
      setSubmitting(false);
      setShowRequestModal(false);
      setSuccessToast(currentLang === 'hi' ? 'बैठक का अनुरोध सफलतापूर्वक भेजा गया! शिक्षक समय की पुष्टि करेंगे।' : 'PTM meeting requested successfully! Teacher will confirm time slot.');
      setTimeout(() => setSuccessToast(''), 4500);
    }, 800);
  };

  const filtered = meetings.filter(m => {
    if (selectedTab === 'Upcoming') return m.status === 'Confirmed' || m.status === 'Requested';
    if (selectedTab === 'Completed') return m.status === 'Completed';
    return true;
  });

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#10B981] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            {currentLang === 'hi' ? 'अभिभावक-शिक्षक बैठक (PTM)' : 'Parent-Teacher Meetings (PTM)'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {currentLang === 'hi' 
              ? 'परामर्श समय निर्धारित करें एवं शिक्षक टिप्पणियों की समीक्षा करें' 
              : 'Schedule consultations & review teacher discussions'}
          </p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="self-start sm:self-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{currentLang === 'hi' ? 'बैठक अनुरोध करें' : 'Request PTM'}</span>
        </button>
      </div>

      {/* ── 1. NEXT MEETING ROYAL BLUE HERO CARD ── */}
      <div className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl p-5 text-white shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35)] border border-white/20 relative overflow-hidden">
        <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider">
          {currentLang === 'hi' ? 'आगामी निर्धारित बैठक' : 'Next Scheduled PTM'}
        </span>
        <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight mt-1.5">
          {currentLang === 'hi' ? 'श्रीमती अंजलि राव के साथ शैक्षणिक परामर्श' : 'Academic Consultation with Mrs. Anjali Rao'}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-blue-100 font-medium">
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5" /> {currentLang === 'hi' ? '30 अग 2026' : '30 Aug 2026'}
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'प्रातः 11:00 – 11:30' : '11:00 AM – 11:30 AM'}
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <MapPin className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'सम्मेलन कक्ष B' : 'Conference Room B'}
          </span>
        </div>
      </div>

      {/* ── 2. SEGMENTED TABS ── */}
      <div className="bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-1 overflow-x-auto scrollbar-none">
        {[
          { key: 'Upcoming', label: currentLang === 'hi' ? 'आगामी बैठकें' : 'Upcoming Meetings' },
          { key: 'Completed', label: currentLang === 'hi' ? 'संपन्न बैठकें' : 'Completed Meetings' }
        ].map((tab) => {
          const isSelected = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── 3. MEETINGS LIST ── */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                  {item.mode}
                </span>
                <h3 className="text-base font-black font-serif text-slate-900 mt-1">
                  {item.teacher}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  {currentLang === 'hi' ? 'विषय:' : 'Agenda:'} {item.subject}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto shrink-0 ${
                  item.status === 'Confirmed'
                    ? 'bg-emerald-50 text-[#10B981] border-emerald-200'
                    : item.status === 'Requested'
                    ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {currentLang === 'hi' 
                  ? (item.status === 'Confirmed' ? 'पुष्टीकृत (Confirmed)' : item.status === 'Requested' ? 'प्रतीक्षारत (Requested)' : 'पूर्ण (Completed)') 
                  : item.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> {item.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> {item.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> {item.location}
              </span>
            </div>

            {item.feedback && (
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-[#1E3A8A] mb-0.5">
                  {currentLang === 'hi' ? 'शिक्षक सारांश एवं परामर्श:' : "Teacher's Summary & Recommendations:"}
                </p>
                <p className="italic">{item.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── REQUEST PTM MODAL ── */}
      {showRequestModal && (
        <div 
          onClick={() => setShowRequestModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  {currentLang === 'hi' ? 'पीटीएम अपॉइंटमेंट' : 'PTM Appointment'}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif leading-tight">
                  {currentLang === 'hi' ? 'शिक्षक से बैठक का अनुरोध' : 'Request Teacher Meeting'}
                </h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {currentLang === 'hi' ? 'शिक्षक / प्राध्यापक चुनें' : 'Select Faculty / Teacher'}
                </label>
                <select
                  value={teacherSelected}
                  onChange={(e) => setTeacherSelected(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option>{currentLang === 'hi' ? 'कक्षाध्यापिका (श्रीमती अंजलि राव)' : 'Class Teacher (Mrs. Anjali Rao)'}</option>
                  <option>{currentLang === 'hi' ? 'गणित प्राध्यापक (श्री शर्मा)' : 'Mathematics Faculty (Mr. Sharma)'}</option>
                  <option>{currentLang === 'hi' ? 'विज्ञान प्राध्यापक (श्री वर्मा)' : 'Science Faculty (Mr. Verma)'}</option>
                  <option>{currentLang === 'hi' ? 'अंग्रेजी प्राध्यापिका (श्रीमती जॉनसन)' : 'English Faculty (Mrs. Johnson)'}</option>
                  <option>{currentLang === 'hi' ? 'काउंसलर / उप-प्राचार्य' : 'Counselor / Vice Principal'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {currentLang === 'hi' ? 'पसंदीदा दिनांक' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {currentLang === 'hi' ? 'पसंदीदा समय' : 'Preferred Time'}
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option>{currentLang === 'hi' ? 'प्रातः 10:00 बजे' : '10:00 AM'}</option>
                    <option>{currentLang === 'hi' ? 'प्रातः 11:00 बजे' : '11:00 AM'}</option>
                    <option>{currentLang === 'hi' ? 'दोपहर 12:00 बजे' : '12:00 PM'}</option>
                    <option>{currentLang === 'hi' ? 'दोपहर 02:00 बजे' : '02:00 PM'}</option>
                    <option>{currentLang === 'hi' ? 'अपराह्न 03:30 बजे' : '03:30 PM'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {currentLang === 'hi' ? 'परामर्श माध्यम' : 'Consultation Mode'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'In person', label: currentLang === 'hi' ? 'प्रत्यक्ष (परिसर में)' : 'In person' },
                    { key: 'Video Call (Zoom)', label: currentLang === 'hi' ? 'वीडियो कॉल (ज़ूम)' : 'Video Call (Zoom)' }
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPreferredMode(m.key)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        preferredMode === m.key
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {currentLang === 'hi' ? 'बैठक का एजेंडा / मुख्य प्रश्न' : 'Meeting Agenda / Questions'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder={currentLang === 'hi' ? 'उदाहरण: विज्ञान परीक्षा की तैयारी एवं प्रोजेक्ट कार्य के संबंध में...' : 'e.g. Query regarding Science midterm preparation...'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  {currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{currentLang === 'hi' ? 'अनुरोध सबमिट करें' : 'Submit Request'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
