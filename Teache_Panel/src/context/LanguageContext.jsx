import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import Swal from 'sweetalert2';

const LanguageContext = createContext();

// Strictly English and Hindi only as requested
export const supportedLanguages = [
  { code: 'en', name: 'English', native: 'English', region: 'Global', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India', flag: '🇮🇳' }
];

export const translations = {
  English: {
    // Header & Global
    searchPlaceholder: "Search students, exams, modules...",
    commandCenter: "Command Center",
    session: "Session",
    language: "Language",
    selectLanguage: "Select Language",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    noNotifications: "No new notifications",
    viewAll: "View All",
    quickActions: "Quick Actions",
    addStudent: "Add Student",
    enterMarks: "Enter Marks",
    applyLeave: "Apply Leave",
    createEvent: "Create Event",
    myProfile: "My Profile",
    settings: "Settings & Preferences",
    signOut: "Sign out",
    appsCenter: "Apps Center",
    themePreview: "Preview",
    searchHint: "Type at least 2 characters to search anything in the ERP.",
    searchResults: "Search Results",
    noResultsFound: "No matching modules or students found",
    sessionChangedToast: "Academic session switched to",
    langChangedToast: "Language changed to English successfully!",
    allCoreSolution: "ALL CORE SOLUTION",
    preview: "Preview",

    // Sidebar Sections
    mainNavigation: "Main Navigation",
    students: "Students",
    onlineExams: "Online Exams",
    exams: "Exams",
    studyManagement: "Study Management",
    documents: "Documents",
    communication: "Communication",
    account: "Account",
    searchMenu: "Search Menu...",
    teacherPortal: "Teacher Portal",

    // Sidebar Nav Items & Submenus
    dashboard: "Dashboard",
    loans: "My Loans & Advances",
    liveClasses: "Live Classes",
    manageLiveClasses: "Manage Live Classes",
    liveClassSettings: "Live Class Settings",
    complaints: "Complaints",
    leave: "Apply Leave",
    health: "Health Records",
    timetable: "My Timetable",
    studentList: "Student List",
    studentAttendance: "Student Attendance",
    manageOnlineExams: "Manage Online Exams",
    questionBank: "Question Bank",
    manageOfflineExams: "Manage Offline Exams",
    admitCards: "Admit Cards",
    uploadMarksheet: "Upload Marksheet",
    generateMarksheet: "Generate Marksheet",
    classwork: "Classwork & Logbook",
    assignments: "Homework & Assignments",
    certificates: "Certificates & Documents",
    ptm: "PTM Meetings",
    ptmDashboard: "PTM Dashboard",
    ptmGuide: "PTM Guide",
    ptmAttendance: "PTM Attendance & Rec",
    ptmFollowups: "PTM Follow-ups",
    ptmReports: "PTM Reports",
    lessonPlanner: "Lesson Planner",
    lessonPlans: "Lesson Plans",
    lessonPlannerGuide: "Lesson Planner Guide",
    lessonPlanReview: "Lesson Plan Review",
    lessonPlanCoverage: "Lesson Plan Coverage",
    lessonPlanReports: "Lesson Plan Reports",
    osm: "OSM Module",
    osmDashboard: "OSM Dashboard",
    osmEvaluate: "OSM Evaluate",
    osmReports: "OSM Reports",
    osmGuide: "OSM Guide",
    assessment: "Assessment",
    assessmentDashboard: "Assessment Dashboard",
    assessments: "Assessments",
    assessmentGuide: "Assessment Guide",
    assessmentReports: "Assessment Reports",
    leadManagement: "Lead Management",
    leadDashboard: "Lead Dashboard",
    leadPipeline: "Lead Pipeline Board",
    leadSources: "Lead Sources & Stages",
    surveys: "Surveys & Feedback",
    mySurveys: "My Surveys",
    feedbackTriage: "Feedback Triage",
    messages: "Messages",
    hpc: "Holistic Progress Card",
    hpcDashboard: "HPC Dashboard",
    hpcActivities: "HPC Activities",
    progressCards: "Progress Cards",
    logout: "Logout",
    login: "Login / Switch Account",

    // Dashboard Items
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    myStudents: "My Students",
    totalEnrolledStudents: "Total Enrolled Students",
    myClasses: "My Classes",
    assignedClassesLectures: "Assigned Classes & Lectures",
    attendanceToday: "Attendance Today",
    todaysStudentAttendance: "Today's Student Attendance",
    pendingExams: "Pending Exams",
    upcomingScheduledExams: "Upcoming & Scheduled Exams",
    notices: "Notices",
    activeSchoolCirculars: "Active School Circulars",
    ecosystemHub: "Ecosystem Hub",
    ecosystemDesc: "modules — everything your school runs on",
    viewAllStudents: "View all students",
    viewClassSchedule: "View class schedule",
    markAttendance: "Mark attendance",
    viewExamSchedule: "View exam schedule",
    viewAllNotices: "View all notices",
    more: "More",
    all: "All",
    operations: "Operations",
    finance: "Finance",
    academics: "Academics",
    live: "Live",

    // Settings Items
    settingsPreferences: "Settings & Preferences",
    settingsDesc: "Configure language, visual aesthetics, notifications, and security",
    generalLocalization: "General & Localization",
    notificationsAlerts: "Notifications & Alerts",
    accountPassword: "Account & Password",
    themeAesthetics: "Theme & Aesthetics",
    portalLanguage: "Portal Language",
    academicSession: "Academic Session",
    savePreferences: "Save Preferences",
    changeAccountPassword: "Change Account Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password",
    teacherProfileSummary: "Teacher Profile Summary",
    teacherName: "Teacher Name",
    officialDesignation: "Official Designation",
    department: "Department",
    emailAddress: "Email Address",
    contactNumber: "Contact Number"
  },
  Hindi: {
    // Header & Global
    searchPlaceholder: "विद्यार्थी, परीक्षा, मॉड्यूल खोजें...",
    commandCenter: "कमांड सेंटर",
    session: "सत्र",
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    notifications: "सूचनाएं",
    markAllRead: "सभी पढ़े गए चिह्नित करें",
    noNotifications: "कोई नई सूचना नहीं है",
    viewAll: "सभी देखें",
    quickActions: "त्वरित क्रियाएँ",
    addStudent: "विद्यार्थी जोड़ें",
    enterMarks: "अंक दर्ज करें",
    applyLeave: "छुट्टी के लिए आवेदन",
    createEvent: "नया कार्यक्रम बनाएं",
    myProfile: "मेरी प्रोफ़ाइल",
    settings: "सेटिंग्स एवं प्राथमिकताएं",
    signOut: "साइन आउट",
    appsCenter: "ऐप्स केंद्र",
    themePreview: "पूर्वावलोकन",
    searchHint: "ईआरपी में कुछ भी खोजने के लिए कम से कम 2 अक्षर टाइप करें।",
    searchResults: "खोज परिणाम",
    noResultsFound: "कोई मॉड्यूल या विद्यार्थी नहीं मिला",
    sessionChangedToast: "शैक्षणिक सत्र बदल दिया गया",
    langChangedToast: "भाषा सफलतापूर्वक हिंदी में बदली गई!",
    allCoreSolution: "ऑल कोर सॉल्यूशन",
    preview: "पूर्वावलोकन",

    // Sidebar Sections
    mainNavigation: "मुख्य नेविगेशन",
    students: "विद्यार्थी (छात्र)",
    onlineExams: "ऑनलाइन परीक्षाएं",
    exams: "ऑफलाइन परीक्षाएं",
    studyManagement: "अध्ययन प्रबंधन",
    documents: "दस्तावेज़ एवं प्रमाण पत्र",
    communication: "संचार एवं संदेश",
    account: "खाता सेटिंग्स",
    searchMenu: "मेन्यू खोजें...",
    teacherPortal: "शिक्षक पोर्टल",

    // Sidebar Nav Items & Submenus
    dashboard: "डैशबोर्ड",
    loans: "ऋण एवं अग्रिम",
    liveClasses: "लाइव कक्षाएं",
    manageLiveClasses: "लाइव कक्षा प्रबंधन",
    liveClassSettings: "लाइव कक्षा सेटिंग्स",
    complaints: "शिकायतें एवं निवारण",
    leave: "छुट्टी का आवेदन",
    health: "स्वास्थ्य रिकॉर्ड",
    timetable: "मेरी समय-सारणी",
    studentList: "छात्र सूची",
    studentAttendance: "छात्र उपस्थिति",
    manageOnlineExams: "ऑनलाइन परीक्षा प्रबंधन",
    questionBank: "प्रश्न बैंक",
    manageOfflineExams: "ऑफलाइन परीक्षा प्रबंधन",
    admitCards: "प्रवेश पत्र (Admit Card)",
    uploadMarksheet: "अंकसूची अपलोड करें",
    generateMarksheet: "अंकसूची तैयार करें",
    classwork: "कक्षा कार्य एवं दैनिकी",
    assignments: "गृहकार्य एवं असाइनमेंट",
    certificates: "प्रमाण पत्र एवं दस्तावेज़",
    ptm: "पीटीएम बैठकें",
    ptmDashboard: "पीटीएम डैशबोर्ड",
    ptmGuide: "पीटीएम मार्गदर्शिका",
    ptmAttendance: "पीटीएम उपस्थिति",
    ptmFollowups: "पीटीएम फॉलो-अप",
    ptmReports: "पीटीएम रिपोर्ट",
    lessonPlanner: "पाठ योजनाकार",
    lessonPlans: "पाठ योजनाएं",
    lessonPlannerGuide: "पाठ योजना मार्गदर्शिका",
    lessonPlanReview: "पाठ योजना समीक्षा",
    lessonPlanCoverage: "पाठ्यक्रम कवरेज",
    lessonPlanReports: "पाठ योजना रिपोर्ट",
    osm: "ओएसएम मॉड्यूल",
    osmDashboard: "ओएसएम डैशबोर्ड",
    osmEvaluate: "ओएसएम मूल्यांकन",
    osmReports: "ओएसएम रिपोर्ट",
    osmGuide: "ओएसएम गाइड",
    assessment: "मूल्यांकन",
    assessmentDashboard: "मूल्यांकन डैशबोर्ड",
    assessments: "मूल्यांकन सूची",
    assessmentGuide: "मूल्यांकन मार्गदर्शिका",
    assessmentReports: "मूल्यांकन रिपोर्ट",
    leadManagement: "लीड प्रबंधन",
    leadDashboard: "लीड डैशबोर्ड",
    leadPipeline: "लीड पाइपलाइन बोर्ड",
    leadSources: "लीड स्रोत एवं चरण",
    surveys: "सर्वेक्षण एवं फीडबैक",
    mySurveys: "मेरे सर्वेक्षण",
    feedbackTriage: "प्रतिक्रिया विश्लेषण",
    messages: "संदेश एवं प्रसारण",
    hpc: "समग्र प्रगति कार्ड (HPC)",
    hpcDashboard: "एचपीसी डैशबोर्ड",
    hpcActivities: "एचपीसी गतिविधियाँ",
    progressCards: "प्रगति पत्र (कार्ड)",
    logout: "लॉग आउट",
    login: "लॉग इन / खाता बदलें",

    // Dashboard Items
    goodMorning: "शुभ प्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    myStudents: "मेरे विद्यार्थी",
    totalEnrolledStudents: "कुल नामांकित विद्यार्थी",
    myClasses: "मेरी कक्षाएं",
    assignedClassesLectures: "आवंटित कक्षाएं और व्याख्यान",
    attendanceToday: "आज की उपस्थिति",
    todaysStudentAttendance: "आज की विद्यार्थी उपस्थिति",
    pendingExams: "आगामी परीक्षाएं",
    upcomingScheduledExams: "आगामी एवं निर्धारित परीक्षाएं",
    notices: "सूचनाएं एवं परिपत्र",
    activeSchoolCirculars: "सक्रिय विद्यालय परिपत्र",
    ecosystemHub: "इकोसिस्टम हब",
    ecosystemDesc: "मॉड्यूल — आपके विद्यालय के सभी कार्य",
    viewAllStudents: "सभी विद्यार्थी देखें",
    viewClassSchedule: "समय सारणी देखें",
    markAttendance: "उपस्थिति दर्ज करें",
    viewExamSchedule: "परीक्षा कार्यक्रम देखें",
    viewAllNotices: "सभी सूचनाएं देखें",
    more: "अधिक",
    all: "सभी",
    operations: "संचालन",
    finance: "वित्तीय",
    academics: "शैक्षणिक",
    live: "लाइव",

    // Settings Items
    settingsPreferences: "सेटिंग्स एवं प्राथमिकताएं",
    settingsDesc: "भाषा, रूपरंग, सूचनाएं और सुरक्षा सेटिंग्स बदलें",
    generalLocalization: "सामान्य एवं भाषा",
    notificationsAlerts: "सूचनाएं एवं अलर्ट",
    accountPassword: "खाता एवं पासवर्ड",
    themeAesthetics: "थीम एवं रूपरंग",
    portalLanguage: "पोर्टल भाषा",
    academicSession: "शैक्षणिक सत्र",
    savePreferences: "प्राथमिकताएं सहेजें",
    changeAccountPassword: "खाता पासवर्ड बदलें",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    updatePassword: "पासवर्ड अपडेट करें",
    teacherProfileSummary: "शिक्षक प्रोफ़ाइल विवरण",
    teacherName: "शिक्षक का नाम",
    officialDesignation: "पदनाम",
    department: "विभाग",
    emailAddress: "ईमेल पता",
    contactNumber: "संपर्क नंबर"
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_language') || localStorage.getItem('portal_language') || 'English';
      return (saved.toLowerCase() === 'hindi' || saved.toLowerCase() === 'hi') ? 'Hindi' : 'English';
    } catch (e) {
      return 'English';
    }
  });

  const [currentLangCode, setCurrentLangCode] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_language') || localStorage.getItem('portal_language') || 'English';
      return (saved.toLowerCase() === 'hindi' || saved.toLowerCase() === 'hi') ? 'hi' : 'en';
    } catch (e) {
      return 'en';
    }
  });

  // Clean any old Google Translate cookies
  const cleanGoogleCookies = () => {
    try {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const el = document.getElementById('google_translate_element');
      if (el) el.remove();
    } catch (e) {}
  };

  // Initialize from storage or backend on mount
  useEffect(() => {
    cleanGoogleCookies();

    const initLang = async () => {
      let selectedLang = localStorage.getItem('erp_language') || localStorage.getItem('portal_language') || 'English';

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosInstance.get('/profile/me');
          const backendLang = res.data?.data?.preferences?.language;
          if (backendLang) {
            selectedLang = backendLang;
          }
        } catch (err) {}
      }

      const isHindi = selectedLang.toLowerCase() === 'hindi' || selectedLang.toLowerCase() === 'hi';
      const targetName = isHindi ? 'Hindi' : 'English';
      const targetCode = isHindi ? 'hi' : 'en';

      setCurrentLang(targetName);
      setCurrentLangCode(targetCode);
      localStorage.setItem('erp_language', targetName);
      localStorage.setItem('erp_lang_code', targetCode);
    };

    initLang();
  }, []);

  const changeLanguage = async (langNameOrCode) => {
    const isHindi = (langNameOrCode || '').toLowerCase() === 'hindi' || (langNameOrCode || '').toLowerCase() === 'hi';
    const targetName = isHindi ? 'Hindi' : 'English';
    const targetCode = isHindi ? 'hi' : 'en';

    setCurrentLang(targetName);
    setCurrentLangCode(targetCode);

    try {
      localStorage.setItem('erp_language', targetName);
      localStorage.setItem('erp_lang_code', targetCode);
      localStorage.setItem('portal_language', targetCode);
    } catch (e) {}

    cleanGoogleCookies();

    // Custom events so any component or window listener can sync
    window.dispatchEvent(new CustomEvent('erp_language_changed', { detail: { name: targetName, code: targetCode } }));

    // Persist to MongoDB backend User Profile if authenticated
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axiosInstance.put('/profile/preferences', {
          preferences: { language: targetName }
        });
      } catch (err) {
        console.warn('Backend language sync warning:', err.message);
      }
    }

    // Show confirmation Toast
    const toastTitle = translations[targetName]?.langChangedToast || `Language changed to ${targetName}!`;
    Swal.fire({
      title: toastTitle,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2200
    });
  };

  const t = (key, fallback = '') => {
    const dict = translations[currentLang] || translations.English;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    const enDict = translations.English;
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      currentLangCode, 
      changeLanguage, 
      languages: supportedLanguages.map(l => l.name), 
      supportedLanguages,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
