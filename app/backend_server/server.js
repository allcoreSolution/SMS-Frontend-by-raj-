const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'student_portal_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Dummy Student Database Record
const mockStudent = {
  id: '64f1a2b3c4d5e6f7',
  name: 'Rahul Sharma',
  email: 'aman6437@gmail.com',
  password: 'password123',
  role: 'student',
  studentClass: 'Class 10',
  section: 'A',
  rollNo: '001',
  admissionNo: 'ADM-2026-002',
  mobile: '9876543210',
  gender: 'Male',
  dob: '15 Mar 2009',
  bloodGroup: 'O+',
  address: '123, Green Street, Jaipur, RJ',
  fatherName: 'Mr. Rakesh Sharma',
  motherName: 'Mrs. Sunita Sharma',
  emergencyContact: '+91 98765 43210',
  academicSession: '2026-2027',
  photoUrl: ''
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['token'];
  const token = authHeader && (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

// ==================== 1. STUDENT LOGIN API ====================
// Endpoint: POST /api/user/login
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'School ID / Email Address and Password are required.'
    });
  }

  // Verify credentials
  const inputEmail = email.trim().toLowerCase();
  if (inputEmail !== mockStudent.email.toLowerCase() && inputEmail !== 'aman6437@gmail.com' && inputEmail !== 'rahul.sharma@email.com') {
    return res.status(400).json({
      success: false,
      message: 'Invalid School ID or Password. Please try again.'
    });
  }

  if (password.trim() !== mockStudent.password && password.trim() !== 'password123') {
    return res.status(400).json({
      success: false,
      message: 'Invalid School ID or Password. Please try again.'
    });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: mockStudent.id, email: mockStudent.email, role: mockStudent.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.status(200).json({
    success: true,
    message: 'Login successful!',
    token: token,
    data: {
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      role: mockStudent.role
    }
  });
});

// ==================== 2. STUDENT PROFILE API ====================
// Endpoint: GET /api/user/profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Student profile details fetched successfully',
    data: {
      _id: mockStudent.id,
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      role: mockStudent.role,
      studentClass: mockStudent.studentClass,
      section: mockStudent.section,
      rollNo: mockStudent.rollNo,
      admissionNo: mockStudent.admissionNo,
      mobile: mockStudent.mobile,
      gender: mockStudent.gender,
      dob: mockStudent.dob,
      bloodGroup: mockStudent.bloodGroup,
      address: mockStudent.address,
      fatherName: mockStudent.fatherName,
      motherName: mockStudent.motherName,
      emergencyContact: mockStudent.emergencyContact,
      academicSession: mockStudent.academicSession,
      photo: mockStudent.photoUrl
    }
  });
});

// ==================== 3. STUDENT DASHBOARD API ====================
// Endpoint: GET /api/student/dashboard
app.get('/api/student/dashboard', authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Dashboard summary data fetched successfully',
    data: {
      studentProfile: {
        id: mockStudent.id,
        studentName: mockStudent.name,
        className: `${mockStudent.studentClass} - Section ${mockStudent.section}`,
        admissionNo: mockStudent.admissionNo,
        rollNo: mockStudent.rollNo,
        academicSession: mockStudent.academicSession,
        photoUrl: mockStudent.photoUrl
      },
      attendance: {
        todayStatus: 'Present',
        markedTime: '08:25 AM via RFID',
        overallPercentage: 92,
        streakDays: 14
      },
      metrics: {
        pendingHomework: 2,
        pendingAssignments: 2,
        feeDue: 8500,
        upcomingExams: 3
      },
      announcementTicker: '📢 Notice: Mid-Term Examination Date Sheet Released! Click to view.',
      schoolInfo: {
        schoolName: 'EduPulse Smart Campus',
        affiliation: 'CBSE Affiliated',
        principal: 'Dr. Anita Saxena',
        helpline: '+91 141 2780123'
      }
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Student App API Backend Server running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🔑 Login Endpoint: POST http://localhost:${PORT}/api/user/login`);
  console.log(`📊 Dashboard Endpoint: GET http://localhost:${PORT}/api/student/dashboard`);
  console.log(`=================================================`);
});
