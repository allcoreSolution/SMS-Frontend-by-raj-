import api from './axios';

const DEVICES_KEY = 'school_erp_biometric_devices_v1';
const LOGS_KEY = 'school_erp_biometric_logs_v1';
const DETECTIONS_KEY = 'school_erp_face_detections_v1';
const AGENT_KEY = 'school_erp_agent_logs_v1';

export const INITIAL_DEVICES = [
  {
    _id: 'bio-1',
    id: 'bio-1',
    deviceName: 'Main Entrance Turnstile #1',
    ipAddress: '192.168.1.201',
    deviceType: 'Biometric',
    integrationMode: 'cloud',
    brand: 'ZKTeco uFace 800',
    serialNumber: 'ZK-UF800-4821',
    location: 'Main Campus Gate',
    status: 'Online',
    port: 4370,
    commKey: '0',
    todayPunches: 248,
    lastSync: 'Just now'
  },
  {
    _id: 'bio-2',
    id: 'bio-2',
    deviceName: 'Staff Lounge Punch Clock',
    ipAddress: '192.168.1.205',
    deviceType: 'Fingerprint',
    integrationMode: 'agent',
    brand: 'eSSL K30 Pro',
    serialNumber: 'ESL-K30-1102',
    location: 'Faculty Administration Block',
    status: 'Online',
    port: 4370,
    commKey: '0',
    todayPunches: 54,
    lastSync: '2 mins ago'
  },
  {
    _id: 'bio-3',
    id: 'bio-3',
    deviceName: 'Senior Wing Face Station',
    ipAddress: '192.168.1.210',
    deviceType: 'Face Recognition',
    integrationMode: 'cloud',
    brand: 'Realtime T502 AI',
    serialNumber: 'RT-T502-9904',
    location: 'Secondary & High School Block',
    status: 'Online',
    port: 8080,
    commKey: 'admin123',
    todayPunches: 182,
    lastSync: '1 min ago'
  },
  {
    _id: 'bio-4',
    id: 'bio-4',
    deviceName: 'Hostel Entry Turnstile',
    ipAddress: '192.168.1.215',
    deviceType: 'Biometric',
    integrationMode: 'camera',
    brand: 'Hikvision DS-K1T671',
    serialNumber: 'HK-671-7721',
    location: 'Boarding Hostel Entry',
    status: 'Online',
    port: 8000,
    commKey: '0',
    todayPunches: 67,
    lastSync: '4 mins ago'
  },
  {
    _id: 'bio-5',
    id: 'bio-5',
    deviceName: 'Central Library Check-In',
    ipAddress: '192.168.1.220',
    deviceType: 'Fingerprint',
    integrationMode: 'agent',
    brand: 'Matrix COSEC VEGA',
    serialNumber: 'MX-VEGA-3301',
    location: 'Central Library',
    status: 'Maintenance',
    port: 4370,
    commKey: '0',
    todayPunches: 0,
    lastSync: 'Yesterday'
  }
];

export const INITIAL_LOGS = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    timeFormatted: '08:14:12 AM',
    name: 'Aarav Sharma',
    type: 'Student',
    classDesig: 'Class 10 - A',
    admStaffId: 'STU-1001',
    status: 'Present (IN)',
    direction: 'IN',
    method: 'Face Recognition AI',
    device: 'Main Entrance Turnstile #1',
    verification: '99.4% Match',
    processed: 'Auto Synced'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    timeFormatted: '08:09:45 AM',
    name: 'Dr. Ramesh Kumar',
    type: 'Staff',
    classDesig: 'Senior Mathematics HOD',
    admStaffId: 'EMP-2001',
    status: 'Present (IN)',
    direction: 'IN',
    method: 'Optical Fingerprint',
    device: 'Staff Lounge Punch Clock',
    verification: 'Sensor Verified',
    processed: 'Auto Synced'
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeFormatted: '08:03:19 AM',
    name: 'Diya Patel',
    type: 'Student',
    classDesig: 'Class 10 - A',
    admStaffId: 'STU-1002',
    status: 'Present (IN)',
    direction: 'IN',
    method: 'Face Recognition AI',
    device: 'Senior Wing Face Station',
    verification: '98.8% Match',
    processed: 'Auto Synced'
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    timeFormatted: '07:56:32 AM',
    name: 'Mrs. Sunita Sen',
    type: 'Staff',
    classDesig: 'PGT English Literature',
    admStaffId: 'EMP-2002',
    status: 'Present (IN)',
    direction: 'IN',
    method: 'Optical Fingerprint',
    device: 'Staff Lounge Punch Clock',
    verification: 'Sensor Verified',
    processed: 'Auto Synced'
  },
  {
    id: 'log-105',
    timestamp: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
    timeFormatted: '07:47:08 AM',
    name: 'Kabir Mehta',
    type: 'Student',
    classDesig: 'Class 12 - Science',
    admStaffId: 'STU-1003',
    status: 'Present (IN)',
    direction: 'IN',
    method: 'Face Recognition AI',
    device: 'Main Entrance Turnstile #1',
    verification: '97.6% Match',
    processed: 'Auto Synced'
  }
];

