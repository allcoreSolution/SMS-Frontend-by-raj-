import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_service.dart';

class TeacherHomeworkModel {
  final String id;
  final String subject;
  final String title;
  final String description;
  final String dueDate;
  final String attachment;

  TeacherHomeworkModel({
    required this.id,
    required this.subject,
    required this.title,
    required this.description,
    required this.dueDate,
    this.attachment = '',
  });
}

class TeacherDataRepository extends ChangeNotifier {
  static final TeacherDataRepository instance = TeacherDataRepository._();
  TeacherDataRepository._();

  // Dynamic Homework List
  final List<TeacherHomeworkModel> _assignedHomework = [];
  List<TeacherHomeworkModel> get assignedHomework => List.unmodifiable(_assignedHomework);

  List<Map<String, dynamic>> classes = [];
  List<Map<String, dynamic>> sections = [];
  List<Map<String, dynamic>> subjects = [];
  List<Map<String, dynamic>> exams = [];

  Future<void> fetchMetadata() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };
      
      final exRes = await http.get(Uri.parse('${AuthService.baseUrl}api/exams/exam-schedule'), headers: headers);
      if (exRes.statusCode == 200) {
        final body = jsonDecode(exRes.body);
        if (body['success']) exams = List<Map<String, dynamic>>.from(body['data']);
      }
      
      final clsRes = await http.get(Uri.parse('${AuthService.baseUrl}api/academics/classes'), headers: headers);
      if (clsRes.statusCode == 200) {
        final body = jsonDecode(clsRes.body);
        if (body['success']) classes = List<Map<String, dynamic>>.from(body['data']);
      }
      
      final secRes = await http.get(Uri.parse('${AuthService.baseUrl}api/academics/sections'), headers: headers);
      if (secRes.statusCode == 200) {
        final body = jsonDecode(secRes.body);
        if (body['success']) sections = List<Map<String, dynamic>>.from(body['data']);
      }
      
      final subRes = await http.get(Uri.parse('${AuthService.baseUrl}api/academics/subjects'), headers: headers);
      if (subRes.statusCode == 200) {
        final body = jsonDecode(subRes.body);
        if (body['success']) subjects = List<Map<String, dynamic>>.from(body['data']);
      }
      notifyListeners();
    } catch (e) {
      debugPrint('Error fetching metadata: $e');
    }
  }

  List<Map<String, dynamic>> liveClasses = [];

  Future<void> fetchLiveClasses() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };
      
      final response = await http.get(Uri.parse('${AuthService.baseUrl}api/live-classes'), headers: headers);
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body['success']) liveClasses = List<Map<String, dynamic>>.from(body['data']);
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error fetching live classes: $e');
    }
  }

  Future<bool> scheduleLiveClass(Map<String, dynamic> payload) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}api/live-classes/schedule'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200 || response.statusCode == 201) return true;
      return false;
    } catch (e) {
      debugPrint('Error scheduling live class: $e');
      return false;
    }
  }

  List<Map<String, dynamic>> payslips = [];

  Future<void> fetchPayslips() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final response = await http.get(Uri.parse('${AuthService.baseUrl}api/payroll'), headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      });
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body['success']) payslips = List<Map<String, dynamic>>.from(body['data']);
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error fetching payslips: $e');
    }
  }

  Future<void> fetchAssignedHomework() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final response = await http.get(
        Uri.parse('${AuthService.baseUrl}api/homework'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] != null) {
          _assignedHomework.clear();
          for (var item in body['data']) {
            _assignedHomework.add(TeacherHomeworkModel(
              id: item['_id']?.toString() ?? '',
              subject: item['subject']?.toString() ?? 'General',
              title: item['title']?.toString() ?? 'Homework',
              description: item['description']?.toString() ?? '',
              dueDate: item['submissionDate']?.toString() ?? '',
              attachment: item['attachment']?.toString() ?? '',
            ));
          }
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Error fetching teacher homework: $e');
    }
  }

  Future<void> assignHomework({
    required String title,
    required String description,
    required String submissionDate,
    required String classId,
    required String sectionId,
    required String subjectId,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}api/homework/assign'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'title': title,
          'description': description,
          'dueDate': submissionDate,
          'academicClass': classId,
          'section': sectionId,
          'subject': subjectId,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchAssignedHomework();
      }
    } catch (e) {
      debugPrint('Error assigning homework: $e');
    }
  }

  // Teacher Submit Class Attendance
  Future<bool> submitAttendance({
    required String classId,
    required String sectionId,
    required List<Map<String, dynamic>> attendanceData,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final String date = DateTime.now().toIso8601String().split('T')[0];

      // Format data as per backend requirements: 
      // [{ student, date, status, academicClass, section, remarks }]
      final List<Map<String, dynamic>> payload = attendanceData.map((s) => {
        'student': s['studentId'],
        'date': date,
        'status': s['status'],
        'academicClass': s['classId'],
        'section': s['sectionId'],
        'remarks': ''
      }).toList();

      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}api/attendance/mark'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error submitting attendance: $e');
      return false;
    }
  }

  // Submit Exam Marks Array
  Future<bool> saveExamMarks(List<Map<String, dynamic>> marksPayload) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}api/exams/results'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(marksPayload),
      );

      if (response.statusCode == 200 || response.statusCode == 201) return true;
      return false;
    } catch (e) {
      debugPrint('Error uploading marks: $e');
      return false;
    }
  }

  // Fetch Students for Attendance
  Future<List<Map<String, dynamic>>> fetchClassStudents({String? className}) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('sp_teacher_token') ?? '';
      
      final response = await http.get(
        Uri.parse('${AuthService.baseUrl}api/students?limit=50'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] != null) {
          List<Map<String, dynamic>> students = [];
          for (var item in body['data']) {
            final classObj = item['classId'];
            final sectionObj = item['sectionId'];
            
            final cName = classObj != null ? classObj['className']?.toString() : '';
            final sName = sectionObj != null ? sectionObj['sectionName']?.toString() : '';
            final fullClassName = '$cName - $sName'.trim();
            
            if (className != null && className != 'All') {
                if (fullClassName.isEmpty || fullClassName != className) continue; 
            }
            
            final String name = (item['firstName']?.toString() ?? item['name']?.toString() ?? 'Unknown') + ' ' + (item['lastName']?.toString() ?? '');
            
            students.add({
              'id': item['_id']?.toString() ?? '',
              'classId': classObj != null ? classObj['_id']?.toString() : null,
              'sectionId': sectionObj != null ? sectionObj['_id']?.toString() : null,
              'roll': item['aparId']?.toString() ?? '-',
              'name': name.trim(),
              'status': 'Present', // Default status for UI
              'avatar': name.trim().isNotEmpty ? name.trim().substring(0, 1).toUpperCase() : 'U'
            });
          }
          return students;
        }
      }
      return [];
    } catch (e) {
      debugPrint('Error fetching students: $e');
      return [];
    }
  }
}
