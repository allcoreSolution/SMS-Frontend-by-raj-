import axiosInstance from './axios';

export const settingsService = {
  // 1. Dynamic Key-Based Settings
  getSetting: async (key) => {
    const res = await axiosInstance.get(`/settings/${key}`);
    return res.data;
  },

  saveSetting: async (key, value) => {
    const res = await axiosInstance.put(`/settings/${key}`, value);
    return res.data;
  },

  uploadFile: async (formData) => {
    const res = await axiosInstance.post('/settings/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // 2. Subscription & SaaS Plans
  getCurrentSubscription: async () => {
    const res = await axiosInstance.get('/settings/subscription/current');
    return res.data;
  },

  getSubscriptionPlans: async () => {
    const res = await axiosInstance.get('/settings/subscription/plans');
    return res.data;
  },

  upgradeSubscription: async (data) => {
    const res = await axiosInstance.post('/settings/subscription/upgrade', data);
    return res.data;
  },

  getSubscriptionHistory: async () => {
    const res = await axiosInstance.get('/settings/subscription/history');
    return res.data;
  },

  // 3. Security Audit Trail
  getAuditTrail: async () => {
    const res = await axiosInstance.get('/settings/audit-trail/list');
    return res.data;
  }
};

export default settingsService;
