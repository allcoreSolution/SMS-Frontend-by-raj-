import React, { createContext, useContext, useState, useEffect } from 'react';
import { driverService } from '../api/driverService';
import { getDriverPhoto, saveDriverPhoto, clearDriverPhoto, getDriverPhotoKey } from '../utils/photoHelper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(() => {
    try {
      const saved = sessionStorage.getItem('driver_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('driver_token') || null);
  const [vehicle, setVehicle] = useState(null);
  const [route, setRoute] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clean up legacy global photo leak on mount
  useEffect(() => {
    try {
      localStorage.removeItem('driver_custom_photo');
    } catch {}
  }, []);

  // Load driver profile from /api/driver/me on init if token exists
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    const fetchMe = async () => {
      try {
        const res = await driverService.getMe();
        if (res.success && mounted && res.data) {
          const d = res.data;
          setDriver(d);
          if (d.vehicle) setVehicle(d.vehicle);
          if (d.route) setRoute(d.route);
          if (d.activeTrip) setActiveTrip(d.activeTrip);
          if (d.photo) saveDriverPhoto(d, d.photo);
          localStorage.setItem('driver_profile', JSON.stringify(d));
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
    const idTrim = (identifier || '').trim();
    const passTrim = (password || '').trim();

    try {
      const res = await driverService.login({
        identifier: idTrim,
        loginId: idTrim,
        userId: idTrim,
        email: idTrim,
        driverId: idTrim,
        password: passTrim,
        role: 'driver'
      });

      if (res && res.success && res.data) {
        const d = res.data;
        const tok = d.token || res.token || `demo-driver-token-${d.driverId || 'drv-101'}`;
        setToken(tok);
        setDriver(d);
        setVehicle(d.vehicle || null);
        setRoute(d.route || null);
        setActiveTrip(d.activeTrip || null);
        if (d.photo) saveDriverPhoto(d, d.photo);
        sessionStorage.setItem('driver_token', tok);
        sessionStorage.setItem('driver_profile', JSON.stringify(d));
        localStorage.setItem('driver_token', tok);
        localStorage.setItem('token', tok);
        localStorage.setItem('driver_profile', JSON.stringify(d));
        return { success: true, data: d };
      }
      
      // If server returned non-success response
      throw new Error(res?.message || 'Invalid driver credentials');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid Driver ID or Security PIN';
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
    sessionStorage.removeItem('driver_token');
    sessionStorage.removeItem('driver_profile');
    localStorage.removeItem('driver_token');
    localStorage.removeItem('token');
    localStorage.removeItem('driver_profile');
    try {
      localStorage.removeItem('driver_custom_photo');
    } catch {}
  };

  const refreshProfile = async () => {
    try {
      const res = await driverService.getMe();
      if (res.success && res.data) {
        setDriver(res.data);
        if (res.data.photo) saveDriverPhoto(res.data, res.data.photo);
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
        const photoVal = updates.photo !== undefined ? updates.photo : updates.avatar;
        if (photoVal !== undefined) {
          saveDriverPhoto(merged, photoVal);
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
