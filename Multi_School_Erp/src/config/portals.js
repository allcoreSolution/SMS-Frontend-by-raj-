// Centralized Portal URLs configuration
// Automatically connects to live Render deployment when online, or localhost in development

const isProd = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);

export const PORTAL_URLS = {
  teacher: import.meta.env.VITE_TEACHER_URL || (isProd ? 'https://sms-frontend-by-raj-tp.onrender.com' : 'http://localhost:5177'),
  accountant: import.meta.env.VITE_ACCOUNTANT_URL || (isProd ? 'https://sms-frontend-by-raj-acc.onrender.com' : 'http://localhost:5178'),
  admin: import.meta.env.VITE_ADMIN_URL || (isProd ? 'https://sms-frontend-by-raj-serp.onrender.com' : 'http://localhost:5176'),
  superAdmin: import.meta.env.VITE_SUPERADMIN_URL || (isProd ? 'https://sms-frontend-by-raj-supadmin.onrender.com' : 'http://localhost:5179'),
  branch: import.meta.env.VITE_BRANCH_URL || (isProd ? 'https://sms-frontend-by-raj-ba.onrender.com' : 'http://localhost:5174'),
  student: import.meta.env.VITE_STUDENT_URL || (isProd ? 'https://sms-frontend-by-raj-sp.onrender.com' : 'http://localhost:5175'),
  driver: import.meta.env.VITE_DRIVER_URL || (isProd ? 'https://sms-frontend-by-raj-dp.onrender.com' : 'http://localhost:5180'),
  landing: import.meta.env.VITE_LANDING_URL || (isProd ? 'https://sms-frontend-by-raj-4.onrender.com' : 'http://localhost:5173'),
  api: import.meta.env.VITE_API_URL || (isProd ? 'https://sms-backend-by-raj-1.onrender.com/api' : 'http://localhost:5050/api'),
  base: import.meta.env.VITE_BASE_URL || (isProd ? 'https://sms-backend-by-raj-1.onrender.com' : 'http://localhost:5050'),
};

export default PORTAL_URLS;
