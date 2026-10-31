// Reactive, persistent storage for Branch Admin Portal with Central MongoDB synchronization
import axiosInstance from './axios';

const STORAGE_PREFIX = 'branch_admin_db_';

// â”€â”€ One-time purge of old dummy/seeded data from localStorage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DATA_VERSION = 'v3_clean_real'; // bump this to force another purge
if (typeof window !== 'undefined' && localStorage.getItem('branch_admin_data_version') !== DATA_VERSION) {
  const keys = ['branches', 'payments', 'templates', 'collections', 'login_logs', 'profile', 'notifications'];
  keys.forEach(k => localStorage.removeItem(STORAGE_PREFIX + k));
  localStorage.setItem('branch_admin_data_version', DATA_VERSION);
}
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const INITIAL_BRANCHES = [];

const INITIAL_PAYMENTS = [];

const INITIAL_TEMPLATES = [];

const INITIAL_COLLECTIONS = [];

const INITIAL_LOGIN_LOGS = [];

const INITIAL_PROFILE = { name: "", email: "", phone: "", role: "", department: "", staffId: "", avatar: "", timezone: "", language: "English" };

const INITIAL_NOTIFICATIONS = [];

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
          students: Number(b.students) || 0,
          staff: Number(b.staff) || 0,
          classes: Number(b.classes) || 0,
          attendance: b.attendance || '0%',
          collected: b.collected || '₹0',
          collectedRaw: Number(b.collectedRaw) || 0,
          rows: b.rows || '0',
          reg: b.reg || (b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Jan, 2024'),
          sub: b.sub || '',
          renews: b.renews || '',
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
        totalCollected: totalCollectedRaw > 0 ? `₹${(totalCollectedRaw / 100000).toFixed(2)} Lakhs` : '₹0',
        totalCollectedRaw,
        paymentsCount: payments.length
      };
    } catch (_) {
      return { branchesCount: 0, activeBranches: 0, totalStudents: 0, totalStaff: 0, totalCollected: "₹0", totalCollectedRaw: 0, paymentsCount: 0 };
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


