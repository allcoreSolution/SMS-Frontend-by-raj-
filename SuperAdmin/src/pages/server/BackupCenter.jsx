import React, { useState } from 'react';
import { HardDrive, Download, RefreshCw, CheckCircle, Clock, Plus, Trash2, Shield, AlertTriangle, Database, FileArchive, Calendar, Save } from 'lucide-react';

const initBackups = [
  { id: 1, name: 'Auto Backup', type: 'Full', size: '2.4 GB', date: 'Sep 01, 2024 02:00 AM', status: 'Success', retention: '30 days' },
  { id: 2, name: 'Auto Backup', type: 'Incremental', size: '145 MB', date: 'Aug 31, 2024 02:00 AM', status: 'Success', retention: '30 days' },
  { id: 3, name: 'Manual Backup', type: 'Full', size: '2.3 GB', date: 'Aug 30, 2024 11:30 AM', status: 'Success', retention: '90 days' },
  { id: 4, name: 'Auto Backup', type: 'Incremental', size: '98 MB', date: 'Aug 29, 2024 02:00 AM', status: 'Failed', retention: '30 days' },
  { id: 5, name: 'Auto Backup', type: 'Incremental', size: '112 MB', date: 'Aug 28, 2024 02:00 AM', status: 'Success', retention: '30 days' },
];

