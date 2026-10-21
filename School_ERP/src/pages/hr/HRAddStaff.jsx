import React, { useState } from 'react';
import { 
  Users, Save, Info, User, Briefcase, FileText
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { hrService } from '../../api/hrService';

export default function HRAddStaff() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    role: 'Teacher',
    designation: '',
    phone: '',
    employeeCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if(!formData.firstName || !formData.email || !formData.role || !formData.password) {
      alert("Please fill all mandatory fields (Name, Email, Password, Role)!");
      return;
    }
    try {
      setLoading(true);
      // 1. Create the actual login identity in the auth schema
      const { default: axiosInstance } = await import('../../api/axios');
      try {
        await axiosInstance.post('/auth/register', {
          username: formData.email.split('@')[0] || formData.email,
          email: formData.email,
          password: formData.password,
          roleName: formData.role
        });
      } catch (authErr) {
        console.warn("Auth user might already exist or role creation failed, continuing to profile creation.");
      }

      // 2. Create the Staff Profile
      await hrService.createStaff({
        ...formData,
        fullName: formData.firstName,
        staffId: formData.employeeCode
      });
      
      alert('Staff user and login created successfully!');
      navigate('/hr/staff');
    } catch(err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
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
                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email * (Also Login ID)</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Set Password *</label>
                <input name="password" value={formData.password} onChange={handleChange} type="text" placeholder="Enter password for this user" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Role *</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white focus:border-[#6f42c1] focus:outline-none">
                  <option value="" disabled>Select User Role...</option>
                  <option value="Admin">Admin / Branch Admin</option>
                  <option value="Teacher">Teacher (Academics & Exams)</option>
                  <option value="Accountant">Accountant (Finance & Accounts)</option>
                  <option value="Receptionist">Receptionist (Front Office)</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Staff">General Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Staff ID / Code *</label>
                <input name="employeeCode" value={formData.employeeCode} onChange={handleChange} type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] focus:border-[#6f42c1] focus:outline-none" />
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
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Designation *</label>
                  <select name="designation" value={formData.designation} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white"><option value="">Select...</option><option value="Staff">Staff</option><option value="Senior Teacher">Senior Teacher</option><option value="Admin">Admin</option></select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Department</label>
                  <select className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white"><option>Select...</option></select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender *</label>
                  <select className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white"><option>Male</option><option>Female</option></select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Birth</label>
                  <input type="date" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-600" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Joining</label>
                  <input type="date" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-600" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirmation Date</label>
                  <input type="date" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] text-slate-600" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Employee Code</label>
                  <input type="text" placeholder="Internal HR/payroll code" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Employment Type</label>
                  <select className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white"><option>Select...</option></select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Reporting Manager</label>
                  <select className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] bg-white"><option>-- None --</option></select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Father's Name</label>
                  <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Mother's Name</label>
                  <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Contact Name</label>
                  <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Contact Phone</label>
                  <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Blood Group</label>
                  <input type="text" placeholder="e.g. O+" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Marital Status</label>
                  <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Qualification</label>
                  <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Work Experience</label>
                  <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Address</label>
                <textarea className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] min-h-[60px]"></textarea>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Note</label>
                <textarea className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px] min-h-[60px]"></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Photo</label>
                <div className="flex border border-slate-300 rounded-none overflow-hidden">
                  <div className="px-3 py-1.5 bg-slate-100 text-[12px] text-slate-600 border-r border-slate-300">Choose a file...</div>
                  <div className="flex-1 px-3 py-1.5 text-[12px] text-right text-slate-500 bg-white">Browse</div>
                </div>
              </div>

            </div>
          </div>

          {/* Lower Tabs Area */}
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="flex border-b border-slate-200">
              <button onClick={() => setActiveTab('bank')} className={`px-5 py-3 text-[12px] font-bold ${activeTab === 'bank' ? 'text-[#6f42c1] border-b-2 border-[#6f42c1]' : 'text-slate-500 hover:text-slate-800'}`}>Bank Details</button>
              <button onClick={() => setActiveTab('stat')} className={`px-5 py-3 text-[12px] font-bold ${activeTab === 'stat' ? 'text-[#6f42c1] border-b-2 border-[#6f42c1]' : 'text-slate-500 hover:text-slate-800'}`}>Statutory IDs</button>
              <button onClick={() => setActiveTab('social')} className={`px-5 py-3 text-[12px] font-bold ${activeTab === 'social' ? 'text-[#6f42c1] border-b-2 border-[#6f42c1]' : 'text-slate-500 hover:text-slate-800'}`}>Social Media</button>
              <button onClick={() => setActiveTab('add')} className={`px-5 py-3 text-[12px] font-bold ${activeTab === 'add' ? 'text-[#6f42c1] border-b-2 border-[#6f42c1]' : 'text-slate-500 hover:text-slate-800'}`}>Additional Info</button>
            </div>
            
            <div className="p-5">
              {activeTab === 'bank' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Title</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Number</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank Name</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Name</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">IFSC Code</label>
                    <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-none text-[12px]" />
                  </div>
                </div>
              )}
              {activeTab !== 'bank' && (
                <div className="text-[12px] text-slate-500 text-center py-4">Fields for {activeTab} will appear here.</div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-[#6f42c1] hover:bg-[#59339e] disabled:bg-gray-400 text-white font-bold text-[13px] rounded-none flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Staff Member'}
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
                <strong className="text-slate-800">Login & Role:</strong> These are the most important fields. The email provided will be the staff member's username for logging into the system. The selected 'Role' will determine what permissions and menu items they can access.
              </p>
              <p>
                <strong className="text-slate-800">Personal Details:</strong> Fill in the staff's personal and employment information. 'Designation' is a required field.
              </p>
              <p>
                <strong className="text-slate-800">Other Information:</strong> Use the tabs in the final card to enter less frequently accessed information like bank details for payroll, social media links, and any custom fields your school has created.
              </p>
              <p className="italic">
                Fields marked with a red asterisk (*) are mandatory.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
