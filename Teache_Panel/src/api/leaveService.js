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
  getTeacherLeaves: async (params = {}) => {
    const response = await axiosInstance.get('/teacher/leaves', { params });
    return response.data;
  },
  applyLeave: async (data) => {
    try {
      const response = await axiosInstance.post('/leaves', data);
      return response.data;
    } catch (err) {
      console.warn('POST /leaves fallback to /teacher/leaves:', err?.message);
      const fallback = await axiosInstance.post('/teacher/leaves', data);
      return fallback.data;
    }
  },
  approveLeave: async (id, data) => {
    const response = await axiosInstance.patch(`/leaves/${id}/approve`, data);
    return response.data;
  },
  rejectLeave: async (id, data) => {
    const response = await axiosInstance.patch(`/leaves/${id}/reject`, data);
    return response.data;
  },
  deleteLeave: async (id) => {
    const response = await axiosInstance.delete(`/leaves/${id}`);
    return response.data;
  }
};

export default leaveService;
