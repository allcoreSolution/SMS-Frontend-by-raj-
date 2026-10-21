import axiosInstance from './axios';

const STORAGE_KEY_PLANS = 'school_erp_lesson_plans';
const STORAGE_KEY_SETTINGS = 'school_erp_lesson_settings';

export const TEACHERS_LIST = [
  'Rajesh Kumar (Mathematics HOD)',
  'Sunita Sharma (Science HOD)',
  'Amit Sharma (English & Languages)',
  'Priya Verma (Biology & Life Sciences)',
  'Vikram Singh (Social Sciences)',
  'Neha Kapoor (Primary / Nursery Coordinator)',
  'Anita Deshmukh (Physics Senior)',
  'Kavita Joshi (Hindi & Sanskrit)'
];

export const CLASSES_LIST = [
  'Nursery / A',
  'LKG / A',
  'UKG / A',
  'Class I / A',
  'Class II / A',
  'Class III / A',
  'Class IV / A',
  'Class V / A',
  'Class VI / A',
  'Class VII / A',
  'Class VIII / A',
  'Class VIII / B',
  'Class IX / A',
  'Class IX / B',
  'Class X / A',
  'Class X / B',
  'Class XI / Science',
  'Class XII / Science'
];

export const SUBJECTS_MAP = {
  'Nursery': ['English', 'Mathematics', 'General Awareness', 'Rhymes & Art'],
  'LKG': ['English', 'Mathematics', 'General Awareness', 'Art & Craft'],
  'UKG': ['English', 'Mathematics', 'Environmental Studies', 'Hindi'],
  'Primary': ['English', 'Mathematics', 'Environmental Studies', 'Hindi', 'Computer Science'],
  'Secondary': ['Mathematics Standard', 'Science (Physics/Chem/Bio)', 'Social Science', 'English Language & Lit', 'Hindi Course A', 'Computer Applications'],
  'Senior': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English Core', 'Computer Science']
};

const DEFAULT_SETTINGS = {
  enableHODReview: true,
  allowEditApproved: false,
  sendWeeklyReminder: true,
  submissionDeadlineDay: 'Friday',
  submissionDeadlineTime: '05:00 PM',
  departments: [
    { id: 'dept-1', name: 'Mathematics & Statistics', head: 'Rajesh Kumar' },
    { id: 'dept-2', name: 'Natural Sciences', head: 'Sunita Sharma' },
    { id: 'dept-3', name: 'English & Foreign Languages', head: 'Amit Sharma' },
    { id: 'dept-4', name: 'Social Sciences & Humanities', head: 'Vikram Singh' }
  ]
};

