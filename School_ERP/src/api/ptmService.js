import axiosInstance from './axios';

const STORAGE_KEY_MEETINGS = 'school_erp_ptm_meetings';
const STORAGE_KEY_FOLLOWUPS = 'school_erp_ptm_followups';

// Initial realistic default mock data
const DEFAULT_STUDENTS = [
  { id: 'std_1', name: 'Kiara Kapoor', roll: 'YISADM-072 / 12', className: 'Class IV / A', guardianName: 'Sanjay Kapoor', phone: '9876500143', slot: '09:00 - 09:15 AM', notified: 'Sent (WhatsApp)', attendance: 'Present', remarks: 'Excellent grasp of science concepts. Shows great enthusiasm in classroom activities.', tags: ['Top Performer', 'Good Conduct'], followUpNeeded: false },
  { id: 'std_2', name: 'Vivaan Prakash', roll: 'YISADM-073 / 13', className: 'Class IV / A', guardianName: 'Ramesh Prakash', phone: '9876500145', slot: '09:15 - 09:30 AM', notified: 'Sent (WhatsApp)', attendance: 'Present', remarks: 'Needs more focus in mathematics multiplication tables. Regular homework submission is appreciated.', tags: ['Needs Math Help'], followUpNeeded: true },
  { id: 'std_3', name: 'Kriti Garg', roll: 'YISADM-074 / 14', className: 'Class IV / A', guardianName: 'Vikram Garg', phone: '9876500147', slot: '09:30 - 09:45 AM', notified: 'Sent (WhatsApp)', attendance: 'Absent', remarks: 'Guardian informed via call; will schedule makeup slot next week.', tags: ['Guardian Notified'], followUpNeeded: true },
  { id: 'std_4', name: 'Ananya Kaur', roll: 'YISADM-075 / 15', className: 'Class IV / A', guardianName: 'Harpreet Singh', phone: '9876500149', slot: '09:45 - 10:00 AM', notified: 'Sent (SMS)', attendance: 'Present', remarks: 'Active participant in arts and languages. Consistent attendance record.', tags: ['Active Participant'], followUpNeeded: false },
  { id: 'std_5', name: 'Diya Nath', roll: 'YISADM-076 / 16', className: 'Class IV / A', guardianName: 'Alok Nath', phone: '9876500151', slot: '10:00 - 10:15 AM', notified: 'Sent (WhatsApp)', attendance: 'Pending', remarks: '', tags: [], followUpNeeded: false },
  { id: 'std_6', name: 'Advik Jha', roll: 'YISADM-077 / 17', className: 'Class IV / A', guardianName: 'Manoj Jha', phone: '9876500153', slot: '10:15 - 10:30 AM', notified: 'Sent (WhatsApp)', attendance: 'Present', remarks: 'Very attentive during lectures. Parent requested additional reading material.', tags: ['Enthusiastic Reader'], followUpNeeded: false },
  { id: 'std_7', name: 'Myra Menon', roll: 'YISADM-078 / 18', className: 'Class IV / A', guardianName: 'Gopal Menon', phone: '9876500155', slot: '10:30 - 10:45 AM', notified: 'Sent (SMS)', attendance: 'Pending', remarks: '', tags: [], followUpNeeded: false },
  { id: 'std_8', name: 'Kabir Dubey', roll: 'YISADM-079 / 19', className: 'Class IV / A', guardianName: 'Sudhir Dubey', phone: '9876500157', slot: '10:45 - 11:00 AM', notified: 'Sent (WhatsApp)', attendance: 'Present', remarks: 'Good improvement in cursive handwriting. Recommended participation in debate competition.', tags: ['Good Progress'], followUpNeeded: false },
  { id: 'std_9', name: 'Navya Sinha', roll: 'YISADM-080 / 20', className: 'Class IV / A', guardianName: 'Pradeep Sinha', phone: '9876500159', slot: '11:00 - 11:15 AM', notified: 'Pending', attendance: 'Pending', remarks: '', tags: [], followUpNeeded: false },
  { id: 'std_10', name: 'Ansh Bose', roll: 'YISADM-081 / 1', className: 'Class IV / A', guardianName: 'Tanmoy Bose', phone: '9876500161', slot: '11:15 - 11:30 AM', notified: 'Sent (WhatsApp)', attendance: 'Present', remarks: 'Exceptional sports engagement. Keep encouraging balance with science prep.', tags: ['Sports Star'], followUpNeeded: false },
  { id: 'std_11', name: 'Neha Sheikh', roll: 'YISADM-082 / 2', className: 'Class IV / A', guardianName: 'Farooq Sheikh', phone: '9876500163', slot: '11:30 - 11:45 AM', notified: 'Sent (SMS)', attendance: 'Absent', remarks: 'Parent was travelling out of station. Online notes sent over portal.', tags: ['Leave Approved'], followUpNeeded: false },
  { id: 'std_12', name: 'Ishaan Khatri', roll: 'YISADM-083 / 3', className: 'Class IV / A', guardianName: 'Rohit Khatri', phone: '9876500165', slot: '11:45 - 12:00 PM', notified: 'Sent (WhatsApp)', attendance: 'Present', remarks: 'Showing steady progress in social studies. Polite and helpful.', tags: ['Helpful Student'], followUpNeeded: false },
  { id: 'std_13', name: 'Nitya Rana', roll: 'YISADM-084 / 4', className: 'Class IV / A', guardianName: 'Birendra Rana', phone: '9876500167', slot: '12:00 - 12:15 PM', notified: 'Sent (WhatsApp)', attendance: 'Pending', remarks: '', tags: [], followUpNeeded: false },
  { id: 'std_14', name: 'Aarav Sharma', roll: 'YISADM-085 / 5', className: 'Class IV / A', guardianName: 'Devendra Sharma', phone: '9876500169', slot: '12:15 - 12:30 PM', notified: 'Sent (WhatsApp)', attendance: 'Present', remarks: 'Strong logic in Computer Science. Advised to participate in robotics club.', tags: ['Tech Prodigy'], followUpNeeded: false },
  { id: 'std_15', name: 'Saanvi Patel', roll: 'YISADM-086 / 6', className: 'Class IV / A', guardianName: 'Kirit Patel', phone: '9876500171', slot: '12:30 - 12:45 PM', notified: 'Pending', attendance: 'Pending', remarks: '', tags: [], followUpNeeded: false },
];

