import axiosInstance from './axios';

export const financeService = {
  getFeeCollections: async (studentId) => {
    const res = await axiosInstance.get('/collect-fees', { params: { studentId } });
    return res.data;
  },
  
  getFeeAssignments: async (studentId) => {
    const res = await axiosInstance.get('/assign-fees', { params: { studentId } });
    return res.data;
  },

  getStudentDueFees: async (studentId) => {
    const res = await axiosInstance.get('/search-due-fees/student/my-dues', { params: { studentId } });
    return res.data;
  }
};

export default financeService;
