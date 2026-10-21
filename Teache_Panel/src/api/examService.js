import axiosInstance from './axios';

export const examService = {
  // Offline Exams Core CRUD
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
    const response = await axiosInstance.patch(`/exams/${id}`, data);
    return response.data;
  },
  deleteExam: async (id) => {
    const response = await axiosInstance.delete(`/exams/${id}`);
    return response.data;
  },

  // Marks Entry & Results
  getMarks: async (params = {}) => {
    const response = await axiosInstance.get('/exams/marks', { params });
    return response.data;
  },
  addResult: async (data) => {
    const response = await axiosInstance.post('/exams/marks', data);
    return response.data;
  },
  saveMarksBatch: async (data) => {
    const response = await axiosInstance.post('/exams/marks', data);
    return response.data;
  },
  getResults: async (params = {}) => {
    const response = await axiosInstance.get('/exams/marks', { params });
    return response.data;
  },

  // Marksheets & Editing
  getStudentMarksheet: async (params = {}) => {
    const response = await axiosInstance.get('/exams/marksheet', { params });
    return response.data;
  },
  updateStudentMarksheet: async (data) => {
    const response = await axiosInstance.put('/exams/marksheet/student', data);
    return response.data;
  },
  getClassMarksheets: async (params = {}) => {
    const response = await axiosInstance.get('/exams/class-marksheets', { params });
    return response.data;
  },

  // Admit Cards Full CRUD & Generation
  getAdmitCards: async (params = {}) => {
    const response = await axiosInstance.get('/exams/admit-cards', { params });
    return response.data;
  },
  generateAdmitCardsBatch: async (data) => {
    const response = await axiosInstance.post('/exams/admit-cards/generate', data);
    return response.data;
  },
  updateAdmitCard: async (id, data) => {
    const response = await axiosInstance.put(`/exams/admit-cards/${id}`, data);
    return response.data;
  },
  deleteAdmitCard: async (id) => {
    const response = await axiosInstance.delete(`/exams/admit-cards/${id}`);
    return response.data;
  },

  // Uploaded Marksheets
  getUploadedMarksheets: async (params = {}) => {
    const response = await axiosInstance.get('/exams/uploaded-marksheets', { params });
    return response.data;
  },
  uploadMarksheet: async (data) => {
    const response = await axiosInstance.post('/exams/upload-marksheet', data);
    return response.data;
  },
  updateUploadedMarksheet: async (id, data) => {
    const response = await axiosInstance.put(`/exams/uploaded-marksheets/${id}`, data);
    return response.data;
  },
  deleteUploadedMarksheet: async (id) => {
    const response = await axiosInstance.delete(`/exams/uploaded-marksheets/${id}`);
    return response.data;
  },

  // Online Exams
  getOnlineExams: async (params = {}) => {
    const response = await axiosInstance.get('/online-exams', { params });
    return response.data;
  },
  createOnlineExam: async (data) => {
    const response = await axiosInstance.post('/online-exams', data);
    return response.data;
  },
  deleteOnlineExam: async (id) => {
    const response = await axiosInstance.delete(`/online-exams/${id}`);
    return response.data;
  }
};
