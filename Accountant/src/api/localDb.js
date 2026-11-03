/**
 * LocalStorage-based database with automatic central MongoDB backend synchronization.
 * Keys are namespaced under "acc_".
 */
import axiosInstance from './axios';

const PREFIX = 'acc_';

// Auto-clean any legacy demo data from localStorage on load
(function clearLegacyDemoData() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const isCleaned = localStorage.getItem('acc_demo_cleaned_v2');
    if (!isCleaned) {
      const collectionsToClear = [
        'incomes', 'expenses', 'students', 'collections',
        'feeGroups', 'feeTypes', 'incomeHeads', 'expenseHeads',
        'calendarEvents', 'leaves', 'loans', 'leads', 'leadSources', 'notificationsList'
      ];
      collectionsToClear.forEach(col => {
        localStorage.removeItem(PREFIX + col);
        localStorage.setItem(PREFIX + col, JSON.stringify([]));
      });
      localStorage.setItem('acc_demo_cleaned_v2', 'true');
    }
  } catch (_) {}
})();

const seed = {
  feeTypes: [],
  feeGroups: [],
  incomeHeads: [],
  expenseHeads: [],
  incomes: [],
  expenses: [],
  students: [],
  collections: [],
  profile: {
    name: 'Accountant',
    staffId: '',
    role: 'Accountant',
    designation: 'Staff Accountant',
    department: 'Finance & Accounts',
    basicSalary: '',
    dateOfJoining: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: '',
  },
  calendarEvents: [],
  leaves: [],
  loans: [],
  leadSources: [],
  leads: [],
  notificationsList: [],
  settings: {
    appearance: {
      themeMode: 'light',
      accentColor: '#3c8dbc',
      primaryColorName: 'Classic Blue',
      layoutDensity: 'comfortable',
      fontSize: 'sm',
      currencySymbol: '₹',
      dateFormat: 'DD/MM/YYYY',
      schoolName: 'School ERP',
      schoolTagline: 'Smart Institutional Management System',
      academicSession: '2026-2027',
    },
    notifications: {
      feePaymentSms: true,
      feePaymentEmail: true,
      feeDueAlerts: true,
      dueNoticeDays: 3,
      leaveStatusAlerts: true,
      dailyExpenseReport: false,
      inAppSounds: true,
      pushBanners: true,
      smsProvider: 'MSG91',
      senderId: 'SCHERP',
      smsBalance: 0,
      emailHost: 'smtp.gmail.com',
      supportEmail: 'accounts@school.edu',
    },
    security: {
      twoFactorAuth: false,
      twoFactorMethod: 'authenticator',
      sessionTimeoutMinutes: 30,
      forcePasswordChangeDays: 90,
      loginAlerts: true,
      ipWhitelistEnabled: false,
      ipWhitelist: '',
      twoFactorSecret: '',
      activeSessions: [],
    },
    database: {
      autoBackup: 'Weekly',
      lastBackupDate: '',
      cloudSync: true,
      retentionDays: 365,
    },
    advanced: {
      apiBaseUrl: 'http://localhost:5050/api',
      mockDataEngine: false,
      debugLogging: false,
      fiscalYearStart: 'April',
      feeReceiptPrefix: 'REC-2026/',
      voucherPrefix: 'EXP-2026/',
      receiptFooterNote: 'Fees once paid are non-refundable. Please retain this computerized receipt for tax exemption and audit purposes.',
      schoolGstNumber: '',
      panNumber: '',
      auditTrailEnabled: true,
      roundOffDecimals: 2,
    },
  },
};

function getKey(collection) {
  return PREFIX + collection;
}

function read(collection) {
  try {
    const raw = localStorage.getItem(getKey(collection));
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (collection === 'feeGroups' && Array.isArray(parsed)) {
        return parsed.map((item, idx) => ({
          ...item,
          id: item.id || item._id || `fg_${idx + 1}`,
          _id: item._id || item.id || `fg_${idx + 1}`,
          name: item.name || `Fee Group ${idx + 1}`,
          code: item.code || 'FG',
          amount: Number(item.total ?? item.amount ?? 0),
          total: Number(item.total ?? item.amount ?? 0),
          details: Array.isArray(item.details) ? item.details : []
        }));
      }
      return parsed;
    }
  } catch (_) {}
  const data = seed[collection] ? JSON.parse(JSON.stringify(seed[collection])) : [];
  write(collection, data);
  return data;
}

