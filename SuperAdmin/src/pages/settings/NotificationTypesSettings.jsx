import React, { useState, useMemo } from 'react';
import {
  Lock, Bell, CheckCircle2, PauseCircle, Search, Edit3, Settings,
  X, Check, Sparkles, MessageSquare, Smartphone, Mail, Copy, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import SettingsLayout from '../../components/SettingsLayout';

const INITIAL_NOTIF_TYPES = [
  {
    id: 'lead_application_request',
    name: 'Lead Application Request',
    key: 'lead_application_request',
    desc: 'Asks an applicant to complete their admission application on the public self-service page.',
    active: true,
    isSystem: false,
    icon: 'ℹ️',
    color: 'bg-pink-100 text-pink-600',
    smsTemplate: 'Dear {applicant_name}, please complete your admission application for {school_name} here: {link}',
    whatsappTemplate: 'Hello {applicant_name}, welcome to {school_name}! Please complete your application: {link}',
    pushTemplate: 'Complete your admission application for {school_name}.'
  },
  {
    id: 'exam_datesheet',
    name: 'Exam Datesheet',
    key: 'exam_datesheet',
    desc: 'Tell parents the datesheet for an exam has been published',
    active: true,
    isSystem: true,
    icon: '📅',
    color: 'bg-blue-100 text-blue-600',
    smsTemplate: 'Exam datesheet for {exam_name} has been published for {student_name}. View in app.',
    whatsappTemplate: 'Dear Parent, datesheet for {exam_name} is released. Download PDF: {link}',
    pushTemplate: 'Datesheet for {exam_name} is now available.'
  },
  {
    id: 'gate_pass_issued',
    name: 'Gate Pass Issued',
    key: 'gate_pass_issued',
    desc: 'Tell a parent a gate pass has been approved for their child',
    active: true,
    isSystem: false,
    icon: '🚪',
    color: 'bg-amber-100 text-amber-600',
    smsTemplate: 'Gate pass #{pass_no} approved for {student_name} on {date}. Collected by: {collector_name}.',
    whatsappTemplate: 'Gate pass approved for {student_name}. Pickup time: {time}. Person: {collector_name}.',
    pushTemplate: 'Gate pass approved for {student_name}.'
  },
  {
    id: 'gate_pass_exit',
    name: 'Gate Pass Exit',
    key: 'gate_pass_exit',
    desc: 'Tell a parent their child has left the campus, and who collected them',
    active: true,
    isSystem: false,
    icon: '↪️',
    color: 'bg-cyan-100 text-cyan-600',
    smsTemplate: '{student_name} has exited campus at {time}. Collected by {collector_name}.',
    whatsappTemplate: 'Campus Exit Alert: {student_name} left at {time} with {collector_name}.',
    pushTemplate: '{student_name} exited school campus.'
  },
  {
    id: 'admission_followup_due',
    name: 'Admission Followup Due',
    key: 'admission_followup_due',
    desc: 'Daily reminder to lead owners about admission follow-up tasks due today or overdue.',
    active: true,
    isSystem: true,
    icon: '🟢',
    color: 'bg-emerald-100 text-emerald-600',
    smsTemplate: 'Reminder: You have {count} admission follow-ups due today in {school_name}.',
    whatsappTemplate: 'Staff Alert: {count} lead follow-up tasks pending today.',
    pushTemplate: '{count} admission follow-ups due today.'
  },
  {
    id: 'assessment_result_published',
    name: 'Assessment Result Published',
    key: 'assessment_result_published',
    desc: 'Sent to a parent/student when a continuous-assessment result is published.',
    active: true,
    isSystem: false,
    icon: '☑️',
    color: 'bg-purple-100 text-purple-600',
    smsTemplate: 'Results for {assessment_name} published for {student_name}. Score: {score}%.',
    whatsappTemplate: 'Assessment Result Released: {student_name} scored {score}% in {subject}.',
    pushTemplate: 'New assessment result published for {student_name}.'
  },
  {
    id: 'staff_birthday',
    name: 'Staff Birthday',
    key: 'staff_birthday',
    desc: 'Sent to staff members on their birthday.',
    active: true,
    isSystem: false,
    icon: '🎂',
    color: 'bg-indigo-100 text-indigo-600',
    smsTemplate: 'Happy Birthday {staff_name}! Wishing you a wonderful year ahead from {school_name}.',
    whatsappTemplate: '🎂 Happy Birthday {staff_name}! Best wishes from all of us at {school_name}. 🎉',
    pushTemplate: 'Happy Birthday {staff_name}! 🎉'
  },
  {
    id: 'student_attendance_absent',
    name: 'Student Attendance Absent',
    key: 'student_attendance_absent',
    desc: 'Sent to parent when student is marked absent during morning attendance roll call.',
    active: true,
    isSystem: false,
    icon: '⚠️',
    color: 'bg-red-100 text-red-600',
    smsTemplate: 'Dear Parent, {student_name} is marked ABSENT today ({date}) at {school_name}.',
    whatsappTemplate: 'Attendance Alert: {student_name} is marked ABSENT today ({date}).',
    pushTemplate: '{student_name} was marked absent today.'
  },
  {
    id: 'fee_due_reminder',
    name: 'Fee Due Reminder',
    key: 'fee_due_reminder',
    desc: 'Remind parents about upcoming fee installment due dates.',
    active: true,
    isSystem: false,
    icon: '💳',
    color: 'bg-emerald-100 text-emerald-600',
    smsTemplate: 'Reminder: Fee installment of {amount} for {student_name} is due on {due_date}. Pay online: {link}',
    whatsappTemplate: 'Fee Reminder: Installment of {amount} for {student_name} is due on {due_date}.',
    pushTemplate: 'Fee due reminder for {student_name}.'
  },
  {
    id: 'fee_payment_receipt',
    name: 'Fee Payment Receipt',
    key: 'fee_payment_receipt',
    desc: 'Instant receipt sent after online or offline fee payment.',
    active: true,
    isSystem: false,
    icon: '🧾',
    color: 'bg-blue-100 text-blue-600',
    smsTemplate: 'Payment Received! {amount} paid for {student_name}. Receipt #{receipt_no}.',
    whatsappTemplate: 'Fee Receipt #{receipt_no}: {amount} successfully received for {student_name}.',
    pushTemplate: 'Fee payment receipt generated.'
  },
  {
    id: 'homework_assigned',
    name: 'Homework Assigned',
    key: 'homework_assigned',
    desc: 'Notify student/parent when new daily homework is published by subject teacher.',
    active: true,
    isSystem: false,
    icon: '📝',
    color: 'bg-yellow-100 text-yellow-700',
    smsTemplate: 'New homework assigned in {subject} for {student_name}. Submission due: {due_date}.',
    whatsappTemplate: 'Homework Alert: {subject} homework assigned for {student_name}. Due: {due_date}.',
    pushTemplate: 'New homework assigned in {subject}.'
  },
  {
    id: 'student_admission_welcome',
    name: 'Student Admission Welcome',
    key: 'student_admission_welcome',
    desc: 'Welcome message with login credentials for newly admitted student.',
    active: true,
    isSystem: false,
    icon: '🎓',
    color: 'bg-teal-100 text-teal-600',
    smsTemplate: 'Welcome to {school_name}! Admission confirmed for {student_name}. User ID: {username}.',
    whatsappTemplate: 'Welcome to {school_name}! 🎉 Credentials for {student_name}: ID: {username}, Password: {password}.',
    pushTemplate: 'Welcome to {school_name}!'
  },
  {
    id: 'staff_leave_approved',
    name: 'Staff Leave Approved',
    key: 'staff_leave_approved',
    desc: 'Notify staff member when leave request is approved or rejected by principal.',
    active: true,
    isSystem: false,
    icon: '🌴',
    color: 'bg-emerald-100 text-emerald-600',
    smsTemplate: 'Your leave application from {start_date} to {end_date} has been APPROVED.',
    whatsappTemplate: 'Leave Update: Your leave from {start_date} to {end_date} is APPROVED by HR.',
    pushTemplate: 'Your leave application has been approved.'
  },
  {
    id: 'library_book_overdue',
    name: 'Library Book Overdue',
    key: 'library_book_overdue',
    desc: 'Alert student/staff to return overdue library books.',
    active: false, // Inactive matching stat count (1 inactive)
    isSystem: false,
    icon: '📚',
    color: 'bg-amber-100 text-amber-700',
    smsTemplate: 'Library Alert: Book "{book_title}" is overdue for {student_name}. Fine: {fine_amount}.',
    whatsappTemplate: 'Library Alert: Please return "{book_title}" issued to {student_name}.',
    pushTemplate: 'Library book overdue alert.'
  },
  {
    id: 'transport_bus_proximity',
    name: 'Transport Bus Proximity',
    key: 'transport_bus_proximity',
    desc: 'Alert parent when school bus reaches pickup/drop stop.',
    active: true,
    isSystem: false,
    icon: '🚌',
    color: 'bg-yellow-100 text-yellow-800',
    smsTemplate: 'Bus Alert: School bus is 5 mins away from your stop ({stop_name}) for {student_name}.',
    whatsappTemplate: '🚌 Bus Tracking: Route #{route_no} is arriving at {stop_name} in 5 minutes.',
    pushTemplate: 'School bus is approaching your stop!'
  },
  {
    id: 'ptm_schedule_notification',
    name: 'PTM Schedule Notification',
    key: 'ptm_schedule_notification',
    desc: 'Invite parents to scheduled Parent Teacher Meetings.',
    active: true,
    isSystem: false,
    icon: '🤝',
    color: 'bg-violet-100 text-violet-600',
    smsTemplate: 'PTM Invitation: Parent Teacher Meeting scheduled on {date} at {time} in {school_name}.',
    whatsappTemplate: 'Dear Parent, you are cordially invited to PTM on {date} at {time}.',
    pushTemplate: 'Parent Teacher Meeting scheduled for {date}.'
  },
  {
    id: 'live_class_schedule',
    name: 'Live Class Schedule',
    key: 'live_class_schedule',
    desc: 'Send online live class joining link to enrolled students.',
    active: true,
    isSystem: false,
    icon: '💻',
    color: 'bg-sky-100 text-sky-600',
    smsTemplate: 'Live Class in {subject} starts at {time}. Join link: {link}',
    whatsappTemplate: 'Online Class Alert: {subject} class starting at {time}. Join: {link}',
    pushTemplate: 'Live class starting soon in {subject}.'
  },
  {
    id: 'exam_result_announcement',
    name: 'Exam Result Announcement',
    key: 'exam_result_announcement',
    desc: 'Notify parents when term report cards are released.',
    active: true,
    isSystem: false,
    icon: '🏆',
    color: 'bg-amber-100 text-amber-600',
    smsTemplate: 'Final Exam results for {exam_name} published for {student_name}. Grade: {grade}.',
    whatsappTemplate: 'Report Card Release: {student_name} achieved Grade {grade} in {exam_name}.',
    pushTemplate: 'Report Card released for {student_name}.'
  },
  {
    id: 'notice_board_broadcast',
    name: 'Notice Board Broadcast',
    key: 'notice_board_broadcast',
    desc: 'Important school announcement or circular broadcast.',
    active: true,
    isSystem: false,
    icon: '📢',
    color: 'bg-red-100 text-red-600',
    smsTemplate: 'Important Notice from {school_name}: {notice_title}. Details in app.',
    whatsappTemplate: '📢 Circular: {notice_title}. Read details: {link}',
    pushTemplate: 'New Circular: {notice_title}'
  },
  {
    id: 'salary_slip_generated',
    name: 'Salary Slip Generated',
    key: 'salary_slip_generated',
    desc: 'Notify employee when monthly salary slip is issued.',
    active: true,
    isSystem: false,
    icon: '💵',
    color: 'bg-emerald-100 text-emerald-600',
    smsTemplate: 'Salary slip for {month} generated for {staff_name}. Net Pay: {net_pay}.',
    whatsappTemplate: 'Payslip Alert: {month} salary credited. Net amount: {net_pay}.',
    pushTemplate: 'Salary slip for {month} is ready.'
  },
  {
    id: 'certificate_issue_alert',
    name: 'Certificate Issue Alert',
    key: 'certificate_issue_alert',
    desc: 'Alert student/parent when TC or Conduct certificate is ready.',
    active: true,
    isSystem: false,
    icon: '📜',
    color: 'bg-purple-100 text-purple-600',
    smsTemplate: 'Certificate #{cert_no} for {student_name} is ready for collection at front desk.',
    whatsappTemplate: 'Certificate Ready: {cert_type} for {student_name} is issued.',
    pushTemplate: 'Certificate is ready for collection.'
  },
  {
    id: 'password_reset_request',
    name: 'Password Reset Request',
    key: 'password_reset_request',
    desc: 'OTP verification code for password reset.',
    active: true,
    isSystem: true,
    icon: '🔑',
    color: 'bg-gray-100 text-gray-700',
    smsTemplate: 'Your OTP to reset password for {school_name} is {otp}. Valid for 10 mins.',
    whatsappTemplate: 'Security Code: Your password reset OTP is *{otp}*. Do not share.',
    pushTemplate: 'Password reset OTP request.'
  },
  {
    id: 'school_trial_expiring',
    name: 'School Trial Expiring',
    key: 'school_trial_expiring',
    desc: 'Remind school admin before trial period expires.',
    active: true,
    isSystem: true,
    icon: '⏳',
    color: 'bg-amber-100 text-amber-700',
    smsTemplate: 'Alert: Your free trial for {school_name} expires in {days} days. Upgrade now.',
    whatsappTemplate: 'Trial Expiry Alert: {days} days left in your SCHOOL ERP trial. Renew: {link}',
    pushTemplate: 'Free trial expiring soon!'
  },
  {
    id: 'school_subscription_renewed',
    name: 'School Subscription Renewed',
    key: 'school_subscription_renewed',
    desc: 'Receipt confirmation on SaaS plan renewal.',
    active: true,
    isSystem: false,
    icon: '🎉',
    color: 'bg-emerald-100 text-emerald-600',
    smsTemplate: 'Subscription renewed! {school_name} plan extended till {valid_till}.',
    whatsappTemplate: 'SaaS Renewal: Thank you for renewing {plan_name} for {school_name}.',
    pushTemplate: 'Subscription successfully renewed.'
  },
  {
    id: 'custom_announcement',
    name: 'Custom Announcement',
    key: 'custom_announcement',
    desc: 'Generic manual notification trigger.',
    active: true,
    isSystem: false,
    icon: '✨',
    color: 'bg-pink-100 text-pink-600',
    smsTemplate: '{message_body}',
    whatsappTemplate: '{message_body}',
    pushTemplate: '{message_body}'
  },
  {
    id: 'emergency_safety_alert',
    name: 'Emergency Safety Alert',
    key: 'emergency_safety_alert',
    desc: 'Urgent safety or weather closure announcement.',
    active: true,
    isSystem: false,
    icon: '🚨',
    color: 'bg-red-100 text-red-600',
    smsTemplate: 'EMERGENCY: {school_name} will remain closed today due to {reason}.',
    whatsappTemplate: '🚨 EMERGENCY ALERT: School closure declared for {date} due to {reason}.',
    pushTemplate: 'Emergency Alert: School closure notice.'
  },
  {
    id: 'event_holiday_reminder',
    name: 'Event Holiday Reminder',
    key: 'event_holiday_reminder',
    desc: 'Notification about upcoming school holiday or event.',
    active: true,
    isSystem: false,
    icon: '🎈',
    color: 'bg-blue-100 text-blue-600',
    smsTemplate: 'Holiday Alert: {school_name} will be closed on {date} for {holiday_name}.',
    whatsappTemplate: '🎈 Holiday Notice: School remains closed on {date} on account of {holiday_name}.',
    pushTemplate: 'Upcoming school holiday notice.'
  },
  {
    id: 'biometric_punch_logged',
    name: 'Biometric Punch Logged',
    key: 'biometric_punch_logged',
    desc: 'Real-time SMS/WhatsApp on student biometric entry.',
    active: true,
    isSystem: false,
    icon: '👆',
    color: 'bg-sky-100 text-sky-600',
    smsTemplate: 'Entry Logged: {student_name} punched in at campus gate at {time}.',
    whatsappTemplate: 'Biometric Entry: {student_name} entered school campus at {time}.',
    pushTemplate: '{student_name} punched in at campus gate.'
  },
  {
    id: 'online_exam_published',
    name: 'Online Exam Published',
    key: 'online_exam_published',
    desc: 'Notify student when online exam test is live.',
    active: true,
    isSystem: false,
    icon: '🎯',
    color: 'bg-indigo-100 text-indigo-600',
    smsTemplate: 'Online Exam for {subject} is now LIVE. Test window closes at {time}. Link: {link}',
    whatsappTemplate: '🎯 Online Test Live: Start test for {subject}: {link}',
    pushTemplate: 'Online test for {subject} is now live.'
  },
  {
    id: 'hostel_room_allocation',
    name: 'Hostel Room Allocation',
    key: 'hostel_room_allocation',
    desc: 'Notify parent when hostel room & bed is allocated.',
    active: true,
    isSystem: false,
    icon: '🏢',
    color: 'bg-amber-100 text-amber-600',
    smsTemplate: 'Hostel Allocated: Room #{room_no}, Bed #{bed_no} assigned for {student_name}.',
    whatsappTemplate: 'Hostel Update: Room #{room_no} allocated to {student_name} at {hostel_name}.',
    pushTemplate: 'Hostel room allocated for {student_name}.'
  }
];

export default function NotificationTypesSettings({ inSettingsCenter = false }) {
  const [types, setTypes] = useState(() => {
    const saved = localStorage.getItem('superadmin_notification_types');
    return saved ? JSON.parse(saved) : INITIAL_NOTIF_TYPES;
  });

  const [demoBanner, setDemoBanner] = useState(false);
  const [search, setSearch] = useState('');

  // Edit Defaults Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [templateForm, setTemplateForm] = useState({ sms: '', whatsapp: '', push: '' });
  const [savedToast, setSavedToast] = useState(false);

  // System Modal State
  const [systemModalItem, setSystemModalItem] = useState(null);

  // Save helper
  const updateAndSave = (newList) => {
    setTypes(newList);
    localStorage.setItem('superadmin_notification_types', JSON.stringify(newList));
  };

  // Filtered list
  const filteredTypes = useMemo(() => {
    return types.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.key.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
    );
  }, [types, search]);

  // Stats calculation
  const totalCount = types.length;
  const activeCount = types.filter(t => t.active).length;
  const inactiveCount = totalCount - activeCount;

  // Toggle active state
  const handleToggleActive = (id) => {
    const updated = types.map(t => t.id === id ? { ...t, active: !t.active } : t);
    updateAndSave(updated);
  };

  // Open Edit Defaults Drawer
  const openEditDefaults = (item) => {
    setEditingItem(item);
    setTemplateForm({
      sms: item.smsTemplate || '',
      whatsapp: item.whatsappTemplate || '',
      push: item.pushTemplate || ''
    });
    setSavedToast(false);
  };

  const handleSaveDefaults = () => {
    if (!editingItem) return;
    const updated = types.map(t => {
      if (t.id === editingItem.id) {
        return {
          ...t,
          smsTemplate: templateForm.sms,
          whatsappTemplate: templateForm.whatsapp,
          pushTemplate: templateForm.push
        };
      }
      return t;
    });
    updateAndSave(updated);
    setSavedToast(true);
    Swal.fire({
      icon: 'success',
      title: 'Templates Saved',
      text: 'Notification templates have been updated.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => {
      setSavedToast(false);
      setEditingItem(null);
    }, 1000);
  };

  const handleExportExcel = () => {
    const headers = ['Event ID', 'Event Name', 'System Key', 'Description', 'Active Status', 'System Type', 'SMS Template', 'WhatsApp Template', 'Push Template'];
    const rows = filteredTypes.map(t => [
      `"${t.id}"`,
      `"${t.name}"`,
      `"${t.key}"`,
      `"${t.desc.replace(/"/g, '""')}"`,
      `"${t.active ? 'Active' : 'Inactive'}"`,
      `"${t.isSystem ? 'System Event' : 'Custom Event'}"`,
      `"${(t.smsTemplate || '').replace(/"/g, '""')}"`,
      `"${(t.whatsappTemplate || '').replace(/"/g, '""')}"`,
      `"${(t.pushTemplate || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `notification_events_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mainContent = (
    <div className="flex flex-col h-full bg-[#f8fafc] text-gray-800 font-sans overflow-hidden">
        
        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1150px] w-full mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Notification types
              </h1>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Platform events that can trigger SMS, WhatsApp & push messages to schools.
              </p>
            </div>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2 rounded-none-none text-xs font-black transition-all shadow-xs shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel / CSV
            </button>
          </div>



          {/* Top 3 Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { label: 'Notification Types', value: totalCount, icon: <Bell className="w-5 h-5 text-sky-500" /> },
              { label: 'Active Events', value: activeCount, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
              { label: 'Inactive Events', value: inactiveCount, icon: <PauseCircle className="w-5 h-5 text-amber-500" /> }
            ].map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-none-none p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                  <div className="w-10 h-10 rounded-none-none bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm">
                    {s.icon}
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="bg-white border border-gray-200/90 rounded-none-none p-3.5 shadow-sm mb-6">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or description"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-none-none text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notification Types List */}
          <div className="bg-white border border-gray-200/90 rounded-none-none overflow-hidden shadow-sm divide-y divide-gray-100 mb-10">
            {filteredTypes.map(item => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-blue-50/20 ${
                  !item.active ? 'bg-gray-50/50 opacity-75' : ''
                }`}
              >
                
                {/* Left: Icon + Title + Key Code Tag + Description */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-none-none ${item.color} font-black text-lg flex items-center justify-center flex-shrink-0 shadow-xs`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                      <code className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-none-none bg-gray-100 text-gray-500 border border-gray-200/60">
                        {item.key}
                      </code>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-1 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Active Tag + Deactivate Button + Edit Defaults / System Button */}
                <div className="flex items-center gap-2.5 justify-end flex-shrink-0">
                  
                  {/* Status Tag */}
                  {item.active ? (
                    <span className="px-2.5 py-1 rounded-none-none text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-none-none text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200/60">
                      Inactive
                    </span>
                  )}

                  {/* Deactivate / Activate Button (Matching red outlined style from screenshot) */}
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    className={`px-3 py-1 rounded-none-none text-xs font-bold transition-all border cursor-pointer ${
                      item.active
                        ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                        : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {item.active ? 'Deactivate' : 'Activate'}
                  </button>

                  {/* Edit Defaults OR System Button */}
                  {item.isSystem ? (
                    <button
                      onClick={() => setSystemModalItem(item)}
                      className="px-3.5 py-1 rounded-none-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings className="w-3 h-3 text-gray-400" /> System
                    </button>
                  ) : (
                    <button
                      onClick={() => openEditDefaults(item)}
                      className="px-3.5 py-1 rounded-none-none bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" /> Edit Defaults
                    </button>
                  )}

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Edit Defaults Drawer */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-[1150px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none-none bg-slate-100 text-sm flex items-center justify-center">{editingItem.icon}</div>
                  <div><h3 className="text-sm font-bold text-slate-900">{editingItem.name}</h3><code className="text-[10px] font-mono text-slate-400">{editingItem.key}</code></div>
                </div>
                <button onClick={() => setEditingItem(null)} className="p-1.5 rounded-none-none text-slate-400 hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div className="bg-blue-50 border border-blue-200/70 rounded-none-none p-3.5 text-xs text-blue-900 leading-relaxed">
                  Use <code className="bg-white px-1 py-0.5 rounded-none-none text-blue-800 font-mono">{'{student_name}'}</code>, <code className="bg-white px-1 py-0.5 rounded-none-none text-blue-800 font-mono">{'{school_name}'}</code>, <code className="bg-white px-1 py-0.5 rounded-none-none text-blue-800 font-mono">{'{date}'}</code> as dynamic placeholders.
                </div>
                {[['sms', 'SMS Template', 'blue', MessageSquare], ['whatsapp', 'WhatsApp Template', 'emerald', Smartphone], ['push', 'Push Notification', 'amber', Bell]].map(([key, label, color, Icon]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 text-${color}-500`} /> {label}
                    </label>
                    {key === 'push'
                      ? <input type="text" value={templateForm[key]} onChange={e => setTemplateForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-none-none px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                      : <textarea rows={3} value={templateForm[key]} onChange={e => setTemplateForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-none-none px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none font-mono" />
                    }
                  </div>
                ))}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Available Placeholders</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['{student_name}','{school_name}','{date}','{time}','{link}','{amount}','{exam_name}'].map(tag => (
                      <button key={tag} type="button" onClick={() => navigator.clipboard.writeText(tag)} className="px-2 py-1 rounded-none-none bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono flex items-center gap-1 cursor-pointer"><Copy className="w-2.5 h-2.5 text-slate-400" /> {tag}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3 flex-shrink-0">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer">Cancel</button>
                <button onClick={handleSaveDefaults} className={`px-5 py-2 rounded-none-none text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${savedToast ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {savedToast ? <><Check className="w-3.5 h-3.5" /> Saved!</> : 'Save Templates'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Info Modal */}
        {systemModalItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[1150px] bg-white rounded-none-none shadow-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-none-none bg-slate-100 text-2xl flex items-center justify-center mx-auto mb-4">{systemModalItem.icon}</div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{systemModalItem.name}</h3>
              <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-none-none block mb-4 w-fit mx-auto">{systemModalItem.key}</code>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">This is a core system event handled automatically by the backend engine. Templates are managed system-wide for security compliance.</p>
              <button onClick={() => setSystemModalItem(null)} className="w-full py-2 rounded-none-none bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer">Close</button>
            </div>
          </div>
        )}

      </div>
  );

  if (inSettingsCenter) {
    return <SettingsLayout activeTab="notif-types">{mainContent}</SettingsLayout>;
  }

  return mainContent;
}
