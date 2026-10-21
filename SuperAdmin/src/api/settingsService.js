import axiosInstance from './axios';

export const settingsService = {
  getAllSettings: async () => (await axiosInstance.get('/settings')).data,
  getSetting: async (key) => (await axiosInstance.get(`/settings/${key}`)).data,
  saveSetting: async (key, data) => (await axiosInstance.put(`/settings/${key}`, data)).data,
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return (await axiosInstance.post('/settings/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data;
  },
  testSmtp: async (credentials) => (await axiosInstance.post('/settings/test-smtp', credentials)).data,
};
