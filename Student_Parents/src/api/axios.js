import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isAndroidPlatform = typeof window !== 'undefined' && (window.location.hostname === 'appassets.androidplatform.net' || !window.location.hostname || window.location.protocol === 'file:');
const defaultHost = (isLocalhost || isAndroidPlatform) ? 'localhost' : window.location.hostname;

const API_BASE_URL = (typeof window !== 'undefined' && window.__API_BASE_URL__) || 
                     (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('api_base_url')) || 
                     import.meta.env.VITE_API_URL || 
                     (isAndroidPlatform ? 'http://192.168.1.5:5050/api' : (isLocalhost ? 'http://localhost:5050/api' : `http://${defaultHost}:5050/api`));

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parent_token') || localStorage.getItem('token');
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
