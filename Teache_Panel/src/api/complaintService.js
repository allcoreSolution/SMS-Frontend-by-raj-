import axiosInstance from './axios';

export const complaintService = {
  getComplaints: async (params = {}) => {
    const response = await axiosInstance.get('/complaints', { params });
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await axiosInstance.get(`/complaints/${id}`);
    return response.data;
  },

  createComplaint: async (data) => {
    const response = await axiosInstance.post('/complaints', data);
    return response.data;
  },

  updateComplaint: async (id, data) => {
    const response = await axiosInstance.put(`/complaints/${id}`, data);
    return response.data;
  },

  deleteComplaint: async (id) => {
    const response = await axiosInstance.delete(`/complaints/${id}`);
    return response.data;
  }
};

export default complaintService;
