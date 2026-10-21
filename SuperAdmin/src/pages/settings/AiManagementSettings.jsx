import React from 'react';
import { Lock, BrainCircuit, ExternalLink } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';

export default function AiManagementSettings() {
  return (
    <SettingsLayout activeTab="ai-mgmt">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">
          
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm p-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-none-none bg-blue-50 flex items-center justify-center mb-4">
              <BrainCircuit className="w-7 h-7 text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">AI Management</h1>
            <p className="text-sm text-gray-500 max-w-[1150px] leading-relaxed mb-6">
              Usage analytics, model limits and AI feature configuration.
            </p>
            <button onClick={() => window.open('/ai-management', '_blank')}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-none-none transition-colors text-sm">
              <ExternalLink className="w-4 h-4" /> Open AI Management
            </button>
            <p className="text-xs text-gray-400 mt-3">Opens the full workspace in a new tab.</p>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
