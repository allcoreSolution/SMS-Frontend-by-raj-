import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export const KpiCard = ({ 
  title, 
  value, 
  subText,
  isLive, 
  icon: Icon, 
  glowColor = '#3b82f6', 
  stroke = '#3b82f6', 
  iconBg = 'linear-gradient(135deg, #60a5fa, #3b82f6)', 
  iconColor = '#ffffff', 
  spark = [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }],
  badge 
}) => {
  // Ensure spark data is an array of objects with 'v' key
  const chartData = Array.isArray(spark) 
    ? (typeof spark[0] === 'number' ? spark.map((v, i) => ({ v, i })) : spark)
    : [{ v: 10 }, { v: 15 }, { v: 20 }];

  const safeId = (title || 'kpi').replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200/60 relative overflow-hidden group hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 ease-out h-[102px] flex flex-col justify-between">
      
      {/* Subtle Glow Effect on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0 pointer-events-none" 
        style={{ background: `radial-gradient(circle at top right, ${glowColor}15, transparent 70%)` }}
      />
      
      <div className="p-2.5 sm:px-3 sm:py-2.5 relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-auto">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
            <div className="text-[10px] font-bold text-slate-500 tracking-wide uppercase truncate" title={title}>
              {title}
            </div>
            <div className="text-[18px] sm:text-[20px] font-black text-slate-800 leading-none tracking-tight flex items-center gap-1.5 mt-0.5">
              <span>{value}</span>
              {isLive && (
                <span className="inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-widest shadow-xs border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
          
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-lg blur-md opacity-40 transition-transform group-hover:scale-105" style={{ background: iconBg }}></div>
            <div 
              className="w-[28px] h-[28px] rounded-lg flex items-center justify-center relative shadow-xs border border-white/20 transition-transform group-hover:scale-105 duration-300" 
              style={{ background: iconBg }}
            >
              {Icon && <Icon size={14} style={{ color: iconColor }} strokeWidth={2.5} />}
            </div>
          </div>
        </div>

        {(subText || badge) && (
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium z-10 pt-0.5">
            <span className="truncate">{subText}</span>
            {badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0 ml-1">
                {badge}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Full Width Bottom Graph */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`g-${safeId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.4" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={stroke}
              strokeWidth={2}
              fill={`url(#g-${safeId})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KpiCard;
