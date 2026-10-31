import axios from 'axios';

// Resolve current PC LAN IP for physical device connection
const CURRENT_LAN_IP = '192.168.1.20';

// Migrate any stale cached IP (e.g. .11 or .12) in localStorage
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const cached = localStorage.getItem('api_base_url');
    if (cached && (cached.includes('192.168.1.20') || cached.includes('192.168.1.20'))) {
      localStorage.setItem('api_base_url', `http://${CURRENT_LAN_IP}:5050/api`);
    }
  } catch (e) {
    // ignore
  }
}

const defaultHost = (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'app.schoolerp' && window.location.hostname !== 'localhost') 
  ? window.location.hostname 
  : CURRENT_LAN_IP;

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.__API_BASE_URL__) return window.__API_BASE_URL__;
    const cached = window.localStorage && localStorage.getItem('api_base_url');
    if (cached) return cached;
    if (window.location.hostname === 'localhost') return 'http://localhost:5050/api';
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
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.friendlyMessage = `Server connection timed out. Please verify phone & PC are on the same Wi-Fi and Server IP is set to http://${CURRENT_LAN_IP}:5050/api`;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
