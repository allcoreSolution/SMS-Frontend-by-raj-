import axiosInstance from './axios';
import branchLocalDb from './branchLocalDb';

const normalizeBranch = (b, index = 0) => {
  return {
    id: b.id || b._id || `br_${index + 1}`,
    _id: b._id || b.id || `br_${index + 1}`,
    name: b.name || b.branchName || 'Campus Branch',
    code: b.code || b.branchCode || `BR-0${index + 1}`,
    email: b.email || b.contactEmail || 'admin@branch.edu',
    phone: b.phone || b.contactPhone || '+91 98765 00000',
    address: b.address || 'Central City Campus',
    principal: b.principal || b.principalName || 'Principal',
    plan: b.plan || b.subscriptionPlan || 'Enterprise Plan',
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
    domain: b.domain || `${(b.code || b.branchCode || 'branch').toLowerCase()}.schoolerp.com`
  };
};

export const branchAdminService = {
  // Dashboard & Schools Aggregates from Central MongoDB
  getDashboardStats: async () => {
    try {
      const res = await axiosInstance.get('/branches/dashboard-stats');
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch (_) {}
    return { success: true, data: branchLocalDb.getDashboardStats ? branchLocalDb.getDashboardStats() : {} };
  },
  
  // Branches list from Central MongoDB
  getBranches: async () => {
    try {
      const res = await axiosInstance.get('/branches');
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const normalized = res.data.data.map(normalizeBranch);
        branchLocalDb.saveBranches(normalized);
        return { success: true, data: normalized };
      }
    } catch (_) {}
    
    const local = branchLocalDb.getBranches();
    return { success: true, data: local.map(normalizeBranch) };
  },

  // Create branch in Central MongoDB
  createBranch: async (branchData) => {
    try {
      const code = branchData.code || branchData.branchCode || `BR-${Math.floor(100 + Math.random() * 900)}`;
      const payload = {
        branchName: branchData.name || branchData.branchName,
        branchCode: code,
        address: branchData.address || 'Campus Address',
        contactEmail: branchData.email || branchData.contactEmail,
        contactPhone: branchData.phone || branchData.contactPhone,
        principalName: branchData.principal || branchData.principalName,
        subscriptionPlan: branchData.plan?.includes('Enterprise') ? 'Enterprise' : (branchData.plan?.includes('Pro') ? 'Pro' : 'Basic'),
        status: branchData.status || 'Active',
        students: Number(branchData.students) || 500,
        staff: Number(branchData.staff) || 35,
        attendance: branchData.attendance || '95%',
        collected: branchData.collected || '₹0.00'
      };
      const res = await axiosInstance.post('/branches', payload);

      if (res.data && res.data.success) {
        const normalized = normalizeBranch(res.data.data);
        branchLocalDb.addBranch(normalized);
        return { success: true, data: normalized };
      }
    } catch (e) {
      console.warn('API branch create notice:', e.message);
    }

    const created = branchLocalDb.addBranch(branchData);
    return { success: true, data: created };
  },

  // Update branch in Central MongoDB
  updateBranch: async (id, updates) => {
    try {
      const payload = {
        ...(updates.name && { branchName: updates.name }),
        ...(updates.code && { branchCode: updates.code }),
        ...(updates.address && { address: updates.address }),
        ...(updates.email && { contactEmail: updates.email }),
        ...(updates.phone && { contactPhone: updates.phone }),
        ...(updates.principal && { principalName: updates.principal }),
        ...(updates.status && { status: updates.status }),
        ...(updates.students !== undefined && { students: Number(updates.students) }),
        ...(updates.staff !== undefined && { staff: Number(updates.staff) }),
        ...(updates.attendance && { attendance: updates.attendance }),
        ...(updates.collected && { collected: updates.collected }),
        ...(updates.plan && { subscriptionPlan: updates.plan.includes('Enterprise') ? 'Enterprise' : (updates.plan.includes('Pro') ? 'Pro' : 'Basic') })
      };
      const res = await axiosInstance.put(`/branches/${id}`, payload);
      if (res.data && res.data.success) {
        branchLocalDb.updateBranch(id, updates);
        return res.data;
      }
    } catch (e) {
      console.warn('API branch update notice:', e.message);
    }
    const updated = branchLocalDb.updateBranch(id, updates);
    return { success: true, data: updated };
  },

  // Delete branch in Central MongoDB
  deleteBranch: async (id) => {
    try {
      await axiosInstance.delete(`/branches/${id}`);
    } catch (e) {
      console.warn('API branch delete notice:', e.message);
    }
    branchLocalDb.deleteBranch(id);
    return { success: true };
  },

  // Payments
  getPayments: async () => {
    try {
      const res = await axiosInstance.get('/all-transactions');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
    } catch (_) {}
    return { success: true, data: branchLocalDb.getPayments() };
  },

  // Templates
  getTemplates: async () => {
    return { success: true, data: branchLocalDb.getTemplates() };
  },

  // Collections
  getCollections: async () => {
    try {
      const res = await axiosInstance.get('/collect-fees');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
    } catch (_) {}
    return { success: true, data: branchLocalDb.getCollections() };
  },

  // Login Logs
  getLoginLogs: async () => {
    return { success: true, data: branchLocalDb.getLoginLogs() };
  }
};

export default branchAdminService;
