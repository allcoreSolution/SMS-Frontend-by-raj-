import React from 'react';
import { Settings } from 'lucide-react';

export default function DummySettings() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-14 h-14 rounded-none-none bg-gray-100 flex items-center justify-center mb-4">
        <Settings className="w-7 h-7 text-gray-400" />
      </div>
      <h1 className="text-xl font-bold text-gray-700 mb-2">Settings</h1>
      <p className="text-sm text-gray-400">This section is currently under construction.</p>
    </div>
  );
}
