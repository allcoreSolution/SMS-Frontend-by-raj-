import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherSelfAttendanceScreen extends StatefulWidget {
  const TeacherSelfAttendanceScreen({super.key});

  @override
  State<TeacherSelfAttendanceScreen> createState() => _TeacherSelfAttendanceScreenState();
}

class _TeacherSelfAttendanceScreenState extends State<TeacherSelfAttendanceScreen> {
  int _statusState = 0; // 0: Not Checked In, 1: Checked In, 2: Checked Out
  String _checkInTime = '--:--';
  String _checkOutTime = '--:--';

  String _getTime() {
    final now = TimeOfDay.now();
    final h = now.hourOfPeriod == 0 ? 12 : now.hourOfPeriod;
    final m = now.minute.toString().padLeft(2, '0');
    final period = now.period == DayPeriod.am ? 'AM' : 'PM';
    return '$h:$m $period';
  }

  void _processCheckInOut() {
    final t = _getTime();
    if (_statusState == 0) {
      setState(() {
        _statusState = 1;
        _checkInTime = t;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Checked In Successfully at $t via AI Face ID! ✅'),
          backgroundColor: const Color(0xFF059669),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } else if (_statusState == 1) {
      setState(() {
        _statusState = 2;
        _checkOutTime = t;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Checked Out Successfully at $t! Have a great evening 🏁'),
          backgroundColor: AppTheme.teacherPurple,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _triggerBiometricScanner(String label, Color color) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _BiometricScannerSheet(
        label: label,
        accentColor: color,
        onVerified: () {
          Navigator.pop(ctx);
          _processCheckInOut();
        },
      ),
    );
  }

  final List<Map<String, String>> _history = [
    {'day': 'Mon, 05 May', 'in': '08:30 AM', 'out': '05:30 PM', 'hours': '9h 00m'},
    {'day': 'Fri, 02 May', 'in': '08:28 AM', 'out': '05:30 PM', 'hours': '9h 02m'},
    {'day': 'Thu, 01 May', 'in': '08:35 AM', 'out': '05:25 PM', 'hours': '8h 50m'},
    {'day': 'Wed, 30 Apr', 'in': '08:30 AM', 'out': '05:30 PM', 'hours': '9h 00m'},
    {'day': 'Tue, 29 Apr', 'in': '08:25 AM', 'out': '05:30 PM', 'hours': '9h 05m'},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF4F7F6);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      body: SafeArea(
        child: Column(
          children: [
            // ════════════════ TOP NAVIGATION BAR ════════════════
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/teacher-dashboard');
                      }
                    },
                    child: Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 6)],
                      ),
                      child: Icon(Icons.arrow_back_ios_new_rounded,
                          color: isDark ? Colors.white : const Color(0xFF0F172A), size: 18),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Self Biometric Attendance',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Check In & Check Out Portal',
                            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: _statusState == 0
                          ? const Color(0xFFFEE2E2)
                          : (_statusState == 1 ? const Color(0xFFD1FAE5) : const Color(0xFFDBEAFE)),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _statusState == 0 ? 'Not Checked In' : (_statusState == 1 ? 'Checked In ✅' : 'Checked Out 🏁'),
                      style: GoogleFonts.inter(
                        fontSize: 11, fontWeight: FontWeight.bold,
                        color: _statusState == 0
                            ? const Color(0xFFDC2626)
                            : (_statusState == 1 ? const Color(0xFF059669) : const Color(0xFF2563EB)),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ════════════════ HERO BIOMETRIC CARD ════════════════
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 10),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF3B0764), Color(0xFF4C1D95), Color(0xFF7C3AED)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.teacherPurple.withValues(alpha: 0.35),
                      blurRadius: 14, offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('CHECK IN TIME', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 1)),
                            const SizedBox(height: 4),
                            Text(_checkInTime, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
                          ],
                        ),
                        Container(width: 1, height: 40, color: Colors.white24),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('CHECK OUT TIME', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 1)),
                            const SizedBox(height: 4),
                            Text(_checkOutTime, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
                          ],
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // Single Action Button: Check In / Check Out
                    if (_statusState == 0) ...[
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            elevation: 4,
                          ),
                          onPressed: () => _triggerBiometricScanner('Check In', const Color(0xFF10B981)),
                          icon: const Icon(Icons.login_rounded, color: Colors.white),
                          label: Text('CHECK IN NOW (SCAN FACE / FINGER)', style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ] else if (_statusState == 1) ...[
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFDC2626),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            elevation: 4,
                          ),
                          onPressed: () => _triggerBiometricScanner('Check Out', const Color(0xFFDC2626)),
                          icon: const Icon(Icons.logout_rounded, color: Colors.white),
                          label: Text('CHECK OUT NOW (SCAN FACE / FINGER)', style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ] else ...[
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(14)),
                        child: Center(
                          child: Text('Today\'s Shift Completed ✅', style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            // ════════════════ HISTORY LOGS ════════════════
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10),
                    Text('Past Attendance Records', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                    const SizedBox(height: 10),

                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _history.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 8),
                      itemBuilder: (ctx, i) {
                        final h = _history[i];
                        return Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(color: AppTheme.teacherPurple.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
                                    child: const Icon(Icons.verified_user_rounded, color: AppTheme.teacherPurple, size: 18),
                                  ),
                                  const SizedBox(width: 12),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(h['day']!, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                                      Text('In: ${h['in']} • Out: ${h['out']}', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                                    ],
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(8)),
                                child: Text(h['hours']!, style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 20),
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
}

class _BiometricScannerSheet extends StatefulWidget {
  final String label;
  final Color accentColor;
  final VoidCallback onVerified;

  const _BiometricScannerSheet({
    required this.label,
    required this.accentColor,
    required this.onVerified,
  });

  @override
  State<_BiometricScannerSheet> createState() => _BiometricScannerSheetState();
}

class _BiometricScannerSheetState extends State<_BiometricScannerSheet> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isScanning = false;
  bool _isSuccess = false;
  String _scanStatus = 'Ready to Scan';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _startScan(String mode) async {
    setState(() {
      _isScanning = true;
      _scanStatus = mode == 'face' ? 'Scanning AI Face Mesh...' : 'Touch & Hold Fingerprint Sensor...';
    });

    await Future.delayed(const Duration(milliseconds: 1300));

    if (mounted) {
      setState(() {
        _isScanning = false;
        _isSuccess = true;
        _scanStatus = mode == 'face' ? 'Face Mesh Matched (99.8% Match) ✅' : 'Biometric Fingerprint Verified ✅';
      });

      await Future.delayed(const Duration(milliseconds: 700));
      widget.onVerified();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 44, height: 4, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(10))),
          const SizedBox(height: 16),
          Text(
            '${widget.label} - Biometric Scanner',
            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
          ),
          Text('GPS Verified: Greenwood Campus HQ', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
          
          const SizedBox(height: 16),

          TabBar(
            controller: _tabController,
            labelColor: widget.accentColor,
            unselectedLabelColor: Colors.grey,
            indicatorColor: widget.accentColor,
            indicatorWeight: 3,
            labelStyle: GoogleFonts.outfit(fontSize: 13.5, fontWeight: FontWeight.bold),
            tabs: const [
              Tab(icon: Icon(Icons.face_retouching_natural_rounded), text: 'AI Face ID Scan'),
              Tab(icon: Icon(Icons.fingerprint_rounded), text: '3D Fingerprint'),
            ],
          ),

          const SizedBox(height: 20),

          SizedBox(
            height: 210,
            child: TabBarView(
              controller: _tabController,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        color: widget.accentColor.withValues(alpha: 0.1),
                        border: Border.all(color: _isSuccess ? const Color(0xFF059669) : widget.accentColor, width: 3),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Icon(
                            _isSuccess ? Icons.verified_user_rounded : Icons.face_rounded,
                            size: 68,
                            color: _isSuccess ? const Color(0xFF059669) : widget.accentColor,
                          ),
                          if (_isScanning)
                            const CircularProgressIndicator(color: Color(0xFF059669), strokeWidth: 3),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: widget.accentColor,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _isScanning ? null : () => _startScan('face'),
                      icon: const Icon(Icons.camera_front_rounded, color: Colors.white),
                      label: Text(_isScanning ? 'Scanning...' : 'Scan Face Now', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: _isScanning ? null : () => _startScan('fingerprint'),
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: widget.accentColor.withValues(alpha: 0.1),
                          border: Border.all(color: _isSuccess ? const Color(0xFF059669) : widget.accentColor, width: 3),
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Icon(
                              _isSuccess ? Icons.check_circle_rounded : Icons.fingerprint_rounded,
                              size: 70,
                              color: _isSuccess ? const Color(0xFF059669) : widget.accentColor,
                            ),
                            if (_isScanning)
                              const CircularProgressIndicator(color: Color(0xFF059669), strokeWidth: 3),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      _isScanning ? 'Verifying Fingerprint...' : 'Tap Sensor to Scan Fingerprint',
                      style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: widget.accentColor),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),
          Text(_scanStatus, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: _isSuccess ? const Color(0xFF059669) : widget.accentColor)),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
