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

  // 1. 1-Click School Impersonation
  impersonateSchool: async (schoolId) =>
    (await axiosInstance.post(`/superadmin/impersonate/${schoolId}`)).data,

  // 2. Real-Time Telemetry & Health
  getTelemetry: async () =>
    (await axiosInstance.get('/superadmin/telemetry')).data,

  // 3. Platform Audit Logs
  getAuditLogs: async (params = {}) =>
    (await axiosInstance.get('/superadmin/audit-logs', { params })).data,
  createAuditLog: async (data) =>
    (await axiosInstance.post('/superadmin/audit-logs', data)).data,

  // 4. Global Broadcast Announcements
  getBroadcasts: async (activeOnly = false) =>
    (await axiosInstance.get('/superadmin/broadcast-announcements', { params: { activeOnly } })).data,
  createBroadcast: async (data) =>
    (await axiosInstance.post('/superadmin/broadcast-announcements', data)).data,
  toggleBroadcast: async (id) =>
    (await axiosInstance.patch(`/superadmin/broadcast-announcements/${id}/toggle`)).data,
  deleteBroadcast: async (id) =>
    (await axiosInstance.delete(`/superadmin/broadcast-announcements/${id}`)).data,

  // 5. Suspension with Grace Period
  suspendWithGrace: async (schoolId, data) =>
    (await axiosInstance.post(`/superadmin/tenant/${schoolId}/suspend-grace`, data)).data,

  // 6. GST Tax Invoices
  generateTaxInvoice: async (data) =>
    (await axiosInstance.post('/superadmin/generate-tax-invoice', data)).data,

  // 7. RBAC Roles & Permissions
  getRoles: async (scope = 'superadmin') =>
    (await axiosInstance.get('/roles', { params: { scope } })).data,
  getPermissionsMatrix: async (scope = 'superadmin') =>
    (await axiosInstance.get('/roles/permissions-matrix', { params: { scope } })).data,
  getRoleById: async (id) =>
    (await axiosInstance.get(`/roles/${id}`)).data,
  createRole: async (data) =>
    (await axiosInstance.post('/roles', data)).data,
  updateRole: async (id, data) =>
    (await axiosInstance.put(`/roles/${id}`, data)).data,
  deleteRole: async (id) =>
    (await axiosInstance.delete(`/roles/${id}`)).data,

  // 8. User Management with Roles
  getRoleUsers: async (params = {}) =>
    (await axiosInstance.get('/roles/users', { params: { scope: 'superadmin', ...params } })).data,
  addRoleUser: async (data) =>
    (await axiosInstance.post('/roles/users', { ...data, scope: 'superadmin' })).data,
  updateRoleUser: async (id, data) =>
    (await axiosInstance.put(`/roles/users/${id}`, data)).data,
  deleteRoleUser: async (id) =>
    (await axiosInstance.delete(`/roles/users/${id}`)).data,
};
