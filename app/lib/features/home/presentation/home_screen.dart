import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/utils/responsive.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedCategoryIndex = 0;

  final List<String> _categories = [
    'Overview',
    'Students',
    'Attendance',
    'Grades',
    'Schedule'
  ];

  final List<Map<String, dynamic>> _stats = [
    {
      'title': 'Total Students',
      'value': '1,248',
      'change': '+12%',
      'icon': Icons.people_outline,
      'color': const Color(0xFF6366F1),
    },
    {
      'title': 'Avg Attendance',
      'value': '94.2%',
      'change': '+2.4%',
      'icon': Icons.rule_folder_outlined,
      'color': const Color(0xFF10B981),
    },
    {
      'title': 'Active Courses',
      'value': '36',
      'change': 'Same',
      'icon': Icons.book_outlined,
      'color': const Color(0xFFF59E0B),
    },
    {
      'title': 'Top Performers',
      'value': '182',
      'change': '+8%',
      'icon': Icons.military_tech_outlined,
      'color': const Color(0xFFEC4899),
    },
  ];

  final List<Map<String, String>> _recentStudents = [
    {
      'name': 'Aarav Sharma',
      'class': 'Grade 10-A',
      'roll': '#101',
      'grade': 'A+',
      'avatar': 'AS'
    },
    {
      'name': 'Ananya Verma',
      'class': 'Grade 10-B',
      'roll': '#102',
      'grade': 'A',
      'avatar': 'AV'
    },
    {
      'name': 'Rohan Gupta',
      'class': 'Grade 9-A',
      'roll': '#103',
      'grade': 'B+',
      'avatar': 'RG'
    },
    {
      'name': 'Priya Singh',
      'class': 'Grade 11-C',
      'roll': '#104',
      'grade': 'A+',
      'avatar': 'PS'
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isSmall = Responsive.isSmallScreen(context);
    final isTablet = Responsive.isTablet(context);

    // Dynamic horizontal padding based on screen size
    final double horizontalPadding = isSmall ? 12 : (isTablet ? 28 : 18);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: EdgeInsets.all(isSmall ? 6 : 8),
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1).withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.school_rounded,
                color: const Color(0xFF6366F1),
                size: isSmall ? 20 : 24,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              'EduPortal',
              style: GoogleFonts.outfit(
                fontWeight: FontWeight.bold,
                fontSize: isSmall ? 18 : 22,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: Icon(
              Icons.notifications_outlined,
              size: isSmall ? 20 : 24,
            ),
          ),
          Padding(
            padding: EdgeInsets.only(right: isSmall ? 10 : 16),
            child: CircleAvatar(
              radius: isSmall ? 15 : 18,
              backgroundColor: const Color(0xFF10B981).withValues(alpha: 0.2),
              child: Text(
                'AD',
                style: TextStyle(
                  color: const Color(0xFF10B981),
                  fontWeight: FontWeight.bold,
                  fontSize: isSmall ? 10 : 12,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final width = constraints.maxWidth;

            // Responsive grid column count & aspect ratio calculation
            int crossAxisCount = 2;
            double childAspectRatio = 1.35;

            if (width < 340) {
              crossAxisCount = 1;
              childAspectRatio = 2.2;
            } else if (width >= 600) {
              crossAxisCount = 4;
              childAspectRatio = 1.25;
            }

            return SingleChildScrollView(
              padding: EdgeInsets.symmetric(
                horizontal: horizontalPadding,
                vertical: isSmall ? 12 : 20,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome Header
                  Text(
                    'Welcome back, Admin 👋',
                    style: GoogleFonts.outfit(
                      fontSize: isSmall ? 20 : (isTablet ? 28 : 24),
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ).animate().fadeIn(duration: 400.ms).slideX(begin: -0.1),
                  const SizedBox(height: 4),
                  Text(
                    'Here is what is happening across your school today.',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontSize: isSmall ? 12 : 14,
                    ),
                  ).animate().fadeIn(duration: 400.ms, delay: 100.ms),

                  const SizedBox(height: 20),

                  // Category Filter Chips
                  SizedBox(
                    height: isSmall ? 36 : 40,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      separatorBuilder: (context, index) =>
                          SizedBox(width: isSmall ? 6 : 10),
                      itemBuilder: (context, index) {
                        final isSelected = _selectedCategoryIndex == index;
                        return ChoiceChip(
                          label: Text(
                            _categories[index],
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : const Color(0xFF94A3B8),
                              fontWeight: isSelected
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              fontSize: isSmall ? 12 : 14,
                            ),
                          ),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedCategoryIndex = index;
                            });
                          },
                          selectedColor: const Color(0xFF6366F1),
                          backgroundColor: const Color(0xFF1E293B),
                          side: BorderSide(
                            color: isSelected
                                ? const Color(0xFF6366F1)
                                : Colors.white.withValues(alpha: 0.08),
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        );
                      },
                    ),
                  ).animate().fadeIn(duration: 400.ms, delay: 200.ms),

                  const SizedBox(height: 20),

                  // Responsive Stats Grid
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossAxisCount,
                      crossAxisSpacing: isSmall ? 10 : 16,
                      mainAxisSpacing: isSmall ? 10 : 16,
                      childAspectRatio: childAspectRatio,
                    ),
                    itemCount: _stats.length,
                    itemBuilder: (context, index) {
                      final item = _stats[index];
                      return Container(
                        padding: EdgeInsets.all(isSmall ? 12 : 16),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.08),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: EdgeInsets.all(isSmall ? 6 : 8),
                                  decoration: BoxDecoration(
                                    color: (item['color'] as Color)
                                        .withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    item['icon'] as IconData,
                                    color: item['color'] as Color,
                                    size: isSmall ? 16 : 20,
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(
                                    horizontal: isSmall ? 6 : 8,
                                    vertical: isSmall ? 2 : 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF10B981)
                                        .withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    item['change'] as String,
                                    style: TextStyle(
                                      color: const Color(0xFF10B981),
                                      fontSize: isSmall ? 10 : 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                FittedBox(
                                  fit: BoxFit.scaleDown,
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    item['value'] as String,
                                    style: GoogleFonts.outfit(
                                      fontSize: isSmall ? 18 : 22,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  item['title'] as String,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: const Color(0xFF94A3B8),
                                    fontSize: isSmall ? 10 : 12,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ).animate().fadeIn(
                            duration: 400.ms,
                            delay: Duration(milliseconds: 250 + (index * 80)),
                          ).slideY(begin: 0.1);
                    },
                  ),

                  const SizedBox(height: 24),

                  // Recent Students Section Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Recent Students',
                        style: GoogleFonts.outfit(
                          fontSize: isSmall ? 16 : 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      TextButton(
                        onPressed: () {},
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.zero,
                          minimumSize: const Size(50, 30),
                        ),
                        child: Text(
                          'View All',
                          style: TextStyle(
                            color: const Color(0xFF6366F1),
                            fontSize: isSmall ? 12 : 14,
                          ),
                        ),
                      ),
                    ],
                  ).animate().fadeIn(duration: 400.ms, delay: 500.ms),

                  const SizedBox(height: 10),

                  // Student List Cards
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _recentStudents.length,
                    separatorBuilder: (context, index) =>
                        SizedBox(height: isSmall ? 8 : 12),
                    itemBuilder: (context, index) {
                      final student = _recentStudents[index];
                      return Container(
                        padding: EdgeInsets.all(isSmall ? 10 : 14),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.06),
                          ),
                        ),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: isSmall ? 16 : 20,
                              backgroundColor: const Color(0xFF6366F1)
                                  .withValues(alpha: 0.2),
                              child: Text(
                                student['avatar']!,
                                style: TextStyle(
                                  color: const Color(0xFF6366F1),
                                  fontWeight: FontWeight.bold,
                                  fontSize: isSmall ? 11 : 13,
                                ),
                              ),
                            ),
                            SizedBox(width: isSmall ? 10 : 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    student['name']!,
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                      fontSize: isSmall ? 13 : 15,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${student['class']} • ${student['roll']}',
                                    style: TextStyle(
                                      color: const Color(0xFF94A3B8),
                                      fontSize: isSmall ? 11 : 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(
                                horizontal: isSmall ? 8 : 10,
                                vertical: isSmall ? 2 : 4,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981)
                                    .withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                student['grade']!,
                                style: TextStyle(
                                  color: const Color(0xFF10B981),
                                  fontWeight: FontWeight.bold,
                                  fontSize: isSmall ? 10 : 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ).animate().fadeIn(
                            duration: 400.ms,
                            delay: Duration(milliseconds: 550 + (index * 70)),
                          );
                    },
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
