import React from 'react';
import { Server, Globe, Database, Shield, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const services = [
  { name: 'Web Server', provider: 'AWS EC2', region: 'ap-south-1', type: 't3.medium', status: 'Running', uptime: '99.9%', cost: '$45/mo' },
  { name: 'Database', provider: 'MongoDB Atlas', region: 'ap-south-1', type: 'M10 Cluster', status: 'Running', uptime: '99.8%', cost: '$57/mo' },
  { name: 'File Storage', provider: 'AWS S3', region: 'ap-south-1', type: 'Standard', status: 'Running', uptime: '100%', cost: '$12/mo' },
  { name: 'CDN', provider: 'CloudFront', region: 'Global', type: 'Standard', status: 'Running', uptime: '100%', cost: '$8/mo' },
  { name: 'Email Service', provider: 'SendGrid', region: 'Global', type: 'Pro Plan', status: 'Warning', uptime: '97.2%', cost: '$19/mo' },
  { name: 'SMS Gateway', provider: 'MSG91', region: 'India', type: 'Pay-as-go', status: 'Running', uptime: '98.9%', cost: 'Variable' },
];

const Infrastructure = () => {
  const totalCost = '$141/mo';

  return (
    <div className="p-6 sm:p-8 w-full bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Infrastructure</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Cloud resources and service providers overview</p>
        </div>
        <div className="bg-white border border-slate-200 px-5 py-3 rounded-none shadow-sm flex items-center gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. Monthly Cost</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{totalCost}</p>
          </div>
          <div className="w-10 h-10 rounded-none bg-green-50 text-green-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Services', value: services.length, icon: Server, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'All Running', value: services.filter(s => s.status === 'Running').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Warnings', value: services.filter(s => s.status === 'Warning').length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Regions', value: 3, icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-none border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`w-12 h-12 rounded-none ${k.bg} flex items-center justify-center flex-shrink-0`}>
              <k.icon className={`w-6 h-6 ${k.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{k.value}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className={`bg-white rounded-none border-2 shadow-sm p-6 transition-all hover:shadow-md ${s.status === 'Warning' ? 'border-amber-200 bg-amber-50/10' : 'border-slate-100'}`}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-none flex items-center justify-center ${s.status === 'Running' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{s.provider}</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-none ${s.status === 'Running' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-amber-100/50 text-amber-700'}`}>
                {s.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Region', value: s.region },
                { label: 'Type', value: s.type },
                { label: 'Uptime', value: s.uptime },
                { label: 'Cost', value: s.cost },
              ].map((d, j) => (
                <div key={j} className="bg-slate-50 rounded-none p-3 border border-slate-100/50">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{d.label}</p>
                  <p className="font-bold text-slate-700 text-sm">{d.value}</p>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-none text-sm font-bold transition-all shadow-sm">
              <ExternalLink className="w-4 h-4" /> View Console
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Infrastructure;
