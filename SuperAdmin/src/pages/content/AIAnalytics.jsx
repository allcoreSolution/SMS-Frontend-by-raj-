import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Users, IndianRupee } from 'lucide-react';

const churnRisk = [
  { school: 'Sunrise School', risk: 82, reason: 'Low login activity (14 days)', plan: 'Basic' },
  { school: 'Ali Public School', risk: 75, reason: 'Fee collection dropped 60%', plan: 'Basic' },
  { school: 'Green Valley', risk: 61, reason: 'Support tickets unresolved', plan: 'Standard' },
  { school: 'St. Mary Convent', risk: 45, reason: 'Attendance module unused', plan: 'Standard' },
];

const engagementData = [
  { month: 'Apr', score: 72 }, { month: 'May', score: 75 }, { month: 'Jun', score: 71 },
  { month: 'Jul', score: 78 }, { month: 'Aug', score: 80 }, { month: 'Sep', score: 83 },
];

const featureUsage = [
  { feature: 'Fee Module', usage: 95 },
  { feature: 'Attendance', usage: 88 },
  { feature: 'Reports', usage: 76 },
  { feature: 'HR/Payroll', usage: 62 },
  { feature: 'Transport', usage: 45 },
  { feature: 'Hostel', usage: 30 },
  { feature: 'Online Exams', usage: 28 },
];

const insights = [
  { icon: TrendingUp, color: 'text-green-500 bg-green-50', title: 'Revenue Opportunity', desc: '48 schools on Basic plan are eligible for Standard upgrade based on usage patterns.' },
  { icon: AlertTriangle, color: 'text-red-500 bg-red-50', title: 'Churn Risk Alert', desc: '4 schools show high churn risk. Immediate outreach recommended.' },
  { icon: Lightbulb, color: 'text-orange-500 bg-orange-50', title: 'Feature Adoption', desc: 'Transport module adoption is low (45%). Consider targeted onboarding campaign.' },
  { icon: Users, color: 'text-blue-500 bg-blue-50', title: 'Growth Trend', desc: 'Platform grew 15% this quarter. Premium plan schools growing fastest.' },
];

const AIAnalytics = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">AI Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered insights and predictions for platform growth</p>
      </div>
      <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-2 rounded-none">
        <Brain className="w-4 h-4 text-purple-500" />
        <span className="text-xs font-semibold text-purple-700">AI Engine Active</span>
      </div>
    </div>

    {/* Insights */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {insights.map((ins, i) => (
        <div key={i} className="bg-white rounded-none border border-gray-200 shadow-sm p-4 flex gap-3">
          <div className={`w-10 h-10 rounded-none flex items-center justify-center flex-shrink-0 ${ins.color.split(' ')[1]}`}>
            <ins.icon className={`w-5 h-5 ${ins.color.split(' ')[0]}`} />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{ins.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{ins.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Engagement Score */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Platform Engagement Score</h3>
          <p className="text-xs text-gray-500">AI-calculated monthly engagement (0–100)</p>
        </div>
        <div className="p-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[60, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 4, fill: '#a855f7' }} name="Engagement" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Feature Adoption Rate</h3>
          <p className="text-xs text-gray-500">% of schools actively using each module</p>
        </div>
        <div className="p-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} unit="%" />
              <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} width={80} />
              <Tooltip />
              <Bar dataKey="usage" fill="#a855f7" radius={[0, 4, 4, 0]} name="Usage %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Churn Risk Table */}
    <div className="bg-white rounded-none border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <h3 className="text-sm font-bold text-gray-700">Churn Risk Schools</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['School', 'Plan', 'Risk Score', 'Reason', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {churnRisk.map((s, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{s.school}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{s.plan}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-none overflow-hidden">
                      <div className={`h-full rounded-none ${s.risk >= 75 ? 'bg-red-500' : s.risk >= 50 ? 'bg-orange-400' : 'bg-yellow-400'}`} style={{ width: `${s.risk}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${s.risk >= 75 ? 'text-red-500' : s.risk >= 50 ? 'text-orange-500' : 'text-yellow-600'}`}>{s.risk}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{s.reason}</td>
                <td className="px-4 py-3">
                  <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-none font-semibold transition-colors">Contact</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AIAnalytics;
