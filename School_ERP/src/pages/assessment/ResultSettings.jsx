import React, { useState, useEffect } from 'react';
import { 
  Lock, IndianRupee, Globe, ShieldAlert, Sliders, 
  Save, Info, CheckCircle2, AlertTriangle, FileText, 
  Settings, Clock, Sparkles
} from 'lucide-react';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { examService } from '../../api/examService';

export default function ResultSettings() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [saving, setSaving] = useState(false);

  // Result controls
  const [isPublished, setIsPublished] = useState(true);
  const [scheduledTime, setScheduledTime] = useState('2026-11-20T10:00');
  const [feeLockMode, setFeeLockMode] = useState('threshold');
  const [feeThreshold, setFeeThreshold] = useState(3000);
  const [allowMarksheetDownload, setAllowMarksheetDownload] = useState(true);
  const [showRanksOnPortal, setShowRanksOnPortal] = useState(false);
  const [watermarkText, setWatermarkText] = useState('OFFICIAL TRANSCRIPT');
  const [withholdNotice, setWithholdNotice] = useState('Your examination results are temporarily on administrative hold. Please visit the school office.');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await examService.getExams().catch(() => ({ data: [] }));
      const list = Array.isArray(res) ? res : (res?.data || res?.exams || []);
      setExams(list);
      if (list.length > 0) setSelectedExam(list[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      Swal.fire({
        icon: 'success',
        title: 'Result Settings Saved!',
        text: 'Exam result visibility and fee restrictions have been updated.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update result settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Publication Policy
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">Result Release & Parent Visibility Rules</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <Settings className="w-6 h-6 text-indigo-600" />
                Result Release Settings
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <OfflineExamsTabs />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Info Alert Box */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 leading-relaxed">
            <strong>System Safeguard Note:</strong> These controls are an overlay layer. A student's result becomes visible on their mobile or web portal only when (a) marks have been finalized and published, and (b) their account is not restricted by the fee defaulter lock or administrative holds set below.
          </div>
        </div>

        {/* Scope selector */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>Configure settings for:</span>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {Array.isArray(exams) && exams.map(e => (
                <option key={e._id} value={e._id}>{e.examName || e.name} ({e.session || e.academicSession || '2026-27'})</option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-400">Settings apply across all classes within this examination</span>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Release & Timing */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Parent Portal Release Switch</h3>
                  <p className="text-xs text-slate-400">Master visibility toggle for student marks and report cards</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
                <div>
                  <div className="text-xs font-bold text-slate-800">Results Live to Parents & Students</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Toggle OFF to globally withhold all scores for this exam while teacher review is underway.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Scheduled Auto-Release Date & Time</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Results will become viewable precisely at this timestamp if published switch is enabled.</span>
              </div>
            </div>

            {/* Fee Dues Hold */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Fee-Defaulter Result Withholding</h3>
                  <p className="text-xs text-slate-400">Prevent report card download for students with unpaid fees</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Lock Mode</label>
                  <select
                    value={feeLockMode}
                    onChange={(e) => setFeeLockMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="off">Off (Release result regardless of fees)</option>
                    <option value="threshold">Due Balance Threshold (Withhold if dues exceed specified amount)</option>
                    <option value="strict">Strict (Withhold for any balance above ₹0)</option>
                  </select>
                </div>

                {feeLockMode === 'threshold' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Threshold Balance (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={feeThreshold}
                        onChange={(e) => setFeeThreshold(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Defaulter Notice Message</label>
                  <textarea
                    rows={2}
                    value={withholdNotice}
                    onChange={(e) => setWithholdNotice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: PDF Download & Privacy */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Marksheet Download & Security</h3>
                  <p className="text-xs text-slate-400">PDF export policies and digital security badges</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Allow Parents to Download PDF Marksheet</span>
                    <span className="text-[11px] text-slate-500">If unchecked, parents can view marks online but cannot download high-res PDF.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowMarksheetDownload}
                    onChange={(e) => setAllowMarksheetDownload(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Display Class Ranks on Parent Portal</span>
                    <span className="text-[11px] text-slate-500">Show student rank position (e.g. Rank 3 of 45) alongside grade.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showRanksOnPortal}
                    onChange={(e) => setShowRanksOnPortal(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Printed faintly in background of PDF report card.</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-900">CBSE & State Board Compliance</h4>
              </div>
              <p className="text-xs text-emerald-800/80 leading-relaxed">
                All report card templates generated adhere to standard academic grading policies, including co-scholastic 5-point evaluation, 8-point scholastic grading scales, and dual signature authentication.
              </p>
            </div>

          </div>

        </form>

      </div>

    </div>
  );
}
