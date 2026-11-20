/**
 * Offline accountant service backed by localStorage (localDb).
 * All methods return { success: true, data } so existing UI keeps working.
 */
import localDb from './localDb';
import axiosInstance from './axios';

const ok = (data) => ({ success: true, data });
const fail = (message) => ({ success: false, message });

export const accountantService = {
  // ── Fee Types ──────────────────────────────────────────────
  getFeeTypes: async () => {
    const data = localDb.getAll('feeTypes');
    return ok(data);
  },
  addFeeType: async (data) => {
    const item = localDb.create('feeTypes', {
      feeType: data.feeType || data.name,
      feeCode: data.feeCode || data.code || '',
      description: data.description || '',
    });
    return ok(item);
  },
  updateFeeType: async (id, data) => {
    const item = localDb.update('feeTypes', id, data);
    return item ? ok(item) : fail('Not found');
  },
  deleteFeeType: async (id) => {
    localDb.remove('feeTypes', id);
    return ok(true);
  },

  // ── Fee Groups ─────────────────────────────────────────────
  getFeeGroups: async () => {
    const data = localDb.getAll('feeGroups');
    return ok(data);
  },
  addFeeGroup: async (data) => {
    const total = Number(data.total ?? data.amount ?? 0);
    const item = localDb.create('feeGroups', {
      name: data.name,
      code: data.code || data.name?.slice(0, 3).toUpperCase() || 'FG',
      description: data.description || '',
      amount: total,
      total: total,
      details: Array.isArray(data.details) && data.details.length > 0 ? data.details : [
        { name: 'Tuition Fee', amount: Math.round(total * 0.7) || total, due: '10th of Month', demand: 'Monthly' },
        { name: 'Activity / Dev Fee', amount: Math.round(total * 0.3) || 0, due: 'Term End', demand: 'Quarterly' }
      ],
    });
    return ok(item);
  },
  updateFeeGroup: async (id, data) => {
    const total = Number(data.total ?? data.amount ?? 0);
    const item = localDb.update('feeGroups', id, {
      ...data,
      amount: total,
      total: total,
    });
    return item ? ok(item) : fail('Not found');
  },
  deleteFeeGroup: async (id) => {
    localDb.remove('feeGroups', id);
    return ok(true);
  },

  // ── Students & Fee Management ──────────────────────────────
  getStudents: async () => {
    const data = localDb.getAll('students');
    return ok(data);
  },
  addStudent: async (data) => {
    const item = localDb.create('students', {
      name: data.name,
      class: data.class || 'Class 1',
      roll: data.roll || `STU-${Date.now().toString().slice(-4)}`,
      father: data.father || '',
      phone: data.phone || '',
      due: Number(data.due) || 0,
    });
    return ok(item);
  },
  updateStudent: async (id, data) => {
    const item = localDb.update('students', id, data);
    return item ? ok(item) : fail('Student not found');
  },
  deleteStudent: async (id) => {
    localDb.remove('students', id);
    return ok(true);
  },

  // ── Fee Assign / Due / Collect ─────────────────────────────
  assignFees: async (data) => {
    const student = localDb.getById('students', data.studentId);
    const amount = Number(data.amount) || 0;
    if (student) {
      localDb.update('students', data.studentId, {
        due: (Number(student.due) || 0) + amount,
      });
    }
    const item = localDb.create('collections', {
      ...data,
      studentName: data.studentName || student?.name || 'Student',
      amount,
      type: 'assignment',
      date: data.date || new Date().toISOString().slice(0, 10),
    });
    return ok(item);
  },

  assignFeesToClass: async ({ className, groupId, groupName, amount }) => {
    const students = localDb.getAll('students').filter((s) => !className || s.class === className);
    const amt = Number(amount) || 0;
    const assignments = [];
    students.forEach((s) => {
      localDb.update('students', s.id, {
        due: (Number(s.due) || 0) + amt,
      });
      const a = localDb.create('collections', {
        studentId: s.id,
        studentName: s.name,
        groupId,
        groupName,
        amount: amt,
        className: s.class,
        type: 'assignment',
        date: new Date().toISOString().slice(0, 10),
      });
      assignments.push(a);
    });
    return ok({ count: assignments.length, assignments });
  },

  getDueFees: async () => {
    // Students with due > 0
    const students = localDb.getAll('students').filter((s) => (s.due || 0) > 0);
    const mapped = students.map((s) => ({
      _id: s.id,
      amount: s.due,
      amountPaid: 0,
      student: {
        _id: s.id,
        admissionNo: s.roll || s.id,
        firstName: s.name?.split(' ')[0] || s.name,
        lastName: s.name?.split(' ').slice(1).join(' ') || '',
        class: s.class,
        father: s.father || '',
        phone: s.phone || '',
      },
    }));
    return ok(mapped);
  },

  getCollections: async () => {
    const list = localDb.getAll('collections');
    return ok(list);
  },

  collectFee: async (data) => {
    const amount = Number(data.amount) || 0;
    const studentId = data.studentId || data._id;
    // reduce due on student
    const student = localDb.getById('students', studentId);
    if (student) {
      const newDue = Math.max(0, (student.due || 0) - amount);
      localDb.update('students', studentId, { due: newDue });
    }
    const receipt = `RCP-${Date.now().toString().slice(-6)}`;
    const item = localDb.create('collections', {
      studentId,
      studentName: data.studentName || student?.name || '',
      className: data.className || student?.class || '',
      amount,
      date: data.date || new Date().toISOString().slice(0, 10),
      mode: data.mode || data.paymentMode || 'Cash',
      receipt,
      refNo: data.refNo || '',
      note: data.note || '',
    });
    return ok(item);
  },

  // ── Dashboard ──────────────────────────────────────────────
  getDashboardStats: async () => {
    try {
      const res = await axiosInstance.get('/accounts/dashboard');
      if (res.data && res.data.success) {
        const d = res.data;
        const stats = d.stats || {};

        if (d.school || d.schoolName) {
          const rawName = d.school?.name || d.schoolName;
          const sName = (rawName && !rawName.includes('Xavier')) ? rawName : 'All core';
          const sObj = {
            name: sName,
            logo: d.school?.logo || d.schoolLogo || null,
            shortName: d.school?.shortName || d.schoolShortName || 'allcore',
          };
          localStorage.setItem('school_info', JSON.stringify(sObj));
          localStorage.setItem('schoolName', sObj.name);
          try {
            window.dispatchEvent(new CustomEvent('school_info_updated', { detail: sObj }));
          } catch (_) {}
        }

        const chartData = (Array.isArray(d.chartData) ? d.chartData : []).map((c) => ({
          name: c.name || c.month || 'Month',
          Income: Number(c.Income ?? c.income ?? 0),
          Expense: Number(c.Expense ?? c.expense ?? 0),
        }));

        const recentVouchers = (Array.isArray(d.recentVouchers) ? d.recentVouchers : []).map((v) => ({
          id: v.id || v._id,
          head: v.category || v.head || (String(v.type).toUpperCase() === 'INCOME' ? 'General Income' : 'General Expense'),
          name: v.name || v.title || 'Voucher Record',
          amount: Number(v.amount || 0),
          date: v.date ? new Date(v.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          type: String(v.type || '').toUpperCase() === 'INCOME' ? 'Income' : (String(v.type || '').toUpperCase() === 'EXPENSE' ? 'Expense' : (v.type || 'Income')),
          invoiceNo: v.voucherNo || v.invoiceNo || `VCH-${(v.id || v._id || '').toString().slice(-4)}`,
          paymentMode: v.paymentMode || 'Cash',
        }));

        const collectedToday = Number(stats.todaysCollection ?? stats.collectedToday ?? 0);
        const incomeMonth = Number(stats.monthIncome ?? stats.incomeMonth ?? 0);
        const expenseMonth = Number(stats.monthExpense ?? stats.expenseMonth ?? 0);
        const cashBankBalance = Number(stats.cashAndBank ?? stats.cashBankBalance ?? (incomeMonth - expenseMonth));

        const resultData = {
          collectedToday,
          incomeMonth,
          expenseMonth,
          cashBankBalance,
          chartData,
          recentVouchers,
          school: d.school || null,
        };

        try {
          localStorage.setItem('acc_live_dashboard_stats', JSON.stringify(resultData));
        } catch (_) {}

        return ok(resultData);
      }
    } catch (err) {
      console.warn('Dashboard backend sync notice, checking cached live stats:', err.message);
      const cached = localStorage.getItem('acc_live_dashboard_stats');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const isFake = parsed && (
            parsed.collectedToday === 545400 ||
            parsed.incomeMonth === 1030400 ||
            parsed.expenseMonth === 128100 ||
            parsed.cashBankBalance === 3010300
          );
          if (isFake) {
            localStorage.removeItem('acc_live_dashboard_stats');
          } else if (parsed && typeof parsed.collectedToday === 'number') {
            return ok(parsed);
          }
        } catch (_) {}
      }
    }
    const isLegacyDemoId = (id) => typeof id === 'string' && (id.startsWith('in_') || id.startsWith('ex_') || /^(in|ex)\d+$/i.test(id));
    const incomes = localDb.getAll('incomes').filter(i => i && !isLegacyDemoId(i.id || i._id));
    const expenses = localDb.getAll('expenses').filter(e => e && !isLegacyDemoId(e.id || e._id));
    const collections = localDb.getAll('collections').filter(c => c && !isLegacyDemoId(c.id || c._id));
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = today.slice(0, 7);

    const collectedToday = collections
      .filter((c) => c.date === today)
      .reduce((s, c) => s + (Number(c.amount) || 0), 0);

    const incomeMonth =
      incomes
        .filter((i) => (i.date || '').startsWith(thisMonth))
        .reduce((s, i) => s + (Number(i.amount) || 0), 0) +
      collections
        .filter((c) => (c.date || '').startsWith(thisMonth))
        .reduce((s, c) => s + (Number(c.amount) || 0), 0);

    const expenseMonth = expenses
      .filter((e) => (e.date || '').startsWith(thisMonth))
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);

    const totalIncome = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0) +
      collections.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    const totalExpense = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const cashBankBalance = totalIncome - totalExpense;

    // simple chart: last 6 months income vs expense
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleString('default', { month: 'short' });
      const inc =
        incomes.filter((x) => (x.date || '').startsWith(key)).reduce((s, x) => s + (Number(x.amount) || 0), 0) +
        collections.filter((x) => (x.date || '').startsWith(key)).reduce((s, x) => s + (Number(x.amount) || 0), 0);
      const exp = expenses
        .filter((x) => (x.date || '').startsWith(key))
        .reduce((s, x) => s + (Number(x.amount) || 0), 0);
      chartData.push({ name: label, Income: inc, Expense: exp });
    }

    const recentVouchers = [
      ...incomes.map((i) => ({ ...i, type: 'Income' })),
      ...expenses.map((e) => ({ ...e, type: 'Expense' })),
    ]
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 8);

    return ok({
      collectedToday,
      incomeMonth,
      expenseMonth,
      cashBankBalance,
      chartData,
      recentVouchers,
    });
  },

  getDayBook: async (date) => {
    const d = date || new Date().toISOString().slice(0, 10);
    const incomes = localDb.getAll('incomes').filter((i) => i.date === d);
    const expenses = localDb.getAll('expenses').filter((e) => e.date === d);
    const collections = localDb.getAll('collections').filter((c) => c.date === d);
    return ok({ date: d, incomes, expenses, collections });
  },

  // ── Incomes ────────────────────────────────────────────────
  getIncomes: async () => {
    const data = localDb.getAll('incomes');
    return ok(data);
  },
  addIncome: async (data) => {
    const invoiceNo = data.invoiceNo || `INC-${Date.now().toString().slice(-5)}`;
    const item = localDb.create('incomes', {
      head: data.head || data.incomeHead || 'General',
      name: data.name || data.entityName || data.note || 'Income Received',
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().slice(0, 10),
      paymentMode: data.paymentMode || data.mode || 'Cash',
      note: data.note || data.description || '',
      invoiceNo,
      refNo: data.refNo || invoiceNo,
    });
    return ok(item);
  },
  updateIncome: async (id, data) => {
    const item = localDb.update('incomes', id, {
      ...data,
      amount: data.amount !== undefined ? Number(data.amount) : undefined,
    });
    return item ? ok(item) : fail('Not found');
  },
  deleteIncome: async (id) => {
    localDb.remove('incomes', id);
    return ok(true);
  },

  // ── Expenses ───────────────────────────────────────────────
  getExpenses: async () => {
    const data = localDb.getAll('expenses');
    return ok(data);
  },
  addExpense: async (data) => {
    const voucherNo = data.voucherNo || `EXP-${Date.now().toString().slice(-5)}`;
    const item = localDb.create('expenses', {
      head: data.head || data.expenseHead || 'General',
      name: data.name || data.entityName || data.note || 'Expense Paid',
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().slice(0, 10),
      paymentMode: data.paymentMode || data.mode || 'Cash',
      note: data.note || data.description || '',
      voucherNo,
      refNo: data.refNo || voucherNo,
    });
    return ok(item);
  },
  updateExpense: async (id, data) => {
    const item = localDb.update('expenses', id, {
      ...data,
      amount: data.amount !== undefined ? Number(data.amount) : undefined,
    });
    return item ? ok(item) : fail('Not found');
  },
  deleteExpense: async (id) => {
    localDb.remove('expenses', id);
    return ok(true);
  },

  // ── Income / Expense Heads ─────────────────────────────────
  getIncomeHeads: async () => ok(localDb.getAll('incomeHeads')),
  addIncomeHead: async (data) => ok(localDb.create('incomeHeads', data)),
  updateIncomeHead: async (id, data) => {
    const item = localDb.update('incomeHeads', id, data);
    return item ? ok(item) : fail('Not found');
  },
  deleteIncomeHead: async (id) => {
    localDb.remove('incomeHeads', id);
    return ok(true);
  },
  getExpenseHeads: async () => ok(localDb.getAll('expenseHeads')),
  addExpenseHead: async (data) => ok(localDb.create('expenseHeads', data)),
  updateExpenseHead: async (id, data) => {
    const item = localDb.update('expenseHeads', id, data);
    return item ? ok(item) : fail('Not found');
  },
  deleteExpenseHead: async (id) => {
    localDb.remove('expenseHeads', id);
    return ok(true);
  },

  // ── Students ───────────────────────────────────────────────
  getStudents: async () => ok(localDb.getAll('students')),
  addStudent: async (data) => ok(localDb.create('students', data)),
  updateStudent: async (id, data) => {
    const item = localDb.update('students', id, data);
    return item ? ok(item) : fail('Not found');
  },
  deleteStudent: async (id) => {
    localDb.remove('students', id);
    return ok(true);
  },

  // ── Calendar Events ────────────────────────────────────────
  getCalendarEvents: async () => {
    const data = localDb.getEvents();
    return ok(data);
  },
  addCalendarEvent: async (event) => {
    const item = localDb.addEvent(event);
    return ok(item);
  },
  deleteCalendarEvent: async (id) => {
    localDb.removeEvent(id);
    return ok(true);
  },

  // ── Profile ────────────────────────────────────────────────
  getProfile: async () => {
    try {
      let user = null;
      try {
        const raw = localStorage.getItem('accountant_user');
        if (raw) user = JSON.parse(raw);
      } catch (_) {}

      let staffDoc = null;
      if (user?._id) {
        const res = await axiosInstance.get(`/staff/${user._id}`).catch(() => null);
        if (res?.data?.data) staffDoc = res.data.data;
      }
      if (!staffDoc && user?.email) {
        const res = await axiosInstance.get(`/staff?search=${encodeURIComponent(user.email)}`).catch(() => null);
        if (res?.data?.data) {
          staffDoc = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        }
      }
      // Target the active institutional Accountant record (Hari Kumar)
      if (!staffDoc) {
        const res = await axiosInstance.get('/staff/6afd359fd082c0a36c4f4ab3').catch(() => null);
        if (res?.data?.data) staffDoc = res.data.data;
      }
      if (!staffDoc) {
        const res = await axiosInstance.get('/staff?designation=Accountant').catch(() => null);
        if (res?.data?.data) {
          staffDoc = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        }
      }
      if (!staffDoc) {
        const res = await axiosInstance.get('/staff').catch(() => null);
        if (res?.data?.data) {
          staffDoc = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        }
      }

      if (staffDoc) {
        const mapped = {
          _id: staffDoc._id,
          name: staffDoc.fullName || 'Hari Kumar',
          fullName: staffDoc.fullName || 'Hari Kumar',
          staffId: staffDoc.staffId || staffDoc.employeeCode || '112',
          role: typeof staffDoc.role === 'object' ? staffDoc.role?.name : staffDoc.role || 'Accountant',
          designation: staffDoc.designation || 'Accountant',
          department: staffDoc.department || 'Finance & Accounts',
          basicSalary: staffDoc.basicSalary || staffDoc.additionalInfo?.basicSalary || '35000',
          dateOfJoining: staffDoc.dateOfJoining ? staffDoc.dateOfJoining.slice(0, 10) : '2026-12-18',
          confirmationDate: staffDoc.confirmationDate ? staffDoc.confirmationDate.slice(0, 10) : '2026-12-18',
          email: staffDoc.email || 'harikumar@gmail.com',
          phone: staffDoc.phone || '8400563229',
          address: staffDoc.currentAddress || 'MP',
          permanentAddress: staffDoc.currentAddress || 'MP',
          bio: staffDoc.note || 'Staff Accountant managing student fees, daybook vouchers, institutional collections, and accounts.',
          avatar: (() => {
            if (staffDoc.photo && (staffDoc.photo.startsWith('http') || staffDoc.photo.startsWith('data:'))) {
              return staffDoc.photo;
            }
            if (staffDoc.photo) {
              const backendOrigin = (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname))
                ? 'http://localhost:5050'
                : 'https://sms-backend-by-raj-1.onrender.com';
              return `${backendOrigin}/${staffDoc.photo.replace(/^\/+/, '')}`;
            }
            const localSaved = typeof window !== 'undefined' ? (localStorage.getItem('accountant_user_avatar') || localStorage.getItem('school_erp_user_avatar') || localStorage.getItem('user_avatar') || '') : '';
            return localSaved || '';
          })(),
          gender: staffDoc.gender || 'Male',
          dob: staffDoc.dateOfBirth ? staffDoc.dateOfBirth.slice(0, 10) : '1999-10-12',
          maritalStatus: staffDoc.maritalStatus || 'Married',
          fatherName: staffDoc.fathersName || 'Mr. Prakash Kumar',
          motherName: staffDoc.mothersName || 'Ms. Ranjana Devi',
          qualification: staffDoc.qualification || 'B.Tech',
          workExperience: staffDoc.workExperience ? `${staffDoc.workExperience} Years` : '2 Years',
          bloodGroup: staffDoc.bloodGroup || 'A+',
          emergencyContact: staffDoc.emergencyContactName || staffDoc.phone || '8400563229',
          emergencyPhone: staffDoc.emergencyContactPhone || staffDoc.phone || '8400563229',
          bankName: staffDoc.bankDetails?.bankName || 'SBI',
          accountNo: staffDoc.bankDetails?.accountNumber || '',
          ifsc: staffDoc.bankDetails?.ifscCode || '',
          branchName: staffDoc.bankDetails?.branchName || '',
          accountTitle: staffDoc.bankDetails?.accountTitle || staffDoc.fullName || 'Hari Kumar',
          panNo: staffDoc.statutoryIds?.panNumber || '',
          aadhaarNo: staffDoc.statutoryIds?.aadhaarNumber || '',
          uanNo: staffDoc.statutoryIds?.uanNumber || '',
          biometricId: staffDoc.biometricId || staffDoc.deviceMappingId || '112',
          shiftTiming: '08:30 AM – 04:30 PM (General Shift)',
        };

        if (mapped.avatar) {
          try {
            localStorage.setItem('accountant_user_avatar', mapped.avatar);
            localStorage.setItem('school_erp_user_avatar', mapped.avatar);
          } catch (_) {}
        }
        localDb.saveProfile(mapped);
        return ok(mapped);
      }
    } catch (e) {
      console.warn('Real staff profile fetch failed, using local profile:', e);
    }
    return ok(localDb.getProfile());
  },
  saveProfile: async (data) => {
    localDb.saveProfile(data);
    try {
      if (data._id) {
        await axiosInstance.patch(`/staff/${data._id}`, {
          fullName: data.name || data.fullName,
          photo: data.avatar,
          phone: data.phone,
          email: data.email,
          currentAddress: data.address,
          qualification: data.qualification,
          workExperience: data.workExperience,
          maritalStatus: data.maritalStatus,
          fathersName: data.fatherName,
          mothersName: data.motherName,
          emergencyContactName: data.emergencyContact,
          emergencyContactPhone: data.emergencyPhone,
          bankDetails: {
            bankName: data.bankName,
            accountNumber: data.accountNo,
            ifscCode: data.ifsc,
            branchName: data.branchName,
            accountTitle: data.accountTitle || data.name
          }
        }).catch(() => {});
      }
    } catch (_) {}
    return ok(data);
  },

  // ── Leaves ─────────────────────────────────────────────────
  // ── Payroll / Payslips ─────────────────────────────────────
  getPayslips: async (staffId) => {
    try {
      if (staffId) {
        const res = await axiosInstance.get(`/payroll?staffId=${staffId}`).catch(() => null);
        if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          return ok(res.data.data);
        }
      }
    } catch (_) {}
    return ok(localDb.getAll('payslips'));
  },

  // ── Attendance Logs ────────────────────────────────────────
  getAttendanceLogs: async (staffId) => {
    try {
      if (staffId) {
        const res = await axiosInstance.get(`/attendance/qr-scan-logs?staffId=${staffId}`).catch(() => null);
        if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          return ok(res.data.data);
        }
      }
    } catch (_) {}
    return ok(localDb.getAll('attendanceLogs'));
  },
  recordAttendancePunch: async (punchData) => {
    try {
      await axiosInstance.post('/attendance/qr-scan', punchData).catch(() => null);
    } catch (_) {}
    const created = localDb.create('attendanceLogs', punchData);
    return ok(created);
  },

  getLeaves: async (staffId) => {
    try {
      if (staffId) {
        const res = await axiosInstance.get(`/leaves?staffId=${staffId}`).catch(() => null);
        if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          return ok(res.data.data);
        }
      }
    } catch (_) {}
    return ok(localDb.getAll('leaves'));
  },
  getLeaveById: async (id) => {
    const item = localDb.getById('leaves', id);
    return item ? ok(item) : fail('Leave not found');
  },
  applyLeave: async (data) => {
    let days = Number(data.days) || 1.0;
    if (data.halfDay) {
      days = 0.5;
    } else if (data.fromDate && data.toDate && !data.days) {
      const diffMs = new Date(data.toDate) - new Date(data.fromDate);
      days = Math.max(1, Math.round(diffMs / 86400000) + 1);
    }

    const fromStr = data.fromDate || data.from || '';
    const toStr = data.toDate || data.to || fromStr;
    const dates = data.dates || (fromStr === toStr ? fromStr : `${fromStr} - ${toStr}`);

    const item = localDb.create('leaves', {
      type: data.type || data.leaveType || 'Casual Leave',
      payType: data.payType || (data.type === 'Unpaid Leave' ? 'Unpaid (LOP)' : 'Paid'),
      dates,
      fromDate: fromStr,
      toDate: toStr,
      days,
      halfDay: Boolean(data.halfDay),
      reason: data.reason || '',
      applicantName: data.applicantName || 'Accountant',
      status: data.status || 'Pending',
      appliedOn: data.appliedOn || new Date().toISOString().slice(0, 10),
      contact: data.contact || '',
    });
    return ok(item);
  },
  updateLeave: async (id, data) => {
    const existing = localDb.getById('leaves', id);
    if (!existing) return fail('Leave not found');

    let days = data.days !== undefined ? Number(data.days) : existing.days;
    if (data.halfDay) {
      days = 0.5;
    } else if (data.fromDate && data.toDate && data.days === undefined) {
      const diffMs = new Date(data.toDate) - new Date(data.fromDate);
      days = Math.max(1, Math.round(diffMs / 86400000) + 1);
    }

    const fromStr = data.fromDate || data.from || existing.fromDate || '';
    const toStr = data.toDate || data.to || existing.toDate || fromStr;
    const dates = data.dates || (fromStr === toStr ? fromStr : `${fromStr} - ${toStr}`);

    const updates = {
      ...data,
      type: data.type || data.leaveType || existing.type,
      payType: data.payType || existing.payType,
      dates,
      fromDate: fromStr,
      toDate: toStr,
      days,
      halfDay: data.halfDay !== undefined ? Boolean(data.halfDay) : existing.halfDay,
      reason: data.reason !== undefined ? data.reason : existing.reason,
      status: data.status || existing.status,
    };
    const item = localDb.update('leaves', id, updates);
    return item ? ok(item) : fail('Leave not found');
  },
  deleteLeave: async (id) => {
    localDb.remove('leaves', id);
    return ok(true);
  },
  updateLeaveStatus: async (id, status) => {
    const item = localDb.update('leaves', id, { status });
    return item ? ok(item) : fail('Leave not found');
  },

  // ── Loans ──────────────────────────────────────────────────
  getLoans: async () => ok(localDb.getAll('loans')),
  getLoanById: async (id) => {
    const item = localDb.getById('loans', id);
    return item ? ok(item) : fail('Loan not found');
  },
  applyLoan: async (data) => {
    const amount = Number(data.amount) || 0;
    const tenureMonths = Number(data.tenureMonths || data.duration) || 12;
    const emi = Number(data.emi) || (tenureMonths > 0 ? Math.round(amount / tenureMonths) : amount);
    const paidAmount = Number(data.paidAmount) || 0;
    const remaining = data.remaining !== undefined && data.remaining !== '' ? Number(data.remaining) : Math.max(0, amount - paidAmount);
    const item = localDb.create('loans', {
      type: data.type || 'Personal Loan',
      applicantName: data.applicantName || 'Accountant',
      amount,
      tenureMonths,
      duration: `${tenureMonths} Months`,
      emi,
      remaining,
      paidAmount,
      purpose: data.purpose || data.reason || '',
      reason: data.reason || data.purpose || '',
      status: data.status || 'Pending',
      paymentMode: data.paymentMode || 'Bank Transfer',
      date: data.date || new Date().toISOString().slice(0, 10),
    });
    return ok(item);
  },
  addLoan: async (data) => {
    return accountantService.applyLoan(data);
  },
  updateLoan: async (id, data) => {
    const existing = localDb.getById('loans', id);
    if (!existing) return fail('Loan not found');
    const amount = data.amount !== undefined ? Number(data.amount) : Number(existing.amount);
    const tenureMonths = data.tenureMonths !== undefined ? Number(data.tenureMonths) : (Number(data.duration) || Number(existing.tenureMonths) || 12);
    const emi = data.emi !== undefined ? Number(data.emi) : (tenureMonths > 0 ? Math.round(amount / tenureMonths) : amount);
    const paidAmount = data.paidAmount !== undefined ? Number(data.paidAmount) : (Number(existing.paidAmount) || 0);
    const remaining = data.remaining !== undefined && data.remaining !== '' ? Number(data.remaining) : Math.max(0, amount - paidAmount);

    const updates = {
      ...data,
      amount,
      tenureMonths,
      duration: `${tenureMonths} Months`,
      emi,
      paidAmount,
      remaining,
      type: data.type || existing.type,
      purpose: data.purpose || data.reason || existing.purpose,
      reason: data.reason || data.purpose || existing.reason,
      status: remaining === 0 ? 'Completed' : (data.status || existing.status),
    };
    const item = localDb.update('loans', id, updates);
    return item ? ok(item) : fail('Loan not found');
  },
  deleteLoan: async (id) => {
    localDb.remove('loans', id);
    return ok(true);
  },
  repayLoanEmi: async (id, emiAmount) => {
    const loan = localDb.getById('loans', id);
    if (!loan) return fail('Loan not found');
    const pay = Number(emiAmount) || Number(loan.emi) || 0;
    const currentRemaining = Number(loan.remaining) || 0;
    const currentPaid = Number(loan.paidAmount) || 0;
    const actualPay = Math.min(pay, currentRemaining);
    const newRemaining = Math.max(0, currentRemaining - actualPay);
    const newPaid = currentPaid + actualPay;
    const newStatus = newRemaining === 0 ? 'Completed' : (loan.status === 'Pending' ? 'Active' : loan.status);
    const updated = localDb.update('loans', id, {
      remaining: newRemaining,
      paidAmount: newPaid,
      status: newStatus,
    });
    return ok(updated);
  },
  updateLoanStatus: async (id, status) => {
    const loan = localDb.getById('loans', id);
    if (!loan) return fail('Loan not found');
    const updated = localDb.update('loans', id, { status });
    return ok(updated);
  },

  // ── Lead Management ─────────────────────────────────────────
  getLeads: async (filters = {}) => {
    let list = localDb.getAll('leads');
    if (filters.status && filters.status !== 'All') {
      list = list.filter((l) => (l.status || '').toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.source && filters.source !== 'All') {
      list = list.filter((l) => (l.source || '').toLowerCase() === filters.source.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          (l.name && l.name.toLowerCase().includes(q)) ||
          (l.phone && l.phone.toLowerCase().includes(q)) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.grade && l.grade.toLowerCase().includes(q)) ||
          (l.notes && l.notes.toLowerCase().includes(q))
      );
    }
    return ok(list);
  },
  getLeadById: async (id) => {
    const item = localDb.getById('leads', id);
    return item ? ok(item) : fail('Lead not found');
  },
  addLead: async (data) => {
    if (!data.name || !data.name.trim()) {
      return fail('Lead name is required');
    }
    const today = new Date().toISOString().split('T')[0];
    const newLead = {
      name: data.name.trim(),
      phone: data.phone ? data.phone.trim() : '',
      email: data.email ? data.email.trim() : '',
      source: data.source || 'Direct Enquiry',
      status: data.status || 'New',
      grade: data.grade || 'General Inquiry',
      priority: data.priority || 'Medium',
      assignedTo: data.assignedTo || 'Front Desk',
      notes: data.notes || '',
      date: data.date || today,
      createdAt: new Date().toISOString(),
    };
    const created = localDb.create('leads', newLead);
    return ok(created);
  },
  updateLead: async (id, data) => {
    const existing = localDb.getById('leads', id);
    if (!existing) return fail('Lead not found');
    const updated = localDb.update('leads', id, {
      ...data,
      name: data.name ? data.name.trim() : existing.name,
      phone: data.phone !== undefined ? data.phone.trim() : existing.phone,
      email: data.email !== undefined ? data.email.trim() : existing.email,
      source: data.source || existing.source,
      status: data.status || existing.status,
      grade: data.grade || existing.grade,
      priority: data.priority || existing.priority,
      assignedTo: data.assignedTo || existing.assignedTo,
      notes: data.notes !== undefined ? data.notes : existing.notes,
      date: data.date || existing.date,
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  },
  updateLeadStatus: async (id, status) => {
    const existing = localDb.getById('leads', id);
    if (!existing) return fail('Lead not found');
    const updated = localDb.update('leads', id, { status, updatedAt: new Date().toISOString() });
    return ok(updated);
  },
  deleteLead: async (id) => {
    localDb.remove('leads', id);
    return ok(true);
  },

  // ── Lead Sources ────────────────────────────────────────────
  getLeadSources: async () => {
    const sources = localDb.getAll('leadSources');
    return ok(sources);
  },
  addLeadSource: async (data) => {
    if (!data.name || !data.name.trim()) {
      return fail('Source name is required');
    }
    const newSource = {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : '',
      status: data.status || 'Active',
      createdAt: new Date().toISOString(),
    };
    const created = localDb.create('leadSources', newSource);
    return ok(created);
  },
  updateLeadSource: async (id, data) => {
    const existing = localDb.getById('leadSources', id);
    if (!existing) return fail('Lead source not found');
    const updated = localDb.update('leadSources', id, {
      ...data,
      name: data.name ? data.name.trim() : existing.name,
      description: data.description !== undefined ? data.description.trim() : existing.description,
      status: data.status || existing.status || 'Active',
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  },
  deleteLeadSource: async (id) => {
    localDb.remove('leadSources', id);
    return ok(true);
  },
};

