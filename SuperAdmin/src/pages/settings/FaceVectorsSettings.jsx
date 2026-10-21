import React, { useState, useMemo } from 'react';
import {
  Lock, Camera, Users, CheckCircle2, AlertTriangle, Cpu, X,
  ArrowLeft, Search, RefreshCw, Trash2, Sparkles, Check, Send, Download, ShieldCheck, UserCheck, Play, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SettingsLayout from '../../components/SettingsLayout';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';



const INITIAL_USERS_DATA = {
  sch_1: [
    { id: 'u101', name: 'Aarav Sharma', role: 'Student', details: 'Grade 10-A · Roll #12', enrolled: true, model: 'FaceNet 512d v2.4', quality: 98.8, date: '2026-08-20', avatar: '👨‍🎓' },
    { id: 'u102', name: 'Priya Verma', role: 'Student', details: 'Grade 12-B · Roll #05', enrolled: true, model: 'FaceNet 512d v2.4', quality: 99.2, date: '2026-08-22', avatar: '👩‍🎓' },
    { id: 'u103', name: 'Dr. Rajesh Gupta', role: 'Teacher', details: 'Senior HOD Science', enrolled: true, model: 'ArcFace ResNet50', quality: 97.5, date: '2026-08-15', avatar: '👨‍🏫' },
    { id: 'u104', name: 'Ramesh Kumar', role: 'Driver', details: 'Bus Route #04 (DL-01-AB-1234)', enrolled: true, model: 'FaceNet 512d v2.4', quality: 96.1, date: '2026-08-18', avatar: '👨‍✈️' },
    { id: 'u105', name: 'Ananya Roy', role: 'Student', details: 'Grade 9-C · Roll #24', enrolled: false, model: '-', quality: 0, date: '-', avatar: '👩' },
    { id: 'u106', name: 'Siddharth Nair', role: 'Student', details: 'Grade 11-A · Roll #18', enrolled: false, model: '-', quality: 0, date: '-', avatar: '👦' },
  ],
  sch_2: [
    { id: 'u201', name: 'Vikramaditya Singh', role: 'Student', details: 'Grade 11-C · Roll #02', enrolled: true, model: 'FaceNet 512d v2.4', quality: 98.4, date: '2026-08-21', avatar: '👦' },
    { id: 'u202', name: 'Meera Deshmukh', role: 'Teacher', details: 'Mathematics Faculty', enrolled: true, model: 'ArcFace ResNet50', quality: 97.9, date: '2026-08-19', avatar: '👩‍🏫' },
    { id: 'u203', name: 'Suresh Patil', role: 'Staff', details: 'Security Chief (Gate 1)', enrolled: true, model: 'FaceNet 512d v2.4', quality: 96.7, date: '2026-08-14', avatar: '👮' },
    { id: 'u204', name: 'Rohan Mehta', role: 'Student', details: 'Grade 8-B · Roll #14', enrolled: false, model: '-', quality: 0, date: '-', avatar: '🧑' },
  ],
  sch_3: [
    { id: 'u301', name: 'Kavya Reddy', role: 'Student', details: 'Grade 10-B · Roll #09', enrolled: true, model: 'FaceNet 512d v2.4', quality: 99.1, date: '2026-08-25', avatar: '👧' },
    { id: 'u302', name: 'Amitabh Sen', role: 'Teacher', details: 'Physics Department', enrolled: true, model: 'ArcFace ResNet50', quality: 98.0, date: '2026-08-12', avatar: '👨‍🏫' },
  ],
  sch_4: [
    { id: 'u401', name: 'Diya Menon', role: 'Student', details: 'Grade 7-A · Roll #07', enrolled: true, model: 'FaceNet 512d v2.4', quality: 97.8, date: '2026-08-23', avatar: '👩' },
    { id: 'u402', name: 'Ganesh Bhatt', role: 'Driver', details: 'Bus Route #12', enrolled: true, model: 'FaceNet 512d v2.4', quality: 95.9, date: '2026-08-10', avatar: '👨‍✈️' },
  ]
};

export default function FaceVectorsSettings({ inSettingsCenter = false }) {
  const navigate = useNavigate();
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [schoolsList, setSchoolsList] = useState([]);

  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await tenantService.getTenants();
        const mapped = toArray(res).map(t => ({
          id: t._id,
          name: t.schoolName,
          city: t.address || 'N/A',
          enrolledCount: 0,
          totalUsers: 0
        }));
        setSchoolsList(mapped);
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    };
    fetchSchools();
  }, []);

  const [usersData, setUsersData] = useState(() => {
    const saved = localStorage.getItem('superadmin_face_vectors');
    return saved ? JSON.parse(saved) : INITIAL_USERS_DATA;
  });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Camera / Scanner Modal State
  const [scanningUser, setScanningUser] = useState(null);
  const [scanStep, setScanStep] = useState(0); // 0: preview, 1: scanning/mesh, 2: success
  const [scanProgress, setScanProgress] = useState(0);

  // Sync Action toast state
  const [syncToast, setSyncToast] = useState(false);

  const selectedSchool = schoolsList.find(s => s.id === selectedSchoolId);

  // Users for current school
  const currentSchoolUsers = useMemo(() => {
    if (!selectedSchoolId) return [];
    return usersData[selectedSchoolId] || [];
  }, [selectedSchoolId, usersData]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return currentSchoolUsers.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.details.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [currentSchoolUsers, search, roleFilter]);

  // Save state to LocalStorage
  const updateAndSaveData = (newData) => {
    setUsersData(newData);
    localStorage.setItem('superadmin_face_vectors', JSON.stringify(newData));
  };

  // Start Camera Capture Simulation
  const handleStartScan = (user) => {
    setScanningUser(user);
    setScanStep(0);
    setScanProgress(0);
  };

  const handleRunAiScanner = () => {
    setScanStep(1);
    setScanProgress(15);
    const intervalRef = { id: null };
    intervalRef.id = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.id);
          setScanStep(2);
          if (scanningUser && selectedSchoolId) {
            setUsersData(prevData => {
              const updatedSchoolUsers = (prevData[selectedSchoolId] || []).map(u => {
                if (u.id === scanningUser.id) {
                  return { ...u, enrolled: true, model: 'FaceNet 512d v2.4', quality: 98.9, date: new Date().toISOString().split('T')[0] };
                }
                return u;
              });
              const newData = { ...prevData, [selectedSchoolId]: updatedSchoolUsers };
              localStorage.setItem('superadmin_face_vectors', JSON.stringify(newData));
              return newData;
            });
          }
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Delete Face Vector
  const handleDeleteVector = (userId) => {
    if (!selectedSchoolId) return;
    const updatedSchoolUsers = usersData[selectedSchoolId].map(u => {
      if (u.id === userId) {
        return { ...u, enrolled: false, model: '-', quality: 0, date: '-' };
      }
      return u;
    });
    updateAndSaveData({ ...usersData, [selectedSchoolId]: updatedSchoolUsers });
  };

  const handleSyncEdgeDevices = () => {
    setSyncToast(true);
    Swal.fire({
      icon: 'success',
      title: 'Sync Initiated',
      text: 'AI Biometric Camera Sync Initiated! 512-d embeddings pushed to edge hardware nodes.',
      timer: 2000,
      showConfirmButton: false
    });
    setTimeout(() => setSyncToast(false), 2500);
  };

  const handleExportExcel = () => {
    const schoolName = selectedSchool ? selectedSchool.name : 'All Schools';
    const headers = ['User ID', 'Name', 'Role', 'Details', 'Enrolled Status', 'Model', 'Vector Quality (%)', 'Enrollment Date'];
    const rows = filteredUsers.map(u => [
      `"${u.id}"`,
      `"${u.name}"`,
      `"${u.role}"`,
      `"${u.details}"`,
      `"${u.enrolled ? 'Enrolled' : 'Not Enrolled'}"`,
      `"${u.model}"`,
      `"${u.quality}"`,
      `"${u.date}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `face_vectors_${schoolName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mainContent = (
    <div className="flex flex-col h-full bg-[#f8fafc] text-gray-800 font-sans overflow-hidden">
        
        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1150px] w-full mx-auto space-y-6">
          
          {/* Header Title + Back Button (Matching screenshot) */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none-none bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <Camera className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Face Vector Management
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2 rounded-none-none text-xs font-black transition-all shadow-xs shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Excel / CSV
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 rounded-none-none bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500" /> Back to Settings
              </button>
            </div>
          </div>



          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total System Users', value: '4,786', icon: <Users className="w-5 h-5 text-sky-500" /> },
              { label: 'Faces Enrolled', value: '11', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
              { label: 'Pending Enrollment', value: '4,775', icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
              { label: 'AI Vector Engine', value: 'Online Node.JS', icon: <span className="font-mono font-bold text-slate-500 text-xs">AI</span>, isTag: true }
            ].map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-none-none p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                  <div className="w-10 h-10 rounded-none-none bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm">
                    {s.icon}
                  </div>
                </div>
                {s.isTag ? (
                  <div className="mt-2">
                    <span className="px-2.5 py-1 rounded-none-none text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> {s.value}
                    </span>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Main Card: Select School Section */}
          <div className="bg-white border border-gray-200/90 rounded-none-none shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center gap-2">
              <span className="text-lg">🏢</span>
              <h2 className="text-sm font-black text-gray-900">Select School</h2>
            </div>

            <div className="p-6">
              <select
                value={selectedSchoolId}
                onChange={e => setSelectedSchoolId(e.target.value)}
                className="w-full border-2 border-orange-400 rounded-none-none px-4 py-3 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer shadow-xs"
              >
                <option value="">— Select a School to manage —</option>
                {schoolsList.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name} ({school.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render Users Table when a school is selected */}
          {selectedSchoolId && (
            <div className="bg-white border border-gray-200/90 rounded-none-none shadow-xs overflow-hidden animate-in fade-in duration-300">
              
              {/* School Header Sub-bar */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 via-white to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    {selectedSchool?.name}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {selectedSchool?.city} · {currentSchoolUsers.filter(u => u.enrolled).length} of {currentSchoolUsers.length} Users Enrolled
                  </p>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={handleSyncEdgeDevices}
                    className="px-3.5 py-2 rounded-none-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sync AI Edge Cameras
                  </button>

                  <button
                    onClick={() => setSyncToast(true)}
                    className="px-3.5 py-2 rounded-none-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Registration Link
                  </button>
                </div>
              </div>

              {/* Sync Toast Alert */}
              {syncToast && (
                <div className="mx-6 mt-4 p-3 rounded-none-none bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Biometric Camera Sync Initiated! 512-d embeddings pushed to edge hardware nodes.</span>
                </div>
              )}

              {/* Filter Controls Bar */}
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by student or staff name..."
                    className="w-full pl-10 pr-3 py-1.5 border border-gray-200 rounded-none-none text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {['All', 'Student', 'Teacher', 'Driver', 'Staff'].map(role => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1 rounded-none-none text-xs font-bold transition-all ${
                        roleFilter === role
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Vector Table */}
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
                  <thead className="bg-slate-50 border-b border-slate-300">
                    <tr>
                      <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">User</th>
                      <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Role & Details</th>
                      <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Vector Status</th>
                      <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">AI Model & Quality</th>
                      <th className="text-right px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-gray-400 font-medium">
                          No users found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                          
                          {/* User Avatar + Name */}
                          <td className="px-3 py-2.5 align-middle border-x border-slate-200 font-bold text-gray-900 w-[25%]">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-none-none bg-gray-100 border border-gray-200 text-lg flex items-center justify-center flex-shrink-0 shadow-xs relative">
                                {user.avatar}
                                {user.enrolled && (
                                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-none-none bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <span className="font-extrabold text-[13px]">{user.name}</span>
                            </div>
                          </td>

                          {/* Role & Details */}
                          <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                            <span className="px-2 py-0.5 rounded-none-none text-[10px] font-black bg-blue-100 text-blue-700 mr-2 uppercase tracking-widest">
                              {user.role}
                            </span>
                            <span className="text-gray-500 font-medium text-[12px]">{user.details}</span>
                          </td>

                          {/* Vector Status Badge */}
                          <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                            {user.enrolled ? (
                              <span className="px-2.5 py-1 rounded-none-none text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1 uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Enrolled (512-d)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-none-none text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 inline-flex items-center gap-1 uppercase tracking-widest">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Pending Enrollment
                              </span>
                            )}
                          </td>

                          {/* AI Model & Quality */}
                          <td className="px-3 py-2.5 align-middle border-x border-slate-200 w-[20%]">
                            {user.enrolled ? (
                              <div>
                                <span className="font-bold text-gray-800 text-[12px]">{user.model}</span>
                                <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5 uppercase tracking-widest">
                                  {user.quality}% Match Quality
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 font-mono">-</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-right space-x-2">
                            <button
                              onClick={() => handleStartScan(user)}
                              className="px-3 py-1 rounded-none-none bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-xs transition-all inline-flex items-center gap-1 cursor-pointer text-[12px]"
                            >
                              <Camera className="w-3 h-3" /> {user.enrolled ? 'Re-scan' : 'Capture'}
                            </button>

                            {user.enrolled && (
                              <button
                                onClick={() => handleDeleteVector(user.id)}
                                className="px-2.5 py-1 rounded-none-none bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

        {/* AI Camera Face Scanner Simulation Modal */}
        {scanningUser && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-[1150px] bg-slate-900 text-white rounded-none-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-800">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Camera className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-black text-white">AI Face Vector Enrollment</h3>
                </div>
                <button onClick={() => setScanningUser(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Viewport Simulation Container */}
              <div className="p-6 text-center space-y-4">
                
                <div className="w-48 h-48 rounded-none-none border-4 border-sky-500/80 mx-auto relative overflow-hidden bg-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/10">
                  {/* Avatar Icon */}
                  <span className="text-6xl animate-pulse">{scanningUser.avatar}</span>

                  {/* Face Mesh Overlay simulation */}
                  {scanStep === 1 && (
                    <div className="absolute inset-0 bg-sky-500/10 flex items-center justify-center border-2 border-dashed border-sky-400 rounded-none-none animate-ping">
                      <div className="w-36 h-36 border border-emerald-400/80 rounded-none-none" />
                    </div>
                  )}

                  {scanStep === 2 && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-4xl font-black">
                      <CheckCircle2 className="w-16 h-16 animate-bounce" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-black text-white">{scanningUser.name}</h4>
                  <p className="text-xs font-semibold text-slate-400">{scanningUser.details}</p>
                </div>

                {/* Progress Bar */}
                {scanStep === 1 && (
                  <div className="space-y-2">
                    <div className="w-full bg-slate-800 rounded-none-none h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                    <p className="text-[11px] font-mono text-sky-400">Computing 512-D Facial Landmarks Embedding... {scanProgress}%</p>
                  </div>
                )}

                {scanStep === 2 && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-none-none text-xs font-bold">
                    ✨ Face Vector Enrolled Successfully! (512-Dimensional Embedding Saved)
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3">
                  {scanStep === 0 && (
                    <button
                      onClick={handleRunAiScanner}
                      className="w-full py-3 rounded-none-none bg-sky-500 hover:bg-sky-600 text-white text-xs font-black shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start AI Face Recognition Scan
                    </button>
                  )}

                  {scanStep === 2 && (
                    <button
                      onClick={() => setScanningUser(null)}
                      className="w-full py-3 rounded-none-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      Done & Close
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
  );

  if (inSettingsCenter) {
    return <SettingsLayout activeTab="face-vectors">{mainContent}</SettingsLayout>;
  }

  return mainContent;
}
