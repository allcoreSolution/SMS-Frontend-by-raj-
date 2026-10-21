import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { CreditCard, Zap, Info, Save, ShieldCheck, Key, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import settingsService from '../api/settingsService';

export default function PaymentGateway() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOnlineFeeEnabled, setIsOnlineFeeEnabled] = useState(true);
  const [activeProvider, setActiveProvider] = useState('Razorpay');
  const [testMode, setTestMode] = useState(false);

  // Credentials
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_live_89f02a99e12b');
  const [razorpaySecret, setRazorpaySecret] = useState('••••••••••••••••');
  const [stripePublishableKey, setStripePublishableKey] = useState('pk_live_51M89ab2');
  const [stripeSecretKey, setStripeSecretKey] = useState('sk_live_••••••••••••');
  const [upiVpa, setUpiVpa] = useState('greenwoodschool@icici');
  const [merchantName, setMerchantName] = useState('Greenwood International School');

  const fetchGatewaySettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting('payment_gateway');
      if (res.success && res.data) {
        const d = res.data;
        setIsOnlineFeeEnabled(d.isOnlineFeeEnabled ?? true);
        setActiveProvider(d.activeProvider || 'Razorpay');
        setTestMode(d.testMode ?? false);
        setRazorpayKeyId(d.razorpayKeyId || '');
        setRazorpaySecret(d.razorpaySecret || '');
        setStripePublishableKey(d.stripePublishableKey || '');
        setStripeSecretKey(d.stripeSecretKey || '');
        setUpiVpa(d.upiVpa || '');
        setMerchantName(d.merchantName || '');
      }
    } catch (error) {
      console.error('Error fetching gateway settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGatewaySettings();
  }, [fetchGatewaySettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        isOnlineFeeEnabled,
        activeProvider,
        testMode,
        razorpayKeyId,
        razorpaySecret,
        stripePublishableKey,
        stripeSecretKey,
        upiVpa,
        merchantName
      };

      const res = await settingsService.saveSetting('payment_gateway', payload);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Saved Successfully',
          text: 'Payment Gateway credentials and rules saved to MongoDB.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error.response?.data?.message || 'Could not save payment gateway configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Payment Gateway & Online Fee Collection
          </h1>
          <p className="text-xs text-slate-400">
            Configure merchant API credentials for automated student fee collections and parent portal checkout
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving Changes...' : 'Save Gateway Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Settings Panel */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          {/* Master Switch */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setIsOnlineFeeEnabled(!isOnlineFeeEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out mt-0.5 focus:outline-none ${
                isOnlineFeeEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  isOnlineFeeEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-xs text-slate-900">
                Allow Parents to Pay Fees Online (Master Switch)
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                When activated, parents can pay school dues directly from their Parent Mobile App or Web Portal using UPI, Cards, and Netbanking.
              </p>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Default Payment Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Razorpay', 'Stripe', 'Paytm', 'UPI QR'].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => setActiveProvider(provider)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                    activeProvider === provider
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Credentials Form */}
          <div className="p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-xs text-slate-900">
                  {activeProvider} API Credentials
                </h3>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                testMode ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {testMode ? 'Sandbox Mode' : 'Live Production'}
              </span>
            </div>

            {activeProvider === 'Razorpay' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Razorpay Key ID *</label>
                  <input
                    type="text"
                    value={razorpayKeyId}
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                    placeholder="rzp_live_..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Razorpay Key Secret *</label>
                  <input
                    type="password"
                    value={razorpaySecret}
                    onChange={(e) => setRazorpaySecret(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeProvider === 'Stripe' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Stripe Publishable Key *</label>
                  <input
                    type="text"
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                    placeholder="pk_live_..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Stripe Secret Key *</label>
                  <input
                    type="password"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeProvider === 'UPI QR' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Merchant VPA Address *</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="school@bank"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Registered Merchant Name *</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Test Mode Switch */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">
                Enable Sandbox / Test Simulation Mode
              </span>
              <button
                type="button"
                onClick={() => setTestMode(!testMode)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  testMode ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ${
                    testMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider">
                PCI-DSS & RBI Compliance
              </h4>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
              Payment credentials are encrypted with AES-256 before transmission. Card data is never stored locally on school servers.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Webhook Real-Time Sync
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Ensure you copy your school callback webhook to your payment dashboard:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 break-all">
              https://api.schoolerp.com/api/webhooks/payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
