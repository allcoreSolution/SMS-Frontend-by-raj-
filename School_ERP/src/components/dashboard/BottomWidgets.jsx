import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  CheckCircle2, Clock, Calendar, Bus, AlertCircle, FileText, 
  Users, Gift, UserCheck, ShieldCheck, Download, GraduationCap,
  Bell, ChevronRight, BusFront, FileBarChart
} from 'lucide-react';

const Card = ({ children, title, subtitle, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col h-[280px] w-[260px] flex-shrink-0 ${className}`}>
    {(title || subtitle) && (
      <div className="mb-3 flex items-center justify-between">
        <div>
          {title && <h3 className="text-[13px] font-semibold text-gray-800 tracking-tight flex items-center gap-1.5">{title}</h3>}
          {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
        </button>
      </div>
    )}
    <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
      {children}
    </div>
  </div>
);

// 1. Setup Status
export const SetupStatus = () => {
  const tasks = [
    { name: 'Academic Session', status: 'Done', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Classes & Sections', status: 'Done', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Subjects', status: 'Done', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Fees Assigned', status: 'Done', color: 'text-green-600', bg: 'bg-green-100' },
  ];
  return (
    <Card title={<><ShieldCheck className="w-4 h-4 text-blue-500" /> Setup Status</>} subtitle="Required configurations">
      <div className="space-y-3 mt-2">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-gray-700 font-medium">{t.name}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.bg} ${t.color}`}>{t.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 2. Attendance (Donut)
export const AttendanceDonut = () => {
  const data = [
    { name: 'Present', value: 66, color: '#3b82f6' },
    { name: 'Absent', value: 19, color: '#f59e0b' },
    { name: 'Resolved', value: 25, color: '#6366f1' },
  ];
  return (
    <Card title="Today's Attendance" subtitle="Students • 20 Aug">
      <div className="flex items-center gap-4 mt-2">
        <div className="w-24 h-24 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700 text-sm">22%</div>
        </div>
        <div className="space-y-1.5 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-gray-600">{d.name}</span>
              </div>
              <span className="font-bold text-gray-800">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <h4 className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Class-wise Breakdown</h4>
        <div className="space-y-1.5">
           <div className="flex justify-between text-[11px]"><span className="text-gray-600">Class I</span><span className="text-green-600 font-medium">95%</span></div>
           <div className="flex justify-between text-[11px]"><span className="text-gray-600">Nursery</span><span className="text-green-600 font-medium">92%</span></div>
           <div className="flex justify-between text-[11px]"><span className="text-gray-600">Class II</span><span className="text-green-600 font-medium">91%</span></div>
        </div>
      </div>
    </Card>
  );
};

// 3. Pending Fee Dues
export const PendingFees = () => {
  const students = [
    { name: 'Ananya Desai', class: 'Class X', amount: '₹66,000', status: 'Overdue' },
    { name: 'Ravi Khatri', class: 'Class IX', amount: '₹66,000', status: 'Overdue' },
    { name: 'Diya Rana', class: 'Class VIII', amount: '₹66,000', status: 'Overdue' },
    { name: 'Rohan Pandey', class: 'Class VII', amount: '₹66,000', status: 'Overdue' },
    { name: 'Priya Malhotra', class: 'Class VI', amount: '₹66,000', status: 'Overdue' },
  ];
  return (
    <Card title="Pending Fee Dues" subtitle="This month">
      <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-2 uppercase px-1">
        <span>Student</span>
        <span>Amount</span>
      </div>
      <div className="space-y-3">
        {students.map((s, i) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-[10px] font-bold text-blue-800">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-700 leading-tight">{s.name}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{s.class}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">{s.amount}</p>
              <p className="text-[9px] text-red-500 font-semibold">{s.status}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 4. Timetable
export const Timetable = () => {
  return (
    <Card title="Today's Timetable" subtitle="Nursery A">
      <div className="relative border-l-2 border-gray-100 ml-2 mt-2 space-y-4 pb-2">
        <div className="relative pl-4">
          <span className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"></span>
          <div className="text-[10px] text-gray-400 font-medium">08:00</div>
          <div className="text-xs font-semibold text-gray-700">Drawing & Coloring</div>
          <div className="text-[10px] text-gray-500">Arti Sharma</div>
        </div>
        <div className="relative pl-4">
          <span className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></span>
          <div className="text-[10px] text-blue-500 font-bold">09:00 (Now)</div>
          <div className="text-xs font-bold text-blue-700 bg-blue-50 py-1 px-2 rounded -ml-2 inline-block">Rhymes & Stories</div>
          <div className="text-[10px] text-gray-500">Arti Sharma</div>
        </div>
        <div className="relative pl-4">
          <span className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"></span>
          <div className="text-[10px] text-gray-400 font-medium">10:00</div>
          <div className="text-xs font-semibold text-gray-700">English</div>
          <div className="text-[10px] text-gray-500">Arti Sharma</div>
        </div>
      </div>
    </Card>
  );
};

// 5. Events
export const UpcomingEvents = () => {
  const events = [
    { date: '22', month: 'Aug', title: 'Annual Art & Craft Fair', desc: 'Parents are welcome to see student artworks.' },
    { date: '28', month: 'Aug', title: 'Winter Sports Meet', desc: 'Inter-house winter sports featuring athletics...' },
    { date: '30', month: 'Aug', title: 'Field Trip to Science Museum', desc: 'Educational excursion for classes V...' },
  ];
  return (
    <Card title="Upcoming Events" subtitle="This month">
      <div className="space-y-3 mt-1">
        {events.map((e, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm leading-tight">{e.date}</span>
              <span className="text-blue-400 text-[9px] uppercase font-semibold">{e.month}</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-[11px] font-bold text-gray-800 line-clamp-1">{e.title}</h4>
                <span className="px-1.5 py-0.5 rounded text-[8px] bg-purple-50 text-purple-600 font-semibold uppercase">Event</span>
              </div>
              <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 6. Transport Status
export const TransportStatus = () => {
  const routes = [
    { id: 'CG04-MH2391', route: 'Rajpur - Phoolchowk', status: 'On trip', color: 'text-green-600', icon: 'text-green-500 bg-green-50' },
    { id: 'CG04-KA8234', route: 'Sec 4 - Shankar Nagar', status: 'On trip', color: 'text-green-600', icon: 'text-orange-500 bg-orange-50' },
    { id: 'CG04-KA9478', route: 'Katora Talab - Telibandha', status: 'Idle', color: 'text-gray-500', icon: 'text-blue-500 bg-blue-50' },
  ];
  return (
    <Card title={<><BusFront className="w-4 h-4 text-indigo-500" /> Transport Status</>} subtitle="Fleet overview">
      <div className="space-y-3 mt-2">
        {routes.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${r.icon}`}>
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-700">{r.id}</p>
                <p className="text-[9px] text-gray-500 truncate w-24">{r.route}</p>
              </div>
            </div>
            <div className={`text-[10px] font-bold flex items-center gap-1 ${r.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'On trip' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {r.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 7. Fee Collection Overview
export const FeeCollectionChart = () => {
  const data = [
    { name: 'Jan', value: 30 }, { name: 'Feb', value: 40 }, { name: 'Mar', value: 35 },
    { name: 'Apr', value: 80 }, { name: 'May', value: 45 }, { name: 'Jun', value: 30 },
    { name: 'Jul', value: 20 }, { name: 'Aug', value: 90 }, { name: 'Sep', value: 25 },
    { name: 'Oct', value: 35 }, { name: 'Nov', value: 40 }, { name: 'Dec', value: 30 },
  ];
  return (
    <Card title="Fee Collection Overview" subtitle="Collected over last 12 mos">
      <div className="h-36 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{fontSize: '11px', padding: '4px', borderRadius: '4px'}} />
            <Bar dataKey="value" fill="#4f46e5" radius={[2, 2, 0, 0]} />
            <XAxis dataKey="name" tick={{fontSize: 8, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-500 justify-center">
        <div className="w-2 h-2 rounded-full bg-indigo-600"></div> Collected (₹)
      </div>
    </Card>
  );
};

// 8. Announcements
export const Announcements = () => {
  return (
    <Card title={<><Bell className="w-4 h-4 text-orange-500" /> Announcements</>} subtitle="Latest notices" className="w-[300px]">
      <div className="space-y-4 mt-2">
        <div>
          <h4 className="text-[11px] font-bold text-gray-800 line-clamp-1">Notice - Library week - bring back borrowed books</h4>
          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">All students! Please return any borrowed books by the end of this week to avoid late fee penalties...</p>
          <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 hours ago</p>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase mb-1 inline-block">News Alert</span>
          <p className="text-[10px] text-gray-600 line-clamp-2 leading-tight">Dear Parents, Greetings! We are pleased to inform you that the school is launching a new AI mobile application along with the classic...</p>
          <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 12 hours ago</p>
        </div>
      </div>
    </Card>
  );
};

// 9. Upcoming Exams
export const UpcomingExams = () => {
  return (
    <Card title="Upcoming Exams" subtitle="Next scheduled assessments">
      <div className="space-y-3 mt-1">
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded text-blue-600 flex flex-col items-center justify-center font-bold text-[10px] leading-tight">
              <span>11</span><span>Aug</span>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-700">English</h4>
              <p className="text-[9px] text-gray-500">Class II • Half Yearly Exam</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded text-purple-600 flex flex-col items-center justify-center font-bold text-[10px] leading-tight">
              <span>21</span><span>Aug</span>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-700">English</h4>
              <p className="text-[9px] text-gray-500">Class III • Half Yearly Exam</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded text-orange-600 flex flex-col items-center justify-center font-bold text-[10px] leading-tight">
              <span>24</span><span>Aug</span>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-700">Mathematics</h4>
              <p className="text-[9px] text-gray-500">Class II • Half Yearly Exam</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// 10. Admissions
export const Admissions = () => {
  return (
    <Card title={<><UserCheck className="w-4 h-4 text-blue-500" /> Admissions</>} subtitle="Inquiry summary">
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
          <div className="text-xl font-bold text-green-600">0</div>
          <div className="text-[10px] text-green-700 font-semibold mt-1">Admitted</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
          <div className="text-xl font-bold text-blue-600">2</div>
          <div className="text-[10px] text-blue-700 font-semibold mt-1">Pending</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
          <div className="text-xl font-bold text-gray-600">0</div>
          <div className="text-[10px] text-gray-700 font-semibold mt-1">Interested</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
          <div className="text-xl font-bold text-red-600">1</div>
          <div className="text-[10px] text-red-700 font-semibold mt-1">Rejected</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold mb-1">
          <span>Seat Capacity</span>
          <span>2K</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{width: '10%'}}></div>
        </div>
      </div>
    </Card>
  );
};

// 11. Birthdays
export const Birthdays = () => {
  return (
    <Card title={<><Gift className="w-4 h-4 text-pink-500" /> Today's Birthdays</>} subtitle="Students & Staff">
      <div className="space-y-3 mt-2">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-[11px]">KS</div>
             <div>
               <p className="text-[11px] font-bold text-gray-700">Kabir Singh</p>
               <p className="text-[9px] text-gray-500">Student • Class V</p>
             </div>
           </div>
           <span className="text-[10px] font-medium text-gray-400">21 Aug</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
           <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-[11px]">M</div>
             <div>
               <p className="text-[11px] font-bold text-gray-700">Meenakshi</p>
               <p className="text-[9px] text-gray-500">Staff</p>
             </div>
           </div>
           <span className="text-[10px] font-medium text-gray-400">22 Aug</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
           <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[11px]">AD</div>
             <div>
               <p className="text-[11px] font-bold text-gray-700">Ali Dubey</p>
               <p className="text-[9px] text-gray-500">Student • Class VI</p>
             </div>
           </div>
           <span className="text-[10px] font-medium text-gray-400">24 Aug</span>
        </div>
      </div>
    </Card>
  );
};

// 12. Staff Snapshot
export const StaffSnapshot = () => {
  return (
    <Card title={<><Users className="w-4 h-4 text-teal-500" /> Staff Snapshot</>} subtitle="Attendance today">
      <div className="flex justify-between mt-2 px-4">
        <div className="text-center">
          <div className="text-xl font-bold text-teal-600">7</div>
          <div className="text-[10px] text-gray-500 font-semibold">Present</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-400">0</div>
          <div className="text-[10px] text-gray-500 font-semibold">Absent</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-orange-500">7</div>
          <div className="text-[10px] text-gray-500 font-semibold">Away</div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
         <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700">AS</div>
             <div>
               <p className="text-[10px] font-bold text-gray-700 leading-tight">Arti Sharma</p>
               <p className="text-[8px] text-gray-500">Senior Teacher</p>
             </div>
           </div>
           <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-semibold uppercase">Unmarked</span>
         </div>
         <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[9px] font-bold text-green-700">RD</div>
             <div>
               <p className="text-[10px] font-bold text-gray-700 leading-tight">Rahul Dubey</p>
               <p className="text-[8px] text-gray-500">Staff</p>
             </div>
           </div>
           <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-semibold uppercase">Unmarked</span>
         </div>
         <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[9px] font-bold text-teal-700">VS</div>
             <div>
               <p className="text-[10px] font-bold text-gray-700 leading-tight">Vikas Singh</p>
               <p className="text-[8px] text-gray-500">Staff</p>
             </div>
           </div>
           <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-semibold uppercase">Unmarked</span>
         </div>
      </div>
    </Card>
  );
};

export const DashboardBottomWidgets = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 hide-scroll mt-6">
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <AttendanceDonut />
      <PendingFees />
      <Timetable />
      <UpcomingEvents />
      <TransportStatus />
      <FeeCollectionChart />
      <Announcements />
      <UpcomingExams />
      <Admissions />
      <Birthdays />
      <StaffSnapshot />
      <SetupStatus />
    </div>
  );
};

export default DashboardBottomWidgets;
