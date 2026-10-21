import React, { useState } from 'react';
import { 
  X, User, Phone, Mail, BookOpen, Layers, Target, Calendar, MessageSquare, 
  CheckCircle, Trash2, Edit3, Save, ExternalLink, Sparkles, Clock, AlertCircle 
} from 'lucide-react';
import leadService from '../../api/leadService';

const LeadDetailsModal = ({ isOpen, onClose, lead, onLeadUpdated, onLeadDeleted }) => {
  if (!isOpen || !lead) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    studentName: lead.studentName || '',
    parentName: lead.parentName || lead.guardian || '',
    contactNumber: lead.contactNumber || lead.phone || '',
    email: lead.email || '',
    targetClass: lead.targetClass || lead.cls || lead.class || 'Grade 1',
    stage: lead.stage || lead.status || 'New Enquiry',
    source: lead.source || 'Website',
    score: lead.score || 75,
    followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : '',
    followUpType: lead.followUpType || 'Call',
    followUpTitle: lead.followUpTitle || '',
    followUpStatus: lead.followUpStatus || 'pending',
    notes: lead.notes || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const stagesList = [
    'New Enquiry',
    'Contacted / Qualified',
    'Application Received',
    'Document Verification',
    'Entrance Test',
    'Counselling / Interview',
    'Offer / Selected',
    'Enrolled',
    'Lost / Rejected'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickStageChange = async (newStage) => {
    try {
      setLoading(true);
      setError('');
      const res = await leadService.updateLead(lead._id, { stage: newStage, status: newStage });
      if (res && res.data) {
        setFormData(prev => ({ ...prev, stage: newStage }));
        setSuccessMsg(`Stage updated to "${newStage}"`);
        if (onLeadUpdated) onLeadUpdated(res.data);
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error('Failed to change stage:', err);
      setError('Failed to update stage');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const payload = {
        ...formData,
        status: formData.stage,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null,
      };

      const res = await leadService.updateLead(lead._id, payload);
      if (res && res.data) {
        setIsEditing(false);
        setSuccessMsg('Lead details updated successfully!');
        if (onLeadUpdated) onLeadUpdated(res.data);
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
      setError('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!window.confirm(`Are you sure you want to Admit & Enroll ${formData.studentName}? This will convert them to an official student record.`)) {
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await leadService.convertLead(lead._id);
      if (res && res.data) {
        setFormData(prev => ({ ...prev, stage: 'Enrolled' }));
        setSuccessMsg(res.message || 'Candidate converted to Admitted Student!');
        if (onLeadUpdated) onLeadUpdated(res.data);
      }
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete lead for ${formData.studentName}? This action cannot be undone.`)) {
      return;
    }
    try {
      setLoading(true);
      await leadService.deleteLead(lead._id);
      if (onLeadDeleted) onLeadDeleted(lead._id);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = (formData.contactNumber || '').replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex justify-between items-start">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5F52FF] to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {formData.studentName ? formData.studentName[0].toUpperCase() : 'L'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{formData.studentName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-indigo-300 border border-white/10">
                  {formData.targetClass}
                </span>
                {formData.stage === 'Enrolled' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Enrolled
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Parent: <strong className="text-slate-200">{formData.parentName}</strong></span>
                <span>·</span>
                <span>Source: <strong className="text-indigo-300">{formData.source}</strong></span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Contact & Action Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {formData.contactNumber && (
              <>
                <a
                  href={`tel:${formData.contactNumber}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call {formData.contactNumber}
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  WhatsApp
                </a>
              </>
            )}
            {formData.email && (
              <a
                href={`mailto:${formData.email}`}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            {formData.stage !== 'Enrolled' && (
              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Admit & Enroll
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-rose-200 transition"
              title="Delete Lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          
          {/* Stage Progression Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#5F52FF]" /> Pipeline Stage
              </label>
              <span className="text-xs font-extrabold text-[#5F52FF]">{formData.stage}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-100 rounded-xl border border-slate-200">
              {stagesList.map((stg) => {
                const isActive = formData.stage === stg;
                return (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => handleQuickStageChange(stg)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      isActive 
                        ? 'bg-[#5F52FF] text-white shadow-sm ring-2 ring-[#5F52FF]/30' 
                        : 'bg-white hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {stg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Form / View */}
          {isEditing ? (
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    name="targetClass"
                    value={formData.targetClass}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                  />
                </div>
              </div>

              {/* Follow up in edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Type</label>
                  <select
                    name="followUpType"
                    value={formData.followUpType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Call">Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Campus Visit">Campus Visit</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Goal</label>
                  <input
                    type="text"
                    name="followUpTitle"
                    value={formData.followUpTitle}
                    onChange={handleChange}
                    placeholder="e.g. Discuss entrance test schedule"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Conversation Notes</label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#5F52FF] text-white text-xs font-bold rounded-xl shadow hover:bg-[#4E41E6] flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Info Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Class</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{formData.targetClass}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Source</span>
                  <p className="text-xs font-bold text-[#5F52FF] mt-0.5">{formData.source}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Lead Score</span>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">{formData.score}% Match</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{formData.stage}</p>
                </div>
              </div>

              {/* Scheduled Follow-up widget */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5F52FF]" /> Scheduled Follow-up
                  </h4>
                  {formData.followUpDate && (
                    <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-100 shadow-2xs">
                      {new Date(formData.followUpDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {formData.followUpTitle || 'No specific task title logged.'}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700 font-bold">
                    Type: {formData.followUpType}
                  </span>
                  <span>Status: {formData.followUpStatus}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Counselor Notes
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {formData.notes || 'No remarks recorded yet. Click "Edit" to add consultation notes.'}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Created on {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Today'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default LeadDetailsModal;
