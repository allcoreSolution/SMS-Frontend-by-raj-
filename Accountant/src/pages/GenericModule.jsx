import React from 'react';
import { FileText, Plus } from 'lucide-react';

const GenericModule = ({ title, subtitle, icon: Icon = FileText }) => {
  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-white p-2 rounded-[3px] shadow-sm text-[#3c8dbc] border border-gray-100">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-[#333] leading-none mb-1.5">{title}</h1>
          <p className="text-[13px] text-gray-500">{subtitle}</p>
        </div>
      </div>
      
      <div className="bg-white border-t-[3px] border-t-[#3c8dbc] rounded-[3px] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-[#fefefe]">
          <h3 className="text-[15px] font-semibold text-[#333]">Manage {title}</h3>
          <button className="bg-[#3c8dbc] hover:bg-[#367fa9] transition-colors text-white px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Add New
          </button>
        </div>
        
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm relative">
            <Icon className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-[17px] font-bold text-gray-700 mb-2">No Data Available</h4>
          <p className="text-gray-500 text-[13px] max-w-sm mb-6">
            The <b>{title}</b> module is currently empty or pending connection to the live ERP backend.
          </p>
          <div className="flex gap-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-[#333] text-[13px] font-medium px-4 py-2 rounded-[3px] transition-colors">
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericModule;
