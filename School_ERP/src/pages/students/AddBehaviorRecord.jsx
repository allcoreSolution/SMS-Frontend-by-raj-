import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lightbulb, ArrowLeft, Check, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';
import { academicService } from '../../api/academicService';

const AddBehaviorRecord = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    type: 'Positive',
    points: 3,
    reportedBy: 'Class Teacher',
    incidentDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    academicService.getClasses().then(res => {
      setClasses(res?.data || []);
      if (res?.data?.length > 0) setSelectedClass(res.data[0]._id);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const params = { limit: 100 };
    if (selectedClass) params.classId = selectedClass;
    studentService.getStudents(params).then(res => {
      setStudents(res?.data || []);
      if (res?.data?.length > 0) {
        setFormData(prev => ({ ...prev, studentId: res.data[0]._id }));
      }
    }).catch(console.error);
  }, [selectedClass]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.title.trim()) {
      Swal.fire('Validation Error', 'Student and Title are required.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await studentService.createBehaviorRecord(formData);
      await Swal.fire({
        title: 'Incident Logged!',
        text: 'Behavior record has been added to student ledger.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-2xl' }
      });
      navigate('/students/behavior');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Behavior Record</h1>
          <p className="text-xs text-slate-500 mt-1">Log positive merits or disciplinary demerits for a student.</p>
        </div>
        <button
          onClick={() => navigate('/students/behavior')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Records
        </button>
      </div>

      <StudentsTabs />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Incident & Student Selection</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              >
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.className}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Student *</label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                required
              >
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.firstName} {s.lastName || ''} ({s.admissionNo || s.aparId})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Incident Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Science Olympiad Gold Medal or Lab Disruption"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Record Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Positive">Positive (Merit)</option>
                <option value="Negative">Negative (Demerit)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Merit Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Incident Date</label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Reported By</label>
              <input
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Incident background details..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Incident'}
            </button>
          </div>
        </div>

        {/* Right Column: Tips */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Lightbulb className="w-5 h-5 text-indigo-600" /> Guidance
          </div>
          <div className="space-y-3 text-xs text-indigo-950/80 leading-relaxed">
            <p>
              • <strong>Positive Merits:</strong> Count towards House points championship and annual student awards.
            </p>
            <p>
              • <strong>Demerits:</strong> Are visible in parent portal logs to keep guardians informed of classroom interventions.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};

export default AddBehaviorRecord;
