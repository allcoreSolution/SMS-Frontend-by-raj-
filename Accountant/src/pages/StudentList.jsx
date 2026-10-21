import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, UserPlus, Search, Filter, Eye, Edit, Trash2, User, Plus, X, Save,
  Download, Phone, Mail, MapPin, CreditCard, CheckCircle2, AlertCircle,
  LayoutGrid, List, ArrowUpDown, Calendar, MessageSquare, Printer, Check,
  ChevronLeft, ChevronRight, SlidersHorizontal, UserCheck, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { accountantService } from '../api/accountantService';
import localDb from '../api/localDb';

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering state
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [dueFilter, setDueFilter] = useState('ALL'); // ALL | DUE | PAID
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name_asc'); // name_asc | name_desc | roll_asc | due_desc | due_asc
  const [viewMode, setViewMode] = useState('table'); // table | grid

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add | edit
  const [editId, setEditId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); // for View Details modal
  const [showViewModal, setShowViewModal] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    class: '10-A',
    roll: '',
    admNo: '',
    father: '',
    mother: '',
    phone: '',
    email: '',
    gender: 'Male',
    dob: '2010-01-01',
    address: '',
    due: 0,
    totalFee: 25000,
    admissionDate: new Date().toISOString().slice(0, 10),
    status: 'Active',
  };
  const [form, setForm] = useState(initialForm);

  // Load students from service/localDb
  const load = async () => {
    try {
      setLoading(true);
      const res = await accountantService.getStudents();
      if (res && res.success) {
        setStudents(res.data || []);
      } else {
        const fallback = localDb.getAll('students');
        setStudents(fallback || []);
      }
    } catch (e) {
      console.error('Failed to load students:', e);
      const fallback = localDb.getAll('students');
      setStudents(fallback || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Compute unique classes for filter
  const classList = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.class) set.add(s.class);
    });
    return Array.from(set).sort();
  }, [students]);

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const q = search.toLowerCase().trim();
        const matchesQuery =
          !q ||
          s.name?.toLowerCase().includes(q) ||
          s.roll?.toString().toLowerCase().includes(q) ||
          s.admNo?.toLowerCase().includes(q) ||
          s.class?.toLowerCase().includes(q) ||
          s.father?.toLowerCase().includes(q) ||
          s.phone?.includes(q);

        const matchesClass = classFilter === 'ALL' || s.class === classFilter;
        const dueVal = Number(s.due || 0);
        const matchesDue =
          dueFilter === 'ALL' ||
          (dueFilter === 'DUE' && dueVal > 0) ||
          (dueFilter === 'PAID' && dueVal === 0);

        const matchesGender = genderFilter === 'ALL' || s.gender === genderFilter;

        return matchesQuery && matchesClass && matchesDue && matchesGender;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
        if (sortBy === 'roll_asc') return Number(a.roll || 0) - Number(b.roll || 0);
        if (sortBy === 'due_desc') return Number(b.due || 0) - Number(a.due || 0);
        if (sortBy === 'due_asc') return Number(a.due || 0) - Number(b.due || 0);
        return 0;
      });
  }, [students, search, classFilter, dueFilter, genderFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Overall KPIs
  const totalStudentsCount = students.length;
  const totalDueAmount = students.reduce((acc, s) => acc + Number(s.due || 0), 0);
  const studentsWithDueCount = students.filter((s) => Number(s.due || 0) > 0).length;
  const studentsPaidCount = students.filter((s) => Number(s.due || 0) === 0).length;

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode('add');
    setEditId(null);
    const nextRoll = (students.length + 101).toString();
    const nextAdm = `ADM-2026/${1000 + students.length + 1}`;
    setForm({
      ...initialForm,
      roll: nextRoll,
      admNo: nextAdm,
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (s) => {
    setModalMode('edit');
    const id = s.id || s._id;
    setEditId(id);
    setForm({
      name: s.name || '',
      class: s.class || '10-A',
      roll: s.roll || '',
      admNo: s.admNo || `ADM-${s.roll || '101'}`,
      father: s.father || '',
      mother: s.mother || '',
      phone: s.phone || '',
      email: s.email || '',
      gender: s.gender || 'Male',
      dob: s.dob || '2010-01-01',
      address: s.address || '',
      due: Number(s.due || 0),
      totalFee: Number(s.totalFee || 25000),
      admissionDate: s.admissionDate || '2026-04-10',
      status: s.status || 'Active',
    });
    setShowModal(true);
  };

  // View Details Modal
  const handleOpenView = (s) => {
    setSelectedStudent(s);
    setShowViewModal(true);
  };

  // Submit Add / Edit
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire('Validation Error', 'Student Full Name is required.', 'warning');
      return;
    }
    if (!form.class.trim()) {
      Swal.fire('Validation Error', 'Class is required.', 'warning');
      return;
    }

    try {
      const payload = {
        ...form,
        due: Number(form.due || 0),
        totalFee: Number(form.totalFee || 25000),
      };

      if (modalMode === 'edit' && editId) {
        localDb.update('students', editId, payload);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Student record updated!',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        await accountantService.addStudent(payload);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'New student admitted successfully!',
          showConfirmButton: false,
          timer: 2000,
        });
      }

      setShowModal(false);
      load();
    } catch (err) {
      Swal.fire('Save Failed', err.message || 'Could not save student data', 'error');
    }
  };

  // Delete Student
  const handleDelete = async (id, name) => {
    const conf = await Swal.fire({
      title: `Delete ${name}?`,
      text: 'This will permanently remove this student record from the school ledger.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd4b39',
      cancelButtonColor: '#777',
      confirmButtonText: 'Yes, delete record',
    });

    if (conf.isConfirmed) {
      await accountantService.deleteStudent(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Student deleted successfully',
        showConfirmButton: false,
        timer: 1800,
      });
      load();
    }
  };

  // Send WhatsApp / SMS Reminder
  const handleSendReminder = (student) => {
    const dueAmount = (student.due || 0).toLocaleString('en-IN');
    Swal.fire({
      title: 'Send Fee Overdue Reminder',
      html: `
        <div class="text-left text-[13px] bg-gray-50 p-3 rounded border border-gray-200 mb-3 space-y-1">
          <div><strong>Student:</strong> ${student.name} (${student.class})</div>
          <div><strong>Parent:</strong> ${student.father || 'Guardian'}</div>
          <div><strong>Mobile:</strong> +91 ${student.phone || 'N/A'}</div>
          <div><strong>Pending Due:</strong> <span class="text-red-600 font-bold">₹ ${dueAmount}</span></div>
        </div>
        <p class="text-[12px] text-gray-500 text-left">Choose delivery gateway to notify the parent:</p>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '📱 WhatsApp Notice',
      denyButtonText: '💬 Send SMS Notice',
      confirmButtonColor: '#25D366',
      denyButtonColor: '#00a65a',
    }).then((result) => {
      if (result.isConfirmed) {
        const text = encodeURIComponent(
          `Dear Parent, this is an official reminder from Oxford Public School. The pending fee for ${student.name} (${student.class}) is ₹ ${dueAmount}. Kindly clear the dues before the deadline. Thank you!`
        );
        window.open(`https://api.whatsapp.com/send?phone=91${student.phone}&text=${text}`, '_blank');
      } else if (result.isDenied) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `SMS reminder dispatched to +91 ${student.phone}`,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Admission No', 'Roll No', 'Student Name', 'Class', 'Gender', 'Father Name', 'Phone', 'Total Fee', 'Due Amount', 'Status'];
    const rows = filteredStudents.map((s) => [
      `"${s.admNo || ''}"`,
      `"${s.roll || ''}"`,
      `"${s.name || ''}"`,
      `"${s.class || ''}"`,
      `"${s.gender || ''}"`,
      `"${s.father || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.totalFee || 0}"`,
      `"${s.due || 0}"`,
      `"${s.status || 'Active'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `oxford_student_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Exported ${filteredStudents.length} students to CSV!`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Print Roster
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-3 sm:p-5 font-sans">
      {/* ─── Top Header Ribbon ─── */}
      <div className="bg-white rounded-t-[3px] border-t-[3px] border-t-[#3c8dbc] shadow-sm p-4 sm:p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#3c8dbc] shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] sm:text-[22px] font-bold text-[#222d32] tracking-tight">Student Directory & Profiles</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-100 text-[#3c8dbc] border border-blue-200">
                Academic Year 2026-27
              </span>
            </div>
            <p className="text-[12.5px] text-gray-500 mt-0.5">
              Manage student enrollment, class allocations, guardian contacts, and live fee dues.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-[12.5px] font-medium rounded border border-gray-300 shadow-xs transition-colors cursor-pointer"
            title="Download Excel / CSV"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-[12.5px] font-medium rounded border border-gray-300 shadow-xs transition-colors cursor-pointer"
            title="Print roster"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white text-[12.5px] font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit Student</span>
          </button>
        </div>
      </div>

      {/* ─── Top 4 KPI Metric Chips ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Total Students */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#3c8dbc]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Total Enrolled</div>
            <div className="text-[22px] font-black text-gray-800 mt-0.5">{totalStudentsCount} Students</div>
            <div className="text-[11.5px] text-gray-500 mt-0.5">Across {classList.length} grade sections</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Outstanding Dues */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#dd4b39]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Total Dues Pending</div>
            <div className="text-[22px] font-black text-[#dd4b39] mt-0.5">₹ {totalDueAmount.toLocaleString('en-IN')}</div>
            <div className="text-[11.5px] text-gray-500 mt-0.5">{studentsWithDueCount} students with dues</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#dd4b39] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Fees Cleared Students */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#00a65a]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Fee 100% Cleared</div>
            <div className="text-[22px] font-black text-[#00a65a] mt-0.5">{studentsPaidCount} Students</div>
            <div className="text-[11.5px] text-emerald-600 font-medium mt-0.5">
              {totalStudentsCount > 0 ? Math.round((studentsPaidCount / totalStudentsCount) * 100) : 0}% clearance rate
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 text-[#00a65a] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Active Classes */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#f39c12]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Academic Classes</div>
            <div className="text-[22px] font-black text-[#f39c12] mt-0.5">{classList.length} Sections</div>
            <div className="text-[11.5px] text-gray-500 mt-0.5">Nursery to Class 10</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#f39c12] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─── Search & Advanced Filter Toolbar ─── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-3.5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, roll no, admission no, father name, or phone..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[12px]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Class Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-gray-500 hidden sm:inline">Class:</span>
              <select
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 border border-gray-300 rounded text-[12.5px] bg-white text-gray-700 outline-none focus:border-[#3c8dbc]"
              >
                <option value="ALL">All Classes ({classList.length})</option>
                {classList.map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            {/* Fee Due Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-gray-500 hidden sm:inline">Fee Status:</span>
              <select
                value={dueFilter}
                onChange={(e) => {
                  setDueFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 border border-gray-300 rounded text-[12.5px] bg-white text-gray-700 outline-none focus:border-[#3c8dbc]"
              >
                <option value="ALL">All Status</option>
                <option value="DUE">🚨 Dues Pending</option>
                <option value="PAID">✅ Fully Paid</option>
              </select>
            </div>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-[12.5px] bg-white text-gray-700 outline-none focus:border-[#3c8dbc]"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Boy (Male)</option>
              <option value="Female">Girl (Female)</option>
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded text-[12.5px] bg-white text-gray-700 outline-none focus:border-[#3c8dbc]"
              >
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="roll_asc">Roll Number</option>
                <option value="due_desc">Highest Due First</option>
                <option value="due_asc">Lowest Due First</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-white text-[#3c8dbc] shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-[#3c8dbc] shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content: Table or Grid ─── */}
      {loading ? (
        <div className="bg-white rounded-[3px] border border-gray-200 p-12 text-center text-gray-500">
          <div className="w-8 h-8 border-3 border-[#3c8dbc] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] font-semibold">Loading student directory...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-[3px] border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-[15px] font-bold text-gray-700">No students found</h3>
          <p className="text-[13px] text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or class filters, or admit a new student into the directory.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setClassFilter('ALL');
              setDueFilter('ALL');
              setGenderFilter('ALL');
            }}
            className="mt-4 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#3c8dbc] border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ─── Modern Table View ─── */
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-gray-100/80 text-gray-700 font-bold border-b border-gray-200 text-[12px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student & Adm No</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Father / Guardian</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4 text-right">Fee Status & Due</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStudents.map((s, idx) => {
                  const dueVal = Number(s.due || 0);
                  const totalVal = Number(s.totalFee || 25000);
                  const paidVal = Math.max(0, totalVal - dueVal);
                  const paidPct = Math.min(100, Math.round((paidVal / totalVal) * 100));
                  const serialNo = (currentPage - 1) * pageSize + idx + 1;
                  const isFemale = s.gender === 'Female';

                  return (
                    <tr key={s.id || s._id || idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-mono text-[12px]">
                        {serialNo}
                      </td>

                      {/* Student Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] text-white shrink-0 shadow-xs ${
                              isFemale ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            }`}
                          >
                            {s.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#333] hover:text-[#3c8dbc] transition-colors cursor-pointer" onClick={() => handleOpenView(s)}>
                              {s.name}
                            </div>
                            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <span className="bg-gray-100 px-1.5 py-0.2 rounded border border-gray-200">
                                {s.admNo || `ADM-${s.roll || '101'}`}
                              </span>
                              <span>• {s.gender || 'Student'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded font-bold text-[12px] bg-blue-50 text-[#3c8dbc] border border-blue-200">
                          Class {s.class}
                        </span>
                      </td>

                      {/* Roll */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-gray-700">
                        #{s.roll || '—'}
                      </td>

                      {/* Father / Guardian */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#333]">{s.father || '—'}</div>
                        {s.mother && <div className="text-[11px] text-gray-400">M: {s.mother}</div>}
                      </td>

                      {/* Contact Phone */}
                      <td className="py-3.5 px-4">
                        {s.phone ? (
                          <div className="flex items-center gap-1.5 text-gray-700 font-mono text-[12.5px]">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{s.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Fee Status & Due */}
                      <td className="py-3.5 px-4 text-right">
                        <div>
                          {dueVal === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800 border border-green-200">
                              <Check className="w-3 h-3 stroke-[3]" /> Full Paid
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-[13px] font-black text-[#dd4b39]">
                              <span>₹ {dueVal.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] font-semibold px-1 py-0.2 bg-red-100 text-red-800 rounded">DUE</span>
                            </div>
                          )}

                          {/* Progress bar */}
                          <div className="w-24 ml-auto mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${dueVal === 0 ? 'bg-green-500' : 'bg-[#3c8dbc]'}`}
                              style={{ width: `${paidPct}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{paidPct}% Cleared</div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenView(s)}
                            className="p-1.5 text-gray-600 hover:text-[#3c8dbc] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {dueVal > 0 ? (
                            <button
                              onClick={() => handleSendReminder(s)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title="Send WhatsApp / SMS Fee Notice"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          ) : null}

                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-[#3c8dbc] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit Student Information"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(s.id || s._id, s.name)}
                            className="p-1.5 text-[#dd4b39] hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete Student"
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
        </div>
      ) : (
        /* ─── Modern Card Grid View ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
          {paginatedStudents.map((s, idx) => {
            const dueVal = Number(s.due || 0);
            const isFemale = s.gender === 'Female';

            return (
              <div
                key={s.id || s._id || idx}
                className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-[#3c8dbc] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-[15px] text-white shadow-xs ${
                          isFemale ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}
                      >
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] text-gray-900 leading-snug">{s.name}</h4>
                        <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                          {s.admNo || `ADM-${s.roll || '101'}`}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#3c8dbc] border border-blue-200">
                      {s.class}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[12px] text-gray-600 mb-3 bg-gray-50 p-2.5 rounded border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Roll No:</span>
                      <span className="font-semibold text-gray-800">#{s.roll || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Father:</span>
                      <span className="font-semibold text-gray-800 truncate max-w-[130px]">{s.father || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="font-mono font-medium text-gray-800">{s.phone || '—'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Fee Due Pill */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between mb-3">
                    <span className="text-[11.5px] font-bold text-gray-500 uppercase">Fee Due:</span>
                    {dueVal === 0 ? (
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-green-100 text-green-800 rounded-full border border-green-200">
                        ✅ Cleared
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[12px] font-black bg-red-100 text-red-700 rounded-full border border-red-200">
                        ₹ {dueVal.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenView(s)}
                      className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12px] font-semibold rounded transition-colors text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    {dueVal > 0 && (
                      <button
                        onClick={() => handleSendReminder(s)}
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer"
                        title="WhatsApp / SMS Reminder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 bg-blue-50 text-[#3c8dbc] hover:bg-blue-100 border border-blue-200 rounded transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id || s._id, s.name)}
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Pagination Footer Bar ─── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[12.5px] text-gray-600">
          Showing <span className="font-bold">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-bold">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
          <span className="font-bold">{totalItems}</span> filtered students
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-[12px] bg-white outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-[12.5px] font-bold text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: ADMIT / EDIT STUDENT                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#3c8dbc] text-white">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-[15px]">
                  {modalMode === 'edit' ? `Edit Student: ${form.name}` : 'Admit New Student to School'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="border-b border-gray-100 pb-2">
                <span className="text-[12px] font-bold text-[#3c8dbc] uppercase tracking-wider">
                  1. Academic & Admission Details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none"
                  >
                    <option value="Male">Male (Boy)</option>
                    <option value="Female">Female (Girl)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">
                    Class & Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10-A, 9-B"
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-semibold focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 101"
                    value={form.roll}
                    onChange={(e) => setForm({ ...form, roll: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ADM-2026/101"
                    value={form.admNo}
                    onChange={(e) => setForm({ ...form, admNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="border-b border-gray-100 pb-2 pt-2">
                <span className="text-[12px] font-bold text-[#3c8dbc] uppercase tracking-wider">
                  2. Parents & Emergency Contact
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Father's Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={form.father}
                    onChange={(e) => setForm({ ...form, father: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Mother's Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunita Sharma"
                    value={form.mother}
                    onChange={(e) => setForm({ ...form, mother: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">
                    Emergency Phone / Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Home Address</label>
                  <input
                    type="text"
                    placeholder="Street, Sector, City"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              <div className="border-b border-gray-100 pb-2 pt-2">
                <span className="text-[12px] font-bold text-[#3c8dbc] uppercase tracking-wider">
                  3. Fee Structure & Due Balance
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Total Academic Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25000"
                    value={form.totalFee}
                    onChange={(e) => setForm({ ...form, totalFee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-bold text-gray-800 focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-gray-700 mb-1">Initial / Current Due Balance (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.due}
                    onChange={(e) => setForm({ ...form, due: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-bold text-[#dd4b39] focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-[13px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded text-[13px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{modalMode === 'edit' ? 'Update Student Record' : 'Save & Admit Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: FULL STUDENT PROFILE CARD (VIEW DETAILS)               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#3c8dbc] to-[#205081] text-white p-5 relative">
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center font-black text-[22px] text-white shadow-md ${
                    selectedStudent.gender === 'Female'
                      ? 'bg-gradient-to-br from-pink-500 to-rose-600'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}
                >
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold leading-tight">{selectedStudent.name}</h3>
                  <div className="flex items-center gap-2 text-[12px] opacity-90 mt-1 font-mono">
                    <span>{selectedStudent.admNo || `ADM-${selectedStudent.roll || '101'}`}</span>
                    <span>•</span>
                    <span>Class {selectedStudent.class}</span>
                    <span>•</span>
                    <span>Roll #{selectedStudent.roll}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-5 space-y-4">
              {/* Fee Clearance Card */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Current Outstanding Dues</div>
                  <div className={`text-[20px] font-black mt-0.5 ${(selectedStudent.due || 0) > 0 ? 'text-[#dd4b39]' : 'text-[#00a65a]'}`}>
                    {(selectedStudent.due || 0) === 0 ? '₹ 0 (Fully Cleared)' : `₹ ${(selectedStudent.due || 0).toLocaleString('en-IN')}`}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Annual Fee Package</div>
                  <div className="text-[15px] font-bold text-gray-800 mt-0.5">
                    ₹ {(selectedStudent.totalFee || 25000).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="divide-y divide-gray-100 text-[13px]">
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Father's Name</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.father || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Mother's Name</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.mother || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Contact Phone</span>
                  <span className="font-mono font-semibold text-gray-800">{selectedStudent.phone || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Parent Email</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.email || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Gender</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.gender || 'Student'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Home Address</span>
                  <span className="font-semibold text-gray-800 text-right max-w-[240px] truncate">{selectedStudent.address || 'Campus Zone'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 font-medium">Admission Date</span>
                  <span className="font-mono text-gray-800">{selectedStudent.admissionDate || '2026-04-10'}</span>
                </div>
              </div>

              {/* Quick Action Footer in Modal */}
              <div className="flex gap-2 pt-2">
                {(selectedStudent.due || 0) > 0 && (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleSendReminder(selectedStudent);
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[12.5px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Due Notice</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleOpenEdit(selectedStudent);
                  }}
                  className="flex-1 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded text-[12.5px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
