import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class StaffMessagesScreen extends StatelessWidget {
  const StaffMessagesScreen({super.key});

  final List<Map<String, String>> _messages = const [
    {'sender': 'Principal Dr. Anita Saxena', 'preview': 'Staff Monthly Performance & Accounts Review meeting tomorrow.', 'time': '10:30 AM', 'isUnread': 'true'},
    {'sender': 'HR Department', 'preview': 'May 2025 Salary Slip has been uploaded to your documents vault.', 'time': 'Yesterday', 'isUnread': 'true'},
    {'sender': 'Admin & IT Desk', 'preview': 'System maintenance scheduled for Sunday 11:00 PM.', 'time': '20 May', 'isUnread': 'false'},
    {'sender': 'System Notifications', 'preview': 'Leave application for May 26 is pending approval.', 'time': '18 May', 'isUnread': 'false'},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/staff-dashboard');
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
              context.go('/staff-dashboard');
            }
          },
        ),
        title: Text('Employee Messages', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: _messages.length,
          separatorBuilder: (_, _) => const SizedBox(height: 10),
          itemBuilder: (ctx, i) {
            final msg = _messages[i];
            final isUnread = msg['isUnread'] == 'true';

            return Container(
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
              ),
              child: ListTile(
                leading: Stack(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(color: Color(0xFFD1FAE5), shape: BoxShape.circle),
                      child: const Icon(Icons.mark_chat_unread_rounded, color: Color(0xFF059669), size: 22),
                    ),
                    if (isUnread)
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                        ),
                      ),
                  ],
                ),
                title: Text(msg['sender']!, style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: isUnread ? FontWeight.bold : FontWeight.w600, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                subtitle: Text(msg['preview']!, maxLines: 1, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                trailing: Text(msg['time']!, style: GoogleFonts.inter(fontSize: 10.5, color: Colors.grey)),
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: Text(msg['sender']!, style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
                      content: Text(msg['preview']!, style: GoogleFonts.inter(fontSize: 14)),
                      actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close'))],
                    ),
                  );
                },
              ),
            );
          },
        ),
      ),
    ),
    );
  }
}
