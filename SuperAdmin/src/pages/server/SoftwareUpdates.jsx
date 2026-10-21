import React, { useState, useRef } from 'react';
import { RefreshCw, CheckCircle, Download, AlertTriangle, Package, Upload, Shield, BookOpen, History, UploadCloud } from 'lucide-react';

const initHistory = [
  { id: 1, when: 'Sep 01, 2024 11:32 AM', version: 'v3.1.5 → v3.2.0', result: 'Success', by: 'Super Admin' },
  { id: 2, when: 'Aug 10, 2024 02:15 AM', version: 'v3.1.0 → v3.1.5', result: 'Success', by: 'Auto Updater' },
  { id: 3, when: 'Jul 15, 2024 09:44 AM', version: 'v3.0.0 → v3.1.0', result: 'Rolled Back', by: 'Super Admin' },
  { id: 4, when: 'Jun 01, 2024 06:00 AM', version: 'v2.9.8 → v3.0.0', result: 'Success', by: 'Super Admin' },
];

export default function SoftwareUpdates() {
  const [deploying, setDeploying] = useState(false);
  const [checking, setChecking] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      setUploadedFile(file);
    } else {
      showToast('Please drop a valid .zip update package.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
  };

  const handleDeploy = () => {
    if (!uploadedFile) { showToast('Please upload an update.zip package first.', 'error'); return; }
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      setUploadedFile(null);
      showToast('Update deployed successfully! Platform is now on v3.7.0-beta.');
    }, 3500);
  };

  const handleCheckUpdates = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      showToast('You are running the latest version.');
    }, 2000);
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Software Updates</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Install a new version of the platform by uploading a pre-built{' '}
            <code className="text-xs bg-slate-100 border border-slate-200 px-1 rounded-none">.zip</code>{' '}
            package — no SSH or cPanel file access needed. Every deploy and rollback is recorded below.
          </p>
        </div>
        <span className="flex-shrink-0 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-none tracking-wide">
          🔒 Root Admin Only
        </span>
      </div>

      {/* Platform Update Manager Card */}
      <div className="border border-slate-300 rounded-none overflow-hidden shadow-sm mb-8">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-slate-500" /> Platform Update Manager
          </h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-none">v3.7.0-beta</span>
            <button
              onClick={handleCheckUpdates}
              disabled={checking}
              className="text-slate-500 hover:text-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-slate-200 bg-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium max-w-2xl">
              Upload a pre-built <code className="bg-slate-100 px-1 rounded-none text-[11px]">.zip</code> update package.
              The system will safely upload in chunks, verify integrity, extract files, run database migrations, and clear all caches automatically.
              No SSH access required. <span className="font-bold text-slate-700">Handles large files.</span>
            </p>
            <div className="flex items-center gap-3 text-[11px] font-bold flex-wrap">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-none">
                <CheckCircle className="w-3 h-3" /> Max Upload: 4096M
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-none">
                ⏱ Timeout: 300s
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-none">
                <CheckCircle className="w-3 h-3" /> ZIP: OK
              </span>
            </div>
          </div>
        </div>

        {/* Safety Net Banner */}
        <div className="p-5 border-b border-slate-200 bg-emerald-50/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-100 border border-emerald-200 rounded-none flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Automatic Safety Net — Snapshot Before Every Deploy
              </p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Before a single file is touched, the system automatically creates a{' '}
                <span className="font-bold text-slate-800">full database snapshot</span>{' '}
                (every school, every table) and a{' '}
                <span className="font-bold text-slate-800">backup of every file that will be overwritten.</span>{' '}
                If the snapshot fails, the deploy is aborted with your application untouched.
                If anything goes wrong after, one-click{' '}
                <span className="font-bold text-slate-800">Rollback</span>{' '}
                restores files and the database to the exact pre-update state.
              </p>
              <p className="text-xs text-amber-700 font-medium mt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-bold">Still recommended:</span> keep a recent off-server backup (cPanel / phpMyAdmin export) — an on-server snapshot cannot protect against disk failure or a full server outage.
              </p>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="p-5 bg-white">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-none p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragOver ? 'border-slate-500 bg-slate-50' : uploadedFile ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
            }`}
          >
            <input ref={fileRef} type="file" accept=".zip" className="hidden" onChange={handleFileChange} />
            <Upload className={`w-10 h-10 mb-3 ${uploadedFile ? 'text-emerald-500' : 'text-slate-400'}`} />
            {uploadedFile ? (
              <>
                <p className="text-sm font-bold text-emerald-700">{uploadedFile.name}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB) — ready to deploy</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-700">Drop your update.zip here</p>
                <p className="text-xs text-slate-500 font-medium mt-1">or click to browse — uploads in small chunks (works with any server limit)</p>
              </>
            )}
          </div>

          {/* Deploy Button + Help */}
          <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
            <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white px-4 py-2 rounded-none transition-all">
              <BookOpen className="w-4 h-4" /> How to Prepare an Update Package
            </button>
            <button
              onClick={handleDeploy}
              disabled={deploying || !uploadedFile}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-none text-sm font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {deploying
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Deploying...</>
                : <><Upload className="w-4 h-4" /> Deploy Update</>}
            </button>
          </div>

          {deploying && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-none p-4 flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
              <p className="text-sm font-semibold text-blue-800">Deploying update… Please do not close this page. This may take a few minutes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Update History Table */}
      <div className="border border-slate-300 rounded-none overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-300 bg-slate-50 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-800">Update History</h2>
        </div>

        {/* Excel-style Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#f8fafc]">
              <tr className="border-b border-slate-300">
                <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200">When</th>
                <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200">Version</th>
                <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-center">Result</th>
                <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {initHistory.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium text-slate-500 border-r border-slate-200 whitespace-nowrap">{h.when}</td>
                  <td className="px-4 py-3 font-bold text-slate-800 font-mono text-xs border-r border-slate-200">{h.version}</td>
                  <td className="px-4 py-3 text-center border-r border-slate-200">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-none border ${
                      h.result === 'Success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {h.result === 'Success' ? <CheckCircle className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                      {h.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-600">{h.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
