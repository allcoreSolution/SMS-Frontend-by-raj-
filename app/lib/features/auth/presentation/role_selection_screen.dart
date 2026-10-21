import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/theme_provider.dart';

class RoleSelectionScreen extends StatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  State<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends State<RoleSelectionScreen> {
  DateTime? _lastBackPressTime;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final size = MediaQuery.of(context).size;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        final now = DateTime.now();
        if (_lastBackPressTime == null ||
            now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
          _lastBackPressTime = now;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Press back again to exit Campus App'),
              duration: Duration(seconds: 2),
              behavior: SnackBarBehavior.floating,
              backgroundColor: Color(0xFF2563EB),
            ),
          );
        } else {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF6F8FB),
        body: Stack(
          children: [
            // Top Blue Curved Background
            Container(
              height: size.height * 0.45,
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isDark
                      ? [const Color(0xFF0D2D5E), const Color(0xFF133F7F)]
                      : [const Color(0xFF15549A), const Color(0xFF1A67B5)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(45),
                ),
              ),
            ),

            SafeArea(
              child: Column(
                children: [
                  // Custom AppBar
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Left: Theme Toggle (Replacing 3-line hamburger)
                        IconButton(
                          icon: Icon(
                            isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                            color: Colors.white,
                            size: 26,
                          ),
                          onPressed: () =>
                              ThemeProvider.instance.toggleTheme(!isDark),
                        ),
                        
                        // Center Title
                        Text(
                          'Select Portal',
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        
                        // Right: Help Icon
                        IconButton(
                          icon: const Icon(
                            Icons.help_outline_rounded,
                            color: Colors.white,
                            size: 26,
                          ),
                          onPressed: () {
                            // Help action
                          },
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: size.height * 0.02),

                  // Center Logo Profile
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.white.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: const Icon(
                      Icons.school_rounded,
                      color: Colors.white,
                      size: 40,
                    ),
                  ).animate().scale(duration: 400.ms, curve: Curves.easeOutBack),

                  const SizedBox(height: 18),

                  Text(
                    'Campus ERP',
                    style: GoogleFonts.outfit(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ).animate().fadeIn(duration: 350.ms, delay: 100.ms),

                  const SizedBox(height: 6),

                  Text(
                    'Empowering Education Digitally',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      color: Colors.white.withOpacity(0.7),
                    ),
                  ).animate().fadeIn(duration: 350.ms, delay: 150.ms),

                  const Spacer(),

                  // Overlapping 2x2 Grid container
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 0.85,
                      children: [
                        _buildGridCard(
                          context,
                          title: 'Student',
                          subtitle: 'Portal Access',
                          icon: Icons.menu_book_rounded,
                          iconColor: const Color(0xFF2563EB),
                          iconBgColor: isDark ? const Color(0xFF2563EB).withOpacity(0.2) : const Color(0xFFE6EFFF),
                          onTap: () => context.push('/login'),
                          isDark: isDark,
                        ).animate().fadeIn(duration: 400.ms, delay: 200.ms).slideY(begin: 0.1),

                        _buildGridCard(
                          context,
                          title: 'Teacher',
                          subtitle: 'Portal Access',
                          icon: Icons.psychology_rounded,
                          iconColor: const Color(0xFF9333EA),
                          iconBgColor: isDark ? const Color(0xFF9333EA).withOpacity(0.2) : const Color(0xFFF3E8FF),
                          onTap: () => context.push('/teacher-login'),
                          isDark: isDark,
                        ).animate().fadeIn(duration: 400.ms, delay: 300.ms).slideY(begin: 0.1),

                        _buildGridCard(
                          context,
                          title: 'Employee',
                          subtitle: 'Portal Access',
                          icon: Icons.badge_rounded,
                          iconColor: const Color(0xFF059669),
                          iconBgColor: isDark ? const Color(0xFF059669).withOpacity(0.2) : const Color(0xFFE0F6EC),
                          onTap: () => context.push('/staff-login'),
                          isDark: isDark,
                        ).animate().fadeIn(duration: 400.ms, delay: 400.ms).slideY(begin: 0.1),

                        _buildGridCard(
                          context,
                          title: 'Driver',
                          subtitle: 'Portal Access',
                          icon: Icons.directions_bus_rounded,
                          iconColor: const Color(0xFFD97706),
                          iconBgColor: isDark ? const Color(0xFFD97706).withOpacity(0.2) : const Color(0xFFFFF3CD),
                          onTap: () => context.push('/driver-login'),
                          isDark: isDark,
                        ).animate().fadeIn(duration: 400.ms, delay: 500.ms).slideY(begin: 0.1),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Developer Signature
                  GestureDetector(
                    onTap: () async {
                      final Uri url = Uri.parse('https://www.allcoresolution.com');
                      if (await canLaunchUrl(url)) {
                        await launchUrl(url, mode: LaunchMode.externalApplication);
                      }
                    },
                    child: Column(
                      children: [
                        Text(
                          'Developed By RAJ',
                          style: GoogleFonts.inter(
                            fontSize: 12.5,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.link_rounded,
                              size: 14,
                              color: Color(0xFF2563EB),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '@ All Core Solution',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF2563EB),
                                decoration: TextDecoration.underline,
                                decorationColor: const Color(0xFF2563EB),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ).animate().fadeIn(duration: 450.ms, delay: 600.ms),

                  SizedBox(height: size.height * 0.04),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.05) : iconColor.withOpacity(0.15),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withOpacity(0.4) : iconColor.withOpacity(0.08),
            blurRadius: 24,
            offset: const Offset(0, 10),
            spreadRadius: -2,
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(26),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(26),
          highlightColor: iconColor.withOpacity(0.05),
          splashColor: iconColor.withOpacity(0.1),
          child: Stack(
            children: [
              // Subtle arrow in top right
              Positioned(
                top: 14,
                right: 14,
                child: Icon(
                  Icons.arrow_outward_rounded,
                  size: 20,
                  color: isDark ? const Color(0xFF64748B) : iconColor.withOpacity(0.4),
                ),
              ),
              
              // Main Content
              Align(
                alignment: Alignment.center,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Glowing Circular Icon Background
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? iconColor.withOpacity(0.15) : iconBgColor,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: iconColor.withOpacity(isDark ? 0.3 : 0.2),
                            blurRadius: 16,
                            offset: const Offset(0, 4),
                          ),
                        ],
                        border: Border.all(
                          color: iconColor.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Icon(
                        icon,
                        size: 30,
                        color: iconColor,
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Bold Title text
                    Text(
                      title,
                      style: GoogleFonts.outfit(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                      ),
                    ),
                    
                    const SizedBox(height: 4),
                    
                    // Subtitle
                    Text(
                      subtitle,
                      style: GoogleFonts.inter(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w500,
                        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
