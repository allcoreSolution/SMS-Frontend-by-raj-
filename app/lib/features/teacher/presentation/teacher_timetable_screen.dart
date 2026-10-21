import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';
class TeacherTimetableScreen extends StatefulWidget {
  const TeacherTimetableScreen({super.key});

  @override
  State<TeacherTimetableScreen> createState() => _TeacherTimetableScreenState();
}

class _TeacherTimetableScreenState extends State<TeacherTimetableScreen>
    with SingleTickerProviderStateMixin {
  late PageController _pageController;
  int _selectedTab = 0;
  int _selectedDay = 2; // 0: Mon, 1: Tue, 2: Wed (Default Today), 3: Thu, 4: Fri, 5: Sat

  final List<String> _days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  final List<Map<String, dynamic>> _todayPeriods = [
    {'time': '08:00 - 08:45 AM', 'period': 'Period 1', 'subject': 'Mathematics', 'class': 'Class 10 - A', 'room': 'Room 101', 'isFree': false, 'color': AppTheme.teacherPurple},
    {'time': '09:00 - 09:45 AM', 'period': 'Period 2', 'subject': 'Mathematics', 'class': 'Class 9 - B',  'room': 'Room 102', 'isFree': false, 'color': AppTheme.teacherPurple},
    {'time': '10:00 - 10:45 AM', 'period': 'Period 3', 'subject': 'Free / Recess Slot', 'class': 'N/A',   'room': 'Faculty Lounge', 'isFree': true, 'color': AppTheme.teacherPurple},
    {'time': '11:00 - 11:45 AM', 'period': 'Period 4', 'subject': 'Mathematics', 'class': 'Class 8 - A', 'room': 'Room 103', 'isFree': false, 'color': AppTheme.teacherPurple},
    {'time': '12:00 - 12:45 PM', 'period': 'Period 5', 'subject': 'Mathematics', 'class': 'Class 7 - B', 'room': 'Room 104', 'isFree': false, 'color': AppTheme.teacherPurple},
  ];

  final List<Map<String, dynamic>> _weeklyOverview = [
    {'day': 'Monday',    'total': '5 Classes', 'hours': '4h 15m', 'next': 'Class 10-A'},
    {'day': 'Tuesday',   'total': '4 Classes', 'hours': '3h 30m', 'next': 'Class 9-B'},
    {'day': 'Wednesday', 'total': '5 Classes', 'hours': '4h 15m', 'next': 'Class 10-A'},
    {'day': 'Thursday',  'total': '3 Classes', 'hours': '2h 45m', 'next': 'Class 8-A'},
    {'day': 'Friday',    'total': '5 Classes', 'hours': '4h 15m', 'next': 'Class 10-A'},
    {'day': 'Saturday',  'total': '2 Classes', 'hours': '1h 30m', 'next': 'Class 9-B'},
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onTabTapped(int index) {
    setState(() => _selectedTab = index);
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

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
                        Text('Faculty Timetable',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Swipe tabs left or right →',
                            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF4C1D95).withValues(alpha: 0.25) : const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFDDD6FE)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_month_rounded, size: 14, color: Color(0xFF4C1D95)),
                        const SizedBox(width: 5),
                        Text('TIMETABLE',
                            style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: const Color(0xFF4C1D95))),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING PURPLE INDIGO HERO CARD ════════════════
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 10),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF3B0764), Color(0xFF4C1D95), Color(0xFF6D28D9)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.35),
                      blurRadius: 14, offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _purpleStat('5 Periods', 'Today Schedule', Colors.white.withValues(alpha: 0.2), Colors.white),
                        const SizedBox(width: 8),
                        _purpleStat('1 Free Slot', 'Faculty Lounge', const Color(0xFFD97706).withValues(alpha: 0.3), const Color(0xFFFCD34D)),
                        const SizedBox(width: 8),
                        _purpleStat('Room 101', 'Current Slot', Colors.white.withValues(alpha: 0.2), Colors.white),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Custom Tab Switcher
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          Expanded(child: _tabButton(0, "Today's Timeline", Icons.schedule_rounded)),
                          Expanded(child: _tabButton(1, 'Weekly Grid', Icons.grid_view_rounded)),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ DAY PICKER CHIPS ════════════════
            if (_selectedTab == 0)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 10),
                child: SizedBox(
                  height: 38,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    itemCount: _days.length,
                    itemBuilder: (context, index) {
                      final isSelected = index == _selectedDay;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedDay = index),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0xFF4C1D95)
                                : (isDark ? const Color(0xFF1E293B) : Colors.white),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected
                                  ? const Color(0xFF4C1D95)
                                  : (isDark ? Colors.white10 : const Color(0xFFCBD5E1)),
                            ),
                            boxShadow: isSelected
                                ? [BoxShadow(color: const Color(0xFF4C1D95).withValues(alpha: 0.3), blurRadius: 6)]
                                : null,
                          ),
                          child: Text(
                            _days[index],
                            style: GoogleFonts.outfit(
                              fontSize: 12.5, fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : Colors.grey.shade600,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

            // ════════════════ SWIPEABLE PAGE VIEW ════════════════
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const BouncingScrollPhysics(),
                onPageChanged: (idx) => setState(() => _selectedTab = idx),
                children: [
                  _buildTimelineTab(isDark),
                  _buildWeeklyGridTab(isDark),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildTimelineTab(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      physics: const BouncingScrollPhysics(),
      itemCount: _todayPeriods.length,
      itemBuilder: (context, index) {
        final item = _todayPeriods[index];
        final isFree = item['isFree'] as bool;
        final Color pColor = item['color'] as Color;

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isFree
                ? (isDark ? const Color(0xFF1E293B).withValues(alpha: 0.5) : const Color(0xFFFEF3C7).withValues(alpha: 0.4))
                : (isDark ? const Color(0xFF1E293B) : Colors.white),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: isFree
                  ? const Color(0xFFF59E0B).withValues(alpha: 0.3)
                  : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
            ),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
          ),
          child: Row(
            children: [
              Container(
                width: 90,
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                decoration: BoxDecoration(
                  color: isFree
                      ? const Color(0xFFD97706).withValues(alpha: 0.12)
                      : pColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Text(item['period'] as String,
                        style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold,
                            color: isFree ? const Color(0xFFD97706) : pColor)),
                    const SizedBox(height: 2),
                    Text(item['time'] as String,
                        style: GoogleFonts.inter(fontSize: 9.5, fontWeight: FontWeight.w600, color: Colors.grey)),
                  ],
                ),
              ),
              const SizedBox(width: 14),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item['subject'] as String,
                        style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold,
                            color: isFree
                                ? const Color(0xFFD97706)
                                : (isDark ? Colors.white : const Color(0xFF0F172A)))),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Icon(isFree ? Icons.coffee_rounded : Icons.meeting_room_rounded,
                            size: 13, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          isFree ? item['room'] as String : '${item['class']} • ${item['room']}',
                          style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              if (!isFree)
                GestureDetector(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                      content: Text('Opening Class Roster for ${item['class']}! 📋'),
                      backgroundColor: pColor,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ));
                  },
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: pColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(Icons.arrow_forward_ios_rounded, size: 14, color: pColor),
                  ),
                ),
            ],
          ),
        ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
      },
    );
  }

  Widget _buildWeeklyGridTab(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      physics: const BouncingScrollPhysics(),
      itemCount: _weeklyOverview.length,
      itemBuilder: (context, index) {
        final item = _weeklyOverview[index];
        final isToday = item['day'] == 'Wednesday';

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: isToday
                  ? const Color(0xFF4C1D95).withValues(alpha: 0.5)
                  : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
              width: isToday ? 1.5 : 1,
            ),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 42, height: 42,
                    decoration: BoxDecoration(
                      color: isToday ? const Color(0xFF4C1D95) : (isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(Icons.calendar_today_rounded,
                        color: isToday ? Colors.white : Colors.grey, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(item['day'] as String,
                              style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : const Color(0xFF0F172A))),
                          if (isToday) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(color: const Color(0xFF4C1D95).withValues(alpha: 0.12), borderRadius: BorderRadius.circular(6)),
                              child: Text('Today', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF4C1D95))),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text('${item['total']} • ${item['hours']} teaching time',
                          style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFF059669).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(item['next'] as String,
                    style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
              ),
            ],
          ),
        ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
      },
    );
  }

  Widget _tabButton(int index, String label, IconData icon) {
    final active = _selectedTab == index;
    return GestureDetector(
      onTap: () => _onTabTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 7),
        decoration: BoxDecoration(
          color: active ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(11),
          boxShadow: active ? [BoxShadow(color: Colors.black.withValues(alpha: 0.15), blurRadius: 6)] : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 15, color: active ? const Color(0xFF4C1D95) : Colors.white70),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12, fontWeight: FontWeight.bold,
                color: active ? const Color(0xFF4C1D95) : Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _purpleStat(String val, String label, Color bg, Color fg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
        child: Column(
          children: [
            Text(val, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: fg)),
            Text(label, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: fg.withValues(alpha: 0.9))),
          ],
        ),
      ),
    );
  }
}
