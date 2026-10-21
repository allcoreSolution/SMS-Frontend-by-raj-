import axiosInstance from './axios';

export const lessonPlanService = {
  getPlans: async (params = {}) => {
    const res = await axiosInstance.get('/lesson-plans', { params });
    return res.data;
  },
  getPlanById: async (id) => {
    const res = await axiosInstance.get(`/lesson-plans/${id}`);
    return res.data;
  },
  createPlan: async (data) => {
    const res = await axiosInstance.post('/lesson-plans', data);
    return res.data;
  },
  updatePlan: async (id, data) => {
    const res = await axiosInstance.put(`/lesson-plans/${id}`, data);
    return res.data;
  },
  deletePlan: async (id) => {
    const res = await axiosInstance.delete(`/lesson-plans/${id}`);
    return res.data;
  }
};

export default lessonPlanService;
