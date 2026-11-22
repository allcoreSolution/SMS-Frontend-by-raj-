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
  impersonateTenant: async (id) => (await axiosInstance.post(`/superadmin/impersonate/${id}`)).data,
  suspendWithGrace: async (id, data) => (await axiosInstance.post(`/superadmin/tenant/${id}/suspend-grace`, data)).data,
  securityReset: async (id, data) => (await axiosInstance.post(`/superadmin/tenant/${id}/security-reset`, data)).data,
  getBackup: async (id) => (await axiosInstance.get(`/superadmin/tenant/${id}/backup`)).data,
  getAnalytics: async (id) => (await axiosInstance.get(`/superadmin/tenant/${id}/analytics`)).data,
  getBackupsList: async (id) => (await axiosInstance.get(`/superadmin/tenant/${id}/backups`)).data,
  createBackup: async (id) => (await axiosInstance.post(`/superadmin/tenant/${id}/backups`)).data,
  getExplorerData: async (id) => (await axiosInstance.get(`/superadmin/tenant/${id}/explorer`)).data,
  getBillingProfile: async (id) => (await axiosInstance.get(`/superadmin/tenant/${id}/billing-profile`)).data,
  recordBillingPayment: async (id, data) => (await axiosInstance.post(`/superadmin/tenant/${id}/billing-payment`, data)).data,
  getSettingsFull: async (id) => (await axiosInstance.get(`/superadmin/tenant/${id}/settings-full`)).data,
  updateSettingsFull: async (id, data) => (await axiosInstance.put(`/superadmin/tenant/${id}/settings-full`, data)).data,
  createSchoolAdvanced: async (data) => (await axiosInstance.post('/superadmin/create-school-advanced', data)).data,
};
