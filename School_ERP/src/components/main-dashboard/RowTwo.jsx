import React from 'react';
import { TrendingUp, Sparkles, Send, Calendar, IndianRupee, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Aug 09', income: 0 },
  { name: 'Aug 10', income: 0 },
  { name: 'Aug 11', income: 0 },
  { name: 'Aug 12', income: 0 },
  { name: 'Aug 13', income: 0 },
  { name: 'Aug 14', income: 0 },
  { name: 'Aug 15', income: 0 },
  { name: 'Aug 16', income: 0 },
  { name: 'Aug 17', income: 0 },
  { name: 'Aug 18', income: 0 },
  { name: 'Aug 19', income: 0 },
  { name: 'Aug 20', income: 0 },
  { name: 'Aug 21', income: 0 },
  { name: 'Aug 22', income: 0 },
  { name: 'Aug 23', income: 0 },
  { name: 'Aug 24', income: 0 },
];

const FinancialTrendWidget = () => (
  <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
    <div className="flex items-center gap-2 mb-6">
      <div className="bg-[#1e3a5f] p-1.5 rounded-none text-white">
        <TrendingUp className="w-4 h-4" />
      </div>
      <h2 className="text-sm font-bold text-slate-800">Financial Trend <span className="text-[10px] text-slate-400 font-normal ml-1">(15 Days)</span></h2>
    </div>

    <div className="flex-1 min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5F52FF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#5F52FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={45} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
            itemStyle={{ color: '#5F52FF' }}
          />
          <Area type="monotone" dataKey="income" name="Income Collection" stroke="#5F52FF" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center mt-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
        <div className="w-4 h-2 bg-[#5F52FF] opacity-50 rounded-none"></div> Income Collection
      </div>
    </div>
  </div>
);

const AIAssistantWidget = () => (
  <div className="bg-[#1c183e] p-5 rounded-none shadow-sm border border-[#2d2757] h-full flex flex-col">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="w-5 h-5 text-amber-400" />
      <h2 className="text-base font-extrabold text-white">AI Assistant</h2>
    </div>
    <p className="text-slate-300 text-xs mb-6">Smart insights for your school</p>

    <div className="flex-1 flex flex-col gap-3">
      <div className="bg-[#2d2757] rounded-none p-3 flex justify-between items-center border border-[#3e3678] hover:bg-[#342d64] cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-[#1c183e] p-1.5 rounded-none text-amber-400">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-white">Today's attendance summary</span>
        </div>
        <button className="text-[10px] font-bold text-amber-400 border border-amber-400/30 px-2 py-1 rounded-none hover:bg-amber-400/10 transition-colors">Ask AI</button>
      </div>
      
      <div className="bg-[#2d2757] rounded-none p-3 flex justify-between items-center border border-[#3e3678] hover:bg-[#342d64] cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-[#1c183e] p-1.5 rounded-none text-emerald-400">
            <IndianRupee className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-white">Fee collection this month</span>
        </div>
        <button className="text-[10px] font-bold text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded-none hover:bg-emerald-400/10 transition-colors">Ask AI</button>
      </div>

      <div className="bg-[#2d2757] rounded-none p-3 flex justify-between items-center border border-[#3e3678] hover:bg-[#342d64] cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-[#1c183e] p-1.5 rounded-none text-blue-400">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-white">Total student enrollment</span>
        </div>
        <button className="text-[10px] font-bold text-blue-400 border border-blue-400/30 px-2 py-1 rounded-none hover:bg-blue-400/10 transition-colors">Ask AI</button>
      </div>
    </div>

    <div className="mt-4 relative">
      <input 
        type="text" 
        placeholder="Ask AI Assistant anything..." 
        className="w-full bg-[#2d2757] border border-[#3e3678] rounded-none py-3 pl-4 pr-10 text-sm text-white placeholder-slate-400 outline-none focus:border-[#5F52FF] transition-colors"
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300">
        <Send className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const RowTwo = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
      <div className="lg:col-span-3">
        <FinancialTrendWidget />
      </div>
      <div className="lg:col-span-2">
        <AIAssistantWidget />
      </div>
    </div>
  );
};

export default RowTwo;
