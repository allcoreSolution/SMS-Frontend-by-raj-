import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService extends ChangeNotifier {
  static final AuthService instance = AuthService._();
  AuthService._();

  // Changed to Local Host Backend IP so Flutter hits the Local DB where the Teacher Accounts were actually created!
  // Note: 192.168.1.12 is the specific IP of the PC so that PHYSICAL mobile devices connected via WiFi can hit it.
  static const String baseUrl = 'http://192.168.1.12:5050/';

  SharedPreferences? _prefs;
  Timer? _gpsTimer;

  // Student Info
  String _studentName = '';
  String _mobileNumber = '';
  String _className = '';
  String _email = '';
  String _password = '';
  String _studentToken = '';
  String _studentId = '';

  // Student Profile Extended Fields from Backend API
  String _studentClass = '';
  String _section = '';
  String _rollNo = '';
  String _admissionNo = '';
  String _photo = '';
  String _aadhaarCard = '';
  String _pan = '';
  String _birthCertificate = '';
  String _transferCertificate = '';
  String _previousMarksheet = '';
  String _qualificationCert = '';
  String _experienceCert = '';
  String _resume = '';
  String _casteCertificate = '';
  String _addressProof = '';
  String _medicalCertificate = '';
  bool _allowPortalAccess = true;
  bool _isActive = true;
  String _createdAt = '';

  // Editable Student Profile Information
  String _dob = '';
  String _gender = '';
  String _bloodGroup = '';
  String _address = '';
  String _fatherName = '';
  String _motherName = '';
  String _emergencyContact = '';

  // Teacher Profile Real Mock Data
  String _teacherName = 'Mr. Rajesh Sharma';
  String _teacherToken = '';
  String _teacherEmpId = 'EMP001';
  final String _teacherDept = 'Mathematics';
  String _teacherEmail = 'rajesh.sharma@school.edu';
  String _teacherPassword = 'teacher123';
  String _teacherMobile = '+91 98765 12345';
  String _teacherDesignation = 'Senior Mathematics Teacher & Academic Head';
  final String _teacherQualification = 'M.Sc. Mathematics, B.Ed.';
  final String _teacherExperience = '12+ Years Experience';
  final String _teacherJoiningDate = '12 Aug 2014';

  // Driver Profile Real Mock Data
  String _driverName = 'Ramesh Kumar';
  String _driverEmpId = 'EMP-DRV-04';
  String _driverBusNo = 'UP 32 AB 1234';
  final String _driverRouteNo = 'Route 12 (Sector 15 to School)';
  String _driverMobile = '9876543210';
  final String _driverEmail = 'ramesh.driver@school.edu';
  final String _driverPassword = 'driver123';
  String _driverLicenseNo = 'UP32-20190045678';
  final String _driverVehicleModel = 'TATA Winger Standard ERP Bus';
  bool _isDriverTrackingActive = true;

  bool _isRegistered = false;
  bool _isLoggedIn = false;
  String _activeRole = 'student'; // 'student', 'teacher', 'staff', or 'driver'

  // Student Getters
  String get studentToken => _studentToken;
  String get studentId => _studentId;
  String get studentName => _studentName;
  String get userName => _studentName;
  String get admissionNumber => _mobileNumber;
  String get className => _className;
  String get email => _email;
  String get password => _password;
  String get dob => _dob;
  String get gender => _gender;
  String get bloodGroup => _bloodGroup;
  String get address => _address;
  String get fatherName => _fatherName;
  String get motherName => _motherName;
  String get emergencyContact => _emergencyContact;
  bool get isRegistered => _isRegistered;
  bool get isLoggedIn => _isLoggedIn;
  String get activeRole => _activeRole;

  // Profile API Specific Getters
  String get studentClass => _studentClass;
  String get section => _section;
  String get rollNo => _rollNo;
  String get admissionNo =>
      _admissionNo.isNotEmpty ? _admissionNo : 'ADM-2026-002';
  String get academicSession => '2025 - 2026';
  String get photo => _photo;
  String get photoUrl {
    if (_photo.isEmpty) return '';
    if (_photo.startsWith('http://') || _photo.startsWith('https://'))
      return _photo;
    final cleanBase = baseUrl.endsWith('/')
        ? baseUrl.substring(0, baseUrl.length - 1)
        : baseUrl;
    final cleanPath = _photo.startsWith('/') ? _photo : '/$_photo';
    return '$cleanBase$cleanPath';
  }

  String get aadhaarCard => _aadhaarCard;
  String get pan => _pan;
  String get birthCertificate => _birthCertificate;
  String get transferCertificate => _transferCertificate;
  String get previousMarksheet => _previousMarksheet;
  String get qualificationCert => _qualificationCert;
  String get experienceCert => _experienceCert;
  String get resume => _resume;
  String get medicalCertificate => _medicalCertificate;
  String get casteCertificate => _casteCertificate;
  String get addressProof => _addressProof;
  bool get allowPortalAccess => _allowPortalAccess;
  bool get isActive => _isActive;
  String get createdAt => _createdAt;

  // Media URL Helper Methods
  String getFullMediaUrl(String relativeOrFullUrl) {
    if (relativeOrFullUrl.isEmpty) return '';
    if (relativeOrFullUrl.startsWith('http://') ||
        relativeOrFullUrl.startsWith('https://')) {
      return relativeOrFullUrl;
    }
    final cleanBase = baseUrl.endsWith('/')
        ? baseUrl.substring(0, baseUrl.length - 1)
        : baseUrl;
    final cleanPath = relativeOrFullUrl.startsWith('/')
        ? relativeOrFullUrl
        : '/$relativeOrFullUrl';
    return '$cleanBase$cleanPath';
  }

  String get aadhaarCardUrl => getFullMediaUrl(_aadhaarCard);
  String get panUrl => getFullMediaUrl(_pan);
  String get birthCertificateUrl => getFullMediaUrl(_birthCertificate);
  String get transferCertificateUrl => getFullMediaUrl(_transferCertificate);
  String get previousMarksheetUrl => getFullMediaUrl(_previousMarksheet);
  String get qualificationCertUrl => getFullMediaUrl(_qualificationCert);
  String get experienceCertUrl => getFullMediaUrl(_experienceCert);
  String get resumeUrl => getFullMediaUrl(_resume);
  String get medicalCertificateUrl => getFullMediaUrl(_medicalCertificate);
  String get casteCertificateUrl => getFullMediaUrl(_casteCertificate);
  String get addressProofUrl => getFullMediaUrl(_addressProof);
  
  // Fake Document methods 
  Future<Map<String, dynamic>> uploadDocument({required String docField, required String docUrl}) async {
    // Fake upload for UI
    if (docField == 'medicalCertificate') _medicalCertificate = docUrl;
    else if (docField == 'casteCertificate') _casteCertificate = docUrl;
    else if (docField == 'addressProof') _addressProof = docUrl;
    else if (docField == 'photo') _photo = docUrl;
    notifyListeners();
    return {'success': true, 'message': 'Uploaded successfully'};
  }
  
  Future<Map<String, dynamic>> deleteDocument({required String docField}) async {
    // Fake delete for UI
    if (docField == 'medicalCertificate') _medicalCertificate = '';
    else if (docField == 'casteCertificate') _casteCertificate = '';
    else if (docField == 'addressProof') _addressProof = '';
    else if (docField == 'photo') _photo = '';
    notifyListeners();
    return {'success': true, 'message': 'Removed successfully'};
  }

  // Teacher Getters
  String get teacherName => _teacherName;
  String get teacherEmpId => _teacherEmpId;
  String get teacherDept => _teacherDept;
  String get teacherEmail => _teacherEmail;
  String get teacherPassword => _teacherPassword;
  String get teacherMobile => _teacherMobile;
  String get teacherDesignation => _teacherDesignation;
  String get teacherQualification => _teacherQualification;
  String get teacherExperience => _teacherExperience;
  String get teacherJoiningDate => _teacherJoiningDate;

  // Staff Getters
  String get staffName => _prefs?.getString('sp_staff_name') ?? 'Employee';
  String get staffEmpId => _prefs?.getString('sp_staff_emp_id') ?? 'EMP';

  // Driver Getters
  String get driverName => _driverName;
  String get driverEmpId => _driverEmpId;
  String get driverBusNo => _driverBusNo;
  String get driverRouteNo => _driverRouteNo;
  String get driverMobile => _driverMobile;
  String get driverEmail => _driverEmail;
  String get driverPassword => _driverPassword;
  String get driverLicenseNo => _driverLicenseNo;
  String get driverVehicleModel => _driverVehicleModel;
  bool get isDriverTrackingActive => _isDriverTrackingActive;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    
    // Automatically wipe old local dummy cache if present
    if (_prefs?.getString('sp_registered_name') == 'Rahul Sharma') {
      await _prefs?.clear();
    }
    
    // TEMPORARY OVERRIDE: The user requested that the app always starts at the Portal Selection screen,
    // so we clear the login session on init.
    await _prefs?.setBool('sp_is_logged_in', false);
    
    _isRegistered = _prefs?.getBool('sp_is_registered') ?? false;
    _isLoggedIn = false; // Forced false so Splash screen goes to selection portal
    _activeRole = _prefs?.getString('sp_active_role') ?? 'student';
    _studentToken = _prefs?.getString('sp_student_token') ?? '';
    _studentId = _prefs?.getString('sp_student_id') ?? '';
    _studentName = _prefs?.getString('sp_registered_name') ?? _studentName;
    _email = _prefs?.getString('sp_registered_email') ?? _email;
    _mobileNumber = _prefs?.getString('sp_registered_mobile') ?? _mobileNumber;
    _gender = _prefs?.getString('sp_profile_gender') ?? _gender;
    _dob = _prefs?.getString('sp_profile_dob') ?? _dob;
    _studentClass = _prefs?.getString('sp_student_class') ?? _studentClass;
    _section = _prefs?.getString('sp_student_section') ?? _section;
    _rollNo = _prefs?.getString('sp_student_roll_no') ?? _rollNo;
    _admissionNo = _prefs?.getString('sp_student_admission_no') ?? _admissionNo;
    _photo = _prefs?.getString('sp_student_photo') ?? _photo;
    _aadhaarCard = _prefs?.getString('sp_student_aadhaar') ?? _aadhaarCard;
    _pan = _prefs?.getString('sp_student_pan') ?? _pan;
    _birthCertificate =
        _prefs?.getString('sp_student_birth_cert') ?? _birthCertificate;
    _transferCertificate =
        _prefs?.getString('sp_student_transfer_cert') ?? _transferCertificate;
    _previousMarksheet =
        _prefs?.getString('sp_student_previous_marksheet') ??
        _previousMarksheet;
    _qualificationCert =
        _prefs?.getString('sp_student_qual_cert') ?? _qualificationCert;
    _experienceCert =
        _prefs?.getString('sp_student_exp_cert') ?? _experienceCert;
    _resume = _prefs?.getString('sp_student_resume') ?? _resume;

    if (_studentClass.isNotEmpty) {
      _className = _section.isNotEmpty
          ? '$_studentClass - Section $_section'
          : _studentClass;
    }

    if (_isRegistered) {
      _studentName = _prefs?.getString('sp_registered_name') ?? _studentName;
      _mobileNumber =
          _prefs?.getString('sp_registered_mobile') ?? _mobileNumber;
      _className = _prefs?.getString('sp_registered_class') ?? _className;
      _email = _prefs?.getString('sp_registered_email') ?? _email;
      _password = _prefs?.getString('sp_registered_password') ?? _password;
      _dob = _prefs?.getString('sp_profile_dob') ?? _dob;
      _gender = _prefs?.getString('sp_profile_gender') ?? _gender;
      _bloodGroup = _prefs?.getString('sp_profile_bloodGroup') ?? _bloodGroup;
      _address = _prefs?.getString('sp_profile_address') ?? _address;
      _fatherName = _prefs?.getString('sp_profile_fatherName') ?? _fatherName;
      _motherName = _prefs?.getString('sp_profile_motherName') ?? _motherName;
      _emergencyContact =
          _prefs?.getString('sp_profile_emergency') ?? _emergencyContact;
    }

    _teacherName = _prefs?.getString('sp_teacher_name') ?? _teacherName;
    _teacherEmpId = _prefs?.getString('sp_teacher_emp_id') ?? _teacherEmpId;
    _teacherEmail = _prefs?.getString('sp_teacher_email') ?? _teacherEmail;
    _teacherPassword =
        _prefs?.getString('sp_teacher_password') ?? _teacherPassword;

    _driverName = _prefs?.getString('sp_driver_name') ?? _driverName;
    _driverMobile = _prefs?.getString('sp_driver_mobile') ?? _driverMobile;
    _driverBusNo = _prefs?.getString('sp_driver_bus_no') ?? _driverBusNo;
    _driverLicenseNo =
        _prefs?.getString('sp_driver_license_no') ?? _driverLicenseNo;
    _isDriverTrackingActive =
        _prefs?.getBool('sp_driver_tracking_active') ?? _isDriverTrackingActive;

    notifyListeners();
  }

  Future<void> setRoleSession(String role) async {
    _prefs ??= await SharedPreferences.getInstance();
    _activeRole = role;
    _isLoggedIn = true;
    await _prefs?.setString('sp_active_role', role);
    await _prefs?.setBool('sp_is_logged_in', true);
    notifyListeners();
  }

  Future<bool> registerUser({
    required String name,
    required String mobile,
    required String className,
    required String email,
    required String password,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    _studentName = name;
    _mobileNumber = mobile;
    _className = className;
    _email = email;
    _password = password;
    _isRegistered = true;
    _isLoggedIn = false;

    await _prefs?.setString('sp_registered_name', name);
    await _prefs?.setString('sp_registered_mobile', mobile);
    await _prefs?.setString('sp_registered_class', className);
    await _prefs?.setString('sp_registered_email', email);
    await _prefs?.setString('sp_registered_password', password);
    await _prefs?.setBool('sp_is_registered', true);
    await _prefs?.setBool('sp_is_logged_in', false);

    notifyListeners();
    return true;
  }

  // Student Real Backend API Login Manager
  Future<Map<String, dynamic>> loginStudentApi({
    required String email,
    required String password,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    try {
      final url = Uri.parse('${baseUrl}api/auth/login');
      final response = await http
          .post(
            url,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'email': email.trim(),
              'password': password.trim(),
            }),
          )
          .timeout(const Duration(seconds: 60));

      final Map<String, dynamic> body = jsonDecode(response.body);

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          body['success'] == true) {
        _studentToken = body['token']?.toString() ?? '';
        final data = body['data'] is Map<String, dynamic>
            ? body['data']
            : <String, dynamic>{};
        _studentId = data['id']?.toString() ?? '';
        _studentName = data['name']?.toString() ?? _studentName;
        _email = data['email']?.toString() ?? _email;
        _activeRole = data['role']?.toString() ?? 'student';

        await _prefs?.setString('sp_student_token', _studentToken);
        await _prefs?.setString('sp_student_id', _studentId);
        await _prefs?.setString('sp_registered_name', _studentName);
        await _prefs?.setString('sp_registered_email', _email);
        await setRoleSession('student');

        // Automatically fetch full student profile details using token
        await fetchStudentProfileApi(overrideToken: _studentToken);

        notifyListeners();
        return {
          'success': true,
          'message': body['message'] ?? 'Login successful!',
          'token': _studentToken,
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message':
              body['message'] ?? 'Login failed. Please check your credentials.',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message':
            'Server connection error: ${e.toString().replaceAll('Exception: ', '')}',
      };
    }
  }

  // Student Real Backend API Profile Fetcher
  Future<Map<String, dynamic>> fetchStudentProfileApi({
    String? overrideToken,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();
    final token = (overrideToken != null && overrideToken.isNotEmpty)
        ? overrideToken
        : (_studentToken.isNotEmpty
              ? _studentToken
              : (_prefs?.getString('sp_student_token') ?? ''));

    if (token.isEmpty) {
      return {
        'success': false,
        'message': 'No authentication token found. Please login again.',
      };
    }

    try {
      if (_studentId.isEmpty) {
         _studentId = _prefs?.getString('sp_student_id') ?? '';
      }
      final url = Uri.parse('${baseUrl}api/students/$_studentId');
      final response = await http
          .get(
            url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
              'token': token,
            },
          )
          .timeout(const Duration(seconds: 60));

      final Map<String, dynamic> body = jsonDecode(response.body);

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          body['success'] == true) {
        final data = body['data'] is Map<String, dynamic>
            ? body['data']
            : <String, dynamic>{};

        _studentId =
            data['_id']?.toString() ?? data['id']?.toString() ?? _studentId;
        _studentName = data['name']?.toString() ?? _studentName;
        _email = data['email']?.toString() ?? _email;
        _activeRole = data['role']?.toString() ?? 'student';
        _gender = data['gender']?.toString() ?? _gender;
        _dob = data['dob']?.toString() ?? _dob;
        _mobileNumber = data['mobile']?.toString() ?? _mobileNumber;
        _studentClass = data['studentClass']?.toString() ?? _studentClass;
        _section = data['section']?.toString() ?? _section;
        _rollNo = data['rollNo']?.toString() ?? _rollNo;
        _admissionNo = data['admissionNo']?.toString() ?? _admissionNo;

        final rawPhoto = (data['photo']?.toString() ?? '').isNotEmpty
            ? data['photo'].toString()
            : (data['image']?.toString() ?? '');
        if (rawPhoto.isNotEmpty) {
          _photo = rawPhoto;
        }

        _aadhaarCard = data['aadhaarCard']?.toString() ?? '';
        _pan = data['pan']?.toString() ?? '';
        _birthCertificate = data['birthCertificate']?.toString() ?? '';
        _transferCertificate = data['transferCertificate']?.toString() ?? '';
        _previousMarksheet = data['previousMarksheet']?.toString() ?? '';
        _qualificationCert = data['qualificationCert']?.toString() ?? '';
        _experienceCert = data['experienceCert']?.toString() ?? '';
        _resume = data['resume']?.toString() ?? '';
        _allowPortalAccess = data['allowPortalAccess'] == true;
        _isActive = data['isActive'] == true;
        _createdAt = data['createdAt']?.toString() ?? '';

        if (_studentClass.isNotEmpty) {
          _className = _section.isNotEmpty
              ? '$_studentClass - Section $_section'
              : _studentClass;
        }

        // Save to SharedPreferences for offline persistence
        await _prefs?.setString('sp_student_id', _studentId);
        await _prefs?.setString('sp_registered_name', _studentName);
        await _prefs?.setString('sp_registered_email', _email);
        await _prefs?.setString('sp_registered_mobile', _mobileNumber);
        await _prefs?.setString('sp_profile_gender', _gender);
        await _prefs?.setString('sp_profile_dob', _dob);
        await _prefs?.setString('sp_student_class', _studentClass);
        await _prefs?.setString('sp_student_section', _section);
        await _prefs?.setString('sp_student_roll_no', _rollNo);
        await _prefs?.setString('sp_student_admission_no', _admissionNo);
        await _prefs?.setString('sp_student_photo', _photo);
        await _prefs?.setString('sp_student_aadhaar', _aadhaarCard);
        await _prefs?.setString('sp_student_pan', _pan);
        await _prefs?.setString('sp_student_birth_cert', _birthCertificate);
        await _prefs?.setString(
          'sp_student_transfer_cert',
          _transferCertificate,
        );
        await _prefs?.setString(
          'sp_student_previous_marksheet',
          _previousMarksheet,
        );
        await _prefs?.setString('sp_student_qual_cert', _qualificationCert);
        await _prefs?.setString('sp_student_exp_cert', _experienceCert);
        await _prefs?.setString('sp_student_resume', _resume);

        notifyListeners();
        return {'success': true, 'data': data};
      } else {
        return {
          'success': false,
          'message': body['message'] ?? 'Failed to fetch student profile.',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message':
            'Server connection error: ${e.toString().replaceAll('Exception: ', '')}',
      };
    }
  }

  Future<bool> loginUser({
    required String admissionMobile,
    required String password,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    // If input is an email, attempt real API login
    if (admissionMobile.contains('@')) {
      final result = await loginStudentApi(
        email: admissionMobile,
        password: password,
      );
      return result['success'] == true;
    }

    final savedMobile =
        _prefs?.getString('sp_registered_mobile') ?? _mobileNumber;
    final savedPassword =
        _prefs?.getString('sp_registered_password') ?? _password;
    final isReg = _prefs?.getBool('sp_is_registered') ?? _isRegistered;

    if (!isReg) {
      if (admissionMobile.trim() == _mobileNumber.trim() &&
          password.trim() == _password.trim() && _mobileNumber.isNotEmpty) {
        await setRoleSession('student');
        return true;
      }
      return false;
    }

    if (admissionMobile.trim() == savedMobile.trim() &&
        password.trim() == savedPassword.trim()) {
      _studentName = _prefs?.getString('sp_registered_name') ?? _studentName;
      _className = _prefs?.getString('sp_registered_class') ?? _className;
      _email = _prefs?.getString('sp_registered_email') ?? _email;
      await setRoleSession('student');
      return true;
    }

    return false;
  }

  // Teacher Real Backend API Authentication Manager
  Future<Map<String, dynamic>> loginTeacherUser({
    required String emailOrEmpId,
    required String password,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    try {
      final url = Uri.parse('${baseUrl}api/auth/login');
      final response = await http
          .post(
            url,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'email': emailOrEmpId.trim().toLowerCase(),
              'password': password.trim(),
            }),
          )
          .timeout(const Duration(seconds: 60));

      final Map<String, dynamic> body = jsonDecode(response.body);

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          body['success'] == true) {
        
        final data = body['data'] is Map<String, dynamic> ? body['data'] : <String, dynamic>{};
        final role = data['role']?.toString().toLowerCase() ?? '';
        
        // Ensure user is actually a teacher/staff member
        if (role == 'student' || role == 'parent') {
           return {'success': false, 'message': 'Access denied. You are not a Faculty member.'};
        }

        _teacherToken = body['token']?.toString() ?? data['token']?.toString() ?? '';
        _teacherEmpId = data['id']?.toString() ?? data['_id']?.toString() ?? '';
        _teacherName = data['name']?.toString() ?? data['username']?.toString() ?? _teacherName;
        _teacherEmail = data['email']?.toString() ?? _teacherEmail;
        _activeRole = 'teacher';

        await _prefs?.setString('sp_teacher_token', _teacherToken);
        await _prefs?.setString('sp_teacher_emp_id', _teacherEmpId);
        await _prefs?.setString('sp_teacher_name', _teacherName);
        await _prefs?.setString('sp_teacher_email', _teacherEmail);
        await setRoleSession('teacher');
        notifyListeners();

        return {
          'success': true,
          'message': body['message'] ?? 'Login successful!',
        };
      } else {
        return {
          'success': false,
          'message': body['message'] ?? 'Login failed. Please check your credentials.',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Server connection error: ${e.toString().replaceAll('Exception: ', '')}',
      };
    }
  }

  // Staff/Employee Real Backend API Authentication Manager
  Future<Map<String, dynamic>> loginStaffUser({
    required String emailOrEmpId,
    required String password,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    try {
      final url = Uri.parse('${baseUrl}api/auth/login');
      final response = await http
          .post(
            url,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'email': emailOrEmpId.trim().toLowerCase(),
              'password': password.trim(),
            }),
          )
          .timeout(const Duration(seconds: 60));

      final Map<String, dynamic> body = jsonDecode(response.body);

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          body['success'] == true) {
        
        final data = body['data'] is Map<String, dynamic> ? body['data'] : <String, dynamic>{};
        final role = data['role']?.toString().toLowerCase() ?? '';
        
        // Ensure user is actually staff/admin
        if (role == 'student' || role == 'parent') {
           return {'success': false, 'message': 'Access denied. You are not a Staff member.'};
        }

        final token = body['token']?.toString() ?? data['token']?.toString() ?? '';
        final empId = data['id']?.toString() ?? data['_id']?.toString() ?? '';
        final name = data['name']?.toString() ?? data['username']?.toString() ?? 'Employee';
        final email = data['email']?.toString() ?? emailOrEmpId;
        _activeRole = 'staff';

        await _prefs?.setString('sp_staff_token', token);
        await _prefs?.setString('sp_staff_emp_id', empId);
        await _prefs?.setString('sp_staff_name', name);
        await _prefs?.setString('sp_staff_email', email);
        await setRoleSession('staff');
        notifyListeners();

        return {
          'success': true,
          'message': body['message'] ?? 'Login successful!',
          'name': name,
        };
      } else {
        return {
          'success': false,
          'message': body['message'] ?? 'Login failed. Please check your credentials.',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Server connection error: ${e.toString().replaceAll('Exception: ', '')}',
      };
    }
  }

  // Driver Real Backend API Authentication Manager
  Future<Map<String, dynamic>> loginDriverUser({
    required String mobileOrEmpId,
    required String password,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    try {
      final url = Uri.parse('${baseUrl}api/auth/login');
      final response = await http
          .post(
            url,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'email': mobileOrEmpId.trim().toLowerCase(), // API uses email as standard login for now
              'password': password.trim(),
            }),
          )
          .timeout(const Duration(seconds: 60));

      final Map<String, dynamic> body = jsonDecode(response.body);

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          body['success'] == true) {
        
        final data = body['data'] is Map<String, dynamic> ? body['data'] : <String, dynamic>{};
        final role = data['role']?.toString().toLowerCase() ?? '';
        
        // Ensure user is actually a driver (can be handled as staff with specific role name)
        if (role == 'student' || role == 'parent') {
           return {'success': false, 'message': 'Access denied. You are not a Staff/Driver member.'};
        }

        final token = body['token']?.toString() ?? data['token']?.toString() ?? '';
        _driverEmpId = data['id']?.toString() ?? data['_id']?.toString() ?? '';
        _driverName = data['name']?.toString() ?? data['username']?.toString() ?? _driverName;
        _driverMobile = mobileOrEmpId; // Placeholder until fetching profile 
        _activeRole = 'driver';

        await _prefs?.setString('sp_driver_token', token); // Store Token uniquely for driver just in case
        await _prefs?.setString('sp_driver_emp_id', _driverEmpId);
        await _prefs?.setString('sp_driver_name', _driverName);
        await _prefs?.setString('sp_driver_mobile', _driverMobile);
        await setRoleSession('driver');
        notifyListeners();

        return {
          'success': true,
          'message': body['message'] ?? 'Login successful!',
        };
      } else {
        return {
          'success': false,
          'message': body['message'] ?? 'Login failed. Please check your credentials.',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Server connection error: ${e.toString().replaceAll('Exception: ', '')}',
      };
    }
  }

  Future<void> toggleDriverTracking(bool active) async {
    _prefs ??= await SharedPreferences.getInstance();
    _isDriverTrackingActive = active;
    await _prefs?.setBool('sp_driver_tracking_active', active);

    if (active) {
      _startGpsTelemetry();
    } else {
      _gpsTimer?.cancel();
    }
    notifyListeners();
  }

  void _startGpsTelemetry() {
    _gpsTimer?.cancel();
    _gpsTimer = Timer.periodic(const Duration(seconds: 10), (timer) async {
      if (!_isDriverTrackingActive) {
        timer.cancel();
        return;
      }
      try {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('sp_driver_token') ?? '';
        if (token.isEmpty) return;

        // Simulated coordinates that bounce around for effect, in real app use Geolocator
        final randomLat = 28.5355 - (DateTime.now().second * 0.0001);
        final randomLng = 77.3910 + (DateTime.now().second * 0.0001);
        
        await http.post(
          Uri.parse('https://all-core-school-erp-backend.onrender.com/api/location/update'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: jsonEncode({
            'lat': randomLat,
            'lng': randomLng,
            'speed': 35 + (DateTime.now().second % 15 - 5), // Simulated speed variation
            'busNo': _driverBusNo.isNotEmpty ? _driverBusNo : 'Unknown'
          }),
        ).timeout(const Duration(seconds: 5));
      } catch (e) {
        debugPrint('Location telemetry ping failed: $e');
      }
    });
  }

  Future<void> updateDriverProfile({
    required String name,
    required String mobile,
    required String busNo,
    required String licenseNo,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    _driverName = name;
    _driverMobile = mobile;
    _driverBusNo = busNo;
    _driverLicenseNo = licenseNo;

    await _prefs?.setString('sp_driver_name', name);
    await _prefs?.setString('sp_driver_mobile', mobile);
    await _prefs?.setString('sp_driver_bus_no', busNo);
    await _prefs?.setString('sp_driver_license_no', licenseNo);

    notifyListeners();
  }

  Future<void> updateTeacherProfile({
    required String name,
    required String email,
    required String mobile,
    required String designation,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    _teacherName = name;
    _teacherEmail = email;
    _teacherMobile = mobile;
    _teacherDesignation = designation;

    await _prefs?.setString('sp_teacher_name', name);
    await _prefs?.setString('sp_teacher_email', email);
    await _prefs?.setString('sp_teacher_mobile', mobile);
    await _prefs?.setString('sp_teacher_designation', designation);

    notifyListeners();
  }

  Future<void> updateStudentProfile({
    required String name,
    required String className,
    required String email,
    required String dob,
    required String gender,
    required String bloodGroup,
    required String address,
    required String fatherName,
    required String motherName,
    required String emergencyContact,
  }) async {
    _prefs ??= await SharedPreferences.getInstance();

    _studentName = name;
    _className = className;
    _email = email;
    _dob = dob;
    _gender = gender;
    _bloodGroup = bloodGroup;
    _address = address;
    _fatherName = fatherName;
    _motherName = motherName;
    _emergencyContact = emergencyContact;

    await _prefs?.setString('sp_registered_name', name);
    await _prefs?.setString('sp_registered_class', className);
    await _prefs?.setString('sp_registered_email', email);
    await _prefs?.setString('sp_profile_dob', dob);
    await _prefs?.setString('sp_profile_gender', gender);
    await _prefs?.setString('sp_profile_bloodGroup', bloodGroup);
    await _prefs?.setString('sp_profile_address', address);
    await _prefs?.setString('sp_profile_fatherName', fatherName);
    await _prefs?.setString('sp_profile_motherName', motherName);
    await _prefs?.setString('sp_profile_emergency', emergencyContact);

    notifyListeners();
  }

  Future<void> logout() async {
    _prefs ??= await SharedPreferences.getInstance();
    _isLoggedIn = false;
    _studentToken = '';
    _studentId = '';
    
    // Wipe all cached data to ensure clean state
    await _prefs?.clear();
    
    notifyListeners();
  }
}
