import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Settings, Users, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

export default function NewOnboardingTemplate() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([
    { id: 1, title: 'School Profile Setup', desc: 'Basic school information and branding' },
    { id: 2, title: 'Academic Setup', desc: 'Configure classes, sections, and subjects' },
  ]);

  const handleAddStep = () => {
    setSteps([...steps, { id: Date.now(), title: '', desc: '' }]);
  };

  const handleRemoveStep = (id) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleStepChange = (id, field, value) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      Swal.fire({ icon: 'error', title: 'Missing Information', text: 'Please enter a template name', confirmButtonColor: '#0891b2' });
      return;
    }
    // In a real app, send to API here
    navigate('/onboarding-templates');
  };

  return (
    <div className="max-w-[1150px] w-full mx-auto p-4 md:p-6 lg:p-8 bg-[#f8fafc] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/onboarding-templates')}
            className="w-8 h-8 rounded-none border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Onboarding Template</h1>
            <p className="text-[13px] font-semibold text-slate-500 mt-1">Design a step-by-step setup flow for schools</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/onboarding-templates')}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-none shadow-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-black rounded-none shadow-sm shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Publish Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-none">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              Template Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Standard K-12 Setup"
                  className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-none text-sm font-semibold text-slate-800 placeholder-slate-400 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Description
                </label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this template is used for..."
                  className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-none text-sm font-medium text-slate-800 placeholder-slate-400 bg-slate-50 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Target Audience
                </label>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-none">
                  <Users className="w-4 h-4 shrink-0" />
                  Available for all registered school administrators upon first login.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 shadow-sm p-1 rounded-none">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Onboarding Steps</h3>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Drag to reorder flow execution</p>
              </div>
              <button 
                onClick={handleAddStep}
                className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded-none shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Step
              </button>
            </div>

            {/* Steps List */}
            <div className="p-5 space-y-4 bg-slate-50/30">
              {steps.map((step, index) => (
                <div key={step.id} className="group relative flex items-start gap-4 bg-white border border-slate-200 p-4 rounded-none shadow-sm hover:border-orange-300 transition-colors">
                  
                  {/* Drag Handle */}
                  <div className="pt-2 flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Step Number */}
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm">
                    {index + 1}
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <input 
                        type="text" 
                        value={step.title}
                        onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                        placeholder="Step Title (e.g., Import Students)"
                        className="w-full px-0 py-1 border-0 border-b-2 border-slate-200 focus:ring-0 focus:border-orange-500 bg-transparent text-sm font-black text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        value={step.desc}
                        onChange={(e) => handleStepChange(step.id, 'desc', e.target.value)}
                        placeholder="Brief instruction for the school admin..."
                        className="w-full px-0 py-1 border-0 border-b border-transparent hover:border-slate-200 focus:ring-0 focus:border-orange-400 bg-transparent text-xs font-semibold text-slate-600 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <button 
                    onClick={() => handleRemoveStep(step.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-none transition-colors"
                    title="Remove Step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute -bottom-4 left-[3.25rem] w-px h-4 bg-slate-300" />
                  )}
                </div>
              ))}

              {steps.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-300 bg-white">
                  <p className="text-sm font-bold text-slate-500">No steps added yet.</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">You need at least one step for a template.</p>
                  <button onClick={handleAddStep} className="text-orange-500 hover:text-orange-600 text-xs font-bold underline">
                    Add First Step
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-center">
              <button onClick={handleAddStep} className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-bold text-xs uppercase tracking-widest transition-colors">
                <Plus className="w-4 h-4" /> Expand Flow
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
