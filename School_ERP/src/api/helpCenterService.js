import axiosInstance from './axios';

export const helpCenterService = {
  // 1. Dashboard Stats
  getStats: async () => {
    const res = await axiosInstance.get('/help-center/stats');
    return res.data;
  },

  // 2. Categories CRUD
  getCategories: async () => {
    const res = await axiosInstance.get('/help-center/categories');
    return res.data;
  },
  createCategory: async (data) => {
    const res = await axiosInstance.post('/help-center/categories', data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await axiosInstance.put(`/help-center/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await axiosInstance.delete(`/help-center/categories/${id}`);
    return res.data;
  },

  // 3. Articles CRUD
  getArticles: async (params = {}) => {
    const res = await axiosInstance.get('/help-center/articles', { params });
    return res.data;
  },
  getArticleById: async (idOrSlug) => {
    const res = await axiosInstance.get(`/help-center/articles/${idOrSlug}`);
    return res.data;
  },
  createArticle: async (data) => {
    const res = await axiosInstance.post('/help-center/articles', data);
    return res.data;
  },
  updateArticle: async (id, data) => {
    const res = await axiosInstance.put(`/help-center/articles/${id}`, data);
    return res.data;
  },
  deleteArticle: async (id) => {
    const res = await axiosInstance.delete(`/help-center/articles/${id}`);
    return res.data;
  },
  voteArticle: async (id, vote) => {
    const res = await axiosInstance.post(`/help-center/articles/${id}/vote`, { vote });
    return res.data;
  },

  // 4. AI Chat Assistant
  chatWithAi: async (message, conversationId) => {
    const res = await axiosInstance.post('/help-center/chat', { message, conversationId });
    return res.data;
  },
  getAiConversations: async () => {
    const res = await axiosInstance.get('/help-center/chat/conversations');
    return res.data;
  },
  clearAiConversation: async (id) => {
    const res = await axiosInstance.delete(`/help-center/chat/conversations/${id}`);
    return res.data;
  }
};

export default helpCenterService;
