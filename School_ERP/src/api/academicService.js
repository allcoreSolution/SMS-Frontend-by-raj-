import axiosInstance from './axios';

export const academicService = {
  // Dashboard & Staff
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/academics/dashboard-stats');
    return response.data;
  },

  getTeachers: async () => {
    const response = await axiosInstance.get('/academics/teachers');
    return response.data;
  },

  // Classes
  getClasses: async () => {
    const response = await axiosInstance.get('/academics/classes');
    return response.data;
  },

  createClass: async (classData) => {
    const response = await axiosInstance.post('/academics/classes', classData);
    return response.data;
  },

  updateClass: async (id, classData) => {
    const response = await axiosInstance.put(`/academics/classes/${id}`, classData);
    return response.data;
  },

  deleteClass: async (id) => {
    const response = await axiosInstance.delete(`/academics/classes/${id}`);
    return response.data;
  },

  assignSectionToClass: async (classId, sectionId) => {
    const response = await axiosInstance.post('/academics/classes/assign-section', { classId, sectionId });
    return response.data;
  },

  // Sections
  getSections: async () => {
    const response = await axiosInstance.get('/academics/sections');
    return response.data;
  },

  createSection: async (sectionData) => {
    const response = await axiosInstance.post('/academics/sections', sectionData);
    return response.data;
  },

  updateSection: async (id, sectionData) => {
    const response = await axiosInstance.put(`/academics/sections/${id}`, sectionData);
    return response.data;
  },

  deleteSection: async (id) => {
    const response = await axiosInstance.delete(`/academics/sections/${id}`);
    return response.data;
  },

  // Subjects
  getSubjects: async () => {
    const response = await axiosInstance.get('/academics/subjects');
    return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await axiosInstance.post('/academics/subjects', subjectData);
    return response.data;
  },

  updateSubject: async (id, subjectData) => {
    const response = await axiosInstance.put(`/academics/subjects/${id}`, subjectData);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await axiosInstance.delete(`/academics/subjects/${id}`);
    return response.data;
  },

  // Sessions
  getSessions: async () => {
    const response = await axiosInstance.get('/academics/sessions');
    return response.data;
  },

  createSession: async (sessionData) => {
    const response = await axiosInstance.post('/academics/sessions', sessionData);
    return response.data;
  },

  updateSession: async (id, sessionData) => {
    const response = await axiosInstance.put(`/academics/sessions/${id}`, sessionData);
    return response.data;
  },

  setCurrentSession: async (id) => {
    const response = await axiosInstance.put(`/academics/sessions/${id}/set-current`);
    return response.data;
  },

  deleteSession: async (id) => {
    const response = await axiosInstance.delete(`/academics/sessions/${id}`);
    return response.data;
  },

  // Subject Assignments
  assignSubjectsToClass: async (classId, subjectIds) => {
    const response = await axiosInstance.post(`/academics/classes/${classId}/assign-subjects`, { subjectIds });
    return response.data;
  },

  assignSubjectsBulk: async (assignments) => {
    const response = await axiosInstance.post('/academics/classes/assign-subjects-bulk', { assignments });
    return response.data;
  },

  // Class Teachers
  getClassTeachers: async () => {
    const response = await axiosInstance.get('/academics/class-teachers');
    return response.data;
  },

  assignClassTeacher: async (data) => {
    const response = await axiosInstance.post('/academics/class-teachers', data);
    return response.data;
  },

  deleteClassTeacher: async (id) => {
    const response = await axiosInstance.delete(`/academics/class-teachers/${id}`);
    return response.data;
  },

  // Electives
  getStudentsForElectives: async (params = {}) => {
    const response = await axiosInstance.get('/academics/electives/students', { params });
    return response.data;
  },

  assignStudentElectives: async (studentId, electiveIds) => {
    const response = await axiosInstance.post('/academics/electives/assign', { studentId, electiveIds });
    return response.data;
  },

  bulkAssignElectives: async (assignments) => {
    const response = await axiosInstance.post('/academics/electives/bulk-assign', { assignments });
    return response.data;
  },

  // Periods
  getPeriodSets: async () => {
    const response = await axiosInstance.get('/academics/periods');
    return response.data;
  },

  createPeriodSet: async (setData) => {
    const response = await axiosInstance.post('/academics/periods', setData);
    return response.data;
  },

  updatePeriodSet: async (id, setData) => {
    const response = await axiosInstance.put(`/academics/periods/${id}`, setData);
    return response.data;
  },

  deletePeriodSet: async (id) => {
    const response = await axiosInstance.delete(`/academics/periods/${id}`);
    return response.data;
  },

  // Timetable
  getTimetable: async (params = {}) => {
    const response = await axiosInstance.get('/academics/timetable', { params });
    return response.data;
  },

  saveTimetableSlot: async (slotData) => {
    const response = await axiosInstance.post('/academics/timetable/save-slot', slotData);
    return response.data;
  },

  deleteTimetableSlot: async (id) => {
    const response = await axiosInstance.delete(`/academics/timetable/slot/${id}`);
    return response.data;
  },

  // Promotion & Rollover
  getEligibleStudentsForPromotion: async (params = {}) => {
    const response = await axiosInstance.get('/academics/promote/eligible-students', { params });
    return response.data;
  },

  promoteStudents: async (data) => {
    const response = await axiosInstance.post('/academics/promote/execute', data);
    return response.data;
  },

  executeYearEndRollover: async (data) => {
    const response = await axiosInstance.post('/academics/rollover/execute', data);
    return response.data;
  }
};
