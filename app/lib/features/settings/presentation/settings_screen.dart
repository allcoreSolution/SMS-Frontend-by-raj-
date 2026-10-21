import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/theme_provider.dart';
import 'logout_dialog.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/dashboard');
      },
      child: Scaffold(
      appBar: AppBar(
        title: Text('Settings', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _settingsTile(
              icon: Icons.person_outline_rounded,
              title: 'Profile Settings',
              onTap: () => context.push('/profile'),
              isDark: isDark,
            ),
            const SizedBox(height: 12),
            _switchTile(
              icon: Icons.notifications_none_rounded,
              title: 'Notification Settings',
              value: _notificationsEnabled,
              onChanged: (val) => setState(() => _notificationsEnabled = val),
              isDark: isDark,
            ),
            const SizedBox(height: 12),
            _switchTile(
              icon: Icons.dark_mode_outlined,
              title: 'Dark Mode',
              value: ThemeProvider.instance.isDarkMode,
              onChanged: (val) => ThemeProvider.instance.toggleTheme(val),
              isDark: isDark,
            ),
            const SizedBox(height: 12),
            _settingsTile(
              icon: Icons.lock_outline_rounded,
              title: 'Change Password',
              onTap: () => context.push('/change-password'),
              isDark: isDark,
            ),
            const SizedBox(height: 12),
            _settingsTile(
              icon: Icons.privacy_tip_outlined,
              title: 'Privacy Policy',
              onTap: () {},
              isDark: isDark,
            ),
            const SizedBox(height: 12),
            _settingsTile(
              icon: Icons.gavel_outlined,
              title: 'Terms & Conditions',
              onTap: () {},
              isDark: isDark,
            ),
            const SizedBox(height: 12),
            _settingsTile(
              icon: Icons.help_outline_rounded,
              title: 'Help & Support',
              onTap: () => context.push('/complaint'),
              isDark: isDark,
            ),
            const SizedBox(height: 12),
            _settingsTile(
              icon: Icons.info_outline_rounded,
              title: 'About App',
              subtitle: 'Version 1.0.0',
              onTap: () {},
              isDark: isDark,
            ),

            const SizedBox(height: 32),

            // Logout Red Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => const LogoutDialog(),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEF4444),
                ),
                icon: const Icon(Icons.logout_rounded),
                label: const Text('Logout'),
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _settingsTile({
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
      ),
      child: ListTile(
        leading: Icon(icon, color: const Color(0xFF2563EB)),
        title: Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15)),
        subtitle: subtitle != null ? Text(subtitle, style: const TextStyle(fontSize: 12)) : null,
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.grey),
        onTap: onTap,
      ),
    );
  }

  Widget _switchTile({
    required IconData icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
    required bool isDark,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
      ),
      child: SwitchListTile(
        secondary: Icon(icon, color: const Color(0xFF2563EB)),
        title: Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15)),
        value: value,
        activeThumbColor: const Color(0xFF2563EB),
        onChanged: onChanged,
      ),
    );
  }
}
