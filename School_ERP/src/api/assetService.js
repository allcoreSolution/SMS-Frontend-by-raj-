import axiosInstance from './axios';

export const assetService = {
  // 1. Dashboard Stats
  getStats: async () => {
    const res = await axiosInstance.get('/assets/stats');
    return res.data;
  },

  // 2. Assets Register CRUD
  getAssets: async (params = {}) => {
    const res = await axiosInstance.get('/assets', { params });
    return res.data;
  },
  getAssetById: async (id) => {
    const res = await axiosInstance.get(`/assets/${id}`);
    return res.data;
  },
  addAsset: async (data) => {
    const res = await axiosInstance.post('/assets', data);
    return res.data;
  },
  updateAsset: async (id, data) => {
    const res = await axiosInstance.put(`/assets/${id}`, data);
    return res.data;
  },
  deleteAsset: async (id) => {
    const res = await axiosInstance.delete(`/assets/${id}`);
    return res.data;
  },

  // 3. Categories CRUD
  getCategories: async () => {
    const res = await axiosInstance.get('/assets/categories');
    return res.data;
  },
  addCategory: async (data) => {
    const res = await axiosInstance.post('/assets/categories', data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await axiosInstance.put(`/assets/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await axiosInstance.delete(`/assets/categories/${id}`);
    return res.data;
  },

  // 4. Allocations / Assignments
  getAllocations: async (params = {}) => {
    const res = await axiosInstance.get('/assets/allocations', { params });
    return res.data;
  },
  issueAsset: async (data) => {
    const res = await axiosInstance.post('/assets/issue', data);
    return res.data;
  },
  returnAsset: async (data) => {
    const res = await axiosInstance.post('/assets/return', data);
    return res.data;
  },

  // 5. Maintenance
  getMaintenances: async (params = {}) => {
    const res = await axiosInstance.get('/assets/maintenances', { params });
    return res.data;
  },
  addMaintenance: async (data) => {
    const res = await axiosInstance.post('/assets/maintenances', data);
    return res.data;
  },
  completeMaintenance: async (id, data) => {
    const res = await axiosInstance.put(`/assets/maintenances/${id}/complete`, data);
    return res.data;
  },

  // 6. Disposals
  getDisposals: async () => {
    const res = await axiosInstance.get('/assets/disposals');
    return res.data;
  },
  disposeAsset: async (data) => {
    const res = await axiosInstance.post('/assets/disposals', data);
    return res.data;
  },

  // 7. Audits
  getAudits: async () => {
    const res = await axiosInstance.get('/assets/audits');
    return res.data;
  },
  addAudit: async (data) => {
    const res = await axiosInstance.post('/assets/audits', data);
    return res.data;
  },

  // 8. Staff for Assignment
  getStaff: async () => {
    const res = await axiosInstance.get('/staff');
    return res.data;
  }
};

export default assetService;
