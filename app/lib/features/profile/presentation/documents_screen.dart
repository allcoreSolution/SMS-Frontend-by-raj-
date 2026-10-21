import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/auth_service.dart';

class DocumentsScreen extends StatefulWidget {
  const DocumentsScreen({super.key});

  @override
  State<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  final Map<String, bool> _loadingMap = {};

  List<Map<String, dynamic>> _getStudentDocs(AuthService auth) {
    return [
      {
        'docField': 'photo',
        'title': 'Passport Size Photo',
        'desc': 'Official student passport picture',
        'path': auth.photo,
        'url': auth.photoUrl,
        'icon': Icons.face_rounded,
        'color': const Color(0xFF2563EB),
      },
      {
        'docField': 'aadhaarCard',
        'title': 'Aadhaar Card',
        'desc': 'Government issued national identity card',
        'path': auth.aadhaarCard,
        'url': auth.aadhaarCardUrl,
        'icon': Icons.credit_card_rounded,
        'color': const Color(0xFF10B981),
      },
      {
        'docField': 'birthCertificate',
        'title': 'Birth Certificate',
        'desc': 'Municipal Corporation birth registration proof',
        'path': auth.birthCertificate,
        'url': auth.birthCertificateUrl,
        'icon': Icons.cake_rounded,
        'color': const Color(0xFFF59E0B),
      },
      {
        'docField': 'transferCertificate',
        'title': 'Transfer Certificate (TC)',
        'desc': 'Attested school transfer certificate (TC)',
        'path': auth.transferCertificate,
        'url': auth.transferCertificateUrl,
        'icon': Icons.swap_horiz_rounded,
        'color': const Color(0xFFEF4444),
      },
      {
        'docField': 'previousMarksheet',
        'title': 'Previous Marksheet',
        'desc': 'Prior year academic mark statement',
        'path': auth.previousMarksheet,
        'url': auth.previousMarksheetUrl,
        'icon': Icons.grade_rounded,
        'color': const Color(0xFF8B5CF6),
      },
      {
        'docField': 'medicalCertificate',
        'title': 'Medical Certificate',
        'desc': 'Doctor fitness / health card certificate',
        'path': auth.medicalCertificate,
        'url': auth.medicalCertificateUrl,
        'icon': Icons.health_and_safety_rounded,
        'color': const Color(0xFF06B6D4),
      },
      {
        'docField': 'casteCertificate',
        'title': 'Caste Certificate',
        'desc': 'Category / Caste reservation proof',
        'path': auth.casteCertificate,
        'url': auth.casteCertificateUrl,
        'icon': Icons.verified_user_rounded,
        'color': const Color(0xFFD97706),
      },
      {
        'docField': 'addressProof',
        'title': 'Address Proof',
        'desc': 'Ration card / Electricity bill / Rent agreement',
        'path': auth.addressProof,
        'url': auth.addressProofUrl,
        'icon': Icons.location_on_rounded,
        'color': const Color(0xFF0EA5E9),
      },
    ];
  }

