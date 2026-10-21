import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { GraduationCap, Wallet, ClipboardCheck, Users, IndianRupee, ArrowUp } from "lucide-react";

const StatCard = ({ 
  title, 
  value, 
  icon = 'student', 
  iconBg = 'bg-sky-500', 
  trend, 
  trendColor, 
  data = [10, 15, 20, 25, 22, 30, 28, 35], 
  color = '#0ea5e9', 
  fill 
}) => {
  const chartData = (data || []).map((val, index) => ({ name: index, value: val }));
  // Safe unique ID based on icon and title hash
  const safeHash = Math.abs(title.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0));
  const gradientId = `gradient-${icon}-${safeHash}`;

  const renderIcon = () => {
    switch (icon) {
      case 'student': 
        return <GraduationCap className="w-5 h-5 text-white" />;
      case 'money': 
        return <Wallet className="w-5 h-5 text-white" />;
      case 'attendance': 
        return <ClipboardCheck className="w-5 h-5 text-white" />;
      case 'staff': 
        return <Users className="w-5 h-5 text-white" />;
      case 'pending': 
        return <IndianRupee className="w-5 h-5 text-white" />;
      default: 
        return <GraduationCap className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 sm:p-5 flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex justify-between items-start z-10">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-xs ${iconBg}`}>
          {renderIcon()}
        </div>
        
        {trend && (
          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${trendColor || 'text-emerald-700 bg-emerald-50'}`}>
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            {trend}
          </span>
        )}
      </div>
      
      <div className="mt-3 z-10">
        <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-tight">{value}</h3>
        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{title}</p>
      </div>

      {/* Background Sparkline Chart */}
      <div className="absolute bottom-0 right-0 left-1/3 h-16 opacity-70 pointer-events-none z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fill || color} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={fill || color} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatCard;
