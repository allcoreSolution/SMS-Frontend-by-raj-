import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class DriverAttendanceScreen extends StatefulWidget {
  const DriverAttendanceScreen({super.key});

  @override
  State<DriverAttendanceScreen> createState() => _DriverAttendanceScreenState();
}

class _DriverAttendanceScreenState extends State<DriverAttendanceScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _statusState = 0; // 0: Not Checked In, 1: Checked In, 2: Checked Out
  String _checkInTime = '--:--';
  String _checkOutTime = '--:--';
  String _selectedMonth = 'August 2026';

  final List<Map<String, String>> _attendanceLogs = [
    {'date': '09 Aug 2026', 'day': 'Sunday', 'in': '06:42 AM', 'out': 'Active Duty', 'hours': 'On Duty', 'status': 'Present', 'device': 'GPS-BUS-12'},
    {'date': '08 Aug 2026', 'day': 'Saturday', 'in': '06:40 AM', 'out': '05:20 PM', 'hours': '10h 40m', 'status': 'Present', 'device': 'RFID-BUS-GATE-01'},
    {'date': '07 Aug 2026', 'day': 'Friday', 'in': '06:45 AM', 'out': '05:15 PM', 'hours': '10h 30m', 'status': 'Present', 'device': 'AI-FACE-CAM-02'},
    {'date': '06 Aug 2026', 'day': 'Thursday', 'in': '--:--', 'out': '--:--', 'hours': '0h 00m', 'status': 'Leave', 'device': 'FLEET-PORTAL'},
    {'date': '05 Aug 2026', 'day': 'Wednesday', 'in': '06:41 AM', 'out': '05:18 PM', 'hours': '10h 37m', 'status': 'Present', 'device': 'RFID-BUS-GATE-01'},
    {'date': '04 Aug 2026', 'day': 'Tuesday', 'in': '07:10 AM', 'out': '05:30 PM', 'hours': '10h 20m', 'status': 'Late', 'device': 'AI-FACE-CAM-01'},
    {'date': '03 Aug 2026', 'day': 'Monday', 'in': '06:40 AM', 'out': '01:30 PM', 'hours': '6h 50m', 'status': 'Half Day', 'device': 'RFID-BUS-GATE-02'},
  ];

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

  String _getTime() {
    final now = TimeOfDay.now();
    final h = now.hourOfPeriod == 0 ? 12 : now.hourOfPeriod;
    final m = now.minute.toString().padLeft(2, '0');
    final period = now.period == DayPeriod.am ? 'AM' : 'PM';
    return '$h:$m $period';
  }

  void _openBiometricScanner(String modeAction) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _DriverBiometricSheet(
        actionLabel: modeAction,
        onVerified: () {
          Navigator.pop(ctx);
          final t = _getTime();
          setState(() {
            if (_statusState == 0) {
              _statusState = 1;
              _checkInTime = t;
              _attendanceLogs[0]['in'] = t;
              _attendanceLogs[0]['status'] = 'Present';
            } else if (_statusState == 1) {
              _statusState = 2;
              _checkOutTime = t;
              _attendanceLogs[0]['out'] = t;
              _attendanceLogs[0]['status'] = 'Shift Completed';
            }
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('$modeAction Verified via AI Driver Biometric Scanner! ✅'),
              backgroundColor: const Color(0xFFEA580C),
              behavior: SnackBarBehavior.floating,
            ),
          );
        },
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
        if (!didPop) context.go('/driver-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDark ? Colors.white : const Color(0xFF0F172A), size: 20),
          onPressed: () => context.go('/driver-dashboard'),
        ),
        title: Text(
          'Driver Biometric Attendance',
          style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFFEA580C),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFFEA580C),
          indicatorWeight: 3,
          labelStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'Biometric Attendance'),
            Tab(text: 'Shift History Log'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMarkAttendanceTab(isDark),
          _buildHistoryTab(isDark),
        ],
      ),
    ),
    );
  }

  Widget _buildMarkAttendanceTab(bool isDark) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(18),
      child: Column(
        children: [
          // GPS Geo-Fence & Location Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04), blurRadius: 8)],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: const Color(0xFFEA580C).withValues(alpha: 0.12), shape: BoxShape.circle),
                  child: const Icon(Icons.location_on_rounded, color: Color(0xFFEA580C), size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Greenwood Bus Depot Zone A', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                      Text('GPS Lat: 26.9124° N, Long: 75.7873° E (Geo-fence OK)', style: GoogleFonts.inter(fontSize: 11.5, color: const Color(0xFFEA580C), fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 350.ms),

          const SizedBox(height: 16),

          // Glassmorphic Biometric Hero Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark
                    ? [const Color(0xFF7C2D12), const Color(0xFFC2410C), const Color(0xFFEA580C)]
                    : [const Color(0xFFEA580C), const Color(0xFFF97316), const Color(0xFFFB923C)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [BoxShadow(color: const Color(0xFFEA580C).withValues(alpha: 0.35), blurRadius: 14, offset: const Offset(0, 6))],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('CHECK IN TIMESTAMP', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text(_checkInTime, style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white)),
                      ],
                    ),
                    Container(width: 1, height: 42, color: Colors.white24),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('CHECK OUT TIMESTAMP', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text(_checkOutTime, style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white)),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // Sensor Icon Hologram Ring
                GestureDetector(
                  onTap: _statusState < 2 ? () => _openBiometricScanner(_statusState == 0 ? 'Check In' : 'Check Out') : null,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withValues(alpha: 0.18),
                      border: Border.all(color: Colors.white, width: 3),
                    ),
                    child: Column(
                      children: [
                        const Icon(Icons.face_retouching_natural_rounded, color: Colors.white, size: 54),
                        const SizedBox(height: 6),
                        Text(
                          _statusState == 0 ? 'TOUCH TO SCAN' : (_statusState == 1 ? 'CHECKED IN ✅' : 'CHECKED OUT 🏁'),
                          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Punch In vs Punch Out Buttons
                if (_statusState == 0) ...[
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFFEA580C),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 4,
                      ),
                      onPressed: () => _openBiometricScanner('Check In'),
                      icon: const Icon(Icons.camera_front_rounded, color: Color(0xFFEA580C)),
                      label: Text('SCAN FACE / FINGERPRINT (CHECK IN)', style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ] else if (_statusState == 1) ...[
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 4,
                      ),
                      onPressed: () => _openBiometricScanner('Check Out'),
                      icon: const Icon(Icons.logout_rounded, color: Colors.white),
                      label: Text('SCAN FACE / FINGERPRINT (CHECK OUT)', style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ] else ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(14)),
                    child: Center(
                      child: Text('Today\'s Bus Shift Completed Safely ✅', style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                ],
              ],
            ),
          ).animate().fadeIn(duration: 400.ms, delay: 100.ms),

          const SizedBox(height: 20),

          // Work Shift Analytics Grid (4 Stat Cards)
          Row(
            children: [
              _statCard('10h 40m', 'Shift Duration', Icons.timer_rounded, const Color(0xFF2563EB), isDark),
              const SizedBox(width: 10),
              _statCard('24 / 26d', 'Working Days', Icons.calendar_month_rounded, const Color(0xFF10B981), isDark),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _statCard('1 Late', 'Late Arrivals', Icons.warning_amber_rounded, const Color(0xFFD97706), isDark),
              const SizedBox(width: 10),
              _statCard('98.4%', 'On-Time Rate', Icons.verified_rounded, const Color(0xFFEA580C), isDark),
            ],
          ),

          const SizedBox(height: 22),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: TextButton.icon(
              onPressed: () => _tabController.animateTo(1),
              icon: const Icon(Icons.history_rounded, color: Color(0xFFEA580C)),
              label: Text('View Full Attendance Logs →', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFFEA580C))),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statCard(String val, String label, IconData icon, Color col, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: col.withValues(alpha: 0.12), shape: BoxShape.circle),
              child: Icon(icon, color: col, size: 20),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(val, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  Text(label, style: GoogleFonts.inter(fontSize: 11, color: Colors.grey), overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryTab(bool isDark) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.calendar_month_rounded, size: 16, color: Color(0xFFEA580C)),
                    const SizedBox(width: 8),
                    DropdownButton<String>(
                      value: _selectedMonth,
                      underline: const SizedBox(),
                      isDense: true,
                      style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                      items: ['August 2026', 'July 2026', 'June 2026'].map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                      onChanged: (v) => setState(() => _selectedMonth = v!),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(color: const Color(0xFFEA580C).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(10)),
                child: Text('98.4% Attendance Rate', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: const Color(0xFFEA580C))),
              ),
            ],
          ),

          const SizedBox(height: 16),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _attendanceLogs.length,
            separatorBuilder: (_, _) => const SizedBox(height: 10),
            itemBuilder: (ctx, i) {
              final log = _attendanceLogs[i];
              final status = log['status']!;
              Color badgeColor;
              Color badgeBg;

              if (status == 'Present') {
                badgeColor = const Color(0xFF10B981);
                badgeBg = const Color(0xFFD1FAE5);
              } else if (status == 'Late') {
                badgeColor = const Color(0xFFD97706);
                badgeBg = const Color(0xFFFEF3C7);
              } else if (status == 'Leave') {
                badgeColor = const Color(0xFF2563EB);
                badgeBg = const Color(0xFFDBEAFE);
              } else if (status == 'Half Day') {
                badgeColor = const Color(0xFF8B5CF6);
                badgeBg = const Color(0xFFF3E8FF);
              } else {
                badgeColor = Colors.red;
                badgeBg = const Color(0xFFFEE2E2);
              }

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
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(log['date']!, style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('In: ${log['in']} • Out: ${log['out']}', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                        Text('Device: ${log['device']}', style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFFEA580C), fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: badgeBg, borderRadius: BorderRadius.circular(8)),
                          child: Text(status, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: badgeColor)),
                        ),
                        const SizedBox(height: 4),
                        Text('Hours: ${log['hours']}', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
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
}

