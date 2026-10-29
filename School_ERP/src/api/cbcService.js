import axiosInstance from './axios';

export const cbcService = {
  // Get CBC statistics and rubric performance
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/cbc/stats');
      return response.data;
    } catch (err) {
      console.warn('API /cbc/stats error, using fallback:', err);
      return {
        success: true,
        data: {
          strandsCount: 0,
          assessmentsCount: 0,
          competenciesCount: 0,
          totalScoresRecorded: 0,
          proficiencyRate: 0,
          rubricBreakdown: { exceeding: 0, meeting: 0, approaching: 0, below: 0 }
        }
      };
    }
  },

  // Get Strands & Sub-strands
  getStrands: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/cbc/strands', { params });
      return response.data;
    } catch (err) {
      console.warn('API /cbc/strands error, using fallback:', err);
      return { success: false, data: [] };
    }
  },

  createStrand: async (data) => {
    const response = await axiosInstance.post('/cbc/strands', data);
    return response.data;
  },

  updateStrand: async (id, data) => {
    const response = await axiosInstance.put(`/cbc/strands/${id}`, data);
    return response.data;
  },

  deleteStrand: async (id) => {
    const response = await axiosInstance.delete(`/cbc/strands/${id}`);
    return response.data;
  },

  // Assessments
  getAssessments: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/cbc/assessments', { params });
      return response.data;
    } catch (err) {
      console.warn('API /cbc/assessments error, using fallback:', err);
      return { success: false, data: [] };
    }
  },

  createAssessment: async (data) => {
    const response = await axiosInstance.post('/cbc/assessments', data);
    return response.data;
  },

  updateAssessment: async (id, data) => {
    const response = await axiosInstance.patch(`/cbc/assessments/${id}`, data);
    return response.data;
  },

  deleteAssessment: async (id) => {
    const response = await axiosInstance.delete(`/cbc/assessments/${id}`);
    return response.data;
  }
};

export default cbcService;
