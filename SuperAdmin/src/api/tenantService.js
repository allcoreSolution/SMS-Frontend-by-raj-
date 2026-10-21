import axiosInstance from './axios';

export const tenantService = {
  getTenants: async () => (await axiosInstance.get('/tenant/list')).data,
  getTenantById: async (id) => (await axiosInstance.get(`/tenant/${id}`)).data,
  updateTenant: async (id, data) => (await axiosInstance.put(`/tenant/${id}`, data)).data,
  registerTenant: async (data) => (await axiosInstance.post('/tenant/register', data)).data,
  deleteTenant: async (id) => (await axiosInstance.delete(`/tenant/${id}`)).data,
  suspendTenant: async (id) => (await axiosInstance.put(`/tenant/${id}/suspend`)).data,
  getDashboardStats: async () => (await axiosInstance.get('/tenant/stats')).data,
  rechargeWallet: async (schoolId, smsAmount, whatsappAmount) =>
    (await axiosInstance.put('/tenant/wallet/recharge', { schoolId, smsAmount, whatsappAmount })).data,
  getAllTickets: async () => (await axiosInstance.get('/tenant/tickets')).data,
};
