import api from './axios';

const STORAGE_KEY = 'school_erp_osm_sessions_v1';

export const CLASSES_LIST = [
  'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
  'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X',
  'Class XI', 'Class XII'
];

export const SECTIONS_LIST = ['A', 'B', 'C', 'All'];

export const SUBJECTS_LIST = [
  'Mathematics', 'English', 'English Core', 'Science', 'Physics',
  'Chemistry', 'Biology', 'Social Science', 'Hindi', 'Computer Science'
];

export const EXAM_TYPES = [
  'Term 1 Exam', 'Term 2 Exam', 'Mid-Term', 'Unit Test 1', 'Unit Test 2',
  'Pre-Board Exam', 'Final Annual Exam'
];

export const INITIAL_OSM_SESSIONS = [
  {
    _id: 'osm-demo-1',
    id: 'osm-demo-1',
    title: 'Term 1 — Mathematics (Class X / A)',
    className: 'Class X',
    section: 'A',
    subjectName: 'Mathematics',
    examType: 'Term 1 Exam',
    totalMarks: 50,
    status: 'Evaluating',
    anonymous: false,
    allowAnnotations: true,
    moderationEnabled: true,
    deadline: '2026-10-25',
    evaluatorName: 'Dr. Ramesh Kumar',
    questions: [
      { qNo: 'Q1', label: 'Real Numbers & Prime Factors', maxMarks: 5, compulsory: true, text: 'Find the HCF and LCM of 120 and 144 using prime factorization method and verify HCF × LCM = Product.', rubric: '2 marks for prime factors, 2 marks for HCF/LCM, 1 mark for verification.' },
      { qNo: 'Q2', label: 'Quadratic Polynomial Zeroes', maxMarks: 5, compulsory: true, text: 'Find the zeroes of the polynomial f(x) = x² + 7x + 10 and verify relationship with coefficients.', rubric: '3 marks for factorisation, 2 marks for verifying sum and product of zeroes.' },
      { qNo: 'Q3', label: 'Linear Equations in 2 Variables', maxMarks: 5, compulsory: true, text: 'Solve by elimination: 2x + 3y = 11 and 2x - 4y = -24. Hence find m for y = mx + 3.', rubric: '2 marks for x, 2 marks for y, 1 mark for value of m.' },
      { qNo: 'Q4', label: 'Quadratic Discriminant & Roots', maxMarks: 5, compulsory: true, text: 'Find the discriminant of 2x² - 4x + 3 = 0 and discuss the nature of its roots.', rubric: '2 marks for discriminant formula, 2 marks for calculation (-8), 1 mark for nature.' },
      { qNo: 'Q5', label: 'Arithmetic Progression (AP)', maxMarks: 5, compulsory: true, text: 'Find the 20th term from the end of the AP: 3, 8, 13, ..., 253.', rubric: '2 marks for reverse formula or total terms, 3 marks for calculation (158).' },
      { qNo: 'Q6', label: 'Thales Theorem / BPT Proof', maxMarks: 5, compulsory: true, text: 'State and prove Basic Proportionality Theorem with a neat geometric figure.', rubric: '1 mark statement, 1 mark diagram, 3 marks step-by-step derivation.' },
      { qNo: 'Q7', label: 'Section Formula & Coordinates', maxMarks: 5, compulsory: true, text: 'Find coordinates of point dividing join of (-1, 7) and (4, -3) in ratio 2:3.', rubric: '2 marks for formula, 3 marks for correct substitution (1, 3).' },
      { qNo: 'Q8', label: 'Trigonometric Evaluation', maxMarks: 5, compulsory: true, text: 'Evaluate: (5 cos² 60° + 4 sec² 30° - tan² 45°) / (sin² 30° + cos² 30°).', rubric: '2 marks for standard angle values, 3 marks for simplification (67/12).' },
      { qNo: 'Q9', label: 'Surface Areas & Volumes', maxMarks: 5, compulsory: true, text: 'A hemisphere of radius 3.5cm is surmounted by a cone of height 12cm. Find total surface area.', rubric: '2 marks for slant height calculation, 3 marks for combined surface area.' },
      { qNo: 'Q10', label: 'Statistics Median & Mode', maxMarks: 5, compulsory: true, text: 'Calculate the median of given grouped marks table using cumulative frequency curve.', rubric: '2 marks for cumulative frequency column, 3 marks for median formula execution.' }
    ],
    sheets: [
      {
        id: 'sheet-101',
        studentId: 'STU-1001',
        studentName: 'Aarav Sharma',
        rollNo: '1001',
        anonymousCode: '#ANON-9011',
        fileName: 'aarav_sharma_math_t1.pdf',
        pages: 3,
        status: 'Evaluated',
        totalAwarded: 44,
        flaggedForModeration: false,
        evaluatedAt: '2026-10-12T10:30:00.000Z',
        marks: [
          { qNo: 'Q1', awardedMarks: 5, comments: 'Full marks, clean steps' },
          { qNo: 'Q2', awardedMarks: 5, comments: 'Correct factorization' },
          { qNo: 'Q3', awardedMarks: 4, comments: 'Minor sign error in m' },
          { qNo: 'Q4', awardedMarks: 5, comments: 'Well stated' },
          { qNo: 'Q5', awardedMarks: 4, comments: 'Calculation accurate' },
          { qNo: 'Q6', awardedMarks: 4, comments: 'Good proof' },
          { qNo: 'Q7', awardedMarks: 5, comments: 'Spot on' },
          { qNo: 'Q8', awardedMarks: 4, comments: 'Correct' },
          { qNo: 'Q9', awardedMarks: 4, comments: 'Good formula' },
          { qNo: 'Q10', awardedMarks: 4, comments: 'Clean graph' }
        ],
        annotations: [
          { page: 1, x: 220, y: 140, type: 'tick', comment: 'Correct factor tree' },
          { page: 1, x: 420, y: 310, type: 'tick', comment: 'Roots verified' },
          { page: 2, x: 300, y: 200, type: 'partial', comment: 'Check sign here' }
        ]
      },
      {
        id: 'sheet-102',
        studentId: 'STU-1002',
        studentName: 'Diya Patel',
        rollNo: '1002',
        anonymousCode: '#ANON-9012',
        fileName: 'diya_patel_math_t1.pdf',
        pages: 3,
        status: 'Evaluated',
        totalAwarded: 47,
        flaggedForModeration: false,
        evaluatedAt: '2026-10-12T11:15:00.000Z',
        marks: [
          { qNo: 'Q1', awardedMarks: 5, comments: 'Excellent' },
          { qNo: 'Q2', awardedMarks: 5, comments: 'Full' },
          { qNo: 'Q3', awardedMarks: 5, comments: 'Correct' },
          { qNo: 'Q4', awardedMarks: 5, comments: 'Full' },
          { qNo: 'Q5', awardedMarks: 5, comments: 'Full' },
          { qNo: 'Q6', awardedMarks: 4, comments: 'Good BPT diagram' },
          { qNo: 'Q7', awardedMarks: 5, comments: 'Full' },
          { qNo: 'Q8', awardedMarks: 4, comments: 'Good' },
          { qNo: 'Q9', awardedMarks: 5, comments: 'Full' },
          { qNo: 'Q10', awardedMarks: 4, comments: 'Good' }
        ],
        annotations: [
          { page: 1, x: 350, y: 160, type: 'tick', comment: 'Accurate' }
        ]
      },
      {
        id: 'sheet-103',
        studentId: 'STU-1003',
        studentName: 'Kabir Mehta',
        rollNo: '1003',
        anonymousCode: '#ANON-9013',
        fileName: 'kabir_mehta_math_t1.pdf',
        pages: 3,
        status: 'Evaluated',
        totalAwarded: 31,
        flaggedForModeration: true,
        moderationNotes: 'Requesting HOD review for Q6 step marking on theorem proof',
        evaluatedAt: '2026-10-12T12:00:00.000Z',
        marks: [
          { qNo: 'Q1', awardedMarks: 4, comments: 'Verification missing' },
          { qNo: 'Q2', awardedMarks: 3, comments: 'Calculation slip' },
          { qNo: 'Q3', awardedMarks: 4, comments: 'Good' },
          { qNo: 'Q4', awardedMarks: 3, comments: 'Did not state real roots' },
          { qNo: 'Q5', awardedMarks: 2, comments: 'Wrong formula used' },
          { qNo: 'Q6', awardedMarks: 2, comments: 'Incomplete proof steps - flagged for review' },
          { qNo: 'Q7', awardedMarks: 4, comments: 'Good' },
          { qNo: 'Q8', awardedMarks: 3, comments: 'Partial simplification' },
          { qNo: 'Q9', awardedMarks: 3, comments: 'Partial volume' },
          { qNo: 'Q10', awardedMarks: 3, comments: 'Average' }
        ],
        annotations: [
          { page: 2, x: 320, y: 240, type: 'comment', comment: 'Theorem construction line missing' }
        ]
      },
      {
        id: 'sheet-104',
        studentId: 'STU-1004',
        studentName: 'Ananya Verma',
        rollNo: '1004',
        anonymousCode: '#ANON-9014',
        fileName: 'ananya_verma_math_t1.pdf',
        pages: 3,
        status: 'Pending',
        totalAwarded: 0,
        flaggedForModeration: false,
        marks: [],
        annotations: []
      },
      {
        id: 'sheet-105',
        studentId: 'STU-1005',
        studentName: 'Rohan Singhania',
        rollNo: '1005',
        anonymousCode: '#ANON-9015',
        fileName: 'rohan_singhania_math_t1.pdf',
        pages: 3,
        status: 'Pending',
        totalAwarded: 0,
        flaggedForModeration: false,
        marks: [],
        annotations: []
      },
      {
        id: 'sheet-106',
        studentId: 'STU-1006',
        studentName: 'Meera Nair',
        rollNo: '1006',
        anonymousCode: '#ANON-9016',
        fileName: 'meera_nair_math_t1.pdf',
        pages: 3,
        status: 'Pending',
        totalAwarded: 0,
        flaggedForModeration: false,
        marks: [],
        annotations: []
      }
    ]
  },
  {
    _id: 'osm-demo-2',
    id: 'osm-demo-2',
    title: 'Unit Test 2 — English Core (Class XII / A)',
    className: 'Class XII',
    section: 'A',
    subjectName: 'English Core',
    examType: 'Unit Test 2',
    totalMarks: 40,
    status: 'Moderation',
    anonymous: true,
    allowAnnotations: true,
    moderationEnabled: true,
    deadline: '2026-10-20',
    evaluatorName: 'Mrs. Sunita Sen',
    questions: [
      { qNo: 'Q1', label: 'Unseen Reading Comprehension', maxMarks: 10, compulsory: true, text: 'Read the excerpt and answer vocabulary and inference questions.', rubric: '1 mark per correct inference.' },
      { qNo: 'Q2', label: 'Notice & Report Writing', maxMarks: 5, compulsory: true, text: 'Draft a notice for Inter-School Debate Competition.', rubric: 'Format 1, Content 2, Expression 2.' },
      { qNo: 'Q3', label: 'Letter to the Editor', maxMarks: 5, compulsory: true, text: 'Write a letter on rising cyberbullying among adolescents.', rubric: 'Format 1, Content 2, Expression 2.' },
      { qNo: 'Q4', label: 'Flamingo: The Last Lesson', maxMarks: 10, compulsory: true, text: 'Discuss the theme of linguistic chauvinism in The Last Lesson.', rubric: 'Theme 4, Quotes 3, Language 3.' },
      { qNo: 'Q5', label: 'Vistas: The Tiger King', maxMarks: 10, compulsory: true, text: 'Analyze the irony in the death of the Maharaja of Pratibandhapuram.', rubric: 'Irony explanation 5, text evidence 5.' }
    ],
    sheets: [
      {
        id: 'sheet-201',
        studentId: 'STU-1201',
        studentName: 'Code Candidate Alpha',
        rollNo: '1201',
        anonymousCode: '#ANON-8812',
        fileName: 'sheet_anon_8812.pdf',
        pages: 3,
        status: 'Evaluated',
        totalAwarded: 35,
        flaggedForModeration: true,
        moderationNotes: 'Check notice format evaluation strictness',
        evaluatedAt: '2026-10-10T14:20:00.000Z',
        marks: [
          { qNo: 'Q1', awardedMarks: 9, comments: 'Good vocabulary' },
          { qNo: 'Q2', awardedMarks: 4, comments: 'Box missed' },
          { qNo: 'Q3', awardedMarks: 4, comments: 'Well structured' },
          { qNo: 'Q4', awardedMarks: 9, comments: 'Thoughtful analysis' },
          { qNo: 'Q5', awardedMarks: 9, comments: 'Good irony coverage' }
        ],
        annotations: []
      },
      {
        id: 'sheet-202',
        studentId: 'STU-1202',
        studentName: 'Code Candidate Beta',
        rollNo: '1202',
        anonymousCode: '#ANON-8813',
        fileName: 'sheet_anon_8813.pdf',
        pages: 3,
        status: 'Moderated',
        totalAwarded: 38,
        moderatorMarks: 38,
        moderationNotes: 'Approved +2 marks on Question 3 for excellent argument structure',
        flaggedForModeration: false,
        evaluatedAt: '2026-10-10T15:10:00.000Z',
        marks: [
          { qNo: 'Q1', awardedMarks: 10, comments: 'Flawless' },
          { qNo: 'Q2', awardedMarks: 5, comments: 'Proper box & layout' },
          { qNo: 'Q3', awardedMarks: 5, comments: 'Moderator upgraded from 4 to 5' },
          { qNo: 'Q4', awardedMarks: 9, comments: 'Deep analysis' },
          { qNo: 'Q5', awardedMarks: 9, comments: 'Very good' }
        ],
        annotations: []
      }
    ]
  },
  {
    _id: 'osm-demo-3',
    id: 'osm-demo-3',
    title: 'Mid-Term — Physics & Mechanics (Class XI / A)',
    className: 'Class XI',
    section: 'A',
    subjectName: 'Physics',
    examType: 'Mid-Term',
    totalMarks: 35,
    status: 'Completed',
    anonymous: false,
    allowAnnotations: true,
    moderationEnabled: false,
    deadline: '2026-10-15',
    evaluatorName: 'Prof. Alok Tiwari',
    questions: [
      { qNo: 'Q1', label: 'Units & Dimensions', maxMarks: 5, compulsory: true, text: 'Check dimensional consistency of E = mc² and T = 2π√(l/g).' },
      { qNo: 'Q2', label: 'Kinematics Equations', maxMarks: 10, compulsory: true, text: 'Derive v² = u² + 2as using calculus method.' },
      { qNo: 'Q3', label: 'Newton Laws of Motion', maxMarks: 10, compulsory: true, text: 'State Newton third law and prove conservation of linear momentum.' },
      { qNo: 'Q4', label: 'Work Energy Theorem', maxMarks: 10, compulsory: true, text: 'State and prove Work-Energy theorem for variable force.' }
    ],
    sheets: [
      {
        id: 'sheet-301',
        studentId: 'STU-1101',
        studentName: 'Arjun Das',
        rollNo: '1101',
        anonymousCode: '#ANON-7701',
        fileName: 'arjun_physics.pdf',
        pages: 3,
        status: 'Evaluated',
        totalAwarded: 32,
        flaggedForModeration: false,
        marks: [
          { qNo: 'Q1', awardedMarks: 5 },
          { qNo: 'Q2', awardedMarks: 9 },
          { qNo: 'Q3', awardedMarks: 9 },
          { qNo: 'Q4', awardedMarks: 9 }
        ],
        annotations: []
      },
      {
        id: 'sheet-302',
        studentId: 'STU-1102',
        studentName: 'Pooja Hegde',
        rollNo: '1102',
        anonymousCode: '#ANON-7702',
        fileName: 'pooja_physics.pdf',
        pages: 3,
        status: 'Evaluated',
        totalAwarded: 34,
        flaggedForModeration: false,
        marks: [
          { qNo: 'Q1', awardedMarks: 5 },
          { qNo: 'Q2', awardedMarks: 10 },
          { qNo: 'Q3', awardedMarks: 9 },
          { qNo: 'Q4', awardedMarks: 10 }
        ],
        annotations: []
      }
    ]
  },
  {
    _id: 'osm-demo-4',
    id: 'osm-demo-4',
    title: 'Pre-Board — Science (Class IX / B)',
    className: 'Class IX',
    section: 'B',
    subjectName: 'Science',
    examType: 'Unit Test 1',
    totalMarks: 50,
    status: 'Draft',
    anonymous: false,
    allowAnnotations: true,
    moderationEnabled: true,
    deadline: '2026-11-05',
    evaluatorName: 'Neelam Joshi',
    questions: [
      { qNo: 'Q1', label: 'Matter in Our Surroundings', maxMarks: 10, compulsory: true, text: 'Explain latent heat of vaporisation with temperature graph.' },
      { qNo: 'Q2', label: 'Fundamental Unit of Life', maxMarks: 10, compulsory: true, text: 'Draw and label plant cell vs animal cell differences.' }
    ],
    sheets: []
  }
];

