import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherComplaintSupportScreen extends StatefulWidget {
  const TeacherComplaintSupportScreen({super.key});

  @override
  State<TeacherComplaintSupportScreen> createState() => _TeacherComplaintSupportScreenState();
}

class _TeacherComplaintSupportScreenState extends State<TeacherComplaintSupportScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedCategory = 'IT Support';

  final List<Map<String, dynamic>> _tickets = [
    {'id': '#TCK-1042', 'title': 'Projector not working in Room 101', 'category': 'IT Support', 'status': 'In Progress', 'date': '05 May 2025', 'color': const Color(0xFFF59E0B)},
    {'id': '#TCK-0987', 'title': 'Portal login issue on mobile app', 'category': 'Tech', 'status': 'Resolved', 'date': '28 Apr 2025', 'color': const Color(0xFF10B981)},
    {'id': '#TCK-0876', 'title': 'Leave not approved in system', 'category': 'Admin', 'status': 'Pending', 'date': '20 Apr 2025', 'color': const Color(0xFFEF4444)},
  ];

  void _showRaiseTicketSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setSheetState) {
          final isValid = _titleController.text.trim().isNotEmpty;

          return Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(width: 48, height: 5, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.4), borderRadius: BorderRadius.circular(10))),
                  ),
                  const SizedBox(height: 16),
                  Text('Raise Support Ticket', style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    initialValue: _selectedCategory,
                    items: ['IT Support', 'Admin', 'Tech', 'Infrastructure', 'HR']
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (val) => setSheetState(() => _selectedCategory = val!),
                    decoration: InputDecoration(labelText: 'Category', border: OutlineInputBorder(borderRadius: BorderRadius.circular(14))),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _titleController,
                    onChanged: (_) => setSheetState(() {}),
                    decoration: InputDecoration(labelText: 'Issue Title', border: OutlineInputBorder(borderRadius: BorderRadius.circular(14))),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _descController,
                    maxLines: 3,
                    onChanged: (_) => setSheetState(() {}),
                    decoration: InputDecoration(labelText: 'Describe the issue...', border: OutlineInputBorder(borderRadius: BorderRadius.circular(14))),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: isValid
                          ? () {
                              final id = '#TCK-${1000 + _tickets.length + 1}';
                              setState(() {
                                _tickets.insert(0, {
                                  'id': id,
                                  'title': _titleController.text.trim(),
                                  'category': _selectedCategory,
                                  'status': 'Pending',
                                  'date': '07 May 2025',
                                  'color': const Color(0xFFEF4444),
                                });
                              });
                              _titleController.clear();
                              _descController.clear();
                              context.pop();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Ticket $id Raised! 🎫'),
                                  backgroundColor: AppTheme.teacherPurple,
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              );
                            }
                          : null, // Disabled when empty
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.teacherPurple,
                        disabledBackgroundColor: Colors.grey.shade300,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text(
                        'Submit Ticket',
                        style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: isValid ? Colors.white : Colors.grey.shade600),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Resolved': return const Color(0xFF10B981);
      case 'In Progress': return const Color(0xFFF59E0B);
      default: return const Color(0xFFEF4444);
    }
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
        onPressed: _showRaiseTicketSheet,
        backgroundColor: AppTheme.teacherPurple,
        elevation: 6,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: Text('Raise Ticket', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // ════════════════ TOP NAVIGATION BAR ════════════════
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
                        Text('Complaint & Support Desk',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Faculty Helpdesk System',
                            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFDDD6FE)),
                    ),
                    child: Text('${_tickets.length} Tickets',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING HERO CARD ════════════════
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
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatCol('${_tickets.where((t) => t['status'] == 'Pending').length}', 'Pending', const Color(0xFFFCA5A5)),
                    _buildStatCol('${_tickets.where((t) => t['status'] == 'In Progress').length}', 'In Progress', const Color(0xFFFDE68A)),
                    _buildStatCol('${_tickets.where((t) => t['status'] == 'Resolved').length}', 'Resolved', const Color(0xFFA7F3D0)),
                    _buildStatCol('${_tickets.length}', 'Total', Colors.white),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ TICKETS LIST ════════════════
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                physics: const BouncingScrollPhysics(),
                itemCount: _tickets.length,
                separatorBuilder: (_, i) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final t = _tickets[index];
                  final statusColor = _statusColor(t['status'] as String);

                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(t['id'] as String, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(10)),
                              child: Text(t['status'] as String, style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: statusColor)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(t['title'] as String, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(color: AppTheme.teacherPurple.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                              child: Text(t['category'] as String, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                            ),
                            const SizedBox(width: 8),
                            Text(t['date'] as String, style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                  ).animate().fadeIn(duration: 350.ms, delay: (index * 40).ms);
                },
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildStatCol(String val, String label, Color color) {
    return Column(
      children: [
        Text(val, style: GoogleFonts.outfit(fontSize: 19, fontWeight: FontWeight.w900, color: color)),
        const SizedBox(height: 2),
        Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.white.withValues(alpha: 0.85))),
      ],
    );
  }
}
