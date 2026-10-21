import axiosInstance from './axios';

export const healthService = {
  // Get full health records bundle for logged-in teacher / staff
  getMyHealthRecords: async (params = {}) => {
    const response = await axiosInstance.get('/health/my-records', { params });
    return response.data;
  },

  // Medical Visit Records
  createRecord: async (data) => {
    const response = await axiosInstance.post('/health/records', data);
    return response.data;
  },

  updateRecord: async (id, data) => {
    const response = await axiosInstance.put(`/health/records/${id}`, data);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await axiosInstance.delete(`/health/records/${id}`);
    return response.data;
  },

  // Vaccinations
  addVaccination: async (data) => {
    const response = await axiosInstance.post('/health/vaccinations', data);
    return response.data;
  },

  updateVaccination: async (id, data) => {
    const response = await axiosInstance.put(`/health/vaccinations/${id}`, data);
    return response.data;
  },

  deleteVaccination: async (id) => {
    const response = await axiosInstance.delete(`/health/vaccinations/${id}`);
    return response.data;
  },

  // Medications
  addMedication: async (data) => {
    const response = await axiosInstance.post('/health/medications', data);
    return response.data;
  },

  updateMedication: async (id, data) => {
    const response = await axiosInstance.put(`/health/medications/${id}`, data);
    return response.data;
  },

  deleteMedication: async (id) => {
    const response = await axiosInstance.delete(`/health/medications/${id}`);
    return response.data;
  },

  // Medical Profile
  updateMedicalProfile: async (data) => {
    const response = await axiosInstance.put('/health/medical-profile', data);
    return response.data;
  },

  // Emergency Contacts
  addEmergencyContact: async (data) => {
    const response = await axiosInstance.post('/health/emergency-contacts', data);
    return response.data;
  },

  updateEmergencyContact: async (id, data) => {
    const response = await axiosInstance.put(`/health/emergency-contacts/${id}`, data);
    return response.data;
  },

  deleteEmergencyContact: async (id) => {
    const response = await axiosInstance.delete(`/health/emergency-contacts/${id}`);
    return response.data;
  }
};

export default healthService;
