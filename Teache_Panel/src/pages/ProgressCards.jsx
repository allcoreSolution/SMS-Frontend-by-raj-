import React from 'react';
import { User, Award, CheckCircle } from 'lucide-react';

const ProgressCards = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-cyan-100 text-cyan-600 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Holistic Progress Cards</h1>
          <p className="text-sm text-gray-500">View detailed student 360-degree performance</p>
        </div>
      </div>
      <div className="p-6 max-w-5xl mx-auto mt-6">
         <div className="bg-white border border-gray-200 p-8 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
               <User className="w-8 h-8 text-gray-400" />
             </div>
             <div>
               <h2 className="text-2xl font-black text-gray-800">Aarav Sharma</h2>
               <p className="text-sm text-gray-500 font-medium">Class X - A | Roll: 01</p>
             </div>
             <button className="ml-auto bg-cyan-50 text-cyan-700 border border-cyan-200 px-4 py-2 text-sm font-bold">Search Student</button>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
             <div className="border border-gray-200 p-5 col-span-2">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-cyan-500"/> Academic Profile</h3>
               <div className="space-y-3">
                 {['Mathematics - 92%', 'Science - 85%', 'English - 88%'].map((sub, i) => (
                   <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                     <span className="font-semibold text-gray-700">{sub.split(' - ')[0]}</span>
                     <span className="font-bold text-cyan-600">{sub.split(' - ')[1]}</span>
                   </div>
                 ))}
               </div>
             </div>
             <div className="border border-gray-200 p-5 bg-gray-50">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/> Co-Scholastic</h3>
               <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4 font-medium">
                 <li>Excellent in Debating</li>
                 <li>Sports: A Grade (Football)</li>
                 <li>Behavior: Outstanding</li>
                 <li>Leadership: Vice Captain</li>
               </ul>
             </div>
           </div>
           
           <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
             <button className="bg-gray-900 hover:bg-black text-white px-8 py-2.5 font-bold text-sm transition-colors">Download Detailed API</button>
           </div>
         </div>
      </div>
    </div>
  );
};
export default ProgressCards;
