import axiosInstance from './axios';

export const assessmentService = {
  getAssessments: async (params = {}) => {
    const res = await axiosInstance.get('/assessments', { params });
    return res.data;
  },
  getAssessmentById: async (id) => {
    const res = await axiosInstance.get(`/assessments/${id}`);
    return res.data;
  },
  createAssessment: async (data) => {
    const res = await axiosInstance.post('/assessments', data);
    return res.data;
  },
  updateAssessment: async (id, data) => {
    const res = await axiosInstance.put(`/assessments/${id}`, data);
    return res.data;
  },
  deleteAssessment: async (id) => {
    const res = await axiosInstance.delete(`/assessments/${id}`);
    return res.data;
  },
  saveMarks: async (id, entries) => {
    const res = await axiosInstance.post(`/assessments/${id}/marks`, { entries });
    return res.data;
  },
  publishAssessment: async (id) => {
    const res = await axiosInstance.post(`/assessments/${id}/publish`);
    return res.data;
  },
  getStats: async (params = {}) => {
    const res = await axiosInstance.get('/assessments/stats/summary', { params });
    return res.data;
  },
  getStudentReport: async (params = {}) => {
    const res = await axiosInstance.get('/assessments/student-report', { params });
    return res.data;
  },
  getRankList: async (params = {}) => {
    const res = await axiosInstance.get('/assessments/rank-list', { params });
    return res.data;
  }
};

export default assessmentService;
