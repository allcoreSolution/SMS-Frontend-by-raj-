import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherMyClassesScreen extends StatefulWidget {
  const TeacherMyClassesScreen({super.key});

  @override
  State<TeacherMyClassesScreen> createState() => _TeacherMyClassesScreenState();
}

class _TeacherMyClassesScreenState extends State<TeacherMyClassesScreen>
    with SingleTickerProviderStateMixin {
  late PageController _pageController;
  int _selectedTab = 0;
  String _searchQuery = '';

  final List<Map<String, dynamic>> _assignedClasses = [
    {
      'class': 'Class 10 - A',
      'subject': 'Mathematics',
      'students': 32,
      'room': 'Room 102',
      'timing': '09:00 AM - 10:00 AM',
      'avgScore': '89%',
      'color': AppTheme.teacherPurple,
      'avatar': '10A',
    },
    {
      'class': 'Class 9 - B',
      'subject': 'Mathematics',
      'students': 30,
      'room': 'Room 204',
      'timing': '10:15 AM - 11:15 AM',
      'avgScore': '84%',
      'color': AppTheme.teacherPurple,
      'avatar': '9B',
    },
    {
      'class': 'Class 8 - A',
      'subject': 'Mathematics',
      'students': 28,
      'room': 'Room 108',
      'timing': '11:30 AM - 12:30 PM',
      'avgScore': '91%',
      'color': AppTheme.teacherPurple,
      'avatar': '8A',
    },
  ];

  final List<Map<String, dynamic>> _allStudents = [
    {'name': 'Aarav Sharma',  'roll': '01', 'class': '10-A', 'score': '95%', 'status': 'Top Performer', 'avatar': 'AS'},
    {'name': 'Vivaan Patel',  'roll': '02', 'class': '10-A', 'score': '88%', 'status': 'Good',          'avatar': 'VP'},
    {'name': 'Riya Singh',    'roll': '03', 'class': '9-B',  'score': '76%', 'status': 'Average',       'avatar': 'RS'},
    {'name': 'Aditya Verma',  'roll': '04', 'class': '10-A', 'score': '92%', 'status': 'Top Performer', 'avatar': 'AV'},
    {'name': 'Ananya Gupta',  'roll': '05', 'class': '8-A',  'score': '85%', 'status': 'Good',          'avatar': 'AG'},
    {'name': 'Karan Malhotra','roll': '06', 'class': '9-B',  'score': '90%', 'status': 'Top Performer', 'avatar': 'KM'},
  ];

  final List<Color> _avatarColors = [
    AppTheme.teacherPurple, AppTheme.teacherPurple,
    AppTheme.teacherPurple, const Color(0xFFDC2626),
    const Color(0xFFD97706), const Color(0xFF2563EB),
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

    final filteredStudents = _searchQuery.isEmpty
        ? _allStudents
        : _allStudents
            .where((s) => (s['name'] as String).toLowerCase().contains(_searchQuery.toLowerCase()) ||
                (s['class'] as String).toLowerCase().contains(_searchQuery.toLowerCase()))
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
                        Text('My Managed Classes',
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
                      color: isDark ? AppTheme.teacherPurple.withValues(alpha: 0.25) : const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFDDD6FE)),
                    ),
                    child: Text('3 Classes',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING FACULTY PURPLE HERO CARD ════════════════
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
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _emeraldStat('90', 'Total Students', Colors.white.withValues(alpha: 0.2), Colors.white),
                        const SizedBox(width: 8),
                        _emeraldStat('88%', 'Avg Performance', const Color(0xFFA78BFA).withValues(alpha: 0.3), const Color(0xFFDDD6FE)),
                        const SizedBox(width: 8),
                        _emeraldStat('3', 'Active Batches', Colors.white.withValues(alpha: 0.2), Colors.white),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Custom Segmented Tab Switcher
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          Expanded(child: _tabButton(0, 'Assigned Batches', Icons.class_rounded)),
                          Expanded(child: _tabButton(1, 'Student Roster', Icons.groups_rounded)),
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
                  _buildClassesTab(isDark),
                  _buildStudentsTab(isDark, filteredStudents),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildClassesTab(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      physics: const BouncingScrollPhysics(),
      itemCount: _assignedClasses.length,
      itemBuilder: (context, index) {
        final item = _assignedClasses[index];
        final color = item['color'] as Color;

        return Container(
          margin: const EdgeInsets.only(bottom: 14),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                blurRadius: 10, offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 48, height: 48,
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Center(
                        child: Text(
                          item['avatar'] as String,
                          style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: color),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item['class'] as String,
                              style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : const Color(0xFF0F172A))),
                          const SizedBox(height: 2),
                          Text('${item['subject']} • ${item['room']}',
                              style: GoogleFonts.inter(fontSize: 12.5, color: Colors.grey)),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(Icons.people_alt_rounded, size: 13, color: color),
                              const SizedBox(width: 4),
                              Text('${item['students']} Students',
                                  style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: color)),
                              const SizedBox(width: 12),
                              const Icon(Icons.star_rounded, size: 13, color: Color(0xFFD97706)),
                              const SizedBox(width: 3),
                              Text('Avg Score: ${item['avgScore']}',
                                  style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.w600, color: const Color(0xFFD97706))),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF334155).withValues(alpha: 0.25) : const Color(0xFFF8FAFC),
                  borderRadius: const BorderRadius.vertical(bottom: Radius.circular(19)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: _quickActionButton(
                        icon: Icons.how_to_reg_rounded,
                        label: 'Attendance',
                        color: AppTheme.teacherPurple,
                        onTap: () => context.push('/teacher-attendance'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _quickActionButton(
                        icon: Icons.grade_rounded,
                        label: 'Marks Entry',
                        color: AppTheme.teacherPurple,
                        onTap: () => context.push('/teacher-marks-entry'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _quickActionButton(
                        icon: Icons.videocam_rounded,
                        label: 'Live Class',
                        color: AppTheme.teacherPurple,
                        onTap: () => context.push('/teacher-live-classes'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ).animate().fadeIn(duration: 300.ms, delay: (index * 40).ms);
      },
    );
  }

  Widget _buildStudentsTab(bool isDark, List<Map<String, dynamic>> students) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          child: Container(
            height: 42,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6)],
            ),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v),
              style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.white : const Color(0xFF0F172A)),
              decoration: InputDecoration(
                hintText: 'Search student or class…',
                hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.teacherPurple, size: 18),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 11),
              ),
            ),
          ),
        ),

        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            physics: const BouncingScrollPhysics(),
            itemCount: students.length,
            itemBuilder: (context, index) {
              final student = students[index];
              final avatarColor = _avatarColors[index % _avatarColors.length];

              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 42, height: 42,
                      decoration: BoxDecoration(
                        color: avatarColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: Text(
                          student['avatar'] as String,
                          style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(student['name'] as String,
                              style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : const Color(0xFF0F172A))),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Text('Roll ${student['roll']}',
                                  style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppTheme.teacherPurple.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text('Class ${student['class']}',
                                    style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(student['score'] as String,
                            style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                        Text(student['status'] as String,
                            style: GoogleFonts.inter(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
            },
          ),
        ),
      ],
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
            Icon(icon, size: 15, color: active ? AppTheme.teacherPurple : Colors.white70),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12, fontWeight: FontWeight.bold,
                color: active ? AppTheme.teacherPurple : Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _quickActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 7, horizontal: 4),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withValues(alpha: 0.25)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 13, color: color),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                label, maxLines: 1, overflow: TextOverflow.ellipsis,
                style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.bold, color: color),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _emeraldStat(String val, String label, Color bg, Color fg) {
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
