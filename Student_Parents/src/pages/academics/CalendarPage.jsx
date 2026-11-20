import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, 
  MapPin, RefreshCw, Award, X, 
  Filter, CalendarDays, Check,
  BookOpen, Trophy, Flag, Handshake, AlertCircle
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { academicService } from '../../api/academicService';
import { authService } from '../../api/authService';
import { useLanguage } from '../../context/LanguageContext';

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
const FULL_DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const FULL_DAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

// Annual baseline academic & holiday events for any year
const getAcademicCalendarForYear = (year, lang = 'en') => {
  if (lang === 'hi') {
    return [
      { id: `base-01-01`, startDate: `${year}-01-01`, endDate: `${year}-01-01`, title: 'नव वर्ष दिवस अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'नव वर्ष के उपलक्ष्य में विद्यालय बंद रहेगा।', type: 'holiday' },
      { id: `base-01-14`, startDate: `${year}-01-14`, endDate: `${year}-01-14`, title: 'मकर संक्रांति / पोंगल अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'मकर संक्रांति पर्व का अवकाश।', type: 'holiday' },
      { id: `base-01-26`, startDate: `${year}-01-26`, endDate: `${year}-01-26`, title: 'गणतंत्र दिवस समारोह व परेड', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'मुख्य खेल मैदान', desc: 'देशभक्ति परेड, ध्वजारोहण समारोह एवं सांस्कृतिक प्रस्तुतियां।', type: 'holiday' },
      { id: `base-02-14`, startDate: `${year}-02-14`, endDate: `${year}-02-14`, title: 'सरस्वती पूजा एवं बसंत पंचमी', category: 'Celebration', time: '09:30 AM – 11:30 AM', venue: 'केंद्रीय प्रांगण', desc: 'विद्यार्थियों के लिए विशेष सुबह की प्रार्थना सभा।', type: 'event' },
      { id: `base-03-03`, startDate: `${year}-03-03`, endDate: `${year}-03-03`, title: 'होली महापर्व अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'होली महोत्सव के उपलक्ष्य में विद्यालय बंद रहेगा।', type: 'holiday' },
      { id: `base-03-10`, startDate: `${year}-03-10`, endDate: `${year}-03-24`, title: 'वार्षिक अंतिम परीक्षाएं', category: 'Exams', time: '08:30 AM – 12:30 PM', venue: 'परीक्षा हॉल', desc: 'सभी कक्षाओं के लिए वर्ष-अंत की अंतिम परीक्षाएं।', type: 'exam' },
      { id: `base-04-01`, startDate: `${year}-04-01`, endDate: `${year}-04-01`, title: 'नवीन शैक्षणिक सत्र प्रारंभ', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'सभी कक्षाएं', desc: 'नए शैक्षणिक सत्र का ओरिएंटेशन के साथ प्रारंभ।', type: 'academic' },
      { id: `base-04-14`, startDate: `${year}-04-14`, endDate: `${year}-04-14`, title: 'डॉ. अम्बेडकर जयंती अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'डॉ. बी.आर. अम्बेडकर जयंती पर राष्ट्रीय अवकाश।', type: 'holiday' },
      { id: `base-05-20`, startDate: `${year}-05-20`, endDate: `${year}-06-30`, title: 'ग्रीष्मकालीन अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'सभी कक्षाओं के लिए ग्रीष्मावकाश।', type: 'holiday' },
      { id: `base-07-01`, startDate: `${year}-07-01`, endDate: `${year}-07-01`, title: 'विद्यालय पुनः प्रारंभ', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'सभी विंग्स', desc: 'नियमित कक्षा समय सारणी पुनः शुरू।', type: 'academic' },
      { id: `base-08-15`, startDate: `${year}-08-15`, endDate: `${year}-08-15`, title: 'स्वतंत्रता दिवस समारोह', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'परेड ग्राउंड', desc: 'ध्वजारोहण, सांस्कृतिक प्रस्तुतियां एवं देशभक्ति गीत।', type: 'holiday' },
      { id: `base-09-05`, startDate: `${year}-09-05`, endDate: `${year}-09-05`, title: 'शिक्षक दिवस विशेष समारोह', category: 'Celebration', time: '09:00 AM – 01:00 PM', venue: 'स्कूल सभागार', desc: 'शिक्षकों के सम्मान में विद्यार्थियों द्वारा विशेष प्रस्तुति।', type: 'event' },
      { id: `base-10-02`, startDate: `${year}-10-02`, endDate: `${year}-10-02`, title: 'गांधी जयंती राष्ट्रीय अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'राष्ट्रपिता महात्मा गांधी जयंती पर राष्ट्रीय अवकाश।', type: 'holiday' },
      { id: `base-10-29`, startDate: `${year}-10-29`, endDate: `${year}-11-03`, title: 'दीपावली एवं शरदकालीन अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'दीपावली महापर्व एवं गोवर्धन पूजा अवकाश।', type: 'holiday' },
      { id: `base-11-14`, startDate: `${year}-11-14`, endDate: `${year}-11-14`, title: 'बाल दिवस मेला एवं उत्सव', category: 'Celebration', time: '09:00 AM – 01:30 PM', venue: 'स्कूल प्रांगण', desc: 'खेल स्टॉल, फ़ूड कार्निवल, जादू शो और गतिविधियां।', type: 'event' },
      { id: `base-11-24`, startDate: `${year}-11-24`, endDate: `${year}-11-24`, title: 'गुरु नानक जयंती अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'गुरु नानक देव जी के प्रकाश पर्व पर विद्यालय अवकाश।', type: 'holiday' },
      { id: `base-12-15`, startDate: `${year}-12-15`, endDate: `${year}-12-16`, title: 'तरंग 2026 - वार्षिक सांस्कृतिक महोत्सव', category: 'Celebration', time: '05:00 PM – 09:30 PM', venue: 'ओपन एयर थिएटर', desc: 'नाटक, आर्केस्ट्रा और शास्त्रीय नृत्य का भव्य वार्षिक उत्सव।', type: 'event' },
      { id: `base-12-25`, startDate: `${year}-12-25`, endDate: `${year}-12-31`, title: 'क्रिसमस एवं शीतकालीन अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'सभी विद्यार्थियों के लिए शीतकालीन अवकाश।', type: 'holiday' }
    ];
  }

  return [
    { id: `base-01-01`, startDate: `${year}-01-01`, endDate: `${year}-01-01`, title: "New Year's Day Celebration", category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'School closed for New Year Holiday.', type: 'holiday' },
    { id: `base-01-14`, startDate: `${year}-01-14`, endDate: `${year}-01-14`, title: 'Makar Sankranti / Pongal Break', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'Harvest festival holiday.', type: 'holiday' },
    { id: `base-01-26`, startDate: `${year}-01-26`, endDate: `${year}-01-26`, title: 'Republic Day Parade & Hoisting', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'Main School Grounds', desc: 'Patriotic parade, flag hoisting ceremony and cultural dances.', type: 'holiday' },
    { id: `base-02-14`, startDate: `${year}-02-14`, endDate: `${year}-02-14`, title: 'Saraswati Puja & Vasant Panchami', category: 'Celebration', time: '09:30 AM – 11:30 AM', venue: 'Central Courtyard', desc: 'Special morning assembly and blessings for students.', type: 'event' },
    { id: `base-03-03`, startDate: `${year}-03-03`, endDate: `${year}-03-03`, title: 'Holi Festival Holiday', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'School closed on account of Holi festival.', type: 'holiday' },
    { id: `base-03-10`, startDate: `${year}-03-10`, endDate: `${year}-03-24`, title: 'Annual Final Examinations', category: 'Exams', time: '08:30 AM – 12:30 PM', venue: 'Exam Halls', desc: 'Year-end annual term exams for all classes.', type: 'exam' },
    { id: `base-04-01`, startDate: `${year}-04-01`, endDate: `${year}-04-01`, title: 'New Academic Session Begins', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'All Classrooms', desc: 'Welcome back students! New session begins with orientation.', type: 'academic' },
    { id: `base-04-14`, startDate: `${year}-04-14`, endDate: `${year}-04-14`, title: 'Dr. B.R. Ambedkar Jayanti', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'National holiday in honor of Dr. B.R. Ambedkar.', type: 'holiday' },
    { id: `base-05-20`, startDate: `${year}-05-20`, endDate: `${year}-06-30`, title: 'Summer Vacation Break', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'Summer break commences for all grades.', type: 'holiday' },
    { id: `base-07-01`, startDate: `${year}-07-01`, endDate: `${year}-07-01`, title: 'School Reopens Post Summer', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'All Wings', desc: 'Regular classroom timetable resumes.', type: 'academic' },
    { id: `base-08-15`, startDate: `${year}-08-15`, endDate: `${year}-08-15`, title: 'Independence Day Celebrations', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'Parade Ground', desc: 'Flag hoisting ceremony, cultural dances and patriotic songs.', type: 'holiday' },
    { id: `base-09-05`, startDate: `${year}-09-05`, endDate: `${year}-09-05`, title: "Teachers' Day Special Assembly", category: 'Celebration', time: '09:00 AM – 01:00 PM', venue: 'School Auditorium', desc: 'Gratitude performances by student council.', type: 'event' },
    { id: `base-10-02`, startDate: `${year}-10-02`, endDate: `${year}-10-02`, title: 'Mahatma Gandhi Jayanti', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'National holiday paying tribute to the Father of the Nation.', type: 'holiday' },
    { id: `base-10-29`, startDate: `${year}-10-29`, endDate: `${year}-11-03`, title: 'Diwali & Autumn Festival Break', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'School closed for Diwali festival and Autumn vacation.', type: 'holiday' },
    { id: `base-11-14`, startDate: `${year}-11-14`, endDate: `${year}-11-14`, title: "Children's Day Carnival", category: 'Celebration', time: '09:00 AM – 01:30 PM', venue: 'School Lawns', desc: 'Games stalls, food carnival, magic show and fun activities.', type: 'event' },
    { id: `base-11-24`, startDate: `${year}-11-24`, endDate: `${year}-11-24`, title: 'Guru Nanak Jayanti Holiday', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'School closed in commemoration of Guru Nanak Jayanti.', type: 'holiday' },
    { id: `base-12-15`, startDate: `${year}-12-15`, endDate: `${year}-12-16`, title: 'Tarang 2026 - Cultural Fest', category: 'Celebration', time: '05:00 PM – 09:30 PM', venue: 'Open Air Amphitheatre', desc: 'Grand annual function with theatre, orchestra, and classical performances.', type: 'event' },
    { id: `base-12-25`, startDate: `${year}-12-25`, endDate: `${year}-12-31`, title: 'Christmas Day & Winter Break', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'Winter holiday break commences for all students.', type: 'holiday' }
  ];
};

export default function CalendarPage({ activeChild }) {
  const { currentLang } = useLanguage();

  const DAYS = currentLang === 'hi' ? DAYS_HI : DAYS_EN;
  const FULL_DAYS = currentLang === 'hi' ? FULL_DAYS_HI : FULL_DAYS_EN;
  const MONTHS = currentLang === 'hi' ? MONTHS_HI : MONTHS_EN;

  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Real Data Stores
  const [backendEvents, setBackendEvents] = useState([]);
  const [scheduledExams, setScheduledExams] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [studentAttendanceMap, setStudentAttendanceMap] = useState({});

  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();

  // Resolve Student ID for attendance lookup
  const resolveTargetStudent = useCallback(async () => {
    let resolved = activeChild || localStorage.getItem('active_child') || '';
    if (!resolved) {
      const u = authService.getCurrentUser();
      if (u?.role === 'Student') {
        resolved = u.studentId || u._id || u.id;
      } else if (u?.children && u.children.length > 0) {
        const first = u.children[0];
        resolved = typeof first === 'object' ? (first._id || first.id) : first;
      }
    }
    return resolved;
  }, [activeChild]);

  // Load real events, exams, live classes & attendance from backend
  const loadCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const studentId = await resolveTargetStudent();

      const [eventsRes, examsRes, schedulesRes, liveRes, attRes] = await Promise.all([
        parentService.getEvents({ year: y, month: m + 1 }).catch(() => ({ data: [] })),
        academicService.getExams().catch(() => ({ data: [] })),
        parentService.getExamSchedules().catch(() => ({ data: [] })),
        parentService.getLiveClasses().catch(() => ({ data: [] })),
        studentId ? parentService.getAttendance(studentId, { year: y, month: m + 1 }).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);

      if (eventsRes?.data && Array.isArray(eventsRes.data)) {
        setBackendEvents(eventsRes.data);
      }

      // Combine exam master & schedules
      const rawSchedules = Array.isArray(schedulesRes?.data) ? schedulesRes.data : [];
      const rawExams = Array.isArray(examsRes?.data) ? examsRes.data : [];
      const examItems = [];

      rawSchedules.forEach(s => {
        if (s.examDate) {
          examItems.push({
            id: `sch-${s._id}`,
            date: s.examDate.slice(0, 10),
            startDate: s.examDate.slice(0, 10),
            endDate: s.examDate.slice(0, 10),
            title: `${s.subject?.subjectName || s.subjectName || 'Subject'} Exam`,
            category: 'Exams',
            type: 'exam',
            time: s.startTime && s.endTime ? `${s.startTime} – ${s.endTime}` : '09:00 AM – 12:00 PM',
            venue: s.roomNo ? `Room ${s.roomNo}` : 'Examination Hall',
            desc: s.exam?.examName || 'Term Examination Assessment'
          });
        }
      });

      if (examItems.length === 0 && rawExams.length > 0) {
        rawExams.forEach(ex => {
          if (ex.startDate) {
            examItems.push({
              id: `ex-${ex._id}`,
              date: ex.startDate.slice(0, 10),
              startDate: ex.startDate.slice(0, 10),
              endDate: ex.endDate ? ex.endDate.slice(0, 10) : ex.startDate.slice(0, 10),
              title: ex.examName || 'School Examination',
              category: 'Exams',
              type: 'exam',
              time: '08:30 AM – 12:30 PM',
              venue: 'Main Exam Block',
              desc: ex.description || 'Session Examination'
            });
          }
        });
      }
      setScheduledExams(examItems);

      // Live classes
      if (liveRes?.data && Array.isArray(liveRes.data)) {
        const liveItems = [];
        liveRes.data.forEach(lc => {
          if (lc.startTime) {
            const d = new Date(lc.startTime).toISOString().slice(0, 10);
            liveItems.push({
              id: `lc-${lc._id}`,
              date: d,
              startDate: d,
              endDate: d,
              title: lc.title || 'Live Interactive Class',
              category: 'Academic',
              type: 'live',
              time: new Date(lc.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              venue: `${lc.provider || 'Zoom'} Room`,
              desc: lc.description || `Live Lecture with ${lc.teacherName || 'Faculty'}`
            });
          }
        });
        setLiveClasses(liveItems);
      }

      // Attendance map
      const attMap = {};
      if (attRes?.data && Array.isArray(attRes.data)) {
        attRes.data.forEach(rec => {
          if (rec.date) {
            const dKey = new Date(rec.date).toISOString().slice(0, 10);
            attMap[dKey] = rec.status;
          }
        });
      }
      setStudentAttendanceMap(attMap);

    } catch (err) {
      console.warn('Calendar sync error:', err);
    } finally {
      setLoading(false);
    }
  }, [resolveTargetStudent, y, m]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  // Combine baseline academic calendar with backend events, exams, and live classes
  const allEvents = useMemo(() => {
    const baseList = getAcademicCalendarForYear(y, currentLang);
    const map = {};

    // 1. Add baseline events
    baseList.forEach(e => {
      map[e.id || `${e.startDate}_${e.title}`] = e;
    });

    // 2. Add backend events from MongoDB (override baseline)
    backendEvents.forEach(be => {
      const start = be.startDate ? be.startDate.slice(0, 10) : '';
      const end = be.endDate ? be.endDate.slice(0, 10) : start;
      const evType = (be.eventType || '').toLowerCase();

      let cat = 'Academic';
      let type = 'academic';
      if (evType.includes('holiday')) { cat = 'Holiday'; type = 'holiday'; }
      else if (evType.includes('meeting') || evType.includes('ptm')) { cat = 'Meetings'; type = 'meeting'; }
      else if (evType.includes('exam')) { cat = 'Exams'; type = 'exam'; }
      else if (evType.includes('sport')) { cat = 'Sports'; type = 'sports'; }
      else { cat = 'Celebration'; type = 'event'; }

      const id = be._id || `be-${start}-${be.title}`;
      map[id] = {
        id,
        startDate: start,
        endDate: end,
        date: start,
        title: be.title,
        category: cat,
        type,
        time: be.time || '09:00 AM – 01:30 PM',
        venue: be.location || be.venue || (currentLang === 'hi' ? 'स्कूल कैंपस' : 'School Campus'),
        desc: be.description || (currentLang === 'hi' ? 'कैंपस में निर्धारित स्कूल गतिविधि।' : 'Official school event scheduled on campus.')
      };
    });

    // 3. Add scheduled exams
    scheduledExams.forEach(ex => {
      map[ex.id] = ex;
    });

    // 4. Add scheduled live classes
    liveClasses.forEach(lc => {
      map[lc.id] = lc;
    });

    return Object.values(map);
  }, [y, currentLang, backendEvents, scheduledExams, liveClasses]);

  // Month boundary calculations
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(y, m, 1).getDay(); // 0 = Sunday
  const prevMonthDays = new Date(y, m, 0).getDate();

  // Navigation Handlers
  const handlePrev = () => setCurrentDate(new Date(y, m - 1, 1));
  const handleNext = () => setCurrentDate(new Date(y, m + 1, 1));
  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(y, newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, m, 1));
  };

  // Helper to check if event spans across a date
  const getEventsForDay = useCallback((dayNum) => {
    const dStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return allEvents.filter(ev => {
      const start = ev.startDate || ev.date || '';
      const end = ev.endDate || ev.date || start;
      return dStr >= start && dStr <= end;
    });
  }, [allEvents, y, m]);

  // Selected date formatted string (YYYY-MM-DD)
  const selectedDateStr = selectedDate 
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  // Selected Day's Events
  const selectedDayEvents = useMemo(() => {
    return allEvents.filter(ev => {
      const start = ev.startDate || ev.date || '';
      const end = ev.endDate || ev.date || start;
      return selectedDateStr >= start && selectedDateStr <= end;
    });
  }, [allEvents, selectedDateStr]);

  // Selected Day's Attendance
  const selectedDayAttendance = studentAttendanceMap[selectedDateStr] || null;

  // Categories Filter Pills
  const CATEGORIES = [
    { key: 'All', label: currentLang === 'hi' ? 'सभी गतिविधियां' : 'All Activities', icon: CalendarDays },
    { key: 'Holiday', label: currentLang === 'hi' ? 'छुट्टियां व अवकाश' : 'Holidays & Vacations', icon: Flag },
    { key: 'Exams', label: currentLang === 'hi' ? 'परीक्षाएं' : 'Exams', icon: BookOpen },
    { key: 'Academic', label: currentLang === 'hi' ? 'शैक्षणिक व लाइव क्लास' : 'Academic & Live', icon: Award },
    { key: 'Sports', label: currentLang === 'hi' ? 'खेलकूद' : 'Sports', icon: Trophy },
    { key: 'Meetings', label: currentLang === 'hi' ? 'पीटीएम' : 'PTM', icon: Handshake },
  ];

  // Helper for color styles
  const getEventStyle = (type, category) => {
    const t = (type || category || '').toLowerCase();
    if (t.includes('holiday')) {
      return {
        dot: 'bg-rose-500',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        tag: currentLang === 'hi' ? 'अवकाश' : 'Holiday'
      };
    }
    if (t.includes('exam')) {
      return {
        dot: 'bg-purple-600',
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        tag: currentLang === 'hi' ? 'परीक्षा' : 'Exam'
      };
    }
    if (t.includes('live')) {
      return {
        dot: 'bg-emerald-600',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        tag: currentLang === 'hi' ? 'लाइव क्लास' : 'Live Class'
      };
    }
    if (t.includes('sport')) {
      return {
        dot: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        tag: currentLang === 'hi' ? 'खेलकूद' : 'Sports'
      };
    }
    if (t.includes('meeting') || t.includes('ptm')) {
      return {
        dot: 'bg-indigo-600',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        tag: currentLang === 'hi' ? 'पीटीएम' : 'PTM'
      };
    }
    return {
      dot: 'bg-blue-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      tag: currentLang === 'hi' ? 'स्कूल कार्यक्रम' : 'School Event'
    };
  };

  // Monthly stats
  const currentMonthPrefix = `${y}-${String(m + 1).padStart(2, '0')}`;
  const monthEventsList = allEvents.filter(ev => {
    const start = ev.startDate || ev.date || '';
    const end = ev.endDate || ev.date || start;
    return (start.startsWith(currentMonthPrefix) || end.startsWith(currentMonthPrefix));
  });

  const holidaysCount = monthEventsList.filter(e => e.type === 'holiday' || e.category === 'Holiday').length;
  const examsCount = monthEventsList.filter(e => e.type === 'exam' || e.category === 'Exams').length;
  const sportsMeetingsCount = monthEventsList.filter(e => e.type === 'sports' || e.type === 'meeting' || e.category === 'Sports' || e.category === 'Meetings').length;

  return (
    <div className="w-full max-w-full px-2 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 space-y-5 sm:space-y-6 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* ── SCREEN TITLE & QUICK ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-serif tracking-tight">
              {currentLang === 'hi' ? 'स्कूल शैक्षणिक कैलेंडर एवं कार्यक्रम सारणी' : 'School Academic Calendar & Schedule'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 text-[#2563EB] border border-blue-200">
              {currentLang === 'hi' ? 'सत्र' : 'Session'} {y}-{String(y + 1).slice(2)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {currentLang === 'hi' 
              ? 'अध्यापक द्वारा निर्धारित परीक्षाएं, लाइव क्लास, छुट्टियां, छात्र उपस्थिति एवं परिसर गतिविधियां' 
              : 'Live dates, teacher scheduled exams, live sessions, attendance, and campus events'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => loadCalendarData()}
            disabled={loading}
            title={currentLang === 'hi' ? 'डेटा रीफ्रेश करें' : 'Refresh Events from Server'}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
            <span>{currentLang === 'hi' ? 'रीफ्रेश' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleToday}
            className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'आज पर जाएं' : 'Go to Today'}</span>
          </button>
        </div>
      </div>

      {/* ── 4 STAT METRICS STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'hi' ? 'इस माह के कार्यक्रम' : 'Events This Month'}
            </p>
            <p className="text-lg font-black text-slate-900">{monthEventsList.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'hi' ? 'छुट्टियां व अवकाश' : 'Holidays & Breaks'}
            </p>
            <p className="text-lg font-black text-rose-600">{holidaysCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'hi' ? 'परीक्षा मूल्यांकन' : 'Exam Assessments'}
            </p>
            <p className="text-lg font-black text-purple-600">{examsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'hi' ? 'पीटीएम व खेलकूद' : 'Parent PTM & Sports'}
            </p>
            <p className="text-lg font-black text-indigo-600">{sportsMeetingsCount}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT: FULL INTERACTIVE MONTH CALENDAR (LG: 8 COLS) ── */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          
          {/* Blue Header with Month & Year Selectors */}
          <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-2xs">
                <CalendarIcon className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <select
                    value={m}
                    onChange={handleMonthChange}
                    className="bg-white/20 hover:bg-white/30 text-white font-serif font-black text-lg sm:text-xl rounded-xl px-2.5 py-0.5 border border-white/25 focus:outline-none cursor-pointer"
                  >
                    {MONTHS.map((mon, idx) => (
                      <option key={mon} value={idx} className="text-slate-900 font-sans font-bold">
                        {mon}
                      </option>
                    ))}
                  </select>

                  <select
                    value={y}
                    onChange={handleYearChange}
                    className="bg-white/20 hover:bg-white/30 text-white font-serif font-black text-lg sm:text-xl rounded-xl px-2.5 py-0.5 border border-white/25 focus:outline-none cursor-pointer"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(yr => (
                      <option key={yr} value={yr} className="text-slate-900 font-sans font-bold">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[10.5px] text-blue-100 font-bold uppercase tracking-wider mt-0.5">
                  {currentLang === 'hi' ? 'एसीएस स्मार्ट कैंपस • सीबीएसई संबद्ध' : 'ACS Smart Campus • CBSE Affiliated'}
                </p>
              </div>
            </div>

            {/* Prev / Today / Next */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={currentLang === 'hi' ? 'पिछला महीना' : 'Previous Month'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleToday}
                className="px-3.5 py-1.5 text-xs font-black bg-white text-[#1E3A8A] rounded-xl shadow-xs hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {currentLang === 'hi' ? 'आज' : 'Today'}
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={currentLang === 'hi' ? 'अगला महीना' : 'Next Month'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 7-Day Header Grid */}
          <div className="p-2 sm:p-5">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-bold text-[11px] sm:text-xs text-slate-400 mb-2">
              {DAYS.map((d) => (
                <div key={d} className={`py-1 ${(d === 'Sun' || d === 'रवि') ? 'text-rose-500 font-black' : ''}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days Calendar Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              
              {/* Trailing days from previous month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div 
                  key={`prev-${i}`} 
                  className="min-h-[72px] sm:min-h-[88px] lg:min-h-[96px] rounded-xl sm:rounded-2xl bg-slate-50/40 border border-slate-100/60 p-1.5 flex flex-col justify-between opacity-35 select-none overflow-hidden"
                >
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
                    {prevMonthDays - firstDay + i + 1}
                  </span>
                </div>
              ))}

              {/* Current Month Active Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayEvents = getEventsForDay(dayNum);
                const isSunday = (firstDay + i) % 7 === 0;

                // Today check
                const isToday = today.getDate() === dayNum && today.getMonth() === m && today.getFullYear() === y;

                // Selected check
                const isSelected = selectedDate && selectedDate.getDate() === dayNum && selectedDate.getMonth() === m && selectedDate.getFullYear() === y;

                // Attendance on this day
                const dayAtt = studentAttendanceMap[dateStr] || null;

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => {
                      setSelectedDate(new Date(y, m, dayNum));
                    }}
                    className={`min-h-[72px] sm:min-h-[88px] lg:min-h-[96px] rounded-xl sm:rounded-2xl border p-1 sm:p-1.5 flex flex-col justify-between transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/70 ring-2 ring-blue-500/50 shadow-sm'
                        : isToday
                        ? 'border-[#2563EB] bg-blue-50/30'
                        : isSunday
                        ? 'bg-rose-50/30 border-rose-100 hover:border-rose-200'
                        : 'bg-white border-slate-200/80 hover:border-blue-300'
                    }`}
                  >
                    {/* Top Row: Date Number and Badges */}
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isToday
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : isSunday
                          ? 'text-rose-600 bg-rose-100'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-800'
                      }`}>
                        {dayNum}
                      </span>

                      {/* Status / Today Pill */}
                      <div className="flex items-center gap-1">
                        {isToday && (
                          <span className="text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                            {currentLang === 'hi' ? 'आज' : 'Today'}
                          </span>
                        )}

                        {isSunday && !isToday && (
                          <span className="text-[8px] font-bold text-rose-500 uppercase">
                            {currentLang === 'hi' ? 'रविवार' : 'Sun'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Student Attendance Indicator (if present) */}
                    {dayAtt && (
                      <div className="my-0.5">
                        <span className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded inline-flex items-center gap-0.5 border ${
                          dayAtt.toLowerCase().includes('absent')
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${dayAtt.toLowerCase().includes('absent') ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                          {dayAtt.toLowerCase().includes('absent') ? (currentLang === 'hi' ? 'अनुपस्थित' : 'Absent') : (currentLang === 'hi' ? 'उपस्थित' : 'Present')}
                        </span>
                      </div>
                    )}

                    {/* Bottom: Event indicators */}
                    <div className="mt-auto w-full min-w-0 flex flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((ev, evIdx) => {
                        const style = getEventStyle(ev.type, ev.category);
                        return (
                          <div 
                            key={evIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventModal(ev);
                            }}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate leading-tight flex items-center gap-1 border ${style.badge}`}
                            title={ev.title}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                            <span className="truncate">{ev.title}</span>
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <span className="text-[8px] font-bold text-slate-400 pl-1">
                          +{dayEvents.length - 2} {currentLang === 'hi' ? 'और' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Trailing days for next month */}
              {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
                <div 
                  key={`next-${i}`} 
                  className="min-h-[72px] sm:min-h-[88px] lg:min-h-[96px] rounded-xl sm:rounded-2xl bg-slate-50/40 border border-slate-100/60 p-1.5 flex flex-col justify-between opacity-35 select-none overflow-hidden"
                >
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Color Legend Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-5 pt-3.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> {currentLang === 'hi' ? 'स्कूल कार्यक्रम' : 'School Event'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> {currentLang === 'hi' ? 'अवकाश / रविवार' : 'Holiday / Sunday'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> {currentLang === 'hi' ? 'परीक्षाएं' : 'Examinations'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {currentLang === 'hi' ? 'लाइव क्लास' : 'Live Class'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> {currentLang === 'hi' ? 'पीटीएम' : 'PTM Meeting'}
              </span>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: DAY SCHEDULE & FEED (LG: 4 COLS) ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. SELECTED DAY SCHEDULE CARD */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-black font-serif text-slate-900">
                  {currentLang === 'hi' ? 'दैनिक कार्यक्रम व गतिविधियां' : 'Day Schedule & Activity'}
                </h3>
              </div>
            </div>

            {/* Selected Date Header */}
            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                  {FULL_DAYS[selectedDate.getDay()]}
                </p>
                <p className="text-base font-black text-slate-900 font-serif">
                  {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </p>
              </div>

              {today.getDate() === selectedDate.getDate() && 
               today.getMonth() === selectedDate.getMonth() && 
               today.getFullYear() === selectedDate.getFullYear() && (
                <span className="px-2.5 py-1 rounded-full bg-[#10B981] text-white text-[10px] font-black shadow-2xs">
                  {currentLang === 'hi' ? 'आज ✅' : 'Today ✅'}
                </span>
              )}
            </div>

            {/* Student Attendance for selected day */}
            {selectedDayAttendance && (
              <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                selectedDayAttendance.toLowerCase().includes('absent')
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {currentLang === 'hi' ? 'छात्र उपस्थिति स्थिति:' : 'Student Attendance:'} <b>{selectedDayAttendance}</b>
                  </span>
                </div>
                <span className="text-[10px] font-semibold opacity-80">
                  {currentLang === 'hi' ? 'शिक्षक द्वारा प्रमाणित' : 'Teacher Verified'}
                </span>
              </div>
            )}

            {/* Selected Day's Events */}
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDayEvents.map((ev) => {
                  const style = getEventStyle(ev.type, ev.category);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventModal(ev)}
                      className={`p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}>
                          {style.tag}
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                        {ev.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {ev.desc}
                      </p>

                      <div className="flex items-center gap-1 text-[10.5px] text-slate-400 mt-2">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : selectedDate.getDay() === 0 ? (
              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                  <Flag className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h5 className="text-xs font-black text-rose-800 font-serif">
                  {currentLang === 'hi' ? 'रविवार साप्ताहिक अवकाश' : 'Sunday Weekly Holiday'}
                </h5>
                <p className="text-[11px] text-rose-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'विद्यालय परिसर बंद रहेगा। सभी शैक्षणिक गतिविधियां सोमवार को पुनः प्रारंभ होंगी।'
                    : 'School campus remains closed. Regular academic sessions resume on Monday.'}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <h5 className="text-xs font-black text-slate-800 font-serif">
                  {currentLang === 'hi' ? 'नियमित शैक्षणिक दिवस' : 'Regular Academic Day'}
                </h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'सामान्य समय सारणी कक्षाएं चल रही हैं (08:00 AM – 02:30 PM)। मानक उपस्थिति और स्कूल बस समय सारणी लागू है।'
                    : 'Normal timetable periods in session (08:00 AM – 02:30 PM). Standard attendance and school bus schedule apply.'}
                </p>
              </div>
            )}
          </div>

          {/* 2. CATEGORY FILTER PILLS */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black font-serif text-slate-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{currentLang === 'hi' ? 'गतिविधि प्रकार से फ़िल्टर करें' : 'Filter by Event Type'}</span>
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    <CatIcon className="w-3 h-3 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. MONTH EVENTS FEED */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black font-serif text-slate-900">
                {MONTHS[m]} {currentLang === 'hi' ? 'कैलेंडर सूची' : 'Calendar Feed'} ({monthEventsList.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {y} {currentLang === 'hi' ? 'समय सारणी' : 'Schedule'}
              </span>
            </div>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin">
              {monthEventsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-medium space-y-2">
                  <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>
                    {currentLang === 'hi'
                      ? `${MONTHS[m]} ${y} में कोई गतिविधि निर्धारित नहीं है।`
                      : `No activities scheduled for ${MONTHS[m]} ${y}.`}
                  </p>
                </div>
              ) : (
                monthEventsList.map((ev) => {
                  const style = getEventStyle(ev.type, ev.category);
                  const dObj = new Date(ev.startDate || ev.date);
                  const dayNum = isNaN(dObj.getDate()) ? '1' : dObj.getDate();
                  const monthName = MONTHS[m]?.slice(0, 3);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventModal(ev)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer shadow-2xs flex items-start gap-3 group"
                    >
                      {/* Date Badge */}
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex flex-col items-center justify-center shrink-0 font-serif leading-tight">
                        <span className="text-sm font-black">{dayNum}</span>
                        <span className="text-[9px] font-bold uppercase">{monthName}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}>
                            {style.tag}
                          </span>
                          <span className="text-[10.5px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ev.time}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                          {ev.title}
                        </h4>
                        
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {ev.desc}
                        </p>

                        <div className="flex items-center gap-1 text-[10.5px] text-slate-400 mt-1.5">
                          <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ── EVENT DETAIL MODAL ── */}
      {selectedEventModal && (
        <div 
          onClick={() => setSelectedEventModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  {getEventStyle(selectedEventModal.type, selectedEventModal.category).tag} • {currentLang === 'hi' ? 'आधिकारिक गतिविधि' : 'Official Activity'}
                </span>
                <h3 className="text-base font-black font-serif leading-tight mt-0.5">
                  {currentLang === 'hi' ? 'कार्यक्रम विवरण' : 'Academic Event Details'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <h4 className="text-base font-black text-slate-900 font-serif leading-snug">
                {selectedEventModal.title}
              </h4>

              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <CalendarIcon className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-bold text-slate-900">{selectedEventModal.date}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-medium text-slate-700">{selectedEventModal.time}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-medium text-slate-700">{selectedEventModal.venue}</span>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'hi' ? 'कार्यक्रम विवरण' : 'Event Overview'}
                </span>
                <p className="mt-1 leading-relaxed text-slate-600 font-medium">
                  {selectedEventModal.desc}
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {currentLang === 'hi' ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
