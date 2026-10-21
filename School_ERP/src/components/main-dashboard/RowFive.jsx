import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarHeart, GraduationCap, ArrowRight, Book, Layers, LayoutGrid } from 'lucide-react';

const WidgetHeader = ({ title, icon: Icon, link }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-2">
      <div className="bg-[#1e3a5f] p-1.5 rounded-none text-white">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
    </div>
    {link ? (
      <Link to={link} className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </Link>
    ) : (
      <button className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </button>
    )}
  </div>
);

const AcademicsWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Academics" icon={BookOpen}  link="/academics/dashboard" />
    
    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Teachers</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Classes</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Sections</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Subjects</div>
      </div>
    </div>

    <div className="flex border-b border-slate-100 mb-4 text-[11px] font-bold">
      <button className="flex-1 pb-2 border-b-2 border-slate-800 text-slate-800">Upcoming exams</button>
      <button className="flex-1 pb-2 text-slate-400">Today</button>
    </div>

    <div className="flex-1 flex flex-col justify-end mb-4">
      <div className="text-[11px] text-slate-500 mb-1">Timetable coverage <span className="float-right font-bold text-slate-800">0%</span></div>
      <div className="w-full bg-slate-100 h-2 rounded-none mb-2 overflow-hidden">
        <div className="bg-[#5F52FF] h-full rounded-none" style={{ width: '0%' }}></div>
      </div>
      <div className="flex justify-between items-center text-[10px]">
        <span className="font-bold text-slate-700">Term 3 Nov</span>
        <span className="text-slate-400">15 Nov - 27 Nov</span>
      </div>
    </div>
    
    <div className="flex gap-2">
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <LayoutGrid className="w-3 h-3 text-slate-400" /> Academic Dashboard
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <Book className="w-3 h-3 text-slate-400" /> Academic Sessions
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <Layers className="w-3 h-3 text-slate-400" /> Classes
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <LayoutGrid className="w-3 h-3 text-slate-400" /> Sections
      </button>
    </div>
  </div>
);

const UpcomingEventsWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Upcoming Events" icon={CalendarHeart}  link="/communicate/events-holidays" />
    
    <div className="flex-1 space-y-4 flex items-center justify-center">
      <div className="text-slate-400 text-xs">No upcoming events scheduled</div>
    </div>
  </div>
);

const ExaminationsWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Examinations" icon={GraduationCap}  link="/assessment/dashboard" />
    
    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Ongoing</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Upcoming</div>
      </div>
      <div>
        <div className="text-emerald-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Results out</div>
      </div>
    </div>

    <div className="flex border-b border-slate-100 mb-4 text-[11px] font-bold">
      <button className="flex-1 pb-2 border-b-2 border-slate-800 text-slate-800">Overview</button>
      <button className="flex-1 pb-2 text-slate-400">Class pass %</button>
    </div>

    <div className="flex-1 flex flex-col justify-end mb-4">
      <div className="text-[11px] text-slate-500 mb-1">Marks entry <span className="float-right font-bold text-slate-800">0%</span></div>
      <div className="w-full bg-slate-100 h-2 rounded-none mb-2 overflow-hidden">
        <div className="bg-[#5F52FF] h-full rounded-none" style={{ width: '0%' }}></div>
      </div>
      <div className="text-[10px] text-slate-400">Loading exam distribution data...</div>
    </div>
  </div>
);

const RowFive = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <AcademicsWidget />
      <UpcomingEventsWidget />
      <ExaminationsWidget />
    </div>
  );
};

export default RowFive;
