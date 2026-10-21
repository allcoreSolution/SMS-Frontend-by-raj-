import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/main_wrapper.dart';
import '../../core/widgets/teacher_wrapper.dart';
import '../../features/auth/presentation/splash_screen.dart';
import '../../features/auth/presentation/role_selection_screen.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/teacher_login_screen.dart';
import '../../features/auth/presentation/teacher_register_screen.dart';
import '../../features/auth/presentation/staff_login_screen.dart';
import '../../features/auth/presentation/register_screen.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/teacher/presentation/teacher_dashboard_screen.dart';
import '../../features/teacher/presentation/teacher_self_attendance_screen.dart';
import '../../features/teacher/presentation/teacher_attendance_screen.dart';
import '../../features/teacher/presentation/teacher_live_classes_screen.dart';
import '../../features/teacher/presentation/teacher_my_classes_screen.dart';
import '../../features/teacher/presentation/teacher_homework_screen.dart';
import '../../features/teacher/presentation/teacher_timetable_screen.dart';
import '../../features/teacher/presentation/teacher_exams_results_screen.dart';
import '../../features/teacher/presentation/teacher_leave_management_screen.dart';
import '../../features/teacher/presentation/teacher_salary_slip_screen.dart';
import '../../features/teacher/presentation/teacher_documents_screen.dart';
import '../../features/teacher/presentation/teacher_messages_screen.dart';
import '../../features/teacher/presentation/teacher_profile_screen.dart';
import '../../features/teacher/presentation/teacher_notice_board_screen.dart';
import '../../features/teacher/presentation/teacher_marks_entry_screen.dart';
import '../../features/teacher/presentation/teacher_change_password_screen.dart';
import '../../features/teacher/presentation/teacher_subjects_screen.dart';
import '../../features/teacher/presentation/teacher_study_material_screen.dart';
import '../../features/teacher/presentation/teacher_performance_screen.dart';
import '../../features/teacher/presentation/teacher_complaint_screen.dart';
import '../../features/teacher/presentation/teacher_exam_management_screen.dart';
import '../../features/teacher/presentation/teacher_all_services_screen.dart';
import '../../features/teacher/presentation/teacher_document_viewer_screen.dart';
import '../../features/teacher/presentation/teacher_id_card_screen.dart';
import '../../features/staff/presentation/staff_dashboard_screen.dart';
import '../../features/staff/presentation/staff_profile_screen.dart';
import '../../features/staff/presentation/staff_directory_screen.dart';
import '../../features/staff/presentation/staff_fees_screen.dart';
import '../../features/staff/presentation/staff_attendance_screen.dart';
import '../../features/staff/presentation/staff_leave_management_screen.dart';
import '../../features/staff/presentation/staff_salary_screen.dart';
import '../../features/staff/presentation/staff_notice_board_screen.dart';
import '../../features/staff/presentation/staff_documents_screen.dart';
import '../../features/staff/presentation/staff_id_card_screen.dart';
import '../../features/staff/presentation/staff_messages_screen.dart';
import '../../features/staff/presentation/staff_settings_screen.dart';
import '../../features/staff/presentation/staff_change_password_screen.dart';
import '../../features/auth/presentation/staff_register_screen.dart';
import '../../core/widgets/staff_wrapper.dart';
import '../../features/auth/presentation/driver_login_screen.dart';
import '../../features/auth/presentation/driver_register_screen.dart';
import '../../core/widgets/driver_wrapper.dart';
import '../../features/driver/presentation/driver_dashboard_screen.dart';
import '../../features/driver/presentation/driver_tracking_screen.dart';
import '../../features/driver/presentation/driver_contacts_screen.dart';
import '../../features/driver/presentation/driver_attendance_screen.dart';
import '../../features/driver/presentation/driver_leaves_screen.dart';
import '../../features/driver/presentation/driver_salary_screen.dart';
import '../../features/driver/presentation/driver_profile_screen.dart';
import '../../features/driver/presentation/driver_documents_screen.dart';
import '../../features/driver/presentation/driver_id_card_screen.dart';
import '../../features/driver/presentation/driver_settings_screen.dart';
import '../../features/driver/presentation/driver_notices_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/profile/presentation/documents_screen.dart';
import '../../features/profile/presentation/change_password_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';
import '../../features/settings/presentation/all_services_screen.dart';
import '../../features/academics/presentation/attendance_screen.dart';
import '../../features/academics/presentation/timetable_screen.dart';
import '../../features/academics/presentation/homework_screen.dart';
import '../../features/academics/presentation/assignments_screen.dart';
import '../../features/academics/presentation/study_material_screen.dart';
import '../../features/academics/presentation/online_classes_screen.dart';
import '../../features/academics/presentation/online_exams_screen.dart';
import '../../features/academics/presentation/exam_results_screen.dart';
import '../../features/finance/presentation/fee_details_screen.dart';
import '../../features/services/presentation/notice_board_screen.dart';
import '../../features/services/presentation/events_screen.dart';
import '../../features/services/presentation/leave_management_screen.dart';
import '../../features/services/presentation/complaint_screen.dart';
import '../../features/services/presentation/certificates_screen.dart';
import '../../features/services/presentation/transport_screen.dart';
import '../../features/services/presentation/hostel_screen.dart';
import '../../features/services/presentation/staff_details_screen.dart';
import '../../features/academics/presentation/coaching_screen.dart';

