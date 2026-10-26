import axios from 'axios';

const defaultHost = (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'app.schoolerp' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ? window.location.hostname : '192.168.1.8';

// Migrate stale IP addresses in localStorage
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const cachedUrl = localStorage.getItem('api_server_url') || localStorage.getItem('api_base_url');
    if (cachedUrl && (cachedUrl.includes('192.168.1.11') || cachedUrl.includes('192.168.1.12'))) {
      const freshUrl = `http://${defaultHost}:5050/api`;
      localStorage.setItem('api_server_url', freshUrl);
      localStorage.setItem('api_base_url', freshUrl);
    }
  } catch (_) {}
}

const API_URL = (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
  (typeof window !== 'undefined' && window.localStorage && (localStorage.getItem('api_server_url') || localStorage.getItem('api_base_url'))) ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (import.meta.env.VITE_API_URL || 'http://localhost:5050/api') : `http://${defaultHost}:5050/api`);

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
