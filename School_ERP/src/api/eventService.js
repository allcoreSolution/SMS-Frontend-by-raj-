import axiosInstance from './axios';

export const eventService = {
  getEvents: async (params = {}) => {
    const response = await axiosInstance.get('/events', { params });
    return response.data;
  },
  createEvent: async (data) => {
    const response = await axiosInstance.post('/events', data);
    return response.data;
  },
  updateEvent: async (id, data) => {
    const response = await axiosInstance.patch(`/events/${id}`, data);
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  }
};
