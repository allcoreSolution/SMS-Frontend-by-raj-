import axiosInstance from './axios';

export const payrollService = {
  getPayroll: async (params = {}) => {
    const response = await axiosInstance.get('/payroll', { params });
    return response.data;
  },
  generatePayroll: async (data) => {
    const response = await axiosInstance.post('/payroll/generate', data);
    return response.data;
  },
  getPayslip: async (id) => {
    const response = await axiosInstance.get(`/payroll/${id}`);
    return response.data;
  },
  processPayroll: async (id, data) => {
    const response = await axiosInstance.patch(`/payroll/${id}/process`, data);
    return response.data;
  }
};
