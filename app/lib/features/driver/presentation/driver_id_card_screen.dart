import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/auth_service.dart';

class DriverIdCardScreen extends StatefulWidget {
  const DriverIdCardScreen({super.key});

  @override
  State<DriverIdCardScreen> createState() => _DriverIdCardScreenState();
}

class _DriverIdCardScreenState extends State<DriverIdCardScreen> {
  bool _showBackSide = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final auth = AuthService.instance;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          context.go('/driver-dashboard');
        }
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        elevation: 0,
        title: Text(
          'Driver Identity Card',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.flip_camera_android_rounded, color: Color(0xFFEA580C)),
            tooltip: 'Flip Card Side',
            onPressed: () => setState(() => _showBackSide = !_showBackSide),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            children: [
              // Card Side Selector
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ChoiceChip(
                    label: const Text('FRONT BADGE'),
                    selected: !_showBackSide,
                    selectedColor: const Color(0xFFEA580C),
                    labelStyle: GoogleFonts.outfit(
                      fontWeight: FontWeight.bold,
                      color: !_showBackSide ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF475569)),
                    ),
                    onSelected: (val) {
                      if (val) setState(() => _showBackSide = false);
                    },
                  ),
                  const SizedBox(width: 10),
                  ChoiceChip(
                    label: const Text('BACK BADGE'),
                    selected: _showBackSide,
                    selectedColor: const Color(0xFFEA580C),
                    labelStyle: GoogleFonts.outfit(
                      fontWeight: FontWeight.bold,
                      color: _showBackSide ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF475569)),
                    ),
                    onSelected: (val) {
                      if (val) setState(() => _showBackSide = true);
                    },
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Digital ID Badge Card
              GestureDetector(
                onTap: () => setState(() => _showBackSide = !_showBackSide),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: double.infinity,
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: _showBackSide
                          ? [const Color(0xFF1E293B), const Color(0xFF0F172A)]
                          : [const Color(0xFF7C2D12), const Color(0xFFEA580C)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFEA580C).withValues(alpha: 0.4),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: !_showBackSide ? _buildFrontBadge(auth) : _buildBackBadge(auth),
                ),
              ),

              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Saving Digital Driver Badge to Device...'),
                        backgroundColor: Color(0xFFEA580C),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEA580C),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  icon: const Icon(Icons.download_rounded),
                  label: Text(
                    'Save Digital Driver Badge',
                    style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
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

  Widget _buildFrontBadge(AuthService auth) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Icon(Icons.school_rounded, color: Colors.white, size: 28),
                const SizedBox(width: 8),
                Text(
                  'CAMPUS TRANSPORT ERP',
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 0.8,
                  ),
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'OFFICIAL DRIVER',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        CircleAvatar(
          radius: 44,
          backgroundColor: Colors.white,
          child: CircleAvatar(
            radius: 41,
            backgroundColor: const Color(0xFFEA580C).withValues(alpha: 0.15),
            child: const Icon(Icons.person_rounded, size: 48, color: Color(0xFFEA580C)),
          ),
        ),
        const SizedBox(height: 14),

        Text(
          auth.driverName,
          style: GoogleFonts.outfit(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
        Text(
          'Emp ID: ${auth.driverEmpId}',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: Colors.white.withValues(alpha: 0.9),
          ),
        ),
        const SizedBox(height: 18),

        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              _cardRow('Bus Vehicle No.', auth.driverBusNo),
              const Divider(color: Colors.white24, height: 16),
              _cardRow('Route Assignment', auth.driverRouteNo),
              const Divider(color: Colors.white24, height: 16),
              _cardRow('Driving License', auth.driverLicenseNo),
              const Divider(color: Colors.white24, height: 16),
              _cardRow('Mobile Contact', auth.driverMobile),
            ],
          ),
        ),

        const SizedBox(height: 20),

        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              const Icon(Icons.qr_code_2_rounded, size: 80, color: Color(0xFF0F172A)),
              const SizedBox(height: 4),
              Text(
                'Scan to Verify Transport Badge (Tap to flip card)',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBackBadge(AuthService auth) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'TERMS & VERIFICATION',
              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const Icon(Icons.verified_user_rounded, color: Color(0xFF10B981), size: 24),
          ],
        ),
        const SizedBox(height: 16),

        _cardRow('Issued By', 'State School Transport Board'),
        const Divider(color: Colors.white24, height: 16),
        _cardRow('Blood Group', 'O+ Positive'),
        const Divider(color: Colors.white24, height: 16),
        _cardRow('Emergency SOS', '+91 98765 00000'),
        const Divider(color: Colors.white24, height: 16),
        _cardRow('Validity Period', '01 Aug 2024 - 31 Jul 2027'),
        const SizedBox(height: 20),

        Text(
          'Notice: This badge is strictly non-transferable and must be displayed while operating the campus bus vehicle at all times.',
          style: GoogleFonts.inter(fontSize: 11, color: Colors.white70, height: 1.3),
        ),
        const SizedBox(height: 24),

        Center(
          child: Text(
            'Authorized Signature • Transport In-Charge',
            style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFFEA580C)),
          ),
        ),
      ],
    );
  }

  Widget _cardRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            color: Colors.white.withValues(alpha: 0.8),
          ),
        ),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 12.5,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }
}
