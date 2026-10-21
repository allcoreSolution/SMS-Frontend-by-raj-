import axiosInstance from './axios';

export const cctvService = {
  // 1. Stats and Overview
  getStats: async () => {
    const res = await axiosInstance.get('/cctv/stats');
    return res.data;
  },

  // 2. Camera Management
  getCameras: async (params = {}) => {
    const res = await axiosInstance.get('/cctv/cameras', { params });
    return res.data;
  },

  getCameraById: async (id) => {
    const res = await axiosInstance.get(`/cctv/cameras/${id}`);
    return res.data;
  },

  addCamera: async (data) => {
    const res = await axiosInstance.post('/cctv/cameras', data);
    return res.data;
  },

  updateCamera: async (id, data) => {
    const res = await axiosInstance.put(`/cctv/cameras/${id}`, data);
    return res.data;
  },

  deleteCamera: async (id) => {
    const res = await axiosInstance.delete(`/cctv/cameras/${id}`);
    return res.data;
  },

  toggleCamera: async (id, field) => {
    const res = await axiosInstance.patch(`/cctv/cameras/${id}/toggle`, { field });
    return res.data;
  },

  // 3. Access Audit Logs
  getLogs: async (params = {}) => {
    const res = await axiosInstance.get('/cctv/logs', { params });
    return res.data;
  },

  addLog: async (data) => {
    const res = await axiosInstance.post('/cctv/logs', data);
    return res.data;
  },

  // 4. Parent Policy Settings
  getPolicy: async () => {
    const res = await axiosInstance.get('/cctv/policy');
    return res.data;
  },

  updatePolicy: async (data) => {
    const res = await axiosInstance.put('/cctv/policy', data);
    return res.data;
  }
};

export default cctvService;
