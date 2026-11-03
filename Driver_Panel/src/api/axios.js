import axios from 'axios';

// Resolve current PC LAN IP for physical device connection
const CURRENT_LAN_IP = '192.168.1.5';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const defaultHost = (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'app.schoolerp' && !isLocalhost) 
  ? window.location.hostname 
  : CURRENT_LAN_IP;

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.__API_BASE_URL__) return window.__API_BASE_URL__;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
    const cached = window.localStorage && localStorage.getItem('api_base_url');
    if (cached) return cached;

    // Auto-detect Render deployment / Production domain
    const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isProduction) {
      return import.meta.env.VITE_API_URL || 'https://sms-backend-by-raj-1.onrender.com/api';
    }
  }
  return import.meta.env.VITE_API_URL || `http://${defaultHost}:5050/api`;
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000, // 25s timeout for mobile networks
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Dynamically update baseURL on every request to pick up user/APK IP changes
    config.baseURL = getApiBaseUrl();

    const token = localStorage.getItem('driver_token') || localStorage.getItem('token') || 'demo-driver-token-drv-101';
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
    // Graceful error messages
    const friendlyMessage = error.response?.data?.message || 
      (error.code === 'ECONNABORTED' ? 'Network timeout. Central fleet server is unreachable.' : 'Fleet communication error.');
    error.friendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export default axiosInstance;
