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

const getUserFromStorage = () => {
  try {
    const token = sessionStorage.getItem('superadmin_token') || localStorage.getItem('superadmin_token');
    const saved = sessionStorage.getItem('sa_user') || localStorage.getItem('sa_user');
    if (!token || !saved) return null;
    const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
    if (parsed) {
      const storedAvatar = sessionStorage.getItem('superadmin_user_avatar') || localStorage.getItem('superadmin_user_avatar');
      if (storedAvatar && !parsed.avatar) {
        parsed.avatar = storedAvatar;
      }
      // Ensure session and local are in sync
      if (!sessionStorage.getItem('superadmin_token')) {
        try {
          sessionStorage.setItem('superadmin_token', token);
          sessionStorage.setItem('sa_user', JSON.stringify(parsed));
        } catch (_) {}
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse user from storage:', e);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage);

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
          id: authData._id || authData.id,
          name: authData.username || authData.name || 'Super Admin',
          email: authData.email || email,
          role: (authData.role || 'superadmin').toString().toLowerCase(),
          avatar: (authData.avatar && authData.avatar.length < 50000 ? authData.avatar : '') || storedAvatar || '',
        };

        // Safety: strip huge base64 photos to prevent localStorage quota exhaustion
        const safeAuthData = { ...authData };
        if (safeAuthData.photo && safeAuthData.photo.length > 50000) {
          safeAuthData.photo = '';
        }
        if (safeAuthData.avatar && safeAuthData.avatar.length > 50000) {
          safeAuthData.avatar = '';
        }

        try {
          sessionStorage.setItem('sa_user', JSON.stringify(userData));
          sessionStorage.setItem('superadmin_token', token);
          sessionStorage.setItem('superadmin_user', JSON.stringify(safeAuthData));
          localStorage.setItem('sa_user', JSON.stringify(userData));
          localStorage.setItem('superadmin_token', token);
          localStorage.setItem('superadmin_user', JSON.stringify(safeAuthData));
        } catch (e) {
          console.warn('Storage setItem notice:', e);
        }

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
        try {
          sessionStorage.setItem('sa_user', JSON.stringify(demoUser));
          sessionStorage.setItem('superadmin_token', 'demo_superadmin_jwt_token');
          sessionStorage.setItem('superadmin_user', JSON.stringify(demoUser));
          localStorage.setItem('sa_user', JSON.stringify(demoUser));
          localStorage.setItem('superadmin_token', 'demo_superadmin_jwt_token');
          localStorage.setItem('superadmin_user', JSON.stringify(demoUser));
        } catch (_) {}
        setUser(demoUser);
        return true;
      }
      throw err;
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem('sa_user');
      sessionStorage.removeItem('superadmin_token');
      sessionStorage.removeItem('superadmin_user');
      localStorage.removeItem('sa_user');
      localStorage.removeItem('superadmin_token');
      localStorage.removeItem('superadmin_user');
    } catch (_) {}
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

  const isAuthenticated = () => {
    return !!(user || sessionStorage.getItem('superadmin_token') || localStorage.getItem('superadmin_token'));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
