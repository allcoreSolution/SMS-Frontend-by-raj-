import React, { useEffect, useState } from 'react';
import { 
  Search, Mail, Info, ChevronDown, Plus, Download, Building2, 
  Users, CheckCircle2, AlertTriangle, ExternalLink, Edit3, Trash2, 
  Power, ShieldCheck, X, Phone, MapPin, Sparkles, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import branchAdminService from '../api/branchAdminService';
import KpiCard from '../components/common/KpiCard';


const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    code: '',
    principal: '',
    email: '',
    phone: '',
    address: '',
    plan: 'Enterprise Plan',
    sub: 'Yearly',
    students: 500,
    staff: 35,
    status: 'Active'
  };
  const [formData, setFormData] = useState(initialFormState);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await branchAdminService.getBranches();
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setBranches(res.data);
      } else {
        const data = branchLocalDb.getBranches();
        setBranches(data);
      }
    } catch (err) {
      console.error('Branches fetch error:', err);
      setBranches(branchLocalDb.getBranches());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  // Filtered dataset
  const filteredBranches = branches.filter(b => {
    const matchesTab = activeTab === 'All' ? true : b.status === activeTab;
    const matchesPlan = planFilter === 'All' ? true : b.plan === planFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      b.name?.toLowerCase().includes(q) ||
      b.code?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.principal?.toLowerCase().includes(q) ||
      b.address?.toLowerCase().includes(q);
    return matchesTab && matchesPlan && matchesSearch;
  });

  const tabs = [
    { name: 'All', count: branches.length },
    { name: 'Active', count: branches.filter(b => b.status === 'Active').length },
    { name: 'Inactive', count: branches.filter(b => b.status === 'Inactive').length },
    { name: 'Suspended', count: branches.filter(b => b.status === 'Suspended').length },
  ];

  // Stats
  const totalStudents = branches.reduce((sum, b) => sum + (Number(b.students) || 0), 0);
  const totalStaff = branches.reduce((sum, b) => sum + (Number(b.staff) || 0), 0);
  const activeCount = branches.filter(b => b.status === 'Active').length;

  // Handlers
  const handleExportCsv = () => {
    const headers = [
      { key: 'code', label: 'Branch Code' },
      { key: 'name', label: 'Campus Name' },
      { key: 'principal', label: 'Principal' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'plan', label: 'Plan' },
      { key: 'status', label: 'Status' },
      { key: 'students', label: 'Enrolled Students' },
      { key: 'staff', label: 'Faculty Staff' },
      { key: 'address', label: 'Location' },
      { key: 'reg', label: 'Registration Date' },
      { key: 'renews', label: 'Renewal Date' }
    ];
    const success = branchLocalDb.exportToCsv('branches_master_directory', headers, filteredBranches);
    if (success) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Branches list exported to CSV!',
        showConfirmButton: false,
        timer: 2500
      });
    }
  };

  const handleOpenAddModal = () => {
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name || '',
      code: branch.code || '',
      principal: branch.principal || '',
      email: branch.email || '',
      phone: branch.phone || '',
      address: branch.address || '',
      plan: branch.plan || 'Enterprise Plan',
      sub: branch.sub || 'Yearly',
      students: branch.students || 0,
      staff: branch.staff || 0,
      status: branch.status || 'Active'
    });
    setOpenDropdown(null);
    setIsEditModalOpen(true);
  };

  const handleSaveNewBranch = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      Swal.fire('Missing Details', 'Please enter campus name and official email.', 'warning');
      return;
    }

    const code = formData.code || `BR-${Math.floor(100 + Math.random() * 900)}`;
    const newBranchPayload = {
      ...formData,
      code,
      collected: '₹0.00',
      collectedRaw: 0,
      attendance: '95.0%',
      rows: '1,000',
      renews: '12 Oct, 2027',
      domain: `${code.toLowerCase()}.schoolerp.com`
    };

    setLoading(true);
    await branchAdminService.createBranch(newBranchPayload);
    await loadData();
    setIsAddModalOpen(false);

    Swal.fire({
      icon: 'success',
      title: 'Branch Created & Synced!',
      text: `${formData.name} has been successfully registered in Central MongoDB.`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    if (!selectedBranch) return;

    setLoading(true);
    const branchId = selectedBranch._id || selectedBranch.id;
    await branchAdminService.updateBranch(branchId, formData);
    await loadData();
    setIsEditModalOpen(false);
    setSelectedBranch(null);

    Swal.fire({
      icon: 'success',
      title: 'Branch Updated & Synced!',
      text: 'Campus configuration saved successfully in Central MongoDB.',
      timer: 1800,
      showConfirmButton: false
    });
  };

  const handleToggleStatus = (branch) => {
    setOpenDropdown(null);
    const newStatus = branch.status === 'Active' ? 'Suspended' : 'Active';
    const actionText = newStatus === 'Suspended' ? 'suspend' : 'activate';

    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} access for "${branch.name}"?`,
      icon: newStatus === 'Suspended' ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Suspended' ? '#dc3545' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${actionText} it!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const branchId = branch._id || branch.id;
        await branchAdminService.updateBranch(branchId, { status: newStatus });
        await loadData();
        Swal.fire('Updated!', `Campus is now marked as ${newStatus} in Central MongoDB.`, 'success');
      }
    });
  };

  const handleDeleteBranch = (branch) => {
    setOpenDropdown(null);
    Swal.fire({
      title: 'Delete Campus Record?',
      text: `Are you sure you want to delete ${branch.name}? This will remove it from Central MongoDB & Multi-School.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete campus'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const branchId = branch._id || branch.id;
        await branchAdminService.deleteBranch(branchId);
        await loadData();
        Swal.fire('Deleted!', 'The campus record has been removed from Central MongoDB.', 'success');
      }
    });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-70px)] bg-[#f4f7fa]">
      
      {/* Top Banner / Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <Building2 className="w-4 h-4" /> Multi-Tenant Campus Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Manage Branches & Campuses
            <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-bold">
              {branches.length} Total
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time multi-branch directory, student capacity, subscription licensing and access controls.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer"
            title="Refresh Live Data from Central Database"
          >
            <RefreshCw className={`w-4 h-4 text-orange-500 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{loading ? 'Syncing...' : 'Live Sync'}</span>
          </button>
          <button 
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-all"
            title="Download CSV Table"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add New Branch
          </button>
        </div>
      </div>

      {/* KPI Cards - Standardized h-[110px] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Total Campuses"
          value={String(branches.length)}
          subText="Registered Institutes"
          isLive={true}
          icon={Building2}
          glowColor="#f97316"
          stroke="#f97316"
          iconBg="linear-gradient(135deg, #fb923c, #f97316)"
          iconColor="#ffffff"
          spark={[2, 3, 3, 4, 4, 4, 4]}
          badge="Live Synced"
        />
        <KpiCard 
          title="Active Campuses"
          value={String(activeCount)}
          subText={`${branches.length - activeCount} paused / suspended`}
          isLive={false}
          icon={ShieldCheck}
          glowColor="#10b981"
          stroke="#10b981"
          iconBg="linear-gradient(135deg, #34d399, #10b981)"
          iconColor="#ffffff"
          spark={[2, 2, 3, 3, 4, 4, 4]}
          badge="Healthy"
        />
        <KpiCard 
          title="Total Enrolled"
          value={totalStudents.toLocaleString('en-IN')}
          subText="Students across network"
          isLive={false}
          icon={Users}
          glowColor="#3b82f6"
          stroke="#3b82f6"
          iconBg="linear-gradient(135deg, #60a5fa, #3b82f6)"
          iconColor="#ffffff"
          spark={[1200, 1800, 2400, 3100, 3800, 4200, 4478]}
          badge="+8.4% YoY"
        />
        <KpiCard 
          title="Faculty & Staff"
          value={totalStaff.toLocaleString('en-IN')}
          subText="Teachers & administrative team"
          isLive={false}
          icon={Sparkles}
          glowColor="#8b5cf6"
          stroke="#8b5cf6"
          iconBg="linear-gradient(135deg, #a78bfa, #8b5cf6)"
          iconColor="#ffffff"
          spark={[120, 145, 170, 190, 205, 218]}
          badge="Full Roster"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-2 font-medium text-sm overflow-x-auto bg-gray-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-5 py-3 whitespace-nowrap transition-all flex items-center gap-2 border-b-2 font-bold ${
                activeTab === tab.name 
                  ? 'text-orange-600 border-orange-500 bg-white rounded-t-lg shadow-xs' 
                  : 'text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-200'
              }`}
            >
              {tab.name}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.name ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="p-5 border-b border-gray-100 bg-white grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 absolute left-3.5 top-[12px] text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search branch name, code, principal or city..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-[10px] text-xs text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <select 
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="All">All Plans</option>
                <option value="Enterprise Plan">Enterprise Plan</option>
                <option value="Growth Plan">Growth Plan</option>
                <option value="Standard Plan">Standard Plan</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <button 
              onClick={() => { setSearchQuery(''); setPlanFilter('All'); setActiveTab('All'); }}
              className="w-full py-2 px-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[12px] font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">Campus & Code</th>
                <th className="py-3 px-4">Principal & Contact</th>
                <th className="py-3 px-4">Plan & Billing</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Students / Staff</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500 font-medium">
                    <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Loading branches network...
                  </td>
                </tr>
              ) : filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-base font-semibold text-gray-700">No branches found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or active filter tab.</p>
                  </td>
                </tr>
              ) : (
                filteredBranches.map((branch, i) => (
                  <tr 
                    key={branch.id || i}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    {/* Branch Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100/70 border border-orange-200 text-orange-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {branch.code ? branch.code.slice(0, 3) : 'SCH'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 leading-tight">
                            {branch.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {branch.code}
                            </span>
                            {branch.address && (
                              <span className="text-[11px] text-gray-400 flex items-center gap-0.5 truncate max-w-[200px]">
                                <MapPin className="w-3 h-3 shrink-0" /> {branch.address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Principal & Email */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800">
                        {branch.principal || 'Head Administrator'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-400" /> {branch.email}
                      </div>
                      {branch.phone && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" /> {branch.phone}
                        </div>
                      )}
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {branch.plan}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        Billed {branch.sub || 'Yearly'} • Renews {branch.renews || 'N/A'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        branch.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : branch.status === 'Suspended'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          branch.status === 'Active' ? 'bg-emerald-500' :
                          branch.status === 'Suspended' ? 'bg-rose-500' : 'bg-gray-400'
                        }`} />
                        {branch.status}
                      </span>
                    </td>

                    {/* Capacity */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">
                        {Number(branch.students || 0).toLocaleString()} <span className="text-xs font-normal text-gray-500">Students</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {branch.staff || 0} Faculty / Staff
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {branch.reg || '12 Oct, 2026'}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        >
                          Actions <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                        </button>

                        {openDropdown === i && (
                          <div 
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 divide-y divide-gray-100 text-left py-1"
                            onMouseLeave={() => setOpenDropdown(null)}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleOpenEditModal(branch)}
                                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Edit Campus Details
                              </button>
                              <a
                                href={`http://${branch.domain || 'localhost:5173'}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" /> Open Branch Portal
                              </a>
                            </div>

                            <div className="py-1">
                              <button
                                onClick={() => handleToggleStatus(branch)}
                                className={`w-full px-4 py-2 text-xs flex items-center gap-2 font-medium ${
                                  branch.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                <Power className="w-3.5 h-3.5" /> 
                                {branch.status === 'Active' ? 'Suspend Access' : 'Activate Access'}
                              </button>
                              <button
                                onClick={() => handleDeleteBranch(branch)}
                                className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete Campus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div>
            Showing <span className="font-bold text-gray-800">{filteredBranches.length}</span> of {branches.length} registered campuses
          </div>
          <div className="flex items-center gap-2">
            <span>Enterprise Multi-Tenant Node</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-700">Healthy</span>
          </div>
        </div>
      </div>

      {/* ================= ADD BRANCH MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            <div className="px-6 py-4.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Register New Campus</h3>
                  <p className="text-xs text-orange-100">Setup branch profile, subscription & capacity limits</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewBranch} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    School / Campus Name *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Cambridge International School"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Branch Code
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. CIS-DELHI"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="admin@schoolname.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Principal / Dean Name
                  </label>
                  <input 
                    type="text"
                    placeholder="Dr. Rajesh Saxena"
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input 
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Campus Address / City
                  </label>
                  <input 
                    type="text"
                    placeholder="Civil Lines, Delhi"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Subscription Tier
                  </label>
                  <select 
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                  >
                    <option value="Enterprise Plan">Enterprise Plan (Unlimited)</option>
                    <option value="Growth Plan">Growth Plan (1,000 Students)</option>
                    <option value="Standard Plan">Standard Plan (500 Students)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Initial Student Capacity
                  </label>
                  <input 
                    type="number"
                    min="50"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-bold shadow-md shadow-orange-500/20"
                >
                  Create & Activate Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT BRANCH MODAL ================= */}
      {isEditModalOpen && selectedBranch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            <div className="px-6 py-4.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Edit Campus Profile</h3>
                  <p className="text-xs text-blue-100">{selectedBranch.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateBranch} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    School / Campus Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Branch Code
                  </label>
                  <input 
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Principal
                  </label>
                  <input 
                    type="text"
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Campus Address
                  </label>
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Enrolled Students
                  </label>
                  <input 
                    type="number"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Faculty Staff
                  </label>
                  <input 
                    type="number"
                    value={formData.staff}
                    onChange={(e) => setFormData({ ...formData, staff: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-500/20"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
