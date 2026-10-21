import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherSalarySlipScreen extends StatefulWidget {
  const TeacherSalarySlipScreen({super.key});

  @override
  State<TeacherSalarySlipScreen> createState() => _TeacherSalarySlipScreenState();
}

class _TeacherSalarySlipScreenState extends State<TeacherSalarySlipScreen> {
  String _selectedMonth = '';
  List<Map<String, dynamic>> _payslips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPayslips();
  }

  Future<void> _loadPayslips() async {
    final repo = TeacherDataRepository.instance;
    await repo.fetchPayslips();
    if(mounted) {
      setState(() {
         // Transform payload
         _payslips = repo.payslips.map((p) => {
            'id': p['_id'],
            'monthLabel': '${p['month']}/${p['year']}',
            'status': p['status'] ?? 'Pending',
            'netSalary': (p['netSalary'] ?? 0).toString(),
            'basicSalary': (p['basicSalary'] ?? 0).toString(),
            'allowances': (p['allowances'] ?? 0).toString(),
            'deductions': (p['deductions'] ?? 0).toString(),
            'paymentDate': p['paymentDate'] != null ? DateTime.parse(p['paymentDate']).toString().split(' ')[0] : 'Not Paid',
         }).toList();
         
         if(_payslips.isEmpty) {
            _payslips = [{
              'id': 'mock', 'monthLabel': 'No Data', 'status': 'Pending', 
              'netSalary': '0', 'basicSalary': '0', 'allowances': '0', 'deductions': '0', 'paymentDate': '-'
            }];
         }
         _selectedMonth = _payslips.first['monthLabel'] as String;
         _isLoading = false;
      });
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
        title: Text('Salary Slip', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Month Dropdown Selector
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedMonth.isEmpty ? null : _selectedMonth,
                          isExpanded: true,
                          icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.grey),
                          items: _payslips
                              .map((m) => DropdownMenuItem(
                                    value: m['monthLabel'] as String,
                                    child: Text(m['monthLabel'] as String, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                                  ))
                              .toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedMonth = val);
                          },
                        ),
                      ),
                    ),

                    const SizedBox(height: 18),

                    Builder(builder: (context) {
                      final slip = _payslips.firstWhere((p) => p['monthLabel'] == _selectedMonth, orElse: () => _payslips.first);
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Net Salary Dark Purple Header Card
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF2E1065), Color(0xFF3B0764), Color(0xFF4C1D95)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [BoxShadow(color: const Color(0xFF3B0764).withValues(alpha: 0.35), blurRadius: 10, offset: const Offset(0, 4))],
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Net Salary', style: GoogleFonts.inter(fontSize: 12.5, color: Colors.white70)),
                                    const SizedBox(height: 4),
                                    Text('₹ ${slip['netSalary']}', style: GoogleFonts.outfit(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white)),
                                    const SizedBox(height: 4),
                                    Text('Status: ${slip['status']} | Date: ${slip['paymentDate']}', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white60)),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(Icons.account_balance_wallet_rounded, color: Colors.white, size: 24),
                                ),
                              ],
                            ),
                          ).animate().fadeIn(duration: 350.ms),

                          const SizedBox(height: 22),

                          // Earnings Section
                          Text('Earnings', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                          const SizedBox(height: 10),
                          _buildRow('Basic Salary', '₹ ${slip['basicSalary']}', isDark),
                          _buildRow('Allowances', '₹ ${slip['allowances']}', isDark),
                          const Divider(height: 16),
                          _buildRow('Total Earnings', '₹ ${double.parse(slip['basicSalary']) + double.parse(slip['allowances'])}', isDark, isBold: true),

                          const SizedBox(height: 22),

                          // Deductions Section
                          Text('Deductions', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                          const SizedBox(height: 10),
                          _buildRow('Deductions', '₹ ${slip['deductions']}', isDark),
                          const Divider(height: 16),
                          _buildRow('Total Deductions', '₹ ${slip['deductions']}', isDark, isBold: true),

                          const SizedBox(height: 22),
                          const Divider(height: 1, thickness: 1.5),
                          const SizedBox(height: 14),

                          // Summary Net Salary
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Net Salary', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                              Text('₹ ${slip['netSalary']}', style: GoogleFonts.outfit(fontSize: 19, fontWeight: FontWeight.w900, color: AppTheme.teacherPurple)),
                            ],
                          ),
                        ]
                      );
                    }),
                  ],
                ),
              ),
            ),

            // Download PDF Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Downloading Salary Slip PDF for $_selectedMonth... 📄'),
                        backgroundColor: AppTheme.teacherPurple,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    );
                  },
                  icon: const Icon(Icons.picture_as_pdf_rounded, color: Colors.white, size: 18),
                  label: Text('Download PDF', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.teacherPurple, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildRow(String label, String value, bool isDark, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 13, fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: isDark ? Colors.white70 : const Color(0xFF475569))),
          Text(value, style: GoogleFonts.inter(fontSize: 13, fontWeight: isBold ? FontWeight.w800 : FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        ],
      ),
    );
  }
}
