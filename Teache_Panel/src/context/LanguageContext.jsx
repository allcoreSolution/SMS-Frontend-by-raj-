import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import Swal from 'sweetalert2';

const LanguageContext = createContext();

export const supportedLanguages = [
  { code: 'en', name: 'English', native: 'English', region: 'Global' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'West Bengal' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Andhra / Telangana' },
  { code: 'ur', name: 'Urdu', native: 'اُردُو', region: 'South Asia' },
  { code: 'ar', name: 'Arabic', native: 'العربية', region: 'Middle East' },
  { code: 'es', name: 'Spanish', native: 'Español', region: 'Europe / Americas' },
  { code: 'fr', name: 'French', native: 'Français', region: 'Europe' },
  { code: 'de', name: 'German', native: 'Deutsch', region: 'Europe' }
];

export const translations = {
  English: {
    searchPlaceholder: "Search students, exams, modules...",
    commandCenter: "Command Center",
    session: "Session",
    language: "Language",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    noNotifications: "No new notifications",
    viewAll: "View All",
    quickActions: "Quick Actions",
    addStudent: "Add Student",
    enterMarks: "Enter Marks",
    applyLeave: "Apply Leave",
    createEvent: "Create Event",
    myProfile: "My Profile",
    settings: "Settings",
    signOut: "Sign out",
    appsCenter: "Apps Center",
    themePreview: "Preview",
    searchHint: "Type at least 2 characters to search anything in the ERP.",
    searchResults: "Search Results",
    noResultsFound: "No matching modules or students found",
    studyManagement: "Study Management",
    documents: "Documents",
    communication: "Communication",
    account: "Account",
    dashboard: "Dashboard",
    classwork: "Classwork & Logbook",
    assignments: "Homework & Assignments",
    certificates: "Certificates & Documents",
    ptm: "PTM Meetings",
    lessonPlanner: "Lesson Planner",
    osm: "OSM Module",
    assessment: "Assessment",
    leadManagement: "Lead Management",
    surveys: "Surveys & Feedback",
    messages: "Messages",
    hpc: "Holistic Progress Card",
    login: "Login / Switch Account",
    logout: "Logout",
    langChangedToast: "Language changed successfully!"
  },
  Hindi: {
    searchPlaceholder: "विद्यार्थी, परीक्षा, मॉड्यूल खोजें...",
    commandCenter: "कमांड सेंटर",
    session: "सत्र",
    language: "भाषा",
    notifications: "सूचनाएं",
    markAllRead: "सभी पढ़े गए चिह्नित करें",
    noNotifications: "कोई नई सूचना नहीं है",
    viewAll: "सभी देखें",
    quickActions: "त्वरित क्रियाएँ",
    addStudent: "विद्यार्थी जोड़ें",
    enterMarks: "अंक दर्ज करें",
    applyLeave: "छुट्टी के लिए आवेदन",
    createEvent: "नया कार्यक्रम बनाएं",
    myProfile: "मेरी प्रोफ़ाइल",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    appsCenter: "ऐप्स केंद्र",
    themePreview: "पूर्वावलोकन",
    searchHint: "ईआरपी में कुछ भी खोजने के लिए कम से कम 2 अक्षर टाइप करें।",
    searchResults: "खोज परिणाम",
    noResultsFound: "कोई मॉड्यूल या विद्यार्थी नहीं मिला",
    studyManagement: "अध्ययन प्रबंधन",
    documents: "दस्तावेज़",
    communication: "संचार",
    account: "खाता",
    dashboard: "डैशबोर्ड",
    classwork: "कक्षा कार्य और लॉगबुक",
    assignments: "गृहकार्य और असाइनमेंट",
    certificates: "प्रमाण पत्र और दस्तावेज़",
    ptm: "पीटीएम बैठकें",
    lessonPlanner: "पाठ योजनाकार",
    osm: "ओएसएम मॉड्यूल",
    assessment: "मूल्यांकन",
    leadManagement: "लीड प्रबंधन",
    surveys: "सर्वेक्षण और प्रतिक्रिया",
    messages: "संदेश",
    hpc: "समग्र प्रगति कार्ड (HPC)",
    login: "लॉग इन / खाता बदलें",
    logout: "लॉग आउट",
    langChangedToast: "भाषा सफलतापूर्वक हिंदी में बदली गई!"
  },
  Gujarati: {
    searchPlaceholder: "વિદ્યાર્થીઓ, પરીક્ષાઓ, મોડ્યુલ્સ શોધો...",
    commandCenter: "કમાન્ડ સેન્ટર",
    session: "સત્ર",
    language: "ભાષા",
    notifications: "સૂચનાઓ",
    markAllRead: "બધા વાંચેલા તરીકે ચિહ્નિત કરો",
    noNotifications: "કોઈ નવી સૂચનાઓ નથી",
    viewAll: "બધા જુઓ",
    quickActions: "ઝડપી ક્રિયાઓ",
    addStudent: "વિદ્યાર્થી ઉમેરો",
    enterMarks: "ગુણ દાખલ કરો",
    applyLeave: "રજા માટે અરજી કરો",
    createEvent: "નવો કાર્યક્રમ બનાવો",
    myProfile: "મારી પ્રોફાઇલ",
    settings: "સેટિંગ્સ",
    signOut: "સાઇન આઉટ",
    appsCenter: "એપ્સ સેન્ટર",
    themePreview: "પૂર્વાવલોકન",
    searchHint: "ERP માં કંઈપણ શોધવા માટે ઓછામાં ઓછા 2 અક્ષરો લખો.",
    searchResults: "શોધ પરિણામો",
    noResultsFound: "કોઈ મેળ ખાતા મોડ્યુલ કે વિદ્યાર્થી મળ્યા નથી",
    studyManagement: "અભ્યાસ વ્યવસ્થાપન",
    documents: "દસ્તાવેજો",
    communication: "સંચાર",
    account: "ખાતું",
    dashboard: "ડેશબોર્ડ",
    classwork: "વર્ગકાર્ય અને લૉગબુક",
    assignments: "ગૃહકાર્ય અને અસાઇનમેન્ટ્સ",
    certificates: "પ્રમાણપત્રો અને દસ્તાવેજો",
    ptm: "પીટીએમ મીટિંગ્સ",
    lessonPlanner: "પાઠ આયોજક",
    osm: "ઓએસએમ મોડ્યુલ",
    assessment: "મૂલ્યાંકન",
    leadManagement: "લીડ મેનેજમેન્ટ",
    surveys: "સર્વેક્ષણો અને પ્રતિસાદ",
    messages: "સંદેશાઓ",
    hpc: "સમગ્ર પ્રગતિ કાર્ડ (HPC)",
    logout: "લૉગ આઉટ",
    langChangedToast: "ભાષા સફળતાપૂર્વક ગુજરાતીમાં બદલાઈ ગઈ!"
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('English');
  const [currentLangCode, setCurrentLangCode] = useState('en');

  // Trigger Google Translate engine across the entire webpage DOM
  const triggerGoogleTranslate = (langCode) => {
    try {
      if (!langCode || langCode === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          combo.value = '';
          combo.dispatchEvent(new Event('change'));
        }
        return;
      }

      const val = `/en/${langCode}`;
      document.cookie = `googtrans=${val}; path=/;`;
      document.cookie = `googtrans=${val}; path=/; domain=${window.location.hostname};`;

      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      console.warn('Translate trigger error:', e);
    }
  };

  // Initialize from storage or backend on mount
  useEffect(() => {
    const initLang = async () => {
      let selectedLang = localStorage.getItem('erp_language') || 'English';

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosInstance.get('/profile/me');
          const backendLang = res.data?.data?.preferences?.language;
          if (backendLang) {
            selectedLang = backendLang;
            localStorage.setItem('erp_language', backendLang);
          }
        } catch (err) {}
      }

      const found = supportedLanguages.find(l => 
        l.name.toLowerCase() === selectedLang.toLowerCase() || 
        l.code.toLowerCase() === selectedLang.toLowerCase()
      ) || supportedLanguages[0];

      setCurrentLang(found.name);
      setCurrentLangCode(found.code);

      // Apply Google translate cookie if not English
      if (found.code !== 'en') {
        setTimeout(() => triggerGoogleTranslate(found.code), 600);
      }
    };

    initLang();
  }, []);

  const changeLanguage = async (langNameOrCode) => {
    const target = supportedLanguages.find(l => 
      l.name.toLowerCase() === langNameOrCode.toLowerCase() || 
      l.code.toLowerCase() === langNameOrCode.toLowerCase()
    );

    if (!target) return;

    setCurrentLang(target.name);
    setCurrentLangCode(target.code);
    localStorage.setItem('erp_language', target.name);
    localStorage.setItem('erp_lang_code', target.code);

    // Apply full-site DOM translation
    triggerGoogleTranslate(target.code);

    // Persist to MongoDB backend User Profile if authenticated
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axiosInstance.put('/profile/preferences', {
          preferences: { language: target.name }
        });
      } catch (err) {
        console.warn('Backend language sync error:', err.message);
      }
    }

    // Show confirmation Toast
    const toastTitle = translations[target.name]?.langChangedToast || 
      `Language changed to ${target.native} (${target.name})!`;
    Swal.fire({
      title: toastTitle,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500
    });
  };

  const t = (key, fallback = '') => {
    const dict = translations[currentLang] || translations.English;
    return dict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      currentLangCode, 
      changeLanguage, 
      languages: supportedLanguages.map(l => l.name), 
      supportedLanguages,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
