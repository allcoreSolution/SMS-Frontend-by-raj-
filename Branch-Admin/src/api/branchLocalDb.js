// Reactive, persistent storage for Branch Admin Portal with Central MongoDB synchronization
import axiosInstance from './axios';

const STORAGE_PREFIX = 'branch_admin_db_';

const INITIAL_BRANCHES = [
  {
    id: 'br_01',
    _id: 'br_01',
    name: 'Yug International School (Main Campus)',
    code: 'YUG-MAIN',
    email: 'admin@yug.edu',
    phone: '+91 98765 01234',
    address: 'Sector 14, Civil Lines, Prayagraj, UP',
    plan: 'Enterprise Plan',
    students: 1240,
    staff: 78,
    classes: 24,
    rows: '18,450',
    reg: '15 Jan, 2024',
    sub: 'Yearly',
    renews: '15 Jan, 2027',
    collected: '₹14,25,800',
    collectedRaw: 1425800,
    attendance: '94.2%',
    status: 'Active',
    principal: 'Dr. Anand Verma',
    domain: 'yug.schoolerp.com'
  },
  {
    id: 'br_02',
    _id: 'br_02',
    name: 'SSVP 3.0 Central Academy',
    code: 'SSVP-03',
    email: 'principal@ssvp.ac.in',
    phone: '+91 98111 22334',
    address: 'Ring Road Campus, Lucknow, UP',
    plan: 'Enterprise Plan',
    students: 980,
    staff: 62,
    classes: 18,
    rows: '12,200',
    reg: '08 May, 2024',
    sub: 'Yearly',
    renews: '08 May, 2027',
    collected: '₹9,80,000',
    collectedRaw: 980000,
    attendance: '91.8%',
    status: 'Active',
    principal: 'Mrs. Sunita Sharma',
    domain: 'ssvp.schoolerp.com'
  },
  {
    id: 'br_03',
    _id: 'br_03',
    name: 'Risma High School',
    code: 'RISMA-HS',
    email: 'contact@rismahigh.org',
    phone: '+91 94567 89012',
    address: 'Highland Avenue, Nairobi East',
    plan: 'Growth Plan',
    students: 540,
    staff: 38,
    classes: 12,
    rows: '7,100',
    reg: '24 May, 2024',
    sub: 'Quarterly',
    renews: '24 Nov, 2026',
    collected: '₹4,60,000',
    collectedRaw: 460000,
    attendance: '88.5%',
    status: 'Active',
    principal: 'Mr. David Ngugi',
    domain: 'risma.schoolerp.com'
  },
  {
    id: 'br_04',
    _id: 'br_04',
    name: 'Cloudwave International School',
    code: 'CLOUDWAVE',
    email: 'info@cloudwave.edu',
    phone: '+91 93210 54321',
    address: 'IT City Bypass, Hyderabad, Telangana',
    plan: 'Enterprise Plan',
    students: 760,
    staff: 52,
    classes: 16,
    rows: '9,840',
    reg: '03 Jul, 2024',
    sub: 'Yearly',
    renews: '03 Jul, 2027',
    collected: '₹6,40,000',
    collectedRaw: 640000,
    attendance: '92.4%',
    status: 'Active',
    principal: 'Dr. Raghuveer Reddy',
    domain: 'cloudwave.schoolerp.com'
  },
  {
    id: 'br_05',
    _id: 'br_05',
    name: 'Aksya World School',
    code: 'AKSYA-WS',
    email: 'support@aksyaschool.com',
    phone: '+91 91234 56789',
    address: 'North Extension, Varanasi, UP',
    plan: 'Trial Plan',
    students: 320,
    staff: 24,
    classes: 8,
    rows: '3,200',
    reg: '02 Apr, 2026',
    sub: 'Monthly',
    renews: '02 Nov, 2026',
    collected: '₹1,90,000',
    collectedRaw: 190000,
    attendance: '85.0%',
    status: 'Expiring',
    principal: 'Prof. Meenakshi Dixit',
    domain: 'aksya.schoolerp.com'
  }
];

