import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wand2, Plus, Pencil, Trash2, Eye, EyeOff, 
  CheckCircle2, FileText, X, Sparkles, LayoutTemplate,
  Layers, Printer, Settings
} from 'lucide-react';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';

export default function ReportCardSetups() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [setups, setSetups] = useState([
    {
      id: '1',
      name: 'CBSE Secondary Standard Format (Class 9-10)',
      template: 'CBSE 8-Point Scholastic & Co-Scholastic',
      academicSession: '2026-27',
      applicableClasses: 'Class 9, Class 10',
      components: ['Scholastic (Term I & II)', 'Internal Assessment (20m)', 'Co-Scholastic Skills (5-Point)'],
      published: true
    },
    {
      id: '2',
      name: 'Senior Secondary Stream Format (Class 11-12)',
      template: 'CBSE Board Theory + Practical Breakdown',
      academicSession: '2026-27',
      applicableClasses: 'Class 11, Class 12',
      components: ['Theory (70m/80m)', 'Practical/Project (30m/20m)', 'General Studies'],
      published: true
    },
    {
      id: '3',
      name: 'Primary Continuous Assessment (Class 1-5)',
      template: 'Holistic Progress Card (HPC - NEP 2020)',
      academicSession: '2026-27',
      applicableClasses: 'Class 1, Class 2, Class 3, Class 4, Class 5',
      components: ['Self Assessment', 'Peer Assessment', 'Descriptive Indicators', 'Life Skills'],
      published: false
    },
    {
      id: '4',
      name: 'Middle School Evaluation (Class 6-8)',
      template: 'Standard Terminal Assessment',
      academicSession: '2026-27',
      applicableClasses: 'Class 6, Class 7, Class 8',
      components: ['Term Exams (80m)', 'Periodic Tests (10m)', 'Notebook & Enrichment (10m)'],
      published: true
    }
  ]);

  const togglePublish = (id) => {
    setSetups(setups.map(s => {
      if (s.id === id) {
        const nextState = !s.published;
        Swal.fire({
          icon: 'info',
          title: nextState ? 'Setup Published' : 'Setup Hidden',
          text: `Template is now ${nextState ? 'active for printing and portal views' : 'draft only'}.`,
          timer: 1500,
          showConfirmButton: false
        });
        return { ...s, published: nextState };
      }
      return s;
    }));
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: `Delete Configuration?`,
      text: `Remove ${name}? This will unlink report card settings for assigned classes.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete'
    });

    if (res.isConfirmed) {
      setSetups(setups.filter(s => s.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Report card configuration removed.',
        timer: 1400,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Transcript Design
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">Board Compliant Report Card Templates</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <LayoutTemplate className="w-6 h-6 text-indigo-600" />
                Report Card Setups
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <Wand2 className="w-4 h-4 text-slate-500" />
                Template Guide
              </button>
              <button
                onClick={() => Swal.fire({ icon: 'info', title: 'New Setup', text: 'Select a base template to customize header logos, signatures, and grading boundaries.' })}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Template Setup
              </button>
            </div>
          </div>

          <div className="mt-4">
            <OfflineExamsTabs />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Template Roster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {setups.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {item.academicSession}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.published ? 'Active in Production' : 'Draft / Inactive'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{item.name}</h3>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Base Layout:</span>
                  <strong className="text-slate-800">{item.template}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Applicable:</span>
                  <span className="text-indigo-600 font-semibold">{item.applicableClasses}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Components Included:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.components.map((comp, ci) => (
                    <span key={ci} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-medium border border-indigo-100">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(item.id)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {item.published ? 'Deactivate' : 'Activate'}
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => navigate('/offline-exams/report-card-view')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview Format
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <Wand2 className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Configuring Board Report Cards</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Template Architect:</strong> Assigns school logos, board affiliation numbers, principal signature blocks, and grade calculation matrices to specific classes.
              </p>
              <p>
                <strong>NEP 2020 Compliance:</strong> Easily toggle between standard numerical marksheet format and continuous Holistic Progress Cards (HPC) with self, peer, and teacher evaluations.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