function write(collection, data) {
  localStorage.setItem(getKey(collection), JSON.stringify(data));
}

function genId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const localDb = {
  // generic helpers
  getAll(collection) {
    return read(collection);
  },
  getById(collection, id) {
    return read(collection).find((x) => x.id === id || x._id === id) || null;
  },
  create(collection, item) {
    const list = read(collection);
    const newItem = { ...item, id: item.id || genId(collection.slice(0, 2)), _id: item.id || genId(collection.slice(0, 2)) };
    list.push(newItem);
    write(collection, list);
    this._syncMutation('create', collection, newItem);
    return newItem;
  },
  update(collection, id, updates) {
    const list = read(collection);
    const idx = list.findIndex((x) => x.id === id || x._id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, id: list[idx].id || id, _id: list[idx]._id || id };
    write(collection, list);
    this._syncMutation('update', collection, list[idx]);
    return list[idx];
  },
  remove(collection, id) {
    const list = read(collection);
    const target = list.find((x) => x.id === id || x._id === id);
    const filtered = list.filter((x) => x.id !== id && x._id !== id);
    write(collection, filtered);
    if (target) {
      this._syncMutation('delete', collection, target);
    }
    return true;
  },

  // Central MongoDB Backend Synchronization
  async _syncMutation(action, collection, item) {
    try {
      const id = item._id || item.id;
      if (collection === 'feeTypes') {
        if (action === 'create') await axiosInstance.post('/fee-types', { name: item.feeType || item.name, code: item.feeCode || item.code, description: item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/fee-types/${id}`, { name: item.feeType || item.name, code: item.feeCode || item.code, description: item.description });
        else if (action === 'delete' && id) await axiosInstance.delete(`/fee-types/${id}`);
      } else if (collection === 'feeGroups') {
        if (action === 'create') await axiosInstance.post('/fee-groups', { name: item.name, description: item.description, amount: item.total || item.amount });
        else if (action === 'update' && id) await axiosInstance.put(`/fee-groups/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/fee-groups/${id}`);
      } else if (collection === 'incomes') {
        if (action === 'create') await axiosInstance.post('/incomes', { name: item.name || item.title || item.note, amount: item.amount, date: item.date, invoiceNumber: item.invoiceNo, paymentMode: item.mode || 'Cash', description: item.note || item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/incomes/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/incomes/${id}`);
      } else if (collection === 'incomeHeads') {
        if (action === 'create') await axiosInstance.post('/income-heads', { name: item.name || item.head, description: item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/income-heads/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/income-heads/${id}`);
      } else if (collection === 'expenses') {
        if (action === 'create') await axiosInstance.post('/expenses', { name: item.name || item.title || item.note, amount: item.amount, date: item.date, invoiceNumber: item.invoiceNo, paymentMode: item.mode || 'Cash', description: item.note || item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/expenses/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/expenses/${id}`);
      } else if (collection === 'expenseHeads') {
        if (action === 'create') await axiosInstance.post('/expense-heads', { name: item.name || item.head, description: item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/expense-heads/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/expense-heads/${id}`);
      } else if (collection === 'students') {
        if (action === 'create') await axiosInstance.post('/students', item);
        else if (action === 'update' && id) await axiosInstance.put(`/students/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/students/${id}`);
      } else if (collection === 'collections') {
        if (action === 'create') await axiosInstance.post('/collect-fees', item);
      }
    } catch (err) {
      // Gracefully silent on network failure - local state already saved
      console.warn('Backend sync mutation notice:', err.message);
    }
  },

  async syncFromBackend() {
    try {
      const [feeTypesRes, feeGroupsRes, studentsRes, incomesRes, expensesRes, incomeHeadsRes, expenseHeadsRes] = await Promise.allSettled([
        axiosInstance.get('/fee-types'),
        axiosInstance.get('/fee-groups'),
        axiosInstance.get('/students'),
        axiosInstance.get('/incomes'),
        axiosInstance.get('/expenses'),
        axiosInstance.get('/income-heads'),
        axiosInstance.get('/expense-heads')
      ]);

      if (feeTypesRes.status === 'fulfilled' && feeTypesRes.value.data?.data?.length > 0) {
        const mapped = feeTypesRes.value.data.data.map(ft => ({
          id: ft._id,
          _id: ft._id,
          feeType: ft.name || ft.feeType,
          feeCode: ft.code || ft.feeCode || '',
          description: ft.description || ''
        }));
        write('feeTypes', mapped);
      }

      if (feeGroupsRes.status === 'fulfilled' && feeGroupsRes.value.data?.data?.length > 0) {
        const mapped = feeGroupsRes.value.data.data.map(fg => ({
          id: fg._id,
          _id: fg._id,
          name: fg.name,
          code: fg.code || fg.name?.slice(0, 3).toUpperCase(),
          description: fg.description || '',
          amount: fg.amount || fg.total || 0,
          total: fg.total || fg.amount || 0,
          details: fg.feeTypes || []
        }));
        write('feeGroups', mapped);
      }

      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.data?.length > 0) {
        const mapped = studentsRes.value.data.data.map(s => ({
          id: s._id,
          _id: s._id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || 'Student',
          class: s.classId?.className || s.class || 'Class 1',
          roll: s.admissionNo || s.aparId || s.roll || `STU-${s._id.slice(-4)}`,
          father: s.fatherName || s.father || '',
          phone: s.phone || s.studentPhone || '',
          due: Number(s.due || 0)
        }));
        write('students', mapped);
      }

      if (incomesRes.status === 'fulfilled' && incomesRes.value.data?.data?.length > 0) {
        const mapped = incomesRes.value.data.data.map(inc => ({
          id: inc._id,
          _id: inc._id,
          head: inc.incomeHead?.name || inc.name || 'General Income',
          note: inc.description || inc.name || '',
          amount: inc.amount,
          date: inc.date ? new Date(inc.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          invoiceNo: inc.invoiceNumber || `INC-${inc._id.slice(-5)}`,
          mode: inc.paymentMode || 'Cash'
        }));
        write('incomes', mapped);
      }

      if (expensesRes.status === 'fulfilled' && expensesRes.value.data?.data?.length > 0) {
        const mapped = expensesRes.value.data.data.map(exp => ({
          id: exp._id,
          _id: exp._id,
          head: exp.expenseHead?.name || exp.name || 'General Expense',
          note: exp.description || exp.name || '',
          amount: exp.amount,
          date: exp.date ? new Date(exp.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          invoiceNo: exp.invoiceNumber || `EXP-${exp._id.slice(-5)}`,
          mode: exp.paymentMode || 'Cash'
        }));
        write('expenses', mapped);
      }

      if (incomeHeadsRes.status === 'fulfilled' && incomeHeadsRes.value.data?.data?.length > 0) {
        const mapped = incomeHeadsRes.value.data.data.map(h => ({
          id: h._id,
          _id: h._id,
          name: h.name,
          description: h.description || ''
        }));
        write('incomeHeads', mapped);
      }

      if (expenseHeadsRes.status === 'fulfilled' && expenseHeadsRes.value.data?.data?.length > 0) {
        const mapped = expenseHeadsRes.value.data.data.map(h => ({
          id: h._id,
          _id: h._id,
          name: h.name,
          description: h.description || ''
        }));
        write('expenseHeads', mapped);
      }

      return true;
    } catch (e) {
      console.warn('Initial sync notice:', e.message);
      return false;
    }
  },

  // convenience
  getProfile() {
    try {
      const raw = localStorage.getItem(getKey('profile'));
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const p = { ...seed.profile };
    localStorage.setItem(getKey('profile'), JSON.stringify(p));
    return p;
  },
  saveProfile(data) {
    localStorage.setItem(getKey('profile'), JSON.stringify(data));
    return data;
  },

  getEvents() {
    return read('calendarEvents');
  },
  addEvent(event) {
    return this.create('calendarEvents', event);
  },
  removeEvent(id) {
    return this.remove('calendarEvents', id);
  },

  // settings & preferences
  getSettings() {
    try {
      const raw = localStorage.getItem(getKey('settings'));
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          appearance: { ...seed.settings.appearance, ...(parsed.appearance || {}) },
          notifications: { ...seed.settings.notifications, ...(parsed.notifications || {}) },
          security: { ...seed.settings.security, ...(parsed.security || {}) },
          database: { ...seed.settings.database, ...(parsed.database || {}) },
          advanced: { ...seed.settings.advanced, ...(parsed.advanced || {}) },
        };
      }
    } catch (_) {}
    const s = JSON.parse(JSON.stringify(seed.settings));
    localStorage.setItem(getKey('settings'), JSON.stringify(s));
    return s;
  },
  saveSettings(newSettings) {
    const current = this.getSettings();
    const merged = {
      appearance: { ...current.appearance, ...(newSettings.appearance || {}) },
      notifications: { ...current.notifications, ...(newSettings.notifications || {}) },
      security: { ...current.security, ...(newSettings.security || {}) },
      database: { ...current.database, ...(newSettings.database || {}) },
      advanced: { ...current.advanced, ...(newSettings.advanced || {}) },
    };
    localStorage.setItem(getKey('settings'), JSON.stringify(merged));
    return merged;
  },

  // database management & backups
  getDatabaseStats() {
    let totalBytes = 0;
    const collections = [
      { name: 'incomes', label: 'Income Records', color: '#00a65a' },
      { name: 'expenses', label: 'Expense Records', color: '#dd4b39' },
      { name: 'feeGroups', label: 'Fee Groups', color: '#3c8dbc' },
      { name: 'feeTypes', label: 'Fee Types', color: '#f39c12' },
      { name: 'incomeHeads', label: 'Income Heads', color: '#605ca8' },
      { name: 'expenseHeads', label: 'Expense Heads', color: '#00c0ef' },
      { name: 'students', label: 'Student Directory', color: '#39cccc' },
      { name: 'calendarEvents', label: 'Calendar Events', color: '#d81b60' },
      { name: 'leads', label: 'Admission Leads', color: '#ff851b' },
      { name: 'loans', label: 'Staff Loans', color: '#795548' },
      { name: 'leaves', label: 'Leave Requests', color: '#001f3f' },
      { name: 'profile', label: 'Staff Profile', color: '#607d8b' },
      { name: 'settings', label: 'System Settings', color: '#546e7a' },
    ];
    const details = collections.map((col) => {
      const key = getKey(col.name);
      const val = localStorage.getItem(key) || '';
      const bytes = new Blob([val]).size;
      totalBytes += bytes;
      let count = 0;
      try {
        const parsed = JSON.parse(val);
        count = Array.isArray(parsed) ? parsed.length : (parsed ? 1 : 0);
      } catch (_) {}
      return {
        ...col,
        key,
        count,
        bytes,
        sizeKb: (bytes / 1024).toFixed(2),
      };
    });
    return {
      totalBytes,
      totalKb: (totalBytes / 1024).toFixed(2),
      details,
    };
  },
  exportAllData() {
    const backup = {
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      institution: 'School ERP',
      data: {},
    };
    const allKeys = [
      'incomes', 'expenses', 'feeGroups', 'feeTypes', 'incomeHeads', 'expenseHeads',
      'students', 'calendarEvents', 'leads', 'loans', 'leaves', 'profile', 'settings'
    ];
    allKeys.forEach((k) => {
      const raw = localStorage.getItem(getKey(k));
      if (raw) {
        try {
          backup.data[k] = JSON.parse(raw);
        } catch (_) {}
      }
    });
    return backup;
  },
  importAllData(jsonObj) {
    if (!jsonObj || typeof jsonObj !== 'object') {
      throw new Error('Invalid JSON format');
    }
    const dataObj = jsonObj.data || jsonObj;
    let importedKeys = 0;
    Object.keys(dataObj).forEach((k) => {
      if (dataObj[k] !== undefined) {
        localStorage.setItem(getKey(k), JSON.stringify(dataObj[k]));
        importedKeys++;
      }
    });
    return importedKeys;
  },
  clearCollection(collection) {
    if (seed[collection]) {
      write(collection, JSON.parse(JSON.stringify(seed[collection])));
    } else {
      localStorage.removeItem(getKey(collection));
    }
  },

  // notifications management
  getNotifications() {
    return read('notificationsList');
  },
  markNotificationRead(id) {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    write('notificationsList', updated);
    return updated;
  },
  markNotificationUnread(id) {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: false } : n));
    write('notificationsList', updated);
    return updated;
  },
  markAllNotificationsRead() {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    write('notificationsList', updated);
    return updated;
  },
  deleteNotification(id) {
    const list = this.getNotifications();
    const updated = list.filter((n) => n.id !== id);
    write('notificationsList', updated);
    return updated;
  },
  clearReadNotifications() {
    const list = this.getNotifications();
    const updated = list.filter((n) => !n.read);
    write('notificationsList', updated);
    return updated;
  },

  // reset all data (useful for debugging)
  reset() {
    Object.keys(seed).forEach((k) => localStorage.removeItem(getKey(k)));
  },
};

export default localDb;
