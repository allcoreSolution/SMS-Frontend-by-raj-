import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherIdCardScreen extends StatelessWidget {
  const TeacherIdCardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFFFFDF5);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: bg,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDark ? Colors.white : const Color(0xFF0F172A), size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/teacher-dashboard');
            }
          },
        ),
        title: Text('ID Card', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(26),
                    border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFCBD5E1), width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.08),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Top Royal Purple Crest Header
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFF1E1B4B), Color(0xFF2E1065), Color(0xFF4C1D95)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.shield_rounded, color: Color(0xFFF59E0B), size: 30),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('GREENFIELD', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.w900, letterSpacing: 0.5, color: Colors.white)),
                                Text('INTERNATIONAL SCHOOL', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.white70)),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // Realistic Teacher Avatar Photo Badge Centered
                      Transform.translate(
                        offset: const Offset(0, -32),
                        child: Container(
                          width: 92, height: 92,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const Color(0xFFFEF3C7),
                            border: Border.all(color: Colors.white, width: 3.5),
                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.18), blurRadius: 10)],
                          ),
                          child: ClipOval(
                            child: Image.asset(
                              'assets/images/teacher_avatar.png',
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => const CircleAvatar(
                                backgroundColor: Color(0xFFFEF3C7),
                                child: Icon(Icons.person_rounded, size: 62, color: Color(0xFF312E81)),
                              ),
                            ),
                          ),
                        ),
                      ),

                      // Details Section
                      Transform.translate(
                        offset: const Offset(0, -20),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          child: Column(
                            children: [
                              Text('Mr. Rajesh Sharma', style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF1E1B4B))),
                              const SizedBox(height: 2),
                              Text('Mathematics Teacher', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : const Color(0xFF475569))),
                              const SizedBox(height: 2),
                              Text('EMP001', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF1E1B4B))),

                              const SizedBox(height: 24),

                              // Neatly Aligned Detail Rows
                              _buildDetailRow('Department', ':  Academics', isDark),
                              const SizedBox(height: 8),
                              _buildDetailRow('Blood Group', ':  B-', isDark),
                              const SizedBox(height: 8),
                              _buildDetailRow('Phone', ':  9876543210', isDark),

                              const SizedBox(height: 24),

                              // Barcode Graphic
                              _buildBarcodeGraphic(isDark),

                              const SizedBox(height: 14),

                              // Signature Line
                              Align(
                                alignment: Alignment.centerRight,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Text('Rajesh', style: GoogleFonts.caveat(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF0F172A))),
                                    Text('Principal', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Download Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Downloading Teacher ID Card PDF... 🪪'),
                        backgroundColor: AppTheme.teacherPurple,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.teacherPurple,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 3,
                  ),
                  child: Text('Download ID Card', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildDetailRow(String label, String value, bool isDark) {
    return Row(
      children: [
        SizedBox(
          width: 110,
          child: Text(label, style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.w600, color: isDark ? Colors.white60 : const Color(0xFF64748B))),
        ),
        Text(value, style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.w800, color: isDark ? Colors.white : const Color(0xFF0F172A))),
      ],
    );
  }

  Widget _buildBarcodeGraphic(bool isDark) {
    return Container(
      height: 50,
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withValues(alpha: 0.05) : const Color(0xFFFAFAFA),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(46, (i) {
          final width = (i % 5 == 0) ? 3.0 : ((i % 3 == 0) ? 2.0 : 1.0);
          return Container(
            width: width,
            margin: const EdgeInsets.symmetric(horizontal: 1.2),
            color: isDark ? Colors.white70 : const Color(0xFF0F172A),
          );
        }),
      ),
    );
  }
}
