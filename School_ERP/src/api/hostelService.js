import axiosInstance from './axios';

export const hostelService = {
  // 1. Dashboard Stats
  getStats: async () => {
    const response = await axiosInstance.get('/hostels/stats');
    return response.data;
  },

  // 2. Hostels CRUD
  getHostels: async () => {
    const response = await axiosInstance.get('/hostels');
    return response.data;
  },
  createHostel: async (data) => {
    const response = await axiosInstance.post('/hostels', data);
    return response.data;
  },
  updateHostel: async (id, data) => {
    const response = await axiosInstance.put(`/hostels/${id}`, data);
    return response.data;
  },
  deleteHostel: async (id) => {
    const response = await axiosInstance.delete(`/hostels/${id}`);
    return response.data;
  },

  // 3. Room Types CRUD
  getRoomTypes: async () => {
    const response = await axiosInstance.get('/hostels/room-types');
    return response.data;
  },
  createRoomType: async (data) => {
    const response = await axiosInstance.post('/hostels/room-types', data);
    return response.data;
  },
  updateRoomType: async (id, data) => {
    const response = await axiosInstance.put(`/hostels/room-types/${id}`, data);
    return response.data;
  },
  deleteRoomType: async (id) => {
    const response = await axiosInstance.delete(`/hostels/room-types/${id}`);
    return response.data;
  },

  // 4. Rooms CRUD
  getRooms: async (params = {}) => {
    const response = await axiosInstance.get('/hostels/rooms', { params });
    return response.data;
  },
  addRoom: async (data) => {
    const response = await axiosInstance.post('/hostels/rooms', data);
    return response.data;
  },
  updateRoom: async (id, data) => {
    const response = await axiosInstance.put(`/hostels/rooms/${id}`, data);
    return response.data;
  },
  deleteRoom: async (id) => {
    const response = await axiosInstance.delete(`/hostels/rooms/${id}`);
    return response.data;
  },

  // 5. Allocations & Deallocations
  getAllocations: async (params = {}) => {
    const response = await axiosInstance.get('/hostels/allocations', { params });
    return response.data;
  },
  allocateBed: async (data) => {
    const response = await axiosInstance.post('/hostels/allocate', data);
    return response.data;
  },
  deallocateBed: async (data) => {
    const response = await axiosInstance.post('/hostels/deallocate', data);
    return response.data;
  },
  deleteAllocation: async (id) => {
    const response = await axiosInstance.delete(`/hostels/allocations/${id}`);
    return response.data;
  },

  // Helper: Get students for allocation modal
  getStudents: async () => {
    const response = await axiosInstance.get('/students');
    return response.data;
  }
};

export default hostelService;
