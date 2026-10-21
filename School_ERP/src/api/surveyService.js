import axiosInstance from './axios';

export const surveyService = {
  // 1. Get surveys with optional query params (status, kind, targetAudience, search)
  getSurveys: async (params = {}) => {
    const res = await axiosInstance.get('/surveys', { params });
    return res.data;
  },

  // 2. Get survey aggregate stats
  getSurveyStats: async () => {
    const res = await axiosInstance.get('/surveys/stats');
    return res.data;
  },

  // 3. Get pre-built professional templates
  getTemplates: async () => {
    const res = await axiosInstance.get('/surveys/templates');
    return res.data;
  },

  // 4. Get survey by Mongo ID
  getSurveyById: async (id) => {
    const res = await axiosInstance.get(`/surveys/${id}`);
    return res.data;
  },

  // 5. Create new survey
  createSurvey: async (surveyData) => {
    const res = await axiosInstance.post('/surveys', surveyData);
    return res.data;
  },

  // 6. Update survey
  updateSurvey: async (id, surveyData) => {
    const res = await axiosInstance.put(`/surveys/${id}`, surveyData);
    return res.data;
  },

  // 7. Update survey status ('Draft', 'Published', 'Closed')
  updateStatus: async (id, status) => {
    const res = await axiosInstance.patch(`/surveys/${id}/status`, { status });
    return res.data;
  },

  // 8. Duplicate an existing survey
  duplicateSurvey: async (id) => {
    const res = await axiosInstance.post(`/surveys/${id}/duplicate`);
    return res.data;
  },

  // 9. Delete survey
  deleteSurvey: async (id) => {
    const res = await axiosInstance.delete(`/surveys/${id}`);
    return res.data;
  },

  // 10. Submit survey response
  submitResponse: async (surveyId, responseData) => {
    const res = await axiosInstance.post(`/surveys/${surveyId}/responses`, responseData);
    return res.data;
  },

  // 11. Get survey analytics & responses
  getSurveyResponses: async (surveyId) => {
    const res = await axiosInstance.get(`/surveys/${surveyId}/responses`);
    return res.data;
  },

  // 12. Feedback Triage items
  getFeedbacks: async (params = {}) => {
    const res = await axiosInstance.get('/surveys/feedbacks', { params });
    return res.data;
  },

  // 13. Create feedback item
  createFeedback: async (feedbackData) => {
    const res = await axiosInstance.post('/surveys/feedbacks', feedbackData);
    return res.data;
  },

  // 14. Update feedback (status, notes, owner, priority)
  updateFeedback: async (id, updateData) => {
    const res = await axiosInstance.patch(`/surveys/feedbacks/${id}`, updateData);
    return res.data;
  },

  // 15. Delete feedback item
  deleteFeedback: async (id) => {
    const res = await axiosInstance.delete(`/surveys/feedbacks/${id}`);
    return res.data;
  }
};

export default surveyService;
