import axiosInstance from './axios';

export const loanService = {
  getLoans: async (params = {}) => {
    const response = await axiosInstance.get('/teacher/loans', { params });
    return response.data;
  },
  applyLoan: async (data) => {
    const response = await axiosInstance.post('/teacher/loans', data);
    return response.data;
  }
};

export default loanService;
