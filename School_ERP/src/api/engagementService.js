import axiosInstance from './axios';

export const engagementService = {
  // 1. Birthday Manager
  getBirthdays: async () => {
    const res = await axiosInstance.get('/engagement/birthdays');
    return res.data;
  },
  sendBirthdayGreeting: async (data) => {
    const res = await axiosInstance.post('/engagement/birthdays/send', data);
    return res.data;
  },

  // 2. Creatives & Templates
  getCreatives: async (params = {}) => {
    const res = await axiosInstance.get('/engagement/creatives', { params });
    return res.data;
  },
  addCreative: async (data) => {
    const res = await axiosInstance.post('/engagement/creatives', data);
    return res.data;
  },
  updateCreative: async (id, data) => {
    const res = await axiosInstance.put(`/engagement/creatives/${id}`, data);
    return res.data;
  },
  deleteCreative: async (id) => {
    const res = await axiosInstance.delete(`/engagement/creatives/${id}`);
    return res.data;
  },

  // 3. Festival Greetings
  getFestivals: async () => {
    const res = await axiosInstance.get('/engagement/festivals');
    return res.data;
  },
  addCustomDay: async (data) => {
    const res = await axiosInstance.post('/engagement/festivals', data);
    return res.data;
  },
  updateFestival: async (id, data) => {
    const res = await axiosInstance.put(`/engagement/festivals/${id}`, data);
    return res.data;
  },
  deleteFestival: async (id) => {
    const res = await axiosInstance.delete(`/engagement/festivals/${id}`);
    return res.data;
  },
  sendFestivalGreeting: async (data) => {
    const res = await axiosInstance.post('/engagement/festivals/send', data);
    return res.data;
  },

  // 4. Auto-Send Settings
  getSettings: async () => {
    const res = await axiosInstance.get('/engagement/settings');
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await axiosInstance.put('/engagement/settings', data);
    return res.data;
  }
};

export default engagementService;
