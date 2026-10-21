import axiosInstance from './axios';

export const communicateService = {
  // ================= NOTICES =================
  getNotices: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/notices', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  },

  createNotice: async (data) => {
    try {
      const response = await axiosInstance.post('/notices', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notice:', error);
      throw error;
    }
  },

  updateNotice: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/notices/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating notice ${id}:`, error);
      throw error;
    }
  },

  deleteNotice: async (id) => {
    try {
      const response = await axiosInstance.delete(`/notices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notice ${id}:`, error);
      throw error;
    }
  },

  // ================= EVENTS & HOLIDAYS =================
  getEvents: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/events', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  createEvent: async (data) => {
    try {
      const response = await axiosInstance.post('/events', data);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  updateEvent: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/events/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  },

  // ================= BROADCASTS =================
  getBroadcasts: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/broadcasts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      throw error;
    }
  },

  sendBroadcast: async (data) => {
    try {
      const response = await axiosInstance.post('/broadcasts/send', data);
      return response.data;
    } catch (error) {
      console.error('Error sending broadcast:', error);
      throw error;
    }
  },

  getBroadcastStats: async () => {
    try {
      const response = await axiosInstance.get('/broadcasts/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching broadcast stats:', error);
      throw error;
    }
  },

  getRecipientsEstimate: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/broadcasts/recipients-estimate', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipients estimate:', error);
      throw error;
    }
  },

  deleteBroadcast: async (id) => {
    try {
      const response = await axiosInstance.delete(`/broadcasts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting broadcast ${id}:`, error);
      throw error;
    }
  },

  // ================= IMAGE GALLERY =================
  getGallery: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/gallery', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching gallery albums:', error);
      throw error;
    }
  },

  createAlbum: async (data) => {
    try {
      const response = await axiosInstance.post('/gallery', data);
      return response.data;
    } catch (error) {
      console.error('Error creating album:', error);
      throw error;
    }
  },

  addPhotosToAlbum: async (id, photos) => {
    try {
      const response = await axiosInstance.post(`/gallery/${id}/photos`, { photos });
      return response.data;
    } catch (error) {
      console.error(`Error adding photos to album ${id}:`, error);
      throw error;
    }
  },

  deleteAlbum: async (id) => {
    try {
      const response = await axiosInstance.delete(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting album ${id}:`, error);
      throw error;
    }
  }
};
