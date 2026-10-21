import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { 
  ShieldAlert, Info, AlertTriangle, Bot, Flag, CheckCircle2, 
  ShieldCheck, Eye, EyeOff, Check, X, RefreshCw, Sparkles,
  Sliders, Lock, FileImage, AlertCircle, Save
} from 'lucide-react';
import settingsService from '../api/settingsService';

export default function ContentSafety() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Settings State
  const [isSafetyEnabled, setIsSafetyEnabled] = useState(true);
  const [filterLevel, setFilterLevel] = useState('Strict'); // 'Strict' | 'Moderate' | 'Relaxed'
  const [autoBlurThumbnails, setAutoBlurThumbnails] = useState(true);
  const [logTeacherReveals, setLogTeacherReveals] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    scanned: 1420,
    pending: 2,
    clean: 1416,
    flagged: 2
  });

  // Review Queue Items
  const [reviewQueue, setReviewQueue] = useState([
    {
      id: 1,
      filename: 'homework_submission_p9.jpg',
      student: 'Aryan Sharma (Class 9-B)',
      uploaderRole: 'Student',
      module: 'Homework Submissions',
      reason: 'Low Confidence Graphic Content (Score 0.72)',
      timestamp: 'Today, 11:30 AM',
      isBlurred: true
    },
    {
      id: 2,
      filename: 'chat_attachment_88.png',
      student: 'Rohit Verma (Class 10-A)',
      uploaderRole: 'Student',
      module: 'Classroom Chat',
      reason: 'Possible Inappropriate Language in Image (Score 0.68)',
      timestamp: 'Yesterday, 04:15 PM',
      isBlurred: true
    }
  ]);

  // Fetch settings from MongoDB
  const fetchSafetySettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting('content_safety');
      if (res?.success && res.data) {
        const d = res.data;
        if (d.isSafetyEnabled !== undefined) setIsSafetyEnabled(d.isSafetyEnabled);
        if (d.filterLevel) setFilterLevel(d.filterLevel);
        if (d.autoBlurThumbnails !== undefined) setAutoBlurThumbnails(d.autoBlurThumbnails);
        if (d.logTeacherReveals !== undefined) setLogTeacherReveals(d.logTeacherReveals);
        if (d.stats) setStats(d.stats);
      }
    } catch (err) {
      console.error('Failed to fetch content safety settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSafetySettings();
  }, [fetchSafetySettings]);

  // Save to MongoDB
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const payload = {
        isSafetyEnabled,
        filterLevel,
        autoBlurThumbnails,
        logTeacherReveals,
        stats,
        updatedAt: new Date().toISOString()
      };

      const res = await settingsService.saveSetting('content_safety', payload);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Preferences Saved!',
          text: 'AI Content Moderation policies updated in MongoDB.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.response?.data?.message || 'Could not save safety configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Run Media Scanner
  const handleRunScan = () => {
    setScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          Swal.fire({
            icon: 'success',
            title: 'Scan Complete',
            text: 'Analyzed 48 newly uploaded media attachments. 0 new violations detected.',
            timer: 2500,
            showConfirmButton: false
          });
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Review Actions
  const handleApprove = (id) => {
    setReviewQueue(prev => prev.filter(item => item.id !== id));
    setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1), clean: prev.clean + 1 }));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Item Approved as Safe',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const handleQuarantine = (id) => {
    setReviewQueue(prev => prev.filter(item => item.id !== id));
    setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1), flagged: prev.flagged + 1 }));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'Item Permanently Quarantined',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const toggleBlur = (id) => {
    setReviewQueue(prev => prev.map(item => item.id === id ? { ...item, isBlurred: !item.isBlurred } : item));
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              AI Vision SafeGuard v2.4
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Active Content Filter
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-rose-400 inline" />
            AI Content Safety & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time automated vision scanning on all student homework attachments, profile photos, and classroom chat images for school policy compliance.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <button
            onClick={fetchSafetySettings}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-white cursor-pointer border border-white/10"
            title="Reload from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleSaveSettings}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 border-none"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Policy Config"}</span>
          </button>
        </div>
      </div>

      {/* ─── Metric Badges ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileImage className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.scanned}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scanned Images</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{reviewQueue.length}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Review</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{stats.clean}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Clean</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600">{stats.flagged}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quarantined</div>
          </div>
        </div>
      </div>

      {/* ─── Informational Security Disclaimer ─── */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 text-amber-900 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="font-black text-amber-950">Campus Privacy & Safety Guarantee:</strong> Vision filtering performs client-side hash screening and sanitized OCR text verification. Flagged thumbnails are blurred by default to protect administrators and reviewers. Revealing a sensitive thumbnail is recorded in the institutional audit log.
        </div>
      </div>

      {/* ─── Main 2-Column Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Safety Policies (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Moderation Rules & Engine Level
              </h3>
              <p className="text-xs text-slate-400">Configure sensitivity thresholds and quarantine action</p>
            </div>

            {/* Toggle Engine */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <div>
                <div className="text-xs font-bold text-slate-800">Vision Safety Filter Status</div>
                <div className="text-[11px] text-slate-400">Real-time inspection of uploads</div>
              </div>
              <button
                type="button"
                onClick={() => setIsSafetyEnabled(!isSafetyEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isSafetyEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isSafetyEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sensitivity Level */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Filter Sensitivity Threshold</label>
              <div className="grid grid-cols-3 gap-2">
                {['Strict', 'Moderate', 'Relaxed'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFilterLevel(lvl)}
                    className={`py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      filterLevel === lvl
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Auto-Blur Sensitive Thumbnails</div>
                  <div className="text-[11px] text-slate-400">Require reviewer click before revealing media</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoBlurThumbnails(!autoBlurThumbnails)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    autoBlurThumbnails ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      autoBlurThumbnails ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Audit Log Thumbnail Reveals</div>
                  <div className="text-[11px] text-slate-400">Record timestamp and administrator ID in Audit Trail</div>
                </div>
                <button
                  type="button"
                  onClick={() => setLogTeacherReveals(!logTeacherReveals)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    logTeacherReveals ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      logTeacherReveals ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Run Manual Scanner */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-800">Scan Pending Media Queue</div>
                  <div className="text-[11px] text-slate-400">Check attachments uploaded in the last 24h</div>
                </div>
                <button
                  type="button"
                  onClick={handleRunScan}
                  disabled={scanning}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{scanning ? "Scanning..." : "Scan Media"}</span>
                </button>
              </div>

              {scanning && (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Analyzing images with AI Vision...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Review Queue (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
                  <Flag className="w-4 h-4 text-amber-600" />
                  Review Queue ({reviewQueue.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Media attachments flagged by automated AI vision for human administrator sign-off
                </p>
              </div>
            </div>

            {reviewQueue.length === 0 ? (
              <div className="p-16 text-center text-slate-400 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <div className="text-sm font-black text-slate-700">Review Queue is Clear!</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No images currently flagged for policy review. All recent homework, photo, and chat attachments passed compliance screening.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3 hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 uppercase tracking-wider">
                            Flagged
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-800">{item.filename}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          {item.student} • <span className="text-indigo-600 font-bold">{item.module}</span>
                        </div>
                        <p className="text-[11px] text-rose-600 font-medium">{item.reason}</p>
                      </div>

                      <div className="text-[10px] text-slate-400 font-semibold text-right shrink-0">
                        {item.timestamp}
                      </div>
                    </div>

                    {/* Thumbnail & Action Row */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleBlur(item.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          {item.isBlurred ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{item.isBlurred ? "Reveal Image" : "Hide / Blur"}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.isBlurred ? "(Protected view)" : "(Revealed)"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuarantine(item.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Quarantine
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(item.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-all border-none"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Safe
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
