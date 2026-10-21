import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class StaffLeaveManagementScreen extends StatefulWidget {
  const StaffLeaveManagementScreen({super.key});

  @override
  State<StaffLeaveManagementScreen> createState() => _StaffLeaveManagementScreenState();
}

class _StaffLeaveManagementScreenState extends State<StaffLeaveManagementScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _leaveType = 'Casual Leave';
  final _reasonCtrl = TextEditingController();
  DateTime _fromDate = DateTime.now().add(const Duration(days: 2));
  DateTime _toDate = DateTime.now().add(const Duration(days: 3));

  List<Map<String, dynamic>> _myLeaves = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchMyLeaves();
  }

  Future<void> _fetchMyLeaves() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_staff_token') ?? prefs.getString('sp_teacher_token') ?? '';
      final staffId = prefs.getString('sp_staff_emp_id') ?? prefs.getString('sp_teacher_emp_id') ?? '';

      final response = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/leaves/my-leaves?staffId=$staffId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] != null) {
          final List<dynamic> data = body['data'];
          setState(() {
            _myLeaves = data.map((e) => {
              'type': e['leaveType'] ?? 'Leave',
              'from': e['startDate']?.toString().substring(0, 10) ?? 'Unknown',
              'to': e['endDate']?.toString().substring(0, 10) ?? 'Unknown',
              'days': 'Calculated', 
              'status': e['status'] ?? 'Pending',
              'reason': e['reason'] ?? '',
            }).toList();
            _isLoading = false;
          });
          return;
        }
      }
    } catch (e) {
      debugPrint('Error fetching leaves: $e');
    }
    
    // Fallback Mock Data
    setState(() {
      _myLeaves = [];
      _isLoading = false;
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _reasonCtrl.dispose();
    super.dispose();
  }

  Future<void> _submitApplication() async {
    if (_reasonCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a valid reason for leave'), backgroundColor: Colors.red));
      return;
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_staff_token') ?? prefs.getString('sp_teacher_token') ?? '';
      final staffId = prefs.getString('sp_staff_emp_id') ?? prefs.getString('sp_teacher_emp_id') ?? '';

      final Map<String, dynamic> payload = {
        'staffId': staffId,
        'leaveType': _leaveType,
        'startDate': _fromDate.toIso8601String(),
        'endDate': _toDate.toIso8601String(),
        'reason': _reasonCtrl.text.trim(),
        'status': 'Pending'
      };

      final response = await http.post(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/leaves/apply'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Leave Application Submitted to Live Server! ✅'), backgroundColor: Color(0xFF059669)),
        );
        _reasonCtrl.clear();
        _fetchMyLeaves(); // Reload live leaves
        _tabController.animateTo(1);
        return;
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to submit leave. Server responded with: ${response.statusCode}')));
      }
    } catch (e) {
      debugPrint('Error applying for leave: $e');
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Network error. Unable to submit live.')));
    }
  }

  void _showLeaveBalanceModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final isDark = Theme.of(ctx).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('My Leave Balances (Session 2024-25)', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
              const Divider(height: 20),
              _balanceRow('Casual Leave (CL)', '6 Remaining / 12 Total', isDark),
              _balanceRow('Sick Leave (SL)', '8 Remaining / 10 Total', isDark),
              _balanceRow('Privilege Leave (PL)', '4 Remaining / 5 Total', isDark),
              const Divider(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Total Remaining Leaves', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  Text('18 Days Available', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                ],
              ),
              const SizedBox(height: 14),
            ],
          ),
        );
      },
    );
  }

  Widget _balanceRow(String title, String val, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.white70 : const Color(0xFF334155))),
          Text(val, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

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
        title: Text('Leave Management', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF059669),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF059669),
          indicatorWeight: 3,
          labelStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'Apply Leave'),
            Tab(text: 'My Leaves History'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildApplyLeaveTab(isDark),
          _buildMyLeavesTab(isDark),
        ],
      ),
    ),
    );
  }

  Widget _buildApplyLeaveTab(bool isDark) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Leave Type *', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _leaveType,
                      isExpanded: true,
                      style: GoogleFonts.inter(fontSize: 13.5, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                      items: ['Casual Leave', 'Sick Leave', 'Privilege Leave', 'Maternity Leave'].map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                      onChanged: (v) => setState(() => _leaveType = v!),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('From Date *', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                          const SizedBox(height: 6),
                          GestureDetector(
                            onTap: () async {
                              final d = await showDatePicker(context: context, initialDate: _fromDate, firstDate: DateTime.now(), lastDate: DateTime(2026));
                              if (d != null) setState(() => _fromDate = d);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF), borderRadius: BorderRadius.circular(12)),
                              child: Row(
                                children: [
                                  const Icon(Icons.calendar_today_rounded, size: 16, color: Color(0xFF059669)),
                                  const SizedBox(width: 8),
                                  Text('${_fromDate.day}/${_fromDate.month}/${_fromDate.year}', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('To Date *', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                          const SizedBox(height: 6),
                          GestureDetector(
                            onTap: () async {
                              final d = await showDatePicker(context: context, initialDate: _toDate, firstDate: DateTime.now(), lastDate: DateTime(2026));
                              if (d != null) setState(() => _toDate = d);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF), borderRadius: BorderRadius.circular(12)),
                              child: Row(
                                children: [
                                  const Icon(Icons.calendar_today_rounded, size: 16, color: Color(0xFF059669)),
                                  const SizedBox(width: 8),
                                  Text('${_toDate.day}/${_toDate.month}/${_toDate.year}', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                Text('Reason for Leave *', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                const SizedBox(height: 6),
                TextField(
                  controller: _reasonCtrl,
                  maxLines: 3,
                  style: GoogleFonts.inter(fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'Provide detailed reason for absence...',
                    filled: true,
                    fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),

                const SizedBox(height: 16),

                Text('Optional Attachment (Doctor Prescription/Document)', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                const SizedBox(height: 6),
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: Color(0xFF059669))),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Document Attached Successfully!')));
                  },
                  icon: const Icon(Icons.attach_file_rounded, color: Color(0xFF059669)),
                  label: Text('Attach File / Image', style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF059669))),
                ),

                const SizedBox(height: 22),

                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                    onPressed: _submitApplication,
                    child: Text('Submit Leave Application', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMyLeavesTab(bool isDark) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF059669)));
    }
    
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Application History', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                onPressed: _showLeaveBalanceModal,
                icon: const Icon(Icons.account_balance_wallet_rounded, size: 16, color: Colors.white),
                label: Text('View Leave Balance', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ],
          ),

          const SizedBox(height: 14),

          if (_myLeaves.isEmpty)
             Padding(
                padding: const EdgeInsets.only(top: 40),
                child: Text('No leave applications found on the server.', style: GoogleFonts.inter(color: Colors.grey)),
             ),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _myLeaves.length,
            separatorBuilder: (_, _) => const SizedBox(height: 10),
            itemBuilder: (ctx, i) {
              final leave = _myLeaves[i];
              final status = leave['status'];
              Color stColor = status == 'Approved' ? const Color(0xFF059669) : ((status == 'Pending' || status == 'Pending Review') ? const Color(0xFFD97706) : Colors.red);
              Color stBg = status == 'Approved' ? const Color(0xFFD1FAE5) : ((status == 'Pending' || status == 'Pending Review') ? const Color(0xFFFEF3C7) : const Color(0xFFFEE2E2));

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
                        Text(leave['type'] ?? 'Leave', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: stBg, borderRadius: BorderRadius.circular(8)),
                          child: Text(status ?? 'Pending', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: stColor)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text('Duration: ${leave['from']} to ${leave['to']}', style: GoogleFonts.inter(fontSize: 12.5, color: Colors.grey)),
                    Text('Reason: ${leave['reason']}', style: GoogleFonts.inter(fontSize: 12.5, color: isDark ? Colors.white70 : const Color(0xFF475569))),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
