import axiosInstance from './axios';

export const liveClassService = {
  getLiveClasses: async (params = {}) => {
    const response = await axiosInstance.get('/live-classes', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/live-classes/stats');
    return response.data;
  },

  scheduleClass: async (data) => {
    const response = await axiosInstance.post('/live-classes/schedule', data);
    return response.data;
  },

  getClassById: async (id) => {
    const response = await axiosInstance.get(`/live-classes/${id}`);
    return response.data;
  },

  updateClass: async (id, data) => {
    const response = await axiosInstance.put(`/live-classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id) => {
    const response = await axiosInstance.delete(`/live-classes/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/live-classes/${id}/status`, { status });
    return response.data;
  },

  joinClass: async (id, data = {}) => {
    const response = await axiosInstance.post(`/live-classes/${id}/join`, data);
    return response.data;
  },

  getSettings: async () => {
    const response = await axiosInstance.get('/live-classes/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await axiosInstance.post('/live-classes/settings', data);
    return response.data;
  }
};

export default liveClassService;
