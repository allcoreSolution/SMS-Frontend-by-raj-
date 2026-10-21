import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/widgets/custom_segmented_tab_bar.dart';

class OnlineExamsScreen extends StatefulWidget {
  const OnlineExamsScreen({super.key});

  @override
  State<OnlineExamsScreen> createState() => _OnlineExamsScreenState();
}

class _OnlineExamsScreenState extends State<OnlineExamsScreen> {
  int _selectedTab = 0;
  late final PageController _pageController;

  final List<String> _tabs = ['Active', 'Upcoming', 'Completed'];

  final List<Map<String, dynamic>> _activeExams = [
    {
      'id': 'EXAM-101',
      'title': 'Mathematics Unit Test (Trigonometry)',
      'detail': '5 Questions • 15 Mins • Max Marks: 25',
      'status': 'Active',
      'questions': [
        {
          'q': '1. What is the value of sin(90°)?',
          'options': ['0', '1', '1/2', 'Undefined'],
          'answer': 1,
        },
        {
          'q': '2. If tan(θ) = 1, what is the angle θ?',
          'options': ['30°', '45°', '60°', '90°'],
          'answer': 1,
        },
        {
          'q': '3. What is sin²(θ) + cos²(θ) equal to?',
          'options': ['0', '1', '2', '-1'],
          'answer': 1,
        },
        {
          'q': '4. What is sec(0°)?',
          'options': ['1', '0', 'Undefined', '1/2'],
          'answer': 0,
        },
        {
          'q': '5. Value of cos(60°) is:',
          'options': ['1/2', '√3/2', '1/√2', '1'],
          'answer': 0,
        },
      ],
    },
    {
      'id': 'EXAM-102',
      'title': 'Science Physics Quiz (Light & Reflection)',
      'detail': '4 Questions • 10 Mins • Max Marks: 20',
      'status': 'Active',
      'questions': [
        {
          'q': '1. Speed of light in vacuum is:',
          'options': ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁵ km/s', 'Both A and C'],
          'answer': 3,
        },
        {
          'q': '2. Focal length of a plane mirror is:',
          'options': ['Zero', 'Infinity', '25 cm', '10 cm'],
          'answer': 1,
        },
      ],
    },
  ];

