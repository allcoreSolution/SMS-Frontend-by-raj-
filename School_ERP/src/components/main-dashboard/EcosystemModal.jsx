import React, { useState } from 'react';
import { 
  X, Search, Layers, UserCheck, ClipboardCheck, Users, Activity, FileText, 
  MonitorPlay, BookOpen, Settings, ShieldCheck, CreditCard, Calendar,
  Briefcase, ArrowRightLeft, DollarSign, Download, Upload, Receipt, Layout,
  Layers as LayersIcon, MapPin, Play, Plus, Book, FileDigit, Plane, MessageSquare, 
  Mail, PhoneCall, Bus, Truck, Star, Award, GraduationCap, Clock, HelpCircle, User,
  Megaphone, Gift
} from 'lucide-react';

const allModules = [
  // Finance & Fees
  { name: 'Fees Dashboard', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Collect Fees', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Search Due Fees', icon: Search, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'All Transactions', icon: ArrowRightLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Online Transactions', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Fee Challans', icon: Receipt, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Assign Fees', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Fees Carry Forward', icon: ArrowRightLeft, color: 'text-amber-700', bg: 'bg-amber-50' },
  { name: 'Fee Groups', icon: LayersIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Fees Discount', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Fee Types', icon: Briefcase, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Generate Due Slip', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Due Slip History', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Fee Data Audit', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Import Center', icon: Download, color: 'text-orange-500', bg: 'bg-orange-50' },
  
  // Accounts
  { name: 'Accounts Dashboard', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Income', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Expense', icon: ArrowRightLeft, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Income Heads', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Expense Heads', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-50' },
  
  // Student
  { name: 'Student Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Student Admission', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Student List', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Search by Photo', icon: Search, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'TC & Exit', icon: Upload, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Health Records', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },

  // Academics
  { name: 'Academic Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Academic Sessions', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Classes', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Sections', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Subjects', icon: Book, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Assign Subjects', icon: BookOpen, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Assign Electives', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Assign Class Teacher', icon: User, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Manage Periods', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Class Timetable', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Promote Students', icon: Upload, color: 'text-emerald-500', bg: 'bg-emerald-50' },

  // Operations
  { name: 'Website Overview', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Visitor Book', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Complaints', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Postal Records', icon: Mail, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Gate Passes', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Gate Terminal', icon: MonitorPlay, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  
  // Leads & Exams
  { name: 'Lead Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Lead Pipeline', icon: LayersIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Exam Dashboard', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Manage Offline Exams', icon: FileDigit, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Enter Marks', icon: FileDigit, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Generate Marksheet', icon: Download, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  
  // CBC
  { name: 'CBC Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Strands & Outcomes', icon: ListIcon, color: 'text-white', bg: 'bg-emerald-500', active: true },
  { name: 'CBC Assessments', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Core Competencies', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Pathways & Tracks', icon: MapPin, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'CBC Reports', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },

  // HR
  { name: 'HR Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Staff Directory', icon: Users, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Staff Attendance', icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Payroll', icon: Receipt, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Approve Leave', icon: CheckCircle2Icon, color: 'text-orange-500', bg: 'bg-orange-50' },

  // PTM
  { name: 'PTM Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'PTM Reports', icon: FileText, color: 'text-white', bg: 'bg-orange-500', active: true },
  
  // Lesson Planner & OSM
  { name: 'Lesson Planner Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Lesson Plans', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Lesson Planner Guide', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Lesson Plan Review', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Lesson Plan Approvals', icon: CheckCircle2Icon, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'OSM Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'QR Attendance', icon: MonitorPlay, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Face Monitoring', icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-50' },

  // Survey & Compliance
  { name: 'Assessment Reports', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Survey Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Compliance Overview', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Data Validator', icon: CheckCircle2Icon, color: 'text-orange-700', bg: 'bg-orange-50' },
  { name: 'Government Reports', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Live Class Settings', icon: Settings, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Apps Center', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },

  // Resources & Library
  { name: 'Reports & Analytics', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Manage Syllabus', icon: LayersIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Classwork & Logbook', icon: Book, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Manage Resources', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Compose Broadcast', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Notice Board', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50' },
  
  // Inventory & Fleet 
  { name: 'Inventory Dashboard', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Add Stock', icon: Plus, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Suppliers', icon: Truck, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Point of Sale', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Transport Dashboard', icon: Bus, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'AI Chatbot', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Asset Depreciation', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },

  // Settings & System
  { name: 'Birthday Manager', icon: Gift, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'School Settings', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100' },
  { name: 'Roles & Permissions', icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-100' },
  { name: 'Subscription', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Backup Management', icon: Download, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Messages', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' },
  // Expanded 238 Modules
  { name: 'Transport Routes', icon: Search, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Vehicle Management', icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Driver Details', icon: UserCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Transport Alloc', icon: ClipboardCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Fuel Tracking', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Vehicle Mtce', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'GPS Tracking', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Hostel Rooms', icon: MonitorPlay, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Room Category', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Mess Menu', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Hostel Allocations', icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Room Checklist', icon: CreditCard, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Hostel Billing', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Alumni Directory', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Alumni Events', icon: ArrowRightLeft, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Job Portal', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Donations', icon: Download, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Mentorship', icon: Upload, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Lib Authors', icon: Receipt, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Lib Publishers', icon: Layout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Lib Categories', icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Add Book', icon: Play, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Issue Book', icon: Plus, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Return Book', icon: Book, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Overdue Fines', icon: FileDigit, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Parent Portal Config', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Student Portal Config', icon: Mail, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'App Settings', icon: PhoneCall, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'SMS Gateway', icon: Bus, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Email Gateway', icon: Truck, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Push Notifications', icon: Star, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Sys Audit Trail', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'API Docs', icon: GraduationCap, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Webhooks', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'General Setup', icon: HelpCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Branch Details', icon: User, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Academic Year', icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Roles', icon: Gift, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Permission Control', icon: Search, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Certificates Gen', icon: Layers, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'ID Card Gen', icon: UserCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Print Queue', icon: ClipboardCheck, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Disciplinary Logs', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Medical Logs', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Inquiries', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Follow-ups', icon: MonitorPlay, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Conversion Rates', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Campaigns', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Lead Data', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Leave Types', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Manage Staff Leave', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Biometric Logs', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Shift Config', icon: ArrowRightLeft, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Timesheets', icon: DollarSign, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Staff Appraisals', icon: Download, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Feedback Forms', icon: Upload, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Create Survey', icon: Receipt, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Survey Responses', icon: Layout, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Homework Upload', icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Student Assignments', icon: Play, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Assess Homework', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Daily Notes', icon: Book, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Timetable Generator', icon: FileDigit, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Substitute Teachers', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Rooms', icon: Mail, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Offline Exams', icon: PhoneCall, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Exam Timetable', icon: Bus, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Marks Entry', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Gradebook', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Sports Events', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Equipment Inventory', icon: GraduationCap, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Tournaments', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Fitness Records', icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Cafeteria Menu', icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'POS Counter', icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Student Wallets', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Canteen Orders', icon: Search, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Lost & Found', icon: Layers, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Helpdesk', icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'IT Tickets', icon: ClipboardCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Repair Requests', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Counseling', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Student Meetings', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Behavior Logs', icon: MonitorPlay, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Parent Consultations', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Staff Training', icon: Settings, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Workshops', icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Seminar Schedule', icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'PD Hours', icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Vendors', icon: Briefcase, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Supplier Payments', icon: ArrowRightLeft, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Purchase Requisitions', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Tenders', icon: Download, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Budget Prep', icon: Upload, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Budget Tracking', icon: Receipt, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Investment Logs', icon: Layout, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Fixed Assets', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Tax Forms', icon: Play, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Audit Prep', icon: Plus, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Financial Reports', icon: Book, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Petty Cash', icon: FileDigit, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Safety Config', icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Fire Drills', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Security Logs', icon: PhoneCall, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Gate Entry Alerts', icon: Bus, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Online Class links', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Zoom Meeting setup', icon: Star, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'GMeet Invites', icon: Award, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Recorded Lessons', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'E-Library', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Digital Resources', icon: HelpCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Subject Notes', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Question Banks', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Alumni Hub', icon: Gift, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Placement Data', icon: Search, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Company List', icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Interview Schedule', icon: UserCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Skill Badges', icon: ClipboardCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Gamification Settings', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Student Awards', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Certification Check', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Data Export', icon: MonitorPlay, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Import Utilities', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Database Backup', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Theme Setup', icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Localization', icon: CreditCard, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Course Builder', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Video Library', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Discussion Forums', icon: ArrowRightLeft, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'General Ledger', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Tax Compliance', icon: Download, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Vendor Payments', icon: Upload, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Facility Booking', icon: Receipt, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Hostel Maintenance', icon: Layout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Campus Security', icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Event Management', icon: Play, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Medical Records', icon: Plus, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Grievance Unit', icon: Book, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Survey Builder', icon: FileDigit, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Polls & Feedback', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Email Campaigns', icon: Mail, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Custom Reports', icon: PhoneCall, color: 'text-purple-500', bg: 'bg-purple-50' }
];

function CheckCircle2Icon(props) {
  return <Award {...props} />;
}
function ListIcon(props) {
  return <LayersIcon {...props} />
}

const EcosystemModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = allModules.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/5 relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex gap-4 items-center">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-none text-indigo-600 shadow-sm ring-1 ring-indigo-500/10">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">All Ecosystem Modules</h2>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">Explore the full comprehensive suite of 237 premium modules.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-none bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-slate-100/80 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)] z-10 relative">
          <div className="relative group">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search all modules..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200/80 hover:border-indigo-300 rounded-none text-sm focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 shadow-inner" 
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]/50">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((app, idx) => (
              <div 
                key={idx} 
                className={`group flex flex-col items-center justify-center p-3 rounded-none transition-all duration-300 cursor-pointer bg-white ${
                  app.active 
                    ? 'border border-indigo-500 bg-indigo-50/20 shadow-sm ring-2 ring-indigo-500/10 scale-[1.02]' 
                    : 'border border-slate-200/70 hover:border-indigo-200 hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] hover:-translate-y-0.5'
                }`}
              >
                <div className={`w-10 h-10 rounded-none flex items-center justify-center mb-2.5 ${app.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <app.icon className={`w-5 h-5 ${app.color}`} />
                </div>
                <span className={`text-[11px] font-bold text-center leading-tight px-1 ${app.active ? 'text-indigo-700' : 'text-slate-600 group-hover:text-indigo-900 transition-colors'}`}>
                  {app.name}
                </span>
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400">
                <div className="bg-slate-100 p-6 rounded-none mb-4">
                  <Search className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-500">No modules found matching "{search}"</p>
                <p className="text-sm font-medium text-slate-400 mt-1">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default EcosystemModal;
