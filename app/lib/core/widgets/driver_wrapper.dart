import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DriverWrapper extends StatefulWidget {
  final Widget child;
  const DriverWrapper({super.key, required this.child});

  @override
  State<DriverWrapper> createState() => _DriverWrapperState();
}

class _DriverWrapperState extends State<DriverWrapper> {
  DateTime? _lastBackPressTime;

  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.path;
    if (location == '/driver-dashboard') return 0;
    if (location.startsWith('/driver-tracking')) return 1;
    if (location.startsWith('/driver-contacts')) return 2;
    if (location.startsWith('/driver-attendance')) return 3;
    if (location.startsWith('/driver-profile') ||
        location.startsWith('/driver-documents') ||
        location.startsWith('/driver-id-card') ||
        location.startsWith('/driver-salary') ||
        location.startsWith('/driver-settings') ||
        location.startsWith('/driver-leaves')) {
      return 4;
    }
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/driver-dashboard');
        break;
      case 1:
        context.go('/driver-tracking');
        break;
      case 2:
        context.go('/driver-contacts');
        break;
      case 3:
        context.go('/driver-attendance');
        break;
      case 4:
        context.go('/driver-profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _calculateSelectedIndex(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        final String location = GoRouterState.of(context).uri.path;
        if (location != '/driver-dashboard') {
          context.go('/driver-dashboard');
        } else {
          final now = DateTime.now();
          if (_lastBackPressTime == null || now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
            _lastBackPressTime = now;
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Press back again to exit Driver Portal'),
                duration: Duration(seconds: 2),
                behavior: SnackBarBehavior.floating,
                backgroundColor: Color(0xFFEA580C),
              ),
            );
          } else {
            context.go('/role-selection');
          }
        }
      },
      child: Scaffold(
        body: widget.child,
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF0F172A) : Colors.white,
            border: Border(top: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0))),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
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
            selectedItemColor: const Color(0xFFEA580C),
            unselectedItemColor: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
            selectedFontSize: 12,
            unselectedFontSize: 12,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined),
                activeIcon: Icon(Icons.dashboard_rounded),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.gps_fixed_rounded),
                activeIcon: Icon(Icons.gps_fixed_rounded),
                label: 'Live Track',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.quick_contacts_dialer_outlined),
                activeIcon: Icon(Icons.quick_contacts_dialer_rounded),
                label: 'Contacts',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.event_available_outlined),
                activeIcon: Icon(Icons.event_available_rounded),
                label: 'Self Attendance',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline_rounded),
                activeIcon: Icon(Icons.person_rounded),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
