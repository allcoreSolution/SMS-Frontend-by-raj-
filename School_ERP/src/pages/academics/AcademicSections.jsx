import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Plus, List, Grid, Search, FileText, 
  Download, Printer, Trash2, Users, CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AcademicSections = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionsList, setSectionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await academicService.getSections();
      if (res.success) {
        setSectionsList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = sectionsList.filter(s => 
    s.sectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id, sectionName) => {
    const result = await Swal.fire({
      title: 'Delete Section?',
      text: `Are you sure you want to delete Section "${sectionName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await academicService.deleteSection(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: `Section "${sectionName}" deleted successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchSections();
        }
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete section',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  const handleCopy = () => {
    const text = filteredSections.map(s => 
      `${s.sectionName}\t${s.capacity || 40}\t${s.enrolledCount || 0}\t${s.status}`
    ).join('\n');
    navigator.clipboard.writeText(`SECTION\tCAPACITY\tENROLLED\tSTATUS\n${text}`);
    Swal.fire({
      title: 'Copied!',
      text: 'Section list copied to clipboard.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-2xl' }
    });
  };

  const handleExportCSV = () => {
    const header = "SECTION,CAPACITY,ENROLLED,STATUS\n";
    const csvContent = filteredSections.map(s => 
      `"${s.sectionName}","${s.capacity || 40}","${s.enrolledCount || 0}","${s.status}"`
    ).join('\n');
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sections_list.csv');
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
            Academic Sections
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage section divisions, class student capacity, and section-wise enrollments.
          </p>
        </div>

        <button 
          onClick={() => navigate('/academics/sections/add')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Section
        </button>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Action Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search sections..."
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
        <div className="py-16 text-center text-slate-400">Loading academic sections...</div>
      ) : filteredSections.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No sections found matching your search.
        </div>
      ) : viewMode === 'list' ? (
        /* Table View */
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Section Name</th>
                  <th className="py-3.5 px-4">Student Capacity</th>
                  <th className="py-3.5 px-4 text-center">Currently Enrolled</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSections.map((sec) => (
                  <tr key={sec._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs">
                          {sec.sectionName}
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">
                          Section {sec.sectionName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-600">
                      {sec.capacity || 40} Students Max
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-slate-900">
                      {sec.enrolledCount || 0}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(sec._id, sec.sectionName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredSections.map((sec) => (
            <div key={sec._id} className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-lg shadow-xs">
                  {sec.sectionName}
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Section {sec.sectionName}</h3>
              <p className="text-xs text-slate-500 mt-1">Capacity: {sec.capacity || 40} Students</p>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{sec.enrolledCount || 0} Enrolled</span>
                <button
                  onClick={() => handleDelete(sec._id, sec.sectionName)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicSections;
