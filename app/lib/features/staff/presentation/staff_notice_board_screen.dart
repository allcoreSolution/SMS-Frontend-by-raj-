import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class StaffNoticeBoardScreen extends StatefulWidget {
  const StaffNoticeBoardScreen({super.key});

  @override
  State<StaffNoticeBoardScreen> createState() => _StaffNoticeBoardScreenState();
}

class _StaffNoticeBoardScreenState extends State<StaffNoticeBoardScreen> {
  String _selectedCategory = 'All';

  final List<Map<String, String>> _notices = [
    {'title': 'Holiday Notice: Buddha Purnima', 'desc': 'School will remain closed on May 23, 2025.', 'category': 'Holiday', 'date': '20 May 2025', 'badge': 'HOLIDAY'},
    {'title': 'HR Announcement: Salary Credit Date', 'desc': 'May 2025 monthly salary will be credited on May 31, 2025.', 'category': 'Important', 'date': '18 May 2025', 'badge': 'IMPORTANT'},
    {'title': 'Staff Meeting Notice', 'desc': 'All administrative staff meeting scheduled for May 26 at 03:00 PM in Conference Room A.', 'category': 'General', 'date': '15 May 2025', 'badge': 'GENERAL'},
    {'title': 'Annual Sports Day Committee', 'desc': 'Nominations open for sports event co-ordinators.', 'category': 'General', 'date': '10 May 2025', 'badge': 'GENERAL'},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final filteredNotices = _selectedCategory == 'All'
        ? _notices
        : _notices.where((n) => n['category'] == _selectedCategory).toList();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/staff-dashboard');
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
              context.go('/staff-dashboard');
            }
          },
        ),
        title: Text('School Notice Board', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Category Chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: ['All', 'General', 'Holiday', 'Important'].map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(cat, style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF334155)))),
                      selected: isSelected,
                      selectedColor: const Color(0xFF059669),
                      backgroundColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                      onSelected: (v) => setState(() => _selectedCategory = cat),
                    ),
                  );
                }).toList(),
              ),
            ),

            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: filteredNotices.length,
                separatorBuilder: (_, _) => const SizedBox(height: 12),
                itemBuilder: (ctx, i) {
                  final notice = filteredNotices[i];
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(color: const Color(0xFF059669).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                              child: Text(notice['badge']!, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                            ),
                            Text(notice['date']!, style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(notice['title']!, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        const SizedBox(height: 4),
                        Text(notice['desc']!, style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.white70 : const Color(0xFF475569))),
                      ],
                    ),
                  );
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
