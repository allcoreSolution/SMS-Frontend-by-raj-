import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

const SchoolsReport = () => {
  const [range, setRange] = useState('9M');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tenantService.getTenants().then(res => {
      setSchools(toArray(res));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalSchools = schools.length;
  const activeSchools = schools.filter(s => s.status === 'Active').length;
  const inactiveSchools = schools.filter(s => s.status !== 'Active').length;

  // Plan distribution based on real schools
  const planCounts = {};
  schools.forEach(s => {
    const p = s.plan || 'Standard';
    planCounts[p] = (planCounts[p] || 0) + 1;
  });

  const planColors = { Basic: '#94a3b8', Standard: '#3b82f6', Premium: '#a855f7', Enterprise: '#f97316' };
  const planDist = Object.keys(planCounts).map(name => ({
    name,
    value: planCounts[name],
    color: planColors[name] || '#3b82f6'
  }));

  // City distribution based on real schools
  const cityCounts = {};
  schools.forEach(s => {
    const c = s.city || s.address || 'Local';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const cityData = Object.keys(cityCounts).map(city => ({
    city: city.length > 15 ? city.slice(0, 15) + '...' : city,
    schools: cityCounts[city]
  }));

  const monthlyGrowth = totalSchools > 0 ? [
    { month: 'Current', active: activeSchools, inactive: inactiveSchools, new: totalSchools }
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schools Report</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed analytics on school registrations and activity</p>
        </div>
        <div className="flex gap-2">
          {['3M', '6M', '9M', '1Y'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-none text-xs font-semibold transition-colors ${range === r ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {r}
            </button>
          ))}
          <button className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-none text-xs font-semibold">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Schools', value: totalSchools, change: `${totalSchools} registered`, up: true },
          { label: 'Active Schools', value: activeSchools, change: `${activeSchools} online`, up: true },
          { label: 'Inactive Schools', value: inactiveSchools, change: `${inactiveSchools} inactive`, up: false },
          { label: 'Avg Students/School', value: '0', change: 'Clean database', up: true },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            <p className={`text-[10px] font-semibold mt-1 ${k.up ? 'text-green-500' : 'text-red-500'}`}>{k.change}</p>
          </div>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">School Growth Over Time</h3>
        </div>
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="active" fill="#22c55e" radius={[3, 3, 0, 0]} name="Active" stackId="a" />
              <Bar dataKey="inactive" fill="#ef4444" radius={[3, 3, 0, 0]} name="Inactive" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Distribution */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Schools by City / Location</h3>
          </div>
          <div className="p-4 h-56">
            {cityData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">No school locations recorded</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
                  <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
                  <Tooltip />
                  <Bar dataKey="schools" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Plan Distribution</h3>
          </div>
          <div className="p-4 flex items-center justify-center gap-8 h-56">
            {planDist.length === 0 ? (
              <div className="text-xs text-gray-400">No active plans</div>
            ) : (
              <>
                <div className="h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={planDist} innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                        {planDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {planDist.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-none" style={{ background: p.color }} />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.value} school{p.value > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolsReport;
