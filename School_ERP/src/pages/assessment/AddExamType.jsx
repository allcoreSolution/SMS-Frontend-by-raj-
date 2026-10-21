import React from 'react';
import { Tags, Lightbulb, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddExamType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Add New Exam Type</h1>
        <p className="text-sm text-slate-500">Define the kinds of assessment your exams are made of</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-none shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
            <Tags className="w-4 h-4 text-[#6f42c1]" />
            <h2 className="text-sm font-bold text-[#6f42c1]">New Exam Type</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Name</label>
              <input 
                type="text" 
                placeholder="e.g., Half Yearly Theory, Periodic Test 1"
                className="w-full px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#6f42c1]"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Abbreviation (optional)</label>
              <input 
                type="text" 
                placeholder="e.g., HYT, PT1"
                className="w-full px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#6f42c1]"
              />
              <p className="text-[10px] text-slate-500">Short code used on marksheets and report cards where space is tight.</p>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-[#f8f9fc]">
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-none shadow-sm hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-[#5b5fcf] hover:bg-[#4a4db5] text-white font-bold text-sm rounded-none shadow-sm flex items-center gap-2 cursor-pointer transition-colors border-none"
            >
              <Save className="w-4 h-4" /> Create Exam Type
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-none bg-[#f0ebfa] text-[#6f42c1] flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">What is an exam type?</h2>
            </div>
            <ul className="space-y-4 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-[#6f42c1] mt-1.5 shrink-0"></div>
                <div>
                  <strong>Components of an exam</strong> — a single exam can carry several types, such as <strong>Theory</strong>, <strong>Practical</strong> or <strong>Note Book</strong>, each with its own marks.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-[#6f42c1] mt-1.5 shrink-0"></div>
                <div>
                  <strong>Term names too</strong> — many schools also add types like <strong>Half Yearly</strong> or <strong>Annual Examination</strong> to structure the report card.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-[#6f42c1] mt-1.5 shrink-0"></div>
                <div>
                  <strong>Abbreviations</strong> — printed marksheets have narrow columns, so a short code like <strong>TH</strong> or <strong>PT1</strong> keeps them readable.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
