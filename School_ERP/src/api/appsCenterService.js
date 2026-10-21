import axiosInstance from './axios';

export const appsCenterService = {
  // 1. Get apps registry and categories
  getApps: async () => {
    const res = await axiosInstance.get('/apps-center');
    return res.data;
  },

  // 2. Launch an app (records analytics)
  launchApp: async (appId) => {
    const res = await axiosInstance.post(`/apps-center/launch/${appId}`);
    return res.data;
  },

  // 3. Toggle enabled status of an app
  toggleApp: async (appId, isEnabled) => {
    const res = await axiosInstance.patch(`/apps-center/toggle/${appId}`, { isEnabled });
    return res.data;
  },

  // 4. Student 360 View
  getStudent360: async (studentId = 'default') => {
    const res = await axiosInstance.get(`/apps-center/student-360/${studentId}`);
    return res.data;
  },

  // 5. Exam Seating Arrangement Generator
  generateSeating: async (payload) => {
    const res = await axiosInstance.post('/apps-center/seating/generate', payload);
    return res.data;
  },

  getSeatingPlans: async () => {
    const res = await axiosInstance.get('/apps-center/seating');
    return res.data;
  },

  // 6. Data Export Hub
  exportData: async (payload) => {
    const res = await axiosInstance.post('/apps-center/export', payload);
    return res.data;
  },

  // 7. Financial Analytics & Reports
  getFinancialAnalytics: async () => {
    const res = await axiosInstance.get('/apps-center/financial-analytics');
    return res.data;
  },

  // 8. Question Paper Generator
  saveQuestionPaper: async (paperData) => {
    const res = await axiosInstance.post('/apps-center/question-papers', paperData);
    return res.data;
  },

  getQuestionPapers: async () => {
    const res = await axiosInstance.get('/apps-center/question-papers');
    return res.data;
  },

  // 9. Digital Whiteboard
  saveWhiteboard: async (boardData) => {
    const res = await axiosInstance.post('/apps-center/whiteboards', boardData);
    return res.data;
  },

  getWhiteboards: async () => {
    const res = await axiosInstance.get('/apps-center/whiteboards');
    return res.data;
  }
};

export default appsCenterService;
