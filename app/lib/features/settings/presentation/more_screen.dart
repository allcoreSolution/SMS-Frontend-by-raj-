import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/dashboard');
      },
      child: Scaffold(
      appBar: AppBar(
        titleSpacing: 18,
        elevation: 0,
        title: Text(
          'All Student Services',
          style: GoogleFonts.outfit(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Student Profile Banner Card
              GestureDetector(
                onTap: () => context.push('/profile'),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isDark ? Colors.white10 : const Color(0xFFDBEAFE),
                      width: 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                        blurRadius: 12,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF334155) : const Color(0xFFBFDBFE),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(Icons.face_rounded, color: Color(0xFF2563EB), size: 38),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Rahul Sharma',
                              style: GoogleFonts.outfit(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Class 10 - A (Science)',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF2563EB),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Admission No. 2022/10523 | Roll No. 22',
                              style: GoogleFonts.inter(
                                fontSize: 11.5,
                                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right_rounded, color: Color(0xFF2563EB), size: 28),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 22),

              // 2. All Modules Header
              Text(
                'Explore All Modules',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),

              const SizedBox(height: 14),

              // 18 Colorful Grid Cards (Identical style to Dashboard grid boxes!)
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 4,
                crossAxisSpacing: 12,
                mainAxisSpacing: 16,
                childAspectRatio: 0.82,
                children: [
                  _actionItem(context, 'Timetable', Icons.calendar_month_rounded, const Color(0xFF8B5CF6), '/timetable', isDark),
                  _actionItem(context, 'Homework', Icons.assignment_rounded, const Color(0xFFF97316), '/homework', isDark),
                  _actionItem(context, 'Assignments', Icons.note_alt_rounded, const Color(0xFF6366F1), '/assignments', isDark),
                  _actionItem(context, 'Fees', Icons.account_balance_wallet_rounded, const Color(0xFF10B981), '/fees', isDark),
                  _actionItem(context, 'Online Attend.', Icons.check_box_rounded, const Color(0xFFEF4444), '/attendance', isDark),
                  _actionItem(context, 'Events', Icons.event_rounded, const Color(0xFF3B82F6), '/events', isDark),
                  _actionItem(context, 'Notice Board', Icons.campaign_rounded, const Color(0xFFEC4899), '/notice-board', isDark),
                  _actionItem(context, 'Study Material', Icons.menu_book_rounded, const Color(0xFF14B8A6), '/syllabus', isDark),
                  _actionItem(context, 'Exam Results', Icons.emoji_events_rounded, const Color(0xFF06B6D4), '/marksheet', isDark),
                  _actionItem(context, 'Admission', Icons.how_to_reg_rounded, const Color(0xFFF59E0B), '/admission', isDark),
                  _actionItem(context, 'Transport', Icons.directions_bus_rounded, const Color(0xFFEA580C), '/transport', isDark),
                  _actionItem(context, 'Hostel', Icons.apartment_rounded, const Color(0xFF8B5CF6), '/hostel', isDark),
                  _actionItem(context, 'Documents', Icons.folder_rounded, const Color(0xFF10B981), '/documents', isDark),
                  _actionItem(context, 'Leave App', Icons.time_to_leave_rounded, const Color(0xFFF59E0B), '/leave-management', isDark),
                  _actionItem(context, 'Complaints', Icons.support_agent_rounded, const Color(0xFFEF4444), '/complaint', isDark),
                  _actionItem(context, 'Settings', Icons.settings_rounded, const Color(0xFF64748B), '/settings', isDark),
                  _actionItem(context, 'My Profile', Icons.person_rounded, const Color(0xFF2563EB), '/profile', isDark),
                ],
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _actionItem(
    BuildContext context,
    String label,
    IconData icon,
    Color color,
    String route,
    bool isDark,
  ) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: color.withValues(alpha: isDark ? 0.2 : 0.12),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: color.withValues(alpha: isDark ? 0.35 : 0.25),
                width: 1.2,
              ),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
            ),
          ),
        ],
      ),
    );
  }
}