  final List<Map<String, dynamic>> _completedExams = [
    {
      'id': 'EXAM-099',
      'title': 'English Grammar Assessment',
      'detail': '20 Questions • Score: 18 / 20 (90%)',
      'status': 'Completed ✅',
      'grade': 'Grade A+',
    },
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _selectedTab);
  }

  @override
  void dispose() {
    _pageController.dispose();
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
          'Online Exams (CBT)',
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
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomSegmentedTabBar(
                tabs: _tabs,
                selectedIndex: _selectedTab,
                onTabChanged: _onTabTapped,
              ),

              const SizedBox(height: 20),

              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const BouncingScrollPhysics(),
                  onPageChanged: (index) => setState(() => _selectedTab = index),
                  children: [
                    // Tab 1: Active Exams
                    _buildExamList(_activeExams, isDark, isActive: true),

                    // Tab 2: Upcoming Exams
                    _buildExamList([
                      {
                        'id': 'EXAM-103',
                        'title': 'Computer Science Mid-Term CBT',
                        'detail': 'Starts Tomorrow at 10:00 AM • 30 Mins',
                        'status': 'Upcoming ⏰',
                      },
                    ], isDark, isActive: false),

                    // Tab 3: Completed Exams
                    _buildExamList(_completedExams, isDark, isActive: false),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }

  Widget _buildExamList(List<Map<String, dynamic>> exams, bool isDark, {required bool isActive}) {
    if (exams.isEmpty) {
      return Center(
        child: Text('No exams found.', style: GoogleFonts.inter(color: isDark ? Colors.white54 : Colors.black54)),
      );
    }

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      itemCount: exams.length,
      itemBuilder: (context, index) {
        final exam = exams[index];
        final isCompleted = exam['status'].toString().contains('Completed');

        return Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.03),
                blurRadius: 10,
                offset: const Offset(0, 3),
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
                    decoration: BoxDecoration(
                      color: const Color(0xFFEC4899).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      exam['id'] as String,
                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFFEC4899)),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isCompleted ? const Color(0xFF10B981).withValues(alpha: 0.12) : const Color(0xFF2563EB).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      exam['status'] as String,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isCompleted ? const Color(0xFF10B981) : const Color(0xFF2563EB),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                exam['title'] as String,
                style: GoogleFonts.outfit(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                exam['detail'] as String,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
                ),
              ),
              if (isActive && exam.containsKey('questions')) ...[
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton.icon(
                    onPressed: () => _startExamSimulator(context, exam),
                    icon: const Icon(Icons.play_circle_fill_rounded, size: 20),
                    label: Text(
                      'Start CBT Online Exam',
                      style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  void _startExamSimulator(BuildContext context, Map<String, dynamic> exam) {
    final List<Map<String, dynamic>> questions = List<Map<String, dynamic>>.from(exam['questions']);
    final Map<int, int> selectedAnswers = {};

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final isDark = Theme.of(context).brightness == Brightness.dark;

            return Dialog(
              insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            child: Text(
                              exam['title'] as String,
                              style: GoogleFonts.outfit(fontSize: 16.5, fontWeight: FontWeight.bold),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEF4444).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.timer_rounded, size: 14, color: Color(0xFFEF4444)),
                                const SizedBox(width: 4),
                                Text(
                                  '14:52 Mins',
                                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFFEF4444)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 24),
                      Column(
                        children: List.generate(questions.length, (qIdx) {
                          final q = questions[qIdx];
                          final options = List<String>.from(q['options']);

                          return Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  q['q'] as String,
                                  style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 8),
                                ...List.generate(options.length, (optIdx) {
                                  final isSelected = selectedAnswers[qIdx] == optIdx;
                                  return GestureDetector(
                                    onTap: () {
                                      setModalState(() {
                                        selectedAnswers[qIdx] = optIdx;
                                      });
                                    },
                                    child: Container(
                                      margin: const EdgeInsets.only(bottom: 6),
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: isSelected
                                            ? const Color(0xFF2563EB).withValues(alpha: 0.15)
                                            : Colors.transparent,
                                        borderRadius: BorderRadius.circular(10),
                                        border: Border.all(
                                          color: isSelected ? const Color(0xFF2563EB) : (isDark ? Colors.white10 : const Color(0xFFCBD5E1)),
                                        ),
                                      ),
                                      child: Row(
                                        children: [
                                          Icon(
                                            isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                                            color: isSelected ? const Color(0xFF2563EB) : Colors.grey,
                                            size: 18,
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(
                                            child: Text(
                                              options[optIdx],
                                              style: GoogleFonts.inter(fontSize: 13, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }),
                              ],
                            ),
                          );
                        }),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('Cancel'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                              onPressed: () {
                                Navigator.pop(ctx);

                                // Calculate Score
                                int score = 0;
                                for (int i = 0; i < questions.length; i++) {
                                  if (selectedAnswers[i] == questions[i]['answer']) {
                                    score++;
                                  }
                                }

                                setState(() {
                                  _completedExams.insert(0, {
                                    'id': exam['id'],
                                    'title': exam['title'],
                                    'detail': '${questions.length} Questions • Score: $score / ${questions.length} (${((score / questions.length) * 100).toInt()}%)',
                                    'status': 'Completed ✅',
                                    'grade': score >= (questions.length * 0.8) ? 'Grade A+' : 'Grade B',
                                  });
                                  _activeExams.removeWhere((e) => e['id'] == exam['id']);
                                });

                                _showResultModal(context, score, questions.length);
                              },
                              child: const Text('Submit Exam'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _showResultModal(BuildContext context, int score, int total) {
    final percentage = ((score / total) * 100).toInt();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Exam Result Summary 🎉', textAlign: TextAlign.center),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Color(0xFF10B981),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.emoji_events_rounded, color: Colors.white, size: 48),
            ),
            const SizedBox(height: 14),
            Text(
              'Your Score: $score / $total',
              style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: const Color(0xFF10B981)),
            ),
            const SizedBox(height: 4),
            Text(
              'Percentage: $percentage% • Status: PASSED ✅',
              style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          Center(
            child: ElevatedButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('View Completed Exams'),
            ),
          ),
        ],
      ),
    );
  }
}
