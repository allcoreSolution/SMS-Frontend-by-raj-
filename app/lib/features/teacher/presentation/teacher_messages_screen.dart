import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:studets_app/core/theme/app_theme.dart';

class TeacherMessagesScreen extends StatefulWidget {
  const TeacherMessagesScreen({super.key});

  @override
  State<TeacherMessagesScreen> createState() => _TeacherMessagesScreenState();
}

class _TeacherMessagesScreenState extends State<TeacherMessagesScreen> {
  String _searchQuery = '';
  int _selectedFilter = 0;
  final List<String> _filters = ['All Chats', 'Unread', 'Groups', 'Official'];

  final List<Map<String, dynamic>> _chats = [
    {
      'name': 'Principal Office',
      'role': 'School Principal',
      'message': 'Please submit the Unit Test papers by 4:00 PM today.',
      'time': '10:30 AM',
      'unread': 2,
      'isOnline': true,
      'isGroup': false,
      'isOfficial': true,
      'avatarBg': const Color(0xFFEDE9FE),
      'avatarColor': AppTheme.teacherPurple,
      'initials': 'P',
      'history': [
        {'text': 'Good morning Mr. Sharma.', 'isMe': false, 'time': '10:15 AM'},
        {'text': 'Good morning Sir!', 'isMe': true, 'time': '10:20 AM'},
        {'text': 'Please submit the Unit Test papers by 4:00 PM today.', 'isMe': false, 'time': '10:30 AM'},
      ]
    },
    {
      'name': 'Admin Office',
      'role': 'Administration Desk',
      'message': 'Annual Day preparations meeting scheduled for tomorrow.',
      'time': '09:15 AM',
      'unread': 0,
      'isOnline': true,
      'isGroup': false,
      'isOfficial': true,
      'avatarBg': const Color(0xFFDBEAFE),
      'avatarColor': const Color(0xFF2563EB),
      'initials': 'A',
      'history': [
        {'text': 'Annual Day preparations meeting scheduled for tomorrow.', 'isMe': false, 'time': '09:15 AM'},
      ]
    },
    {
      'name': 'Senior Staff Group',
      'role': '48 Faculty Members',
      'message': 'Mr. Verma: Shared the updated academic calendar PDF.',
      'time': 'Yesterday',
      'unread': 5,
      'isOnline': false,
      'isGroup': true,
      'isOfficial': false,
      'avatarBg': const Color(0xFFD1FAE5),
      'avatarColor': const Color(0xFF10B981),
      'initials': 'SG',
      'history': [
        {'text': 'Shared the updated academic calendar PDF.', 'isMe': false, 'time': 'Yesterday'},
      ]
    },
    {
      'name': 'Exam Cell Dept',
      'role': 'Examination Control',
      'message': 'Exam duty roster & seating plan is updated for Class 10.',
      'time': 'Yesterday',
      'unread': 0,
      'isOnline': false,
      'isGroup': false,
      'isOfficial': true,
      'avatarBg': const Color(0xFFFEF3C7),
      'avatarColor': const Color(0xFFF59E0B),
      'initials': 'EC',
      'history': [
        {'text': 'Exam duty roster & seating plan is updated for Class 10.', 'isMe': false, 'time': 'Yesterday'},
      ]
    },
    {
      'name': 'HOD Mathematics',
      'role': 'Dept. Head',
      'message': 'Let us review the Class 12 prelim syllabus tomorrow.',
      'time': '04 May',
      'unread': 0,
      'isOnline': true,
      'isGroup': false,
      'isOfficial': false,
      'avatarBg': const Color(0xFFF3E8FF),
      'avatarColor': const Color(0xFF8B5CF6),
      'initials': 'HM',
      'history': [
        {'text': 'Let us review the Class 12 prelim syllabus tomorrow.', 'isMe': false, 'time': '04 May'},
      ]
    },
  ];

