import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, GripVertical, CheckCircle, X, Save, AlertTriangle } from 'lucide-react';

const initTemplates = [
  {
    id: 1, name: 'Basic School Setup', schools: 88, status: 'Active',
    steps: [
      { id: 1, title: 'School Profile Setup', desc: 'Fill in school name, address, logo', done: true },
      { id: 2, title: 'Add Academic Classes', desc: 'Create classes and sections', done: true },
      { id: 3, title: 'Add Students', desc: 'Import or manually add students', done: false },
      { id: 4, title: 'Fee Configuration', desc: 'Set up fee types and groups', done: false },
      { id: 5, title: 'Go Live', desc: 'Activate the school account', done: false },
    ],
  },
  {
    id: 2, name: 'Full ERP Onboarding', schools: 45, status: 'Active',
    steps: [
      { id: 1, title: 'School Profile', desc: 'Basic school information', done: true },
      { id: 2, title: 'Branch Setup', desc: 'Configure branches', done: true },
      { id: 3, title: 'Academic Setup', desc: 'Classes, sections, subjects', done: true },
      { id: 4, title: 'Staff & HR', desc: 'Add staff and configure HR', done: false },
      { id: 5, title: 'Student Import', desc: 'Bulk import students', done: false },
      { id: 6, title: 'Fee Module', desc: 'Fee types, groups, assign fees', done: false },
      { id: 7, title: 'Go Live', desc: 'Final activation', done: false },
    ],
  },
  {
    id: 3, name: 'Fee Module Focus', schools: 32, status: 'Active',
    steps: [
      { id: 1, title: 'Fee Types', desc: 'Create all fee types', done: true },
      { id: 2, title: 'Fee Groups', desc: 'Group fees by class', done: true },
      { id: 3, title: 'Assign Fees', desc: 'Assign to students', done: false },
      { id: 4, title: 'Payment Gateway', desc: 'Configure online payments', done: false },
      { id: 5, title: 'Go Live', desc: 'Activate fee module', done: false },
    ],
  },
];

const OnboardingTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(initTemplates);
  const [expanded, setExpanded] = useState(1);
  const [editTemplate, setEditTemplate] = useState(null);
  const [deleteTemplate, setDeleteTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [addStepFor, setAddStepFor] = useState(null);
  const [editStep, setEditStep] = useState(null);
  const [deleteStep, setDeleteStep] = useState(null);
  const [stepForm, setStepForm] = useState({ title: '', desc: '' });

  const handleAddTemplate = () => {
    if (!templateName.trim()) return;
    setTemplates(p => [...p, { id: Date.now(), name: templateName, schools: 0, status: 'Active', steps: [] }]);
    setShowAddTemplate(false);
    setTemplateName('');
  };

  const handleSaveTemplate = () => {
    setTemplates(p => p.map(t => t.id === editTemplate.id ? { ...t, name: editTemplate.name } : t));
    setEditTemplate(null);
  };

  const handleDeleteTemplate = () => {
    setTemplates(p => p.filter(t => t.id !== deleteTemplate.id));
    setDeleteTemplate(null);
  };

  const handleAddStep = () => {
    if (!stepForm.title.trim()) return;
    setTemplates(p => p.map(t => t.id === addStepFor
      ? { ...t, steps: [...t.steps, { id: Date.now(), title: stepForm.title, desc: stepForm.desc, done: false }] }
      : t
    ));
    setAddStepFor(null);
    setStepForm({ title: '', desc: '' });
  };

  const handleSaveStep = () => {
    setTemplates(p => p.map(t => t.id === editStep.templateId
      ? { ...t, steps: t.steps.map(s => s.id === editStep.step.id ? { ...s, title: editStep.step.title, desc: editStep.step.desc } : s) }
      : t
    ));
    setEditStep(null);
  };

  const handleDeleteStep = () => {
    setTemplates(p => p.map(t => t.id === deleteStep.templateId
      ? { ...t, steps: t.steps.filter(s => s.id !== deleteStep.step.id) }
      : t
    ));
    setDeleteStep(null);
  };

  const toggleDone = (templateId, stepId) => {
    setTemplates(p => p.map(t => t.id === templateId
      ? { ...t, steps: t.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s) }
      : t
    ));
  };

  return (
    <div className="max-w-[1150px] w-full mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Onboarding Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Step-by-step onboarding flows for new schools</p>
        </div>
        <button onClick={() => navigate('/onboarding-templates/new')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Templates', value: templates.length },
          { label: 'Schools Using', value: templates.reduce((a, t) => a + t.schools, 0) },
          { label: 'Active Templates', value: templates.filter(t => t.status === 'Active').length },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-none flex items-center justify-center text-orange-500 font-bold text-sm">{t.steps.length}</div>
                <div>
                  <p className="font-bold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.steps.length} steps · Used by {t.schools} schools</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-none font-semibold">{t.status}</span>
                <button className="p-1.5 hover:bg-blue-50 rounded-none text-blue-500" onClick={e => { e.stopPropagation(); setEditTemplate({ ...t }); }}><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-red-50 rounded-none text-red-500" onClick={e => { e.stopPropagation(); setDeleteTemplate(t); }}><Trash2 className="w-4 h-4" /></button>
                {expanded === t.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>

            {expanded === t.id && (
              <div className="border-t border-gray-100 p-4">
                <div className="space-y-2">
                  {t.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-none hover:bg-gray-50 group">
                      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                      <button onClick={() => toggleDone(t.id, step.id)}
                        className={`w-6 h-6 rounded-none flex items-center justify-center flex-shrink-0 transition-colors ${step.done ? 'bg-green-100' : 'bg-gray-100 hover:bg-green-50'}`}>
                        {step.done ? <CheckCircle className="w-4 h-4 text-green-500" /> : <span className="text-xs font-bold text-gray-400">{i + 1}</span>}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">{step.title}</p>
                        <p className="text-xs text-gray-400">{step.desc}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-none ${step.done ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {step.done ? 'Done' : 'Pending'}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditStep({ templateId: t.id, step: { ...step } })} className="p-1 hover:bg-blue-50 rounded-none text-blue-400"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteStep({ templateId: t.id, step })} className="p-1 hover:bg-red-50 rounded-none text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setStepForm({ title: '', desc: '' }); setAddStepFor(t.id); }}
                  className="mt-3 flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-semibold">
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>
            )}
          </div>
        ))}
      </div>



      {/* EDIT TEMPLATE MODAL */}
      {editTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Template</h2>
              <button onClick={() => setEditTemplate(null)} className="p-1.5 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Template Name</label>
            <input value={editTemplate.name} onChange={e => setEditTemplate({ ...editTemplate, name: e.target.value })}
              className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setEditTemplate(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveTemplate} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-none text-sm font-semibold flex items-center justify-center gap-2"><Save className="w-4 h-4" />Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TEMPLATE MODAL */}
      {deleteTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Template?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <span className="font-semibold text-gray-700">{deleteTemplate.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTemplate(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteTemplate} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STEP MODAL */}
      {addStepFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Add Step</h2>
              <button onClick={() => setAddStepFor(null)} className="p-1.5 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Step Title</label>
                <input value={stepForm.title} onChange={e => setStepForm({ ...stepForm, title: e.target.value })} placeholder="e.g. Configure Fees"
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <input value={stepForm.desc} onChange={e => setStepForm({ ...stepForm, desc: e.target.value })} placeholder="Brief description..."
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAddStepFor(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddStep} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-none text-sm font-semibold">Add Step</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STEP MODAL */}
      {editStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Step</h2>
              <button onClick={() => setEditStep(null)} className="p-1.5 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Step Title</label>
                <input value={editStep.step.title} onChange={e => setEditStep({ ...editStep, step: { ...editStep.step, title: e.target.value } })}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <input value={editStep.step.desc} onChange={e => setEditStep({ ...editStep, step: { ...editStep.step, desc: e.target.value } })}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditStep(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveStep} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-none text-sm font-semibold flex items-center justify-center gap-2"><Save className="w-4 h-4" />Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE STEP MODAL */}
      {deleteStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Step?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete step <span className="font-semibold text-gray-700">"{deleteStep.step.title}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteStep(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteStep} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTemplates;
