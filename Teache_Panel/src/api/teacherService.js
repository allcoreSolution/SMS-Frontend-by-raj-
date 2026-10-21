import axiosInstance from './axios';

export const teacherService = {
  getDashboardData: async (params = {}) => {
    const response = await axiosInstance.get('/teacher/dashboard', { params });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/teacher/dashboard-stats');
    return response.data;
  },
  getProfile: async (params = {}) => {
    const response = await axiosInstance.get('/teacher/profile', { params });
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/teacher/profile', data);
    return response.data;
  }
};

export default teacherService;
