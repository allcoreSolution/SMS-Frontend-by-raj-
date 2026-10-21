import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/auth_service.dart';

class StaffSettingsScreen extends StatefulWidget {
  const StaffSettingsScreen({super.key});

  @override
  State<StaffSettingsScreen> createState() => _StaffSettingsScreenState();
}

class _StaffSettingsScreenState extends State<StaffSettingsScreen> {
  bool _notificationsEnabled = true;

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (ctx) {
        final isDark = Theme.of(ctx).brightness == Brightness.dark;
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
          title: Row(
            children: [
              const Icon(Icons.logout_rounded, color: Colors.red, size: 24),
              const SizedBox(width: 10),
              Text('Logout Confirmation', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
            ],
          ),
          content: Text(
            'Are you sure you want to logout from Employee Portal?',
            style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white70 : const Color(0xFF475569)),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
              onPressed: () async {
                Navigator.pop(ctx);
                await AuthService.instance.logout();
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Logged out safely from Employee Portal 👋'), backgroundColor: Colors.red),
                  );
                  context.go('/staff-login');
                }
              },
              child: Text('Confirm Logout', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
            ),
          ],
        );
      },
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
        title: Text('Settings & Preferences', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Security & Password
              _buildSectionTitle('Account Security', isDark),
              _buildTile('Change Password', Icons.lock_reset_rounded, () => context.push('/staff-change-password'), isDark),

              const SizedBox(height: 16),

              // Preferences
              _buildSectionTitle('Preferences & System', isDark),
              Container(
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                ),
                child: SwitchListTile(
                  secondary: const Icon(Icons.notifications_active_rounded, color: Color(0xFF059669)),
                  title: Text('Notification Alerts', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  subtitle: Text('Receive Push & SMS Notices', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                  value: _notificationsEnabled,
                  activeThumbColor: const Color(0xFF059669),
                  onChanged: (v) => setState(() => _notificationsEnabled = v),
                ),
              ),

              const SizedBox(height: 10),

              _buildTile('Language (English / Hindi)', Icons.g_translate_rounded, () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Language set to English (US)')));
              }, isDark),

              const SizedBox(height: 16),

              // Support & Information
              _buildSectionTitle('Support & Legal', isDark),
              _buildTile('Privacy Policy & Terms', Icons.policy_rounded, () {
                showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    title: const Text('Privacy Policy'),
                    content: const Text('Greenfield International School Employee Data Protection Compliance Policy v2.4.'),
                    actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close'))],
                  ),
                );
              }, isDark),
              const SizedBox(height: 10),
              _buildTile('Help & Support Desk', Icons.support_agent_rounded, () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Contacting HR Helpdesk support@greenfield.edu')));
              }, isDark),
              const SizedBox(height: 10),
              _buildTile('About Campus ERP App', Icons.info_outline_rounded, () {
                showAboutDialog(context: context, applicationName: 'Greenfield Employee App', applicationVersion: 'v3.5.0 Premium');
              }, isDark),

              const SizedBox(height: 28),

              // Logout Button
              SizedBox(
                width: double.infinity,
                height: 52,
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
                  label: Text('Secure Logout', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red)),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _buildSectionTitle(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(title, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
      ),
    );
  }

  Widget _buildTile(String title, IconData icon, VoidCallback onTap, bool isDark) {
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