class _DriverBiometricSheet extends StatefulWidget {
  final String actionLabel;
  final VoidCallback onVerified;

  const _DriverBiometricSheet({required this.actionLabel, required this.onVerified});

  @override
  State<_DriverBiometricSheet> createState() => _DriverBiometricSheetState();
}

class _DriverBiometricSheetState extends State<_DriverBiometricSheet> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isScanning = false;
  bool _isSuccess = false;

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

  void _startScan() async {
    setState(() => _isScanning = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      setState(() {
        _isScanning = false;
        _isSuccess = true;
      });
      await Future.delayed(const Duration(milliseconds: 600));
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
          Text('${widget.actionLabel} - Driver Biometric Scan', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
          Text('GPS Location: Greenwood Bus Depot (Lat 26.9124, Long 75.7873)', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),

          const SizedBox(height: 16),

          TabBar(
            controller: _tabController,
            labelColor: const Color(0xFFEA580C),
            unselectedLabelColor: Colors.grey,
            indicatorColor: const Color(0xFFEA580C),
            tabs: const [
              Tab(icon: Icon(Icons.face_retouching_natural_rounded), text: 'AI Face ID'),
              Tab(icon: Icon(Icons.fingerprint_rounded), text: 'Fingerprint Sensor'),
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
                        color: const Color(0xFFEA580C).withValues(alpha: 0.1),
                        border: Border.all(color: const Color(0xFFEA580C), width: 3),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Icon(_isSuccess ? Icons.verified_user_rounded : Icons.face_rounded, size: 68, color: const Color(0xFFEA580C)),
                          if (_isScanning) const CircularProgressIndicator(color: Color(0xFFEA580C), strokeWidth: 3),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEA580C)),
                      onPressed: _isScanning ? null : _startScan,
                      child: Text(_isScanning ? 'Scanning...' : 'Scan AI Face Now', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: _isScanning ? null : _startScan,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFFEA580C).withValues(alpha: 0.1),
                          border: Border.all(color: const Color(0xFFEA580C), width: 3),
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Icon(_isSuccess ? Icons.check_circle_rounded : Icons.fingerprint_rounded, size: 70, color: const Color(0xFFEA580C)),
                            if (_isScanning) const CircularProgressIndicator(color: Color(0xFFEA580C), strokeWidth: 3),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    Text(_isScanning ? 'Verifying...' : 'Touch Sensor to Scan', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: const Color(0xFFEA580C))),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
