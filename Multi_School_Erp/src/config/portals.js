// Centralized Portal URLs configuration
// Automatically connects to live Render deployment, with environment override support

const isDev = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const PORTAL_URLS = {
  teacher: import.meta.env.VITE_TEACHER_URL || (isDev ? 'http://localhost:5177' : 'https://sms-frontend-by-raj-tp.onrender.com'),
  accountant: import.meta.env.VITE_ACCOUNTANT_URL || (isDev ? 'http://localhost:5178' : 'https://sms-frontend-by-raj-acc.onrender.com'),
  admin: import.meta.env.VITE_ADMIN_URL || (isDev ? 'http://localhost:5176' : 'https://sms-frontend-by-raj-serp.onrender.com'),
  superAdmin: import.meta.env.VITE_SUPERADMIN_URL || (isDev ? 'http://localhost:5179' : 'https://sms-frontend-by-raj-supadmin.onrender.com'),
  branch: import.meta.env.VITE_BRANCH_URL || (isDev ? 'http://localhost:5174' : 'https://sms-frontend-by-raj-ba.onrender.com'),
  student: import.meta.env.VITE_STUDENT_URL || (isDev ? 'http://localhost:5175' : 'https://sms-frontend-by-raj-sp.onrender.com'),
  driver: import.meta.env.VITE_DRIVER_URL || (isDev ? 'http://localhost:5180' : 'https://sms-frontend-by-raj-dp.onrender.com'),
  landing: import.meta.env.VITE_LANDING_URL || (isDev ? 'http://localhost:5173' : 'https://sms-frontend-by-raj-4.onrender.com'),
  api: import.meta.env.VITE_API_URL || 'https://sms-backend-by-raj-1.onrender.com/api',
  base: import.meta.env.VITE_BASE_URL || 'https://sms-backend-by-raj-1.onrender.com',
};

export default PORTAL_URLS;
