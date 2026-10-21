import axiosInstance from './axios';

export const leaveService = {
  getLeaveTypes: async () => {
    const response = await axiosInstance.get('/leaves/types');
    return response.data;
  },
  createLeaveType: async (data) => {
    const response = await axiosInstance.post('/leaves/types', data);
    return response.data;
  },
  deleteLeaveType: async (id) => {
    const response = await axiosInstance.delete(`/leaves/types/${id}`);
    return response.data;
  },
  getLeaveApplications: async (params = {}) => {
    const response = await axiosInstance.get('/leaves', { params });
    return response.data;
  },
  applyLeave: async (data) => {
    const response = await axiosInstance.post('/leaves', data);
    return response.data;
  },
  approveLeave: async (id, data) => {
    const response = await axiosInstance.patch(`/leaves/${id}/approve`, data);
    return response.data;
  },
  rejectLeave: async (id, data) => {
    const response = await axiosInstance.patch(`/leaves/${id}/reject`, data);
    return response.data;
  }
};
