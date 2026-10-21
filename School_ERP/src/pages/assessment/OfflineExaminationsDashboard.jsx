import React from 'react';
import { 
  List, Calendar, Edit3, FileText, TrendingUp, Tags, CheckSquare, History, ClipboardList
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const examScheduleData = [
  { name: '23 Aug', count: 0 },
  { name: '24 Aug', count: 2 },
  { name: '25 Aug', count: 1 },
  { name: '26 Aug', count: 0 },
  { name: '01 Sep', count: 0 },
];
const examTypeData = [
  { name: 'Term Exam', value: 400 },
  { name: 'Unit Test', value: 300 },
];
const attendanceData = [{ name: 'Present', value: 95 }, { name: 'Absent', value: 5 }];
const COLORS = ['#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981'];
const ATTENDANCE_COLORS = ['#10b981', '#ef4444'];
const marksEntryProgress = [
  { name: 'Term 3 Nov', current: 2, total: 5, color: 'bg-yellow-400' },
  { name: 'Half-Yearly Examination', current: 1, total: 13, color: 'bg-slate-200' }
];
const passFailData = [{ name: 'Nursery', passed: 450, failed: 2 }];
const recentExams = [{ title: 'New Exam Test', date: '2026-2027' }];
const operations = [{ label: 'Exam Types', count: 12, icon: Tags, color: 'text-orange-500' }];

export default function OfflineExaminationsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-t-2 border-t-[#0ea5e9] border-x border-b border-slate-200 rounded-none p-5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-none bg-[#e0f2fe] flex items-center justify-center text-[#0ea5e9] shrink-0">
            <List className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exams This Session</div>
            <div className="text-3xl font-black text-slate-800 mb-1">10</div>
            <div className="text-[11px] text-[#0ea5e9] font-medium">10 total all-time</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-none p-5 shadow-sm flex items-start gap-4 relative overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#8b5cf6]">
          <div className="w-10 h-10 rounded-none bg-[#f3e8ff] flex items-center justify-center text-[#9333ea] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Upcoming Exams</div>
            <div className="text-3xl font-black text-slate-800 mb-1">1</div>
            <div className="text-[11px] text-[#0ea5e9] font-medium">0 ongoing now</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-none p-5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-none bg-[#fef3c7] flex items-center justify-center text-[#d97706] shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marks Entry</div>
            <div className="text-3xl font-black text-slate-800 mb-1">26.7%</div>
            <div className="text-[11px] text-slate-500 font-medium">46 of 172 subjects scored</div>
          </div>
        </div>

         <div className="bg-white border border-slate-200 rounded-none p-5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-none bg-[#dcfce7] flex items-center justify-center text-[#16a34a] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Published Marksheets</div>
            <div className="text-3xl font-black text-slate-800 mb-1">0</div>
            <div className="text-[11px] text-[#16a34a] font-medium">1 uploaded &amp; published</div>
          </div>
        </div>
      </div>

       <div className="bg-white border border-slate-200 rounded-none p-5 shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">Overall Marks Entry Progress</h3>
          </div>
          <div className="text-2xl font-bold text-[#f59e0b]">26.7%</div>
        </div>
        <div className="w-full bg-slate-100 rounded-none h-2.5 mt-4">
          <div className="bg-[#f59e0b] h-2.5 rounded-none" style={{ width: '26.7%' }}></div>
        </div>
      </div>
    </div>
  );
}
