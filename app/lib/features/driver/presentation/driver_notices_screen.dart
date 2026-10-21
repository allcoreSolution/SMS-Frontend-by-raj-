import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class DriverNoticesScreen extends StatefulWidget {
  const DriverNoticesScreen({super.key});

  @override
  State<DriverNoticesScreen> createState() => _DriverNoticesScreenState();
}

class _DriverNoticesScreenState extends State<DriverNoticesScreen> {
  String _selectedCategory = 'All';

  final List<Map<String, String>> _notices = [
    {
      'title': 'Transport Notice: Speed Limit & Zone Safety',
      'desc': 'All campus bus drivers must strictly observe a maximum speed limit of 40 km/h in school zones and near residential pickup stops.',
      'category': 'Safety & Route',
      'date': '09 Aug 2026',
      'badge': 'SAFETY',
    },
    {
      'title': 'Vehicle Servicing: Bus UP 32 AB 1234',
      'desc': 'Scheduled brake, engine oil, and tire pressure inspection for Route 12 bus is set for Saturday, August 12 at 02:00 PM in Central Workshop.',
      'category': 'Vehicle Maintenance',
      'date': '07 Aug 2026',
      'badge': 'MAINTENANCE',
    },
    {
      'title': 'Holiday Notice: Independence Day Parade',
      'desc': 'School will celebrate Independence Day on August 15. Special morning bus pickup schedule starts at 07:00 AM sharp.',
      'category': 'Holiday',
      'date': '05 Aug 2026',
      'badge': 'HOLIDAY',
    },
    {
      'title': 'Fleet Advisory: Route 12 Timing Adjustment',
      'desc': 'Due to road construction at Sector 18 Circle, Sector 18 stop pickup timing is adjusted to 07:25 AM starting Monday.',
      'category': 'Safety & Route',
      'date': '03 Aug 2026',
      'badge': 'ROUTE ADJUST',
    },
    {
      'title': 'Fuel Card & Allowance Reimbursement',
      'desc': 'Submit your monthly diesel fuel bill receipts and trip log sheet at the Transport Manager office before August 28.',
      'category': 'Transport Advisory',
      'date': '01 Aug 2026',
      'badge': 'ADVISORY',
    },
  ];

  void _showNoticeDetailModal(BuildContext context, Map<String, String> notice) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEA580C).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    notice['badge']!,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFEA580C),
                    ),
                  ),
                ),
                Text(
                  notice['date']!,
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              notice['title']!,
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              notice['desc']!,
              style: GoogleFonts.inter(
                fontSize: 13.5,
                color: isDark ? Colors.white70 : const Color(0xFF475569),
                height: 1.4,
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => Navigator.pop(ctx),
                child: Text(
                  'Close Notice',
                  style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

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
        if (!didPop) {
          context.go('/driver-dashboard');
        }
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
                context.go('/driver-dashboard');
              }
            },
          ),
          title: Text(
            'Transport Notice Board',
            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
          ),
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
                  children: ['All', 'Safety & Route', 'Vehicle Maintenance', 'Holiday', 'Transport Advisory'].map((cat) {
                    final isSelected = _selectedCategory == cat;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(
                          cat,
                          style: GoogleFonts.inter(
                            fontSize: 12.5,
                            fontWeight: FontWeight.bold,
                            color: isSelected ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF334155)),
                          ),
                        ),
                        selected: isSelected,
                        selectedColor: const Color(0xFFEA580C),
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
                    return InkWell(
                      onTap: () => _showNoticeDetailModal(context, notice),
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
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
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEA580C).withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    notice['badge']!,
                                    style: GoogleFonts.inter(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFFEA580C),
                                    ),
                                  ),
                                ),
                                Text(
                                  notice['date']!,
                                  style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              notice['title']!,
                              style: GoogleFonts.outfit(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              notice['desc']!,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: isDark ? Colors.white70 : const Color(0xFF475569),
                              ),
                            ),
                          ],
                        ),
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