const DEFAULT_MEETINGS = [
  {
    id: 'ptm-1',
    title: 'Term 1 Parent-Teacher Meeting',
    meetingDate: '2026-09-03',
    startTime: '09:00 AM',
    endTime: '01:30 PM',
    mode: 'In person',
    scope: 'Whole school',
    className: 'All Classes',
    sectionName: 'All Sections',
    venue: 'Main School Auditorium & Senior Wing',
    meetingLink: '',
    description: 'Comprehensive term-end progress discussion, academic evaluation reports distribution and co-curricular feedback.',
    status: 'Scheduled',
    invitedCount: 283,
    roster: [...DEFAULT_STUDENTS],
  },
  {
    id: 'ptm-2',
    title: 'Exam Performance Discussion',
    meetingDate: '2026-08-21',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    mode: 'In person',
    scope: 'Specific class',
    className: 'Class II',
    sectionName: 'Section A',
    venue: 'Primary Wing - Room 204',
    meetingLink: '',
    description: 'Review of Unit Assessment 1 answer scripts and personalized counseling for students needing foundational reinforcement.',
    status: 'Scheduled',
    invitedCount: 20,
    roster: DEFAULT_STUDENTS.slice(0, 8),
  },
  {
    id: 'ptm-3',
    title: 'Pre-Exam Strategy & Counseling',
    meetingDate: '2026-08-13',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    mode: 'In person',
    scope: 'Whole school',
    className: 'All Classes',
    sectionName: 'All Sections',
    venue: 'Classrooms / Respective Sections',
    meetingLink: '',
    description: 'Detailed briefing on exam preparation, syllabus coverage, timetable review, and mental wellness guidance.',
    status: 'Scheduled',
    invitedCount: 280,
    roster: DEFAULT_STUDENTS.slice(0, 10),
  },
  {
    id: 'ptm-4',
    title: 'URGENT - Virtual Academic Review',
    meetingDate: '2026-07-22',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    mode: 'Online',
    scope: 'Whole school',
    className: 'All Classes',
    sectionName: 'All Sections',
    venue: 'Online Meeting',
    meetingLink: 'https://meet.google.com/ptm-urgent-syn',
    description: 'Emergency sync regarding curriculum amendments and upcoming board guidelines updates.',
    status: 'Scheduled',
    invitedCount: 283,
    roster: DEFAULT_STUDENTS.slice(0, 12),
  },
  {
    id: 'ptm-5',
    title: 'Annual Whole-School PTM & Exhibition',
    meetingDate: '2026-06-25',
    startTime: '08:00 AM',
    endTime: '02:00 PM',
    mode: 'In person',
    scope: 'Whole school',
    className: 'All Classes',
    sectionName: 'All Sections',
    venue: 'Main Campus Sports Complex & Library',
    meetingLink: '',
    description: 'Annual gathering celebrating student science exhibitions, art displays, and overall scholastic milestones.',
    status: 'Completed',
    invitedCount: 15,
    roster: DEFAULT_STUDENTS.map(s => ({ ...s, attendance: s.id === 'std_3' ? 'Absent' : 'Present' })),
  },
  {
    id: 'ptm-6',
    title: 'Mid-Term Progress Meeting',
    meetingDate: '2026-06-11',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    mode: 'Hybrid',
    scope: 'Specific class',
    className: 'Nursery',
    sectionName: 'Section B',
    venue: 'Junior Wing Activity Hall',
    meetingLink: 'https://zoom.us/j/9871234567',
    description: 'Early childhood milestones evaluation, fine motor skills observation, and nutritional guidance.',
    status: 'Completed',
    invitedCount: 12,
    roster: DEFAULT_STUDENTS.slice(0, 12).map((s, idx) => ({ ...s, attendance: idx < 8 ? 'Present' : (idx < 10 ? 'Absent' : 'Pending') })),
  },
  {
    id: 'ptm-7',
    title: 'Quick Sync (Draft Notice)',
    meetingDate: '2026-07-04',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    mode: 'Online',
    scope: 'Specific class',
    className: 'Nursery',
    sectionName: 'Section A',
    venue: 'Online Video Call',
    meetingLink: 'https://meet.google.com/nur-sync-2026',
    description: 'Preliminary planning draft for upcoming monsoon session parent advisory committee.',
    status: 'Draft',
    invitedCount: 0,
    roster: [],
  }
];

