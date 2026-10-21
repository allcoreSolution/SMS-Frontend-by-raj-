import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, X, Save, AlertTriangle, Circle } from 'lucide-react';
import Swal from 'sweetalert2';
import { superAdminService } from '../../api/superAdminService';

const roles = ['Super Admin', 'Support Manager', 'Developer', 'Sales Manager', 'Support Agent', 'Content Manager'];
const avatarColors = ['bg-[#2563eb]', 'bg-[#9333ea]', 'bg-[#16a34a]', 'bg-[#ef4444]', 'bg-[#f97316]'];
const emptyForm = { name: '', email: '', phone: '', role: 'Support Agent', status: 'Active' };

/** Modal outside parent so inputs keep focus while typing */
function MemberModal({ member, onChange, onSave, onClose, isAdd }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <h2 className="font-bold text-gray-800 text-lg">
            {isAdd ? 'Add Team Member' : 'Edit Member Details'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-none">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto w-full">
          <div className="grid grid-cols-2 gap-5 mb-5 bg-white p-5 border border-slate-200 w-full">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input
                value={member.name || ''}
                onChange={(e) => onChange({ ...member, name: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={member.email || ''}
                onChange={(e) => onChange({ ...member, email: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Phone</label>
              <input
                value={member.phone || ''}
                onChange={(e) => onChange({ ...member, phone: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]"
                placeholder="+91 ..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Role</label>
              <select
                value={member.role || 'Support Agent'}
                onChange={(e) => onChange({ ...member, role: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2]"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Status</label>
              <select
                value={member.status || 'Active'}
                onChange={(e) => onChange({ ...member, status: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-white">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 text-sm font-bold text-white bg-[#0891b2] hover:bg-[#0e7490] flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {isAdd ? 'Add Member' : 'Save Changes'}
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
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!form.name || !form.email) {
      return Swal.fire('Error', 'Name and Email are required', 'error');
    }
    try {
      await superAdminService.addTeamMember({ ...form, password: 'admin@123' });
      setShowAdd(false);
      setForm(emptyForm);
      Swal.fire({ icon: 'success', title: 'Team member added!', timer: 1200, showConfirmButton: false });
      fetchTeam();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Failed to add', 'error');
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
      Swal.fire({ icon: 'success', title: 'Member updated!', timer: 1200, showConfirmButton: false });
      fetchTeam();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteMember?.id) return;
    try {
      await superAdminService.deleteTeamMember(deleteMember.id);
      setDeleteMember(null);
      Swal.fire({ icon: 'success', title: 'Member removed!', timer: 1200, showConfirmButton: false });
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
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Team Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage platform super admin & support staff</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setShowAdd(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white text-sm font-bold hover:bg-[#0e7490]"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 mb-4 p-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 outline-none text-sm text-slate-800"
        />
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No team members found. Add one to get started.
                </td>
              </tr>
            )}
            {filtered.map((m, i) => (
              <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarColors[i % avatarColors.length]}`}
                    >
                      {initials(m.name)}
                    </div>
                    <span className="font-semibold text-slate-800">{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5 text-slate-600">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Mail className="w-3 h-3" /> {m.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Phone className="w-3 h-3" /> {m.phone}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">{m.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 ${
                      m.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <Circle className="w-2 h-2 fill-current" /> {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{m.joined}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setEditMember({ ...m })}
                    className="p-1.5 text-slate-500 hover:text-[#0891b2] hover:bg-cyan-50 inline-flex"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteMember(m)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 inline-flex"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <MemberModal
          member={form}
          onChange={setForm}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
          isAdd
        />
      )}
      {editMember && (
        <MemberModal
          member={editMember}
          onChange={setEditMember}
          onSave={handleSaveEdit}
          onClose={() => setEditMember(null)}
        />
      )}

      {deleteMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-lg text-slate-800">Remove member?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Remove <strong>{deleteMember.name}</strong> ({deleteMember.email}) from the team?
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteMember(null)} className="px-4 py-2 text-sm font-semibold text-gray-600">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
