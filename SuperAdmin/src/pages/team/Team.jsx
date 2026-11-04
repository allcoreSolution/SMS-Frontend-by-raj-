import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  X, 
  Save, 
  AlertTriangle, 
  Circle, 
  Key, 
  Eye, 
  EyeOff, 
  Power, 
  ShieldCheck, 
  Check, 
  Copy,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import Swal from 'sweetalert2';
import { superAdminService } from '../../api/superAdminService';

const roles = ['Super Admin', 'Support Manager', 'Developer', 'Sales Manager', 'Support Agent', 'Content Manager'];
const avatarColors = ['bg-[#2563eb]', 'bg-[#9333ea]', 'bg-[#16a34a]', 'bg-[#ef4444]', 'bg-[#f97316]'];
const emptyForm = { name: '', email: '', phone: '', password: 'admin@123', role: 'Support Agent', status: 'Active' };

/** Modal for Adding / Editing a Team Member */
function MemberModal({ member, onChange, onSave, onClose, isAdd }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden border border-slate-100 max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="font-bold text-slate-800 text-lg">
              {isAdd ? 'Add Team Member' : 'Edit Member Details'}
            </h2>
            <p className="text-xs text-slate-500">
              {isAdd ? 'Create platform access for staff or admin' : `Updating profile of ${member.name || 'Member'}`}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-white flex-1 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              value={member.name || ''}
              onChange={(e) => onChange({ ...member, name: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/10 transition-all"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={member.email || ''}
                onChange={(e) => onChange({ ...member, email: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/10 transition-all"
                placeholder="staff@schoolerp.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Phone Number
              </label>
              <input
                value={member.phone || ''}
                onChange={(e) => onChange({ ...member, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/10 transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {isAdd && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Login Password
              </label>
              <input
                type="text"
                value={member.password || ''}
                onChange={(e) => onChange({ ...member, password: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/10 transition-all font-mono"
                placeholder="admin@123"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default password is set to admin@123 if left empty.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Platform Role
              </label>
              <select
                value={member.role || 'Support Agent'}
                onChange={(e) => onChange({ ...member, role: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/10"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Account Status
              </label>
              <select
                value={member.status || 'Active'}
                onChange={(e) => onChange({ ...member, status: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/10"
              >
                <option value="Active">Active (Login Allowed)</option>
                <option value="Inactive">Inactive (Suspended)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 text-sm font-bold text-white bg-[#0891b2] hover:bg-[#0e7490] rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isAdd ? 'Add Member' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Modal for Resetting Password */
function PasswordModal({ member, onClose, onSave }) {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Reset Password</h2>
              <p className="text-xs text-slate-500">{member.name} ({member.email})</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-white space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-slate-900 bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 font-mono"
                placeholder="Enter new strong password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Must be at least 4 characters long.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(newPassword)}
            disabled={!newPassword || newPassword.length < 4}
            className="px-5 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Key className="w-4 h-4" /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

/** Modal for Quick View Details */
function ViewModal({ member, onClose, onEdit, onPasswordReset, onToggleStatus, onDelete }) {
  const [copied, setCopied] = useState(false);

  if (!member) return null;

  const copyEmail = () => {
    if (member.email) {
      navigator.clipboard.writeText(member.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-slate-100 max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0891b2]" />
            <h2 className="font-bold text-slate-800 text-base">Team Member Profile</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-white flex-1 overflow-y-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0891b2] to-cyan-400 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
              {member.name ? member.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 truncate">{member.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {member.role || 'Super Admin'}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  <Circle className="w-2 h-2 fill-current" /> {member.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email Address</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-medium text-slate-800 truncate">{member.email}</span>
                <button 
                  onClick={copyEmail} 
                  title="Copy email" 
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Phone Number</p>
              <p className="font-medium text-slate-800 mt-0.5">{member.phone || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Member Since</p>
              <p className="font-medium text-slate-800 mt-0.5">{member.joined || 'Recent'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Member ID</p>
              <p className="font-mono text-xs text-slate-600 mt-0.5 truncate">{member.id}</p>
            </div>
          </div>

          {/* Quick Action Buttons inside Profile */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Quick Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => { onClose(); onEdit(member); }}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-[#0891b2] hover:bg-cyan-50/50 text-slate-700 hover:text-[#0891b2] transition-colors gap-1.5 text-xs font-bold cursor-pointer"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => { onClose(); onPasswordReset(member); }}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-700 hover:text-amber-600 transition-colors gap-1.5 text-xs font-bold cursor-pointer"
              >
                <Key className="w-4 h-4" /> Password
              </button>
              <button
                onClick={() => { onClose(); onToggleStatus(member); }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 transition-colors gap-1.5 text-xs font-bold cursor-pointer ${
                  member.status === 'Active' 
                    ? 'hover:border-slate-400 hover:bg-slate-100 text-slate-700' 
                    : 'hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                }`}
              >
                <Power className="w-4 h-4" /> {member.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => { onClose(); onDelete(member); }}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-red-500 hover:bg-red-50/50 text-slate-700 hover:text-red-600 transition-colors gap-1.5 text-xs font-bold cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-3.5 border-t border-slate-100 bg-slate-50/70">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);
  const [passwordMember, setPasswordMember] = useState(null);
  const [viewMember, setViewMember] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await superAdminService.getTeamMembers();
      const list = res?.data || res || [];
      const arr = Array.isArray(list) ? list : [];
      setTeam(
        arr.map((m) => ({
          id: m._id || m.id,
          name: m.name || m.username || m.email || 'User',
          email: m.email || '',
          phone: m.phone || 'N/A',
          role: m.role || 'Super Admin',
          status: m.status || 'Active',
          joined: new Date(m.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
        }))
      );
    } catch (err) {
      console.error(err);
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = team.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(search.toLowerCase())) ||
      (m.phone && m.phone.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = team.filter((m) => m.status === 'Active').length;
  const inactiveCount = team.filter((m) => m.status !== 'Active').length;

  const handleAdd = async () => {
    if (!form.name || !form.email) {
      return Swal.fire('Error', 'Full Name and Email are required', 'error');
    }
    try {
      await superAdminService.addTeamMember({ ...form, password: form.password || 'admin@123' });
      setShowAdd(false);
      setForm(emptyForm);
      Swal.fire({ 
        icon: 'success', 
        title: 'Team member added successfully!', 
        timer: 1500, 
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      fetchTeam();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Failed to add member', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editMember?.id) return;
    try {
      await superAdminService.updateTeamMember(editMember.id, {
        name: editMember.name,
        email: editMember.email,
        phone: editMember.phone,
        status: editMember.status,
        role: editMember.role,
      });
      setEditMember(null);
      Swal.fire({ 
        icon: 'success', 
        title: 'Member details updated!', 
        timer: 1500, 
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      fetchTeam();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Update failed', 'error');
    }
  };

  const handleSavePassword = async (newPassword) => {
    if (!passwordMember?.id || !newPassword) return;
    try {
      await superAdminService.updateTeamMember(passwordMember.id, {
        password: newPassword
      });
      setPasswordMember(null);
      Swal.fire({ 
        icon: 'success', 
        title: 'Password updated successfully!', 
        timer: 1500, 
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Password update failed', 'error');
    }
  };

  const handleToggleStatus = async (m) => {
    const newStatus = m.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await superAdminService.updateTeamMember(m.id, { status: newStatus });
      Swal.fire({ 
        icon: 'success', 
        title: `${m.name} is now ${newStatus}!`, 
        timer: 1500, 
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      fetchTeam();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Status change failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteMember?.id) return;
    try {
      await superAdminService.deleteTeamMember(deleteMember.id);
      setDeleteMember(null);
      Swal.fire({ 
        icon: 'success', 
        title: 'Member removed successfully!', 
        timer: 1500, 
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      fetchTeam();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Delete failed', 'error');
    }
  };

  const initials = (name) =>
    (name || '?')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Team Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Manage platform super admin, developers &amp; support staff accounts
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setShowAdd(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0891b2] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#0e7490] transition-colors cursor-pointer w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 shadow-2xs">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-50 text-[#0891b2] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">Total</p>
            <p className="text-base sm:text-xl font-extrabold text-slate-800 mt-0.5">{team.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 shadow-2xs">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">Active</p>
            <p className="text-base sm:text-xl font-extrabold text-emerald-700 mt-0.5">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 shadow-2xs">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">Inactive</p>
            <p className="text-base sm:text-xl font-extrabold text-red-600 mt-0.5">{inactiveCount}</p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search member by name, email, phone or role..."
          className="flex-1 outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded text-xs font-medium cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── 1. MOBILE CARD VIEW (Phones < 768px) ── */}
      <div className="block md:hidden space-y-3">
        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#0891b2] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Loading team members...</span>
            </div>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
            <p className="font-semibold text-slate-600 text-sm">No team members found</p>
            <p className="text-xs text-slate-400 mt-1">Try another search keyword or click Add Member</p>
          </div>
        )}
        {filtered.map((m, i) => (
          <div key={m.id} className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
            {/* Top row: Avatar + Name + Status */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 shadow-2xs ${avatarColors[i % avatarColors.length]}`}>
                  {initials(m.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm truncate">{m.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {m.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{String(m.id).slice(-4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Pill Toggle */}
              <button
                type="button"
                onClick={() => handleToggleStatus(m)}
                title={`Click to mark as ${m.status === 'Active' ? 'Inactive' : 'Active'}`}
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border cursor-pointer ${
                  m.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'
                    : 'bg-red-50 text-red-600 border-red-200/80 hover:bg-red-100'
                }`}
              >
                <Circle className={`w-1.5 h-1.5 fill-current ${m.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`} />
                {m.status}
              </button>
            </div>

            {/* Middle: Contact details & Joined Date */}
            <div className="bg-slate-50/80 rounded-lg p-2.5 space-y-1.5 text-xs text-slate-600 border border-slate-100">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate text-slate-700 font-medium">{m.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{m.phone && m.phone !== 'N/A' ? m.phone : 'No phone'}</span>
                </div>
                <span className="text-[11px] text-slate-400">Joined {m.joined}</span>
              </div>
            </div>

            {/* Mobile Actions Toolbar: 5 Tap-Friendly Buttons */}
            <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewMember(m)}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors text-[10px] font-bold gap-1 cursor-pointer"
                title="View Full Profile"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>View</span>
              </button>

              <button
                type="button"
                onClick={() => setEditMember({ ...m })}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-50 hover:bg-cyan-50 text-slate-600 hover:text-[#0891b2] transition-colors text-[10px] font-bold gap-1 cursor-pointer"
                title="Edit Details"
              >
                <Edit className="w-3.5 h-3.5 text-[#0891b2]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setPasswordMember(m)}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-colors text-[10px] font-bold gap-1 cursor-pointer"
                title="Change Password"
              >
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Pass</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleStatus(m)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-50 transition-colors text-[10px] font-bold gap-1 cursor-pointer ${
                  m.status === 'Active'
                    ? 'hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
                title="Toggle Active/Inactive"
              >
                <Power className={`w-3.5 h-3.5 ${m.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span>{m.status === 'Active' ? 'Active' : 'Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteMember(m)}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors text-[10px] font-bold gap-1 cursor-pointer"
                title="Delete Member"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── 2. DESKTOP & TABLET TABLE VIEW (Screens >= 768px) ── */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="w-full text-left text-sm min-w-[850px] border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[220px]">Member</th>
                <th className="px-5 py-3.5 min-w-[220px]">Contact</th>
                <th className="px-5 py-3.5 min-w-[140px]">Role</th>
                <th className="px-5 py-3.5 min-w-[120px]">Status</th>
                <th className="px-5 py-3.5 min-w-[110px]">Joined</th>
                <th className="px-5 py-3.5 min-w-[210px] text-right sticky right-0 bg-slate-50 z-10 shadow-[-5px_0_8px_-3px_rgba(0,0,0,0.06)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#0891b2] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading team members...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No team members found</p>
                    <p className="text-xs text-slate-400 mt-1">Try another search keyword or click Add Member</p>
                  </td>
                </tr>
              )}
              {filtered.map((m, i) => (
                <tr key={m.id} className="group hover:bg-slate-50/80 transition-colors">
                  
                  {/* Member Name & Avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0 shadow-2xs ${avatarColors[i % avatarColors.length]}`}
                      >
                        {initials(m.name)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate">{m.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono block">ID: {String(m.id).slice(-6)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1 text-slate-600">
                      <span className="flex items-center gap-1.5 text-xs truncate" title={m.email}>
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
                        <span className="truncate">{m.email}</span>
                      </span>
                      {m.phone && m.phone !== 'N/A' && (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {m.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                      {m.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(m)}
                      title={`Click to mark as ${m.status === 'Active' ? 'Inactive' : 'Active'}`}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer border ${
                        m.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100' 
                          : 'bg-red-50 text-red-600 border-red-200/80 hover:bg-red-100'
                      }`}
                    >
                      <Circle className={`w-2 h-2 fill-current ${m.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`} /> 
                      {m.status}
                    </button>
                  </td>

                  {/* Joined Date */}
                  <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                    {m.joined}
                  </td>

                  {/* Complete Fixed Action Column with Rich Features */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50/90 z-10 shadow-[-5px_0_8px_-3px_rgba(0,0,0,0.06)]">
                    <div className="inline-flex items-center gap-1">
                      
                      {/* 1. Quick View Details */}
                      <button
                        type="button"
                        onClick={() => setViewMember(m)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* 2. Edit Member */}
                      <button
                        type="button"
                        onClick={() => setEditMember({ ...m })}
                        className="p-1.5 text-slate-400 hover:text-[#0891b2] hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Member Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* 3. Reset / Change Password */}
                      <button
                        type="button"
                        onClick={() => setPasswordMember(m)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Change Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>

                      {/* 4. Instant Toggle Active/Inactive */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(m)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          m.status === 'Active'
                            ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                        title={m.status === 'Active' ? 'Deactivate Member' : 'Activate Member'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      {/* 5. Delete Member */}
                      <button
                        type="button"
                        onClick={() => setDeleteMember(m)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Member"
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
      </div>

      {/* Add Member Modal */}
      {showAdd && (
        <MemberModal
          member={form}
          onChange={setForm}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
          isAdd
        />
      )}

      {/* Edit Member Modal */}
      {editMember && (
        <MemberModal
          member={editMember}
          onChange={setEditMember}
          onSave={handleSaveEdit}
          onClose={() => setEditMember(null)}
        />
      )}

      {/* Password Reset Modal */}
      {passwordMember && (
        <PasswordModal
          member={passwordMember}
          onClose={() => setPasswordMember(null)}
          onSave={handleSavePassword}
        />
      )}

      {/* View Full Profile Modal */}
      {viewMember && (
        <ViewModal
          member={viewMember}
          onClose={() => setViewMember(null)}
          onEdit={(m) => setEditMember({ ...m })}
          onPasswordReset={(m) => setPasswordMember(m)}
          onToggleStatus={(m) => handleToggleStatus(m)}
          onDelete={(m) => setDeleteMember(m)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Remove Team Member?</h3>
                <p className="text-xs text-slate-500">This action will permanently revoke access</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              Are you sure you want to remove <strong>{deleteMember.name}</strong> (<span className="text-slate-500">{deleteMember.email}</span>)?
            </p>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setDeleteMember(null)} 
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
