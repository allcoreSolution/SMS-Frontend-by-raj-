import axiosInstance from './axios';

export const leadService = {
  getLeads: async (params = {}) => {
    const res = await axiosInstance.get('/leads', { params });
    return res.data;
  },
  getStats: async () => {
    const res = await axiosInstance.get('/leads/stats');
    return res.data;
  },
  createLead: async (data) => {
    const res = await axiosInstance.post('/leads', data);
    return res.data;
  },
  updateLead: async (id, data) => {
    const res = await axiosInstance.put(`/leads/${id}`, data);
    return res.data;
  },
  deleteLead: async (id) => {
    const res = await axiosInstance.delete(`/leads/${id}`);
    return res.data;
  },
  convertLead: async (id) => {
    const res = await axiosInstance.post(`/leads/${id}/convert`);
    return res.data;
  }
};

export default leadService;
