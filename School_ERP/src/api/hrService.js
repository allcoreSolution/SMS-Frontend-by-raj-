import axiosInstance from './axios';

export const hrService = {
  // Dashboard
  getHRDashboardStats: async () => {
    const response = await axiosInstance.get('/hr/dashboard-stats');
    return response.data;
  },

  // Staff Directory
  getStaff: async (params = {}) => {
    const response = await axiosInstance.get('/staff', { params: { limit: 100, ...params } });
    return response.data;
  },

  getStaffById: async (id) => {
    const response = await axiosInstance.get(`/staff/${id}`);
    return response.data;
  },

  createStaff: async (staffData) => {
    const response = await axiosInstance.post('/staff', staffData);
    return response.data;
  },

  updateStaff: async (id, staffData) => {
    const response = await axiosInstance.patch(`/staff/${id}`, staffData);
    return response.data;
  },

  deleteStaff: async (id) => {
    const response = await axiosInstance.delete(`/staff/${id}`);
    return response.data;
  },

  // Departments
  getDepartments: async () => {
    const response = await axiosInstance.get('/hr/departments');
    return response.data;
  },
  createDepartment: async (data) => {
    const response = await axiosInstance.post('/hr/departments', data);
    return response.data;
  },
  updateDepartment: async (id, data) => {
    const response = await axiosInstance.put(`/hr/departments/${id}`, data);
    return response.data;
  },
  deleteDepartment: async (id) => {
    const response = await axiosInstance.delete(`/hr/departments/${id}`);
    return response.data;
  },

  // Designations
  getDesignations: async () => {
    const response = await axiosInstance.get('/hr/designations');
    return response.data;
  },
  createDesignation: async (data) => {
    const response = await axiosInstance.post('/hr/designations', data);
    return response.data;
  },
  updateDesignation: async (id, data) => {
    const response = await axiosInstance.put(`/hr/designations/${id}`, data);
    return response.data;
  },
  deleteDesignation: async (id) => {
    const response = await axiosInstance.delete(`/hr/designations/${id}`);
    return response.data;
  },

  // Leave Types
  getLeaveTypes: async () => {
    const response = await axiosInstance.get('/hr/leave-types');
    return response.data;
  },
  createLeaveType: async (data) => {
    const response = await axiosInstance.post('/hr/leave-types', data);
    return response.data;
  },
  updateLeaveType: async (id, data) => {
    const response = await axiosInstance.put(`/hr/leave-types/${id}`, data);
    return response.data;
  },
  deleteLeaveType: async (id) => {
    const response = await axiosInstance.delete(`/hr/leave-types/${id}`);
    return response.data;
  },

  // Leaves & Approval
  getLeaves: async (params = {}) => {
    const response = await axiosInstance.get('/hr/leaves', { params });
    return response.data;
  },
  applyLeave: async (data) => {
    const response = await axiosInstance.post('/hr/leaves', data);
    return response.data;
  },
  approveLeave: async (id, remarks) => {
    const response = await axiosInstance.patch(`/hr/leaves/${id}/approve`, { remarks });
    return response.data;
  },
  rejectLeave: async (id, remarks) => {
    const response = await axiosInstance.patch(`/hr/leaves/${id}/reject`, { remarks });
    return response.data;
  },

  // Salary Templates
  getSalaryTemplates: async () => {
    const response = await axiosInstance.get('/hr/salary-templates');
    return response.data;
  },
  createSalaryTemplate: async (data) => {
    const response = await axiosInstance.post('/hr/salary-templates', data);
    return response.data;
  },
  updateSalaryTemplate: async (id, data) => {
    const response = await axiosInstance.put(`/hr/salary-templates/${id}`, data);
    return response.data;
  },
  deleteSalaryTemplate: async (id) => {
    const response = await axiosInstance.delete(`/hr/salary-templates/${id}`);
    return response.data;
  },
  saveSalaryTemplate: async (data) => {
    const id = data._id || data.id;
    const payload = {
      name: data.templateName || data.name,
      basicSalary: Number(data.basicSalary || 0),
      allowances: (data.allowances || []).filter(a => a.name && a.amount).map(a => ({ name: a.name, amount: Number(a.amount) })),
      deductions: (data.deductions || []).filter(d => d.name && d.amount).map(d => ({ name: d.name, amount: Number(d.amount) })),
      description: data.description || ''
    };
    if (id) {
      const response = await axiosInstance.put(`/hr/salary-templates/${id}`, payload);
      return response.data;
    }
    const response = await axiosInstance.post('/hr/salary-templates', payload);
    return response.data;
  },

  // Staff Salary
  getStaffSalary: async (staffId) => {
    const response = await axiosInstance.get(`/hr/salary/staff/${staffId}`);
    return response.data;
  },
  setStaffSalary: async (staffId, data) => {
    const response = await axiosInstance.post(`/hr/salary/staff/${staffId}`, data);
    return response.data;
  },

  // Staff Loans
  getStaffLoans: async (params = {}) => {
    const response = await axiosInstance.get('/hr/loans', { params });
    return response.data;
  },
  createStaffLoan: async (data) => {
    const response = await axiosInstance.post('/hr/loans', data);
    return response.data;
  },
  updateLoanStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/hr/loans/${id}/status`, { status });
    return response.data;
  },
  deleteStaffLoan: async (id) => {
    const response = await axiosInstance.delete(`/hr/loans/${id}`);
    return response.data;
  },

  // Appraisals
  getAppraisalCycles: async () => {
    const response = await axiosInstance.get('/hr/appraisals/cycles');
    return response.data;
  },
  createAppraisalCycle: async (data) => {
    const response = await axiosInstance.post('/hr/appraisals/cycles', data);
    return response.data;
  },
  getAppraisalCriteria: async () => {
    const response = await axiosInstance.get('/hr/appraisals/criteria');
    return response.data;
  },
  createAppraisalCriterion: async (data) => {
    const response = await axiosInstance.post('/hr/appraisals/criteria', data);
    return response.data;
  },
  getAppraisals: async () => {
    const response = await axiosInstance.get('/hr/appraisals/list');
    return response.data;
  },
  createAppraisal: async (data) => {
    const response = await axiosInstance.post('/hr/appraisals/list', data);
    return response.data;
  }
};

export default hrService;
