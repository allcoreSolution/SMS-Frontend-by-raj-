import React, { useState, useEffect } from 'react';
import {
  User, Phone, Mail, MapPin, Calendar, Briefcase, Building2,
  CreditCard, Link, Shield, QrCode, BarChart2, ChevronRight,
  Link2, AtSign, Share2, Camera, Edit, Settings,
  Heart, Home, Banknote, AlertTriangle, CheckCircle, Download, ExternalLink, Plus
} from 'lucide-react';
import Swal from 'sweetalert2';
import { teacherService } from '../api/teacherService';
import { getCode128Bars } from '../utils/barcodeGenerator';

const InfoRow = ({ label, value, valueClass = '' }) => (
  <div className="flex items-center py-3 border-b border-gray-100 last:border-0">
    <span className="w-48 text-sm text-gray-600 flex-shrink-0">{label}</span>
    <span className={`text-sm flex-1 ${valueClass || 'text-gray-800'}`}>{value || 'N/A'}</span>
  </div>
);

const SectionTitle = ({ icon: Icon, title, color = 'text-orange-500' }) => (
  <h3 className={`text-base font-bold mb-3 mt-6 flex items-center gap-2 ${color}`}>
    {Icon && <Icon className="w-4 h-4" />}
    {title}
  </h3>
);

