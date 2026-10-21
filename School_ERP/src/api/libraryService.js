import axiosInstance from './axios';

export const libraryService = {
  // Stats
  getStats: async () => {
    try {
      const res = await axiosInstance.get('/library/stats');
      return res.data;
    } catch (error) {
      console.error('Error fetching library stats:', error);
      throw error;
    }
  },

  // Books CRUD
  getBooks: async (params = {}) => {
    try {
      const res = await axiosInstance.get('/library/books', { params });
      return res.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  addBook: async (bookData) => {
    try {
      const res = await axiosInstance.post('/library/books', bookData);
      return res.data;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  },

  updateBook: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/library/books/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const res = await axiosInstance.delete(`/library/books/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      throw error;
    }
  },

  // Issue / Return Circulation
  issueBook: async (data) => {
    try {
      const res = await axiosInstance.post('/library/issue', data);
      return res.data;
    } catch (error) {
      console.error('Error issuing book:', error);
      throw error;
    }
  },

  getIssuedBooks: async (params = {}) => {
    try {
      const res = await axiosInstance.get('/library/issues', { params });
      return res.data;
    } catch (error) {
      console.error('Error fetching issued books:', error);
      throw error;
    }
  },

  returnBook: async (issueId) => {
    try {
      const res = await axiosInstance.put(`/library/return/${issueId}`);
      return res.data;
    } catch (error) {
      console.error(`Error returning book ${issueId}:`, error);
      throw error;
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const res = await axiosInstance.get('/library/categories');
      return res.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  addCategory: async (categoryData) => {
    try {
      const res = await axiosInstance.post('/library/categories', categoryData);
      return res.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await axiosInstance.delete(`/library/categories/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  // Requests
  getRequests: async () => {
    try {
      const res = await axiosInstance.get('/library/requests');
      return res.data;
    } catch (error) {
      console.error('Error fetching book requests:', error);
      throw error;
    }
  },

  addRequest: async (requestData) => {
    try {
      const res = await axiosInstance.post('/library/requests', requestData);
      return res.data;
    } catch (error) {
      console.error('Error adding book request:', error);
      throw error;
    }
  },

  updateRequestStatus: async (id, status) => {
    try {
      const res = await axiosInstance.put(`/library/requests/${id}`, { status });
      return res.data;
    } catch (error) {
      console.error(`Error updating request status ${id}:`, error);
      throw error;
    }
  }
};