Page<dynamic> _animatedPage(
  BuildContext context,
  GoRouterState state,
  Widget child,
) {
  return CustomTransitionPage<void>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: CurveTween(curve: Curves.easeOut).animate(animation),
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0.04, 0),
            end: Offset.zero,
          ).animate(
            CurvedAnimation(parent: animation, curve: Curves.easeOutCubic),
          ),
          child: child,
        ),
      );
    },
    transitionDuration: const Duration(milliseconds: 200),
  );
}

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        name: 'splash',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const SplashScreen()),
      ),
      GoRoute(
        path: '/role-selection',
        name: 'role-selection',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const RoleSelectionScreen()),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const LoginScreen()),
      ),
      GoRoute(
        path: '/teacher-login',
        name: 'teacher-login',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const TeacherLoginScreen()),
      ),
      GoRoute(
        path: '/teacher-register',
        name: 'teacher-register',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const TeacherRegisterScreen()),
      ),
      GoRoute(
        path: '/staff-login',
        name: 'staff-login',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const StaffLoginScreen()),
      ),
      GoRoute(
        path: '/staff-register',
        name: 'staff-register',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const StaffRegisterScreen()),
      ),
      GoRoute(
        path: '/staff-change-password',
        name: 'staff-change-password',
        pageBuilder:
            (context, state) => _animatedPage(
              context,
              state,
              const StaffChangePasswordScreen(),
            ),
      ),
      GoRoute(
        path: '/staff-directory',
        name: 'staff-directory',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const StaffDirectoryScreen()),
      ),
      GoRoute(
        path: '/staff-fees',
        name: 'staff-fees',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const StaffFeesScreen()),
      ),

      // ════════════════ EMPLOYEE PORTAL SHELL ROUTE (FIXED BOTTOM BAR) ════════════════
      ShellRoute(
        builder: (context, state, child) => StaffWrapper(child: child),
        routes: [
          GoRoute(
            path: '/staff-dashboard',
            name: 'staff-dashboard',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffDashboardScreen()),
          ),
          GoRoute(
            path: '/staff-profile',
            name: 'staff-profile',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffProfileScreen()),
          ),
          GoRoute(
            path: '/staff-attendance',
            name: 'staff-attendance',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const StaffAttendanceScreen(),
                ),
          ),
          GoRoute(
            path: '/staff-leaves',
            name: 'staff-leaves',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const StaffLeaveManagementScreen(),
                ),
          ),
          GoRoute(
            path: '/staff-salary',
            name: 'staff-salary',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffSalaryScreen()),
          ),
          GoRoute(
            path: '/staff-notices',
            name: 'staff-notices',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const StaffNoticeBoardScreen(),
                ),
          ),
          GoRoute(
            path: '/staff-documents',
            name: 'staff-documents',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffDocumentsScreen()),
          ),
          GoRoute(
            path: '/staff-id-card',
            name: 'staff-id-card',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffIdCardScreen()),
          ),
          GoRoute(
            path: '/staff-messages',
            name: 'staff-messages',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffMessagesScreen()),
          ),
          GoRoute(
            path: '/staff-settings',
            name: 'staff-settings',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffSettingsScreen()),
          ),
        ],
      ),
      GoRoute(
        path: '/driver-login',
        name: 'driver-login',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const DriverLoginScreen()),
      ),
      GoRoute(
        path: '/driver-register',
        name: 'driver-register',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const DriverRegisterScreen()),
      ),

      // ════════════════ DRIVER PORTAL SHELL ROUTE (FIXED BOTTOM BAR) ════════════════
      ShellRoute(
        builder: (context, state, child) => DriverWrapper(child: child),
        routes: [
          GoRoute(
            path: '/driver-dashboard',
            name: 'driver-dashboard',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverDashboardScreen()),
          ),
          GoRoute(
            path: '/driver-tracking',
            name: 'driver-tracking',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverTrackingScreen()),
          ),
          GoRoute(
            path: '/driver-contacts',
            name: 'driver-contacts',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverContactsScreen()),
          ),
          GoRoute(
            path: '/driver-attendance',
            name: 'driver-attendance',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverAttendanceScreen()),
          ),
          GoRoute(
            path: '/driver-leaves',
            name: 'driver-leaves',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverLeaveManagementScreen()),
          ),
          GoRoute(
            path: '/driver-salary',
            name: 'driver-salary',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverSalaryScreen()),
          ),
          GoRoute(
            path: '/driver-profile',
            name: 'driver-profile',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverProfileScreen()),
          ),
          GoRoute(
            path: '/driver-documents',
            name: 'driver-documents',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverDocumentsScreen()),
          ),
          GoRoute(
            path: '/driver-id-card',
            name: 'driver-id-card',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverIdCardScreen()),
          ),
          GoRoute(
            path: '/driver-settings',
            name: 'driver-settings',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverSettingsScreen()),
          ),
          GoRoute(
            path: '/driver-notices',
            name: 'driver-notices',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DriverNoticesScreen()),
          ),
        ],
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        pageBuilder:
            (context, state) =>
                _animatedPage(context, state, const RegisterScreen()),
      ),

      // ════════════════ TEACHER SECTION SHELL ROUTE (FIXED BOTTOM BAR FRAGMENT) ════════════════
      ShellRoute(
        builder: (context, state, child) => TeacherWrapper(child: child),
        routes: [
          GoRoute(
            path: '/teacher-dashboard',
            name: 'teacher-dashboard',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherDashboardScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-self-attendance',
            name: 'teacher-self-attendance',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherSelfAttendanceScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-attendance',
            name: 'teacher-attendance',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherAttendanceScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-live-classes',
            name: 'teacher-live-classes',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherLiveClassesScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-my-classes',
            name: 'teacher-my-classes',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherMyClassesScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-homework',
            name: 'teacher-homework',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherHomeworkScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-timetable',
            name: 'teacher-timetable',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherTimetableScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-exams-results',
            name: 'teacher-exams-results',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherExamsResultsScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-leaves',
            name: 'teacher-leaves',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherLeaveManagementScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-salary',
            name: 'teacher-salary',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherSalarySlipScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-documents',
            name: 'teacher-documents',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherDocumentsScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-messages',
            name: 'teacher-messages',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherMessagesScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-profile',
            name: 'teacher-profile',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const TeacherProfileScreen()),
          ),
          GoRoute(
            path: '/teacher-notice-board',
            name: 'teacher-notice-board',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherNoticeBoardScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-marks',
            name: 'teacher-marks',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherMarksEntryScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-change-password',
            name: 'teacher-change-password',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherChangePasswordScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-subjects',
            name: 'teacher-subjects',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherMySubjectsScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-study-material',
            name: 'teacher-study-material',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherStudyMaterialScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-performance',
            name: 'teacher-performance',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherStudentPerformanceScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-complaint',
            name: 'teacher-complaint',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherComplaintSupportScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-exam-management',
            name: 'teacher-exam-management',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherExamManagementScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-all-services',
            name: 'teacher-all-services',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherAllServicesScreen(),
                ),
          ),
          GoRoute(
            path: '/teacher-document-viewer',
            name: 'teacher-document-viewer',
            pageBuilder: (context, state) {
              final extra = state.extra as Map<String, dynamic>? ?? {};
              return _animatedPage(
                context,
                state,
                TeacherDocumentViewerScreen(
                  docName: extra['name'] as String? ?? 'Offer Letter',
                  docType: extra['type'] as String? ?? 'Official Letter',
                  docDate: extra['date'] as String? ?? '01 Aug 2022',
                  docSize: extra['size'] as String? ?? '2.4 MB',
                ),
              );
            },
          ),
          GoRoute(
            path: '/teacher-id-card',
            name: 'teacher-id-card',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const TeacherIdCardScreen()),
          ),
          GoRoute(
            path: '/teacher-salary-slip',
            name: 'teacher-salary-slip',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const TeacherSalarySlipScreen(),
                ),
          ),
        ],
      ),

      // ════════════════ STUDENT SECTION SHELL ROUTE (FIXED BOTTOM BAR FRAGMENT) ════════════════
      ShellRoute(
        builder: (context, state, child) => MainWrapper(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            name: 'dashboard',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DashboardScreen()),
          ),
          GoRoute(
            path: '/student-dashboard',
            redirect: (context, state) => '/dashboard',
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            pageBuilder: (context, state) {
              final extraMap = state.extra as Map<String, dynamic>?;
              final openIdCard = extraMap?['openIdCard'] as bool? ?? false;
              return _animatedPage(
                context,
                state,
                ProfileScreen(openIdCard: openIdCard),
              );
            },
          ),
          GoRoute(
            path: '/attendance',
            name: 'attendance',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const AttendanceScreen()),
          ),
          GoRoute(
            path: '/homework',
            name: 'homework',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const HomeworkScreen()),
          ),
          GoRoute(
            path: '/assignments',
            name: 'assignments',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const AssignmentsScreen()),
          ),
          GoRoute(
            path: '/study-material',
            name: 'study-material',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StudyMaterialScreen()),
          ),
          GoRoute(
            path: '/syllabus',
            name: 'syllabus',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StudyMaterialScreen()),
          ),
          GoRoute(
            path: '/timetable',
            name: 'timetable',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const TimetableScreen()),
          ),
          GoRoute(
            path: '/online-classes',
            name: 'online-classes',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const OnlineClassesScreen()),
          ),
          GoRoute(
            path: '/online-exams',
            name: 'online-exams',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const OnlineExamsScreen()),
          ),
          GoRoute(
            path: '/exam-results',
            name: 'exam-results',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const ExamResultsScreen()),
          ),
          GoRoute(
            path: '/marksheet',
            name: 'marksheet',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const ExamResultsScreen()),
          ),
          GoRoute(
            path: '/fee-details',
            name: 'fee-details',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const FeeDetailsScreen()),
          ),
          GoRoute(
            path: '/fees',
            name: 'fees',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const FeeDetailsScreen()),
          ),
          GoRoute(
            path: '/notice-board',
            name: 'notice-board',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const NoticeBoardScreen()),
          ),
          GoRoute(
            path: '/events',
            name: 'events',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const EventsScreen()),
          ),
          GoRoute(
            path: '/leaves',
            name: 'leaves',
            pageBuilder:
                (context, state) => _animatedPage(
                  context,
                  state,
                  const LeaveManagementScreen(),
                ),
          ),
          GoRoute(
            path: '/complaint',
            name: 'complaint',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const ComplaintScreen()),
          ),
          GoRoute(
            path: '/certificates',
            name: 'certificates',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const CertificatesScreen()),
          ),
          GoRoute(
            path: '/documents',
            name: 'documents',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const DocumentsScreen()),
          ),
          GoRoute(
            path: '/change-password',
            name: 'change-password',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const ChangePasswordScreen()),
          ),
          GoRoute(
            path: '/settings',
            name: 'settings',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const SettingsScreen()),
          ),
          GoRoute(
            path: '/all-services',
            name: 'all-services',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const AllServicesScreen()),
          ),
          GoRoute(
            path: '/transport',
            name: 'transport',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const TransportScreen()),
          ),
          GoRoute(
            path: '/hostel',
            name: 'hostel',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const HostelScreen()),
          ),
          GoRoute(
            path: '/staff-details',
            name: 'staff-details',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const StaffDetailsScreen()),
          ),
          GoRoute(
            path: '/coaching',
            name: 'coaching',
            pageBuilder:
                (context, state) =>
                    _animatedPage(context, state, const CoachingScreen()),
          ),
        ],
      ),
    ],
  );
}
