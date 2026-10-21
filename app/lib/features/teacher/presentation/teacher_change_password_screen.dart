import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class TeacherChangePasswordScreen extends StatefulWidget {
  const TeacherChangePasswordScreen({super.key});

  @override
  State<TeacherChangePasswordScreen> createState() => _TeacherChangePasswordScreenState();
}

class _TeacherChangePasswordScreenState extends State<TeacherChangePasswordScreen> {
  final _oldPass = TextEditingController();
  final _newPass = TextEditingController();
  final _confirmPass = TextEditingController();

  @override
  void dispose() {
    _oldPass.dispose();
    _newPass.dispose();
    _confirmPass.dispose();
    super.dispose();
  }

  void _handleUpdate() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Faculty Password Updated Successfully! 🔑'), backgroundColor: Color(0xFF4C1D95)),
    );
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFFFFDF7),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFFFFDF7),
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new_rounded,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
            size: 20,
          ),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/teacher-dashboard');
            }
          },
        ),
        title: Text(
          'Change Password',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Current Password', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(controller: _oldPass, obscureText: true, decoration: InputDecoration(filled: true, fillColor: isDark ? const Color(0xFF1E293B) : Colors.white, border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)))),
              const SizedBox(height: 16),
              Text('New Password', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(controller: _newPass, obscureText: true, decoration: InputDecoration(filled: true, fillColor: isDark ? const Color(0xFF1E293B) : Colors.white, border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)))),
              const SizedBox(height: 16),
              Text('Confirm New Password', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(controller: _confirmPass, obscureText: true, decoration: InputDecoration(filled: true, fillColor: isDark ? const Color(0xFF1E293B) : Colors.white, border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)))),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _handleUpdate,
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4C1D95), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                  child: Text('Update Password', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
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
