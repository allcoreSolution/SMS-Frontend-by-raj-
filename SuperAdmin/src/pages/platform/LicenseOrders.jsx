import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Search, Download, Filter, Eye, Phone, Mail, 
  MessageCircle, CheckCircle2, Clock, XCircle, AlertCircle, 
  Copy, Check, ExternalLink, RefreshCw, Plus, Sparkles, Key, 
  Building, User, FileText, ChevronRight, ArrowUpDown, Trash2,
  Calendar, ShieldCheck, DollarSign
} from 'lucide-react';
import Swal from 'sweetalert2';
import licenseOrderService from '../../api/licenseOrderService';

const STATUS_CONFIG = {
  'New Enquiry': { label: 'New / Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  'Contacted': { label: 'Contacted', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Phone },
  'Contacted / Qualified': { label: 'Qualified', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Sparkles },
  'Enrolled': { label: 'License Issued', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Converted': { label: 'Paid & Issued', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Lost / Rejected': { label: 'Cancelled', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
};

export default function LicenseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // New Order Form state
  const [newOrderForm, setNewOrderForm] = useState({
    studentName: '',
    parentName: '',
    email: '',
    contactNumber: '',
    targetClass: '₹10,000 — Full Commercial Source Code (All 38 Modules + 3 Apps)',
    notes: 'Direct client order recorded by SuperAdmin'
  });

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await licenseOrderService.getOrders();
      if (res?.success && Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res)) {
        setOrders(res);
      }
    } catch (err) {
      console.warn('Orders fetch error, checking local state:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(o => 
        (o.studentName || '').toLowerCase().includes(q) ||
        (o.parentName || '').toLowerCase().includes(q) ||
        (o.email || '').toLowerCase().includes(q) ||
        (o.contactNumber || '').toLowerCase().includes(q) ||
        (o.targetClass || '').toLowerCase().includes(q) ||
        (o._id || '').toLowerCase().includes(q) ||
        (o.notes || '').toLowerCase().includes(q)
      );
    }

    // Tab filter
    if (activeTab === 'Landing Web (₹10K)') {
      result = result.filter(o => (o.source || '').includes('Multi_School_Erp') || (o.targetClass || '').includes('10,000'));
    } else if (activeTab === 'New / Pending') {
      result = result.filter(o => (o.status === 'New Enquiry' || o.stage === 'New Enquiry' || !o.status));
    } else if (activeTab === 'Contacted') {
      result = result.filter(o => (o.status || '').includes('Contacted') || (o.stage || '').includes('Contacted'));
    } else if (activeTab === 'License Issued') {
      result = result.filter(o => ['Enrolled', 'Converted'].includes(o.status) || ['Enrolled', 'Converted'].includes(o.stage));
    } else if (activeTab === 'Cancelled') {
      result = result.filter(o => (o.status || '').includes('Lost') || (o.status || '').includes('Rejected'));
    }

    // Source filter
    if (sourceFilter !== 'All') {
      result = result.filter(o => o.source === sourceFilter);
    }

    // Sort
    if (sortBy === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'Oldest') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'Name') {
      result.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''));
    }

    return result;
  }, [orders, search, activeTab, sourceFilter, sortBy]);

  // Derived KPIs
  const kpis = useMemo(() => {
    const total = orders.length;
    const landingLeads = orders.filter(o => (o.source || '').includes('Multi_School_Erp') || (o.targetClass || '').includes('10,000')).length;
    const pending = orders.filter(o => o.status === 'New Enquiry' || o.stage === 'New Enquiry' || !o.status).length;
    const issued = orders.filter(o => ['Enrolled', 'Converted'].includes(o.status) || ['Enrolled', 'Converted'].includes(o.stage)).length;
    
    // Revenue calculations: ₹10,000 base for full code packages
    const totalPipelineValue = (landingLeads * 10000) || (total * 10000);
    const convertedRevenue = issued * 10000;

    return { total, landingLeads, pending, issued, totalPipelineValue, convertedRevenue };
  }, [orders]);

  // Handle Quick Status Update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await licenseOrderService.updateOrder(orderId, {
        status: newStatus,
        stage: newStatus
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus, stage: newStatus } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus, stage: newStatus }));
      }
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Status changed to: ${newStatus}`,
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to update order status', 'error');
    }
  };

  // Handle Delete Order
  const handleDeleteOrder = async (order) => {
    const confirm = await Swal.fire({
      title: 'Delete this order enquiry?',
      text: `Are you sure you want to remove the purchase record for "${order.studentName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it'
    });

    if (confirm.isConfirmed) {
      try {
        await licenseOrderService.deleteOrder(order._id);
        setOrders(prev => prev.filter(o => o._id !== order._id));
        if (selectedOrder?._id === order._id) setSelectedOrder(null);
        Swal.fire('Deleted', 'Order enquiry removed successfully.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete order', 'error');
      }
    }
  };

  // Handle Manual Order Creation
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrderForm.studentName || !newOrderForm.email || !newOrderForm.contactNumber) {
      Swal.fire('Required Fields', 'Please provide Name, Email, and Phone.', 'info');
      return;
    }

    try {
      const res = await licenseOrderService.createOrder({
        ...newOrderForm,
        source: 'Multi_School_Erp Landing Web'
      });
      if (res?.data) {
        setOrders(prev => [res.data, ...prev]);
      } else {
        await fetchOrders(true);
      }
      setShowCreateModal(false);
      setNewOrderForm({
        studentName: '',
        parentName: '',
        email: '',
        contactNumber: '',
        targetClass: '₹10,000 — Full Commercial Source Code (All 38 Modules + 3 Apps)',
        notes: 'Direct client order recorded by SuperAdmin'
      });
      Swal.fire('Success', 'New license purchase enquiry recorded!', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to save order record', 'error');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredOrders.length) {
      Swal.fire('Empty', 'No order records to export', 'info');
      return;
    }

    const headers = ['Order ID', 'Buyer Name', 'Organization / School', 'Email', 'Phone', 'Licensing Tier', 'Source', 'Status', 'Notes', 'Created At'];
    const rows = filteredOrders.map(o => [
      `"${o._id || ''}"`,
      `"${(o.studentName || '').replace(/"/g, '""')}"`,
      `"${(o.parentName || '').replace(/"/g, '""')}"`,
      `"${(o.email || '').replace(/"/g, '""')}"`,
      `"${(o.contactNumber || '').replace(/"/g, '""')}"`,
      `"${(o.targetClass || '').replace(/"/g, '""')}"`,
      `"${(o.source || '').replace(/"/g, '""')}"`,
      `"${(o.status || o.stage || 'New Enquiry').replace(/"/g, '""')}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
      `"${o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `license_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to generate simulated deterministic license key
  const getLicenseKey = (order) => {
    if (!order) return '';
    const hash = Math.abs((order._id || 'ACS').split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    const code = ('00000000' + hash).slice(-8);
    return `ACS-LIC-2026-${code.slice(0, 4)}-${code.slice(4)}`;
  };

  const copyToClipboard = (text, type = 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  return (
    <div className="px-3 sm:px-6 py-5 max-w-[1380px] w-full mx-auto min-h-[85vh]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30 uppercase tracking-wide flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
              Commercial Licensing Hub
            </span>
            <span className="text-xs text-slate-400 font-medium">• Live Multi-Tenant Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            Commercial License Orders
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              ₹10,000 Package
            </span>
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 max-w-2xl">
            Real-time purchase requests submitted from the Multi-School ERP landing modal (<code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">BUY SOURCE CODE</code>). Manage buyer licenses, dispatch code repositories, and track revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Total Orders */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{kpis.total}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-bold text-orange-600">{kpis.landingLeads}</span> from Landing Web (₹10K)
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Action</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 tracking-tight">{kpis.pending}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Awaiting contact or payment</span>
          </div>
        </div>

        {/* Licenses Issued */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Licenses Issued</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">{kpis.issued}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Fulfilled / Converted</span>
          </div>
        </div>

        {/* Estimated Pipeline Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{kpis.totalPipelineValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>₹{kpis.convertedRevenue.toLocaleString()} collected / fulfilled</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-100 pb-3 mb-4 overflow-x-auto scrollbar-none">
          {['All', 'Landing Web (₹10K)', 'New / Pending', 'Contacted', 'License Issued', 'Cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by buyer name, school / agency, phone, email, notes..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Lead Sources</option>
              <option value="Multi_School_Erp Landing Web">Multi_School_Erp Landing Web</option>
              <option value="SuperAdmin Manual Entry">SuperAdmin Manual Entry</option>
              <option value="Website">General Website</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-orange-500"
            >
              <option value="Newest">Sort: Newest Orders First</option>
              <option value="Oldest">Sort: Oldest Orders First</option>
              <option value="Name">Sort: Buyer Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / List Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-600">Loading Commercial License Orders...</p>
            <p className="text-[11px] text-slate-400 mt-1">Fetching live records from MongoDB collection</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? 'No orders match your search criteria. Try clearing the filter.' : 'No commercial purchase orders recorded yet. When users submit the ₹10K source code form on the landing page, they will appear here instantly.'}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(''); setActiveTab('All'); setSourceFilter('All'); }}
                className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Buyer & Organization</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Licensing Tier & Package</th>
                    <th className="py-3.5 px-4">Order Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.map(order => {
                    const stg = order.status || order.stage || 'New Enquiry';
                    const cfg = STATUS_CONFIG[stg] || STATUS_CONFIG['New Enquiry'];
                    const StatusIcon = cfg.icon;
                    const cleanPhone = (order.contactNumber || '').replace(/[^\d+]/g, '');

                    return (
                      <tr key={order._id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Buyer & Org */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                              {(order.studentName || 'B').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                                <span>{order.studentName || 'Unnamed Buyer'}</span>
                                {order.source?.includes('Multi_School_Erp') && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    Landing Web
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                <Building className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{order.parentName || 'Independent Developer / Agency'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <a
                              href={`mailto:${order.email}`}
                              className="text-slate-800 hover:text-orange-600 flex items-center gap-1.5 font-medium transition"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[170px]">{order.email}</span>
                            </a>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px]"
                              >
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{order.contactNumber || 'No phone'}</span>
                              </a>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hi ${order.studentName || ''}, thank you for your enquiry regarding School ERP Full Source Code (₹10,000 package).`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border border-emerald-200"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Plan & Tier */}
                        <td className="py-3.5 px-4">
                          <div className="max-w-[260px]">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                              <Sparkles className="w-3 h-3 text-orange-500 shrink-0" />
                              <span className="truncate">{order.targetClass || '₹10,000 — Full Commercial Source Code'}</span>
                            </div>
                            {order.notes && (
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                                "{order.notes}"
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-800 font-medium">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs">
                            <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1 ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-lg text-slate-600 transition shadow-2xs cursor-pointer"
                              title="View Order Details & Generate License"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-500 hover:text-white rounded-lg text-slate-500 transition shadow-2xs cursor-pointer"
                              title="Delete enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Optimized for Phones) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredOrders.map(order => {
                const stg = order.status || order.stage || 'New Enquiry';
                const cfg = STATUS_CONFIG[stg] || STATUS_CONFIG['New Enquiry'];
                const cleanPhone = (order.contactNumber || '').replace(/[^\d+]/g, '');

                return (
                  <div key={order._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
                          {(order.studentName || 'B').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{order.studentName}</h4>
                          <p className="text-[11px] text-slate-500">{order.parentName || 'Individual'}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <div className="font-bold text-orange-700">{order.targetClass || '₹10,000 Source Code Package'}</div>
                      <div className="text-slate-600 truncate">{order.email}</div>
                      <div className="text-slate-500">{order.contactNumber}</div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hi ${order.studentName}, regarding your School ERP source code order...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table Footer info */}
            <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredOrders.length} of {orders.length} total purchase orders</span>
              <span className="font-semibold text-slate-700">Commercial License Gateway Active</span>
            </div>
          </>
        )}
      </div>

      {/* MODAL 1: ORDER DETAILS & LICENSE DISPATCH MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Commercial Order Details</h3>
                  <p className="text-xs text-slate-400">Order ID: <span className="font-mono text-orange-300">{selectedOrder._id}</span></p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Buyer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Buyer Name</span>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-orange-500" />
                    {selectedOrder.studentName || 'N/A'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Organization / School</span>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-500" />
                    {selectedOrder.parentName || 'Independent'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${selectedOrder.email}`} className="text-blue-600 hover:underline">{selectedOrder.email}</a>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">WhatsApp / Contact</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedOrder.contactNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Requested Package Tier</span>
                  <span className="text-xs font-black text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                    ₹10,000 INR
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{selectedOrder.targetClass || 'Full Commercial Source Code (38 Modules + 3 Mobile Apps)'}</p>
                {selectedOrder.notes && (
                  <div className="mt-2 pt-2 border-t border-amber-200/70 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700">Client Note: </span>
                    {selectedOrder.notes}
                  </div>
                )}
              </div>

              {/* Generated License Key */}
              <div className="bg-slate-900 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    Activation License Key
                  </span>
                  <button
                    onClick={() => copyToClipboard(getLicenseKey(selectedOrder), 'key')}
                    className="flex items-center gap-1 text-[11px] font-bold text-orange-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
                  </button>
                </div>
                <div className="font-mono text-base font-black tracking-widest text-emerald-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center select-all">
                  {getLicenseKey(selectedOrder)}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  Share this key with the client upon confirmation of ₹10,000 commercial payment.
                </p>
              </div>

              {/* Status Update Options */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Update Order Fulfillment Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['New Enquiry', 'Contacted', 'Enrolled', 'Lost / Rejected'].map(st => {
                    const active = (selectedOrder.status === st || selectedOrder.stage === st);
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedOrder._id, st)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                          active 
                            ? 'bg-orange-500 text-white border-orange-500 shadow-xs' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st === 'Enrolled' ? 'License Issued' : st === 'Lost / Rejected' ? 'Cancelled' : st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dispatch Template */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Quick Client WhatsApp / Email Message</span>
                  <button
                    onClick={() => {
                      const msg = `Hi ${selectedOrder.studentName || 'Client'},\n\nThank you for choosing the All Core Solution Multi-School ERP Full Source Code Package (₹10,000 Commercial Edition).\n\nYour Order ID: ${selectedOrder._id}\nYour License Key: ${getLicenseKey(selectedOrder)}\n\nYou can access your complete 38 Modules + 3 Mobile Apps repository drive link. For any deployment support, reach us directly.\n\nWarm regards,\nSuperAdmin Platform Team`;
                      copyToClipboard(msg, 'message');
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                  >
                    {copiedMessage ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMessage ? 'Message Copied!' : 'Copy Dispatch Message'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-mono bg-white p-2.5 rounded border border-slate-200 line-clamp-3">
                  Hi {selectedOrder.studentName || 'Client'}, Thank you for choosing the Multi-School ERP Full Source Code Package (₹10,000 Commercial Edition). License Key: {getLicenseKey(selectedOrder)}...
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedOrder.contactNumber && (
                  <a
                    href={`https://wa.me/${selectedOrder.contactNumber.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL ORDER CREATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base text-white">Record Manual License Order</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Buyer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.studentName}
                  onChange={e => setNewOrderForm({ ...newOrderForm, studentName: e.target.value })}
                  placeholder="e.g. Vikramaditya Rathore"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">School / Organization Name</label>
                <input
                  type="text"
                  value={newOrderForm.parentName}
                  onChange={e => setNewOrderForm({ ...newOrderForm, parentName: e.target.value })}
                  placeholder="e.g. Apex Global Academy / Tech Ventures"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newOrderForm.email}
                    onChange={e => setNewOrderForm({ ...newOrderForm, email: e.target.value })}
                    placeholder="buyer@domain.com"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.contactNumber}
                    onChange={e => setNewOrderForm({ ...newOrderForm, contactNumber: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Package Tier</label>
                <select
                  value={newOrderForm.targetClass}
                  onChange={e => setNewOrderForm({ ...newOrderForm, targetClass: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                >
                  <option value="₹10,000 — Full Commercial Source Code (All 38 Modules + 3 Apps)">
                    ₹10,000 — Full Commercial Source Code (All 38 Modules + 3 Apps)
                  </option>
                  <option value="₹25,000 — White-label Enterprise SaaS License">
                    ₹25,000 — White-label Enterprise SaaS License
                  </option>
                  <option value="₹5,000 — Single School Self-Hosted Deployment">
                    ₹5,000 — Single School Self-Hosted Deployment
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes / Payment Details</label>
                <textarea
                  rows={2}
                  value={newOrderForm.notes}
                  onChange={e => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                  placeholder="Payment UTR, custom requirements, server info..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Save & Record Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

