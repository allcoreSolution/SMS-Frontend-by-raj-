import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

const bgColors = ['bg-blue-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-purple-500'];

const WidgetCard = ({ title, subtitle, actionText, onAction, children, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="w-4 h-4 text-orange-500" />}
        <div>
          <h3 className="text-[13px] font-bold text-slate-800">{title}</h3>
          {subtitle && <p className="text-[11px] font-medium text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actionText && (
        <button
          onClick={onAction}
          className="text-[11px] font-bold text-[#ff5c0a] bg-orange-50 px-3 py-1 rounded-full flex items-center justify-center border border-orange-100 hover:bg-orange-100 transition-colors">
          {actionText === 'View all' ? (
            <span className="flex items-center gap-1.5">{actionText} <span className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center text-[9px] shadow-xs">↗</span></span>
          ) : actionText}
        </button>
      )}
    </div>
    <div className="flex-1 flex flex-col min-h-0">{children}</div>
  </div>
);

const BottomWidgets = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  
  useEffect(() => {
    tenantService.getTenants().then(res => {
      setSchools(toArray(res));
    }).catch(console.error);
  }, []);

  const totalCount = schools.length;
  const activeCount = schools.filter(s => s.status === 'Active').length;
  const inactiveCount = schools.filter(s => s.status !== 'Active').length;
  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  
  const subData = [
    { name: 'Active', value: activeCount, color: '#22c55e' },
    { name: 'Inactive', value: inactiveCount, color: '#ef4444' },
  ];

  const pendingSchools = schools.filter(s => s.status === 'Pending').slice(0,5);
  const largestSchools = [...schools].sort((a, b) => (b.studentsCount||0) - (a.studentsCount||0)).slice(0,6);
  const latestSchools = [...schools].reverse().slice(0,6);
  
  const revenueData = [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 mb-12">
      
      {/* ROW 1 */}
      {/* Revenue Overview */}
      <div className="col-span-1">
        <WidgetCard title="Revenue Overview" subtitle={`Subscriptions — last 6 months · lifetime ₹0`}>
          <div className="h-[240px] w-full mt-4 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5c0a" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ff5c0a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#ff5c0a" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 4, fill: '#fff', stroke: '#ff5c0a', strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#ff5c0a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </WidgetCard>
      </div>

      {/* Subscription Profile */}
      <div className="col-span-1">
        <WidgetCard title="Subscription Profile" subtitle="Active vs Inactive schools">
          <div className="flex items-center gap-6 mt-4">
            {/* Chart */}
            <div className="h-28 w-28 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subData}
                    innerRadius={40}
                    outerRadius={52}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {subData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col -mt-1">
                <span className="text-xl font-extrabold text-slate-800">{activePercent}%</span>
                <span className="text-[10px] font-semibold text-slate-400">Active</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><span className="text-slate-500">Active</span></div>
                <span className="text-slate-800 font-bold">{activeCount}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-slate-500">Inactive</span></div>
                <span className="text-slate-800 font-bold">{inactiveCount}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-slate-500">Total</span></div>
                <span className="text-slate-800 font-bold">{totalCount}</span>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Platform Demographics</p>
          <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-slate-200">
            <div className="p-3 text-center border-b border-r border-slate-200 bg-white">
              <div className="text-[18px] font-extrabold text-slate-800">{schools.reduce((sum,s) => sum+(s.studentsCount||0), 0)}</div>
              <div className="text-[9px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">Students</div>
            </div>
            <div className="p-3 text-center border-b border-slate-200 bg-white">
              <div className="text-[18px] font-extrabold text-slate-800">0</div>
              <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Staff</div>
            </div>
            <div className="p-3 text-center border-r border-slate-200 bg-white">
              <div className="text-[18px] font-extrabold text-slate-800">0</div>
              <div className="text-[9px] font-bold text-fuchsia-600 uppercase tracking-wider mt-0.5">Users</div>
            </div>
            <div className="p-3 text-center bg-white">
              <div className="text-[18px] font-extrabold text-slate-800">{totalCount}</div>
              <div className="text-[9px] font-bold text-teal-600 uppercase tracking-wider mt-0.5">Schools</div>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Pending Orders */}
      <div className="col-span-1">
        <WidgetCard title="Pending Orders" subtitle="Awaiting verification" actionText="View all" onAction={() => navigate('/schools')}>
          <div className="flex flex-col mt-2">
            {pendingSchools.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">No pending orders</p> : pendingSchools.map((s, i) => (
              <div key={i} className="flex items-center justify-between group py-2.5 px-2 hover:bg-slate-50/80 rounded-xl transition-all border-b border-slate-50 last:border-0 relative">
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-extrabold shadow-sm ${bgColors[i % bgColors.length]}`}>
                    {s.schoolName.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800 leading-tight">{s.schoolName}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate max-w-[140px]">{s.plan} Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-slate-800 font-mono">₹—</p>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-orange-600 bg-orange-50 inline-block px-2 py-0.5 rounded-full border border-orange-200 mt-1">Pending</p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* ROW 2 */}
      {/* Largest Schools */}
      <div className="col-span-1">
        <WidgetCard title="Largest Schools" subtitle="By user count" actionText="View all" onAction={() => navigate('/schools')}>
          <div className="flex flex-col mt-2">
            {largestSchools.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">No data</p> : largestSchools.map((s, i) => (
              <div key={i} className="flex items-center justify-between group py-2 px-2 hover:bg-slate-50/80 rounded-xl transition-all border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl shadow-sm flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0 ${bgColors[i % bgColors.length]}`}>
                    {s.schoolName.substring(0,2).toUpperCase()}
                  </div>
                  <div className="truncate pr-2">
                    <p className="text-[12px] font-bold text-slate-800 truncate uppercase leading-tight">{s.schoolName}</p>
                    <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{s.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex-shrink-0">
                  {s.studentsCount || 0} users
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* New Registrations */}
      <div className="col-span-1">
        <WidgetCard title="New Registrations" subtitle="Latest schools to join" actionText="View all" onAction={() => navigate('/schools')}>
          <div className="flex flex-col mt-2">
            {latestSchools.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">No data</p> : latestSchools.map((s, i) => (
              <div key={i} className="flex items-center justify-between group py-2 px-2 hover:bg-slate-50/80 rounded-xl transition-all border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl shadow-sm flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0 ${bgColors[(i+2) % bgColors.length]}`}>
                    {s.schoolName.substring(0,2).toUpperCase()}
                  </div>
                  <div className="truncate pr-2">
                    <p className="text-[12px] font-bold text-slate-800 truncate capitalize leading-tight">{s.schoolName}</p>
                    <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{s.email}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] font-bold text-slate-600">{new Date(s.createdAt).toLocaleDateString()}</p>
                  <p className="text-[9px] text-[#ff5c0a] uppercase tracking-wider font-bold bg-orange-50 border border-orange-100 inline-block px-2 py-0.5 rounded-full mt-1">New</p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
      
      {/* Expiring Soon */}
      <div className="col-span-1">
        <WidgetCard title="Expiring Soon" subtitle="Renewals coming up" actionText="View all" onAction={() => navigate('/schools')}>
          <div className="flex flex-col mt-2">
            <p className="text-xs text-gray-400 text-center py-6">No renewals soon</p>
          </div>
        </WidgetCard>
      </div>

      {/* ROW 3 */}
      {/* System Health */}
      <div className="col-span-1">
        <WidgetCard title="System Health" subtitle="multischoolv2" actionText="Health Center" onAction={() => navigate('/server')}>
          <div className="flex flex-col justify-between h-full gap-3.5 mt-2">
             {/* Status Blocks */}
             <div className="grid grid-cols-3 gap-2.5 pb-1 mb-1">
               <div className="relative border border-emerald-200 bg-emerald-50/50 p-2.5 rounded-xl shadow-xs">
                 <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-t-xl"></div>
                 <p className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1.5 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE</p>
                 <p className="text-[9px] font-bold text-emerald-600/70 mt-1 uppercase tracking-wider text-center">Database</p>
               </div>
               <div className="relative border border-slate-200 bg-white p-2.5 rounded-xl shadow-xs">
                 <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 rounded-t-xl"></div>
                 <p className="text-[12px] font-bold text-slate-800 text-center mt-0.5">112 MB</p>
                 <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider text-center">DB Size</p>
               </div>
               <div className="relative border border-emerald-200 bg-emerald-50/50 p-2.5 rounded-xl shadow-xs">
                 <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-t-xl"></div>
                 <p className="text-[11px] font-bold text-emerald-700 text-center mt-0.5">Optimal</p>
                 <p className="text-[9px] font-bold text-emerald-600/70 mt-1 uppercase tracking-wider text-center">Load</p>
               </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600">Disk Usage <span className="text-slate-400 font-medium ml-1">(27.15 / 96.73 GB)</span></span>
                  <span className="text-[13px] font-bold text-slate-800">28%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600">Memory <span className="text-slate-400 font-medium ml-1">(40% of 7.8 GB)</span></span>
                  <span className="text-[13px] font-bold text-slate-800">40%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#131927] text-white rounded-xl shadow-sm border border-slate-800 shrink-0 mt-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 truncate">Est. max capability</span>
              <span className="text-[12px] font-bold tracking-tight whitespace-nowrap shrink-0">~2,500 <span className="opacity-70 text-[10px] font-medium">u/sec</span></span>
            </div>
          </div>
        </WidgetCard>
      </div>
      
      {/* Application Errors */}
      <div className="col-span-2">
        <WidgetCard title="Application Errors" subtitle="Latest from the log" actionText="Open logs" onAction={() => {}}>
           <div className="flex flex-col gap-3 mt-4 overflow-y-auto pr-2 max-h-[300px] mb-2" style={{ scrollbarWidth: 'thin' }}>
              <p className="text-xs text-gray-400 text-center py-6">No errors in log</p>
           </div>
        </WidgetCard>
      </div>

    </div>
  );
};

export default BottomWidgets;
