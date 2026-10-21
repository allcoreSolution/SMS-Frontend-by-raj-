import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class StaffDocumentsScreen extends StatefulWidget {
  const StaffDocumentsScreen({super.key});

  @override
  State<StaffDocumentsScreen> createState() => _StaffDocumentsScreenState();
}

class _StaffDocumentsScreenState extends State<StaffDocumentsScreen> {
  String _selectedCategory = 'All';

  final List<Map<String, String>> _allDocuments = const [
    {'title': 'Official Employee ID Card', 'type': 'PDF / Badge', 'category': 'Identity', 'size': '1.2 MB', 'date': '12 Aug 2020', 'route': '/staff-id-card'},
    {'title': 'Official Appointment Letter', 'type': 'Official HR PDF', 'category': 'Official', 'size': '2.4 MB', 'date': '12 Aug 2020', 'route': ''},
    {'title': 'Joining & Verification Letter', 'type': 'Signed PDF', 'category': 'Official', 'size': '1.8 MB', 'date': '15 Aug 2020', 'route': ''},
    {'title': 'Experience & Conduct Certificate', 'type': 'Official PDF', 'category': 'Certificates', 'size': '1.5 MB', 'date': '10 Jan 2024', 'route': ''},
    {'title': 'May 2025 Monthly Salary Slip', 'type': 'Pay Receipt PDF', 'category': 'Salary', 'size': '850 KB', 'date': '31 May 2025', 'route': '/staff-salary'},
    {'title': 'Form 16 Tax Assessment (2024-25)', 'type': 'Government Tax', 'category': 'Salary', 'size': '3.1 MB', 'date': '15 Apr 2025', 'route': ''},
    {'title': 'Educational Degree Certificates', 'type': 'Verified Docs', 'category': 'Certificates', 'size': '4.2 MB', 'date': '10 Aug 2020', 'route': ''},
    {'title': 'Aadhaar & PAN Identity Copy', 'type': 'Govt Identity', 'category': 'Identity', 'size': '1.1 MB', 'date': '10 Aug 2020', 'route': ''},
  ];

  void _previewDocument(Map<String, String> doc) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final isDark = Theme.of(ctx).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF0F172A) : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Container(width: 44, height: 4, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: const Color(0xFF059669).withValues(alpha: 0.12), shape: BoxShape.circle),
                    child: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFF059669), size: 26),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(doc['title']!, style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                        Text('${doc['type']} • ${doc['size']}', style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    _metaRow('Issuer', 'Greenfield International School HQ', isDark),
                    _metaRow('Date of Issue', doc['date']!, isDark),
                    _metaRow('Security Verification', 'Verified & Stamp Sealed ✅', isDark),
                    _metaRow('Access Level', 'Employee Private Vault', isDark),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: SizedBox(
                      height: 48,
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFF059669)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () {
                          Navigator.pop(ctx);
                          if (doc['route']!.isNotEmpty) {
                            context.push(doc['route']!);
                          }
                        },
                        icon: const Icon(Icons.open_in_new_rounded, color: Color(0xFF059669), size: 18),
                        label: Text('Open Screen', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: const Color(0xFF059669))),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: SizedBox(
                      height: 48,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                        onPressed: () {
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Downloading ${doc['title']} PDF... 📄'),
                              backgroundColor: const Color(0xFF059669),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        icon: const Icon(Icons.file_download_rounded, color: Colors.white, size: 18),
                        label: Text('Download PDF', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _metaRow(String k, String v, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(k, style: GoogleFonts.inter(fontSize: 12, color: Colors.grey)),
          Text(v, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? const Color(0xFF0A0F1E) : const Color(0xFFF8FAFC);

    final filteredDocs = _selectedCategory == 'All'
        ? _allDocuments
        : _allDocuments.where((d) => d['category'] == _selectedCategory).toList();

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
        title: Text('My Documents Vault', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Vault Storage Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isDark
                        ? [const Color(0xFF064E3B), const Color(0xFF047857)]
                        : [const Color(0xFF059669), const Color(0xFF10B981)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [BoxShadow(color: const Color(0xFF059669).withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 4))],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), shape: BoxShape.circle),
                      child: const Icon(Icons.lock_rounded, color: Colors.white, size: 26),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('8 Official Vault Documents', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                          Text('Encrypted 256-bit AES Vault • 16.1 MB Total', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Category Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: ['All', 'Official', 'Salary', 'Certificates', 'Identity'].map((cat) {
                    final isSel = _selectedCategory == cat;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        selected: isSel,
                        label: Text(cat, style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold, color: isSel ? Colors.white : (isDark ? Colors.white70 : const Color(0xFF334155)))),
                        selectedColor: const Color(0xFF059669),
                        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                        side: BorderSide(color: isSel ? const Color(0xFF059669) : (isDark ? Colors.white10 : const Color(0xFFCBD5E1))),
                        onSelected: (_) => setState(() => _selectedCategory = cat),
                      ),
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 16),

              // Document List
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: filteredDocs.length,
                separatorBuilder: (_, _) => const SizedBox(height: 10),
                itemBuilder: (ctx, i) {
                  final doc = filteredDocs[i];
                  return Container(
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                    ),
                    child: ListTile(
                      onTap: () => _previewDocument(doc),
                      leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(color: const Color(0xFF059669).withValues(alpha: 0.12), shape: BoxShape.circle),
                        child: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFF059669), size: 20),
                      ),
                      title: Text(doc['title']!, style: GoogleFonts.outfit(fontSize: 14.5, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A))),
                      subtitle: Text('${doc['type']} • ${doc['size']} • ${doc['date']}', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.grey)),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.visibility_rounded, color: Color(0xFF059669), size: 20),
                            onPressed: () => _previewDocument(doc),
                            tooltip: 'Preview Document',
                          ),
                          IconButton(
                            icon: const Icon(Icons.file_download_rounded, color: Color(0xFF059669), size: 20),
                            onPressed: () {
                              if (doc['route']!.isNotEmpty) {
                                context.push(doc['route']!);
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Downloading ${doc['title']}... 📄'),
                                    backgroundColor: const Color(0xFF059669),
                                    behavior: SnackBarBehavior.floating,
                                  ),
                                );
                              }
                            },
                            tooltip: 'Download PDF',
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }
}