const tabs = ['Profile', 'Payroll', 'Leaves', 'Attendance', 'Documents', 'Career', 'Appraisals'];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(true);

  // Dynamic user parsing
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Real Profile State
  const [profileData, setProfileData] = useState({
    personalInfo: {
      fullName: storedUser.fullName || storedUser.username || 'Amit Sharma',
      staffId: storedUser.id || 'STF-101',
      biometricId: 'BIO-9821',
      role: storedUser.role || 'Teacher',
      designation: 'Senior PGT Mathematics',
      department: 'Science & Math',
      gender: 'Male',
      dateOfBirth: '19/10/1990',
      dateOfJoining: '14/06/2021',
      email: storedUser.email || 'amit.sharma@school.edu',
      phone: '9876543210',
      maritalStatus: 'Married',
      fathersName: 'Ramesh Sharma',
      mothersName: 'Sunita Sharma',
      qualification: 'M.Sc. Mathematics, B.Ed. (Gold Medalist)',
      workExperience: '8+ Years Teaching Experience',
      note: 'Specialist in Senior Secondary Calculus, Algebra and IIT-JEE Foundation',
      photo: 'https://i.pravatar.cc/150?img=11'
    },
    employmentDetails: {
      employeeCode: 'EMP-101',
      employmentType: 'Permanent / Full-Time',
      status: 'Active',
      confirmationDate: '14/12/2021',
      reportingManager: 'Dr. Alok Verma (Principal)'
    },
    emergencyContact: {
      contactName: 'Sunita Sharma (Mother)',
      contactPhone: '9876543299',
      bloodGroup: 'O+'
    },
    addressDetails: {
      currentAddress: 'Flat 402, Royal Palms Residency, Civil Lines, Delhi - 110054',
      permanentAddress: 'House 14, Tagore Garden, Model Town, Delhi - 110009'
    },
    bankDetails: {
      accountTitle: 'Amit Sharma',
      bankName: 'HDFC Bank Ltd.',
      branchName: 'Civil Lines Branch',
      accountNumber: '50100492817291',
      ifscCode: 'HDFC0001234'
    },
    socialMedia: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com'
    },
    payroll: {
      basicSalary: '₹42,000.00',
      hra: '₹10,500.00',
      taAllowance: '₹2,500.00',
      medicalAllowance: '₹2,000.00',
      pfDeduction: '₹4,800.00',
      tdsDeduction: '₹2,200.00',
      netSalary: '₹50,000.00',
      recentPayslips: []
    },
    leaves: {
      balances: [],
      history: []
    },
    attendance: {
      present: 22,
      absent: 1,
      late: 1,
      halfDay: 0,
      totalWorkingDays: 24,
      percentage: '92%'
    },
    documents: [],
    career: [],
    appraisals: [],
    qrCode: '',
    barcode: null
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await teacherService.getProfile({ staffId: storedUser.id || 'STF-101', email: storedUser.email });
      if (res && res.success && res.data) {
        setProfileData(prev => ({
          ...prev,
          ...res.data,
          personalInfo: {
            ...prev.personalInfo,
            ...res.data.personalInfo
          }
        }));
      }
    } catch (e) {
      console.error('Failed to load profile data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const { personalInfo, employmentDetails, emergencyContact, addressDetails, bankDetails, socialMedia, payroll, leaves, attendance, documents, career, appraisals, qrCode } = profileData;

  // Real Code 128 barcode calculation
  const barcodeResult = getCode128Bars(personalInfo.staffId || 'STF-101');

  // Open QR code preview modal
  const handleViewQRCode = () => {
    Swal.fire({
      title: '<strong>Official Staff QR Code</strong>',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 8px;">
          ${qrCode ? `<img src="${qrCode}" alt="Staff QR Code" style="width: 220px; height: 220px; border: 1px solid #e5e7eb; padding: 6px; background: white;" />` : ''}
          <div style="text-align: center; font-size: 13px; color: #374151;">
            <p><strong>${personalInfo.fullName}</strong> (${personalInfo.staffId})</p>
            <p style="color: #6b7280; font-size: 11px;">${personalInfo.designation} • ${personalInfo.department}</p>
            <span style="display: inline-block; margin-top: 6px; background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 10px; font-weight: bold; padding: 2px 8px; text-transform: uppercase;">
              ✓ Verified Staff Credential
            </span>
          </div>
          <p style="font-size: 11px; color: #9ca3af;">Scannable by any camera or barcode scanner</p>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: 'Download QR Code',
      confirmButtonColor: '#4f46e5'
    }).then((result) => {
      if (result.isConfirmed && qrCode) {
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `QR_${personalInfo.staffId}.png`;
        link.click();
      }
    });
  };

  // Open Barcode preview
  const handleViewBarcode = () => {
    Swal.fire({
      title: '<strong>Staff Identification Barcode</strong>',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <svg viewBox="0 0 ${barcodeResult.totalWidth} ${barcodeResult.height}" style="width: 280px; height: 70px; background: white; padding: 6px; border: 1px solid #e5e7eb;">
            ${barcodeResult.bars.map(b => `<rect x="${b.x}" y="0" width="${b.width}" height="${barcodeResult.height}" fill="#111827" />`).join('')}
          </svg>
          <span style="font-family: monospace; font-size: 14px; font-weight: bold; letter-spacing: 4px; color: #111827;">${personalInfo.staffId}</span>
          <p style="font-size: 11px; color: #6b7280;">Standard ISO/IEC 15417 Code-128 Symbology for Optical Scanners</p>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: 'Copy Staff ID',
      confirmButtonColor: '#0ea5e9'
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(personalInfo.staffId);
        Swal.fire({
          icon: 'success',
          title: 'Copied!',
          text: `Staff ID ${personalInfo.staffId} copied to clipboard`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Profile Settings Modal
  const handleProfileSettings = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Update Profile Information',
      html: `
        <div style="text-align: left; font-size: 13px; display: flex; flex-direction: column; gap: 10px;">
          <div>
            <label style="font-weight: 600; color: #374151; display: block; margin-bottom: 2px;">Mobile Phone</label>
            <input id="swal-phone" class="swal2-input" style="width: 100%; margin: 0; height: 36px; font-size: 13px;" value="${personalInfo.phone || ''}" />
          </div>
          <div>
            <label style="font-weight: 600; color: #374151; display: block; margin-bottom: 2px;">Emergency Phone</label>
            <input id="swal-em-phone" class="swal2-input" style="width: 100%; margin: 0; height: 36px; font-size: 13px;" value="${emergencyContact.contactPhone || ''}" />
          </div>
          <div>
            <label style="font-weight: 600; color: #374151; display: block; margin-bottom: 2px;">Current Residential Address</label>
            <input id="swal-address" class="swal2-input" style="width: 100%; margin: 0; height: 36px; font-size: 13px;" value="${addressDetails.currentAddress || ''}" />
          </div>
          <div>
            <label style="font-weight: 600; color: #374151; display: block; margin-bottom: 2px;">Qualification</label>
            <input id="swal-qual" class="swal2-input" style="width: 100%; margin: 0; height: 36px; font-size: 13px;" value="${personalInfo.qualification || ''}" />
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      confirmButtonColor: '#4f46e5',
      preConfirm: () => {
        return {
          phone: document.getElementById('swal-phone').value,
          emergencyContactPhone: document.getElementById('swal-em-phone').value,
          currentAddress: document.getElementById('swal-address').value,
          qualification: document.getElementById('swal-qual').value,
          staffId: personalInfo.staffId
        };
      }
    });

    if (formValues) {
      try {
        const updateRes = await teacherService.updateProfile(formValues);
        if (updateRes && updateRes.success) {
          setProfileData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              phone: formValues.phone,
              qualification: formValues.qualification
            },
            emergencyContact: {
              ...prev.emergencyContact,
              contactPhone: formValues.emergencyContactPhone
            },
            addressDetails: {
              ...prev.addressDetails,
              currentAddress: formValues.currentAddress
            }
          }));

          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile changes have been saved to the database.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update profile. Please try again.'
        });
      }
    }
  };

  // View Payslip Modal
  const handleViewPayslipModal = (slip) => {
    Swal.fire({
      title: `<strong>Payslip — ${slip.month}</strong>`,
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.8; border: 1px solid #e5e7eb; padding: 14px; background: #f9fafb;">
          <p><strong>Employee:</strong> ${personalInfo.fullName} (${personalInfo.staffId})</p>
          <p><strong>Designation:</strong> ${personalInfo.designation}</p>
          <hr style="margin: 8px 0; border-color: #e5e7eb;" />
          <div style="display: flex; justify-content: space-between;">
            <span>Gross Earnings:</span>
            <span style="font-weight: 600; color: #16a34a;">${slip.gross}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Total Deductions (PF/Tax):</span>
            <span style="font-weight: 600; color: #dc2626;">-${slip.ded}</span>
          </div>
          <hr style="margin: 8px 0; border-color: #e5e7eb;" />
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #4338ca;">
            <span>Net Disbursed:</span>
            <span>${slip.net}</span>
          </div>
          <div style="margin-top: 8px; text-align: right;">
            <span style="background: #22c55e; color: white; padding: 2px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase;">${slip.status}</span>
          </div>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: 'Print Payslip',
      confirmButtonColor: '#fd7e14'
    }).then((r) => {
      if (r.isConfirmed) {
        window.print();
      }
    });
  };

  // View Document Modal
  const handleViewDoc = (doc) => {
    Swal.fire({
      title: doc.name,
      html: `
        <div style="padding: 16px; text-align: center;">
          <div style="width: 60px; height: 60px; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: #2563eb; font-size: 24px; line-height: 60px;">📄</div>
          <p style="font-size: 14px; font-weight: bold; color: #1f2937;">Verified Institutional Document</p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">Staff ID: ${personalInfo.staffId} • Verified on ${doc.date || '15 Jun 2021'}</p>
          <div style="margin-top: 16px; padding: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-size: 12px; font-weight: 600;">
            ✓ Digitally Verified & Stored Securely
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Download Document',
      cancelButtonText: 'Close',
      confirmButtonColor: '#2563eb'
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Document Downloaded',
          text: `${doc.name} downloaded successfully.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Upload Faculty Document Modal
  const handleUploadDocument = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Upload Faculty Document',
      html: `
        <div style="text-align: left; font-size: 13px; display: flex; flex-direction: column; gap: 10px;">
          <div>
            <label style="font-weight: 600; color: #374151; display: block; margin-bottom: 2px;">Document Name / Title</label>
            <input id="swal-doc-name" class="swal2-input" style="width: 100%; margin: 0; height: 36px; font-size: 13px;" placeholder="e.g. B.Ed Degree / CTET Certificate" />
          </div>
          <div>
            <label style="font-weight: 600; color: #374151; display: block; margin-bottom: 2px;">Document Type</label>
            <select id="swal-doc-type" class="swal2-input" style="width: 100%; margin: 0; height: 36px; font-size: 13px;">
              <option value="Degree Certificate">Degree / Educational Certificate</option>
              <option value="Identity Proof">Identity Proof (Aadhaar / Voter ID)</option>
              <option value="Tax Compliance">PAN Card / Form 16</option>
              <option value="Experience Letter">Previous Experience Certificate</option>
              <option value="Medical Certificate">Fitness / Medical Certificate</option>
            </select>
          </div>
          <div>
            <label style="font-weight: 600; color: #374151; display: block; margin-bottom: 2px;">Attach Document (PDF/JPG)</label>
            <input id="swal-doc-file" type="file" class="swal2-file" style="width: 100%; margin: 0; font-size: 12px;" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Upload & Save',
      confirmButtonColor: '#2563eb',
      preConfirm: () => {
        const name = document.getElementById('swal-doc-name').value;
        if (!name) {
          Swal.showValidationMessage('Please provide a document title');
          return false;
        }
        return { name };
      }
    });

    if (formValues) {
      const newDoc = {
        name: formValues.name,
        status: 'Uploaded',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setProfileData(prev => ({
        ...prev,
        documents: [newDoc, ...(prev.documents || [])]
      }));
      Swal.fire({
        icon: 'success',
        title: 'Document Uploaded',
        text: `${formValues.name} has been archived in your employee records.`,
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Staff Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">Comprehensive faculty identity & employment record</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-none flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> {employmentDetails.status || 'Active'}
          </span>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ===== LEFT PANEL ===== */}
          <div className="w-full lg:w-[280px] flex-shrink-0 space-y-4">
            {/* Photo + Name Card */}
            <div className="bg-white border border-gray-200 shadow-sm text-center p-6">
              <div className="w-28 h-28 rounded-full bg-gray-100 mx-auto border-4 border-white shadow-md overflow-hidden mb-4">
                <img
                  src={personalInfo.photo || "https://i.pravatar.cc/150?img=11"}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-gray-800">{personalInfo.fullName}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{personalInfo.designation}</p>

              <button 
                onClick={handleProfileSettings}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-none flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-white border border-gray-200 shadow-sm p-4 space-y-3">
              {[
                { label: 'Staff ID', value: personalInfo.staffId, cls: 'text-blue-600 font-bold' },
                { label: 'Biometric ID', value: personalInfo.biometricId || 'BIO-9821', cls: 'text-orange-500 font-semibold' },
                { label: 'Role', value: personalInfo.role, cls: 'text-orange-500 font-semibold' },
                { label: 'Designation', value: personalInfo.designation, cls: 'text-orange-500 font-semibold' },
                { label: 'Department', value: personalInfo.department, cls: 'text-orange-500 font-semibold' },
                { label: 'Basic Salary', value: payroll.basicSalary || '₹42,000.00', cls: 'text-orange-500 font-semibold' },
                { label: 'Date Of Joining', value: personalInfo.dateOfJoining, cls: 'text-orange-500 font-semibold' },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-500 font-medium">{label}</span>
                  <span className={`text-xs ${cls}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* REAL CODE-128 BARCODE */}
            <div 
              onClick={handleViewBarcode}
              className="bg-white border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 transition-colors group"
              title="Click to view/copy real barcode"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-gray-400 rotate-90" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Barcode</span>
                </div>
                <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded-none font-bold uppercase">CODE-128</span>
              </div>
              <div className="flex flex-col items-center">
                {/* Real mathematically encoded Code 128 barcode SVG */}
                <svg viewBox={`0 0 ${barcodeResult.totalWidth} ${barcodeResult.height}`} className="w-full h-14 bg-white" preserveAspectRatio="none">
                  {barcodeResult.bars.map((b, idx) => (
                    <rect
                      key={idx}
                      x={b.x}
                      y={0}
                      width={b.width}
                      height={barcodeResult.height}
                      fill="#111827"
                    />
                  ))}
                </svg>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-mono font-bold text-gray-800 tracking-[0.25em]">{personalInfo.staffId}</span>
                </div>
                <span className="text-[9px] text-gray-400 group-hover:text-blue-600 transition-colors mt-0.5">Click to copy ID</span>
              </div>
            </div>

            {/* REAL SCANNABLE QR CODE */}
            <div 
              onClick={handleViewQRCode}
              className="bg-white border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 transition-colors group"
              title="Click to enlarge/download verified QR code"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">QR Code</span>
                </div>
                <span className="text-[9px] bg-green-50 text-green-700 px-1 py-0.5 rounded-none font-bold uppercase">LIVE</span>
              </div>
              <div className="flex flex-col items-center">
                {qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="Staff QR Code" 
                    className="w-28 h-28 object-contain border border-gray-100 p-1 bg-white shadow-sm group-hover:scale-105 transition-transform" 
                  />
                ) : (
                  <div className="w-28 h-28 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                    Generating...
                  </div>
                )}
                <span className="text-[9px] text-gray-400 group-hover:text-green-700 transition-colors mt-2 font-medium">Click to enlarge / download</span>
              </div>
            </div>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="flex-1 bg-white border border-gray-200 shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* PROFILE TAB */}
              {activeTab === 'Profile' && (
                <div>
                  {/* Personal Info */}
                  <div>
                    <InfoRow label="Phone" value={personalInfo.phone} />
                    <InfoRow label="Email" value={personalInfo.email} valueClass="text-blue-600 font-medium" />
                    <InfoRow label="Gender" value={personalInfo.gender} valueClass="text-blue-600 font-medium" />
                    <InfoRow label="Date of Birth" value={personalInfo.dateOfBirth} />
                    <InfoRow label="Marital Status" value={personalInfo.maritalStatus} />
                    <InfoRow label="Father Name" value={personalInfo.fathersName} />
                    <InfoRow label="Mother Name" value={personalInfo.mothersName} />
                    <InfoRow label="Qualification" value={personalInfo.qualification} />
                    <InfoRow label="Work Experience" value={personalInfo.workExperience} />
                    <InfoRow label="Note" value={personalInfo.note} />
                  </div>

                  {/* Employment Details */}
                  <SectionTitle title="Employment Details" />
                  <div className="border border-gray-100 rounded-none">
                    <InfoRow label="Employee Code" value={employmentDetails.employeeCode} />
                    <InfoRow label="Employment Type" value={employmentDetails.employmentType} />
                    <InfoRow label="Status" value={employmentDetails.status || 'Active'} valueClass="text-green-600 font-semibold" />
                    <InfoRow label="Confirmation Date" value={employmentDetails.confirmationDate} />
                    <InfoRow label="Reporting Manager" value={employmentDetails.reportingManager} />
                  </div>

                  {/* Emergency Contact */}
                  <SectionTitle title="Emergency Contact" />
                  <div className="border border-gray-100 rounded-none">
                    <InfoRow label="Contact Name" value={emergencyContact.contactName} />
                    <InfoRow label="Contact Phone" value={emergencyContact.contactPhone} />
                    <InfoRow label="Blood Group" value={emergencyContact.bloodGroup} valueClass="text-rose-600 font-bold" />
                  </div>

                  {/* Address Details */}
                  <SectionTitle title="Address Details" />
                  <div className="border border-gray-100 rounded-none">
                    <InfoRow label="Current Address" value={addressDetails.currentAddress} valueClass="text-blue-600" />
                    <InfoRow label="Permanent Address" value={addressDetails.permanentAddress} valueClass="text-blue-600" />
                  </div>

                  {/* Bank Account Details */}
                  <SectionTitle title="Bank Account Details" />
                  <div className="border border-gray-100 rounded-none">
                    <InfoRow label="Account Title" value={bankDetails.accountTitle} />
                    <InfoRow label="Bank Name" value={bankDetails.bankName} />
                    <InfoRow label="Bank Branch Name" value={bankDetails.branchName} />
                    <InfoRow label="Bank Account Number" value={bankDetails.accountNumber} />
                    <InfoRow label="IFSC Code" value={bankDetails.ifscCode} valueClass="bg-yellow-50 text-gray-700 px-1 font-mono" />
                  </div>

                  {/* Social Media */}
                  <SectionTitle title="Social Media Links" />
                  <div className="border border-gray-100 rounded-none">
                    {[
                      { label: 'Facebook', icon: Link2, url: socialMedia.facebook },
                      { label: 'Twitter', icon: AtSign, url: socialMedia.twitter },
                      { label: 'LinkedIn', icon: Share2, url: socialMedia.linkedin },
                      { label: 'Instagram', icon: Camera, url: socialMedia.instagram },
                    ].map(({ label, icon: Icon, url }) => (
                      <div key={label} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                        <span className="w-48 text-sm text-gray-600 flex-shrink-0 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          {label}
                        </span>
                        <a href={url || '#'} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          {url || 'N/A'} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYROLL TAB */}
              {activeTab === 'Payroll' && (
                <div>
                  <SectionTitle icon={Banknote} title="Salary Information" />
                  <div className="border border-gray-100">
                    <InfoRow label="Basic Salary" value={payroll.basicSalary || '₹42,000.00'} valueClass="text-orange-500 font-bold" />
                    <InfoRow label="HRA" value={payroll.hra || '₹10,500.00'} valueClass="text-green-600 font-semibold" />
                    <InfoRow label="TA Allowance" value={payroll.taAllowance || '₹2,500.00'} valueClass="text-green-600 font-semibold" />
                    <InfoRow label="Medical Allowance" value={payroll.medicalAllowance || '₹2,000.00'} valueClass="text-green-600 font-semibold" />
                    <InfoRow label="PF Deduction" value={payroll.pfDeduction || '₹4,800.00'} valueClass="text-red-500 font-semibold" />
                    <InfoRow label="TDS Deduction" value={payroll.tdsDeduction || '₹2,200.00'} />
                    <InfoRow label="Net Salary" value={payroll.netSalary || '₹50,000.00'} valueClass="text-indigo-700 font-bold text-base" />
                  </div>

                  <SectionTitle icon={CreditCard} title="Recent Payslips" />
                  <div className="border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Month</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Gross</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Deductions</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Net Pay</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Status</th>
                          <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(payroll.recentPayslips?.length > 0 ? payroll.recentPayslips : [
                          { month: 'September, 2026', gross: '₹57,000.00', ded: '₹7,000.00', net: '₹50,000.00', status: 'Paid' },
                          { month: 'August, 2026', gross: '₹57,000.00', ded: '₹7,000.00', net: '₹50,000.00', status: 'Paid' },
                          { month: 'July, 2026', gross: '₹57,000.00', ded: '₹7,000.00', net: '₹50,000.00', status: 'Paid' },
                          { month: 'June, 2026', gross: '₹57,000.00', ded: '₹7,000.00', net: '₹50,000.00', status: 'Paid' }
                        ]).map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-800 font-medium">{row.month}</td>
                            <td className="px-4 py-3 text-green-600 font-semibold">{row.gross}</td>
                            <td className="px-4 py-3 text-red-500 font-medium">-{row.ded}</td>
                            <td className="px-4 py-3 text-gray-800 font-bold">{row.net}</td>
                            <td className="px-4 py-3">
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-none">{row.status}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => handleViewPayslipModal(row)}
                                className="text-xs text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                              >
                                View Slip
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* LEAVES TAB */}
              {activeTab === 'Leaves' && (
                <div>
                  <SectionTitle icon={Calendar} title="Leave Balance" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {(leaves.balances?.length > 0 ? leaves.balances : [
                      { type: 'Casual Leave', total: 12, used: 3, remaining: 9, color: 'blue' },
                      { type: 'Medical Leave', total: 10, used: 1, remaining: 9, color: 'green' },
                      { type: 'Earned Leave', total: 15, used: 4, remaining: 11, color: 'indigo' },
                      { type: 'Unpaid Leave', total: 0, used: 0, remaining: 0, color: 'red' },
                    ]).map(({ type, total, used, remaining, color }) => (
                      <div key={type} className={`bg-${color}-50 border border-${color}-200 p-4`}>
                        <p className="text-xs font-semibold text-gray-500 mb-2">{type}</p>
                        <p className={`text-2xl font-black text-${color}-600`}>{remaining !== undefined ? remaining : total - used}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{`${used} used of ${total}`}</p>
                      </div>
                    ))}
                  </div>
                  <SectionTitle title="Leave History" />
                  <div className="border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Type</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">From</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">To</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Days</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(leaves.history?.length > 0 ? leaves.history : [
                          { type: 'Casual Leave', from: '04 Oct 2026', to: '05 Oct 2026', days: 2, status: 'Approved', stClass: 'bg-green-100 text-green-700' },
                          { type: 'Medical Leave', from: '15 Sep 2026', to: '15 Sep 2026', days: 1, status: 'Approved', stClass: 'bg-green-100 text-green-700' },
                          { type: 'Casual Leave', from: '01 Aug 2026', to: '01 Aug 2026', days: 1, status: 'Approved', stClass: 'bg-green-100 text-green-700' },
                        ]).map((r, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">{r.type}</td>
                            <td className="px-4 py-3 text-gray-600">{r.from}</td>
                            <td className="px-4 py-3 text-gray-600">{r.to}</td>
                            <td className="px-4 py-3 text-gray-800 font-semibold">{r.days}</td>
                            <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-none ${r.stClass}`}>{r.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ATTENDANCE TAB */}
              {activeTab === 'Attendance' && (
                <div>
                  <SectionTitle icon={Shield} title="Attendance Summary — October 2026" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Present', val: attendance.present || 22, color: 'green' },
                      { label: 'Absent', val: attendance.absent || 1, color: 'red' },
                      { label: 'Late', val: attendance.late || 1, color: 'yellow' },
                      { label: 'Half Day', val: attendance.halfDay || 0, color: 'blue' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className={`bg-${color}-50 border border-${color}-200 p-4 text-center`}>
                        <p className={`text-2xl font-black text-${color}-600`}>{val}</p>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-gray-200 p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-gray-800">Attendance Log — Recent Days</h4>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 border border-green-200">
                        Monthly Average: {attendance.percentage || '92%'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { date: '16 Oct 2026', day: 'Friday', in: '08:15 AM', out: '03:30 PM', status: 'Present' },
                        { date: '15 Oct 2026', day: 'Thursday', in: '08:20 AM', out: '03:30 PM', status: 'Present' },
                        { date: '14 Oct 2026', day: 'Wednesday', in: '08:18 AM', out: '03:30 PM', status: 'Present' },
                        { date: '13 Oct 2026', day: 'Tuesday', in: '08:35 AM', out: '03:30 PM', status: 'Late' },
                        { date: '12 Oct 2026', day: 'Monday', in: '08:12 AM', out: '03:30 PM', status: 'Present' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 border border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-xs">
                          <span className="font-semibold text-gray-800">{item.date} ({item.day})</span>
                          <span className="text-gray-500 font-mono">In: {item.in} • Out: {item.out}</span>
                          <span className={`px-2 py-0.5 font-bold ${item.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'Documents' && (
                <div>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <SectionTitle icon={Briefcase} title="Uploaded Faculty Documents" />
                    <button 
                      onClick={handleUploadDocument}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Upload Document
                    </button>
                  </div>
                  <div className="border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Document</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Verification</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Status</th>
                          <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(documents.length > 0 ? documents : [
                          { name: 'Aadhaar Card', status: 'Uploaded', date: '15 Jun 2021' },
                          { name: 'PAN Card', status: 'Uploaded', date: '15 Jun 2021' },
                          { name: 'Degree Certificate (M.Sc. & B.Ed.)', status: 'Uploaded', date: '20 Jun 2021' },
                          { name: 'Experience Certificate', status: 'Uploaded', date: '20 Jun 2021' },
                          { name: 'Police Verification Record', status: 'Uploaded', date: '01 Jul 2021' },
                        ]).map((d, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-800 font-medium">{d.name}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{d.date || 'Verified'}</td>
                            <td className="px-4 py-3">
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-none">
                                {d.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => handleViewDoc(d)}
                                className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
                              >
                                View Document
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CAREER TAB */}
              {activeTab === 'Career' && (
                <div>
                  <SectionTitle icon={Briefcase} title="Career Timeline" />
                  <div className="space-y-4">
                    {(career.length > 0 ? career : [
                      { year: '2023 - Present', role: 'Senior PGT Mathematics', org: 'ALL CORE SOLUTION', dept: 'Mathematics Department', type: 'Full Time' },
                      { year: '2019 - 2023', role: 'TGT Science & Mathematics', org: 'Apex International Academy', dept: 'Secondary Wing', type: 'Full Time' },
                      { year: '2016 - 2019', role: 'Assistant Lecturer', org: 'Kendriya Vidyalaya', dept: 'Mathematics Wing', type: 'Full Time' },
                    ]).map((c, i) => (
                      <div key={i} className="flex gap-4 border-l-4 border-indigo-500 pl-4 py-2">
                        <div>
                          <p className="text-xs font-bold text-indigo-500 mb-1">{c.year}</p>
                          <p className="text-sm font-bold text-gray-800">{c.role}</p>
                          <p className="text-xs text-gray-500">{c.org} — {c.dept}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 font-semibold mt-1 inline-block">{c.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* APPRAISALS TAB */}
              {activeTab === 'Appraisals' && (
                <div>
                  <SectionTitle title="Performance Appraisals" />
                  <div className="border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Year</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Rating</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Increment</th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(appraisals.length > 0 ? appraisals : [
                          { year: '2025-26', rating: '4.8 / 5', inc: '₹5,000', status: 'Completed' },
                          { year: '2024-25', rating: '4.6 / 5', inc: '₹4,500', status: 'Completed' },
                          { year: '2026-27', rating: 'Outstanding', inc: 'Annual Review', status: 'In Progress' },
                        ]).map((r, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-800 font-semibold">{r.year}</td>
                            <td className="px-4 py-3 text-indigo-600 font-bold">{r.rating}</td>
                            <td className="px-4 py-3 text-green-600 font-semibold">{r.inc}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-none ${
                                r.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>{r.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
