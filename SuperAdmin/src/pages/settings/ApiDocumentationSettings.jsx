import React from 'react';
import { Plug, CheckCircle2, ArrowRight, ShieldCheck, Code2 } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import { useNavigate } from 'react-router-dom';

export default function ApiDocumentationSettings() {
  const navigate = useNavigate();

  return (
    <SettingsLayout activeTab="api-docs">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1150px] mx-auto w-full">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-10 flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-blue-600 shadow-xs">
              <Plug className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Interactive API Documentation</h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
              Complete REST API specification for School ERP — authentication, attendance, fee collection, student records, and webhooks.
            </p>

            <div className="flex flex-col gap-2.5 mb-8 text-left w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              {[
                'Full endpoint catalog for SuperAdmin, School Admin, Teacher, and Parents',
                'Interactive live testing sandbox with JWT Bearer authentication',
                'JSON Request / Response schemas and error status definitions',
                'Mobile App and external webhook integration guides'
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/api-docs')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
            >
              <span>Open Interactive API Docs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </SettingsLayout>
  );
}