const DEFAULT_PLANS = [
  {
    id: 'lp-1',
    title: 'Trigonometric Ratios & Height Estimations',
    teacher: null,
    teacherName: 'Rajesh Kumar (Mathematics HOD)',
    className: 'Class X / A',
    sectionName: 'Section A',
    subjectName: 'Mathematics Standard',
    startDate: '2026-10-15',
    endDate: '2026-10-21',
    weekLabel: '15 Oct — 21 Oct 2026',
    periods: 5,
    chapters: ['Chapter 8: Introduction to Trigonometry', 'Chapter 9: Some Applications of Trigonometry'],
    objectives: 'Students will master calculating sine, cosine, tangent ratios for standard angles (0°, 30°, 45°, 60°, 90°) and solve practical real-life line-of-sight elevation problems.',
    teachingMethods: ['Lecture', 'Activity', 'Demonstration'],
    teachingAids: ['Smart board', 'Textbook', 'Worksheets', 'Digital content'],
    resources: 'NCERT Mathematics Textbook, Clinometer protractor tool, graph worksheets.',
    homework: 'Exercise 8.2 Questions 1-5, Practice paper 4.',
    status: 'Approved',
    reviewNotes: 'Comprehensive coverage. Recommended inclusion of one real-world shadow length measuring practical outside the classroom.',
    topicsList: [
      { id: 'top-101', text: 'Define Trigonometric Ratios for acute angles in right triangle', type: 'Syllabus', status: 'Covered' },
      { id: 'top-102', text: 'Trigonometric ratios of specific angles: 30°, 45° and 60°', type: 'Syllabus', status: 'Covered' },
      { id: 'top-103', text: 'Proof and applications of sin²θ + cos²θ = 1 identity', type: 'Syllabus', status: 'Covered' },
      { id: 'top-104', text: 'Angles of elevation & depression problem solving', type: 'Syllabus', status: 'Covered' },
      { id: 'top-105', text: 'Two-step triangle elevation multi-variable problems', type: 'Syllabus', status: 'Covered' }
    ],
    coveragePct: 100
  },
  {
    id: 'lp-2',
    title: 'Modern Periodic Table & Chemical Periodicity',
    teacher: null,
    teacherName: 'Sunita Sharma (Science HOD)',
    className: 'Class X / B',
    sectionName: 'Section B',
    subjectName: 'Science (Chemistry)',
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    weekLabel: '18 Oct — 25 Oct 2026',
    periods: 4,
    chapters: ['Chapter 5: Periodic Classification of Elements'],
    objectives: 'Explain Mendeleev’s achievements and anomalies; deduce Modern Periodic Law; analyze trends in atomic radius, valency, and metallic character across periods and down groups.',
    teachingMethods: ['Lecture', 'Discussion', 'Experiment / Lab'],
    teachingAids: ['Smart board', 'Charts / Models', 'Worksheets'],
    resources: 'Periodic Table Wall Chart, Flame test lab salts, interactive element simulator.',
    homework: 'Periodic trends worksheet questions 1-12.',
    status: 'Pending Principal',
    reviewNotes: 'HOD Reviewed: Objectives align well with CBSE blueprint. Ready for final principal approval.',
    topicsList: [
      { id: 'top-201', text: 'Mendeleev Periodic Law vs Henry Moseley atomic number basis', type: 'Syllabus', status: 'Covered' },
      { id: 'top-202', text: 'Trends in Valency & Atomic Size across Period 3', type: 'Syllabus', status: 'Covered' },
      { id: 'top-203', text: 'Metallic and Non-metallic character variation in Groups 1, 2 and 17', type: 'Syllabus', status: 'In-Progress' },
      { id: 'top-204', text: 'Electronegativity concepts and anomalous position of Hydrogen', type: 'Syllabus', status: 'Pending' }
    ],
    coveragePct: 50
  },
  {
    id: 'lp-3',
    title: 'The Rattrap: Metaphorical Analysis & Formal Letter Writing',
    teacher: null,
    teacherName: 'Amit Sharma (English & Languages)',
    className: 'Class XII / Science',
    sectionName: 'Section A',
    subjectName: 'English Core',
    startDate: '2026-10-20',
    endDate: '2026-10-27',
    weekLabel: '20 Oct — 27 Oct 2026',
    periods: 5,
    chapters: ['Flamingo: The Rattrap by Selma Lagerlöf', 'Advanced Writing: Official Letters of Inquiry'],
    objectives: 'Evaluate human loneliness, kindness as an antidote to cynicism, and demonstrate correct formatting for formal administrative communication.',
    teachingMethods: ['Discussion', 'Group work', 'Lecture'],
    teachingAids: ['Textbook', 'Audio-visual', 'Digital content'],
    resources: 'Flamingo textbook, character sketch study guides, model letters handout.',
    homework: 'Draft letter to Municipal Commissioner regarding school crossing safety.',
    status: 'Pending HOD',
    reviewNotes: 'Awaiting English department HOD review.',
    topicsList: [
      { id: 'top-301', text: 'Reading & thematic breakdown: Ironmaster vs Edla Willmansson philosophy', type: 'Syllabus', status: 'Covered' },
      { id: 'top-302', text: 'Symbolism of the 30 kronor bait and spiritual rebirth of the peddler', type: 'Syllabus', status: 'Pending' },
      { id: 'top-303', text: 'Writing Skills: Format, tone and body of letter of complaint/inquiry', type: 'Syllabus', status: 'Pending' },
      { id: 'top-304', text: 'Vocabulary enrichment: Vagabond, forge, chagrined, petulantly', type: 'Additional', status: 'Pending' }
    ],
    coveragePct: 25
  },
  {
    id: 'lp-4',
    title: 'Linear Equations in Two Variables — Graphical Solutions',
    teacher: null,
    teacherName: 'Rajesh Kumar (Mathematics HOD)',
    className: 'Class IX / A',
    sectionName: 'Section A',
    subjectName: 'Mathematics Standard',
    startDate: '2026-10-08',
    endDate: '2026-10-14',
    weekLabel: '08 Oct — 14 Oct 2026',
    periods: 4,
    chapters: ['Chapter 4: Linear Equations in Two Variables'],
    objectives: 'Formulate ax + by + c = 0 representations from contextual word problems and plot solutions on the Cartesian plane.',
    teachingMethods: ['Lecture', 'Activity'],
    teachingAids: ['Textbook', 'Worksheets', 'Smart board'],
    resources: 'Cartesian graph sheets, geometry rulers.',
    homework: 'Graph sheet plotting exercises 4.3.',
    status: 'Needs Revision',
    reviewNotes: 'HOD Note: Please incorporate more word-problem real world scenarios (e.g. taxi fare problem). Resubmit after updating.',
    topicsList: [
      { id: 'top-401', text: 'Standard form ax + by + c = 0 and finding coordinate pairs', type: 'Syllabus', status: 'Pending' },
      { id: 'top-402', text: 'Plotting linear equations on Cartesian graph paper', type: 'Syllabus', status: 'Pending' },
      { id: 'top-403', text: 'Equations of lines parallel to x-axis and y-axis', type: 'Syllabus', status: 'Pending' }
    ],
    coveragePct: 0
  },
  {
    id: 'lp-5',
    title: 'Cell Structure, Organelles & Microscopic Identification',
    teacher: null,
    teacherName: 'Priya Verma (Biology & Life Sciences)',
    className: 'Class VIII / B',
    sectionName: 'Section B',
    subjectName: 'Science (Physics/Chem/Bio)',
    startDate: '2026-10-10',
    endDate: '2026-10-17',
    weekLabel: '10 Oct — 17 Oct 2026',
    periods: 4,
    chapters: ['Chapter 8: Cell — Structure and Functions'],
    objectives: 'Compare plant and animal cell structures under compound microscopes; identify nucleus, cytoplasm, cell membrane, plastids and vacuoles.',
    teachingMethods: ['Demonstration', 'Experiment / Lab', 'Discussion'],
    teachingAids: ['Lab equipment', 'Charts / Models', 'Smart board'],
    resources: 'Onion peel mount, methylene blue dye, compound microscopes, human cheek smear slide.',
    homework: 'Draw and label neat colored diagram of plant vs animal cell with functions table.',
    status: 'Approved',
    reviewNotes: 'Approved. Excellent alignment with hands-on microscope lab sessions.',
    topicsList: [
      { id: 'top-501', text: 'Discovery of cell by Robert Hooke and Cell Theory basics', type: 'Syllabus', status: 'Covered' },
      { id: 'top-502', text: 'Preparation of temporary mount of onion peel cells', type: 'Syllabus', status: 'Covered' },
      { id: 'top-503', text: 'Cell organelles functions: Mitochondria, chloroplast, vacuoles', type: 'Syllabus', status: 'Covered' },
      { id: 'top-504', text: 'Structural differences between prokaryotic and eukaryotic cells', type: 'Syllabus', status: 'In-Progress' }
    ],
    coveragePct: 75
  },
  {
    id: 'lp-6',
    title: 'Alphabet Phonics, Initial Letter Sounds & CVC Blending',
    teacher: null,
    teacherName: 'Neha Kapoor (Primary / Nursery Coordinator)',
    className: 'Nursery / A',
    sectionName: 'Section A',
    subjectName: 'English',
    startDate: '2026-10-12',
    endDate: '2026-10-19',
    weekLabel: '12 Oct — 19 Oct 2026',
    periods: 5,
    chapters: ['Early Phonics Module 2: Letters S, A, T, P, I, N'],
    objectives: 'Auditory recognition of Jolly Phonics letter sounds /s/, /a/, /t/, /p/ and kinesthetic air-tracing of uppercase and lowercase letters.',
    teachingMethods: ['Activity', 'Audio-visual', 'Demonstration'],
    teachingAids: ['Charts / Models', 'Digital content', 'Worksheets'],
    resources: 'Sandpaper letter cards, sensory sand tray, alphabet rhymes speaker.',
    homework: 'Coloring worksheet: Circle the objects beginning with letter A and S.',
    status: 'Draft',
    reviewNotes: '',
    topicsList: [
      { id: 'top-601', text: 'Phonic rhyme action for sound /s/ and /a/', type: 'Syllabus', status: 'Pending' },
      { id: 'top-602', text: 'Tactile finger tracing in sensory sand tray', type: 'Syllabus', status: 'Pending' },
      { id: 'top-603', text: 'Initial sound picture matching games', type: 'Additional', status: 'Pending' }
    ],
    coveragePct: 0
  },
  {
    id: 'lp-7',
    title: 'Indian Constitution: Preamble, Values & Fundamental Rights',
    teacher: null,
    teacherName: 'Vikram Singh (Social Sciences)',
    className: 'Class IX / B',
    sectionName: 'Section B',
    subjectName: 'Social Science',
    startDate: '2026-10-14',
    endDate: '2026-10-21',
    weekLabel: '14 Oct — 21 Oct 2026',
    periods: 4,
    chapters: ['Democratic Politics: Chapter 2 Constitutional Design'],
    objectives: 'Analyze making of the Indian Constitution, role of the Constituent Assembly, and define the core values stated in the Preamble.',
    teachingMethods: ['Discussion', 'Lecture', 'Group work'],
    teachingAids: ['Smart board', 'Textbook', 'Worksheets'],
    resources: 'Facsimile copy of Indian Constitution Preamble, documentary clips.',
    homework: 'Write short notes on Dr. B.R. Ambedkar’s contribution to Constitution drafting.',
    status: 'Approved',
    reviewNotes: 'Approved by Social Science HOD. Excellent discussion prompt ideas.',
    topicsList: [
      { id: 'top-701', text: 'Why do we need a Constitution? South African vs Indian case', type: 'Syllabus', status: 'Covered' },
      { id: 'top-702', text: 'The Constituent Assembly debates and drafting chronology', type: 'Syllabus', status: 'Covered' },
      { id: 'top-703', text: 'Preamble keywords: Sovereign, Socialist, Secular, Democratic, Republic', type: 'Syllabus', status: 'Covered' },
      { id: 'top-704', text: 'Six Fundamental Rights overview under Part III of Constitution', type: 'Syllabus', status: 'Not Covered' }
    ],
    coveragePct: 75
  }
];

