import React, { useState } from 'react';
import { 
  PieChart as PieChartIcon, HardDrive, Image as ImageIcon, Database, Trophy,
  RefreshCw, Smartphone, Globe, User, Image, FileText, UploadCloud, Folder, Key, Users, BookOpen, CreditCard, LayoutTemplate, PenTool,
  Hourglass, Zap, Search
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function StorageCenter() {
  const [rescanning, setRescanning] = useState(false);

  const handleRescan = () => {
    setRescanning(true);
    setTimeout(() => setRescanning(false), 2000);
  };

  const composition = [
    { name: 'App Distribution', size: '274.83 MB', percent: 41, color: '#334155' },
    { name: 'Website & Content', size: '102.61 MB', percent: 15.3, color: '#475569' },
    { name: 'Students', size: '83.82 MB', percent: 12.5, color: '#64748b' },
    { name: 'Branding', size: '47.13 MB', percent: 7, color: '#94a3b8' },
    { name: 'Academics', size: '43.08 MB', percent: 6.4, color: '#cbd5e1' },
    { name: 'Finance & Fees', size: '38.27 MB', percent: 5.7, color: '#e2e8f0' },
    { name: 'Other', size: '19.47 MB', percent: 2.9, color: '#f1f5f9' },
    { name: 'Other (7)', size: '60.95 MB', percent: 9.1, color: '#f8fafc' },
  ];

  const modules = [
    { folder: 'App Releases', path: 'app-releases', module: 'App Distribution', files: 4, size: '273.83 MB', share: 40.9, icon: Smartphone },
    { folder: 'School Websites', path: 'school-website', module: 'Website & Content', files: 151, size: '50.3 MB', share: 7.5, icon: Globe },
    { folder: 'Student Photos', path: 'student_photos', module: 'Students', files: 155, size: '44.66 MB', share: 6.7, icon: User },
    { folder: 'Logos', path: 'logos', module: 'Branding', files: 141, size: '43.79 MB', share: 6.5, icon: Image },
    { folder: 'Landing Page', path: 'landing-page', module: 'Website & Content', files: 68, size: '34.91 MB', share: 5.2, icon: LayoutTemplate },
    { folder: 'Payment Proofs', path: 'payment_proofs', module: 'Finance & Fees', files: 67, size: '34.29 MB', share: 5.1, icon: CreditCard },
    { folder: 'Student Documents', path: 'student_documents', module: 'Students', files: 56, size: '32.42 MB', share: 4.8, icon: FileText },
    { folder: 'Homework Submissions', path: 'homework_submissions', module: 'Academics', files: 41, size: '22.32 MB', share: 3.3, icon: BookOpen },
    { folder: 'Photo Gallery', path: 'gallery', module: 'Website & Content', files: 53, size: '16.19 MB', share: 2.4, icon: Image },
    { folder: 'Parent Photos', path: 'parent_photos', module: 'Other', files: 35, size: '13 MB', share: 1.9, icon: Users },
  ];

  const fileTypeData = [
    { name: 'Images', files: '1,038', size: '334.23 MB', value: 334.23, color: '#475569' },
    { name: 'Other', files: '7', size: '274.18 MB', value: 274.18, color: '#94a3b8' },
    { name: 'Pdf', files: '213', size: '51.08 MB', value: 51.08, color: '#cbd5e1' },
    { name: 'Documents', files: '183', size: '10.69 MB', value: 10.69, color: '#e2e8f0' },
  ];

  const dbTables = [
    { name: 'audits', rows: '8,733', data: '11.33 MB', idx: '3.03 MB', total: '14.36 MB', share: 12.8 },
    { name: 'certificates', rows: '783', data: '10.41 MB', idx: '176 KB', total: '10.58 MB', share: 9.5 },
    { name: 'notification_deliverability_logs', rows: '6,394', data: '7.25 MB', idx: '3.23 MB', total: '10.48 MB', share: 9.4 },
    { name: 'generated_documents', rows: '91', data: '9.08 MB', idx: '64 KB', total: '9.14 MB', share: 8.2 },
    { name: 'vehicle_trackings', rows: '33,326', data: '3.52 MB', idx: '2.86 MB', total: '6.38 MB', share: 5.7 }
  ];

  const otherStorage = [
    { name: 'Database Backups', files: 218, size: '305.33 MB', icon: Database },
    { name: 'Framework Cache', files: 200, size: '1.8 MB', icon: RefreshCw },
    { name: 'Application Logs', files: 5, size: '1.54 MB', icon: FileText },
    { name: 'Temporary Files', files: 0, size: '0 B', icon: Folder },
    { name: 'Updates & App Dist', files: 0, size: '0 B', icon: UploadCloud },
  ];

  const largestFiles = [
    { name: 'app-releases/20240711...Staff-PWS-v3.apk', size: '93.73 MB' },
    { name: 'app-releases/20240711...StudentParent-v3.apk', size: '88.07 MB' },
    { name: 'app-releases/20240711...Bus-Driver-v2.apk', size: '46.16 MB' },
    { name: 'app-releases/20240711...Biometric_Setup.exe', size: '45.86 MB' },
    { name: 'student_photos/d10fJ...mLAy.jpg', size: '10.64 MB' },
    { name: 'osm/7e39fd02-384a-4e...692.jpg', size: '6.54 MB' },
    { name: 'homework_submissions/19xfp...c...pdf', size: '3.87 MB' },
    { name: 'student_documents/DeWUl...KAc...pdf', size: '3.53 MB' },
  ];

  return (
    <div className="p-6 lg:p-8 w-full bg-white min-h-screen text-slate-800 font-sans">
      
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Storage Center</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Monitor and manage platform storage capacity</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">Last scanned: 11 hours ago</p>
          <button onClick={handleRescan} disabled={rescanning}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-none text-sm font-semibold transition-all shadow-sm disabled:opacity-75">
            <RefreshCw className={`w-4 h-4 ${rescanning ? 'animate-spin' : ''}`} />
            {rescanning ? 'Scanning...' : 'Rescan now'}
          </button>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 flex-shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="w-full">
              <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Disk Used</p>
              <p className="text-2xl font-bold text-slate-800 mb-2">28.1%</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-none mb-1">
                <div className="h-full bg-slate-700 rounded-none" style={{ width: '28.1%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">27.18 GB used &middot; 69.55 GB free</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex items-center gap-4">
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 flex-shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Media Files</p>
            <p className="text-2xl font-bold text-slate-800">670.17 MB</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">1,441 files total</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex items-center gap-4">
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Database Size</p>
            <p className="text-2xl font-bold text-slate-800">111.77 MB</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">134,849 rows &middot; 393 tables</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 shadow-sm rounded-none flex items-center gap-4">
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 flex-shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Largest Module</p>
            <p className="text-lg font-bold text-slate-800 truncate">App Distribution</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1.5">274.83 MB allocated</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Storage by Module Card */}
          <div className="bg-white border border-slate-300 shadow-sm rounded-none overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">Storage by Module</h2>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded-none border-slate-300 text-slate-700 focus:ring-slate-700" />
                Show empty folders
              </label>
            </div>
            <div className="overflow-x-auto">
              {/* Proper Excel Lining: divide-y and divide-x */}
              <table className="w-full text-sm text-left border-collapse border-b-0 border-slate-200">
                <thead className="bg-[#f8fafc]">
                  <tr className="border-b border-slate-300">
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 w-1/3">Folder</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200">Module</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-right">Files</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-right">Size</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 text-right w-32">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {modules.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 border-r border-slate-200">
                        <div className="flex items-center gap-3 w-full max-w-[200px]">
                          <m.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{m.folder}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{m.path}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600">
                          {m.module}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-600 border-r border-slate-200">{m.files}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800 border-r border-slate-200">{m.size}</td>
                      <td className="px-4 py-3 text-right text-[11px] font-medium text-slate-600">
                        {m.share}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Tables Card */}
          <div className="bg-white border border-slate-300 shadow-sm rounded-none overflow-hidden mt-8">
            <div className="px-5 py-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">Database Tables</h2>
              <span className="text-xs font-semibold text-slate-500">Top 20 &middot; 111.77 MB total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#f8fafc]">
                  <tr className="border-b border-slate-300">
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200">Table</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-right">Rows</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-right">Data</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-right">Index</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 border-r border-slate-200 text-right">Total</th>
                    <th className="px-4 py-3 text-[11px] uppercase font-bold text-slate-600 text-right w-32">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dbTables.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-200">{t.name}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-600 border-r border-slate-200">{t.rows}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-500 border-r border-slate-200">{t.data}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-500 border-r border-slate-200">{t.idx}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800 border-r border-slate-200">{t.total}</td>
                      <td className="px-4 py-3 text-right text-[11px] font-medium text-slate-600">{t.share}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Storage Composition Classic Line */}
          <div className="bg-white border border-slate-300 shadow-sm rounded-none p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-200 pb-3">Composition overview</h2>
            <div className="w-full h-4 rounded-none overflow-hidden flex mb-4 border border-slate-200">
              {composition.map((c, i) => (
                <div key={i} style={{ width: `${c.percent}%`, backgroundColor: c.color }} className="h-full border-r border-white/20 last:border-0" title={`${c.name} (${c.percent}%)`}></div>
              ))}
            </div>
            <div className="space-y-2">
              {composition.map((c, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-none inline-block" style={{ backgroundColor: c.color }}></span>
                    <span className="font-semibold text-slate-700">{c.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono">{c.size} ({c.percent}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Other Storage */}
          <div className="bg-white border border-slate-300 shadow-sm rounded-none overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-300 bg-slate-50">
               <h2 className="text-sm font-bold text-slate-800">Other Storage Areas</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {otherStorage.map((o, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <o.icon className="w-4 h-4 text-slate-400" /> {o.name}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-800">{o.size}</span>
                    <span className="text-[10px] text-slate-500">{o.files} files</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Largest Files Table Style */}
          <div className="bg-white border border-slate-300 shadow-sm rounded-none overflow-hidden">
             <div className="px-5 py-4 border-b border-slate-300 bg-slate-50">
               <h2 className="text-sm font-bold text-slate-800">Largest Files</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <tbody className="divide-y divide-slate-200">
                  {largestFiles.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 border-r border-slate-200">
                         <span className="text-[11px] font-mono text-slate-500 break-all">{f.name}</span>
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-slate-700 text-xs whitespace-nowrap">
                        {f.size}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Optimize & Clean Up Section (Full Width) */}
      <div className="mt-8 bg-white border border-slate-300 shadow-sm rounded-none p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">System Optimization Tools</h2>
            <p className="text-sm text-slate-500 mt-1">Actions below only target non-essential cache, logs, and temp files.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-slate-300 hover:bg-slate-50 rounded-none transition-all shadow-sm">
            <Hourglass className="w-5 h-5 text-slate-600 mb-1" />
            <span className="text-sm font-bold text-slate-800">Clear Temp Files</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-slate-300 hover:bg-slate-50 rounded-none transition-all shadow-sm">
            <FileText className="w-5 h-5 text-slate-600 mb-1" />
            <span className="text-sm font-bold text-slate-800">Prune Old Logs</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-slate-300 hover:bg-slate-50 rounded-none transition-all shadow-sm">
            <Zap className="w-5 h-5 text-slate-600 mb-1" />
            <span className="text-sm font-bold text-slate-800">Clear Compiled Cache</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-slate-300 hover:bg-slate-50 rounded-none transition-all shadow-sm">
            <Search className="w-5 h-5 text-slate-600 mb-1" />
            <span className="text-sm font-bold text-slate-800">Review Orphans</span>
          </button>
        </div>
      </div>
    </div>
  );
}
