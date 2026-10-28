import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, 
  MapPin, RefreshCw, CheckCircle2, Award, Users, Info, X, 
  Megaphone, Sparkles, Filter, CalendarDays, Bell, Check,
  BookOpen, Trophy, Flag, Handshake, Heart, AlertCircle, ArrowRight
} from 'lucide-react';
import { parentService } from '../../api/parentService';
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

// Comprehensive annual academic & holiday calendar generator for any year
const getAcademicCalendarForYear = (year, lang = 'en') => {
  if (lang === 'hi') {
    return [
      // January
      { date: `${year}-01-01`, title: "नव वर्ष दिवस अवकाश", category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'नव वर्ष के उपलक्ष्य में विद्यालय बंद रहेगा।', type: 'holiday' },
      { date: `${year}-01-14`, title: 'मकर संक्रांति / पोंगल अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'मकर संक्रांति पर्व का अवकाश।', type: 'holiday' },
      { date: `${year}-01-26`, title: 'गणतंत्र दिवस ध्वजारोहण व परेड', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'मुख्य खेल मैदान', desc: 'देशभक्ति परेड, ध्वजारोहण समारोह एवं सांस्कृतिक प्रस्तुतियां।', type: 'holiday' },
      
      // February
      { date: `${year}-02-10`, title: 'वार्षिक इंटर-स्कूल रोबोटिक्स एवं एआई एक्सपो', category: 'Academic', time: '09:00 AM – 02:00 PM', venue: 'स्टेम इनोवेशन लैब्स', desc: 'जूनियर एवं सीनियर विंग द्वारा लाइव प्रोजेक्ट्स का प्रदर्शन।', type: 'academic' },
      { date: `${year}-02-14`, title: 'सरस्वती पूजा एवं बसंत पंचमी', category: 'Celebration', time: '09:30 AM – 11:30 AM', venue: 'केंद्रीय प्रांगण', desc: 'विद्यार्थियों के लिए विशेष सुबह की प्रार्थना सभा और आशीर्वाद।', type: 'event' },
      
      // March
      { date: `${year}-03-03`, title: 'होली महापर्व अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'होली महोत्सव के उपलक्ष्य में विद्यालय बंद रहेगा।', type: 'holiday' },
      { date: `${year}-03-10`, title: 'वार्षिक अंतिम परीक्षाएं प्रारंभ', category: 'Exams', time: '08:30 AM – 12:30 PM', venue: 'परीक्षा हॉल 1 से 8', desc: 'सभी कक्षाओं के लिए वर्ष-अंत की अंतिम परीक्षाएं।', type: 'exam' },
      { date: `${year}-03-28`, title: 'वार्षिक प्रगति पत्र वितरण व पीटीएम', category: 'Meetings', time: '08:30 AM – 01:00 PM', venue: 'संबंधित कक्षाएं', desc: 'अंतिम परीक्षा परिणाम पत्र वितरण एवं अगली कक्षा पदोन्नति चर्चा।', type: 'meeting' },

      // April
      { date: `${year}-04-01`, title: 'नवीन शैक्षणिक सत्र का शुभारंभ', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'सभी कक्षाएं', desc: 'छात्रों का स्वागत! नए सत्र का ओरिएंटेशन के साथ प्रारंभ।', type: 'academic' },
      { date: `${year}-04-14`, title: 'डॉ. बी.आर. अम्बेडकर जयंती अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'डॉ. बी.आर. अम्बेडकर जयंती पर राष्ट्रीय अवकाश।', type: 'holiday' },
      { date: `${year}-04-22`, title: 'विश्व पृथ्वी दिवस वृक्षारोपण अभियान', category: 'Academic', time: '09:00 AM – 11:30 AM', venue: 'स्कूल वानस्पतिक वाटिका', desc: 'पौधारोपण अभियान एवं पर्यावरण विज्ञान प्रदर्शनी।', type: 'academic' },

      // May
      { date: `${year}-05-08`, title: 'आवधिक मूल्यांकन 1 (यूनिट टेस्ट)', category: 'Exams', time: '08:30 AM – 11:00 AM', venue: 'कक्षाएं', desc: 'प्रथम आवधिक लिखित इकाई परीक्षाएं।', type: 'exam' },
      { date: `${year}-05-20`, title: 'ग्रीष्मकालीन अवकाश प्रारंभ', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'सभी कक्षाओं के लिए ग्रीष्मावकाश प्रारंभ।', type: 'holiday' },

      // June
      { date: `${year}-06-21`, title: 'अंतर्राष्ट्रीय योग दिवस लाइव सत्र', category: 'Sports', time: '07:00 AM – 08:30 AM', venue: 'स्कूल स्पोर्ट्स पैवेलियन', desc: 'सामूहिक योगाभ्यास व स्वास्थ्य कल्याण कार्यशाला।', type: 'sports' },

      // July
      { date: `${year}-07-01`, title: 'ग्रीष्मावकाश उपरांत विद्यालय पुनः प्रारंभ', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'सभी विंग्स', desc: 'नियमित कक्षा समय सारणी पुनः शुरू।', type: 'academic' },
      { date: `${year}-07-18`, title: 'छात्र परिषद अलंकरण समारोह', category: 'Celebration', time: '10:00 AM – 12:30 PM', venue: 'मुख्य सभागार', desc: 'हेड बॉय, हेड गर्ल और हाउस कप्तानों का बैज अलंकरण।', type: 'event' },

      // August
      { date: `${year}-08-04`, title: 'इंटर-स्कूल विज्ञान एवं गणित ओलंपियाड', category: 'Academic', time: '09:00 AM – 01:30 PM', venue: 'विज्ञान विंग', desc: 'कक्षा 6 से 12 तक के छात्रों के लिए वार्षिक प्रतियोगिता।', type: 'academic' },
      { date: `${year}-08-15`, title: 'स्वतंत्रता दिवस समारोह', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'परेड ग्राउंड', desc: 'ध्वजारोहण, सांस्कृतिक प्रस्तुतियां एवं देशभक्ति गीत।', type: 'holiday' },
      { date: `${year}-08-28`, title: 'रक्षाबंधन पर्व अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'रक्षाबंधन पर्व के अवसर पर स्कूल अवकाश।', type: 'holiday' },

      // September
      { date: `${year}-09-05`, title: "शिक्षक दिवस विशेष समारोह", category: 'Celebration', time: '09:00 AM – 01:00 PM', venue: 'स्कूल सभागार', desc: 'शिक्षकों के सम्मान में विद्यार्थियों द्वारा विशेष प्रस्तुति।', type: 'event' },
      { date: `${year}-09-14`, title: 'हिन्दी दिवस साहित्य सम्मेलन', category: 'Academic', time: '10:00 AM – 12:30 PM', venue: 'सेमिनार हॉल', desc: 'काव्य पाठ, वाद-विवाद एवं रचनात्मक हिन्दी लेखन।', type: 'academic' },
      { date: `${year}-09-22`, title: 'अर्धवार्षिक परीक्षाएं प्रारंभ', category: 'Exams', time: '08:30 AM – 12:00 PM', venue: 'परीक्षा केंद्र', desc: 'सत्र की प्रथम अर्धवार्षिक लिखित परीक्षाएं।', type: 'exam' },

      // October
      { date: `${year}-10-02`, title: 'महात्मा गांधी जयंती अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'राष्ट्रपिता महात्मा गांधी जयंती पर राष्ट्रीय अवकाश।', type: 'holiday' },
      { date: `${year}-10-18`, title: 'सत्र 1 अभिभावक-शिक्षक संवाद (पीटीएम)', category: 'Meetings', time: '08:30 AM – 01:00 PM', venue: 'संबंधित कक्षाएं', desc: 'शैक्षणिक प्रगति, अनुशासन और परीक्षा परिणाम पर परिचर्चा।', type: 'meeting' },
      { date: `${year}-10-22`, title: 'इंटर-स्कूल विज्ञान व रोबोटिक्स ओलंपियाड 2026', category: 'Academic', time: '09:00 AM – 02:00 PM', venue: 'मुख्य विज्ञान सभागार', desc: 'राज्य स्तरीय विज्ञान प्रदर्शनी एवं नवाचार प्रदर्शन।', type: 'academic' },
      { date: `${year}-10-29`, title: 'दीपावली एवं शरदकालीन अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'दीपावली पर्व और शरद ऋतु अवकाश।', type: 'holiday' },
      { date: `${year}-10-30`, title: 'वार्षिक खेलकूद एवं एथलेटिक्स मीट - फाइनल', category: 'Sports', time: '08:30 AM – 02:30 PM', venue: 'एथलेटिक ग्राउंड', desc: 'दौड़, ऊंची कूद, रिले और हाउस चैम्पियनशिप ट्रॉफी वितरण।', type: 'sports' },

      // November
      { date: `${year}-11-14`, title: "बाल दिवस मेला एवं उत्सव", category: 'Celebration', time: '09:00 AM – 01:30 PM', venue: 'स्कूल मैदान', desc: 'खेल स्टॉल, फ़ूड कार्निवल, जादू शो और मनोरंजक गतिविधियां।', type: 'event' },
      { date: `${year}-11-24`, title: 'गुरु नानक जयंती अवकाश', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'गुरु नानक जयंती के पावन अवसर पर विद्यालय अवकाश।', type: 'holiday' },

      // December
      { date: `${year}-12-15`, title: 'तरंग 2026 - वार्षिक सांस्कृतिक महोत्सव', category: 'Celebration', time: '05:00 PM – 09:30 PM', venue: 'ओपन एयर थिएटर', desc: 'नाटक, आर्केस्ट्रा और शास्त्रीय नृत्य का भव्य वार्षिक उत्सव।', type: 'event' },
      { date: `${year}-12-25`, title: 'क्रिसमस डे एवं शीतकालीन अवकाश प्रारंभ', category: 'Holiday', time: 'पूरे दिन', venue: 'परिसर बंद', desc: 'सभी विद्यार्थियों के लिए शीतकालीन अवकाश प्रारंभ।', type: 'holiday' },
    ];
  }

  return [
    // January
    { date: `${year}-01-01`, title: "New Year's Day Celebration", category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'School closed for New Year Holiday.', type: 'holiday' },
    { date: `${year}-01-14`, title: 'Makar Sankranti / Pongal Break', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'Harvest festival holiday.', type: 'holiday' },
    { date: `${year}-01-26`, title: 'Republic Day Flag Hoisting & Parade', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'Main School Grounds', desc: 'Patriotic parade, flag hoisting ceremony and cultural dances.', type: 'holiday' },
    
    // February
    { date: `${year}-02-10`, title: 'Annual Inter-School Robotics & AI Expo', category: 'Academic', time: '09:00 AM – 02:00 PM', venue: 'STEM Innovation Labs', desc: 'Project demonstrations by junior and senior wings.', type: 'academic' },
    { date: `${year}-02-14`, title: 'Saraswati Puja & Vasant Panchami', category: 'Celebration', time: '09:30 AM – 11:30 AM', venue: 'Central Courtyard', desc: 'Special morning assembly and blessings for students.', type: 'event' },
    
    // March
    { date: `${year}-03-03`, title: 'Holi / Festival of Colors Holiday', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'School closed on account of Holi festival.', type: 'holiday' },
    { date: `${year}-03-10`, title: 'Annual Final Examinations Begin', category: 'Exams', time: '08:30 AM – 12:30 PM', venue: 'Exam Halls 1 to 8', desc: 'Year-end annual term exams for all classes.', type: 'exam' },
    { date: `${year}-03-28`, title: 'Annual Report Card Distribution & PTM', category: 'Meetings', time: '08:30 AM – 01:00 PM', venue: 'Respective Classrooms', desc: 'Final academic report cards and promotion discussions.', type: 'meeting' },

    // April
    { date: `${year}-04-01`, title: 'Commencement of New Academic Session', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'All Classrooms', desc: 'Welcome back students! New session begins with orientation.', type: 'academic' },
    { date: `${year}-04-14`, title: 'Dr. B.R. Ambedkar Jayanti Holiday', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'National holiday in honor of Dr. B.R. Ambedkar.', type: 'holiday' },
    { date: `${year}-04-22`, title: 'World Earth Day Green Drive', category: 'Academic', time: '09:00 AM – 11:30 AM', venue: 'School Botanical Garden', desc: 'Tree planting drive and environmental science fair.', type: 'academic' },

    // May
    { date: `${year}-05-08`, title: 'Periodic Assessment 1 (Unit Tests)', category: 'Exams', time: '08:30 AM – 11:00 AM', venue: 'Classrooms', desc: 'First periodic written unit tests.', type: 'exam' },
    { date: `${year}-05-20`, title: 'Summer Vacation Begins', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'Summer break commences for all grades.', type: 'holiday' },

    // June
    { date: `${year}-06-21`, title: 'International Yoga Day Live Session', category: 'Sports', time: '07:00 AM – 08:30 AM', venue: 'School Sports Pavilion', desc: 'Special mass yoga drill and wellness workshop.', type: 'sports' },

    // July
    { date: `${year}-07-01`, title: 'School Reopens After Summer Vacation', category: 'Academic', time: '08:00 AM – 02:00 PM', venue: 'All Wings', desc: 'Regular classroom timetable resumes.', type: 'academic' },
    { date: `${year}-07-18`, title: 'Student Council Investiture Ceremony', category: 'Celebration', time: '10:00 AM – 12:30 PM', venue: 'Main Auditorium', desc: 'Badging ceremony for Head Boy, Head Girl, and House Captains.', type: 'event' },

    // August
    { date: `${year}-08-04`, title: 'Inter-School Science & Math Olympiad', category: 'Academic', time: '09:00 AM – 01:30 PM', venue: 'Science Wing', desc: 'Annual STEM competition for classes 6th to 12th.', type: 'academic' },
    { date: `${year}-08-15`, title: 'Independence Day Celebrations', category: 'Holiday', time: '08:00 AM – 10:30 AM', venue: 'Parade Ground', desc: 'Flag hoisting ceremony, cultural dances and patriotic songs.', type: 'holiday' },
    { date: `${year}-08-28`, title: 'Raksha Bandhan Observance', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'School holiday for Raksha Bandhan.', type: 'holiday' },

    // September
    { date: `${year}-09-05`, title: "Teachers' Day Special Celebration", category: 'Celebration', time: '09:00 AM – 01:00 PM', venue: 'School Auditorium', desc: 'Students organize special gratitude performance for faculty.', type: 'event' },
    { date: `${year}-09-14`, title: 'Hindi Diwas Sahitya Sammelan', category: 'Academic', time: '10:00 AM – 12:30 PM', venue: 'Seminar Hall', desc: 'Poetry recitation, debate and creative writing in Hindi.', type: 'academic' },
    { date: `${year}-09-22`, title: 'Mid-Term Half-Yearly Exams Begin', category: 'Exams', time: '08:30 AM – 12:00 PM', venue: 'Examination Centers', desc: 'Half-yearly comprehensive assessment.', type: 'exam' },

    // October (Current Month)
    { date: `${year}-10-02`, title: 'Mahatma Gandhi Jayanti Holiday', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'National holiday paying tribute to the Father of the Nation.', type: 'holiday' },
    { date: `${year}-10-18`, title: 'Term 1 Parent-Teacher Interaction (PTM)', category: 'Meetings', time: '08:30 AM – 01:00 PM', venue: 'Respective Classrooms', desc: 'Comprehensive review of academic progress, behavior, and exam results.', type: 'meeting' },
    { date: `${year}-10-22`, title: 'Inter-School Science & Robotics Olympiad 2026', category: 'Academic', time: '09:00 AM – 02:00 PM', venue: 'Main Science Auditorium', desc: 'State-level science exposition and innovation displays.', type: 'academic' },
    { date: `${year}-10-29`, title: 'Diwali & Autumn Festival Break', category: 'Holiday', time: 'All Day', venue: 'Campus-Wide', desc: 'School closed for Diwali festival and Autumn vacation.', type: 'holiday' },
    { date: `${year}-10-30`, title: 'Annual Sports & Athletics Meet - Finals', category: 'Sports', time: '08:30 AM – 02:30 PM', venue: 'Athletic Ground & Pavilion', desc: 'Sprint races, high jump, relay, and house championship trophy ceremony.', type: 'sports' },

    // November
    { date: `${year}-11-14`, title: "Children's Day Carnival & Fair", category: 'Celebration', time: '09:00 AM – 01:30 PM', venue: 'School Green Lawns', desc: 'Games stalls, food carnival, magic show and fun activities.', type: 'event' },
    { date: `${year}-11-24`, title: 'Guru Nanak Jayanti Holiday', category: 'Holiday', time: 'All Day', venue: 'Campus-Wide', desc: 'School closed in commemoration of Guru Nanak Jayanti.', type: 'holiday' },

    // December
    { date: `${year}-12-15`, title: 'Tarang 2026 - Annual Cultural & Music Fest', category: 'Celebration', time: '05:00 PM – 09:30 PM', venue: 'Open Air Amphitheatre', desc: 'Grand annual function with theatre, orchestra, and classical performances.', type: 'event' },
    { date: `${year}-12-25`, title: 'Christmas Day & Winter Break Begins', category: 'Holiday', time: 'All Day', venue: 'Campus Closed', desc: 'Winter holiday break commences for all students.', type: 'holiday' },
  ];
};

export default function CalendarPage({ activeChild }) {
  const { currentLang } = useLanguage();

  const DAYS = currentLang === 'hi' ? DAYS_HI : DAYS_EN;
  const FULL_DAYS = currentLang === 'hi' ? FULL_DAYS_HI : FULL_DAYS_EN;
  const MONTHS = currentLang === 'hi' ? MONTHS_HI : MONTHS_EN;

  // Real current date initialization
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendEvents, setBackendEvents] = useState([]);
  const [viewFilter, setViewFilter] = useState('all-month'); // 'all-month' | 'selected-day'

  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();

  // Load real events from Backend API
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await parentService.getEvents({
        year: y,
        month: m + 1
      });
      if (res && res.data && Array.isArray(res.data)) {
        setBackendEvents(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch events from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [y, m]);

  // Combine generated master calendar with live backend events
  const yearEvents = getAcademicCalendarForYear(y, currentLang);
  
  // Format backend events
  const formattedBackendEvents = backendEvents.map(be => {
    const dStr = be.startDate ? be.startDate.slice(0, 10) : '';
    let cat = 'Academic';
    let type = 'academic';
    const evType = (be.eventType || '').toLowerCase();
    if (evType.includes('holiday')) { cat = 'Holiday'; type = 'holiday'; }
    else if (evType.includes('meeting') || evType.includes('ptm')) { cat = 'Meetings'; type = 'meeting'; }
    else if (evType.includes('exam')) { cat = 'Exams'; type = 'exam'; }
    else if (evType.includes('sport')) { cat = 'Sports'; type = 'sports'; }
    else if (evType.includes('seminar') || evType.includes('academic')) { cat = 'Academic'; type = 'academic'; }
    else { cat = 'Celebration'; type = 'event'; }

    return {
      id: be._id || be.id || `be-${dStr}-${be.title}`,
      date: dStr,
      title: be.title,
      category: cat,
      time: be.time || (currentLang === 'hi' ? '09:00 AM – 01:30 PM' : '09:00 AM – 01:30 PM'),
      venue: be.location || be.venue || (currentLang === 'hi' ? 'स्कूल कैंपस' : 'School Campus'),
      desc: be.description || (currentLang === 'hi' ? 'कैंपस में निर्धारित आधिकारिक स्कूल गतिविधि।' : 'Official school event scheduled on campus.'),
      type: type,
      isBackend: true
    };
  });

  // Category label helper in Hindi
  const getCategoryLabel = (cat) => {
    if (currentLang !== 'hi') return cat;
    switch (cat) {
      case 'Holiday': return 'अवकाश / छुट्टी';
      case 'Exams': return 'परीक्षा';
      case 'Academic': return 'शैक्षणिक गतिविधि';
      case 'Sports': return 'खेलकूद प्रतियोगिता';
      case 'Meetings': return 'अभिभावक बैठक (पीटीएम)';
      case 'Celebration': return 'समारोह व उत्सव';
      default: return cat;
    }
  };

  // Merge and deduplicate by date + type, giving priority to language-aware yearEvents
  const allEventsMap = {};
  formattedBackendEvents.forEach(e => { allEventsMap[`${e.date}_${e.type || e.category}`] = e; });
  yearEvents.forEach(e => { allEventsMap[`${e.date}_${e.type || e.category}`] = e; });
  const allEvents = Object.values(allEventsMap);

  // Month Math
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(y, m, 1).getDay(); // 0 is Sunday
  const prevMonthDays = new Date(y, m, 0).getDate();

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate(new Date(y, m - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(y, m + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
    setViewFilter('all-month');
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(y, newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, m, 1));
  };

  // Categories
  const CATEGORIES = [
    { key: 'All', label: currentLang === 'hi' ? 'सभी गतिविधियां' : 'All Activities', icon: CalendarDays },
    { key: 'Holiday', label: currentLang === 'hi' ? 'छुट्टियां व अवकाश' : 'Holidays & Vacations', icon: Flag },
    { key: 'Exams', label: currentLang === 'hi' ? 'परीक्षाएं व टेस्ट' : 'Exams & Tests', icon: BookOpen },
    { key: 'Academic', label: currentLang === 'hi' ? 'शैक्षणिक व विज्ञान' : 'Academic & Science', icon: Award },
    { key: 'Sports', label: currentLang === 'hi' ? 'खेलकूद व एथलेटिक्स' : 'Sports & Athletics', icon: Trophy },
    { key: 'Meetings', label: currentLang === 'hi' ? 'पीटीएम व बैठकें' : 'PTM & Conferences', icon: Handshake },
  ];

  // Events occurring in current month
  const currentMonthStr = `${y}-${String(m + 1).padStart(2, '0')}`;
  const monthEvents = allEvents.filter(ev => ev.date.startsWith(currentMonthStr));

  // Selected date formatted string (YYYY-MM-DD)
  const selectedDateStr = selectedDate 
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  // Events filtered for display list
  const filteredEvents = allEvents.filter(ev => {
    // If viewing single selected day
    if (viewFilter === 'selected-day') {
      if (ev.date !== selectedDateStr) return false;
    } else {
      // Must belong to current month
      if (!ev.date.startsWith(currentMonthStr)) return false;
    }

    // Category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Holiday') return ev.category === 'Holiday' || ev.type === 'holiday';
      if (selectedCategory === 'Exams') return ev.category === 'Exams' || ev.type === 'exam';
      if (selectedCategory === 'Academic') return ev.category === 'Academic' || ev.type === 'academic';
      if (selectedCategory === 'Sports') return ev.category === 'Sports' || ev.type === 'sports';
      if (selectedCategory === 'Meetings') return ev.category === 'Meetings' || ev.type === 'meeting';
    }

    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));

  // Events for selected day
  const selectedDayEvents = allEvents.filter(ev => ev.date === selectedDateStr);

  // Helper for color styles
  const getEventStyle = (type, category) => {
    const t = (type || category || '').toLowerCase();
    if (t.includes('holiday')) {
      return {
        dot: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        card: 'border-l-4 border-l-rose-500',
        tag: currentLang === 'hi' ? 'अवकाश' : 'Holiday'
      };
    }
    if (t.includes('exam')) {
      return {
        dot: 'bg-purple-600',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        card: 'border-l-4 border-l-purple-600',
        tag: currentLang === 'hi' ? 'परीक्षा' : 'Examination'
      };
    }
    if (t.includes('sport')) {
      return {
        dot: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        card: 'border-l-4 border-l-amber-500',
        tag: currentLang === 'hi' ? 'खेलकूद' : 'Sports Event'
      };
    }
    if (t.includes('meeting') || t.includes('ptm')) {
      return {
        dot: 'bg-indigo-600',
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        card: 'border-l-4 border-l-indigo-600',
        tag: currentLang === 'hi' ? 'पीटीएम बैठक' : 'PTM Meeting'
      };
    }
    if (t.includes('academic') || t.includes('seminar')) {
      return {
        dot: 'bg-emerald-600',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        card: 'border-l-4 border-l-emerald-600',
        tag: currentLang === 'hi' ? 'शैक्षणिक प्रदर्शनी' : 'Academic Expo'
      };
    }
    return {
      dot: 'bg-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      card: 'border-l-4 border-l-blue-600',
      tag: currentLang === 'hi' ? 'स्कूल कार्यक्रम' : 'School Event'
    };
  };

  // Monthly stats
  const holidaysCount = monthEvents.filter(e => e.type === 'holiday' || e.category === 'Holiday').length;
  const examsCount = monthEvents.filter(e => e.type === 'exam' || e.category === 'Exams').length;
  const sportsCount = monthEvents.filter(e => e.type === 'sports' || e.category === 'Sports').length;
  const meetingsCount = monthEvents.filter(e => e.type === 'meeting' || e.category === 'Meetings').length;

  return (
    <div className="w-full max-w-full px-2 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 space-y-5 sm:space-y-6 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* ── SCREEN TITLE & QUICK ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
              {currentLang === 'hi' ? 'स्कूल शैक्षणिक कैलेंडर एवं कार्यक्रम सारणी' : 'School Academic Calendar & Schedule'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 text-[#2563EB] border border-blue-200">
              {currentLang === 'hi' ? 'सत्र' : 'Session'} {y}-{String(y + 1).slice(2)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {currentLang === 'hi' ? 'लाइव तिथियां, परीक्षाएं, शैक्षणिक सत्र, छुट्टियां और कैंपस कार्यक्रम' : 'Live dates, examinations, term schedules, holidays, and campus events'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => loadEvents()}
            title={currentLang === 'hi' ? 'सर्वर से कार्यक्रम रिफ्रेश करें' : 'Refresh Events from Server'}
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
            <span className="hidden sm:inline">{currentLang === 'hi' ? 'रिफ्रेश' : 'Refresh'}</span>
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

      {/* ── 4 STAT METRICS STRIP (FULL SCREEN WIDTH) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'hi' ? 'इस माह के कार्यक्रम' : 'Events This Month'}
            </p>
            <p className="text-lg font-black text-slate-900">{monthEvents.length}</p>
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
            <p className="text-lg font-black text-indigo-600">{meetingsCount + sportsCount}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN FULL-SCREEN EXPANSIVE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT: FULL INTERACTIVE MONTH CALENDAR (LG: 7 COLS / XL: 8 COLS) ── */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          
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
                    className="bg-white/20 hover:bg-white/30 text-white font-serif font-black text-lg sm:text-xl rounded-xl px-2 py-0.5 border border-white/25 focus:outline-none cursor-pointer"
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
                    className="bg-white/20 hover:bg-white/30 text-white font-serif font-black text-lg sm:text-xl rounded-xl px-2 py-0.5 border border-white/25 focus:outline-none cursor-pointer"
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
                  className="h-14 sm:h-16 lg:h-20 rounded-xl sm:rounded-2xl bg-slate-50/40 border border-slate-100/60 p-1 sm:p-2 flex flex-col justify-between opacity-35 select-none overflow-hidden"
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
                const dayEvents = allEvents.filter(e => e.date === dateStr);
                const isSunday = (firstDay + i) % 7 === 0;

                // Today check
                const isToday = today.getDate() === dayNum && today.getMonth() === m && today.getFullYear() === y;

                // Selected check
                const isSelected = selectedDate && selectedDate.getDate() === dayNum && selectedDate.getMonth() === m && selectedDate.getFullYear() === y;

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => {
                      setSelectedDate(new Date(y, m, dayNum));
                      setViewFilter('selected-day');
                    }}
                    className={`h-14 sm:h-16 lg:h-20 rounded-xl sm:rounded-2xl border p-1 sm:p-2 flex flex-col justify-between relative transition-all cursor-pointer group overflow-hidden ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-400/50 scale-[1.02] z-10'
                        : isToday
                        ? 'bg-blue-50/90 border-[#2563EB] text-[#1E3A8A] font-black shadow-2xs'
                        : isSunday
                        ? 'bg-rose-50/40 border-rose-100 text-rose-600 hover:border-rose-300'
                        : dayEvents.length > 0
                        ? 'bg-slate-50 border-blue-200 hover:border-blue-400 text-slate-800'
                        : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {/* Top Row: Date Number and Today Tag */}
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-all ${
                        isSelected
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : isToday
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : isSunday
                          ? 'text-rose-600'
                          : 'text-slate-800'
                      }`}>
                        {dayNum}
                      </span>

                      {isToday && (
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Desktop text pill */}
                          <span className={`hidden sm:inline-flex items-center text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded-full shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {currentLang === 'hi' ? 'आज' : 'Today'}
                          </span>
                          {/* Mobile compact dot */}
                          <span className={`sm:hidden w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-blue-600'}`} />
                        </div>
                      )}
                    </div>

                    {/* Bottom: Event indicators */}
                    {dayEvents.length > 0 && (
                      <div className="mt-auto w-full min-w-0 pt-0.5">
                        {/* Mobile: Sleek colored dot indicators row (Max 3 dots) */}
                        <div className="flex sm:hidden items-center justify-center gap-1 w-full overflow-hidden py-0.5">
                          {dayEvents.slice(0, 3).map((ev, evIdx) => {
                            const style = getEventStyle(ev.type, ev.category);
                            return (
                              <span 
                                key={evIdx}
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isSelected ? 'bg-white' : style.dot
                                }`} 
                                title={ev.title}
                              />
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <span className={`text-[7.5px] font-extrabold leading-none ${
                              isSelected ? 'text-white' : 'text-slate-500'
                            }`}>
                              +
                            </span>
                          )}
                        </div>

                        {/* Desktop: Event badge pills with truncated title (Max 2) */}
                        <div className="hidden sm:flex flex-col gap-0.5 w-full overflow-hidden">
                          {dayEvents.slice(0, 2).map((ev, evIdx) => {
                            const style = getEventStyle(ev.type, ev.category);
                            return (
                              <div 
                                key={evIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEventModal(ev);
                                }}
                                className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded truncate leading-tight flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : style.badge
                                }`}
                                title={ev.title}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : style.dot}`} />
                                <span className="truncate">{ev.title}</span>
                              </div>
                            );
                          })}

                          {dayEvents.length > 2 && (
                            <span className={`text-[8px] font-bold text-center leading-none ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                              +{dayEvents.length - 2} {currentLang === 'hi' ? 'और' : 'more'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Trailing days for next month to complete row */}
              {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
                <div 
                  key={`next-${i}`} 
                  className="h-14 sm:h-16 lg:h-20 rounded-xl sm:rounded-2xl bg-slate-50/40 border border-slate-100/60 p-1 sm:p-2 flex flex-col justify-between opacity-35 select-none overflow-hidden"
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
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> {currentLang === 'hi' ? 'राष्ट्रीय अवकाश / रविवार' : 'National Holiday / Sunday'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> {currentLang === 'hi' ? 'परीक्षाएं' : 'Examinations'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {currentLang === 'hi' ? 'शैक्षणिक व ओलंपियाड' : 'Academic & Olympiad'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {currentLang === 'hi' ? 'खेलकूद प्रतियोगिता' : 'Sports Tournament'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> {currentLang === 'hi' ? 'पीटीएम बैठक' : 'PTM Meeting'}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: SELECTED DAY DETAILS & EVENTS FEED (LG: 5 COLS / XL: 4 COLS) ── */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          
          {/* Selected Date Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-black font-serif text-slate-900">
                  {currentLang === 'hi' ? 'दैनिक कार्यक्रम व गतिविधियां' : 'Day Schedule & Activity'}
                </h3>
              </div>
              
              <button
                onClick={() => setViewFilter(viewFilter === 'all-month' ? 'selected-day' : 'all-month')}
                className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                {viewFilter === 'selected-day'
                  ? (currentLang === 'hi' ? 'पूरा महीना देखें' : 'Show All Month')
                  : (currentLang === 'hi' ? 'केवल यह दिन देखें' : 'Focus Day Only')}
              </button>
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

            {/* Selected Day's Events or Normal Day Notice */}
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDayEvents.map((ev) => {
                  const style = getEventStyle(ev.type, ev.category);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventModal(ev)}
                      className={`p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs ${style.card}`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}>
                          {getCategoryLabel(ev.category)}
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

          {/* ── CATEGORY FILTER PILLS ── */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black font-serif text-slate-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{currentLang === 'hi' ? 'गतिविधि प्रकार से फ़िल्टर करें' : 'Filter by Event Type'}</span>
              </h4>
              <span className="text-[10.5px] font-bold text-slate-400">
                {filteredEvents.length} {currentLang === 'hi' ? 'कार्यक्रम' : 'items'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setViewFilter('all-month');
                    }}
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

          {/* ── EVENTS FEED LIST (FOR THIS MONTH) ── */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black font-serif text-slate-900">
                {MONTHS[m]} {currentLang === 'hi' ? 'कैलेंडर सूची' : 'Calendar Feed'} ({filteredEvents.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {y} {currentLang === 'hi' ? 'समय सारणी' : 'Schedule'}
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-medium space-y-2">
                  <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>
                    {currentLang === 'hi'
                      ? `${MONTHS[m]} ${y} में इस फ़िल्टर के लिए कोई गतिविधि निर्धारित नहीं है।`
                      : `No activities scheduled for this filter in ${MONTHS[m]} ${y}.`}
                  </p>
                </div>
              ) : (
                filteredEvents.map((ev) => {
                  const style = getEventStyle(ev.type, ev.category);
                  const evDate = new Date(ev.date);
                  const dayNum = evDate.getDate();
                  const monthName = MONTHS[evDate.getMonth()]?.slice(0, 3);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventModal(ev)}
                      className={`p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer shadow-2xs flex items-start gap-3 group ${style.card}`}
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
                            {getCategoryLabel(ev.category)}
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

                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 mt-3" />
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
                  {getCategoryLabel(selectedEventModal.category)} • {currentLang === 'hi' ? 'आधिकारिक गतिविधि' : 'Official Activity'}
                </span>
                <h3 className="text-base font-black font-serif leading-tight mt-0.5">
                  {currentLang === 'hi' ? 'शैक्षणिक कार्यक्रम विवरण' : 'Academic Event Details'}
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
