import axiosInstance from './axios';

export const driverService = {
  // Auth
  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data;
  },
  refreshToken: async (token) => {
    const res = await axiosInstance.post('/auth/refresh', { token });
    return res.data;
  },
  logout: async () => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  },
  forgotPassword: async (data) => {
    const res = await axiosInstance.post('/auth/forgot-password', data);
    return res.data;
  },
  resetPassword: async (data) => {
    const res = await axiosInstance.post('/auth/reset-password', data);
    return res.data;
  },

  // Driver Identity & Profile
  getMe: async () => {
    const res = await axiosInstance.get('/driver/me');
    return res.data;
  },
  getProfile: async () => {
    const res = await axiosInstance.get('/driver/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await axiosInstance.patch('/driver/profile', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await axiosInstance.post('/driver/change-password', data);
    return res.data;
  },
  uploadPhoto: async (photoData) => {
    const res = await axiosInstance.post('/driver/photo', { photo: photoData });
    return res.data;
  },
  getActiveDrivers: async () => {
    const res = await axiosInstance.get('/auth/drivers');
    return res.data;
  },

  // Dashboard
  getDashboard: async () => {
    const res = await axiosInstance.get('/driver/dashboard');
    return res.data;
  },

  // Vehicle & Routes
  getAssignedVehicle: async () => {
    const res = await axiosInstance.get('/driver/vehicle');
    return res.data;
  },
  getAssignedRoutes: async () => {
    const res = await axiosInstance.get('/driver/routes');
    return res.data;
  },
  getStudentsRoster: async (params) => {
    const res = await axiosInstance.get('/driver/students', { params });
    return res.data;
  },

  // Trips & Operations
  getTrips: async (params) => {
    const res = await axiosInstance.get('/driver/trips', { params });
    return res.data;
  },
  getTripDetails: async (tripId) => {
    const res = await axiosInstance.get(`/driver/trips/${tripId}`);
    return res.data;
  },
  startTrip: async (data) => {
    const res = await axiosInstance.post('/driver/trips/start', data);
    return res.data;
  },
  endTrip: async (data) => {
    const res = await axiosInstance.post('/driver/trips/end', data);
    return res.data;
  },
  getTripHistory: async (params) => {
    const res = await axiosInstance.get('/driver/trip-history', { params });
    return res.data;
  },

  // Boarding & Drop-off
  getTripBoarding: async (tripId) => {
    const res = await axiosInstance.get(`/driver/trips/${tripId}/boarding`);
    return res.data;
  },
  recordBoarding: async (data) => {
    const res = await axiosInstance.post('/driver/boarding', data);
    return res.data;
  },
  scanQR: async (tripId, qrPayload) => {
    const res = await axiosInstance.post(`/driver/trips/${tripId}/scan-qr`, { qrPayload });
    return res.data;
  },
  verifyQR: async (params) => {
    const payload = typeof params === 'string' ? { qrPayload: params } : (params?.qrPayload ? params : { qrPayload: JSON.stringify(params) });
    const res = await axiosInstance.post('/driver/verify-qr', payload);
    return res.data;
  },

  // GPS Telemetry
  updateGPS: async (data) => {
    const res = await axiosInstance.post('/driver/gps', data);
    return res.data;
  },
  getTripLocation: async (tripId) => {
    const res = await axiosInstance.get(`/driver/trips/${tripId}/location`);
    return res.data;
  },

  // Vehicle Inspection
  submitInspection: async (data) => {
    const res = await axiosInstance.post('/driver/inspections', data);
    return res.data;
  },
  getInspections: async () => {
    const res = await axiosInstance.get('/driver/inspections');
    return res.data;
  },

  // Incidents & Emergency SOS
  reportIncident: async (data) => {
    const res = await axiosInstance.post('/driver/incidents', data);
    return res.data;
  },
  triggerSOS: async (data) => {
    const res = await axiosInstance.post('/driver/sos', { ...data, type: 'SOS', severity: 'Critical' });
    return res.data;
  },
  getIncidents: async () => {
    const res = await axiosInstance.get('/driver/incidents');
    return res.data;
  },

  // Notifications
  getNotifications: async (params) => {
    const res = await axiosInstance.get('/driver/notifications', { params });
    return res.data;
  },
  markNotificationRead: async (id) => {
    const res = await axiosInstance.patch(`/driver/notifications/${id}/read`);
    return res.data;
  },

  // Attendance & Leaves
  getAttendance: async () => {
    const res = await axiosInstance.get('/driver/attendance');
    return res.data;
  },
  markAttendance: async (data) => {
    const res = await axiosInstance.post('/driver/attendance', data);
    return res.data;
  },
  getLeaves: async () => {
    const res = await axiosInstance.get('/driver/leaves');
    return res.data;
  },
  applyLeave: async (data) => {
    const res = await axiosInstance.post('/driver/leaves', data);
    return res.data;
  }
};
