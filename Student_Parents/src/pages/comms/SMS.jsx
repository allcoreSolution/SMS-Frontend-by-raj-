import React from 'react';
import { MessageCircle } from 'lucide-react';

const messages = [
  { 
    id: 1, 
    title: 'Registered Number', 
    date: '04 Sep 2026', 
    body: 'Yug International School Notice: Happy Janmastami. Please check the dashboard for details.' 
  },
  { 
    id: 2, 
    title: 'Registered Number', 
    date: '04 Sep 2026', 
    body: 'Yug International School Notice: Happy Janmastami. Please check the dashboard for details.' 
  },
  { 
    id: 3, 
    title: 'Registered Number', 
    date: '02 Sep 2026', 
    body: 'Welcome to Yug International. Admission Successful for Kabir. Parent Login: parent@projectworlds.com / 6263056779. Login: https://multischoolv2.projectworlds.com/login' 
  },
  { 
    id: 4, 
    title: 'Registered Number', 
    date: '02 Sep 2026', 
    body: 'Welcome to Yug International. Admission Successful for Kabir. Parent Login: parent@projectworlds.com / 6263056779. Login: https://multischoolv2.projectworlds.com/login' 
  },
];

export default function SMS() {
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6 bg-[#f8f9fa] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded-none bg-[#1e40af] flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white tracking-widest">SMS</span>
         </div>
         <h1 className="text-[22px] font-bold text-[#1f2937] tracking-tight">SMS History</h1>
      </div>

      {/* Messages List */}
      <div className="space-y-3.5 mt-2">
         {messages.map(m => (
           <div key={m.id} className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-4 shadow-[0_1px_3px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow">
              
              <div className="mt-0.5">
                 <MessageCircle className="w-[18px] h-[18px] text-[#2563eb]" strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 overflow-hidden">
                 <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1.5 gap-1">
                    <h3 className="text-[14px] font-extrabold text-[#1e3a8a] tracking-tight">{m.title}</h3>
                    <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">{m.date}</span>
                 </div>
                 <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed break-words">
                    {m.body}
                 </p>
              </div>
              
           </div>
         ))}
      </div>
      
    </div>
  );
}
