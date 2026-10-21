import axiosInstance from './axios';

export const commsWalletService = {
  // 1. Get Wallet Summary, Quotas & Rates
  getSummary: async () => {
    const res = await axiosInstance.get('/comms-wallet/summary');
    return res.data;
  },

  // 2. Get Ledger Transactions with query params
  getTransactions: async (params = {}) => {
    const res = await axiosInstance.get('/comms-wallet/transactions', { params });
    return res.data;
  },

  // 3. Recharge / Top-Up Wallet
  topupWallet: async (data) => {
    const res = await axiosInstance.post('/comms-wallet/topup', data);
    return res.data;
  },

  // 4. Update Alert & Threshold Settings
  updateSettings: async (data) => {
    const res = await axiosInstance.put('/comms-wallet/settings', data);
    return res.data;
  },

  // 5. Debit Wallet for Broadcast Simulation
  simulateDebit: async (data) => {
    const res = await axiosInstance.post('/comms-wallet/debit', data);
    return res.data;
  }
};

export default commsWalletService;
