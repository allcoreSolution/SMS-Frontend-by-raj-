import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LeaveModel {
  final String id;
  final String leaveType;
  final String fromDate;
  final String toDate;
  final String reason;
  final String status; // 'Pending', 'Approved', 'Rejected'
  final String appliedDate;
  final String? attachment;

  LeaveModel({
    required this.id,
    required this.leaveType,
    required this.fromDate,
    required this.toDate,
    required this.reason,
    required this.status,
    required this.appliedDate,
    this.attachment,
  });
}

class ComplaintModel {
  final String id;
  final String category;
  final String description;
  final String status; // 'Pending', 'In Progress', 'Resolved'
  final String date;
  final String? attachment;

  ComplaintModel({
    required this.id,
    required this.category,
    required this.description,
    required this.status,
    required this.date,
    this.attachment,
  });
}

class HomeworkModel {
  final String id;
  final String subject;
  final String title;
  final String description;
  final String dueDate;
  String status; // 'Pending', 'Submitted', 'Checked', 'Rejected'
  String? submittedFile;
  String? teacherRemarks;

  HomeworkModel({
    required this.id,
    required this.subject,
    required this.title,
    required this.description,
    required this.dueDate,
    required this.status,
    this.submittedFile,
    this.teacherRemarks,
  });
}

class StudentDataRepository extends ChangeNotifier {
  static final StudentDataRepository instance = StudentDataRepository._();
  StudentDataRepository._();

  List<LeaveModel> _leaveApplications = [];
  List<LeaveModel> get leaveApplications => List.unmodifiable(_leaveApplications);

  Future<void> fetchLeaves() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_student_token') ?? '';
      final studentId = prefs.getString('sp_student_id') ?? '';

      if (studentId.isEmpty) return;

