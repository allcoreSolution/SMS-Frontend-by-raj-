import axiosInstance from './axios';

export const profileService = {
  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/profile/me');
    return response.data;
  },

  // Update profile details
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/profile/me', profileData);
    return response.data;
  },

  // Upload or update avatar (data URL / base64 or image link)
  uploadAvatar: async (avatar) => {
    const response = await axiosInstance.post('/profile/avatar', { avatar });
    return response.data;
  },

  // Delete custom avatar
  deleteAvatar: async () => {
    const response = await axiosInstance.delete('/profile/avatar');
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/profile/password', passwordData);
    return response.data;
  },

  // Update notification & 2FA preferences
  updatePreferences: async (preferencesData) => {
    const response = await axiosInstance.put('/profile/preferences', preferencesData);
    return response.data;
  },

  // Clear activity history
  clearActivityLog: async () => {
    const response = await axiosInstance.delete('/profile/activity');
    return response.data;
  }
};

export default profileService;