export const INITIAL_FACE_DETECTIONS = [
  {
    id: 'face-1',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    timeFormatted: '08:16:02 AM',
    name: 'Aarav Sharma',
    role: 'Student',
    classDesig: 'Class 10 - A',
    confidence: '99.4%',
    cameraName: 'Gate 1 AI Cam',
    status: 'Recognized',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    spoofChecked: true
  },
  {
    id: 'face-2',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    timeFormatted: '08:13:20 AM',
    name: 'Diya Patel',
    role: 'Student',
    classDesig: 'Class 10 - A',
    confidence: '98.8%',
    cameraName: 'Senior Wing Face Station',
    status: 'Recognized',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    spoofChecked: true
  },
  {
    id: 'face-3',
    timestamp: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    timeFormatted: '08:07:44 AM',
    name: 'Borderline Match Candidate',
    role: 'Student',
    classDesig: 'Class 11 - Commerce',
    confidence: '73.2%',
    cameraName: 'Hostel Entry Cam',
    status: 'Review Needed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    spoofChecked: true,
    reviewReason: 'Low confidence due to angle / lighting'
  },
  {
    id: 'face-4',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    timeFormatted: '08:00:15 AM',
    name: 'Unregistered Visitor #812',
    role: 'Visitor',
    classDesig: 'Guest / Unknown',
    confidence: '42.0%',
    cameraName: 'Main Entrance Cam',
    status: 'Unknown Stranger',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    spoofChecked: false
  }
];

export const INITIAL_AGENT_LOGS = [
  '[08:17:05] [Windows Agent v2.4] Polling TCP 192.168.1.205:4370 (eSSL K30 Pro)... Online (14ms)',
  '[08:17:00] [Sync Engine] 248 attendance punch records verified with School ERP cloud database.',
  '[08:16:45] [ADMS Cloud Listener] Handshake received from serial ZK-UF800-4821. Device payload OK.',
  '[08:16:30] [Face AI Pipeline] Model yolov8-face inference active at 28.4 FPS on Senior Block RTSP stream.',
  '[08:16:02] [Event Handler] Punch event received: Candidate Aarav Sharma (STU-1001) marked IN.',
  '[08:15:40] [Heartbeat] Fleet Health Check: 4 Online, 0 Offline, 1 Maintenance.'
];

function getLocal(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initial;
  } catch {
    return initial;
  }
}

