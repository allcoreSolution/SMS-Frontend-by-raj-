import axiosInstance from './axios';

export const surveyService = {
  getSurveys: async (params = {}) => {
    const res = await axiosInstance.get('/surveys', { params });
    return res.data;
  },
  getStats: async () => {
    const res = await axiosInstance.get('/surveys/stats');
    return res.data;
  },
  getTemplates: async () => {
    const res = await axiosInstance.get('/surveys/templates');
    return res.data;
  },
  getSurveyById: async (id) => {
    const res = await axiosInstance.get(`/surveys/${id}`);
    return res.data;
  },
  createSurvey: async (data) => {
    const res = await axiosInstance.post('/surveys', data);
    return res.data;
  },
  updateSurvey: async (id, data) => {
    const res = await axiosInstance.put(`/surveys/${id}`, data);
    return res.data;
  },
  deleteSurvey: async (id) => {
    const res = await axiosInstance.delete(`/surveys/${id}`);
    return res.data;
  },
  submitResponse: async (payload) => {
    const res = await axiosInstance.post('/surveys/submit', payload);
    return res.data;
  },
  getFeedbacks: async (params = {}) => {
    const res = await axiosInstance.get('/surveys/feedbacks', { params });
    return res.data;
  },
  createFeedback: async (data) => {
    const res = await axiosInstance.post('/surveys/feedbacks', data);
    return res.data;
  },
  updateFeedback: async (id, data) => {
    const res = await axiosInstance.patch(`/surveys/feedbacks/${id}`, data);
    return res.data;
  },
  deleteFeedback: async (id) => {
    const res = await axiosInstance.delete(`/surveys/feedbacks/${id}`);
    return res.data;
  }
};

export default surveyService;
