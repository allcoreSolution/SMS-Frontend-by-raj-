import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
class TeacherExamsResultsScreen extends StatefulWidget {
  const TeacherExamsResultsScreen({super.key});

  @override
  State<TeacherExamsResultsScreen> createState() => _TeacherExamsResultsScreenState();
}

class _TeacherExamsResultsScreenState extends State<TeacherExamsResultsScreen>
    with SingleTickerProviderStateMixin {
  late PageController _pageController;
  int _selectedTab = 0;

  final List<Map<String, String>> _upcomingExams = [
    {'title': 'Unit Test - 1',       'class': 'Class 10 - A', 'date': '10 May, 2025', 'time': '10:00 AM - 11:30 AM', 'status': 'Enter Marks',  'students': '32 Students'},
    {'title': 'Half Yearly Exam',   'class': 'Class 9 - B',  'date': '20 May, 2025', 'time': '09:00 AM - 12:00 PM', 'status': 'Pending Date', 'students': '30 Students'},
    {'title': 'Mathematics Test 2', 'class': 'Class 8 - A',  'date': '12 May, 2025', 'time': '11:00 AM - 12:00 PM', 'status': 'Enter Marks',  'students': '28 Students'},
  ];

  final List<Map<String, String>> _completedExams = [
    {'title': 'Pre-Board Examination', 'class': 'Class 10 - A', 'date': '05 Apr, 2025', 'avg': '88%', 'highest': '49/50', 'status': 'Published'},
    {'title': 'Unit Test - 2',          'class': 'Class 9 - B',  'date': '18 Mar, 2025', 'avg': '82%', 'highest': '47/50', 'status': 'Published'},
    {'title': 'Quarterly Assessment',   'class': 'Class 8 - A',  'date': '10 Feb, 2025', 'avg': '90%', 'highest': '50/50', 'status': 'Published'},
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

            // ════════════════ TOP NAVIGATION BAR WITH BACK BUTTON ════════════════
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
                        Text('Exams & Results Hub',
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
                      color: const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFDDD6FE)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.assignment_turned_in_rounded, size: 14, color: Color(0xFF4C1D95)),
                        const SizedBox(width: 5),
                        Text('EXAMS',
                            style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: const Color(0xFF4C1D95))),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING TEACHER PURPLE HERO CARD ════════════════
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
                        _purpleStat('3', 'Pending Evaluation', Colors.white.withValues(alpha: 0.2), Colors.white),
                        const SizedBox(width: 8),
                        _purpleStat('3', 'Published Results', const Color(0xFF059669).withValues(alpha: 0.3), const Color(0xFF6EE7B7)),
                        const SizedBox(width: 8),
                        _purpleStat('86%', 'Avg Pass Rate', Colors.white.withValues(alpha: 0.2), Colors.white),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Custom Segmented Tab Bar
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          Expanded(child: _tabButton(0, 'Upcoming Exams', Icons.pending_actions_rounded)),
                          Expanded(child: _tabButton(1, 'Published Results', Icons.verified_rounded)),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ SWIPEABLE PAGE VIEW CONTENT ════════════════
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const BouncingScrollPhysics(),
                onPageChanged: (idx) => setState(() => _selectedTab = idx),
                children: [
                  _buildUpcomingTab(isDark),
                  _buildPublishedTab(isDark),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildUpcomingTab(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      physics: const BouncingScrollPhysics(),
      itemCount: _upcomingExams.length,
      itemBuilder: (context, index) {
        final exam = _upcomingExams[index];

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                blurRadius: 8, offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(exam['class']!,
                        style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: const Color(0xFF4C1D95))),
                  ),
                  Row(
                    children: [
                      const Icon(Icons.event_rounded, size: 13, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(exam['date']!, style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.w600, color: Colors.grey)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(exam['title']!,
                  style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : const Color(0xFF0F172A))),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.access_time_rounded, size: 13, color: Colors.grey.shade500),
                  const SizedBox(width: 4),
                  Text(exam['time']!, style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                  const SizedBox(width: 10),
                  Icon(Icons.people_alt_rounded, size: 13, color: Colors.grey.shade500),
                  const SizedBox(width: 4),
                  Text(exam['students']!, style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                ],
              ),
              const SizedBox(height: 14),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD97706).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text('● ${exam['status']}',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFFD97706))),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => context.push('/teacher-marks'),
                    icon: const Icon(Icons.edit_note_rounded, size: 16),
                    label: Text('Enter Marks →', style: GoogleFonts.outfit(fontSize: 12.5, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4C1D95),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      elevation: 3,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
      },
    );
  }

  Widget _buildPublishedTab(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      physics: const BouncingScrollPhysics(),
      itemCount: _completedExams.length,
      itemBuilder: (context, index) {
        final exam = _completedExams[index];

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(exam['title']!,
                      style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF059669).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text('✓ Published', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text('${exam['class']} • Conducted ${exam['date']}',
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 12),

              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text('Avg Score: ${exam['avg']}',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF4C1D95))),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF059669).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text('Highest: ${exam['highest']}',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                  ),
                ],
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