// LocalStorage helpers
function getLocalPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(DEFAULT_PLANS));
      return DEFAULT_PLANS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PLANS;
  } catch (e) {
    return DEFAULT_PLANS;
  }
}

function saveLocalPlans(plans) {
  try {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plans to localStorage:', e);
  }
}

function getLocalSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw) || DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

function saveLocalSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export const lessonPlanService = {
  // Fetch plans with filters
  getLessonPlans: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/lesson-plans', { params: filters });
      if (response.data && response.data.data && response.data.data.length > 0) {
        const dbData = response.data.data.map(p => ({
          ...p,
          id: p._id || p.id,
          weekLabel: p.weekLabel || (p.startDate ? `${new Date(p.startDate).toLocaleDateString()} — ${new Date(p.endDate).toLocaleDateString()}` : '')
        }));
        saveLocalPlans(dbData);
        return dbData;
      }
    } catch (e) {
      console.warn('Backend /api/lesson-plans not responding, using localStorage.', e.message);
    }

    let plans = getLocalPlans();

    if (filters.status && filters.status !== 'All' && filters.status !== 'All statuses') {
      plans = plans.filter(p => p.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.className && filters.className !== 'All' && filters.className !== 'All classes') {
      plans = plans.filter(p => p.className && p.className.toLowerCase().includes(filters.className.toLowerCase()));
    }
    if (filters.teacherName && filters.teacherName !== 'All' && filters.teacherName !== 'All teachers') {
      plans = plans.filter(p => p.teacherName && p.teacherName.toLowerCase().includes(filters.teacherName.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      plans = plans.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.subjectName && p.subjectName.toLowerCase().includes(q)) ||
        (p.teacherName && p.teacherName.toLowerCase().includes(q)) ||
        (p.objectives && p.objectives.toLowerCase().includes(q))
      );
    }

    return plans;
  },

  // Get plan by ID
  getLessonPlanById: async (id) => {
    try {
      const res = await axiosInstance.get(`/lesson-plans/${id}`);
      if (res.data && res.data.data) {
        const item = res.data.data;
        return { ...item, id: item._id || item.id };
      }
    } catch (e) {
      console.warn('Backend getPlanById error:', e.message);
    }

    const plans = getLocalPlans();
    return plans.find(p => String(p.id) === String(id) || String(p._id) === String(id)) || plans[0];
  },

  // Create new plan
  createLessonPlan: async (planData) => {
    const newId = 'lp-' + Date.now();
    const formatted = {
      ...planData,
      id: newId,
      status: planData.status || 'Draft',
      coveragePct: planData.coveragePct || 0,
      topicsList: planData.topicsList || []
    };

    try {
      const res = await axiosInstance.post('/lesson-plans', formatted);
      if (res.data && res.data.data) {
        formatted._id = res.data.data._id;
      }
    } catch (e) {
      console.warn('Backend plan creation error, saving to localStorage:', e.message);
    }

    const plans = getLocalPlans();
    plans.unshift(formatted);
    saveLocalPlans(plans);
    return formatted;
  },

  // Update existing plan
  updateLessonPlan: async (id, updateFields) => {
    try {
      await axiosInstance.put(`/lesson-plans/${id}`, updateFields);
    } catch (e) {
      console.warn('Backend plan update error:', e.message);
    }

    const plans = getLocalPlans();
    const idx = plans.findIndex(p => String(p.id) === String(id) || String(p._id) === String(id));
    if (idx !== -1) {
      plans[idx] = { ...plans[idx], ...updateFields };
      saveLocalPlans(plans);
      return plans[idx];
    }
    return null;
  },

  // Delete plan
  deleteLessonPlan: async (id) => {
    try {
      await axiosInstance.delete(`/lesson-plans/${id}`);
    } catch (e) {
      console.warn('Backend plan deletion error:', e.message);
    }

    const plans = getLocalPlans();
    const filtered = plans.filter(p => String(p.id) !== String(id) && String(p._id) !== String(id));
    saveLocalPlans(filtered);
    return true;
  },

  // Duplicate / Clone plan
  duplicateLessonPlan: async (id) => {
    const original = await lessonPlanService.getLessonPlanById(id);
    if (!original) return null;

    const cloned = {
      ...original,
      title: `${original.title} (Copy)`,
      status: 'Draft',
      coveragePct: 0,
      topicsList: (original.topicsList || []).map(t => ({ ...t, status: 'Pending' }))
    };
    delete cloned._id;
    delete cloned.id;

    return lessonPlanService.createLessonPlan(cloned);
  },

  // HOD Review action
  reviewPlan: async (id, status, reviewNotes = '') => {
    return lessonPlanService.updateLessonPlan(id, {
      status, // 'Pending Principal' or 'Needs Revision'
      reviewNotes
    });
  },

  // Final approval action
  finalApprovePlan: async (id) => {
    return lessonPlanService.updateLessonPlan(id, {
      status: 'Approved'
    });
  },

  // Bulk approve plans
  bulkApprovePlans: async (ids) => {
    const plans = getLocalPlans();
    plans.forEach(p => {
      if (ids.includes(p.id) || ids.includes(p._id)) {
        p.status = 'Approved';
      }
    });
    saveLocalPlans(plans);
    return true;
  },

  // Topic Coverage Update
  updateTopicCoverage: async (planId, topicId, newStatus) => {
    const plans = getLocalPlans();
    const plan = plans.find(p => String(p.id) === String(planId) || String(p._id) === String(planId));
    if (plan && plan.topicsList) {
      const topic = plan.topicsList.find(t => String(t.id) === String(topicId) || String(t._id) === String(topicId));
      if (topic) {
        topic.status = newStatus;

        // Recalculate coverage percentage
        const total = plan.topicsList.length;
        const covered = plan.topicsList.filter(t => t.status === 'Covered').length;
        plan.coveragePct = total > 0 ? Math.round((covered / total) * 100) : 0;

        saveLocalPlans(plans);
        return plan;
      }
    }
    return null;
  },

  // Dashboard Stats calculation
  getDashboardStats: async () => {
    const plans = getLocalPlans();
    const totalPlans = plans.length;
    const drafts = plans.filter(p => p.status === 'Draft').length;
    const pendingHOD = plans.filter(p => p.status === 'Pending HOD' || p.status === 'Pending Review').length;
    const pendingPrincipal = plans.filter(p => p.status === 'Pending Principal').length;
    const approved = plans.filter(p => p.status === 'Approved').length;
    const needsRevision = plans.filter(p => p.status === 'Needs Revision').length;

    let totalTopics = 0;
    let coveredTopics = 0;
    plans.forEach(p => {
      if (p.topicsList && p.topicsList.length > 0) {
        totalTopics += p.topicsList.length;
        coveredTopics += p.topicsList.filter(t => t.status === 'Covered').length;
      }
    });

    const overallCoveragePct = totalTopics > 0 ? Math.round((coveredTopics / totalTopics) * 100) : 65;

    return {
      totalPlans,
      drafts,
      pendingHOD,
      pendingPrincipal,
      approved,
      needsRevision,
      totalTopics,
      coveredTopics,
      overallCoveragePct,
      recentPlans: plans.slice(0, 8)
    };
  },

  // Settings
  getSettings: () => getLocalSettings(),
  saveSettings: (data) => {
    saveLocalSettings(data);
    return data;
  }
};

export default lessonPlanService;
