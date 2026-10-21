import React, { useState } from 'react';
import { X, Calendar, Check, Info } from 'lucide-react';

const QuickSetupModal = ({ isOpen, onClose }) => {
  const [selectedFrequency, setSelectedFrequency] = useState('Monthly');

  if (!isOpen) return null;

  const frequencies = [
    { id: 'Monthly', label: 'Monthly', desc: '12 installments' },
    { id: 'Quarterly', label: 'Quarterly', desc: '4 installments' },
    { id: 'Termly', label: 'Termly', desc: '3 installments' },
    { id: 'Half-Yearly', label: 'Half-Yearly', desc: '2 installments' },
    { id: 'One-Time Annual', label: 'One-Time Annual', desc: '1 installment' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all duration-300">
      {/* Modal Container */}
      <div 
        className={`w-full max-w-[600px] h-full bg-gray-50 shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white">
              <span className="font-bold text-lg">💸</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Quick Fee Setup</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Guided Tuition Structure</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Frequency */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex gap-2 items-start mb-4">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
              <div>
                <h3 className="text-[13px] font-bold text-gray-800">How often do you collect tuition?</h3>
                <p className="text-[11px] text-gray-500">This decides how many installments we create.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {frequencies.map(f => (
                <div 
                  key={f.id}
                  onClick={() => setSelectedFrequency(f.id)}
                  className={`border rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    selectedFrequency === f.id 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Calendar className={`w-5 h-5 mb-2 ${selectedFrequency === f.id ? 'text-indigo-600' : 'text-blue-500'}`} />
                  <p className={`text-[11px] font-bold mb-1 ${selectedFrequency === f.id ? 'text-indigo-900' : 'text-gray-700'}`}>{f.label}</p>
                  <p className="text-[9px] text-gray-500 font-semibold">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Amount & Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex gap-2 items-start mb-4">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
              <div>
                <h3 className="text-[13px] font-bold text-gray-800">Amount & schedule</h3>
                <p className="text-[11px] text-gray-500">The yearly total is split evenly across the installments.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Structure name</label>
                  <input 
                    type="text" 
                    defaultValue="Tuition Fees 2026-2027" 
                    className="w-full border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">You'll assign this to classes from "Assign Fees".</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Total tuition for the year</label>
                  <div className="flex relative">
                    <span className="absolute left-0 top-0 bottom-0 px-3 bg-gray-100 border-r border-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-l font-medium">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 24000" 
                      className="w-full border border-gray-200 rounded p-2 pl-10 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">First installment due date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      defaultValue="2026-04-01"
                      className="w-full border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 text-gray-700"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Later installments follow automatically.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Late fine</label>
                    <select className="w-full border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 text-gray-700">
                      <option>No fine</option>
                      <option>Fixed Amount</option>
                      <option>Percentage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Fine value</label>
                    <input 
                      type="number" 
                      defaultValue="0"
                      disabled
                      className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Show each installment in advance</label>
                <div className="flex w-64">
                  <input 
                    type="number" 
                    defaultValue="0"
                    className="w-1/3 border border-gray-200 border-r-0 rounded-l p-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <div className="w-2/3 bg-blue-50/50 border border-gray-200 text-gray-600 rounded-r p-2 text-xs font-medium flex items-center">
                    days before its due date
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5">Parents see an installment from its demand date. Leave 0 to show it on the due date; each month still appears in its own turn.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Preview */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
             <div className="flex gap-2 items-start mb-4">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
              <div>
                <h3 className="text-[13px] font-bold text-gray-800">Preview & create</h3>
                <p className="text-[11px] text-gray-500">This is exactly what will be created. Nothing is saved until you click Create.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4">Enter a total amount above to see the schedule.</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
               <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
               <p className="text-[11px] text-yellow-800 font-medium">Tuition here is one continuous ledger — you never "carry forward" unpaid dues between years. Anything still owed simply stays visible on Collect Fees.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" /> Create Fee Structure
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSetupModal;
