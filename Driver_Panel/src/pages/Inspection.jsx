import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, AlertCircle, Wrench, Shield, Check, History, Save } from 'lucide-react';
import { driverService } from '../api/driverService';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function Inspection() {
  const { driver, vehicle } = useAuth();
  const driverPhoto = driver?.photo || driver?.avatar || localStorage.getItem('driver_custom_photo') || '';
  const driverName = driver?.name || 'Ramesh Kumar';
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [type, setType] = useState('Pre-Trip');
  const [odometer, setOdometer] = useState('45280');
  const [fuelLevel, setFuelLevel] = useState('85');
  const [notes, setNotes] = useState('Vehicle checked and verified roadworthy.');

  const [checklist, setChecklist] = useState({
    brakes: true,
    tyres: true,
    lights: true,
    emergencyDoor: true,
    firstAidKit: true,
    fireExtinguisher: true,
    wipers: true,
    cleanliness: true,
    fuel: true
  });

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const res = await driverService.getInspections();
      if (res.success && res.data) {
        setInspections(res.data);
      }
    } catch (err) {
      console.error('Error fetching inspection history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const toggleItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allPassed = Object.values(checklist).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await driverService.submitInspection({
        vehicleNumber: vehicle?.vehicleNumber || driver?.assignedBus || 'DL-01-AB-4501',
        type,
        odometer: Number(odometer),
        fuelLevel: Number(fuelLevel),
        checklist,
        notes,
        passed: allPassed
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Inspection Saved',
          text: `Daily ${type} safety inspection report submitted to transport admin.`,
          timer: 2500,
          showConfirmButton: false
        });
        fetchInspections();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Error submitting inspection checklist'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const checklistItems = [
    { key: 'brakes', label: 'Brake System & Emergency Air Pressure', desc: 'Pedal firmness, parking brake hold' },
    { key: 'tyres', label: 'Tire Pressure & Tread Condition', desc: 'No visible punctures or sidewall cracks' },
    { key: 'lights', label: 'Headlights, Indicators & Brake Lights', desc: 'All exterior bulbs operational' },
    { key: 'emergencyDoor', label: 'Emergency Exit Door Release', desc: 'Opens smoothly from inside/outside' },
    { key: 'firstAidKit', label: 'Emergency First Aid Medical Kit', desc: 'Fully stocked with fresh bandages and antiseptic' },
    { key: 'fireExtinguisher', label: 'Fire Extinguisher Pressure Gauge', desc: 'Safety pin intact and needle in green zone' },
    { key: 'wipers', label: 'Windshield Wipers & Washer Fluid', desc: 'Blades wipe clear with no streaking' },
    { key: 'cleanliness', label: 'Interior Cabin Hygiene & Floor', desc: 'Aisles clear with no passenger obstructions' },
    { key: 'fuel', label: 'Adequate Fuel / Fluid Levels', desc: 'Coolant, engine oil and diesel sufficient' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Title with Inspector Driver Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-orange-600" />
            <span>Vehicle Safety & Inspection Checklist</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory Pre-Trip and Post-Trip vehicle roadworthiness sign-off
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-orange-50 dark:bg-slate-800/80 border border-orange-200/50 self-start sm:self-auto shadow-xs">
          <div className="w-8 h-8 rounded-full border border-orange-500 overflow-hidden shrink-0">
            {driverPhoto ? (
              <img src={driverPhoto} alt={driverName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center font-bold text-xs text-orange-600">
                {driverName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{driverName}</div>
            <div className="text-[10px] text-orange-600 font-semibold font-mono">ID: {driver?.driverId || 'DRV-101'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type selector */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold max-w-xs">
              {['Pre-Trip', 'Post-Trip'].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    type === t ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {t} Inspection
                </button>
              ))}
            </div>

            {/* Inputs: Odometer + Fuel */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Odometer Reading (km)
                </label>
                <input
                  type="number"
                  required
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fuel Level Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-black uppercase text-slate-500 tracking-wider">
                Vehicle Roadworthiness Items:
              </label>

              {checklistItems.map(item => {
                const passed = checklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleItem(item.key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      passed
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {item.desc}
                      </span>
                    </div>

                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
                      passed ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                      {passed ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Driver Observations / Mechanical Remarks:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any squeaks, warning lights or pending repairs..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : `Submit ${type} Checklist`}</span>
            </button>
          </form>

        </div>

        {/* Right Col: Inspection Log History */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <History className="w-4 h-4 text-orange-600" />
            <span>Inspection Log History</span>
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading history...</div>
          ) : inspections.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No previous inspection logs recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {inspections.map(ins => (
                <div
                  key={ins._id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ins.type} Inspection
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      ins.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {ins.passed ? 'Passed' : 'Defect Found'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Date: {ins.date}</span>
                    <span>Odometer: {ins.odometer} km</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                    "{ins.notes || 'No remarks'}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
