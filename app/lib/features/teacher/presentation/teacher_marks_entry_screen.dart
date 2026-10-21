import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';
class TeacherMarksEntryScreen extends StatefulWidget {
  const TeacherMarksEntryScreen({super.key});

  @override
  State<TeacherMarksEntryScreen> createState() => _TeacherMarksEntryScreenState();
}

class _TeacherMarksEntryScreenState extends State<TeacherMarksEntryScreen> {
  String _selectedClass = 'Class 10 - A';
  String _selectedExam = 'Unit Test - 1';
  bool _isDirty = false;
  bool _isSaved = false;

  List<Map<String, dynamic>> _students = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await TeacherDataRepository.instance.fetchMetadata();
    final st = await TeacherDataRepository.instance.fetchClassStudents();
    if(mounted) {
      setState(() {
         // Create local mutable copies with scoring state
         _students = st.map((s) => {
           'id': s['id'],
           'name': s['name'],
           'roll': s['roll'],
           'maxMarks': 100,
           'scored': 0,
           'grade': 'F',
         }).toList();
      });
    }
  }

  Color _gradeColor(String grade) {
    switch (grade) {
        case 'A+': return AppTheme.teacherPurple;
        case 'A':  return AppTheme.teacherPurple;
        case 'B+': return AppTheme.teacherPurple;
        default:   return AppTheme.teacherPurple;
    }
  }

  void _updateScore(int index, int delta) {
    setState(() {
      int current = _students[index]['scored'] as int;
      int maxM = _students[index]['maxMarks'] as int;
      int newScore = (current + delta).clamp(0, maxM);
      _students[index]['scored'] = newScore;
      _students[index]['grade'] = newScore >= 45 ? 'A+' : (newScore >= 40 ? 'A' : (newScore >= 35 ? 'B+' : 'C'));
      _isDirty = true;
      _isSaved = false;
    });
  }

  void _saveMarks() async {
    final repo = TeacherDataRepository.instance;
    final exId = repo.exams.isNotEmpty ? repo.exams.first['_id'].toString() : '65fac00d41e7d23a670dbfed';
    final subId = repo.subjects.isNotEmpty ? repo.subjects.first['_id'].toString() : '65fac00d41e7d23a670dc0aa';

    final payload = _students.map((s) => {
      'exam': exId,
      'student': s['id'],
      'subject': subId,
      'marksObtained': s['scored'],
      'maxMarks': s['maxMarks'],
      'remarks': 'Auto saved via APP'
    }).toList();

    final suc = await repo.saveExamMarks(payload);
    if(suc && mounted) {
      setState(() {
        _isDirty = false;
        _isSaved = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Row(children: [
          const Icon(Icons.check_circle_rounded, color: Colors.white),
          const SizedBox(width: 10),
          Expanded(child: Text('Exam Marks uploaded directly to Backend! 📝',
              style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Colors.white))),
        ]),
        backgroundColor: const Color(0xFF059669),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    // Summary stats
    final avg = _students.isEmpty ? "0.0" : (_students.map((s) => s['scored'] as int).reduce((a, b) => a + b) / _students.length).toStringAsFixed(1);
    final highest = _students.isEmpty ? 0 : _students.map((s) => s['scored'] as int).reduce((a, b) => a > b ? a : b);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/teacher-dashboard');
      },
      child: Scaffold(
      backgroundColor: bg,
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
                        Text('Marks & Grades Entry',
                            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('Tap + / - to adjust student score',
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
                        const Icon(Icons.grade_rounded, size: 14, color: Color(0xFF4C1D95)),
                        const SizedBox(width: 5),
                        Text('GRADEBOOK',
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
                    // Dropdowns row
                    Row(
                      children: [
                        Expanded(child: _purpleDropdown(
                          _selectedClass,
                          ['Class 10 - A', 'Class 9 - B', 'Class 8 - A'],
                          Icons.class_rounded,
                          (v) => setState(() { _selectedClass = v!; _isDirty = true; }),
                        )),
                        const SizedBox(width: 10),
                        Expanded(child: _purpleDropdown(
                          _selectedExam,
                          ['Unit Test - 1', 'Mid Term Exam', 'Final Exam'],
                          Icons.assignment_turned_in_rounded,
                          (v) => setState(() { _selectedExam = v!; _isDirty = true; }),
                        )),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Stats Banner Row inside Card
                    Row(
                      children: [
                        _purpleStat('$avg/50', 'Class Average', Colors.white.withValues(alpha: 0.2), Colors.white),
                        const SizedBox(width: 8),
                        _purpleStat('$highest/50', 'Highest Score', const Color(0xFF059669).withValues(alpha: 0.3), const Color(0xFF6EE7B7)),
                        const SizedBox(width: 8),
                        _purpleStat('5', 'Evaluated', Colors.white.withValues(alpha: 0.2), Colors.white),
                      ],
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.05),
            ),

            // ════════════════ STUDENT MARKS LIST ════════════════
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                physics: const BouncingScrollPhysics(),
                itemCount: _students.length,
                itemBuilder: (context, index) {
                  final student = _students[index];
                  final String grade = student['grade'] as String;
                  final Color gColor = _gradeColor(grade);

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.04), blurRadius: 6)],
                    ),
                    child: Row(
                      children: [
                        // Avatar Initials
                        Container(
                          width: 44, height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFF4C1D95).withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(13),
                          ),
                          child: Center(
                            child: Text('0${index + 1}',
                                style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF4C1D95))),
                          ),
                        ),
                        const SizedBox(width: 14),

                        // Name & Roll
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(student['name'] as String,
                                  style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A))),
                              const SizedBox(height: 2),
                              Text('Roll ${student['roll']} • Max ${student['maxMarks']}',
                                  style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                            ],
                          ),
                        ),

                        // Increment / Decrement Score Control Buttons
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () => _updateScore(index, -1),
                              child: Container(
                                width: 28, height: 28,
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.remove_rounded, size: 16, color: Colors.grey),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: isDark ? Colors.white24 : const Color(0xFFCBD5E1)),
                              ),
                              child: Text(
                                '${student['scored']}',
                                style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold,
                                    color: isDark ? Colors.white : const Color(0xFF0F172A)),
                              ),
                            ),
                            const SizedBox(width: 6),
                            GestureDetector(
                              onTap: () => _updateScore(index, 1),
                              child: Container(
                                width: 28, height: 28,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF4C1D95).withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.add_rounded, size: 16, color: Color(0xFF4C1D95)),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(width: 10),

                        // Grade Badge
                        Container(
                          width: 36, height: 36,
                          decoration: BoxDecoration(
                            color: gColor.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: gColor.withValues(alpha: 0.4)),
                          ),
                          child: Center(
                            child: Text(
                              grade,
                              style: GoogleFonts.outfit(fontSize: 12.5, fontWeight: FontWeight.bold, color: gColor),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(duration: 300.ms, delay: (index * 30).ms);
                },
              ),
            ),

            // ════════════════ DYNAMIC SLIDING SAVE FOOTER (NOT FIXED PERMANENTLY) ════════════════
            AnimatedSize(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              child: _isSaved
                  ? Container(
                      width: double.infinity,
                      padding: const EdgeInsets.fromLTRB(16, 10, 16, 18),
                      color: bg,
                      child: Container(
                        height: 50,
                        decoration: BoxDecoration(
                          color: const Color(0xFF059669).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFF059669).withValues(alpha: 0.4)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 20),
                            const SizedBox(width: 8),
                            Text('Exam Marks Saved & Published!',
                                style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                          ],
                        ),
                      ),
                    )
                  : _isDirty
                      ? Container(
                          padding: const EdgeInsets.fromLTRB(16, 10, 16, 18),
                          color: bg,
                          child: SizedBox(
                            width: double.infinity, height: 50,
                            child: ElevatedButton.icon(
                              onPressed: _saveMarks,
                              icon: const Icon(Icons.save_alt_rounded, size: 18),
                              label: Text('Save & Publish Marks', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF4C1D95),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                elevation: 5,
                                shadowColor: const Color(0xFF4C1D95).withValues(alpha: 0.4),
                              ),
                            ),
                          ),
                        ).animate().slideY(begin: 1.0, end: 0.0, duration: 300.ms)
                      : const SizedBox.shrink(),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _purpleDropdown(String val, List<String> items, IconData icon, ValueChanged<String?> onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white70, size: 15),
          const SizedBox(width: 6),
          Expanded(
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: val, isExpanded: true,
                dropdownColor: const Color(0xFF3B0764),
                icon: const Icon(Icons.expand_more_rounded, color: Colors.white70, size: 18),
                style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
                items: items.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: onChanged,
              ),
            ),
          ),
        ],
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
