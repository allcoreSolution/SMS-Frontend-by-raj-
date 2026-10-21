import axiosInstance from './axios';

export const parentService = {
  // Get complete dashboard data for active child/parent
  getDashboard: async (params = {}) => {
    const response = await axiosInstance.get('/parents/dashboard', { params });
    return response.data;
  },

  // Get children associated with parent
  getChildren: async (parentId) => {
    const response = await axiosInstance.get('/parents/dashboard', {
      params: parentId ? { parentId } : {}
    });
    return response.data?.data?.children || [];
  },

  // Get individual student details
  getStudentProfile: async (studentId) => {
    const response = await axiosInstance.get(`/students/${studentId}`);
    return response.data;
  },

  // Get student attendance
  getAttendance: async (studentId, params = {}) => {
    const response = await axiosInstance.get(`/attendance/student/${studentId}`, { params });
    return response.data;
  },

  // Get student dues & fees summary
  getFeesDues: async (studentId) => {
    const response = await axiosInstance.get('/search-due-fees/student/my-dues', {
      params: { studentId }
    });
    return response.data;
  },

  // Get notices
  getNotices: async (params = {}) => {
    const response = await axiosInstance.get('/notices', { params });
    return response.data;
  },

  // Get events
  getEvents: async (params = {}) => {
    const response = await axiosInstance.get('/events', { params });
    return response.data;
  },

  // Get marksheet / report card for active student
  getMarksheet: async (studentId, examId) => {
    const params = { studentId };
    if (examId) params.examId = examId;
    const response = await axiosInstance.get('/exams/marksheet', { params });
    return response.data;
  },

  // Get class timetable
  getTimetable: async (params = {}) => {
    const response = await axiosInstance.get('/academics/timetable', { params });
    return response.data;
  },

  // Upload / update student photo
  uploadStudentPhoto: async (data) => {
    const response = await axiosInstance.post('/parents/upload-student-photo', data);
    return response.data;
  },

  // Update student profile details
  updateStudentProfile: async (studentId, data) => {
    const response = await axiosInstance.put(`/parents/student-profile/${studentId}`, data);
    return response.data;
  },

  // Change parent login password
  changePassword: async (data) => {
    const response = await axiosInstance.put('/parents/change-password', data);
    return response.data;
  },

  // Get exams list
  getExams: async (params = {}) => {
    const response = await axiosInstance.get('/exams', { params });
    return response.data;
  },

  // Get exam schedules / datesheet
  getExamSchedules: async (params = {}) => {
    const response = await axiosInstance.get('/exams/schedules', { params });
    return response.data;
  },

  // Get admit cards
  getAdmitCards: async (params = {}) => {
    const response = await axiosInstance.get('/exams/admit-cards', { params });
    return response.data;
  },

  // Get coaching programs
  getCoachingPrograms: async (params = {}) => {
    const response = await axiosInstance.get('/coaching', { params });
    return response.data;
  },

  // Enroll in coaching
  enrollInCoaching: async (data) => {
    const response = await axiosInstance.post('/coaching/enroll', data);
    return response.data;
  },

  // Withdraw from coaching
  withdrawCoaching: async (data) => {
    const response = await axiosInstance.post('/coaching/withdraw', data);
    return response.data;
  },

  // Get Parent-Teacher Meetings
  getMeetings: async (params = {}) => {
    const response = await axiosInstance.get('/ptm', { params });
    return response.data;
  },

  // Request a 1-on-1 meeting
  requestMeeting: async (data) => {
    const response = await axiosInstance.post('/ptm', data);
    return response.data;
  },

  // Get Online Exams
  getOnlineExams: async (params = {}) => {
    const response = await axiosInstance.get('/online-exams', { params });
    return response.data;
  },

  // Get single Online Exam with questions
  getOnlineExamById: async (id) => {
    const response = await axiosInstance.get(`/online-exams/${id}`);
    return response.data;
  },

  // Submit Online Exam
  submitOnlineExam: async (data) => {
    const response = await axiosInstance.post('/online-exams/submit', data);
    return response.data;
  },

  // Get Online Exam Results
  getOnlineExamResults: async (params = {}) => {
    const response = await axiosInstance.get('/online-exams/results/list', { params });
    return response.data;
  },

  // Get Homework assignments
  getHomework: async (params = {}) => {
    const response = await axiosInstance.get('/homework', { params });
    return response.data;
  },

  // Submit Homework solution
  submitHomework: async (data) => {
    const response = await axiosInstance.post('/homework/submit', data);
    return response.data;
  },

  // Study Center: Syllabus
  getSyllabus: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/syllabus', { params });
    return response.data;
  },

  // Study Center: Classwork & Daily Logbook
  getClasswork: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/classwork', { params });
    return response.data;
  },

  // Study Center: Learning Resources / Materials
  getStudyResources: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/resources', { params });
    return response.data;
  },

  // Study Center: Dashboard Stats
  getStudyCenterStats: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/stats', { params });
    return response.data;
  },

  // Study Center: Increment Resource Download
  downloadResource: async (id) => {
    const response = await axiosInstance.post(`/study-center/resources/${id}/download`);
    return response.data;
  },

  // Live Classes
  getLiveClasses: async (params = {}) => {
    const response = await axiosInstance.get('/live-classes', { params });
    return response.data;
  },

  // Join Live Class
  joinLiveClass: async (id, data = {}) => {
    const response = await axiosInstance.post(`/live-classes/${id}/join`, data);
    return response.data;
  },

  // Notice by ID
  getNoticeById: async (id) => {
    const response = await axiosInstance.get(`/notices/${id}`);
    return response.data;
  },

  // Financials: Fee Ledger
  getFeeLedger: async (params = {}) => {
    const response = await axiosInstance.get('/parents/fee-ledger', { params });
    return response.data;
  },

  // Financials: Transactions History
  getTransactions: async (params = {}) => {
    const response = await axiosInstance.get('/parents/transactions', { params });
    return response.data;
  },

  // Financials: Pay Fee Online
  payFeeOnline: async (data) => {
    const response = await axiosInstance.post('/parents/pay-fee', data);
    return response.data;
  },

  // Financials: Get Fee Receipt Details
  getReceiptDetails: async (id) => {
    const response = await axiosInstance.get(`/parents/receipt/${id}`);
    return response.data;
  },

  // Communications: WhatsApp Messages
  getWhatsAppMessages: async (params = {}) => {
    const response = await axiosInstance.get('/parents/whatsapp/messages', { params });
    return response.data;
  },

  // Communications: Send WhatsApp Inquiry
  sendWhatsAppInquiry: async (data) => {
    const response = await axiosInstance.post('/parents/whatsapp/send', data);
    return response.data;
  },

  // Communications: WhatsApp School Settings & Channels
  getWhatsAppSettings: async () => {
    const response = await axiosInstance.get('/parents/whatsapp/settings');
    return response.data;
  },

  // Communications: Emails & Mailbox
  getEmails: async (params = {}) => {
    const response = await axiosInstance.get('/parents/emails', { params });
    return response.data;
  },

  getEmailById: async (id) => {
    const response = await axiosInstance.get(`/parents/emails/${id}`);
    return response.data;
  },

  sendEmail: async (data) => {
    const response = await axiosInstance.post('/parents/emails/send', data);
    return response.data;
  },

  toggleStarEmail: async (id) => {
    const response = await axiosInstance.put(`/parents/emails/${id}/star`);
    return response.data;
  },

  toggleReadEmail: async (id, isRead) => {
    const response = await axiosInstance.put(`/parents/emails/${id}/read`, { isRead });
    return response.data;
  },

  deleteEmail: async (id) => {
    const response = await axiosInstance.delete(`/parents/emails/${id}`);
    return response.data;
  },

  restoreEmail: async (id) => {
    const response = await axiosInstance.put(`/parents/emails/${id}/restore`);
    return response.data;
  },

  getEmailSettings: async () => {
    const response = await axiosInstance.get('/parents/emails/settings');
    return response.data;
  },

  getSmtpConfig: async () => {
    const response = await axiosInstance.get('/parents/emails/smtp-config');
    return response.data;
  },

  saveSmtpConfig: async (data) => {
    const response = await axiosInstance.post('/parents/emails/smtp-config', data);
    return response.data;
  },

  // Services & Resources: Transport Tracking
  getStudentTransport: async (params = {}) => {
    const response = await axiosInstance.get('/parents/transport', { params });
    return response.data;
  },

  simulateBusGPS: async (data = {}) => {
    const response = await axiosInstance.post('/parents/transport/ping', data);
    return response.data;
  },

  reportTransportIssue: async (data) => {
    const response = await axiosInstance.post('/parents/transport/inquiry', data);
    return response.data;
  },

  getTransportRoutesList: async () => {
    const response = await axiosInstance.get('/parents/transport/routes');
    return response.data;
  },

  // Services & Resources: Library
  getLibraryData: async (params = {}) => {
    const response = await axiosInstance.get('/parents/library', { params });
    return response.data;
  },

  reserveBook: async (data) => {
    const response = await axiosInstance.post('/parents/library/reserve', data);
    return response.data;
  },

  requestNewBook: async (data) => {
    const response = await axiosInstance.post('/parents/library/request-title', data);
    return response.data;
  },

  renewIssuedBook: async (issueId, data = {}) => {
    const response = await axiosInstance.post(`/parents/library/renew/${issueId}`, data);
    return response.data;
  },

  payLibraryFine: async (issueId, data = {}) => {
    const response = await axiosInstance.post(`/parents/library/pay-fine/${issueId}`, data);
    return response.data;
  },

  // Services & Resources: Hostel
  getHostelData: async (params = {}) => {
    const response = await axiosInstance.get('/parents/hostel', { params });
    return response.data;
  },

  applyHostelGatePass: async (data) => {
    const response = await axiosInstance.post('/parents/hostel/gate-pass', data);
    return response.data;
  },

  submitHostelMaintenance: async (data) => {
    const response = await axiosInstance.post('/parents/hostel/maintenance', data);
    return response.data;
  },

  // Services & Resources: Health Records
  getHealthDashboard: async (params = {}) => {
    const response = await axiosInstance.get('/parents/health', { params });
    return response.data;
  },

  updateHealthProfile: async (data) => {
    const response = await axiosInstance.put('/parents/health/profile', data);
    return response.data;
  },

  sendNurseNote: async (data) => {
    const response = await axiosInstance.post('/parents/health/nurse-note', data);
    return response.data;
  },

  // Services & Resources: Documents & Certificates
  getDocuments: async (params = {}) => {
    const response = await axiosInstance.get('/parents/documents', { params });
    return response.data;
  },

  uploadDocument: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post('/parents/documents/upload', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  deleteDocument: async (docId, params = {}) => {
    const response = await axiosInstance.delete(`/parents/documents/${docId}`, { params });
    return response.data;
  },

  requestCertificate: async (data) => {
    const response = await axiosInstance.post('/parents/documents/request-certificate', data);
    return response.data;
  },

  // Services & Resources: Image Gallery
  getGallery: async (params = {}) => {
    const response = await axiosInstance.get('/parents/gallery', { params });
    return response.data;
  },

  // Services & Resources: School Visit (Walk-in & Appointments)
  getSchoolVisitData: async (params = {}) => {
    const response = await axiosInstance.get('/parents/school-visit', { params });
    return response.data;
  },

  createVisitAppointment: async (data) => {
    const response = await axiosInstance.post('/parents/school-visit/appointment', data);
    return response.data;
  },

  cancelVisitAppointment: async (id) => {
    const response = await axiosInstance.put(`/parents/school-visit/appointment/${id}/cancel`);
    return response.data;
  },

  rescheduleVisitAppointment: async (id, data) => {
    const response = await axiosInstance.put(`/parents/school-visit/appointment/${id}/reschedule`, data);
    return response.data;
  },

  verifyGatePass: async (passNumber) => {
    const response = await axiosInstance.get(`/parents/school-visit/gate-pass/${passNumber}/verify?format=json`);
    return response.data;
  },

  getGatePassQR: async (passNumber) => {
    const response = await axiosInstance.get(`/parents/school-visit/gate-pass/${passNumber}/qr?format=json`);
    return response.data;
  },

  // Services & Resources: Student Leave Management
  getStudentLeaves: async (params = {}) => {
    const response = await axiosInstance.get('/parents/leaves', { params });
    return response.data;
  },

  applyStudentLeave: async (data) => {
    const response = await axiosInstance.post('/parents/leaves/apply', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  withdrawStudentLeave: async (id) => {
    const response = await axiosInstance.delete(`/parents/leaves/${id}`);
    return response.data;
  },

  // AI Assistant Services
  chatWithAI: async (data) => {
    const response = await axiosInstance.post('/ai-assistant/chat', data);
    return response.data;
  },

  getAIKnowledge: async (params = {}) => {
    const response = await axiosInstance.get('/ai-assistant/knowledge', { params });
    return response.data;
  },

  getAISessions: async (params = {}) => {
    const response = await axiosInstance.get('/ai-assistant/sessions', { params });
    return response.data;
  },

  clearAISession: async (id) => {
    const response = await axiosInstance.delete(`/ai-assistant/sessions/${id}`);
    return response.data;
  }
};

export default parentService;


