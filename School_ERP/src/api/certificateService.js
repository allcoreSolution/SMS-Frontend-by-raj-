import axiosInstance from './axios';

export const certificateService = {
  // 1. Get Templates
  getTemplates: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/certificates/templates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate templates:', error);
      throw error;
    }
  },

  // 2. Create Template
  createTemplate: async (data) => {
    try {
      const response = await axiosInstance.post('/certificates/templates', data);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // 3. Update Template
  updateTemplate: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/certificates/templates/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      throw error;
    }
  },

  // 4. Delete Template
  deleteTemplate: async (id) => {
    try {
      const response = await axiosInstance.delete(`/certificates/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  },

  // 5. Auto-Generate Single Certificate
  autoGenerate: async (generateData) => {
    try {
      const response = await axiosInstance.post('/certificates/generate', generateData);
      return response.data;
    } catch (error) {
      console.error('Error auto-generating certificate:', error);
      throw error;
    }
  },

  // 6. Bulk Auto-Generate Certificates
  bulkAutoGenerate: async (bulkData) => {
    try {
      const response = await axiosInstance.post('/certificates/bulk-generate', bulkData);
      return response.data;
    } catch (error) {
      console.error('Error in bulk certificate generation:', error);
      throw error;
    }
  },

  // 7. Get Issued / Archived Certificates
  getIssued: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/certificates/issued', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching issued certificates:', error);
      throw error;
    }
  },

  // 8. Delete Issued Certificate
  deleteIssued: async (id) => {
    try {
      const response = await axiosInstance.delete(`/certificates/issued/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting issued certificate ${id}:`, error);
      throw error;
    }
  },

  // 9. Get Certificate Stats
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/certificates/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate stats:', error);
      throw error;
    }
  },

  // 10. Load Academic Classes & Students
  getMetadata: async () => {
    try {
      const [classesRes, studentsRes] = await Promise.allSettled([
        axiosInstance.get('/academics/classes'),
        axiosInstance.get('/students')
      ]);

      const classes = classesRes.status === 'fulfilled' && classesRes.value?.data?.data 
        ? classesRes.value.data.data 
        : [];
      const students = studentsRes.status === 'fulfilled' && studentsRes.value?.data?.data 
        ? studentsRes.value.data.data 
        : [];

      return { classes, students };
    } catch (error) {
      console.error('Error loading metadata for certificates:', error);
      return { classes: [], students: [] };
    }
  }
};
