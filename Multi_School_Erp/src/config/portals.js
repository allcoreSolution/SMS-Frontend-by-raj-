// Centralized Portal URLs configuration
// Works both in unified subpath mode (/teacher, /admin) and standalone port mode (localhost:5177)

const isProd = import.meta.env.PROD;

export const PORTAL_URLS = {
  teacher: import.meta.env.VITE_TEACHER_URL || (isProd ? '/teacher' : 'http://localhost:5177'),
  accountant: import.meta.env.VITE_ACCOUNTANT_URL || (isProd ? '/accountant' : 'http://localhost:5178'),
  admin: import.meta.env.VITE_ADMIN_URL || (isProd ? '/admin' : 'http://localhost:5176'),
  superAdmin: import.meta.env.VITE_SUPERADMIN_URL || (isProd ? '/superadmin' : 'http://localhost:5179'),
  branch: import.meta.env.VITE_BRANCH_URL || (isProd ? '/branch' : 'http://localhost:5174'),
  student: import.meta.env.VITE_STUDENT_URL || (isProd ? '/student' : 'http://localhost:5175'),
  driver: import.meta.env.VITE_DRIVER_URL || (isProd ? '/driver' : 'http://localhost:5180'),
  api: import.meta.env.VITE_API_URL || (isProd ? 'https://sms-backend-by-raj-1.onrender.com/api' : 'http://localhost:5050/api'),
  base: import.meta.env.VITE_BASE_URL || (isProd ? 'https://sms-backend-by-raj-1.onrender.com' : 'http://localhost:5050'),
};

export default PORTAL_URLS;
