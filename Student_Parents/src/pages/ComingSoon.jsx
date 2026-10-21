import React from 'react';
import { Construction } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="p-5 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-blue-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-700 mb-2">{title}</h2>
      <p className="text-sm text-gray-400">This module is under development. Check back soon.</p>
    </div>
  );
}
