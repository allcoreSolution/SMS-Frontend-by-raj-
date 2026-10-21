import React, { useState, useEffect } from 'react';
import { Type, Lock, Info, Save, Building2, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

const SCHOOLS_DATA = [
  { school: 'Yug International', vocab: 'Class / Section / Subject' },
  { school: 'SSVP 3.0', vocab: 'Grade / Stream / Learning Area' },
  { school: 'My School', vocab: 'Grade / Section / Subjects' },
  { school: 'General Raj School', vocab: 'Class / Section / Subject' },
];

export default function AcademicWordingSettings() {
  const [enabled, setEnabled] = useState(true);
  const [defaultVocab, setDefaultVocab] = useState('Indian / CBSE (default) — Class / Section / Subject');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSetting('academic_wording').then(res => {
      if (res.success && res.data) {
        setEnabled(res.data.enabled ?? true);
        setDefaultVocab(res.data.defaultVocab || 'Indian / CBSE (default) — Class / Section / Subject');
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => { 
    try {
      await settingsService.saveSetting('academic_wording', { enabled, defaultVocab });
      setSaved(true); 
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your changes have been saved to the database successfully.',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => setSaved(false), 2500); 
    } catch (error) {
      Swal.fire('Error', 'Failed to save configuration: ' + error.message, 'error');
    }
  };

  return (
    <SettingsLayout activeTab="wording">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">

          

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-none-none text-xs flex items-start gap-2 mb-6">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
            <div>
              Lets a school call a Class a <strong>Year, Grade</strong> or <strong>Course</strong>, and a Section a <strong>Form</strong> or <strong>Stream</strong>. It changes wording only — no data, no schema, no behaviour.
            </div>
          </div>

          {/* Toggle */}
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm p-5 mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Enable custom academic wording</p>
              <p className="text-xs text-gray-500 mt-0.5">When OFF, every school sees Class / Section / Subject regardless of what it saved.</p>
            </div>
            <button type="button" onClick={() => setEnabled(v => !v)}
              className={`relative w-9 h-5 rounded-none-none transition-colors duration-200 flex-shrink-0 focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none-none bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Platform Default */}
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden mb-5">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" /> Platform Default
              </h3>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-3">The vocabulary a school gets before it chooses its own.</p>
              <select value={defaultVocab} onChange={e => setDefaultVocab(e.target.value)}
                className="w-full max-w-[1150px] border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                <option>Indian / CBSE (default) — Class / Section / Subject</option>
                <option>International — Grade / Stream / Learning Area</option>
                <option>College — Course / Batch / Subject</option>
              </select>
            </div>
          </div>

          {/* Schools Table */}
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" /> Schools using custom wording
              </h3>
            </div>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
                <thead className="bg-slate-50 border-b border-slate-300">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">School</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Vocabulary</th>
                  </tr>
                </thead>
                <tbody>
                  {SCHOOLS_DATA.map(r => (
                    <tr key={r.school} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                      <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-800 font-bold">{r.school}</td>
                      <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-blue-700 font-bold">{r.vocab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-end flex-shrink-0">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Wording Settings</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}
