import axiosInstance from './axios';

const chatModerationService = {
  // 1. Dashboard Metrics
  getStats: async () => {
    const res = await axiosInstance.get('/chat-moderation/stats');
    return res.data;
  },

  // 2. Policy & Settings
  getSettings: async () => {
    const res = await axiosInstance.get('/chat-moderation/settings');
    return res.data;
  },

  updateSettings: async (settingsData) => {
    const res = await axiosInstance.put('/chat-moderation/settings', settingsData);
    return res.data;
  },

  // 3. Conversations Surveillance
  getConversations: async (params = {}) => {
    const res = await axiosInstance.get('/chat-moderation/conversations', { params });
    return res.data;
  },

  getConversation: async (id) => {
    const res = await axiosInstance.get(`/chat-moderation/conversations/${id}`);
    return res.data;
  },

  // 4. Moderation Actions
  toggleLock: async (id, payload) => {
    const res = await axiosInstance.patch(`/chat-moderation/conversations/${id}/lock`, payload);
    return res.data;
  },

  redactMessage: async (id, messageId, payload) => {
    const res = await axiosInstance.post(`/chat-moderation/conversations/${id}/messages/${messageId}/redact`, payload);
    return res.data;
  },

  restoreMessage: async (id, messageId) => {
    const res = await axiosInstance.post(`/chat-moderation/conversations/${id}/messages/${messageId}/restore`);
    return res.data;
  },

  addAdminNote: async (id, payload) => {
    const res = await axiosInstance.post(`/chat-moderation/conversations/${id}/notes`, payload);
    return res.data;
  },

  // 5. Incident Reports Triage
  getReports: async (params = {}) => {
    const res = await axiosInstance.get('/chat-moderation/reports', { params });
    return res.data;
  },

  resolveReport: async (reportId, payload) => {
    const res = await axiosInstance.patch(`/chat-moderation/reports/${reportId}/resolve`, payload);
    return res.data;
  }
};

export default chatModerationService;
