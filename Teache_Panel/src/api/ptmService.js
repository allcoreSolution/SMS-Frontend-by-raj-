import axiosInstance from './axios';

export const ptmService = {
  // Meetings
  getMeetings: async (params = {}) => {
    const res = await axiosInstance.get('/ptm', { params });
    return res.data;
  },
  getMeetingById: async (id) => {
    const res = await axiosInstance.get(`/ptm/${id}`);
    return res.data;
  },
  createMeeting: async (data) => {
    const res = await axiosInstance.post('/ptm', data);
    return res.data;
  },
  updateMeeting: async (id, data) => {
    const res = await axiosInstance.put(`/ptm/${id}`, data);
    return res.data;
  },
  deleteMeeting: async (id) => {
    const res = await axiosInstance.delete(`/ptm/${id}`);
    return res.data;
  },

  // Roster & Attendance
  updateAttendee: async (meetingId, attendeeId, data) => {
    const res = await axiosInstance.patch(`/ptm/${meetingId}/roster/${attendeeId}`, data);
    return res.data;
  },
  recordBulkAttendance: async (meetingId, updates) => {
    const res = await axiosInstance.post(`/ptm/${meetingId}/roster/bulk-attendance`, { updates });
    return res.data;
  },

  // Follow-ups
  getFollowUps: async (params = {}) => {
    const res = await axiosInstance.get('/ptm/follow-ups', { params });
    return res.data;
  },
  addFollowUp: async (data) => {
    const res = await axiosInstance.post('/ptm/follow-ups', data);
    return res.data;
  }
};

export default ptmService;
