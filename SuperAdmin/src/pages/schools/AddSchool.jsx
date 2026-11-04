import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Save, Upload, CheckCircle, User, Globe } from 'lucide-react';
import { tenantService } from '../../api/tenantService';
import Swal from 'sweetalert2';
import { planService } from '../../api/planService';
import { toArray } from '../../utils/helpers';

const EMPTY = {
  name: '', email: '', phone: '', city: '', state: '', country: 'India',
  plan: 'Basic', adminName: '', adminEmail: '', adminPhone: '', adminPassword: '',
  address: '', website: '', established: '',
};

const Field = ({ label, name, value, onChange, type = 'text', placeholder, required }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      className="w-full border border-gray-200 bg-white text-slate-800 placeholder-slate-400 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
    />
  </div>
);

const AddSchool = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [logo, setLogo] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    planService.getPlans().then(res => {
      setPlans(toArray(res));
    }).catch(console.error);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({ icon: 'error', title: 'File Too Large', text: 'File size should not exceed 2MB', confirmButtonColor: '#0891b2' });
        return;
      }
      setLogo(URL.createObjectURL(file));
      setForm({ ...form, logoFile: file });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'School name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.adminName.trim()) e.adminName = 'Admin name is required';
    if (!form.adminEmail.trim()) e.adminEmail = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(form.adminEmail)) e.adminEmail = 'Invalid email';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    try {
      setLoading(true);
      await tenantService.registerTenant({
        schoolName: form.name,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
        city: form.city,
        state: form.state,
        address: form.address,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        adminPhone: form.adminPhone,
        adminPassword: form.adminPassword || 'admin123',
      });
      setSuccess(true);
      // Removed the 1800ms auto redirect so they can copy the credentials
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.response?.data?.message || err.message || 'An error occurred', confirmButtonColor: '#0891b2' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-none border border-gray-200 mt-10 shadow-sm max-w-xl mx-auto text-center">
        <div className="w-16 h-16 bg-green-50 rounded-none flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">School Successfully Registered!</h2>
        <p className="text-sm text-gray-500 mb-6">You can now share these credentials with the school admin.</p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-none p-4 w-full text-left mb-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">Admin Credentials</p>
          <div className="mb-2">
            <span className="text-xs text-gray-500 w-24 inline-block">Login ID:</span>
            <span className="text-sm font-bold text-gray-800">{form.adminEmail}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 w-24 inline-block">Password:</span>
            <span className="text-sm font-mono font-bold text-gray-800">{form.adminPassword || 'admin123'}</span>
          </div>
        </div>

        <button onClick={() => navigate('/schools')} className="bg-orange-500 text-white px-6 py-2.5 rounded-none font-semibold text-sm hover:bg-orange-600">
          Go to Schools List
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/schools')} className="p-2 hover:bg-gray-100 rounded-none transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New School</h1>
          <p className="text-sm text-gray-500">Register a new school on the platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* School Info */}
          <div className="bg-white rounded-none border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" /> School Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Field label="School Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Montessori School" required />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <Field label="Email Address" name="email" value={form.email} onChange={handleChange} placeholder="admin@school.com" type="email" required />
                {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
              </div>
              <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              <Field label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://school.com" />
              <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
              <Field label="State" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
              <Field label="Established Year" name="established" value={form.established} onChange={handleChange} placeholder="2005" />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange}
                  placeholder="Full school address..." rows={2}
                  className="w-full border border-gray-200 bg-white text-slate-800 placeholder-slate-400 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white rounded-none border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" /> Admin Account
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Field label="Admin Name" name="adminName" value={form.adminName} onChange={handleChange} placeholder="John Doe" required />
                {errors.adminName && <p className="text-[10px] text-red-500 mt-1">{errors.adminName}</p>}
              </div>
              <div>
                <Field label="Admin Email" name="adminEmail" value={form.adminEmail} onChange={handleChange} placeholder="john@school.com" type="email" required />
                {errors.adminEmail && <p className="text-[10px] text-red-500 mt-1">{errors.adminEmail}</p>}
              </div>
              <Field label="Admin Phone" name="adminPhone" value={form.adminPhone} onChange={handleChange} placeholder="+91 98765 43210" />
              <Field label="Login Password" name="adminPassword" value={form.adminPassword} onChange={handleChange} placeholder="Leave blank for 'admin123'" />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-none border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" /> Plan & Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subscription Plan</label>
                <select name="plan" value={form.plan} onChange={handleChange}
                  className="w-full border border-gray-200 bg-white text-slate-800 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option value="Basic">Basic (Fallback)</option>
                  {plans.map(p => (
                    <option key={p._id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
                <select name="country" value={form.country} onChange={handleChange}
                  className="w-full border border-gray-200 bg-white text-slate-800 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>UAE</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-none border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 mb-4">School Logo</h2>
            <label className="border-2 border-dashed border-gray-200 rounded-none p-6 text-center cursor-pointer hover:border-orange-300 transition-colors block relative">
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleLogoChange} />
              {logo ? (
                <div className="flex flex-col items-center">
                  <img src={logo} alt="Logo Preview" className="mx-auto max-h-24 object-contain mb-2" />
                  <p className="text-[10px] text-[#0891b2] font-semibold hover:underline">Change Logo</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Click to upload logo</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                </>
              )}
            </label>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/schools')}
              className="flex-1 py-3 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-none font-semibold transition-colors">
              <Save className="w-4 h-4" /> {loading ? 'Registering...' : 'Add School'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSchool;
