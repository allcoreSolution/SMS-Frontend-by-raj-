import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/auth_service.dart';

class DriverTrackingScreen extends StatefulWidget {
  const DriverTrackingScreen({super.key});

  @override
  State<DriverTrackingScreen> createState() => _DriverTrackingScreenState();
}

class _DriverTrackingScreenState extends State<DriverTrackingScreen> {
  double _currentSpeed = 38.0;
  int _completedStops = 2;

  final List<Map<String, String>> _stopsList = [
    {'name': 'Sector 15 Stop', 'time': '07:15 AM', 'info': '8 Picked Up'},
    {'name': 'Sector 18 Stop', 'time': '07:25 AM', 'info': '12 Picked Up'},
    {'name': 'Sector 22 Circle', 'time': '07:35 AM', 'info': '10 Students Waiting'},
    {'name': 'Sector 29 Metro', 'time': '07:45 AM', 'info': '8 Students Waiting'},
    {'name': 'School Main Gate', 'time': '08:00 AM', 'info': 'Destination Terminal'},
  ];

  void _sendDelayAlert() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Broadcast Bus Delay Alert',
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
        ),
        content: Text(
          'Notify parents on Route 12 that the bus is running 10-15 minutes behind schedule due to traffic?',
          style: GoogleFonts.inter(fontSize: 13.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEA580C),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Delay broadcast sent to 38 parents on Route 12'),
                  backgroundColor: Color(0xFF10B981),
                ),
              );
            },
            child: const Text('Send Broadcast'),
          ),
        ],
      ),
    );
  }

  void _advanceStop() {
    if (_completedStops < _stopsList.length) {
      setState(() {
        _completedStops++;
      });
      final stopName = _stopsList[_completedStops - 1]['name'];
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Checked-in at stop: $stopName'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final auth = AuthService.instance;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/driver-dashboard');
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        elevation: 0,
        title: Text(
          'Live Location Tracking',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_active_rounded, color: Color(0xFFEA580C)),
            tooltip: 'Send Delay Alert',
            onPressed: _sendDelayAlert,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Top Status & Live Tracking Toggle Banner ───────────────────────
            ListenableBuilder(
              listenable: auth,
              builder: (context, child) {
                final isTracking = auth.isDriverTrackingActive;
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isTracking ? const Color(0xFF22C55E) : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      width: isTracking ? 1.8 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: (isTracking ? const Color(0xFF22C55E) : const Color(0xFF64748B))
                              .withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isTracking ? Icons.gps_fixed_rounded : Icons.gps_off_rounded,
                          color: isTracking ? const Color(0xFF22C55E) : const Color(0xFF64748B),
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isTracking ? 'GPS BROADCAST ACTIVE' : 'GPS BROADCAST PAUSED',
                              style: GoogleFonts.outfit(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isTracking ? const Color(0xFF22C55E) : const Color(0xFF64748B),
                              ),
                            ),
                            Text(
                              'Transmitting live bus coordinates to parents & admin',
                              style: GoogleFonts.inter(
                                fontSize: 11.5,
                                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Switch(
                        value: isTracking,
                        activeTrackColor: const Color(0xFF22C55E),
                        onChanged: (val) => auth.toggleDriverTracking(val),
                      ),
                    ],
                  ),
                );
              },
            ),

            const SizedBox(height: 16),

            // ── Map View Container ─────────────────────────────────
            Container(
              height: 240,
              width: double.infinity,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0284C7).withValues(alpha: 0.15) : const Color(0xFFE0F2FE),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFF0284C7).withValues(alpha: 0.3)),
              ),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: CustomPaint(
                      painter: MapGridPainter(isDark: isDark),
                    ),
                  ),

                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEA580C),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFEA580C).withValues(alpha: 0.4),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: Text(
                            auth.driverBusNo,
                            style: GoogleFonts.outfit(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEA580C),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 3),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFEA580C).withValues(alpha: 0.5),
                                blurRadius: 14,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.directions_bus_rounded,
                            color: Colors.white,
                            size: 26,
                          ),
                        ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                              duration: 1000.ms,
                              begin: const Offset(1, 1),
                              end: const Offset(1.1, 1.1),
                            ),
                      ],
                    ),
                  ),

                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.satellite_alt_rounded, color: Color(0xFF22C55E), size: 14),
                          const SizedBox(width: 6),
                          Text(
                            'GPS Signal: 5/5 Strong',
                            style: GoogleFonts.inter(fontSize: 11, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),

                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        'Accurate to ±2m • Sector 22 Road',
                        style: GoogleFonts.inter(fontSize: 11, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── Telemetry Controls & Speed Adjustment ──────────────────────────────────────────
            Row(
              children: [
                _buildTelemetryBox(
                  isDark: isDark,
                  label: 'CURRENT SPEED',
                  value: '${_currentSpeed.round()} km/h',
                  icon: Icons.speed_rounded,
                  color: const Color(0xFFEA580C),
                ),
                const SizedBox(width: 10),
                _buildTelemetryBox(
                  isDark: isDark,
                  label: 'NEXT STOP ETA',
                  value: '4 Mins',
                  icon: Icons.timer_outlined,
                  color: const Color(0xFF0284C7),
                ),
                const SizedBox(width: 10),
                _buildTelemetryBox(
                  isDark: isDark,
                  label: 'BUS BATTERY',
                  value: '94%',
                  icon: Icons.battery_charging_full_rounded,
                  color: const Color(0xFF10B981),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Speed Control Slider
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Simulate Bus Speed telemetry',
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF475569)),
                      ),
                      Text(
                        '${_currentSpeed.round()} km/h',
                        style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFFEA580C)),
                      ),
                    ],
                  ),
                  Slider(
                    value: _currentSpeed,
                    min: 0,
                    max: 60,
                    activeColor: const Color(0xFFEA580C),
                    onChanged: (val) => setState(() => _currentSpeed = val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            // ── Route Stops Timeline with Check-in Action ──────────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Route 12 Live Stops Timeline',
                  style: GoogleFonts.outfit(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
                if (_completedStops < _stopsList.length)
                  TextButton.icon(
                    onPressed: _advanceStop,
                    icon: const Icon(Icons.check_circle_outline_rounded, size: 16, color: Color(0xFF10B981)),
                    label: Text(
                      'Check-in Stop',
                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF10B981)),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                ),
              ),
              child: Column(
                children: List.generate(_stopsList.length, (index) {
                  final item = _stopsList[index];
                  final isDone = index < _completedStops;
                  final isCurrent = index == _completedStops;

                  String statusStr = isDone
                      ? 'Completed • ${item['info']}'
                      : (isCurrent ? 'Approaching • Next Stop' : 'Pending • ${item['info']}');

                  return _buildStopProgressRow(
                    isDark,
                    item['name']!,
                    item['time']!,
                    statusStr,
                    index + 1,
                    _completedStops,
                    isLast: index == _stopsList.length - 1,
                  );
                }),
              ),
            ),

            const SizedBox(height: 20),

            // ── Emergency Broadcast Action Button ──────────────────────────────
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: _sendDelayAlert,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                icon: const Icon(Icons.campaign_rounded),
                label: Text(
                  'Send Delay / Emergency Broadcast to Parents',
                  style: GoogleFonts.outfit(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildTelemetryBox({
    required bool isDark,
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(
              value,
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 9.5,
                fontWeight: FontWeight.w600,
                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStopProgressRow(
    bool isDark,
    String name,
    String time,
    String statusStr,
    int index,
    int activeIndex, {
    bool isLast = false,
  }) {
    final bool isDone = index <= activeIndex;
    final bool isCurrent = index == activeIndex + 1;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDone
                    ? const Color(0xFF10B981)
                    : (isCurrent ? const Color(0xFFEA580C) : (isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1))),
              ),
              child: Icon(
                isDone ? Icons.check : (isCurrent ? Icons.directions_bus_rounded : Icons.circle_outlined),
                size: 14,
                color: Colors.white,
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 32,
                color: isDone
                    ? const Color(0xFF10B981).withValues(alpha: 0.5)
                    : (isDark ? Colors.white12 : const Color(0xFFE2E8F0)),
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: GoogleFonts.inter(
                        fontSize: 13.5,
                        fontWeight: isCurrent || isDone ? FontWeight.bold : FontWeight.normal,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                      ),
                    ),
                    Text(
                      statusStr,
                      style: GoogleFonts.inter(
                        fontSize: 11.5,
                        color: isCurrent
                            ? const Color(0xFFEA580C)
                            : (isDone ? const Color(0xFF10B981) : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B))),
                      ),
                    ),
                  ],
                ),
                Text(
                  time,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: isCurrent ? const Color(0xFFEA580C) : (isDark ? Colors.white70 : const Color(0xFF475569)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class MapGridPainter extends CustomPainter {
  final bool isDark;
  MapGridPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.05)
      ..strokeWidth = 1;

    for (double i = 0; i < size.width; i += 24) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (double i = 0; i < size.height; i += 24) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
    }

    final routePaint = Paint()
      ..color = const Color(0xFFEA580C)
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(0, size.height * 0.8);
    path.quadraticBezierTo(size.width * 0.3, size.height * 0.2, size.width * 0.5, size.height * 0.5);
    path.quadraticBezierTo(size.width * 0.7, size.height * 0.8, size.width, size.height * 0.1);

    canvas.drawPath(path, routePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
