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
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
  // Bulletproof safety: If running in production browser, NEVER allow localhost:5050
  if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    if (!config.baseURL || config.baseURL.includes('localhost:5050')) {
      config.baseURL = 'https://sms-backend-by-raj-1.onrender.com/api';
    }
  }
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
