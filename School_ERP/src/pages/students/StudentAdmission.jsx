import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, GraduationCap, User, Users, HeartPulse, 
  Upload, Sparkles, Check, ArrowRight, ArrowLeft, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';
import { academicService } from '../../api/academicService';
import QuickAddClassModal from '../../components/academics/QuickAddClassModal';

const StudentAdmission = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  // Lists
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [houses, setHouses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    aparId: `YIS-2026-${Math.floor(100 + Math.random() * 900)}`,
    admissionNo: '',
    rollNo: '',
    classId: '',
    sectionId: '',
    admissionDate: new Date().toISOString().split('T')[0],
    
    // Personal
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Select',
    dateOfBirth: '',
    bloodGroup: 'O+',
    religion: 'Hindu',
    caste: '',
    nationality: 'Indian',
    aadhaar: '',
    house: 'Red Phoenix',
    category: 'General',
    studentPhone: '',
    studentEmail: '',
    
    // Parents
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    address: '',
    
    // Medical
    height: '',
    weight: '',
    allergies: 'None',
    medicalHistory: '',
    
    // Photo
    studentPhoto: null,
    photoUrl: ''
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [clsRes, secRes, houseRes, catRes] = await Promise.all([
          academicService.getClasses(),
          academicService.getSections(),
          studentService.getHouses(),
          studentService.getCategories()
        ]);
        if (clsRes?.data) setClasses(clsRes.data);
        if (secRes?.data) setSections(secRes.data);
        if (houseRes?.data) setHouses(houseRes.data);
        if (catRes?.data) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load academic and classification dropdowns', err);
      }
    };
    loadDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, studentPhoto: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const generateNewId = () => {
    const newId = `YIS-2026-${Math.floor(100 + Math.random() * 900)}`;
    setFormData(prev => ({ ...prev, aparId: newId, admissionNo: newId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      Swal.fire('Validation Error', 'First Name is mandatory!', 'warning');
      setActiveStep(1);
      return;
    }
    if (formData.gender === 'Select') {
      Swal.fire('Validation Error', 'Please select student Gender!', 'warning');
      setActiveStep(1);
      return;
    }
    if (!formData.dateOfBirth) {
      Swal.fire('Validation Error', 'Please specify Date of Birth!', 'warning');
      setActiveStep(1);
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          // Skip file if null
          if (key === 'studentPhoto' && !(formData[key] instanceof File)) return;
          fd.append(key, formData[key]);
        }
      });

      if (!formData.admissionNo) {
        fd.append('admissionNo', formData.aparId);
      }

      await studentService.createStudent(fd);

      await Swal.fire({
        title: 'Student Admitted!',
        text: `${formData.firstName} has been successfully registered in the ERP database.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-3xl' }
      });

      navigate('/students/list');
    } catch (err) {
      console.error(err);
      Swal.fire('Admission Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Academic & Personal', desc: 'Identity, Class & Bio' },
    { num: 2, title: 'Family & Guardians', desc: 'Parents & Contact details' },
    { num: 3, title: 'Health & Photo', desc: 'Medical records & Face photo' },
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-screen space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Admission Portal</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> New Enrollment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official registration of a new student with automated roll allocation and identity generation.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <StudentsTabs />

      {/* Step Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {steps.map(step => (
          <button
            key={step.num}
            type="button"
            onClick={() => setActiveStep(step.num)}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeStep === step.num
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : activeStep > step.num
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-slate-200/80 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center ${
                activeStep === step.num
                  ? 'bg-white/20 text-white'
                  : activeStep > step.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
              }`}>
                {activeStep > step.num ? <Check className="w-4 h-4" /> : step.num}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step {step.num}</span>
            </div>
            <h3 className="font-bold text-sm mt-2">{step.title}</h3>
            <p className="text-[11px] opacity-80">{step.desc}</p>
          </button>
        ))}
      </div>

      {/* Main Admission Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-6">
        
        {/* STEP 1: Academic & Personal Details */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Academic & Identity Information</h2>
              <p className="text-xs text-slate-400">Class placement, roll numbering, and student identification</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">APAR ID / Reg ID *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="aparId"
                    value={formData.aparId}
                    onChange={handleChange}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateNewId}
                    className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl"
                    title="Generate Random APAR ID"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Class *</label>
                  <button
                    type="button"
                    onClick={() => setIsAddClassOpen(true)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    + Add Class
                  </button>
                </div>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.className}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
                <select
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Select Section --</option>
                  {sections.map(s => (
                    <option key={s._id} value={s._id}>{s.sectionName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  placeholder="e.g. 14"
                  value={formData.rollNo}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">House</label>
                <select
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Red Phoenix">Red Phoenix</option>
                  <option value="Blue Pegasus">Blue Pegasus</option>
                  <option value="Green Dragon">Green Dragon</option>
                  <option value="Yellow Hydra">Yellow Hydra</option>
                  {houses.map(h => (
                    <option key={h._id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="General">General (GEN)</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Student Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="e.g. Aarav"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    required
                  >
                    <option value="Select">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Aadhaar Card No</label>
                  <input
                    type="text"
                    name="aadhaar"
                    placeholder="12 digit Aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                Continue to Family Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Parents & Guardian Details */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Parents & Guardians Contact</h2>
              <p className="text-xs text-slate-400">Emergency notifications, portal access, and residential address</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Father / Primary Guardian Name</label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="e.g. Rajesh Kumar Sharma"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Father Mobile Number</label>
                <input
                  type="tel"
                  name="fatherPhone"
                  placeholder="10 digit mobile"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  placeholder="e.g. Sunita Sharma"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mother Mobile Number</label>
                <input
                  type="tel"
                  name="motherPhone"
                  placeholder="10 digit mobile"
                  value={formData.motherPhone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Residential Address</label>
                <textarea
                  name="address"
                  rows={2}
                  placeholder="House number, Street, Locality, City, PIN"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 1
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                Continue to Medical & Photo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Health & Photo */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Medical Data & Passport Photo</h2>
              <p className="text-xs text-slate-400">Emergency health metrics and face identification</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold text-rose-600"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Height (in cm)</label>
                <input
                  type="number"
                  name="height"
                  placeholder="e.g. 132"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Weight (in kg)</label>
                <input
                  type="number"
                  name="weight"
                  placeholder="e.g. 36"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Allergies / Special Dietary Needs</label>
                <input
                  type="text"
                  name="allergies"
                  placeholder="e.g. Peanuts, Penicillin, Dust allergy"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Photo Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">Student Passport Photo</h3>
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-slate-200 border-2 border-indigo-200 overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4 text-indigo-600" /> Upload Image File
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  <p className="text-[11px] text-slate-400">JPG, PNG or WEBP, max 5MB. Will be used on Student ID cards.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 2
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Complete & Admit Student
              </button>
            </div>
          </div>
        )}

      </form>

      <QuickAddClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        onClassAdded={async (newCls) => {
          try {
            const clsRes = await academicService.getClasses();
            if (clsRes?.data) {
              setClasses(clsRes.data);
              if (newCls?._id) {
                setFormData(prev => ({ ...prev, classId: newCls._id }));
              }
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </div>
  );
};

export default StudentAdmission;
