import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Plus, List, Grid, Search, FileText, 
  Download, Printer, Edit2, Trash2, Users, Book, 
  Calendar, CheckCircle2, ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';
import QuickAddClassModal from '../../components/academics/QuickAddClassModal';

const AcademicClasses = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await academicService.getClasses();
      if (res.success) {
        setClassesList(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classesList.filter(c => 
    c.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.classTeacher && c.classTeacher.fullName && c.classTeacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id, className) => {
    const result = await Swal.fire({
      title: 'Delete Class?',
      text: `Are you sure you want to delete "${className}"? This may impact associated sections and timetables.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await academicService.deleteClass(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: `Class "${className}" deleted successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchClasses();
        }
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete class',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  const handleCopy = () => {
    const text = filteredClasses.map(c => 
      `${c.className}\tLevel ${c.numericValue || 1}\t${c.sections ? c.sections.length : 0}\t${c.classTeacher?.fullName || 'Not Assigned'}\t${c.enrolledCount || 0}`
    ).join('\n');
    navigator.clipboard.writeText(`CLASS\tORDER\tSECTIONS\tCOORDINATOR\tENROLLED\n${text}`);
    Swal.fire({
      title: 'Copied!',
      text: 'Class directory copied to clipboard.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-2xl' }
    });
  };

  const handleExportCSV = () => {
    const header = "CLASS,ORDER,SECTIONS,COORDINATOR,ENROLLED\n";
    const csvContent = filteredClasses.map(c => 
      `"${c.className}","${c.numericValue || 1}","${c.sections ? c.sections.length : 0}","${c.classTeacher?.fullName || 'Not Assigned'}","${c.enrolledCount || 0}"`
    ).join('\n');
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'classes_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Classes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure classes, manage section attachments, and assign head coordinators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddClassOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Quick Add Class
          </button>
          <button 
            onClick={() => navigate('/academics/classes/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all transform active:scale-95"
          >
            Detailed Setup
          </button>
        </div>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Action Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search classes or coordinators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button 
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Copy
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" /> Print
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading academic classes...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No classes found matching your query.
        </div>
      ) : viewMode === 'list' ? (
        /* Table View */
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Class Name</th>
                  <th className="py-3.5 px-4">Numeric Order</th>
                  <th className="py-3.5 px-4">Attached Sections</th>
                  <th className="py-3.5 px-4">Class Coordinator</th>
                  <th className="py-3.5 px-4 text-center">Enrolled</th>
                  <th className="py-3.5 px-4 text-center">Subjects</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredClasses.map((cls) => {
                  const teacherName = cls.classTeacher?.fullName || 'Not Assigned';
                  return (
                    <tr key={cls._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs">
                            {cls.className.substring(0, 2)}
                          </div>
                          <span className="font-extrabold text-slate-900 text-sm">{cls.className}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-600">
                        Level {cls.numericValue || 1}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {cls.sections && cls.sections.length > 0 ? (
                            cls.sections.map((sec, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                                {sec.sectionName || sec.name || 'A'}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">None</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          teacherName !== 'Not Assigned' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Users className="w-3.5 h-3.5" /> {teacherName}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-slate-900">
                        {cls.enrolledCount || 0}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {cls.assignedSubjects ? cls.assignedSubjects.length : 0} Assigned
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => navigate('/academics/assign-subjects')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Assign Subjects"
                          >
                            <Book className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate('/academics/timetable')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Timetable"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cls._id, cls.className)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Class"
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
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => (
            <div key={cls._id} className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-sm">
                    {cls.className.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{cls.className}</h3>
                    <span className="text-xs text-slate-500">Numeric Order: {cls.numericValue || 1}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  {cls.enrolledCount || 0} Students
                </span>
              </div>

              <div className="space-y-2.5 my-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Coordinator:</span>
                  <span className="font-semibold text-slate-800">{cls.classTeacher?.fullName || 'Not Assigned'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Sections:</span>
                  <div className="flex gap-1">
                    {cls.sections && cls.sections.length > 0 ? (
                      cls.sections.map((s, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {s.sectionName || s.name || 'A'}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Subjects:</span>
                  <span className="font-semibold text-emerald-600">{cls.assignedSubjects ? cls.assignedSubjects.length : 0} Subjects</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => navigate('/academics/assign-subjects')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                >
                  Assign Subjects <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cls._id, cls.className)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Add Class Modal */}
      <QuickAddClassModal 
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        onClassAdded={() => {
          fetchClasses();
        }}
      />
    </div>
  );
};

export default AcademicClasses;
