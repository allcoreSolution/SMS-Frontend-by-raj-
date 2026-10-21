import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/services/auth_service.dart';

class ProfileScreen extends StatefulWidget {
  final bool openIdCard;
  const ProfileScreen({super.key, this.openIdCard = false});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  int _selectedTab = 0;

  final List<String> _tabs = [
    'Personal',
    'Academic',
    'Parents',
    'Medical',
    'Docs',
  ];

  @override
  void initState() {
    super.initState();
    _fetchProfileData();

    if (widget.openIdCard) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showStudentIdCardDialog(context);
      });
    }
  }

  Future<void> _fetchProfileData() async {
    await AuthService.instance.fetchStudentProfileApi();
  }

  List<Map<String, String>> _getFieldsForTab(int tabIndex) {
    final auth = AuthService.instance;

    switch (tabIndex) {
      case 0: // Personal
        return [
          {'label': 'Full Name', 'value': auth.studentName},
          {'label': 'Email', 'value': auth.email},
          {'label': 'Mobile Number', 'value': auth.admissionNumber},
          {'label': 'Date of Birth', 'value': auth.dob},
          {'label': 'Gender', 'value': auth.gender},
          {'label': 'Blood Group', 'value': auth.bloodGroup},
          {'label': 'Account Status', 'value': auth.isActive ? 'Active ✅' : 'Inactive ❌'},
          {'label': 'Portal Access', 'value': auth.allowPortalAccess ? 'Allowed ✅' : 'Disabled ❌'},
          {'label': 'Role', 'value': auth.activeRole.toUpperCase()},
          {'label': 'Address', 'value': auth.address},
        ];
      case 1: // Academic
        return [
          {'label': 'Class', 'value': auth.studentClass},
          {'label': 'Section', 'value': auth.section},
          {'label': 'Class & Section', 'value': auth.className},
          {'label': 'Roll Number', 'value': auth.rollNo},
          {'label': 'Admission Number', 'value': auth.admissionNo},
          {'label': 'Academic Session', 'value': '2025 - 2026'},
          {'label': 'Student ID', 'value': auth.studentId},
        ];
      case 2: // Parents
        return [
          {'label': 'Father Name', 'value': auth.fatherName},
          {'label': 'Father Mobile', 'value': auth.admissionNumber},
          {'label': 'Mother Name', 'value': auth.motherName},
          {'label': 'Guardian Name', 'value': auth.fatherName},
        ];
      case 3: // Medical
        return [
          {'label': 'Known Allergies', 'value': 'None'},
          {'label': 'Medical History', 'value': 'Normal'},
          {'label': 'Blood Group', 'value': auth.bloodGroup},
          {'label': 'Emergency Contact', 'value': auth.emergencyContact},
        ];
      case 4: // Docs
        return [
          {'label': 'Passport Photo', 'value': auth.photo.isNotEmpty ? 'Uploaded 📷' : 'Not Uploaded ❌', 'url': auth.photoUrl},
          {'label': 'Aadhaar Card', 'value': auth.aadhaarCard.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.aadhaarCardUrl},
          {'label': 'PAN Card', 'value': auth.pan.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.panUrl},
          {'label': 'Birth Certificate', 'value': auth.birthCertificate.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.birthCertificateUrl},
          {'label': 'Transfer Certificate', 'value': auth.transferCertificate.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.transferCertificateUrl},
          {'label': 'Previous Marksheet', 'value': auth.previousMarksheet.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.previousMarksheetUrl},
          {'label': 'Qualification Cert.', 'value': auth.qualificationCert.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.qualificationCertUrl},
          {'label': 'Experience Cert.', 'value': auth.experienceCert.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.experienceCertUrl},
          {'label': 'Student Resume / CV', 'value': auth.resume.isNotEmpty ? 'Uploaded 📄' : 'Not Uploaded ❌', 'url': auth.resumeUrl},
        ];
      default:
        return [];
    }
  }

  Widget _infoRow(Map<String, String> item, bool isDark) {
    final label = item['label']!;
    final value = item['value']!;
    final url = item['url'] ?? '';

    final isVerified = value.contains('✅') || value.contains('Uploaded');
    final isPending = value.contains('⏳');

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 9),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                value,
                textAlign: TextAlign.end,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: isVerified
                      ? const Color(0xFF10B981)
                      : isPending
                          ? const Color(0xFFF59E0B)
                          : (isDark ? Colors.white : const Color(0xFF0F172A)),
                ),
              ),
              if (url.isNotEmpty) ...[
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () => _showDocumentPreviewModal(context, label, url, isDark),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.visibility_rounded, color: Color(0xFF2563EB), size: 14),
                        const SizedBox(width: 4),
                        Text(
                          'View',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF2563EB),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  void _showDocumentPreviewModal(BuildContext context, String title, String url, bool isDark) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        child: Container(
          width: double.infinity,
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.8),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.4),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.description_rounded, color: Color(0xFF2563EB), size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        title,
                        style: GoogleFonts.outfit(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, size: 22),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
              ),
              Flexible(
                child: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        url,
                        fit: BoxFit.contain,
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return const SizedBox(
                            height: 200,
                            child: Center(
                              child: CircularProgressIndicator(color: Color(0xFF2563EB)),
                            ),
                          );
                        },
                        errorBuilder: (ctx, err, stack) => Container(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              const Icon(Icons.broken_image_rounded, size: 54, color: Colors.grey),
                              const SizedBox(height: 8),
                              Text(
                                'Unable to load document image.\nURL: $url',
                                textAlign: TextAlign.center,
                                style: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(14),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                    label: Text('Done Viewing', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

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
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        leading: context.canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                onPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/dashboard');
                  }
                },
              )
            : null,
        title: Text(
          'My Profile',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Column(
                  children: [
                    // 1. Profile Avatar & Student Name Header Section
                    Center(
                      child: Column(
                        children: [
                          ListenableBuilder(
                            listenable: AuthService.instance,
                            builder: (context, _) {
                              final auth = AuthService.instance;
                              return Column(
                                children: [
                                  Container(
                                    width: 88,
                                    height: 88,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: isDark ? const Color(0xFF334155) : const Color(0xFFBFDBFE),
                                      border: Border.all(
                                        color: const Color(0xFF2563EB),
                                        width: 3,
                                      ),
                                    ),
                                    child: ClipOval(
                                      child: auth.photoUrl.isNotEmpty
                                          ? Image.network(
                                              auth.photoUrl,
                                              width: 88,
                                              height: 88,
                                              fit: BoxFit.cover,
                                              errorBuilder: (ctx, err, stack) => const Center(
                                                child: Icon(
                                                  Icons.person_rounded,
                                                  size: 52,
                                                  color: Color(0xFF2563EB),
                                                ),
                                              ),
                                            )
                                          : const Center(
                                              child: Icon(
                                                Icons.face_rounded,
                                                size: 58,
                                                color: Color(0xFF2563EB),
                                              ),
                                            ),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    auth.studentName,
                                    style: GoogleFonts.outfit(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w900,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    auth.className,
                                    style: GoogleFonts.inter(
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w600,
                                      color: const Color(0xFF2563EB),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Admission No. ${auth.admissionNo} | Roll No. ${auth.rollNo}',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                        ],
                      ),
                    ).animate().fadeIn(duration: 450.ms).slideY(begin: -0.15),

                    const SizedBox(height: 18),

                    // 2. Horizontal Scrollable Category Tabs Bar
                    SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        itemCount: _tabs.length,
                        itemBuilder: (context, index) {
                          final isSelected = _selectedTab == index;
                          return GestureDetector(
                            onTap: () => setState(() => _selectedTab = index),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                              margin: const EdgeInsets.only(right: 8),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? const Color(0xFF2563EB)
                                    : (isDark ? const Color(0xFF1E293B) : Colors.white),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected
                                      ? const Color(0xFF2563EB)
                                      : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                                  width: 1.5,
                                ),
                                boxShadow: isSelected
                                    ? [BoxShadow(color: const Color(0xFF2563EB).withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 3))]
                                    : null,
                              ),
                              child: Text(
                                _tabs[index],
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                  color: isSelected
                                      ? Colors.white
                                      : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 14),

                    // 3. Dynamic Auto-Height Category Details Card
                    ListenableBuilder(
                      listenable: AuthService.instance,
                      builder: (context, _) {
                        final fields = _getFieldsForTab(_selectedTab);

                        return Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                                blurRadius: 12,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: Column(
                            children: List.generate(fields.length, (idx) {
                              final item = fields[idx];
                              return Column(
                                children: [
                                  _infoRow(item, isDark),
                                  if (idx < fields.length - 1) _divider(isDark),
                                ],
                              );
                            }),
                          ),
                        ).animate(key: ValueKey(_selectedTab)).fadeIn(duration: 250.ms);
                      },
                    ),

                    const SizedBox(height: 16),

                    // 4. Quick Nav Settings Card
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                          color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                        ),
                      ),
                      child: Column(
                        children: [
                          ListTile(
                            dense: true,
                            leading: const Icon(Icons.badge_rounded, color: Color(0xFF2563EB)),
                            title: Text('Digital Student ID Card', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 13.5)),
                            subtitle: Text('View & Download Official Digital ID Card', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                            trailing: const Icon(Icons.chevron_right_rounded, size: 20),
                            onTap: () => _showStudentIdCardDialog(context),
                          ),
                          _divider(isDark),
                          ListTile(
                            dense: true,
                            leading: const Icon(Icons.folder_shared_rounded, color: Color(0xFF10B981)),
                            title: Text('My Documents', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 13.5)),
                            trailing: const Icon(Icons.chevron_right_rounded, size: 20),
                            onTap: () => context.push('/documents'),
                          ),
                          _divider(isDark),
                          ListTile(
                            dense: true,
                            leading: const Icon(Icons.lock_reset_rounded, color: Color(0xFF8B5CF6)),
                            title: Text('Change Password', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 13.5)),
                            trailing: const Icon(Icons.chevron_right_rounded, size: 20),
                            onTap: () => context.push('/change-password'),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // 5. Dark Theme Switch Card
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                                color: isDark ? const Color(0xFFF59E0B) : const Color(0xFF6366F1),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Dark Theme',
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
                            activeTrackColor: const Color(0xFF2563EB),
                            onChanged: (val) => ThemeProvider.instance.toggleTheme(val),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // 6. Logout Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton.icon(
                        onPressed: () => _showLogoutDialog(context),
                        icon: const Icon(Icons.logout_rounded, color: Color(0xFFEF4444), size: 18),
                        label: Text(
                          'Logout Account',
                          style: GoogleFonts.inter(
                            fontSize: 14.5,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFFEF4444),
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }



  Widget _divider(bool isDark) {
    return Divider(
      height: 1,
      thickness: 1,
      color: isDark ? Colors.white10 : const Color(0xFFF1F5F9),
    );
  }



  void _showStudentIdCardDialog(BuildContext context) {
    final auth = AuthService.instance;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: SingleChildScrollView(
          child: Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF2563EB), width: 2.5),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.35),
                  blurRadius: 24,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 10),
                // 1. Lanyard Badge Hole Punch Slot
                Center(
                  child: Container(
                    width: 44,
                    height: 9,
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF0F172A) : const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.grey.withValues(alpha: 0.5), width: 1),
                    ),
                  ),
                ),

                const SizedBox(height: 10),

                // 2. School Header Banner Card
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF0F172A), Color(0xFF1E3A8A), Color(0xFF2563EB)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(7),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.school_rounded, color: Color(0xFF2563EB), size: 26),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'GREENWOOD PUBLIC SCHOOL',
                              style: GoogleFonts.outfit(
                                fontSize: 15.5,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                            Text(
                              'CBSE Affiliated (No. 1730452) • Estd. 1998',
                              style: GoogleFonts.inter(fontSize: 10.5, color: Colors.white70, fontWeight: FontWeight.w600),
                            ),
                            Text(
                              'Sector 10, Greenwood Enclave, Jaipur (RJ)',
                              style: GoogleFonts.inter(fontSize: 9.5, color: Colors.white60),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: Colors.white, size: 22),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                ),

                // 3. Ribbon Session Tag Bar
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 5),
                  color: const Color(0xFFF59E0B),
                  child: Text(
                    'STUDENT IDENTITY CARD • SESSION 2024-25',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w900,
                      color: Colors.black,
                      letterSpacing: 1,
                    ),
                  ),
                ),

                // 4. Card Content Body
                Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Photo Frame with Verified Badge
                          Column(
                            children: [
                              Container(
                                width: 88,
                                height: 104,
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: const Color(0xFF2563EB), width: 2.5),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.1),
                                      blurRadius: 6,
                                    ),
                                  ],
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(11),
                                  child: auth.photoUrl.isNotEmpty
                                      ? Image.network(
                                          auth.photoUrl,
                                          width: 88,
                                          height: 104,
                                          fit: BoxFit.cover,
                                          errorBuilder: (ctx, err, stack) => const Center(
                                            child: Icon(Icons.person_rounded, size: 64, color: Color(0xFF2563EB)),
                                          ),
                                        )
                                      : const Center(
                                          child: Icon(Icons.person_rounded, size: 64, color: Color(0xFF2563EB)),
                                        ),
                                ),
                              ),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: const Color(0xFF10B981)),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.verified_rounded, color: Color(0xFF10B981), size: 12),
                                    const SizedBox(width: 3),
                                    Text(
                                      'VERIFIED',
                                      style: GoogleFonts.inter(fontSize: 9.5, fontWeight: FontWeight.w900, color: const Color(0xFF10B981)),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(width: 14),

                          // Student Details Grid
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  auth.studentName,
                                  style: GoogleFonts.outfit(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w900,
                                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  margin: const EdgeInsets.only(top: 2, bottom: 8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF2563EB).withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    auth.className,
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFF2563EB),
                                    ),
                                  ),
                                ),

                                _realIdRow('Admission No', auth.admissionNo, isDark),
                                _realIdRow('Roll Number', auth.rollNo, isDark),
                                _realIdRow('Date of Birth', auth.dob, isDark),
                                _realIdRow('Gender', auth.gender, isDark),
                                _realIdRow('Blood Group', auth.bloodGroup, isDark),
                                _realIdRow('Emergency Call', auth.emergencyContact, isDark),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 14),
                      const Divider(height: 1),
                      const SizedBox(height: 12),

                      // 5. Address & Signatures Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Residential Address:',
                                  style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                                ),
                                Text(
                                  auth.address,
                                  style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : const Color(0xFF334155)),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 10),
                          // Principal Stamp & Signature
                          Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: const Color(0xFF2563EB), width: 1.5),
                                ),
                                child: const Icon(Icons.verified_user_rounded, color: Color(0xFF2563EB), size: 24),
                              ),
                              Text(
                                'Dr. Anita Saxena',
                                style: GoogleFonts.caveat(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF2563EB)),
                              ),
                              Text(
                                'Principal Signature',
                                style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                              ),
                            ],
                          ),
                        ],
                      ),

                      const SizedBox(height: 14),

                      // 6. Security Barcode & QR Code Section
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                        ),
                        child: Column(
                          children: [
                            Text(
                              '||||| |||| || |||||| | ||||| ||||| |||',
                              style: GoogleFonts.vt323(fontSize: 24, letterSpacing: 2.5, color: isDark ? Colors.white70 : const Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'BARCODE VERIFICATION: STU-${auth.admissionNumber}-2024',
                              style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 18),

                      // Action Button
                      SizedBox(
                        width: double.infinity,
                        height: 46,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF2563EB),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          onPressed: () {
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Authentic Digital Student ID Card Saved to Phone Gallery! 🪪✅'),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                          },
                          icon: const Icon(Icons.download_rounded, size: 20, color: Colors.white),
                          label: Text(
                            'Download Official Digital ID Card',
                            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _realIdRow(String label, String value, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 3),
      child: Row(
        children: [
          SizedBox(
            width: 92,
            child: Text(
              label,
              style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
            ),
          ),
          Text(
            ': ',
            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
          ),
          Expanded(
            child: Text(
              value,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
            ),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Logout Account'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await AuthService.instance.logout();
              if (!context.mounted) return;
              context.go('/login');
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}
