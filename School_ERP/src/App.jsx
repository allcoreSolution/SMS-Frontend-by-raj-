import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import UnderConstruction from "./components/layout/UnderConstruction";
import Dashboard from "./pages/Dashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import CollectFees from "./pages/finance/CollectFees";
import StudentFeeCollection from "./pages/finance/StudentFeeCollection";
import SearchDueFees from "./pages/finance/SearchDueFees";
import AllTransactions from "./pages/finance/AllTransactions";
import FeeReceipt from "./pages/finance/FeeReceipt";
import OnlineTransactions from "./pages/finance/OnlineTransactions";
import FeeChallans from "./pages/finance/FeeChallans";
import GenerateFeeChallan from "./pages/finance/GenerateFeeChallan";
import ChallanDetails from "./pages/finance/ChallanDetails";
import PrintChallan from "./pages/finance/PrintChallan";
import AssignFees from "./pages/finance/AssignFees";
import FeesCarryForward from "./pages/finance/FeesCarryForward";
import FeeGroups from "./pages/finance/FeeGroups";
import AddNewFeeGroup from "./pages/finance/AddNewFeeGroup";
import FeesDiscount from "./pages/finance/FeesDiscount";
import AddNewFeeDiscount from "./pages/finance/AddNewFeeDiscount";
import FeeTypes from "./pages/finance/FeeTypes";
import AddNewFeeType from "./pages/finance/AddNewFeeType";
import GenerateDueSlip from "./pages/finance/GenerateDueSlip";
import DueSlipHistory from "./pages/finance/DueSlipHistory";
import FeeDataAudit from "./pages/finance/FeeDataAudit";

// Accounts Module
import AccountsDashboard from "./pages/accounts/AccountsDashboard";
import Income from "./pages/accounts/Income";
import AddNewIncome from "./pages/accounts/AddNewIncome";

// Attendance Module
import QRAttendance from "./pages/attendance/QRAttendance";
import QRAttendanceSettings from "./pages/attendance/QRAttendanceSettings";
import QRAttendanceReport from "./pages/attendance/QRAttendanceReport";
import QRScanAuditLog from "./pages/attendance/QRScanAuditLog";

// Biometric Module
import BiometricDevices from "./pages/biometric/BiometricDevices";

// Assessment Module
import AssessmentDashboard from "./pages/assessment/AssessmentDashboard";
import OfflineExaminations from "./pages/assessment/OfflineExaminations";
import OfflineExamTypes from "./pages/assessment/OfflineExamTypes";
import ManageOfflineExams from "./pages/assessment/ManageOfflineExams";
import QuickExamSetup from "./pages/assessment/QuickExamSetup";
import Datesheet from "./pages/assessment/Datesheet";
import AdmitCards from "./pages/assessment/AdmitCards";
import CardSettings from "./pages/assessment/CardSettings";
import ResultSettings from "./pages/assessment/ResultSettings";
import EditExam from "./pages/assessment/EditExam";
import AddExamType from "./pages/assessment/AddExamType";
import ScheduleMarksSetup from "./pages/assessment/ScheduleMarksSetup";
import EnterMarks from "./pages/assessment/EnterMarks";
import ManageCocurricular from "./pages/assessment/ManageCocurricular";
import AddCocurricular from "./pages/assessment/AddCocurricular";
import EditCocurricular from "./pages/assessment/EditCocurricular";
import CocurricularGrades from "./pages/assessment/CocurricularGrades";
import ManageGrades from "./pages/assessment/ManageGrades";
import AddGrade from "./pages/assessment/AddGrade";
import EditGrade from "./pages/assessment/EditGrade";
import ReportCardSetups from "./pages/assessment/ReportCardSetups";
import AddReportCardSetup from "./pages/assessment/AddReportCardSetup";
import EditReportCardSetup from "./pages/assessment/EditReportCardSetup";
import GenerateMarksheet from "./pages/assessment/GenerateMarksheet";
import ReportCardView from "./pages/assessment/ReportCardView";
import UploadMarksheet from "./pages/assessment/UploadMarksheet";
import ManageUploads from "./pages/assessment/ManageUploads";
import TeacherRemarks from "./pages/assessment/TeacherRemarks";
import ManageDatesheet from "./pages/assessment/ManageDatesheet";
import OSMDashboard from "./pages/osm/OSMDashboard";
import OSMSessions from "./pages/osm/OSMSessions";
import OSMSessionDetails from "./pages/osm/OSMSessionDetails";
import OSMNewSession from "./pages/osm/OSMNewSession";
import OSMEvaluate from "./pages/osm/OSMEvaluate";
import OSMReports from "./pages/osm/OSMReports";
import OSMGuide from "./pages/osm/OSMGuide";
import OSMModeration from "./pages/osm/OSMModeration";

import LessonPlannerDashboard from "./pages/lesson-planner/LessonPlannerDashboard";
import LessonPlans from "./pages/lesson-planner/LessonPlans";
import LessonPlannerReview from "./pages/lesson-planner/LessonPlannerReview";
import LessonPlannerApprovals from "./pages/lesson-planner/LessonPlannerApprovals";
import LessonPlannerCoverage from "./pages/lesson-planner/LessonPlannerCoverage";
import LessonPlannerSettings from "./pages/lesson-planner/LessonPlannerSettings";
import LessonPlannerReports from "./pages/lesson-planner/LessonPlannerReports";
import LessonPlannerGuide from "./pages/lesson-planner/LessonPlannerGuide";
import NewLessonPlan from "./pages/lesson-planner/NewLessonPlan";

// PTM
import PTMDashboard from "./pages/ptm/PTMDashboard";
import SchedulePTM from "./pages/ptm/SchedulePTM";
import PTMAttendance from "./pages/ptm/PTMAttendance";
import PTMDetail from "./pages/ptm/PTMDetail";
import PTMFollowups from "./pages/ptm/PTMFollowups";
import PTMReports from "./pages/ptm/PTMReports";
import PTMGuide from "./pages/ptm/PTMGuide";

