import axiosInstance from './axios';

const STORAGE_KEY = 'school_erp_assessments_v2';

const DEFAULT_ASSESSMENTS_SEED = [
  {
    id: 'ass-101',
    _id: 'ass-101',
    title: 'Unit 3: Quadratic Equations & Roots Quiz',
    type: 'Quiz',
    classSec: 'Class 10-A',
    subject: 'Mathematics',
    totalMarks: 25,
    passingMarks: 10,
    date: '2026-09-18',
    recurrence: 'Weekly',
    conductedVia: 'Paper / Pen',
    instructions: 'Time limit 40 minutes. No calculators allowed.',
    status: 'Published',
    sittings: 1,
    entries: [
      { studentId: 's1', studentName: 'Aarav Sharma', rollNo: '101', admissionNo: 'ADM-2024-01', marksObtained: 24, maxMarks: 25, percentage: 96, grade: 'A+', status: 'Present', teacherRemarks: 'Exceptional working on quadratic formula!' },
      { studentId: 's2', studentName: 'Diya Patel', rollNo: '102', admissionNo: 'ADM-2024-02', marksObtained: 22, maxMarks: 25, percentage: 88, grade: 'A', status: 'Present', teacherRemarks: 'Very good accuracy.' },
      { studentId: 's3', studentName: 'Rohan Verma', rollNo: '103', admissionNo: 'ADM-2024-03', marksObtained: 19, maxMarks: 25, percentage: 76, grade: 'B+', status: 'Present', teacherRemarks: 'Minor algebraic slip on Q3.' },
      { studentId: 's4', studentName: 'Ananya Iyer', rollNo: '104', admissionNo: 'ADM-2024-04', marksObtained: 23, maxMarks: 25, percentage: 92, grade: 'A+', status: 'Present', teacherRemarks: 'Clean derivations.' },
      { studentId: 's5', studentName: 'Kabir Mehta', rollNo: '105', admissionNo: 'ADM-2024-05', marksObtained: 15, maxMarks: 25, percentage: 60, grade: 'B', status: 'Present', teacherRemarks: 'Needs revision on discriminant.' },
      { studentId: 's6', studentName: 'Ishaan Gupta', rollNo: '106', admissionNo: 'ADM-2024-06', marksObtained: 0, maxMarks: 25, percentage: 0, grade: 'F', status: 'Absent', teacherRemarks: 'Medical leave.' }
    ],
    stats: {
      averageScore: 20.6,
      highestScore: 24,
      lowestScore: 15,
      passPercentage: 100,
      totalAppeared: 5
    }
  },
  {
    id: 'ass-102',
    _id: 'ass-102',
    title: 'Weekly Physics Test: Optics & Ray Diagrams',
    type: 'Unit Test',
    classSec: 'Class 10-A',
    subject: 'Physics',
    totalMarks: 30,
    passingMarks: 12,
    date: '2026-09-22',
    recurrence: 'Weekly',
    conductedVia: 'Paper / Pen',
    instructions: 'Draw ray diagrams with ruler and sharp pencil.',
    status: 'Published',
    sittings: 1,
    entries: [
      { studentId: 's1', studentName: 'Aarav Sharma', rollNo: '101', admissionNo: 'ADM-2024-01', marksObtained: 28, maxMarks: 30, percentage: 93.3, grade: 'A+', status: 'Present', teacherRemarks: 'Perfect convex mirror diagrams.' },
      { studentId: 's2', studentName: 'Diya Patel', rollNo: '102', admissionNo: 'ADM-2024-02', marksObtained: 26, maxMarks: 30, percentage: 86.7, grade: 'A', status: 'Present', teacherRemarks: 'Clear focal distance labeling.' },
      { studentId: 's3', studentName: 'Rohan Verma', rollNo: '103', admissionNo: 'ADM-2024-03', marksObtained: 21, maxMarks: 30, percentage: 70, grade: 'B+', status: 'Present', teacherRemarks: 'Good attempt on refraction index.' },
      { studentId: 's4', studentName: 'Ananya Iyer', rollNo: '104', admissionNo: 'ADM-2024-04', marksObtained: 29, maxMarks: 30, percentage: 96.7, grade: 'A+', status: 'Present', teacherRemarks: 'Flawless performance.' },
      { studentId: 's5', studentName: 'Kabir Mehta', rollNo: '105', admissionNo: 'ADM-2024-05', marksObtained: 18, maxMarks: 30, percentage: 60, grade: 'B', status: 'Present', teacherRemarks: 'Practice sign conventions.' },
      { studentId: 's6', studentName: 'Ishaan Gupta', rollNo: '106', admissionNo: 'ADM-2024-06', marksObtained: 22, maxMarks: 30, percentage: 73.3, grade: 'B+', status: 'Present', teacherRemarks: 'Steady progress.' }
    ],
    stats: {
      averageScore: 24,
      highestScore: 29,
      lowestScore: 18,
      passPercentage: 100,
      totalAppeared: 6
    }
  },
  {
    id: 'ass-103',
    _id: 'ass-103',
    title: 'Periodic English Grammar & Creative Writing Check',
    type: 'Periodic Test',
    classSec: 'Class 9-B',
    subject: 'English',
    totalMarks: 20,
    passingMarks: 8,
    date: '2026-09-25',
    recurrence: 'Bi-weekly',
    conductedVia: 'Paper / Pen',
    instructions: 'Section A: Active-Passive Voice, Section B: Short Story Writing.',
    status: 'Evaluated',
    sittings: 1,
    entries: [
      { studentId: 's7', studentName: 'Sanya Mirza', rollNo: '201', admissionNo: 'ADM-2024-11', marksObtained: 18, maxMarks: 20, percentage: 90, grade: 'A+', status: 'Present', teacherRemarks: 'Creative expression and wide vocabulary.' },
      { studentId: 's8', studentName: 'Devansh Joshi', rollNo: '202', admissionNo: 'ADM-2024-12', marksObtained: 15, maxMarks: 20, percentage: 75, grade: 'B+', status: 'Present', teacherRemarks: 'Good story structure.' },
      { studentId: 's9', studentName: 'Meera Rao', rollNo: '203', admissionNo: 'ADM-2024-13', marksObtained: 17, maxMarks: 20, percentage: 85, grade: 'A', status: 'Present', teacherRemarks: 'Well written dialogue.' },
      { studentId: 's10', studentName: 'Yashwardhan Roy', rollNo: '204', admissionNo: 'ADM-2024-14', marksObtained: 13, maxMarks: 20, percentage: 65, grade: 'B', status: 'Present', teacherRemarks: 'Check preposition usage.' }
    ],
    stats: {
      averageScore: 15.75,
      highestScore: 18,
      lowestScore: 13,
      passPercentage: 100,
      totalAppeared: 4
    }
  },
  {
    id: 'ass-104',
    _id: 'ass-104',
    title: 'Chemical Reactions & Balancing Equations Quiz',
    type: 'Quiz',
    classSec: 'Class 10-A',
    subject: 'Chemistry',
    totalMarks: 25,
    passingMarks: 10,
    date: '2026-10-04',
    recurrence: 'Weekly',
    conductedVia: 'Online Quiz',
    instructions: 'Quick-fire 20 MCQs and 5 equation balancing steps.',
    status: 'Scheduled',
    sittings: 1,
    entries: [
      { studentId: 's1', studentName: 'Aarav Sharma', rollNo: '101', admissionNo: 'ADM-2024-01', marksObtained: 0, maxMarks: 25, percentage: 0, grade: 'F', status: 'Present', teacherRemarks: '' },
      { studentId: 's2', studentName: 'Diya Patel', rollNo: '102', admissionNo: 'ADM-2024-02', marksObtained: 0, maxMarks: 25, percentage: 0, grade: 'F', status: 'Present', teacherRemarks: '' },
      { studentId: 's3', studentName: 'Rohan Verma', rollNo: '103', admissionNo: 'ADM-2024-03', marksObtained: 0, maxMarks: 25, percentage: 0, grade: 'F', status: 'Present', teacherRemarks: '' },
      { studentId: 's4', studentName: 'Ananya Iyer', rollNo: '104', admissionNo: 'ADM-2024-04', marksObtained: 0, maxMarks: 25, percentage: 0, grade: 'F', status: 'Present', teacherRemarks: '' },
      { studentId: 's5', studentName: 'Kabir Mehta', rollNo: '105', admissionNo: 'ADM-2024-05', marksObtained: 0, maxMarks: 25, percentage: 0, grade: 'F', status: 'Present', teacherRemarks: '' }
    ],
    stats: {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passPercentage: 0,
      totalAppeared: 0
    }
  },
  {
    id: 'ass-105',
    _id: 'ass-105',
    title: 'Python Functions & Data Structures Practical',
    type: 'Practical',
    classSec: 'Class 11-A',
    subject: 'Computer Science',
    totalMarks: 50,
    passingMarks: 20,
    date: '2026-10-08',
    recurrence: 'Monthly',
    conductedVia: 'Lab / Practical',
    instructions: 'Live code review and execution on school lab machines.',
    status: 'Evaluated',
    sittings: 1,
    entries: [
      { studentId: 's11', studentName: 'Kunal Singhania', rollNo: '301', admissionNo: 'ADM-2024-21', marksObtained: 47, maxMarks: 50, percentage: 94, grade: 'A+', status: 'Present', teacherRemarks: 'Clean modular code and unit tests.' },
      { studentId: 's12', studentName: 'Rhea Kapoor', rollNo: '302', admissionNo: 'ADM-2024-22', marksObtained: 42, maxMarks: 50, percentage: 84, grade: 'A', status: 'Present', teacherRemarks: 'Good algorithmic efficiency.' },
      { studentId: 's13', studentName: 'Tanmay Bhatt', rollNo: '303', admissionNo: 'ADM-2024-23', marksObtained: 38, maxMarks: 50, percentage: 76, grade: 'B+', status: 'Present', teacherRemarks: 'Minor bug in recursion base case.' }
    ],
    stats: {
      averageScore: 42.3,
      highestScore: 47,
      lowestScore: 38,
      passPercentage: 100,
      totalAppeared: 3
    }
  }
];

