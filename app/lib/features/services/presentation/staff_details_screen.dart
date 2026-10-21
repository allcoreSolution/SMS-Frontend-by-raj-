import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

class StaffDetailsScreen extends StatefulWidget {
  const StaffDetailsScreen({super.key});

  @override
  State<StaffDetailsScreen> createState() => _StaffDetailsScreenState();
}

class _StaffDetailsScreenState extends State<StaffDetailsScreen> {
  String _searchQuery = '';
  String _selectedDepartment = 'All';

  final List<String> _departments = [
    'All',
    'Teachers',
    'Administration',
    'Sports & Fitness',
    'Management',
  ];

  final List<Map<String, dynamic>> _staffList = [
    {
      'id': 'STF001',
      'name': 'Dr. Rajesh Sharma',
      'designation': 'Head of Mathematics Dept',
      'department': 'Teachers',
      'subject': 'Higher Mathematics & Calculus',
      'qualification': 'Ph.D. in Mathematics, M.Sc. (IIT Delhi)',
      'experience': '14 Years',
      'phone': '+91 98765 43210',
      'email': 'rajesh.sharma@greenwood.edu',
      'room': 'Block A - Room 204',
      'status': 'Present',
      'isOnline': true,
      'timing': '08:00 AM - 03:00 PM',
      'bio': 'Passionate Mathematics Educator specializing in Board exam preparation and JEE Advanced coaching.',
    },
    {
      'id': 'STF002',
      'name': 'Prof. Ananya Verma',
      'designation': 'Senior Physics Lecturer',
      'department': 'Teachers',
      'subject': 'Physics & Mechanics',
      'qualification': 'M.Sc. Physics, B.Ed.',
      'experience': '10 Years',
      'phone': '+91 98123 45678',
      'email': 'ananya.verma@greenwood.edu',
      'room': 'Science Lab 2',
      'status': 'Present',
      'isOnline': true,
      'timing': '08:30 AM - 03:30 PM',
      'bio': 'Lead Physics researcher and mentor for Olympiad students. Expert in experimental physics.',
    },
    {
      'id': 'STF003',
      'name': 'Dr. Anita Saxena',
      'designation': 'School Principal',
      'department': 'Management',
      'subject': 'Institutional Leadership',
      'qualification': 'Ph.D. Education Administration, M.A.',
      'experience': '22 Years',
      'phone': '+91 141 2780123',
      'email': 'principal@greenwood.edu',
      'room': 'Principal Cabin - Admin Block',
      'status': 'In Office',
      'isOnline': true,
      'timing': '09:00 AM - 04:30 PM',
      'bio': 'National Awardee Educator committed to holistic student development and tech-integrated schooling.',
    },
    {
      'id': 'STF004',
      'name': 'Er. Vikram Singh',
      'designation': 'Chemistry & Lab Incharge',
      'department': 'Teachers',
      'subject': 'Organic & Inorganic Chemistry',
      'qualification': 'B.Tech Chemical, M.Sc.',
      'experience': '8 Years',
      'phone': '+91 97654 32109',
      'email': 'vikram.singh@greenwood.edu',
      'room': 'Chemistry Lab Block B',
      'status': 'Present',
      'isOnline': true,
      'timing': '08:00 AM - 03:00 PM',
      'bio': 'Interactive chemistry teacher focusing on practical experiments and NEET organic chemistry.',
    },
    {
      'id': 'STF005',
      'name': 'Coach Mahendra Rawat',
      'designation': 'Director of Physical Education',
      'department': 'Sports & Fitness',
      'subject': 'Basketball & Track Athletics',
      'qualification': 'M.P.Ed., NIS Certified Coach',
      'experience': '12 Years',
      'phone': '+91 99887 76655',
      'email': 'sports@greenwood.edu',
      'room': 'Sports Complex Office',
      'status': 'On Ground',
      'isOnline': true,
      'timing': '07:30 AM - 04:00 PM',
      'bio': 'Former state-level basketball player training school teams for CBSE National Championships.',
    },
    {
      'id': 'STF006',
      'name': 'Ms. Sunita Agarwal',
      'designation': 'Chief Accounts Officer',
      'department': 'Administration',
      'subject': 'Fee & Finance Management',
      'qualification': 'M.Com, Chartered Accountant (Inter)',
      'experience': '15 Years',
      'phone': '+91 94140 11223',
      'email': 'accounts@greenwood.edu',
      'room': 'Accounts Office - Counter 1',
      'status': 'In Office',
      'isOnline': false,
      'timing': '09:00 AM - 05:00 PM',
      'bio': 'Head of student fee administration, scholarships, and institutional financial audit.',
    },
    {
      'id': 'STF007',
      'name': 'Prof. Kavita Sen',
      'designation': 'Senior English & Literature Teacher',
      'department': 'Teachers',
      'subject': 'English Grammar & Literature',
      'qualification': 'M.A. English, B.Ed.',
      'experience': '11 Years',
      'phone': '+91 98290 88776',
      'email': 'kavita.sen@greenwood.edu',
      'room': 'Block B - Room 102',
      'status': 'Present',
      'isOnline': true,
      'timing': '08:00 AM - 03:00 PM',
      'bio': 'Expert in communication skills, debate club mentor, and CBSE Board paper evaluator.',
    },
  ];

