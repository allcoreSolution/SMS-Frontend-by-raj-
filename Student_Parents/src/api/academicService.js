import axiosInstance from './axios';

export const academicService = {
  getLiveClasses: async () => {
    const res = await axiosInstance.get('/live-classes');
    return res.data;
  },
  
  getHomework: async (params = {}) => {
    try {
      const res = await axiosInstance.get('/study-center/homework', { params });
      if (res.data?.success && res.data?.data) return res.data;
    } catch (e) {}
    const res = await axiosInstance.get('/homework', { params });
    return res.data;
  },
  
  getExams: async (params = {}) => {
    const res = await axiosInstance.get('/exams', { params });
    return res.data;
  },

  getReportCard: async (studentId) => {
    const res = await axiosInstance.get('/exams/marksheet', { params: { studentId } });
    return res.data;
  }
};

export default academicService;
