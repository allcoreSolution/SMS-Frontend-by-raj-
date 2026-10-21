import React from 'react';
import { X, Tag, Banknote, Barcode, Trash2 } from 'lucide-react';

const UnderstandingFeeTypesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2d3748] text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 fill-current text-[#009b9f]" />
            <h2 className="text-lg font-bold">Understanding Fee Types</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-gray-600 text-[16px] mb-6 leading-relaxed">
            A Fee Type is the absolute fundamental building block of your financial system. Consider it the atomic "Ledger Head" for all accounting operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col">
              <div className="text-blue-600 font-bold text-[15px] flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                <Banknote className="w-5 h-5" /> Why are there no amounts?
              </div>
              <p className="text-gray-600 text-[13px] leading-relaxed text-justify">
                You will immediately notice there is no specific field for entering a monetary amount (₹) here. This is intentional architecture! A Fee Type strictly defines the <em>Name</em> of the charge (e.g., "Term 1 Tuition" or "Sports Transport"). The actual monetary amount is dynamically attached to it exclusively when you bundle it into a master <strong>Fee Group</strong> later.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col">
              <div className="text-[#009b9f] font-bold text-[15px] flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                <Barcode className="w-5 h-5" /> The Importance of Fee Codes
              </div>
              <p className="text-gray-600 text-[13px] leading-relaxed text-justify">
                Always assign a short, recognizable <strong>Fee Code</strong> (e.g., "TUI" for Tuition, "SPRT" for Sports Package). This code is absolutely critical. It acts as the backbone for backend financial filters, CSV bulk exports, and integrations with external accounting software.
              </p>
            </div>
          </div>

          {/* Full Width Card */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="text-red-600 font-bold text-[15px] flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <Trash2 className="w-5 h-5" /> Crucial Deletion Protocol
            </div>
            <p className="text-gray-600 text-[13px] leading-relaxed mb-3">
              Yes, you can confidently delete a newly created Fee Type if you entered a typo.
            </p>
            <p className="text-gray-600 text-[13px] leading-relaxed">
              <strong>HOWEVER:</strong> If that Fee Type has <em>ever</em> been bundled into an active Fee Group or successfully processed inside a paid parent receipt, the system permanently locks the deletion toggle. Our architecture forces this to preserve flawless, auditable historical ledger accuracy. You cannot delete a Fee Type with active financial history.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-center mt-4">
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

export default UnderstandingFeeTypesModal;
