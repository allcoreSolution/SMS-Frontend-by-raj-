import axiosInstance from './axios';

export const aiService = {
  // 1. Generate full structured Exam Question Paper + Answer Key (100% Free & Unlimited)
  generateExamPaper: async (params) => {
    const response = await axiosInstance.post('/ai/generate-exam-paper', params);
    return response.data;
  },

  // 2. Generate personalized Student Report Card Remarks (100% Free & Unlimited)
  generateStudentRemarks: async (params) => {
    const response = await axiosInstance.post('/ai/generate-remarks', params);
    return response.data;
  },

  // 3. Generate Teacher 45-Minute Lesson Plan (100% Free & Unlimited)
  generateLessonPlan: async (params) => {
    const response = await axiosInstance.post('/ai/generate-lesson-plan', params);
    return response.data;
  }
};

export default aiService;
