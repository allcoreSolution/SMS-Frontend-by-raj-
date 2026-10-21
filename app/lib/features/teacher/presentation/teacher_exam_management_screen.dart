import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherExamManagementScreen extends StatelessWidget {
  const TeacherExamManagementScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final List<Map<String, dynamic>> examTools = [
      {
        'title': 'Create Exam Schedule',
        'desc': 'Schedule dates for Mid-Term & Unit Tests',
        'icon': Icons.calendar_month_rounded,
        'color': AppTheme.teacherPurple,
        'tag': 'Phase 1',
        'route': '/teacher-exams-results',
      },
      {
        'title': 'Assign Exam Subjects & Papers',
        'desc': 'Assign subject teachers & upload question papers',
        'icon': Icons.assignment_rounded,
        'color': const Color(0xFF2563EB),
        'tag': 'Phase 2',
        'route': '/teacher-exams-results',
      },
      {
        'title': 'Student Admit Card Verification',
        'desc': 'Verify admit card eligibility & roll numbers',
        'icon': Icons.badge_rounded,
        'color': const Color(0xFF10B981),
        'tag': 'Verification',
        'route': '/teacher-exams-results',
      },
      {
        'title': 'Exam Hall Instructions',
        'desc': 'Publish guidelines & invigilation rules',
        'icon': Icons.gavel_rounded,
        'color': const Color(0xFFD97706),
        'tag': 'Guidelines',
        'route': '/teacher-exams-results',
      },
      {
        'title': 'Result Publication & Marks Entry',
        'desc': 'Enter scores & publish report cards to parents',
        'icon': Icons.grade_rounded,
        'color': const Color(0xFF7C3AED),
        'tag': 'Final Step',
        'route': '/teacher-marks',
      },
    ];

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
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 6)],
                      ),
                      child: Icon(Icons.arrow_back_ios_new_rounded,
                          color: isDark ? Colors.white : const Color(0xFF0F172A), size: 18),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Exam Management',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Examination Control Desk',
                            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFDDD6FE)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.security_rounded, size: 14, color: AppTheme.teacherPurple),
                        const SizedBox(width: 5),
                        Text('CONTROL',
                            style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                      ],
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
                    colors: [Color(0xFF3B0764), Color(0xFF4C1D95), Color(0xFF7C3AED)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.38),
                      blurRadius: 14, offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50, height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.history_edu_rounded, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Examination Controller',
                              style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text('5 Modules Available • Active Session',
                              style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ EXAM TOOLS LIST ════════════════
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                physics: const BouncingScrollPhysics(),
                itemCount: examTools.length,
                itemBuilder: (context, index) {
                  final tool = examTools[index];
                  final Color tColor = tool['color'] as Color;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                      child: InkWell(
                        onTap: () => context.push(tool['route'] as String),
                        borderRadius: BorderRadius.circular(20),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Row(
                            children: [
                              Container(
                                width: 46, height: 46,
                                decoration: BoxDecoration(
                                  color: tColor.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Icon(tool['icon'] as IconData, color: tColor, size: 24),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(tool['title'] as String,
                                              style: GoogleFonts.outfit(fontSize: 15.5, fontWeight: FontWeight.bold,
                                                  color: isDark ? Colors.white : const Color(0xFF0F172A))),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: tColor.withValues(alpha: 0.1),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(tool['tag'] as String,
                                              style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: tColor)),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 3),
                                    Text(tool['desc'] as String,
                                        style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              Icon(Icons.arrow_forward_ios_rounded, size: 14, color: tColor),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
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
