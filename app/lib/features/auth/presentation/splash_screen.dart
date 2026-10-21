import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/auth_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Auto navigate based on SharedPreferences Auth state
    _timer = Timer(const Duration(milliseconds: 2800), () {
      if (mounted) {
        if (AuthService.instance.isLoggedIn) {
          final role = AuthService.instance.activeRole;
          if (role == 'teacher') {
            context.go('/teacher-dashboard');
          } else if (role == 'staff') {
            context.go('/staff-dashboard');
          } else if (role == 'driver') {
            context.go('/driver-dashboard');
          } else {
            context.go('/dashboard');
          }
        } else {
          context.go('/role-selection');
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0F172A), // Subtle Slate Dark Navy
              Color(0xFF1E3A8A), // Rich Royal Blue
              Color(0xFF1D4ED8), // Vibrant Accent Blue
              Color(0xFF1E293B), // Soft Slate Dark Bottom
            ],
            stops: [0.0, 0.35, 0.7, 1.0],
          ),
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Top Ambient Radial Glow Effect
            Positioned(
              top: -50,
              child: Container(
                width: 320,
                height: 320,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFF3B82F6).withValues(alpha: 0.25),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

            // Main Centered Content Layout
            SafeArea(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 8),

                  // Top Section: Gold & Royal Shield Crest Emblem + Titles
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Gold/Blue Shield Crest Badge (Professional Gold Trimmed Badge)
                      Container(
                        width: 92,
                        height: 98,
                        decoration: BoxDecoration(
                          color: const Color(0xFF1D4ED8),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: const Color(0xFFF59E0B),
                            width: 3.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFF59E0B).withValues(alpha: 0.5),
                              blurRadius: 35,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: Center(
                          child: Container(
                            width: 60,
                            height: 64,
                            decoration: BoxDecoration(
                              color: const Color(0xFF2563EB),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.white.withValues(alpha: 0.35)),
                            ),
                            child: const Icon(
                              Icons.verified_user_rounded,
                              color: Colors.white,
                              size: 36,
                            ),
                          ),
                        ),
                      )
                          .animate()
                          .scale(
                            duration: 900.ms,
                            curve: Curves.elasticOut,
                          )
                          .fadeIn(),

                      const SizedBox(height: 18),

                      Text(
                        'EduPulse',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.outfit(
                          fontSize: 38,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 2,
                          shadows: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.3),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                      )
                          .animate()
                          .fadeIn(duration: 500.ms, delay: 200.ms)
                          .slideY(begin: 0.3, curve: Curves.easeOutBack),

                      Text(
                        'SMART CAMPUS ERP',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFF93C5FD),
                          letterSpacing: 4,
                        ),
                      )
                          .animate()
                          .fadeIn(duration: 500.ms, delay: 350.ms)
                          .slideY(begin: 0.3, curve: Curves.easeOutBack),

                      const SizedBox(height: 10),

                      Text(
                        'Next-Gen Mobile Workspace\nfor Schools & Institutions',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w500,
                          color: Colors.white.withValues(alpha: 0.9),
                          height: 1.3,
                        ),
                      )
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 500.ms)
                          .scale(begin: const Offset(0.9, 0.9)),

                      const SizedBox(height: 14),

                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.25),
                          ),
                        ),
                        child: Text(
                          '• Students • Teachers • Employees •',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFFF59E0B),
                          ),
                        ),
                      )
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 600.ms)
                          .scale(begin: const Offset(0.95, 0.95)),
                    ],
                  ),

                  // Center Transparent 3D Student Mascot Character Image (Centered & Transparent Cutout)
                  Center(
                    child: Container(
                      constraints: const BoxConstraints(maxHeight: 280, maxWidth: 280),
                      child: Image.asset(
                        'assets/images/splash_student_character.png',
                        fit: BoxFit.contain,
                        alignment: Alignment.center,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.person_pin_rounded,
                            size: 150,
                            color: Colors.white,
                          );
                        },
                      ),
                    )
                        .animate()
                        .slideY(begin: 0.25, duration: 800.ms, curve: Curves.easeOutBack)
                        .fadeIn(duration: 600.ms),
                  ),

                  // Bottom Progress Bar Indicator (Shimmering Professional Progress)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 140,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: const LinearProgressIndicator(
                            minHeight: 4.5,
                            backgroundColor: Colors.white24,
                            color: Colors.white,
                          ),
                        ),
                      )
                          .animate()
                          .fadeIn(delay: 600.ms)
                          .shimmer(duration: 1200.ms, color: const Color(0xFF93C5FD)),
                      const SizedBox(height: 8),
                      const Text(
                        'Loading Portal...',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white54,
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                        ),
                      ).animate().fadeIn(delay: 700.ms),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
