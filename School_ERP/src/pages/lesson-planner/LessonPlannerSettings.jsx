import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Plus, Trash2, Clock, CheckCircle2, 
  AlertCircle, ShieldCheck, Users, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService, { TEACHERS_LIST } from '../../api/lessonPlanService';

export default function LessonPlannerSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    enableHODReview: true,
    allowEditApproved: false,
    sendWeeklyReminder: true,
    submissionDeadlineDay: 'Friday',
    submissionDeadlineTime: '05:00 PM',
    departments: []
  });

  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState(TEACHERS_LIST[0]);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const data = lessonPlanService.getSettings();
    setSettings(data);
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    const newDept = {
      id: 'dept-' + Date.now(),
      name: newDeptName.trim(),
      head: newDeptHead
    };

    setSettings(prev => ({
      ...prev,
      departments: [...prev.departments, newDept]
    }));

    setNewDeptName('');
  };

  const handleDeleteDepartment = (id) => {
    setSettings(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d.id !== id)
    }));
  };

  const handleSaveSettings = () => {
    lessonPlanService.saveSettings(settings);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1000px] mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Curriculum & Approval Policy Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure approval hierarchy, submission cutoff timings, and department head assignments.
              </p>
            </div>
          </div>

          <button 
            onClick={handleSaveSettings}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>

        {savedNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs font-semibold">
              Policy configurations and department mappings saved successfully!
            </div>
          </div>
        )}

        {/* Workflow Policy Toggles */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800">Review & Modification Controls</h3>
          </div>

          <div className="p-6 divide-y divide-slate-100">
            {/* Toggle 1 */}
            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Enforce 2-Tier Approval (Teacher ➔ HOD ➔ Principal)</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  When enabled, plans must be validated by the respective Department Head before reaching the Principal.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggle('enableHODReview')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.enableHODReview ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  settings.enableHODReview ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Allow Teachers to Edit Approved Plans</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  If disabled, once a plan is formally signed off by the Principal, modifications require revision clearance.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggle('allowEditApproved')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.allowEditApproved ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  settings.allowEditApproved ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Weekly Submission Automated Reminders</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dispatches notification alerts to teachers who have not submitted next week’s plan by the cutoff.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggle('sendWeeklyReminder')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.sendWeeklyReminder ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  settings.sendWeeklyReminder ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Submission Cutoff Time */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Weekly Submission Cutoff Timing</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cutoff Day of Week
              </label>
              <select 
                value={settings.submissionDeadlineDay}
                onChange={(e) => setSettings({ ...settings, submissionDeadlineDay: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday (Recommended)</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cutoff Time
              </label>
              <input 
                type="text" 
                value={settings.submissionDeadlineTime}
                onChange={(e) => setSettings({ ...settings, submissionDeadlineTime: e.target.value })}
                placeholder="05:00 PM"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Department Heads (HOD) Mapping */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Department Head (HOD) Designations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Teachers assigned to review subject-specific lesson plans.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {settings.departments?.length || 0} Departments
            </span>
          </div>

          <div className="p-6 space-y-4">
            {/* List */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {settings.departments && settings.departments.length > 0 ? (
                settings.departments.map(dept => (
                  <div key={dept.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{dept.name}</div>
                      <div className="text-[11px] text-slate-500">Designated HOD: <span className="font-semibold text-slate-700">{dept.head}</span></div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No departments added yet.
                </div>
              )}
            </div>

            {/* Add Department Form */}
            <form onSubmit={handleAddDepartment} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Name
                </label>
                <input 
                  type="text" 
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Computer Science & AI"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign HOD
                </label>
                <select 
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                >
                  {TEACHERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto justify-center"
              >
                <Plus className="w-4 h-4" /> Add Dept
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
