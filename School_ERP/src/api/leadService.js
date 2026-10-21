import axiosInstance from './axios';

export const leadService = {
  // Get all leads with optional filters
  getLeads: async (params = {}) => {
    const response = await axiosInstance.get('/leads', { params });
    return response.data;
  },

  // Get lead metrics & statistics
  getStats: async () => {
    const response = await axiosInstance.get('/leads/stats');
    return response.data;
  },

  // Create a new lead
  createLead: async (leadData) => {
    const response = await axiosInstance.post('/leads', leadData);
    return response.data;
  },

  // Update existing lead (stage, status, notes, follow-up, etc.)
  updateLead: async (id, updateData) => {
    const response = await axiosInstance.patch(`/leads/${id}`, updateData);
    return response.data;
  },

  // Convert lead into admitted student
  convertLead: async (id) => {
    const response = await axiosInstance.post(`/leads/${id}/convert`);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await axiosInstance.delete(`/leads/${id}`);
    return response.data;
  },

  // Reset or seed sample leads
  seedLeads: async () => {
    const response = await axiosInstance.post('/leads/seed');
    return response.data;
  }
};

export default leadService;
