import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, Plus, Wand2, Edit2, Trash2, Copy, 
  X, Check, AlertCircle, Calendar, Sparkles, CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const ManagePeriods = () => {
  const navigate = useNavigate();
  const [periodSets, setPeriodSets] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    isDefault: false,
    periods: [
      { periodNumber: 1, name: 'Morning Assembly', startTime: '08:00 AM', endTime: '08:20 AM', type: 'Assembly' },
      { periodNumber: 2, name: 'Period 1', startTime: '08:20 AM', endTime: '09:05 AM', type: 'Teaching' },
      { periodNumber: 3, name: 'Period 2', startTime: '09:05 AM', endTime: '09:50 AM', type: 'Teaching' },
      { periodNumber: 4, name: 'Period 3', startTime: '09:50 AM', endTime: '10:35 AM', type: 'Teaching' },
      { periodNumber: 5, name: 'Lunch Break', startTime: '10:35 AM', endTime: '11:05 AM', type: 'Break' },
      { periodNumber: 6, name: 'Period 4', startTime: '11:05 AM', endTime: '11:50 AM', type: 'Teaching' },
      { periodNumber: 7, name: 'Period 5', startTime: '11:50 AM', endTime: '12:35 PM', type: 'Teaching' }
    ],
    assignedClasses: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [setsRes, classRes] = await Promise.all([
        academicService.getPeriodSets(),
        academicService.getClasses()
      ]);

      if (setsRes.success) setPeriodSets(setsRes.data || []);
      if (classRes.success) setClasses(classRes.data || []);
    } catch (err) {
      console.error('Failed to load period sets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    setEditingId(null);
    setModalForm({
      name: 'Custom Day Schedule',
      isDefault: false,
      periods: [
        { periodNumber: 1, name: 'Morning Assembly', startTime: '08:00 AM', endTime: '08:20 AM', type: 'Assembly' },
        { periodNumber: 2, name: 'Period 1', startTime: '08:20 AM', endTime: '09:05 AM', type: 'Teaching' },
        { periodNumber: 3, name: 'Period 2', startTime: '09:05 AM', endTime: '09:50 AM', type: 'Teaching' },
        { periodNumber: 4, name: 'Period 3', startTime: '09:50 AM', endTime: '10:35 AM', type: 'Teaching' },
        { periodNumber: 5, name: 'Lunch Break', startTime: '10:35 AM', endTime: '11:05 AM', type: 'Break' },
        { periodNumber: 6, name: 'Period 4', startTime: '11:05 AM', endTime: '11:50 AM', type: 'Teaching' },
        { periodNumber: 7, name: 'Period 5', startTime: '11:50 AM', endTime: '12:35 PM', type: 'Teaching' }
      ],
      assignedClasses: classes.map(c => c._id)
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (set) => {
    setEditingId(set._id);
    setModalForm({
      name: set.name,
      isDefault: set.isDefault,
      periods: set.periods || [],
      assignedClasses: (set.assignedClasses || []).map(c => c._id || c)
    });
    setIsModalOpen(true);
  };

  const handleAddPeriod = () => {
    const nextNumber = modalForm.periods.length + 1;
    setModalForm(prev => ({
      ...prev,
      periods: [
        ...prev.periods,
        {
          periodNumber: nextNumber,
          name: `Period ${nextNumber}`,
          startTime: '12:35 PM',
          endTime: '01:20 PM',
          type: 'Teaching'
        }
      ]
    }));
  };

  const handleRemovePeriod = (index) => {
    setModalForm(prev => ({
      ...prev,
      periods: prev.periods.filter((_, idx) => idx !== index)
    }));
  };

  const handlePeriodChange = (index, field, value) => {
    setModalForm(prev => {
      const updated = [...prev.periods];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, periods: updated };
    });
  };

  const handleClassToggle = (classId) => {
    setModalForm(prev => {
      const exists = prev.assignedClasses.includes(classId);
      return {
        ...prev,
        assignedClasses: exists
          ? prev.assignedClasses.filter(id => id !== classId)
          : [...prev.assignedClasses, classId]
      };
    });
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      Swal.fire({ title: 'Schedule Name Required', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    try {
      if (editingId) {
        const res = await academicService.updatePeriodSet(editingId, modalForm);
        if (res.success) {
          Swal.fire({ title: 'Updated!', text: 'Period set updated successfully.', icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
        }
      } else {
        const res = await academicService.createPeriodSet(modalForm);
        if (res.success) {
          Swal.fire({ title: 'Created!', text: 'New period schedule created.', icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
        }
      }
      setIsModalOpen(false);
      fetchInitialData();
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to save period schedule', icon: 'error', customClass: { popup: 'rounded-2xl' } });
    }
  };

  const handleDeleteSet = async (id, setName) => {
    const result = await Swal.fire({
      title: 'Delete Period Set?',
      text: `Are you sure you want to remove "${setName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await academicService.deletePeriodSet(id);
        if (res.success) {
          Swal.fire({ title: 'Deleted!', text: 'Period set deleted.', icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
          fetchInitialData();
        }
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Failed to delete period set', icon: 'error', customClass: { popup: 'rounded-2xl' } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Daily Periods
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define daily bell timings, break durations, teaching slots, and grade associations.
          </p>
        </div>

        <button 
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Period Set
        </button>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Period Sets List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading period schedules...</div>
      ) : periodSets.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No period sets found. Click "Create Period Set" to set up your school timetable bell schedule.
        </div>
      ) : (
        <div className="space-y-6">
          {periodSets.map((set) => (
            <div 
              key={set._id}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">{set.name}</h3>
                      {set.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Default Schedule
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {set.periods?.length || 0} Slots configured • Applied to {set.assignedClasses?.length || 0} classes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(set)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Schedule
                  </button>
                  <button
                    onClick={() => handleDeleteSet(set._id, set.name)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Timeline Periods Bar */}
              <div className="p-5 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-max">
                  {(set.periods || []).map((p, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border text-xs min-w-[140px] flex flex-col justify-between ${
                        p.type === 'Break' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
                        p.type === 'Assembly' ? 'bg-purple-50/70 border-purple-200 text-purple-900' :
                        'bg-slate-50 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold">{p.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          p.type === 'Break' ? 'bg-amber-200/60 text-amber-900' :
                          p.type === 'Assembly' ? 'bg-purple-200/60 text-purple-900' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {p.type}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 font-mono mt-1">
                        {p.startTime} – {p.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Classes */}
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-500">Assigned Classes:</span>
                <div className="flex flex-wrap gap-1">
                  {(set.assignedClasses || []).map((c, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-[11px]">
                      {c.className || c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingId ? 'Edit Period Schedule' : 'Create New Period Schedule'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Schedule Set Name</label>
                <input
                  type="text"
                  value={modalForm.name}
                  onChange={(e) => setModalForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Periods List Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">Daily Slots & Breaks</label>
                  <button
                    type="button"
                    onClick={handleAddPeriod}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slot
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {modalForm.periods.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handlePeriodChange(idx, 'name', e.target.value)}
                        placeholder="Name"
                        className="w-32 px-2 py-1 rounded-lg border border-slate-200 bg-white font-semibold"
                      />
                      <input
                        type="text"
                        value={p.startTime}
                        onChange={(e) => handlePeriodChange(idx, 'startTime', e.target.value)}
                        placeholder="Start"
                        className="w-24 px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                      <span className="text-slate-400">→</span>
                      <input
                        type="text"
                        value={p.endTime}
                        onChange={(e) => handlePeriodChange(idx, 'endTime', e.target.value)}
                        placeholder="End"
                        className="w-24 px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                      <select
                        value={p.type}
                        onChange={(e) => handlePeriodChange(idx, 'type', e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700"
                      >
                        <option value="Teaching">Teaching</option>
                        <option value="Break">Break</option>
                        <option value="Assembly">Assembly</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemovePeriod(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attach Classes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Apply Schedule to Classes</label>
                <div className="flex flex-wrap gap-2">
                  {classes.map(c => {
                    const isAttached = modalForm.assignedClasses.includes(c._id);
                    return (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => handleClassToggle(c._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          isAttached ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {c.className}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200"
                >
                  Save Schedule Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePeriods;
