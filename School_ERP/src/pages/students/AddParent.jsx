import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lightbulb, ArrowLeft, Check, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const AddParent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    relation: 'Father',
    phone: '',
    email: '',
    occupation: '',
    address: '',
    children: []
  });

  useEffect(() => {
    studentService.getStudents({ limit: 1000 }).then(res => {
      setStudentsList(res?.data || []);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChildToggle = (studentId) => {
    setFormData(prev => {
      const exists = prev.children.includes(studentId);
      return {
        ...prev,
        children: exists ? prev.children.filter(id => id !== studentId) : [...prev.children, studentId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      Swal.fire('Validation Error', 'Parent Name and Mobile Number are required!', 'warning');
      return;
    }

    try {
      setLoading(true);
      await studentService.createParent(formData);
      await Swal.fire({
        title: 'Parent Registered!',
        text: `${formData.name} has been enrolled in the parents registry.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-2xl' }
      });
      navigate('/students/parents');
    } catch (err) {
      Swal.fire('Registration Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Parent / Guardian</h1>
          <p className="text-xs text-slate-500 mt-1">Create a parent profile and link their student children.</p>
        </div>
        <button
          onClick={() => navigate('/students/parents')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Parents List
        </button>
      </div>

      <StudentsTabs />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Parent / Guardian Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Anand Bhatia"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Relationship</label>
              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Phone *</label>
              <input
                type="tel"
                name="phone"
                placeholder="10 digit mobile"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="parent@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Occupation / Designation</label>
              <input
                type="text"
                name="occupation"
                placeholder="e.g. Senior Software Architect"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Residential Address</label>
              <textarea
                name="address"
                rows={2}
                placeholder="Address details"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Children selection */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Link Student Wards ({formData.children.length} selected)
            </h3>
            <p className="text-[11px] text-slate-400">Select any enrolled students that belong to this family.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-100">
              {studentsList.map(st => {
                const isSelected = formData.children.includes(st._id);
                return (
                  <button
                    key={st._id}
                    type="button"
                    onClick={() => handleChildToggle(st._id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p>{st.firstName} {st.lastName || ''}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{st.admissionNo || st.aparId}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Registering...' : 'Register Parent Account'}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Info */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Lightbulb className="w-5 h-5 text-indigo-600" /> Account Tips
          </div>
          <div className="space-y-3 text-xs text-indigo-950/80 leading-relaxed">
            <p>
              • <strong>Portal Login:</strong> A unique login ID will be created as <code>P&lt;mobile&gt;</code>.
            </p>
            <p>
              • <strong>Multi-child Families:</strong> Linking siblings will allow the parent to switch between children profiles inside the mobile app seamlessly.
            </p>
            <p>
              • <strong>Fee Notices:</strong> Invoices, payment receipts, and fee slips will automatically dispatch to this parent's WhatsApp / SMS.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};

export default AddParent;
