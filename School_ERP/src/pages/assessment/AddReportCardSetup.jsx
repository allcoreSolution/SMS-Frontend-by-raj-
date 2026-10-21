import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';

export default function AddReportCardSetup() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');

  const handleAddExam = () => {
    if (selectedExam && !exams.find(e => e.name === selectedExam)) {
      setExams([...exams, { id: Date.now(), name: selectedExam, weightage: '100' }]);
      setSelectedExam('');
    }
  };

  const handleRemoveExam = (id) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const handleSave = () => {
    alert('Report Card Setup saved successfully!');
    navigate('/offline-exams/report-card-setups');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      <div className="bg-white p-6 border-b border-slate-200 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Report Card Setup</h1>
        </div>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
          
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Setup Name</label>
              <input 
                type="text" 
                placeholder="e.g., Annual Report Card 2025-26"
                className="w-full px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#007bff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Report Card Template</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#007bff] bg-white">
                <option value="">— Select a template —</option>
                <option value="1">CBSE Term-Wise Report Card</option>
                <option value="2">Marksheet Template KG1998</option>
                <option value="3">Pro | CBSE Term-Wise Professional Marksheet (Portrait)</option>
              </select>
              <button className="mt-2 px-3 py-1 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-none transition-colors cursor-pointer flex items-center gap-1">
                <Plus className="w-3 h-3" /> Create a new design
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Page Orientation</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#007bff] bg-white">
                <option value="portrait">Portrait (A4)</option>
                <option value="landscape">Landscape (A4)</option>
              </select>
              <p className="text-[11px] text-slate-500">Choose Landscape for board-style templates or wide consolidated tables.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Exams & Weightages</label>
              <div className="border border-slate-200 rounded-none overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200">
                      <th className="py-2.5 px-4">Exam Name</th>
                      <th className="py-2.5 px-4 w-32 text-center">Weightage (%)</th>
                      <th className="py-2.5 px-4 w-24 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {exams.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-slate-500 text-xs italic">No exams added yet.</td>
                      </tr>
                    ) : (
                      exams.map((exam, idx) => (
                        <tr key={exam.id} className="border-b border-slate-100 last:border-none">
                          <td className="py-2 px-4 text-slate-700">{exam.name}</td>
                          <td className="py-2 px-4">
                            <input 
                              type="number" 
                              defaultValue={exam.weightage}
                              className="w-full px-2 py-1 border border-slate-300 rounded-none text-sm text-center focus:outline-none focus:border-[#007bff]"
                            />
                          </td>
                          <td className="py-2 px-4 text-center">
                            <button 
                              onClick={() => handleRemoveExam(exam.id)}
                              className="text-slate-400 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-800">Add an Exam to the Report Card</label>
              <div className="flex gap-2">
                <select 
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-none text-sm text-slate-700 focus:outline-none focus:border-[#007bff] bg-white"
                >
                  <option value="">Select an exam to add</option>
                  <option value="Term 1 (2025-26)">Term 1 (2025-26)</option>
                  <option value="Term 2 (2025-26)">Term 2 (2025-26)</option>
                  <option value="Term 3 (2025-26)">Term 3 (2025-26)</option>
                  <option value="Term 4 (2025-26)">Term 4 (2025-26)</option>
                </select>
                <button 
                  onClick={handleAddExam}
                  className="px-6 py-2 bg-[#28a745] hover:bg-[#218838] text-white font-bold text-sm rounded-none transition-colors cursor-pointer border-none flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Exam
                </button>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-[#fd7e14] hover:bg-[#e86e10] text-white font-bold text-sm rounded-none shadow-sm transition-colors cursor-pointer border-none"
            >
              Save Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
