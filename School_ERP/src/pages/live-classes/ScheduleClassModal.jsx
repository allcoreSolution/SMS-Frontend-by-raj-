import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Calendar, Video, Clock, User, BookOpen, 
  Link as LinkIcon, Sparkles, AlertCircle, CheckCircle, Shield
} from 'lucide-react';
import { liveClassService } from '../../api/liveClassService';

export default function ScheduleClassModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(true);
  const [classesList, setClassesList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    className: '',
    sectionName: 'All',
    subjectName: '',
    teacherName: '',
    academicClass: '',
    hostId: '',
    provider: 'Jitsi',
    meetingUrl: '',
    meetingId: '',
    passcode: '',
    startTime: '',
    durationMinutes: 45,
    maxStudents: 50
  });

  // Load real Classes & Teachers on modal open
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      loadMetadata();

      // Pre-set start time to 30 mins from now in local datetime-local format
      const defaultTime = new Date(Date.now() + 30 * 60000);
      const localIso = new Date(defaultTime.getTime() - defaultTime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData(prev => ({
        ...prev,
        startTime: localIso,
        provider: 'Jitsi',
        meetingUrl: `https://meet.jit.si/school-erp-${Math.random().toString(36).substring(2, 8)}`
      }));
    }
  }, [isOpen]);

  const loadMetadata = async () => {
    try {
      setFetchingMeta(true);
      const { classes, teachers } = await liveClassService.getAcademicMetadata();
      setClassesList(classes);
      setTeachersList(teachers);

      if (classes.length > 0) {
        setFormData(prev => ({
          ...prev,
          className: prev.className || classes[0].className,
          academicClass: prev.academicClass || classes[0]._id
        }));
      }
      if (teachers.length > 0) {
        setFormData(prev => ({
          ...prev,
          teacherName: prev.teacherName || teachers[0].fullName,
          hostId: prev.hostId || teachers[0]._id
        }));
      }
    } catch (err) {
      console.error('Failed to load academic metadata', err);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleClassChange = (e) => {
    const selectedId = e.target.value;
    const found = classesList.find(c => c._id === selectedId || c.className === selectedId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        academicClass: found._id,
        className: found.className
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        className: selectedId,
        academicClass: ''
      }));
    }
  };

  const handleTeacherChange = (e) => {
    const selectedId = e.target.value;
    const found = teachersList.find(t => t._id === selectedId || t.fullName === selectedId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        hostId: found._id,
        teacherName: found.fullName
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        teacherName: selectedId,
        hostId: ''
      }));
    }
  };

  const handleProviderChange = (newProvider) => {
    let url = formData.meetingUrl;
    if (newProvider === 'Jitsi') {
      const code = Math.random().toString(36).substring(2, 8);
      url = `https://meet.jit.si/school-erp-${code}`;
    } else if (newProvider === 'Zoom') {
      url = 'https://zoom.us/j/';
    } else if (newProvider === 'GoogleMeet') {
      url = 'https://meet.google.com/';
    }

    setFormData(prev => ({
      ...prev,
      provider: newProvider,
      meetingUrl: url
    }));
  };

  const generateRandomJitsi = () => {
    const titleSlug = (formData.title || 'live-class')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 15);
    const code = Math.random().toString(36).substring(2, 9);
    setFormData(prev => ({
      ...prev,
      meetingUrl: `https://meet.jit.si/school-erp-${titleSlug}-${code}`,
      meetingId: `room-${code}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setError('Please provide a class topic / title');
      return;
    }
    if (!formData.startTime) {
      setError('Please select start date and time');
      return;
    }

    try {
      setLoading(true);
      const res = await liveClassService.scheduleClass(formData);
      if (res.success) {
        setSuccessMsg('Live class scheduled successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data);
          onClose();
        }, 800);
      } else {
        setError(res.message || 'Failed to schedule class');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error scheduling live class');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Schedule New Live Class</h2>
              <p className="text-xs text-indigo-100 font-medium">Virtual Classroom Setup with Instant Meeting Links</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Class Title / Topic <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Thermodynamics & Heat Flow Masterclass"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Subject
              </label>
              <input 
                type="text" 
                placeholder="e.g. Physics, Math"
                value={formData.subjectName}
                onChange={e => setFormData({ ...formData, subjectName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Class, Section, Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Class
              </label>
              <select 
                value={formData.academicClass || formData.className}
                onChange={handleClassChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                {classesList.length > 0 ? (
                  classesList.map(c => (
                    <option key={c._id} value={c._id}>{c.className}</option>
                  ))
                ) : (
                  <>
                    <option value="Class X">Class X</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class VIII">Class VIII</option>
                    <option value="Class XI">Class XI</option>
                    <option value="Class XII">Class XII</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Section
              </label>
              <select 
                value={formData.sectionName}
                onChange={e => setFormData({ ...formData, sectionName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                <option value="All">All Sections</option>
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Host Teacher
              </label>
              <select 
                value={formData.hostId || formData.teacherName}
                onChange={handleTeacherChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                {teachersList.length > 0 ? (
                  teachersList.map(t => (
                    <option key={t._id} value={t._id}>{t.fullName} ({t.designation || 'Teacher'})</option>
                  ))
                ) : (
                  <>
                    <option value="Amit Sharma">Amit Sharma (PGT Math)</option>
                    <option value="Priya Singh">Priya Singh (TGT Science)</option>
                    <option value="Rajesh Kumar">Rajesh Kumar (PGT English)</option>
                    <option value="Sneha Desai">Sneha Desai (Social Studies)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Timing, Duration, Max Students */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Start Date & Time <span className="text-rose-500">*</span>
              </label>
              <input 
                type="datetime-local" 
                required
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Duration (Mins)
              </label>
              <input 
                type="number" 
                min="10"
                max="180"
                value={formData.durationMinutes}
                onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Max Student Limit
              </label>
              <input 
                type="number" 
                min="5"
                max="300"
                value={formData.maxStudents}
                onChange={e => setFormData({ ...formData, maxStudents: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Provider Selection */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Virtual Meeting Platform
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                { id: 'Jitsi', label: 'Jitsi Meet', badge: 'Free & Embedded', color: 'indigo' },
                { id: 'Zoom', label: 'Zoom Cloud', badge: 'OAuth / Link', color: 'blue' },
                { id: 'GoogleMeet', label: 'Google Meet', badge: 'Workspace', color: 'emerald' },
                { id: 'External', label: 'Custom / Teams', badge: 'Direct URL', color: 'slate' }
              ].map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.provider === p.id 
                      ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm' 
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{p.label}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{p.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Link & Auto-Generate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-600" /> Meeting URL <span className="text-rose-500">*</span>
              </label>
              {formData.provider === 'Jitsi' && (
                <button
                  type="button"
                  onClick={generateRandomJitsi}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate Room URL
                </button>
              )}
            </div>
            <input 
              type="url" 
              required
              placeholder="https://meet.jit.si/... or https://zoom.us/j/..."
              value={formData.meetingUrl}
              onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono text-xs"
            />
          </div>

          {/* Passcode & Meeting ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Meeting ID (Optional)
              </label>
              <input 
                type="text" 
                placeholder="e.g. 842 1990 281"
                value={formData.meetingId}
                onChange={e => setFormData({ ...formData, meetingId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Passcode / Pin (Optional)
              </label>
              <input 
                type="text" 
                placeholder="e.g. 123456"
                value={formData.passcode}
                onChange={e => setFormData({ ...formData, passcode: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Class Instructions / Description
            </label>
            <textarea 
              rows="2"
              placeholder="e.g. Please bring textbook Chapter 3 and have your notebooks ready for numeric problem solving."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Schedule Virtual Classroom
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
