import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ExamResultsScreen extends StatefulWidget {
  const ExamResultsScreen({super.key});

  @override
  State<ExamResultsScreen> createState() => _ExamResultsScreenState();
}

class _ExamResultsScreenState extends State<ExamResultsScreen> {
  String? _selectedTermId;
  String _selectedTermName = 'Select Exam';
  
  List<Map<String, dynamic>> _availableExams = [];
  List<Map<String, dynamic>> _marks = [];
  
  bool _isLoadingExams = true;
  bool _isLoadingResults = false;

  Map<String, dynamic>? _summary;

  Color _gradeColor(String grade) {
    if (grade == 'A+') return const Color(0xFF10B981);
    if (grade == 'A') return const Color(0xFF2563EB);
    if (grade == 'B+') return const Color(0xFF6366F1);
    if (grade == 'B') return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }

  @override
  void initState() {
    super.initState();
    _fetchAvailableExams();
  }

  Future<void> _fetchAvailableExams() async {
    try {
      final res = await http.get(Uri.parse('https://all-core-school-erp-backend.onrender.com/api/exams/exam-schedule'));
      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        if (body['success'] == true && body['data'] != null) {
          final List<dynamic> data = body['data'];
          setState(() {
            _availableExams = data.map((e) => {
              'id': e['_id'],
              'name': e['name'],
            }).toList();
            if (_availableExams.isNotEmpty) {
              _selectedTermId = _availableExams[0]['id'];
              _selectedTermName = _availableExams[0]['name'];
              _fetchResults();
            }
          });
        }
      }
    } catch (e) {
      debugPrint('Failed to load exams: $e');
    } finally {
      setState(() => _isLoadingExams = false);
    }
  }

  Future<void> _fetchResults() async {
    if (_selectedTermId == null) return;
    setState(() {
      _isLoadingResults = true;
      _marks = [];
      _summary = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final studentId = prefs.getString('sp_student_id') ?? '';
      
      if (studentId.isEmpty) return;

      final res = await http.get(Uri.parse('https://all-core-school-erp-backend.onrender.com/api/exams/results?studentId=$studentId&examId=$_selectedTermId'));
      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        if (body['success'] == true) {
          final summary = body['summary'];
          final List<dynamic> records = body['data'] ?? [];
          setState(() {
             _summary = summary;
             _marks = records.map((e) {
                // Approximate grade logic for UI if missing
                final max = (e['maxMarks'] ?? 100).toDouble();
                final obt = (e['marksObtained'] ?? 0).toDouble();
                final pct = max > 0 ? (obt/max*100) : 0;
                String grade = 'F';
                if (pct >= 90) grade = 'A+';
                else if (pct >= 80) grade = 'A';
                else if (pct >= 70) grade = 'B+';
                else if (pct >= 60) grade = 'B';
                else if (pct >= 50) grade = 'C';

                return {
                  'subject': e['subject'] != null ? (e['subject']['subjectName'] ?? 'Subject') : 'Subject',
                  'full': max.toInt(),
                  'obtained': obt.toInt(),
                  'grade': grade,
                };
             }).toList();
          });
        }
      }
    } catch(e) {
      debugPrint('Failed to fetch results: $e');
    } finally {
      setState(() => _isLoadingResults = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final percentage = _summary != null ? _summary!['percentage']?.toString() ?? '0.0' : '0.0';
    final overallGrade = _summary != null ? _summary!['grade']?.toString() ?? 'N/A' : 'N/A';
    final totalObtained = _summary != null ? _summary!['totalObtained']?.toString() ?? '0' : '0';
    final totalFull = _summary != null ? _summary!['totalMax']?.toString() ?? '0' : '0';

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
          'Exam Results',
          style: GoogleFonts.outfit(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: IconButton(
              icon: const Icon(Icons.download_rounded, color: Color(0xFF2563EB)),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Downloading marksheet PDF...')),
                );
              },
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Column(
          children: [
            // ── Term Selector ─────────────────────────────────────────
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
              ),
              child: _isLoadingExams 
              ? const Padding(padding: EdgeInsets.all(12), child: Center(child: CircularProgressIndicator()))
              : DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  dropdownColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                  value: _selectedTermId,
                  icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Color(0xFF2563EB)),
                  items: _availableExams.map((e) => DropdownMenuItem(
                            value: e['id'] as String,
                            child: Text(
                              e['name'] as String,
                              style: GoogleFonts.outfit(
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                              ),
                            ),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) {
                       setState(() {
                         _selectedTermId = val;
                         _selectedTermName = _availableExams.firstWhere((e) => e['id'] == val)['name'];
                       });
                       _fetchResults();
                    }
                  },
                ),
              ),
            ),

            const SizedBox(height: 20),

            // ── Metrics Row ───────────────────────────────────────────
            Row(
              children: [
                _metricCard(percentage, 'Percentage', const Color(0xFF2563EB), isDark),
                const SizedBox(width: 10),
                _metricCard(overallGrade, 'Grade', const Color(0xFF10B981), isDark),
                const SizedBox(width: 10),
                _metricCard('-', 'Rank', const Color(0xFFF59E0B), isDark),
                const SizedBox(width: 10),
                _metricCard('8.5', 'GPA', const Color(0xFFEC4899), isDark),
              ],
            ).animate().fadeIn(duration: 400.ms, delay: 100.ms).slideY(begin: 0.1),

            const SizedBox(height: 20),

            // ── Marks Table ───────────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Table Header
                  Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: Text(
                          'Subject',
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          ),
                        ),
                      ),
                      Expanded(
                        flex: 2,
                        child: Text(
                          'Marks',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          ),
                        ),
                      ),
                      Expanded(
                        flex: 1,
                        child: Text(
                          'Grade',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Divider(height: 1),
                  const SizedBox(height: 12),

                  // Marks Rows
                  ...List.generate(_marks.length, (index) {
                    final item = _marks[index];
                    final gradeColor = _gradeColor(item['grade'] as String);
                    final obtained = item['obtained'] as int;
                    final full = item['full'] as int;
                    final progress = obtained / full;

                    return Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              flex: 3,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['subject'] as String,
                                    style: GoogleFonts.inter(
                                      fontWeight: FontWeight.w700,
                                      fontSize: 13.5,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: LinearProgressIndicator(
                                      value: progress,
                                      minHeight: 4,
                                      backgroundColor: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                                      color: gradeColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Expanded(
                              flex: 2,
                              child: Text(
                                '$obtained / $full',
                                textAlign: TextAlign.center,
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF374151),
                                ),
                              ),
                            ),
                            Expanded(
                              flex: 1,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                decoration: BoxDecoration(
                                  color: gradeColor.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  item['grade'] as String,
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.outfit(
                                    color: gradeColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        if (index < _marks.length - 1) const SizedBox(height: 14),
                      ],
                    );
                  }),

                  const Divider(height: 24),

                  // Total Row
                  if (_isLoadingResults)
                    const Padding(padding: EdgeInsets.all(20), child: Center(child: CircularProgressIndicator()))
                  else if (_marks.isEmpty)
                    const Padding(padding: EdgeInsets.all(20), child: Center(child: Text("No Results for this exam.")))
                  else
                  Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: Text(
                          'Total',
                          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ),
                      Expanded(
                        flex: 2,
                        child: Text(
                          '$totalObtained / $totalFull',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ),
                      Expanded(
                        flex: 1,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            overallGrade != 'F' ? 'PASS' : 'FAIL',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.outfit(
                              color: const Color(0xFF10B981),
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Downloading official marksheet PDF...')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(48),
                  padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                icon: const Icon(Icons.download_rounded, size: 20),
                label: Text(
                  'Download Marksheet',
                  style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 14.5),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }

  Widget _metricCard(String value, String label, Color color, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16, color: color),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.inter(fontSize: 10.5, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
