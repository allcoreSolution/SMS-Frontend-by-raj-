import axios from 'axios';

const defaultHost = (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'app.schoolerp' && window.location.hostname !== 'localhost') ? window.location.hostname : '192.168.1.20';
const API_BASE = (typeof window !== 'undefined' && window.__API_BASE_URL__) || (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('api_base_url')) || import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5050/api' : `http://${defaultHost}:5050/api`);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, credentials, {
        timeout: 8000,
      });
      if (response.data?.success && response.data?.data?.token) {
        const udata = {
          ...response.data.data,
          role: response.data.data.role || (credentials.role === 'student' ? 'Student' : 'Parent'),
        };
        localStorage.setItem('parent_token', udata.token);
        localStorage.setItem('parent_user', JSON.stringify(udata));
        
        if (udata.role === 'Student') {
          const sId = udata.studentId || udata._id;
          if (sId) localStorage.setItem('active_child', String(sId));
        } else {
          const firstChild = udata.children && udata.children[0];
          const cId = typeof firstChild === 'object' ? (firstChild._id || firstChild.id) : firstChild;
          if (cId) localStorage.setItem('active_child', String(cId));
        }
      }
      return response.data;
    } catch (err) {
      console.error('Backend login error:', err?.response?.data || err?.message);
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Please check credentials or server connection.';
      return { success: false, message: msg };
    }
  },
  
  logout: () => {
    localStorage.removeItem('parent_token');
    localStorage.removeItem('parent_user');
    localStorage.removeItem('active_child');
  },
  
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('parent_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  forgotPassword: async (identifier) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/forgot-password`, { email: identifier });
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/reset-password`, data);
      return response.data;
    } catch (err) {
      throw err;
    }
  }
};
