import axiosInstance from './axios';

export const feeCollectionService = {
  // Collect Fees
  collectFee: async (data) => {
    const response = await axiosInstance.post('/collect-fees', data);
    return response.data;
  },
  getCollections: async (params = {}) => {
    const response = await axiosInstance.get('/collect-fees', { params });
    return response.data;
  },
  // Assign Fees to students
  assignFee: async (data) => {
    const response = await axiosInstance.post('/assign-fees', data);
    return response.data;
  },
  getAssignedFees: async (params = {}) => {
    const response = await axiosInstance.get('/assign-fees', { params });
    return response.data;
  },
  getAssignedFeeByStudent: async (studentId) => {
    const response = await axiosInstance.get(`/assign-fees/student/${studentId}`);
    return response.data;
  },
  // All Transactions
  getAllTransactions: async (params = {}) => {
    const response = await axiosInstance.get('/all-transactions', { params });
    return response.data;
  },
  // Due Fees
  searchDueFees: async (params = {}) => {
    const response = await axiosInstance.get('/search-due-fees', { params });
    return response.data;
  },
  // Finance Dashboard stats
  getFinanceDashboard: async (params = {}) => {
    const response = await axiosInstance.get('/fees-dashboard', { params });
    return response.data;
  },
  // Fee Challans
  getChallans: async (params = {}) => {
    const response = await axiosInstance.get('/fee-challans', { params });
    return response.data;
  },
  getChallanById: async (id) => {
    const response = await axiosInstance.get(`/fee-challans/${id}`);
    return response.data;
  },
  generateChallan: async (data) => {
    const response = await axiosInstance.post('/fee-challans/generate', data);
    return response.data;
  },
  // Fee Discounts
  getDiscounts: async () => {
    const response = await axiosInstance.get('/fee-discounts');
    return response.data;
  },
  createDiscount: async (data) => {
    const response = await axiosInstance.post('/fee-discounts', data);
    return response.data;
  },
  deleteDiscount: async (id) => {
    const response = await axiosInstance.delete(`/fee-discounts/${id}`);
    return response.data;
  },
  // Carry Forward
  getCarryForward: async (params = {}) => {
    const response = await axiosInstance.get('/fees-carry-forward', { params });
    return response.data;
  },
  // Due Slip
  getDueSlipHistory: async (params = {}) => {
    const response = await axiosInstance.get('/due-slip-history', { params });
    return response.data;
  },
  generateDueSlip: async (data) => {
    const response = await axiosInstance.post('/generate-due-slip', data);
    return response.data;
  },
  // Finance Reports
  getFinanceReports: async (params = {}) => {
    const response = await axiosInstance.get('/finance-reports', { params });
    return response.data;
  },
  // Online Transactions
  getOnlineTransactions: async (params = {}) => {
    const response = await axiosInstance.get('/online-transactions', { params });
    return response.data;
  },
  // Fee Data Audit
  getDataAudits: async () => {
    const response = await axiosInstance.get('/fee-data-audit');
    return response.data;
  },
  runIntegrityCheck: async () => {
    const response = await axiosInstance.post('/fee-data-audit/scan');
    return response.data;
  },
  // Carry Forward execution
  carryForwardDues: async (data) => {
    const response = await axiosInstance.post('/fees-carry-forward', data);
    return response.data;
  },
  // Delete Due Slip batch
  deleteDueSlipBatch: async (id) => {
    const response = await axiosInstance.delete(`/due-slip-history/${id}`);
    return response.data;
  }
};
