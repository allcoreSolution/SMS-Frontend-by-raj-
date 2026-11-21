// Centralized Portal URLs configuration
// Direct live Render cloud deployment URLs

export const PORTAL_URLS = {
  teacher: import.meta.env.VITE_TEACHER_URL || 'https://sms-frontend-by-raj-ts.onrender.com',
  accountant: import.meta.env.VITE_ACCOUNTANT_URL || 'https://sms-frontend-by-raj-acc-z5ie.onrender.com',
  admin: import.meta.env.VITE_ADMIN_URL || 'https://sms-frontend-by-raj-school-erp.onrender.com',
  superAdmin: import.meta.env.VITE_SUPERADMIN_URL || 'https://sms-frontend-by-raj-sa.onrender.com',
  branch: import.meta.env.VITE_BRANCH_URL || 'https://sms-frontend-by-raj-branchadm.onrender.com',
  student: import.meta.env.VITE_STUDENT_URL || 'https://sms-frontend-by-raj-stpt.onrender.com',
  driver: import.meta.env.VITE_DRIVER_URL || 'https://sms-frontend-by-raj-driverp.onrender.com',
  landing: import.meta.env.VITE_LANDING_URL || 'https://sms-frontend-by-raj-multilanding.onrender.com',
  api: import.meta.env.VITE_API_URL || 'https://sms-backend-by-raj-s7dt.onrender.com/api',
  base: import.meta.env.VITE_BASE_URL || 'https://sms-backend-by-raj-s7dt.onrender.com',
};

export default PORTAL_URLS;