const DEFAULT_FOLLOWUPS = [
  {
    id: 'fol-1',
    student: 'Ishaan Gupta',
    meetingId: 'ptm-1',
    meeting: 'Term 1 Parent-Teacher Meeting',
    actionPlan: 'Weekly progress check with class teacher on Mathematics fundamentals & weekly quiz.',
    assignee: 'Rajesh Kumar (Math)',
    due: '2026-06-16',
    priority: 'High',
    status: 'Done'
  },
  {
    id: 'fol-2',
    student: 'Atharv Kumar',
    meetingId: 'ptm-1',
    meeting: 'Term 1 Parent-Teacher Meeting',
    actionPlan: 'Daily 30-min reading practice at home with guardian verification signature in school diary.',
    assignee: 'Rajesh Kumar (English)',
    due: '2026-06-20',
    priority: 'Medium',
    status: 'Open'
  },
  {
    id: 'fol-3',
    student: 'Vivaan Prakash',
    meetingId: 'ptm-2',
    meeting: 'Exam Performance Discussion',
    actionPlan: 'One-on-one remedial session twice weekly for multiplication tables and word problems.',
    assignee: 'Sunita Sharma',
    due: '2026-08-30',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'fol-4',
    student: 'Kriti Garg',
    meetingId: 'ptm-1',
    meeting: 'Term 1 Parent-Teacher Meeting',
    actionPlan: 'Conduct virtual makeup parent consultation regarding science lab reports.',
    assignee: 'Anita Verma',
    due: '2026-09-10',
    priority: 'Medium',
    status: 'Open'
  },
  {
    id: 'fol-5',
    student: 'Advik Jha',
    meetingId: 'ptm-6',
    meeting: 'Mid-Term Progress Meeting',
    actionPlan: 'Provide advanced reading lists and library pass for encyclopedia borrowing.',
    assignee: 'Priya Nambiar',
    due: '2026-06-28',
    priority: 'Low',
    status: 'Done'
  }
];

// LocalStorage helpers
function getLocalMeetings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEETINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(DEFAULT_MEETINGS));
      return DEFAULT_MEETINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MEETINGS;
  } catch (e) {
    return DEFAULT_MEETINGS;
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
      localStorage.setItem(STORAGE_KEY_FOLLOWUPS, JSON.stringify(DEFAULT_FOLLOWUPS));
      return DEFAULT_FOLLOWUPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FOLLOWUPS;
  } catch (e) {
    return DEFAULT_FOLLOWUPS;
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
