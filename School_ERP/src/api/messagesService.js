import axiosInstance from './axios';

const messagesService = {
  // 1. Thread Operations
  getThreads: async (params = {}) => {
    const res = await axiosInstance.get('/chats/threads', { params });
    return res.data;
  },

  createThread: async (threadData) => {
    const res = await axiosInstance.post('/chats/threads', threadData);
    return res.data;
  },

  togglePin: async (threadId) => {
    const res = await axiosInstance.patch(`/chats/threads/${threadId}/pin`);
    return res.data;
  },

  deleteThread: async (threadId) => {
    const res = await axiosInstance.delete(`/chats/threads/${threadId}`);
    return res.data;
  },

  clearHistory: async (threadId) => {
    const res = await axiosInstance.delete(`/chats/threads/${threadId}/clear`);
    return res.data;
  },

  clearAllChats: async () => {
    const res = await axiosInstance.delete(`/chats/clear-all`);
    return res.data;
  },

  // 2. Thread Messages
  getThreadMessages: async (threadId) => {
    const res = await axiosInstance.get(`/chats/threads/${threadId}/messages`);
    return res.data;
  },

  sendMessage: async (threadId, messageData) => {
    const res = await axiosInstance.post(`/chats/threads/${threadId}/messages`, messageData);
    return res.data;
  },

  deleteMessage: async (threadId, messageId) => {
    const res = await axiosInstance.delete(`/chats/threads/${threadId}/messages/${messageId}`);
    return res.data;
  },

  // 3. Contacts & Phone Numbers
  getContacts: async () => {
    const res = await axiosInstance.get('/chats/contacts');
    return res.data;
  },

  addContact: async (contactData) => {
    const res = await axiosInstance.post('/chats/contacts', contactData);
    return res.data;
  },

  deleteContact: async (id) => {
    const res = await axiosInstance.delete(`/chats/contacts/${id}`);
    return res.data;
  },

  // 4. Audio / Video / Phone Calls (CDR)
  startCall: async (callData) => {
    const res = await axiosInstance.post('/chats/calls/start', callData);
    return res.data;
  },

  endCall: async (callId, data) => {
    const res = await axiosInstance.patch(`/chats/calls/${callId}/end`, data);
    return res.data;
  },

  getCallHistory: async () => {
    const res = await axiosInstance.get('/chats/calls/history');
    return res.data;
  },

  // 5. WhatsApp & Student Account Creation
  createAccountAndInvite: async (accountData) => {
    const res = await axiosInstance.post('/chats/create-account', accountData);
    return res.data;
  },

  sendWhatsAppNotification: async (payload) => {
    const res = await axiosInstance.post('/chats/whatsapp/send', payload);
    return res.data;
  },

  getWhatsAppStatus: async () => {
    const res = await axiosInstance.get('/chats/whatsapp/status');
    return res.data;
  },

  getWhatsAppSession: async () => {
    const res = await axiosInstance.get('/chats/whatsapp/session');
    return res.data;
  },

  connectWhatsApp: async (data) => {
    const res = await axiosInstance.post('/chats/whatsapp/connect', data);
    return res.data;
  },

  disconnectWhatsApp: async () => {
    const res = await axiosInstance.post('/chats/whatsapp/disconnect');
    return res.data;
  },

  startDirectChat: async (data) => {
    const res = await axiosInstance.post('/chats/direct-chat', data);
    return res.data;
  }
};

export default messagesService;
