import React, { useState } from 'react';
import { User, Award, CheckCircle, Search, AlertCircle, FileText } from 'lucide-react';

const ProgressCards = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-100 text-cyan-600 flex items-center justify-center rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Holistic Progress Cards</h1>
            <p className="text-sm text-gray-500">View detailed student 360-degree performance</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto mt-6">
        {selectedStudent ? (
          <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl">
                {selectedStudent.name ? selectedStudent.name.charAt(0) : 'S'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">{selectedStudent.name}</h2>
                <p className="text-sm text-gray-500 font-medium">{selectedStudent.class} | Roll: {selectedStudent.rollNo}</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 text-sm font-bold rounded-lg transition-colors"
              >
                Change Student
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 p-12 text-center rounded-2xl shadow-2xs">
            <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Student Selected</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Search or select a registered student from your class roster to generate and view their Holistic Progress Card (HPC).
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span>Real progress cards will load dynamically from class assessment records.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCards;
