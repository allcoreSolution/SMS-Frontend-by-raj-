import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/widgets/custom_segmented_tab_bar.dart';

class AssignmentsScreen extends StatefulWidget {
  const AssignmentsScreen({super.key});

  @override
  State<AssignmentsScreen> createState() => _AssignmentsScreenState();
}

class _AssignmentsScreenState extends State<AssignmentsScreen> {
  int _selectedTab = 0;
  late final PageController _pageController;

  final List<String> _tabs = ['All', 'Pending', 'Submitted', 'Graded'];

  final List<Map<String, dynamic>> _assignments = [
    {
      'subject': 'Science',
      'title': 'Science Project – Water Conservation',
      'desc': 'Make a working model or PPT on Water Conservation methods.',
      'teacher': 'Mr. Verma',
      'maxMarks': '20',
      'date': 'Due: 25 May 2024',
      'status': 'Submitted',
      'color': Color(0xFF10B981),
      'grade': null,
    },
    {
      'subject': 'Mathematics',
      'title': 'Trigonometry Questions',
      'desc': 'Solve Chapter 8 Trigonometry – All exercises (Q1–Q15).',
      'teacher': 'Mr. Sharma',
      'maxMarks': '25',
      'date': 'Due: 28 May 2024',
      'status': 'Graded',
      'color': Color(0xFF2563EB),
      'grade': '22/25',
    },
    {
      'subject': 'Social Science',
      'title': 'Map Work – Climatic Zones',
      'desc': 'Mark all climatic zones of India on the outline map.',
      'teacher': 'Mr. Gupta',
      'maxMarks': '15',
      'date': 'Due: 30 May 2024',
      'status': 'Pending',
      'color': Color(0xFFF59E0B),
      'grade': null,
    },
    {
      'subject': 'English',
      'title': 'Letter Writing Assignment',
      'desc': 'Write formal and informal letters on given topics.',
      'teacher': 'Mrs. Johnson',
      'maxMarks': '20',
      'date': 'Due: 02 Jun 2024',
      'status': 'Pending',
      'color': Color(0xFF8B5CF6),
      'grade': null,
    },
    {
      'subject': 'Hindi',
      'title': 'Nibandh Lekhan',
      'desc': 'Write a 400-word essay on "Swachh Bharat Abhiyan".',
      'teacher': 'Mrs. Singh',
      'maxMarks': '15',
      'date': 'Due: 03 Jun 2024',
      'status': 'Graded',
      'color': Color(0xFFEC4899),
      'grade': '13/15',
    },
    {
      'subject': 'Computer',
      'title': 'Python Basics Assignment',
      'desc': 'Write programs for basic Python concepts – loops, functions.',
      'teacher': 'Mr. Das',
      'maxMarks': '25',
      'date': 'Due: 05 Jun 2024',
      'status': 'Submitted',
      'color': Color(0xFFEF4444),
      'grade': null,
    },
  ];

