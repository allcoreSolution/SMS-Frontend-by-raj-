import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, GraduationCap, User, Users, HeartPulse, 
  Upload, Sparkles, Check, ArrowRight, ArrowLeft, RefreshCw,
  Key, Lock, Eye, EyeOff, Edit3, Trash2, Printer, Search,
  Copy, FileText, Filter, ShieldCheck, AlertCircle, CheckCircle2,
  X, Phone, Mail, Calendar, ExternalLink
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';
import { academicService } from '../../api/academicService';
import QuickAddClassModal from '../../components/academics/QuickAddClassModal';
import QuickAddSectionModal from '../../components/academics/QuickAddSectionModal';

const StudentAdmission = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('form'); // 'form' | 'registry'
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  // Password visibility
  const [showStudentPass, setShowStudentPass] = useState(false);
  const [showParentPass, setShowParentPass] = useState(false);

  // Dropdown lists
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [houses, setHouses] = useState([]);
  const [categories, setCategories] = useState([]);

  // Admissions list for Actions & Registry
  const [admissionsList, setAdmissionsList] = useState([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);
  const [registrySearch, setRegistrySearch] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  // Modals for Actions
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [passwordModal, setPasswordModal] = useState(null);
  const [printSlipModal, setPrintSlipModal] = useState(null);

  // New Password modal fields
  const [newStudentPass, setNewStudentPass] = useState('');
  const [newParentPass, setNewParentPass] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Random Password Generator
  const generatePassword = (prefix = 'Pass') => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = prefix + '@';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const initialForm = {
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
    
    // Credentials & Portal Access
    portalPassword: 'School@1234',
    parentPassword: 'secret_access_24',
    enablePortalAccess: true,
    notifyParents: true,

    // Medical
    height: '',
    weight: '',
    allergies: 'None',
    medicalHistory: '',
    
    // Photo
    studentPhoto: null,
    photoUrl: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchDropdowns = async () => {
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
      console.error('Failed to load dropdowns', err);
    }
  };

  const fetchAdmissions = async () => {
    try {
      setLoadingAdmissions(true);
      const res = await studentService.getStudents({ limit: 50 });
      setAdmissionsList(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch admitted students', err);
    } finally {
      setLoadingAdmissions(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchAdmissions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
          if (key === 'studentPhoto' && !(formData[key] instanceof File)) return;
          fd.append(key, formData[key]);
        }
      });

      if (!formData.admissionNo) {
        fd.append('admissionNo', formData.aparId);
      }

      const res = await studentService.createStudent(fd);

      await Swal.fire({
        title: '🎉 Student Admitted Successfully!',
        html: `
          <div class="text-left text-xs space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 mt-2">
            <div><strong>Student:</strong> ${formData.firstName} ${formData.lastName || ''}</div>
            <div><strong>Admission / Login ID:</strong> <span class="font-mono text-indigo-600 font-bold">${formData.admissionNo || formData.aparId}</span></div>
            <div><strong>Student Password:</strong> <span class="font-mono text-emerald-600 font-bold">${formData.portalPassword}</span></div>
            <div><strong>Parent Login:</strong> <span class="font-mono text-slate-800">${formData.fatherPhone || formData.admissionNo || formData.aparId}</span></div>
            <div><strong>Parent Password:</strong> <span class="font-mono text-emerald-600 font-bold">${formData.parentPassword}</span></div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'View Admitted List',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-3xl' }
      });

      // Reset form & reload registry
      setFormData({
        ...initialForm,
        aparId: `YIS-2026-${Math.floor(100 + Math.random() * 900)}`
      });
      setPhotoPreview(null);
      setActiveStep(1);
      fetchAdmissions();
      setCurrentView('registry');
    } catch (err) {
      console.error(err);
      Swal.fire('Admission Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Action: Delete Student
  const handleDeleteAdmission = async (student) => {
    const confirm = await Swal.fire({
      title: 'Delete Admission Record?',
      text: `Are you sure you want to remove ${student.firstName} ${student.lastName || ''}? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      customClass: { popup: 'rounded-3xl' }
    });

    if (confirm.isConfirmed) {
      try {
        await studentService.deleteStudent(student._id);
        Swal.fire('Deleted!', 'Student record has been removed.', 'success');
        fetchAdmissions();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  // Handle Action: Open Password Modal
  const handleOpenPasswordModal = (student) => {
    setPasswordModal(student);
    setNewStudentPass(student.portalPassword || 'School@1234');
    setNewParentPass(student.parentPassword || 'secret_access_24');
  };

  // Handle Action: Save New Password
  const handleSavePassword = async () => {
    if (!passwordModal) return;
    try {
      setSavingPassword(true);
      await studentService.updateStudent(passwordModal._id, {
        portalPassword: newStudentPass,
        parentPassword: newParentPass,
        studentPassword: newStudentPass
      });

      Swal.fire({
        title: 'Credentials Updated!',
        text: `New password updated successfully for ${passwordModal.firstName}.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-2xl' }
      });

      setPasswordModal(null);
      fetchAdmissions();
    } catch (err) {
      Swal.fire('Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Action: Save Quick Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editModal) return;
    try {
      await studentService.updateStudent(editModal._id, editModal);
      Swal.fire('Success', 'Student details updated!', 'success');
      setEditModal(null);
      fetchAdmissions();
    } catch (err) {
      Swal.fire('Update Failed', err.response?.data?.message || err.message, 'error');
    }
  };

  // Filtered admissions list
  const filteredAdmissions = admissionsList.filter(item => {
    const nameMatch = `${item.firstName || ''} ${item.lastName || ''} ${item.admissionNo || ''} ${item.aparId || ''} ${item.fatherPhone || ''}`
      .toLowerCase().includes(registrySearch.toLowerCase());
    const classMatch = filterClass === 'All' || item.classId?._id === filterClass || item.classId === filterClass;
    return nameMatch && classMatch;
  });

  const steps = [
    { num: 1, title: 'Academic & Personal', desc: 'Identity, Class & Bio' },
    { num: 2, title: 'Family & Guardians', desc: 'Parents & Contact details' },
    { num: 3, title: 'Portal Credentials', desc: 'Generate Login & Password' },
    { num: 4, title: 'Health & Photo', desc: 'Medical records & ID Photo' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-[1300px] mx-auto min-h-screen space-y-6">
      
      {/* Top Banner with View Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Admission Portal</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Official Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Student admission enrollment, password generation, credentials distribution, and action management.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setCurrentView('form')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'form' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>New Admission Form</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('registry');
              fetchAdmissions();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'registry' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Admissions & Actions</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              currentView === 'registry' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {admissionsList.length}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <StudentsTabs />

      {/* ============================================================ */}
      {/* VIEW 1: NEW ADMISSION FORM */}
      {/* ============================================================ */}
      {currentView === 'form' && (
        <div className="space-y-6">
          
          {/* Step Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {steps.map(step => (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  activeStep === step.num
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : activeStep > step.num
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                    activeStep === step.num
                      ? 'bg-white/20 text-white'
                      : activeStep > step.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {activeStep > step.num ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step {step.num}</span>
                </div>
                <h3 className="font-bold text-xs mt-2 truncate">{step.title}</h3>
                <p className="text-[10px] opacity-75 truncate">{step.desc}</p>
              </button>
            ))}
          </div>

          {/* Main Admission Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            
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
                        className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl cursor-pointer"
                        title="Generate Random ID"
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
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">Section</label>
                      <button
                        type="button"
                        onClick={() => setIsAddSectionOpen(true)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        + Add Section
                      </button>
                    </div>
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
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Student Bio & Details</h3>
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
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
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
                  <p className="text-xs text-slate-400">Emergency notifications, parent portal linking, and residential address</p>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Father Mobile (Parent Portal Login Phone) *</label>
                    <input
                      type="tel"
                      name="fatherPhone"
                      placeholder="10 digit mobile number"
                      value={formData.fatherPhone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Step 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    Continue to Password & Credentials <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Portal Credentials & Password Generation (NEW!) */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-black uppercase tracking-wider mb-1">
                      <Key className="w-3 h-3 text-amber-600" />
                      PORTAL CREDENTIAL GENERATOR
                    </div>
                    <h2 className="text-base font-bold text-slate-900">Student & Parent Portal Login Setup</h2>
                    <p className="text-xs text-slate-400">Create access passwords for student and parent online portal login (Port 5175)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        portalPassword: generatePassword('Stud'),
                        parentPassword: generatePassword('Parent')
                      }));
                      Swal.fire({
                        title: 'Passwords Generated!',
                        text: 'Auto-generated high security passwords for both Student & Parent.',
                        icon: 'success',
                        timer: 1200,
                        showConfirmButton: false
                      });
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Both Passwords</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Student Portal Credentials */}
                  <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span>Student Portal Access</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Student Portal Username</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.admissionNo || formData.aparId}
                        className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-indigo-700 select-all"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Linked to Student Admission ID</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600">Student Password *</label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, portalPassword: generatePassword('Stud') }))}
                          className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Randomize
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showStudentPass ? 'text' : 'password'}
                          name="portalPassword"
                          value={formData.portalPassword}
                          onChange={handleChange}
                          placeholder="Enter password"
                          className="w-full bg-white border border-indigo-200 rounded-xl pl-3 pr-10 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStudentPass(!showStudentPass)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showStudentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Parent Portal Credentials */}
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span>Parent Portal Access</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Parent Login Phone / ID</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.fatherPhone || formData.admissionNo || formData.aparId}
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-800 select-all"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Parents can sign in with mobile number or ID</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600">Parent Password *</label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, parentPassword: generatePassword('Parent') }))}
                          className="text-[10px] font-bold text-amber-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Randomize
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showParentPass ? 'text' : 'password'}
                          name="parentPassword"
                          value={formData.parentPassword}
                          onChange={handleChange}
                          placeholder="Enter parent password"
                          className="w-full bg-white border border-amber-200 rounded-xl pl-3 pr-10 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowParentPass(!showParentPass)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showParentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="enablePortalAccess"
                      checked={formData.enablePortalAccess}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    <span>Activate immediate portal access upon admission</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="notifyParents"
                      checked={formData.notifyParents}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    <span>Queue WhatsApp & SMS credential welcome message</span>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Family Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    Continue to Health & Photo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Health & Photo */}
            {activeStep === 4 && (
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
                    onClick={() => setActiveStep(3)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Credentials
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Complete & Admit Student
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: ADMISSIONS REGISTRY & COMPLETE ACTIONS (NEW!) */}
      {/* ============================================================ */}
      {currentView === 'registry' && (
        <div className="space-y-4">
          
          {/* Search & Class Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
                placeholder="Search by student name, admission no, APAR ID, or phone..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Classes</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.className}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={fetchAdmissions}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className={`w-4 h-4 ${loadingAdmissions ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('form')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Admit Another</span>
              </button>
            </div>
          </div>

          {/* Admissions Table with ACTIONS */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Admitted Students Registry</h3>
                <p className="text-[11px] text-slate-400">Manage actions: view slip, edit profile, generate/change passwords, delete</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {filteredAdmissions.length} Registered
              </span>
            </div>

            {loadingAdmissions ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                Loading admitted students registry...
              </div>
            ) : filteredAdmissions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <UserPlus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No admissions found matching your criteria. Click <strong>"New Admission Form"</strong> to enroll a student!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student & ID</th>
                      <th className="py-3 px-4">Class & Section</th>
                      <th className="py-3 px-4">Parents & Contact</th>
                      <th className="py-3 px-4">Portal Access</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdmissions.map(student => (
                      <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Student Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                              {student.studentPhoto ? (
                                <img 
                                  src={student.studentPhoto.startsWith('http') ? student.studentPhoto : `http://localhost:5050/${student.studentPhoto}`} 
                                  alt="" 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <User className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {student.firstName} {student.lastName || ''}
                              </span>
                              <span className="font-mono text-[10px] text-indigo-600 font-bold block">
                                {student.admissionNo || student.aparId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Class */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block">
                            {student.classId?.className || 'Class N/A'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Section: {student.sectionId?.sectionName || 'A'} &bull; Roll: {student.rollNo || '-'}
                          </span>
                        </td>

                        {/* Parents & Phone */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {student.fatherName || 'Guardian'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            📞 {student.fatherPhone || student.studentPhone || 'No Phone'}
                          </span>
                        </td>

                        {/* Portal Access Status */}
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Credentials Active</span>
                          </div>
                          <span className="block text-[9.5px] font-mono text-slate-400 mt-0.5">
                            Pass: {student.portalPassword || 'School@1234'}
                          </span>
                        </td>

                        {/* ACTION BUTTONS (Eye, Key, Edit, Print, Trash) */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Action 1: View Slip / Details */}
                            <button
                              type="button"
                              onClick={() => setViewModal(student)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                              title="View Admission Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Action 2: Password Create / Change */}
                            <button
                              type="button"
                              onClick={() => handleOpenPasswordModal(student)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors cursor-pointer"
                              title="Create / Reset Portal Password"
                            >
                              <Key className="w-4 h-4" />
                            </button>

                            {/* Action 3: Edit Admission */}
                            <button
                              type="button"
                              onClick={() => setEditModal(student)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Edit Admission Information"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Action 4: Print Admission Slip */}
                            <button
                              type="button"
                              onClick={() => setPrintSlipModal(student)}
                              className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors cursor-pointer"
                              title="Print Official Admission Voucher"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Action 5: Delete Admission */}
                            <button
                              type="button"
                              onClick={() => handleDeleteAdmission(student)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              title="Delete Student Record"
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
            )}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: PASSWORD CREATE / RESET MODAL */}
      {/* ============================================================ */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-white/20">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Create & Reset Password</h3>
                  <p className="text-[11px] text-amber-100 font-medium">
                    {passwordModal.firstName} {passwordModal.lastName || ''} ({passwordModal.admissionNo || passwordModal.aparId})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPasswordModal(null)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* Student Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Student Portal Password</label>
                  <button
                    type="button"
                    onClick={() => setNewStudentPass(generatePassword('Stud'))}
                    className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  value={newStudentPass}
                  onChange={(e) => setNewStudentPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. School@1234"
                />
              </div>

              {/* Parent Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Parent Portal Password</label>
                  <button
                    type="button"
                    onClick={() => setNewParentPass(generatePassword('Parent'))}
                    className="text-[10px] font-bold text-amber-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  value={newParentPass}
                  onChange={(e) => setNewParentPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="e.g. secret_access_24"
                />
              </div>

              {/* Copy WhatsApp credentials format */}
              <button
                type="button"
                onClick={() => {
                  const text = `📢 School ERP Portal Credentials:\nStudent: ${passwordModal.firstName}\nUsername/ID: ${passwordModal.admissionNo || passwordModal.aparId}\nStudent Password: ${newStudentPass}\nParent Login Phone: ${passwordModal.fatherPhone || 'Registered Mobile'}\nParent Password: ${newParentPass}\nLogin Portal: http://localhost:5175/login`;
                  navigator.clipboard.writeText(text);
                  Swal.fire({
                    title: 'Copied!',
                    text: 'Credentials copied to clipboard for WhatsApp sharing.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copy Credentials for WhatsApp / SMS</span>
              </button>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPasswordModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingPassword}
                  onClick={handleSavePassword}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Password to DB</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: VIEW ADMISSION DETAILS */}
      {/* ============================================================ */}
      {viewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-gradient-to-r from-indigo-700 to-blue-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 overflow-hidden flex items-center justify-center">
                  {viewModal.studentPhoto ? (
                    <img 
                      src={viewModal.studentPhoto.startsWith('http') ? viewModal.studentPhoto : `http://localhost:5050/${viewModal.studentPhoto}`} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold">{viewModal.firstName} {viewModal.lastName || ''}</h3>
                  <p className="text-xs text-indigo-200 font-mono">Admission No: {viewModal.admissionNo || viewModal.aparId}</p>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} className="p-2 hover:bg-white/10 rounded-xl text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div><span className="text-slate-400 block">Class & Section</span><strong>{viewModal.classId?.className || 'N/A'} ({viewModal.sectionId?.sectionName || 'A'})</strong></div>
                <div><span className="text-slate-400 block">Roll Number</span><strong>{viewModal.rollNo || '-'}</strong></div>
                <div><span className="text-slate-400 block">Gender & DOB</span><strong>{viewModal.gender} &bull; {viewModal.dateOfBirth ? new Date(viewModal.dateOfBirth).toLocaleDateString() : '-'}</strong></div>
                <div><span className="text-slate-400 block">Blood Group</span><strong className="text-rose-600">{viewModal.bloodGroup || 'O+'}</strong></div>
                <div><span className="text-slate-400 block">House</span><strong>{viewModal.house || 'Red Phoenix'}</strong></div>
                <div><span className="text-slate-400 block">Category</span><strong>{viewModal.category || 'General'}</strong></div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase">Family & Contacts</span>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-slate-400">Father:</span> <p className="font-semibold">{viewModal.fatherName || '-'}</p></div>
                  <div><span className="text-slate-400">Father Phone:</span> <p className="font-semibold">{viewModal.fatherPhone || '-'}</p></div>
                  <div><span className="text-slate-400">Mother:</span> <p className="font-semibold">{viewModal.motherName || '-'}</p></div>
                  <div><span className="text-slate-400">Mother Phone:</span> <p className="font-semibold">{viewModal.motherPhone || '-'}</p></div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-700 font-bold uppercase block">Portal Credentials</span>
                  <span className="font-mono text-xs font-bold text-slate-800">Login ID: {viewModal.admissionNo || viewModal.aparId}</span>
                  <span className="block text-[11px] font-mono text-indigo-600">Password: {viewModal.portalPassword || 'School@1234'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setViewModal(null);
                    handleOpenPasswordModal(viewModal);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-[11px]"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setViewModal(null)} className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: QUICK EDIT ADMISSION MODAL */}
      {/* ============================================================ */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Edit Admission: {editModal.firstName}</h3>
              </div>
              <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    value={editModal.firstName || ''}
                    onChange={(e) => setEditModal({ ...editModal, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editModal.lastName || ''}
                    onChange={(e) => setEditModal({ ...editModal, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Class</label>
                  <select
                    value={editModal.classId?._id || editModal.classId || ''}
                    onChange={(e) => setEditModal({ ...editModal, classId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.className}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Roll No</label>
                  <input
                    type="text"
                    value={editModal.rollNo || ''}
                    onChange={(e) => setEditModal({ ...editModal, rollNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Father Name</label>
                  <input
                    type="text"
                    value={editModal.fatherName || ''}
                    onChange={(e) => setEditModal({ ...editModal, fatherName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Father Phone</label>
                  <input
                    type="text"
                    value={editModal.fatherPhone || ''}
                    onChange={(e) => setEditModal({ ...editModal, fatherPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: PRINT ADMISSION VOUCHER */}
      {/* ============================================================ */}
      {printSlipModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-bold text-xs">Official Admission Slip</span>
              <button onClick={() => setPrintSlipModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="printable-voucher" className="p-6 space-y-4 text-xs font-sans text-slate-800">
              <div className="text-center border-b pb-4">
                <h2 className="text-lg font-black text-slate-900 uppercase">YUG PUBLIC SCHOOL / CENTRAL ACADEMY</h2>
                <p className="text-[11px] text-slate-500">Student Admission & Portal Credential Slip</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Date: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><strong>Student:</strong> {printSlipModal.firstName} {printSlipModal.lastName || ''}</div>
                <div><strong>Admission No:</strong> <span className="font-mono font-bold text-indigo-700">{printSlipModal.admissionNo || printSlipModal.aparId}</span></div>
                <div><strong>Class:</strong> {printSlipModal.classId?.className || 'N/A'}</div>
                <div><strong>Roll No:</strong> {printSlipModal.rollNo || '-'}</div>
                <div><strong>Parent:</strong> {printSlipModal.fatherName || '-'}</div>
                <div><strong>Phone:</strong> {printSlipModal.fatherPhone || '-'}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-xs">
                <div className="font-sans font-bold text-[10px] text-slate-500 uppercase">Portal Login Credentials</div>
                <div>Login URL: <strong>http://localhost:5175/login</strong></div>
                <div>User ID: <strong>{printSlipModal.admissionNo || printSlipModal.aparId}</strong></div>
                <div>Initial Password: <strong>{printSlipModal.portalPassword || 'School@1234'}</strong></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
              <button
                type="button"
                onClick={() => setPrintSlipModal(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Class Modal */}
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

      {/* Quick Add Section Modal */}
      <QuickAddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onSectionAdded={async (newSec) => {
          try {
            const secRes = await academicService.getSections();
            if (secRes?.data) {
              setSections(secRes.data);
              if (newSec?._id) {
                setFormData(prev => ({ ...prev, sectionId: newSec._id }));
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
