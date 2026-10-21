import axiosInstance from './axios';

export const onlineExamService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/online-exams/dashboard-stats');
    return response.data;
  },

  // Online Exams CRUD
  getExams: async (params = {}) => {
    const response = await axiosInstance.get('/online-exams', { params });
    return response.data;
  },

  getExamById: async (id) => {
    const response = await axiosInstance.get(`/online-exams/${id}`);
    return response.data;
  },

  createExam: async (data) => {
    const response = await axiosInstance.post('/online-exams', data);
    return response.data;
  },

  updateExam: async (id, data) => {
    const response = await axiosInstance.put(`/online-exams/${id}`, data);
    return response.data;
  },

  deleteExam: async (id) => {
    const response = await axiosInstance.delete(`/online-exams/${id}`);
    return response.data;
  },

  // Question Bank
  getQuestionBank: async (params = {}) => {
    const response = await axiosInstance.get('/online-exams/questions/bank', { params });
    return response.data;
  },

  createQuestion: async (data) => {
    const response = await axiosInstance.post('/online-exams/questions', data);
    return response.data;
  },

  updateQuestion: async (id, data) => {
    const response = await axiosInstance.put(`/online-exams/questions/${id}`, data);
    return response.data;
  },

  bulkUploadQuestions: async (questions) => {
    const response = await axiosInstance.post('/online-exams/questions/bulk', { questions });
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await axiosInstance.delete(`/online-exams/questions/${id}`);
    return response.data;
  },

  // Chapters & Topics
  getChaptersTopics: async (params = {}) => {
    const response = await axiosInstance.get('/online-exams/chapters/list', { params });
    return response.data;
  },

  createChapterTopic: async (data) => {
    const response = await axiosInstance.post('/online-exams/chapters', data);
    return response.data;
  },

  deleteChapterTopic: async (id) => {
    const response = await axiosInstance.delete(`/online-exams/chapters/${id}`);
    return response.data;
  },

  // Results & Submissions
  submitExam: async (data) => {
    const response = await axiosInstance.post('/online-exams/submit', data);
    return response.data;
  },

  getResults: async (params = {}) => {
    const response = await axiosInstance.get('/online-exams/results/list', { params });
    return response.data;
  }
};

export default onlineExamService;
