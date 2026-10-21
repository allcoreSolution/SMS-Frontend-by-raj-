import React, { useState, useEffect } from 'react';
import { 
  Star, Plus, Search, Edit2, Trash2, RefreshCw, 
  CheckCircle2, X, Award, User, AlertCircle, ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';

export default function HRAppraisals() {
  const [appraisals, setAppraisals] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // New Appraisal Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    staff: '',
    staffName: '',
    designation: 'Teacher',
    department: 'Academic',
    cycle: '',
    cycleTitle: 'Annual Faculty Appraisal 2026-2027',
    overallRating: 4.5,
    performanceScore: 85,
    strengths: 'Consistent syllabus completion and high student rapport',
    areasForImprovement: 'Incorporate technology tools in assignments',
    evaluator: 'Principal',
    status: 'Approved'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, staffRes, cycleRes] = await Promise.all([
        hrService.getAppraisals(),
        hrService.getStaff({ limit: 100 }),
        hrService.getAppraisalCycles()
      ]);

      const appList = Array.isArray(appRes) ? appRes : (appRes?.data || []);
      const sList = Array.isArray(staffRes) ? staffRes : (staffRes?.data || []);
      const cList = Array.isArray(cycleRes) ? cycleRes : (cycleRes?.data || []);

      setAppraisals(appList);
      setStaffList(sList);
      setCycles(cList);

      if (sList.length > 0) {
        setFormData(prev => ({
          ...prev,
          staff: sList[0]._id,
          staffName: sList[0].fullName,
          designation: sList[0].designation || 'Teacher',
          department: sList[0].department || 'Academic'
        }));
      }
      if (cList.length > 0) {
        setFormData(prev => ({
          ...prev,
          cycle: cList[0]._id,
          cycleTitle: cList[0].title
        }));
      }
    } catch (err) {
      console.error('Error fetching appraisals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffChange = (staffId) => {
    const s = staffList.find(item => item._id === staffId);
    if (s) {
      setFormData(prev => ({
        ...prev,
        staff: s._id,
        staffName: s.fullName,
        designation: s.designation || 'Faculty',
        department: s.department || 'Academic'
      }));
    }
  };

  const handleCreateAppraisal = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await hrService.createAppraisal(formData);
      Swal.fire({
        icon: 'success',
        title: 'Appraisal Recorded',
        timer: 1400,
        showConfirmButton: false
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = appraisals.filter(a => 
    !searchQuery || 
    (a.staffName && a.staffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.designation && a.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.cycleTitle && a.cycleTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Staff Performance Appraisals
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Conduct structured evaluations, record ratings, and track institutional career development
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={fetchData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Record New Appraisal
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
          <div className="flex-1 relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search appraisals by staff name, role, or cycle..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <span className="text-xs font-bold text-slate-500">{appraisals.length} Appraisals</span>
        </div>

        {/* Appraisals Grid */}
        <div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
              <span className="font-medium text-xs text-slate-400">Loading appraisals...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span className="font-bold text-slate-700 text-sm block">No Appraisals Recorded</span>
              <span className="text-xs text-slate-400">Click "Record New Appraisal" to add an evaluation.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-black flex items-center justify-center text-sm shadow-xs">
                          {item.staffName ? item.staffName.charAt(0) : 'S'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">{item.staffName}</h3>
                          <p className="text-xs text-slate-400">{item.designation} • {item.department}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status || 'Approved'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Cycle:</span>
                        <span className="font-bold text-slate-800">{item.cycleTitle || 'Annual Review'}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Rating:</span>
                        <span className="font-bold text-amber-500 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.overallRating || 4.5} / 5.0</span>
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Score:</span>
                        <span className="font-black text-purple-700">{item.performanceScore || 85}%</span>
                      </div>
                    </div>

                    {item.strengths && (
                      <div className="text-xs text-slate-600 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">
                        <strong className="text-purple-700 block text-[11px] mb-0.5">Strengths:</strong>
                        <span>{item.strengths}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Evaluator: <strong>{item.evaluator || 'Principal'}</strong></span>
                    <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ===================== NEW APPRAISAL MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-200">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Record Staff Appraisal</h3>
                  <p className="text-[11px] text-slate-500">Submit evaluation rating and review</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppraisal} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Staff Member <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.staff}
                  onChange={(e) => handleStaffChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {staffList.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.fullName} ({s.staffId}) - {s.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Appraisal Cycle</label>
                <select 
                  value={formData.cycle}
                  onChange={(e) => {
                    const c = cycles.find(item => item._id === e.target.value);
                    setFormData({...formData, cycle: e.target.value, cycleTitle: c?.title || ''});
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {cycles.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                  <option value="annual">Annual Faculty Review 2026-2027</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Rating (1.0 to 5.0)</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.overallRating}
                    onChange={(e) => setFormData({...formData, overallRating: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Performance Score (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={formData.performanceScore}
                    onChange={(e) => setFormData({...formData, performanceScore: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Key Strengths</label>
                <textarea 
                  rows="2"
                  value={formData.strengths}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Areas for Development</label>
                <textarea 
                  rows="2"
                  value={formData.areasForImprovement}
                  onChange={(e) => setFormData({...formData, areasForImprovement: e.target.value})}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                  <span>{submitting ? 'Saving...' : 'Submit Appraisal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
