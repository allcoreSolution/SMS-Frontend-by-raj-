import React, { useState, useEffect } from 'react';
import { X, Plus, Layers, Check, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

export default function QuickAddClassModal({ isOpen, onClose, onClassAdded }) {
  const [className, setClassName] = useState('');
  const [numericValue, setNumericValue] = useState(1);
  const [selectedSections, setSelectedSections] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSections, setFetchingSections] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSections();
      setClassName('');
      setNumericValue(1);
      setSelectedSections([]);
    }
  }, [isOpen]);

  const fetchSections = async () => {
    try {
      setFetchingSections(true);
      const res = await academicService.getSections();
      if (res?.success && Array.isArray(res?.data)) {
        setAvailableSections(res.data);
        // Default select section A if available
        const secA = res.data.find(s => s.sectionName === 'A' || s.name === 'A');
        if (secA) setSelectedSections([secA._id]);
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
    } finally {
      setFetchingSections(false);
    }
  };

  const handleToggleSection = (secId) => {
    setSelectedSections(prev => 
      prev.includes(secId) ? prev.filter(id => id !== secId) : [...prev, secId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className.trim()) {
      Swal.fire({
        title: 'Class Name Required',
        text: 'Please enter a class name (e.g. Class XI, Nursery, LKG, UKG).',
        icon: 'warning',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    try {
      setLoading(true);
      const res = await academicService.createClass({
        className: className.trim(),
        numericValue: Number(numericValue) || 1,
        sections: selectedSections,
        status: 'active'
      });

      if (res?.success) {
        Swal.fire({
          title: 'Class Added!',
          text: `Class "${className}" has been added successfully.`,
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        if (onClassAdded) {
          onClassAdded(res.data);
        }
        onClose();
      } else {
        throw new Error(res?.message || 'Failed to create class');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Could not add class',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Add New Class</h3>
              <p className="text-xs text-indigo-100 font-medium">Create a class & attach sections</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1.5 text-slate-800">
              Class Name <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text"
              placeholder="e.g. Nursery, LKG, UKG, Class XI, Class XII"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              required
            />
            <p className="text-[11px] text-slate-400 font-normal mt-1">
              Supports Nursery to Class XII or any special stream class.
            </p>
          </div>

          <div>
            <label className="block mb-1.5 text-slate-800">
              Numeric Order / Level
            </label>
            <input 
              type="number"
              step="any"
              placeholder="e.g. 0 for Nursery, 11 for Class 11, 12 for Class 12"
              value={numericValue}
              onChange={(e) => setNumericValue(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-slate-800">
              Attach Sections
            </label>
            {fetchingSections ? (
              <div className="py-2 text-slate-400 font-normal">Loading sections...</div>
            ) : availableSections.length === 0 ? (
              <div className="text-slate-400 font-normal py-1">No predefined sections found. (Section A will be created automatically)</div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {availableSections.map((sec) => {
                  const isSelected = selectedSections.includes(sec._id);
                  return (
                    <button
                      type="button"
                      key={sec._id}
                      onClick={() => handleToggleSection(sec._id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      Section {sec.sectionName || sec.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
