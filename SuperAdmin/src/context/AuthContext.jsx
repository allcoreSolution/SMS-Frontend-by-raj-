import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sa_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        username: email,
        password,
      });

      if (response.data && response.data.success) {
        const authData = response.data.data || response.data;
        const token = authData.token;
        if (!token) return false;

        const userData = {
          id: authData._id,
          name: authData.username || authData.name || 'Super Admin',
          email: authData.email || email,
          role: (authData.role || 'superadmin').toString().toLowerCase(),
        };

        localStorage.setItem('sa_user', JSON.stringify(userData));
        localStorage.setItem('superadmin_token', token);
        localStorage.setItem('superadmin_user', JSON.stringify(authData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('SuperAdmin Login API failed, checking demo fallback:', err?.message);
      if ((email === 'ryadavy498@gmail.com' || email === 'admin123@gmail.com') && password === 'admin@123') {
        const demoUser = {
          id: 'demo_superadmin',
          name: 'Super Admin Master',
          email: email,
          role: 'superadmin',
        };
        localStorage.setItem('sa_user', JSON.stringify(demoUser));
        localStorage.setItem('superadmin_token', 'demo_superadmin_jwt_token');
        setUser(demoUser);
        return true;
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('sa_user');
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    setUser(null);
  };

  const updateUser = (data) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('sa_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
