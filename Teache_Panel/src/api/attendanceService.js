import axiosInstance from './axios';

export const attendanceService = {
  // Student Attendance
  getStudentAttendance: async (params = {}) => {
    const response = await axiosInstance.get('/attendance', { params });
    return response.data;
  },
  markStudentAttendance: async (data) => {
    const response = await axiosInstance.post('/attendance', data);
    return response.data;
  },
  getAttendanceSummary: async (params = {}) => {
    const response = await axiosInstance.get('/attendance/summary', { params });
    return response.data;
  },
  updateAttendance: async (id, data) => {
    const response = await axiosInstance.patch(`/attendance/${id}`, data);
    return response.data;
  },
  getQRScanLogs: async (params = {}) => {
    const response = await axiosInstance.get('/attendance/qr-scan-logs', { params });
    return response.data;
  },
  getQRAttendanceReport: async (params = {}) => {
    const response = await axiosInstance.get('/attendance/qr-report', { params });
    return response.data;
  },
  // Teacher Staff Attendance
  getTeacherAttendance: async (params = {}) => {
    const response = await axiosInstance.get('/teacher/attendance', { params });
    return response.data;
  }
};
