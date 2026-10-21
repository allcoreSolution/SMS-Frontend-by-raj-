import axiosInstance from './axios';

export const reportsService = {
  // 1. Executive Analytics & Overview Charts
  getOverview: async () => {
    const res = await axiosInstance.get('/reports/overview');
    return res.data;
  },

  // 2. Dynamic Dropdown Filters (Classes, Sections, Categories)
  getFilters: async () => {
    const res = await axiosInstance.get('/reports/filters');
    return res.data;
  },

  // 3. Student Information Reports
  getStudentReport: async (params = {}) => {
    const res = await axiosInstance.get('/reports/students', { params });
    return res.data;
  },

  // 4. Financial & Fee Reports
  getFinanceReport: async (params = {}) => {
    const res = await axiosInstance.get('/reports/finance', { params });
    return res.data;
  },

  // 5. Attendance Reports
  getAttendanceReport: async (params = {}) => {
    const res = await axiosInstance.get('/reports/attendance', { params });
    return res.data;
  },

  // 6. Academic & Examination Performance Reports
  getAcademicReport: async (params = {}) => {
    const res = await axiosInstance.get('/reports/academics', { params });
    return res.data;
  },

  // 7. Human Resources & Staff Reports
  getStaffReport: async (params = {}) => {
    const res = await axiosInstance.get('/reports/staff', { params });
    return res.data;
  }
};

export default reportsService;
