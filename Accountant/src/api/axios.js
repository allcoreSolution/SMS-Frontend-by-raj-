import axios from 'axios';

const isProduction = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
const LIVE_BACKEND_URL = 'https://sms-backend-by-raj-1.onrender.com/api';

const API_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
  (isProduction ? LIVE_BACKEND_URL : 'http://localhost:5050/api');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Dynamic baseURL check and token attachment
axiosInstance.interceptors.request.use(
  (config) => {
    const dynamicUrl = typeof window !== 'undefined' && (localStorage.getItem('api_server_url') || localStorage.getItem('api_base_url'));
    if (dynamicUrl) {
      config.baseURL = dynamicUrl;
    }

    const token = localStorage.getItem('accountant_token') || localStorage.getItem('token');
    const schoolId = localStorage.getItem('schoolId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (schoolId) {
      config.headers['x-tenant-id'] = schoolId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accountant_token');
      localStorage.removeItem('accountant_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
