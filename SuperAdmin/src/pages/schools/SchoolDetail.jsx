import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Users, CreditCard, CheckCircle, XCircle, Clock,
  Mail, Phone, Globe, MapPin, Calendar, Edit, Trash2, TrendingUp,
  BookOpen, UserCheck, AlertTriangle, X, Save
} from 'lucide-react';
import { tenantService } from '../../api/tenantService';

const planColors = { Premium: 'bg-purple-100 text-purple-700', Standard: 'bg-blue-100 text-blue-700', Basic: 'bg-gray-100 text-gray-600' };

const StatusBadge = ({ status }) => {
  if (status === 'Active') return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-none text-sm font-semibold"><CheckCircle className="w-4 h-4" />Active</span>;
  if (status === 'Inactive') return <span className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1 rounded-none text-sm font-semibold"><XCircle className="w-4 h-4" />Inactive</span>;
  return <span className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-none text-sm font-semibold"><Clock className="w-4 h-4" />Pending</span>;
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 bg-orange-50 rounded-none flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-orange-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-semibold">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const recentActivity = [
  { action: 'Fee collected', detail: '₹12,500 from 25 students', time: '2 hours ago', color: 'bg-green-400' },
  { action: 'New student added', detail: 'Aryan Sharma — Class 5A', time: '5 hours ago', color: 'bg-blue-400' },
  { action: 'Attendance marked', detail: '94% present today', time: '8 hours ago', color: 'bg-orange-400' },
  { action: 'Support ticket raised', detail: 'Report card issue', time: '1 day ago', color: 'bg-red-400' },
  { action: 'Staff login', detail: 'Teacher Priya logged in', time: '1 day ago', color: 'bg-purple-400' },
];

export default function SchoolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchSchoolData();
  }, [id]);

  const fetchSchoolData = async () => {
    try {
      const res = await tenantService.getTenantById(id);
      if (res.data) {
        // Map backend schema to UI expectations
        const s = res.data;
        const mapped = {
          id: s._id,
          name: s.schoolName,
          email: s.email,
          phone: s.phone || 'N/A',
          city: s.city || 'Unknown',
          state: s.state || 'Unknown',
          address: s.address || 'Not Provided',
          website: 'N/A',
          plan: s.plan || 'Basic',
          status: s.status,
          established: 'N/A',
          joined: new Date(s.createdAt).toLocaleDateString(),
          adminName: s.adminName || 'Admin',
          
          students: s.studentsCount || 0,
          branches: 1,
          staff: 0,
          revenue: '₹0',
          lastPayment: 'Pending'
        };
        setSchool(mapped);
        setEditData(mapped);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-gray-500 font-bold">Loading school details...</div>;
  }

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-6xl mb-4">🏫</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">School Not Found</h2>
        <p className="text-gray-400 text-sm mb-4">The school you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/schools')} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-none text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Schools
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: school.students.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Branches', value: school.branches, icon: Building2, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Staff Members', value: school.staff, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Monthly Revenue', value: school.revenue, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/schools')} className="p-2 hover:bg-gray-100 rounded-none transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
              {school.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{school.name}</h1>
              <p className="text-sm text-gray-500">{school.city}, {school.state}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={school.status} />
          <span className={`px-3 py-1 rounded-none text-sm font-semibold ${planColors[school.plan]}`}>{school.plan}</span>
          <button onClick={() => { setEditData({ ...school }); setShowEdit(true); }}
            className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-none text-sm font-semibold">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 border border-red-100 hover:bg-red-50 text-red-500 px-4 py-2 rounded-none text-sm font-semibold">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-none ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-2">School Information</h3>
            <InfoRow icon={Mail} label="Email" value={school.email} />
            <InfoRow icon={Phone} label="Phone" value={school.phone} />
            <InfoRow icon={Globe} label="Website" value={school.website} />
            <InfoRow icon={MapPin} label="Address" value={`${school.address}, ${school.state}`} />
            <InfoRow icon={Calendar} label="Established" value={school.established} />
            <InfoRow icon={Calendar} label="Joined Platform" value={school.joined} />
          </div>

          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Admin Account</h3>
            <InfoRow icon={UserCheck} label="Admin Name" value={school.adminName} />
            <InfoRow icon={Mail} label="Admin Email" value={school.email} />
            <InfoRow icon={Phone} label="Admin Phone" value={school.phone} />
          </div>

          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Subscription Details</h3>
            <InfoRow icon={CreditCard} label="Current Plan" value={school.plan} />
            <InfoRow icon={TrendingUp} label="Monthly Revenue" value={school.revenue} />
            <InfoRow icon={Calendar} label="Last Payment" value={school.lastPayment} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Send Email', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                { label: 'Send SMS', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
                { label: 'View Payments', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
                { label: 'View Support Tickets', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
                { label: 'Suspend School', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
              ].map((a, i) => (
                <button key={i} className={`w-full text-left px-4 py-2.5 rounded-none text-sm font-semibold transition-colors ${a.color}`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-none mt-1.5 flex-shrink-0 ${a.color}`} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{a.action}</p>
                    <p className="text-xs text-gray-500">{a.detail}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-800">Edit School</h2>
              <button onClick={() => setShowEdit(false)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                { label: 'School Name', key: 'name' }, { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone' }, { label: 'City', key: 'city' },
                { label: 'State', key: 'state' }, { label: 'Website', key: 'website' },
                { label: 'Admin Name', key: 'adminName' }, { label: 'Established', key: 'established' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type || 'text'} value={editData[f.key] || ''} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              {[
                { label: 'Plan', key: 'plan', options: ['Basic', 'Standard', 'Premium'] },
                { label: 'Status', key: 'status', options: ['Active', 'Inactive', 'Pending'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <select value={editData[f.key]} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                <textarea value={editData.address || ''} onChange={e => setEditData({ ...editData, address: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => { setSchool({ ...editData }); setShowEdit(false); }} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button onClick={() => setShowEdit(false)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete School?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <span className="font-semibold text-gray-700">{school.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => navigate('/schools')} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
