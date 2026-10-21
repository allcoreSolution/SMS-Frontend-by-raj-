import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

class StudyMaterialScreen extends StatefulWidget {
  const StudyMaterialScreen({super.key});

  @override
  State<StudyMaterialScreen> createState() => _StudyMaterialScreenState();
}

class _StudyMaterialScreenState extends State<StudyMaterialScreen> {
  int _selectedFilter = 0;
  int _selectedCategory = 0;

  final List<String> _filters = ['All', 'Notes', 'PDF', 'PPT', 'Videos', 'E-Books', 'PYQ Papers', 'Syllabus'];
  final List<String> _categories = ['All Subjects', 'Math', 'Science', 'English', 'Hindi', 'Computer', 'Social Science'];

  final List<Map<String, dynamic>> _materials = [
    {
      'title': 'Trigonometry Formulas & Notes',
      'subject': 'Math',
      'type': 'Notes',
      'subtitle': 'PDF • 2.4 MB • Mr. Sharma',
      'color': const Color(0xFF2563EB),
      'icon': Icons.picture_as_pdf_rounded,
    },
    {
      'title': 'Chapter 5 - Life Processes Notes',
      'subject': 'Science',
      'type': 'PDF',
      'subtitle': 'PDF • 3.1 MB • Mr. Verma',
      'color': const Color(0xFF10B981),
      'icon': Icons.description_rounded,
    },
    {
      'title': 'English Grammar & Essay Writing',
      'subject': 'English',
      'type': 'PPT',
      'subtitle': 'PPTX • 5.8 MB • Mrs. Johnson',
      'color': const Color(0xFF8B5CF6),
      'icon': Icons.slideshow_rounded,
    },
    {
      'title': 'Python Programming Basics Recorded Lecture',
      'subject': 'Computer',
      'type': 'Videos',
      'subtitle': 'Video MP4 • 45.2 MB • Mr. Das',
      'color': const Color(0xFFEC4899),
      'icon': Icons.video_library_rounded,
    },
    {
      'title': 'NCERT Class 10 Hindi E-Book',
      'subject': 'Hindi',
      'type': 'E-Books',
      'subtitle': 'EPUB • 8.5 MB • Mrs. Singh',
      'color': const Color(0xFFEF4444),
      'icon': Icons.auto_stories_rounded,
    },
    {
      'title': 'Board Exam 2023 Previous Year Question Paper',
      'subject': 'Math',
      'type': 'PYQ Papers',
      'subtitle': 'PDF • 1.9 MB • CBSE Board',
      'color': const Color(0xFFF59E0B),
      'icon': Icons.article_rounded,
    },
    {
      'title': 'Official Class 10 Annual Syllabus 2024-25',
      'subject': 'Social Science',
      'type': 'Syllabus',
      'subtitle': 'PDF • 1.2 MB • Mr. Gupta',
      'color': const Color(0xFF14B8A6),
      'icon': Icons.assignment_turned_in_rounded,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final filteredList = _materials.where((item) {
      final matchesFilter = _selectedFilter == 0 || item['type'] == _filters[_selectedFilter];
      final matchesCategory = _selectedCategory == 0 || item['subject'] == _categories[_selectedCategory];
      return matchesFilter && matchesCategory;
    }).toList();

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
          'Study Material & Syllabus',
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Material Resource Type Filter Chips
              SizedBox(
                height: 38,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: _filters.length,
                  itemBuilder: (context, index) {
                    final isSelected = _selectedFilter == index;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedFilter = index),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFF2563EB)
                              : (isDark ? const Color(0xFF1E293B) : Colors.white),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFF2563EB)
                                : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                          ),
                        ),
                        child: Text(
                          _filters[index],
                          style: GoogleFonts.inter(
                            fontSize: 12.5,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? Colors.white : (isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569)),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ).animate().fadeIn(duration: 300.ms),

              const SizedBox(height: 10),

              // Subject Category Filter Bar
              SizedBox(
                height: 34,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: _categories.length,
                  itemBuilder: (context, index) {
                    final isSelected = _selectedCategory == index;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategory = index),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFF10B981).withValues(alpha: 0.15)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF10B981) : Colors.transparent,
                          ),
                        ),
                        child: Text(
                          _categories[index],
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? const Color(0xFF10B981) : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ).animate().fadeIn(duration: 300.ms, delay: 50.ms),

              const SizedBox(height: 14),

              // Study Materials List
              Expanded(
                child: filteredList.isEmpty
                    ? Center(
                        child: Text(
                          'No materials found for selected filters',
                          style: GoogleFonts.inter(color: isDark ? Colors.white54 : Colors.black54),
                        ),
                      )
                    : ListView.builder(
                        physics: const BouncingScrollPhysics(),
                        itemCount: filteredList.length,
                        itemBuilder: (context, index) {
                          final item = filteredList[index];
                          final color = item['color'] as Color;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF1E293B) : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.02),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: color.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Icon(item['icon'] as IconData, color: color, size: 24),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: color.withValues(alpha: 0.12),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              item['subject'] as String,
                                              style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: color),
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: isDark ? Colors.white10 : const Color(0xFFF1F5F9),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              item['type'] as String,
                                              style: GoogleFonts.inter(
                                                fontSize: 10.5,
                                                fontWeight: FontWeight.bold,
                                                color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 5),
                                      Text(
                                        item['title'] as String,
                                        style: GoogleFonts.outfit(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        item['subtitle'] as String,
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.file_download_outlined, color: Color(0xFF2563EB), size: 24),
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(content: Text('Downloading ${item['title']}...')),
                                    );
                                  },
                                ),
                              ],
                            ),
                          );
                        },
                      ).animate().fadeIn(duration: 400.ms, delay: 100.ms).slideY(begin: 0.08),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }
}
