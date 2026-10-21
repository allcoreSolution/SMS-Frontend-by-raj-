import React from 'react';
import { 
  X, GraduationCap, Clock, ShieldCheck, Lock
} from 'lucide-react';

const UnderstandingAssignmentsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-gray-50 rounded shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#343a40] text-white p-3.5 flex justify-between items-center">
          <h2 className="font-bold text-[15px] flex items-center gap-2 tracking-wide">
            <GraduationCap className="w-5 h-5 text-teal-400" /> Understanding Fee Assignments
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-gray-600 text-[14px] leading-relaxed mb-6 font-light">
            Assigning a Fee Group attaches those specific financial charges directly to the selected students' ledgers. Here is everything you need to know about how this engine works:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
            {/* Demand Date Card */}
            <div className="bg-white border border-gray-100 rounded shadow-sm p-5">
              <h3 className="font-bold text-[#0bc5ea] flex items-center gap-1.5 text-sm mb-3 border-b border-gray-100 pb-2">
                <Clock className="w-4 h-4" /> The Demand Date Advantage
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                <strong className="text-gray-700">Demand Date</strong> is your secret weapon. If you assign a fee today but set the Demand Date to next month, the fee is securely generated in the backend but remains <strong>completely invisible</strong> to the parents' Mobile App until that exact date arrives. This allows you to rapidly configure the whole academic year in advance without causing parents to panic over huge outstanding balances!
              </p>
            </div>

            {/* Smart Duplicate Protection Card */}
            <div className="bg-white border border-gray-100 rounded shadow-sm p-5">
              <h3 className="font-bold text-[#38a169] flex items-center gap-1.5 text-sm mb-3 border-b border-gray-100 pb-2">
                <ShieldCheck className="w-4 h-4" /> Smart Duplicate Protection
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                Worried about double-billing a student? Don't be. The system has built-in duplicate protection. If you select a Fee Group that a student already has, their checkbox will be <strong>disabled and greyed out</strong>. You physically cannot assign the exact same Fee Group to the same student twice during an academic session.
              </p>
            </div>

          </div>

          {/* Limitation Card */}
          <div className="bg-white border border-gray-100 rounded shadow-sm p-5 mb-4">
             <h3 className="font-bold text-[#e53e3e] flex items-center gap-1.5 text-sm mb-3 border-b border-gray-100 pb-2">
                <Lock className="w-4 h-4" /> Crucial Limitation: Unassigning Fees
              </h3>
              <p className="text-[12px] text-gray-600 mb-4">
                You can switch to <strong>Unassign Mode</strong> (the red toggle) to remove a Fee Group from a student.
              </p>
              <p className="text-[12px] text-gray-800 leading-relaxed">
                <strong>HOWEVER:</strong> You can only remove it if the student has <strong>$0 / ₹0 paid</strong> against it. The absolute second a parent makes a partial or full payment towards <em>any</em> fee type inside that group, the database permanently locks the assignment. This strict rule exists to completely prevent accounting corruption and missing receipt data.
              </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-5 flex justify-center border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative z-10">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-[#5a67d8] hover:bg-[#4c51bf] text-white rounded font-bold text-sm shadow-sm transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

export default UnderstandingAssignmentsModal;