// HR Module
import HRDashboard from "./pages/hr/HRDashboard";
import HRStaffDirectory from "./pages/hr/HRStaffDirectory";
import HRAddStaff from "./pages/hr/HRAddStaff";
import HRStaffProfile from "./pages/hr/HRStaffProfile";
import HRAttendance from "./pages/hr/HRAttendance";
import HRPayroll from "./pages/hr/HRPayroll";
import HRSetSalary from "./pages/hr/HRSetSalary";
import HRApproveLeave from "./pages/hr/HRApproveLeave";
import HRLeaveTypes from "./pages/hr/HRLeaveTypes";
import HRDepartments from "./pages/hr/HRDepartments";
import HRDesignations from "./pages/hr/HRDesignations";
import HRIdCards from "./pages/hr/HRIdCards";
import HRSettings from "./pages/hr/HRSettings";
import HRLoans from "./pages/hr/HRLoans";
import HRSalaryTemplates from "./pages/hr/HRSalaryTemplates";
import HRSalaryTemplateForm from "./pages/hr/HRSalaryTemplateForm";
import HRAppraisals from "./pages/hr/HRAppraisals";
import HRAppraisalCycles from "./pages/hr/HRAppraisalCycles";
import HRAppraisalCriteria from "./pages/hr/HRAppraisalCriteria";

import ManageOnlineExams from "./pages/online-exams/ManageOnlineExams";
import QuestionBank from "./pages/online-exams/QuestionBank";
import BulkQuestionUpload from "./pages/online-exams/BulkQuestionUpload";
import AddNewQuestion from "./pages/online-exams/AddNewQuestion";
import ChaptersTopics from "./pages/online-exams/ChaptersTopics";

import Expense from "./pages/accounts/Expense";
import AddNewExpense from "./pages/accounts/AddNewExpense";
import IncomeHeads from "./pages/accounts/IncomeHeads";
import AddNewIncomeHead from "./pages/accounts/AddNewIncomeHead";
import ExpenseHeads from "./pages/accounts/ExpenseHeads";
import AddNewExpenseHead from "./pages/accounts/AddNewExpenseHead";
import BankAccounts from "./pages/accounts/BankAccounts";
import StudentDashboard from "./pages/students/StudentDashboard";
import SearchByPhoto from "./pages/students/SearchByPhoto";
import StudentAdmission from "./pages/students/StudentAdmission";
import CustomFields from "./pages/students/CustomFields";
import AddNewCustomField from "./pages/students/AddNewCustomField";
import StudentList from "./pages/students/StudentList";
import ParentsList from "./pages/students/ParentsList";
import AddParent from "./pages/students/AddParent";
import StudentAttendance from "./pages/students/StudentAttendance";
import BulkAttendanceUpload from "./pages/students/BulkAttendanceUpload";
import BehaviorRecords from "./pages/students/BehaviorRecords";
import AddBehaviorRecord from "./pages/students/AddBehaviorRecord";
import StudentHouses from "./pages/students/StudentHouses";
import AddStudentHouse from "./pages/students/AddStudentHouse";
import StudentCategories from "./pages/students/StudentCategories";
import AddStudentCategory from "./pages/students/AddStudentCategory";
import TCAndExit from "./pages/students/TCAndExit";
import StudentHealthRecords from "./pages/students/StudentHealthRecords";
import HealthDashboard from "./pages/students/HealthDashboard";

// Surveys Module
import SurveysDashboard from "./pages/surveys/SurveysDashboard";

