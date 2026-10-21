import React, { useState } from 'react';
import { 
  Activity, Cpu, Server, HardDrive, Code, 
  Stethoscope, Plug, FileText, LayoutGrid, 
  Settings, Wrench, BarChart2, Database,
  Gauge, Puzzle
} from 'lucide-react';

export default function ServerHealth() {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview', icon: LayoutGrid },
    { name: 'Self-Tests', icon: Stethoscope },
    { name: 'Compatibility Matrix', icon: Plug },
    { name: 'Maintenance', icon: Wrench },
    { name: 'Diagnostics', icon: BarChart2 },
    { name: 'Log Explorer', icon: FileText },
  ];

  const phpExtensions = [
    'Core', 'PDO', 'Phar', 'Reflection', 'SPL', 'SimpleXML', 'Zend OPcache', 'bcmath',
    'cgi-fcgi', 'ctype', 'curl', 'date', 'dom', 'exif', 'fileinfo', 'filter', 'ftp', 'gd',
    'gettext', 'hash', 'iconv', 'igbinary', 'imagick', 'imap', 'intl', 'json', 'libxml',
    'mbstring', 'mysqli', 'mysqlnd', 'openssl', 'pcntl', 'pcre', 'pdo_mysql', 'pdo_sqlite',
    'posix', 'random', 'redis', 'session', 'shmop', 'soap', 'sockets', 'sodium', 'sqlite3',
    'standard', 'sysvsem', 'tokenizer', 'xml', 'xmlreader', 'xmlwriter', 'zip', 'zlib'
  ];

  return (
    <div className="p-6 lg:p-8 w-full bg-white min-h-screen font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Server Health</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Real-time metrics and system stability</p>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* CPU Load */}
        <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">CPU Load</p>
            <p className="text-xl font-bold text-slate-800">2.02 (1m avg)</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* RAM Usage */}
        <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">RAM Usage</p>
            <p className="text-xl font-bold text-slate-800 mb-2">43%</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-none overflow-hidden mb-1">
              <div className="h-full bg-slate-700 rounded-none" style={{ width: '43%' }} />
            </div>
            <p className="text-[10px] text-slate-500 font-medium">7.8 GB total</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <Server className="w-5 h-5" />
          </div>
        </div>

        {/* Storage */}
        <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Storage</p>
            <p className="text-xl font-bold text-slate-800 mb-2">28%</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-none overflow-hidden mb-1">
              <div className="h-full bg-slate-700 rounded-none" style={{ width: '28%' }} />
            </div>
            <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">27.06 GB used</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        {/* PHP Version */}
        <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">PHP Version</p>
            <p className="text-xl font-bold text-slate-800">8.3.31</p>
          </div>
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-500 bg-slate-50 shrink-0">
            <Code className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Middle 3 Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-600 bg-white shadow-sm shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Self-Tests</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">All systems healthy</p>
          </div>
        </div>
        
        <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-600 bg-white shadow-sm shrink-0">
            <Plug className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Hosting Compatibility</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">1 blocking issues</p>
          </div>
        </div>

        <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 border border-slate-200 rounded-none flex items-center justify-center text-slate-600 bg-white shadow-sm shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Log Files</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">3 files (0.5 MB)</p>
          </div>
        </div>

      </div>

      {/* Main Content Area (Tabs + Panels) */}
      <div className="bg-white rounded-none border border-slate-200 shadow-sm min-h-[500px]">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-[#f8fafc]">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap border-b-2
                ${activeTab === tab.name 
                  ? 'border-slate-800 text-slate-900 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.name ? 'text-slate-900' : 'text-slate-400'}`} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Column 1: Database & PHP */}
            <div className="space-y-8">
              
              {/* Database Health & Footprint Table */}
              <div className="border border-slate-200 rounded-none overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-400" /> Database Health
                  </h2>
                </div>
                
                {/* Excel Style Table Lining */}
                <table className="w-full text-sm text-left border-collapse">
                  <tbody className="divide-y divide-slate-200 text-[13px]">
                    <tr className="hover:bg-slate-50">
                      <td className="px-5 py-3 border-r border-slate-200 text-slate-500 font-semibold w-1/2">Engine</td>
                      <td className="px-5 py-3 font-bold text-slate-800">10.11.10-MariaDB-log</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-5 py-3 border-r border-slate-200 text-slate-500 font-semibold w-1/2">Active Database</td>
                      <td className="px-5 py-3 font-bold text-slate-800">multischoolv2</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-5 py-3 border-r border-slate-200 text-slate-500 font-semibold w-1/2">Total Storage Size</td>
                      <td className="px-5 py-3 font-bold text-slate-800">111.80 MB</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-5 py-3 border-r border-slate-200 text-slate-500 font-semibold w-1/2">Estimated Rows</td>
                      <td className="px-5 py-3 font-bold text-slate-800">≈ 135,154</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-5 py-3 border-r border-slate-200 text-slate-500 font-semibold w-1/2">Status</td>
                      <td className="px-5 py-3 font-bold text-slate-800">Online</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Installed PHP Extensions List */}
              <div className="border border-slate-200 rounded-none overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-slate-400" /> PHP Extensions ({phpExtensions.length})
                  </h2>
                </div>
                <div className="p-5 bg-white border-t-0">
                  <div className="flex flex-wrap gap-2">
                    {phpExtensions.map(ext => (
                      <span key={ext} className="border border-slate-200 text-slate-600 bg-slate-50 text-[11px] font-medium px-2 py-1 rounded-none shadow-sm hover:border-slate-300 transition-colors cursor-default">
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Traffic Capacity */}
            <div className="space-y-6">
              
              <div className="border border-slate-200 rounded-none overflow-hidden h-full">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-slate-400" /> Traffic Capacity Estimator
                  </h2>
                </div>
                <div className="p-6">
                  
                  <div className="flex items-center justify-between my-8 px-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-slate-800 tracking-tight">250</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 border-t border-slate-200 pt-2">Max Req / Sec</p>
                    </div>
                    <div className="w-[1px] h-16 bg-slate-200"></div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-slate-800 tracking-tight">2,500</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 border-t border-slate-200 pt-2">Concurrent Users</p>
                    </div>
                  </div>

                  <div className="mt-12 bg-slate-50 border border-slate-200 p-5 rounded-none text-center">
                    <div className="flex justify-between items-end mb-2 text-[11px]">
                      <span className="text-slate-600 font-semibold tracking-wide uppercase">RAM Capacity Pressure</span>
                      <span className="text-slate-800 font-bold">43% used</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-none overflow-hidden mb-4 shadow-inner">
                      <div className="h-full bg-slate-700 rounded-none" style={{ width: '43%' }} />
                    </div>
                    
                    <p className="text-[10px] text-slate-500 font-medium">
                      Theoretical guide only. Application framework requires approx ~30MB memory per action limit.
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab !== 'Overview' && (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <LayoutGrid className="w-8 h-8 text-slate-200 mb-4" />
            <p className="text-sm font-medium">Content for {activeTab} is currently under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
