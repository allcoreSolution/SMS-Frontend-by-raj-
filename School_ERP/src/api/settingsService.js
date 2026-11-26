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
  },

  // 4. Roles & Permissions RBAC
  getRoles: async () => {
    const res = await axiosInstance.get('/roles?scope=school');
    return res.data;
  },

  getPermissionsMatrix: async () => {
    const res = await axiosInstance.get('/roles/permissions-matrix?scope=school');
    return res.data;
  },

  createRole: async (data) => {
    const res = await axiosInstance.post('/roles', { ...data, scope: 'school' });
    return res.data;
  },

  updateRole: async (id, data) => {
    const res = await axiosInstance.put(`/roles/${id}`, data);
    return res.data;
  },

  deleteRole: async (id) => {
    const res = await axiosInstance.delete(`/roles/${id}`);
    return res.data;
  },

  // 5. User Management with Roles
  getRoleUsers: async (params = {}) => {
    const res = await axiosInstance.get('/roles/users', { params: { scope: 'school', ...params } });
    return res.data;
  },
  addRoleUser: async (data) => {
    const res = await axiosInstance.post('/roles/users', { ...data, scope: 'school' });
    return res.data;
  },
  updateRoleUser: async (id, data) => {
    const res = await axiosInstance.put(`/roles/users/${id}`, data);
    return res.data;
  },
  deleteRoleUser: async (id) => {
    const res = await axiosInstance.delete(`/roles/users/${id}`);
    return res.data;
  }
};

export default settingsService;
