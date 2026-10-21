import React, { useState } from 'react';
import { Code, Puzzle, Plus, Lock, Download, Layers, Check, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const initTemplates = [
  { id: 1, name: 'Multi School ERPv2.0 Orange Full', tag: 'orange', updatedAt: '4 weeks ago', active: true },
  { id: 2, name: 'Blue Classic Template', tag: 'blue', updatedAt: '2 months ago', active: false },
];

export default function LandingTemplates() {
  const [templates, setTemplates] = useState(initTemplates);
  const [mode, setMode] = useState('html'); // 'html' | 'builder'
  const [saved, setSaved] = useState(false);

  // Set active template
  const setActive = (id) => {
    setTemplates(templates.map(t => ({ ...t, active: t.id === id })));
  };

  // Delete template
  const handleDelete = (id) => {
    if (templates.find(t => t.id === id)?.active) {
      Swal.fire({ icon: 'warning', title: 'Cannot Delete', text: 'Cannot delete the active template.', confirmButtonColor: '#0891b2' });
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this template?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setTemplates(templates.filter(t => t.id !== id));
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Code className="w-7 h-7 text-gray-700" />
          <h1 className="text-[22px] font-medium text-gray-800">Landing Page Templates</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => Swal.fire({ icon: 'info', text: 'Section Builder coming soon.', confirmButtonColor: '#0891b2' })}
            className="flex items-center gap-2 px-4 py-2 bg-[#6c757d] text-white rounded-none hover:bg-gray-600 text-sm font-medium transition-colors"
          >
            <Puzzle className="w-4 h-4" />
            Section Builder
          </button>
          <button
            onClick={() => Swal.fire({ icon: 'info', text: 'New Template form coming soon.', confirmButtonColor: '#0891b2' })}
            className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white rounded-none hover:bg-orange-600 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Demo Warning */}
      <div className="flex items-center gap-2 bg-[#fff8e1] border border-[#fde68a] rounded-none p-3 mb-6 text-sm text-[#854d0e]">
        <Lock className="w-4 h-4 text-[#ca8a04] flex-shrink-0" />
        <p><strong>Demo mode:</strong> read-only in demo — saving and deleting are disabled for security.</p>
      </div>

      {/* Mode Toggle Card */}
      <div className="bg-white border-t-2 border-green-500 border-x border-b border-gray-300 rounded-none shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => setMode(m => m === 'html' ? 'builder' : 'html')}
                className={`relative w-11 h-6 rounded-none transition-colors focus:outline-none ${mode === 'html' ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-none shadow transition-transform ${mode === 'html' ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <h2 className="text-base font-semibold text-gray-800">
                Landing Page Mode:{' '}
                <span className={`text-sm px-2 py-0.5 rounded-none ml-1 font-bold text-white ${mode === 'html' ? 'bg-[#22c55e]' : 'bg-[#6c757d]'}`}>
                  {mode === 'html' ? 'Full HTML Template' : 'Section Builder'}
                </span>
              </h2>
            </div>
            <p className="text-sm text-gray-500 ml-14">
              {mode === 'html'
                ? 'Your custom HTML template is live. Visitors see the full template (header to footer).'
                : 'Section builder is active. Visitors see the drag & drop built page.'}
            </p>
          </div>
          <button
            onClick={() => setMode(m => m === 'html' ? 'builder' : 'html')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#17a2b8] text-[#17a2b8] rounded-none hover:bg-cyan-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Puzzle className="w-4 h-4" />
            {mode === 'html' ? 'Switch to Section Builder' : 'Switch to HTML Template'}
          </button>
        </div>
      </div>

      {/* Quick Import */}
      <div className="bg-white border-t-2 border-yellow-500 border-x border-b border-gray-300 rounded-none shadow-sm p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => Swal.fire({ icon: 'info', text: 'Quick Import: Upload a .zip HTML template.', confirmButtonColor: '#0891b2' })}>
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
          <Download className="w-5 h-5 text-gray-600" />
          Quick Import (Upload ZIP Template)
        </div>
        <Plus className="w-5 h-5 text-gray-400" />
      </div>

      {/* Saved Templates Table */}
      <div className="bg-white border-t-2 border-gray-400 border-x border-b border-gray-300 rounded-none shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-300 flex items-center gap-2 font-semibold text-gray-800 bg-gray-50 text-sm">
          <Layers className="w-5 h-5 text-gray-600" />
          Saved Templates ({templates.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300 w-20">Status</th>
                <th className="px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300">Template Name</th>
                <th className="px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300">Tag</th>
                <th className="px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300">Last Updated</th>
                <th className="px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.length > 0 ? templates.map((t) => (
                <tr key={t.id} className={t.active ? 'bg-[#d1e7dd]' : 'bg-white hover:bg-gray-50'}>
                  <td className="px-4 py-3 border border-gray-300">
                    <div className={`w-7 h-7 rounded-none flex items-center justify-center ${t.active ? 'bg-[#198754] text-white' : 'bg-gray-300 text-gray-500'}`}>
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-sm text-gray-500">{t.tag}</td>
                  <td className="px-4 py-3 border border-gray-300 text-sm text-gray-600">{t.updatedAt}</td>
                  <td className="px-4 py-3 border border-gray-300">
                    <div className="flex items-center gap-1">
                      <button className="flex items-center gap-1 bg-[#17a2b8] hover:bg-[#138496] text-white px-2 py-1 rounded-none text-xs transition-colors">
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      {t.active ? (
                        <span className="flex items-center gap-1 bg-[#c3e6cb] text-[#155724] border border-[#b1dfbb] px-2 py-1 rounded-none text-xs font-medium">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <button
                          onClick={() => setActive(t.id)}
                          className="flex items-center gap-1 bg-[#28a745] hover:bg-green-700 text-white px-2 py-1 rounded-none text-xs transition-colors"
                        >
                          Set Active
                        </button>
                      )}
                      {!t.active && (
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="flex items-center gap-1 bg-[#dc3545] hover:bg-red-700 text-white px-2 py-1 rounded-none text-xs transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500 border border-gray-300">
                    No templates saved yet. Upload one using Quick Import.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
