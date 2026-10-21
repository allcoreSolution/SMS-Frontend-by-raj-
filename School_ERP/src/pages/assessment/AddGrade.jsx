import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Lightbulb } from 'lucide-react';

export default function AddGrade() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans pb-10">
      <div className="bg-white p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800">Add New Grade</h1>
        <p className="text-sm text-slate-500 mt-1">Map a percentage band to the grade printed on marksheets</p>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Form Panel */}
        <div className="flex-1 bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden h-fit">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-[#5e35b1]">
            <Award className="w-4 h-4" />
            <h2 className="text-sm font-bold">New Grade</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Grade Name</label>
              <input 
                type="text" 
                placeholder="e.g., A+, A1, Distinction"
                className="w-full px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#5e35b1]"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-800">Minimum Percentage</label>
                <div className="flex">
                  <input 
                    type="number" 
                    placeholder="e.g., 91"
                    className="w-full px-3 py-2 border border-slate-300 rounded-l text-sm text-slate-700 focus:outline-none focus:border-[#5e35b1]"
                  />
                  <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 rounded-r text-sm text-slate-500 font-bold">%</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-800">Maximum Percentage</label>
                <div className="flex">
                  <input 
                    type="number" 
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 border border-slate-300 rounded-l text-sm text-slate-700 focus:outline-none focus:border-[#5e35b1]"
                  />
                  <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 rounded-r text-sm text-slate-500 font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Description (optional)</label>
              <input 
                type="text" 
                placeholder="e.g., Outstanding"
                className="w-full px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#5e35b1]"
              />
              <p className="text-[11px] text-slate-500">Shown alongside the grade on report cards where the template has room for it.</p>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button 
              onClick={() => navigate('/offline-exams/manage-grades')}
              className="px-6 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-none transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                alert('Grade saved successfully!');
                navigate('/offline-exams/manage-grades');
              }}
              className="px-6 py-2 bg-[#5e35b1] hover:bg-[#512da8] text-white font-bold text-sm rounded-none shadow-sm flex items-center gap-2 transition-colors cursor-pointer border-none"
            >
              <span className="text-sm">💾</span> Save Grade
            </button>
          </div>
        </div>

        {/* Right Documentation Panel */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
            <h3 className="text-sm font-bold text-[#5e35b1] flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-[#5e35b1] fill-current opacity-50" /> 
              How grading bands work
            </h3>
            <ul className="text-[13px] text-slate-600 space-y-4 list-disc pl-4 marker:text-slate-400">
              <li>
                <span className="font-bold text-slate-800">Cover the full range</span> — the bands should run from 0% all the way to 100%, so every possible result lands on a grade.
              </li>
              <li>
                <span className="font-bold text-slate-800">Overlaps are blocked</span> — if the range you enter collides with an existing grade, the save is rejected and the clashing grade is named for you.
              </li>
              <li>
                <span className="font-bold text-slate-800">Mind the gaps</span> — a band ending at 90 and the next starting at 91 leaves 90.5 matching no grade. Whole boundaries like <strong>81-90</strong> and <strong>91-100</strong> are the usual convention.
              </li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}
