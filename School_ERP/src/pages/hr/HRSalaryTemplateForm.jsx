import React, { useState, useEffect } from 'react';
import { 
  Edit2, Scale, Plus, Trash2, Save, X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { hrService } from '../../api/hrService';

export default function HRSalaryTemplateForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form State
  const [templateName, setTemplateName] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowances, setAllowances] = useState([{ id: 1, name: '', amount: '' }]);
  const [deductions, setDeductions] = useState([{ id: 1, name: '', amount: '' }]);
  
  // Statutory State
  const [pfEnabled, setPfEnabled] = useState(true);
  const [pfRate, setPfRate] = useState('12.00');
  
  const [esiEnabled, setEsiEnabled] = useState(true);
  const [esiRate, setEsiRate] = useState('0.75');
  
  const [ptEnabled, setPtEnabled] = useState(true);
  const [ptState, setPtState] = useState('Maharashtra');
  
  const [tdsEnabled, setTdsEnabled] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // Pre-populate if editing
  useEffect(() => {
    if (isEdit && id) {
      // In a real app we would call getSalaryTemplateById(id). 
      // Using generic mock for now if it's edit mode
      hrService.getSalaryTemplates().then(res => {
         const tmpl = (res.data || []).find(t => String(t._id) === String(id));
         if(tmpl) {
            setTemplateName(tmpl.templateName || tmpl.name || '');
            setBasicSalary(tmpl.basicSalary || tmpl.basic || '');
            setAllowances(tmpl.allowances || []);
            setDeductions(tmpl.deductions || []);
            setPfRate(tmpl.pfRate || '12.00');
            setEsiRate(tmpl.esiRate || '0.75');
         }
      }).catch(err => console.error(err));
    }
  }, [isEdit, id]);

  const handleSave = async () => {
    if(!templateName) return alert("Template name is required.");
    setIsSaving(true);
    try {
      await hrService.saveSalaryTemplate({
         templateName,
         basicSalary,
         allowances,
         deductions,
         pfRate,
         esiRate
      });
      alert(`Salary Template ${isEdit ? 'updated' : 'saved'} successfully!`);
      navigate('/hr/salary-templates');
    } catch (err) {
      alert("Error saving: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAllowance = () => {
    setAllowances([...allowances, { id: Date.now(), name: '', amount: '' }]);
  };

  const handleRemoveAllowance = (id) => {
    setAllowances(allowances.filter(a => a.id !== id));
  };

  const handleAddDeduction = () => {
    setDeductions([...deductions, { id: Date.now(), name: '', amount: '' }]);
  };

  const handleRemoveDeduction = (id) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 relative">
      
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-200">
        <h1 className="text-[22px] font-bold text-[#1e293b]">
          {isEdit ? 'Edit Salary Template' : 'Create Salary Template'}
        </h1>
      </div>

      <div className="p-8 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Main Form) */}
        <div className="flex-1 space-y-6">
          
          {/* Basic Details */}
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-[#5F52FF]" />
              <h2 className="text-[14px] font-bold text-slate-800">Basic Template Details</h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-slate-800 mb-1.5">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Senior Teacher Grade 1" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF] transition-colors"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">A clear name that describes this designation salary package.</p>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-800 mb-1.5">
                  Basic Salary (₹) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  placeholder="e.g. 35000" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF] transition-colors"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">Standard baseline monthly pay for this grade.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allowances */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
                <div className="w-5 h-5 rounded-none bg-[#5F52FF]/10 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-[#5F52FF]" />
                </div>
                <h2 className="text-[14px] font-bold text-slate-800">Earnings (Allowances)</h2>
              </div>
              <div className="p-5">
                <div className="flex gap-3 mb-2">
                  <div className="flex-[2] text-[12px] font-bold text-slate-800">Allowance Name</div>
                  <div className="flex-[2] text-[12px] font-bold text-slate-800">Amount</div>
                  <div className="w-8"></div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {allowances.map((allowance) => (
                    <div key={allowance.id} className="flex gap-3 items-center">
                      <input 
                        type="text" 
                        value={allowance.name}
                        onChange={(e) => {
                          const newAllowances = [...allowances];
                          const idx = newAllowances.findIndex(a => a.id === allowance.id);
                          newAllowances[idx].name = e.target.value;
                          setAllowances(newAllowances);
                        }}
                        placeholder="HRA" 
                        className="flex-[2] px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]"
                      />
                      <input 
                        type="text" 
                        value={allowance.amount}
                        onChange={(e) => {
                          const newAllowances = [...allowances];
                          const idx = newAllowances.findIndex(a => a.id === allowance.id);
                          newAllowances[idx].amount = e.target.value;
                          setAllowances(newAllowances);
                        }}
                        placeholder="5000" 
                        className="flex-[2] px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]"
                      />
                      <button 
                        onClick={() => handleRemoveAllowance(allowance.id)}
                        className="w-8 h-9 bg-red-500 hover:bg-red-600 rounded-none flex items-center justify-center text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={handleAddAllowance}
                  className="px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Allowance
                </button>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
                <div className="w-5 h-5 rounded-none bg-[#5F52FF]/10 flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-[#5F52FF]"></div>
                </div>
                <h2 className="text-[14px] font-bold text-slate-800">Fixed Deductions</h2>
              </div>
              <div className="p-5">
                <div className="flex gap-3 mb-2">
                  <div className="flex-[2] text-[12px] font-bold text-slate-800">Deduction Name</div>
                  <div className="flex-[2] text-[12px] font-bold text-slate-800">Amount</div>
                  <div className="w-8"></div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {deductions.map((deduction) => (
                    <div key={deduction.id} className="flex gap-3 items-center">
                      <input 
                        type="text" 
                        value={deduction.name}
                        onChange={(e) => {
                          const newDeductions = [...deductions];
                          const idx = newDeductions.findIndex(d => d.id === deduction.id);
                          newDeductions[idx].name = e.target.value;
                          setDeductions(newDeductions);
                        }}
                        placeholder="Welfare Refund" 
                        className="flex-[2] px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]"
                      />
                      <input 
                        type="text" 
                        value={deduction.amount}
                        onChange={(e) => {
                          const newDeductions = [...deductions];
                          const idx = newDeductions.findIndex(d => d.id === deduction.id);
                          newDeductions[idx].amount = e.target.value;
                          setDeductions(newDeductions);
                        }}
                        placeholder="100" 
                        className="flex-[2] px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]"
                      />
                      <button 
                        onClick={() => handleRemoveDeduction(deduction.id)}
                        className="w-8 h-9 bg-red-500 hover:bg-red-600 rounded-none flex items-center justify-center text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={handleAddDeduction}
                  className="px-3 py-1.5 border border-slate-300 rounded-none text-[12px] font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Deduction
                </button>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column (Statutory Configs & Submit) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#5F52FF]" />
              <h2 className="text-[14px] font-bold text-slate-800">Indian Statutory Configs</h2>
            </div>
            
            <div className="p-5 space-y-6">
              {/* PF */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    onClick={() => setPfEnabled(!pfEnabled)}
                    className={`w-9 h-5 rounded-none flex items-center px-0.5 cursor-pointer transition-colors ${pfEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-none bg-white transition-transform ${pfEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">Provident Fund (PF)</span>
                </div>
                {pfEnabled && (
                  <div className="pl-12">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1.5">PF Rate (%)</label>
                    <input type="text" value={pfRate} onChange={(e) => setPfRate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] focus:outline-none focus:border-[#5F52FF]" />
                    <p className="text-[10px] text-slate-500 mt-1">EPFO standard rate is 12% on Basic Salary.</p>
                  </div>
                )}
              </div>
              
              <div className="h-px bg-slate-100"></div>
              
              {/* ESI */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    onClick={() => setEsiEnabled(!esiEnabled)}
                    className={`w-9 h-5 rounded-none flex items-center px-0.5 cursor-pointer transition-colors ${esiEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-none bg-white transition-transform ${esiEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">State Insurance (ESI)</span>
                </div>
                {esiEnabled && (
                  <div className="pl-12">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1.5">ESI Employee Rate (%)</label>
                    <input type="text" value={esiRate} onChange={(e) => setEsiRate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] focus:outline-none focus:border-[#5F52FF]" />
                    <p className="text-[10px] text-slate-500 mt-1">Statutory employee rate is 0.75% of Gross pay.</p>
                  </div>
                )}
              </div>
              
              <div className="h-px bg-slate-100"></div>
              
              {/* PT */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    onClick={() => setPtEnabled(!ptEnabled)}
                    className={`w-9 h-5 rounded-none flex items-center px-0.5 cursor-pointer transition-colors ${ptEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-none bg-white transition-transform ${ptEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">Professional Tax (PT)</span>
                </div>
                {ptEnabled && (
                  <div className="pl-12">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1.5">PT Slabs State</label>
                    <select 
                      value={ptState} 
                      onChange={(e) => setPtState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] focus:outline-none focus:border-[#5F52FF]"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Telangana">Telangana</option>
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1">Deducted according to state's gross salary slab.</p>
                  </div>
                )}
              </div>
              
              <div className="h-px bg-slate-100"></div>
              
              {/* TDS */}
              <div>
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setTdsEnabled(!tdsEnabled)}
                    className={`w-9 h-5 rounded-none flex items-center px-0.5 cursor-pointer transition-colors ${tdsEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-none bg-white transition-transform ${tdsEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">Income Tax (TDS)</span>
                </div>
              </div>
              
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5 space-y-3">
            <button 
              onClick={handleSave} disabled={isSaving}
              className="w-full py-3 bg-[#5F52FF] hover:bg-[#4f42e6] disabled:bg-gray-400 text-white rounded-none font-bold text-[14px] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : (isEdit ? 'Update Salary Template' : 'Save Salary Template')}
            </button>
            <button 
              onClick={() => navigate('/hr/salary-templates')}
              className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-none font-bold text-[14px] flex items-center justify-center transition-colors"
            >
              Cancel
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
