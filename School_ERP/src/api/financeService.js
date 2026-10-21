import axiosInstance from './axios';

// Consolidates the multiple finance routes from backend
export const financeService = {
  // Fee Types
  getFeeTypes: async () => {
    const response = await axiosInstance.get('/fee-types');
    return response.data;
  },
  
  // Fee Groups 
  getFeeGroups: async () => {
    const response = await axiosInstance.get('/fee-groups');
    return response.data;
  },

  // Collect Fees
  collectFee: async (feeData) => {
    const response = await axiosInstance.post('/collect-fees', feeData);
    return response.data;
  },

  // Transactions
  getAllTransactions: async (params = {}) => {
    const response = await axiosInstance.get('/all-transactions', { params });
    return response.data;
  },

  // Expenses
  getExpenses: async (params = {}) => {
    const response = await axiosInstance.get('/expenses', { params });
    return response.data;
  },
  
  createExpense: async (expenseData) => {
    const response = await axiosInstance.post('/expenses', expenseData);
    return response.data;
  },
  deleteExpense: async (id) => {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    return response.data;
  },

  // Incomes
  getIncomes: async (params = {}) => {
    const response = await axiosInstance.get('/incomes', { params });
    return response.data;
  },
  createIncome: async (incomeData) => {
    const response = await axiosInstance.post('/incomes', incomeData);
    return response.data;
  },
  deleteIncome: async (id) => {
    const response = await axiosInstance.delete(`/incomes/${id}`);
    return response.data;
  },

  // Income Heads
  getIncomeHeads: async () => {
    const response = await axiosInstance.get('/income-heads');
    return response.data;
  },
  createIncomeHead: async (data) => {
    const response = await axiosInstance.post('/income-heads', data);
    return response.data;
  },
  deleteIncomeHead: async (id) => {
    const response = await axiosInstance.delete(`/income-heads/${id}`);
    return response.data;
  },

  // Expense Heads
  getExpenseHeads: async () => {
    const response = await axiosInstance.get('/expense-heads');
    return response.data;
  },
  createExpenseHead: async (data) => {
    const response = await axiosInstance.post('/expense-heads', data);
    return response.data;
  },
  deleteExpenseHead: async (id) => {
    const response = await axiosInstance.delete(`/expense-heads/${id}`);
    return response.data;
  },

  // Bank Accounts
  getBankAccounts: async () => {
    const response = await axiosInstance.get('/bank-accounts');
    return response.data;
  },
  createBankAccount: async (data) => {
    const response = await axiosInstance.post('/bank-accounts', data);
    return response.data;
  },
  deleteBankAccount: async (id) => {
    const response = await axiosInstance.delete(`/bank-accounts/${id}`);
    return response.data;
  },

  // Fee Groups
  createFeeGroup: async (data) => {
    const response = await axiosInstance.post('/fee-groups', data);
    return response.data;
  },
  deleteFeeGroup: async (id) => {
    const response = await axiosInstance.delete(`/fee-groups/${id}`);
    return response.data;
  },

  // Assign Fees
  assignFees: async (data) => {
    const response = await axiosInstance.post('/assign-fees', data);
    return response.data;
  },

  // Fee Challans
  getFeeChallans: async (params = {}) => {
    const response = await axiosInstance.get('/fee-challans', { params });
    return response.data;
  },
  createFeeChallan: async (data) => {
    const response = await axiosInstance.post('/fee-challans', data);
    return response.data;
  }
};
