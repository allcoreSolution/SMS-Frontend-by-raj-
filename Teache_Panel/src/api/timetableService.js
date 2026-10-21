import axiosInstance from './axios';

export const timetableService = {
  getTimetable: async (params = {}) => {
    const response = await axiosInstance.get('/teacher/timetable', { params });
    return response.data;
  },

  saveSlot: async (data) => {
    const response = await axiosInstance.post('/teacher/timetable/slot', data);
    return response.data;
  },

  updateSlot: async (id, data) => {
    const response = await axiosInstance.put(`/teacher/timetable/slot/${id}`, data);
    return response.data;
  },

  deleteSlot: async (id) => {
    const response = await axiosInstance.delete(`/teacher/timetable/slot/${id}`);
    return response.data;
  }
};

export default timetableService;
