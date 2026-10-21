import axios from 'axios';

const API_URL = 'http://localhost:5050/api/auth';

export const authService = {
  login: async (credentials) => {
    // Expected credentials shape: { userId: '', password: '' }
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data?.success && response.data?.data?.token) {
      localStorage.setItem('parent_token', response.data.data.token);
      localStorage.setItem('parent_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('parent_token');
    localStorage.removeItem('parent_user');
  },
  
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('parent_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
};
