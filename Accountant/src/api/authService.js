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
        const user = {
          token,
          _id: userData._id,
          name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : (userData.username || 'Accountant'),
          email: userData.email,
          role: typeof userData.role === 'object' ? userData.role?.name : userData.role || 'Accountant',
          staffId: userData.staffId || 'STF-003',
          tenant: userData.tenant,
        };

        localStorage.setItem('accountant_token', token);
        localStorage.setItem('token', token);
        localStorage.setItem('accountant_user', JSON.stringify(user));

        // Trigger background initial sync with central MongoDB database
        if (typeof localDb.syncFromBackend === 'function') {
          localDb.syncFromBackend().catch(() => {});
        }

        return { success: true, data: user, message: 'Login successful' };
      }
    } catch (err) {
      // If error is invalid credentials returned explicitly by backend (400/401)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // Allow fallback to offline demo credentials if explicitly matched
        if (
          (identifier.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) ||
          (identifier === 'admin123@gmail.com' && password === DEMO_PASSWORD)
        ) {
          const profile = localDb.getProfile();
          const user = {
            token: 'offline-token-' + Date.now(),
            name: profile.name || 'Rajesh Kumar',
            email: profile.email || DEMO_EMAIL,
            role: profile.role || 'Accountant',
            staffId: profile.staffId || 'STF-003',
          };
          localStorage.setItem('accountant_token', user.token);
          localStorage.setItem('accountant_user', JSON.stringify(user));
          return { success: true, data: user, message: 'Login successful (Offline Demo Mode)' };
        }
        return {
          success: false,
          message: err.response.data?.message || 'Invalid credentials. Use accountant@allcoresolution.com / admin@123',
        };
      }
    }

    // Offline / Network fallback
    if (
      (identifier.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) ||
      (identifier === 'admin123@gmail.com' && password === DEMO_PASSWORD) ||
      (identifier && password)
    ) {
      const profile = localDb.getProfile();
      const user = {
        token: 'offline-token-' + Date.now(),
        name: profile.name || 'Rajesh Kumar',
        email: profile.email || DEMO_EMAIL,
        role: profile.role || 'Accountant',
        staffId: profile.staffId || 'STF-003',
      };
      localStorage.setItem('accountant_token', user.token);
      localStorage.setItem('accountant_user', JSON.stringify(user));
      return { success: true, data: user, message: 'Login successful (Offline Fallback)' };
    }

    return {
      success: false,
      message: 'Invalid credentials. Use accountant@allcoresolution.com / admin@123',
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
    localStorage.removeItem('accountant_token');
    localStorage.removeItem('token');
    localStorage.removeItem('accountant_user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('accountant_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!(localStorage.getItem('accountant_token') || localStorage.getItem('token')),
};

export default authService;
