import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: credentials.email || credentials.username,
      username: credentials.username || credentials.email,
      password: credentials.password,
    });
    if (response.data?.success && response.data?.data?.token) {
      localStorage.setItem('superadmin_token', response.data.data.token);
      localStorage.setItem('superadmin_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    localStorage.removeItem('sa_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('superadmin_user');
    return user ? JSON.parse(user) : null;
  },
};
