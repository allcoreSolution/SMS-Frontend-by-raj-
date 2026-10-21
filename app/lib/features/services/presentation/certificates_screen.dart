import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/auth_service.dart';

class CertificatesScreen extends StatelessWidget {
  const CertificatesScreen({super.key});

  static const List<Map<String, dynamic>> _certs = [
    {
      'title': 'Bonafide Certificate',
      'desc': 'For visa/scholarship use. Issued by Principal.',
      'icon': Icons.verified_rounded,
      'color': Color(0xFF2563EB),
      'status': 'Available',
    },
    {
      'title': 'Character Certificate',
      'desc': 'Certifies good conduct in school premises.',
      'icon': Icons.star_half_rounded,
      'color': Color(0xFF10B981),
      'status': 'Available',
    },
    {
      'title': 'Study Certificate',
      'desc': 'Proof of enrollment in current academic year.',
      'icon': Icons.menu_book_rounded,
      'color': Color(0xFF6366F1),
      'status': 'Available',
    },
    {
      'title': 'Transfer Certificate (TC)',
      'desc': 'Required for admission to another institution.',
      'icon': Icons.swap_horiz_rounded,
      'color': Color(0xFFF59E0B),
      'status': 'Request Required',
    },
    {
      'title': 'Fee Receipt',
      'desc': 'Official payment acknowledgment for 2024-25.',
      'icon': Icons.receipt_long_rounded,
      'color': Color(0xFFEC4899),
      'status': 'Available',
    },
    {
      'title': 'Admit Card',
      'desc': 'Final Examination 2024-25 Hall Ticket.',
      'icon': Icons.badge_rounded,
      'color': Color(0xFFEF4444),
      'status': 'Available',
    },
    {
      'title': 'Report Card',
      'desc': 'Half-yearly & Final Term Result Card.',
      'icon': Icons.assignment_turned_in_rounded,
      'color': Color(0xFF0EA5E9),
      'status': 'Available',
    },
  ];

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
        title: Text(
          'Certificates & Documents',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        elevation: 0,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                physics: const BouncingScrollPhysics(),
                itemCount: _certs.length,
                itemBuilder: (context, index) {
                  final cert = _certs[index];
                  final color = cert['color'] as Color;
                  final isRequest = cert['status'] == 'Request Required';

                  return GestureDetector(
                    onTap: () => _showCertificatePreviewModal(context, cert),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.03),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(cert['icon'] as IconData, color: color, size: 24),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  cert['title'] as String,
                                  style: GoogleFonts.outfit(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  cert['desc'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: isRequest
                                        ? const Color(0xFFF59E0B).withValues(alpha: 0.15)
                                        : const Color(0xFF10B981).withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    cert['status'] as String,
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: isRequest ? const Color(0xFFF59E0B) : const Color(0xFF10B981),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: Icon(
                              isRequest ? Icons.send_rounded : Icons.download_rounded,
                              color: color,
                              size: 22,
                            ),
                            onPressed: () => _showCertificatePreviewModal(context, cert),
                          ),
                        ],
                      ),
                    ),
                  ).animate().fadeIn(duration: 350.ms, delay: (index * 40).ms);
                },
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  void _showCertificatePreviewModal(BuildContext context, Map<String, dynamic> cert) {
    final auth = AuthService.instance;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Document Preview', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold)),
                  IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const Divider(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFFFFBEB),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFF59E0B).withValues(alpha: 0.3)),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.school_rounded, color: Color(0xFF2563EB), size: 36),
                    const SizedBox(height: 6),
                    Text(
                      'GREENWOOD PUBLIC SCHOOL',
                      style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 0.8),
                    ),
                    Text('Affiliated to CBSE Board • Estd. 1998', style: GoogleFonts.inter(fontSize: 10.5, color: Colors.grey[600])),
                    const Divider(height: 16),
                    Text(
                      cert['title'] as String,
                      style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF2563EB)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'This is to certify that Student ${auth.studentName} (Admission No: ${auth.admissionNumber}) enrolled in ${auth.className} has completed all academic requirements.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(fontSize: 12, height: 1.3),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Date: 20 May 2024', style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold)),
                        Row(
                          children: [
                            const Icon(Icons.verified_rounded, color: Color(0xFF10B981), size: 16),
                            const SizedBox(width: 4),
                            Text('Official Seal', style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: const Color(0xFF10B981))),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Downloaded ${cert['title']} PDF Certificate! ✅'),
                        backgroundColor: const Color(0xFF10B981),
                      ),
                    );
                  },
                  icon: const Icon(Icons.download_rounded, size: 18),
                  label: Text('Download ${cert['title']} PDF', style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
