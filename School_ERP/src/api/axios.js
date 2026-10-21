import axios from 'axios';

// Ensure this maps precisely to your Node.js backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Optional: Add intercepted authentication logic here later
axiosInstance.interceptors.request.use((config) => {
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
    // You can parse global responses here, maybe transform pagination format
    return response;
  },
  (error) => {
    console.error('API Call Error: ', error.response || error.message);
    
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('schoolId');
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
