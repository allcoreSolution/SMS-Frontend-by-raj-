import axiosInstance from './axios';

export const certificateService = {
  // Templates
  getTemplates: async (params = {}) => {
    const response = await axiosInstance.get('/certificates/templates', { params });
    return response.data;
  },
  createTemplate: async (data) => {
    const response = await axiosInstance.post('/certificates/templates', data);
    return response.data;
  },
  updateTemplate: async (id, data) => {
    const response = await axiosInstance.put(`/certificates/templates/${id}`, data);
    return response.data;
  },
  deleteTemplate: async (id) => {
    const response = await axiosInstance.delete(`/certificates/templates/${id}`);
    return response.data;
  },

  // Auto Generation
  generateCertificate: async (payload) => {
    const response = await axiosInstance.post('/certificates/generate', payload);
    return response.data;
  },
  bulkGenerateCertificates: async (payload) => {
    const response = await axiosInstance.post('/certificates/bulk-generate', payload);
    return response.data;
  },

  // Archive / Issued Records
  getIssuedCertificates: async (params = {}) => {
    const response = await axiosInstance.get('/certificates/issued', { params });
    return response.data;
  },
  updateIssuedCertificate: async (id, data) => {
    const response = await axiosInstance.put(`/certificates/issued/${id}`, data);
    return response.data;
  },
  deleteIssuedCertificate: async (id) => {
    const response = await axiosInstance.delete(`/certificates/issued/${id}`);
    return response.data;
  },

  // Stats
  getStats: async () => {
    const response = await axiosInstance.get('/certificates/stats');
    return response.data;
  }
};

export default certificateService;
