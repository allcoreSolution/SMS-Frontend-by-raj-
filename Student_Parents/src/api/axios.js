import axios from 'axios';

const LIVE_BACKEND_URL = 'https://sms-backend-by-raj-1.onrender.com/api';

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isProduction) {
      const stored = localStorage.getItem('api_base_url') || localStorage.getItem('api_override_url');
      if (stored && stored.startsWith('https://') && !stored.includes('localhost')) {
        return stored;
      }
      return import.meta.env.VITE_API_URL || LIVE_BACKEND_URL;
    }
    return (
      window.__API_BASE_URL__ ||
      localStorage.getItem('api_base_url') ||
      import.meta.env.VITE_API_URL ||
      'http://localhost:5050/api'
    );
  }
  return import.meta.env.VITE_API_URL || LIVE_BACKEND_URL;
};

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      if (!config.baseURL || config.baseURL.includes('localhost') || config.baseURL.includes('192.168.') || config.baseURL.startsWith('http://')) {
        config.baseURL = LIVE_BACKEND_URL;
      }
    } else {
      const dynamicBase = getApiBaseUrl();
      if (dynamicBase) config.baseURL = dynamicBase;
    }

    const token = sessionStorage.getItem('parent_token') || localStorage.getItem('parent_token') || sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const schoolId = localStorage.getItem('schoolId');
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
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        console.warn('Unauthorized or token expired');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
