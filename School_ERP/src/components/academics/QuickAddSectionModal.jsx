import React, { useState } from 'react';
import { X, Plus, Layers, Check, Loader2, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

export default function QuickAddSectionModal({ isOpen, onClose, onSectionAdded }) {
  const [sectionName, setSectionName] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [loading, setLoading] = useState(false);

  const presets = ['A', 'B', 'C', 'D', 'E', 'Rose', 'Lotus', 'Tulip', 'Gold', 'Diamond'];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = sectionName.trim();
    if (!cleanName) {
      Swal.fire({
        title: 'Section Name Required',
        text: 'Please enter a section name (e.g. A, B, C, Rose).',
        icon: 'warning',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    try {
      setLoading(true);
      const res = await academicService.createSection({
        sectionName: cleanName,
        capacity: Number(capacity) || 40,
        status: 'active'
      });

      if (res?.success) {
        Swal.fire({
          title: 'Section Created!',
          text: `Section "${cleanName}" has been successfully added.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });

        if (onSectionAdded) {
          onSectionAdded(res.data);
        }
        setSectionName('');
        setCapacity(40);
        onClose();
      } else {
        throw new Error(res?.message || 'Failed to create section');
      }
    } catch (err) {
      console.error('Error creating section:', err);
      const msg = err.response?.data?.message || err.message || 'Could not create section';
      Swal.fire({
        title: 'Creation Failed',
        text: msg.includes('duplicate') || msg.includes('E11000') 
          ? `Section "${cleanName}" already exists in the system!` 
          : msg,
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Quick Add Section</h3>
              <p className="text-xs text-indigo-100 font-medium">Create a new section division instantly</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Quick Suggestions Chips */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Quick Preset Names:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSectionName(name)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    sectionName === name 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Name Input */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Section Name *</label>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. A, B, Rose, Lotus"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all"
              required
              autoFocus
            />
          </div>

          {/* Capacity Input */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Student Capacity</label>
            <input
              type="number"
              min="1"
              max="150"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 40 students per section</span>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
