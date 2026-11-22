import axiosInstance from './axios';

export const templateService = {
  getTemplates: async (params = {}) => {
    const res = await axiosInstance.get('/superadmin/templates', { params });
    return res.data;
  },

  getTemplateById: async (id) => {
    const res = await axiosInstance.get(`/superadmin/templates/${id}`);
    return res.data;
  },

  createTemplate: async (data) => {
    const res = await axiosInstance.post('/superadmin/templates', data);
    return res.data;
  },

  updateTemplate: async (id, data) => {
    const res = await axiosInstance.put(`/superadmin/templates/${id}`, data);
    return res.data;
  },

  deleteTemplate: async (id) => {
    const res = await axiosInstance.delete(`/superadmin/templates/${id}`);
    return res.data;
  },

  cloneTemplate: async (id) => {
    const res = await axiosInstance.post(`/superadmin/templates/${id}/clone`);
    return res.data;
  }
};

export default templateService;
