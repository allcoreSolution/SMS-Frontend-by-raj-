import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, GitMerge, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const YearEndRollover = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fromSessionId, setFromSessionId] = useState('');
  const [toSessionId, setToSessionId] = useState('');
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [sessRes, classRes] = await Promise.all([
        academicService.getSessions(),
        academicService.getClasses()
      ]);

      if (sessRes.success) {
        const allSessions = sessRes.data || [];
        setSessions(allSessions);
        const curr = allSessions.find(s => s.isCurrent || s.status === 'Current');
        if (curr) setFromSessionId(curr._id);
        const upcoming = allSessions.find(s => s.status === 'Upcoming' || !s.isCurrent);
        if (upcoming) setToSessionId(upcoming._id);
      }

      if (classRes.success) {
        const clsList = classRes.data || [];
        setClasses(clsList);

        // Generate default progression
        // Sort by numericValue
        const sorted = [...clsList].sort((a, b) => (a.numericValue || 0) - (b.numericValue || 0));
        const initialMap = sorted.map((c, idx) => {
          const nextClass = sorted[idx + 1];
          const isHighest = idx === sorted.length - 1;
          return {
            classId: c._id,
            className: c.className,
            enrolledCount: c.enrolledCount || 0,
            action: isHighest ? 'graduate' : 'promote',
            toClassId: nextClass ? nextClass._id : ''
          };
        });
        setMappings(initialMap);
      }
    } catch (err) {
      console.error('Failed to load rollover data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionChange = (classId, action) => {
    setMappings(prev => prev.map(m => {
      if (m.classId === classId) {
        return {
          ...m,
          action,
          toClassId: action === 'graduate' || action === 'hold' ? '' : m.toClassId
        };
      }
      return m;
    }));
  };

  const handleToClassChange = (classId, toClassId) => {
    setMappings(prev => prev.map(m => {
      if (m.classId === classId) {
        return { ...m, toClassId, action: 'promote' };
      }
      return m;
    }));
  };

  const handleExecuteRollover = async () => {
    if (!toSessionId) {
      Swal.fire({
        title: 'Target Session Required',
        text: 'Please select the destination academic year session.',
        icon: 'warning',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Execute Year-End Rollover?',
      text: 'This will advance all eligible students to their mapped next classes and link them to the new session. Do you wish to proceed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Execute Rollover',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        setSubmitting(true);
        const payload = {
          targetSessionId: toSessionId,
          mappings: mappings.map(m => ({
            fromClassId: m.classId,
            toClassId: m.toClassId,
            action: m.action
          }))
        };

        const res = await academicService.executeYearEndRollover(payload);
        if (res.success) {
          await Swal.fire({
            title: 'Rollover Completed!',
            text: res.message || 'Students have been successfully promoted and enrolled for the new academic year.',
            icon: 'success',
            customClass: { popup: 'rounded-2xl' }
          });
          navigate('/academics/sessions');
        }
      } catch (err) {
        Swal.fire({
          title: 'Rollover Error',
          text: err.response?.data?.message || 'Failed to complete rollover',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={() => navigate('/academics/sessions')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sessions
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Year-End Rollover
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Bulk Cohort Transition
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Batch promote grade levels into the next academic session or mark senior batches as alumni.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Info Banner */}
        <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-5 flex items-start gap-3.5 shadow-xs">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 leading-relaxed">
            <strong>How Rollover Works:</strong> Choose your current school year and target upcoming session.
            Each class will advance its roster to the selected higher class. Senior-most classes will automatically be transitioned to Graduate/Exit status. You can customize actions per grade below.
          </div>
        </div>

        {/* Sessions Selector Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-indigo-600" /> Session Progression Scope
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                From Session (Current School Year)
              </label>
              <select
                value={fromSessionId}
                onChange={(e) => setFromSessionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
              >
                {sessions.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.isCurrent ? '(Current Live Session)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                To Target Session (Next School Year) <span className="text-red-500">*</span>
              </label>
              <select
                value={toSessionId}
                onChange={(e) => setToSessionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
              >
                <option value="">-- Select Target Academic Session --</option>
                {sessions.filter(s => s._id !== fromSessionId).map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Progression Table Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Grade-to-Grade Progression Mapping
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {mappings.length} Classes configured
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Source Grade</th>
                  <th className="py-3 px-4 text-center">Active Roster</th>
                  <th className="py-3 px-4">Action Mode</th>
                  <th className="py-3 px-5">Target Destination Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mappings.map((m) => (
                  <tr key={m.classId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {m.className}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {m.enrolledCount} Students
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`action-${m.classId}`}
                            checked={m.action === 'promote'}
                            onChange={() => handleActionChange(m.classId, 'promote')}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-xs font-semibold text-slate-700">Promote</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`action-${m.classId}`}
                            checked={m.action === 'graduate'}
                            onChange={() => handleActionChange(m.classId, 'graduate')}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs font-semibold text-emerald-700">Graduate</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`action-${m.classId}`}
                            checked={m.action === 'hold'}
                            onChange={() => handleActionChange(m.classId, 'hold')}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-xs font-semibold text-amber-700">Hold</span>
                        </label>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      {m.action === 'promote' ? (
                        <select
                          value={m.toClassId}
                          onChange={(e) => handleToClassChange(m.classId, e.target.value)}
                          className="w-full max-w-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-700 bg-white"
                        >
                          <option value="">-- Select Target Grade --</option>
                          {classes.map(c => (
                            <option key={c._id} value={c._id}>{c.className}</option>
                          ))}
                        </select>
                      ) : m.action === 'graduate' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Batch as Alumni / Exited
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">
                          <AlertTriangle className="w-3.5 h-3.5" /> Skip Batch (Stay in {m.className})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Double check mappings before proceeding with rollover execution.
            </div>
            <button
              onClick={handleExecuteRollover}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              <GitMerge className="w-4 h-4" /> {submitting ? 'Executing...' : 'Run Year-End Rollover'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearEndRollover;
