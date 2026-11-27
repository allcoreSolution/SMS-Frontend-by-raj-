import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import SchoolLockedScreen from './SchoolLockedScreen';

const ProtectedRoute = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  const location = useLocation();

  const [isLocked, setIsLocked] = useState(() => {
    try {
      if (localStorage.getItem('school_locked') === 'true') return true;
      if (userStr) {
        const parsed = JSON.parse(userStr);
        if (parsed.schoolLocked || parsed.isTerminated) return true;
        if (parsed.school?.isLocked || parsed.school?.isTerminated) return true;
        if (parsed.tenant?.status === 'Terminated' || parsed.tenant?.status === 'Suspended') return true;
      }
    } catch (_) {}
    return false;
  });

  const [lockMessage, setLockMessage] = useState(() => {
    try {
      return localStorage.getItem('school_lock_message') || 'School account suspended or terminated by SuperAdmin.';
    } catch (_) {
      return 'School account suspended or terminated by SuperAdmin.';
    }
  });

  // Listen for real-time lockout event from axios interceptor
  useEffect(() => {
    const handleLockout = () => {
      setIsLocked(true);
      const msg = localStorage.getItem('school_lock_message') || 'School account suspended or terminated by SuperAdmin.';
      setLockMessage(msg);
    };
    window.addEventListener('school_lockout_triggered', handleLockout);
    return () => window.removeEventListener('school_lockout_triggered', handleLockout);
  }, []);

  if (!token || !userStr) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Parse user for school metadata
  let schoolName = 'School Institution';
  let schoolCode = 'SCH-ERP';
  try {
    const parsed = JSON.parse(userStr);
    schoolName = parsed.schoolName || parsed.school?.name || parsed.tenant?.schoolName || 'School Institution';
    schoolCode = parsed.school?.shortName || parsed.tenant?.schoolCode || parsed.schoolCode || 'SCH-ERP';
  } catch (_) {}

  // If school is locked by SuperAdmin, render the unbypassable lockout screen
  if (isLocked) {
    return (
      <SchoolLockedScreen
        schoolName={schoolName}
        schoolCode={schoolCode}
        reason={lockMessage}
      />
    );
  }

  // If there is a valid token and school is active, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
