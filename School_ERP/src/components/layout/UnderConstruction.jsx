import React from 'react';
import { HardHat, ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-50/50 rounded-xl border border-slate-200 shadow-sm p-6 text-center animate-fade-in mx-4 my-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <div className="w-24 h-24 bg-white border border-blue-100 rounded-2xl shadow-lg flex items-center justify-center relative z-10 rotate-3 transition-transform hover:rotate-6">
          <Construction className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
        </div>
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
        Module Under Development
      </h1>
      
      <p className="text-slate-500 max-w-md mb-8 text-[15px] leading-relaxed">
        We are crafting something amazing here. This specific module and its sub-pages are currently being engineered for the next big release. 
      </p>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <HardHat className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="mt-12 flex items-center gap-3 text-xs font-semibold text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        Status: Development in Progress
      </div>
    </div>
  );
};

export default UnderConstruction;
