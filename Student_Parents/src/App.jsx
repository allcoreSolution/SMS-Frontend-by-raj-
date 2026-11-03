import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LanguageProvider } from './context/LanguageContext';
import Layout        from './layouts/Layout';
import Dashboard     from './pages/Dashboard';
import Profile       from './pages/Profile';
import ComingSoon    from './pages/ComingSoon';
import Logout        from './pages/Logout';
import Login         from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';

// Academics
import CalendarPage  from './pages/academics/CalendarPage';
import Timetable     from './pages/academics/Timetable';
import Attendance    from './pages/academics/Attendance';
import Exams         from './pages/academics/Exams';
import Homework      from './pages/academics/Homework';
import Meetings      from './pages/academics/Meetings';
import OnlineExams   from './pages/academics/OnlineExams';

// Finance
import FeePayments   from './pages/finance/FeePayments';
import Transactions  from './pages/finance/Transactions';

// Comms
import NoticeBoard   from './pages/comms/NoticeBoard';
import SMS           from './pages/comms/SMS';
import Email         from './pages/comms/Email';

import Transport     from './pages/services/Transport';
import AIAssistant   from './pages/services/AIAssistant';
import Library       from './pages/services/Library';
import Hostel        from './pages/services/Hostel';
import HealthRecords from './pages/services/HealthRecords';
import Documents     from './pages/services/Documents';
import Gallery       from './pages/services/Gallery';
import SchoolVisit   from './pages/services/SchoolVisit';

// Study Center Pages
import StudyCenter   from './pages/academics/StudyCenter';
import Classwork     from './pages/academics/Classwork';
import LiveClasses   from './pages/academics/LiveClasses';
import Coaching      from './pages/academics/Coaching';

// Communications
import WhatsApp from './pages/comms/WhatsApp';
import LeaveManagement from './pages/services/LeaveManagement';
import AllModules from './pages/AllModules';

const pages = [
  { path: '/dashboard',       El: Dashboard       },
  { path: '/all-modules',     El: AllModules      },
  { path: '/all-services',    El: AllModules      },
  { path: '/profile',         El: Profile         },
  { path: '/my-profile',      El: Profile         },
  { path: '/logout',          El: Logout          },
  // Academics
  { path: '/calendar',        El: CalendarPage    },
  { path: '/timetable',       El: Timetable       },
  { path: '/attendance',      El: Attendance      },
  { path: '/exams',           El: Exams           },
  { path: '/homework',        El: Homework        },
  { path: '/meetings',        El: Meetings        },
  { path: '/online-exams',    El: OnlineExams     },
  // Study Center Drops
  { path: '/study-center',    El: StudyCenter     },
  { path: '/classwork',       El: Classwork       },
  { path: '/live-classes',    El: LiveClasses     }, 
  { path: '/coaching',        El: Coaching        },
  // Finance
  { path: '/fee-payments',    El: FeePayments     },
  { path: '/transactions',    El: Transactions    },
  // Communications
  { path: '/notice-board',    El: NoticeBoard     },
  { path: '/sms',             El: SMS             },
  { path: '/whatsapp',        El: WhatsApp        },
  { path: '/email',           El: Email           },
  // Services & Resources
  { path: '/transport',       El: Transport       },
  { path: '/library',         El: Library         },
  { path: '/hostel',          El: Hostel          },
  { path: '/health-records',  El: HealthRecords   },
  { path: '/documents',       El: Documents       },
  { path: '/gallery',         El: Gallery         },
  { path: '/school-visit',    El: SchoolVisit     },
  { path: '/leave-management',El: LeaveManagement },
  // Help & Support
  { path: '/ai-assistant',    El: AIAssistant     },
];

export default function App() {
  const [activeChild, setActiveChildState] = useState(() => {
    return localStorage.getItem('active_child') || '';
  });

  const setActiveChild = (childId) => {
    setActiveChildState(childId);
    if (childId) {
      localStorage.setItem('active_child', childId);
    }
  };

  const hasAuth = () => {
    try {
      const token = localStorage.getItem('parent_token') || localStorage.getItem('token');
      const user = localStorage.getItem('parent_user');
      return !!(token || user);
    } catch (e) {
      return false;
    }
  };

  return (
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Navigate to={hasAuth() ? "/dashboard" : "/login"} replace />} />
          <Route path="/index.html" element={<Navigate to={hasAuth() ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          {pages.map(({ path, El }) => (
            <Route
              key={path}
              path={path}
              element={
                hasAuth() ? (
                  <ErrorBoundary>
                    <Layout activeChild={activeChild} setActiveChild={setActiveChild}>
                      <El activeChild={activeChild} setActiveChild={setActiveChild} />
                    </Layout>
                  </ErrorBoundary>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          ))}
          <Route path="*" element={<Navigate to={hasAuth() ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
