import axiosInstance from './axios';

const STORAGE_KEY_MEETINGS = 'school_erp_ptm_meetings';
const STORAGE_KEY_FOLLOWUPS = 'school_erp_ptm_followups';

// Initial realistic default mock data (empty for real data mode)
const DEFAULT_STUDENTS = [];

const DEFAULT_MEETINGS = [];

const DEFAULT_FOLLOWUPS = [];

// LocalStorage helpers
function getLocalMeetings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEETINGS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    // Ignore legacy dummy items
    if (Array.isArray(parsed)) {
      return parsed.filter(m => !m.id?.startsWith('ptm-') || m._id);
    }
    return [];
  } catch (e) {
    return [];
  }
}

function saveLocalMeetings(meetings) {
  try {
    localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(meetings));
  } catch (e) {
    console.error('Failed to save meetings to localStorage:', e);
  }
}

function getLocalFollowUps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FOLLOWUPS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(f => !f.id?.startsWith('fol-'));
    }
    return [];
  } catch (e) {
    return [];
  }
}

function saveLocalFollowUps(followUps) {
  try {
    localStorage.setItem(STORAGE_KEY_FOLLOWUPS, JSON.stringify(followUps));
  } catch (e) {
    console.error('Failed to save follow-ups to localStorage:', e);
  }
}

