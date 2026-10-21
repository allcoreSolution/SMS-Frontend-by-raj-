import axiosInstance from './axios';

export const studyService = {
  // --- Classwork & Daily Logbook ---
  getClasswork: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/classwork', { params });
    return response.data;
  },
  createClasswork: async (payload) => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post('/study-center/classwork', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
  updateClasswork: async (id, payload) => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.put(`/study-center/classwork/${id}`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
  deleteClasswork: async (id) => {
    const response = await axiosInstance.delete(`/study-center/classwork/${id}`);
    return response.data;
  },

  // --- Study Materials & Resources ---
  getResources: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/resources', { params });
    return response.data;
  },
  createResource: async (payload) => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post('/study-center/resources', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
  updateResource: async (id, payload) => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.put(`/study-center/resources/${id}`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
  downloadResource: async (id) => {
    const response = await axiosInstance.post(`/study-center/resources/${id}/download`);
    return response.data;
  },
  deleteResource: async (id) => {
    const response = await axiosInstance.delete(`/study-center/resources/${id}`);
    return response.data;
  },

  // --- Homework & Assignments ---
  getHomework: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/homework', { params });
    return response.data;
  },
  createHomework: async (payload) => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post('/study-center/homework', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
  updateHomework: async (id, payload) => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.put(`/study-center/homework/${id}`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
  evaluateHomework: async (id, submissionData) => {
    const response = await axiosInstance.post(`/study-center/homework/${id}/evaluate`, submissionData);
    return response.data;
  },
  deleteHomework: async (id) => {
    const response = await axiosInstance.delete(`/study-center/homework/${id}`);
    return response.data;
  },

  // --- Aggregate Stats ---
  getStats: async () => {
    const response = await axiosInstance.get('/study-center/stats');
    return response.data;
  },

  // --- Syllabus ---
  getSyllabus: async (params = {}) => {
    const response = await axiosInstance.get('/study-center/syllabus', { params });
    return response.data;
  },
  createSyllabusUnit: async (data) => {
    const response = await axiosInstance.post('/study-center/syllabus', data);
    return response.data;
  },
  updateSyllabusUnit: async (id, data) => {
    const response = await axiosInstance.put(`/study-center/syllabus/${id}`, data);
    return response.data;
  },
  deleteSyllabusUnit: async (id) => {
    const response = await axiosInstance.delete(`/study-center/syllabus/${id}`);
    return response.data;
  }
};
