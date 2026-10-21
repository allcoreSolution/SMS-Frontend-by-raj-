import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherLeaveManagementScreen extends StatefulWidget {
  const TeacherLeaveManagementScreen({super.key});

  @override
  State<TeacherLeaveManagementScreen> createState() => _TeacherLeaveManagementScreenState();
}

class _TeacherLeaveManagementScreenState extends State<TeacherLeaveManagementScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  String? _selectedLeaveType;
  final _fromDateController = TextEditingController();
  final _toDateController = TextEditingController();
  final _reasonController = TextEditingController();
  String? _attachedFileName;

  final List<Map<String, dynamic>> _leaveHistory = [
    {'type': 'Casual Leave', 'from': '01 May 2025', 'to': '02 May 2025', 'days': 2, 'status': 'Approved', 'reason': 'Personal work'},
    {'type': 'Medical Leave', 'from': '15 Apr 2025', 'to': '16 Apr 2025', 'days': 2, 'status': 'Approved', 'reason': 'Doctor appointment'},
    {'type': 'Earn Leave', 'from': '10 Mar 2025', 'to': '12 Mar 2025', 'days': 3, 'status': 'Rejected', 'reason': 'Travel plans'},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _fromDateController.dispose();
    _toDateController.dispose();
    _reasonController.dispose();
    super.dispose();
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Approved': return const Color(0xFF10B981);
      case 'Rejected': return const Color(0xFFEF4444);
      default: return const Color(0xFFF59E0B);
    }
  }

  void _submitLeaveForm() {
    if (_selectedLeaveType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a Leave Type!'), backgroundColor: Colors.red),
      );
      return;
    }
    setState(() {
      _leaveHistory.insert(0, {
        'type': _selectedLeaveType,
        'from': _fromDateController.text.isEmpty ? '07 May 2025' : _fromDateController.text,
        'to': _toDateController.text.isEmpty ? '08 May 2025' : _toDateController.text,
        'days': 2,
        'status': 'Pending',
        'reason': _reasonController.text.isEmpty ? 'Personal work' : _reasonController.text,
      });
      _selectedLeaveType = null;
      _fromDateController.clear();
      _toDateController.clear();
      _reasonController.clear();
      _attachedFileName = null;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Leave Application Submitted Successfully! 📩'),
        backgroundColor: AppTheme.teacherPurple,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
    _tabController.animateTo(1);
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
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDark ? Colors.white : const Color(0xFF0F172A), size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/teacher-dashboard');
            }
          },
        ),
        title: Text('Leave Management', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: TabBar(
              controller: _tabController,
              dividerColor: Colors.transparent,
              indicatorSize: TabBarIndicatorSize.tab,
              indicator: BoxDecoration(
                color: AppTheme.teacherPurple,
                borderRadius: BorderRadius.circular(10),
              ),
              labelColor: Colors.white,
              unselectedLabelColor: isDark ? Colors.white60 : const Color(0xFF64748B),
              labelStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold),
              tabs: const [
                Tab(text: 'Apply Leave'),
                Tab(text: 'My Leaves'),
              ],
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: TabBarView(
          controller: _tabController,
          children: [
            // ════════════════ TAB 1: APPLY LEAVE FORM ════════════════
            SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Leave Type Dropdown
                  Text('Leave Type', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: _selectedLeaveType,
                    hint: Text('Select Leave Type', style: GoogleFonts.inter(fontSize: 13, color: Colors.grey)),
                    items: ['Casual Leave', 'Medical Leave', 'Earn Leave', 'Special Leave']
                        .map((t) => DropdownMenuItem(value: t, child: Text(t, style: GoogleFonts.inter(fontSize: 14))))
                        .toList(),
                    onChanged: (val) => setState(() => _selectedLeaveType = val),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // From Date
                  Text('From Date', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _fromDateController,
                    readOnly: true,
                    onTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(2025),
                        lastDate: DateTime(2026),
                      );
                      if (date != null) {
                        _fromDateController.text = '${date.day.toString().padLeft(2, '0')} ${_monthName(date.month)} ${date.year}';
                      }
                    },
                    decoration: InputDecoration(
                      hintText: 'Select Date',
                      hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                      suffixIcon: const Icon(Icons.calendar_today_outlined, size: 18, color: Colors.grey),
                      filled: true,
                      fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // To Date
                  Text('To Date', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _toDateController,
                    readOnly: true,
                    onTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(2025),
                        lastDate: DateTime(2026),
                      );
                      if (date != null) {
                        _toDateController.text = '${date.day.toString().padLeft(2, '0')} ${_monthName(date.month)} ${date.year}';
                      }
                    },
                    decoration: InputDecoration(
                      hintText: 'Select Date',
                      hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                      suffixIcon: const Icon(Icons.calendar_today_outlined, size: 18, color: Colors.grey),
                      filled: true,
                      fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Reason
                  Text('Reason', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _reasonController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: 'Enter Reason',
                      hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                      filled: true,
                      fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Attachment (Optional)
                  Text('Attachment (Optional)', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  GestureDetector(
                    onTap: () {
                      setState(() => _attachedFileName = 'Medical_Certificate.pdf');
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Document Attached! 📎')),
                      );
                    },
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.attach_file_rounded, size: 20, color: Colors.grey),
                          const SizedBox(width: 10),
                          Text(
                            _attachedFileName ?? 'Upload Document',
                            style: GoogleFonts.inter(fontSize: 13, color: _attachedFileName != null ? AppTheme.teacherPurple : Colors.grey),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Submit Application Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _selectedLeaveType != null ? _submitLeaveForm : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        disabledBackgroundColor: Colors.grey.shade300,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 2,
                      ),
                      child: Text(
                        'Submit Application',
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: _selectedLeaveType != null ? Colors.white : Colors.grey.shade600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ════════════════ TAB 2: MY LEAVES HISTORY ════════════════
            ListView.separated(
              padding: const EdgeInsets.all(20),
              physics: const BouncingScrollPhysics(),
              itemCount: _leaveHistory.length,
              separatorBuilder: (_, i) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = _leaveHistory[index];
                final color = _statusColor(item['status'] as String);
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6)],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(item['type'] as String, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                            child: Text(item['status'] as String, style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: color)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text('${item['from']} → ${item['to']} (${item['days']} days)', style: GoogleFonts.inter(fontSize: 12.5, color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text(item['reason'] as String, style: GoogleFonts.inter(fontSize: 12, color: Colors.grey.withValues(alpha: 0.8))),
                    ],
                  ),
                ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
              },
            ),
          ],
        ),
      ),
    ),
    );
  }

  String _monthName(int month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  }
}
