import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');
  const location = useLocation();

  if (!token || !user) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there is a valid token, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
