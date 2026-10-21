import React, { useState } from 'react';
import { 
  ArrowLeft, Edit, Key, QrCode
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function HRStaffProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = ['Profile', 'Payroll', 'Leaves', 'Attendance', 'Documents', 'Career', 'Appraisals', 'Audit Trail'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Staff Profile</h1>
        </div>
        <button 
          onClick={() => navigate('/hr/staff')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] rounded-none transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </button>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar Profile Summary */}
        <div className="w-full lg:w-[300px] shrink-0">
          <div className="bg-white border border-[#6f42c1] rounded-none shadow-sm overflow-hidden sticky top-6">
            
            <div className="p-6 flex flex-col items-center border-b border-slate-100">
              <div className="w-24 h-24 rounded-none border-2 border-slate-200 overflow-hidden mb-3 bg-slate-100 flex items-center justify-center">
                {/* Placeholder image */}
                <div className="text-3xl font-bold text-slate-300">A</div>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Accountant1</h2>
              <p className="text-[12px] text-slate-500">Staff</p>
            </div>
            
            <div className="p-4 space-y-2 border-b border-slate-100">
              <button 
                onClick={() => navigate(`/hr/staff/edit/${id}`)}
                className="w-full py-2 bg-[#6f42c1] hover:bg-[#59339e] text-white font-bold text-[12px] rounded-none flex justify-center items-center gap-2 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[12px] rounded-none flex justify-center items-center gap-2 transition-colors cursor-pointer">
                 Reset / Change Role
              </button>
              <button className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[12px] rounded-none flex justify-center items-center gap-2 transition-colors cursor-pointer">
                <Key className="w-3.5 h-3.5" /> Send Credentials
              </button>
            </div>

            <div className="p-4 bg-slate-50 text-[12px]">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-600">Staff ID</span>
                <span className="text-slate-500">956471</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-600">Biometric ID</span>
                <span className="text-slate-500">2023030</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-600">Role</span>
                <span className="text-blue-500 font-medium">Accountant</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-600">Designation</span>
                <span className="text-slate-500">Staff</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-600">Department</span>
                <span className="text-slate-500">Finance</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-600">Basic Salary</span>
                <span className="text-slate-500">₹0.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold text-slate-600">Date Of Joining</span>
                <span className="text-slate-500">20/03/2026</span>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  {/* barcode placeholder */}
                  <div className="h-6 w-32 bg-stripes-black border border-slate-300 opacity-50 relative overflow-hidden flex items-center px-1">
                    <div className="h-full w-0.5 bg-black ml-1"></div>
                    <div className="h-full w-1 bg-black ml-1"></div>
                    <div className="h-full w-0.5 bg-black ml-1"></div>
                    <div className="h-full w-2 bg-black ml-1"></div>
                    <div className="h-full w-1 bg-black ml-1"></div>
                    <div className="h-full w-0.5 bg-black ml-1"></div>
                    <div className="h-full w-1.5 bg-black ml-1"></div>
                  </div>
                  <span className="text-[10px] text-slate-400">956471</span>
                </div>
                <div className="w-10 h-10 border border-slate-300 flex items-center justify-center relative bg-white">
                  {/* qr placeholder */}
                  <QrCode className="w-8 h-8 text-slate-800" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto custom-scrollbar">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-[12px] font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? 'text-[#6f42c1] border-b-2 border-[#6f42c1]' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-0">
              {activeTab === 'Profile' && (
                <div className="flex flex-col text-[12px]">
                  
                  {/* Section */}
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Phone</div>
                    <div className="w-2/3 text-slate-500">6263256773</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Email</div>
                    <div className="w-2/3 text-slate-500">accountant@example.com</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Gender</div>
                    <div className="w-2/3 text-slate-500">Male</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Date of Birth</div>
                    <div className="w-2/3 text-slate-500">20/02/1995</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Marital Status</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Father Name</div>
                    <div className="w-2/3 text-slate-500">Accountant</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Mother Name</div>
                    <div className="w-2/3 text-slate-500">Accountant</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Qualification</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Work Experience</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>
                  <div className="border-b border-slate-200 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Note</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>

                  <h3 className="px-6 py-4 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200">Employment Details</h3>
                  
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Employee Code</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Employment Type</div>
                    <div className="w-2/3 text-slate-500">Full Time</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Status</div>
                    <div className="w-2/3 text-green-500 font-bold">Active</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Confirmation Date</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>
                  <div className="border-b border-slate-200 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Reporting Manager</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>

                  <h3 className="px-6 py-4 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200">Emergency Contact</h3>

                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Contact Name</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>
                  <div className="border-b border-slate-100 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Contact Phone</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>
                  <div className="border-b border-slate-200 flex py-3 px-6 hover:bg-slate-50">
                    <div className="w-1/3 font-bold text-slate-600">Blood Group</div>
                    <div className="w-2/3 text-slate-500">NA</div>
                  </div>

                  <h3 className="px-6 py-4 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200">Statutory IDs</h3>
                  <div className="flex py-6 px-6 justify-center">
                    <span className="text-slate-400 italic">No statutory details provided.</span>
                  </div>

                  <h3 className="px-6 py-4 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 border-t">Address Details</h3>
                  <div className="flex py-6 px-6 justify-center">
                    <span className="text-slate-400 italic">No address details provided.</span>
                  </div>

                  <h3 className="px-6 py-4 font-bold text-slate-800 text-[13px] bg-slate-50 border-b border-slate-200 border-t">Bank Account Details</h3>
                  <div className="flex py-6 px-6 justify-center border-b border-slate-200">
                    <span className="text-slate-400 italic">No bank details provided.</span>
                  </div>
                </div>
              )}

              {activeTab !== 'Profile' && (
                <div className="p-16 flex items-center justify-center">
                  <div className="text-slate-400 text-[14px]">Details for {activeTab} will be displayed here.</div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
