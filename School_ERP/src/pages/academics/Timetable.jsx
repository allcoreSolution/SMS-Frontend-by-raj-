import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Filter, Plus, Printer, Edit2, 
  Trash2, X, Check, Book, Users, Clock, Sparkles
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [periodSets, setPeriodSets] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit slot modal state
  const [slotModal, setSlotModal] = useState({
    isOpen: false,
    day: '',
    periodNumber: 1,
    periodName: '',
    startTime: '',
    endTime: '',
    subjectId: '',
    teacherId: '',
    roomNumber: 'Room 101'
  });
  const [savingSlot, setSavingSlot] = useState(false);

  useEffect(() => {
    fetchInitialPrerequisites();
  }, []);

  const fetchInitialPrerequisites = async () => {
    try {
      const [classRes, secRes, subRes, teachRes, setRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getSubjects(),
        academicService.getTeachers(),
        academicService.getPeriodSets()
      ]);

      if (classRes.success) {
        const clsList = classRes.data || [];
        setClasses(clsList);
        if (clsList.length > 0) setSelectedClass(clsList[0]._id);
      }
      if (secRes.success) {
        const secList = secRes.data || [];
        setSections(secList);
        if (secList.length > 0) setSelectedSection(secList[0]._id);
      }
      if (subRes.success) setSubjects(subRes.data || []);
      if (teachRes.success) setTeachers(teachRes.data || []);
      if (setRes.success) setPeriodSets(setRes.data || []);
    } catch (err) {
      console.error('Failed to load timetable prerequisites:', err);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedSection) {
      loadTimetable();
    }
  }, [selectedClass, selectedSection]);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const res = await academicService.getTimetable({
        classId: selectedClass,
        sectionId: selectedSection
      });
      if (res.success) {
        setTimetableSlots(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load timetable slots:', err);
    } finally {
      setLoading(false);
    }
  };

  // Find active period set for selected class, or default set
  const activePeriodSet = periodSets.find(ps => 
    (ps.assignedClasses || []).some(c => (c._id || c) === selectedClass)
  ) || periodSets[0];

  const periodsList = activePeriodSet?.periods || [
    { periodNumber: 1, name: 'Period 1', startTime: '08:00 AM', endTime: '08:45 AM', type: 'Teaching' },
    { periodNumber: 2, name: 'Period 2', startTime: '08:45 AM', endTime: '09:30 AM', type: 'Teaching' },
    { periodNumber: 3, name: 'Period 3', startTime: '09:30 AM', endTime: '10:15 AM', type: 'Teaching' },
    { periodNumber: 4, name: 'Lunch Break', startTime: '10:15 AM', endTime: '10:45 AM', type: 'Break' },
    { periodNumber: 5, name: 'Period 4', startTime: '10:45 AM', endTime: '11:30 AM', type: 'Teaching' },
    { periodNumber: 6, name: 'Period 5', startTime: '11:30 AM', endTime: '12:15 PM', type: 'Teaching' }
  ];

  const handleCellClick = (day, period) => {
    if (period.type === 'Break' || period.type === 'Assembly') return;

    // Find if slot exists
    const existing = timetableSlots.find(s => 
      s.day === day && s.periodNumber === period.periodNumber
    );

    setSlotModal({
      isOpen: true,
      day,
      periodNumber: period.periodNumber,
      periodName: period.name,
      startTime: period.startTime,
      endTime: period.endTime,
      subjectId: existing?.subjectId?._id || existing?.subjectId || '',
      teacherId: existing?.teacherId?._id || existing?.teacherId || '',
      roomNumber: existing?.roomNumber || 'Room 101'
    });
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    try {
      setSavingSlot(true);
      const res = await academicService.saveTimetableSlot({
        classId: selectedClass,
        sectionId: selectedSection,
        day: slotModal.day,
        periodNumber: slotModal.periodNumber,
        periodName: slotModal.periodName,
        startTime: slotModal.startTime,
        endTime: slotModal.endTime,
        subjectId: slotModal.subjectId || null,
        teacherId: slotModal.teacherId || null,
        roomNumber: slotModal.roomNumber || 'Room 101'
      });

      if (res.success) {
        setSlotModal(prev => ({ ...prev, isOpen: false }));
        loadTimetable();
        Swal.fire({
          title: 'Slot Saved!',
          text: `Period updated for ${slotModal.day}.`,
          icon: 'success',
          timer: 1200,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to save timetable slot',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setSavingSlot(false);
    }
  };

  const selectedClassObj = classes.find(c => c._id === selectedClass);
  const selectedSectionObj = sections.find(s => s._id === selectedSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Class Weekly Timetable
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Weekly subject schedule, faculty period assignments, and classroom bookings.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all transform active:scale-95 self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-indigo-600" /> Print Timetable
        </button>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Class & Section Selector Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wider">
          <Filter className="w-4 h-4" /> Select Grade & Section
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
            >
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.className}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
            >
              {sections.map(s => (
                <option key={s._id} value={s._id}>Section {s.sectionName}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Current Schedule: <strong className="text-slate-800">{activePeriodSet?.name || 'Standard Schedule'}</strong>
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/75 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-900">
              {selectedClassObj?.className} — Section {selectedSectionObj?.sectionName}
            </span>
            <span className="text-xs text-slate-400">• Click any slot to edit subject & teacher</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
                <th className="py-3 px-4 text-left w-28 uppercase tracking-wider text-[11px] text-slate-400">Day</th>
                {periodsList.map((p) => (
                  <th key={p.periodNumber} className="py-3 px-2 border-l border-slate-200/60 min-w-[130px]">
                    <div className="font-extrabold text-slate-900 text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-medium">{p.startTime} - {p.endTime}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DAYS.map((day) => (
                <tr key={day} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-4 px-4 text-left font-bold text-slate-900 bg-slate-50/40">
                    {day}
                  </td>

                  {periodsList.map((period) => {
                    const isBreak = period.type === 'Break' || period.type === 'Assembly';
                    const slot = timetableSlots.find(s => 
                      s.day === day && s.periodNumber === period.periodNumber
                    );

                    if (isBreak) {
                      return (
                        <td 
                          key={period.periodNumber} 
                          className="py-3 px-2 bg-slate-100/70 border-l border-slate-200/60 text-slate-400 font-semibold text-[11px]"
                        >
                          {period.name}
                        </td>
                      );
                    }

                    return (
                      <td 
                        key={period.periodNumber}
                        onClick={() => handleCellClick(day, period)}
                        className="py-3 px-2 border-l border-slate-200/60 cursor-pointer hover:bg-indigo-50/40 transition-all select-none group"
                      >
                        {slot && slot.subjectId ? (
                          <div className="p-2 rounded-xl bg-white border border-indigo-100 shadow-xs group-hover:border-indigo-300 transition-colors text-left">
                            <span className="block font-extrabold text-indigo-950 text-xs truncate">
                              {slot.subjectId?.subjectName || 'Subject'}
                            </span>
                            <span className="block text-[11px] text-indigo-600 font-semibold truncate mt-0.5">
                              {slot.teacherId?.fullName || 'Faculty TBA'}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                              {slot.roomNumber || 'Room 101'}
                            </span>
                          </div>
                        ) : (
                          <div className="py-3 text-slate-300 font-medium text-xs hover:text-indigo-600 transition-colors flex items-center justify-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Assign
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Slot Modal */}
      {slotModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Assign {slotModal.periodName}
                </h3>
                <p className="text-xs text-slate-500">
                  {slotModal.day} • {slotModal.startTime} – {slotModal.endTime}
                </p>
              </div>
              <button 
                onClick={() => setSlotModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                <select
                  value={slotModal.subjectId}
                  onChange={(e) => setSlotModal(prev => ({ ...prev, subjectId: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.subjectName} ({s.subjectCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Assigned Teacher</label>
                <select
                  value={slotModal.teacherId}
                  onChange={(e) => setSlotModal(prev => ({ ...prev, teacherId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.fullName} ({t.designation || 'Teacher'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Classroom / Room Number</label>
                <input
                  type="text"
                  value={slotModal.roomNumber}
                  onChange={(e) => setSlotModal(prev => ({ ...prev, roomNumber: e.target.value }))}
                  placeholder="e.g. Room 101, Lab A"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSlotModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSlot}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200"
                >
                  {savingSlot ? 'Saving...' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