      final res = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/leaves/my-leaves?studentId=$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        if (body['success'] == true && body['data'] != null) {
          final List<dynamic> data = body['data'];
          _leaveApplications = data.map((e) => LeaveModel(
            id: e['_id']?.substring(0, 8) ?? 'LV',
            leaveType: e['leaveType'] ?? 'Leave',
            fromDate: e['startDate'] != null ? e['startDate'].toString().substring(0, 10) : '',
            toDate: e['endDate'] != null ? e['endDate'].toString().substring(0, 10) : '',
            reason: e['reason'] ?? '',
            status: e['status'] ?? 'Pending',
            appliedDate: e['createdAt'] != null ? e['createdAt'].toString().substring(0, 10) : 'Today',
            attachment: e['attachmentUrl'],
          )).toList();
          
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Error fetching leaves: $e');
    }
  }

  Future<void> addLeaveApplication({
    required String leaveType,
    required String fromDate,
    required String toDate,
    required String reason,
    String? attachment,
  }) async {
    
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('sp_student_token') ?? '';
    final studentId = prefs.getString('sp_student_id') ?? '';

    if (studentId.isEmpty) return;

    try {
      final res = await http.post(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/leaves/apply'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'leaveType': leaveType,
          'startDate': fromDate,
          'endDate': toDate,
          'reason': reason,
          'studentId': studentId,
          // attachment missing here intentionally for simplicity, handle later
        }),
      );
      if (res.statusCode == 201) {
         fetchLeaves();
      }
    } catch(e) {
      debugPrint('Failed to add leave: $e');
    }
  }

  List<ComplaintModel> _complaints = [];
  List<ComplaintModel> get complaints => List.unmodifiable(_complaints);

  Future<void> fetchComplaints() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_student_token') ?? '';
      final studentId = prefs.getString('sp_student_id') ?? '';

      if (studentId.isEmpty) return;

      final res = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/tickets?raisedBy=$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        if (body['success'] == true && body['data'] != null) {
          final List<dynamic> data = body['data'];
          _complaints = data.map((e) => ComplaintModel(
            id: e['_id']?.substring(0, 8) ?? 'CMP',
            category: e['category'] ?? 'Other',
            description: e['description'] ?? '',
            status: e['status'] ?? 'Open',
            date: e['createdAt'] != null ? e['createdAt'].toString().substring(0, 10) : 'Today',
            attachment: e['attachmentUrl'],
          )).toList();
          
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Error fetching complaints: $e');
    }
  }

  Future<void> addComplaint({
    required String category,
    required String description,
    String? attachment,
  }) async {
    
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('sp_student_token') ?? '';
    final studentId = prefs.getString('sp_student_id') ?? '';

    if (studentId.isEmpty) return;

    try {
      final res = await http.post(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/tickets'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'title': '$category Complaint from Student',
          'category': category,
          'description': description,
          'raisedBy': studentId,
          // attachment missing here intentionally for simplicity, handle later
        }),
      );
      if (res.statusCode == 201) {
         fetchComplaints();
      }
    } catch(e) {
      debugPrint('Failed to add complaint: $e');
    }
  }

  // Dynamic Homework List mapped from API
  final List<HomeworkModel> _homeworkList = [];

  List<HomeworkModel> get homeworkList => List.unmodifiable(_homeworkList);

  Future<void> fetchStudentHomework() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_student_token') ?? '';
      
      final response = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/homework'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] != null) {
          _homeworkList.clear();
          for (var item in body['data']) {
            _homeworkList.add(HomeworkModel(
              id: item['_id']?.toString() ?? '',
              subject: item['subject']?.toString() ?? 'General',
              title: item['title']?.toString() ?? 'Homework Assignment',
              description: item['description']?.toString() ?? '',
              dueDate: item['submissionDate']?.toString() ?? item['dueDate']?.toString() ?? '',
              status: 'Pending',
            ));
          }
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Error fetching student homework from API: $e');
    }
  }

  void submitHomework(String id, String fileName) {
    final index = _homeworkList.indexWhere((h) => h.id == id);
    if (index != -1) {
      _homeworkList[index].status = 'Submitted';
      _homeworkList[index].submittedFile = fileName;
      notifyListeners();
    }
  }

  // Dynamic Fee Details State
  double _totalFee = 0;
  double _paidFee = 0;
  double _pendingFee = 0;

  double get totalFee => _totalFee;
  double get paidFee => _paidFee;
  double get pendingFee => _pendingFee;

  List<Map<String, String>> _paymentHistory = [];


  List<Map<String, String>> get paymentHistory => List.unmodifiable(_paymentHistory);

  Future<void> fetchFeeDetails() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_student_token') ?? '';
      final studentId = prefs.getString('sp_student_id') ?? '';

      if (studentId.isEmpty) return;

      // Fetch Dues
      final duesRes = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/search-due-fees/student/my-dues?studentId=$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (duesRes.statusCode == 200) {
        final dBody = jsonDecode(duesRes.body);
        if (dBody['success'] == true && dBody['data'] != null) {
          final List<dynamic> data = dBody['data'];
          if (data.isNotEmpty) {
            _totalFee = (data[0]['totalAssigned'] as num).toDouble();
            _paidFee = (data[0]['totalPaid'] as num).toDouble();
            _pendingFee = (data[0]['totalDue'] as num).toDouble();
          } else {
             _totalFee = 0; _paidFee = 0; _pendingFee = 0;
          }
        }
      }

      // Fetch Receipts
      final recRes = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/collect-fees/student/my-receipts?studentId=$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (recRes.statusCode == 200) {
        final rBody = jsonDecode(recRes.body);
        if (rBody['success'] == true && rBody['data'] != null) {
          final List<dynamic> data = rBody['data'];
          _paymentHistory = data.map((e) => {
             'title': e['feeGroup'] != null ? e['feeGroup']['name']?.toString() ?? 'Fee Payment' : 'Fee Payment',
             'amount': '₹ ${e['amountPaid']}',
             'date': e['createdAt'] != null ? e['createdAt'].toString().substring(0, 10) : 'Today',
             'status': 'Paid ✅',
             'receipt': e['receiptNo']?.toString() ?? 'REC-XXXX.pdf',
          }).toList();
        }
      }

      notifyListeners();
    } catch (e) {
      debugPrint('Error fetching live fee data: $e');
      // Set to 0 on failure so it stops loading
      _totalFee = 0;
      _paidFee = 0;
      _pendingFee = 0;
      _paymentHistory = [];
      notifyListeners();
    }
  }

  void payPendingFee(double amount, String paymentMethod) {
    // Optimistic UI update before actual payment processing integration clears it.
    if (_pendingFee > 0) {
      _paidFee += amount;
      _pendingFee -= amount;
      if (_pendingFee < 0) _pendingFee = 0;

      notifyListeners();
    }
  }

  // Attendance State
  List<Map<String, dynamic>> _attendanceLog = [];
  List<Map<String, dynamic>> get attendanceLog => List.unmodifiable(_attendanceLog);

  Future<void> fetchStudentAttendance() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_student_token') ?? '';
      final studentId = prefs.getString('sp_student_id') ?? '';

      if (studentId.isEmpty) return;

      final res = await http.get(
        Uri.parse('https://all-core-school-erp-backend.onrender.com/api/attendance/student/$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        if (body['success'] == true && body['data'] != null) {
          final List<dynamic> data = body['data'];
          _attendanceLog = data.map((e) => {
            'date': e['date']?.toString().substring(0, 10) ?? '',
            'status': e['status']?.toString() ?? 'Absent',
          }).toList();
          
          // Sort descending (newest first)
          _attendanceLog.sort((a, b) => b['date'].compareTo(a['date']));
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Error fetching student attendance: $e');
    }
  }
}
