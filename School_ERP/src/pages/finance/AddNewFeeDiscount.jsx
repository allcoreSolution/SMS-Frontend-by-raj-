import React from 'react';
import { Link } from 'react-router-dom';
import { Info, HelpCircle, Save } from 'lucide-react';

const AddNewFeeDiscount = () => {
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
        <h1 className="text-[22px] font-bold text-gray-900">Add New Fee Discount</h1>
        <p className="text-[13px] text-gray-500">Define a discount rule you can assign to students</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (Form) */}
        <div className="flex-1 bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-[15px] font-bold text-[#5b5bcf] flex items-center gap-2">
              <span className="text-xl leading-none font-black">%</span> New Discount
            </h2>
          </div>

          <div className="p-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Discount Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Sibling Discount" 
                  className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Discount Code <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. SIBLING10" 
                  className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Discount Type <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]">
                  <option value="fixed">Fixed</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Amount / Percentage <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. 10" 
                  className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Description</label>
              <textarea 
                rows={3}
                placeholder="Optional notes about this discount..." 
                className="w-full border border-gray-300 rounded-none text-[13px] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5b5bcf] focus:border-[#5b5bcf]"
              />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
            <Link to="/finance/discount" className="px-5 py-2 border border-gray-300 rounded-none text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button className="flex items-center gap-1.5 bg-[#5b5bcf] hover:bg-blue-700 text-white px-5 py-2 rounded-none text-[13px] font-semibold transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Create Discount
            </button>
          </div>
        </div>

        {/* Right Column (Info Card) */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-purple-100 text-[#5b5bcf] p-1.5 rounded-none">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-800 text-[14px]">How discounts work</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-[#5b5bcf] rounded-none mt-2 flex-shrink-0"></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    <strong>Fixed</strong> deducts an exact flat amount (e.g. ₹500).
                  </p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-[#5b5bcf] rounded-none mt-2 flex-shrink-0"></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    <strong>Percentage</strong> scales with the total fee (e.g. 10%).
                  </p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-[#5b5bcf] rounded-none mt-2 flex-shrink-0"></div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    Assign the code to students under <strong>Assign Fees</strong>; it applies automatically at collection.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddNewFeeDiscount;
