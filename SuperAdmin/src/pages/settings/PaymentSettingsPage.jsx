import React, { useState, useEffect } from 'react';
import { CreditCard, Save, Check, RefreshCw, DollarSign, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

const Toggle = ({ checked, onChange }) => (
  <button 
    type="button" 
    onClick={() => onChange(!checked)} 
    className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer p-0.5 ${
      checked ? 'bg-purple-600' : 'bg-slate-200'
    }`}
  >
    <span className={`block w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${
      checked ? 'translate-x-4.5' : 'translate-x-0'
    }`} />
  </button>
);

export default function PaymentSettingsPage() {
  const [currency, setCurrency] = useState('Indian Rupee (₹)');
  const [mode, setMode] = useState('Live (Accept Real Payments)');
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [gstPercentage, setGstPercentage] = useState('18');
  const [invoicePrefix, setInvoicePrefix] = useState('INV-2026-');
  const [allowPartialPayments, setAllowPartialPayments] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSetting('payment_settings');
      if (res?.data) {
        setCurrency(res.data.currency || 'Indian Rupee (₹)');
        setMode(res.data.mode || 'Live (Accept Real Payments)');
        setAutoInvoice(res.data.autoInvoice ?? true);
        setGstPercentage(res.data.gstPercentage || '18');
        setInvoicePrefix(res.data.invoicePrefix || 'INV-2026-');
        setAllowPartialPayments(res.data.allowPartialPayments ?? false);
      }
    } catch (e) {
      console.warn('Payment settings fetch notice:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        currency,
        mode,
        autoInvoice,
        gstPercentage,
        invoicePrefix,
        allowPartialPayments
      };
      await settingsService.saveSetting('payment_settings', payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Payment & Billing settings saved to database!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to save settings: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsLayout activeTab="payment-settings">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1150px] mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" /> Platform Payment &amp; Billing Settings
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${mode.includes('Live') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {mode.includes('Live') ? 'Live Production' : 'Sandbox Mode'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Configure default platform currency, GST tax rates, automated invoice sequence, and payment transaction environments
              </p>
            </div>

            <button
              type="button"
              onClick={fetchPaymentSettings}
              disabled={loading}
              className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white bg-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              title="Reload"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                  Currency, Taxes &amp; Invoicing Defaults
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Live Mongo Config</span>
            </div>

            <div className="p-5 sm:p-6 space-y-5 text-xs">
              {/* Currency & Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Default Platform Currency *</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="Indian Rupee (₹)">Indian Rupee (₹) - INR</option>
                    <option value="US Dollar ($)">US Dollar ($) - USD</option>
                    <option value="Euro (€)">Euro (€) - EUR</option>
                    <option value="British Pound (£)">British Pound (£) - GBP</option>
                    <option value="UAE Dirham (AED)">UAE Dirham (AED) - AED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Platform Payment Environment *</label>
                  <select
                    value={mode}
                    onChange={e => setMode(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="Live (Accept Real Payments)">Live (Accept Real Online Payments)</option>
                    <option value="Sandbox (Test Mode)">Sandbox (Test / Mock Mode)</option>
                  </select>
                </div>
              </div>

              {/* GST & Invoice Prefix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Standard GST Tax Percentage (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gstPercentage}
                    onChange={e => setGstPercentage(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Default 18% GST applied to commercial subscription tax invoices.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">GST Invoice Number Prefix *</label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={e => setInvoicePrefix(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Automatic GST Invoice Generation</span>
                    <span className="text-[11px] text-slate-500">Automatically generate tax invoice PDF and email to school admin on subscription renewal</span>
                  </div>
                  <Toggle checked={autoInvoice} onChange={setAutoInvoice} />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Allow Partial Payment Installments</span>
                    <span className="text-[11px] text-slate-500">Allow schools to pay annual subscriptions in quarterly installments</span>
                  </div>
                  <Toggle checked={allowPartialPayments} onChange={setAllowPartialPayments} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Payment Defaults'}</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </SettingsLayout>
  );
}
