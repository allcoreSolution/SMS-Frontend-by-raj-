import axiosInstance from './axios';

export const licenseOrderService = {
  // Fetch all leads / purchase enquiries
  getOrders: async (params = {}) => {
    const res = await axiosInstance.get('/leads', { params });
    return res.data;
  },

  // Get aggregated statistics
  getStats: async () => {
    const res = await axiosInstance.get('/leads/stats');
    return res.data;
  },

  // Update order status or details
  updateOrder: async (id, data) => {
    const res = await axiosInstance.patch(`/leads/${id}`, data);
    return res.data;
  },

  // Convert or fulfill license
  convertOrder: async (id) => {
    const res = await axiosInstance.post(`/leads/${id}/convert`);
    return res.data;
  },

  // Delete spam or cancelled order
  deleteOrder: async (id) => {
    const res = await axiosInstance.delete(`/leads/${id}`);
    return res.data;
  },

  // Manually create an order or license record
  createOrder: async (data) => {
    const res = await axiosInstance.post('/leads', {
      ...data,
      source: data.source || 'SuperAdmin Manual Entry',
      stage: data.stage || 'New Enquiry',
      status: data.status || 'New Enquiry'
    });
    return res.data;
  }
};

export default licenseOrderService;

