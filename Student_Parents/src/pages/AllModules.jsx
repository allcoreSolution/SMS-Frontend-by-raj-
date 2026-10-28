import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Video, ClipboardList, PenLine, Wallet, CheckSquare,
  Laptop, Award, BookOpen, Megaphone, CalendarDays, Clock,
  FileBadge, Bus, Building2, BadgeCheck, Dumbbell, Headphones,
  FolderOpen, ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AllModules() {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  const allModules = [
    { label: currentLang === 'hi' ? 'समय सारणी' : 'Timetable', icon: Calendar, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/timetable' },
    { label: currentLang === 'hi' ? 'लाइव कक्षाएं' : 'Online Classes', icon: Video, color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', route: '/live-classes' },
    { label: currentLang === 'hi' ? 'गृहकार्य' : 'Homework', icon: ClipboardList, color: '#F97316', bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/30', route: '/homework' },
    { label: currentLang === 'hi' ? 'कक्षा कार्य' : 'Assignments', icon: PenLine, color: '#6366F1', bg: 'bg-[#6366F1]/10', border: 'border-[#6366F1]/30', route: '/classwork' },
    { label: currentLang === 'hi' ? 'फीस भुगतान' : 'Fees', icon: Wallet, color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', route: '/fee-payments' },
    { label: currentLang === 'hi' ? 'उपस्थिति' : 'Attendance', icon: CheckSquare, color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', route: '/attendance' },
    { label: currentLang === 'hi' ? 'ऑनलाइन परीक्षा' : 'Online Exams', icon: Laptop, color: '#EC4899', bg: 'bg-[#EC4899]/10', border: 'border-[#EC4899]/30', route: '/online-exams' },
    { label: currentLang === 'hi' ? 'परीक्षा परिणाम' : 'Exam Results', icon: Award, color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/30', route: '/exams' },
    { label: currentLang === 'hi' ? 'अध्ययन सामग्री' : 'Study Material', icon: BookOpen, color: '#14B8A6', bg: 'bg-[#14B8A6]/10', border: 'border-[#14B8A6]/30', route: '/study-center' },
    { label: currentLang === 'hi' ? 'सूचना पट्ट' : 'Notice Board', icon: Megaphone, color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', route: '/notice-board' },
    { label: currentLang === 'hi' ? 'स्कूल कैलेंडर' : 'Events', icon: CalendarDays, color: '#3B82F6', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', route: '/calendar' },
    { label: currentLang === 'hi' ? 'अवकाश आवेदन' : 'Leave Mgmt', icon: Clock, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/leave-management' },
    { label: currentLang === 'hi' ? 'प्रमाण पत्र' : 'Certificates', icon: FileBadge, color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', route: '/documents' },
    { label: currentLang === 'hi' ? 'बस परिवहन' : 'Transport', icon: Bus, color: '#EA580C', bg: 'bg-[#EA580C]/10', border: 'border-[#EA580C]/30', route: '/transport' },
    { label: currentLang === 'hi' ? 'छात्रावास' : 'Hostel', icon: Building2, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', route: '/hostel' },
    { label: currentLang === 'hi' ? 'स्कूल स्टाफ' : 'School Staff', icon: BadgeCheck, color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', route: '/school-visit' },
    { label: currentLang === 'hi' ? 'कोचिंग' : 'Coaching', icon: Dumbbell, color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', route: '/coaching' },
    { label: currentLang === 'hi' ? 'सहायता केंद्र' : 'Support', icon: Headphones, color: '#64748B', bg: 'bg-[#64748B]/10', border: 'border-[#64748B]/30', route: '/ai-assistant' },
    { label: currentLang === 'hi' ? 'मेरे दस्तावेज' : 'My Documents', icon: FolderOpen, color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', route: '/documents' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-24 font-sans select-none">
      {/* Top Bar matching Screenshot 3 */}
      <div className="sticky top-0 z-30 bg-[#F8FAFF]/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/60 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
          title={currentLang === 'hi' ? 'वापस जाएं' : 'Go Back'}
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight font-serif">
          {currentLang === 'hi' ? 'सभी विद्यार्थी मॉड्यूल' : 'All Student Modules'}
        </h1>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
        {/* Section title */}
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-500">
            {currentLang === 'hi' ? `सभी सुविधाएं देखें (${allModules.length})` : `Explore All Features (${allModules.length})`}
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
