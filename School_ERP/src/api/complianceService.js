import axiosInstance from './axios';

export const complianceService = {
  // 1. Get compliance overview & readiness scores
  getOverview: async () => {
    const res = await axiosInstance.get('/compliance/overview');
    return res.data;
  },

  // 2. School Profile
  getSchoolProfile: async () => {
    const res = await axiosInstance.get('/compliance/school-profile');
    return res.data;
  },

  updateSchoolProfile: async (profileData) => {
    const res = await axiosInstance.put('/compliance/school-profile', profileData);
    return res.data;
  },

  // 3. Compliance Packs
  getPacks: async () => {
    const res = await axiosInstance.get('/compliance/packs');
    return res.data;
  },

  togglePack: async (packId, install) => {
    const res = await axiosInstance.post('/compliance/packs/toggle', { packId, install });
    return res.data;
  },

  // 4. Field Settings
  getFieldSettings: async () => {
    const res = await axiosInstance.get('/compliance/field-settings');
    return res.data;
  },

  updateFieldSettings: async (settingsData) => {
    const res = await axiosInstance.put('/compliance/field-settings', settingsData);
    return res.data;
  },

  // 5. Statutory Document Vault
  getDocuments: async (params = {}) => {
    const res = await axiosInstance.get('/compliance/documents', { params });
    return res.data;
  },

  createDocument: async (docData) => {
    const res = await axiosInstance.post('/compliance/documents', docData);
    return res.data;
  },

  updateDocument: async (id, docData) => {
    const res = await axiosInstance.put(`/compliance/documents/${id}`, docData);
    return res.data;
  },

  deleteDocument: async (id) => {
    const res = await axiosInstance.delete(`/compliance/documents/${id}`);
    return res.data;
  },

  // 6. Compliance Checklist
  getChecklist: async (params = {}) => {
    const res = await axiosInstance.get('/compliance/checklist', { params });
    return res.data;
  },

  createChecklistItem: async (itemData) => {
    const res = await axiosInstance.post('/compliance/checklist', itemData);
    return res.data;
  },

  updateChecklistItem: async (id, itemData) => {
    const res = await axiosInstance.put(`/compliance/checklist/${id}`, itemData);
    return res.data;
  },

  deleteChecklistItem: async (id) => {
    const res = await axiosInstance.delete(`/compliance/checklist/${id}`);
    return res.data;
  },

  // 7. Calendar Events
  getCalendarEvents: async () => {
    const res = await axiosInstance.get('/compliance/calendar');
    return res.data;
  },

  createCalendarEvent: async (eventData) => {
    const res = await axiosInstance.post('/compliance/calendar', eventData);
    return res.data;
  },

  deleteCalendarEvent: async (id) => {
    const res = await axiosInstance.delete(`/compliance/calendar/${id}`);
    return res.data;
  },

  // 8. Data Quality & Validator
  runDataValidator: async () => {
    const res = await axiosInstance.get('/compliance/data-validator');
    return res.data;
  },

  // 9. Government Reports
  getGovernmentReports: async () => {
    const res = await axiosInstance.get('/compliance/government-reports');
    return res.data;
  }
};

export default complianceService;