// Academics Module
import AcademicDashboard from "./pages/academics/AcademicDashboard";
import AddNewClass from "./pages/academics/AddNewClass";
import AcademicSessions from "./pages/academics/AcademicSessions";
import YearEndRollover from "./pages/academics/YearEndRollover";
import AddNewSession from "./pages/academics/AddNewSession";
import AcademicClasses from "./pages/academics/AcademicClasses";
import AcademicSections from "./pages/academics/AcademicSections";
import AddNewSection from "./pages/academics/AddNewSection";
import AcademicSubjects from "./pages/academics/AcademicSubjects";
import AddNewSubject from "./pages/academics/AddNewSubject";
import AssignSubjects from "./pages/academics/AssignSubjects";
import AssignElectives from "./pages/academics/AssignElectives";
import AssignTeacher from "./pages/academics/AssignTeacher";
import ManagePeriods from "./pages/academics/ManagePeriods";
import Timetable from "./pages/academics/Timetable";
import Promote from "./pages/academics/Promote";
import FrontOfficeDashboard from "./pages/front-office/FrontOfficeDashboard";
import AdmissionEnquiries from "./pages/front-office/AdmissionEnquiries";
import AddNewEnquiry from "./pages/front-office/AddNewEnquiry";
import EnquiryDetails from "./pages/front-office/EnquiryDetails";
import VisitorBook from "./pages/front-office/VisitorBook";
import AddVisitorEntry from "./pages/front-office/AddVisitorEntry";
import VisitorDetails from "./pages/front-office/VisitorDetails";
import Complaints from "./pages/front-office/Complaints";
import AddComplaint from "./pages/front-office/AddComplaint";
import ComplaintDetails from "./pages/front-office/ComplaintDetails";
import PostalRecords from "./pages/front-office/PostalRecords";
import AddPostalRecord from "./pages/front-office/AddPostalRecord";
import GatePasses from "./pages/front-office/GatePasses";
import GateTerminal from "./pages/front-office/GateTerminal";
import IssueGatePass from "./pages/front-office/IssueGatePass";
import GatePassDetails from "./pages/front-office/GatePassDetails";
import CampusWorkers from "./pages/front-office/CampusWorkers";
import RegisterCampusWorker from "./pages/front-office/RegisterCampusWorker";
import CampusWorkerDetails from "./pages/front-office/CampusWorkerDetails";
import CampusWorkerInOutLog from "./pages/front-office/CampusWorkerInOutLog";
import LeadDashboard from "./pages/leads/LeadDashboard";
import PipelineBoard from "./pages/leads/PipelineBoard";
import SourcesAndStages from "./pages/leads/SourcesAndStages";
import AllLeads from "./pages/leads/AllLeads";
import LeadFollowUps from "./pages/leads/LeadFollowUps";
import LeadGuide from "./pages/leads/LeadGuide";
import CbcDashboard from "./pages/cbc/CbcDashboard";
import StrandsAndOutcomes from "./pages/cbc/StrandsAndOutcomes";
import CbcAssessments from "./pages/cbc/CbcAssessments";
import CoreCompetencies from "./pages/cbc/CoreCompetencies";
import PathwaysTracks from "./pages/cbc/PathwaysTracks";
import CbcReports from "./pages/cbc/CbcReports";
import ErpNavigator from "./pages/ErpNavigator";
import ContactSupport from "./pages/ContactSupport";
import MyProfile from "./pages/MyProfile";
import OnlineExamDashboard from "./pages/assessment/OnlineExamDashboard";
import AppsCenter from "./pages/AppsCenter";
import ContentSafety from "./pages/ContentSafety";
import HelpCenter from "./pages/HelpCenter";
import Messages from "./pages/Messages";
import ChatModeration from "./pages/ChatModeration";
import CommsWallet from "./pages/CommsWallet";
import BackupManagement from "./pages/BackupManagement";
import SchoolSettings from "./pages/SchoolSettings";
import RolesPermissions from "./pages/RolesPermissions";
import NotificationSettings from "./pages/NotificationSettings";
import AdmissionFormFields from "./pages/AdmissionFormFields";
import Subscription from "./pages/Subscription";
import ModuleSettings from "./pages/ModuleSettings";
import ReportsHub from "./pages/ReportsHub";
import StudyCenterDashboard from "./pages/study-center/StudyCenterDashboard";
import ManageLiveClasses from "./pages/live-classes/ManageLiveClasses";
import LiveClassSettings from "./pages/live-classes/LiveClassSettings";
import Templates from "./pages/certificates/Templates";
import GenerateDocument from "./pages/certificates/GenerateDocument";
import IdCardsStudent from "./pages/id-cards/IdCardsStudent";
import IdCardTemplates from "./pages/id-cards/IdCardTemplates";
import CanvasDesigner from "./pages/id-cards/CanvasDesigner";
import PaymentGateway from "./pages/PaymentGateway";
import AdmissionSettings from "./pages/AdmissionSettings";
import AuditTrail from "./pages/AuditTrail";
import SubscriptionHistory from "./pages/SubscriptionHistory";
import CameraWall from "./pages/cctv/CameraWall";
import Creatives from "./pages/Creatives";
import BirthdayManager from "./pages/BirthdayManager";
import AiChatbot from "./pages/help-center/AiChatbot";
import KbCategories from "./pages/help-center/KbCategories";
import FestivalGreetings from "./pages/engagement/FestivalGreetings";
import AutoSendSettings from "./pages/engagement/AutoSendSettings";
import FinanceGuide from "./pages/finance/FinanceGuide";
import OfflineExamsGuide from "./pages/assessment/OfflineExamsGuide";
import HRGuide from "./pages/hr/HRGuide";
import AssetManagementDashboard from "./pages/AssetManagementDashboard";
import HostelDashboard from "./pages/hostel/HostelDashboard";
import TransportDashboard from "./pages/transport/TransportDashboard";
import ComplianceDashboard from "./pages/compliance/ComplianceDashboard";
import NoticeBoard from "./pages/NoticeBoard";
import EventsHolidays from "./pages/EventsHolidays";
import ComposeBroadcast from "./pages/ComposeBroadcast";
import BroadcastHistory from "./pages/BroadcastHistory";
import ImageGallery from "./pages/ImageGallery";
import LibraryDashboard from "./pages/LibraryDashboard";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PortalHub from "./pages/PortalHub";
import PortalViewer from "./pages/PortalViewer";

