import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Plus, Search, List, Grid, Phone, Mail, 
  Trash2, Eye, Download, Printer, RefreshCw, X, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const ParentsList = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentModal, setSelectedParentModal] = useState(null);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getParents({ search: searchQuery });
      setParents(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch parents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParents();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchParents();
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Parent Account?',
      text: `Are you sure you want to delete ${name}? Linked children profiles will remain intact.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await studentService.deleteParent(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Parent record removed.',
          icon: 'success',
          customClass: { popup: 'rounded-2xl' }
        });
        fetchParents();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Relation', 'Phone', 'Email', 'Login ID', 'Occupation', 'Children Count', 'Status'];
    const rows = parents.map(p => [
      `"${p.name}"`,
      p.relation || 'Father',
      p.phone || '',
      p.email || '',
      p.loginId || '',
      `"${p.occupation || ''}"`,
      (p.children || []).length,
      p.status || 'Active'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Parents_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Parents & Guardians Directory</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {parents.length} Active Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered parent portal accounts linked to enrolled student wards.
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
            onClick={() => navigate('/students/parents/add')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Register New Parent
          </button>
        </div>
      </div>

      {/* Tabs */}
      <StudentsTabs />

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search parent by name, phone or login ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-18 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 text-white text-[11px] font-bold rounded-xl cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={fetchParents} 
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading parent accounts...</p>
        </div>
      ) : parents.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No parent records found</p>
        </div>
      ) : viewMode === 'list' ? (
        
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Parent / Guardian</th>
                  <th className="py-3.5 px-4">Relation</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Portal Login ID</th>
                  <th className="py-3.5 px-4">Linked Student Wards</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {parents.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-400">{p.occupation || 'Guardian'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {p.relation || 'Father'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {p.phone}
                        </p>
                        {p.email && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> {p.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-indigo-700">
                      {p.loginId || `P${p.phone.slice(-10)}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(p.children && p.children.length > 0) ? (
                          p.children.map(ch => (
                            <span key={ch._id || ch} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                              {ch.firstName ? `${ch.firstName} (${ch.classId?.className || 'Class I'})` : 'Student Ward'}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">No linked students</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedParentModal(p)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {parents.map(p => (
            <div key={p._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-base">
                    {p.name.charAt(0)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    {p.status || 'Active'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium">{p.relation} • {p.occupation || 'Guardian'}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-semibold text-slate-800">{p.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Login ID:</span>
                    <span className="font-mono text-indigo-700">{p.loginId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Children:</span>
                    <span className="font-semibold text-slate-800">{(p.children || []).length} Wards</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedParentModal(p)}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(p._id, p.name)}
                  className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      )}

      {/* Parent Details Modal */}
      {selectedParentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">{selectedParentModal.name}</h3>
                <p className="text-xs text-indigo-200">{selectedParentModal.relation} Profile</p>
              </div>
              <button 
                onClick={() => setSelectedParentModal(null)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">Phone:</span> <span className="font-bold">{selectedParentModal.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Email:</span> <span className="font-bold">{selectedParentModal.email || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Login ID:</span> <span className="font-mono font-bold text-indigo-700">{selectedParentModal.loginId}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Occupation:</span> <span className="font-bold">{selectedParentModal.occupation || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Address:</span> <span className="font-bold text-right max-w-[200px]">{selectedParentModal.address || 'N/A'}</span></div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Linked Student Wards:</h4>
                <div className="space-y-2">
                  {(selectedParentModal.children && selectedParentModal.children.length > 0) ? (
                    selectedParentModal.children.map(ch => (
                      <div key={ch._id || ch} className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-blue-900">{ch.firstName} {ch.lastName || ''}</p>
                          <p className="text-[10px] text-blue-600 font-mono">{ch.admissionNo || ch.aparId}</p>
                        </div>
                        <span className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded-md shadow-2xs">
                          {ch.classId?.className || 'Class I'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No student wards linked.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedParentModal(null)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ParentsList;
