import axiosInstance from './axios';

export const academicService = {
  getClasses: async () => {
    const response = await axiosInstance.get('/academics/classes');
    return response.data;
  },
  
  getSubjects: async () => {
    const response = await axiosInstance.get('/academics/subjects');
    return response.data;
  },

  getSections: async () => {
    const response = await axiosInstance.get('/academics/sections');
    return response.data;
  },

  createClass: async (classData) => {
    const response = await axiosInstance.post('/academics/classes', classData);
    return response.data;
  }
};
