import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bus, 
  Moon, 
  Sun, 
  Bell, 
  LayoutGrid, 
  Target, 
  Contact, 
  CalendarCheck, 
  User, 
  Menu, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  PhoneCall, 
  Phone, 
  LogOut, 
  QrCode, 
  Route as RouteIcon, 
  MapPin, 
  ClipboardCheck, 
  AlertTriangle, 
  History, 
  Settings, 
  Navigation,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { driverService } from '../api/driverService';

export default function DriverLayout() {
  const { driver, vehicle, activeTrip, logout } = useAuth();
  const { isConnected, activeSOSAlert, clearSOSAlert } = useSocket();
  const { isDark, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactsModalOpen, setContactsModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosDescription, setSosDescription] = useState('Medical or Road Emergency assistance required.');
  const [sosSending, setSosSending] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);
  const [unreadNotifs] = useState(3);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleTriggerSOS = async () => {
    setSosSending(true);
    try {
      await driverService.triggerSOS({
        vehicleNumber: vehicle?.vehicleNumber || driver?.assignedBus || 'UP 32 AB 1234',
        routeName: activeTrip?.routeName || 'Assigned Route',
        description: sosDescription,
        location: vehicle?.currentLocation || { lat: 26.8467, lng: 80.9462, address: 'Near Current GPS Position' }
      });
      setSosSuccess(true);
      setTimeout(() => {
        setSosSuccess(false);
        setSosModalOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to trigger SOS:', err);
    } finally {
      setSosSending(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Live GPS Tracking', path: '/tracking', icon: Target, badge: activeTrip ? 'LIVE' : null },
    { name: 'Student Boarding (QR)', path: '/boarding', icon: QrCode },
    { name: 'Today\'s Trips', path: '/trips', icon: RouteIcon },
    { name: 'Assigned Vehicle', path: '/vehicle', icon: Bus },
    { name: 'Assigned Routes', path: '/routes', icon: MapPin },
    { name: 'Self Attendance & Leave', path: '/attendance', icon: CalendarCheck },
    { name: 'Route Contacts', path: '/contacts', icon: Contact },
    { name: 'Vehicle Inspection', path: '/inspection', icon: ClipboardCheck },
    { name: 'Incidents & SOS', path: '/incidents', icon: AlertTriangle },
    { name: 'Trip History', path: '/history', icon: History },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Driver Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const driverName = driver?.name || 'Ramesh Kumar';
  const driverPhoto = driver?.photo || driver?.avatar || localStorage.getItem('driver_custom_photo') || '';
  const busNumber = vehicle?.vehicleNumber || driver?.assignedBus || 'UP 32 AB 1234';
  const formattedBusNo = busNumber.startsWith('Bus') ? busNumber : `Bus ${busNumber}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* ===================== TOP NOTIFICATION BANNER (ACTIVE SOS) ===================== */}
      {activeSOSAlert && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md animate-pulse sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>CRITICAL ALERT: {activeSOSAlert.type} on Bus {activeSOSAlert.vehicleNumber}</span>
          </div>
          <button 
            onClick={clearSOSAlert}
            className="text-white hover:text-rose-200 underline text-xs font-semibold"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* ===================== RESPONSIVE HEADER ===================== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          
          {/* Left: Round Peach Bus Badge + Portal Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Drawer Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full bg-[#ffedd5] dark:bg-orange-950/70 border border-orange-200/60 dark:border-orange-800/40 flex items-center justify-center text-[#d9480f] dark:text-orange-400 shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-transform"
              title="Open Driver Menu"
            >
              <Bus className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Desktop Brand Link */}
            <NavLink to="/dashboard" className="hidden lg:flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#ffedd5] dark:bg-orange-950/70 border border-orange-200/60 dark:border-orange-800/40 flex items-center justify-center text-[#d9480f] dark:text-orange-400 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Bus className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-black text-lg tracking-wider text-slate-900 dark:text-white uppercase leading-none">
                    DRIVER PORTAL
                  </h1>
                  <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded uppercase">
                    ERP FLEET
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {formattedBusNo} • {driverName}
                </p>
              </div>
            </NavLink>

            {/* Mobile Center Title */}
            <div className="lg:hidden text-left sm:text-center">
              <h1 className="font-serif font-black text-base sm:text-lg tracking-wider text-slate-900 dark:text-white uppercase leading-tight">
                DRIVER PORTAL
              </h1>
            </div>
          </div>

          {/* Desktop Center: Live Trip Status Ribbon */}
          {activeTrip && (
            <div 
              onClick={() => navigate('/tracking')}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 rounded-full cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                ACTIVE TRIP: {activeTrip.routeName}
              </span>
              <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full">
                LIVE GPS ↗
              </span>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Desktop Telemetry Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isConnected ? 'Telemetry Live' : 'Connecting'}</span>
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setSosModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              title="Emergency SOS"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* Dark Mode Moon Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#d9480f] dark:text-orange-400 hover:scale-110 active:scale-95 transition-transform"
              title="Toggle Dark Mode"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-5 h-5 fill-[#d9480f]" />
              )}
            </button>

            {/* Notification Bell with Badge 3 */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-slate-800 dark:text-slate-100 hover:scale-110 active:scale-95 transition-transform relative"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ea580c] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadNotifs}
              </span>
            </button>

            {/* Desktop Driver Avatar & Logout */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <NavLink 
                to="/profile"
                className="w-8 h-8 rounded-full border-2 border-orange-500 bg-[#ffedd5] dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold text-xs flex items-center justify-center shadow-sm hover:scale-105 transition-transform overflow-hidden shrink-0"
                title={`Profile: ${driverName}`}
              >
                {driverPhoto ? (
                  <img 
                    src={driverPhoto} 
                    alt={driverName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  driverName.charAt(0).toUpperCase()
                )}
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* ===================== RESPONSIVE BODY: SIDEBAR (DESKTOP) + CONTENT (DESKTOP & MOBILE) ===================== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 w-full flex-1 flex gap-4 sm:gap-5 py-3.5 sm:py-4 pb-20 lg:pb-6">
        
        {/* Desktop Sidebar (Visible on Laptop / Desktop >= lg) */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm space-y-1">
            
            {/* Driver Mini Card */}
            <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl mb-2.5 border border-orange-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold text-sm flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                  {driverPhoto ? (
                    <img 
                      src={driverPhoto} 
                      alt={driverName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    driverName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif font-black text-sm text-slate-900 dark:text-white truncate">
                    {driverName}
                  </div>
                  <div className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 truncate">
                    Senior Bus Driver
                  </div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-orange-200/40 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Assigned Bus:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {formattedBusNo}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors duration-150
                      ${isActive 
                        ? 'bg-[#ea580c] text-white shadow-sm shadow-orange-500/20 font-bold' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Desktop Emergency Contacts Trigger */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setContactsModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
              >
                <Contact className="w-4 h-4 shrink-0" />
                <span>Emergency Contacts</span>
              </button>
            </div>

          </div>
        </aside>

        {/* Main Content Area (Expands fully on laptop, clean mobile view on phone) */}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-8rem)]">
          <Outlet context={{ openContacts: () => setContactsModalOpen(true) }} />
        </main>

      </div>

      {/* ===================== BOTTOM NAVIGATION BAR (MOBILE ONLY: lg:hidden) ===================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
          
          {/* 1. Home */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all
              ${isActive 
                ? 'text-[#ea580c] font-bold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }
            `}
          >
            <LayoutGrid className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[11px] font-medium leading-tight">Home</span>
          </NavLink>

          {/* 2. Live Track */}
          <NavLink
            to="/tracking"
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all
              ${isActive 
                ? 'text-[#ea580c] font-bold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }
            `}
          >
            <Target className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[11px] font-medium leading-tight">Live Track</span>
          </NavLink>

          {/* 3. Contacts */}
          <NavLink
            to="/contacts"
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all
              ${isActive 
                ? 'text-[#ea580c] font-bold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }
            `}
          >
            <Contact className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[11px] font-medium leading-tight">Contacts</span>
          </NavLink>

          {/* 4. Self Attendance */}
          <NavLink
            to="/attendance"
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all
              ${isActive 
                ? 'text-[#ea580c] font-bold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }
            `}
          >
            <CalendarCheck className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[11px] font-medium leading-tight truncate max-w-[65px]">Self Attend...</span>
          </NavLink>

          {/* 5. Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all
              ${isActive 
                ? 'text-[#ea580c] font-bold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }
            `}
          >
            {driverPhoto ? (
              <img 
                src={driverPhoto} 
                alt="Profile" 
                className="w-5 h-5 rounded-full object-cover border border-orange-500 mb-0.5 shadow-xs shrink-0" 
              />
            ) : (
              <User className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            )}
            <span className="text-[11px] font-medium leading-tight">Profile</span>
          </NavLink>

        </div>
      </nav>

      {/* ===================== MOBILE DRAWER MENU ===================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85%] bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between border-r border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffedd5] dark:bg-orange-950/70 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-sm uppercase text-slate-900 dark:text-white">
                      DRIVER PANEL
                    </h3>
                    <p className="text-[11px] text-orange-600 font-bold">
                      {formattedBusNo}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Driver Mini Card */}
              <div className="p-3 bg-orange-50 dark:bg-slate-800/80 rounded-2xl mb-4 border border-orange-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold text-sm flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                    {driverPhoto ? (
                      <img 
                        src={driverPhoto} 
                        alt={driverName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      driverName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif font-black text-sm text-slate-900 dark:text-white truncate">
                      {driverName}
                    </div>
                    <div className="text-[11px] text-orange-600 font-semibold truncate">
                      Senior Bus Driver • {driver?.driverId || 'DRV-101'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors duration-150
                        ${isActive 
                          ? 'bg-[#ea580c] text-white font-bold shadow-md shadow-orange-500/20' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Driver Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CONTACTS MODAL ===================== */}
      {contactsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                  <Contact className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-slate-900 dark:text-white">
                    Emergency & Contacts
                  </h3>
                  <p className="text-[11px] text-slate-500">School transport fleet directory</p>
                </div>
              </div>
              <button 
                onClick={() => setContactsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Central Transport Control</div>
                  <div className="text-[11px] text-slate-500 font-mono">+91 98112 23399</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">24/7 Dispatch Desk</div>
                </div>
                <a
                  href="tel:+919811223399"
                  className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Fleet Manager (Mr. Verma)</div>
                  <div className="text-[11px] text-slate-500 font-mono">+91 98765 43210</div>
                  <div className="text-[10px] text-slate-500">Bus Operations & Routes</div>
                </div>
                <a
                  href="tel:+919876543210"
                  className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Depot Workshop & Mechanic</div>
                  <div className="text-[11px] text-slate-500 font-mono">+91 98223 44556</div>
                  <div className="text-[10px] text-slate-500">Breakdown Assistance</div>
                </div>
                <a
                  href="tel:+919822344556"
                  className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-rose-700 dark:text-rose-300">National Emergency Services</div>
                  <div className="text-[11px] text-rose-600 font-mono">Dial 112 (Police & Ambulance)</div>
                  <div className="text-[10px] text-rose-500">Emergency Response Support</div>
                </div>
                <a
                  href="tel:112"
                  className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            </div>

            <button
              onClick={() => setContactsModalOpen(false)}
              className="mt-4 w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Close Directory
            </button>
          </div>
        </div>
      )}

      {/* ===================== EMERGENCY SOS MODAL ===================== */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-rose-600 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-500 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                  EMERGENCY SOS
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Dispatches high-priority alert to control room
                </p>
              </div>
            </div>

            {sosSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500 text-emerald-800 dark:text-emerald-200 p-4 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-sm">SOS DISPATCHED!</h4>
                <p className="text-xs">
                  Your coordinates and emergency alert have been received by central dispatch.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formattedBusNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver:</span>
                    <span className="font-bold">{driverName}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Situation:
                  </label>
                  <textarea
                    rows={3}
                    value={sosDescription}
                    onChange={(e) => setSosDescription(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Describe immediate situation (e.g. breakdown, road obstruction)..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSosModalOpen(false)}
                    className="flex-1 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTriggerSOS}
                    disabled={sosSending}
                    className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{sosSending ? 'Sending...' : 'DISPATCH SOS'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
