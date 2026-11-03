import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Save, Info, User, Briefcase, FileText, Camera, Upload, Trash2, Plus, 
  CheckCircle2, X, Landmark, ShieldCheck, Globe, HelpCircle, FileCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { hrService } from '../../api/hrService';
import axiosInstance from '../../api/axios';

const DEFAULT_ROLES = ['Admin', 'Teacher', 'Accountant', 'Receptionist', 'HR Manager', 'Staff'];
const DEFAULT_DESIGNATIONS = ['Principal', 'Vice Principal', 'Senior Teacher', 'Teacher', 'Lab Assistant', 'Accountant', 'Librarian', 'Clerk', 'Receptionist', 'Staff'];
const DEFAULT_DEPARTMENTS = ['Academics', 'Administration', 'Finance & Accounts', 'Transport', 'Hostel', 'Sports', 'IT & Computer Science'];

export default function HRAddStaff() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('bank');
  const [loading, setLoading] = useState(false);

  // Dynamic Options
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [designations, setDesignations] = useState(DEFAULT_DESIGNATIONS);
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);

  // Photo Upload State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    role: 'Teacher',
    designation: '',
    department: '',
    gender: 'Male',
    dateOfBirth: '',
    dateOfJoining: '',
    confirmationDate: '',
    employeeCode: '',
    employmentType: 'Full-Time',
    reportingManager: '',
    fathersName: '',
    mothersName: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    bloodGroup: '',
    phone: '',
    maritalStatus: '',
    qualification: '',
    workExperience: '',
    currentAddress: '',
    note: '',
    // Tab 1: Bank Details
    bankDetails: {
      accountTitle: '',
      accountNumber: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
      bankBranchCode: '',
      upiId: ''
    },
    // Tab 2: Statutory IDs
    statutoryIds: {
      panNumber: '',
      aadhaarNumber: '',
      epfNumber: '',
      esicNumber: '',
      uanNumber: '',
      passportNumber: ''
    },
    // Tab 3: Social Media
    socialMedia: {
      linkedin: '',
      whatsapp: '',
      facebook: '',
      twitter: '',
      website: '',
      instagram: ''
    },
    // Tab 4: Additional Info
    additionalInfo: {
      probationPeriod: '',
      noticePeriod: '',
      previousEmployer: '',
      specialization: '',
      referenceContact: '',
      medicalNotes: ''
    }
  });

  // Load Initial Lists & Staff Data
  useEffect(() => {
    loadLists();
    if (isEditing) {
      loadStaffData(id);
    }
  }, [id, isEditing]);

  const loadLists = async () => {
    try {
      // 1. Roles
      try {
        const rolesRes = await axiosInstance.get('/auth/roles');
        if (rolesRes.data?.data && Array.isArray(rolesRes.data.data)) {
          const fetchedRoles = rolesRes.data.data.map(r => r.name);
          setRoles(prev => Array.from(new Set([...prev, ...fetchedRoles])));
        }
      } catch (_) {}

      // 2. Departments
      try {
        const deptRes = await hrService.getDepartments();
        if (deptRes?.data && Array.isArray(deptRes.data)) {
          const fetchedDepts = deptRes.data.map(d => d.name);
          setDepartments(prev => Array.from(new Set([...prev, ...fetchedDepts])));
        }
      } catch (_) {}

      // 3. Designations
      try {
        const desigRes = await hrService.getDesignations();
        if (desigRes?.data && Array.isArray(desigRes.data)) {
          const fetchedDesigs = desigRes.data.map(d => d.name);
          setDesignations(prev => Array.from(new Set([...prev, ...fetchedDesigs])));
        }
      } catch (_) {}
    } catch (err) {
      console.warn("Failed to load HR options:", err);
    }
  };

  const loadStaffData = async (staffId) => {
    try {
      setLoading(true);
      const res = await hrService.getStaffById(staffId);
      if (res?.data) {
        const s = res.data;
        const parseMap = (val) => {
          if (!val) return {};
          if (val instanceof Map) return Object.fromEntries(val);
          if (typeof val === 'object') return val;
          try { return JSON.parse(val); } catch (_) { return {}; }
        };

        setFormData(prev => ({
          ...prev,
          firstName: s.fullName || s.firstName || '',
          email: s.email || '',
          password: '',
          role: s.role?.name || s.role || 'Teacher',
          designation: s.designation || '',
          department: s.department || '',
          gender: s.gender || 'Male',
          dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split('T')[0] : '',
          dateOfJoining: s.dateOfJoining ? s.dateOfJoining.split('T')[0] : '',
          confirmationDate: s.confirmationDate ? s.confirmationDate.split('T')[0] : '',
          employeeCode: s.staffId || s.employeeCode || '',
          employmentType: s.employmentType || 'Full-Time',
          reportingManager: s.reportingManager?._id || (typeof s.reportingManager === 'string' ? s.reportingManager : '') || '',
          fathersName: s.fathersName || '',
          mothersName: s.mothersName || '',
          emergencyContactName: s.emergencyContactName || '',
          emergencyContactPhone: s.emergencyContactPhone || '',
          bloodGroup: s.bloodGroup || '',
          phone: s.phone || '',
          maritalStatus: s.maritalStatus || '',
          qualification: s.qualification || '',
          workExperience: s.workExperience || '',
          currentAddress: s.currentAddress || '',
          note: s.note || '',
          bankDetails: {
            accountTitle: '',
            accountNumber: '',
            bankName: '',
            branchName: '',
            ifscCode: '',
            bankBranchCode: '',
            upiId: '',
            ...parseMap(s.bankDetails)
          },
          statutoryIds: {
            panNumber: '',
            aadhaarNumber: '',
            epfNumber: '',
            esicNumber: '',
            uanNumber: '',
            passportNumber: '',
            ...parseMap(s.statutoryIds)
          },
          socialMedia: {
            linkedin: '',
            whatsapp: '',
            facebook: '',
            twitter: '',
            website: '',
            instagram: '',
            ...parseMap(s.socialMedia)
          },
          additionalInfo: {
            probationPeriod: '',
            noticePeriod: '',
            previousEmployer: '',
            specialization: '',
            referenceContact: '',
            medicalNotes: '',
            ...parseMap(s.additionalInfo)
          }
        }));

        if (s.photo) {
          const photoUrl = s.photo.startsWith('http') || s.photo.startsWith('data:') 
            ? s.photo 
            : `http://localhost:5050/${s.photo.replace(/^\/+/, '')}`;
          setPhotoPreview(photoUrl);
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load staff member data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (group, field, value) => {
    setFormData(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] || {}),
        [field]: value
      }
    }));
  };

  // --- Photo Handling ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Invalid File', 'Please select a valid image file (PNG, JPG, JPEG)', 'warning');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Dynamic Add Role ---
  const handleAddRole = async () => {
    const { value: newRole } = await Swal.fire({
      title: 'Add New Role',
      input: 'text',
      inputLabel: 'Role Name (e.g. Vice Principal, Lab Incharge)',
      inputPlaceholder: 'Enter role name...',
      showCancelButton: true,
      confirmButtonText: 'Add Role',
      confirmButtonColor: '#6f42c1',
      cancelButtonColor: '#94a3b8',
      inputValidator: (val) => {
        if (!val || !val.trim()) return 'Role name cannot be empty!';
      }
    });

    if (newRole && newRole.trim()) {
      const trimmed = newRole.trim();
      try {
        await axiosInstance.post('/auth/roles', { name: trimmed });
      } catch (err) {
        console.warn('Role save API note:', err.message);
      }
      setRoles(prev => Array.from(new Set([...prev, trimmed])));
      setFormData(prev => ({ ...prev, role: trimmed }));
      Swal.fire({
        icon: 'success',
        title: 'Role Added!',
        text: `Role '${trimmed}' added and selected.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // --- Dynamic Add Department ---
  const handleAddDepartment = async () => {
    const { value: newDept } = await Swal.fire({
      title: 'Add New Department',
      input: 'text',
      inputLabel: 'Department Name (e.g. Science Lab, Sports Dept)',
      inputPlaceholder: 'Enter department name...',
      showCancelButton: true,
      confirmButtonText: 'Add Department',
      confirmButtonColor: '#6f42c1',
      cancelButtonColor: '#94a3b8',
      inputValidator: (val) => {
        if (!val || !val.trim()) return 'Department name cannot be empty!';
      }
    });

    if (newDept && newDept.trim()) {
      const trimmed = newDept.trim();
      try {
        await hrService.createDepartment({ name: trimmed });
      } catch (err) {
        console.warn('Dept save API note:', err.message);
      }
      setDepartments(prev => Array.from(new Set([...prev, trimmed])));
      setFormData(prev => ({ ...prev, department: trimmed }));
      Swal.fire({
        icon: 'success',
        title: 'Department Added!',
        text: `Department '${trimmed}' added and selected.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // --- Dynamic Add Designation ---
  const handleAddDesignation = async () => {
    const { value: newDesig } = await Swal.fire({
      title: 'Add New Designation',
      input: 'text',
      inputLabel: 'Designation Title (e.g. Head of Department, Coordinator)',
      inputPlaceholder: 'Enter designation...',
      showCancelButton: true,
      confirmButtonText: 'Add Designation',
      confirmButtonColor: '#6f42c1',
      cancelButtonColor: '#94a3b8',
      inputValidator: (val) => {
        if (!val || !val.trim()) return 'Designation cannot be empty!';
      }
    });

    if (newDesig && newDesig.trim()) {
      const trimmed = newDesig.trim();
      try {
        await hrService.createDesignation({ name: trimmed });
      } catch (err) {
        console.warn('Designation save API note:', err.message);
      }
      setDesignations(prev => Array.from(new Set([...prev, trimmed])));
      setFormData(prev => ({ ...prev, designation: trimmed }));
      Swal.fire({
        icon: 'success',
        title: 'Designation Added!',
        text: `Designation '${trimmed}' added and selected.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // --- Save / Submit Handler ---
  const handleSave = async () => {
    if (!formData.firstName || !formData.email || !formData.role) {
      Swal.fire('Required Fields', 'Please fill Full Name, Email, and Role!', 'warning');
      return;
    }
    if (!isEditing && !formData.password) {
      Swal.fire('Password Required', 'Please set a login password for this staff member!', 'warning');
      return;
    }

    try {
      setLoading(true);

      // 1. Create or ensure login identity in auth schema
      try {
        await axiosInstance.post('/auth/register', {
          username: formData.email.split('@')[0] || formData.email,
          email: formData.email,
          password: formData.password || 'Staff@123',
          roleName: formData.role
        });
      } catch (authErr) {
        console.warn("Auth user notice:", authErr.message);
      }

      // 2. Prepare Staff Payload using FormData for multipart photo upload
      const dataPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'reportingManager') {
          if (formData[key] && typeof formData[key] === 'string' && formData[key].trim() !== '') {
            dataPayload.append(key, formData[key].trim());
          }
          return;
        }
        if (['bankDetails', 'statutoryIds', 'socialMedia', 'additionalInfo'].includes(key)) {
          dataPayload.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== undefined && formData[key] !== null) {
          dataPayload.append(key, formData[key]);
        }
      });
      dataPayload.append('fullName', formData.firstName);
      dataPayload.append('staffId', formData.employeeCode || `STF-${Date.now().toString().slice(-4)}`);

      if (photoFile) {
        dataPayload.append('photo', photoFile);
      } else if (photoPreview && photoPreview.startsWith('data:')) {
        dataPayload.append('photo', photoPreview);
      }

      if (isEditing) {
        await hrService.updateStaff(id, dataPayload);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Staff profile updated successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await hrService.createStaff(dataPayload);
        Swal.fire({
          icon: 'success',
          title: 'Staff Created!',
          text: 'Staff user, login and profile created successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      }

      navigate('/hr/staff');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</h1>
        </div>
        <button 
          onClick={() => navigate('/hr/staff')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] rounded-none transition-colors cursor-pointer"
        >
          Back to Directory
        </button>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Main Form Area */}
        <div className="flex-1 space-y-6">
          
          {/* Login & Role Information */}
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#6f42c1]" />
              <h2 className="text-[13px] font-bold text-[#6f42c1]">Login & Role Information</h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                <input 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="e.g. Rajesh Kumar" 
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email * (Login ID)</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  type="email" 
                  placeholder="e.g. rajesh@school.com" 
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isEditing ? 'New Password (Optional)' : 'Set Password *'}
                </label>
                <input 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder={isEditing ? 'Leave blank to keep current' : 'Enter password for this user'} 
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                />
              </div>

              {/* Role with Dynamic Add Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600">Role *</label>
                  <button 
                    type="button" 
                    onClick={handleAddRole}
                    className="text-[11px] font-bold text-[#6f42c1] hover:text-[#59339e] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Role
                  </button>
                </div>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange} 
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white focus:border-[#6f42c1] focus:outline-none"
                >
                  <option value="" disabled>Select User Role...</option>
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Staff ID / Code *</label>
                <input 
                  name="employeeCode" 
                  value={formData.employeeCode} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="e.g. STF-1024" 
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Personal & Work Details */}
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-[#6f42c1]" />
              <h2 className="text-[13px] font-bold text-[#6f42c1]">Personal & Work Details</h2>
            </div>
            <div className="p-5 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Designation with Dynamic Add Option */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600">Designation *</label>
                    <button 
                      type="button" 
                      onClick={handleAddDesignation}
                      className="text-[11px] font-bold text-[#6f42c1] hover:text-[#59339e] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Add
                    </button>
                  </div>
                  <select 
                    name="designation" 
                    value={formData.designation} 
                    onChange={handleChange} 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white focus:border-[#6f42c1] focus:outline-none"
                  >
                    <option value="">Select Designation...</option>
                    {designations.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Department with Dynamic Add Option */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600">Department</label>
                    <button 
                      type="button" 
                      onClick={handleAddDepartment}
                      className="text-[11px] font-bold text-[#6f42c1] hover:text-[#59339e] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Add
                    </button>
                  </div>
                  <select 
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange} 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white focus:border-[#6f42c1] focus:outline-none"
                  >
                    <option value="">Select Department...</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender *</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white focus:border-[#6f42c1] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Birth</label>
                  <input 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleChange} 
                    type="date" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-600 focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Joining</label>
                  <input 
                    name="dateOfJoining" 
                    value={formData.dateOfJoining} 
                    onChange={handleChange} 
                    type="date" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-600 focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirmation Date</label>
                  <input 
                    name="confirmationDate" 
                    value={formData.confirmationDate} 
                    onChange={handleChange} 
                    type="date" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-600 focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Employment Type</label>
                  <select 
                    name="employmentType" 
                    value={formData.employmentType} 
                    onChange={handleChange} 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white focus:border-[#6f42c1] focus:outline-none"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Blood Group</label>
                  <input 
                    name="bloodGroup" 
                    value={formData.bloodGroup} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="e.g. O+, B+, A+" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="e.g. +91 9876543210" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Father's Name</label>
                  <input 
                    name="fathersName" 
                    value={formData.fathersName} 
                    onChange={handleChange} 
                    type="text" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Mother's Name</label>
                  <input 
                    name="mothersName" 
                    value={formData.mothersName} 
                    onChange={handleChange} 
                    type="text" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Contact Name</label>
                  <input 
                    name="emergencyContactName" 
                    value={formData.emergencyContactName} 
                    onChange={handleChange} 
                    type="text" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Contact Phone</label>
                  <input 
                    name="emergencyContactPhone" 
                    value={formData.emergencyContactPhone} 
                    onChange={handleChange} 
                    type="text" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Marital Status</label>
                  <select 
                    name="maritalStatus" 
                    value={formData.maritalStatus} 
                    onChange={handleChange} 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white focus:border-[#6f42c1] focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Qualification</label>
                  <input 
                    name="qualification" 
                    value={formData.qualification} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="e.g. M.Sc, B.Ed" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Work Experience</label>
                  <input 
                    name="workExperience" 
                    value={formData.workExperience} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="e.g. 5 Years in CBSE School" 
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Address</label>
                <textarea 
                  name="currentAddress" 
                  value={formData.currentAddress} 
                  onChange={handleChange} 
                  rows={2} 
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none resize-none" 
                />
              </div>

              {/* REAL WORKING PHOTO UPLOAD & PREVIEW */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Staff Photo</label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  className="hidden" 
                />

                {photoPreview ? (
                  <div className="flex items-center gap-4 p-3 bg-purple-50/40 border border-purple-200 rounded-none">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#6f42c1] shadow-xs relative shrink-0 bg-white">
                      <img src={photoPreview} alt="Staff Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-800 truncate">
                        {photoFile?.name || 'Selected Staff Photo'}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Image ready to save
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1 text-[11px] font-semibold bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border-2 border-dashed border-slate-300 hover:border-[#6f42c1] bg-slate-50 hover:bg-purple-50/30 p-4 text-center cursor-pointer transition-all group rounded-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-white group-hover:bg-purple-100 text-slate-500 group-hover:text-[#6f42c1] shadow-xs flex items-center justify-center mx-auto mb-2 transition-colors">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-[12px] font-bold text-slate-700 group-hover:text-[#6f42c1]">
                      Click to Browse or Upload Staff Photo
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Supports JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ================= LOWER TABS AREA (ALL 4 FULLY FUNCTIONAL) ================= */}
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
              <button 
                type="button" 
                onClick={() => setActiveTab('bank')} 
                className={`px-5 py-3 text-[12px] font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'bank' 
                    ? 'text-[#6f42c1] border-b-2 border-[#6f42c1] bg-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Bank Details</span>
              </button>

              <button 
                type="button" 
                onClick={() => setActiveTab('stat')} 
                className={`px-5 py-3 text-[12px] font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'stat' 
                    ? 'text-[#6f42c1] border-b-2 border-[#6f42c1] bg-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory IDs</span>
              </button>

              <button 
                type="button" 
                onClick={() => setActiveTab('social')} 
                className={`px-5 py-3 text-[12px] font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'social' 
                    ? 'text-[#6f42c1] border-b-2 border-[#6f42c1] bg-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Social Media</span>
              </button>

              <button 
                type="button" 
                onClick={() => setActiveTab('add')} 
                className={`px-5 py-3 text-[12px] font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'add' 
                    ? 'text-[#6f42c1] border-b-2 border-[#6f42c1] bg-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Additional Info</span>
              </button>
            </div>
            
            <div className="p-5">
              
              {/* TAB 1: BANK DETAILS */}
              {activeTab === 'bank' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Title / Holder Name</label>
                    <input 
                      type="text" 
                      value={formData.bankDetails?.accountTitle || ''} 
                      onChange={(e) => handleNestedChange('bankDetails', 'accountTitle', e.target.value)}
                      placeholder="e.g. Rajesh Kumar" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank Account Number</label>
                    <input 
                      type="text" 
                      value={formData.bankDetails?.accountNumber || ''} 
                      onChange={(e) => handleNestedChange('bankDetails', 'accountNumber', e.target.value)}
                      placeholder="e.g. 10983829012" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank Name</label>
                    <input 
                      type="text" 
                      value={formData.bankDetails?.bankName || ''} 
                      onChange={(e) => handleNestedChange('bankDetails', 'bankName', e.target.value)}
                      placeholder="e.g. State Bank of India" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Name</label>
                    <input 
                      type="text" 
                      value={formData.bankDetails?.branchName || ''} 
                      onChange={(e) => handleNestedChange('bankDetails', 'branchName', e.target.value)}
                      placeholder="e.g. Civil Lines Branch" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">IFSC Code</label>
                    <input 
                      type="text" 
                      value={formData.bankDetails?.ifscCode || ''} 
                      onChange={(e) => handleNestedChange('bankDetails', 'ifscCode', e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono uppercase focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">UPI ID / VPA (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.bankDetails?.upiId || ''} 
                      onChange={(e) => handleNestedChange('bankDetails', 'upiId', e.target.value)}
                      placeholder="e.g. name@okhdfcbank" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: STATUTORY IDS */}
              {activeTab === 'stat' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">PAN Card Number</label>
                    <input 
                      type="text" 
                      value={formData.statutoryIds?.panNumber || ''} 
                      onChange={(e) => handleNestedChange('statutoryIds', 'panNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono uppercase focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Aadhaar / National ID</label>
                    <input 
                      type="text" 
                      value={formData.statutoryIds?.aadhaarNumber || ''} 
                      onChange={(e) => handleNestedChange('statutoryIds', 'aadhaarNumber', e.target.value)}
                      placeholder="e.g. 1234 5678 9012" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">EPF / PF Account Number</label>
                    <input 
                      type="text" 
                      value={formData.statutoryIds?.epfNumber || ''} 
                      onChange={(e) => handleNestedChange('statutoryIds', 'epfNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. UP/LKO/0012345/000" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">ESIC Number</label>
                    <input 
                      type="text" 
                      value={formData.statutoryIds?.esicNumber || ''} 
                      onChange={(e) => handleNestedChange('statutoryIds', 'esicNumber', e.target.value)}
                      placeholder="e.g. 31000123450000101" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">UAN (Universal Account Number)</label>
                    <input 
                      type="text" 
                      value={formData.statutoryIds?.uanNumber || ''} 
                      onChange={(e) => handleNestedChange('statutoryIds', 'uanNumber', e.target.value)}
                      placeholder="e.g. 100123456789" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Passport Number (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.statutoryIds?.passportNumber || ''} 
                      onChange={(e) => handleNestedChange('statutoryIds', 'passportNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. Z1234567" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-mono uppercase focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SOCIAL MEDIA */}
              {activeTab === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn Profile URL</label>
                    <input 
                      type="url" 
                      value={formData.socialMedia?.linkedin || ''} 
                      onChange={(e) => handleNestedChange('socialMedia', 'linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp Official Number</label>
                    <input 
                      type="text" 
                      value={formData.socialMedia?.whatsapp || ''} 
                      onChange={(e) => handleNestedChange('socialMedia', 'whatsapp', e.target.value)}
                      placeholder="e.g. +91 9876543210" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Facebook URL</label>
                    <input 
                      type="url" 
                      value={formData.socialMedia?.facebook || ''} 
                      onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/username" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Twitter / X Profile</label>
                    <input 
                      type="text" 
                      value={formData.socialMedia?.twitter || ''} 
                      onChange={(e) => handleNestedChange('socialMedia', 'twitter', e.target.value)}
                      placeholder="e.g. @staff_name" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Personal Portfolio / Website</label>
                    <input 
                      type="url" 
                      value={formData.socialMedia?.website || ''} 
                      onChange={(e) => handleNestedChange('socialMedia', 'website', e.target.value)}
                      placeholder="https://mywebsite.edu" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Instagram Profile</label>
                    <input 
                      type="text" 
                      value={formData.socialMedia?.instagram || ''} 
                      onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
                      placeholder="e.g. @insta_username" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ADDITIONAL INFO */}
              {activeTab === 'add' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Probation Period</label>
                    <input 
                      type="text" 
                      value={formData.additionalInfo?.probationPeriod || ''} 
                      onChange={(e) => handleNestedChange('additionalInfo', 'probationPeriod', e.target.value)}
                      placeholder="e.g. 6 Months" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Notice Period</label>
                    <input 
                      type="text" 
                      value={formData.additionalInfo?.noticePeriod || ''} 
                      onChange={(e) => handleNestedChange('additionalInfo', 'noticePeriod', e.target.value)}
                      placeholder="e.g. 30 Days" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Previous School / Employer</label>
                    <input 
                      type="text" 
                      value={formData.additionalInfo?.previousEmployer || ''} 
                      onChange={(e) => handleNestedChange('additionalInfo', 'previousEmployer', e.target.value)}
                      placeholder="e.g. DPS International" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Teaching Specialization</label>
                    <input 
                      type="text" 
                      value={formData.additionalInfo?.specialization || ''} 
                      onChange={(e) => handleNestedChange('additionalInfo', 'specialization', e.target.value)}
                      placeholder="e.g. Senior Secondary Mathematics" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Professional Reference</label>
                    <input 
                      type="text" 
                      value={formData.additionalInfo?.referenceContact || ''} 
                      onChange={(e) => handleNestedChange('additionalInfo', 'referenceContact', e.target.value)}
                      placeholder="Name & Contact Number" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Medical Notes / Allergies</label>
                    <input 
                      type="text" 
                      value={formData.additionalInfo?.medicalNotes || ''} 
                      onChange={(e) => handleNestedChange('additionalInfo', 'medicalNotes', e.target.value)}
                      placeholder="e.g. None / Asthmatic" 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" 
                    />
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-[#6f42c1] hover:bg-[#59339e] disabled:bg-gray-400 text-white font-bold text-[13px] rounded-none flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : isEditing ? 'Update Staff Member' : 'Save Staff Member'}
            </button>
          </div>

        </div>

        {/* Instructions Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-slate-200 rounded-none shadow-sm sticky top-6">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-600" />
              <h2 className="text-[13px] font-bold text-slate-800">Instructions</h2>
            </div>
            <div className="p-5 text-[12px] text-slate-600 space-y-4">
              <p>
                <strong className="text-slate-800">Login & Role:</strong> The email provided will be the staff member's username for logging into the teacher / staff portal. You can also add new customized roles by clicking <span className="text-[#6f42c1] font-bold">+ Add Role</span>.
              </p>
              <p>
                <strong className="text-slate-800">Personal Details:</strong> Enter full work details. Use the <span className="text-[#6f42c1] font-bold">+ Add</span> button next to Designation and Department to instantly add new categories to the school directory.
              </p>
              <p>
                <strong className="text-slate-800">Payroll & Compliance:</strong> Complete the <span className="font-semibold text-slate-700">Bank Details</span> and <span className="font-semibold text-slate-700">Statutory IDs (PAN, PF, ESIC)</span> tabs for automated salary generation and compliance reporting.
              </p>
              <p>
                <strong className="text-slate-800">Staff Photo:</strong> Upload a clear passport-size photo for official school ID card generation and directory listing.
              </p>
              <p className="italic">
                Fields marked with an asterisk (*) are mandatory.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
