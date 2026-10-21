import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/theme_provider.dart';

class TeacherProfileScreen extends StatefulWidget {
  const TeacherProfileScreen({super.key});

  @override
  State<TeacherProfileScreen> createState() => _TeacherProfileScreenState();
}

class _TeacherProfileScreenState extends State<TeacherProfileScreen> {
  // Profile State Data
  String _name = 'Mr. Rajesh Sharma';
  final String _designation = 'Senior Mathematics Teacher';
  final String _empCode = 'EMP001';
  String _phone = '9876543210';
  String _email = 'rajesh.sharma@school.edu';
  final String _gender = 'Male';
  final String _dob = '15 Aug 1988';
  final String _bloodGroup = 'B-';
  String _qualification = 'M.Sc. Mathematics, B.Ed';
  final String _department = 'Academics';
  final String _joiningDate = '01 Aug 2022';
  final String _experience = '8 Years';

  // Bank Info
  final String _bankName = 'HDFC Bank';
  final String _accountNo = '50100293844892';
  final String _ifscCode = 'HDFC0001234';
  final String _panNo = 'ABCDE1234F';

  // Section Expansion State
  bool _showPersonal = true;
  bool _showProfessional = false;
  bool _showBank = false;

  void _openEditProfileSheet() {
    final nameCtrl = TextEditingController(text: _name);
    final phoneCtrl = TextEditingController(text: _phone);
    final emailCtrl = TextEditingController(text: _email);
    final qualCtrl = TextEditingController(text: _qualification);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final isFormValid = nameCtrl.text.trim().isNotEmpty && phoneCtrl.text.trim().isNotEmpty;

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
                      child: Container(width: 44, height: 5, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(10))),
                    ),
                    const SizedBox(height: 16),
                    Text('Edit Faculty Profile', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                    const SizedBox(height: 16),

                    // Name
                    TextField(
                      controller: nameCtrl,
                      onChanged: (_) => setSheetState(() {}),
                      decoration: InputDecoration(
                        labelText: 'Full Name',
                        prefixIcon: const Icon(Icons.person_outline_rounded),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Phone
                    TextField(
                      controller: phoneCtrl,
                      keyboardType: TextInputType.phone,
                      onChanged: (_) => setSheetState(() {}),
                      decoration: InputDecoration(
                        labelText: 'Phone Number',
                        prefixIcon: const Icon(Icons.phone_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Email
                    TextField(
                      controller: emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      onChanged: (_) => setSheetState(() {}),
                      decoration: InputDecoration(
                        labelText: 'Email Address',
                        prefixIcon: const Icon(Icons.email_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Qualification
                    TextField(
                      controller: qualCtrl,
                      onChanged: (_) => setSheetState(() {}),
                      decoration: InputDecoration(
                        labelText: 'Qualification',
                        prefixIcon: const Icon(Icons.school_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Conditional Save Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: isFormValid
                            ? () {
                                setState(() {
                                  _name = nameCtrl.text.trim();
                                  _phone = phoneCtrl.text.trim();
                                  _email = emailCtrl.text.trim();
                                  _qualification = qualCtrl.text.trim();
                                });
                                context.pop();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: const Text('Profile Updated Successfully! ✨'),
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
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: Text(
                          'Save Profile Changes',
                          style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isFormValid ? Colors.white : Colors.grey.shade600),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Logout Confirmation', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to log out of your faculty account?', style: GoogleFonts.inter(fontSize: 13)),
        actions: [
          TextButton(
            onPressed: () => context.pop(),
            child: Text('Cancel', style: GoogleFonts.outfit(color: Colors.grey, fontWeight: FontWeight.bold)),
          ),
          ElevatedButton(
            onPressed: () async {
              context.pop();
              await AuthService.instance.logout();
              if (mounted) {
                context.go('/teacher-login');
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            child: Text('Logout', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
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
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDark ? Colors.white : const Color(0xFF0F172A), size: 20),
          onPressed: () => context.pop(),
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
              // ════════════════ PROFILE HEADER CARD ════════════════
              Center(
                child: Column(
                  children: [
                    Stack(
                      children: [
                        Container(
                          width: 84, height: 84,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppTheme.teacherPurple.withValues(alpha: 0.15),
                            border: Border.all(color: AppTheme.teacherPurple, width: 2.5),
                          ),
                          child: const CircleAvatar(
                            backgroundColor: Colors.transparent,
                            child: Icon(Icons.person_rounded, size: 54, color: AppTheme.teacherPurple),
                          ),
                        ),
                        Positioned(
                          bottom: 0, right: 0,
                          child: GestureDetector(
                            onTap: _openEditProfileSheet,
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: AppTheme.teacherPurple,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.camera_alt_rounded, size: 14, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(_name, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                    const SizedBox(height: 2),
                    Text(_designation, style: GoogleFonts.inter(fontSize: 13, color: Colors.grey)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.teacherPurple.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text('EMP Code: $_empCode', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // ════════════════ SECTION 1: PERSONAL INFORMATION ════════════════
              _buildExpandableCard(
                title: 'Personal Information',
                icon: Icons.person_outline_rounded,
                isExpanded: _showPersonal,
                isDark: isDark,
                onToggle: () => setState(() => _showPersonal = !_showPersonal),
                children: [
                  _buildDetailRow('Full Name', _name, isDark),
                  _buildDetailRow('Gender', _gender, isDark),
                  _buildDetailRow('Date of Birth', _dob, isDark),
                  _buildDetailRow('Blood Group', _bloodGroup, isDark),
                  _buildDetailRow('Phone', _phone, isDark),
                  _buildDetailRow('Email', _email, isDark),
                ],
              ),

              const SizedBox(height: 12),

              // ════════════════ SECTION 2: PROFESSIONAL INFORMATION ════════════════
              _buildExpandableCard(
                title: 'Professional Information',
                icon: Icons.business_center_outlined,
                isExpanded: _showProfessional,
                isDark: isDark,
                onToggle: () => setState(() => _showProfessional = !_showProfessional),
                children: [
                  _buildDetailRow('Department', _department, isDark),
                  _buildDetailRow('Designation', _designation, isDark),
                  _buildDetailRow('Qualification', _qualification, isDark),
                  _buildDetailRow('Joining Date', _joiningDate, isDark),
                  _buildDetailRow('Experience', _experience, isDark),
                ],
              ),

              const SizedBox(height: 12),

              // ════════════════ SECTION 3: BANK DETAILS ════════════════
              _buildExpandableCard(
                title: 'Bank Details',
                icon: Icons.account_balance_outlined,
                isExpanded: _showBank,
                isDark: isDark,
                onToggle: () => setState(() => _showBank = !_showBank),
                children: [
                  _buildDetailRow('Bank Name', _bankName, isDark),
                  _buildDetailRow('Account Number', _accountNo, isDark),
                  _buildDetailRow('IFSC Code', _ifscCode, isDark),
                  _buildDetailRow('PAN Number', _panNo, isDark),
                ],
              ),

              const SizedBox(height: 12),

              // ════════════════ SECTION 4: QUICK NAVIGATION TILES ════════════════
              _buildNavTile(
                title: 'Assigned Subjects & Classes',
                icon: Icons.menu_book_outlined,
                isDark: isDark,
                onTap: () => context.push('/teacher-subjects'),
              ),
              const SizedBox(height: 10),
              _buildNavTile(
                title: 'Change Password',
                icon: Icons.lock_outline_rounded,
                isDark: isDark,
                onTap: () => context.push('/teacher-change-password'),
              ),
              const SizedBox(height: 10),

              // ════════════════ DARK THEME SWITCH TILE ════════════════
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                  ),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6)],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                          color: isDark ? const Color(0xFFF59E0B) : AppTheme.teacherPurple,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Dark Theme Mode',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    Switch(
                      value: isDark,
                      activeTrackColor: AppTheme.teacherPurple,
                      onChanged: (val) => ThemeProvider.instance.toggleTheme(val),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Logout Button
              Container(
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                ),
                child: ListTile(
                  leading: const Icon(Icons.logout_rounded, color: Colors.red, size: 20),
                  title: Text('Logout Account', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.red)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.red),
                  onTap: _showLogoutDialog,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _buildExpandableCard({
    required String title,
    required IconData icon,
    required bool isExpanded,
    required bool isDark,
    required VoidCallback onToggle,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6)],
      ),
      child: Column(
        children: [
          ListTile(
            leading: Icon(icon, color: AppTheme.teacherPurple, size: 20),
            title: Text(title, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
            trailing: Icon(isExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded, color: Colors.grey),
            onTap: onToggle,
          ),
          if (isExpanded) ...[
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(children: children),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildNavTile({
    required String title,
    required IconData icon,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6)],
      ),
      child: ListTile(
        leading: Icon(icon, color: isDark ? Colors.white70 : const Color(0xFF475569), size: 20),
        title: Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.grey),
        onTap: onTap,
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 12.5, color: Colors.grey)),
          Text(value, style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        ],
      ),
    );
  }
}
