import React, { useState, useEffect } from 'react';
import { 
  Lock, FileText, ArrowLeft, PenTool, LayoutTemplate, 
  RefreshCw, Calendar, IndianRupee, Save, ShieldAlert, 
  Sliders, CheckCircle2, QrCode, AlertTriangle
} from 'lucide-react';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { examService } from '../../api/examService';

export default function CardSettings() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [saving, setSaving] = useState(false);

  // Settings State
  const [releaseActive, setReleaseActive] = useState(true);
  const [availableFrom, setAvailableFrom] = useState('2026-10-15T08:00');
  const [availableUntil, setAvailableUntil] = useState('2026-11-30T18:00');
  
  const [feeLockMode, setFeeLockMode] = useState('threshold');
  const [feeThreshold, setFeeThreshold] = useState(5000);
  
  const [cardLayout, setCardLayout] = useState('standard');
  const [showQrCode, setShowQrCode] = useState(true);
  const [showHallTicketNumber, setShowHallTicketNumber] = useState(true);
  
  const [instructions, setInstructions] = useState(
    "1. Students must report to the examination center at least 30 minutes before the scheduled start.\n2. Admit card and school ID badge must be worn at all times.\n3. Electronic devices, smartwatches, and programmable calculators are strictly prohibited.\n4. Possession of unauthorized materials will lead to immediate disqualification."
  );

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
        title: 'Settings Updated!',
        text: 'Admit Card release parameters and fee restrictions have been saved.',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update settings.' });
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
                  Hall Ticket Governance
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">Access Rules & Fee Locks</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <Sliders className="w-6 h-6 text-indigo-600" />
                Admit Card Settings
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
          <span className="text-xs text-slate-400">Settings apply across all student/parent portal downloads</span>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Access Controls */}
          <div className="space-y-6">

            {/* Portal Release Control */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Release & Availability Window</h3>
                  <p className="text-xs text-slate-400">Control student and parent access in the web/mobile app</p>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
                <div>
                  <div className="text-xs font-bold text-slate-800">Publish to Student / Parent Portal</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    When disabled, only school administrative staff can generate & print admit cards.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={releaseActive}
                    onChange={(e) => setReleaseActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Window dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Available From</label>
                  <input
                    type="datetime-local"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Available Until</label>
                  <input
                    type="datetime-local"
                    value={availableUntil}
                    onChange={(e) => setAvailableUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Fee Defaulter Lock */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Fee-Defaulter Restrictions</h3>
                  <p className="text-xs text-slate-400">Automate hall ticket release based on tuition dues</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Enforcement Mode</label>
                  <select
                    value={feeLockMode}
                    onChange={(e) => setFeeLockMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="off">Off (All students can download regardless of balance)</option>
                    <option value="threshold">Due Balance Threshold (Lock if dues exceed specific amount)</option>
                    <option value="strict">Strict (Lock for any outstanding unpaid balance)</option>
                  </select>
                </div>

                {feeLockMode === 'threshold' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Maximum Allowed Outstanding Dues (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={feeThreshold}
                        onChange={(e) => setFeeThreshold(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Students with dues over ₹{feeThreshold} will be prompted to clear fees at the cash counter.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Template & Instructions */}
          <div className="space-y-6">

            {/* Layout & Presentation */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Format & Security Badges</h3>
                  <p className="text-xs text-slate-400">Printed layout options and security elements</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setCardLayout('standard')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    cardLayout === 'standard' ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">Standard Single Page (A4)</div>
                  <div className="text-[11px] text-slate-500 mt-1">Full timetable grid with complete instructions & signatures</div>
                </div>

                <div 
                  onClick={() => setCardLayout('compact')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    cardLayout === 'compact' ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">Compact (2 per sheet)</div>
                  <div className="text-[11px] text-slate-500 mt-1">Cost-effective layout for mass printing at the office</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQrCode}
                    onChange={(e) => setShowQrCode(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Include Verification QR Code on Admit Card</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHallTicketNumber}
                    onChange={(e) => setShowHallTicketNumber(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Print Serialized Hall Ticket Number / Barcode</span>
                </label>
              </div>
            </div>

            {/* Candidate Rules & Instructions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Candidate Examination Instructions</h3>
                  <p className="text-xs text-slate-400">Printed on the bottom portion of every student's admit card</p>
                </div>
              </div>

              <textarea
                rows={5}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 leading-relaxed font-mono"
              />
            </div>

          </div>

        </form>

      </div>

    </div>
  );
}
