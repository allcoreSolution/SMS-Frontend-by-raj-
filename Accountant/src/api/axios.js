import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
  }
  return import.meta.env.VITE_API_URL || 
    (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
    'https://sms-backend-by-raj-1.onrender.com/api';
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Dynamic baseURL check and token attachment
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      if (!config.baseURL || config.baseURL.includes('localhost:5050')) {
        config.baseURL = 'https://sms-backend-by-raj-1.onrender.com/api';
      }
    }
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
