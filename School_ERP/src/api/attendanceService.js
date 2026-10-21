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
  recordQRScan: async (data) => {
    const response = await axiosInstance.post('/attendance/qr-scan', data);
    return response.data;
  },
  
  // Staff Attendance Endpoints
  getStaffAttendance: async (params = {}) => {
    const response = await axiosInstance.get('/attendance/staff', { params });
    return response.data;
  },
  markStaffAttendance: async (data) => {
    const response = await axiosInstance.post('/attendance/staff', data);
    return response.data;
  }
};
