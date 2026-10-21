import axiosInstance from './axios';

export const messageService = {
  // Get all conversation threads
  getThreads: async (params = {}) => {
    const res = await axiosInstance.get('/chats/threads', { params });
    return res.data;
  },

  // Create new conversation thread
  createThread: async (data) => {
    const res = await axiosInstance.post('/chats/threads', data);
    return res.data;
  },

  // Delete thread
  deleteThread: async (threadId) => {
    const res = await axiosInstance.delete(`/chats/threads/${threadId}`);
    return res.data;
  },

  // Clear thread chat history
  clearThreadHistory: async (threadId) => {
    const res = await axiosInstance.delete(`/chats/threads/${threadId}/clear`);
    return res.data;
  },

  // Toggle pin thread
  togglePinThread: async (threadId) => {
    const res = await axiosInstance.patch(`/chats/threads/${threadId}/pin`);
    return res.data;
  },

  // Get messages of a thread
  getThreadMessages: async (threadId) => {
    const res = await axiosInstance.get(`/chats/threads/${threadId}/messages`);
    return res.data;
  },

  // Send a message in a thread
  sendMessage: async (threadId, data) => {
    const res = await axiosInstance.post(`/chats/threads/${threadId}/messages`, data);
    return res.data;
  },

  // Delete specific message
  deleteMessage: async (threadId, messageId) => {
    const res = await axiosInstance.delete(`/chats/threads/${threadId}/messages/${messageId}`);
    return res.data;
  },

  // Get directory contacts
  getContacts: async () => {
    const res = await axiosInstance.get('/chats/contacts');
    return res.data;
  },

  // Get academic classes
  getClasses: async () => {
    const res = await axiosInstance.get('/academics/classes');
    return res.data;
  },

  // Send real WhatsApp notification
  sendWhatsAppMessage: async (payload) => {
    const res = await axiosInstance.post('/chats/whatsapp/send', payload);
    return res.data;
  },

  // Send real SMS notification via Twilio
  sendSMS: async (payload) => {
    const res = await axiosInstance.post('/chats/sms/send', payload);
    return res.data;
  },

  // Get Twilio SMS status
  getSMSStatus: async () => {
    const res = await axiosInstance.get('/chats/sms/status');
    return res.data;
  }
};

export default messageService;
