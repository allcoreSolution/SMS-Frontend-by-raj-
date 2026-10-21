import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class DriverContactsScreen extends StatefulWidget {
  const DriverContactsScreen({super.key});

  @override
  State<DriverContactsScreen> createState() => _DriverContactsScreenState();
}

class _DriverContactsScreenState extends State<DriverContactsScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, String>> _emergencyContacts = [
    {
      'name': 'Mr. Anil Verma',
      'role': 'Transport Manager',
      'phone': '+91 98765 11223',
      'icon': 'local_shipping',
      'color': '0xFFEA580C',
    },
    {
      'name': 'School Control Room',
      'role': 'Admin & SOS Emergency',
      'phone': '+91 98765 00000',
      'icon': 'contact_phone',
      'color': '0xFFDC2626',
    },
    {
      'name': 'Auto Care Workshop',
      'role': 'Bus Mechanic & Towing',
      'phone': '+91 98765 44332',
      'icon': 'build_circle',
      'color': '0xFF2563EB',
    },
    {
      'name': 'Jaipur Traffic Police',
      'role': 'Highway Patrol Helpline',
      'phone': '1033 / 112',
      'icon': 'local_police',
      'color': '0xFF059669',
    },
  ];

  final List<Map<String, String>> _routeParents = [
    {
      'student': 'Aarav Sharma',
      'class': 'Class 5-A',
      'stop': 'Sector 15, Stop #1',
      'parent': 'Mr. Rajesh Sharma',
      'phone': '+91 98765 43210',
    },
    {
      'student': 'Ananya Verma',
      'class': 'Class 7-B',
      'stop': 'Sector 15, Stop #1',
      'parent': 'Mr. Suresh Verma',
      'phone': '+91 98111 22334',
    },
    {
      'student': 'Rohan Gupta',
      'class': 'Class 8-C',
      'stop': 'Sector 18 Market, Stop #2',
      'parent': 'Mrs. Priya Gupta',
      'phone': '+91 98222 33445',
    },
    {
      'student': 'Siddharth Jain',
      'class': 'Class 10-A',
      'stop': 'Sector 22 Circle, Stop #3',
      'parent': 'Mr. Vikas Jain',
      'phone': '+91 98333 44556',
    },
    {
      'student': 'Kavya Singh',
      'class': 'Class 6-B',
      'stop': 'Sector 29 Metro, Stop #4',
      'parent': 'Col. R.S. Singh',
      'phone': '+91 98444 55667',
    },
    {
      'student': 'Ishan Saxena',
      'class': 'Class 9-A',
      'stop': 'Sector 29 Metro, Stop #4',
      'parent': 'Mrs. Meenakshi Saxena',
      'phone': '+91 98555 66778',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _callNumber(BuildContext context, String name, String phone) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Calling $name ($phone)...'),
        backgroundColor: const Color(0xFFEA580C),
      ),
    );
  }

  void _sendWhatsapp(BuildContext context, String name, String phone) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening WhatsApp chat with $name...'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final filteredParents = _routeParents.where((p) {
      final query = _searchQuery.toLowerCase();
      return p['student']!.toLowerCase().contains(query) ||
          p['parent']!.toLowerCase().contains(query) ||
          p['stop']!.toLowerCase().contains(query);
    }).toList();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/driver-dashboard');
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        elevation: 0,
        title: Text(
          'Route Contacts & Emergency',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Emergency Call Grid ──────────────────────────────────────────
            Text(
              'Emergency Speed Dial',
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 10),

            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _emergencyContacts.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 2.1,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
              ),
              itemBuilder: (context, index) {
                final item = _emergencyContacts[index];
                return InkWell(
                  onTap: () => _callNumber(context, item['name']!, item['phone']!),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Color(int.parse(item['color']!)).withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.phone_in_talk_rounded,
                            color: Color(int.parse(item['color']!)),
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                item['name']!,
                                style: GoogleFonts.outfit(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                item['role']!,
                                style: GoogleFonts.inter(
                                  fontSize: 10.5,
                                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 24),

            // ── Search Parents Bar ──────────────────────────────────────────
            Text(
              'Route 12 Parents Directory (${filteredParents.length})',
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 10),

            TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              style: GoogleFonts.inter(color: isDark ? Colors.white : const Color(0xFF0F172A)),
              decoration: InputDecoration(
                hintText: 'Search student, parent name or stop location...',
                prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFFEA580C)),
                filled: true,
                fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFCBD5E1)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFCBD5E1)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFEA580C)),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // ── Route Parents List ───────────────────────────────────────────
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: filteredParents.length,
              itemBuilder: (context, index) {
                final parent = filteredParents[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                    ),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: const Color(0xFFEA580C).withValues(alpha: 0.12),
                        child: Text(
                          parent['student']![0],
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFFEA580C),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  parent['student']!,
                                  style: GoogleFonts.outfit(
                                    fontSize: 14.5,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: isDark ? Colors.white12 : const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    parent['class']!,
                                    style: GoogleFonts.inter(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: isDark ? Colors.white70 : const Color(0xFF475569),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Parent: ${parent['parent']}',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                              ),
                            ),
                            Text(
                              'Stop: ${parent['stop']}',
                              style: GoogleFonts.inter(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w500,
                                color: const Color(0xFFEA580C),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.phone_rounded, color: Color(0xFF2563EB)),
                            onPressed: () => _callNumber(context, parent['parent']!, parent['phone']!),
                          ),
                          IconButton(
                            icon: const Icon(Icons.chat_bubble_outline_rounded, color: Color(0xFF10B981)),
                            onPressed: () => _sendWhatsapp(context, parent['parent']!, parent['phone']!),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    ),
    );
  }
}