const INITIAL_PAYMENTS = [
  { id: '#ORD-9024', name: 'Yug International School', plan: 'Enterprise Plan', amount: '₹50,000.00', amountRaw: 50000, method: 'Razorpay', transId: 'pay_NzK891024', proof: 'Verified', status: 'Paid', date: '08 Oct, 2026 11:20 AM' },
  { id: '#ORD-9018', name: 'SSVP 3.0 Central Academy', plan: 'Enterprise Plan', amount: '₹50,000.00', amountRaw: 50000, method: 'UPI / QR', transId: 'upi_9921448102', proof: 'Verified', status: 'Paid', date: '01 Oct, 2026 04:45 PM' },
  { id: '#ORD-8992', name: 'SUDHAKAR Branch', plan: 'Growth Plan', amount: '₹10,000.00', amountRaw: 10000, method: 'Razorpay', transId: 'pay_MxL102934', proof: 'Attached', status: 'Pending', date: '12 Aug, 2026 08:11 PM' },
  { id: '#ORD-8940', name: 'Risma High School', plan: 'Growth Plan', amount: '₹15,000.00', amountRaw: 15000, method: 'Bank Transfer', transId: 'neft_20268819', proof: 'Receipt', status: 'Verify', date: '15 Jul, 2026 02:15 PM' },
  { id: '#ORD-8812', name: 'Aksya World School', plan: 'Enterprise Plan', amount: '₹50,000.00', amountRaw: 50000, method: 'Razorpay', transId: 'pay_KkJ882101', proof: 'Attached', status: 'Pending', date: '02 Apr, 2026 10:26 PM' },
  { id: '#ORD-8750', name: 'Cloudwave International', plan: 'Enterprise Plan', amount: '₹50,000.00', amountRaw: 50000, method: 'Netbanking', transId: 'hdfc_99182301', proof: 'Verified', status: 'Paid', date: '10 Mar, 2026 06:18 PM' }
];

const INITIAL_TEMPLATES = [
  { id: 'tpl_1', name: 'CBSE Secondary Marksheet 2026', category: 'Marksheet', count: 24, orientation: 'Portrait', previewType: 'marksheet', desc: 'Official grade sheet with subject-wise theory & practical marks distribution' },
  { id: 'tpl_2', name: 'Student RFID Identity Card (Blue Crest)', category: 'Id Card', count: 19, orientation: 'Vertical (CR80)', previewType: 'id_student', desc: 'Standard plastic card with student photo, barcode, blood group & contact' },
  { id: 'tpl_3', name: 'Official Term Tuition Fee Receipt', category: 'Fee Receipt', count: 15, orientation: 'A5 Half Page', previewType: 'receipt', desc: 'Counter receipt with tax invoice breakdown, receipt number & QR seal' },
  { id: 'tpl_4', name: 'Teacher & Administrative Staff ID', category: 'Staff Id Card', count: 14, orientation: 'Vertical (CR80)', previewType: 'id_staff', desc: 'Employee identity pass with designation, staff ID, emergency contact & chip' },
  { id: 'tpl_5', name: 'Bonafide Student Certificate', category: 'Bonafide', count: 9, orientation: 'A4 Landscape', previewType: 'certificate', desc: 'Institutional verification letterhead for passport, bus pass & bank loans' },
  { id: 'tpl_6', name: 'School Transfer Certificate (TC)', category: 'Transfer Certificate', count: 9, orientation: 'A4 Portrait', previewType: 'certificate', desc: 'Official withdrawal record with conduct remarks and admission book number' },
  { id: 'tpl_7', name: 'Mid-Term Examination Admit Card', category: 'Admit Card', count: 8, orientation: 'A5 Landscape', previewType: 'admit_card', desc: 'Hall ticket with roll number, exam center, timetable & student photo' },
  { id: 'tpl_8', name: 'Student Character & Conduct Certificate', category: 'Character Certificate', count: 8, orientation: 'A4 Landscape', previewType: 'certificate', desc: 'Good conduct testimonial endorsed by Principal and academic council' },
  { id: 'tpl_9', name: 'Diwali & Dussehra Festival Banner', category: 'Festival Banner', count: 9, orientation: 'Digital Square', previewType: 'banner', desc: 'Social media & school app broadcast graphic with institution branding' },
  { id: 'tpl_10', name: 'Student Birthday Card & Greeting', category: 'Birthday Card', count: 6, orientation: 'Postcard', previewType: 'birthday', desc: 'Personalized birthday greeting sent to student parent mobile portal' },
  { id: 'tpl_11', name: 'Annual Sports Day Merit Certificate', category: 'Certificate', count: 2, orientation: 'A4 Landscape Gold', previewType: 'certificate', desc: 'Gold embossed certificate for athletics, football & inter-house competitions' },
  { id: 'tpl_12', name: 'Academic Excellence Award 2026', category: 'Academic', count: 1, orientation: 'A4 Landscape', previewType: 'certificate', desc: 'Top scholar honour roll with principal signature & school seal' }
];

