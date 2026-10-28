import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, CheckCircle2, Clock, Calendar, 
  Upload, FileText, Check, X, RefreshCw, ChevronRight, MessageSquare 
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const FILTERS = [
  { key: 'All', en: 'All', hi: 'सभी' },
  { key: 'Pending', en: 'Pending', hi: 'लंबित' },
  { key: 'Submitted', en: 'Submitted', hi: 'जमा किया गया' },
  { key: 'Checked', en: 'Checked', hi: 'जांचा गया' }
];

const defaultHomeworkList = [
  {
    id: 'hw-1',
    subject: 'Mathematics',
    status: 'Pending',
    title: 'Trigonometric Identities Exercise 8.4',
    description: 'Solve all questions from 1 to 10 in your homework register.',
    dueDate: '25 May 2024',
    uploadedFile: null,
    remarks: null
  },
  {
    id: 'hw-2',
    subject: 'Science',
    status: 'Submitted',
    title: 'Life Processes Diagram Sheet',
    description: 'Draw neat labeled diagram of Human Digestive System.',
    dueDate: '24 May 2024',
    uploadedFile: 'digestive_system_diagram.pdf',
    remarks: 'Good work! Very clean drawing.'
  },
  {
    id: 'hw-3',
    subject: 'English',
    status: 'Checked',
    title: 'Essay on Environmental Conservation',
    description: 'Write a 300-word essay highlighting sustainable waste management and renewable energy.',
    dueDate: '20 May 2024',
    uploadedFile: 'english_essay_kabir.pdf',
    remarks: 'Excellent vocabulary and clear structure. Grade: A+'
  },
  {
    id: 'hw-4',
    subject: 'Social Science',
    status: 'Pending',
    title: 'Indian Nationalism Timeline Chart',
    description: 'Create a chronological timeline of key events from 1915 to 1947.',
    dueDate: '28 May 2024',
    uploadedFile: null,
    remarks: null
  }
];

