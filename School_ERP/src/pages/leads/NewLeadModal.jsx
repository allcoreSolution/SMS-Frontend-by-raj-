import React, { useState } from 'react';
import { X, Plus, User, Phone, Mail, BookOpen, Layers, Target, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import leadService from '../../api/leadService';

const NewLeadModal = ({ isOpen, onClose, onLeadCreated, defaultStage = 'New Enquiry' }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    contactNumber: '',
    email: '',
    targetClass: 'Grade 1',
    source: 'Walk-in',
    stage: defaultStage,
    score: 80,
    followUpDate: '',
    followUpType: 'Call',
    followUpTitle: 'Initial introduction call',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName.trim()) {
      setError('Student name is required');
      return;
    }
    if (!formData.parentName.trim()) {
      setError('Parent / Guardian name is required');
      return;
    }
    if (!formData.contactNumber.trim()) {
      setError('Contact phone number is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        ...formData,
        status: formData.stage,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null,
      };

      const res = await leadService.createLead(payload);
      if (res && res.data) {
        if (onLeadCreated) onLeadCreated(res.data);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create lead:', err);
      setError(err?.response?.data?.message || 'Failed to save lead. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#5F52FF] to-[#7B68EE] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Create New Admission Lead</h2>
              <p className="text-xs text-white/80">Capture candidate inquiry & assign to pipeline</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          {/* Section 1: Candidate Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#5F52FF]" /> Candidate Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Class / Grade <span className="text-red-500">*</span>
                </label>
                <select
                  name="targetClass"
                  value={formData.targetClass}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] bg-white transition"
                >
                  <option value="Playgroup">Playgroup</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Parent & Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#5F52FF]" /> Parent & Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent / Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="e.g. Vivek Sharma"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] transition"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. parent@example.com"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pipeline Stage & Source */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#5F52FF]" /> Pipeline & Attribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pipeline Stage</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] bg-white transition"
                >
                  <option value="New Enquiry">New Enquiry</option>
                  <option value="Contacted / Qualified">Contacted / Qualified</option>
                  <option value="Application Received">Application Received</option>
                  <option value="Document Verification">Document Verification</option>
                  <option value="Entrance Test">Entrance Test</option>
                  <option value="Counselling / Interview">Counselling / Interview</option>
                  <option value="Offer / Selected">Offer / Selected</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Lost / Rejected">Lost / Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] bg-white transition"
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Website">Website Form</option>
                  <option value="Facebook">Facebook / Social</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Referral">Referral / Sibling</option>
                  <option value="Phone">Phone Inquiry</option>
                  <option value="Newspaper / Print">Newspaper / Print</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Follow-up & Remarks */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5F52FF]" /> Next Follow-up & Remarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Type</label>
                <select
                  name="followUpType"
                  value={formData.followUpType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] bg-white transition"
                >
                  <option value="Call">Phone Call</option>
                  <option value="Meeting">In-Person Meeting</option>
                  <option value="Campus Visit">Campus Tour / Visit</option>
                  <option value="Email">Email Follow-up</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Goal</label>
                <input
                  type="text"
                  name="followUpTitle"
                  value={formData.followUpTitle}
                  onChange={handleChange}
                  placeholder="e.g. Schedule campus tour or send fee structure"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Conversation Notes / Remarks</label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any requirements, previous school background, special remarks..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/30 focus:border-[#5F52FF] resize-none transition"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-[#5F52FF] to-[#7B68EE] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:opacity-95 disabled:opacity-50 transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Lead...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Save & Add to Pipeline
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NewLeadModal;
