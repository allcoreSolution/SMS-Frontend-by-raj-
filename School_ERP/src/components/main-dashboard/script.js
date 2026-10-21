const fs = require('fs');

let lines = fs.readFileSync('EcosystemModal.jsx', 'utf8').split('\n');

let existingLinesCount = lines.length;

let startIndex = -1;
let endIndex = -1;

for(let i = 0; i < lines.length; i++) {
    if(lines[i].includes('const allModules = [')) startIndex = i;
    if(lines[i].trim() === '];' && startIndex !== -1 && endIndex === -1) endIndex = i;
}

if(startIndex === -1 || endIndex === -1) {
    console.error('Could not find allModules array bounds');
    process.exit(1);
}

let beforeArray = lines.slice(0, startIndex);
let afterArray = lines.slice(endIndex + 1);
let existingArrayContent = lines.slice(startIndex + 1, endIndex);

let existingCount = 0;
for(let line of existingArrayContent) {
    if(line.includes('{ name:')) existingCount++;
}

console.log('Currently found ' + existingCount + ' modules.');

let needed = 238 - existingCount;

const icons = ['Search', 'Layers', 'UserCheck', 'ClipboardCheck', 'Users', 'Activity', 'FileText', 'MonitorPlay', 'BookOpen', 'Settings', 'ShieldCheck', 'CreditCard', 'Calendar', 'Briefcase', 'ArrowRightLeft', 'DollarSign', 'Download', 'Upload', 'Receipt', 'Layout', 'MapPin', 'Play', 'Plus', 'Book', 'FileDigit', 'MessageSquare', 'Mail', 'PhoneCall', 'Bus', 'Truck', 'Star', 'Award', 'GraduationCap', 'Clock', 'HelpCircle', 'User', 'Megaphone', 'Gift'];
const colors = ['text-blue-500', 'text-emerald-500', 'text-orange-500', 'text-purple-500', 'text-rose-500', 'text-slate-500'];
const bgs = ['bg-blue-50', 'bg-emerald-50', 'bg-orange-50', 'bg-purple-50', 'bg-rose-50', 'bg-slate-100'];

const baseNames = [
  "Transport Routes", "Vehicle Management", "Driver Details", "Transport Alloc", "Fuel Tracking", "Vehicle Mtce", "GPS Tracking",
  "Hostel Rooms", "Room Category", "Mess Menu", "Hostel Allocations", "Room Checklist", "Hostel Billing",
  "Alumni Directory", "Alumni Events", "Job Portal", "Donations", "Mentorship",
  "Lib Authors", "Lib Publishers", "Lib Categories", "Add Book", "Issue Book", "Return Book", "Overdue Fines",
  "Parent Portal Config", "Student Portal Config", "App Settings", "SMS Gateway", "Email Gateway", 
  "Push Notifications", "Sys Audit Trail", "API Docs", "Webhooks",
  "General Setup", "Branch Details", "Academic Year", "Roles", "Permission Control",
  "Certificates Gen", "ID Card Gen", "Print Queue", "Disciplinary Logs", "Medical Logs",
  "Inquiries", "Follow-ups", "Conversion Rates", "Campaigns", "Lead Data",
  "Leave Types", "Manage Staff Leave", "Biometric Logs", "Shift Config", "Timesheets", "Staff Appraisals",
  "Feedback Forms", "Create Survey", "Survey Responses",
  "Homework Upload", "Student Assignments", "Assess Homework", "Daily Notes",
  "Timetable Generator", "Substitute Teachers", "Rooms", 
  "Offline Exams", "Exam Timetable", "Marks Entry", "Gradebook",
  "Sports Events", "Equipment Inventory", "Tournaments", "Fitness Records",
  "Cafeteria Menu", "POS Counter", "Student Wallets", "Canteen Orders",
  "Lost & Found", "Helpdesk", "IT Tickets", "Repair Requests",
  "Counseling", "Student Meetings", "Behavior Logs", "Parent Consultations",
  "Staff Training", "Workshops", "Seminar Schedule", "PD Hours",
  "Vendors", "Supplier Payments", "Purchase Requisitions", "Tenders",
  "Budget Prep", "Budget Tracking", "Investment Logs", "Fixed Assets",
  "Tax Forms", "Audit Prep", "Financial Reports", "Petty Cash",
  "Safety Config", "Fire Drills", "Security Logs", "Gate Entry Alerts",
  "Online Class links", "Zoom Meeting setup", "GMeet Invites", "Recorded Lessons",
  "E-Library", "Digital Resources", "Subject Notes", "Question Banks",
  "Alumni Hub", "Placement Data", "Company List", "Interview Schedule",
  "Skill Badges", "Gamification Settings", "Student Awards", "Certification Check",
  "Data Export", "Import Utilities", "Database Backup", "Theme Setup", "Localization"
];

let addedItems = [];

for(let i = 0; i < needed; i++) {
  let name = baseNames[i] || ('Advanced Module ' + (i+1));
  let icon = icons[i % icons.length];
  let colorIdx = i % colors.length;
  let color = colors[colorIdx];
  let bg = bgs[colorIdx];
  addedItems.push('  { name: \'' + name + '\', icon: ' + icon + ', color: \'' + color + '\', bg: \'' + bg + '\' },');
}

let newLines = [
    ...beforeArray,
    'const allModules = [',
    ...existingArrayContent,
    '  // Extended Array (Auto Generated)',
    ...addedItems,
    '];',
    ...afterArray
];

fs.writeFileSync('EcosystemModal.jsx', newLines.join('\n'));
console.log('Added ' + needed + ' items. Total items should be exactly 238.');
