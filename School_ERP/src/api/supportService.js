import axiosInstance from './axios';

export const supportService = {
  // Get all tickets with optional status, priority, category, search
  getTickets: async (params = {}) => {
    const res = await axiosInstance.get('/support-tickets', { params });
    return res.data;
  },

  // Get ticket by Mongo ID or TKT-code
  getTicketById: async (id) => {
    const res = await axiosInstance.get(`/support-tickets/${id}`);
    return res.data;
  },

  // Create new support ticket
  createTicket: async (ticketData) => {
    const res = await axiosInstance.post('/support-tickets', ticketData);
    return res.data;
  },

  // Add message reply to an existing ticket
  addReply: async (id, replyData) => {
    const res = await axiosInstance.post(`/support-tickets/${id}/replies`, replyData);
    return res.data;
  },

  // Update ticket status (Open, In Progress, Resolved, Closed)
  updateStatus: async (id, status, note = '') => {
    const res = await axiosInstance.patch(`/support-tickets/${id}/status`, { status, note });
    return res.data;
  },

  // Reset or seed fresh realistic sample tickets
  seedTickets: async () => {
    const res = await axiosInstance.post('/support-tickets/seed');
    return res.data;
  },

  // Delete a ticket
  deleteTicket: async (id) => {
    const res = await axiosInstance.delete(`/support-tickets/${id}`);
    return res.data;
  }
};

export default supportService;
