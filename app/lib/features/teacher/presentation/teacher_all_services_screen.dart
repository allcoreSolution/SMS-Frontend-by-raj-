import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherAllServicesScreen extends StatefulWidget {
  const TeacherAllServicesScreen({super.key});

  @override
  State<TeacherAllServicesScreen> createState() =>
      _TeacherAllServicesScreenState();
}

class _TeacherAllServicesScreenState extends State<TeacherAllServicesScreen> {
  String _searchQuery = '';

  final List<Map<String, dynamic>> _allFacultyTools = [
    {
      'label': 'My Classes',
      'desc': 'Manage assigned classes & sections',
      'icon': Icons.class_rounded,
      'color': const Color(0xFF4C1D95),
      'bgColor': const Color(0xFFEDE9FE),
      'route': '/teacher-my-classes',
    },
    {
      'label': 'My Subjects',
      'desc': 'Teaching load & subjects list',
      'icon': Icons.menu_book_rounded,
      'color': const Color(0xFF2563EB),
      'bgColor': const Color(0xFFDBEAFE),
      'route': '/teacher-subjects',
    },
    {
      'label': 'Student Mgmt',
      'desc': 'Roster & student details',
      'icon': Icons.groups_rounded,
      'color': const Color(0xFF10B981),
      'bgColor': const Color(0xFFD1FAE5),
      'route': '/teacher-my-classes',
    },
    {
      'label': 'Attendance',
      'desc': 'Mark daily student attendance',
      'icon': Icons.how_to_reg_rounded,
      'color': const Color(0xFF10B981),
      'bgColor': const Color(0xFFD1FAE5),
      'route': '/teacher-attendance',
    },
    {
      'label': 'Self Attendance',
      'desc': 'Teacher daily punch in / out',
      'icon': Icons.self_improvement_rounded,
      'color': const Color(0xFF10B981),
      'bgColor': const Color(0xFFD1FAE5),
      'route': '/teacher-self-attendance',
    },
    {
      'label': 'Timetable',
      'desc': 'Weekly schedule & period breakdown',
      'icon': Icons.calendar_month_rounded,
      'color': const Color(0xFF4C1D95),
      'bgColor': const Color(0xFFEDE9FE),
      'route': '/teacher-timetable',
    },
    {
      'label': 'Homework',
      'desc': 'Assign & review student homework',
      'icon': Icons.assignment_rounded,
      'color': const Color(0xFFF59E0B),
      'bgColor': const Color(0xFFFEF3C7),
      'route': '/teacher-homework',
    },
    {
      'label': 'Assignments',
      'desc': 'Project submission desk',
      'icon': Icons.task_rounded,
      'color': const Color(0xFFF59E0B),
      'bgColor': const Color(0xFFFEF3C7),
      'route': '/teacher-homework',
    },
    {
      'label': 'Study Material',
      'desc': 'Notes, PPTs & Question Banks',
      'icon': Icons.folder_zip_rounded,
      'color': const Color(0xFF8B5CF6),
      'bgColor': const Color(0xFFF3E8FF),
      'route': '/teacher-study-material',
    },
    {
      'label': 'Exam Mgmt',
      'desc': 'Schedules, admit cards & rules',
      'icon': Icons.history_edu_rounded,
      'color': const Color(0xFFEF4444),
      'bgColor': const Color(0xFFFEE2E2),
      'route': '/teacher-exam-management',
    },
    {
      'label': 'Marks Entry',
      'desc': 'Subject test & exam scoring',
      'icon': Icons.score_rounded,
      'color': const Color(0xFF10B981),
      'bgColor': const Color(0xFFD1FAE5),
      'route': '/teacher-marks',
    },
    {
      'label': 'Leave Mgmt',
      'desc': 'Apply & view leave balances',
      'icon': Icons.event_available_rounded,
      'color': const Color(0xFFEA580C),
      'bgColor': const Color(0xFFFFEDD5),
      'route': '/teacher-leaves',
    },
    {
      'label': 'Notice Board',
      'icon': Icons.campaign_rounded,
      'desc': 'School notices & announcements',
      'color': const Color(0xFF4C1D95),
      'bgColor': const Color(0xFFEDE9FE),
      'route': '/teacher-notice-board',
    },
    {
      'label': 'Performance',
      'desc': 'Class metrics & rank reports',
      'icon': Icons.auto_graph_rounded,
      'color': const Color(0xFF10B981),
      'bgColor': const Color(0xFFD1FAE5),
      'route': '/teacher-performance',
    },
    {
      'label': 'My Documents',
      'desc': 'Payslips, ID card & offer letter',
      'icon': Icons.folder_copy_rounded,
      'color': const Color(0xFF2563EB),
      'bgColor': const Color(0xFFDBEAFE),
      'route': '/teacher-documents',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final filtered =
        _searchQuery.isEmpty
            ? _allFacultyTools
            : _allFacultyTools
                .where(
                  (t) =>
                      (t['label'] as String).toLowerCase().contains(
                        _searchQuery.toLowerCase(),
                      ) ||
                      (t['desc'] as String).toLowerCase().contains(
                        _searchQuery.toLowerCase(),
                      ),
                )
                .toList();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      body: SafeArea(
        child: Column(
          children: [
            // ════════════════ TOP NAVIGATION BAR ════════════════
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/teacher-dashboard');
                      }
                    },
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                        size: 18,
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'All Teacher Services',
                          style: GoogleFonts.outfit(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color:
                                isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                        Text(
                          'Teacher Workspace Tools Directory',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color:
                          isDark
                              ? AppTheme.teacherPurple.withValues(alpha: 0.25)
                              : const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color:
                            isDark ? Colors.white10 : const Color(0xFFDDD6FE),
                      ),
                    ),
                    child: Text(
                      '${_allFacultyTools.length} Services',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.teacherPurple,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING HERO CARD ════════════════
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 10),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF3B0764),
                      Color(0xFF4C1D95),
                      Color(0xFF7C3AED),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.38),
                      blurRadius: 14,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(
                        Icons.apps_rounded,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Complete Teacher Directory',
                            style: GoogleFonts.outfit(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Quick access to all teaching & admin tools',
                            style: GoogleFonts.inter(
                              fontSize: 11.5,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ SEARCH BAR ════════════════
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Container(
                height: 42,
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 6,
                    ),
                  ],
                ),
                child: TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                  decoration: InputDecoration(
                    hintText: 'Search service or tool…',
                    hintStyle: GoogleFonts.inter(
                      fontSize: 13,
                      color: Colors.grey,
                    ),
                    prefixIcon: const Icon(
                      Icons.search_rounded,
                      color: AppTheme.teacherPurple,
                      size: 18,
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 11),
                  ),
                ),
              ),
            ),

            // ════════════════ SERVICES GRID BOXES ════════════════
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(16),
                physics: const BouncingScrollPhysics(),
                itemCount: filtered.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 14,
                  childAspectRatio: 0.88,
                ),
                itemBuilder: (context, index) {
                  final tool = filtered[index];
                  final Color tColor = tool['color'] as Color;

                  return Container(
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color:
                            isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(
                            alpha: isDark ? 0.12 : 0.04,
                          ),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(20),
                        onTap: () => context.push(tool['route'] as String),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 12,
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color:
                                      isDark
                                          ? tColor.withValues(alpha: 0.15)
                                          : (tool['bgColor'] as Color),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  tool['icon'] as IconData,
                                  color: tColor,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                tool['label'] as String,
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.outfit(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color:
                                      isDark
                                          ? Colors.white
                                          : const Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ).animate().fadeIn(duration: 300.ms, delay: (index * 20).ms);
                },
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }
}
