import React, { createContext, useContext, useState, useEffect } from 'react';
import { driverService } from '../api/driverService';

const AuthContext = createContext();

const DEFAULT_DRIVER = {
  _id: 'default-drv-001',
  driverId: 'DRV-101',
  name: 'Ramesh Kumar',
  mobile: '+91 98112 23399',
  assignedBus: 'UP 32 AB 1234',
  licence: 'UP-32-2015009871',
  bloodGroup: 'B+',
  status: 'Active'
};

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(() => {
    try {
      const saved = localStorage.getItem('driver_profile');
      return saved ? JSON.parse(saved) : DEFAULT_DRIVER;
    } catch {
      return DEFAULT_DRIVER;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('driver_token') || 'demo-driver-token-drv-101');
  const [vehicle, setVehicle] = useState(null);
  const [route, setRoute] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load driver profile from /api/driver/me on init if token exists
  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      try {
        const res = await driverService.getMe();
        if (res.success && mounted && res.data) {
          setDriver(res.data);
          if (res.data.vehicle) setVehicle(res.data.vehicle);
          if (res.data.route) setRoute(res.data.route);
          if (res.data.activeTrip) setActiveTrip(res.data.activeTrip);
          localStorage.setItem('driver_profile', JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Backend telematics sync on mount:', err.message);
      }
    };

    fetchMe();
    return () => { mounted = false; };
  }, [token]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await driverService.login({
        email: identifier.trim(),
        password: password.trim()
      });

      if (res.success && res.data) {
        const d = res.data;
        const tok = d.token || res.token;
        setToken(tok);
        setDriver(d);
        setVehicle(d.vehicle || null);
        setRoute(d.route || null);
        setActiveTrip(d.activeTrip || null);
        localStorage.setItem('driver_token', tok);
        localStorage.setItem('token', tok);
        localStorage.setItem('driver_profile', JSON.stringify(d));
        return { success: true, data: d };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setDriver(null);
    setToken('');
    setVehicle(null);
    setRoute(null);
    setActiveTrip(null);
    localStorage.removeItem('driver_token');
    localStorage.removeItem('token');
    localStorage.removeItem('driver_profile');
  };

  const refreshProfile = async () => {
    try {
      const res = await driverService.getMe();
      if (res.success) {
        setDriver(res.data);
        setVehicle(res.data.vehicle);
        setRoute(res.data.route);
        setActiveTrip(res.data.activeTrip);
        localStorage.setItem('driver_profile', JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn('Profile refresh note:', err);
    }
  };

  // Listen for cross-component and cross-tab profile updates
  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setDriver(prev => ({ ...prev, ...e.detail }));
      }
    };
    const handleStorage = (e) => {
      if (e.key === 'driver_profile' && e.newValue) {
        try {
          setDriver(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'driver_custom_photo') {
        const val = e.newValue || '';
        setDriver(prev => ({ ...prev, photo: val, avatar: val }));
      }
    };

    window.addEventListener('driver_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('driver_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateDriverState = (updates) => {
    setDriver(prev => {
      const merged = { ...prev, ...updates };
      try {
        localStorage.setItem('driver_profile', JSON.stringify(merged));
        if (updates.photo !== undefined || updates.avatar !== undefined) {
          const p = updates.photo || updates.avatar;
          if (p) {
            localStorage.setItem('driver_custom_photo', p);
          } else {
            localStorage.removeItem('driver_custom_photo');
          }
        }
      } catch (e) {
        // quota safety
      }

      // Broadcast event so all components react immediately without page reload
      try {
        window.dispatchEvent(new CustomEvent('driver_profile_updated', { detail: merged }));
        window.dispatchEvent(new Event('storage'));
      } catch (evtErr) {}

      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{
      driver,
      setDriver,
      updateDriverState,
      token,
      vehicle,
      route,
      activeTrip,
      setActiveTrip,
      loading,
      login,
      logout,
      refreshProfile,
      isAuthenticated: Boolean(token && driver)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
