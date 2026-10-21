import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherDocumentViewerScreen extends StatelessWidget {
  final String docName;
  final String docType;
  final String docDate;
  final String docSize;

  const TeacherDocumentViewerScreen({
    super.key,
    this.docName = 'Offer Letter',
    this.docType = 'Official Letter',
    this.docDate = '01 Aug 2022',
    this.docSize = '2.4 MB',
  });

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
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/teacher-documents');
            }
          },
        ),
        title: Text(docName, style: GoogleFonts.outfit(fontSize: 19, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded, color: AppTheme.teacherPurple, size: 20),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Sharing $docName PDF... 📲'),
                  backgroundColor: AppTheme.teacherPurple,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(20),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05), blurRadius: 10, offset: const Offset(0, 4))],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // School Header Crest
                      Center(
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.teacherPurple.withValues(alpha: 0.12),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.shield_rounded, size: 40, color: AppTheme.teacherPurple),
                            ),
                            const SizedBox(height: 10),
                            Text('GREENFIELD', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: isDark ? Colors.white : const Color(0xFF1E1B4B))),
                            Text('INTERNATIONAL SCHOOL', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: const Color(0xFF4338CA))),
                            Text('Campus ERP • Official Faculty Records Desk', style: GoogleFonts.inter(fontSize: 10.5, color: Colors.grey)),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),
                      const Divider(height: 1),
                      const SizedBox(height: 20),

                      // Document Reference Bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('REF NO: GIS/HR/2022/482', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                              Text('DATE: $docDate', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.verified_rounded, size: 14, color: Color(0xFF10B981)),
                                const SizedBox(width: 4),
                                Text('VERIFIED', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF10B981))),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // Main Document Title
                      Center(
                        child: Text(
                          docName.toUpperCase(),
                          style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Recipient Line
                      Text('To,', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : const Color(0xFF334155))),
                      Text('Mr. Rajesh Sharma', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                      Text('Designation: Senior Mathematics Teacher (EMP001)', style: GoogleFonts.inter(fontSize: 12.5, color: Colors.grey)),

                      const SizedBox(height: 20),

                      // Official Body Text
                      Text(
                        'Dear Mr. Rajesh Sharma,\n\nWe are pleased to present this official $docName. This document confirms your appointment and continued engagement with Greenfield International School under the Faculty of Academics.\n\nAll terms, conditions, and benefits associated with your position are fully active and recorded in the Campus ERP Portal. Please retain this document for official academic and employment verification purposes.',
                        style: GoogleFonts.inter(fontSize: 13, height: 1.5, color: isDark ? Colors.white70 : const Color(0xFF475569)),
                      ),

                      const SizedBox(height: 24),

                      // Summary Box
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                        ),
                        child: Column(
                          children: [
                            _buildInfoRow('Document Name', docName, isDark),
                            const SizedBox(height: 6),
                            _buildInfoRow('Document Type', docType, isDark),
                            const SizedBox(height: 6),
                            _buildInfoRow('File Size', docSize, isDark),
                            const SizedBox(height: 6),
                            _buildInfoRow('Security Hash', 'e8f9c10a42b78d3', isDark),
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Signatures & Stamp
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppTheme.teacherPurple, width: 1.5),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text('OFFICIAL SEAL', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text('Rajesh', style: GoogleFonts.caveat(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white70 : Colors.black87)),
                              Text('Authorized Signatory', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                              Text('Greenfield International School', style: GoogleFonts.inter(fontSize: 9.5, color: Colors.grey)),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Download Action Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Downloading $docName ($docSize)... 📄'),
                        backgroundColor: AppTheme.teacherPurple,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    );
                  },
                  icon: const Icon(Icons.download_rounded, color: Colors.white, size: 20),
                  label: Text('Download $docName ($docSize)', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.teacherPurple, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildInfoRow(String label, String value, bool isDark) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
        Text(value, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
      ],
    );
  }
}
