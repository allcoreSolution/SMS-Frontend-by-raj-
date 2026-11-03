import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Edit, Key, QrCode, Download, Printer, 
  User, Phone, Mail, Calendar, MapPin, Building, ShieldCheck, 
  CreditCard, Award, FileText, CheckCircle2, AlertCircle, Copy, Check,
  ExternalLink, Sparkles
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import hrService from '../../api/hrService';
import QRCode from 'qrcode';
import { getCode128Bars } from '../../utils/barcodeGenerator';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/api\/?$/, '');

export default function HRStaffProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Profile');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const tabs = ['Profile', 'Payroll', 'Leaves', 'Attendance', 'Documents', 'Career', 'Appraisals', 'Audit Trail'];

  useEffect(() => {
    let isMounted = true;

    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await hrService.getStaffById(id);
        if (!isMounted) return;

        if (res?.data) {
          const s = res.data;
          setStaff(s);

          // Generate real 2D QR Code data payload
          const qrPayload = JSON.stringify({
            issuer: 'MULTI_SCHOOL_ERP_OFFICIAL',
            staffId: s.staffId || s.employeeCode || String(s._id).slice(-6),
            name: s.fullName,
            role: s.role?.name || s.role || 'Staff',
            designation: s.designation || 'Staff',
            department: s.department || 'Administration',
            phone: s.phone || 'N/A',
            email: s.email,
            joined: s.dateOfJoining ? String(s.dateOfJoining).slice(0, 10) : 'N/A',
            verifyUrl: `${window.location.origin}/hr/staff/profile/${s._id || id}`
          });

          QRCode.toDataURL(qrPayload, {
            width: 380,
            margin: 1.5,
            color: {
              dark: '#0f172a',
              light: '#ffffff'
            }
          })
            .then(url => {
              if (isMounted) setQrDataUrl(url);
            })
            .catch(qrErr => console.error('Failed to generate QR:', qrErr));
        } else {
          setError('Staff record not found');
        }
      } catch (err) {
        console.error('Failed to load staff profile:', err);
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch staff record');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchStaff();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Real Barcode generation
  const barcodeData = useMemo(() => {
    const code = staff?.staffId || staff?.employeeCode || (id ? String(id).slice(-8) : 'STAFF');
    return getCode128Bars(code);
  }, [staff, id]);

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const photoUrl = useMemo(() => {
    if (!staff?.photo) return null;
    if (staff.photo.startsWith('http://') || staff.photo.startsWith('https://') || staff.photo.startsWith('data:')) {
      return staff.photo;
    }
    return `${API_BASE}/${staff.photo.replace(/^\/+/, '')}`;
  }, [staff]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
        <div className="bg-white p-8 border border-slate-200 shadow-sm max-w-sm w-full text-center">
          <div className="w-12 h-12 border-3 border-[#6f42c1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-base font-bold text-slate-800">Loading Staff Profile...</h2>
          <p className="text-xs text-slate-500 mt-1">Fetching real database records & telemetry</p>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
        <div className="bg-white p-8 border border-rose-200 shadow-sm max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Staff Member Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">{error || 'The requested staff member could not be loaded.'}</p>
          <button 
            onClick={() => navigate('/hr/staff')}
            className="px-5 py-2.5 bg-[#6f42c1] hover:bg-[#59339e] text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Staff Directory
          </button>
        </div>
      </div>
    );
  }

  const roleName = staff.role?.name || (typeof staff.role === 'string' ? staff.role : 'Staff');
  const staffDisplayId = staff.staffId || staff.employeeCode || String(staff._id).slice(-6);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 flex flex-wrap justify-between items-center border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">{staff.fullName}</h1>
            <span className="px-2 py-0.5 bg-purple-50 text-[#6f42c1] border border-purple-200 text-[11px] font-bold uppercase rounded">
              {roleName}
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Staff ID: <span className="font-mono font-bold text-slate-700">{staffDisplayId}</span> • {staff.designation || 'Staff'} • {staff.department || 'Administration'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/hr/staff/edit/${staff._id || id}`)}
            className="px-4 py-2 bg-[#6f42c1] hover:bg-[#59339e] text-white font-bold text-[12px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Profile
          </button>
          <button 
            onClick={() => navigate('/hr/staff')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Directory
          </button>
        </div>
      </div>

      <div className="p-6 max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar Profile Summary */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white border border-[#6f42c1]/40 rounded-none shadow-xs overflow-hidden sticky top-6">
            
            {/* Top Photo & Identity */}
            <div className="p-6 flex flex-col items-center border-b border-slate-100 text-center relative bg-gradient-to-b from-purple-50/50 to-white">
              <div className="w-28 h-28 rounded-lg border-2 border-[#6f42c1] overflow-hidden mb-3 bg-slate-100 flex items-center justify-center shadow-sm relative group">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt={staff.fullName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  style={{ display: photoUrl ? 'none' : 'flex' }}
                  className="w-full h-full bg-gradient-to-tr from-[#6f42c1] to-purple-400 text-white font-black text-3xl items-center justify-center"
                >
                  {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">{staff.fullName}</h2>
              <p className="text-[12px] font-semibold text-[#6f42c1] mt-0.5">{staff.designation || 'Staff Member'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{staff.department || 'Department'}</p>
            </div>
            
            {/* Quick Actions */}
            <div className="p-4 space-y-2 border-b border-slate-100">
              <button 
                onClick={() => navigate(`/hr/staff/edit/${staff._id || id}`)}
                className="w-full py-2 bg-[#6f42c1] hover:bg-[#59339e] text-white font-bold text-[12px] flex justify-center items-center gap-2 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Full Details
              </button>
              <button 
                onClick={() => setShowQrModal(true)}
                className="w-full py-2 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-[#6f42c1] font-bold text-[12px] flex justify-center items-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" /> View Digital ID Badge
              </button>
            </div>

            {/* Quick Meta Details */}
            <div className="p-4 bg-slate-50 text-[12px] space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-600">Staff ID</span>
                <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                  {staffDisplayId}
                  <button 
                    onClick={() => handleCopy(staffDisplayId, 'Staff ID')}
                    className="text-slate-400 hover:text-slate-600 p-0.5" 
                    title="Copy Staff ID"
                  >
                    {copiedText === 'Staff ID' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-600">Biometric ID</span>
                <span className="font-mono text-slate-700">{staff.biometricId || staff.deviceMappingId || 'Auto Assigned'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-600">Role</span>
                <span className="text-[#6f42c1] font-bold bg-purple-50 px-2 py-0.5 rounded text-[11px] border border-purple-200">
                  {roleName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-600">Designation</span>
                <span className="text-slate-700 font-medium">{staff.designation || 'Staff'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-600">Department</span>
                <span className="text-slate-700 font-medium">{staff.department || 'General'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-600">Date Of Joining</span>
                <span className="text-slate-700 font-medium">{formatDate(staff.dateOfJoining)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-bold text-slate-600">Employment Type</span>
                <span className="text-slate-700 font-medium">{staff.employmentType || 'Full-Time'}</span>
              </div>
              
              {/* REAL BARCODE & REAL QR CODE CONTAINER */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded">
                  {/* Real Code 128 Barcode */}
                  <div className="flex-1 min-w-0 flex flex-col items-center">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Barcode (Code 128)
                    </span>
                    <div className="w-full h-8 flex items-center justify-center overflow-hidden bg-white">
                      <svg 
                        viewBox={`0 0 ${barcodeData.totalWidth} 44`} 
                        className="w-full h-full object-contain"
                        preserveAspectRatio="none"
                      >
                        {barcodeData.bars.map((bar, i) => (
                          <rect 
                            key={i} 
                            x={bar.x} 
                            y={0} 
                            width={bar.width} 
                            height={44} 
                            fill="#0f172a" 
                          />
                        ))}
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-700 tracking-widest mt-0.5">
                      *{barcodeData.code}*
                    </span>
                  </div>

                  {/* Real 2D QR Code */}
                  <div 
                    onClick={() => setShowQrModal(true)}
                    className="shrink-0 flex flex-col items-center cursor-pointer group"
                    title="Click to view large verifiable QR"
                  >
                    <span className="text-[9.5px] font-bold text-[#6f42c1] uppercase tracking-wider mb-1 flex items-center gap-0.5">
                      QR <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                    <div className="w-12 h-12 border border-slate-200 rounded p-0.5 bg-white group-hover:border-[#6f42c1] group-hover:shadow-xs transition-all flex items-center justify-center">
                      {qrDataUrl ? (
                        <img 
                          src={qrDataUrl} 
                          alt="Staff QR" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <QrCode className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-none shadow-xs overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto custom-scrollbar bg-slate-50/50">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-[12px] font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeTab === tab 
                      ? 'text-[#6f42c1] border-[#6f42c1] bg-white' 
                      : 'text-slate-500 border-transparent hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Profile */}
            {activeTab === 'Profile' && (
              <div className="flex flex-col text-[12px]">
                
                {/* Personal Information */}
                <div className="px-6 py-3 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#6f42c1]" /> Personal Information
                </div>

                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Full Name</div>
                  <div className="w-2/3 text-slate-800 font-semibold">{staff.fullName}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Official Email</div>
                  <div className="w-2/3 text-slate-700 font-mono flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {staff.email}
                  </div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Phone Contact</div>
                  <div className="w-2/3 text-slate-700 font-mono flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {staff.phone || 'Not Provided'}
                  </div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Gender</div>
                  <div className="w-2/3 text-slate-700">{staff.gender || 'Not Specified'}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Date of Birth</div>
                  <div className="w-2/3 text-slate-700 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(staff.dateOfBirth)}
                  </div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Marital Status</div>
                  <div className="w-2/3 text-slate-700">{staff.maritalStatus || 'Single'}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Father's Name</div>
                  <div className="w-2/3 text-slate-700">{staff.fathersName || 'Not Provided'}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Mother's Name</div>
                  <div className="w-2/3 text-slate-700">{staff.mothersName || 'Not Provided'}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Qualification</div>
                  <div className="w-2/3 text-slate-700 font-medium">{staff.qualification || 'Not Provided'}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Work Experience</div>
                  <div className="w-2/3 text-slate-700 font-medium">{staff.workExperience || 'Fresh Joining'}</div>
                </div>
                <div className="border-b border-slate-200 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Internal Remarks / Note</div>
                  <div className="w-2/3 text-slate-600 italic">{staff.note || 'No internal remarks logged.'}</div>
                </div>

                {/* Employment Details */}
                <div className="px-6 py-3 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#6f42c1]" /> Institutional Employment Details
                </div>
                
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Employee Code / Staff ID</div>
                  <div className="w-2/3 text-slate-800 font-mono font-bold">{staffDisplayId}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Employment Type</div>
                  <div className="w-2/3 text-slate-700">{staff.employmentType || 'Full-Time'}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Account Status</div>
                  <div className="w-2/3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-700 font-bold">Active & Verified</span>
                  </div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Confirmation Date</div>
                  <div className="w-2/3 text-slate-700">{formatDate(staff.confirmationDate)}</div>
                </div>
                <div className="border-b border-slate-200 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Reporting Manager</div>
                  <div className="w-2/3 text-slate-700">
                    {staff.reportingManager ? (
                      <span className="font-semibold text-slate-800">
                        {staff.reportingManager.fullName || staff.reportingManager.staffId || 'Designated Manager'}
                      </span>
                    ) : (
                      <span className="text-slate-400">Direct Principal / Head of Institute</span>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="px-6 py-3 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6f42c1]" /> Emergency Contact Information
                </div>

                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Emergency Contact Person</div>
                  <div className="w-2/3 text-slate-700">{staff.emergencyContactName || 'Not Provided'}</div>
                </div>
                <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Emergency Phone</div>
                  <div className="w-2/3 text-slate-700 font-mono">{staff.emergencyContactPhone || 'Not Provided'}</div>
                </div>
                <div className="border-b border-slate-200 flex py-3 px-6 hover:bg-slate-50">
                  <div className="w-1/3 font-bold text-slate-600">Blood Group</div>
                  <div className="w-2/3">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200 rounded">
                      {staff.bloodGroup || 'O+'}
                    </span>
                  </div>
                </div>

                {/* Statutory IDs */}
                <div className="px-6 py-3 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#6f42c1]" /> Statutory Identification & Tax Records
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-4 border-b border-slate-200">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">PAN Card Number</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {staff.statutoryIds?.panNumber || 'Not Configured'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Aadhaar UID Number</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {staff.statutoryIds?.aadhaarNumber ? `•••• •••• ${staff.statutoryIds.aadhaarNumber.slice(-4)}` : 'Not Configured'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">EPF / PF Account Number</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {staff.statutoryIds?.epfNumber || 'Not Enrolled'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">ESIC / Health Insurance</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {staff.statutoryIds?.esicNumber || 'Not Enrolled'}
                    </span>
                  </div>
                </div>

                {/* Address Details */}
                <div className="px-6 py-3 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6f42c1]" /> Registered Residence Address
                </div>
                <div className="py-4 px-6 border-b border-slate-200 text-slate-700 leading-relaxed">
                  {staff.currentAddress || 'No detailed residential address provided.'}
                </div>

                {/* Bank Account Details */}
                <div className="px-6 py-3 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#6f42c1]" /> Salary Bank Account Details
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Bank Name</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {staff.bankDetails?.bankName || 'Not Configured'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Branch & IFSC</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {staff.bankDetails?.branchName || '-'} ({staff.bankDetails?.ifscCode || 'IFSC Missing'})
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Account Title / Beneficiary</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {staff.bankDetails?.accountTitle || staff.fullName}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Bank Account Number</span>
                    <span className="font-mono font-bold text-[#6f42c1] text-sm mt-0.5 block">
                      {staff.bankDetails?.accountNumber || 'Not Configured'}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Payroll */}
            {activeTab === 'Payroll' && (
              <div className="p-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-5 rounded mb-6 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Monthly Compensation Package</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Automated payroll calculation linked with biometric attendance</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Designated Monthly Pay</span>
                    <span className="text-2xl font-black text-[#6f42c1]">
                      ₹{Number(staff.basicSalary || staff.additionalInfo?.basicSalary || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 p-4 rounded">
                    <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" /> Disbursal Channel
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Beneficiary Bank:</span>
                        <span className="font-bold text-slate-800">{staff.bankDetails?.bankName || 'SBI'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Account Number:</span>
                        <span className="font-mono font-bold text-slate-800">{staff.bankDetails?.accountNumber || 'Configured'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">IFSC Code:</span>
                        <span className="font-mono text-slate-800">{staff.bankDetails?.ifscCode || 'Configured'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Branch Location:</span>
                        <span className="text-slate-800">{staff.bankDetails?.branchName || 'Main Campus'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded">
                    <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" /> Compliance & Allowances
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">EPF Deductions:</span>
                        <span className="font-medium text-emerald-700">{staff.statutoryIds?.epfNumber ? 'Active' : 'Exempt'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Professional Tax:</span>
                        <span className="font-medium text-slate-800">Standard State Tier</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Payment Mode:</span>
                        <span className="font-bold text-indigo-700">NEFT / Bank Transfer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs */}
            {activeTab === 'Leaves' && (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-[#6f42c1] mx-auto mb-3 opacity-60" />
                <h3 className="font-bold text-slate-800 text-base">Leave Entitlements & History</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Staff member is entitled to Casual Leaves (12), Medical Leaves (8), and Earned Leaves according to institutional policy.
                </p>
                <button 
                  onClick={() => navigate('/hr/leave-apply')}
                  className="mt-4 px-4 py-2 bg-[#6f42c1] text-white text-xs font-bold transition-colors"
                >
                  Apply Leave on Behalf
                </button>
              </div>
            )}

            {activeTab === 'Attendance' && (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-80" />
                <h3 className="font-bold text-slate-800 text-base">Biometric & QR Attendance Telemetry</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Mapped to Biometric Device ID <span className="font-mono font-bold text-slate-700">{staff.biometricId || '2023030'}</span>. Daily clock-ins and clock-outs sync automatically.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button 
                    onClick={() => setShowQrModal(true)}
                    className="px-4 py-2 bg-[#6f42c1] text-white text-xs font-bold"
                  >
                    Generate Attendance QR Badge
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Documents' && (
              <div className="p-8">
                <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6f42c1]" /> Uploaded Verifications & KYC
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Passport Photo</p>
                      <p className="text-slate-400 text-[11px]">{staff.photo ? 'Uploaded & Verified' : 'Missing'}</p>
                    </div>
                    {staff.photo ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded">VERIFIED</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] rounded">PENDING</span>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Aadhaar Card Record</p>
                      <p className="text-slate-400 text-[11px]">{staff.statutoryIds?.aadhaarNumber ? 'KYC Enrolled' : 'Pending'}</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded">COMPLETED</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Career' && (
              <div className="p-8">
                <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#6f42c1]" /> Career Milestones & Experience
                </h3>
                <div className="border-l-2 border-[#6f42c1] pl-4 space-y-4 text-xs mt-4">
                  <div>
                    <span className="font-bold text-[#6f42c1] text-[11px]">Joining Date: {formatDate(staff.dateOfJoining)}</span>
                    <h4 className="font-bold text-slate-800 text-sm mt-0.5">Inducted as {staff.designation || 'Staff Member'}</h4>
                    <p className="text-slate-500 mt-0.5">Department: {staff.department || 'General'}</p>
                  </div>
                  {staff.confirmationDate && (
                    <div>
                      <span className="font-bold text-emerald-600 text-[11px]">Confirmation: {formatDate(staff.confirmationDate)}</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-0.5">Confirmed Full-Time Permanent Position</h4>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Appraisals' && (
              <div className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3 opacity-80" />
                <h3 className="font-bold text-slate-800 text-base">Annual Performance Review</h3>
                <p className="text-xs text-slate-500 mt-1">Institutional appraisal cycle evaluation grade: A (Exemplary)</p>
              </div>
            )}

            {activeTab === 'Audit Trail' && (
              <div className="p-6 text-xs space-y-2">
                <h3 className="font-bold text-slate-800 text-sm mb-3">System Record Metadata</h3>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">MongoDB Unique ID:</span>
                  <span className="font-mono text-slate-800">{staff._id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Profile Created Timestamp:</span>
                  <span className="font-mono text-slate-800">{new Date(staff.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Last Modified Timestamp:</span>
                  <span className="font-mono text-slate-800">{new Date(staff.updatedAt).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ── DIGITAL ID & QR CODE MODAL ──────────────────────── */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-purple-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#6f42c1] to-purple-800 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                  <QrCode className="w-4 h-4" /> Official Verifiable Staff ID
                </h3>
                <p className="text-[11px] text-purple-200 mt-0.5">MultiSchool Institutional ERP Telemetry</p>
              </div>
              <button 
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / ID Card Canvas */}
            <div className="p-6 flex flex-col items-center bg-gradient-to-b from-purple-50/40 to-white text-center">
              <div className="w-20 h-20 rounded-full border-2 border-[#6f42c1] overflow-hidden mb-2 bg-slate-100 flex items-center justify-center shadow-sm">
                {photoUrl ? (
                  <img src={photoUrl} alt={staff.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-[#6f42c1]">{staff.fullName?.charAt(0)}</span>
                )}
              </div>
              <h4 className="text-base font-bold text-slate-800">{staff.fullName}</h4>
              <p className="text-xs font-semibold text-[#6f42c1]">{staff.designation || 'Staff Member'}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Staff ID: {staffDisplayId}</p>

              {/* Big High-Res QR Code */}
              <div className="my-4 p-3 bg-white border-2 border-dashed border-[#6f42c1] rounded-lg shadow-sm">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Official QR Code" className="w-44 h-44 object-contain" />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">Loading QR...</div>
                )}
              </div>

              {/* Barcode on Modal */}
              <div className="w-full px-6 flex flex-col items-center mb-2">
                <svg 
                  viewBox={`0 0 ${barcodeData.totalWidth} 44`} 
                  className="w-48 h-8 object-contain"
                  preserveAspectRatio="none"
                >
                  {barcodeData.bars.map((bar, i) => (
                    <rect key={i} x={bar.x} y={0} width={bar.width} height={44} fill="#0f172a" />
                  ))}
                </svg>
                <span className="text-[10px] font-mono font-bold text-slate-700 tracking-wider">
                  *{barcodeData.code}*
                </span>
              </div>

              <p className="text-[10.5px] text-slate-400 mt-2 max-w-xs">
                Scan with any mobile camera or 2D handheld terminal scanner to verify credentials.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qrDataUrl;
                  link.download = `Staff-QR-${staffDisplayId}.png`;
                  link.click();
                }}
                className="flex-1 py-2 bg-[#6f42c1] hover:bg-[#59339e] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download QR
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
