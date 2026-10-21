import axiosInstance from './axios';

export const idCardService = {
  // 1. Get Templates
  getTemplates: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/id-cards/templates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching ID card templates:', error);
      throw error;
    }
  },

  // 2. Create Template
  createTemplate: async (data) => {
    try {
      const response = await axiosInstance.post('/id-cards/templates', data);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // 3. Update Template
  updateTemplate: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/id-cards/templates/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      throw error;
    }
  },

  // 4. Delete Template
  deleteTemplate: async (id) => {
    try {
      const response = await axiosInstance.delete(`/id-cards/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  },

  // 5. Auto-Generate Single ID Card
  autoGenerate: async (generateData) => {
    try {
      const response = await axiosInstance.post('/id-cards/generate', generateData);
      return response.data;
    } catch (error) {
      console.error('Error auto-generating ID card:', error);
      throw error;
    }
  },

  // 6. Bulk Auto-Generate ID Cards
  bulkAutoGenerate: async (bulkData) => {
    try {
      const response = await axiosInstance.post('/id-cards/bulk-generate', bulkData);
      return response.data;
    } catch (error) {
      console.error('Error bulk auto-generating ID cards:', error);
      throw error;
    }
  },

  // 7. Get Issued Cards / Archive
  getIssuedCards: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/id-cards/issued', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching issued ID cards:', error);
      throw error;
    }
  },

  // 8. Mark Card as Printed
  markPrinted: async (id) => {
    try {
      const response = await axiosInstance.put(`/id-cards/issued/${id}/print`);
      return response.data;
    } catch (error) {
      console.error(`Error marking card ${id} printed:`, error);
      throw error;
    }
  },

  // 9. Delete Issued Card
  deleteIssuedCard: async (id) => {
    try {
      const response = await axiosInstance.delete(`/id-cards/issued/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting card ${id}:`, error);
      throw error;
    }
  },

  // 10. Get ID Card Stats
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/id-cards/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching ID card stats:', error);
      throw error;
    }
  }
};
