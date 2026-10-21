import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class AllServicesScreen extends StatelessWidget {
  const AllServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final List<Map<String, dynamic>> allModules = [
      {'label': 'Timetable', 'icon': Icons.calendar_month_rounded, 'color': const Color(0xFF8B5CF6), 'route': '/timetable'},
      {'label': 'Online Classes', 'icon': Icons.videocam_rounded, 'color': const Color(0xFFEF4444), 'route': '/online-classes'},
      {'label': 'Homework', 'icon': Icons.assignment_rounded, 'color': const Color(0xFFF97316), 'route': '/homework'},
      {'label': 'Assignments', 'icon': Icons.note_alt_rounded, 'color': const Color(0xFF6366F1), 'route': '/assignments'},
      {'label': 'Fees', 'icon': Icons.account_balance_wallet_rounded, 'color': const Color(0xFF10B981), 'route': '/fees'},
      {'label': 'Attendance', 'icon': Icons.check_box_rounded, 'color': const Color(0xFF2563EB), 'route': '/attendance'},
      {'label': 'Online Exams', 'icon': Icons.laptop_chromebook_rounded, 'color': const Color(0xFFEC4899), 'route': '/online-exams'},
      {'label': 'Exam Results', 'icon': Icons.emoji_events_rounded, 'color': const Color(0xFF06B6D4), 'route': '/marksheet'},
      {'label': 'Study Material', 'icon': Icons.menu_book_rounded, 'color': const Color(0xFF14B8A6), 'route': '/syllabus'},
      {'label': 'Notice Board', 'icon': Icons.campaign_rounded, 'color': const Color(0xFFF59E0B), 'route': '/notice-board'},
      {'label': 'Events', 'icon': Icons.event_rounded, 'color': const Color(0xFF3B82F6), 'route': '/events'},
      {'label': 'Leave Mgmt', 'icon': Icons.time_to_leave_rounded, 'color': const Color(0xFF8B5CF6), 'route': '/leaves'},
      {'label': 'Certificates', 'icon': Icons.workspace_premium_rounded, 'color': const Color(0xFFF59E0B), 'route': '/certificates'},
      {'label': 'Transport', 'icon': Icons.directions_bus_rounded, 'color': const Color(0xFFEA580C), 'route': '/transport'},
      {'label': 'Hostel', 'icon': Icons.apartment_rounded, 'color': const Color(0xFF8B5CF6), 'route': '/hostel'},
      {'label': 'School Staff', 'icon': Icons.badge_rounded, 'color': const Color(0xFF2563EB), 'route': '/staff-details'},
      {'label': 'Coaching', 'icon': Icons.model_training_rounded, 'color': const Color(0xFF10B981), 'route': '/coaching'},
      {'label': 'Support', 'icon': Icons.support_agent_rounded, 'color': const Color(0xFF64748B), 'route': '/complaint'},
      {'label': 'My Documents', 'icon': Icons.folder_shared_rounded, 'color': const Color(0xFF2563EB), 'route': '/documents'},
    ];

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/dashboard');
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        leading: context.canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                onPressed: () => context.pop(),
              )
            : null,
        title: Text(
          'All Student Modules',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Explore All Features (${allModules.length})',
                style: GoogleFonts.inter(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ).animate().fadeIn(duration: 300.ms),

              const SizedBox(height: 14),

              LayoutBuilder(
                builder: (context, screenConstraints) {
                  final screenWidth = screenConstraints.maxWidth;
                  final crossCount = screenWidth > 720 ? 6 : (screenWidth > 480 ? 5 : 4);
                  final mainExtent = screenWidth > 600 ? 110.0 : 96.0;

                  return GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: allModules.length,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossCount,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 16,
                      mainAxisExtent: mainExtent,
                    ),
                    itemBuilder: (context, index) {
                      final item = allModules[index];
                      final color = item['color'] as Color;

                      return LayoutBuilder(
                        builder: (context, constraints) {
                          final boxSize = (constraints.maxWidth * 0.62).clamp(44.0, 60.0);
                          final iconSize = boxSize * 0.48;

                          return GestureDetector(
                            onTap: () => context.push(item['route'] as String),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Container(
                                  width: boxSize,
                                  height: boxSize,
                                  decoration: BoxDecoration(
                                    color: color.withValues(alpha: isDark ? 0.2 : 0.12),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: color.withValues(alpha: isDark ? 0.35 : 0.25),
                                      width: 1.2,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: color.withValues(alpha: isDark ? 0.15 : 0.06),
                                        blurRadius: 6,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Icon(item['icon'] as IconData, color: color, size: iconSize),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  item['label'] as String,
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.inter(
                                    fontSize: 11.5,
                                    height: 1.15,
                                    fontWeight: FontWeight.w600,
                                    color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      );
                    },
                  );
                },
              ).animate().fadeIn(duration: 400.ms, delay: 100.ms).slideY(begin: 0.08),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    ),
    );
  }
}
