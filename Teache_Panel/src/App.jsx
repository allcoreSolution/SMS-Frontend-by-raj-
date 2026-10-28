import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyLoans from './pages/MyLoans';
import ManageLiveClasses from './pages/ManageLiveClasses';
import LiveClassSettings from './pages/LiveClassSettings';
import Complaints from './pages/Complaints';
import ApplyLeave from './pages/ApplyLeave';
import HealthRecords from './pages/HealthRecords';
import MyTimetable from './pages/MyTimetable';
import StudentList from './pages/StudentList';
import StudentAttendance from './pages/StudentAttendance';
import ManageOnlineExams from './pages/ManageOnlineExams';
import QuestionBank from './pages/QuestionBank';
import ManageOfflineExams from './pages/ManageOfflineExams';
import EnterMarks from './pages/EnterMarks';
import UploadMarksheet from './pages/UploadMarksheet';
import GenerateMarksheet from './pages/GenerateMarksheet';
import AdmitCards from './pages/AdmitCards';
import Classwork from './pages/Classwork';
import Assignments from './pages/Assignments';
import Certificates from './pages/Certificates';
import AppsCenter from './pages/AppsCenter';
import PTM from './pages/PTM';
import LessonPlanner from './pages/LessonPlanner';
import OSMModule from './pages/OSMModule';
import Assessment from './pages/Assessment';
import LeadManagement from './pages/LeadManagement';
import Surveys from './pages/Surveys';
import Messages from './pages/Messages';
import HolisticProgress from './pages/HolisticProgress';
import Settings from './pages/Settings';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import MobileBottomNav from './components/MobileBottomNav';

const Layout = ({ children }) => {
  const { currentTheme } = useTheme();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const location = useLocation();

  // Auto-close sidebar on mobile route change
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  }, [location.pathname]);
  
  return (
    <div className={`flex w-screen h-screen overflow-hidden relative ${currentTheme}`}>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 w-full relative">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f9fafb] theme-app-bg flex flex-col justify-between pb-16 lg:pb-0">
          <div className="flex-1">
            {children}
          </div>
          {/* Main Portal Bottom Footer */}
          <footer className="mt-auto shrink-0 py-3 px-4 border-t border-gray-200/80 bg-white/80 backdrop-blur-xs text-center mb-16 lg:mb-0">
            <p className="text-[12px] font-bold text-gray-700 tracking-wide mb-0.5">
              &copy; 2026 School ERP
            </p>
            <p className="text-[11px] font-medium text-gray-500">
              Developed by <span className="text-gray-900 font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
            </p>
          </footer>
        </main>

        {/* Native Mobile Bottom Navigation Bar (Hidden on Desktop, Active on Mobile/APK) */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

const Placeholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center mb-4 shadow-sm border border-gray-100 theme-card">
      <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-xl font-bold text-gray-800">Under Construction</h2>
    <p className="text-sm text-gray-500 mt-2">This module is part of the ERP but hasn't been built out in the standalone panel yet.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/my-profile" element={<Layout><Profile /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="/loans" element={<Layout><MyLoans /></Layout>} />
            <Route path="/live/manage" element={<Layout><ManageLiveClasses /></Layout>} />
            <Route path="/live/settings" element={<Layout><LiveClassSettings /></Layout>} />
            <Route path="/complaints" element={<Layout><Complaints /></Layout>} />
            <Route path="/leave" element={<Layout><ApplyLeave /></Layout>} />
            <Route path="/health" element={<Layout><HealthRecords /></Layout>} />
            <Route path="/timetable" element={<Layout><MyTimetable /></Layout>} />
            <Route path="/students" element={<Layout><StudentList /></Layout>} />
            <Route path="/student-attendance" element={<Layout><StudentAttendance /></Layout>} />
            <Route path="/online-exams" element={<Layout><ManageOnlineExams /></Layout>} />
            <Route path="/question-bank" element={<Layout><QuestionBank /></Layout>} />
            <Route path="/offline-exams" element={<Layout><ManageOfflineExams /></Layout>} />
            <Route path="/enter-marks" element={<Layout><EnterMarks /></Layout>} />
            <Route path="/upload-marksheet" element={<Layout><UploadMarksheet /></Layout>} />
            <Route path="/generate-marksheet" element={<Layout><GenerateMarksheet /></Layout>} />
            <Route path="/admit-cards" element={<Layout><AdmitCards /></Layout>} />
            <Route path="/classwork" element={<Layout><Classwork /></Layout>} />
            <Route path="/assignments" element={<Layout><Assignments /></Layout>} />
            <Route path="/certificates" element={<Layout><Certificates /></Layout>} />
            <Route path="/apps-center" element={<Layout><AppsCenter /></Layout>} />
            <Route path="/ptm" element={<Layout><PTM /></Layout>} />
            <Route path="/ptm-dashboard" element={<Layout><PTM /></Layout>} />
            <Route path="/ptm-guide" element={<Layout><PTM /></Layout>} />
            <Route path="/ptm-attendance" element={<Layout><PTM /></Layout>} />
            <Route path="/ptm-followups" element={<Layout><PTM /></Layout>} />
            
            <Route path="/lesson-planner" element={<Layout><LessonPlanner /></Layout>} />
            <Route path="/lesson-plans" element={<Layout><LessonPlanner /></Layout>} />
            <Route path="/lesson-planner-guide" element={<Layout><LessonPlanner /></Layout>} />
            <Route path="/lesson-plan-review" element={<Layout><LessonPlanner /></Layout>} />
            <Route path="/lesson-plan-coverage" element={<Layout><LessonPlanner /></Layout>} />
            <Route path="/lesson-plan-reports" element={<Layout><LessonPlanner /></Layout>} />
            
            <Route path="/osm" element={<Layout><OSMModule /></Layout>} />
            <Route path="/osm-dashboard" element={<Layout><OSMModule /></Layout>} />
            <Route path="/osm-evaluate" element={<Layout><OSMModule /></Layout>} />
            <Route path="/osm-reports" element={<Layout><OSMModule /></Layout>} />
            <Route path="/osm-guide" element={<Layout><OSMModule /></Layout>} />
            <Route path="/assessment" element={<Layout><Assessment /></Layout>} />
            <Route path="/assessment-dashboard" element={<Layout><Assessment /></Layout>} />
            <Route path="/assessments" element={<Layout><Assessment /></Layout>} />
            <Route path="/assessment-reports" element={<Layout><Assessment /></Layout>} />
            <Route path="/assessment-guide" element={<Layout><Assessment /></Layout>} />
            <Route path="/lead-management" element={<Layout><LeadManagement /></Layout>} />
            <Route path="/lead-dashboard" element={<Layout><LeadManagement /></Layout>} />
            <Route path="/lead-pipeline" element={<Layout><LeadManagement /></Layout>} />
            <Route path="/lead-sources" element={<Layout><LeadManagement /></Layout>} />
            <Route path="/surveys" element={<Layout><Surveys /></Layout>} />
            <Route path="/my-surveys" element={<Layout><Surveys /></Layout>} />
            <Route path="/feedback-triage" element={<Layout><Surveys /></Layout>} />
            <Route path="/messages" element={<Layout><Messages /></Layout>} />
            <Route path="/hpc-dashboard" element={<Layout><HolisticProgress /></Layout>} />
            <Route path="/hpc-activities" element={<Layout><HolisticProgress /></Layout>} />
            <Route path="/progress-cards" element={<Layout><HolisticProgress /></Layout>} />
            <Route path="*" element={<Layout><Placeholder /></Layout>} />
          </Route>
        </Routes>
      </BrowserRouter>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
