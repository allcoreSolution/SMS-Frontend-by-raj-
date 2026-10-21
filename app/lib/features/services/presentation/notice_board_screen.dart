import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/custom_segmented_tab_bar.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NoticeBoardScreen extends StatefulWidget {
  const NoticeBoardScreen({super.key});

  @override
  State<NoticeBoardScreen> createState() => _NoticeBoardScreenState();
}

class _NoticeBoardScreenState extends State<NoticeBoardScreen> {
  int _selectedCategory = 0;
  late final PageController _pageController;

  final List<String> _categories = ['All', 'School', 'Exam', 'Event'];

  List<Map<String, String>> _notices = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _selectedCategory);
    _fetchNotices();
  }

  Future<void> _fetchNotices() async {
    try {
      final res = await http.get(Uri.parse('https://all-core-school-erp-backend.onrender.com/api/notices'));
      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        if (body['success'] == true && body['data'] != null) {
          final List<dynamic> data = body['data'];
          setState(() {
             _notices = data.map((e) => {
                'title': e['title']?.toString() ?? 'Notice',
                'date': e['createdAt'] != null ? e['createdAt'].toString().substring(0, 10) : 'Today',
                'tag': e['targetAudience']?.toString() ?? 'All',
                'tagColor': 'blue',
             }).toList();
             _isLoading = false;
          });
          return;
        }
      }
    } catch (e) {
      debugPrint('Failed to fetch notices: $e');
    }
    setState(() => _isLoading = false);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onTabTapped(int index) {
    setState(() => _selectedCategory = index);
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
      appBar: AppBar(
        title: Text(
          'Notice Board',
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
              // Top Segmented Tab Switcher (Tap & Swipe Synchronized)
              CustomSegmentedTabBar(
                tabs: _categories,
                selectedIndex: _selectedCategory,
                onTabChanged: _onTabTapped,
              ),

              const SizedBox(height: 16),

              // PageView for Smooth Horizontal Finger Swipe Gestures
              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const BouncingScrollPhysics(),
                  onPageChanged: (index) => setState(() => _selectedCategory = index),
                  children: List.generate(
                    _categories.length,
                    (pageIndex) {
                      if (_isLoading) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      if (_notices.isEmpty) {
                        return const Center(child: Text('No notices available'));
                      }
                      
                      return ListView.builder(
                        physics: const BouncingScrollPhysics(),
                        itemCount: _notices.length,
                        itemBuilder: (context, index) {
                          final item = _notices[index];
                          final isNew = item['tag'] == 'All' || item['tag'] == 'New';
                          final isHoliday = item['tag']?.contains('Staff') ?? false;

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
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item['title']!,
                                      style: GoogleFonts.outfit(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      item['date']!,
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: isNew
                                        ? const Color(0xFF2563EB).withValues(alpha: 0.15)
                                        : (isHoliday
                                            ? const Color(0xFF10B981).withValues(alpha: 0.15)
                                            : const Color(0xFF64748B).withValues(alpha: 0.15)),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    item['tag']!,
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: isNew
                                          ? const Color(0xFF2563EB)
                                          : (isHoliday ? const Color(0xFF059669) : const Color(0xFF475569)),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      );
                    }
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
}
