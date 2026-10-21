import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class TeacherWrapper extends StatefulWidget {
  final Widget child;
  const TeacherWrapper({super.key, required this.child});

  @override
  State<TeacherWrapper> createState() => _TeacherWrapperState();
}

class _TeacherWrapperState extends State<TeacherWrapper> {
  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.path;
    if (location == '/teacher-dashboard') return 0;
    if (location.startsWith('/teacher-self-attendance') || location.startsWith('/teacher-attendance')) return 1;
    if (location.startsWith('/teacher-my-classes') || location.startsWith('/teacher-timetable') || location.startsWith('/teacher-homework') || location.startsWith('/teacher-marks')) return 2;
    if (location.startsWith('/teacher-messages')) return 3;
    if (location.startsWith('/teacher-profile') || location.startsWith('/teacher-id-card') || location.startsWith('/teacher-documents')) return 4;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/teacher-dashboard');
        break;
      case 1:
        context.go('/teacher-self-attendance');
        break;
      case 2:
        context.go('/teacher-my-classes');
        break;
      case 3:
        context.go('/teacher-messages');
        break;
      case 4:
        context.go('/teacher-profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _calculateSelectedIndex(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF0F172A) : Colors.white,
          border: Border(top: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: selectedIndex,
          onTap: (index) => _onItemTapped(index, context),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: const Color(0xFF4C1D95),
          unselectedItemColor: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
          selectedLabelStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold),
          unselectedLabelStyle: GoogleFonts.inter(fontSize: 11),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              activeIcon: Icon(Icons.home_rounded),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.fingerprint_rounded),
              activeIcon: Icon(Icons.fingerprint_rounded),
              label: 'Attendance',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.class_outlined),
              activeIcon: Icon(Icons.class_rounded),
              label: 'Classes',
            ),
            BottomNavigationBarItem(
              icon: Badge(label: Text('3'), child: Icon(Icons.chat_bubble_outline_rounded)),
              activeIcon: Badge(label: Text('3'), child: Icon(Icons.chat_bubble_rounded)),
              label: 'Chat',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline_rounded),
              activeIcon: Icon(Icons.person_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
