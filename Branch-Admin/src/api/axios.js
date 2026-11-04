import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
  }
  return import.meta.env.VITE_API_URL || 'https://sms-backend-by-raj-1.onrender.com/api';
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach Bearer token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      if (!config.baseURL || config.baseURL.includes('localhost:5050')) {
        config.baseURL = 'https://sms-backend-by-raj-1.onrender.com/api';
      }
    }
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
