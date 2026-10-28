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
  Plus
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
      fullName: 'Rajesh Verma',
      name: 'Rajesh Verma',
      email: 'staff@school.edu',
      role: 'Staff',
      designation: 'Senior Administrative Officer',
      department: 'Administration & HR',
      staffId: 'EMP-101'
    };
  });

  const staffName = staffUser.fullName || staffUser.name || 'Rajesh Verma';
  const staffDesignation = staffUser.designation || 'Senior Administrative Officer';
  const staffDept = staffUser.department || 'Administration & HR';
  const staffId = staffUser.staffId || staffUser.empId || 'EMP-101';

  const handleDownloadPayslip = () => {
    Swal.fire({
      title: '<strong>Institutional Payslip — October 2026</strong>',
      html: `
        <div style="text-align: left; font-size: 12px; line-height: 1.6; padding: 6px; font-family: system-ui, sans-serif;">
          <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h4 style="margin: 0; font-size: 15px; font-weight: bold; color: #1e1b4b;">SCHOOL ERP ACADEMY</h4>
              <p style="margin: 2px 0; color: #6b7280; font-size: 11px;">Sector 4, Institutional Area, New Delhi</p>
            </div>
            <div style="text-align: right;">
              <span style="background: #e0e7ff; color: #3730a3; padding: 3px 8px; font-weight: bold; font-size: 11px; border-radius: 4px;">SALARY SLIP</span>
              <p style="margin: 2px 0; color: #4b5563; font-size: 10px;">October 2026</p>
            </div>
          </div>
          <table style="width: 100%; font-size: 11px; margin-bottom: 10px;">
            <tr><td style="color:#6b7280;">Employee Name:</td><td><strong>${staffName}</strong></td><td style="color:#6b7280;">Staff ID:</td><td><strong>${staffId}</strong></td></tr>
            <tr><td style="color:#6b7280;">Designation:</td><td>${staffDesignation}</td><td style="color:#6b7280;">Department:</td><td>${staffDept}</td></tr>
            <tr><td style="color:#6b7280;">Bank Account:</td><td>HDFC Bank (****7291)</td><td style="color:#6b7280;">Days Present:</td><td>22 / 23 Days</td></tr>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; border: 1px solid #e5e7eb;">
            <tr style="background: #f8fafc; font-weight: bold;">
              <th style="padding: 6px; border: 1px solid #e5e7eb; text-align: left;">Earnings</th>
              <th style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">Amount (₹)</th>
              <th style="padding: 6px; border: 1px solid #e5e7eb; text-align: left;">Deductions</th>
              <th style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">Amount (₹)</th>
            </tr>
            <tr>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">Basic Pay</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">42,000.00</td>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">EPF Contribution</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">5,040.00</td>
            </tr>
            <tr>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">Dearness (DA 50%)</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">21,000.00</td>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">Income Tax (TDS)</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">2,500.00</td>
            </tr>
            <tr>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">House Rent Allowance (HRA)</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">10,080.00</td>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">Salary Advance EMI</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">2,500.00</td>
            </tr>
            <tr>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">Special Allowance</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">5,000.00</td>
              <td style="padding: 4px 6px; border: 1px solid #e5e7eb;">Professional Tax</td><td style="padding: 4px 6px; border: 1px solid #e5e7eb; text-align: right;">200.00</td>
            </tr>
            <tr style="background: #faf5ff; font-weight: bold;">
              <td style="padding: 6px; border: 1px solid #e5e7eb;">Gross Earnings</td><td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right; color:#4f46e5;">₹78,080.00</td>
              <td style="padding: 6px; border: 1px solid #e5e7eb;">Total Deductions</td><td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right; color:#e11d48;">₹10,240.00</td>
            </tr>
          </table>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; color: #065f46;">Net Disbursed Take-Home Salary:</span>
            <span style="font-size: 16px; font-weight: 900; color: #047857;">₹54,200.00</span>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 10px; margin-top: 10px;">Digitally signed & authorized by Directorate of Human Resources.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Print / Save PDF',
      cancelButtonText: 'Close',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        window.print();
      }
    });
  };

  // Staff Key Metrics Data
  const stats = [
    {
      id: 'attendance',
      title: t('myAttendance', 'My Attendance'),
      value: '96.5%',
      subtitle: t('presentDays', '22 / 23 Days Present'),
      badge: t('onTrack', 'On Track'),
      badgeColor: 'bg-emerald-100 text-emerald-700',
      icon: Clock,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
      link: '/timetable'
    },
    {
      id: 'leave',
      title: t('leaveBalance', 'Leave Balance'),
      value: '28 Days',
      subtitle: t('leaveBreakdown', 'CL: 9 · ML: 9 · EL: 10'),
      badge: t('available', 'Available'),
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: Calendar,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-500',
      link: '/leave'
    },
    {
      id: 'salary',
      title: t('currentSalary', 'Latest Net Salary'),
      value: '₹54,200',
      subtitle: t('disbursedBank', 'Disbursed to HDFC Bank'),
      badge: t('credited', 'Credited'),
      badgeColor: 'bg-purple-100 text-purple-700',
      icon: DollarSign,
      iconBg: 'bg-gradient-to-tr from-purple-600 to-violet-500',
      link: '/my-profile'
    },
    {
      id: 'loans',
      title: t('activeLoans', 'Active Advance / Loan'),
      value: '₹15,000',
      subtitle: t('monthlyEmi', 'EMI: ₹2,500/mo · 6 left'),
      badge: t('inRepayment', 'Repayment Active'),
      badgeColor: 'bg-amber-100 text-amber-700',
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
      badge: 'Active: ₹15k'
    },
    {
      title: t('dutyTimetable', 'Staff Duty & Work Roster'),
      desc: t('dutyDesc', 'Daily working hours, office shifts & invigilation'),
      icon: CalendarDays,
      color: 'text-indigo-600 bg-indigo-50 hover:border-indigo-300',
      iconBg: 'bg-indigo-100',
      path: '/timetable',
      badge: '09:00 - 05:00'
    },
    {
      title: t('payslips', 'Payslip & Compensation'),
      desc: t('payslipDesc', 'Download digital salary slips, EPF & Form 16'),
      icon: FileSpreadsheet,
      color: 'text-emerald-600 bg-emerald-50 hover:border-emerald-300',
      iconBg: 'bg-emerald-100',
      path: '/my-profile',
      badge: 'Oct 2026'
    },
    {
      title: t('healthRecords', 'Health & Medical Desk'),
      desc: t('healthDesc', 'Institutional health insurance & annual checkup status'),
      icon: Heart,
      color: 'text-rose-600 bg-rose-50 hover:border-rose-300',
      iconBg: 'bg-rose-100',
      path: '/health',
      badge: 'Blood: B+'
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
      badge: '3 New'
    },
    {
      title: t('profileCard', 'Staff ID Card & Profile'),
      desc: t('profileDesc', 'Official Barcode ID card, biometric credentials & info'),
      icon: User,
      color: 'text-teal-600 bg-teal-50 hover:border-teal-300',
      iconBg: 'bg-teal-100',
      path: '/my-profile',
      badge: staffId
    }
  ];

  // Weekly Punch Logs (Mock realistic biometric data)
  const punchLogs = [
    { day: 'Mon, 26 Oct', inTime: '08:58 AM', outTime: '04:30 PM', total: '7h 32m', status: 'Present' },
    { day: 'Tue, 27 Oct', inTime: '08:55 AM', outTime: '04:32 PM', total: '7h 37m', status: 'Present' },
    { day: 'Wed, 28 Oct', inTime: '08:52 AM', outTime: '04:30 PM', total: '7h 38m', status: 'Present' },
    { day: 'Thu, 29 Oct', inTime: '08:56 AM', outTime: '04:35 PM', total: '7h 39m', status: 'Present' },
    { day: 'Fri, 30 Oct', inTime: '08:54 AM', outTime: 'Active (On Duty)', total: 'In Progress', status: 'Active' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">

      {/* ── 1. STAFF HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('staffPortal', 'Staff & Administration Portal')}</span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-300 font-bold">{staffId}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white font-serif">
              {t('welcomeGreeting', 'Welcome back')}, <span className="bg-gradient-to-r from-indigo-300 to-amber-200 bg-clip-text text-transparent">{staffName}</span>!
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              {staffDesignation} &bull; <span className="text-white font-semibold">{staffDept}</span> &bull; {t('sessionLabel', 'Session 2026-2027')}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {t('punchInSuccess', 'Biometric In: 08:54 AM (On Time)')}
              </span>
              <span className="text-xs bg-white/10 text-slate-200 px-3 py-1 rounded-xl font-medium">
                {t('shiftTime', 'General Shift: 09:00 AM - 05:00 PM')}
              </span>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              to="/leave"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e55208] hover:to-[#ff6a19] text-white text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('applyLeave', 'Apply Leave')}</span>
            </Link>

            <Link
              to="/loans"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-md active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>{t('loanDesk', 'Loans Desk')}</span>
            </Link>

            <button
              type="button"
              onClick={handleDownloadPayslip}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>{t('payslip', 'Payslip')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. KEY STAFF KPI METRICS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div 
              key={s.id}
              onClick={() => navigate(s.link)}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.badgeColor}`}>
                  {s.badge}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {s.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
                    {s.value}
                  </h3>
                </div>
                <p className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center justify-between">
                  <span>{s.subtitle}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#ff5c0a] group-hover:translate-x-0.5 transition-all" />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. STAFF PRIMARY SERVICES GRID (8 TILES) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {t('staffServicesHeader', 'Core Staff Services & Work Hub')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('staffServicesSub', 'Quick access to employee administration, requests & benefits')}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            8 Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {staffServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(srv.path)}
                className={`p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${srv.iconBg} ${srv.color} flex items-center justify-center font-bold`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-indigo-600">
                  <span>{t('openModule', 'Open')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. TWO-COLUMN INTERACTIVE DETAIL WIDGETS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Biometric Punch Log (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t('biometricTitle', 'Biometric Punch Log & Working Hours')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('biometricSub', 'Verified RFID/Fingerprint punch records for current week')}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Avg 7.6 hrs/day
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Day / Date</th>
                  <th className="py-2.5 px-3">Punch In</th>
                  <th className="py-2.5 px-3">Punch Out</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {punchLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">{log.day}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{log.inTime}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{log.outTime}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{log.total}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Active' 
                          ? 'bg-amber-100 text-amber-700 animate-pulse' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Machine ID: <strong className="text-slate-700 font-mono">BIO-GATE-01</strong></span>
            <Link to="/timetable" className="text-indigo-600 font-bold hover:underline">
              {t('viewFullAttendanceHistory', 'View Monthly Attendance Sheet →')}
            </Link>
          </div>
        </div>

        {/* Right Column: Salary & Compensation Overview */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t('compensationHeader', 'Salary & Pay Grade')}
                  </h3>
                  <p className="text-xs text-slate-500">Pay Band PB-3 · Level 8</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Disbursed
              </span>
            </div>

            <div className="space-y-2.5 pt-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Basic Pay:</span>
                <span className="font-bold text-slate-800">₹42,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Dearness Allowance (DA 50%):</span>
                <span className="font-bold text-slate-800">₹21,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">House Rent Allowance (HRA):</span>
                <span className="font-bold text-slate-800">₹10,080</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Special Staff Allowance:</span>
                <span className="font-bold text-slate-800">₹5,000</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 font-bold text-slate-900">
                <span>Gross Compensation:</span>
                <span>₹78,080</span>
              </div>
              <div className="flex justify-between py-1 text-rose-600">
                <span>Deductions (EPF + Tax + EMI):</span>
                <span>- ₹23,880</span>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-700 block">Take-Home Net Pay</span>
                  <span className="text-xl font-black text-purple-950 font-serif">₹54,200</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-1 rounded-lg">
                  Direct Bank Credit
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPayslip}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download Oct 2026 Payslip (PDF)</span>
          </button>
        </div>

      </div>

    </div>
  );
}
