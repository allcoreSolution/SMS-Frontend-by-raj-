import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

import DriverLayout from './layouts/DriverLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AssignedVehicle from './pages/AssignedVehicle';
import AssignedRoutes from './pages/AssignedRoutes';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Boarding from './pages/Boarding';
import StudentRoster from './pages/StudentRoster';
import LiveTracking from './pages/LiveTracking';
import Inspection from './pages/Inspection';
import Incidents from './pages/Incidents';
import TripHistory from './pages/TripHistory';
import Notifications from './pages/Notifications';
import AttendanceLeave from './pages/AttendanceLeave';
import Settings from './pages/Settings';
import Contacts from './pages/Contacts';

import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }) {
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Driver Portal Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DriverLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="vehicle" element={<AssignedVehicle />} />
                <Route path="routes" element={<AssignedRoutes />} />
                <Route path="trips" element={<Trips />} />
                <Route path="trips/:tripId" element={<TripDetails />} />
                <Route path="boarding" element={<Boarding />} />
                <Route path="roster" element={<StudentRoster />} />
                <Route path="tracking" element={<LiveTracking />} />
                <Route path="inspection" element={<Inspection />} />
                <Route path="incidents" element={<Incidents />} />
                <Route path="history" element={<TripHistory />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="attendance" element={<AttendanceLeave />} />
                <Route path="settings" element={<Settings />} />
                <Route path="contacts" element={<Contacts />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