  // ── Upload / Update Dialog ────────────────────────────────────────────────
  void _uploadDocument(BuildContext context, String docField, String currentUrl, String title, bool isDark) {
    final textController = TextEditingController(text: currentUrl);

    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.cloud_upload_rounded, color: Color(0xFF2563EB)),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                currentUrl.isEmpty ? 'Upload $title' : 'Update $title',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Enter document URL or server file path:',
              style: GoogleFonts.inter(
                fontSize: 12.5,
                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: textController,
              style: GoogleFonts.inter(fontSize: 13, color: isDark ? Colors.white : Colors.black),
              decoration: InputDecoration(
                hintText: '/uploads/sample.pdf',
                hintStyle: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
                filled: true,
                fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                prefixIcon: const Icon(Icons.link_rounded, size: 20, color: Color(0xFF2563EB)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: Text('Cancel', style: GoogleFonts.inter(color: Colors.grey)),
          ),
          ElevatedButton.icon(
            onPressed: () async {
              final newUrl = textController.text.trim();
              if (newUrl.isEmpty) return;
              Navigator.pop(dialogCtx);

              setState(() => _loadingMap[docField] = true);
              final auth = AuthService.instance;
              final res = await auth.uploadDocument(docField: docField, docUrl: newUrl);
              setState(() => _loadingMap[docField] = false);

              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(res['message'] ?? '$title uploaded successfully!'),
                    backgroundColor: res['success'] == true ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                  ),
                );
              }
            },
            icon: const Icon(Icons.check_rounded, size: 18),
            label: Text(currentUrl.isEmpty ? 'Upload' : 'Update', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  // ── Delete / Remove Dialog ────────────────────────────────────────────────
  void _deleteDocument(BuildContext context, String docField, String title, bool isDark) {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.delete_outline_rounded, color: Color(0xFFEF4444)),
            const SizedBox(width: 10),
            Text(
              'Remove $title',
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        content: Text(
          'Are you sure you want to remove this document from your vault?',
          style: GoogleFonts.inter(
            fontSize: 13,
            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: Text('Cancel', style: GoogleFonts.inter(color: Colors.grey)),
          ),
          ElevatedButton.icon(
            onPressed: () async {
              Navigator.pop(dialogCtx);
              setState(() => _loadingMap[docField] = true);
              final auth = AuthService.instance;
              final res = await auth.deleteDocument(docField: docField);
              setState(() => _loadingMap[docField] = false);

              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(res['message'] ?? '$title removed successfully!'),
                    backgroundColor: res['success'] == true ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                  ),
                );
              }
            },
            icon: const Icon(Icons.delete_forever_rounded, size: 18),
            label: Text('Remove', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  // ── Document Preview Dialog ───────────────────────────────────────────────
  void _showDocumentPreviewDialog(BuildContext context, String title, String url, bool isDark) {
    if (url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('$title is not uploaded yet.'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        child: Container(
          width: double.infinity,
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.8),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.4),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.description_rounded, color: Color(0xFF2563EB), size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        title,
                        style: GoogleFonts.outfit(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, size: 22),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
              ),
              Flexible(
                child: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        url,
                        fit: BoxFit.contain,
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return const SizedBox(
                            height: 200,
                            child: Center(
                              child: CircularProgressIndicator(color: Color(0xFF2563EB)),
                            ),
                          );
                        },
                        errorBuilder: (ctx, err, stack) => Container(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              const Icon(Icons.broken_image_rounded, size: 54, color: Colors.grey),
                              const SizedBox(height: 8),
                              Text(
                                'Unable to load document image.\nURL: $url',
                                textAlign: TextAlign.center,
                                style: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(14),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                    label: Text('Done Viewing', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) context.go('/profile');
      },
      child: Scaffold(
        backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
        appBar: AppBar(
          backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFF),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
            onPressed: () => context.go('/profile'),
          ),
          title: Text(
            'My Documents & Certs',
            style: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          elevation: 0,
        ),
        body: ListenableBuilder(
          listenable: AuthService.instance,
          builder: (context, _) {
            final auth = AuthService.instance;
            final docs = _getStudentDocs(auth);

            final uploadedCount = docs.where((d) => (d['path'] as String).isNotEmpty).length;
            final missingCount = docs.length - uploadedCount;

            return Column(
              children: [
                // ── Stats Row ────────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                  child: Row(
                    children: [
                      _statChip(isDark, '$uploadedCount', 'Uploaded', const Color(0xFF10B981)),
                      const SizedBox(width: 10),
                      _statChip(isDark, '$missingCount', 'Not Uploaded', const Color(0xFFEF4444)),
                    ],
                  ),
                ),

                // ── Document List ─────────────────────────────────────────
                Expanded(
                  child: ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                    itemCount: docs.length,
                    itemBuilder: (context, index) {
                      final doc = docs[index];
                      final docField = doc['docField'] as String;
                      final color = doc['color'] as Color;
                      final path = doc['path'] as String;
                      final url = doc['url'] as String;
                      final isUploaded = path.isNotEmpty;
                      final isLoading = _loadingMap[docField] == true;

                      final statusText = isUploaded ? 'Uploaded ✅' : 'Not Uploaded ❌';
                      final statusColor = isUploaded ? const Color(0xFF10B981) : const Color(0xFFEF4444);

                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1E293B) : Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.03),
                              blurRadius: 10,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                color: color.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: isLoading
                                  ? const Padding(
                                      padding: EdgeInsets.all(12),
                                      child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF2563EB)),
                                    )
                                  : Icon(doc['icon'] as IconData, color: color, size: 24),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    doc['title'] as String,
                                    style: GoogleFonts.outfit(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14.5,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                  ),
                                  Text(
                                    doc['desc'] as String,
                                    style: GoogleFonts.inter(
                                      fontSize: 11.5,
                                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                    ),
                                  ),
                                  const SizedBox(height: 5),
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: statusColor.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                        child: Text(
                                          statusText,
                                          style: GoogleFonts.inter(
                                            fontSize: 10.5,
                                            fontWeight: FontWeight.bold,
                                            color: statusColor,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            // Action buttons: Upload/Update, View, Delete
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // View Button
                                if (isUploaded)
                                  IconButton(
                                    icon: const Icon(Icons.visibility_rounded, color: Color(0xFF2563EB), size: 20),
                                    tooltip: 'View Document',
                                    onPressed: () => _showDocumentPreviewDialog(context, doc['title'] as String, url, isDark),
                                  ),
                                // Upload / Update Button
                                IconButton(
                                  icon: Icon(isUploaded ? Icons.edit_note_rounded : Icons.upload_file_rounded,
                                      color: isUploaded ? const Color(0xFFF59E0B) : const Color(0xFF10B981), size: 20),
                                  tooltip: isUploaded ? 'Update Document' : 'Upload Document',
                                  onPressed: () => _uploadDocument(context, docField, path, doc['title'] as String, isDark),
                                ),
                                // Delete Button
                                if (isUploaded)
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFEF4444), size: 20),
                                    tooltip: 'Remove Document',
                                    onPressed: () => _deleteDocument(context, docField, doc['title'] as String, isDark),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _statChip(bool isDark, String count, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.25)),
        ),
        child: Column(
          children: [
            Text(
              count,
              style: GoogleFonts.outfit(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 11,
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
