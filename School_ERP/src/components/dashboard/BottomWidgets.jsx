import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
    { name: 'Academic Session (2026-27)', status: 'Active', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Admit First Student', status: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Add Faculty / Staff', status: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Assign Fees to Class', status: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <Card title={<><ShieldCheck className="w-4 h-4 text-blue-500" /> Setup Status</>} subtitle="Institutional Readiness">
      <div className="space-y-3 mt-2">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${t.status === 'Active' ? 'text-green-500' : 'text-blue-500'}`} />
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
  const [attData, setAttData] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    import('../../api/attendanceService').then(({ attendanceService }) => {
      attendanceService.getAttendanceSummary().then(res => {
        if (isMounted && res?.data) {
          setAttData(res.data.data || res.data);
        }
      }).catch(() => {});
    });
    return () => { isMounted = false; };
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const present = attData?.present ?? 0;
  const absent = attData?.absent ?? 0;
  const late = attData?.late ?? 0;
  const percentage = attData?.percentage || '0%';

  const data = [
    { name: 'Present', value: present, color: '#3b82f6' },
    { name: 'Absent', value: absent, color: '#f59e0b' },
    { name: 'Late', value: late, color: '#6366f1' },
  ];

  return (
    <Card title="Today's Attendance" subtitle={`Students • ${todayStr}`}>
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
          <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700 text-sm">
            {percentage}
          </div>
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
          <p className="text-[11px] text-gray-400 italic">No classes marked today yet</p>
        </div>
      </div>
    </Card>
  );
};

// 3. Pending Fee Dues
export const PendingFees = () => {
  return (
    <Card title="Pending Fee Dues" subtitle="This month">
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs font-semibold text-gray-700">No pending fee dues</p>
        <p className="text-[10px] text-gray-400 mt-1">All accounts are currently clear.</p>
      </div>
    </Card>
  );
};

// 4. Timetable
export const Timetable = () => {
  return (
    <Card title="Today's Timetable" subtitle="Daily routine">
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs font-semibold text-gray-700">No periods scheduled today</p>
        <p className="text-[10px] text-gray-400 mt-1">Configure class timetable in Academics.</p>
      </div>
    </Card>
  );
};

// 5. Events
export const UpcomingEvents = () => {
  return (
    <Card title="Upcoming Events" subtitle="This month">
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs font-semibold text-gray-700">No upcoming events</p>
        <p className="text-[10px] text-gray-400 mt-1">School events and holidays will appear here.</p>
      </div>
    </Card>
  );
};

// 6. Transport Status
export const TransportStatus = () => {
  return (
    <Card title={<><BusFront className="w-4 h-4 text-indigo-500" /> Transport Status</>} subtitle="Fleet overview">
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs font-semibold text-gray-700">No active vehicles</p>
        <p className="text-[10px] text-gray-400 mt-1">Add buses and routes in Transport module.</p>
      </div>
    </Card>
  );
};

// 7. Fee Collection Overview
export const FeeCollectionChart = () => {
  const data = [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 },
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
        <div className="w-2 h-2 rounded-full bg-indigo-600"></div> Collected (₹0)
      </div>
    </Card>
  );
};

// 8. Announcements
export const Announcements = () => {
  const [notices, setNotices] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    import('../../api/noticeService').then(({ noticeService }) => {
      noticeService.getNotices().then(res => {
        if (isMounted && res?.data && Array.isArray(res.data)) {
          setNotices(res.data);
        }
      }).catch(() => {});
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <Card title={<><Bell className="w-4 h-4 text-orange-500" /> Announcements</>} subtitle="Latest notices" className="w-[300px]">
      {notices.length > 0 ? (
        <div className="space-y-4 mt-2">
          {notices.slice(0, 3).map((n, i) => (
            <div key={n._id || i} className={i > 0 ? "pt-3 border-t border-gray-100" : ""}>
              <h4 className="text-[11px] font-bold text-gray-800 line-clamp-1">{n.title}</h4>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{n.content}</p>
              <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {n.publishDate ? new Date(n.publishDate).toLocaleDateString() : 'Recent'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
          <p className="text-xs font-semibold text-gray-700">No active notices</p>
          <p className="text-[10px] text-gray-400 mt-1">Publish notices from Notice Board.</p>
        </div>
      )}
    </Card>
  );
};

// 9. Upcoming Exams
export const UpcomingExams = () => {
  return (
    <Card title="Upcoming Exams" subtitle="Next scheduled assessments">
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs font-semibold text-gray-700">No upcoming exams</p>
        <p className="text-[10px] text-gray-400 mt-1">Schedule exams in Examination module.</p>
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
          <div className="text-xl font-bold text-blue-600">0</div>
          <div className="text-[10px] text-blue-700 font-semibold mt-1">Pending</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
          <div className="text-xl font-bold text-gray-600">0</div>
          <div className="text-[10px] text-gray-700 font-semibold mt-1">Interested</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
          <div className="text-xl font-bold text-red-600">0</div>
          <div className="text-[10px] text-red-700 font-semibold mt-1">Rejected</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold mb-1">
          <span>Seat Capacity</span>
          <span>0</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{width: '0%'}}></div>
        </div>
      </div>
    </Card>
  );
};

// 11. Birthdays
export const Birthdays = () => {
  return (
    <Card title={<><Gift className="w-4 h-4 text-pink-500" /> Today's Birthdays</>} subtitle="Students & Staff">
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs font-semibold text-gray-700">No birthdays today</p>
        <p className="text-[10px] text-gray-400 mt-1">Student and staff birthdays will appear here.</p>
      </div>
    </Card>
  );
};

// 12. Staff Snapshot
export const StaffSnapshot = () => {
  const [staffCount, setStaffCount] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    import('../../api/hrService').then(({ hrService }) => {
      hrService.getStaff({ limit: 1 }).then(res => {
        if (isMounted) {
          const val = res;
          const count = val?.pagination?.total ?? val?.total ?? val?.count ?? (Array.isArray(val?.data) ? val.data.length : 0);
          setStaffCount(count || 0);
        }
      }).catch(() => {});
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <Card title={<><Users className="w-4 h-4 text-teal-500" /> Staff Snapshot</>} subtitle="Attendance today">
      <div className="flex justify-between mt-2 px-4">
        <div className="text-center">
          <div className="text-xl font-bold text-teal-600">{staffCount}</div>
          <div className="text-[10px] text-gray-500 font-semibold">Total Staff</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-400">0</div>
          <div className="text-[10px] text-gray-500 font-semibold">Absent</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-orange-500">0</div>
          <div className="text-[10px] text-gray-500 font-semibold">Away</div>
        </div>
      </div>
      <div className="mt-8 text-center text-[11px] text-gray-400">
        {staffCount > 0 ? `${staffCount} active faculty member registered` : 'No staff registered yet'}
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
