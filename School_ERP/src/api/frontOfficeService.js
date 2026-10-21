import axiosInstance from './axios';

export const frontOfficeService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/front-office/dashboard-stats');
    return response.data;
  },

  // Admission Enquiries
  getEnquiries: async (params = {}) => {
    const response = await axiosInstance.get('/front-office/enquiries', { params });
    return response.data;
  },
  getEnquiryById: async (id) => {
    const response = await axiosInstance.get(`/front-office/enquiries/${id}`);
    return response.data;
  },
  addEnquiry: async (data) => {
    const response = await axiosInstance.post('/front-office/enquiries', data);
    return response.data;
  },
  updateEnquiry: async (id, data) => {
    const response = await axiosInstance.put(`/front-office/enquiries/${id}`, data);
    return response.data;
  },
  deleteEnquiry: async (id) => {
    const response = await axiosInstance.delete(`/front-office/enquiries/${id}`);
    return response.data;
  },

  // Visitor Book
  getVisitors: async (params = {}) => {
    const response = await axiosInstance.get('/front-office/visitors', { params });
    return response.data;
  },
  getVisitorById: async (id) => {
    const response = await axiosInstance.get(`/front-office/visitors/${id}`);
    return response.data;
  },
  addVisitor: async (data) => {
    const response = await axiosInstance.post('/front-office/visitors', data);
    return response.data;
  },
  updateVisitor: async (id, data) => {
    const response = await axiosInstance.put(`/front-office/visitors/${id}`, data);
    return response.data;
  },
  checkoutVisitor: async (id) => {
    const response = await axiosInstance.put(`/front-office/visitors/${id}/checkout`);
    return response.data;
  },
  deleteVisitor: async (id) => {
    const response = await axiosInstance.delete(`/front-office/visitors/${id}`);
    return response.data;
  },

  // Complaints
  getComplaints: async (params = {}) => {
    const response = await axiosInstance.get('/front-office/complaints', { params });
    return response.data;
  },
  getComplaintById: async (id) => {
    const response = await axiosInstance.get(`/front-office/complaints/${id}`);
    return response.data;
  },
  addComplaint: async (data) => {
    const response = await axiosInstance.post('/front-office/complaints', data);
    return response.data;
  },
  updateComplaint: async (id, data) => {
    const response = await axiosInstance.put(`/front-office/complaints/${id}`, data);
    return response.data;
  },
  deleteComplaint: async (id) => {
    const response = await axiosInstance.delete(`/front-office/complaints/${id}`);
    return response.data;
  },

  // Postal Records
  getPostalRecords: async (params = {}) => {
    const response = await axiosInstance.get('/front-office/postal', { params });
    return response.data;
  },
  getPostalRecordById: async (id) => {
    const response = await axiosInstance.get(`/front-office/postal/${id}`);
    return response.data;
  },
  addPostalRecord: async (data) => {
    const response = await axiosInstance.post('/front-office/postal', data);
    return response.data;
  },
  updatePostalRecord: async (id, data) => {
    const response = await axiosInstance.put(`/front-office/postal/${id}`, data);
    return response.data;
  },
  deletePostalRecord: async (id) => {
    const response = await axiosInstance.delete(`/front-office/postal/${id}`);
    return response.data;
  },

  // Gate Passes
  getGatePasses: async (params = {}) => {
    const response = await axiosInstance.get('/front-office/gate-passes', { params });
    return response.data;
  },
  getGatePassById: async (id) => {
    const response = await axiosInstance.get(`/front-office/gate-passes/${id}`);
    return response.data;
  },
  createGatePass: async (data) => {
    const response = await axiosInstance.post('/front-office/gate-passes', data);
    return response.data;
  },
  updateGatePass: async (id, data) => {
    const response = await axiosInstance.put(`/front-office/gate-passes/${id}`, data);
    return response.data;
  },
  updateGatePassStatus: async (id, data) => {
    const response = await axiosInstance.put(`/front-office/gate-passes/${id}/status`, data);
    return response.data;
  },
  deleteGatePass: async (id) => {
    const response = await axiosInstance.delete(`/front-office/gate-passes/${id}`);
    return response.data;
  },

  // Campus Workers
  getCampusWorkers: async (params = {}) => {
    const response = await axiosInstance.get('/front-office/campus-workers', { params });
    return response.data;
  },
  getCampusWorkerById: async (id) => {
    const response = await axiosInstance.get(`/front-office/campus-workers/${id}`);
    return response.data;
  },
  createCampusWorker: async (data) => {
    const response = await axiosInstance.post('/front-office/campus-workers', data);
    return response.data;
  },
  updateCampusWorker: async (id, data) => {
    const response = await axiosInstance.put(`/front-office/campus-workers/${id}`, data);
    return response.data;
  },
  addCampusWorkerLog: async (id, data) => {
    const response = await axiosInstance.post(`/front-office/campus-workers/${id}/logs`, data);
    return response.data;
  },
  deleteCampusWorker: async (id) => {
    const response = await axiosInstance.delete(`/front-office/campus-workers/${id}`);
    return response.data;
  }
};
