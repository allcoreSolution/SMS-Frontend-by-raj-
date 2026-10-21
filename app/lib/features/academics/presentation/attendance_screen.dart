import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/services/student_data_repository.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> with SingleTickerProviderStateMixin {
  int _selectedTab = 0;
  late final PageController _pageController;

  final List<String> _tabs = ['Daily Timeline', 'Monthly Log', 'Subject Analytics'];

  final List<Map<String, String>> _schedule = [
    {'time': '08:00 – 09:00 AM', 'subject': 'Mathematics', 'teacher': 'Dr. Rajesh Sharma', 'room': 'Room 204', 'status': 'Present', 'icon': '1'},
    {'time': '09:00 – 10:00 AM', 'subject': 'Physics', 'teacher': 'Prof. Ananya Verma', 'room': 'Physics Lab', 'status': 'Present', 'icon': '2'},
    {'time': '10:00 – 11:00 AM', 'subject': 'Chemistry', 'teacher': 'Er. Vikram Singh', 'room': 'Chem Lab 1', 'status': 'Present', 'icon': '3'},
    {'time': '11:00 – 11:30 AM', 'subject': 'Recess & Lunch Break', 'teacher': '-', 'room': 'Cafeteria', 'status': 'Break', 'icon': '☕'},
    {'time': '11:30 – 12:30 PM', 'subject': 'Computer Science', 'teacher': 'Mr. Amit Das', 'room': 'CS Lab 3', 'status': 'Absent', 'icon': '4'},
    {'time': '12:30 – 01:30 PM', 'subject': 'English Literature', 'teacher': 'Mrs. Sarah Johnson', 'room': 'Room 108', 'status': 'Present', 'icon': '5'},
    {'time': '01:30 – 02:30 PM', 'subject': 'Physical Education', 'teacher': 'Coach Ranveer', 'room': 'Sports Complex', 'status': 'Present', 'icon': '6'},
  ];

  final List<Map<String, String>> _monthlyRecords = [
    {'date': '24 May, Sat', 'status': 'Present', 'in': '08:25 AM', 'out': '02:30 PM', 'periods': '6/7'},
    {'date': '23 May, Fri', 'status': 'Present', 'in': '08:20 AM', 'out': '02:30 PM', 'periods': '7/7'},
    {'date': '22 May, Thu', 'status': 'Late', 'in': '08:42 AM', 'out': '02:30 PM', 'periods': '5/7'},
    {'date': '21 May, Wed', 'status': 'Leave', 'in': '--:--', 'out': '--:--', 'periods': '0/7'},
    {'date': '20 May, Tue', 'status': 'Present', 'in': '08:24 AM', 'out': '02:30 PM', 'periods': '7/7'},
    {'date': '19 May, Mon', 'status': 'Half Day', 'in': '08:25 AM', 'out': '12:00 PM', 'periods': '4/7'},
    {'date': '17 May, Sat', 'status': 'Present', 'in': '08:22 AM', 'out': '02:30 PM', 'periods': '7/7'},
    {'date': '16 May, Fri', 'status': 'Present', 'in': '08:25 AM', 'out': '02:30 PM', 'periods': '7/7'},
  ];

  final List<Map<String, String>> _subjectAnalytics = [
    {'subject': 'Mathematics', 'present': '48', 'total': '52', 'pct': '92.3', 'teacher': 'Dr. Rajesh Sharma'},
    {'subject': 'Physics', 'present': '46', 'total': '50', 'pct': '92.0', 'teacher': 'Prof. Ananya Verma'},
    {'subject': 'Chemistry', 'present': '49', 'total': '50', 'pct': '98.0', 'teacher': 'Er. Vikram Singh'},
    {'subject': 'Computer Science', 'present': '40', 'total': '48', 'pct': '83.3', 'teacher': 'Mr. Amit Das'},
    {'subject': 'English', 'present': '44', 'total': '46', 'pct': '95.6', 'teacher': 'Mrs. Sarah Johnson'},
    {'subject': 'Physical Education', 'present': '25', 'total': '26', 'pct': '96.1', 'teacher': 'Coach Ranveer'},
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _selectedTab);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      StudentDataRepository.instance.fetchStudentAttendance();
    });
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

  void _openStudentGateScanModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF0F172A) : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 44, height: 4, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(10))),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.security_rounded, color: Color(0xFF2563EB), size: 22),
                  const SizedBox(width: 8),
                  Text('Campus Gate AI Face Mesh Verification', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                ],
              ),
              const SizedBox(height: 4),
              Text('Gate No 1 • RFID Scanner Tag: STU-2024-9902', style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 20),
              Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(28),
                  color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                  border: Border.all(color: const Color(0xFF2563EB), width: 3),
                ),
                child: const Center(
                  child: Icon(Icons.face_retouching_natural_rounded, size: 80, color: Color(0xFF2563EB)),
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(20)),
                child: Text('Gate Entry Verified: 08:25:14 AM (99.8% Match) ✅', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                  onPressed: () => Navigator.pop(ctx),
                  child: Text('Close Entry Log Preview', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        elevation: 0,
        title: Text(
          'Student Attendance Portal',
          style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A)),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Column(
            children: [
              // ════════════════ AI GATE ENTRY HERO CARD ════════════════
              GestureDetector(
                onTap: _openStudentGateScanModal,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: isDark
                          ? [const Color(0xFF1E3A8A), const Color(0xFF2563EB)]
                          : [const Color(0xFF2563EB), const Color(0xFF3B82F6)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [BoxShadow(color: const Color(0xFF2563EB).withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 4))],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), shape: BoxShape.circle),
                        child: const Icon(Icons.face_retouching_natural_rounded, color: Colors.white, size: 28),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text('TODAY\'S CAMPUS GATE ENTRY', style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 0.8)),
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(color: const Color(0xFF34D399), borderRadius: BorderRadius.circular(6)),
                                  child: Text('VERIFIED ✅', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: const Color(0xFF064E3B))),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text('Present at 08:25 AM • Gate 1', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                            Text('RFID Tag: STU-2024-9902 (Aarav Sharma)', style: GoogleFonts.inter(fontSize: 11, color: Colors.white70)),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white, size: 16),
                    ],
                  ),
                ),
              ).animate().fadeIn(duration: 350.ms),

              const SizedBox(height: 14),

              // ════════════════ ATTENDANCE METRICS BAR (4 PILLS) ════════════════
              Row(
                children: [
                  _metricPill('92.4%', 'Overall %', const Color(0xFF2563EB), isDark),
                  const SizedBox(width: 8),
                  _metricPill('189', 'Present', const Color(0xFF059669), isDark),
                  const SizedBox(width: 8),
                  _metricPill('16', 'Absent', Colors.red, isDark),
                  const SizedBox(width: 8),
                  _metricPill('🔥 14d', 'Streak', const Color(0xFFD97706), isDark),
                ],
              ).animate().fadeIn(duration: 400.ms, delay: 100.ms),

              const SizedBox(height: 14),

              // ════════════════ CUSTOM TAB BAR ════════════════
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: List.generate(_tabs.length, (index) {
                    final isSel = _selectedTab == index;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => _onTabTapped(index),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: isSel ? (isDark ? const Color(0xFF2563EB) : Colors.white) : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: isSel ? [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 4)] : [],
                          ),
                          child: Center(
                            child: Text(
                              _tabs[index],
                              style: GoogleFonts.outfit(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isSel
                                    ? (isDark ? Colors.white : const Color(0xFF2563EB))
                                    : (isDark ? Colors.white60 : const Color(0xFF64748B)),
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),

              const SizedBox(height: 14),

              Expanded(
                child: ListenableBuilder(
                  listenable: StudentDataRepository.instance,
                  builder: (context, _) {
                    return PageView(
                      controller: _pageController,
                      physics: const BouncingScrollPhysics(),
                      onPageChanged: (index) => setState(() => _selectedTab = index),
                      children: [
                        _buildDailyTab(isDark),
                        _buildMonthlyTab(isDark),
                        _buildSubjectAnalyticsTab(isDark),
                      ],
                    );
                  }
                ),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _metricPill(String value, String label, Color col, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            Text(value, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w900, color: col)),
            Text(label, style: GoogleFonts.inter(fontSize: 10, color: isDark ? Colors.white60 : const Color(0xFF64748B))),
          ],
        ),
      ),
    );
  }

  Widget _buildDailyTab(bool isDark) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Saturday, 24 May 2025', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
            Text('Class 10 - A • 7 Periods', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
          ],
        ),
        const SizedBox(height: 10),
        Expanded(
          child: ListView.separated(
            physics: const BouncingScrollPhysics(),
            itemCount: _schedule.length,
            separatorBuilder: (_, _) => const SizedBox(height: 10),
            itemBuilder: (ctx, i) {
              final item = _schedule[i];
              final isBreak = item['status'] == 'Break';
              final status = item['status']!;
              final Color statusColor = status == 'Present' ? const Color(0xFF059669) : (status == 'Absent' ? Colors.red : const Color(0xFFD97706));

              if (isBreak) {
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFFDE68A)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.free_breakfast_rounded, size: 18, color: Color(0xFFD97706)),
                      const SizedBox(width: 8),
                      Text('Cafeteria Recess & Lunch Break • ${item['time']}', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: const Color(0xFFD97706))),
                    ],
                  ),
                );
              }

              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(color: const Color(0xFF2563EB).withValues(alpha: 0.12), shape: BoxShape.circle),
                      child: Center(child: Text(item['icon']!, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF2563EB)))),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item['subject']!, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                          Text('${item['time']} • ${item['teacher']} • ${item['room']}', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                      child: Text(status, style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: statusColor)),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildMonthlyTab(bool isDark) {
    final attLogs = StudentDataRepository.instance.attendanceLog;
    int presentCnt = attLogs.where((e) => e['status'] == 'Present').length;
    double pct = attLogs.isEmpty ? 0 : (presentCnt / attLogs.length) * 100;

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Overall Academic Log', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
            Text('${pct.toStringAsFixed(1)}% Attendance Rate', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
          ],
        ),
        const SizedBox(height: 10),
        Expanded(
          child: attLogs.isEmpty
              ? const Center(child: CircularProgressIndicator())
              : ListView.separated(
                  physics: const BouncingScrollPhysics(),
                  itemCount: attLogs.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 10),
                  itemBuilder: (ctx, i) {
                    final item = attLogs[i];
                    final status = item['status']!;
                    
                    DateTime? parsedDate;
                    try {
                      parsedDate = DateTime.parse(item['date']!);
                    } catch (e) {
                      // ignore
                    }
                    final dateStr = parsedDate != null ? DateFormat('dd MMM, EEE').format(parsedDate) : item['date']!;

                    final Color col = status == 'Present' ? const Color(0xFF059669) : (status == 'Late' ? const Color(0xFFD97706) : (status == 'Leave' ? const Color(0xFF2563EB) : Colors.red));

                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(dateStr, style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                              Text(status == 'Present' ? 'In: 08:00 AM • Out: 02:30 PM' : 'Whole Day', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: col.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                            child: Text(status, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: col)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildSubjectAnalyticsTab(bool isDark) {
    return ListView.separated(
      physics: const BouncingScrollPhysics(),
      itemCount: _subjectAnalytics.length,
      separatorBuilder: (_, _) => const SizedBox(height: 10),
      itemBuilder: (ctx, i) {
        final sub = _subjectAnalytics[i];
        final pct = double.parse(sub['pct']!);
        final col = pct >= 90 ? const Color(0xFF059669) : (pct >= 75 ? const Color(0xFFD97706) : Colors.red);

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(sub['subject']!, style: GoogleFonts.outfit(fontSize: 15.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  Text('${sub['pct']}%', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: col)),
                ],
              ),
              const SizedBox(height: 2),
              Text('Faculty: ${sub['teacher']} • Attended: ${sub['present']}/${sub['total']} classes', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
              const SizedBox(height: 10),
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: pct / 100,
                  minHeight: 8,
                  backgroundColor: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                  color: col,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
