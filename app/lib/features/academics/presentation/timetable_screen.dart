import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/widgets/custom_segmented_tab_bar.dart';

class TimetableScreen extends StatefulWidget {
  const TimetableScreen({super.key});

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {
  int _selectedDay = 0;
  late final PageController _pageController;

  final List<String> _days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  final Map<int, List<Map<String, String>>> _weeklySchedule = {
    0: [
      // Monday
      {
        'time': '08:30 – 09:20 AM',
        'subject': 'Mathematics',
        'teacher': 'Mr. Sharma',
        'room': 'Room 12',
        'type': 'Lecture',
        'color': '0xFF2563EB',
      },
      {
        'time': '09:20 – 10:10 AM',
        'subject': 'English',
        'teacher': 'Mrs. Johnson',
        'room': 'Room 15',
        'type': 'Lecture',
        'color': '0xFF8B5CF6',
      },
      {
        'time': '10:10 – 11:00 AM',
        'subject': 'Science',
        'teacher': 'Mr. Verma',
        'room': 'Lab 2',
        'type': 'Practical',
        'color': '0xFF10B981',
      },
      {
        'time': '11:00 – 11:30 AM',
        'subject': 'Recess Break',
        'teacher': '-',
        'room': 'Cafeteria',
        'type': 'Break',
        'color': '0xFFF59E0B',
      },
      {
        'time': '11:30 – 12:20 PM',
        'subject': 'Computer Science',
        'teacher': 'Mr. Das',
        'room': 'Lab 1',
        'type': 'Lab',
        'color': '0xFFEC4899',
      },
      {
        'time': '12:20 – 01:10 PM',
        'subject': 'Hindi',
        'teacher': 'Mrs. Singh',
        'room': 'Room 19',
        'type': 'Lecture',
        'color': '0xFFEF4444',
      },
      {
        'time': '01:10 – 02:00 PM',
        'subject': 'Social Science',
        'teacher': 'Mr. Gupta',
        'room': 'Room 05',
        'type': 'Lecture',
        'color': '0xFF14B8A6',
      },
    ],
    1: [
      // Tuesday
      {
        'time': '08:30 – 09:20 AM',
        'subject': 'Science',
        'teacher': 'Mr. Verma',
        'room': 'Lab 2',
        'type': 'Lecture',
        'color': '0xFF10B981',
      },
      {
        'time': '09:20 – 10:10 AM',
        'subject': 'Mathematics',
        'teacher': 'Mr. Sharma',
        'room': 'Room 12',
        'type': 'Lecture',
        'color': '0xFF2563EB',
      },
      {
        'time': '10:10 – 11:00 AM',
        'subject': 'Social Science',
        'teacher': 'Mr. Gupta',
        'room': 'Room 05',
        'type': 'Lecture',
        'color': '0xFF14B8A6',
      },
      {
        'time': '11:00 – 11:30 AM',
        'subject': 'Recess Break',
        'teacher': '-',
        'room': 'Cafeteria',
        'type': 'Break',
        'color': '0xFFF59E0B',
      },
      {
        'time': '11:30 – 12:20 PM',
        'subject': 'English',
        'teacher': 'Mrs. Johnson',
        'room': 'Room 15',
        'type': 'Lecture',
        'color': '0xFF8B5CF6',
      },
      {
        'time': '12:20 – 01:10 PM',
        'subject': 'Physical Ed.',
        'teacher': 'Coach Rawat',
        'room': 'Playground',
        'type': 'Sports',
        'color': '0xFF06B6D4',
      },
      {
        'time': '01:10 – 02:00 PM',
        'subject': 'Hindi',
        'teacher': 'Mrs. Singh',
        'room': 'Room 19',
        'type': 'Lecture',
        'color': '0xFFEF4444',
      },
    ],
    2: [
      // Wednesday
      {
        'time': '08:30 – 09:20 AM',
        'subject': 'English',
        'teacher': 'Mrs. Johnson',
        'room': 'Room 15',
        'type': 'Lecture',
        'color': '0xFF8B5CF6',
      },
      {
        'time': '09:20 – 10:10 AM',
        'subject': 'Computer Science',
        'teacher': 'Mr. Das',
        'room': 'Lab 1',
        'type': 'Lab',
        'color': '0xFFEC4899',
      },
      {
        'time': '10:10 – 11:00 AM',
        'subject': 'Mathematics',
        'teacher': 'Mr. Sharma',
        'room': 'Room 12',
        'type': 'Lecture',
        'color': '0xFF2563EB',
      },
      {
        'time': '11:00 – 11:30 AM',
        'subject': 'Recess Break',
        'teacher': '-',
        'room': 'Cafeteria',
        'type': 'Break',
        'color': '0xFFF59E0B',
      },
      {
        'time': '11:30 – 12:20 PM',
        'subject': 'Science',
        'teacher': 'Mr. Verma',
        'room': 'Lab 2',
        'type': 'Lecture',
        'color': '0xFF10B981',
      },
      {
        'time': '12:20 – 01:10 PM',
        'subject': 'Art & Craft',
        'teacher': 'Ms. Mehta',
        'room': 'Art Room',
        'type': 'Activity',
        'color': '0xFFF97316',
      },
      {
        'time': '01:10 – 02:00 PM',
        'subject': 'Social Science',
        'teacher': 'Mr. Gupta',
        'room': 'Room 05',
        'type': 'Lecture',
        'color': '0xFF14B8A6',
      },
    ],
    3: [
      // Thursday
      {
        'time': '08:30 – 09:20 AM',
        'subject': 'Social Science',
        'teacher': 'Mr. Gupta',
        'room': 'Room 05',
        'type': 'Lecture',
        'color': '0xFF14B8A6',
      },
      {
        'time': '09:20 – 10:10 AM',
        'subject': 'Science',
        'teacher': 'Mr. Verma',
        'room': 'Lab 2',
        'type': 'Lecture',
        'color': '0xFF10B981',
      },
      {
        'time': '10:10 – 11:00 AM',
        'subject': 'Hindi',
        'teacher': 'Mrs. Singh',
        'room': 'Room 19',
        'type': 'Lecture',
        'color': '0xFFEF4444',
      },
      {
        'time': '11:00 – 11:30 AM',
        'subject': 'Recess Break',
        'teacher': '-',
        'room': 'Cafeteria',
        'type': 'Break',
        'color': '0xFFF59E0B',
      },
      {
        'time': '11:30 – 12:20 PM',
        'subject': 'Mathematics',
        'teacher': 'Mr. Sharma',
        'room': 'Room 12',
        'type': 'Lecture',
        'color': '0xFF2563EB',
      },
      {
        'time': '12:20 – 01:10 PM',
        'subject': 'English',
        'teacher': 'Mrs. Johnson',
        'room': 'Room 15',
        'type': 'Lecture',
        'color': '0xFF8B5CF6',
      },
      {
        'time': '01:10 – 02:00 PM',
        'subject': 'Library Period',
        'teacher': 'Mr. Roy',
        'room': 'Library',
        'type': 'Self Study',
        'color': '0xFF6366F1',
      },
    ],
    4: [
      // Friday
      {
        'time': '08:30 – 09:20 AM',
        'subject': 'Mathematics',
        'teacher': 'Mr. Sharma',
        'room': 'Room 12',
        'type': 'Lecture',
        'color': '0xFF2563EB',
      },
      {
        'time': '09:20 – 10:10 AM',
        'subject': 'Hindi',
        'teacher': 'Mrs. Singh',
        'room': 'Room 19',
        'type': 'Lecture',
        'color': '0xFFEF4444',
      },
      {
        'time': '10:10 – 11:00 AM',
        'subject': 'Computer Science',
        'teacher': 'Mr. Das',
        'room': 'Lab 1',
        'type': 'Lab',
        'color': '0xFFEC4899',
      },
      {
        'time': '11:00 – 11:30 AM',
        'subject': 'Recess Break',
        'teacher': '-',
        'room': 'Cafeteria',
        'type': 'Break',
        'color': '0xFFF59E0B',
      },
      {
        'time': '11:30 – 12:20 PM',
        'subject': 'Science Lab',
        'teacher': 'Mr. Verma',
        'room': 'Chem Lab',
        'type': 'Practical',
        'color': '0xFF10B981',
      },
      {
        'time': '12:20 – 01:10 PM',
        'subject': 'Social Science',
        'teacher': 'Mr. Gupta',
        'room': 'Room 05',
        'type': 'Lecture',
        'color': '0xFF14B8A6',
      },
      {
        'time': '01:10 – 02:00 PM',
        'subject': 'English',
        'teacher': 'Mrs. Johnson',
        'room': 'Room 15',
        'type': 'Lecture',
        'color': '0xFF8B5CF6',
      },
    ],
    5: [
      // Saturday
      {
        'time': '08:30 – 09:20 AM',
        'subject': 'Mathematics Practice',
        'teacher': 'Mr. Sharma',
        'room': 'Room 12',
        'type': 'Tutorial',
        'color': '0xFF2563EB',
      },
      {
        'time': '09:20 – 10:10 AM',
        'subject': 'Science Quiz',
        'teacher': 'Mr. Verma',
        'room': 'Lab 2',
        'type': 'Quiz',
        'color': '0xFF10B981',
      },
      {
        'time': '10:10 – 11:00 AM',
        'subject': 'Extracurricular / Club',
        'teacher': 'Various',
        'room': 'Auditorium',
        'type': 'Club',
        'color': '0xFFF59E0B',
      },
      {
        'time': '11:00 – 11:30 AM',
        'subject': 'Dismissal',
        'teacher': '-',
        'room': 'Main Gate',
        'type': 'Break',
        'color': '0xFF64748B',
      },
    ],
  };

  @override
  void initState() {
    super.initState();
    // Default to current weekday index if Mon-Sat
    final today = DateTime.now().weekday - 1;
    _selectedDay = (today >= 0 && today <= 5) ? today : 0;
    _pageController = PageController(initialPage: _selectedDay);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onDaySelected(int index) {
    setState(() => _selectedDay = index);
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
        backgroundColor: isDark
            ? const Color(0xFF0F172A)
            : const Color(0xFFF8FAFF),
        appBar: AppBar(
          backgroundColor: isDark
              ? const Color(0xFF0F172A)
              : const Color(0xFFF8FAFF),
          title: Text(
            'Student Timetable',
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
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
            child: Column(
              children: [
                // Day Selection Segmented Tab Bar
                CustomSegmentedTabBar(
                  tabs: _days,
                  selectedIndex: _selectedDay,
                  onTabChanged: _onDaySelected,
                ).animate().fadeIn(duration: 350.ms).slideY(begin: -0.15),

                const SizedBox(height: 14),

                // Student Class info header chip
                Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isDark
                              ? Colors.white10
                              : const Color(0xFFE2E8F0),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(
                              alpha: isDark ? 0.2 : 0.03,
                            ),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(
                                    0xFF2563EB,
                                  ).withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.school_rounded,
                                  color: Color(0xFF2563EB),
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Class 10 - Section A',
                                    style: GoogleFonts.outfit(
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                      color: isDark
                                          ? Colors.white
                                          : const Color(0xFF0F172A),
                                    ),
                                  ),
                                  Text(
                                    'Rahul Sharma • Roll No. 22',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: isDark
                                          ? const Color(0xFF94A3B8)
                                          : const Color(0xFF64748B),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(
                                0xFF10B981,
                              ).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              'Session 2024-25',
                              style: GoogleFonts.inter(
                                fontSize: 11.5,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF10B981),
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                    .animate()
                    .fadeIn(duration: 350.ms, delay: 100.ms)
                    .slideY(begin: 0.1),

                const SizedBox(height: 14),

                // PageView for Timetable per Day
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    physics: const BouncingScrollPhysics(),
                    onPageChanged: (index) =>
                        setState(() => _selectedDay = index),
                    itemCount: _days.length,
                    itemBuilder: (context, dayIdx) {
                      final daySchedule = _weeklySchedule[dayIdx] ?? [];

                      return ListView.builder(
                        physics: const BouncingScrollPhysics(),
                        itemCount: daySchedule.length,
                        itemBuilder: (context, itemIdx) {
                          final period = daySchedule[itemIdx];
                          final isBreak = period['type'] == 'Break';
                          final colorVal = int.parse(period['color']!);
                          final color = Color(colorVal);

                          if (isBreak) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(
                                  0xFFF59E0B,
                                ).withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: const Color(
                                    0xFFF59E0B,
                                  ).withValues(alpha: 0.3),
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.coffee_rounded,
                                    color: Color(0xFFD97706),
                                    size: 20,
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    period['subject']!,
                                    style: GoogleFonts.outfit(
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFFD97706),
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    period['time']!,
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFFD97706),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }

                          return Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF1E293B)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isDark
                                    ? Colors.white10
                                    : const Color(0xFFE2E8F0),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(
                                    alpha: isDark ? 0.15 : 0.02,
                                  ),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                // Period Number / Color bar
                                Container(
                                  width: 4,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: color,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                // Period details
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Flexible(
                                            child: Text(
                                              period['subject']!,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: GoogleFonts.outfit(
                                                fontSize: 15.5,
                                                fontWeight: FontWeight.bold,
                                                color: isDark
                                                    ? Colors.white
                                                    : const Color(0xFF0F172A),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 7,
                                              vertical: 2,
                                            ),
                                            decoration: BoxDecoration(
                                              color: color.withValues(
                                                alpha: 0.12,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              period['type']!,
                                              style: GoogleFonts.inter(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: color,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Wrap(
                                        spacing: 8,
                                        runSpacing: 2,
                                        children: [
                                          Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Icon(
                                                Icons.person_outline_rounded,
                                                size: 13,
                                                color: Color(0xFF64748B),
                                              ),
                                              const SizedBox(width: 3),
                                              Text(
                                                period['teacher']!,
                                                style: GoogleFonts.inter(
                                                  fontSize: 11.5,
                                                  color: isDark
                                                      ? const Color(0xFF94A3B8)
                                                      : const Color(0xFF64748B),
                                                ),
                                              ),
                                            ],
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Icon(
                                                Icons.meeting_room_outlined,
                                                size: 13,
                                                color: Color(0xFF64748B),
                                              ),
                                              const SizedBox(width: 3),
                                              Text(
                                                period['room']!,
                                                style: GoogleFonts.inter(
                                                  fontSize: 11.5,
                                                  color: isDark
                                                      ? const Color(0xFF94A3B8)
                                                      : const Color(0xFF64748B),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                // Time badge
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? const Color(0xFF334155)
                                        : const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    period['time']!,
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: isDark
                                          ? const Color(0xFFCBD5E1)
                                          : const Color(0xFF334155),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
