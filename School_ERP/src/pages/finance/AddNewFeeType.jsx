import React from 'react';
import { Link } from 'react-router-dom';
import { Info, Save, Tag, Lightbulb, BookOpen } from 'lucide-react';

const AddNewFeeType = () => {
  return (
    <div className="p-4 max-w-[1600px] mx-auto bg-gray-50 min-h-screen text-gray-800 pb-20">
      {/* Banner */}
      <div className="bg-[#009b9f] text-white p-2.5 rounded-none text-xs flex items-center gap-2 mb-4 shadow-sm">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p>
          <strong>New: academic-session scoping.</strong> Lists and dashboard numbers (students, exams, assessments, homework, notices...) now show the <em>selected academic session</em> only, so totals may look smaller than before — nothing was deleted. Use the session switcher in the top bar to view another year, the "View all sessions" button on lists to see everything, and note that money totals marked "(All Years)" still include every session.
        </p>
      </div>

      {/* Header */}
      <div className="mb-6 pb-2 border-b-[3px] border-[#009b9f]">
        <h1 className="text-[22px] font-bold text-gray-900">Add New Fee Type</h1>
        <p className="text-[13px] text-gray-500">Define a single charge that appears on receipts</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (Form) */}
        <div className="flex-1 bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-[15px] font-bold text-[#5b5bcf] flex items-center gap-2">
              <Tag className="w-5 h-5 fill-current" /> New Fee Type
            </h2>
          </div>

          <div className="p-6 flex-1 space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Fee Type Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. Tuition Fee, Admission Fee" 
                className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]"
              />
              <p className="mt-1.5 text-[11px] text-gray-500">The exact name of the fee that will appear on student receipts.</p>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Fee Code <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input 
                type="text" 
                placeholder="e.g. TUIT2024" 
                className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]"
              />
              <p className="mt-1.5 text-[11px] text-gray-500">Used by accountants to identify this fee category in reports.</p>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea 
                rows={3}
                placeholder="Add internal notes about this fee..." 
                className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]"
              />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
            <Link to="/finance/types" className="px-5 py-2 border border-gray-300 rounded-none text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button className="flex items-center gap-1.5 bg-[#5b5bcf] hover:bg-blue-700 text-white px-5 py-2 rounded-none text-[13px] font-semibold transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Create Fee Type
            </button>
          </div>
        </div>

        {/* Right Column (Info Card) */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-purple-100 text-[#5b5bcf] p-1.5 rounded-none flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-800 text-[14px]">How Fee Types work</h3>
              </div>
              
              <ul className="space-y-5 mb-6">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-[#5b5bcf] rounded-none mt-2 flex-shrink-0"></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    <strong>Foundation</strong> — a single, distinct charge (e.g. January Transport, Book Fee, Tuition Installment 1).
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-[#5b5bcf] rounded-none mt-2 flex-shrink-0"></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    <strong>No amounts here</strong> — you set amounts and due dates when you attach the type to a Fee Group.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-[#5b5bcf] rounded-none mt-2 flex-shrink-0"></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    <strong>Receipts</strong> — the exact name you type is printed line-by-line on the parent's receipt.
                  </p>
                </li>
              </ul>
              
              <div className="bg-[#fdfaff] border border-[#e9d5ff] p-4 rounded-none flex gap-3">
                <Lightbulb className="w-4 h-4 text-[#7e22ce] flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#6b21a8] leading-relaxed">
                  Collecting monthly transport? Create 12 types (Transport - Jan, Feb, ...) so each shows uniquely on receipts.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddNewFeeType;
