import axiosInstance from './axios';

export const hardwareService = {
  getDevices: async (params = {}) => {
    const response = await axiosInstance.get('/hardware', { params });
    return response.data;
  },
  registerDevice: async (data) => {
    const response = await axiosInstance.post('/hardware/register', data);
    return response.data;
  },
  deleteDevice: async (id) => {
    const response = await axiosInstance.delete(`/hardware/${id}`);
    return response.data;
  },
  getAttendanceLogs: async (params = {}) => {
    // For biometric attendance logs, we can use the same QR scan log endpoint or an attendance log endpoint.
    // For now we'll fetch QR logs as they match the scanning semantics.
    const response = await axiosInstance.get('/attendance/qr-scan-logs', { params });
    return response.data;
  }
};