export const CLASS_ROSTERS = {
  'Class 10-A': [
    { studentName: 'Aarav Sharma', rollNo: '101', admissionNo: 'ADM-2024-01' },
    { studentName: 'Diya Patel', rollNo: '102', admissionNo: 'ADM-2024-02' },
    { studentName: 'Rohan Verma', rollNo: '103', admissionNo: 'ADM-2024-03' },
    { studentName: 'Ananya Iyer', rollNo: '104', admissionNo: 'ADM-2024-04' },
    { studentName: 'Kabir Mehta', rollNo: '105', admissionNo: 'ADM-2024-05' },
    { studentName: 'Ishaan Gupta', rollNo: '106', admissionNo: 'ADM-2024-06' }
  ],
  'Class 9-B': [
    { studentName: 'Sanya Mirza', rollNo: '201', admissionNo: 'ADM-2024-11' },
    { studentName: 'Devansh Joshi', rollNo: '202', admissionNo: 'ADM-2024-12' },
    { studentName: 'Meera Rao', rollNo: '203', admissionNo: 'ADM-2024-13' },
    { studentName: 'Yashwardhan Roy', rollNo: '204', admissionNo: 'ADM-2024-14' },
    { studentName: 'Priya Chawla', rollNo: '205', admissionNo: 'ADM-2024-15' }
  ],
  'Class 11-A': [
    { studentName: 'Kunal Singhania', rollNo: '301', admissionNo: 'ADM-2024-21' },
    { studentName: 'Rhea Kapoor', rollNo: '302', admissionNo: 'ADM-2024-22' },
    { studentName: 'Tanmay Bhatt', rollNo: '303', admissionNo: 'ADM-2024-23' },
    { studentName: 'Sneha Kulkarni', rollNo: '304', admissionNo: 'ADM-2024-24' }
  ],
  'Class 8-C': [
    { studentName: 'Varun Nair', rollNo: '401', admissionNo: 'ADM-2024-31' },
    { studentName: 'Tara Deshmukh', rollNo: '402', admissionNo: 'ADM-2024-32' },
    { studentName: 'Arjun Sen', rollNo: '403', admissionNo: 'ADM-2024-33' }
  ]
};

