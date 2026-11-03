import axios from 'axios';

const isProduction = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://sms-backend-by-raj-1.onrender.com/api' : 'http://localhost:5050/api');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('superadmin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (e) => Promise.reject(e));

axiosInstance.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('superadmin_token');
      localStorage.removeItem('superadmin_user');
      localStorage.removeItem('sa_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
