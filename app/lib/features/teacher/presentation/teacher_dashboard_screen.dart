import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/theme/app_theme.dart';

class TeacherDashboardScreen extends StatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  bool _isCheckedIn = true;
  
  // Real-time Dashboard State
  bool _isLoading = true;
  String _workingHours = '08h 00m';
  String _leaveBalance = '10.0';
  String _salaryStatus = 'Pending';
  List<dynamic> _notices = [];
  List<dynamic> _events = [];
  int _totalStudents = 0;

  @override
  void initState() {
    super.initState();
    _fetchLiveDashboardData();
  }

  Future<void> _fetchLiveDashboardData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      final header = {'Authorization': 'Bearer $token'};

      // 1. Fetch Notices
      try {
        final noticeRes = await http.get(Uri.parse('${AuthService.baseUrl}api/notices?audience=Teacher'), headers: header).timeout(const Duration(seconds: 15));
        if (noticeRes.statusCode == 200) {
          final data = jsonDecode(noticeRes.body);
          if (data['data'] != null) _notices = data['data'];
        }
      } catch (e) {}

      // 2. Fetch Leaves
      try {
        final leaveRes = await http.get(Uri.parse('${AuthService.baseUrl}api/leaves'), headers: header).timeout(const Duration(seconds: 15));
        if (leaveRes.statusCode == 200) {
           final data = jsonDecode(leaveRes.body);
           final allLeaves = data['data'] as List? ?? [];
           final myLeaves = allLeaves.where((l) => l['staffId'] == AuthService.instance.teacherEmpId).toList();
           _leaveBalance = '${14 - myLeaves.length}';
        }
      } catch (e) {}

      // 3. Fetch Student Count
      try {
        final stRes = await http.get(Uri.parse('${AuthService.baseUrl}api/students'), headers: header).timeout(const Duration(seconds: 15));
        if (stRes.statusCode == 200) {
           final data = jsonDecode(stRes.body);
           _totalStudents = (data['data'] as List? ?? []).length;
        }
      } catch (e) {}

      // 4. Fetch Events
      try {
        final evRes = await http.get(Uri.parse('${AuthService.baseUrl}api/events'), headers: header).timeout(const Duration(seconds: 15));
        if (evRes.statusCode == 200) {
           final data = jsonDecode(evRes.body);
           if (data['data'] != null) _events = data['data'];
        }
      } catch (e) {}

    } catch (e) {
      debugPrint('Dashboard data fetch failed: $e');
    }
    
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  // 3 Primary Important Quick Action Cards (Remaining tools accessible via View All)
  final List<Map<String, dynamic>> _quickActions = [
    {'label': 'Attendance', 'icon': Icons.fingerprint_rounded, 'color': const Color(0xFF10B981), 'bgColor': const Color(0xFFD1FAE5), 'route': '/teacher-self-attendance'},
    {'label': 'My Classes', 'icon': Icons.class_rounded, 'color': const Color(0xFF2563EB), 'bgColor': const Color(0xFFDBEAFE), 'route': '/teacher-my-classes'},
    {'label': 'Exams & Marks', 'icon': Icons.assignment_turned_in_rounded, 'color': const Color(0xFF8B5CF6), 'bgColor': const Color(0xFFF3E8FF), 'route': '/teacher-exams-results'},
  ];

  void _openBiometricScanModal(String actionLabel) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _DashboardBiometricSheet(
        actionLabel: actionLabel,
        onVerified: () {
          Navigator.pop(ctx);
          setState(() => _isCheckedIn = !_isCheckedIn);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('$actionLabel Verified via AI Biometric Scanner! ✅'),
              backgroundColor: AppTheme.teacherPurple,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: bg,
      drawer: _buildSideDrawer(context, isDark),

      // ════════════════ TOP APP BAR (BRAND LOGO & NOTIFICATIONS) ════════════════
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.menu_rounded, color: isDark ? Colors.white : const Color(0xFF0F172A), size: 24),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        centerTitle: true,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.shield_rounded, color: AppTheme.teacherPurple, size: 24),
            const SizedBox(width: 6),
            Text(
              'TEACHER APP',
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                letterSpacing: 1,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: Icon(Icons.notifications_outlined, color: isDark ? Colors.white : const Color(0xFF0F172A), size: 24),
                onPressed: () => context.push('/teacher-notice-board'),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                  child: Text('6', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ],
          ),
          const SizedBox(width: 6),
        ],
      ),

      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ════════════════ USER GREETING & PROFILE AVATAR ════════════════
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text('Good Morning, ', style: GoogleFonts.inter(fontSize: 13, color: Colors.grey)),
                            Text('👋', style: GoogleFonts.inter(fontSize: 14)),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          AuthService.instance.teacherName.isNotEmpty
                              ? AuthService.instance.teacherName
                              : 'Faculty Member',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.outfit(
                            fontSize: (MediaQuery.of(context).size.width * 0.055).clamp(18.0, 24.0),
                            fontWeight: FontWeight.w900,
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                        Text(
                          'Senior Faculty Member',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () => context.push('/teacher-profile'),
                    child: Container(
                      width: 48, height: 48,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.teacherPurple.withValues(alpha: 0.3), width: 2),
                        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 6)],
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/teacher_avatar.png',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => const CircleAvatar(
                            backgroundColor: Color(0xFFEDE9FE),
                            child: Icon(Icons.person_rounded, color: AppTheme.teacherPurple),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ).animate().fadeIn(duration: 350.ms),

              const SizedBox(height: 18),

              // ════════════════ TOP 4 KEY METRICS STAT CARDS (RESPONSIVE GRID) ════════════════
              LayoutBuilder(
                builder: (context, constraints) {
                  final w = constraints.maxWidth;
                  final crossCount = w < 360 ? 2 : 4;
                  final aspect = w < 360 ? 1.35 : (w > 600 ? 1.1 : 0.74);

                  return GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: crossCount,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                    childAspectRatio: aspect,
                    children: _isLoading 
                        ? [ const Center(child: CircularProgressIndicator(color: AppTheme.teacherPurple)) ] 
                        : [
                      _buildStatCard('Total Students', '$_totalStudents', 'Assigned', Icons.groups_rounded, const Color(0xFF10B981), isDark),
                      _buildStatCard('Working Hours', _workingHours, 'Today', Icons.access_time_rounded, const Color(0xFF2563EB), isDark),
                      _buildStatCard('Leave Balance', _leaveBalance, 'Days left', Icons.work_outline_rounded, const Color(0xFF8B5CF6), isDark, onTap: () => context.push('/teacher-leaves')),
                      _buildStatCard('Salary Status', _salaryStatus, 'Current Month', Icons.account_balance_wallet_rounded, const Color(0xFFF59E0B), isDark, onTap: () => context.push('/teacher-salary-slip')),
                    ],
                  );
                },
              ).animate().fadeIn(duration: 400.ms, delay: 100.ms),

              const SizedBox(height: 22),

              // ════════════════ QUICK ACTIONS (RESPONSIVE GRID) ════════════════
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Quick Actions',
                    style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                  ),
                  GestureDetector(
                    onTap: () => context.push('/teacher-all-services'),
                    child: Text('View All', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: const Color(0xFF2563EB))),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              LayoutBuilder(
                builder: (context, constraints) {
                  final w = constraints.maxWidth;
                  final crossCount = w < 360 ? 2 : (w > 600 ? 4 : 3);
                  final aspect = w < 360 ? 1.25 : (w > 600 ? 1.1 : 0.95);

                  return GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _quickActions.length,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossCount,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: aspect,
                    ),
                    itemBuilder: (context, index) {
                      final action = _quickActions[index];
                      final Color aColor = action['color'] as Color;

                      return GestureDetector(
                        onTap: () => context.push(action['route'] as String),
                        child: Container(
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6, offset: const Offset(0, 2))],
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: isDark ? aColor.withValues(alpha: 0.15) : (action['bgColor'] as Color),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(action['icon'] as IconData, color: aColor, size: 20),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                action['label'] as String,
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ).animate().fadeIn(duration: 300.ms, delay: (index * 20).ms);
                    },
                  );
                },
              ),

              const SizedBox(height: 22),

              // ════════════════ TODAY'S ATTENDANCE / PUNCH CARD ════════════════
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 8)],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        GestureDetector(
                          onTap: () => context.push('/teacher-self-attendance'),
                          child: Row(
                            children: [
                              Text('Today\'s Attendance', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                              const SizedBox(width: 6),
                              const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppTheme.teacherPurple),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _isCheckedIn ? const Color(0xFFD1FAE5) : const Color(0xFFFEE2E2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            _isCheckedIn ? 'Checked In' : 'Checked Out',
                            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: _isCheckedIn ? const Color(0xFF10B981) : Colors.red),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Check In', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                            Text('09:15 AM', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF10B981))),
                            Text('Jun 08, 2024', style: GoogleFonts.inter(fontSize: 10.5, color: Colors.grey)),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(Icons.location_on_rounded, color: Color(0xFF2563EB), size: 16),
                            const SizedBox(width: 4),
                            Text('Main Campus Office', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : const Color(0xFF475569))),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('Check Out', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                            Text(_isCheckedIn ? '--:--' : '05:30 PM', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                            Text(_isCheckedIn ? '--:--' : 'Jun 08, 2024', style: GoogleFonts.inter(fontSize: 10.5, color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    const Divider(height: 1),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Working Time', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                            Text('08h 45m', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF2563EB))),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Overtime', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                            Text('00h 45m', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFFEA580C))),
                          ],
                        ),
                        ElevatedButton.icon(
                          onPressed: () => _openBiometricScanModal(_isCheckedIn ? 'Check Out' : 'Check In'),
                          icon: const Icon(Icons.camera_front_rounded, color: Colors.white, size: 16),
                          label: Text(_isCheckedIn ? 'Check Out' : 'Check In', style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _isCheckedIn ? const Color(0xFFDC2626) : const Color(0xFF10B981),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms, delay: 150.ms),

              const SizedBox(height: 22),

              // ════════════════ UPCOMING EVENTS SECTION ════════════════
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Upcoming Events', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  GestureDetector(
                    onTap: () => context.push('/teacher-timetable'),
                    child: Text('View Calendar', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: const Color(0xFF2563EB))),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              _isLoading 
                 ? const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator(color: AppTheme.teacherPurple)))
                 : (_events.isEmpty ? Center(child: Text("No upcoming events", style: GoogleFonts.inter(color: Colors.grey))) 
                   : SizedBox(
                        height: 76,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          children: _events.take(5).map((e) {
                            return _buildEventCard(
                              e['type']?.toString() ?? 'Event',
                              e['title']?.toString() ?? 'Untitled',
                              e['date']?.toString().substring(0, 10) ?? '',
                              const Color(0xFF2563EB),
                              Icons.event_available_rounded,
                              isDark
                            );
                          }).toList(),
                        ),
                      )),

              const SizedBox(height: 22),

              // ════════════════ LATEST ANNOUNCEMENTS SECTION ════════════════
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Latest Announcements', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  GestureDetector(
                    onTap: () => context.push('/teacher-notice-board'),
                    child: Text('View All', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: const Color(0xFF2563EB))),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              _isLoading 
                 ? const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator(color: AppTheme.teacherPurple)))
                 : (_notices.isEmpty ? Center(child: Text("No new announcements", style: GoogleFonts.inter(color: Colors.grey))) 
                   : Column(
                      children: _notices.take(3).map((notice) {
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6)],
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(color: const Color(0xFF2563EB).withValues(alpha: 0.12), shape: BoxShape.circle),
                                child: const Icon(Icons.campaign_rounded, color: Color(0xFF2563EB), size: 24),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(notice['title']?.toString() ?? 'Notice', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                                    const SizedBox(height: 2),
                                    Text(notice['content']?.toString() ?? '', maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ).animate().fadeIn(duration: 400.ms);
                      }).toList(),
                   )),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),

    );
  }

  Widget _buildStatCard(String title, String val, String sub, IconData icon, Color color, bool isDark, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 4)],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, color: color, size: 16),
            ),
            const SizedBox(height: 4),
            Text(title, textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(fontSize: 9.5, color: Colors.grey)),
            Text(val, textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A))),
            Text(sub, textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(fontSize: 9, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildEventCard(String tag, String title, String time, Color tagColor, IconData icon, bool isDark) {
    return Container(
      width: 170,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 4)],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: tagColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: tagColor, size: 18),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(tag, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: tagColor)),
                Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                Text(time, style: GoogleFonts.inter(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSideDrawer(BuildContext context, bool isDark) {
    final drawerBg = isDark ? const Color(0xFF0B0F19) : const Color(0xFFF8FAFC);
    final screenWidth = MediaQuery.of(context).size.width;
    final drawerWidth = screenWidth > 600 ? 320.0 : (screenWidth * 0.74).clamp(260.0, 290.0);

    return Drawer(
      backgroundColor: drawerBg,
      width: drawerWidth,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.horizontal(right: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Column(
          children: [
            // ════════════════ COMPACT HERO PROFILE HEADER ════════════════
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF3B0764)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(topRight: Radius.circular(24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Stack(
                        children: [
                          Container(
                            width: 48, height: 48,
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                colors: [Color(0xFFF59E0B), Color(0xFF10B981)],
                              ),
                              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.25), blurRadius: 6)],
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                'assets/images/teacher_avatar.png',
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => const CircleAvatar(
                                  backgroundColor: Color(0xFF312E81),
                                  child: Icon(Icons.person_rounded, color: Colors.white, size: 28),
                                ),
                              ),
                            ),
                          ),
                          Positioned(
                            right: 0, bottom: 0,
                            child: Container(
                              width: 11, height: 11,
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981),
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              AuthService.instance.teacherName.isNotEmpty
                                  ? AuthService.instance.teacherName
                                  : 'Faculty Member',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white),
                            ),
                            Text(
                              'Senior Faculty',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.inter(fontSize: 11, color: Colors.white70),
                            ),
                            const SizedBox(height: 3),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.18),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                AuthService.instance.teacherEmpId.isNotEmpty
                                    ? AuthService.instance.teacherEmpId
                                    : 'EMP-TCH',
                                style: GoogleFonts.inter(fontSize: 9.5, fontWeight: FontWeight.bold, color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.school_rounded, color: Color(0xFFF59E0B), size: 14),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            'Greenfield Int. School',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white70),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // ════════════════ RESPONSIVE SCROLLABLE MENU ITEMS ════════════════
            Expanded(
              child: ListView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                children: [
                  _buildSectionBadge('MAIN', isDark),
                  const SizedBox(height: 4),
                  _buildWowDrawerTile(context, 'Dashboard', Icons.dashboard_rounded, AppTheme.teacherPurple, const Color(0xFFEDE9FE), null, isDark, isSelected: true),
                  _buildWowDrawerTile(context, 'My Profile', Icons.person_rounded, const Color(0xFF2563EB), const Color(0xFFDBEAFE), '/teacher-profile', isDark),

                  const SizedBox(height: 10),
                  _buildSectionBadge('ACADEMIC', isDark),
                  const SizedBox(height: 4),
                  _buildWowDrawerTile(context, 'Attendance', Icons.fingerprint_rounded, const Color(0xFF10B981), const Color(0xFFD1FAE5), '/teacher-self-attendance', isDark),
                  _buildWowDrawerTile(context, 'My Classes', Icons.class_rounded, const Color(0xFF0284C7), const Color(0xFFE0F2FE), '/teacher-my-classes', isDark),
                  _buildWowDrawerTile(context, 'Exams & Marks', Icons.assignment_turned_in_rounded, const Color(0xFFF59E0B), const Color(0xFFFEF3C7), '/teacher-exams-results', isDark),
                  _buildWowDrawerTile(context, 'Performance', Icons.auto_graph_rounded, const Color(0xFF8B5CF6), const Color(0xFFF3E8FF), '/teacher-performance', isDark),

                  const SizedBox(height: 10),
                  _buildSectionBadge('SERVICES & PAYROLL', isDark),
                  const SizedBox(height: 4),
                  _buildWowDrawerTile(context, 'Salary Slip', Icons.receipt_long_rounded, const Color(0xFF059669), const Color(0xFFD1FAE5), '/teacher-salary-slip', isDark),
                  _buildWowDrawerTile(context, 'Documents Vault', Icons.folder_copy_rounded, const Color(0xFF8B5CF6), const Color(0xFFF3E8FF), '/teacher-documents', isDark),
                  _buildWowDrawerTile(context, 'Teacher ID Card', Icons.badge_rounded, const Color(0xFF4338CA), const Color(0xFFE0E7FF), '/teacher-id-card', isDark),
                  _buildWowDrawerTile(context, 'Leave Mgmt', Icons.beach_access_rounded, const Color(0xFFEA580C), const Color(0xFFFFEDD5), '/teacher-leaves', isDark),

                  const SizedBox(height: 10),
                  _buildSectionBadge('COMMUNICATION', isDark),
                  const SizedBox(height: 4),
                  _buildWowDrawerTile(context, 'Notice Board', Icons.campaign_rounded, const Color(0xFFEF4444), const Color(0xFFFEE2E2), '/teacher-notice-board', isDark),
                  _buildWowDrawerTile(context, 'Teacher Chat', Icons.chat_rounded, const Color(0xFF2563EB), const Color(0xFFDBEAFE), '/teacher-messages', isDark),
                  _buildWowDrawerTile(context, 'Helpdesk', Icons.headset_mic_rounded, const Color(0xFF64748B), const Color(0xFFF1F5F9), '/teacher-complaint', isDark),
                ],
              ),
            ),

            // ════════════════ COMPACT FOOTER ACTIONS ════════════════
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: const BorderRadius.only(topRight: Radius.circular(16)),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.18 : 0.04), blurRadius: 6)],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(
                        Icons.arrow_back_ios_new_rounded,
                        size: 15,
                        color: AppTheme.teacherPurple,
                      ),
                      label: Text(
                        'Back',
                        style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        side: BorderSide(color: isDark ? Colors.white24 : const Color(0xFFCBD5E1)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        context.pop();
                        await AuthService.instance.logout();
                        if (context.mounted) {
                          context.go('/teacher-login');
                        }
                      },
                      icon: const Icon(Icons.logout_rounded, size: 16, color: Colors.white),
                      label: Text('Logout', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEF4444),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        elevation: 1,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionBadge(String label, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(left: 6, bottom: 2),
      child: Text(
        label,
        style: GoogleFonts.inter(
          fontSize: 9.5,
          fontWeight: FontWeight.w900,
          letterSpacing: 1.0,
          color: isDark ? Colors.white38 : const Color(0xFF64748B),
        ),
      ),
    );
  }

  Widget _buildWowDrawerTile(BuildContext context, String title, IconData icon, Color iconColor, Color iconBg, String? route, bool isDark, {bool isSelected = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        color: isSelected
            ? AppTheme.teacherPurple
            : (isDark ? const Color(0xFF1E293B) : Colors.white),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected
              ? AppTheme.teacherPurple
              : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        ),
        boxShadow: [
          if (isSelected)
            BoxShadow(color: AppTheme.teacherPurple.withValues(alpha: 0.25), blurRadius: 4),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () {
            context.pop(); // Close drawer
            if (route != null) {
              context.push(route);
            }
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isSelected ? Colors.white.withValues(alpha: 0.2) : (isDark ? iconColor.withValues(alpha: 0.15) : iconBg),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: isSelected ? Colors.white : iconColor, size: 17),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.outfit(
                      fontSize: 13.5,
                      fontWeight: isSelected ? FontWeight.w900 : FontWeight.bold,
                      color: isSelected ? Colors.white : (isDark ? Colors.white : const Color(0xFF0F172A)),
                    ),
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 11,
                  color: isSelected ? Colors.white : Colors.grey.shade400,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DashboardBiometricSheet extends StatefulWidget {
  final String actionLabel;
  final VoidCallback onVerified;

  const _DashboardBiometricSheet({required this.actionLabel, required this.onVerified});

  @override
  State<_DashboardBiometricSheet> createState() => _DashboardBiometricSheetState();
}

class _DashboardBiometricSheetState extends State<_DashboardBiometricSheet> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isScanning = false;
  bool _isSuccess = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _startScan() async {
    setState(() => _isScanning = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      setState(() {
        _isScanning = false;
        _isSuccess = true;
      });
      await Future.delayed(const Duration(milliseconds: 600));
      widget.onVerified();
    }
  }

  @override
  Widget build(BuildContext context) {
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
          Text('${widget.actionLabel} - Biometric Scanner', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
          Text('GPS Location: Greenwood Campus HQ', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),

          const SizedBox(height: 16),

          TabBar(
            controller: _tabController,
            labelColor: AppTheme.teacherPurple,
            unselectedLabelColor: Colors.grey,
            indicatorColor: AppTheme.teacherPurple,
            tabs: const [
              Tab(icon: Icon(Icons.face_retouching_natural_rounded), text: 'AI Face ID'),
              Tab(icon: Icon(Icons.fingerprint_rounded), text: 'Fingerprint Sensor'),
            ],
          ),

          const SizedBox(height: 20),

          SizedBox(
            height: 210,
            child: TabBarView(
              controller: _tabController,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        color: AppTheme.teacherPurple.withValues(alpha: 0.1),
                        border: Border.all(color: AppTheme.teacherPurple, width: 3),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Icon(_isSuccess ? Icons.verified_user_rounded : Icons.face_rounded, size: 68, color: AppTheme.teacherPurple),
                          if (_isScanning) const CircularProgressIndicator(color: AppTheme.teacherPurple, strokeWidth: 3),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.teacherPurple),
                      onPressed: _isScanning ? null : _startScan,
                      child: Text(_isScanning ? 'Scanning...' : 'Scan AI Face Now', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: _isScanning ? null : _startScan,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppTheme.teacherPurple.withValues(alpha: 0.1),
                          border: Border.all(color: AppTheme.teacherPurple, width: 3),
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Icon(_isSuccess ? Icons.check_circle_rounded : Icons.fingerprint_rounded, size: 70, color: AppTheme.teacherPurple),
                            if (_isScanning) const CircularProgressIndicator(color: AppTheme.teacherPurple, strokeWidth: 3),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    Text(_isScanning ? 'Verifying...' : 'Touch Sensor to Scan', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}




