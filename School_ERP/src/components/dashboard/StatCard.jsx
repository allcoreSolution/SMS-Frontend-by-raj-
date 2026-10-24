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
  const titleStr = String(title || 'stat');
  const safeHash = Math.abs(titleStr.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0));
  const gradientId = `gradient-${icon}-${safeHash}`;

  const renderIcon = () => {
    switch (icon) {
      case 'student': 
        return <GraduationCap className="w-3.5 h-3.5 text-white" />;
      case 'money': 
        return <Wallet className="w-3.5 h-3.5 text-white" />;
      case 'attendance': 
        return <ClipboardCheck className="w-3.5 h-3.5 text-white" />;
      case 'staff': 
        return <Users className="w-3.5 h-3.5 text-white" />;
      case 'pending': 
        return <IndianRupee className="w-3.5 h-3.5 text-white" />;
      default: 
        return <GraduationCap className="w-3.5 h-3.5 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-2.5 sm:px-3 sm:py-2.5 flex flex-col justify-between h-[105px] relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex justify-between items-start z-10">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 ${iconBg}`}>
          {renderIcon()}
        </div>
        
        {trend && (
          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${trendColor || 'text-emerald-700 bg-emerald-50'}`}>
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" />
            {trend}
          </span>
        )}
      </div>
      
      <div className="mt-1.5 z-10">
        <h3 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight leading-none">{value}</h3>
        <p className="text-[10.5px] text-gray-500 font-semibold mt-0.5 truncate">{title}</p>
      </div>

      {/* Background Sparkline Chart */}
      <div className="absolute bottom-0 right-0 left-1/3 h-10 opacity-70 pointer-events-none z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fill || color} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={fill || color} stopOpacity="0.0"/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2} 
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
