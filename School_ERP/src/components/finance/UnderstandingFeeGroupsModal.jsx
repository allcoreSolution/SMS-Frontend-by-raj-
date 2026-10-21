import React from 'react';
import { X, Calendar, Layers, Ticket, AlertTriangle, BookOpen } from 'lucide-react';

const UnderstandingFeeGroupsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#009b9f] text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-lg font-bold">Understanding Fee Groups</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-gray-600 text-[17px] mb-6 leading-relaxed">
            A Fee Group is a master package. You bundle several distinct Fee Types into one single group so you can assign them all to a student at the exact same time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Scenario 1 */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col">
              <div className="text-blue-500 font-bold text-[15px] flex items-center gap-1.5 mb-3">
                <Calendar className="w-5 h-5" /> Scenario 1: Monthly
              </div>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                Create a group called "<strong>Class 1 Monthly Fees</strong>". Add 12 rows inside it. Attach "Jan Tuition", "Feb Tuition", etc., each with its own specific due date for that month.
              </p>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col">
              <div className="text-green-600 font-bold text-[15px] flex items-center gap-1.5 mb-3">
                <Layers className="w-5 h-5" /> Scenario 2: Term-wise
              </div>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                Create a group called "<strong>Term 1 Package</strong>". Add rows for "Term 1 Tuition", "Books", and "Transport". Assign it once, and all 3 charges attach to the student.
              </p>
            </div>

            {/* Scenario 3 */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col">
              <div className="text-yellow-500 font-bold text-[15px] flex items-center gap-1.5 mb-3">
                <Ticket className="w-5 h-5" /> Scenario 3: Custom
              </div>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                Create a group called "<strong>Annual Picnic 2026</strong>". Add exactly 1 row ("Trip Fee") with an amount of ₹500. Assign this group only to the students going on the trip!
              </p>
            </div>
          </div>

          {/* Alert */}
          <div className="bg-[#dc3545] text-white p-4 rounded-md">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-5 h-5" /> Important Note for Due Dates
            </div>
            <p className="text-[13px]">
              Whatever <strong>Due Date</strong> you set on these rows here will dictate when late fines begin calculating. Ensure they are completely accurate before saving!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-[#5b5bcf] hover:bg-blue-700 text-white font-semibold py-2 px-12 rounded transition-colors shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderstandingFeeGroupsModal;
