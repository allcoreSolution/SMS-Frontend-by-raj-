import React from 'react';
import { Settings, HelpCircle, HardDrive } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const GenericPage = () => {
  const location = useLocation();
  const pathName = location.pathname.substring(1).replace('-', ' ') || 'Page';

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <Settings className="w-10 h-10 text-orange-500 animate-spin-slow" style={{ animationDuration: '4s' }} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{pathName}</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
        This module is currently being configured and mapped for the multi-branch network. Full functionality will be available shortly.
      </p>
      
      <div className="grid grid-cols-2 gap-4 max-w-md w-full">
        <div className="bg-white p-4 rounded-[3px] border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md cursor-pointer transition-shadow">
          <div className="bg-blue-50 p-2 rounded-[3px] text-blue-500"><HelpCircle className="w-5 h-5"/></div>
          <div className="text-left"><h4 className="font-bold text-sm text-gray-800">Need Help?</h4><p className="text-[11px] text-gray-400">Read documentation</p></div>
        </div>
        <div className="bg-white p-4 rounded-[3px] border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md cursor-pointer transition-shadow">
          <div className="bg-green-50 p-2 rounded-[3px] text-green-600"><HardDrive className="w-5 h-5"/></div>
          <div className="text-left"><h4 className="font-bold text-sm text-gray-800">System Status</h4><p className="text-[11px] text-gray-400">All services active</p></div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
