import axiosInstance from './axios';
import localDb from './localDb';

const DEMO_EMAIL = 'accountant@allcoresolution.com';
const DEMO_PASSWORD = 'admin@123';

export const authService = {
  login: async (credentials) => {
    const identifier = (credentials.email || credentials.username || '').trim();
    const password = credentials.password || '';

    // Attempt real backend authentication first
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: identifier,
        username: identifier,
        password,
      });

      if (response.data && response.data.success) {
        const userData = response.data.data;
        const token = userData.token;
        const rawSchoolName = userData.schoolName || userData.school?.name;
        const safeSchoolName = (rawSchoolName && !rawSchoolName.includes('Xavier')) ? rawSchoolName : 'ALL CORE SOLUTION';
        const schoolObj = {
          name: safeSchoolName,
          shortName: userData.schoolShortName || userData.school?.shortName || 'allcore',
          logo: userData.schoolLogo || userData.school?.logo || null,
        };
        const user = {
          token,
          _id: userData._id,
          name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : (userData.name || userData.username || 'Accountant'),
          email: userData.email,
          role: typeof userData.role === 'object' ? userData.role?.name : userData.role || 'Accountant',
          staffId: userData.staffId || '',
          tenant: userData.tenant,
          school: schoolObj,
          schoolName: safeSchoolName,
          schoolLogo: userData.schoolLogo || schoolObj.logo || null,
          schoolShortName: schoolObj.shortName,
        };

        sessionStorage.setItem('accountant_token', token);
        sessionStorage.setItem('accountant_user', JSON.stringify(user));
        localStorage.setItem('accountant_token', token);
        localStorage.setItem('token', token);
        localStorage.setItem('accountant_user', JSON.stringify(user));
        if (user.schoolName) {
          localStorage.setItem('schoolName', user.schoolName);
        }
        if (user.school) {
          localStorage.setItem('school_info', JSON.stringify(user.school));
        }

        try {
          window.dispatchEvent(new CustomEvent('school_info_updated', { detail: user.school }));
          window.dispatchEvent(new CustomEvent('accountant_profile_updated', { detail: user }));
        } catch (_) {}

        // Trigger background initial sync with central MongoDB database
        if (typeof localDb.syncFromBackend === 'function') {
          localDb.syncFromBackend().catch(() => {});
        }

        return { success: true, data: user, message: 'Login successful' };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials. Please enter valid Accountant credentials.',
      };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please enter valid Accountant credentials.',
    };
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Could not connect to server' };
    }
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      return response.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Failed to reset password' };
    }
  },

  logout: () => {
    sessionStorage.removeItem('accountant_token');
    sessionStorage.removeItem('accountant_user');
    localStorage.removeItem('accountant_token');
    localStorage.removeItem('token');
    localStorage.removeItem('accountant_user');
  },

  getCurrentUser: () => {
    try {
      const user = sessionStorage.getItem('accountant_user') || localStorage.getItem('accountant_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!(sessionStorage.getItem('accountant_token') && sessionStorage.getItem('accountant_user')),
};

export default authService;