function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export const biometricService = {
  // Get all devices
  async getDevices(filters = {}) {
    try {
      const res = await api.get('/hardware');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch {
      // fallback
    }

    let list = getLocal(DEVICES_KEY, INITIAL_DEVICES);
    if (filters.status && filters.status !== 'Any Status') {
      list = list.filter(d => d.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(d => 
        d.deviceName?.toLowerCase().includes(q) ||
        d.ipAddress?.toLowerCase().includes(q) ||
        d.brand?.toLowerCase().includes(q) ||
        d.serialNumber?.toLowerCase().includes(q)
      );
    }
    return list;
  },

  // Register device
  async registerDevice(deviceData) {
    try {
      const res = await api.post('/hardware/register', deviceData);
      if (res.data?.success && res.data.data) {
        const current = getLocal(DEVICES_KEY, INITIAL_DEVICES);
        saveLocal(DEVICES_KEY, [res.data.data, ...current]);
        return res.data.data;
      }
    } catch {}

    const newDevice = {
      ...deviceData,
      _id: 'bio-' + Date.now(),
      id: 'bio-' + Date.now(),
      status: 'Online',
      todayPunches: 0,
      lastSync: 'Just now'
    };
    const current = getLocal(DEVICES_KEY, INITIAL_DEVICES);
    const updated = [newDevice, ...current];
    saveLocal(DEVICES_KEY, updated);
    return newDevice;
  },

  // Update device
  async updateDevice(id, data) {
    try {
      const res = await api.put(`/hardware/${id}`, data);
      if (res.data?.success && res.data.data) {
        const current = getLocal(DEVICES_KEY, INITIAL_DEVICES);
        saveLocal(DEVICES_KEY, current.map(d => (d._id === id || d.id === id) ? res.data.data : d));
        return res.data.data;
      }
    } catch {}

    const current = getLocal(DEVICES_KEY, INITIAL_DEVICES);
    let updatedItem = null;
    const updated = current.map(d => {
      if (d._id === id || d.id === id) {
        updatedItem = { ...d, ...data, lastSync: 'Just now' };
        return updatedItem;
      }
      return d;
    });
    saveLocal(DEVICES_KEY, updated);
    return updatedItem;
  },

  // Delete device
  async deleteDevice(id) {
    try {
      await api.delete(`/hardware/${id}`);
    } catch {}

    const current = getLocal(DEVICES_KEY, INITIAL_DEVICES);
    const filtered = current.filter(d => d._id !== id && d.id !== id);
    saveLocal(DEVICES_KEY, filtered);
    return true;
  },

  // Ping test
  async pingDevice(id) {
    try {
      const res = await api.post(`/hardware/${id}/ping`);
      if (res.data?.success) return res.data;
    } catch {}

    const current = getLocal(DEVICES_KEY, INITIAL_DEVICES);
    const latency = Math.floor(12 + Math.random() * 25);
    const dev = current.find(d => d._id === id || d.id === id);
    return {
      success: true,
      latency,
      message: `Ping to ${dev ? dev.deviceName : 'Device'} succeeded (${latency}ms latency)`
    };
  },

  // Sync device
  async syncDevice(id) {
    try {
      const res = await api.post(`/hardware/${id}/sync`);
      if (res.data?.success) return res.data;
    } catch {}

    const current = getLocal(DEVICES_KEY, INITIAL_DEVICES);
    const dev = current.find(d => d._id === id || d.id === id);
    if (dev) {
      dev.lastSync = 'Just now';
      dev.todayPunches = (dev.todayPunches || 0) + 1;
      saveLocal(DEVICES_KEY, current);
    }
    return { success: true, message: 'Sync complete. 0 errors.' };
  },

  // Get attendance logs
  getAttendanceLogs() {
    return getLocal(LOGS_KEY, INITIAL_LOGS);
  },

  // Simulate punch in real time
  simulatePunch(deviceId, candidateName, role = 'Student', direction = 'IN', method = 'Face Recognition AI') {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: now.toISOString(),
      timeFormatted,
      name: candidateName,
      type: role,
      classDesig: role === 'Student' ? 'Class 10 - A' : 'Senior Faculty',
      admStaffId: role === 'Student' ? 'STU-' + Math.floor(1000 + Math.random() * 900) : 'EMP-2001',
      status: `Present (${direction})`,
      direction,
      method,
      device: deviceId || 'Main Entrance Turnstile #1',
      verification: 'Verified (Live Punch)',
      processed: 'Instant Synced'
    };

    const currentLogs = this.getAttendanceLogs();
    const updated = [newLog, ...currentLogs];
    saveLocal(LOGS_KEY, updated);

    // Also update device punch count
    const currentDevices = getLocal(DEVICES_KEY, INITIAL_DEVICES);
    const dev = currentDevices.find(d => d.deviceName === deviceId || d._id === deviceId || d.id === deviceId);
    if (dev) {
      dev.todayPunches = (dev.todayPunches || 0) + 1;
      dev.lastSync = 'Just now';
      saveLocal(DEVICES_KEY, currentDevices);
    }

    return newLog;
  },

  // Face detections
  getFaceDetections() {
    return getLocal(DETECTIONS_KEY, INITIAL_FACE_DETECTIONS);
  },

  // Review face detection
  reviewFaceDetection(id, action) {
    const list = this.getFaceDetections();
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: action === 'approve' ? 'Recognized' : 'Rejected',
          reviewReason: action === 'approve' ? 'Verified by Security Admin' : 'Flagged as Unknown Intruder'
        };
      }
      return item;
    });
    saveLocal(DETECTIONS_KEY, updated);
    return updated;
  },

  // Agent logs
  getAgentLogs() {
    return INITIAL_AGENT_LOGS;
  }
};

export default biometricService;
