import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class StaffSalaryScreen extends StatefulWidget {
  const StaffSalaryScreen({super.key});

  @override
  State<StaffSalaryScreen> createState() => _StaffSalaryScreenState();
}

class _StaffSalaryScreenState extends State<StaffSalaryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedMonth = 'May 2025';

  List<Map<String, dynamic>> _paymentHistory = [];
  Map<String, dynamic>? _selectedPayslip;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchPayslips();
  }

  Future<void> _fetchPayslips() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_staff_token') ?? '';
      final staffId = prefs.getString('sp_staff_emp_id') ?? '';

      final response = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/payroll?staffId=$staffId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] != null) {
          final List<dynamic> data = body['data'];
          if (data.isNotEmpty) {
            setState(() {
              _paymentHistory = data.map((e) => {
                'month': '${e['month']} ${e['year']}',
                'amount': '₹ ${e['netSalary'] ?? 0}',
                'paidDate': e['paymentDate'] != null ? e['paymentDate'].toString().substring(0, 10) : 'Not Paid',
                'status': e['status'] ?? 'Pending',
                'raw': e,
              }).toList();
              
              _selectedMonth = _paymentHistory.first['month'] as String;
              _selectedPayslip = _paymentHistory.first;
              _isLoading = false;
            });
            return;
          }
        }
      }
    } catch (e) {
      debugPrint('Error fetching payslips: $e');
    }
    
    // Fallback to mock data if API fails or is empty
    setState(() {
      _paymentHistory = [];
      _selectedPayslip = null;
      _isLoading = false;
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
        title: Text('Employee Salary Details', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF059669),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF059669),
          indicatorWeight: 3,
          labelStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'Salary Details'),
            Tab(text: 'Payment History'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSalaryDetailsTab(isDark),
          _buildPaymentHistoryTab(isDark),
        ],
      ),
    ),
    );
  }

  Widget _buildSalaryDetailsTab(bool isDark) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF059669)));
    }

    final rawData = _selectedPayslip?['raw'];
    final basic = rawData?['basicSalary']?.toString() ?? '12000';
    final allow = rawData?['allowances']?.toString() ?? '7800';
    final deduc = rawData?['deductions']?.toString() ?? '1150';
    final net = rawData?['netSalary']?.toString() ?? '18650';
    final netAmount = '₹ $net';
    final gross = (double.tryParse(basic) ?? 0) + (double.tryParse(allow) ?? 0);
    final status = _selectedPayslip?['status'] ?? 'Pending';
    final paidDate = _selectedPayslip?['paidDate'] ?? 'Unknown';

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(18),
      child: Column(
        children: [
          // Month Selector Dropdown
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Select Salary Month:', style: GoogleFonts.inter(fontSize: 13, color: Colors.grey)),
                DropdownButton<String>(
                  value: _selectedMonth,
                  underline: const SizedBox(),
                  style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: const Color(0xFF059669)),
                  items: _paymentHistory.map((p) => p['month'] as String).map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                  onChanged: (v) {
                    setState(() {
                      _selectedMonth = v!;
                      _selectedPayslip = _paymentHistory.firstWhere((element) => element['month'] == v);
                    });
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Net Salary Hero Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF064E3B), Color(0xFF059669), Color(0xFF10B981)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              boxShadow: [BoxShadow(color: const Color(0xFF059669).withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 4))],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('MONTHLY NET SALARY', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 1)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
                      child: Text(status.toUpperCase(), style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(netAmount, style: GoogleFonts.outfit(fontSize: 34, fontWeight: FontWeight.w900, color: Colors.white)),
                Text(status == 'Paid' ? 'Paid on Date: $paidDate • Bank Transfer' : 'Payment Pending', style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Complete Salary Breakdown Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Earnings & Allowances Breakdown', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                const Divider(height: 20),
                _row('Basic Salary', '₹ $basic', isDark),
                _row('Allowances / Bonuses', '₹ $allow', isDark),
                const Divider(height: 16),
                _row('Gross Earnings', '₹ $gross', isDark, isBold: true),
                const Divider(height: 20),
                Text('Deductions', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red)),
                const Divider(height: 16),
                _row('Provident Fund & Taxes', '₹ $deduc', isDark, isDeduction: true),
                const Divider(height: 16),
                _row('Total Deductions', '₹ $deduc', isDark, isDeduction: true, isBold: true),
                const Divider(height: 20),
                _row('Net Salary Payable', netAmount, isDark, isBold: true, isPrimary: true),
              ],
            ),
          ),

          const SizedBox(height: 20),

          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Downloading Salary Slip PDF (May_2025_PaySlip.pdf)... 📄'), backgroundColor: Color(0xFF059669)),
                );
              },
              icon: const Icon(Icons.download_rounded, color: Colors.white),
              label: Text('Download Salary Slip PDF', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentHistoryTab(bool isDark) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF059669)));
    }
    
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Previous Months Payment Records', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
          const SizedBox(height: 12),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _paymentHistory.length,
            separatorBuilder: (_, _) => const SizedBox(height: 10),
            itemBuilder: (ctx, i) {
              final p = _paymentHistory[i];
              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(p['month']!, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Paid On: ${p['paidDate']}', style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(p['amount']!, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: const Color(0xFF059669))),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(6)),
                          child: Text('Paid ✅', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _row(String label, String val, bool isDark, {bool isBold = false, bool isDeduction = false, bool isPrimary = false}) {
    Color col = isDark ? Colors.white : const Color(0xFF0F172A);
    if (isDeduction) col = Colors.red;
    if (isPrimary) col = const Color(0xFF059669);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: isPrimary ? 14 : 13, fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: isDark ? Colors.white70 : const Color(0xFF475569))),
          Text(val, style: GoogleFonts.outfit(fontSize: isPrimary ? 16 : 14, fontWeight: isBold ? FontWeight.w900 : FontWeight.bold, color: col)),
        ],
      ),
    );
  }
}