export const ptmService = {
  // Fetch all meetings with optional filters
  getMeetings: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/ptm', { params: filters });
      if (response.data && response.data.data && response.data.data.length > 0) {
        // Merge with local storage if desired or return DB data
        const dbData = response.data.data.map(m => ({
          ...m,
          id: m._id || m.id,
          invitedCount: m.roster?.length || m.invitedCount || 0
        }));
        saveLocalMeetings(dbData);
        return dbData;
      }
    } catch (e) {
      console.warn('Backend /api/ptm not responding, falling back to local storage cache.', e.message);
    }

    // Fallback to local storage
    let meetings = getLocalMeetings();
    
    // Apply filters
    if (filters.status && filters.status !== 'All' && filters.status !== 'All statuses') {
      meetings = meetings.filter(m => m.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.scope && filters.scope !== 'All' && filters.scope !== 'All classes') {
      meetings = meetings.filter(m => 
        (m.scope && m.scope.toLowerCase().includes(filters.scope.toLowerCase())) ||
        (m.className && m.className.toLowerCase().includes(filters.scope.toLowerCase()))
      );
    }
    if (filters.from) {
      meetings = meetings.filter(m => new Date(m.meetingDate) >= new Date(filters.from));
    }
    if (filters.to) {
      meetings = meetings.filter(m => new Date(m.meetingDate) <= new Date(filters.to));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      meetings = meetings.filter(m => 
        m.title.toLowerCase().includes(q) ||
        (m.venue && m.venue.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q))
      );
    }
    return meetings;
  },

  // Get single meeting by ID
  getMeetingById: async (id) => {
    try {
      const response = await axiosInstance.get(`/ptm/${id}`);
      if (response.data && response.data.data) {
        const item = response.data.data;
        return {
          ...item,
          id: item._id || item.id,
          invitedCount: item.roster?.length || item.invitedCount || 0
        };
      }
    } catch (e) {
      console.warn(`Backend /api/ptm/${id} not responding, using localStorage.`, e.message);
    }

    const meetings = getLocalMeetings();
    const found = meetings.find(m => String(m.id) === String(id) || String(m._id) === String(id));
    if (found) return found;

    // Default fallback to first meeting if invalid ID
    return meetings[0] || null;
  },

  // Create new meeting
  createMeeting: async (meetingData) => {
    const newId = 'ptm-' + Date.now();
    let roster = meetingData.roster || [];
    
    // If build roster requested and empty, clone default students
    if (meetingData.buildRoster && (!roster || roster.length === 0)) {
      roster = DEFAULT_STUDENTS.map((s, idx) => ({
        ...s,
        id: `std_new_${idx + 1}`,
        className: meetingData.className && meetingData.className !== '-- Select Class --' ? meetingData.className : s.className,
        attendance: 'Pending',
        remarks: ''
      }));
    }

    const newMeeting = {
      ...meetingData,
      id: newId,
      status: meetingData.status || 'Scheduled',
      invitedCount: roster.length || 20,
      roster: roster
    };

    try {
      const res = await axiosInstance.post('/ptm', newMeeting);
      if (res.data && res.data.data) {
        const saved = res.data.data;
        newMeeting._id = saved._id;
      }
    } catch (e) {
      console.warn('Backend creation failed, storing in localStorage.', e.message);
    }

    const meetings = getLocalMeetings();
    meetings.unshift(newMeeting);
    saveLocalMeetings(meetings);

    return newMeeting;
  },

  // Update existing meeting
  updateMeeting: async (id, updatedFields) => {
    try {
      await axiosInstance.put(`/ptm/${id}`, updatedFields);
    } catch (e) {
      console.warn('Backend update failed, updating in localStorage.', e.message);
    }

    const meetings = getLocalMeetings();
    const index = meetings.findIndex(m => String(m.id) === String(id) || String(m._id) === String(id));
    if (index !== -1) {
      meetings[index] = { ...meetings[index], ...updatedFields };
      saveLocalMeetings(meetings);
      return meetings[index];
    }
    return null;
  },

  // Delete meeting
  deleteMeeting: async (id) => {
    try {
      await axiosInstance.delete(`/ptm/${id}`);
    } catch (e) {
      console.warn('Backend delete failed, removing from localStorage.', e.message);
    }

    const meetings = getLocalMeetings();
    const filtered = meetings.filter(m => String(m.id) !== String(id) && String(m._id) !== String(id));
    saveLocalMeetings(filtered);
    return true;
  },

  // Update attendee attendance or remark
  updateAttendee: async (meetingId, attendeeId, attendeeFields) => {
    try {
      await axiosInstance.patch(`/ptm/${meetingId}/roster/${attendeeId}`, attendeeFields);
    } catch (e) {
      console.warn('Backend attendee update failed, updating localStorage.', e.message);
    }

    const meetings = getLocalMeetings();
    const meeting = meetings.find(m => String(m.id) === String(meetingId) || String(m._id) === String(meetingId));
    if (meeting && meeting.roster) {
      const attendee = meeting.roster.find(r => String(r.id) === String(attendeeId) || String(r._id) === String(attendeeId));
      if (attendee) {
        Object.assign(attendee, attendeeFields);
        saveLocalMeetings(meetings);
        return attendee;
      }
    }
    return null;
  },

  // Record bulk attendance for meeting roster
  recordBulkAttendance: async (meetingId, status, studentIds = null) => {
    try {
      await axiosInstance.post(`/ptm/${meetingId}/roster/bulk-attendance`, { status, studentIds });
    } catch (e) {
      console.warn('Backend bulk attendance failed, updating localStorage.', e.message);
    }

    const meetings = getLocalMeetings();
    const meeting = meetings.find(m => String(m.id) === String(meetingId) || String(m._id) === String(meetingId));
    if (meeting && meeting.roster) {
      meeting.roster.forEach(r => {
        if (!studentIds || studentIds.includes(r.id) || studentIds.includes(r._id)) {
          r.attendance = status;
        }
      });
      saveLocalMeetings(meetings);
      return meeting;
    }
    return null;
  },

  // Send invitations to all guardians in roster
  sendInvitations: async (meetingId) => {
    const meetings = getLocalMeetings();
    const meeting = meetings.find(m => String(m.id) === String(meetingId) || String(m._id) === String(meetingId));
    if (meeting && meeting.roster) {
      meeting.status = 'Notified';
      meeting.roster.forEach(r => {
        r.notified = 'Sent (WhatsApp)';
      });
      saveLocalMeetings(meetings);
      return { success: true, count: meeting.roster.length };
    }
    return { success: false, count: 0 };
  },

  // Refresh roster from student master
  refreshRoster: async (meetingId) => {
    const meetings = getLocalMeetings();
    const meeting = meetings.find(m => String(m.id) === String(meetingId) || String(m._id) === String(meetingId));
    if (meeting) {
      // Ensure all default students exist
      if (!meeting.roster || meeting.roster.length === 0) {
        meeting.roster = [...DEFAULT_STUDENTS];
      } else {
        // Add any missing students
        const existingIds = new Set(meeting.roster.map(r => r.name));
        DEFAULT_STUDENTS.forEach(ds => {
          if (!existingIds.has(ds.name)) {
            meeting.roster.push({ ...ds, attendance: 'Pending' });
          }
        });
      }
      meeting.invitedCount = meeting.roster.length;
      saveLocalMeetings(meetings);
      return meeting;
    }
    return null;
  },

  // Follow-ups CRUD
  getFollowUps: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/ptm/follow-ups', { params: filters });
      if (response.data && response.data.data && response.data.data.length > 0) {
        saveLocalFollowUps(response.data.data);
        return response.data.data;
      }
    } catch (e) {
      console.warn('Backend /api/ptm/follow-ups not responding, using localStorage.', e.message);
    }

    let followUps = getLocalFollowUps();
    if (filters.status && filters.status !== 'All' && filters.status !== 'All statuses') {
      followUps = followUps.filter(f => f.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      followUps = followUps.filter(f => 
        f.student.toLowerCase().includes(q) ||
        (f.actionPlan && f.actionPlan.toLowerCase().includes(q)) ||
        (f.assignee && f.assignee.toLowerCase().includes(q))
      );
    }
    return followUps;
  },

  createFollowUp: async (followUpData) => {
    const newId = 'fol-' + Date.now();
    const newFollowUp = {
      ...followUpData,
      id: newId,
      status: followUpData.status || 'Open',
      priority: followUpData.priority || 'Medium'
    };

    try {
      await axiosInstance.post('/ptm/follow-ups', newFollowUp);
    } catch (e) {
      console.warn('Backend follow-up creation failed, saving to localStorage.', e.message);
    }

    const followUps = getLocalFollowUps();
    followUps.unshift(newFollowUp);
    saveLocalFollowUps(followUps);
    return newFollowUp;
  },

  updateFollowUp: async (id, updatedFields) => {
    const followUps = getLocalFollowUps();
    const index = followUps.findIndex(f => String(f.id) === String(id) || String(f._id) === String(id));
    if (index !== -1) {
      followUps[index] = { ...followUps[index], ...updatedFields };
      saveLocalFollowUps(followUps);
      return followUps[index];
    }
    return null;
  },

  deleteFollowUp: async (id) => {
    const followUps = getLocalFollowUps();
    const filtered = followUps.filter(f => String(f.id) !== String(id) && String(f._id) !== String(id));
    saveLocalFollowUps(filtered);
    return true;
  },

  // Calculate live Dashboard KPIs
  getDashboardStats: async () => {
    const meetings = getLocalMeetings();
    const followUps = getLocalFollowUps();

    const totalMeetings = meetings.length;
    const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled' || m.status === 'Notified');
    const completedMeetings = meetings.filter(m => m.status === 'Completed');
    const openFollowUps = followUps.filter(f => f.status === 'Open' || f.status === 'In Progress');

    let totalInvited = 0;
    let totalPresent = 0;
    let totalWithRemarks = 0;

    meetings.forEach(m => {
      const roster = m.roster || [];
      const invited = roster.length > 0 ? roster.length : (m.invitedCount || 0);
      totalInvited += invited;

      roster.forEach(r => {
        if (r.attendance === 'Present') totalPresent++;
        if (r.remarks && r.remarks.trim().length > 0) totalWithRemarks++;
      });
    });

    const attendanceRate = totalInvited > 0 ? Math.round((totalPresent / totalInvited) * 100) : 0;
    const remarkRate = totalInvited > 0 ? Math.round((totalWithRemarks / totalInvited) * 100) : 0;

    return {
      totalMeetings,
      upcomingCount: upcomingMeetings.length,
      completedCount: completedMeetings.length,
      attendanceRate,
      totalInvited,
      totalPresent,
      openFollowUpsCount: openFollowUps.length,
      remarkRate,
      totalWithRemarks,
      upcomingMeetings,
      recentMeetings: meetings.slice(0, 6)
    };
  }
};

export default ptmService;
