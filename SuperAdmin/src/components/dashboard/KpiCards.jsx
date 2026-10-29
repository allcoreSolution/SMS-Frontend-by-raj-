import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Landmark, Users, FileText, ReceiptText, Activity, ArrowUp } from 'lucide-react';
import { tenantService } from '../../api/tenantService';

const KpiCard = ({
  title,
  value,
  isLive,
  trend,
  trendColor,
  icon: Icon,
  glowColor = '#3b82f6',
  stroke = '#3b82f6',
  iconBg = '#3b82f6',
  iconColor = '#ffffff',
  spark
}) => {
  const safeId = (title || 'kpi').replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-2.5 sm:px-3 sm:py-2.5 flex flex-col justify-between h-[105px] relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all">
      {/* Subtle Glow Effect on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${glowColor}15, transparent 70%)` }}
      />

      {/* Top Row: Icon Badge on Left, Trend/Live Badge on Right (Identical to School ERP) */}
      <div className="flex justify-between items-start z-10">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105"
          style={{ background: iconBg }}
        >
          {Icon && <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} strokeWidth={2.2} />}
        </div>

        {isLive ? (
          <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        ) : trend ? (
          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs ${trendColor || 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'}`}>
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" />
            {trend}
          </span>
        ) : null}
      </div>

      {/* Bottom Section: Big Value on Top, Title underneath (Identical to School ERP) */}
      <div className="mt-1.5 z-10">
        <h3 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight leading-none">
          {value}
        </h3>
        <p className="text-[10.5px] text-gray-500 font-semibold mt-0.5 truncate">
          {title}
        </p>
      </div>

      {/* Background Sparkline Chart on Bottom-Right */}
      <div className="absolute bottom-0 right-0 left-1/3 h-10 opacity-70 pointer-events-none z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`g-${safeId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={stroke}
              strokeWidth={2}
              fill={`url(#g-${safeId})`}
              dot={false}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

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
      if (res?.data) {
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
    for (let i = 0; i < 8; i++) {
      current += (Math.random() - 0.2) * volatility;
      arr.push({ v: Math.max(1, current) });
    }
    return arr;
  };

  const liveCards = [
    {
      title: 'Platform Schools',
      value: stats.totalSchools.toLocaleString(),
      icon: Landmark,
      stroke: '#0284c7',
      iconBg: '#0284c7',
      iconColor: '#ffffff',
      glowColor: '#0284c7',
      trend: stats.totalSchools > 0 ? `${Math.round((stats.activeSchools / stats.totalSchools) * 100)}% Active` : null,
      spark: stats.totalSchools > 0 ? genSpark(10, 5) : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }],
    },
    {
      title: 'Active Accounts',
      value: stats.activeSchools.toLocaleString(),
      icon: Users,
      stroke: '#10b981',
      iconBg: '#10b981',
      iconColor: '#ffffff',
      glowColor: '#10b981',
      isLive: true,
      spark: stats.activeSchools > 0 ? genSpark(20, 8) : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }],
    },
    {
      title: 'Current Revenue',
      value: stats.totalRevenue > 0 ? '₹' + Number(stats.totalRevenue).toLocaleString('en-IN') : '₹0',
      icon: ReceiptText,
      stroke: '#f59e0b',
      iconBg: '#f59e0b',
      iconColor: '#ffffff',
      glowColor: '#f59e0b',
      trend: stats.totalRevenue > 0 ? '+0% MTD' : null,
      spark: stats.totalRevenue > 0 ? genSpark(100, 30) : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }],
    },
    {
      title: 'Total Students',
      value: stats.totalStudents > 0 ? Number(stats.totalStudents).toLocaleString('en-IN') : '0',
      icon: FileText,
      stroke: '#8b5cf6',
      iconBg: '#8b5cf6',
      iconColor: '#ffffff',
      glowColor: '#8b5cf6',
      trend: stats.totalStudents > 0 ? 'Enrolled' : null,
      spark: stats.totalStudents > 0 ? genSpark(50, 15) : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }],
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions ? String(stats.activeSessions) : '1',
      isLive: true,
      icon: Activity,
      stroke: '#f43f5e',
      iconBg: '#f43f5e',
      iconColor: '#ffffff',
      glowColor: '#f43f5e',
      spark: genSpark(8, 3),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-5 pt-1">
      {liveCards.map(c => <KpiCard key={c.title} {...c} />)}
    </div>
  );
};

export default KpiCards;
