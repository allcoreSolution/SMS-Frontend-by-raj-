import axiosInstance from './axios';

export const examService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/exams/dashboard-stats');
    return response.data;
  },

  // Exams CRUD
  getExams: async (params = {}) => {
    const response = await axiosInstance.get('/exams', { params });
    return response.data;
  },
  getExamById: async (id) => {
    const response = await axiosInstance.get(`/exams/${id}`);
    return response.data;
  },
  createExam: async (data) => {
    const response = await axiosInstance.post('/exams', data);
    return response.data;
  },
  updateExam: async (id, data) => {
    const response = await axiosInstance.put(`/exams/${id}`, data);
    return response.data;
  },
  deleteExam: async (id) => {
    const response = await axiosInstance.delete(`/exams/${id}`);
    return response.data;
  },

  // Exam Types
  getExamTypes: async () => {
    const response = await axiosInstance.get('/exams/types');
    return response.data;
  },
  createExamType: async (data) => {
    const response = await axiosInstance.post('/exams/types', data);
    return response.data;
  },
  updateExamType: async (id, data) => {
    const response = await axiosInstance.put(`/exams/types/${id}`, data);
    return response.data;
  },
  deleteExamType: async (id) => {
    const response = await axiosInstance.delete(`/exams/types/${id}`);
    return response.data;
  },

  // Grades Scale
  getExamGrades: async () => {
    const response = await axiosInstance.get('/exams/grades');
    return response.data;
  },
  createExamGrade: async (data) => {
    const response = await axiosInstance.post('/exams/grades', data);
    return response.data;
  },
  updateExamGrade: async (id, data) => {
    const response = await axiosInstance.put(`/exams/grades/${id}`, data);
    return response.data;
  },
  deleteExamGrade: async (id) => {
    const response = await axiosInstance.delete(`/exams/grades/${id}`);
    return response.data;
  },

  // Cocurricular Areas
  getCocurricularAreas: async () => {
    const response = await axiosInstance.get('/exams/cocurricular');
    return response.data;
  },
  createCocurricularArea: async (data) => {
    const response = await axiosInstance.post('/exams/cocurricular', data);
    return response.data;
  },
  deleteCocurricularArea: async (id) => {
    const response = await axiosInstance.delete(`/exams/cocurricular/${id}`);
    return response.data;
  },
  getCocurricularGrades: async (params = {}) => {
    const response = await axiosInstance.get('/exams/cocurricular-grades', { params });
    return response.data;
  },
  saveCocurricularGrades: async (data) => {
    const response = await axiosInstance.post('/exams/cocurricular-grades', data);
    return response.data;
  },

  // Schedules (Datesheet)
  getSchedules: async (params = {}) => {
    const response = await axiosInstance.get('/exams/schedules', { params });
    return response.data;
  },
  getExamSchedules: async (examIdOrParams, className) => {
    let params = {};
    if (typeof examIdOrParams === 'object' && examIdOrParams !== null) {
      params = examIdOrParams;
    } else {
      if (examIdOrParams) params.examId = examIdOrParams;
      if (className) params.className = className;
    }
    const response = await axiosInstance.get('/exams/schedules', { params });
    return response.data?.data || response.data || [];
  },
  saveSchedule: async (data) => {
    const response = await axiosInstance.post('/exams/schedules', data);
    return response.data;
  },
  saveExamSchedule: async (data) => {
    const response = await axiosInstance.post('/exams/schedules', data);
    return response.data;
  },
  deleteSchedule: async (id) => {
    const response = await axiosInstance.delete(`/exams/schedules/${id}`);
    return response.data;
  },
  deleteExamSchedule: async (id) => {
    const response = await axiosInstance.delete(`/exams/schedules/${id}`);
    return response.data;
  },

  // Marks Entry & Results
  getMarks: async (examIdOrParams = {}, className) => {
    let params = {};
    if (typeof examIdOrParams === 'object' && examIdOrParams !== null) {
      params = examIdOrParams;
    } else {
      if (examIdOrParams) params.examId = examIdOrParams;
      if (className) params.className = className;
    }
    const response = await axiosInstance.get('/exams/marks', { params });
    return response.data?.data || response.data || [];
  },
  saveMarksBatch: async (data) => {
    const response = await axiosInstance.post('/exams/marks', data);
    return response.data;
  },

  // Marksheet & Admit Cards
  getMarksheet: async (params = {}) => {
    const response = await axiosInstance.get('/exams/marksheet', { params });
    return response.data;
  },
  getAdmitCards: async (params = {}) => {
    const response = await axiosInstance.get('/exams/admit-cards', { params });
    return response.data;
  },

  // Online Exams placeholder support
  getOnlineExams: async () => {
    try {
      const response = await axiosInstance.get('/online-exams');
      return response.data;
    } catch {
      return { success: true, data: [] };
    }
  },
  deleteOnlineExam: async (id) => {
    try {
      const response = await axiosInstance.delete(`/online-exams/${id}`);
      return response.data;
    } catch {
      return { success: true };
    }
  }
};
