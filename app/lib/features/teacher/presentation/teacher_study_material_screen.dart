import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherStudyMaterialScreen extends StatefulWidget {
  const TeacherStudyMaterialScreen({super.key});

  @override
  State<TeacherStudyMaterialScreen> createState() => _TeacherStudyMaterialScreenState();
}

class _TeacherStudyMaterialScreenState extends State<TeacherStudyMaterialScreen> {
  String _searchQuery = '';

  final List<Map<String, dynamic>> materials = [
    {
      'title': 'Chapter 4 Quadratic Equations Notes.pdf',
      'type': 'PDF Document',
      'class': 'Class 10 - A',
      'size': '4.2 MB',
      'date': '04 May 2025',
      'icon': Icons.picture_as_pdf_rounded,
      'color': const Color(0xFFEF4444),
    },
    {
      'title': 'Physics Mechanics Presentation.ppt',
      'type': 'PPT Slide',
      'class': 'Class 11 - B',
      'size': '12.8 MB',
      'date': '02 May 2025',
      'icon': Icons.slideshow_rounded,
      'color': const Color(0xFFF59E0B),
    },
    {
      'title': 'Class 10 Mid-Term Question Bank 2025.pdf',
      'type': 'Question Bank',
      'class': 'Class 10 - A',
      'size': '2.1 MB',
      'date': '28 Apr 2025',
      'icon': Icons.quiz_rounded,
      'color': AppTheme.teacherPurple,
    },
    {
      'title': 'Mathematics Annual Syllabus 2024-25.pdf',
      'type': 'Syllabus',
      'class': 'All Classes',
      'size': '1.5 MB',
      'date': '15 Apr 2025',
      'icon': Icons.menu_book_rounded,
      'color': const Color(0xFF2563EB),
    },
    {
      'title': 'Calculus Video Lecture Part 1.mp4',
      'type': 'Video Lecture',
      'class': 'Class 12 - A',
      'size': '85.4 MB',
      'date': '10 Apr 2025',
      'icon': Icons.video_library_rounded,
      'color': const Color(0xFF8B5CF6),
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final filtered = _searchQuery.isEmpty
        ? materials
        : materials
            .where((m) => (m['title'] as String).toLowerCase().contains(_searchQuery.toLowerCase()) ||
                (m['type'] as String).toLowerCase().contains(_searchQuery.toLowerCase()))
            .toList();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Study Material Upload Dialog Opened! 📁'),
              backgroundColor: AppTheme.teacherPurple,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          );
        },
        backgroundColor: AppTheme.teacherPurple,
        elevation: 6,
        icon: const Icon(Icons.upload_file_rounded, color: Colors.white),
        label: Text('Upload Material', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
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
                        Text('Study Material',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Digital Resource Hub',
                            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFDDD6FE)),
                    ),
                    child: Text('${materials.length} Files',
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.teacherPurple)),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING HERO CARD ════════════════
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 10),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF3B0764), Color(0xFF4C1D95), Color(0xFF7C3AED)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.38),
                      blurRadius: 14, offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50, height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.folder_zip_rounded, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Resource Repository',
                              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text('Share notes, lectures & question banks with students',
                              style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ SEARCH BAR ════════════════
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Container(
                height: 42,
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6)],
                ),
                child: TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                  decoration: InputDecoration(
                    hintText: 'Search study files or topic…',
                    hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                    prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.teacherPurple, size: 18),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 11),
                  ),
                ),
              ),
            ),

            // ════════════════ MATERIAL LIST ════════════════
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                physics: const BouncingScrollPhysics(),
                itemCount: filtered.length,
                itemBuilder: (context, index) {
                  final item = filtered[index];
                  final Color fColor = item['color'] as Color;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 46, height: 46,
                          decoration: BoxDecoration(
                            color: fColor.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(item['icon'] as IconData, color: fColor, size: 24),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item['title'] as String,
                                  maxLines: 1, overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A))),
                              const SizedBox(height: 3),
                              Row(
                                children: [
                                  Text(item['type'] as String,
                                      style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                                  const SizedBox(width: 6),
                                  Text('• ${item['size']}',
                                      style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.w600, color: fColor)),
                                  const SizedBox(width: 6),
                                  Text('• ${item['class']}',
                                      style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                                ],
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.download_rounded, color: AppTheme.teacherPurple, size: 22),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text('Downloading ${item['title']}... ⬇️'),
                              backgroundColor: AppTheme.teacherPurple,
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ));
                          },
                        ),
                      ],
                    ),
                  ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
                },
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }
}
