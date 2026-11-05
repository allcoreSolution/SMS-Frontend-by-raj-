import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
  }
  return import.meta.env.VITE_API_URL || 'https://sms-backend-by-raj-1.onrender.com/api';
};
const API_URL = getApiUrl();

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sa_user');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed) {
        const storedAvatar = localStorage.getItem('superadmin_user_avatar');
        if (storedAvatar && !parsed.avatar) {
          parsed.avatar = storedAvatar;
        }
      }
      return parsed;
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

        const storedAvatar = localStorage.getItem('superadmin_user_avatar') || '';
        const userData = {
          id: authData._id,
          name: authData.username || authData.name || 'Super Admin',
          email: authData.email || email,
          role: (authData.role || 'superadmin').toString().toLowerCase(),
          avatar: authData.avatar || storedAvatar || '',
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
        const storedAvatar = localStorage.getItem('superadmin_user_avatar') || '';
        const demoUser = {
          id: 'demo_superadmin',
          name: 'Super Admin Master',
          email: email,
          role: 'superadmin',
          avatar: storedAvatar,
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
    setUser((prev) => {
      const updatedUser = { ...(prev || {}), ...data };
      if (data?.avatar !== undefined) {
        if (data.avatar) {
          localStorage.setItem('superadmin_user_avatar', data.avatar);
        } else {
          localStorage.removeItem('superadmin_user_avatar');
        }
      }
      try {
        localStorage.setItem('sa_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.warn('Failed to update sa_user in localStorage', e);
      }
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
