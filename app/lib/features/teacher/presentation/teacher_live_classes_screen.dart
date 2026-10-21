import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';
class TeacherLiveClassesScreen extends StatefulWidget {
  const TeacherLiveClassesScreen({super.key});

  @override
  State<TeacherLiveClassesScreen> createState() => _TeacherLiveClassesScreenState();
}

class _TeacherLiveClassesScreenState extends State<TeacherLiveClassesScreen>
    with SingleTickerProviderStateMixin {
  late PageController _pageController;
  late AnimationController _pulseController;
  int _selectedFilter = 0;

  List<Map<String, dynamic>> _upcoming = [];
  List<Map<String, dynamic>> _today = [];

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _pulseController = AnimationController(vsync: this, duration: const Duration(seconds: 2))
      ..repeat(reverse: true);
      
    _loadClasses();
  }

  Future<void> _loadClasses() async {
    final repo = TeacherDataRepository.instance;
    await repo.fetchMetadata();
    await repo.fetchLiveClasses();
    
    if (mounted) {
      setState(() {
         // Map repo.liveClasses to local UI format
         _upcoming = repo.liveClasses.map((c) {
           return {
             'subject': c['title']?.toString() ?? 'Online Class',
             'class': 'Academic',
             'time': c['startTime'] != null ? DateTime.parse(c['startTime']).toLocal().toString().split('.')[0] : '-',
             'students': '0 Registered',
             'status': c['status']?.toString() ?? 'Scheduled',
             'isLiveNow': c['status'] == 'Live',
             'code': c['platform']?.toString()?.toUpperCase() ?? 'STREAM',
             'url': c['meetingUrl']?.toString() ?? 'https://zoom.us'
           };
         }).toList();
         
         if(_upcoming.isEmpty) {
           _upcoming = [{
             'subject': 'No Live Classes',
             'class': '-',
             'time': '-',
             'students': '-',
             'status': 'Scheduled',
             'isLiveNow': false,
             'code': 'NONE'
           }];
         }
         _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _onFilterTapped(int index) {
    setState(() => _selectedFilter = index);
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final repo = TeacherDataRepository.instance;
          final exId = repo.classes.isNotEmpty ? repo.classes.first['_id'].toString() : '65fac00d41e7d23a670dbfed';
          final secId = repo.sections.isNotEmpty ? repo.sections.first['_id'].toString() : '65fac00d41e7d23a670dbfed';
          
          await repo.scheduleLiveClass({
             'title': 'New Instant Live Session',
             'academicClass': exId,
             'section': secId,
             'startTime': DateTime.now().toIso8601String(),
             'durationMinutes': 45,
             'platform': 'Zoom',
             'meetingUrl': 'https://zoom.us/new'
          });
          _loadClasses();

          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('Instant Live Class scheduled dynamically! 🎥'),
            backgroundColor: AppTheme.teacherPurple,
          ));
        },
        backgroundColor: AppTheme.teacherPurple,
        elevation: 6,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: Text('Schedule Stream', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
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
                        Text('Live Virtual Classes',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Swipe views left or right →',
                            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (_, child) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDE9FE),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFDDD6FE)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 8, height: 8,
                            decoration: BoxDecoration(
                              color: Color.lerp(AppTheme.teacherPurple, const Color(0xFFA78BFA), _pulseController.value),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text('LIVE NOW',
                              style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                        ],
                      ),
                    ),
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
                child: Row(
                  children: [
                    Container(
                      width: 52, height: 52,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.videocam_rounded, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Broadcast Studio',
                              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text('HD 1080p Stream Quality • Active',
                              style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white70)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Text('2 Sessions', style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white)),
                          Text('Today', style: GoogleFonts.inter(fontSize: 9.5, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // Filter Chips Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Row(
                children: [
                  _filterChip(0, 'All Sessions'),
                  const SizedBox(width: 8),
                  _filterChip(1, 'Upcoming'),
                  const SizedBox(width: 8),
                  _filterChip(2, 'Recorded'),
                ],
              ),
            ),

            // ════════════════ SWIPEABLE PAGE VIEW ════════════════
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const BouncingScrollPhysics(),
                onPageChanged: (idx) => setState(() => _selectedFilter = idx),
                children: [
                  _buildAllTab(isDark),
                  _buildUpcomingOnlyTab(isDark),
                  _buildRecordedOnlyTab(isDark),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildAllTab(bool isDark) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildUpcomingSection(isDark),
          const SizedBox(height: 16),
          _buildRecordedSection(isDark),
        ],
      ),
    );
  }

  Widget _buildUpcomingOnlyTab(bool isDark) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      child: _buildUpcomingSection(isDark),
    );
  }

  Widget _buildRecordedOnlyTab(bool isDark) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      child: _buildRecordedSection(isDark),
    );
  }

  Widget _buildUpcomingSection(bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Upcoming Streams',
                style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF0F172A))),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppTheme.teacherPurple.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text('2 Sessions', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
            ),
          ],
        ),
        const SizedBox(height: 12),

        ..._upcoming.map((item) {
          final isLive = item['isLiveNow'] as bool;
          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isLive
                    ? AppTheme.teacherPurple.withValues(alpha: 0.5)
                    : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                width: isLive ? 1.5 : 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: isLive
                      ? AppTheme.teacherPurple.withValues(alpha: 0.1)
                      : Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                  blurRadius: 10, offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                  decoration: BoxDecoration(
                    color: isLive
                        ? AppTheme.teacherPurple.withValues(alpha: 0.1)
                        : (isDark ? const Color(0xFF334155).withValues(alpha: 0.3) : const Color(0xFFF1F5F9)),
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(19)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            isLive ? Icons.sensors_rounded : Icons.schedule_rounded,
                            color: isLive ? AppTheme.teacherPurple : Colors.grey,
                            size: 16,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            isLive ? 'READY TO BROADCAST' : 'SCHEDULED',
                            style: GoogleFonts.inter(
                              fontSize: 11, fontWeight: FontWeight.bold,
                              color: isLive ? AppTheme.teacherPurple : Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        item['code'] as String,
                        style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.w600, color: Colors.grey),
                      ),
                    ],
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item['subject'] as String,
                          style: GoogleFonts.outfit(
                              fontSize: 16.5, fontWeight: FontWeight.bold,
                              color: isDark ? Colors.white : const Color(0xFF0F172A))),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.teacherPurple.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(item['class'] as String,
                                style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                          ),
                          const SizedBox(width: 8),
                          Icon(Icons.people_alt_rounded, size: 13, color: Colors.grey.shade500),
                          const SizedBox(width: 4),
                          Text(item['students'] as String,
                              style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                        ],
                      ),

                      const SizedBox(height: 14),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.access_time_filled_rounded, size: 14, color: AppTheme.teacherPurple),
                              const SizedBox(width: 5),
                              Text(item['time'] as String,
                                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                            ],
                          ),
                          ElevatedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                content: Text('Launching Live Stream for ${item['subject']}! 🎥'),
                                backgroundColor: AppTheme.teacherPurple,
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ));
                            },
                            icon: Icon(isLive ? Icons.play_arrow_rounded : Icons.video_call_rounded, size: 18),
                            label: Text(item['status'] as String,
                                style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.teacherPurple,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              elevation: 4,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 300.ms);
        }),
      ],
    );
  }

  Widget _buildRecordedSection(bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Recorded Archives',
            style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A))),
        const SizedBox(height: 12),

        ..._today.map((item) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      color: AppTheme.teacherPurple.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(13),
                    ),
                    child: const Icon(Icons.play_circle_fill_rounded, color: AppTheme.teacherPurple, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['subject'] as String,
                            style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Text('${item['class']} • ${item['duration']}',
                                style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                            const SizedBox(width: 8),
                            Text('• ${item['views']}',
                                style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppTheme.teacherPurple)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.teacherPurple,
                      side: const BorderSide(color: AppTheme.teacherPurple),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    ),
                    child: Text('Play', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            )),
      ],
    );
  }

  Widget _filterChip(int index, String label) {
    final active = _selectedFilter == index;
    return GestureDetector(
      onTap: () => _onFilterTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: active ? AppTheme.teacherPurple : (Theme.of(context).brightness == Brightness.dark ? const Color(0xFF1E293B) : Colors.white),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: active ? AppTheme.teacherPurple : (Theme.of(context).brightness == Brightness.dark ? Colors.white10 : const Color(0xFFCBD5E1))),
          boxShadow: active ? [BoxShadow(color: AppTheme.teacherPurple.withValues(alpha: 0.3), blurRadius: 6)] : null,
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            fontSize: 12.5, fontWeight: FontWeight.bold,
            color: active ? Colors.white : Colors.grey.shade600,
          ),
        ),
      ),
    );
  }
}
