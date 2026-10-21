import axiosInstance from './axios';

export const notificationService = {
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/mark-all-read');
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  }
};

export default notificationService;