export const SUBJECT_OPTIONS = {
  'Class 10-A': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Social Science'],
  'Class 9-B': ['English', 'Mathematics', 'Science', 'Hindi', 'Social Science'],
  'Class 11-A': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'English Core'],
  'Class 8-C': ['Mathematics', 'General Science', 'Social Studies', 'English', 'Hindi']
};

export const calculateGrade = (pct) => {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

const getLocalAssessments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ASSESSMENTS_SEED));
      return DEFAULT_ASSESSMENTS_SEED;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ASSESSMENTS_SEED;
  }
};

const setLocalAssessments = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

export const assessmentService = {
  // Fetch All Assessments with filters
  getAssessments: async (params = {}) => {
    try {
      const res = await axiosInstance.get('/assessments', { params });
      if (res.data?.data && res.data.data.length > 0) {
        setLocalAssessments(res.data.data);
        return res.data.data;
      }
    } catch {
      // Offline fallback
    }

    let local = getLocalAssessments();
    const { type, classSec, subject, status, search } = params;

    if (type && type !== 'All') local = local.filter(a => a.type === type);
    if (classSec && classSec !== 'All') local = local.filter(a => a.classSec.toLowerCase().includes(classSec.toLowerCase()));
    if (subject && subject !== 'All') local = local.filter(a => a.subject.toLowerCase().includes(subject.toLowerCase()));
    if (status && status !== 'All') local = local.filter(a => a.status === status);
    if (search) {
      const s = search.toLowerCase();
      local = local.filter(a => 
        a.title.toLowerCase().includes(s) || 
        a.subject.toLowerCase().includes(s) || 
        a.classSec.toLowerCase().includes(s)
      );
    }
    return local;
  },

  // Get Assessment by ID
  getAssessmentById: async (id) => {
    try {
      const res = await axiosInstance.get(`/assessments/${id}`);
      if (res.data?.data) return res.data.data;
    } catch {
      // Offline fallback
    }
    const local = getLocalAssessments();
    return local.find(a => (a._id === id || a.id === id)) || null;
  },

  // Create New Assessment
  createAssessment: async (data) => {
    const classRoster = CLASS_ROSTERS[data.classSec] || CLASS_ROSTERS['Class 10-A'];
    const totalMarks = Number(data.totalMarks) || 25;
    const initialEntries = classRoster.map(s => ({
      studentId: `std-${Math.random().toString(36).substr(2, 6)}`,
      studentName: s.studentName,
      rollNo: s.rollNo,
      admissionNo: s.admissionNo,
      marksObtained: 0,
      maxMarks: totalMarks,
      percentage: 0,
      grade: 'F',
      status: 'Present',
      teacherRemarks: ''
    }));

    const payload = {
      ...data,
      totalMarks,
      passingMarks: Number(data.passingMarks) || Math.round(totalMarks * 0.4),
      entries: initialEntries,
      status: 'Scheduled',
      sittings: 1,
      stats: {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passPercentage: 0,
        totalAppeared: 0
      }
    };

    try {
      const res = await axiosInstance.post('/assessments', payload);
      if (res.data?.data) {
        const local = getLocalAssessments();
        setLocalAssessments([res.data.data, ...local]);
        return res.data.data;
      }
    } catch {
      // Offline fallback
    }

    const localItem = {
      ...payload,
      id: `ass-${Date.now()}`,
      _id: `ass-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const local = getLocalAssessments();
    setLocalAssessments([localItem, ...local]);
    return localItem;
  },

  // Update Assessment
  updateAssessment: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/assessments/${id}`, data);
      if (res.data?.data) return res.data.data;
    } catch {
      // Offline fallback
    }
    const local = getLocalAssessments();
    const idx = local.findIndex(a => (a._id === id || a.id === id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
      setLocalAssessments(local);
      return local[idx];
    }
    return null;
  },

  // Delete Assessment
  deleteAssessment: async (id) => {
    try {
      await axiosInstance.delete(`/assessments/${id}`);
    } catch {
      // Offline fallback
    }
    const local = getLocalAssessments();
    const filtered = local.filter(a => (a._id !== id && a.id !== id));
    setLocalAssessments(filtered);
    return true;
  },

  // Save Marks / Grade Book Evaluation
  saveMarks: async (id, entries, publish = false) => {
    try {
      const res = await axiosInstance.post(`/assessments/${id}/marks`, { entries, publish });
      if (res.data?.data) {
        const local = getLocalAssessments();
        const idx = local.findIndex(a => (a._id === id || a.id === id));
        if (idx !== -1) {
          local[idx] = res.data.data;
          setLocalAssessments(local);
        }
        return res.data.data;
      }
    } catch {
      // Offline fallback
    }

    const local = getLocalAssessments();
    const idx = local.findIndex(a => (a._id === id || a.id === id));
    if (idx === -1) return null;

    const target = local[idx];
    let totalMarksSum = 0;
    let presentCount = 0;
    let passCount = 0;
    let highest = 0;
    let lowest = target.totalMarks;

    const processedEntries = entries.map(item => {
      const marks = Number(item.marksObtained) || 0;
      const isPresent = item.status !== 'Absent';
      const pct = target.totalMarks > 0 ? Math.round((marks / target.totalMarks) * 1000) / 10 : 0;
      const grade = isPresent ? calculateGrade(pct) : 'F';

      if (isPresent) {
        totalMarksSum += marks;
        presentCount++;
        if (marks >= target.passingMarks) passCount++;
        if (marks > highest) highest = marks;
        if (marks < lowest) lowest = marks;
      }

      return {
        ...item,
        marksObtained: marks,
        maxMarks: target.totalMarks,
        percentage: pct,
        grade,
        status: item.status || 'Present',
        teacherRemarks: item.teacherRemarks || ''
      };
    });

    const avg = presentCount > 0 ? Math.round((totalMarksSum / presentCount) * 10) / 10 : 0;
    const passPct = presentCount > 0 ? Math.round((passCount / presentCount) * 100) : 0;

    target.entries = processedEntries;
    target.stats = {
      averageScore: avg,
      highestScore: presentCount > 0 ? highest : 0,
      lowestScore: presentCount > 0 ? lowest : 0,
      passPercentage: passPct,
      totalAppeared: presentCount
    };
    target.status = publish ? 'Published' : 'Evaluated';

    local[idx] = target;
    setLocalAssessments(local);
    return target;
  },

  // Publish Results
  publishAssessment: async (id) => {
    try {
      const res = await axiosInstance.post(`/assessments/${id}/publish`);
      if (res.data?.data) return res.data.data;
    } catch {
      // Offline fallback
    }
    const local = getLocalAssessments();
    const idx = local.findIndex(a => (a._id === id || a.id === id));
    if (idx !== -1) {
      local[idx].status = 'Published';
      setLocalAssessments(local);
      return local[idx];
    }
    return null;
  },

  // Get Summary Statistics
  getAssessmentStats: async () => {
    try {
      const res = await axiosInstance.get('/assessments/stats/summary');
      if (res.data?.data) return res.data.data;
    } catch {
      // Offline fallback
    }

    const list = getLocalAssessments();
    const totalAssessments = list.length;
    const publishedCount = list.filter(a => a.status === 'Published').length;
    const evaluatedCount = list.filter(a => a.status === 'Evaluated').length;
    const scheduledCount = list.filter(a => a.status === 'Scheduled').length;

    let totalAvgSum = 0;
    let avgCount = 0;
    list.forEach(a => {
      if (a.stats?.averageScore > 0 && a.totalMarks > 0) {
        totalAvgSum += (a.stats.averageScore / a.totalMarks) * 100;
        avgCount++;
      }
    });

    return {
      totalAssessments,
      publishedCount,
      evaluatedCount,
      scheduledCount,
      overallAveragePercentage: avgCount > 0 ? Math.round(totalAvgSum / avgCount) : 84,
      totalSittings: list.reduce((acc, curr) => acc + (curr.sittings || 1), 0)
    };
  },

  // Get Student Progress Report Dossier
  getStudentReport: async (studentName, classSec) => {
    try {
      const res = await axiosInstance.get('/assessments/student-report', {
        params: { studentName, classSec }
      });
      if (res.data?.data) return res.data.data;
    } catch {
      // Offline fallback
    }

    const assessments = getLocalAssessments().filter(ass => {
      if (classSec && classSec !== 'All' && !ass.classSec.toLowerCase().includes(classSec.toLowerCase())) return false;
      return ass.entries?.some(e => e.studentName.toLowerCase().includes(studentName.toLowerCase()));
    });

    const history = [];
    assessments.forEach(ass => {
      const entry = ass.entries.find(e => e.studentName.toLowerCase().includes(studentName.toLowerCase()));
      if (entry) {
        history.push({
          assessmentId: ass._id || ass.id,
          title: ass.title,
          type: ass.type,
          subject: ass.subject,
          classSec: ass.classSec,
          date: ass.date,
          marksObtained: entry.marksObtained,
          maxMarks: entry.maxMarks || ass.totalMarks,
          percentage: entry.percentage,
          grade: entry.grade,
          status: entry.status,
          teacherRemarks: entry.teacherRemarks
        });
      }
    });

    const totalTests = history.length;
    const avgScore = totalTests > 0 
      ? Math.round(history.reduce((acc, c) => acc + c.percentage, 0) / totalTests) 
      : 0;

    return {
      studentName,
      classSec: classSec || (history[0] ? history[0].classSec : 'Class 10-A'),
      totalTests,
      averagePercentage: avgScore,
      history
    };
  },

  // Get Rank List
  getRankList: async (classSec, assessmentId) => {
    try {
      const res = await axiosInstance.get('/assessments/rank-list', {
        params: { classSec, assessmentId }
      });
      if (res.data?.data) return res.data;
    } catch {
      // Offline fallback
    }

    const list = getLocalAssessments();
    if (assessmentId) {
      const target = list.find(a => (a._id === assessmentId || a.id === assessmentId));
      if (!target) return { success: false, data: [] };

      const sorted = [...(target.entries || [])]
        .filter(e => e.status !== 'Absent')
        .sort((a, b) => b.marksObtained - a.marksObtained)
        .map((entry, index) => ({
          rank: index + 1,
          studentName: entry.studentName,
          rollNo: entry.rollNo,
          admissionNo: entry.admissionNo,
          marksObtained: entry.marksObtained,
          maxMarks: entry.maxMarks || target.totalMarks,
          percentage: entry.percentage,
          grade: entry.grade,
          status: entry.status
        }));

      return {
        success: true,
        scope: 'Single Assessment',
        assessmentTitle: target.title,
        data: sorted
      };
    }

    // Cumulative class ranks
    const filtered = classSec && classSec !== 'All' 
      ? list.filter(a => a.classSec.toLowerCase().includes(classSec.toLowerCase()))
      : list;

    const studentMap = {};
    filtered.forEach(ass => {
      (ass.entries || []).forEach(entry => {
        if (!studentMap[entry.studentName]) {
          studentMap[entry.studentName] = {
            studentName: entry.studentName,
            rollNo: entry.rollNo || '',
            admissionNo: entry.admissionNo || '',
            classSec: ass.classSec,
            totalMarksObtained: 0,
            totalMaxMarks: 0,
            testsAttended: 0
          };
        }
        if (entry.status !== 'Absent') {
          studentMap[entry.studentName].totalMarksObtained += entry.marksObtained;
          studentMap[entry.studentName].totalMaxMarks += (entry.maxMarks || ass.totalMarks);
          studentMap[entry.studentName].testsAttended++;
        }
      });
    });

    const rankList = Object.values(studentMap)
      .map(s => {
        const pct = s.totalMaxMarks > 0 ? Math.round((s.totalMarksObtained / s.totalMaxMarks) * 1000) / 10 : 0;
        return {
          ...s,
          percentage: pct,
          grade: calculateGrade(pct)
        };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .map((item, idx) => ({
        rank: idx + 1,
        ...item
      }));

    return {
      success: true,
      scope: 'Overall Class Cumulative',
      data: rankList
    };
  }
};

export default assessmentService;
