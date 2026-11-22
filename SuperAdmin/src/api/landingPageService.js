import axiosInstance from './axios';

export const landingPageService = {
  // Visual Builder Sections
  getSections: async () => {
    const res = await axiosInstance.get('/superadmin/landing-page/sections');
    return res.data;
  },

  createSection: async (data) => {
    const res = await axiosInstance.post('/superadmin/landing-page/sections', data);
    return res.data;
  },

  updateSection: async (id, data) => {
    const res = await axiosInstance.put(`/superadmin/landing-page/sections/${id}`, data);
    return res.data;
  },

  deleteSection: async (id) => {
    const res = await axiosInstance.delete(`/superadmin/landing-page/sections/${id}`);
    return res.data;
  },

  reorderSections: async (orderIds) => {
    const res = await axiosInstance.put('/superadmin/landing-page/sections/reorder', { orderIds });
    return res.data;
  },

  toggleStatus: async () => {
    const res = await axiosInstance.post('/superadmin/landing-page/toggle-status');
    return res.data;
  },

  applyPreset: async (presetKey) => {
    const res = await axiosInstance.post('/superadmin/landing-page/apply-preset', { presetKey });
    return res.data;
  },

  // Full HTML Templates
  getHtmlTemplates: async () => {
    const res = await axiosInstance.get('/superadmin/landing-page/templates');
    return res.data;
  },

  getHtmlTemplateById: async (id) => {
    const res = await axiosInstance.get(`/superadmin/landing-page/templates/${id}`);
    return res.data;
  },

  createHtmlTemplate: async (data) => {
    const res = await axiosInstance.post('/superadmin/landing-page/templates', data);
    return res.data;
  },

  updateHtmlTemplate: async (id, data) => {
    const res = await axiosInstance.put(`/superadmin/landing-page/templates/${id}`, data);
    return res.data;
  },

  deleteHtmlTemplate: async (id) => {
    const res = await axiosInstance.delete(`/superadmin/landing-page/templates/${id}`);
    return res.data;
  },

  switchMode: async (mode) => {
    const res = await axiosInstance.post('/superadmin/landing-page/templates/switch-mode', { mode });
    return res.data;
  },

  activateTemplate: async (id) => {
    const res = await axiosInstance.post(`/superadmin/landing-page/templates/${id}/activate`);
    return res.data;
  },

  importBundledTemplate: async () => {
    const res = await axiosInstance.post('/superadmin/landing-page/templates/import');
    return res.data;
  }
};

export default landingPageService;
