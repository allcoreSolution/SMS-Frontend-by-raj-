import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Video, Users, CheckCircle2, 
  AlertCircle, Sparkles, ArrowLeft, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PTMNavHeader from './PTMNavHeader';
import ptmService from '../../api/ptmService';

export default function SchedulePTM() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    meetingDate: '',
    startTime: '09:00',
    endTime: '13:00',
    mode: 'In person',
    scope: 'Whole school',
    className: '',
    sectionName: 'All Sections',
    venue: 'Main School Auditorium & Campus Classrooms',
    meetingLink: '',
    description: '',
    buildRoster: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const classesList = [
    'Nursery', 'LKG', 'UKG',
    'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
    'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X',
    'Class XI', 'Class XII'
  ];

  const sectionsList = ['All Sections', 'Section A', 'Section B', 'Section C', 'Section D'];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Meeting title is required';
    if (!formData.meetingDate) newErrors.meetingDate = 'Meeting date is required';
    if (formData.scope === 'Specific class' && !formData.className) {
      newErrors.className = 'Please select a target class';
    }
    if ((formData.mode === 'Online' || formData.mode === 'Hybrid') && !formData.meetingLink && !formData.venue) {
      newErrors.meetingLink = 'Please provide a meeting link or location';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const created = await ptmService.createMeeting({
        ...formData,
        status: 'Scheduled',
        className: formData.scope === 'Whole school' ? 'All Classes' : formData.className,
      });

      setSuccessNotice(true);
      setTimeout(() => {
        navigate(`/ptm/details/${created.id}`);
      }, 1200);
    } catch (err) {
      console.error('Failed to schedule meeting:', err);
      alert('Failed to schedule meeting. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <PTMNavHeader />

      <div className="p-6 max-w-[1000px] mx-auto space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/ptm/dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <span className="text-xs text-slate-400 font-medium">Session 2026-2027</span>
        </div>

        {/* Success Modal / Toast */}
        {successNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-sm font-medium">
              Parent-Teacher Meeting scheduled successfully! Opening attendee roster...
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Schedule Parent-Teacher Meeting</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set meeting details, assign target classes, and automatically compile student guardian rosters.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              New Event
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Title & Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Meeting Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Term 1 Parent-Teacher Meeting" 
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.title ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.title && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Meeting Date <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs text-slate-800 bg-white focus:outline-none transition-all ${
                    errors.meetingDate ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.meetingDate && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.meetingDate}</p>}
              </div>
            </div>

            {/* Scope, Class, Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Scope <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Whole school">Whole School (All Grades)</option>
                  <option value="Specific class">Specific Class & Section</option>
                </select>
              </div>

              {formData.scope === 'Specific class' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Select Class <span className="text-rose-500">*</span>
                    </label>
                    <select 
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-xl text-xs text-slate-800 bg-white focus:outline-none ${
                        errors.className ? 'border-rose-300' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    >
                      <option value="">-- Select Class --</option>
                      {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.className && <p className="text-[11px] text-rose-500 mt-1">{errors.className}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Section
                    </label>
                    <select 
                      value={formData.sectionName}
                      onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                    >
                      {sectionsList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div className="md:col-span-2 flex items-center text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  <Users className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                  <span>Whole school session will generate guardian notifications and rosters for all active enrolled students.</span>
                </div>
              )}
            </div>

            {/* Mode & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Meeting Mode <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="In person">In person (On Campus)</option>
                  <option value="Online">Online (Virtual Meeting)</option>
                  <option value="Hybrid">Hybrid (On Campus + Video)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Start Time
                </label>
                <input 
                  type="time" 
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> End Time
                </label>
                <input 
                  type="time" 
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Venue & Virtual Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Physical Venue / Hall
                </label>
                <input 
                  type="text" 
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. School Auditorium / Respective Classrooms" 
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-slate-400" /> Virtual Meeting Link (Optional for Hybrid / Online)
                </label>
                <input 
                  type="url" 
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/xyz-abc or Zoom URL" 
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Description / Agenda */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Agenda / Notes for Teachers & Guardians
              </label>
              <textarea 
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key agenda points e.g. Mid-term result analysis, Olympiad participation, co-curricular highlights..." 
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
              />
            </div>

            {/* Auto Roster Build Checkbox */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="buildRoster" 
                checked={formData.buildRoster}
                onChange={(e) => setFormData({ ...formData, buildRoster: e.target.checked })}
                className="w-4 h-4 mt-0.5 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="buildRoster" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-bold text-slate-800 block">
                  Compile guardian attendance roster automatically
                </span>
                <span className="text-slate-500">
                  Pulls student directory entries, snapshots guardian phone numbers, and prepares attendance marking sheet immediately.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => navigate('/ptm/dashboard')}
                className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {submitting ? 'Creating Meeting...' : 'Schedule & Open Roster'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
