import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Smartphone, ScanLine, Camera, Check, 
  QrCode as QrCodeIcon, Barcode, Lightbulb, Save, Volume2, Clock, MapPin, ShieldCheck
} from 'lucide-react';
import QRAttendanceNavHeader from './QRAttendanceNavHeader';
import qrAttendanceService, { DEFAULT_QR_SETTINGS } from '../../api/qrAttendanceService';

export default function QRAttendanceSettings() {
  const navigate = useNavigate();

  // Settings State
  const [settings, setSettings] = useState(DEFAULT_QR_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(qrAttendanceService.getSettings());
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormatToggle = (fmt) => {
    setSettings(prev => ({
      ...prev,
      formats: {
        ...prev.formats,
        [fmt]: !prev.formats[fmt]
      }
    }));
  };

  const handleSave = () => {
    qrAttendanceService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <QRAttendanceNavHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Scanner Station &amp; Hardware Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure recognition algorithms, punch cooldown intervals, and audio feedback for gate terminals.
            </p>
          </div>

          <button
            onClick={() => navigate('/qr-attendance/attendance')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer border-none"
          >
            <Camera className="w-4 h-4" /> Open Live Station
          </button>
        </div>

        {/* Settings Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* General Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Auto Submit */}
              <div 
                onClick={() => handleToggle('autoAttendance')}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between cursor-pointer"
              >
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-bold text-slate-800">Auto Submit Attendance</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Instantly records IN/OUT punch upon reading a valid QR or barcode without manual confirmation.
                  </p>
                </div>
                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 mt-1 ${
                  settings.autoAttendance ? 'bg-indigo-600' : 'bg-slate-300'
                }`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.autoAttendance ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Audio Chime */}
              <div 
                onClick={() => handleToggle('soundBeep')}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between cursor-pointer"
              >
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" /> Audio Beep Feedback
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Plays authentic hardware POS chime on successful verification and double low-tone on duplicates.
                  </p>
                </div>
                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 mt-1 ${
                  settings.soundBeep ? 'bg-indigo-600' : 'bg-slate-300'
                }`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.soundBeep ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>

            </div>

            {/* Hardware & Location Setup */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Terminal Location &amp; Punch Mode
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Terminal Location Name
                  </label>
                  <input 
                    type="text"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" /> Cooldown Timer (Anti-Double Punch)
                  </label>
                  <select 
                    value={settings.cooldownSeconds}
                    onChange={(e) => setSettings({ ...settings, cooldownSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value={2}>2 Seconds</option>
                    <option value={3}>3 Seconds (Recommended)</option>
                    <option value={5}>5 Seconds</option>
                    <option value={10}>10 Seconds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Default Punch Direction Mode
                  </label>
                  <select 
                    value={settings.defaultMode}
                    onChange={(e) => setSettings({ ...settings, defaultMode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="auto">Auto Toggle (IN first, then OUT)</option>
                    <option value="in-only">Enforce IN Only (Entrance Gate)</option>
                    <option value="out-only">Enforce OUT Only (Exit Turnstile)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Allowed Optical Formats */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recognized Barcode Symbologies
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => handleFormatToggle('qr')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    settings.formats?.qr ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCodeIcon className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">2D QR Codes</div>
                      <div className="text-xs text-slate-500">Standard for digital ID cards &amp; student mobile apps</div>
                    </div>
                  </div>
                  {settings.formats?.qr && <Check className="w-5 h-5 text-indigo-600" />}
                </div>

                <div 
                  onClick={() => handleFormatToggle('barcode')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    settings.formats?.barcode ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Barcode className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">1D Linear Barcodes (Code 128 / EAN)</div>
                      <div className="text-xs text-slate-500">Printed ID card badge lines read by laser guns</div>
                    </div>
                  </div>
                  {settings.formats?.barcode && <Check className="w-5 h-5 text-indigo-600" />}
                </div>
              </div>
            </div>

          </div>

          {/* Save Action Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Settings updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">All changes apply immediately to the scanner station</span>
            )}

            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer border-none transition-all"
            >
              <Save className="w-4 h-4" /> Save Scanner Settings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