// Helper: load local data
function getLocalSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OSM_SESSIONS));
      return INITIAL_OSM_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_OSM_SESSIONS;
  } catch {
    return INITIAL_OSM_SESSIONS;
  }
}

function saveLocalSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save OSM sessions to localStorage:', e);
  }
}

export const osmService = {
  // Fetch sessions with filter
  async getSessions(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All' && filters.status !== 'All statuses') {
        params.append('status', filters.status);
      }
      if (filters.className && filters.className !== 'All' && filters.className !== 'All classes') {
        params.append('className', filters.className);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const res = await api.get(`/osm?${params.toString()}`);
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend /api/osm unavailable, falling back to LocalStorage', err?.message);
    }

    // Fallback: LocalStorage
    let list = getLocalSessions();
    if (filters.status && filters.status !== 'All' && filters.status !== 'All statuses') {
      list = list.filter(s => s.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.className && filters.className !== 'All' && filters.className !== 'All classes') {
      list = list.filter(s => s.className.toLowerCase().includes(filters.className.toLowerCase()));
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(s => 
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.subjectName && s.subjectName.toLowerCase().includes(q)) ||
        (s.className && s.className.toLowerCase().includes(q))
      );
    }
    return list;
  },

  // Get single session
  async getSession(id) {
    try {
      const res = await api.get(`/osm/${id}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch {
      // fallback
    }

    const list = getLocalSessions();
    return list.find(s => s._id === id || s.id === id) || null;
  },

  // Create session
  async createSession(sessionData) {
    const totalMarks = (sessionData.questions || []).reduce((acc, q) => acc + (Number(q.maxMarks) || 0), 0);
    const payload = {
      ...sessionData,
      totalMarks: totalMarks || sessionData.totalMarks || 50,
      status: sessionData.status || 'Draft',
      questions: sessionData.questions || [],
      sheets: sessionData.sheets || []
    };

    try {
      const res = await api.post('/osm', payload);
      if (res.data?.success && res.data.data) {
        // Also update local cache
        const current = getLocalSessions();
        saveLocalSessions([res.data.data, ...current]);
        return res.data.data;
      }
    } catch {
      // fallback
    }

    const newSession = {
      ...payload,
      _id: 'osm-' + Date.now(),
      id: 'osm-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const current = getLocalSessions();
    const updated = [newSession, ...current];
    saveLocalSessions(updated);
    return newSession;
  },

  // Update session
  async updateSession(id, updateData) {
    try {
      const res = await api.put(`/osm/${id}`, updateData);
      if (res.data?.success && res.data.data) {
        const current = getLocalSessions();
        const updated = current.map(s => (s._id === id || s.id === id) ? res.data.data : s);
        saveLocalSessions(updated);
        return res.data.data;
      }
    } catch {
      // fallback
    }

    const current = getLocalSessions();
    let updatedItem = null;
    const updated = current.map(s => {
      if (s._id === id || s.id === id) {
        updatedItem = { ...s, ...updateData, updatedAt: new Date().toISOString() };
        if (updatedItem.questions) {
          updatedItem.totalMarks = updatedItem.questions.reduce((sum, q) => sum + (Number(q.maxMarks) || 0), 0);
        }
        return updatedItem;
      }
      return s;
    });

    saveLocalSessions(updated);
    return updatedItem;
  },

  // Delete session
  async deleteSession(id) {
    try {
      await api.delete(`/osm/${id}`);
    } catch {
      // ignore
    }

    const current = getLocalSessions();
    const filtered = current.filter(s => s._id !== id && s.id !== id);
    saveLocalSessions(filtered);
    return true;
  },

  // Submit Answer Sheet Evaluation
  async submitSheetEvaluation(sessionId, sheetId, marks, annotations, flaggedForModeration) {
    const totalAwarded = (marks || []).reduce((sum, m) => sum + (Number(m.awardedMarks) || 0), 0);
    try {
      const res = await api.post(`/osm/${sessionId}/evaluate-sheet`, {
        sheetId,
        marks,
        annotations,
        totalAwarded,
        flaggedForModeration
      });
      if (res.data?.success && res.data.data) {
        const current = getLocalSessions();
        saveLocalSessions(current.map(s => (s._id === sessionId || s.id === sessionId) ? res.data.data : s));
        return res.data.data;
      }
    } catch {
      // fallback
    }

    const current = getLocalSessions();
    const session = current.find(s => s._id === sessionId || s.id === sessionId);
    if (!session) return null;

    const sheets = session.sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return {
          ...sheet,
          marks,
          annotations,
          totalAwarded,
          flaggedForModeration: !!flaggedForModeration,
          status: 'Evaluated',
          evaluatedAt: new Date().toISOString()
        };
      }
      return sheet;
    });

    const allEvaluated = sheets.every(s => s.status === 'Evaluated' || s.status === 'Moderated');
    const hasFlags = sheets.some(s => s.flaggedForModeration);
    let newStatus = session.status;
    if (allEvaluated) {
      newStatus = hasFlags && session.moderationEnabled ? 'Moderation' : 'Completed';
    } else {
      newStatus = 'Evaluating';
    }

    const updatedSession = {
      ...session,
      sheets,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    saveLocalSessions(current.map(s => (s._id === sessionId || s.id === sessionId) ? updatedSession : s));
    return updatedSession;
  },

  // Moderate Sheet
  async moderateSheet(sessionId, sheetId, moderatorMarks, moderationNotes) {
    try {
      const res = await api.post(`/osm/${sessionId}/moderate-sheet`, {
        sheetId,
        moderatorMarks,
        moderationNotes
      });
      if (res.data?.success && res.data.data) {
        const current = getLocalSessions();
        saveLocalSessions(current.map(s => (s._id === sessionId || s.id === sessionId) ? res.data.data : s));
        return res.data.data;
      }
    } catch {
      // fallback
    }

    const current = getLocalSessions();
    const session = current.find(s => s._id === sessionId || s.id === sessionId);
    if (!session) return null;

    const sheets = session.sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return {
          ...sheet,
          moderatorMarks: Number(moderatorMarks),
          moderationNotes: moderationNotes || '',
          status: 'Moderated'
        };
      }
      return sheet;
    });

    const allDone = sheets.every(s => s.status === 'Evaluated' || s.status === 'Moderated');
    const updatedSession = {
      ...session,
      sheets,
      status: allDone ? 'Completed' : session.status,
      updatedAt: new Date().toISOString()
    };

    saveLocalSessions(current.map(s => (s._id === sessionId || s.id === sessionId) ? updatedSession : s));
    return updatedSession;
  },

  // Calculate session metrics
  calculateStats(session) {
    if (!session || !session.sheets || session.sheets.length === 0) {
      return {
        totalSheets: 0,
        evaluatedSheets: 0,
        pendingSheets: 0,
        moderatedSheets: 0,
        flaggedSheets: 0,
        progressPct: 0,
        avgMarks: 0,
        highestMarks: 0,
        lowestMarks: 0,
        passPct: 0
      };
    }

    const total = session.sheets.length;
    const evaluatedList = session.sheets.filter(s => s.status === 'Evaluated' || s.status === 'Moderated');
    const evaluated = evaluatedList.length;
    const pending = total - evaluated;
    const moderated = session.sheets.filter(s => s.status === 'Moderated').length;
    const flagged = session.sheets.filter(s => s.flaggedForModeration).length;
    const progressPct = Math.round((evaluated / total) * 100);

    const scores = evaluatedList.map(s => s.moderatorMarks !== null && s.moderatorMarks !== undefined ? s.moderatorMarks : s.totalAwarded);
    const avgMarks = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
    const highestMarks = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestMarks = scores.length > 0 ? Math.min(...scores) : 0;
    
    const passThreshold = (session.totalMarks || 50) * 0.35;
    const passCount = scores.filter(s => s >= passThreshold).length;
    const passPct = scores.length > 0 ? Math.round((passCount / scores.length) * 100) : 0;

    return {
      totalSheets: total,
      evaluatedSheets: evaluated,
      pendingSheets: pending,
      moderatedSheets: moderated,
      flaggedSheets: flagged,
      progressPct,
      avgMarks: Number(avgMarks),
      highestMarks,
      lowestMarks,
      passPct
    };
  }
};

export default osmService;
