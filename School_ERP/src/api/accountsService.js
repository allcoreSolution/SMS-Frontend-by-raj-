import axiosInstance from './axios';

export const accountsService = {
  // Accounts Dashboard
  getDashboard: async () => {
    const response = await axiosInstance.get('/accounts/dashboard');
    return response.data;
  },

  // Income
  getIncomes: async (params = {}) => {
    const response = await axiosInstance.get('/incomes', { params });
    return response.data;
  },
  createIncome: async (data) => {
    const response = await axiosInstance.post('/incomes', data);
    return response.data;
  },
  updateIncome: async (id, data) => {
    const response = await axiosInstance.put(`/incomes/${id}`, data);
    return response.data;
  },
  deleteIncome: async (id) => {
    const response = await axiosInstance.delete(`/incomes/${id}`);
    return response.data;
  },

  // Expense
  getExpenses: async (params = {}) => {
    const response = await axiosInstance.get('/expenses', { params });
    return response.data;
  },
  createExpense: async (data) => {
    const response = await axiosInstance.post('/expenses', data);
    return response.data;
  },
  updateExpense: async (id, data) => {
    const response = await axiosInstance.put(`/expenses/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id) => {
    const response = await axiosInstance.delete(`/expenses/${id}`);
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
  updateIncomeHead: async (id, data) => {
    const response = await axiosInstance.put(`/income-heads/${id}`, data);
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
  updateExpenseHead: async (id, data) => {
    const response = await axiosInstance.put(`/expense-heads/${id}`, data);
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
  updateBankAccount: async (id, data) => {
    const response = await axiosInstance.put(`/bank-accounts/${id}`, data);
    return response.data;
  },
  deleteBankAccount: async (id) => {
    const response = await axiosInstance.delete(`/bank-accounts/${id}`);
    return response.data;
  }
};