  List<Map<String, dynamic>> get _filteredStaff {
    return _staffList.where((staff) {
      final matchesDept = _selectedDepartment == 'All' || staff['department'] == _selectedDepartment;
      final query = _searchQuery.toLowerCase().trim();
      final matchesSearch = query.isEmpty ||
          staff['name'].toString().toLowerCase().contains(query) ||
          staff['designation'].toString().toLowerCase().contains(query) ||
          staff['subject'].toString().toLowerCase().contains(query) ||
          staff['phone'].toString().toLowerCase().contains(query);
      return matchesDept && matchesSearch;
    }).toList();
  }

  void _showStaffDetailModal(BuildContext context, Map<String, dynamic> staff) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.3),
                blurRadius: 20,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          padding: const EdgeInsets.all(22),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Modal Handle Bar
                Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white24 : Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                const SizedBox(height: 18),

                // Staff Header Profile Box
                Row(
                  children: [
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 36,
                          backgroundColor: const Color(0xFF2563EB).withValues(alpha: 0.15),
                          child: Text(
                            staff['name'].toString().substring(0, 2).toUpperCase(),
                            style: GoogleFonts.outfit(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFF2563EB),
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 2,
                          right: 2,
                          child: Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              color: staff['isOnline'] == true ? const Color(0xFF10B981) : Colors.grey,
                              shape: BoxShape.circle,
                              border: Border.all(color: isDark ? const Color(0xFF1E293B) : Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            staff['name'],
                            style: GoogleFonts.outfit(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            staff['designation'],
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF2563EB),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              'Status: ${staff['status']}',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF10B981),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),
                const Divider(),
                const SizedBox(height: 14),

                // Details Grid Box
                _detailTile(context, Icons.book_rounded, 'Subject / Specialization', staff['subject'], isDark),
                _detailTile(context, Icons.school_rounded, 'Qualification', staff['qualification'], isDark),
                _detailTile(context, Icons.work_history_rounded, 'Teaching Experience', staff['experience'], isDark),
                _detailTile(context, Icons.location_on_rounded, 'Office Room Location', staff['room'], isDark),
                _detailTile(context, Icons.access_time_filled_rounded, 'Available Hours', staff['timing'], isDark),
                _detailTile(context, Icons.phone_rounded, 'Contact Phone', staff['phone'], isDark),
                _detailTile(context, Icons.email_rounded, 'Email Address', staff['email'], isDark),

                const SizedBox(height: 12),

                // Bio Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'About & Biography',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        staff['bio'],
                        style: GoogleFonts.inter(
                          fontSize: 12.5,
                          color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                          height: 1.35,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Action Buttons Row
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Calling ${staff['name']} (${staff['phone']})...'),
                              backgroundColor: const Color(0xFF10B981),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        icon: const Icon(Icons.call_rounded, size: 18),
                        label: Text('Call Now', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Opening email app for ${staff['email']}...'),
                              backgroundColor: const Color(0xFF2563EB),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        icon: const Icon(Icons.email_rounded, size: 18),
                        label: Text('Send Email', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _detailTile(BuildContext context, IconData icon, String title, String value, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF2563EB).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 18, color: const Color(0xFF2563EB)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  value,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final filtered = _filteredStaff;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/dashboard');
      },
      child: Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        elevation: 0,
        title: Text(
          'School Staff Directory',
          style: GoogleFonts.outfit(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Bar & Filter Chips Header Container
            Container(
              padding: const EdgeInsets.fromLTRB(18, 10, 18, 14),
              child: Column(
                children: [
                  // 1. Search Box Input
                  TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: GoogleFonts.inter(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                    decoration: InputDecoration(
                      hintText: 'Search staff by name, subject, or role...',
                      hintStyle: GoogleFonts.inter(fontSize: 13, color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8)),
                      prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF2563EB)),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              onPressed: () => setState(() => _searchQuery = ''),
                            )
                          : null,
                      filled: true,
                      fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                      contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF2563EB), width: 1.5),
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // 2. Department Horizontal Filter Chips
                  SizedBox(
                    height: 38,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      itemCount: _departments.length,
                      itemBuilder: (context, index) {
                        final dept = _departments[index];
                        final isSelected = dept == _selectedDepartment;

                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            selected: isSelected,
                            label: Text(
                              dept,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                color: isSelected
                                    ? Colors.white
                                    : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                              ),
                            ),
                            selectedColor: const Color(0xFF2563EB),
                            backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                            checkmarkColor: Colors.white,
                            side: BorderSide(
                              color: isSelected
                                  ? const Color(0xFF2563EB)
                                  : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                            ),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            onSelected: (val) => setState(() => _selectedDepartment = dept),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // Staff List Grid / Cards Container
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.person_search_rounded, size: 54, color: isDark ? Colors.white24 : Colors.grey.shade400),
                          const SizedBox(height: 12),
                          Text(
                            'No staff members found',
                            style: GoogleFonts.outfit(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(18, 0, 18, 20),
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final staff = filtered[index];

                        return Container(
                          margin: const EdgeInsets.only(bottom: 14),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: Material(
                            color: Colors.transparent,
                            borderRadius: BorderRadius.circular(20),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(20),
                              onTap: () => _showStaffDetailModal(context, staff),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  children: [
                                    Row(
                                      children: [
                                        // Staff Avatar Box
                                        Stack(
                                          children: [
                                            CircleAvatar(
                                              radius: 26,
                                              backgroundColor: const Color(0xFF2563EB).withValues(alpha: 0.15),
                                              child: Text(
                                                staff['name'].toString().substring(0, 2).toUpperCase(),
                                                style: GoogleFonts.outfit(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.bold,
                                                  color: const Color(0xFF2563EB),
                                                ),
                                              ),
                                            ),
                                            Positioned(
                                              bottom: 0,
                                              right: 0,
                                              child: Container(
                                                width: 12,
                                                height: 12,
                                                decoration: BoxDecoration(
                                                  color: staff['isOnline'] == true
                                                      ? const Color(0xFF10B981)
                                                      : Colors.grey,
                                                  shape: BoxShape.circle,
                                                  border: Border.all(
                                                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                                                      width: 2),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(width: 14),

                                        // Staff Info
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                children: [
                                                  Expanded(
                                                    child: Text(
                                                      staff['name'],
                                                      maxLines: 1,
                                                      overflow: TextOverflow.ellipsis,
                                                      style: GoogleFonts.outfit(
                                                        fontSize: 16.5,
                                                        fontWeight: FontWeight.bold,
                                                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                                                      ),
                                                    ),
                                                  ),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                    decoration: BoxDecoration(
                                                      color: const Color(0xFF8B5CF6).withValues(alpha: 0.12),
                                                      borderRadius: BorderRadius.circular(10),
                                                    ),
                                                    child: Text(
                                                      staff['department'],
                                                      style: GoogleFonts.inter(
                                                        fontSize: 10.5,
                                                        fontWeight: FontWeight.bold,
                                                        color: const Color(0xFF8B5CF6),
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                staff['designation'],
                                                style: GoogleFonts.inter(
                                                  fontSize: 12.5,
                                                  fontWeight: FontWeight.w600,
                                                  color: const Color(0xFF2563EB),
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                '📚 ${staff['subject']}',
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: GoogleFonts.inter(
                                                  fontSize: 11.5,
                                                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),

                                    const SizedBox(height: 12),
                                    const Divider(height: 1),
                                    const SizedBox(height: 10),

                                    // Quick Bottom Row in Box
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Row(
                                            children: [
                                              const Icon(Icons.room_rounded, size: 14, color: Color(0xFFF97316)),
                                              const SizedBox(width: 4),
                                              Expanded(
                                                child: Text(
                                                  staff['room'],
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: GoogleFonts.inter(
                                                    fontSize: 11.5,
                                                    fontWeight: FontWeight.w500,
                                                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Row(
                                          children: [
                                            Text(
                                              'View Details',
                                              style: GoogleFonts.inter(
                                                fontSize: 11.5,
                                                fontWeight: FontWeight.bold,
                                                color: const Color(0xFF2563EB),
                                              ),
                                            ),
                                            const SizedBox(width: 2),
                                            const Icon(Icons.arrow_forward_ios_rounded, size: 10, color: Color(0xFF2563EB)),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ).animate().fadeIn(duration: 350.ms, delay: (index * 50).ms).slideY(begin: 0.08);
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
