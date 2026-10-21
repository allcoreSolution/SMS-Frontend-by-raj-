import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/widgets/custom_segmented_tab_bar.dart';

class OnlineClassesScreen extends StatefulWidget {
  const OnlineClassesScreen({super.key});

  @override
  State<OnlineClassesScreen> createState() => _OnlineClassesScreenState();
}

class _OnlineClassesScreenState extends State<OnlineClassesScreen> {
  int _selectedTab = 0;
  late final PageController _pageController;

  final List<String> _tabs = ['Live', 'Upcoming', 'Completed'];

  final List<Map<String, dynamic>> _upcoming = [
    {
      'subject': 'Science',
      'teacher': 'Mr. Verma',
      'time': '09:30 AM – 10:20 AM',
      'platform': 'Zoom',
      'date': 'Today',
      'color': Color(0xFF10B981),
      'isLive': false,
    },
    {
      'subject': 'English',
      'teacher': 'Mrs. Johnson',
      'time': '10:30 AM – 11:20 AM',
      'platform': 'Google Meet',
      'date': 'Today',
      'color': Color(0xFF8B5CF6),
      'isLive': false,
    },
    {
      'subject': 'Computer',
      'teacher': 'Mr. Das',
      'time': '11:30 AM – 12:20 PM',
      'platform': 'Teams',
      'date': 'Today',
      'color': Color(0xFFEF4444),
      'isLive': false,
    },
    {
      'subject': 'Hindi',
      'teacher': 'Mrs. Singh',
      'time': '08:00 AM – 09:00 AM',
      'platform': 'Zoom',
      'date': 'Tomorrow',
      'color': Color(0xFFF59E0B),
      'isLive': false,
    },
  ];

  final List<Map<String, dynamic>> _completed = [
    {
      'subject': 'Social Science',
      'teacher': 'Mr. Gupta',
      'time': '08:00 AM – 09:00 AM',
      'platform': 'Google Meet',
      'date': 'Yesterday',
      'color': Color(0xFFEC4899),
      'duration': '58 mins',
      'recorded': true,
    },
    {
      'subject': 'Mathematics',
      'teacher': 'Mr. Sharma',
      'time': '08:00 AM – 09:20 AM',
      'platform': 'Zoom',
      'date': '22 May 2024',
      'color': Color(0xFF2563EB),
      'duration': '82 mins',
      'recorded': true,
    },
    {
      'subject': 'English',
      'teacher': 'Mrs. Johnson',
      'time': '10:30 AM – 11:20 AM',
      'platform': 'Google Meet',
      'date': '21 May 2024',
      'color': Color(0xFF8B5CF6),
      'duration': '50 mins',
      'recorded': false,
    },
  ];

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
          'Online Classes',
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
              CustomSegmentedTabBar(
                tabs: _tabs,
                selectedIndex: _selectedTab,
                onTabChanged: _onTabTapped,
              ),

              const SizedBox(height: 16),

              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const BouncingScrollPhysics(),
                  onPageChanged: (index) => setState(() => _selectedTab = index),
                  children: [
                    // ─ Live Tab ───────────────────────────────────────
                    ListView(
                      physics: const BouncingScrollPhysics(),
                      children: [
                        Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(18),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFEF4444).withValues(alpha: 0.3),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(alpha: 0.2),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      '🔴 LIVE NOW',
                                      style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    '42 Students Online',
                                    style: GoogleFonts.inter(color: Colors.white70, fontSize: 11),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Mathematics',
                                style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
                              ),
                              Text(
                                'Mr. Sharma • 08:00 AM – 09:20 AM',
                                style: GoogleFonts.inter(color: Colors.white70, fontSize: 13),
                              ),
                              Text(
                                'Platform: Google Meet',
                                style: GoogleFonts.inter(color: Colors.white70, fontSize: 12),
                              ),
                              const SizedBox(height: 14),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Joining Mathematics Live Class...')),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    foregroundColor: const Color(0xFFEF4444),
                                    minimumSize: const Size.fromHeight(44),
                                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    elevation: 0,
                                  ),
                                  icon: const Icon(Icons.videocam_rounded, size: 20),
                                  label: Text('Join Now', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 14)),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Center(
                          child: Text(
                            'No other live classes right now',
                            style: GoogleFonts.inter(color: Colors.grey, fontSize: 13),
                          ),
                        ),
                      ],
                    ),

                    // ─ Upcoming Tab ───────────────────────────────────
                    ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      itemCount: _upcoming.length,
                      itemBuilder: (context, index) {
                        final item = _upcoming[index];
                        final color = item['color'] as Color;

                        return _classCard(
                          isDark: isDark,
                          color: color,
                          subject: item['subject'] as String,
                          teacher: item['teacher'] as String,
                          time: item['time'] as String,
                          platform: item['platform'] as String,
                          dateLabel: item['date'] as String,
                          trailingWidget: ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Set reminder for ${item['subject']} class')),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: color,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              elevation: 0,
                            ),
                            child: Text('Remind', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                          ),
                        );
                      },
                    ),

                    // ─ Completed Tab ─────────────────────────────────
                    ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      itemCount: _completed.length,
                      itemBuilder: (context, index) {
                        final item = _completed[index];
                        final color = item['color'] as Color;
                        final hasRecording = item['recorded'] as bool;

                        return _classCard(
                          isDark: isDark,
                          color: color,
                          subject: item['subject'] as String,
                          teacher: item['teacher'] as String,
                          time: '${item['time']} • ${item['duration']}',
                          platform: item['platform'] as String,
                          dateLabel: item['date'] as String,
                          trailingWidget: OutlinedButton.icon(
                            onPressed: hasRecording ? () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Opening recording for ${item['subject']}...')),
                              );
                            } : null,
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: hasRecording ? color : Colors.grey),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            icon: Icon(Icons.play_circle_rounded, size: 14, color: hasRecording ? color : Colors.grey),
                            label: Text(
                              hasRecording ? 'Watch' : 'No Rec.',
                              style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: hasRecording ? color : Colors.grey),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _classCard({
    required bool isDark,
    required Color color,
    required String subject,
    required String teacher,
    required String time,
    required String platform,
    required String dateLabel,
    required Widget trailingWidget,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(Icons.videocam_rounded, color: color, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  subject,
                  style: GoogleFonts.outfit(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
                Text(
                  '$teacher • $dateLabel',
                  style: GoogleFonts.inter(fontSize: 12, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                ),
                Text(
                  '$time • $platform',
                  style: GoogleFonts.inter(fontSize: 11.5, color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          trailingWidget,
        ],
      ),
    );
  }
}
