import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class StaffDirectoryScreen extends StatelessWidget {
  const StaffDirectoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final List<Map<String, dynamic>> employees = [
      {'name': 'Ms. Sunita Agarwal', 'role': 'Chief Accounts Officer', 'id': 'STF-2024-01', 'phone': '+91 98765 11111'},
      {'name': 'Mr. Rakesh Gupta', 'role': 'Senior Registrar', 'id': 'STF-2024-02', 'phone': '+91 98765 22222'},
      {'name': 'Prof. Ananya Verma', 'role': 'Faculty HOD', 'id': 'TCH-2024-88', 'phone': '+91 98765 33333'},
    ];

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/staff-dashboard');
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new_rounded,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
            size: 20,
          ),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Employee Directory',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
      ),
      body: SafeArea(
        child: ListView.separated(
          padding: const EdgeInsets.all(20),
          itemCount: employees.length,
          separatorBuilder: (context, index) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final emp = employees[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
                    child: Text(emp['name'][0], style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF8B5CF6))),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(emp['name'], style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('${emp['role']} • ${emp['id']}', style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                        Text('Phone: ${emp['phone']}', style: GoogleFonts.inter(fontSize: 11.5, color: const Color(0xFF8B5CF6))),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    ),
    );
  }
}
