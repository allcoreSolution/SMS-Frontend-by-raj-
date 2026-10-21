import axiosInstance from './axios';

export const studyCenterService = {
  // 1. Dashboard Aggregate Stats
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/study-center/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching study center stats:', error);
      throw error;
    }
  },

  // 2. Syllabus APIs
  getSyllabus: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/study-center/syllabus', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      throw error;
    }
  },

  createSyllabusUnit: async (data) => {
    try {
      const response = await axiosInstance.post('/study-center/syllabus', data);
      return response.data;
    } catch (error) {
      console.error('Error creating syllabus unit:', error);
      throw error;
    }
  },

  updateSyllabusUnit: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/study-center/syllabus/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating syllabus unit ${id}:`, error);
      throw error;
    }
  },

  deleteSyllabusUnit: async (id) => {
    try {
      const response = await axiosInstance.delete(`/study-center/syllabus/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting syllabus unit ${id}:`, error);
      throw error;
    }
  },

  // 3. Classwork & Logbook APIs
  getClasswork: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/study-center/classwork', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching classwork logs:', error);
      throw error;
    }
  },

  createClasswork: async (data) => {
    try {
      const response = await axiosInstance.post('/study-center/classwork', data);
      return response.data;
    } catch (error) {
      console.error('Error creating classwork log:', error);
      throw error;
    }
  },

  deleteClasswork: async (id) => {
    try {
      const response = await axiosInstance.delete(`/study-center/classwork/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting classwork log ${id}:`, error);
      throw error;
    }
  },

  // 4. Learning Resources APIs
  getResources: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/study-center/resources', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      throw error;
    }
  },

  createResource: async (data) => {
    try {
      const response = await axiosInstance.post('/study-center/resources', data);
      return response.data;
    } catch (error) {
      console.error('Error creating learning resource:', error);
      throw error;
    }
  },

  incrementDownload: async (id) => {
    try {
      const response = await axiosInstance.post(`/study-center/resources/${id}/download`);
      return response.data;
    } catch (error) {
      console.error(`Error incrementing download for ${id}:`, error);
      throw error;
    }
  },

  deleteResource: async (id) => {
    try {
      const response = await axiosInstance.delete(`/study-center/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting resource ${id}:`, error);
      throw error;
    }
  },

  // 5. Homework Assignments APIs
  getHomework: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/study-center/homework', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching homework assignments:', error);
      throw error;
    }
  },

  createHomework: async (data) => {
    try {
      const response = await axiosInstance.post('/study-center/homework', data);
      return response.data;
    } catch (error) {
      console.error('Error creating homework assignment:', error);
      throw error;
    }
  },

  evaluateHomework: async (id, evaluationData) => {
    try {
      const response = await axiosInstance.post(`/study-center/homework/${id}/evaluate`, evaluationData);
      return response.data;
    } catch (error) {
      console.error(`Error evaluating homework ${id}:`, error);
      throw error;
    }
  },

  deleteHomework: async (id) => {
    try {
      const response = await axiosInstance.delete(`/study-center/homework/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting homework ${id}:`, error);
      throw error;
    }
  },

  // 6. Helper to fetch live academic classes
  getClasses: async () => {
    try {
      const response = await axiosInstance.get('/academics/classes');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching academic classes:', error);
      return [];
    }
  }
};