  Color _statusColor(String status) {
    if (status == 'Pending') return const Color(0xFFF59E0B);
    if (status == 'Submitted') return const Color(0xFF2563EB);
    return const Color(0xFF10B981);
  }

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _selectedTab);
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
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/dashboard');
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        title: Text(
          'Assignments',
          style: GoogleFonts.outfit(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          child: Column(
            children: [
              // Segmented Tab Bar
              CustomSegmentedTabBar(
                tabs: _tabs,
                selectedIndex: _selectedTab,
                onTabChanged: _onTabTapped,
              ),

              const SizedBox(height: 14),

              // Stats Row
              Row(
                children: [
                  _statPill(isDark, '${_assignments.where((a) => a['status'] == 'Pending').length}', 'Pending', const Color(0xFFF59E0B)),
                  const SizedBox(width: 8),
                  _statPill(isDark, '${_assignments.where((a) => a['status'] == 'Submitted').length}', 'Submitted', const Color(0xFF2563EB)),
                  const SizedBox(width: 8),
                  _statPill(isDark, '${_assignments.where((a) => a['status'] == 'Graded').length}', 'Graded', const Color(0xFF10B981)),
                ],
              ),

              const SizedBox(height: 12),

              // PageView for Swipe
              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const BouncingScrollPhysics(),
                  onPageChanged: (index) => setState(() => _selectedTab = index),
                  children: List.generate(
                    _tabs.length,
                    (pageIndex) {
                      final list = pageIndex == 0
                          ? _assignments
                          : _assignments.where((a) => a['status'] == _tabs[pageIndex]).toList();

                      return list.isEmpty
                          ? Center(
                              child: Text(
                                'No ${_tabs[pageIndex]} assignments',
                                style: GoogleFonts.outfit(color: Colors.grey, fontSize: 15),
                              ),
                            )
                          : ListView.builder(
                              physics: const BouncingScrollPhysics(),
                              itemCount: list.length,
                              itemBuilder: (context, index) {
                                final item = list[index];
                                final status = item['status'] as String;
                                final color = item['color'] as Color;
                                final statusColor = _statusColor(status);

                                return Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                                    borderRadius: BorderRadius.circular(18),
                                    border: Border.all(
                                      color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
                                        blurRadius: 10,
                                        offset: const Offset(0, 2),
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
                                              color: color.withValues(alpha: 0.12),
                                              borderRadius: BorderRadius.circular(20),
                                            ),
                                            child: Text(
                                              item['subject'] as String,
                                              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: color),
                                            ),
                                          ),
                                          Row(
                                            children: [
                                              if (item['grade'] != null)
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                                  margin: const EdgeInsets.only(right: 6),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFF10B981).withValues(alpha: 0.12),
                                                    borderRadius: BorderRadius.circular(20),
                                                  ),
                                                  child: Text(
                                                    item['grade'] as String,
                                                    style: GoogleFonts.outfit(
                                                      fontSize: 12,
                                                      fontWeight: FontWeight.bold,
                                                      color: const Color(0xFF10B981),
                                                    ),
                                                  ),
                                                ),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                                decoration: BoxDecoration(
                                                  color: statusColor.withValues(alpha: 0.12),
                                                  borderRadius: BorderRadius.circular(20),
                                                ),
                                                child: Text(
                                                  status,
                                                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: statusColor),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        item['title'] as String,
                                        style: GoogleFonts.outfit(
                                          fontSize: 15.5,
                                          fontWeight: FontWeight.bold,
                                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        item['desc'] as String,
                                        style: GoogleFonts.inter(fontSize: 12.5, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                                      ),
                                      const SizedBox(height: 10),
                                      Row(
                                        children: [
                                          const Icon(Icons.person_outline_rounded, size: 14, color: Color(0xFF64748B)),
                                          const SizedBox(width: 4),
                                          Text(item['teacher'] as String, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B))),
                                          const SizedBox(width: 12),
                                          const Icon(Icons.calendar_today_rounded, size: 14, color: Color(0xFF64748B)),
                                          const SizedBox(width: 4),
                                          Text(
                                            item['date'] as String,
                                            style: GoogleFonts.inter(
                                              fontSize: 12,
                                              color: status == 'Pending' ? const Color(0xFFEF4444) : const Color(0xFF64748B),
                                              fontWeight: status == 'Pending' ? FontWeight.bold : FontWeight.normal,
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          const Icon(Icons.star_rounded, size: 14, color: Color(0xFFF59E0B)),
                                          const SizedBox(width: 4),
                                          Text(
                                            'Max: ${item['maxMarks']}',
                                            style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B)),
                                          ),
                                        ],
                                      ),
                                      if (status == 'Pending') ...[
                                        const SizedBox(height: 12),
                                        SizedBox(
                                          width: double.infinity,
                                          child: ElevatedButton.icon(
                                            onPressed: () {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(content: Text('Submitting ${item['title']}...')),
                                              );
                                            },
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: const Color(0xFF2563EB),
                                              foregroundColor: Colors.white,
                                              minimumSize: const Size.fromHeight(44),
                                              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                              elevation: 0,
                                            ),
                                            icon: const Icon(Icons.upload_rounded, size: 18),
                                            label: Text('Submit Assignment', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 14)),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                );
                              },
                            );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _statPill(bool isDark, String count, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Text(count, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 18, color: color)),
            Text(label, style: GoogleFonts.inter(fontSize: 11, color: color)),
          ],
        ),
      ),
    );
  }
}
