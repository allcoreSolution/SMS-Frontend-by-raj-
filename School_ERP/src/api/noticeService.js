import axiosInstance from './axios';

export const noticeService = {
  getNotices: async (params = {}) => {
    const response = await axiosInstance.get('/notices', { params });
    return response.data;
  },
  createNotice: async (data) => {
    const response = await axiosInstance.post('/notices', data);
    return response.data;
  },
  updateNotice: async (id, data) => {
    const response = await axiosInstance.patch(`/notices/${id}`, data);
    return response.data;
  },
  deleteNotice: async (id) => {
    const response = await axiosInstance.delete(`/notices/${id}`);
    return response.data;
  }
};
