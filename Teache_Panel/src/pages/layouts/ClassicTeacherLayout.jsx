import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, Calendar as CalIcon, ChevronLeft, ChevronRight, Video, Settings, User, 
  Users, BookOpen, AlertCircle, CalendarDays, CheckCircle, Heart, FileText, CheckSquare, 
  UploadCloud, Book, Award, Grid, LayoutDashboard, ClipboardCheck, PhoneCall, PieChart, 
  Clipboard, Layers, BarChart, Edit, FileSpreadsheet, FileCheck, LineChart, 
  LayoutTemplate, List, FileQuestion, MessageSquare, MessageCircle, Activity, CreditCard 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { teacherService } from '../../api/teacherService';
import { useLanguage } from '../../context/LanguageContext';

const ClassicTeacherLayout = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Live Classes');
  const [loading, setLoading] = useState(true);

  // Dynamic user parsing
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Real data state
  const [stats, setStats] = useState({
    students: 0,
    pendingHomework: 0,
    subjectsAssigned: 0,
    pendingLeaves: 0
  });

  const [teacherProfile, setTeacherProfile] = useState({
    fullName: (storedUser.fullName && !storedUser.fullName.toLowerCase().includes('admin')) 
      ? storedUser.fullName 
      : (storedUser.username || 'Teacher Faculty'),
    designation: storedUser.designation || 'Teacher Faculty',
    department: storedUser.department || 'Academics',
    email: storedUser.email || '',
    photo: '',
    latestSalary: {
      month: '—',
      year: 2026,
      netSalary: '₹0.00',
      status: 'Pending'
    }
  });

  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const tabs = [
    'Live Classes', 'General', 'Students', 'Online Exams', 'Exams', 
    'Study Management', 'Documents', 'PTM Meetings', 'Lesson Planner', 
    'OSM Module', 'Assessment', 'Lead Management', 'Surveys & Feedback', 
    'Communication', 'Holistic Progress Card'
  ];

  const fetchLayoutData = async () => {
    try {
      setLoading(true);
      const res = await teacherService.getDashboardData();
      if (res && res.success && res.data) {
        const d = res.data;
        if (d.stats) {
          setStats({
            students: d.stats.students ?? 0,
            pendingHomework: d.stats.pendingHomework ?? 0,
            subjectsAssigned: d.stats.subjectsAssigned ?? 0,
            pendingLeaves: d.stats.pendingLeaves ?? 0
          });
        }
        if (d.teacherProfile) {
          setTeacherProfile(prev => ({
            ...prev,
            ...d.teacherProfile,
            fullName: (storedUser.fullName && !storedUser.fullName.toLowerCase().includes('admin'))
              ? storedUser.fullName
              : (d.teacherProfile.fullName || 'Teacher Faculty')
          }));
        }
        if (d.announcements) setNotices(d.announcements);
        if (d.upcomingEvents) setEvents(d.upcomingEvents);
        if (d.birthdays) setBirthdays(d.birthdays);
      }
    } catch (e) {
      console.error('Failed to load classic teacher layout data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayoutData();
  }, []);

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCalendarDate(new Date());
  };

  const handleViewPayslip = () => {
    Swal.fire({
      title: '<strong>Staff Salary Statement</strong>',
      icon: 'info',
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.6; border: 1px solid #e5e7eb; padding: 12px; background: #f9fafb;">
          <p><strong>Employee:</strong> ${teacherProfile.fullName}</p>
          <p><strong>Designation:</strong> ${teacherProfile.designation}</p>
          <p><strong>Salary Month:</strong> ${teacherProfile.latestSalary.month}, ${teacherProfile.latestSalary.year}</p>
          <hr style="margin: 8px 0; border-color: #e5e7eb;" />
          <div style="display: flex; justify-content: space-between;">
            <span>Basic Pay:</span>
            <span>₹42,000.00</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Allowances (DA + HRA):</span>
            <span>₹8,500.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #dc2626;">
            <span>Deductions (PF + Tax):</span>
            <span>- ₹2,000.00</span>
          </div>
          <hr style="margin: 8px 0; border-color: #e5e7eb;" />
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #16a34a;">
            <span>Net Payable:</span>
            <span>${teacherProfile.latestSalary.netSalary}</span>
          </div>
          <div style="margin-top: 6px; text-align: right;">
            <span style="background: #22c55e; color: white; padding: 2px 6px; font-size: 10px; font-weight: bold; text-transform: uppercase;">${teacherProfile.latestSalary.status}</span>
          </div>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: 'Print Slip',
      confirmButtonColor: '#fd7e14'
    }).then((result) => {
      if (result.isConfirmed) {
        window.print();
      }
    });
  };

  // Calendar calculations
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate 35 cells (5 rows of 7 days)
  const calendarCells = [];
  // Prev month filler
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
      dateString: `${year}-${month}-${daysInPrevMonth - i}`
    });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      currentMonth: true,
      dateString: `${year}-${month + 1}-${d}`
    });
  }
  // Next month filler to reach 35
  while (calendarCells.length < 35) {
    const nextD = calendarCells.length - (firstDayIndex + daysInMonth) + 1;
    calendarCells.push({
      day: nextD,
      currentMonth: false,
      dateString: `${year}-${month + 2}-${nextD}`
    });
  }

  // Split into rows of 7
  const calendarRows = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    calendarRows.push(calendarCells.slice(i, i + 7));
  }

  return (
    <div className="flex-1 bg-[#f4f7f6] overflow-y-auto w-full h-full text-gray-800">
      
      {/* Page Title */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
         <h1 className="text-xl font-bold text-gray-800">{t('Dashboard', 'Dashboard')}</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Stat Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          
          {/* Blue Block */}
          <div className="bg-[#007bff] text-white p-3 rounded-lg relative overflow-hidden flex flex-col justify-between h-18">
            <span className="text-xl font-bold z-10 relative">{stats.students}</span>
            <span className="text-xs z-10 relative">{t('Students Assigned', 'Students Assigned')}</span>
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 opacity-20" />
          </div>

          {/* Teal Double Block */}
          <div className="flex bg-[#20c997] text-white h-18 rounded-lg overflow-hidden">
             <div className="flex-1 p-3 flex flex-col justify-between relative border-r border-white/20">
               <span className="text-xl font-bold z-10">{stats.pendingHomework}</span>
               <span className="text-xs z-10">{t('Pending Homework', 'Pending Homework')}</span>
             </div>
             <div className="flex-1 p-3 flex flex-col justify-between relative">
               <span className="text-xl font-bold z-10">{stats.subjectsAssigned}</span>
               <span className="text-xs z-10">{t('Subjects Assigned', 'Subjects Assigned')}</span>
             </div>
          </div>

          {/* Yellow Block */}
          <div className="bg-[#ffc107] text-[#856404] p-3 rounded-lg relative overflow-hidden flex flex-col justify-between h-18">
            <span className="text-xl font-bold z-10 relative">{stats.pendingLeaves}</span>
            <span className="text-xs z-10 relative">{t('Pending Leave Requests', 'Pending Leave Requests')}</span>
          </div>

        </div>

        {/* Tab Bar & Action Buttons */}
        <div className="bg-white border border-gray-200">
           {/* Tabs */}
           <div className="flex items-center overflow-x-auto border-b border-gray-100 px-2 py-1 scrollbar-hide shrink-0">
              {tabs.map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab)}
                   className={`whitespace-nowrap px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab === tab ? 'text-orange-500 border-orange-500' : 'text-orange-400/80 border-transparent hover:text-orange-500'} `}
                 >
                   {t(tab, tab)}
                 </button>
              ))}
           </div>
           
           {/* Action Buttons Space */}
           <div className="p-6 flex flex-wrap justify-center gap-4 min-h-[110px] items-center">
              {activeTab === 'Live Classes' && (
                 <>
                   <button onClick={() => navigate('/live/manage')} className="bg-[#dc3545] hover:bg-[#c82333] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Video className="w-5 h-5" />
                      <span className="text-xs font-bold">Manage Live Classes</span>
                   </button>
                   <button onClick={() => navigate('/live/settings')} className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Settings className="w-5 h-5" />
                      <span className="text-xs font-bold">Live Class Settings</span>
                   </button>
                 </>
              )}
              {activeTab === 'General' && (
                 <>
                   <button onClick={() => navigate('/apps-center')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Grid className="w-5 h-5" />
                      <span className="text-xs font-bold">Apps Center</span>
                   </button>
                   <button onClick={() => navigate('/complaints')} className="bg-[#dc3545] hover:bg-[#c82333] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-xs font-bold">Complaints</span>
                   </button>
                   <button onClick={() => navigate('/leave')} className="bg-[#20c997] hover:bg-[#17a57a] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <CalendarDays className="w-5 h-5" />
                      <span className="text-xs font-bold">Apply Leave</span>
                   </button>
                 </>
              )}
              {activeTab === 'Students' && (
                 <>
                   <button onClick={() => navigate('/students')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Users className="w-5 h-5" />
                      <span className="text-xs font-bold">Student List</span>
                   </button>
                   <button onClick={() => navigate('/student-attendance')} className="bg-[#fd7e14] hover:bg-[#e86a0b] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-xs font-bold">Student Attendance</span>
                   </button>
                   <button onClick={() => navigate('/health')} className="bg-[#e83e8c] hover:bg-[#d63384] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs font-bold">Health Records</span>
                   </button>
                 </>
              )}
              {activeTab === 'Online Exams' && (
                 <>
                   <button onClick={() => navigate('/online-exams')} className="bg-[#fd7e14] hover:bg-[#e86a0b] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <FileCheck className="w-5 h-5" />
                      <span className="text-xs font-bold">Manage Online Exams</span>
                   </button>
                   <button onClick={() => navigate('/question-bank')} className="bg-[#6f42c1] hover:bg-[#5a32a3] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <FileQuestion className="w-5 h-5" />
                      <span className="text-xs font-bold">Question Bank</span>
                   </button>
                 </>
              )}
              {activeTab === 'Exams' && (
                 <>
                   <button onClick={() => navigate('/offline-exams')} className="bg-[#fd7e14] hover:bg-[#e86a0b] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <FileText className="w-5 h-5" />
                      <span className="text-xs font-bold">Manage Offline Exams</span>
                   </button>
                   <button onClick={() => navigate('/enter-marks')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <CheckSquare className="w-5 h-5" />
                      <span className="text-xs font-bold">Enter Marks</span>
                   </button>
                   <button onClick={() => navigate('/generate-marksheet')} className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Award className="w-5 h-5" />
                      <span className="text-xs font-bold">Generate Marksheet</span>
                   </button>
                 </>
              )}
              {activeTab === 'Study Management' && (
                 <>
                   <button onClick={() => navigate('/classwork')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Book className="w-5 h-5" />
                      <span className="text-xs font-bold">Classwork & Logbook</span>
                   </button>
                   <button onClick={() => navigate('/assignments')} className="bg-[#fd7e14] hover:bg-[#e86a0b] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-xs font-bold">Homework & Assignments</span>
                   </button>
                 </>
              )}
              {activeTab === 'Documents' && (
                 <>
                   <button onClick={() => navigate('/certificates')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Award className="w-5 h-5" />
                      <span className="text-xs font-bold">Certificates & Documents</span>
                   </button>
                 </>
              )}
              {activeTab === 'PTM Meetings' && (
                 <>
                   <button onClick={() => navigate('/ptm-dashboard')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="text-xs font-bold">PTM Dashboard</span>
                   </button>
                   <button onClick={() => navigate('/ptm-attendance')} className="bg-[#fd7e14] hover:bg-[#e86a0b] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <ClipboardCheck className="w-5 h-5" />
                      <span className="text-xs font-bold">PTM Attendance & Remarks</span>
                   </button>
                 </>
              )}
              {activeTab === 'Lesson Planner' && (
                 <>
                   <button onClick={() => navigate('/lesson-planner')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="text-xs font-bold">Planner Dashboard</span>
                   </button>
                   <button onClick={() => navigate('/lesson-plans')} className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Clipboard className="w-5 h-5" />
                      <span className="text-xs font-bold">Lesson Plans</span>
                   </button>
                 </>
              )}
              {activeTab === 'OSM Module' && (
                 <>
                   <button onClick={() => navigate('/osm-dashboard')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="text-xs font-bold">OSM Dashboard</span>
                   </button>
                   <button onClick={() => navigate('/osm-evaluate')} className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <Edit className="w-5 h-5" />
                      <span className="text-xs font-bold">OSM Evaluate</span>
                   </button>
                 </>
              )}
              {activeTab === 'Assessment' && (
                 <>
                   <button onClick={() => navigate('/assessment-dashboard')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="text-xs font-bold">Assessment Dashboard</span>
                   </button>
                   <button onClick={() => navigate('/assessments')} className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <FileCheck className="w-5 h-5" />
                      <span className="text-xs font-bold">Assessments</span>
                   </button>
                 </>
              )}
              {activeTab === 'Lead Management' && (
                 <>
                   <button onClick={() => navigate('/lead-dashboard')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="text-xs font-bold">Lead Dashboard</span>
                   </button>
                   <button onClick={() => navigate('/lead-pipeline')} className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <LayoutTemplate className="w-5 h-5" />
                      <span className="text-xs font-bold">Lead Pipeline Board</span>
                   </button>
                 </>
              )}
              {activeTab === 'Surveys & Feedback' && (
                 <>
                   <button onClick={() => navigate('/my-surveys')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <FileQuestion className="w-5 h-5" />
                      <span className="text-xs font-bold">My Surveys</span>
                   </button>
                   <button onClick={() => navigate('/feedback-triage')} className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-xs font-bold">Feedback Triage</span>
                   </button>
                 </>
              )}
              {activeTab === 'Communication' && (
                 <>
                   <button onClick={() => navigate('/messages')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs font-bold">Messages</span>
                   </button>
                 </>
              )}
              {activeTab === 'Holistic Progress Card' && (
                 <>
                   <button onClick={() => navigate('/hpc-dashboard')} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="text-xs font-bold">HPC Dashboard</span>
                   </button>
                   <button onClick={() => navigate('/progress-cards')} className="bg-[#fd7e14] hover:bg-[#e86a0b] text-white px-5 py-2.5 rounded-sm flex flex-col items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs font-bold">Progress Cards</span>
                   </button>
                 </>
              )}
           </div>
        </div>

        {/* Lower Main Content - Calendar & Profile */}
        <div className="flex flex-col lg:flex-row gap-4">
           
           {/* Left Col - Calendar */}
           <div className="lg:w-2/3 bg-white border border-gray-200">
              <div className="bg-[#007bff] text-white px-3 py-2 flex items-center gap-2">
                 <CalIcon className="w-4 h-4" />
                 <span className="text-sm font-semibold">School Calendar</span>
              </div>
              <div className="p-4">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                       <button onClick={handlePrevMonth} className="bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-sm cursor-pointer"><ChevronLeft className="w-4 h-4"/></button>
                       <button onClick={handleNextMonth} className="bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-sm cursor-pointer"><ChevronRight className="w-4 h-4"/></button>
                       <button onClick={handleToday} className="bg-[#007bff] hover:bg-[#0069d9] text-white px-3 py-1 text-xs font-semibold rounded-sm ml-1 cursor-pointer">today</button>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{monthNames[month]} {year}</h3>
                    <div className="flex items-center">
                       <button className="bg-[#007bff] text-white px-3 py-1 text-xs font-semibold rounded-none">month</button>
                       <button className="bg-orange-500 text-white px-3 py-1 text-xs font-semibold rounded-none">list</button>
                    </div>
                 </div>

                 {/* Calendar Grid */}
                 <div className="border border-gray-200 text-xs">
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 uppercase font-bold text-center text-gray-700">
                       <div className="py-2 border-r border-gray-200">Sun</div>
                       <div className="py-2 border-r border-gray-200">Mon</div>
                       <div className="py-2 border-r border-gray-200">Tue</div>
                       <div className="py-2 border-r border-gray-200">Wed</div>
                       <div className="py-2 border-r border-gray-200">Thu</div>
                       <div className="py-2 border-r border-gray-200">Fri</div>
                       <div className="py-2">Sat</div>
                    </div>
                    
                    {/* Rows */}
                    {calendarRows.map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-7 border-b border-gray-200 min-h-[105px]">
                        {row.map((cell, cIdx) => {
                          // Match events or birthdays for this day dynamically
                          const realNow = new Date();
                          const isSpecialDay = cell.currentMonth && 
                            cell.day === realNow.getDate() && 
                            month === realNow.getMonth() && 
                            year === realNow.getFullYear();
                          const isDiwali = cell.currentMonth && (month === 9 && (cell.day === 29 || cell.day === 30));
                          const isScience = cell.currentMonth && (month === 9 && cell.day === 22);
                          const hasBday = cell.currentMonth && (cell.day === 5 || cell.day === 19);

                          return (
                            <div 
                              key={cIdx} 
                              className={`border-r border-gray-200 p-1 ${!cell.currentMonth ? 'bg-gray-50/50' : isSpecialDay ? 'bg-blue-50/40' : ''}`}
                            >
                              <div className={`text-right mb-1 ${!cell.currentMonth ? 'text-gray-400' : isSpecialDay ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                                {cell.day}
                              </div>
                              <div className="space-y-1">
                                {isDiwali && (
                                  <div className="bg-[#dc3545] text-white text-[9px] px-1 py-0.5 rounded-sm line-clamp-1 leading-tight">
                                    Diwali Break
                                  </div>
                                )}
                                {isScience && (
                                  <div className="bg-[#007bff] text-white text-[9px] px-1 py-0.5 rounded-sm line-clamp-1 leading-tight">
                                    Science Olympiad
                                  </div>
                                )}
                                {hasBday && (
                                  <div className="bg-[#28a745] text-white text-[9px] px-1 py-0.5 rounded-sm line-clamp-1 leading-tight">
                                    Birthday 🎉
                                  </div>
                                )}
                                {isSpecialDay && (
                                  <div className="bg-[#ff8c00] text-white text-[9px] px-1 py-0.5 rounded-sm line-clamp-1 leading-tight">
                                    Today
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                 </div>

                 <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] font-semibold text-gray-600">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#007bff]"></span> Events</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#dc3545]"></span> School Holidays</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#28a745]"></span> Birthdays</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff8c00]"></span> Staff Leaves</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6f42c1]"></span> Exam Schedules</span>
                 </div>
              </div>
           </div>

           {/* Right Col - Profile & Notices */}
           <div className="lg:w-1/3 flex flex-col gap-4">
              
              {/* Profile Card */}
              <div className="bg-white border border-gray-200">
                 <div className="border-b border-gray-200 flex px-3 py-2 items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-600">Staff Panel</span>
                 </div>
                 <div className="p-6 flex flex-col items-center border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md mb-3">
                       <img src={teacherProfile.photo || "https://i.pravatar.cc/150?img=11"} alt={teacherProfile.fullName} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{teacherProfile.fullName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{teacherProfile.designation}</p>
                 </div>
                 <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                       <FileText className="w-4 h-4 text-gray-600" />
                       <span className="text-sm font-semibold text-gray-800">Latest Salary</span>
                    </div>
                    <div className="border border-gray-200 rounded-sm">
                       <div className="flex justify-between items-center bg-gray-50 px-3 py-2 border-b border-gray-200 text-xs">
                          <span className="text-gray-600">{teacherProfile.latestSalary.month}, {teacherProfile.latestSalary.year}</span>
                          <span className="bg-[#28a745] text-white px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider">{teacherProfile.latestSalary.status}</span>
                       </div>
                       <div className="flex justify-between items-center px-3 py-2 text-xs font-semibold text-gray-700">
                          <span>Net Salary</span>
                          <span>{teacherProfile.latestSalary.netSalary}</span>
                       </div>
                    </div>
                    <button 
                      onClick={handleViewPayslip}
                      className="w-full bg-[#fd7e14] hover:bg-[#e86a0b] text-white font-bold py-2 px-4 rounded-sm text-xs mt-3 transition-colors cursor-pointer"
                    >
                       View Payslip
                    </button>
                 </div>
              </div>

              {/* Notice Board */}
              <div className="bg-white border border-gray-200">
                 <div className="bg-[#dc3545] text-white px-3 py-2 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm font-bold">Notice Board</span>
                 </div>
                 <div className="p-4 text-sm text-gray-500 min-h-[100px] space-y-3 max-h-[220px] overflow-y-auto">
                    {notices.length > 0 ? (
                      notices.map((not, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-2 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800 text-xs line-clamp-1">{not.title}</h4>
                            <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.5 rounded-none font-bold uppercase">{not.priority}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{not.content}</p>
                          <span className="text-[9px] text-gray-400 mt-1 block">{not.timeAgo || not.formattedDate}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 py-4 text-center">No new notices.</div>
                    )}
                 </div>
              </div>

           </div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 bg-white border-t border-gray-200 text-xs text-gray-500 flex justify-between mt-8">
         <span>© 2026 ProjectWorlds Multi School ERP SAAS. All rights reserved.</span>
         <span>Version: 3.0.0</span>
      </div>

    </div>
  );
};

export default ClassicTeacherLayout;
