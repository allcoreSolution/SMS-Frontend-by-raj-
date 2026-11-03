import axios from 'axios';

const isProduction = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://sms-backend-by-raj-1.onrender.com/api' : 'http://localhost:5050/api');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Bearer token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('branch_admin_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('branch_admin_token');
      localStorage.removeItem('branch_admin_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
