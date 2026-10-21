import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Landmark, Users, FileText, Banknote, ReceiptText, Activity } from 'lucide-react';
import { tenantService } from '../../api/tenantService';

const KpiCard = ({ title, value, isLive, icon: Icon, glowColor, stroke, iconBg, iconColor, spark }) => (
  <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200/60 relative overflow-hidden group hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-400 ease-out h-[110px] flex flex-col justify-between">
    
    {/* Subtle Glow Effect on Hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" 
         style={{ background: `radial-gradient(circle at top right, ${glowColor}15, transparent 70%)` }}></div>
    
    <div className="p-4 relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-auto">
        <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
          <div className="text-[11px] font-bold text-slate-500 tracking-wide uppercase truncate" title={title}>
            {title}
          </div>
          <div className="text-[22px] font-black text-slate-800 leading-none tracking-tight flex items-center gap-2 mt-0.5">
            <span>{value}</span>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-widest shadow-xs border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>
        
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-lg blur-md opacity-40 transition-transform group-hover:scale-110" style={{ background: iconBg }}></div>
          <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center relative shadow-sm border border-white/20 transition-transform group-hover:scale-110 duration-300" 
               style={{ background: iconBg }}>
            <Icon size={16} style={{ color: iconColor }} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>

    {/* Full Width Bottom Graph */}
    <div className="absolute bottom-0 left-0 right-0 h-[45%] z-0 opacity-85 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={spark} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${title.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.45} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={3}
            fill={`url(#g-${title.replace(/\s/g,'')})`}
            dot={false}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const KpiCards = () => {
  const [stats, setStats] = useState({
    activeSchools: 0,
    totalSchools: 0,
    totalRevenue: 0,
    totalStudents: 0,
    activeSessions: 1
  });

  useEffect(() => {
    tenantService.getDashboardStats().then(res => {
      if(res?.data) {
        setStats({
          activeSchools: res.data.activeSchools || 0,
          totalSchools: res.data.totalSchools || 0,
          totalRevenue: res.data.totalRevenue || res.data.revenue || 0,
          totalStudents: res.data.activeStudents || res.data.totalStudents || res.data.totalStudentsTarget || 0,
          activeSessions: res.data.activeSessions || 1
        });
      }
    }).catch(console.error);
  }, []);

  // Use slightly varied sparklines based on metrics to simulate real curves
  const genSpark = (base, volatility) => {
    let arr = [];
    let current = base;
    for(let i=0; i<8; i++) {
        current += (Math.random() - 0.2) * volatility; 
        arr.push({v: Math.max(1, current)});
    }
    return arr;
  };

  const liveCards = [
    {
      title: 'Platform Schools',
      value: stats.totalSchools.toLocaleString(),
      icon: Landmark,
      stroke: '#3b82f6',
      iconBg: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      iconColor: '#ffffff',
      glowColor: '#3b82f6',
      spark: genSpark(10, 5),
    },
    {
      title: 'Active Accounts',
      value: stats.activeSchools.toLocaleString(),
      icon: Users,
      stroke: '#10b981',
      iconBg: 'linear-gradient(135deg, #34d399, #10b981)',
      iconColor: '#ffffff',
      glowColor: '#10b981',
      spark: genSpark(20, 8),
    },
    {
      title: 'Current Revenue',
      value: stats.totalRevenue > 0 ? '₹' + stats.totalRevenue.toLocaleString() : '₹0',
      icon: ReceiptText,
      stroke: '#f59e0b',
      iconBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      iconColor: '#ffffff',
      glowColor: '#f59e0b',
      spark: genSpark(100, 30),
    },
    {
      title: 'Total Students',
      value: stats.totalStudents > 0 ? stats.totalStudents.toLocaleString() : '0',
      icon: FileText,
      stroke: '#ec4899',
      iconBg: 'linear-gradient(135deg, #f472b6, #ec4899)',
      iconColor: '#ffffff',
      glowColor: '#ec4899',
      spark: genSpark(50, 15),
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions ? String(stats.activeSessions) : '1',
      isLive: true,
      icon: Activity,
      stroke: '#8b5cf6',
      iconBg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
      iconColor: '#ffffff',
      glowColor: '#8b5cf6',
      spark: genSpark(8, 3),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8 pt-2">
      {liveCards.map(c => <KpiCard key={c.title} {...c} />)}
    </div>
  );
};

export default KpiCards;
