import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class StaffProfileScreen extends StatefulWidget {
  const StaffProfileScreen({super.key});

  @override
  State<StaffProfileScreen> createState() => _StaffProfileScreenState();
}

class _StaffProfileScreenState extends State<StaffProfileScreen> {
  String _name = 'Ms. Sunita Agarwal';
  final String _staffId = 'EMP-STAFF-104';
  String _mobile = '+91 98765 43210';
  String _email = 'sunita@greenfield.edu';
  final String _dept = 'Administration & Accounts';
  String _designation = 'Chief Accounts & Admin Officer';
  final String _joiningDate = '12 Aug 2020';
  String _address = '45, Green Park Enclave, Jaipur, Rajasthan';

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (ctx) {
        final isDark = Theme.of(ctx).brightness == Brightness.dark;
        return AlertDialog(
          backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const Icon(Icons.logout_rounded, color: Colors.red),
              const SizedBox(width: 10),
              Text('Employee Logout', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
            ],
          ),
          content: Text(
            'Are you sure you want to log out of Employee Portal?',
            style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.white70 : const Color(0xFF475569)),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                context.go('/staff-login');
              },
              child: Text('Logout Now', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  void _openEditSheet() {
    final nameCtrl = TextEditingController(text: _name);
    final mobileCtrl = TextEditingController(text: _mobile);
    final emailCtrl = TextEditingController(text: _email);
    final desigCtrl = TextEditingController(text: _designation);
    final addrCtrl = TextEditingController(text: _address);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final isDark = Theme.of(ctx).brightness == Brightness.dark;
        return Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
          child: Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(10)))),
                  const SizedBox(height: 14),
                  Text('Update Employee Profile', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                  const Divider(height: 20),
                  _field('Full Name', nameCtrl, isDark),
                  _field('Designation', desigCtrl, isDark),
                  _field('Mobile Number', mobileCtrl, isDark),
                  _field('Email Address', emailCtrl, isDark),
                  _field('Residential Address', addrCtrl, isDark),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669)),
                      onPressed: () {
                        setState(() {
                          _name = nameCtrl.text.trim();
                          _mobile = mobileCtrl.text.trim();
                          _email = emailCtrl.text.trim();
                          _designation = desigCtrl.text.trim();
                          _address = addrCtrl.text.trim();
                        });
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Employee Profile Updated! ✅'), backgroundColor: Color(0xFF059669)),
                        );
                      },
                      child: Text('Save Profile Updates', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _field(String label, TextEditingController ctrl, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
          const SizedBox(height: 4),
          TextField(
            controller: ctrl,
            style: GoogleFonts.inter(fontSize: 13.5),
            decoration: InputDecoration(
              filled: true,
              fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
          ),
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
        title: Text('My Profile', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Avatar with Floating Edit Badge
              Center(
                child: Column(
                  children: [
                    GestureDetector(
                      onTap: _openEditSheet,
                      child: Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          Container(
                            width: 96,
                            height: 96,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xFFD1FAE5),
                              border: Border.all(color: const Color(0xFF059669), width: 3),
                            ),
                            child: const Center(
                              child: Icon(Icons.person_rounded, size: 60, color: Color(0xFF059669)),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: const Color(0xFF059669),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 16),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(_name, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                    Text(_designation, style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF059669), fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(color: const Color(0xFF059669).withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                      child: Text('Staff ID: $_staffId', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Employee Details List
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    _row('Staff ID', _staffId, isDark),
                    _divider(isDark),
                    _row('Full Name', _name, isDark),
                    _divider(isDark),
                    _row('Mobile Number', _mobile, isDark),
                    _divider(isDark),
                    _row('Work Email', _email, isDark),
                    _divider(isDark),
                    _row('Department', _dept, isDark),
                    _divider(isDark),
                    _row('Designation', _designation, isDark),
                    _divider(isDark),
                    _row('Joining Date', _joiningDate, isDark),
                    _divider(isDark),
                    _row('Address', _address, isDark),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Quick Action Tiles with Edit Profile Tile
              _tile('Edit Profile Information', Icons.edit_note_rounded, _openEditSheet, isDark),
              const SizedBox(height: 10),
              _tile('Employee Digital ID Card', Icons.badge_rounded, () => context.push('/staff-id-card'), isDark),
              const SizedBox(height: 10),
              _tile('My Documents', Icons.folder_shared_rounded, () => context.push('/staff-documents'), isDark),
              const SizedBox(height: 10),
              _tile('Settings & Security', Icons.settings_rounded, () => context.push('/staff-settings'), isDark),
              
              const SizedBox(height: 20),

              // Direct Logout Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.withValues(alpha: 0.12),
                    foregroundColor: Colors.red,
                    elevation: 0,
                    side: const BorderSide(color: Colors.red, width: 1.5),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: _showLogoutDialog,
                  icon: const Icon(Icons.logout_rounded, color: Colors.red, size: 20),
                  label: Text('Logout from Employee Portal', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.red)),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _row(String label, String val, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 9),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w500)),
          Flexible(child: Text(val, textAlign: TextAlign.end, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)))),
        ],
      ),
    );
  }

  Widget _divider(bool isDark) => Divider(height: 1, color: isDark ? Colors.white10 : const Color(0xFFF1F5F9));

  Widget _tile(String title, IconData icon, VoidCallback onTap, bool isDark) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
      ),
      child: ListTile(
        leading: Icon(icon, color: const Color(0xFF059669), size: 20),
        title: Text(title, style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.grey),
        onTap: onTap,
      ),
    );
  }
}
