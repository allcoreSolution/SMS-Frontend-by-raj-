import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Video, ClipboardList, PenLine, Wallet, CheckSquare,
  Laptop, Award, BookOpen, Megaphone, CalendarDays, Clock,
  FileBadge, Bus, Building2, BadgeCheck, Dumbbell, Headphones,
  FolderOpen, ChevronLeft, QrCode, Handshake, HeartPulse, Image
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AllModules() {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  const storedUser = localStorage.getItem('parent_user');
  let userRole = 'Parent';
  if (storedUser) {
    try {
      userRole = JSON.parse(storedUser).role || 'Parent';
    } catch (e) {}
  }
  const isStudent = String(userRole).toLowerCase() === 'student';

  const studentModules = [
    { label: currentLang === 'hi' ? 'समय सारणी' : 'Timetable', icon: Calendar, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/timetable' },
    { label: currentLang === 'hi' ? 'लाइव कक्षाएं' : 'Online Classes', icon: Video, color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', route: '/live-classes' },
    { label: currentLang === 'hi' ? 'गृहकार्य' : 'Homework', icon: ClipboardList, color: '#F97316', bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/30', route: '/homework' },
    { label: currentLang === 'hi' ? 'कक्षा कार्य' : 'Classwork', icon: PenLine, color: '#6366F1', bg: 'bg-[#6366F1]/10', border: 'border-[#6366F1]/30', route: '/classwork' },
    { label: currentLang === 'hi' ? 'मेरी उपस्थिति' : 'Attendance', icon: CheckSquare, color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', route: '/attendance' },
    { label: currentLang === 'hi' ? 'ऑनलाइन परीक्षा' : 'CBT Exams', icon: Laptop, color: '#EC4899', bg: 'bg-[#EC4899]/10', border: 'border-[#EC4899]/30', route: '/online-exams' },
    { label: currentLang === 'hi' ? 'परीक्षा परिणाम' : 'Exam Results', icon: Award, color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/30', route: '/exams' },
    { label: currentLang === 'hi' ? 'अध्ययन सामग्री' : 'Study Notes', icon: BookOpen, color: '#14B8A6', bg: 'bg-[#14B8A6]/10', border: 'border-[#14B8A6]/30', route: '/study-center' },
    { label: currentLang === 'hi' ? 'पुस्तकालय' : 'Library', icon: BookOpen, color: '#9333EA', bg: 'bg-[#9333EA]/10', border: 'border-[#9333EA]/30', route: '/library' },
    { label: currentLang === 'hi' ? 'सूचना पट्ट' : 'Notice Board', icon: Megaphone, color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', route: '/notice-board' },
    { label: currentLang === 'hi' ? 'स्कूल कैलेंडर' : 'Events & Breaks', icon: CalendarDays, color: '#3B82F6', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', route: '/calendar' },
    { label: currentLang === 'hi' ? 'अवकाश आवेदन' : 'Leave Apply', icon: Clock, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/leave-management' },
    { label: currentLang === 'hi' ? 'प्रमाण पत्र' : 'Certificates', icon: FileBadge, color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', route: '/documents' },
    { label: currentLang === 'hi' ? 'बस परिवहन' : 'Transport', icon: Bus, color: '#EA580C', bg: 'bg-[#EA580C]/10', border: 'border-[#EA580C]/30', route: '/transport' },
    { label: currentLang === 'hi' ? 'छात्रावास' : 'Hostel', icon: Building2, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/hostel' },
    { label: currentLang === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : 'Health Records', icon: HeartPulse, color: '#EC4899', bg: 'bg-[#EC4899]/10', border: 'border-[#EC4899]/30', route: '/health-records' },
    { label: currentLang === 'hi' ? 'चित्र दीर्घा' : 'Gallery', icon: Image, color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', route: '/gallery' },
    { label: currentLang === 'hi' ? 'एआई ट्यूटर' : 'AI Study Tutor', icon: Headphones, color: '#64748B', bg: 'bg-[#64748B]/10', border: 'border-[#64748B]/30', route: '/ai-assistant' },
    { label: currentLang === 'hi' ? 'मेरे दस्तावेज' : 'My Documents', icon: FolderOpen, color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', route: '/documents' },
  ];

  const parentModules = [
    { label: currentLang === 'hi' ? 'शुल्क भुगतान' : 'Fee Payments', icon: Wallet, color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', route: '/fee-payments' },
    { label: currentLang === 'hi' ? 'लेनदेन रसीदें' : 'Transactions', icon: Wallet, color: '#F97316', bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/30', route: '/transactions' },
    { label: currentLang === 'hi' ? 'उपस्थिति मॉनिटर' : 'Attendance', icon: CheckSquare, color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', route: '/attendance' },
    { label: currentLang === 'hi' ? 'समय सारणी' : 'Timetable', icon: Calendar, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/timetable' },
    { label: currentLang === 'hi' ? 'गृहकार्य स्थिति' : 'Homework', icon: ClipboardList, color: '#F97316', bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/30', route: '/homework' },
    { label: currentLang === 'hi' ? 'अभिभावक बैठक' : 'PTM Meetings', icon: Handshake, color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/30', route: '/meetings' },
    { label: currentLang === 'hi' ? 'स्कूल विजिट पास' : 'Visit Pass', icon: QrCode, color: '#EC4899', bg: 'bg-[#EC4899]/10', border: 'border-[#EC4899]/30', route: '/school-visit' },
    { label: currentLang === 'hi' ? 'परीक्षा परिणाम' : 'Exam Results', icon: Award, color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/30', route: '/exams' },
    { label: currentLang === 'hi' ? 'बस ट्रैकिंग' : 'Transport', icon: Bus, color: '#EA580C', bg: 'bg-[#EA580C]/10', border: 'border-[#EA580C]/30', route: '/transport' },
    { label: currentLang === 'hi' ? 'अवकाश आवेदन' : 'Leave Apply', icon: Clock, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/leave-management' },
    { label: currentLang === 'hi' ? 'दस्तावेज व टीसी' : 'Documents & TC', icon: FolderOpen, color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', route: '/documents' },
    { label: currentLang === 'hi' ? 'सिलेबस व नोट्स' : 'Syllabus & Notes', icon: BookOpen, color: '#14B8A6', bg: 'bg-[#14B8A6]/10', border: 'border-[#14B8A6]/30', route: '/study-center' },
    { label: currentLang === 'hi' ? 'सूचना पट्ट' : 'Notice Board', icon: Megaphone, color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', route: '/notice-board' },
    { label: currentLang === 'hi' ? 'स्कूल कैलेंडर' : 'School Events', icon: CalendarDays, color: '#3B82F6', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', route: '/calendar' },
    { label: currentLang === 'hi' ? 'लाइब्रेरी स्थिति' : 'Library', icon: BookOpen, color: '#9333EA', bg: 'bg-[#9333EA]/10', border: 'border-[#9333EA]/30', route: '/library' },
    { label: currentLang === 'hi' ? 'छात्रावास विवरण' : 'Hostel Info', icon: Building2, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/hostel' },
    { label: currentLang === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : 'Health Records', icon: HeartPulse, color: '#EC4899', bg: 'bg-[#EC4899]/10', border: 'border-[#EC4899]/30', route: '/health-records' },
    { label: currentLang === 'hi' ? 'चित्र दीर्घा' : 'Gallery', icon: Image, color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', route: '/gallery' },
    { label: currentLang === 'hi' ? 'अभिभावक सहायता' : 'AI Helpdesk', icon: Headphones, color: '#64748B', bg: 'bg-[#64748B]/10', border: 'border-[#64748B]/30', route: '/ai-assistant' },
  ];

  const allModules = isStudent ? studentModules : parentModules;

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-24 font-sans select-none">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#F8FAFF]/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/60 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
          title={currentLang === 'hi' ? 'वापस जाएं' : 'Go Back'}
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 tracking-tight font-serif">
            {isStudent 
              ? (currentLang === 'hi' ? 'सभी विद्यार्थी मॉड्यूल' : 'All Student Modules')
              : (currentLang === 'hi' ? 'सभी अभिभावक मॉड्यूल' : 'All Parent Modules')}
          </h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {isStudent ? 'Student Workspace' : 'Parent Supervisory Desk'}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
        {/* Section title */}
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-500">
            {currentLang === 'hi' ? `सभी अधिकृत सुविधाएं देखें (${allModules.length})` : `Explore Authorized Features (${allModules.length})`}
          </p>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-x-3 gap-y-5">
          {allModules.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center group cursor-pointer text-center focus:outline-none transition-transform active:scale-95"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border shadow-2xs transition-all group-hover:scale-105 group-hover:shadow-md ${item.bg} ${item.border}`}
                >
                  <Icon
                    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110"
                    style={{ color: item.color }}
                    strokeWidth={2}
                  />
                </div>
                <span className="mt-2 text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight max-w-[76px] line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
