import axiosInstance from './axios';

export const studentService = {
  // --- Dashboard ---
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/students/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Students CRUD ---
  getStudents: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/students', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createStudent: async (studentData) => {
    try {
      const isFormData = studentData instanceof FormData;
      const response = await axiosInstance.post('/students', studentData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStudent: async (id, updateData) => {
    try {
      const isFormData = updateData instanceof FormData;
      const response = await axiosInstance.put(`/students/${id}`, updateData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStudentPhoto: async (id, photoPayload) => {
    try {
      const isFormData = photoPayload instanceof FormData;
      const response = await axiosInstance.post(`/students/${id}/photo`, photoPayload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteStudent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Parents & Guardians ---
  getParents: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/parents', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getParentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/parents/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createParent: async (parentData) => {
    try {
      const response = await axiosInstance.post('/parents', parentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateParent: async (id, parentData) => {
    try {
      const response = await axiosInstance.put(`/parents/${id}`, parentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteParent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/parents/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Student Houses ---
  getHouses: async () => {
    try {
      const response = await axiosInstance.get('/student-houses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createHouse: async (houseData) => {
    try {
      const response = await axiosInstance.post('/student-houses', houseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateHouse: async (id, houseData) => {
    try {
      const response = await axiosInstance.put(`/student-houses/${id}`, houseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteHouse: async (id) => {
    try {
      const response = await axiosInstance.delete(`/student-houses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Student Categories ---
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/student-categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post('/student-categories', categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await axiosInstance.put(`/student-categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await axiosInstance.delete(`/student-categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Student Attendance ---
  getAttendanceByClassDate: async (classId, sectionId, date) => {
    try {
      const response = await axiosInstance.get('/attendance/class-date', {
        params: { classId, sectionId, date }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  saveAttendanceBatch: async (attendanceRecords) => {
    try {
      const response = await axiosInstance.post('/attendance/mark', attendanceRecords);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Behavior Records ---
  getBehaviorRecords: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/behavior', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBehaviorRecord: async (recordData) => {
    try {
      const response = await axiosInstance.post('/behavior', recordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBehaviorRecord: async (id) => {
    try {
      const response = await axiosInstance.delete(`/behavior/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- Health Records ---
  getHealthRecords: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/health', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentHealthProfile: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/health/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  saveHealthRecord: async (healthData) => {
    try {
      const response = await axiosInstance.post('/health', healthData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --- TC & Exit Register ---
  getExitRecords: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/student-exits', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createExitRecord: async (exitData) => {
    try {
      const response = await axiosInstance.post('/student-exits', exitData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelExitRecord: async (id) => {
    try {
      const response = await axiosInstance.delete(`/student-exits/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
