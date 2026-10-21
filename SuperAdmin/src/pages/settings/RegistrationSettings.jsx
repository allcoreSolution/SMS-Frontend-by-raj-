import React, { useState, useEffect } from 'react';
import { Lock, UserCheck, Save, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-none-none transition-colors duration-200 flex-shrink-0 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none-none bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

function ToggleRow({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <Toggle checked={checked} onChange={onChange} />
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

export default function RegistrationSettings() {
  const [settings, setSettings] = useState({
    emailVerify: true, whatsappOTP: true, mathCaptcha: true,
    otpAfterPassword: true, requireOTP: true, passportlessLogin: false,
    showSignIn: false, faceLogin: true, faceBiometrics: true,
    smsToSchoolAdmin: false, whatsappToSchoolAdmin: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSetting('registration_settings').then(res => {
      if (res.success && res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    }).catch(console.error);
  }, []);

  const set = k => v => setSettings(s => ({ ...s, [k]: v }));
  const handleSave = async () => { 
    try {
      await settingsService.saveSetting('registration_settings', settings);
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
      Swal.fire('Error', 'Failed to save settings: ' + error.message, 'error');
    }
  };

  return (
    <SettingsLayout activeTab="registration">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">

          

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <UserCheck className="w-5 h-5 text-blue-600" /> Registration &amp; Security
            </h1>
            <p className="text-sm text-gray-500">Email/OTP verification, captcha and face login.</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Left */}
            <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-3.5">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-gray-400" /> Registration &amp; Onboarding
                </h3>
              </div>
              <div className="px-5 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-3 pb-1">Verification Controls</p>
                <ToggleRow checked={settings.emailVerify} onChange={set('emailVerify')} label="Enable Email Verification"
                  desc="Sends a verification link to the admin's email after registration." />
                <ToggleRow checked={settings.whatsappOTP} onChange={set('whatsappOTP')} label="Enable WhatsApp OTP Verification"
                  desc="Send a 6-digit OTP via WhatsApp to verify the phone number during registration." />
                <ToggleRow checked={settings.otpAfterPassword} onChange={set('otpAfterPassword')} label="Enable Login OTP (OTP after password)"
                  desc="Enable two-factor login — users type their password, then get an OTP." />
                <ToggleRow checked={settings.requireOTP} onChange={set('requireOTP')} label="Require an OTP after the password"
                  desc="All school users must verify via a WhatsApp OTP after entering their password." />
                <ToggleRow checked={settings.passportlessLogin} onChange={set('passportlessLogin')} label="Passwordless Login (OTP instead of password)" />
                <ToggleRow checked={settings.showSignIn} onChange={set('showSignIn')} label='Show "Sign in with OTP" on the login page' />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <h3 className="font-semibold text-gray-800 text-sm">Security &amp; Spam Control</h3>
                </div>
                <div className="px-5 py-2">
                  <ToggleRow checked={settings.mathCaptcha} onChange={set('mathCaptcha')} label="Enable Math Captcha"
                    desc="Adds a simple math question to prevent bot registrations." />
                  <ToggleRow checked={settings.faceLogin} onChange={set('faceLogin')} label="Face Login (Biometrics)"
                    desc="Enable Face Login for mobile app users. Requires face vectors to be captured." />
                  <ToggleRow checked={settings.faceBiometrics} onChange={set('faceBiometrics')} label="Enable Face Vectors"
                    desc="When SMS/WhatsApp are enabled, WhatsApp OTP acts as the primary gate." />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <h3 className="font-semibold text-gray-800 text-sm">Post-Registration Notifications</h3>
                </div>
                <div className="px-5 py-2">
                  <ToggleRow checked={settings.smsToSchoolAdmin} onChange={set('smsToSchoolAdmin')} label="Send SMS to School Admin"
                    desc="Requires global SMS gateway to be configured." />
                  <ToggleRow checked={settings.whatsappToSchoolAdmin} onChange={set('whatsappToSchoolAdmin')} label="Send WhatsApp to School Admin" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-end flex-shrink-0">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Registration Settings</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}