const INITIAL_COLLECTIONS = [
  { id: 'col_01', date: '12 Oct, 2026', time: '11:42 AM', receipt: '#YUG-26-27-0104', studentName: 'Aarav Sharma', admNo: 'Adm: 2401', school: 'Yug International School', method: 'UPI/QR', amount: '8,500.00', amountRaw: 8500, class: 'Class 10-A' },
  { id: 'col_02', date: '11 Oct, 2026', time: '02:15 PM', receipt: '#SSVP-26-27-0092', studentName: 'Priya Patel', admNo: 'Adm: 2180', school: 'SSVP 3.0 Central Academy', method: 'CASH', amount: '6,200.00', amountRaw: 6200, class: 'Class 8-B' },
  { id: 'col_03', date: '10 Oct, 2026', time: '10:08 AM', receipt: '#YUG-26-27-0102', studentName: 'Rohan Gupta', admNo: 'Adm: 2314', school: 'Yug International School', method: 'CHEQUE', amount: '12,000.00', amountRaw: 12000, class: 'Class 12-PCM' },
  { id: 'col_04', date: '09 Oct, 2026', time: '04:30 PM', receipt: '#CW-26-27-0051', studentName: 'Kavya Reddy', admNo: 'Adm: 1944', school: 'Cloudwave International', method: 'ONLINE', amount: '15,000.00', amountRaw: 15000, class: 'Class 9-C' },
  { id: 'col_05', date: '08 Oct, 2026', time: '01:22 PM', receipt: '#RSM-26-27-0038', studentName: 'Brian Kiprono', admNo: 'Adm: 1802', school: 'Risma High School', method: 'CASH', amount: '4,500.00', amountRaw: 4500, class: 'Class 7-A' },
  { id: 'col_06', date: '05 Oct, 2026', time: '09:18 AM', receipt: '#AKS-26-27-0019', studentName: 'Ananya Mishra', admNo: 'Adm: 2210', school: 'Aksya World School', method: 'UPI/QR', amount: '5,000.00', amountRaw: 5000, class: 'Class 5-B' }
];

