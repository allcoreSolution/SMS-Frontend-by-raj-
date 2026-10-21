import axiosInstance from './axios';

export const osmService = {
  getSessions: async (params = {}) => {
    const res = await axiosInstance.get('/osm', { params });
    return res.data;
  },
  getSessionById: async (id) => {
    const res = await axiosInstance.get(`/osm/${id}`);
    return res.data;
  },
  createSession: async (data) => {
    const res = await axiosInstance.post('/osm', data);
    return res.data;
  },
  updateSession: async (id, data) => {
    const res = await axiosInstance.put(`/osm/${id}`, data);
    return res.data;
  },
  deleteSession: async (id) => {
    const res = await axiosInstance.delete(`/osm/${id}`);
    return res.data;
  },
  evaluateSheet: async (sessionId, payload) => {
    const res = await axiosInstance.post(`/osm/${sessionId}/evaluate-sheet`, payload);
    return res.data;
  },
  moderateSheet: async (sessionId, payload) => {
    const res = await axiosInstance.post(`/osm/${sessionId}/moderate-sheet`, payload);
    return res.data;
  }
};

export default osmService;
