import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Crown, 
  Calculator, 
  GitBranch, 
  GraduationCap, 
  Users, 
  Smartphone, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Sparkles,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

const portals = [
  {
    id: 'school-admin',
    name: 'School Admin Panel',
    role: 'Principal / Institutional Admin',
    badge: 'Main Core ERP',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Building2,
    iconBg: 'bg-blue-600 text-white',
    path: '/',
    port: 5173,
    description: 'Comprehensive school operations: Student admissions, HR & payroll, exams, finance, QR attendance, and transport.',
    features: ['Student Admissions & Directory', 'Fee Collection & Dues', 'Offline & Online Exams', 'HR & Biometric Attendance'],
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    isCurrent: true
  },
  {
    id: 'superadmin',
    name: 'Super Admin Dashboard',
    role: 'Platform Owner / SuperAdmin',
    badge: 'SaaS Platform Control',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Crown,
    iconBg: 'bg-purple-600 text-white',
    path: '/portal/superadmin',
    port: 5179,
    description: 'Multi-tenant SaaS oversight: Monitor schools, configure subscription plans, billing gateways, and platform settings.',
    features: ['Multi-School Directory', 'Subscription & SaaS Plans', 'Gateways & WhatsApp DLT', 'Platform Analytics'],
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    isCurrent: false
  },
  {
    id: 'accountant',
    name: 'Accountant Portal',
    role: 'Chief Accountant / Bursar',
    badge: 'Finance & Accounts',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: Calculator,
    iconBg: 'bg-emerald-600 text-white',
    path: '/portal/accountant',
    port: 5178,
    description: 'Specialized ledger & cashflow: Day book, fee challan generation, income & expense vouchers, student due fees audit.',
    features: ['Daily Cash/Bank DayBook', 'Voucher Ledger & Heads', 'Counter Fee Collection', 'Central DB Synced'],
    credentials: { email: 'accountant@allcoresolution.com', pass: 'admin@123' },
    isCurrent: false
  },
  {
    id: 'branch-admin',
    name: 'Branch Admin Portal',
    role: 'Branch General Manager / COO',
    badge: 'Branch Multi-Campus',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: GitBranch,
    iconBg: 'bg-amber-600 text-white',
    path: '/portal/branch-admin',
    port: 5174,
    description: 'Multi-branch operations: Inter-campus resource audits, branch directors directory, centralized billing templates.',
    features: ['Branch Directory & Stats', 'Cross-Campus Fee Tracking', 'Report Templates Master', 'Central DB Synced'],
    credentials: { email: 'admin@branch.com', pass: 'admin@123' },
    isCurrent: false
  },
  {
    id: 'teacher',
    name: 'Teacher Panel',
    role: 'Faculty / Class Teacher',
    badge: 'Academic Faculty',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    icon: GraduationCap,
    iconBg: 'bg-teal-600 text-white',
    path: '/portal/teacher',
    port: 5177,
    description: 'Classroom management: Period timetable, student attendance, lesson planning, marks entry, and homework.',
    features: ['Classroom Attendance', 'Marks & Exam Schedules', 'Homework & Study Material', 'Student Progress Notes'],
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    isCurrent: false
  },
  {
    id: 'student',
    name: 'Student & Parents Portal',
    role: 'Students & Guardians',
    badge: 'Parent Self-Service',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    icon: Users,
    iconBg: 'bg-rose-600 text-white',
    path: '/portal/student',
    port: 5175,
    description: 'Personal academic portal: Online fee payment, report cards, class timetable, homework submission, and notices.',
    features: ['Fee Payment & Due Receipts', 'Academic Report Cards', 'Notice Board & Calendar', 'Attendance History'],
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    isCurrent: false
  },
  {
    id: 'app',
    name: 'Flutter Mobile App',
    role: 'Cross-Platform Mobile App',
    badge: 'Android & iOS App',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: Smartphone,
    iconBg: 'bg-indigo-600 text-white',
    path: '/portal/app',
    port: null,
    description: 'Native Flutter mobile application for students, parents, and teachers with push notifications and live tracking.',
    features: ['Native iOS & Android', 'Push Notifications', 'Offline Caching Support', 'Live Bus Tracking Ready'],
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    isCurrent: false
  }
];

export default function PortalHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Unified ERP Ecosystem
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                All Portals Hub <span className="text-blue-400">@ localhost:5173</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                Seamlessly access every role-based portal (Super Admin, School Admin, Accountant, Branch Admin, Teacher, and Student/Parent) directly on this single host.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-slate-200 backdrop-blur-sm">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>MongoDB: <strong className="text-white">school_erp</strong></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-slate-200 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Backend Port: <strong className="text-white">5050</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Portals */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portals.map((p) => {
          const Icon = p.icon;
          return (
            <div 
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group hover:border-blue-300"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100 flex-1">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${p.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 mb-3">{p.role}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {p.description}
                </p>

                {/* Features Pill */}
                <div className="space-y-1.5 mb-4">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Credentials Box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                    <span><strong className="text-slate-800">{p.credentials.email}</strong> / {p.credentials.pass}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => navigate(p.path)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    p.isCurrent 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                      : 'bg-slate-900 hover:bg-blue-600 text-white shadow-sm'
                  }`}
                >
                  <span>{p.isCurrent ? 'Current Dashboard' : 'Open Inside localhost:5173'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {p.port && (
                  <a
                    href={`http://localhost:${p.port}`}
                    target="_blank"
                    rel="noreferrer"
                    title={`Open standalone on port ${p.port}`}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
