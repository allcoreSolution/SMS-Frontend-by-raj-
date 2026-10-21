import axiosInstance from './axios';

export const liveClassService = {
  // 1. Get Live Classes (with optional search, status, provider, etc.)
  getLiveClasses: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/live-classes', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching live classes:', error);
      throw error;
    }
  },

  // 2. Get Live Class Dashboard Metrics
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/live-classes/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching live class stats:', error);
      throw error;
    }
  },

  // 3. Schedule New Live Class
  scheduleClass: async (data) => {
    try {
      const response = await axiosInstance.post('/live-classes/schedule', data);
      return response.data;
    } catch (error) {
      console.error('Error scheduling live class:', error);
      throw error;
    }
  },

  // 4. Get Single Class Details
  getClassById: async (id) => {
    try {
      const response = await axiosInstance.get(`/live-classes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching live class ${id}:`, error);
      throw error;
    }
  },

  // 5. Update Class
  updateClass: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/live-classes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating live class ${id}:`, error);
      throw error;
    }
  },

  // 6. Delete Class
  deleteClass: async (id) => {
    try {
      const response = await axiosInstance.delete(`/live-classes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting live class ${id}:`, error);
      throw error;
    }
  },

  // 7. Update Status (Live, Completed, Cancelled)
  updateStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/live-classes/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating live class status ${id}:`, error);
      throw error;
    }
  },

  // 8. Join Class (Logs Attendance)
  joinClass: async (id, studentInfo = {}) => {
    try {
      const response = await axiosInstance.post(`/live-classes/${id}/join`, studentInfo);
      return response.data;
    } catch (error) {
      console.error(`Error joining live class ${id}:`, error);
      throw error;
    }
  },

  // 9. Get Provider & Global Settings
  getSettings: async () => {
    try {
      const response = await axiosInstance.get('/live-classes/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching live class settings:', error);
      throw error;
    }
  },

  // 10. Save Provider & Global Settings
  updateSettings: async (settingsData) => {
    try {
      const response = await axiosInstance.post('/live-classes/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating live class settings:', error);
      throw error;
    }
  },

  // 11. Helper to fetch real classes and teachers for schedule modal
  getAcademicMetadata: async () => {
    try {
      const [classesRes, teachersRes] = await Promise.allSettled([
        axiosInstance.get('/academics/classes'),
        axiosInstance.get('/academics/teachers')
      ]);

      const classes = classesRes.status === 'fulfilled' && classesRes.value?.data?.data 
        ? classesRes.value.data.data 
        : [];
      
      const teachers = teachersRes.status === 'fulfilled' && teachersRes.value?.data?.data 
        ? teachersRes.value.data.data 
        : [];

      return { classes, teachers };
    } catch (error) {
      console.error('Error fetching academic metadata for live classes:', error);
      return { classes: [], teachers: [] };
    }
  }
};