const INITIAL_LOGIN_LOGS = [
  { id: 'log_01', name: 'Rajesh Kumar (Accountant)', email: 'accountant@yug.edu', school: 'Yug International School', role: 'Staff Accountant', ip: '103.212.14.88', device: 'Chrome 129 / Windows 11', time: '25 mins ago', timestamp: '12 Oct 05:15 PM', status: 'Success' },
  { id: 'log_02', name: 'Dr. Anand Verma', email: 'principal@yug.edu', school: 'Yug International School', role: 'School Admin', ip: '103.212.14.82', device: 'Safari 18 / macOS', time: '2 hours ago', timestamp: '12 Oct 03:30 PM', status: 'Success' },
  { id: 'log_03', name: 'Sunita Sharma', email: 'principal@ssvp.ac.in', school: 'SSVP 3.0 Central Academy', role: 'School Admin', ip: '49.36.180.12', device: 'Edge 128 / Windows 10', time: '5 hours ago', timestamp: '12 Oct 12:45 PM', status: 'Success' },
  { id: 'log_04', name: 'David Ngugi', email: 'admin@rismahigh.org', school: 'Risma High School', role: 'Branch Manager', ip: '197.232.8.44', device: 'Firefox 130 / Ubuntu', time: '8 hours ago', timestamp: '12 Oct 09:12 AM', status: 'Success' },
  { id: 'log_05', name: 'Raghuveer Reddy', email: 'director@cloudwave.edu', school: 'Cloudwave International', role: 'School Admin', ip: '157.48.210.9', device: 'Chrome 129 / Android 14', time: '1 day ago', timestamp: '11 Oct 06:20 PM', status: 'Success' },
  { id: 'log_06', name: 'Meenakshi Dixit', email: 'admin@aksyaschool.com', school: 'Aksya World School', role: 'School Admin', ip: '106.208.77.3', device: 'Chrome 128 / Windows 10', time: '1 day ago', timestamp: '11 Oct 02:40 PM', status: 'Success' }
];

const INITIAL_PROFILE = {
  name: 'Branch General Manager',
  email: 'admin@branch.com',
  phone: '+91 98765 00001',
  role: 'Chief Operations Officer (COO)',
  department: 'Multi-Branch Administration',
  staffId: 'HQ-BM-001',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
  timezone: 'Asia/Kolkata (IST +05:30)',
  language: 'English (US)'
};

const INITIAL_NOTIFICATIONS = [
  { id: 'notif_1', title: 'New Q3 Fee Clearance Batch', desc: 'Yug International School collected ₹1.82L in counter fees today.', time: '10 mins ago', tag: 'Collections', read: false },
  { id: 'notif_2', title: 'Branch Subscription Renewal Due', desc: 'Aksya World School trial plan expires in 21 days. Review upgrade quote.', time: '1 hour ago', tag: 'Billing', read: false },
  { id: 'notif_3', title: 'System Security Audit Completed', desc: 'Zero unauthorized login anomalies detected across all 5 campuses.', time: '3 hours ago', tag: 'Security', read: true },
  { id: 'notif_4', title: 'Staff EPF Compliance Reminder', desc: 'Statutory compliance deposit scheduled for Oct 18 across all network branches.', time: '1 day ago', tag: 'Compliance', read: true }
];

function getStore(key, initialData) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return initialData;
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw || raw === 'undefined' || raw === 'null') {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initialData));
      return initialData;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(initialData)) {
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initialData));
        return initialData;
      }
    }
    return parsed || initialData;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return initialData;
  }
}