function App() {
  return (
    <Routes>
      <Route path="/portal/:portalId" element={<PortalViewer />} />
      <Route path="/front-office/gate-passes/terminal" element={<GateTerminal />} />
      
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
        {/* Dashboard will be rendered inside the Outlet of MainLayout */}
        <Route index element={<Dashboard />} />
        <Route path="/portals" element={<PortalHub />} />

        {/* Global Navigation Hub, Profile & Messages */}
        <Route path="/erp-navigator" element={<ErpNavigator />} />
        <Route path="/contact-support/*" element={<ContactSupport />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/apps-center" element={<AppsCenter />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/chat-moderation" element={<ChatModeration />} />
        <Route path="/comms-wallet" element={<CommsWallet />} />
        <Route path="/content-safety" element={<ContentSafety />} />

        {/* CBC Routes (both /cbc/* and /cbc-academics/*) */}
        <Route path="/cbc/dashboard" element={<CbcDashboard />} />
        <Route path="/cbc-academics/dashboard" element={<CbcDashboard />} />
        <Route path="/cbc/strands-outcomes" element={<StrandsAndOutcomes />} />
        <Route path="/cbc-academics/strands-outcomes" element={<StrandsAndOutcomes />} />
        <Route path="/cbc/assessments" element={<CbcAssessments />} />
        <Route path="/cbc-academics/assessments" element={<CbcAssessments />} />
        <Route path="/cbc/core-competencies" element={<CoreCompetencies />} />
        <Route path="/cbc-academics/core-competencies" element={<CoreCompetencies />} />
        <Route path="/cbc/pathways-tracks" element={<PathwaysTracks />} />
        <Route path="/cbc-academics/pathways-tracks" element={<PathwaysTracks />} />
        <Route path="/cbc/reports" element={<CbcReports />} />
        <Route path="/cbc-academics/reports" element={<CbcReports />} />

        {/* Lead Management Extended Routes */}
        <Route path="/leads/all" element={<AllLeads />} />
        <Route path="/leads/follow-ups" element={<LeadFollowUps />} />
        <Route path="/leads/guide" element={<LeadGuide />} />

        {/* Online Exams Dashboard */}
        <Route path="/online-exams/dashboard" element={<OnlineExamDashboard />} />
        
        <Route path="/study-center/dashboard" element={<StudyCenterDashboard />} />
        <Route path="/study-center/classwork-logbook" element={<StudyCenterDashboard initialTab="Classwork & Logbook" />} />
        <Route path="/study-center/manage-syllabus" element={<StudyCenterDashboard initialTab="Manage Syllabus" />} />
        <Route path="/study-center/manage-resources" element={<StudyCenterDashboard initialTab="Manage Resources" />} />
        <Route path="/study-center/homework-assignments" element={<StudyCenterDashboard initialTab="Homework & Assignments" />} />
        
        <Route path="/certificates" element={<GenerateDocument />} />
        <Route path="/certificates/templates" element={<Templates />} />
        <Route path="/certificates/document" element={<GenerateDocument />} />
        <Route path="/certificates/documents" element={<GenerateDocument />} />
        
        <Route path="/id-cards/student" element={<IdCardsStudent initialTab="student" />} />
        <Route path="/id-cards/staff" element={<HRIdCards />} />
        <Route path="/id-cards/designs" element={<IdCardsStudent initialTab="designs" />} />
        <Route path="/id-cards/templates" element={<IdCardTemplates />} />
        <Route path="/id-cards/canvas-designer" element={<CanvasDesigner />} />
        
        <Route path="/settings/payment-gateway" element={<PaymentGateway />} />
        <Route path="/settings/admission-settings" element={<AdmissionSettings />} />
        <Route path="/admission-settings" element={<AdmissionSettings />} />
        <Route path="/settings/audit-tran" element={<AuditTrail />} />
        <Route path="/settings/audit-trail" element={<AuditTrail />} />
        <Route path="/settings/subscription-history" element={<SubscriptionHistory />} />
        <Route path="/settings/content-safety" element={<ContentSafety />} />
        <Route path="/help-center/articles" element={<HelpCenter />} />
        
        <Route path="/apps-center" element={<AppsCenter />} />
        <Route path="/live-classes" element={<ManageLiveClasses />} />
        <Route path="/live-classes/manage" element={<ManageLiveClasses />} />
        <Route path="/live-classes/settings" element={<LiveClassSettings />} />
        
        {/* Library routes */}
        <Route path="/library/dashboard" element={<LibraryDashboard />} />
        <Route path="/library/issue-return" element={<LibraryDashboard initialTab="Issue/Return Book" />} />
        <Route path="/library/issue-retur" element={<LibraryDashboard initialTab="Issue/Return Book" />} />
        <Route path="/library/manage" element={<LibraryDashboard initialTab="Manage Books" />} />
        <Route path="/library/categories" element={<LibraryDashboard initialTab="Categories" />} />
        
        {/* specific routes */}
        <Route path="/finance/dashboard" element={<FinanceDashboard />} />
        <Route path="/finance/collect" element={<CollectFees />} />
        <Route path="/finance/collect/:id" element={<StudentFeeCollection />} />
        <Route path="/finance/search-due-fees" element={<SearchDueFees />} />
        <Route path="/finance/transactions" element={<AllTransactions />} />

        {/* Communicate routes */}
        <Route path="/communicate/notice-board" element={<NoticeBoard />} />
        <Route path="/communicate/events-holiday" element={<EventsHolidays />} />
        <Route path="/communicate/events-holidays" element={<EventsHolidays />} />
        <Route path="/communicate/compose-broadcast" element={<ComposeBroadcast />} />
        <Route path="/communicate/broadcast-history" element={<BroadcastHistory />} />
        <Route path="/communicate/image-gallery" element={<ImageGallery />} />

        {/* HRMS routes */}
        <Route path="/finance/receipt/:id" element={<FeeReceipt />} />
        <Route path="/finance/online-transactions" element={<OnlineTransactions />} />
        <Route path="/finance/challans" element={<FeeChallans />} />
        <Route path="/finance/generate-challan" element={<GenerateFeeChallan />} />
        <Route path="/finance/challan/:id" element={<ChallanDetails />} />
        <Route path="/finance/print-challan/:id" element={<PrintChallan />} />
        <Route path="/finance/assign" element={<AssignFees />} />
        <Route path="/finance/carry-forward" element={<FeesCarryForward />} />
        <Route path="/finance/groups" element={<FeeGroups />} />
        <Route path="/finance/groups/add" element={<AddNewFeeGroup />} />
        <Route path="/finance/discount" element={<FeesDiscount />} />
        <Route path="/finance/discount/add" element={<AddNewFeeDiscount />} />
        <Route path="/finance/types" element={<FeeTypes />} />
        <Route path="/finance/types/add" element={<AddNewFeeType />} />
        <Route path="/finance/generate-slip" element={<GenerateDueSlip />} />
        <Route path="/finance/slip-history" element={<DueSlipHistory />} />
        <Route path="/finance/audit" element={<FeeDataAudit />} />
        <Route path="/finance/data-audit" element={<FeeDataAudit />} />

        {/* Accounts module routes */}
        <Route path="/accounts/dashboard" element={<AccountsDashboard />} />
        <Route path="/accounts/income" element={<Income />} />
        <Route path="/accounts/income/add" element={<AddNewIncome />} />
        <Route path="/accounts/expense" element={<Expense />} />
        <Route path="/accounts/expense/add" element={<AddNewExpense />} />
        <Route path="/accounts/income-heads" element={<IncomeHeads />} />
        <Route path="/accounts/income-heads/add" element={<AddNewIncomeHead />} />
        <Route path="/accounts/expense-heads" element={<ExpenseHeads />} />
        <Route path="/accounts/expense-heads/add" element={<AddNewExpenseHead />} />
        <Route path="/accounts/bank-accounts" element={<BankAccounts />} />

        {/* Student Module */}
        <Route path="/students/dashboard" element={<StudentDashboard />} />
        <Route path="/students/list" element={<StudentList />} />
        <Route path="/students/search-photo" element={<SearchByPhoto />} />
        <Route path="/students/admission" element={<StudentAdmission />} />
        <Route path="/students/custom-fields" element={<CustomFields />} />
        <Route path="/students/custom-fields/add" element={<CustomFields />} />
        <Route path="/students/parents" element={<ParentsList />} />
        <Route path="/students/parents/add" element={<AddParent />} />
        <Route path="/students/attendance" element={<StudentAttendance />} />
        <Route path="/students/attendance/import" element={<BulkAttendanceUpload />} />
        <Route path="/students/behavior" element={<BehaviorRecords />} />
        <Route path="/students/behavior/add" element={<AddBehaviorRecord />} />
        <Route path="/students/houses" element={<StudentHouses />} />
        <Route path="/students/houses/add" element={<AddStudentHouse />} />
        <Route path="/students/categories" element={<StudentCategories />} />
        <Route path="/students/categories/add" element={<AddStudentCategory />} />
        <Route path="/students/tc" element={<TCAndExit />} />
        <Route path="/students/health" element={<StudentHealthRecords />} />
        <Route path="/students/health/:id" element={<HealthDashboard />} />

        {/* Academics Module */}
        <Route path="/academics/dashboard" element={<AcademicDashboard />} />
        <Route path="/academics/sessions" element={<AcademicSessions />} />
        <Route path="/academics/sessions/add" element={<AddNewSession />} />
        <Route path="/academics/rollover" element={<YearEndRollover />} />
        <Route path="/academics/classes" element={<AcademicClasses />} />
        <Route path="/academics/classes/add" element={<AddNewClass />} />
        <Route path="/academics/sections" element={<AcademicSections />} />
        <Route path="/academics/sections/add" element={<AddNewSection />} />
        <Route path="/academics/subjects" element={<AcademicSubjects />} />
        <Route path="/academics/subjects/add" element={<AddNewSubject />} />
        <Route path="/academics/assign-subjects" element={<AssignSubjects />} />
        <Route path="/academics/assign-electives" element={<AssignElectives />} />
        <Route path="/academics/assign-class-teacher" element={<AssignTeacher />} />
        <Route path="/academics/assign-teacher" element={<AssignTeacher />} />
        <Route path="/academics/manage-periods" element={<ManagePeriods />} />
        <Route path="/academics/timetable" element={<Timetable />} />
        <Route path="/academics/promote" element={<Promote />} />

        {/* Front Office Routes */}
        <Route path="/front-office/dashboard" element={<FrontOfficeDashboard />} />
        <Route path="/front-office/admission-enquiries" element={<AdmissionEnquiries />} />
        <Route path="/front-office/admission-enquiries/add" element={<AddNewEnquiry />} />
        <Route path="/front-office/admission-enquiries/view/:id" element={<EnquiryDetails />} />
        <Route path="/front-office/visitor-book" element={<VisitorBook />} />
        <Route path="/front-office/visitor-book/add" element={<AddVisitorEntry />} />
        <Route path="/front-office/visitor-book/edit/:id" element={<AddVisitorEntry />} />
        <Route path="/front-office/visitor-book/view/:id" element={<VisitorDetails />} />
        <Route path="/front-office/complaints" element={<Complaints />} />
        <Route path="/front-office/complaints/add" element={<AddComplaint />} />
        <Route path="/front-office/complaints/edit/:id" element={<AddComplaint />} />
        <Route path="/front-office/complaints/view/:id" element={<ComplaintDetails />} />
        <Route path="/front-office/postal-records" element={<PostalRecords />} />
        <Route path="/front-office/postal-records/add" element={<AddPostalRecord />} />
        <Route path="/front-office/postal-records/edit/:id" element={<AddPostalRecord />} />
        <Route path="/front-office/gate-passes" element={<GatePasses />} />
        <Route path="/front-office/gate-passes/issue" element={<IssueGatePass />} />
        <Route path="/front-office/gate-passes/view/:id" element={<GatePassDetails />} />
        <Route path="/front-office/gate-passes/terminal" element={<GateTerminal />} />
        <Route path="/front-office/campus-workers" element={<CampusWorkers />} />
        <Route path="/front-office/campus-workers/add" element={<RegisterCampusWorker />} />
        <Route path="/front-office/campus-workers/edit/:id" element={<RegisterCampusWorker />} />
        <Route path="/front-office/campus-workers/view/:id" element={<CampusWorkerDetails />} />
        <Route path="/front-office/campus-workers/logs" element={<CampusWorkerInOutLog />} />
        
        {/* Leads */}
        <Route path="/leads" element={<LeadDashboard />} />
        <Route path="/leads/dashboard" element={<LeadDashboard />} />
        <Route path="/leads/pipeline" element={<PipelineBoard />} />
        <Route path="/leads/all" element={<AllLeads />} />
        <Route path="/leads/follow-ups" element={<LeadFollowUps />} />
        <Route path="/leads/sources-stages" element={<SourcesAndStages />} />
        <Route path="/leads/guide" element={<LeadGuide />} />

        
        {/* Communication Routes */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat-moderation" element={<ChatModeration />} />
        <Route path="/comms-wallet" element={<CommsWallet />} />
        <Route path="/backup" element={<BackupManagement />} />
        <Route path="/settings/backup" element={<BackupManagement />} />
        {/* Settings & Billing Routes */}
        <Route path="/settings" element={<Navigate to="/settings/school-settings" replace />} />
        <Route path="/settings/school-settings" element={<SchoolSettings />} />
        <Route path="/settings/custom-fields" element={<CustomFields />} />
        <Route path="/settings/roles-permissions" element={<RolesPermissions />} />
        <Route path="/settings/payment-gateway" element={<PaymentGateway />} />
        <Route path="/settings/notification-settings" element={<NotificationSettings />} />
        <Route path="/settings/admission-settings" element={<AdmissionSettings />} />
        <Route path="/settings/admission-form-fields" element={<AdmissionFormFields />} />
        <Route path="/settings/admission-form-field" element={<AdmissionFormFields />} />
        <Route path="/settings/audit-trail" element={<AuditTrail />} />
        <Route path="/settings/subscription" element={<Subscription />} />
        <Route path="/settings/subscription-history" element={<SubscriptionHistory />} />
        <Route path="/settings/module-settings" element={<ModuleSettings />} />
        <Route path="/settings/content-safety" element={<ContentSafety />} />
        <Route path="/reports" element={<ReportsHub />} />
        <Route path="/cctv" element={<Navigate to="/cctv/camera-wall" replace />} />
        <Route path="/cctv/camera-wall" element={<CameraWall />} />
        <Route path="/cctv/cameras" element={<CameraWall />} />
        <Route path="/cctv/access-log" element={<CameraWall />} />
        <Route path="/engagement" element={<Navigate to="/engagement/birthday-manager" replace />} />
        <Route path="/engagement/creatives" element={<Creatives />} />
        <Route path="/engagement/birthday-manager" element={<BirthdayManager />} />
        <Route path="/engagement/festival-greetings" element={<FestivalGreetings />} />
        <Route path="/engagement/auto-send-settings" element={<AutoSendSettings />} />
        <Route path="/asset-management" element={<Navigate to="/asset-management/dashboard" replace />} />
        <Route path="/asset-management/:tab" element={<AssetManagementDashboard />} />
        <Route path="/help-center" element={<Navigate to="/help-center/articles" replace />} />
        <Route path="/help-center/articles" element={<HelpCenter />} />
        <Route path="/help-center/categories" element={<KbCategories />} />
        <Route path="/help-center/ai-chatbot" element={<AiChatbot />} />
        <Route path="/help-center/tickets/*" element={<ContactSupport />} />
        <Route path="/hostel" element={<Navigate to="/hostel/dashboard" replace />} />
        <Route path="/hostel/dashboard" element={<HostelDashboard />} />
        <Route path="/hostel/student-allocation" element={<HostelDashboard />} />
        <Route path="/hostel/manage-rooms" element={<HostelDashboard />} />
        <Route path="/hostel/room-types" element={<HostelDashboard />} />
        <Route path="/hostel/manage-hostels" element={<HostelDashboard />} />
        <Route path="/transport/dashboard" element={<TransportDashboard />} />
        <Route path="/transport/live-operations" element={<TransportDashboard />} />
        <Route path="/transport/manage-vehicles" element={<TransportDashboard />} />
        <Route path="/transport/manage-routes" element={<TransportDashboard />} />
        <Route path="/transport/live-tracking" element={<TransportDashboard />} />
        <Route path="/transport/drivers" element={<TransportDashboard />} />
        <Route path="/transport/boarding-register" element={<TransportDashboard />} />
        {/* Compliance & Governance routes */}
        <Route path="/compliance/overview" element={<ComplianceDashboard />} />
        <Route path="/compliance/packs" element={<ComplianceDashboard />} />
        <Route path="/compliance/school-profile" element={<ComplianceDashboard />} />
        <Route path="/compliance/field-settings" element={<ComplianceDashboard />} />
        <Route path="/compliance/document-vault" element={<ComplianceDashboard />} />
        <Route path="/compliance/checklist" element={<ComplianceDashboard />} />
        <Route path="/compliance/data-records" element={<ComplianceDashboard />} />
        <Route path="/compliance/data-validator" element={<ComplianceDashboard />} />
        <Route path="/compliance/government-reports" element={<ComplianceDashboard />} />
        <Route path="/compliance/inspections" element={<ComplianceDashboard />} />
        <Route path="/compliance/calendar" element={<ComplianceDashboard />} />
        
        {/* Surveys Module */}
        <Route path="/surveys" element={<Navigate to="/surveys/dashboard" replace />} />
        <Route path="/surveys/dashboard" element={<SurveysDashboard />} />
        <Route path="/surveys/create" element={<SurveysDashboard />} />
        <Route path="/surveys/all" element={<SurveysDashboard />} />
        <Route path="/surveys/my-surveys" element={<SurveysDashboard />} />
        <Route path="/surveys/feedback-triage" element={<SurveysDashboard />} />
        <Route path="/surveys/guide" element={<SurveysDashboard />} />
        <Route path="/surveys/templates" element={<SurveysDashboard />} />
        
        {/* Attendance Module */}
        <Route path="/qr-attendance/attendance" element={<QRAttendance />} />
        <Route path="/qr-attendance/setting" element={<QRAttendanceSettings />} />
        <Route path="/qr-attendance/report" element={<QRAttendanceReport />} />
        <Route path="/qr-attendance/scan-audit" element={<QRScanAuditLog />} />
        
        {/* Biometric Module */}
        <Route path="/biometric/all-devices" element={<BiometricDevices />} />
        <Route path="/biometric/add-device" element={<BiometricDevices />} />
        <Route path="/biometric/attendance-logs" element={<BiometricDevices />} />
        <Route path="/biometric/live-log" element={<BiometricDevices />} />
        <Route path="/biometric/face-monitoring" element={<BiometricDevices />} />
        <Route path="/biometric/review-queue" element={<BiometricDevices />} />
        <Route path="/biometric/agent-logs" element={<BiometricDevices />} />
        
        {/* Assessment Module */}
        <Route path="/assessment" element={<AssessmentDashboard />} />
        <Route path="/assessment/dashboard" element={<AssessmentDashboard />} />
        <Route path="/assessment/list" element={<AssessmentDashboard />} />
        <Route path="/assessment/assessments" element={<AssessmentDashboard />} />
        <Route path="/assessment/new" element={<AssessmentDashboard />} />
        <Route path="/assessment/enter-marks" element={<AssessmentDashboard />} />
        <Route path="/assessment/enter-marks/:id" element={<AssessmentDashboard />} />
        <Route path="/assessment/analytics" element={<AssessmentDashboard />} />
        <Route path="/assessment/reports" element={<AssessmentDashboard />} />
        <Route path="/assessment/student-report" element={<AssessmentDashboard />} />
        <Route path="/assessment/rank-list" element={<AssessmentDashboard />} />
        <Route path="/assessment/guide" element={<AssessmentDashboard />} />
        
        {/* Offline Exams Module */}
        <Route path="/offline-exams/dashboard" element={<OfflineExaminations />} />
        <Route path="/offline-exams/manage" element={<ManageOfflineExams />} />
        <Route path="/offline-exams/quick-setup" element={<QuickExamSetup />} />
        <Route path="/offline-exams/datesheet" element={<Datesheet />} />
        <Route path="/offline-exams/admit-cards" element={<AdmitCards />} />
        <Route path="/offline-exams/card-settings" element={<CardSettings />} />
        <Route path="/offline-exams/result-settings" element={<ResultSettings />} />
        <Route path="/offline-exams/edit" element={<EditExam />} />
        <Route path="/offline-exams/types/add" element={<AddExamType />} />
        <Route path="/offline-exams/types" element={<OfflineExamTypes />} />
        <Route path="/offline-exams/schedule-marks" element={<ScheduleMarksSetup />} />
        <Route path="/offline-exams/enter-marks" element={<EnterMarks />} />
        <Route path="/offline-exams/cocurricular-areas" element={<ManageCocurricular />} />
        <Route path="/offline-exams/cocurricular-areas/add" element={<AddCocurricular />} />
        <Route path="/offline-exams/cocurricular-areas/edit" element={<EditCocurricular />} />
        <Route path="/offline-exams/cocurricular-grades" element={<CocurricularGrades />} />
        <Route path="/offline-exams/manage-grades" element={<ManageGrades />} />
        <Route path="/offline-exams/manage-grades/add" element={<AddGrade />} />
        <Route path="/offline-exams/manage-grades/edit" element={<EditGrade />} />
        <Route path="/offline-exams/quick-setup" element={<QuickExamSetup />} />
        
        <Route path="/offline-exams/report-card-setups" element={<ReportCardSetups />} />
        <Route path="/offline-exams/report-card-setups/add" element={<AddReportCardSetup />} />
        <Route path="/offline-exams/report-card-setups/edit" element={<EditReportCardSetup />} />

        <Route path="/offline-exams/generate-marksheet" element={<GenerateMarksheet />} />
        <Route path="/offline-exams/report-card-view" element={<ReportCardView />} />
        <Route path="/offline-exams/upload-marksheet" element={<UploadMarksheet />} />
        <Route path="/offline-exams/manage-uploads" element={<ManageUploads />} />
        <Route path="/offline-exams/teacher-remarks" element={<TeacherRemarks />} />
        <Route path="/offline-exams/datesheet/manage" element={<ManageDatesheet />} />

        <Route path="/osm-module/dashboard" element={<OSMDashboard />} />
        <Route path="/osm-module/sessions" element={<OSMSessions />} />
        <Route path="/osm-module/sessions/details" element={<OSMSessionDetails />} />
        <Route path="/osm-module/sessions/new" element={<OSMNewSession />} />
        <Route path="/osm-module/evaluate" element={<OSMEvaluate />} />
        <Route path="/osm-module/moderation" element={<OSMModeration />} />
        <Route path="/osm-module/reports" element={<OSMReports />} />
        <Route path="/osm-module/guide" element={<OSMGuide />} />

        <Route path="/lesson-planner/dashboard" element={<LessonPlannerDashboard />} />
        <Route path="/lesson-planner/plans" element={<LessonPlans />} />
        <Route path="/lesson-planner/review" element={<LessonPlannerReview />} />
        <Route path="/lesson-planner/approvals" element={<LessonPlannerApprovals />} />
        <Route path="/lesson-planner/coverage" element={<LessonPlannerCoverage />} />
        <Route path="/lesson-planner/settings" element={<LessonPlannerSettings />} />
        <Route path="/lesson-planner/reports" element={<LessonPlannerReports />} />
        <Route path="/lesson-planner/guide" element={<LessonPlannerGuide />} />
        <Route path="/lesson-planner/new" element={<NewLessonPlan />} />

        <Route path="/ptm/dashboard" element={<PTMDashboard />} />
        <Route path="/ptm/schedule" element={<SchedulePTM />} />
        <Route path="/ptm/attendance" element={<PTMAttendance />} />
        <Route path="/ptm/attendance-remarks" element={<PTMAttendance />} />
        <Route path="/ptm/details/:id" element={<PTMDetail />} />
        <Route path="/ptm/followups" element={<PTMFollowups />} />
        <Route path="/ptm/follow-ups" element={<PTMFollowups />} />
        <Route path="/ptm/reports" element={<PTMReports />} />
        <Route path="/ptm/guide" element={<PTMGuide />} />

        {/* HR Module */}
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/staff" element={<HRStaffDirectory />} />
        <Route path="/hr/staff/new" element={<HRAddStaff />} />
        <Route path="/hr/staff/edit/:id" element={<HRAddStaff />} />
        <Route path="/hr/staff/profile/:id" element={<HRStaffProfile />} />
        <Route path="/hr/attendance" element={<HRAttendance />} />
        <Route path="/hr/staff-attendance" element={<HRAttendance />} />
        <Route path="/hr/payroll" element={<HRPayroll />} />
        <Route path="/hr/set-salary" element={<HRSetSalary />} />
        <Route path="/hr/approve-leave" element={<HRApproveLeave />} />
        <Route path="/hr/leave-types" element={<HRLeaveTypes />} />
        
        {/* NEW HR ROUTES FOR APPRAISALS */}
        <Route path="/hr/appraisals" element={<HRAppraisals />} />
        <Route path="/hr/appraisal-cycles" element={<HRAppraisalCycles />} />
        <Route path="/hr/appraisal-criteria" element={<HRAppraisalCriteria />} />
        
        <Route path="/hr/departments" element={<HRDepartments />} />
        <Route path="/hr/designations" element={<HRDesignations />} />
        <Route path="/hr/id-cards" element={<HRIdCards />} />
        <Route path="/hr/manage-loans" element={<HRLoans />} />
        <Route path="/hr/salary-templates" element={<HRSalaryTemplates />} />
        <Route path="/hr/salary-templates/create" element={<HRSalaryTemplateForm />} />
        <Route path="/hr/salary-templates/edit/:id" element={<HRSalaryTemplateForm isEdit={true} />} />
        <Route path="/hr/settings" element={<HRSettings />} />
        {/* HR Route Aliases */}
        <Route path="/hr/leaves/approve" element={<HRApproveLeave />} />
        <Route path="/hr/leaves/types" element={<HRLeaveTypes />} />
        <Route path="/hr/salary/set" element={<HRSetSalary />} />
        <Route path="/hr/salary/templates" element={<HRSalaryTemplates />} />

        <Route path="/online-exams/manage" element={<ManageOnlineExams />} />
        <Route path="/online-exams/question-bank" element={<QuestionBank />} />
        <Route path="/online-exams/question-bank/bulk-upload" element={<BulkQuestionUpload />} />
        <Route path="/online-exams/question-bank/new" element={<AddNewQuestion />} />
        <Route path="/online-exams/chapters-topics" element={<ChaptersTopics />} />

        <Route path="/assessment/offline-exams" element={<OfflineExaminations />} />

        <Route path="/assessment/new" element={<AssessmentDashboard />} />
        <Route path="/assessment/assessments" element={<AssessmentDashboard />} />
        <Route path="/assessment/list" element={<AssessmentDashboard />} />
        <Route path="/assessment/reports" element={<AssessmentDashboard />} />
        <Route path="/assessment/analytics" element={<AssessmentDashboard />} />
        <Route path="/assessment/student-report" element={<AssessmentDashboard />} />
        <Route path="/assessment/rank-list" element={<AssessmentDashboard />} />
        <Route path="/assessment/guide" element={<AssessmentDashboard />} />
        
        {/* Finance Guide & Aliases */}
        <Route path="/finance/guide" element={<FinanceGuide />} />
        <Route path="/finance/discounts" element={<FeesDiscount />} />
        <Route path="/finance/due-slips/history" element={<DueSlipHistory />} />

        {/* Offline Exams Guide */}
        <Route path="/offline-exams/guide" element={<OfflineExamsGuide />} />

        {/* HR Guide & Aliases */}
        <Route path="/hr/guide" element={<HRGuide />} />
        <Route path="/hr/leaves/apply" element={<HRApproveLeave />} />
        <Route path="/hr/apply-leave" element={<HRApproveLeave />} />

        {/* Front Office Aliases */}
        <Route path="/front-office/visitors" element={<VisitorBook />} />

        {/* Attendance & Biometric Aliases */}
        <Route path="/attendance/qr-attendance" element={<QRAttendance />} />
        <Route path="/attendance/biometric" element={<BiometricDevices />} />
        <Route path="/biometric" element={<Navigate to="/biometric/all-devices" replace />} />
        <Route path="/biometric/devices" element={<BiometricDevices />} />
        <Route path="/qr-attendance" element={<Navigate to="/qr-attendance/attendance" replace />} />

        {/* OSM Aliases */}
        <Route path="/osm" element={<Navigate to="/osm-module/dashboard" replace />} />
        <Route path="/osm/dashboard" element={<OSMDashboard />} />
        <Route path="/osm/sessions" element={<OSMSessions />} />
        <Route path="/osm/reports" element={<OSMReports />} />
        <Route path="/osm/guide" element={<OSMGuide />} />

        {/* Assets & Inventory Aliases */}
        <Route path="/assets" element={<Navigate to="/asset-management/dashboard" replace />} />
        <Route path="/assets/dashboard" element={<AssetManagementDashboard />} />
        <Route path="/assets/:tab" element={<AssetManagementDashboard />} />
        <Route path="/asset-management" element={<AssetManagementDashboard />} />
        <Route path="/asset-management/dashboard" element={<AssetManagementDashboard />} />
        <Route path="/asset-management/:tab" element={<AssetManagementDashboard />} />
        <Route path="/inventory" element={<Navigate to="/asset-management/dashboard" replace />} />
        <Route path="/inventory/dashboard" element={<Navigate to="/asset-management/dashboard" replace />} />

        {/* Engagement & Birthdays */}
        <Route path="/birthdays" element={<BirthdayManager />} />
        <Route path="/engagement" element={<BirthdayManager />} />
        <Route path="/engagement/birthday-manager" element={<BirthdayManager />} />
        <Route path="/engagement/creatives" element={<Creatives />} />
        <Route path="/engagement/festival-greetings" element={<FestivalGreetings />} />
        <Route path="/engagement/auto-send-settings" element={<AutoSendSettings />} />
        <Route path="/events-holidays" element={<EventsHolidays />} />

        {/* Reports Hub */}
        <Route path="/reports-hub" element={<ReportsHub />} />

        {/* Compliance Aliases */}
        <Route path="/compliance" element={<Navigate to="/compliance/overview" replace />} />
        <Route path="/compliance/dashboard" element={<Navigate to="/compliance/overview" replace />} />

        {/* Support, Settings & Timetable Aliases */}
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/contact-support/new" element={<ContactSupport />} />
        <Route path="/school-settings" element={<Navigate to="/settings/school-settings" replace />} />
        <Route path="/timetable" element={<Navigate to="/academics/timetable" replace />} />
        <Route path="/backup" element={<BackupManagement />} />
        <Route path="/settings/backup" element={<BackupManagement />} />

        {/* Placeholder routes for other menu items to avoid 404s */}
        <Route path="*" element={<UnderConstruction />} />
      </Route>
      </Route>
    </Routes>
  );
}

export default App;