  void _openChatConversationSheet(Map<String, dynamic> chat) {
    final msgCtrl = TextEditingController();
    final List<Map<String, dynamic>> history = List.from(chat['history'] as List);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setSheetState) {
          return Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
            child: Container(
              height: MediaQuery.of(context).size.height * 0.82,
              decoration: BoxDecoration(
                color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                children: [
                  // Sheet Header
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                    decoration: BoxDecoration(
                      color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 4)],
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: chat['avatarBg'] as Color,
                          child: Text(chat['initials'] as String, style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: chat['avatarColor'] as Color)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(chat['name'] as String, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
                              Row(
                                children: [
                                  Container(
                                    width: 7, height: 7,
                                    decoration: BoxDecoration(
                                      color: chat['isOnline'] == true ? const Color(0xFF10B981) : Colors.grey,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    chat['isOnline'] == true ? 'Active Online' : 'Offline',
                                    style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 20),
                          onPressed: () => context.pop(),
                        ),
                      ],
                    ),
                  ),

                  // Messages ListView
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      physics: const BouncingScrollPhysics(),
                      itemCount: history.length,
                      itemBuilder: (context, index) {
                        final msg = history[index];
                        final isMe = msg['isMe'] as bool;

                        return Align(
                          alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.76),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: isMe
                                  ? AppTheme.teacherPurple
                                  : (Theme.of(context).brightness == Brightness.dark ? const Color(0xFF1E293B) : Colors.white),
                              borderRadius: BorderRadius.only(
                                topLeft: const Radius.circular(16),
                                topRight: const Radius.circular(16),
                                bottomLeft: isMe ? const Radius.circular(16) : const Radius.circular(4),
                                bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(16),
                              ),
                              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 4)],
                            ),
                            child: Column(
                              crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                              children: [
                                Text(
                                  msg['text'] as String,
                                  style: GoogleFonts.inter(fontSize: 13, color: isMe ? Colors.white : null, height: 1.35),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  msg['time'] as String,
                                  style: GoogleFonts.inter(fontSize: 10, color: isMe ? Colors.white70 : Colors.grey),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  // Message Input Bar
                  Container(
                    padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF1E293B) : Colors.white,
                      border: Border(top: BorderSide(color: Theme.of(context).brightness == Brightness.dark ? Colors.white10 : const Color(0xFFE2E8F0))),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.attach_file_rounded, color: Colors.grey, size: 22),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Attach File / Photo 📎')),
                            );
                          },
                        ),
                        Expanded(
                          child: TextField(
                            controller: msgCtrl,
                            onChanged: (_) => setSheetState(() {}),
                            style: GoogleFonts.inter(fontSize: 13.5),
                            decoration: InputDecoration(
                              hintText: 'Type a message…',
                              hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                              filled: true,
                              fillColor: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: msgCtrl.text.trim().isNotEmpty
                              ? () {
                                  final text = msgCtrl.text.trim();
                                  setSheetState(() {
                                    history.add({
                                      'text': text,
                                      'isMe': true,
                                      'time': 'Just now',
                                    });
                                  });
                                  setState(() {
                                    chat['message'] = text;
                                    chat['time'] = 'Just now';
                                    chat['unread'] = 0;
                                  });
                                  msgCtrl.clear();
                                }
                              : null,
                          child: Container(
                            padding: const EdgeInsets.all(11),
                            decoration: BoxDecoration(
                              color: msgCtrl.text.trim().isNotEmpty ? AppTheme.teacherPurple : Colors.grey.shade300,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.send_rounded, size: 18, color: msgCtrl.text.trim().isNotEmpty ? Colors.white : Colors.grey.shade600),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final filtered = _chats.where((c) {
      final query = _searchQuery.toLowerCase();
      final matchQuery = query.isEmpty ||
          (c['name'] as String).toLowerCase().contains(query) ||
          (c['message'] as String).toLowerCase().contains(query);

      if (!matchQuery) return false;
      if (_selectedFilter == 1) return (c['unread'] as int) > 0;
      if (_selectedFilter == 2) return c['isGroup'] == true;
      if (_selectedFilter == 3) return c['isOfficial'] == true;
      return true;
    }).toList();

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
        title: Text('Teacher Chat Hub', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // ════════════════ QUICK ONLINE CONTACTS ════════════════
            Container(
              height: 80,
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: _chats.length,
                itemBuilder: (context, index) {
                  final chat = _chats[index];
                  return GestureDetector(
                    onTap: () => _openChatConversationSheet(chat),
                    child: Padding(
                      padding: const EdgeInsets.only(right: 16),
                      child: Column(
                        children: [
                          Stack(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: chat['avatarBg'] as Color,
                                child: Text(chat['initials'] as String, style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: chat['avatarColor'] as Color)),
                              ),
                              if (chat['isOnline'] == true)
                                Positioned(
                                  bottom: 0, right: 0,
                                  child: Container(
                                    width: 12, height: 12,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF10B981),
                                      shape: BoxShape.circle,
                                      border: Border.all(color: isDark ? const Color(0xFF0A0F1E) : Colors.white, width: 2),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            (chat['name'] as String).split(' ').first,
                            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : const Color(0xFF475569)),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
              child: Container(
                height: 42,
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 6)],
                ),
                child: TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                  decoration: InputDecoration(
                    hintText: 'Search chats or messages…',
                    hintStyle: GoogleFonts.inter(fontSize: 13, color: Colors.grey),
                    prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.teacherPurple, size: 18),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 11),
                  ),
                ),
              ),
            ),

            // Filter Chips
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
              child: Row(
                children: List.generate(_filters.length, (index) {
                  final selected = _selectedFilter == index;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(_filters[index]),
                      selected: selected,
                      selectedColor: AppTheme.teacherPurple,
                      backgroundColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                      labelStyle: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: selected ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF475569)),
                      ),
                      onSelected: (val) => setState(() => _selectedFilter = index),
                    ),
                  );
                }),
              ),
            ),

            // Chat List
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                physics: const BouncingScrollPhysics(),
                itemCount: filtered.length,
                separatorBuilder: (_, i) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final chat = filtered[index];
                  final unread = chat['unread'] as int;

                  return Container(
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.12 : 0.03), blurRadius: 6)],
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      leading: Stack(
                        children: [
                          CircleAvatar(
                            radius: 23,
                            backgroundColor: chat['avatarBg'] as Color,
                            child: Text(
                              chat['initials'] as String,
                              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: chat['avatarColor'] as Color),
                            ),
                          ),
                          if (chat['isOnline'] == true)
                            Positioned(
                              bottom: 0, right: 0,
                              child: Container(
                                width: 12, height: 12,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: isDark ? const Color(0xFF1E293B) : Colors.white, width: 2),
                                ),
                              ),
                            ),
                        ],
                      ),
                      title: Row(
                        children: [
                          Expanded(
                            child: Text(
                              chat['name'] as String,
                              style: GoogleFonts.outfit(fontSize: 15.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                            ),
                          ),
                          Text(chat['time'] as String, style: GoogleFonts.inter(fontSize: 11, color: unread > 0 ? AppTheme.teacherPurple : Colors.grey)),
                        ],
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                chat['message'] as String,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(fontSize: 12, color: unread > 0 ? (isDark ? Colors.white : const Color(0xFF0F172A)) : Colors.grey, fontWeight: unread > 0 ? FontWeight.bold : FontWeight.normal),
                              ),
                            ),
                            if (unread > 0) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                decoration: BoxDecoration(color: AppTheme.teacherPurple, borderRadius: BorderRadius.circular(10)),
                                child: Text(
                                  '$unread',
                                  style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      onTap: () => _openChatConversationSheet(chat),
                    ),
                  ).animate().fadeIn(duration: 300.ms, delay: (index * 25).ms);
                },
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }
}
