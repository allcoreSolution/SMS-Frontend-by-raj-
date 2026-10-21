import axiosInstance from './axios';

export const hpcService = {
  // Stats
  getStats: async () => {
    const res = await axiosInstance.get('/hpc/stats');
    return res.data;
  },

  // Activities
  getActivities: async (params = {}) => {
    const res = await axiosInstance.get('/hpc/activities', { params });
    return res.data;
  },
  createActivity: async (data) => {
    const res = await axiosInstance.post('/hpc/activities', data);
    return res.data;
  },
  updateActivity: async (id, data) => {
    const res = await axiosInstance.put(`/hpc/activities/${id}`, data);
    return res.data;
  },
  deleteActivity: async (id) => {
    const res = await axiosInstance.delete(`/hpc/activities/${id}`);
    return res.data;
  },

  // Progress Cards
  getCards: async (params = {}) => {
    const res = await axiosInstance.get('/hpc/cards', { params });
    return res.data;
  },
  getCardById: async (id) => {
    const res = await axiosInstance.get(`/hpc/cards/${id}`);
    return res.data;
  },
  createCardsForClass: async (data) => {
    const res = await axiosInstance.post('/hpc/cards/batch', data);
    return res.data;
  },
  updateCard: async (id, data) => {
    const res = await axiosInstance.put(`/hpc/cards/${id}`, data);
    return res.data;
  },
  deleteCard: async (id) => {
    const res = await axiosInstance.delete(`/hpc/cards/${id}`);
    return res.data;
  },

  // Helper: Get classes
  getClasses: async () => {
    const res = await axiosInstance.get('/academics/classes');
    return res.data;
  }
};

export default hpcService;
