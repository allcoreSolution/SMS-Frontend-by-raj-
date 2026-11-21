import axiosInstance from './axios';
import branchLocalDb from './branchLocalDb';

export const authService = {
  login: async (credentials = {}) => {
    const identifier = (credentials.email || credentials.username || '').trim();
    const password = credentials.password || '';

    // Attempt real backend authentication first
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: identifier,
        username: identifier,
        password,
      });

      if (response.data?.success && response.data?.data?.token) {
        const userData = response.data.data;
        const token = userData.token;
        const user = {
          name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : (userData.username || 'Branch General Manager'),
          email: userData.email,
          role: typeof userData.role === 'object' ? userData.role?.name : userData.role || 'Branch Admin',
          token,
          _id: userData._id,
        };

        sessionStorage.setItem('branch_admin_token', token);
        sessionStorage.setItem('branch_admin_user', JSON.stringify(user));
        localStorage.setItem('branch_admin_token', token);
        localStorage.setItem('token', token);
        localStorage.setItem('branch_admin_user', JSON.stringify(user));

        // Background sync branches from central DB
        if (typeof branchLocalDb.syncFromBackend === 'function') {
          branchLocalDb.syncFromBackend().catch(() => {});
        }

        return {
          success: true,
          message: 'Logged in successfully (Connected to Central Database)',
          data: user,
        };
      }
    } catch (err) {
      // If server responded with 400/401 invalid credentials or offline
      if (
        (identifier === 'admin@branch.com' && password === 'admin@123') ||
        (identifier === 'admin123@gmail.com' && password === 'admin@123')
      ) {
        const user = {
          name: 'Branch General Manager',
          email: identifier,
          role: 'Branch Admin',
          token: 'demo_token_branch_admin_' + Date.now(),
        };
        sessionStorage.setItem('branch_admin_token', user.token);
        sessionStorage.setItem('branch_admin_user', JSON.stringify(user));
        localStorage.setItem('branch_admin_token', user.token);
        localStorage.setItem('branch_admin_user', JSON.stringify(user));
        return {
          success: true,
          message: 'Logged in successfully (Offline Verified)',
          data: user,
        };
      }
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials. Please enter valid Branch Admin credentials.',
      };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please enter valid Branch Admin credentials.',
    };
  },

  logout: () => {
    sessionStorage.removeItem('branch_admin_token');
    sessionStorage.removeItem('branch_admin_user');
    localStorage.removeItem('branch_admin_token');
    localStorage.removeItem('token');
    localStorage.removeItem('branch_admin_user');
  },

  getCurrentUser: () => {
    try {
      const user = sessionStorage.getItem('branch_admin_user') || localStorage.getItem('branch_admin_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('branch_admin_token') && !!sessionStorage.getItem('branch_admin_user');
  },

  ensureDemoSession: () => {
    // Disabled to strictly require manual login
    return false;
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Could not connect to authentication server' };
    }
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      return response.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Password reset failed' };
    }
  },
};

export default authService;
