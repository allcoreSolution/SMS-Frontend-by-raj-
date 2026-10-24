import axiosInstance from './axios';

export const transportService = {
  // Stats
  getStats: async () => {
    const response = await axiosInstance.get('/transport/stats');
    return response.data;
  },

  // Routes
  getRoutes: async () => {
    const response = await axiosInstance.get('/transport/routes');
    return response.data;
  },
  createRoute: async (data) => {
    const response = await axiosInstance.post('/transport/routes', data);
    return response.data;
  },
  updateRoute: async (id, data) => {
    const response = await axiosInstance.put(`/transport/routes/${id}`, data);
    return response.data;
  },
  deleteRoute: async (id) => {
    const response = await axiosInstance.delete(`/transport/routes/${id}`);
    return response.data;
  },

  // Vehicles
  getVehicles: async () => {
    const response = await axiosInstance.get('/transport/vehicles');
    return response.data;
  },
  addVehicle: async (data) => {
    const response = await axiosInstance.post('/transport/vehicles', data);
    return response.data;
  },
  updateVehicle: async (id, data) => {
    const response = await axiosInstance.put(`/transport/vehicles/${id}`, data);
    return response.data;
  },
  deleteVehicle: async (id) => {
    const response = await axiosInstance.delete(`/transport/vehicles/${id}`);
    return response.data;
  },

  // Drivers
  getDrivers: async (params) => {
    const response = await axiosInstance.get('/transport/drivers', { params });
    return response.data;
  },
  addDriver: async (data) => {
    const response = await axiosInstance.post('/transport/drivers', data);
    return response.data;
  },
  updateDriver: async (id, data) => {
    const response = await axiosInstance.put(`/transport/drivers/${id}`, data);
    return response.data;
  },
  deleteDriver: async (id) => {
    const response = await axiosInstance.delete(`/transport/drivers/${id}`);
    return response.data;
  },

  // Boarding Register
  getBoardingRegister: async (params) => {
    const response = await axiosInstance.get('/transport/boarding', { params });
    return response.data;
  },
  recordBoarding: async (data) => {
    const response = await axiosInstance.post('/transport/boarding', data);
    return response.data;
  },

  // Live GPS Tracking
  getLiveTracking: async () => {
    const response = await axiosInstance.get('/transport/live-tracking');
    return response.data;
  },
  updateVehicleGPS: async (data) => {
    const response = await axiosInstance.post('/transport/gps-ping', data);
    return response.data;
  },

  // Driver App & Admin Operations
  getDriverAssignedData: async (driverId) => {
    const response = await axiosInstance.get(`/transport/driver/assigned${driverId ? `?driverId=${driverId}` : ''}`);
    return response.data;
  },
  startTrip: async (data) => {
    const response = await axiosInstance.post('/transport/driver/trip/start', data);
    return response.data;
  },
  endTrip: async (data) => {
    const response = await axiosInstance.post('/transport/driver/trip/end', data);
    return response.data;
  },
  reportIncident: async (data) => {
    const response = await axiosInstance.post('/transport/driver/incident', data);
    return response.data;
  },
  submitInspection: async (data) => {
    const response = await axiosInstance.post('/transport/driver/inspection', data);
    return response.data;
  },
  getIncidents: async () => {
    const response = await axiosInstance.get('/transport/incidents');
    return response.data;
  },
  getInspections: async () => {
    const response = await axiosInstance.get('/transport/inspections');
    return response.data;
  },
  getTripHistory: async () => {
    const response = await axiosInstance.get('/transport/trips/history');
    return response.data;
  }
};
