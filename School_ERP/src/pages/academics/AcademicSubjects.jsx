import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Book, Plus, List, Grid, Search, FileText, 
  Download, Printer, Trash2, CheckCircle2, Sparkles, Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AcademicSubjects = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await academicService.getSubjects();
      if (res.success) {
        setSubjectsList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjectsList.filter(s => {
    const matchesSearch = s.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || 
      (selectedType === 'elective' ? s.isElective : (!s.isElective && (s.subjectType === selectedType || selectedType === 'core')));
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id, subjectName) => {
    const result = await Swal.fire({
      title: 'Delete Subject?',
      text: `Are you sure you want to delete "${subjectName}" from the curriculum?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await academicService.deleteSubject(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: `Subject "${subjectName}" removed successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchSubjects();
        }
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete subject',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  const handleCopy = () => {
    const text = filteredSubjects.map(s => 
      `${s.subjectName}\t${s.subjectCode}\t${s.subjectType}\t${s.isElective ? 'Elective' : 'Core'}\t${s.creditHours || 4}`
    ).join('\n');
    navigator.clipboard.writeText(`SUBJECT\tCODE\tTYPE\tSTREAM\tCREDITS\n${text}`);
    Swal.fire({
      title: 'Copied!',
      text: 'Subject list copied to clipboard.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-2xl' }
    });
  };

  const handleExportCSV = () => {
    const header = "SUBJECT,CODE,TYPE,STREAM,CREDITS\n";
    const csvContent = filteredSubjects.map(s => 
      `"${s.subjectName}","${s.subjectCode}","${s.subjectType}","${s.isElective ? 'Elective' : 'Core'}","${s.creditHours || 4}"`
    ).join('\n');
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'subjects_curriculum.csv');
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
            Curriculum Subjects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure subject codes, stream classification, theory/practical modes, and credit allocations.
          </p>
        </div>

        <button 
          onClick={() => navigate('/academics/subjects/add')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Subject
        </button>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Action Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search subjects or subject code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white font-medium text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="theory">Theory Only</option>
            <option value="practical">Practical Only</option>
            <option value="both">Theory + Practical</option>
            <option value="elective">Electives</option>
          </select>
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
        <div className="py-16 text-center text-slate-400">Loading curriculum subjects...</div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No subjects found matching your filters.
        </div>
      ) : viewMode === 'list' ? (
        /* Table View */
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Subject Name</th>
                  <th className="py-3.5 px-4">Subject Code</th>
                  <th className="py-3.5 px-4">Evaluation Type</th>
                  <th className="py-3.5 px-4">Stream / Category</th>
                  <th className="py-3.5 px-4 text-center">Credit Hours</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSubjects.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs">
                          <Book className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {sub.subjectName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                      {sub.subjectCode}
                    </td>

                    <td className="py-4 px-4 capitalize font-semibold text-slate-600">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        sub.subjectType === 'both' ? 'bg-purple-50 text-purple-700' :
                        sub.subjectType === 'practical' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {sub.subjectType === 'both' ? 'Theory + Practical' : sub.subjectType}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {sub.isElective ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Elective
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Core Compulsory
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-slate-900">
                      {sub.creditHours || 4} Credits
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(sub._id, sub.subjectName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Subject"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => (
            <div key={sub._id} className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Book className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{sub.subjectName}</h3>
                    <span className="text-xs font-mono font-bold text-indigo-600">{sub.subjectCode}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  sub.isElective ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {sub.isElective ? 'Elective' : 'Core'}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 mt-4">
                <span>Evaluation: <strong>{sub.subjectType}</strong></span>
                <span>Credits: <strong>{sub.creditHours || 4}</strong></span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDelete(sub._id, sub.subjectName)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
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

export default AcademicSubjects;
