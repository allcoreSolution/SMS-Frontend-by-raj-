import React, { useState, useEffect } from 'react';
import { Mail, Save, RefreshCw, Send, CheckCircle2, ShieldCheck, Key, Eye, EyeOff, Server } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

export default function MailSmtpSettings() {
  const [host, setHost] = useState('smtp.gmail.com');
  const [port, setPort] = useState('587');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [fromName, setFromName] = useState('Multi School ERP');
  const [fromEmail, setFromEmail] = useState('noreply@yourplatform.com');
  const [encryption, setEncryption] = useState('TLS');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchSmtpSettings();
  }, []);

  const fetchSmtpSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSetting('smtp');
      if (res?.data) {
        setHost(res.data.host || 'smtp.gmail.com');
        setPort(res.data.port || '587');
        setUser(res.data.user || '');
        setPass(res.data.pass || '');
        setFromName(res.data.fromName || 'Multi School ERP');
        setFromEmail(res.data.fromEmail || 'noreply@yourplatform.com');
        setEncryption(res.data.encryption || 'TLS');
      }
    } catch (e) {
      console.warn('SMTP settings fetch notice:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = { host, port, user, pass, fromName, fromEmail, encryption };
      await settingsService.saveSetting('smtp', payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'SMTP settings saved to database!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to save SMTP settings: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!host || !user || !pass) {
      return Swal.fire('Incomplete', 'Please provide Host, Username, and Password before testing.', 'warning');
    }
    try {
      setTesting(true);
      const res = await settingsService.testSmtp({
        host,
        port: parseInt(port) || 587,
        username: user,
        password: pass
      });
      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'SMTP Connection Verified!',
          text: res.message || 'Successfully authenticated with SMTP mail server.',
        });
      } else {
        Swal.fire('Connection Failed', res?.message || 'SMTP server rejected handshake.', 'error');
      }
    } catch (err) {
      Swal.fire('Test Failed', err?.response?.data?.message || err.message, 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <SettingsLayout activeTab="mail-smtp">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1150px] mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" /> Mail (SMTP) Server
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Transactional Relay
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Configure outgoing transactional email credentials for password resets, student report cards, and fee receipts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchSmtpSettings}
                disabled={loading}
                className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white bg-white text-xs font-bold transition cursor-pointer"
                title="Reload"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                  SMTP Connection Parameters
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Live Mongo Config</span>
            </div>

            <div className="p-5 sm:p-6 space-y-5 text-xs">
              {/* Host & Port */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1.5">SMTP Host / Relay *</label>
                  <input
                    type="text"
                    required
                    value={host}
                    onChange={e => setHost(e.target.value)}
                    placeholder="e.g. smtp.gmail.com or email-smtp.us-east-1.amazonaws.com"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Port *</label>
                  <input
                    type="number"
                    required
                    value={port}
                    onChange={e => setPort(e.target.value)}
                    placeholder="587"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">SMTP Username / Email *</label>
                  <input
                    type="text"
                    required
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">SMTP Password / App Password *</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={pass}
                      onChange={e => setPass(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sender Name, From Email, Encryption */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">From Name *</label>
                  <input
                    type="text"
                    required
                    value={fromName}
                    onChange={e => setFromName(e.target.value)}
                    placeholder="e.g. Greenwood School ERP"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">From Email Address *</label>
                  <input
                    type="email"
                    required
                    value={fromEmail}
                    onChange={e => setFromEmail(e.target.value)}
                    placeholder="e.g. notifications@greenwood.edu"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Encryption Protocol</label>
                  <select
                    value={encryption}
                    onChange={e => setEncryption(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="TLS">TLS (Port 587 Recommended)</option>
                    <option value="SSL">SSL (Port 465)</option>
                    <option value="None">None (Unencrypted / Local Relay)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Send className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Testing Handshake...' : 'Test SMTP Connection'}</span>
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving to Database...' : 'Save SMTP Settings'}</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </SettingsLayout>
  );
}
