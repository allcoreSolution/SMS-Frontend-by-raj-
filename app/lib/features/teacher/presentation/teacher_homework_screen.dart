import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';
import '../../../../core/services/teacher_data_repository.dart';
class TeacherHomeworkScreen extends StatefulWidget {
  const TeacherHomeworkScreen({super.key});

  @override
  State<TeacherHomeworkScreen> createState() => _TeacherHomeworkScreenState();
}

class _TeacherHomeworkScreenState extends State<TeacherHomeworkScreen>
    with SingleTickerProviderStateMixin {
  late PageController _pageController;
  int _selectedTab = 0;
  final _titleController = TextEditingController();
  final _descController = TextEditingController();

  // Use specific dynamic states through the provider in the build method.
  // Still keeping _submittedHomework static for the UI layout while assigned is mapped directly.

  final List<Map<String, dynamic>> _submittedHomework = [];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      TeacherDataRepository.instance.fetchMetadata();
      TeacherDataRepository.instance.fetchAssignedHomework();
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _onTabTapped(int index) {
    setState(() => _selectedTab = index);
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  void _showCreateDialog() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            const Icon(Icons.add_circle_rounded, color: Color(0xFF4C1D95), size: 24),
            const SizedBox(width: 10),
            Text('Create New Assignment', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _titleController,
              style: GoogleFonts.inter(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Assignment Title (e.g. Integration Set)',
                hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                filled: true,
                fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _descController,
              maxLines: 2,
              style: GoogleFonts.inter(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Instructions & Due Date details...',
                hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                filled: true,
                fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => context.pop(), child: Text('Cancel', style: GoogleFonts.inter(color: Colors.grey))),
          ElevatedButton(
            onPressed: () {
              if (_titleController.text.isNotEmpty) {
                final repo = TeacherDataRepository.instance;
                final defCls = repo.classes.isNotEmpty ? repo.classes.first['_id'].toString() : '65fac00d41e7d23a670dbfed';
                final defSec = repo.sections.isNotEmpty ? repo.sections.first['_id'].toString() : '65fac00d41e7d23a670dbfef';
                final defSub = repo.subjects.isNotEmpty ? repo.subjects.first['_id'].toString() : '65fac00d41e7d23a670dc0aa';

                TeacherDataRepository.instance.assignHomework(
                  title: _titleController.text,
                  description: _descController.text.isEmpty ? 'No description' : _descController.text,
                  submissionDate: '2026-05-12', // Set fixed future date 
                  classId: defCls,
                  sectionId: defSec,
                  subjectId: defSub,
                );
                
                _titleController.clear();
                _descController.clear();
                context.pop();
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                  content: Row(children: [
                    const Icon(Icons.check_circle_rounded, color: Colors.white),
                    const SizedBox(width: 10),
                    Text('Homework Published! 📚', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
                  ]),
                  backgroundColor: const Color(0xFF4C1D95),
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ));
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4C1D95), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            child: Text('Publish Now', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Colors.white)),
          ),
        ],
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
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showCreateDialog,
        backgroundColor: const Color(0xFF4C1D95),
        elevation: 6,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: Text('Create Homework', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
      body: SafeArea(
        child: Column(
          children: [

            // ════════════════ TOP NAVIGATION BAR WITH BACK BUTTON ════════════════
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
                        Text('Homework & Assignments',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Swipe tabs left or right →',
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
                    child: Row(
                      children: [
                        const Icon(Icons.menu_book_rounded, size: 14, color: Color(0xFF4C1D95)),
                        const SizedBox(width: 5),
                        Text('HOMEWORK',
                            style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: const Color(0xFF4C1D95))),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // ════════════════ FLOATING PURPLE HERO CARD ════════════════
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 10),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF3B0764), Color(0xFF4C1D95), Color(0xFF6D28D9)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.35),
                      blurRadius: 14, offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ListenableBuilder(
                          listenable: TeacherDataRepository.instance,
                          builder: (context, _) => _purpleStat(
                            '${TeacherDataRepository.instance.assignedHomework.length}', 
                            'Active Assignments', 
                            Colors.white.withValues(alpha: 0.2), 
                            Colors.white
                          ),
                        ),
                        const SizedBox(width: 8),
                        _purpleStat('12', 'Total Submitted', const Color(0xFF059669).withValues(alpha: 0.3), const Color(0xFF6EE7B7)),
                        const SizedBox(width: 8),
                        _purpleStat('55%', 'Completion Rate', Colors.white.withValues(alpha: 0.2), Colors.white),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Custom Segmented Tab Bar
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          Expanded(child: _tabButton(0, 'Assigned Homework', Icons.assignment_outlined)),
                          Expanded(child: _tabButton(1, 'Submitted Copies', Icons.cloud_download_outlined)),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ SWIPEABLE PAGE VIEW CONTENT ════════════════
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const BouncingScrollPhysics(),
                onPageChanged: (idx) => setState(() => _selectedTab = idx),
                children: [
                  _buildAssignedTab(isDark),
                  _buildSubmittedTab(isDark),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _buildAssignedTab(bool isDark) {
    return ListenableBuilder(
      listenable: TeacherDataRepository.instance,
      builder: (context, child) {
        final assigned = TeacherDataRepository.instance.assignedHomework;
        if (assigned.isEmpty) {
          return Center(child: Text("No homework assigned yet.", style: GoogleFonts.inter(color: Colors.grey)));
        }

        return ListView.builder(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
          physics: const BouncingScrollPhysics(),
          itemCount: assigned.length,
          itemBuilder: (context, index) {
            final item = assigned[index];
            final double ratio = 0.5; // Mock ratio
            final Color cardColor = AppTheme.teacherPurple;

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                    blurRadius: 8, offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: cardColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
                        child: Text(item.subject, style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: cardColor)),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.event_outlined, size: 13, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text('Due: ${item.dueDate.length > 10 ? item.dueDate.substring(0, 10) : item.dueDate}', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.w600, color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(item.title, style: GoogleFonts.outfit(fontSize: 16.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                  if (item.description.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(item.description, style: GoogleFonts.inter(fontSize: 13, color: Colors.grey[600]), maxLines: 2, overflow: TextOverflow.ellipsis),
                  ],
                  const SizedBox(height: 14),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Submission Ratio', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                      Text('0/30 Submitted', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: LinearProgressIndicator(
                      value: ratio,
                      minHeight: 7,
                      backgroundColor: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF059669)),
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
          },
        );
      }
    );
  }

  Widget _buildSubmittedTab(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      physics: const BouncingScrollPhysics(),
      itemCount: _submittedHomework.length,
      itemBuilder: (context, index) {
        final item = _submittedHomework[index];
        final isChecked = item['status'] == 'Checked';

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 42, height: 42,
                    decoration: BoxDecoration(
                      color: const Color(0xFF4C1D95).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFF4C1D95), size: 22),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item['student'] as String, style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                      Text('${item['class']} • ${item['file']}', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: isChecked ? const Color(0xFF059669).withValues(alpha: 0.12) : const Color(0xFFD97706).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(item['status'] as String,
                    style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: isChecked ? const Color(0xFF059669) : const Color(0xFFD97706))),
              ),
            ],
          ),
        ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
      },
    );
  }

  Widget _tabButton(int index, String label, IconData icon) {
    final active = _selectedTab == index;
    return GestureDetector(
      onTap: () => _onTabTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 7),
        decoration: BoxDecoration(
          color: active ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(11),
          boxShadow: active ? [BoxShadow(color: Colors.black.withValues(alpha: 0.15), blurRadius: 6)] : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 15, color: active ? const Color(0xFF4C1D95) : Colors.white70),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12, fontWeight: FontWeight.bold,
                color: active ? const Color(0xFF4C1D95) : Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _purpleStat(String val, String label, Color bg, Color fg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
        child: Column(
          children: [
            Text(val, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: fg)),
            Text(label, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: fg.withValues(alpha: 0.9))),
          ],
        ),
      ),
    );
  }
}
