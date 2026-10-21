import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class TeacherDocumentsScreen extends StatelessWidget {
  const TeacherDocumentsScreen({super.key});

  final List<Map<String, dynamic>> _docList = const [
    {
      'name': 'Offer Letter',
      'icon': Icons.home_work_rounded,
      'date': '01 Aug 2022',
      'size': '2.4 MB',
      'type': 'Official Offer Letter',
      'color': Color(0xFF4C1D95),
      'bgColor': Color(0xFFEDE9FE),
      'route': '/teacher-document-viewer',
    },
    {
      'name': 'Appointment Letter',
      'icon': Icons.assignment_rounded,
      'date': '01 Aug 2022',
      'size': '1.8 MB',
      'type': 'Employment Contract',
      'color': Color(0xFF2563EB),
      'bgColor': Color(0xFFDBEAFE),
      'route': '/teacher-document-viewer',
    },
    {
      'name': 'Joining Letter',
      'icon': Icons.task_alt_rounded,
      'date': '05 Aug 2022',
      'size': '1.1 MB',
      'type': 'Joining Record',
      'color': Color(0xFF10B981),
      'bgColor': Color(0xFFD1FAE5),
      'route': '/teacher-document-viewer',
    },
    {
      'name': 'Experience Cert',
      'icon': Icons.workspace_premium_rounded,
      'date': '10 Jan 2024',
      'size': '3.0 MB',
      'type': 'Service Record',
      'color': Color(0xFFF59E0B),
      'bgColor': Color(0xFFFEF3C7),
      'route': '/teacher-document-viewer',
    },
    {
      'name': 'Salary Slip',
      'icon': Icons.receipt_long_rounded,
      'date': 'May 2025',
      'size': '850 KB',
      'type': 'Monthly Slip',
      'color': Color(0xFF059669),
      'bgColor': Color(0xFFD1FAE5),
      'route': '/teacher-salary-slip',
    },
    {
      'name': 'Faculty ID Card',
      'icon': Icons.badge_rounded,
      'date': 'Valid 2024-25',
      'size': '1.5 MB',
      'type': 'Digital Badge',
      'color': Color(0xFF4338CA),
      'bgColor': Color(0xFFE0E7FF),
      'route': '/teacher-id-card',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
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
              context.go('/teacher-dashboard');
            }
          },
        ),
        title: Text('Documents Vault', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: GridView.builder(
          padding: const EdgeInsets.all(16),
          physics: const BouncingScrollPhysics(),
          itemCount: _docList.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            childAspectRatio: 1.05,
          ),
          itemBuilder: (context, index) {
            final item = _docList[index];
            final Color itemColor = item['color'] as Color;

            return Container(
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.04),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                borderRadius: BorderRadius.circular(22),
                child: InkWell(
                  borderRadius: BorderRadius.circular(22),
                  onTap: () {
                    final route = item['route'] as String;
                    if (route == '/teacher-document-viewer') {
                      context.push(route, extra: item);
                    } else {
                      context.push(route);
                    }
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 48, height: 48,
                          decoration: BoxDecoration(
                            color: isDark ? itemColor.withValues(alpha: 0.15) : (item['bgColor'] as Color),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(item['icon'] as IconData, color: itemColor, size: 24),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          item['name'] as String,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.outfit(
                            fontSize: 14.5,
                            fontWeight: FontWeight.bold,
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${item['type']} • ${item['date']}',
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ).animate().fadeIn(duration: 300.ms, delay: (index * 20).ms);
          },
        ),
      ),
    ),
    );
  }
}
