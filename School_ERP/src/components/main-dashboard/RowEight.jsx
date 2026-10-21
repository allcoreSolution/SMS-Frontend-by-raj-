import React from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, MonitorPlay, Presentation, Home, FileJson, ArrowRight, LayoutGrid, Book, FolderOpen } from 'lucide-react';

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

const LessonPlannerWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Lesson Planner" icon={BookMarked}  link="/lesson-planner/dashboard" />
    
    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Total Plans</div>
      </div>
      <div>
        <div className="text-orange-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Pending</div>
      </div>
      <div>
        <div className="text-emerald-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Approved</div>
      </div>
      <div>
        <div className="text-[#5F52FF] font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">This Week</div>
      </div>
    </div>

    <div className="flex-1 flex flex-col mb-4">
      <div className="text-[11px] text-slate-500 mb-1">Approved share <span className="float-right font-bold text-slate-800">0%</span></div>
      <div className="w-full bg-slate-100 h-2 rounded-none mb-6 overflow-hidden">
        <div className="bg-emerald-500 h-full rounded-none" style={{ width: '0%' }}></div>
      </div>

      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Plans</div>
      
      <div className="space-y-3 flex items-center justify-center h-full">
        <div className="text-slate-400 text-xs">No recent plans</div>
      </div>
    </div>
  </div>
);

const DigitalEvaluationWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Digital Evaluation" icon={MonitorPlay}  link="/osm-module/dashboard" />
    
    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
      <div>
        <div className="text-[#5F52FF] font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Active Sessions</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Answer Sheets</div>
      </div>
      <div>
        <div className="text-orange-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Pending</div>
      </div>
    </div>

    <div className="flex-1 flex flex-col">
      <div className="text-[11px] text-slate-500 mb-1">Evaluation progress <span className="float-right font-bold text-slate-800">0%</span></div>
      <div className="w-full bg-slate-100 h-2 rounded-none overflow-hidden">
        <div className="bg-emerald-500 h-full rounded-none" style={{ width: '0%' }}></div>
      </div>
    </div>
  </div>
);

const StudyCenterWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Study Center" icon={Presentation}  link="/study-center/dashboard" />
    
    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Materials</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Active Homework</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Live Classes</div>
      </div>
    </div>

    <div className="flex-1 flex flex-col mb-4">
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Upcoming Live Classes</div>
      
      <div className="space-y-3 flex items-center justify-center h-full text-slate-400 text-xs">
        No upcoming classes
      </div>
    </div>
    
    <div className="flex gap-2 mt-auto">
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <LayoutGrid className="w-3 h-3 text-slate-400" /> Dashboard
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <Book className="w-3 h-3 text-slate-400" /> Classwork & Logbook
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <Presentation className="w-3 h-3 text-slate-400" /> Manage Syllabus
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600 hover:bg-slate-50">
        <FolderOpen className="w-3 h-3 text-slate-400" /> Manage Resources
      </button>
    </div>
  </div>
);

const HostelWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="Hostel" icon={Home}  link="/hostel/dashboard" />
    
    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Hostels</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Rooms</div>
      </div>
      <div>
        <div className="text-[#5F52FF] font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Occupied</div>
      </div>
      <div>
        <div className="text-emerald-500 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Available</div>
      </div>
    </div>

    <div className="flex-1 flex flex-col">
      <div className="text-[11px] text-slate-500 mb-1">Occupancy <span className="float-right font-bold text-slate-800">0%</span></div>
      <div className="w-full bg-slate-100 h-2 rounded-none overflow-hidden">
        <div className="bg-[#5F52FF] h-full rounded-none" style={{ width: '0%' }}></div>
      </div>
    </div>
  </div>
);

const CBCAcademicsWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <WidgetHeader title="CBC Academics" icon={FileJson}  link="/cbc/dashboard" />
    
    <div className="grid grid-cols-3 gap-2 text-center mt-2">
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Strands</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Competencies</div>
      </div>
      <div>
        <div className="text-slate-800 font-extrabold text-sm">0</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">Assessments</div>
      </div>
    </div>
  </div>
);


const RowEight = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <LessonPlannerWidget />
        <DigitalEvaluationWidget />
        <StudyCenterWidget />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1">
          <HostelWidget />
        </div>
        <div className="md:col-span-1">
          <CBCAcademicsWidget />
        </div>
      </div>
    </>
  );
};

export default RowEight;
