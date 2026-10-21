import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherNoticeBoardScreen extends StatefulWidget {
  const TeacherNoticeBoardScreen({super.key});

  @override
  State<TeacherNoticeBoardScreen> createState() => _TeacherNoticeBoardScreenState();
}

class _TeacherNoticeBoardScreenState extends State<TeacherNoticeBoardScreen> {
  int _selectedFilterIndex = 0;
  final List<String> _filters = ['All', 'School', 'Academic'];

  final List<Map<String, dynamic>> _notices = [
    {
      'title': 'Teacher Meeting',
      'desc': 'All teachers are requested to attend the meeting on 07 May, 2025.',
      'category': 'Academic',
      'isNew': true,
      'color': const Color(0xFFEF4444),
      'icon': Icons.notifications_active_rounded,
    },
    {
      'title': 'Holiday Notice',
      'desc': 'School will remain closed on 12 May 2025 (Monday).',
      'category': 'School',
      'isNew': false,
      'color': const Color(0xFF2563EB),
      'icon': Icons.calendar_today_rounded,
    },
    {
      'title': 'Annual Day Celebration',
      'desc': 'Annual Day will be held on 25 May, 2025.',
      'category': 'School',
      'isNew': false,
      'color': const Color(0xFFF59E0B),
      'icon': Icons.star_rounded,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final filteredNotices = _selectedFilterIndex == 0
        ? _notices
        : _notices.where((n) => n['category'] == _filters[_selectedFilterIndex]).toList();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDark ? Colors.white : const Color(0xFF0F172A), size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/teacher-dashboard');
            }
          },
        ),
        title: Text('Notice Board', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Filter Chips
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: List.generate(_filters.length, (index) {
                  final selected = _selectedFilterIndex == index;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(_filters[index]),
                      selected: selected,
                      selectedColor: AppTheme.teacherPurple,
                      backgroundColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                      labelStyle: GoogleFonts.inter(
                        fontSize: 12.5,
                        fontWeight: FontWeight.bold,
                        color: selected ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF475569)),
                      ),
                      onSelected: (val) => setState(() => _selectedFilterIndex = index),
                    ),
                  );
                }),
              ),
            ),

            // Notices List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                physics: const BouncingScrollPhysics(),
                itemCount: filteredNotices.length,
                itemBuilder: (context, index) {
                  final notice = filteredNotices[index];
                  final Color nColor = notice['color'] as Color;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6)],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(notice['icon'] as IconData, size: 18, color: nColor),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                notice['title'] as String,
                                style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                              ),
                            ),
                            if (notice['isNew'] == true)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(color: AppTheme.teacherPurple, borderRadius: BorderRadius.circular(6)),
                                child: Text('New', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          notice['desc'] as String,
                          style: GoogleFonts.inter(fontSize: 12.5, height: 1.4, color: isDark ? Colors.white70 : const Color(0xFF475569)),
                        ),
                      ],
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
