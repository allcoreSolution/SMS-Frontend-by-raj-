import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Heart, 
  AlertCircle, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  Download, 
  ShieldCheck, 
  User, 
  Briefcase, 
  ArrowUpRight, 
  Bell, 
  CreditCard, 
  CalendarDays, 
  FileSpreadsheet,
  Plus,
  Printer,
  Award,
  Filter,
  BarChart,
  Grid,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Swal from 'sweetalert2';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Retrieve logged in staff profile
  const [staffUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return {
      fullName: 'Staff Member',
      name: 'Staff Member',
      email: '',
      role: 'Staff',
      designation: 'Staff Faculty',
      department: 'Staff Department',
      staffId: ''
    };
  });

  const staffName = staffUser.fullName || staffUser.name || 'Staff Member';
  const staffDesignation = staffUser.designation || 'Staff Faculty';
  const staffDept = staffUser.department || 'Administration';
  const staffId = staffUser.staffId || staffUser.empId || '';

  const handleDownloadPayslip = () => {
    Swal.fire({
      title: '<strong>Institutional Payslip</strong>',
      html: `
        <div style="text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
          <p style="font-size: 14px; color: #475569; font-weight: 500;">No generated payslip found for current cycle.</p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">Please contact the Accounts & HR Department once monthly payroll is processed.</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4f46e5'
    });
  };

  // Staff Key Metrics Data
  const stats = [
    {
      id: 'attendance',
      title: t('myAttendance', 'My Attendance'),
      value: '0%',
      subtitle: t('presentDays', '0 / 0 Days Present'),
      badge: t('onTrack', 'Normal'),
      badgeColor: 'bg-emerald-100 text-emerald-700',
      icon: Clock,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
      link: '/timetable'
    },
    {
      id: 'leave',
      title: t('leaveBalance', 'Leave Balance'),
      value: '0 Days',
      subtitle: t('leaveBreakdown', 'CL: 0 · ML: 0 · EL: 0'),
      badge: t('available', 'Available'),
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: Calendar,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-500',
      link: '/leave'
    },
    {
      id: 'salary',
      title: t('currentSalary', 'Latest Net Salary'),
      value: '₹0',
      subtitle: t('disbursedBank', 'No recent payout'),
      badge: t('credited', 'Pending'),
      badgeColor: 'bg-slate-100 text-slate-700',
      icon: DollarSign,
      iconBg: 'bg-gradient-to-tr from-purple-600 to-violet-500',
      link: '/my-profile'
    },
    {
      id: 'loans',
      title: t('activeLoans', 'Active Advance / Loan'),
      value: '₹0',
      subtitle: t('monthlyEmi', 'No active loan'),
      badge: t('inRepayment', 'No dues'),
      badgeColor: 'bg-slate-100 text-slate-700',
      icon: CreditCard,
      iconBg: 'bg-gradient-to-tr from-amber-600 to-orange-500',
      link: '/loans'
    }
  ];

  // Quick Action Services for Staff
  const staffServices = [
    {
      title: t('applyLeave', 'Apply for Leave'),
      desc: t('leaveDesc', 'Casual, medical and earned leave requests'),
      icon: FileText,
      color: 'text-pink-600 bg-pink-50 hover:border-pink-300',
      iconBg: 'bg-pink-100',
      path: '/leave',
      badge: 'Quick Apply'
    },
    {
      title: t('myLoans', 'Loans & Salary Advances'),
      desc: t('loanDesc', 'Check eligibility, request advance & view EMI ledger'),
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50 hover:border-purple-300',
      iconBg: 'bg-purple-100',
      path: '/loans',
      badge: 'Loans Desk'
    },
    {
      title: t('dutyTimetable', 'Staff Duty & Work Roster'),
      desc: t('dutyDesc', 'Daily working hours, office shifts & invigilation'),
      icon: CalendarDays,
      color: 'text-indigo-600 bg-indigo-50 hover:border-indigo-300',
      iconBg: 'bg-indigo-100',
      path: '/timetable',
      badge: 'Roster'
    },
    {
      title: t('payslips', 'Payslip & Compensation'),
      desc: t('payslipDesc', 'Download digital salary slips, EPF & Form 16'),
      icon: FileSpreadsheet,
      color: 'text-emerald-600 bg-emerald-50 hover:border-emerald-300',
      iconBg: 'bg-emerald-100',
      path: '/my-profile',
      badge: 'Payslips'
    },
    {
      title: t('healthRecords', 'Health & Medical Desk'),
      desc: t('healthDesc', 'Institutional health insurance & annual checkup status'),
      icon: Heart,
      color: 'text-rose-600 bg-rose-50 hover:border-rose-300',
      iconBg: 'bg-rose-100',
      path: '/health',
      badge: 'Health Desk'
    },
    {
      title: t('complaints', 'Grievances & Helpdesk'),
      desc: t('complaintsDesc', 'Submit maintenance requests or workplace queries'),
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-50 hover:border-orange-300',
      iconBg: 'bg-orange-100',
      path: '/complaints',
      badge: 'Support Desk'
    },
    {
      title: t('messages', 'Official Circulars & Notices'),
      desc: t('messagesDesc', 'Management notifications, policy updates & holidays'),
      icon: Bell,
      color: 'text-sky-600 bg-sky-50 hover:border-sky-300',
      iconBg: 'bg-sky-100',
      path: '/messages',
      badge: 'Notices'
    },
    {
      title: t('profileCard', 'Staff ID Card & Profile'),
      desc: t('profileDesc', 'Official Barcode ID card, biometric credentials & info'),
      icon: User,
      color: 'text-teal-600 bg-teal-50 hover:border-teal-300',
      iconBg: 'bg-teal-100',
      path: '/my-profile',
      badge: staffId || 'Staff'
    }
  ];

  // Weekly Punch Logs
  const punchLogs = [];

  return (
    <div className="space-y-3.5 sm:space-y-4.5 p-3 sm:p-4 lg:p-5 max-w-7xl mx-auto pb-12 animate-fade-in select-none">

      {/* ── 1. STAFF HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white p-4 sm:p-5 shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('staffPortal', 'Staff & Administration Portal')}</span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-300 font-bold">{staffId}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight text-white font-serif">
              {t('welcomeGreeting', 'Welcome back')}, <span className="bg-gradient-to-r from-indigo-300 to-amber-200 bg-clip-text text-transparent">{staffName}</span>!
            </h1>

            <p className="text-slate-300 text-xs font-medium max-w-2xl leading-relaxed">
              {staffDesignation} &bull; <span className="text-white font-semibold">{staffDept}</span> &bull; {t('sessionLabel', 'Session 2026-2027')}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {t('punchInSuccess', 'Biometric Active')}
              </span>
              <span className="text-[11px] bg-white/10 text-slate-200 px-2.5 py-0.5 rounded-lg font-medium">
                {t('shiftTime', 'General Shift')}
              </span>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <Link
              to="/leave"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e55208] hover:to-[#ff6a19] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('applyLeave', 'Apply Leave')}</span>
            </Link>

            <Link
              to="/loans"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('loanDesk', 'Loans Desk')}</span>
            </Link>

            <button
              type="button"
              onClick={handleDownloadPayslip}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('payslip', 'Payslip')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. KEY STAFF KPI METRICS (Sleek Compact Size) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div 
              key={s.id}
              onClick={() => navigate(s.link)}
              className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${s.badgeColor}`}>
                  {s.badge}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  {s.title}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-serif">
                    {s.value}
                  </h3>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5 flex items-center justify-between">
                  <span className="truncate pr-1">{s.subtitle}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#ff5c0a] group-hover:translate-x-0.5 transition-all shrink-0" />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. STAFF PRIMARY SERVICES GRID (8 TILES - Compact) ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              {t('staffServicesHeader', 'Core Staff Services & Work Hub')}
            </h2>
            <p className="text-[11px] text-slate-500">
              {t('staffServicesSub', 'Quick access to employee administration, requests & benefits')}
            </p>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
            8 Modules
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {staffServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(srv.path)}
                className={`p-2.5 sm:p-3 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-400 hover:shadow-2xs transition-all cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${srv.iconBg} ${srv.color} flex items-center justify-center font-bold`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-indigo-600">
                  <span>{t('openModule', 'Open')}</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3.5. OFFICE ADMINISTRATION & CERTIFICATION SERVICES HUB (Compact) ── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 border border-indigo-800/40 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10.5px] font-bold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>{t('officeServicesHub', 'Office Services & Administration Hub')}</span>
                <span>•</span>
                <span className="text-white font-extrabold">{t('officialDesk', 'Official Certification Desk')}</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight font-serif">
                {t('officeServicesTitle', 'Institutional Office Services & Certification')}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                {t('officeServicesDesc', 'Direct generation and issuance of Transfer Certificates (TC), Bonafide & Character Certificates, Admission Leads & Surveys.')}
              </p>
            </div>
            
            <Link
              to="/certificates"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all self-start sm:self-auto active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('issueNewCert', 'Generate Certificate')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5">
            {/* Tile 1: Certificates & Documents */}
            <div
              onClick={() => navigate('/certificates')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 backdrop-blur-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    TC / Bonafide
                  </span>
                </div>
                <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {t('certificatesTitle', 'Certificates & Documents')}
                </h3>
                <p className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {t('certificatesDesc', 'Issue TC, Character, Bonafide, Merit & Sports certificates with QR verification.')}
                </p>
              </div>
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-cyan-400">
                <span>{t('generateNow', 'Issue Document')}</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Tile 2: Admission Leads */}
            <div
              onClick={() => navigate('/lead-dashboard')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/50 backdrop-blur-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <Filter className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                    Admissions
                  </span>
                </div>
                <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-teal-300 transition-colors">
                  {t('leadsTitle', 'Admissions & Inquiry Desk')}
                </h3>
                <p className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {t('leadsDesc', 'Manage incoming student admission inquiries, parent follow-ups and pipeline.')}
                </p>
              </div>
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-teal-400">
                <span>{t('viewPipeline', 'Open Pipeline')}</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Tile 3: Surveys & Feedback */}
            <div
              onClick={() => navigate('/my-surveys')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 backdrop-blur-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <BarChart className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Feedback & Polls
                  </span>
                </div>
                <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t('surveysTitle', 'Institutional Surveys & Feedback')}
                </h3>
                <p className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {t('surveysDesc', 'Staff welfare feedback, workplace improvement polls and department audits.')}
                </p>
              </div>
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-amber-400">
                <span>{t('participatePoll', 'Open Surveys')}</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Tile 4: Apps Center */}
            <div
              onClick={() => navigate('/apps-center')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/50 backdrop-blur-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/30 text-orange-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <Grid className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-400/20 text-orange-300 border border-orange-400/30">
                    ERP Utilities
                  </span>
                </div>
                <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-orange-300 transition-colors">
                  {t('appsCenterTitle', 'School ERP Apps Center')}
                </h3>
                <p className="text-[10px] sm:text-[10.5px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {t('appsCenterDesc', 'Digital calculator, document scanner, institutional calendar & quick office tools.')}
                </p>
              </div>
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-orange-400">
                <span>{t('launchApps', 'Explore Apps')}</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. TWO-COLUMN INTERACTIVE DETAIL WIDGETS (Compact) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Left Column: Biometric Punch Log (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {t('biometricTitle', 'Biometric Punch Log & Working Hours')}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500">
                  {t('biometricSub', 'Verified RFID/Fingerprint punch records for current week')}
                </p>
              </div>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Avg 7.6 hrs/day
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px]">
                  <th className="py-1.5 px-2">Day / Date</th>
                  <th className="py-1.5 px-2">Punch In</th>
                  <th className="py-1.5 px-2">Punch Out</th>
                  <th className="py-1.5 px-2">Duration</th>
                  <th className="py-1.5 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {punchLogs.length > 0 ? punchLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-2 font-bold text-slate-800">{log.day}</td>
                    <td className="py-2 px-2 font-mono text-slate-600">{log.inTime}</td>
                    <td className="py-2 px-2 font-mono text-slate-600">{log.outTime}</td>
                    <td className="py-2 px-2 font-semibold text-slate-700">{log.total}</td>
                    <td className="py-2 px-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        log.status === 'Active' 
                          ? 'bg-amber-100 text-amber-700 animate-pulse' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-medium text-xs">
                      No biometric punch records found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span>Machine ID: <strong className="text-slate-700 font-mono">BIO-GATE-01</strong></span>
            <Link to="/timetable" className="text-indigo-600 font-bold hover:underline">
              {t('viewFullAttendanceHistory', 'View Monthly Attendance Sheet →')}
            </Link>
          </div>
        </div>

        {/* Right Column: Salary & Compensation Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4.5 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t('compensationHeader', 'Salary & Pay Grade')}
                  </h3>
                  <p className="text-[10px] text-slate-500">Pay Band PB-3 · Level 8</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full">
                Disbursed
              </span>
            </div>

            <div className="space-y-1.5 pt-2 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Basic Pay:</span>
                <span className="font-bold text-slate-800">₹0</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Allowances:</span>
                <span className="font-bold text-slate-800">₹0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 font-bold text-slate-900">
                <span>Gross Compensation:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-500">
                <span>Deductions:</span>
                <span>₹0</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Take-Home Net Pay</span>
                  <span className="text-lg font-black text-slate-800 font-serif">₹0</span>
                </div>
                <span className="text-[9.5px] text-slate-500 bg-slate-200 font-bold px-1.5 py-0.5 rounded-md">
                  No Active Payroll
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPayslip}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3 text-indigo-600" />
            <span>Download Oct 2026 Payslip (PDF)</span>
          </button>
        </div>

      </div>

    </div>
  );
}
