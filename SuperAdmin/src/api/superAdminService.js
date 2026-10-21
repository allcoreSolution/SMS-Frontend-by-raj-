import axiosInstance from './axios';

export const superAdminService = {
  getDashboardAnalytics: async () =>
    (await axiosInstance.get('/superadmin/dashboard-analytics')).data,

  getSchools: async () => (await axiosInstance.get('/tenant/list')).data,
  createSchool: async (data) => (await axiosInstance.post('/tenant/register', data)).data,
  getPlans: async () => (await axiosInstance.get('/plans/list')).data,

  // Team — aliases for pages that call different names
  getTeam: async () => (await axiosInstance.get('/superadmin/team')).data,
  getTeamMembers: async () => (await axiosInstance.get('/superadmin/team')).data,
  addTeamMember: async (data) => (await axiosInstance.post('/superadmin/team', data)).data,
  updateTeamMember: async (id, data) =>
    (await axiosInstance.put(`/superadmin/team/${id}`, data)).data,
  deleteTeamMember: async (id) =>
    (await axiosInstance.delete(`/superadmin/team/${id}`)).data,

  getRateCards: async () => (await axiosInstance.get('/superadmin/comms/rate-cards')).data,
  updateRateCards: async (data) =>
    (await axiosInstance.put('/superadmin/comms/rate-cards', data)).data,
};