export default function Homework({ activeChild }) {
  const { currentLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [homeworkList, setHomeworkList] = useState(defaultHomeworkList);
  
  // Submission modal state
  const [submitModalHw, setSubmitModalHw] = useState(null);
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadHomework = async () => {
    setLoading(true);
    try {
      const res = await parentService.getHomework({ studentId: activeChild });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Map backend homework fields to UI fields
        const mapped = res.data.map(item => ({
          id: item._id || item.id,
          subject: item.subjectId?.subjectName || item.subject || 'General',
          status: item.submissionStatus || item.status || 'Pending',
          title: item.title,
          description: item.description,
          dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '25 May 2024',
          uploadedFile: item.submissionFile || null,
          remarks: item.remarks || null
        }));
        setHomeworkList(mapped);
      }
    } catch (err) {
      console.warn('Backend homework fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, [activeChild]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionFileName(e.target.files[0].name);
    }
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!submitModalHw) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const fileName = submissionFileName || 'homework_solution.pdf';
      setHomeworkList(prev => prev.map(hw => {
        if (hw.id === submitModalHw.id) {
          return {
            ...hw,
            status: 'Submitted',
            uploadedFile: fileName
          };
        }
        return hw;
      }));

      setIsSubmitting(false);
      setToastMessage(`"${submitModalHw.title}" PDF submitted successfully!`);
      setSubmitModalHw(null);
      setSubmissionFileName('');
      setSubmissionNotes('');
      setTimeout(() => setToastMessage(''), 4000);
    }, 800);
  };

  // Filter tasks
  const displayedHomework = homeworkList.filter(hw => {
    if (selectedFilter === 'All') return true;
    return hw.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#10B981] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Screen Title (matching Screenshot 5) */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
          {currentLang === 'hi' ? 'गृहकार्य व कार्य असाइनमेंट' : 'Homework & Tasks'}
        </h1>
        {loading && (
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
        )}
      </div>

      {/* Filter Chips Bar (All, Pending, Submitted, Checked) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              {currentLang === 'hi' ? filter.hi : filter.en}
            </button>
          );
        })}
      </div>

      {/* Homework Cards List (matching Screenshot 5) */}
      <div className="space-y-4 pt-1">
        {displayedHomework.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">
              {currentLang === 'hi' ? 'इस फ़िल्टर के लिए कोई गृहकार्य नहीं मिला' : 'No homework found for this filter'}
            </p>
          </div>
        ) : (
          displayedHomework.map((item) => {
            const isPending = item.status === 'Pending';
            const isSubmitted = item.status === 'Submitted';
            const isChecked = item.status === 'Checked';

            const statusLabel = currentLang === 'hi'
              ? (isPending ? 'लंबित' : isChecked ? 'जांचा गया' : 'जमा किया गया')
              : item.status;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 transition-all hover:border-blue-200"
              >
                {/* Header row: Subject Pill (left) + Status Pill (right) */}
                <div className="flex items-center justify-between">
                  <span className="bg-[#EFF6FF] text-[#2563EB] font-bold text-xs px-3 py-1 rounded-full border border-blue-200/60">
                    {item.subject}
                  </span>

                  <span
                    className={`font-bold text-xs px-3 py-1 rounded-full border ${
                      isPending
                        ? 'bg-[#FFF7ED] text-[#F97316] border-[#FFEDD5]'
                        : isChecked
                        ? 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]'
                        : 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* Assignment Title & Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>

                {/* Due Date (red text matching screenshot) */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#EF4444]">
                  <span>📅</span>
                  <span>{currentLang === 'hi' ? 'जमा करने की अंतिम तिथि:' : 'Due Date:'} {item.dueDate}</span>
                </div>

                {/* Status Action / Uploaded Box */}
                {isPending && (
                  <button
                    onClick={() => setSubmitModalHw(item)}
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-1"
                  >
                    <FileText className="w-4 h-4 stroke-[2.2]" />
                    <span>{currentLang === 'hi' ? 'गृहकार्य पीडीएफ अपलोड करें' : 'Submit Homework PDF'}</span>
                  </button>
                )}

                {/* Uploaded File Banner (Green pill container from screenshot) */}
                {(isSubmitted || isChecked) && item.uploadedFile && (
                  <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs font-bold text-[#10B981]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">{currentLang === 'hi' ? 'अपलोड की गई फ़ाइल:' : 'Uploaded:'} {item.uploadedFile}</span>
                  </div>
                )}

                {/* Teacher Remarks (Italic quote from screenshot) */}
                {item.remarks && (
                  <p className="text-xs italic text-slate-500 font-medium pt-0.5">
                    {currentLang === 'hi' ? 'अध्यापक की टिप्पणी:' : 'Teacher Remarks:'} "{item.remarks}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── HOMEWORK PDF SUBMISSION MODAL ── */}
      {submitModalHw && (
        <div 
          onClick={() => setSubmitModalHw(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  {submitModalHw.subject} {currentLang === 'hi' ? 'असाइनमेंट' : 'Assignment'}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif leading-tight">
                  {currentLang === 'hi' ? 'गृहकार्य पीडीएफ जमा करें' : 'Submit Homework PDF'}
                </h3>
              </div>
              <button
                onClick={() => setSubmitModalHw(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmSubmit} className="p-5 space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-slate-700">
                <p className="font-bold text-slate-900">{submitModalHw.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{submitModalHw.description}</p>
              </div>

              {/* PDF File Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {currentLang === 'hi' ? 'उत्तर पुस्तिका / पीडीएफ दस्तावेज़ संलग्न करें' : 'Attach Solution PDF or Document'}
                </label>
                <label className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-blue-50/40 transition-colors">
                  <Upload className="w-6 h-6 text-[#2563EB]" />
                  <span className="font-bold text-[#2563EB] text-xs">
                    {submissionFileName ? submissionFileName : (currentLang === 'hi' ? 'डिवाइस से पीडीएफ चुनने के लिए टैप करें' : 'Tap to select PDF from device')}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, DOC, JPEG, PNG (max 10MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {currentLang === 'hi' ? 'विद्यार्थी की टिप्पणी / नोट्स (वैकल्पिक)' : 'Student Remarks / Notes (Optional)'}
                </label>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder={currentLang === 'hi' ? 'विषय शिक्षक हेतु कोई प्रश्न या संदेश...' : 'Any questions or notes for the subject teacher...'}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalHw(null)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{currentLang === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...'}</span>
                    </>
                  ) : (
                    <span>{currentLang === 'hi' ? 'पुष्टि करें व जमा करें' : 'Confirm & Submit'}</span>
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
