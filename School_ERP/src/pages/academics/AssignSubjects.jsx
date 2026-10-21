import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Book, Save, CheckCircle2, LayoutGrid, Search, 
  RotateCcw, Sparkles, Check, Info
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AssignSubjects = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({}); // { [classId]: [subjectId, ...] }
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [classRes, subRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getSubjects()
      ]);

      if (classRes.success) {
        const clsList = classRes.data || [];
        setClasses(clsList);

        // Pre-populate selections from backend
        const initialMap = {};
        clsList.forEach(cls => {
          initialMap[cls._id] = (cls.assignedSubjects || []).map(s => s._id || s);
        });
        setSelectedSubjects(initialMap);
      }

      if (subRes.success) {
        setSubjects(subRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load classes or subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (classId, subjectId) => {
    setSelectedSubjects(prev => {
      const currentList = prev[classId] || [];
      const updatedList = currentList.includes(subjectId)
        ? currentList.filter(id => id !== subjectId)
        : [...currentList, subjectId];
      return { ...prev, [classId]: updatedList };
    });
  };

  const handleToggleAllForClass = (classId) => {
    setSelectedSubjects(prev => {
      const currentList = prev[classId] || [];
      const allIds = subjects.map(s => s._id);
      const isAllSelected = currentList.length === allIds.length;
      return {
        ...prev,
        [classId]: isAllSelected ? [] : allIds
      };
    });
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const res = await academicService.assignSubjectsBulk(selectedSubjects);
      if (res.success) {
        Swal.fire({
          title: 'Assignments Saved!',
          text: 'Subject curriculum assignments updated across all classes successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Save Error',
        text: err.response?.data?.message || 'Failed to save subject assignments',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assign Subjects to Classes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Map mandatory curriculum courses and available electives to each grade level.
          </p>
        </div>

        <button 
          onClick={handleSaveAll}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-50 self-start md:self-auto"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Assignments'}
        </button>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Search and Helper Info */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>{subjects.length} total subjects available in curriculum catalogue</span>
        </div>
      </div>

      {/* Class Curriculum Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading curriculum mapping...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No classes found matching search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClasses.map((cls) => {
            const classSelected = selectedSubjects[cls._id] || [];
            const isAllSelected = subjects.length > 0 && classSelected.length === subjects.length;

            return (
              <div 
                key={cls._id} 
                className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
              >
                {/* Class Card Header */}
                <div className="p-4 bg-slate-50/75 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs">
                      {cls.className.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{cls.className}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {classSelected.length} of {subjects.length} subjects assigned
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleAllForClass(cls._id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {/* Subject Checkboxes Grid */}
                <div className="p-5 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {subjects.map((sub) => {
                    const isChecked = classSelected.includes(sub._id);
                    return (
                      <div
                        key={sub._id}
                        onClick={() => handleSubjectToggle(cls._id, sub._id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all flex items-center justify-between ${
                          isChecked 
                            ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 shadow-xs' 
                            : 'bg-white border-slate-200/70 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-bold">{sub.subjectName}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">{sub.subjectCode}</span>
                          </div>
                        </div>

                        {sub.isElective && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Elective
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignSubjects;
