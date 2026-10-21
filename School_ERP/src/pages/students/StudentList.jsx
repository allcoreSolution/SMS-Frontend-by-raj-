import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, List, Grid, Filter, Download, Printer, 
  Trash2, Eye, Key, Phone, Mail, GraduationCap, 
  Sparkles, RefreshCw, X, ShieldAlert, CheckCircle2, User, Home, Tags
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';
import { academicService } from '../../api/academicService';

const StudentList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedHouse, setSelectedHouse] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [viewStudentModal, setViewStudentModal] = useState(null);
  const [credentialsModal, setCredentialsModal] = useState(null);

  const fetchClasses = async () => {
    try {
      const res = await academicService.getClasses();
      if (res?.data) setClasses(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = { limit: 1000 };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedClass !== 'All') params.classId = selectedClass;
      if (selectedHouse !== 'All') params.house = selectedHouse;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await studentService.getStudents(params);
      setStudents(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch students', err);
      Swal.fire('Error', 'Failed to connect to students database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedClass, selectedHouse, selectedCategory, selectedStatus, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Student Record?',
      text: `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await studentService.deleteStudent(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Student has been removed from the registry.',
          icon: 'success',
          customClass: { popup: 'rounded-2xl' }
        });
        fetchStudents();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['APAR ID', 'Admission No', 'Roll No', 'Name', 'Gender', 'Class', 'Section', 'House', 'Category', 'Father Name', 'Phone', 'Status'];
    const rows = students.map(s => [
      s.aparId || '',
      s.admissionNo || s.aparId || '',
      s.rollNo || '',
      `"${s.firstName} ${s.lastName || ''}"`,
      s.gender || '',
      `"${s.classId?.className || ''}"`,
      `"${s.sectionId?.sectionName || ''}"`,
      `"${s.house || ''}"`,
      `"${s.category || ''}"`,
      `"${s.fatherName || ''}"`,
      s.fatherPhone || s.studentPhone || '',
      s.status || 'Active'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Directory & Roster</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {students.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete student profiles with identity verification, parent links, and class assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4" /> Print Roster
          </button>

          <button
            onClick={() => navigate('/students/admission')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Admit New Student
          </button>
        </div>
      </div>

      {/* Tabs */}
      <StudentsTabs />

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by student name, APAR ID, admission no, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
            <button 
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 text-white text-[11px] font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              title="Grid Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={fetchStudents}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 transition-colors"
            title="Reload data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Class Filter</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.className}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">House</label>
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Houses</option>
              <option value="Red Phoenix">Red Phoenix</option>
              <option value="Blue Pegasus">Blue Pegasus</option>
              <option value="Green Dragon">Green Dragon</option>
              <option value="Yellow Hydra">Yellow Hydra</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="General">General (GEN)</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Exited">Exited (TC)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Students Content */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading student registry from MongoDB...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No students found matching your criteria</p>
          <p className="text-xs text-slate-400">Try modifying search filters or admit a new student.</p>
        </div>
      ) : viewMode === 'list' ? (
        
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-4">APAR ID / Adm No</th>
                  <th className="py-3.5 px-4">Class & Section</th>
                  <th className="py-3.5 px-4">House & Category</th>
                  <th className="py-3.5 px-4">Parent Details</th>
                  <th className="py-3.5 px-4">Medical</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student) => {
                  const avatar = student.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + (student.lastName || ''))}&background=EEEDFF&color=5F52FF`;
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-5 flex items-center gap-3">
                        <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900">{student.firstName} {student.lastName || ''}</p>
                          <p className="text-[11px] text-slate-400">{student.gender} • Roll: {student.rollNo || '-'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {student.admissionNo || student.aparId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px]">
                          {student.classId?.className || 'Class I'} ({student.sectionId?.sectionName || 'A'})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{student.house || 'Red Phoenix'}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{student.category || 'General'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{student.fatherName || 'Parent'}</p>
                        <p className="text-[11px] text-slate-400">{student.fatherPhone || student.studentPhone || '-'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px]">
                          {student.bloodGroup || 'O+'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : student.status === 'On Hold' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewStudentModal(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setCredentialsModal(student)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Portal Login Credentials"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(student._id, `${student.firstName} ${student.lastName || ''}`)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {students.map((student) => {
            const avatar = student.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + (student.lastName || ''))}&background=EEEDFF&color=5F52FF`;
            return (
              <div key={student._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <img src={avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm" />
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      student.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {student.status || 'Active'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{student.firstName} {student.lastName || ''}</h3>
                    <p className="text-xs text-indigo-600 font-mono font-medium">{student.admissionNo || student.aparId}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class:</span>
                      <span className="font-semibold text-slate-800">{student.classId?.className || 'N/A'} ({student.sectionId?.sectionName || 'A'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Roll No:</span>
                      <span className="font-semibold text-slate-800">{student.rollNo || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">House:</span>
                      <span className="font-semibold text-slate-800">{student.house || 'Red'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Father:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[130px]">{student.fatherName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Blood Group:</span>
                      <span className="font-bold text-rose-600">{student.bloodGroup || 'O+'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setViewStudentModal(student)}
                    className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setCredentialsModal(student)}
                    className="p-2 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 rounded-xl transition-colors"
                    title="Credentials"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id, `${student.firstName} ${student.lastName || ''}`)}
                    className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      )}

      {/* Student Profile Quick View Modal */}
      {viewStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src={viewStudentModal.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewStudentModal.firstName + ' ' + (viewStudentModal.lastName || ''))}&background=EEEDFF&color=5F52FF`} 
                  alt="" 
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30"
                />
                <div>
                  <h3 className="text-lg font-bold">{viewStudentModal.firstName} {viewStudentModal.lastName || ''}</h3>
                  <p className="text-xs text-indigo-200 font-mono">{viewStudentModal.admissionNo || viewStudentModal.aparId}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewStudentModal(null)}
                className="p-2 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div><span className="text-slate-400">Class & Section:</span> <p className="font-bold text-slate-900">{viewStudentModal.classId?.className || 'N/A'} ({viewStudentModal.sectionId?.sectionName || 'A'})</p></div>
                <div><span className="text-slate-400">Roll Number:</span> <p className="font-bold text-slate-900">{viewStudentModal.rollNo || '-'}</p></div>
                <div><span className="text-slate-400">Gender & DOB:</span> <p className="font-bold text-slate-900">{viewStudentModal.gender} • {viewStudentModal.dateOfBirth ? new Date(viewStudentModal.dateOfBirth).toLocaleDateString() : '-'}</p></div>
                <div><span className="text-slate-400">Blood Group:</span> <p className="font-bold text-rose-600">{viewStudentModal.bloodGroup || 'O+'}</p></div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div><span className="text-slate-400">House:</span> <p className="font-bold text-slate-900">{viewStudentModal.house || 'Red Phoenix'}</p></div>
                <div><span className="text-slate-400">Category:</span> <p className="font-bold text-slate-900">{viewStudentModal.category || 'General'}</p></div>
                <div><span className="text-slate-400">Father's Name:</span> <p className="font-bold text-slate-900">{viewStudentModal.fatherName || '-'}</p></div>
                <div><span className="text-slate-400">Father's Phone:</span> <p className="font-bold text-slate-900">{viewStudentModal.fatherPhone || '-'}</p></div>
                <div><span className="text-slate-400">Mother's Name:</span> <p className="font-bold text-slate-900">{viewStudentModal.motherName || '-'}</p></div>
                <div><span className="text-slate-400">Mother's Phone:</span> <p className="font-bold text-slate-900">{viewStudentModal.motherPhone || '-'}</p></div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400">Medical / Allergy Notes:</span>
                <p className="font-semibold text-slate-800">{viewStudentModal.allergies || 'None recorded'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewStudentModal(null)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Portal Credentials Modal */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Portal Login Credentials</h3>
                  <p className="text-xs text-amber-100">{credentialsModal.firstName} {credentialsModal.lastName || ''}</p>
                </div>
              </div>
              <button 
                onClick={() => setCredentialsModal(null)}
                className="p-2 hover:bg-white/10 rounded-xl text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                These credentials can be shared with the parent or student to log into the mobile app and student portal.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">PORTAL USERNAME / ADMISSION ID</span>
                  <span className="text-sm font-bold text-slate-900">{credentialsModal.admissionNo || credentialsModal.aparId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">INITIAL PASSWORD / DEFAULT PIN</span>
                  <span className="text-sm font-bold text-indigo-600">School@1234</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">PARENT REGISTERED PHONE</span>
                  <span className="text-sm font-bold text-slate-800">{credentialsModal.fatherPhone || credentialsModal.studentPhone || 'Not Set'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const msg = `Hello ${credentialsModal.firstName}! Your School ERP login: Username: ${credentialsModal.admissionNo || credentialsModal.aparId}, Password: School@1234`;
                  navigator.clipboard.writeText(msg);
                  Swal.fire('Copied', 'Login details copied to clipboard!', 'success');
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
              >
                Copy WhatsApp Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentList;
