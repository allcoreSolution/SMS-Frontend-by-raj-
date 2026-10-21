import axiosInstance from './axios';

export const planService = {
  getPlans: async () => (await axiosInstance.get('/plans/list')).data,
  createPlan: async (data) => (await axiosInstance.post('/plans/create', data)).data,
  updatePlan: async (id, data) => (await axiosInstance.put(`/plans/${id}`, data)).data,
  deletePlan: async (id) => (await axiosInstance.delete(`/plans/${id}`)).data,
};