function setStore(key, data) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const branchLocalDb = {
  // Sync with central backend database
  async syncFromBackend() {
    try {
      const res = await axiosInstance.get('/branches');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const mapped = res.data.data.map((b, index) => ({
          id: b._id || b.id || `br_${index + 1}`,
          _id: b._id || b.id || `br_${index + 1}`,
          name: b.branchName || b.name || 'Campus Branch',
          code: b.branchCode || b.code || `BR-0${index + 1}`,
          email: b.contactEmail || b.email || 'admin@branch.edu',
          phone: b.contactPhone || b.phone || '+91 98765 00000',
          address: b.address || 'Central City Campus',
          principal: b.principalName || b.principal || 'Principal',
          plan: b.subscriptionPlan || b.plan || 'Enterprise Plan',
          students: Number(b.students) || 850,
          staff: Number(b.staff) || 54,
          classes: Number(b.classes) || 16,
          attendance: b.attendance || '93.5%',
          collected: b.collected || '₹8,50,000',
          collectedRaw: Number(b.collectedRaw) || 850000,
          rows: b.rows || '12,500',
          reg: b.reg || (b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Jan, 2024'),
          sub: b.sub || 'Yearly',
          renews: b.renews || 'Annual',
          status: b.status || (b.isActive === false ? 'Inactive' : 'Active'),
          domain: b.domain || `${(b.branchCode || b.code || 'branch').toLowerCase()}.schoolerp.com`
        }));
        setStore('branches', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Branch sync notice:', e.message);
    }
    return getStore('branches', INITIAL_BRANCHES);
  },

  // Branches
  getBranches: () => getStore('branches', INITIAL_BRANCHES),
  saveBranches: (list) => setStore('branches', list),
  addBranch: (newBranch) => {
    const list = getStore('branches', INITIAL_BRANCHES);
    const item = {
      ...newBranch,
      id: `br_${Date.now()}`,
      _id: `br_${Date.now()}`,
      students: Number(newBranch.students || 0),
      staff: Number(newBranch.staff || 0),
      classes: Number(newBranch.classes || 0),
      collected: newBranch.collected || '₹0',
      collectedRaw: Number(newBranch.collectedRaw || 0),
      reg: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: newBranch.status || 'Active'
    };
    const updated = [item, ...list];
    setStore('branches', updated);

    // Asynchronously create in central MongoDB
    axiosInstance.post('/branches', {
      branchName: newBranch.name || newBranch.branchName,
      branchCode: newBranch.code || newBranch.branchCode || `BR-${Date.now().toString().slice(-4)}`,
      address: newBranch.address || 'Main Campus',
      contactEmail: newBranch.email || newBranch.contactEmail,
      contactPhone: newBranch.phone || newBranch.contactPhone,
      principalName: newBranch.principal || newBranch.principalName,
      subscriptionPlan: newBranch.plan?.includes('Enterprise') ? 'Enterprise' : (newBranch.plan?.includes('Pro') ? 'Pro' : 'Basic'),
      status: newBranch.status || 'Active'
    }).then(res => {
      if (res.data?.data?._id) {
        item._id = res.data.data._id;
        item.id = res.data.data._id;
        setStore('branches', [item, ...list]);
      }
    }).catch(err => {
      console.warn('Branch create backend sync error:', err.message);
    });

    return item;
  },
  updateBranch: (id, updates) => {
    const list = getStore('branches', INITIAL_BRANCHES);
    const updated = list.map(b => (b.id === id || b._id === id) ? { ...b, ...updates } : b);
    setStore('branches', updated);

    // Asynchronously update in central MongoDB
    axiosInstance.put(`/branches/${id}`, {
      ...(updates.name && { branchName: updates.name }),
      ...(updates.code && { branchCode: updates.code }),
      ...(updates.address && { address: updates.address }),
      ...(updates.email && { contactEmail: updates.email }),
      ...(updates.phone && { contactPhone: updates.phone }),
      ...(updates.principal && { principalName: updates.principal }),
      ...(updates.status && { status: updates.status }),
      ...(updates.plan && { subscriptionPlan: updates.plan.includes('Enterprise') ? 'Enterprise' : (updates.plan.includes('Pro') ? 'Pro' : 'Basic') })
    }).catch(err => {
      console.warn('Branch update backend sync error:', err.message);
    });

    return updated.find(b => b.id === id || b._id === id);
  },
  deleteBranch: (id) => {
    const list = getStore('branches', INITIAL_BRANCHES);
    const updated = list.filter(b => b.id !== id && b._id !== id);
    setStore('branches', updated);

    // Asynchronously delete in central MongoDB
    axiosInstance.delete(`/branches/${id}`).catch(err => {
      console.warn('Branch delete backend sync error:', err.message);
    });

    return true;
  },

  // Payments
  getPayments: () => getStore('payments', INITIAL_PAYMENTS),
  addPayment: (newPayment) => {
    const list = getStore('payments', INITIAL_PAYMENTS);
    const item = {
      ...newPayment,
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: newPayment.status || 'Paid'
    };
    const updated = [item, ...list];
    setStore('payments', updated);
    return item;
  },
  updatePaymentStatus: (id, status) => {
    const list = getStore('payments', INITIAL_PAYMENTS);
    const updated = list.map(p => p.id === id ? { ...p, status } : p);
    setStore('payments', updated);
    return true;
  },

  // Templates
  getTemplates: () => getStore('templates', INITIAL_TEMPLATES),
  addTemplate: (newTpl) => {
    const list = getStore('templates', INITIAL_TEMPLATES);
    const item = {
      ...newTpl,
      id: `tpl_${Date.now()}`,
      count: 1
    };
    const updated = [item, ...list];
    setStore('templates', updated);
    return item;
  },

  // Collections
  getCollections: () => getStore('collections', INITIAL_COLLECTIONS),
  addCollection: (record) => {
    const list = getStore('collections', INITIAL_COLLECTIONS);
    const item = {
      ...record,
      id: `col_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [item, ...list];
    setStore('collections', updated);
    return item;
  },

  // Login Logs
  getLoginLogs: () => getStore('login_logs', INITIAL_LOGIN_LOGS),

  // Profile
  getProfile: () => getStore('profile', INITIAL_PROFILE),
  updateProfile: (updates) => {
    const current = getStore('profile', INITIAL_PROFILE);
    const updated = { ...current, ...updates };
    setStore('profile', updated);
    return updated;
  },

  // Notifications
  getNotifications: () => getStore('notifications', INITIAL_NOTIFICATIONS),
  markAllNotificationsRead: () => {
    const list = getStore('notifications', INITIAL_NOTIFICATIONS);
    const updated = list.map(n => ({ ...n, read: true }));
    setStore('notifications', updated);
    return updated;
  },

  // Dashboard Aggregates
  getDashboardStats: () => {
    try {
      let branches = getStore('branches', INITIAL_BRANCHES);
      if (!Array.isArray(branches) || branches.length === 0) branches = INITIAL_BRANCHES;
      let payments = getStore('payments', INITIAL_PAYMENTS);
      if (!Array.isArray(payments)) payments = INITIAL_PAYMENTS;

      const totalStudents = branches.reduce((sum, b) => sum + (Number(b?.students) || 0), 0);
      const totalStaff = branches.reduce((sum, b) => sum + (Number(b?.staff) || 0), 0);
      const totalCollectedRaw = branches.reduce((sum, b) => sum + (Number(b?.collectedRaw) || 0), 0);
      const activeBranches = branches.filter(b => (b?.status || 'Active') === 'Active').length;

      return {
        branchesCount: branches.length,
        activeBranches,
        totalStudents,
        totalStaff,
        totalCollected: `₹${(totalCollectedRaw / 100000).toFixed(2)} Lakhs`,
        totalCollectedRaw,
        paymentsCount: payments.length
      };
    } catch (_) {
      return {
        branchesCount: 5,
        activeBranches: 4,
        totalStudents: 3840,
        totalStaff: 250,
        totalCollected: '₹36.95 Lakhs',
        totalCollectedRaw: 3695000,
        paymentsCount: 3
      };
    }
  },

  // Real CSV Export Utility
  exportToCsv: (filename, headers, rows) => {
    try {
      const escape = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const headerRow = headers.map(h => escape(h.label)).join(',');
      const dataRows = rows.map(r => {
        return headers.map(h => escape(r[h.key] !== undefined ? r[h.key] : '')).join(',');
      });

      const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('CSV export failed:', err);
      return false;
    }
  }
};

export default branchLocalDb;
