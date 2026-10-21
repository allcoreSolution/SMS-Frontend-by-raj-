import axiosInstance from './axios';

export const homeworkService = {
  // Get all homework assignments
  getHomework: async (params) => {
    const response = await axiosInstance.get('/homework', { params });
    return response.data;
  },

  // Create new homework assignment
  assignHomework: async (formData) => {
    const response = await axiosInstance.post('/homework/assign', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete homework assignment
  deleteHomework: async (id) => {
    const response = await axiosInstance.delete(`/homework/${id}`);
    return response.data;
  },
};
