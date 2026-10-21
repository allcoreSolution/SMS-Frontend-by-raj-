import React from 'react';
import { 
  X, Info, AlertTriangle, Layers, Banknote, Wallet, Receipt, 
  ArrowRight, FilePlus, PlusCircle, Printer, CheckCircle
} from 'lucide-react';

const HowItWorksModal = ({ isOpen, onClose, onGenerate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#007bff] text-white p-3 flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Layers className="w-5 h-5" /> Fee Challans — Complete Guide
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50">
          
          {/* Section 1: What is a Fee Challan */}
          <div className="bg-white border border-gray-200 rounded-md mb-4 shadow-sm overflow-hidden">
            <div className="bg-white px-4 py-2 border-b border-teal-500 border-t-2 border-t-teal-500">
              <h3 className="font-bold text-teal-600 flex items-center gap-1.5 text-sm">
                <Info className="w-4 h-4" /> What is a Fee Challan?
              </h3>
            </div>
            <div className="p-4 text-gray-700 text-sm">
              <p className="mb-3">
                A <strong>Fee Challan</strong> (also called a <em>Demand Slip</em> or <em>Voucher</em>) is a <strong>pre-payment document</strong> you issue to parents/guardians. It tells them exactly how much to pay, for what, and by when.
              </p>
              <div className="bg-[#ffc107] text-gray-900 p-3 rounded text-sm flex items-start gap-2 shadow-sm font-medium">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p><strong>Important:</strong> A challan is NOT a receipt. It's a request to pay. A proper <strong>Fee Receipt</strong> is generated only after you record the payment.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Three Types of Challans */}
          <div className="bg-white border border-gray-200 rounded-md mb-4 shadow-sm overflow-hidden">
            <div className="bg-white px-4 py-2 border-b border-green-500 border-t-2 border-t-green-500">
              <h3 className="font-bold text-green-700 flex items-center gap-1.5 text-sm">
                <Layers className="w-4 h-4" /> Three Types of Challans
              </h3>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Fee Payment */}
                <div className="bg-white border border-gray-100 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-md mb-3">
                    <Banknote className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Fee Payment</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Linked to specific pending fee items (tuition, exam fee, etc). When paid, each fee item is updated as partially/fully paid and a Fee Receipt is generated.
                  </p>
                </div>

                {/* Wallet Top-up */}
                <div className="bg-white border border-gray-100 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-md mb-3">
                    <Wallet className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Wallet Top-up</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Credits the student's wallet with a specific amount. Useful for advance deposits or excess payments. The wallet balance can later be used against future fee dues.
                  </p>
                </div>

                {/* Miscellaneous */}
                <div className="bg-white border border-gray-100 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-500 rounded-md mb-3">
                    <Receipt className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Miscellaneous</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    For non-fee collections (uniform cost, event charges, etc). Recorded as income in the school's accounts under a dedicated income head.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Section 3: Challan Lifecycle */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden mb-2">
            <div className="bg-white px-4 py-2 border-b border-orange-500 border-t-2 border-t-orange-500">
              <h3 className="font-bold text-gray-700 flex items-center gap-1.5 text-sm">
                <ArrowRight className="w-4 h-4 text-blue-500" /> Challan Lifecycle
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Created */}
                <div className="text-center w-full md:w-1/3">
                  <div className="inline-block bg-[#ffc107] text-gray-900 font-bold px-4 py-1.5 rounded-md text-sm mb-2 uppercase">
                    <div className="flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4" /> Created
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Admin generates challan</p>
                </div>

                <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />

                {/* Printed */}
                <div className="text-center w-full md:w-1/3">
                  <div className="inline-block bg-[#17a2b8] text-white font-bold px-4 py-1.5 rounded-md text-sm mb-2 uppercase">
                    <div className="flex items-center gap-1.5">
                      <Printer className="w-4 h-4" /> Printed
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Give demand slip to parent</p>
                </div>

                <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />

                {/* Paid */}
                <div className="text-center w-full md:w-1/3">
                  <div className="inline-block bg-[#28a745] text-white font-bold px-4 py-1.5 rounded-md text-sm mb-2 uppercase">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Paid
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Parent pays, admin records it</p>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => {
              onClose();
              if(onGenerate) onGenerate();
            }}
            className="px-5 py-2 bg-[#5a67d8] text-white rounded-md text-sm font-bold flex items-center gap-1.5 hover:bg-[#4c51bf] transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Generate Challan Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;
