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

// Optional: Add intercepted authentication logic here later
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    if (!config.baseURL || config.baseURL.includes('localhost:5050')) {
      config.baseURL = 'https://sms-backend-by-raj-1.onrender.com/api';
    }
  }
  const token = localStorage.getItem('token');
  const schoolId = localStorage.getItem('schoolId'); // Tenant SaaS ID
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (schoolId) {
    config.headers['x-tenant-id'] = schoolId;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    // You can parse global responses here, maybe transform pagination format
    return response;
  },
  (error) => {
    console.error('API Call Error: ', error.response || error.message);
    
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isAlreadyOnLogin = window.location.pathname === '/login';
      const token = localStorage.getItem('token');
      const isDemoSession = token && token.startsWith('demo-');

      if (!isLoginRequest && !isAlreadyOnLogin && !isDemoSession) {
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
