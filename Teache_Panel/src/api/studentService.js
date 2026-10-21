import axiosInstance from './axios';

export const studentService = {
  // Fetch all students (with optional query parameters)
  getStudents: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/students', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch a single student by DB ID
  getStudentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new student (handling multipart form data if files are uploaded)
  createStudent: async (studentData) => {
    try {
      const response = await axiosInstance.post('/students', studentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing student
  updateStudent: async (id, updateData) => {
    try {
      const response = await axiosInstance.patch(`/students/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a student
  deleteStudent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
