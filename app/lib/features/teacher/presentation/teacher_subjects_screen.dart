import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherMySubjectsScreen extends StatelessWidget {
  const TeacherMySubjectsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final List<Map<String, dynamic>> subjects = [
      {
        'name': 'Mathematics',
        'code': 'MATH-101',
        'periods': '6 Periods / Week',
        'class': 'Class 10 - A',
        'students': 32,
        'room': 'Room 102',
        'progress': 0.78,
        'icon': Icons.calculate_rounded,
        'color': AppTheme.teacherPurple,
      },
      {
        'name': 'Mathematics Advanced',
        'code': 'MATH-102',
        'periods': '5 Periods / Week',
        'class': 'Class 9 - B',
        'students': 30,
        'room': 'Room 204',
        'progress': 0.65,
        'icon': Icons.functions_rounded,
        'color': const Color(0xFF2563EB),
      },
      {
        'name': 'Physics Lab',
        'code': 'PHYS-201',
        'periods': '4 Periods / Week',
        'class': 'Class 11 - B',
        'students': 28,
        'room': 'Lab 03',
        'progress': 0.82,
        'icon': Icons.science_rounded,
        'color': const Color(0xFFD97706),
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
                        Text('My Assigned Subjects',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Academic Year 2024-25',
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
                    child: Text('3 Subjects',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING PURPLE HERO CARD ════════════════
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
                      child: const Icon(Icons.menu_book_rounded, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Subject Portfolio',
                              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text('15 Hours Total Weekly Teaching Load',
                              style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ SUBJECT LIST ════════════════
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                physics: const BouncingScrollPhysics(),
                itemCount: subjects.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final item = subjects[index];
                  final color = item['color'] as Color;

                  return Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 44, height: 44,
                              decoration: BoxDecoration(
                                color: color.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(item['icon'] as IconData, color: color, size: 22),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(item['name'] as String,
                                      style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold,
                                          color: isDark ? Colors.white : const Color(0xFF0F172A))),
                                  Text('${item['class']} • ${item['room']}',
                                      style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: color.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(item['code'] as String,
                                  style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: color)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.schedule_rounded, size: 14, color: AppTheme.teacherPurple),
                                const SizedBox(width: 4),
                                Text(item['periods'] as String,
                                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                              ],
                            ),
                            Row(
                              children: [
                                Icon(Icons.groups_rounded, size: 14, color: Colors.grey),
                                const SizedBox(width: 4),
                                Text('${item['students']} Enrolled',
                                    style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: LinearProgressIndicator(
                            value: item['progress'] as double,
                            minHeight: 6,
                            backgroundColor: isDark ? Colors.white10 : const Color(0xFFF1F5F9),
                            valueColor: AlwaysStoppedAnimation<Color>(color),
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(duration: 350.ms, delay: (index * 40).ms);
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
