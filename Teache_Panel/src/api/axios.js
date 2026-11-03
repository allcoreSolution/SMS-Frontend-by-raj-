import axios from 'axios';

// Dynamically resolve API URL supporting Web & Mobile APK (Android WebView)
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.__ERP_API_BASE_URL__) return window.__ERP_API_BASE_URL__;
    if (window.__API_BASE_URL__) return window.__API_BASE_URL__;
    const override = localStorage.getItem('api_override_url') || localStorage.getItem('api_base_url');
    if (override) return override;

    // Auto-detect Render deployment / Production domain
    const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isProduction) {
      return import.meta.env.VITE_API_URL || 'https://sms-backend-by-raj-1.onrender.com/api';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
};

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const dynamicBase = getApiBaseUrl();
  if (dynamicBase) {
    config.baseURL = dynamicBase;
  }

  const token = localStorage.getItem('token');
  const schoolId = localStorage.getItem('schoolId'); // Tenant SaaS ID
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (schoolId) {
    config.headers['x-tenant-id'] = schoolId;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Graceful error logging without spam
    if (error.response) {
      console.warn(`[API ${error.response.status}] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response.data?.message || error.response.statusText);
    } else {
      console.warn('API Network/Connection Error: ', error.message);
    }
    
    // Only perform forced logout if an EXPLICIT authentication verification endpoint rejects the token
    if (error.response && error.response.status === 401) {
      const reqUrl = error.config?.url || '';
      const isLoginRequest = reqUrl.includes('/auth/login');
      const isAuthVerifyRequest = reqUrl.includes('/auth/me') || reqUrl.includes('/auth/verify') || reqUrl.includes('/auth/refresh');
      const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/login');
      
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      const isDemoSession = !token || token.startsWith('demo_') || token.startsWith('demo-') || token.includes('demo');

      // NEVER log out a user if:
      // 1. They are already on the login page or attempting to log in
      // 2. They are running in demo/offline staff or teacher mode
      // 3. The 401 was returned by an optional feature endpoint (e.g. /chats/..., /surveys, /loans, /health)
      //    because individual feature pages have local seed fallbacks.
      if (!isLoginRequest && !isOnLoginPage && !isDemoSession && isAuthVerifyRequest) {
        console.warn('Authentication token expired on core verify endpoint. Redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('schoolId');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
