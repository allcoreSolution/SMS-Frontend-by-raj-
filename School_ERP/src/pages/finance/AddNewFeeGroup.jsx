import React from 'react';
import { Link } from 'react-router-dom';
import { Info, HelpCircle, Layers, Plus, Save, Tag } from 'lucide-react';

const AddNewFeeGroup = () => {
  return (
    <div className="p-4 max-w-[1600px] mx-auto bg-white min-h-screen text-gray-800 pb-20">
      {/* Banner */}
      <div className="bg-[#009b9f] text-white p-2.5 rounded-none text-xs flex items-center gap-2 mb-4 shadow-sm">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p>
          <strong>New: academic-session scoping.</strong> Lists and dashboard numbers (students, exams, assessments, homework, notices...) now show the <em>selected academic session</em> only, so totals may look smaller than before — nothing was deleted. Use the session switcher in the top bar to view another year, the "View all sessions" button on lists to see everything, and note that money totals marked "(All Years)" still include every session.
        </p>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b-[3px] border-orange-400">
        <h1 className="text-[22px] font-bold text-gray-900">Add New Fee Group</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[#009b9f] bg-white border border-[#009b9f] rounded-none hover:bg-[#009b9f] hover:text-white transition-colors">
          <HelpCircle className="w-4 h-4" /> How do Fee Groups work?
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-[17px] mb-4">
          <Layers className="w-5 h-5" /> Configure Group
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Group Name <span className="text-red-500">*</span></label>
            <div className="flex rounded-none shadow-sm">
              <input 
                type="text" 
                placeholder="e.g. Tuition Fees 2026-2027" 
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md text-sm border-gray-300 border focus:ring-blue-500 focus:border-blue-500" 
              />
              <button className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-[#009b9f] bg-white text-sm hover:bg-gray-50 font-medium text-[#009b9f] transition-colors">
                + 2026-2027
              </button>
            </div>
            <p className="mt-1.5 text-xs text-[#009b9f] flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Tip: Click the button or type the session year in the name to keep fees organized across years.
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
            <textarea 
              rows={1}
              placeholder="Internal notes..." 
              className="block w-full px-3 py-2 text-sm border-gray-300 border rounded-none focus:ring-blue-500 focus:border-blue-500" 
            />
            <p className="mt-1.5 text-[11px] text-gray-500">
              Active Session: <span className="bg-green-600 text-white px-1.5 py-0.5 rounded-none font-bold ml-1">2026-2027</span>
            </p>
          </div>
        </div>

        <div className="bg-[#f0f9fa] border border-[#b2e5e7] p-4 rounded-none flex gap-3">
          <Info className="w-5 h-5 text-[#009b9f] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-gray-800 text-[13px] mb-1">Why include the session year in the group name?</h4>
            <p className="text-[13px] text-gray-600">
              When students are promoted from Class 1 to Class 2, their old fees stay on their ledger. If you name groups like "Tuition Fees", you won't know which year's fees are pending. Naming them "Tuition Fees 2026-2027" makes it instantly clear.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-green-700 font-bold text-[17px] mb-4">
          <Tag className="w-5 h-5" /> Assign Fee Types to this Group
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[13px] font-bold text-gray-700 border-b border-gray-200">
                <th className="p-3 border-r border-gray-200">Fee Type</th>
                <th className="p-3 border-r border-gray-200">Amount (₹)</th>
                <th className="p-3 border-r border-gray-200">Due Date</th>
                <th className="p-3 border-r border-gray-200">Demand Date</th>
                <th className="p-3 border-r border-gray-200">Fine Type</th>
                <th className="p-3 border-r border-gray-200">Fine Amount</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-100">
                <td className="p-6 border-r border-gray-100" colSpan={7}>
                  {/* The screenshot shows this area fairly blank/empty before adding rows */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-green-600 bg-white border border-green-600 rounded-none hover:bg-green-50 transition-colors">
            <Plus className="w-4 h-4" /> Add Another Row
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-8">
        <button className="flex items-center gap-2 bg-[#f57c00] hover:bg-[#ef6c00] text-white px-6 py-2.5 rounded-none font-bold transition-colors shadow-sm">
          <Save className="w-5 h-5" /> Create Fee Group
        </button>
      </div>
    </div>
  );
};

export default AddNewFeeGroup;