export default function BackupCenter() {
  const [backups, setBackups] = useState(initBackups);
  const [creating, setCreating] = useState(false);
  const [creatingFiles, setCreatingFiles] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteBackup, setDeleteBackup] = useState(null);
  const [autoEnabled, setAutoEnabled] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      const newBackup = {
        id: Date.now(),
        name: 'Manual Backup',
        type: 'Full',
        size: `${(Math.random() * 0.5 + 2.2).toFixed(1)} GB`,
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'Success',
        retention: '90 days',
      };
      setBackups(prev => [newBackup, ...prev]);
      setCreating(false);
      showToast('Database backup created successfully!');
    }, 3000);
  };

  const handleCreateFiles = () => {
    setCreatingFiles(true);
    setTimeout(() => {
      setCreatingFiles(false);
      showToast('Files backup created successfully!');
    }, 3000);
  };

  const handleDelete = () => {
    setBackups(prev => prev.filter(b => b.id !== deleteBackup.id));
    setDeleteBackup(null);
    showToast('Backup deleted.', 'error');
  };

  return (
    <div className="p-6 lg:p-8 w-full bg-white min-h-screen font-sans text-slate-800">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-none shadow-lg text-white text-sm font-semibold ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <CheckCircle className="w-4 h-4" /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Backup Center</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Full-system database backups — every school and all platform data in one restorable file.
            Works on any hosting (pure PHP, no <code className="text-xs bg-slate-100 px-1 py-0.5 rounded-none">mysqldump</code> needed).
          </p>
        </div>
        <span className="flex-shrink-0 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-none tracking-wide">
          🔒 Root Admin Only
        </span>
      </div>

      {/* Demo Mode Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-none p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 font-medium">
          <span className="font-bold">Demo mode is ON</span> — creating, downloading, deleting and restoring backups is{' '}
          <span className="underline">disabled for security</span> (demo mode hands out one-click logins, so backup data must never be exposed).
          Set <code className="text-xs bg-red-100 px-1 rounded-none">APP_ENV=production</code> to re-enable.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Total Backups</p>
            <p className="text-2xl font-bold text-slate-800">{backups.length}</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Successful</p>
            <p className="text-2xl font-bold text-slate-800">{backups.filter(b => b.status === 'Success').length}</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Failed</p>
            <p className="text-2xl font-bold text-slate-800">{backups.filter(b => b.status === 'Failed').length}</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Total Size</p>
            <p className="text-2xl font-bold text-slate-800">5.1 GB</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Full Database Backups */}
        <div className="lg:col-span-2 space-y-6">

          {/* Full Database Backups Card */}
          <div className="bg-white border border-slate-300 shadow-sm rounded-none overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" /> Full Database Backups
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> DB: 111.8 MB</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Free: 71,342 MB</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 border-b border-slate-200">
              <div className="flex flex-wrap gap-3 mb-3">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-none text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {creating
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Creating...</>
                    : <><Database className="w-4 h-4" /> Create Database Backup</>}
                </button>
                <button
                  onClick={handleCreateFiles}
                  disabled={creatingFiles}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-none text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {creatingFiles
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Creating...</>
                    : <><FileArchive className="w-4 h-4" /> Create Files Backup</>}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-700">Database</span> = every school's records.{' '}
                <span className="font-bold text-slate-700">Files</span> = all uploaded media/documents in <code className="bg-slate-100 px-1 rounded-none text-[11px]">storage/</code>, zipped.
                Both run immediately — the page waits until the backup finishes. Schools stay online during backups.
              </p>
            </div>

            {creating && (
              <div className="px-5 py-3 bg-blue-50 border-b border-blue-200 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                <p className="text-sm font-semibold text-blue-800">Creating backup… Please do not close this page.</p>
              </div>
            )}

            {/* Backup History Table — Excel Lining */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#f8fafc]">
                  <tr className="border-b border-slate-300">
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200">Backup File</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200">Type</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-right">Size</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200">Created</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-center">Status</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {backups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm font-medium">
                        No full-system backups yet. Click <span className="font-bold text-slate-700">Create Database Backup</span> to take your first one.
                      </td>
                    </tr>
                  ) : backups.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-200">{b.name}</td>
                      <td className="px-4 py-3 border-r border-slate-200">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none border ${b.type === 'Full' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                          {b.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-600 border-r border-slate-200">{b.size}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-500 border-r border-slate-200">{b.date}</td>
                      <td className="px-4 py-3 text-center border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${b.status === 'Success' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {b.status === 'Success'
                            ? <><CheckCircle className="w-3.5 h-3.5" /> Success</>
                            : <><Clock className="w-3.5 h-3.5" /> Failed</>}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {b.status === 'Success' && (
                            <button className="p-1.5 hover:bg-slate-100 rounded-none text-slate-500 transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => setDeleteBackup(b)} className="p-1.5 hover:bg-red-50 rounded-none text-slate-400 hover:text-red-500 transition-colors" title="Delete">
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
        </div>

        {/* Right: Automatic Backups Schedule */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-300 shadow-sm rounded-none overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Automatic Backups
              </h2>
              <button
                onClick={() => setAutoEnabled(p => !p)}
                className={`px-3 py-1 rounded-none text-[10px] font-bold tracking-wider uppercase transition-all border ${autoEnabled ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-500 border-slate-300'}`}
              >
                {autoEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Enable toggle row */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setAutoEnabled(p => !p)}
                  className={`w-10 h-5 rounded-none transition-colors relative cursor-pointer ${autoEnabled ? 'bg-slate-800' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-none shadow transition-transform ${autoEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}></span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Enable scheduled full backups</span>
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Frequency</label>
                <select disabled={!autoEnabled} className="w-full border border-slate-200 rounded-none px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white disabled:opacity-50 disabled:bg-slate-50">
                  <option>Daily</option>
                  <option selected>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Day (weekly)</label>
                <select disabled={!autoEnabled} className="w-full border border-slate-200 rounded-none px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white disabled:opacity-50 disabled:bg-slate-50">
                  <option>Sunday</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Time (server time)</label>
                <input
                  type="time"
                  defaultValue="02:30"
                  disabled={!autoEnabled}
                  className="w-full border border-slate-200 rounded-none px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white disabled:opacity-50 disabled:bg-slate-50"
                />
                <p className="text-[11px] text-slate-400 font-medium mt-1.5">Pick a quiet hour, e.g. 02:30.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Keep backups for (days)</label>
                <input
                  type="number"
                  defaultValue={14}
                  disabled={!autoEnabled}
                  className="w-full border border-slate-200 rounded-none px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white disabled:opacity-50 disabled:bg-slate-50"
                />
                <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                  When the scheduled backup runs, <span className="font-bold text-slate-500">all backups older than this</span> (manual too) are deleted — download the ones you want to keep.
                </p>
              </div>

              <button
                onClick={() => showToast('Schedule saved successfully!')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-none transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteBackup && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-none flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="font-bold text-slate-900 text-base">Delete Backup?</h2>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Delete backup from <span className="font-bold text-slate-800">{deleteBackup.date}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteBackup(null)} className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-none text-sm font-bold text-slate-700 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-none text-sm font-bold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
