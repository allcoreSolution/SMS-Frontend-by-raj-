import React, { useState, useMemo } from 'react';
import {
  Lock, Plug, Globe, CheckCircle2, Building, Search, Download,
  X, Check, Key, ShieldCheck, RefreshCw, ChevronRight, Eye, EyeOff,
  Copy, ExternalLink, SlidersHorizontal, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import SettingsLayout from '../../components/SettingsLayout';

// 43 Comprehensive Payment Gateways across 7 Regions
const INITIAL_GATEWAYS = [
  // NORTH AMERICA (2)
  { id: 'authnet', name: 'Authorize.Net', region: 'North America', country: 'US / Canada', currencies: 'USD, CAD, GBP +2', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🛡️', color: 'bg-blue-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'square', name: 'Square', region: 'North America', country: 'US / Global', currencies: 'USD, CAD, GBP +3', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '⬛', color: 'bg-gray-900', keyId: '', secretKey: '', merchantId: '' },

  // LATIN AMERICA (2)
  { id: 'mercadopago', name: 'Mercado Pago', region: 'Latin America', country: 'Latin America', currencies: 'BRL, ARS, MXN +4', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🤝', color: 'bg-sky-500', keyId: '', secretKey: '', merchantId: '' },
  { id: 'wompi', name: 'Wompi', region: 'Latin America', country: 'Colombia', currencies: 'COP', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇼', color: 'bg-indigo-600', keyId: '', secretKey: '', merchantId: '' },

  // EUROPE (6)
  { id: 'fondy', name: 'Fondy', region: 'Europe', country: 'Eastern Europe / CIS', currencies: 'EUR, USD, UAH +5', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇫', color: 'bg-purple-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'mollie', name: 'Mollie', region: 'Europe', country: 'Europe / UK', currencies: 'EUR, GBP, USD', flow: 'Hosted', status: 'configured', active: true, schools: 8, logo: '🦦', color: 'bg-blue-500', keyId: '', secretKey: '', merchantId: '' },
  { id: 'klarna', name: 'Klarna', region: 'Europe', country: 'EU / US / UK', currencies: 'EUR, GBP, USD, SEK', flow: 'Inline', status: 'needs_keys', active: false, schools: 0, logo: '🛍️', color: 'bg-pink-500', keyId: '', secretKey: '', merchantId: '' },
  { id: 'adyen', name: 'Adyen', region: 'Europe', country: 'Global / Europe', currencies: 'EUR, USD, GBP +15', flow: 'SDK', status: 'configured', active: true, schools: 12, logo: '🟢', color: 'bg-emerald-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'revolut', name: 'Revolut Pay', region: 'Europe', country: 'UK / Europe', currencies: 'GBP, EUR, USD', flow: 'Inline', status: 'needs_keys', active: true, schools: 0, logo: '🇷', color: 'bg-black', keyId: '', secretKey: '', merchantId: '' },
  { id: 'trustly', name: 'Trustly', region: 'Europe', country: 'Europe', currencies: 'EUR, SEK, DKK, PLN', flow: 'Redirect', status: 'needs_keys', active: false, schools: 0, logo: '🏦', color: 'bg-teal-700', keyId: '', secretKey: '', merchantId: '' },

  // SOUTH ASIA (10)
  { id: 'razorpay', name: 'Razorpay', region: 'South Asia', country: 'India', currencies: 'INR, USD, EUR +100', flow: 'Inline', status: 'configured', active: true, schools: 14, logo: '💳', color: 'bg-blue-700', keyId: '', secretKey: '', merchantId: '' },
  { id: 'cashfree', name: 'Cashfree Payments', region: 'South Asia', country: 'India', currencies: 'INR, USD', flow: 'Redirect', status: 'configured', active: true, schools: 6, logo: '💰', color: 'bg-violet-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'phonepe', name: 'PhonePe PG', region: 'South Asia', country: 'India', currencies: 'INR', flow: 'SDK', status: 'configured', active: true, schools: 11, logo: '📱', color: 'bg-purple-700', keyId: '', secretKey: '', merchantId: '' },
  { id: 'paytm', name: 'Paytm Payment Gateway', region: 'South Asia', country: 'India', currencies: 'INR', flow: 'Redirect', status: 'needs_keys', active: true, schools: 3, logo: '🔵', color: 'bg-sky-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'payu_in', name: 'PayU India', region: 'South Asia', country: 'India', currencies: 'INR', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🟢', color: 'bg-green-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'ccavenue', name: 'CCAvenue', region: 'South Asia', country: 'India / UAE', currencies: 'INR, AED, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 2, logo: '🏛️', color: 'bg-red-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'instamojo', name: 'Instamojo', region: 'South Asia', country: 'India', currencies: 'INR', flow: 'Redirect', status: 'needs_keys', active: false, schools: 0, logo: '⚡', color: 'bg-cyan-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'sslcommerz', name: 'SSLCommerz', region: 'South Asia', country: 'Bangladesh', currencies: 'BDT, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇧🇩', color: 'bg-emerald-700', keyId: '', secretKey: '', merchantId: '' },
  { id: 'bkash', name: 'bKash PG', region: 'South Asia', country: 'Bangladesh', currencies: 'BDT', flow: 'SDK', status: 'needs_keys', active: true, schools: 0, logo: '📱', color: 'bg-pink-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'khalti', name: 'Khalti', region: 'South Asia', country: 'Nepal', currencies: 'NPR', flow: 'Inline', status: 'needs_keys', active: true, schools: 0, logo: '🇳🇵', color: 'bg-purple-800', keyId: '', secretKey: '', merchantId: '' },

  // ASIA PACIFIC (8)
  { id: 'midtrans', name: 'Midtrans', region: 'Asia Pacific', country: 'Indonesia', currencies: 'IDR', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇮🇩', color: 'bg-blue-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'xendit', name: 'Xendit', region: 'Asia Pacific', country: 'Southeast Asia', currencies: 'IDR, PHP, VND, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇽', color: 'bg-indigo-700', keyId: '', secretKey: '', merchantId: '' },
  { id: 'paynamics', name: 'Paynamics', region: 'Asia Pacific', country: 'Philippines', currencies: 'PHP, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇵🇭', color: 'bg-yellow-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'hitpay', name: 'HitPay', region: 'Asia Pacific', country: 'Singapore / SEA', currencies: 'SGD, MYR, USD', flow: 'Inline', status: 'needs_keys', active: true, schools: 0, logo: '🇸🇬', color: 'bg-red-500', keyId: '', secretKey: '', merchantId: '' },
  { id: 'omise', name: 'Opn Payments (Omise)', region: 'Asia Pacific', country: 'Thailand / Japan / SEA', currencies: 'THB, JPY, SGD, USD', flow: 'Inline', status: 'needs_keys', active: true, schools: 0, logo: '🇹🇭', color: 'bg-blue-500', keyId: '', secretKey: '', merchantId: '' },
  { id: 'eWAY', name: 'eWAY', region: 'Asia Pacific', country: 'Australia / NZ', currencies: 'AUD, NZD, USD', flow: 'Direct', status: 'needs_keys', active: true, schools: 0, logo: '🇦🇺', color: 'bg-red-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'payhere', name: 'PayHere', region: 'Asia Pacific', country: 'Sri Lanka', currencies: 'LKR, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇱🇰', color: 'bg-orange-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'alipay', name: 'Alipay Global', region: 'Asia Pacific', country: 'China / Global', currencies: 'CNY, USD, EUR', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '💙', color: 'bg-sky-500', keyId: '', secretKey: '', merchantId: '' },

  // MIDDLE EAST & AFRICA (8)
  { id: 'paystack', name: 'Paystack', region: 'Middle East & Africa', country: 'Nigeria / Ghana / SA', currencies: 'NGN, GHS, ZAR, USD', flow: 'Inline', status: 'configured', active: true, schools: 5, logo: '🇳🇬', color: 'bg-teal-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'flutterwave', name: 'Flutterwave', region: 'Middle East & Africa', country: 'Africa / Global', currencies: 'NGN, KES, ZAR, USD +30', flow: 'Redirect', status: 'needs_keys', active: true, schools: 2, logo: '🦋', color: 'bg-amber-500', keyId: '', secretKey: '', merchantId: '' },
  { id: 'paytabs', name: 'PayTabs', region: 'Middle East & Africa', country: 'GCC / Middle East', currencies: 'AED, SAR, BHD, KWD, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇦🇪', color: 'bg-emerald-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'tap', name: 'Tap Payments', region: 'Middle East & Africa', country: 'Middle East / GCC', currencies: 'KWD, SAR, AED, BHD, USD', flow: 'Inline', status: 'needs_keys', active: true, schools: 0, logo: '🟪', color: 'bg-purple-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'hyperpay', name: 'HyperPay', region: 'Middle East & Africa', country: 'Saudi Arabia / MENA', currencies: 'SAR, AED, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇸🇦', color: 'bg-blue-800', keyId: '', secretKey: '', merchantId: '' },
  { id: 'myfatoorah', name: 'MyFatoorah', region: 'Middle East & Africa', country: 'Kuwait / GCC', currencies: 'KWD, SAR, AED, USD', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇰🇼', color: 'bg-indigo-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'yoco', name: 'Yoco', region: 'Middle East & Africa', country: 'South Africa', currencies: 'ZAR', flow: 'Inline', status: 'needs_keys', active: true, schools: 0, logo: '🇿🇦', color: 'bg-sky-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'fawry', name: 'Fawry', region: 'Middle East & Africa', country: 'Egypt', currencies: 'EGP', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🇪🇬', color: 'bg-yellow-500', keyId: '', secretKey: '', merchantId: '' },

  // GLOBAL (7)
  { id: 'stripe', name: 'Stripe Global', region: 'Global', country: 'Global / 47+ Countries', currencies: 'USD, EUR, GBP, AUD +135', flow: 'Redirect', status: 'configured', active: true, schools: 18, logo: '⚡', color: 'bg-indigo-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'paypal', name: 'PayPal Commerce Platform', region: 'Global', country: 'Global / 200+ Countries', currencies: 'USD, EUR, GBP, CAD +25', flow: 'Redirect', status: 'configured', active: true, schools: 9, logo: '🅿️', color: 'bg-blue-600', keyId: '', secretKey: '', merchantId: '' },
  { id: '2checkout', name: 'Verifone (2Checkout)', region: 'Global', country: 'Global / 200+ Countries', currencies: 'USD, EUR, GBP +45', flow: 'Hosted', status: 'needs_keys', active: true, schools: 0, logo: '🌐', color: 'bg-blue-800', keyId: '', secretKey: '', merchantId: '' },
  { id: 'braintree', name: 'Braintree (A PayPal Service)', region: 'Global', country: 'Global', currencies: 'USD, EUR, GBP +130', flow: 'SDK', status: 'needs_keys', active: true, schools: 0, logo: '🧠', color: 'bg-gray-800', keyId: '', secretKey: '', merchantId: '' },
  { id: 'dlocal', name: 'dLocal', region: 'Global', country: 'Emerging Markets (LatAm, Asia, Africa)', currencies: 'USD, BRL, INR, MXN +40', flow: 'Redirect', status: 'needs_keys', active: true, schools: 0, logo: '🌎', color: 'bg-teal-600', keyId: '', secretKey: '', merchantId: '' },
  { id: 'coinbase', name: 'Coinbase Commerce (Crypto)', region: 'Global', country: 'Global', currencies: 'USDC, BTC, ETH, USDT', flow: 'Redirect', status: 'needs_keys', active: false, schools: 0, logo: '🪙', color: 'bg-blue-500', keyId: '', secretKey: '', merchantId: '' },
  { id: 'wise', name: 'Wise Business', region: 'Global', country: 'Global / Cross Border', currencies: 'USD, EUR, GBP, AUD +50', flow: 'Direct', status: 'needs_keys', active: true, schools: 0, logo: '🚀', color: 'bg-lime-500', keyId: '', secretKey: '', merchantId: '' },
];

export default function PaymentGatewaysSettings({ inSettingsCenter = false }) {
  const [gateways, setGateways] = useState(() => {
    const localData = localStorage.getItem('superadmin_payment_gateways');
    return localData ? JSON.parse(localData) : INITIAL_GATEWAYS;
  });

  const [mode, setMode] = useState('LIVE');
  const [demoBanner, setDemoBanner] = useState(false); // Demo banner disabled
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All regions');
  const [selectedFlow, setSelectedFlow] = useState('All flows');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');
  const [selectedIds, setSelectedIds] = useState([]);

  // Configure drawer modal state
  const [editingGw, setEditingGw] = useState(null);
  const [formData, setFormData] = useState({ keyId: '', secretKey: '', merchantId: '', active: true, envMode: 'LIVE' });
  const [showKeySecret, setShowKeySecret] = useState({ key: false, secret: false });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Save to LocalStorage helper
  const updateAndSaveGateways = (newList) => {
    setGateways(newList);
    localStorage.setItem('superadmin_payment_gateways', JSON.stringify(newList));
  };

  // Filter logic
  const filteredGateways = useMemo(() => {
    return gateways.filter(gw => {
      const matchSearch = gw.name.toLowerCase().includes(search.toLowerCase()) ||
                          gw.country.toLowerCase().includes(search.toLowerCase()) ||
                          gw.currencies.toLowerCase().includes(search.toLowerCase());
      const matchRegion = selectedRegion === 'All regions' || gw.region === selectedRegion;
      const matchFlow = selectedFlow === 'All flows' || gw.flow === selectedFlow;
      const matchStatus = selectedStatus === 'All statuses' ||
                          (selectedStatus === 'Configured' && gw.status === 'configured') ||
                          (selectedStatus === 'Needs keys' && gw.status === 'needs_keys') ||
                          (selectedStatus === 'Active' && gw.active) ||
                          (selectedStatus === 'Disabled' && !gw.active);
      return matchSearch && matchRegion && matchFlow && matchStatus;
    });
  }, [gateways, search, selectedRegion, selectedFlow, selectedStatus]);

  // Group filtered gateways by Region
  const groupedRegions = useMemo(() => {
    const groups = {};
    filteredGateways.forEach(gw => {
      if (!groups[gw.region]) groups[gw.region] = [];
      groups[gw.region].push(gw);
    });
    return groups;
  }, [filteredGateways]);

  // Stats calculation
  const totalCount = gateways.length;
  const configuredCount = gateways.filter(g => g.status === 'configured').length;
  const usedBySchoolsCount = gateways.reduce((acc, g) => acc + g.schools, 0);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredGateways.map(g => g.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleActiveGateway = (id, e) => {
    e.stopPropagation();
    const updated = gateways.map(g => g.id === id ? { ...g, active: !g.active } : g);
    updateAndSaveGateways(updated);
  };

  // Bulk actions
  const handleBulkActivate = (enable) => {
    const updated = gateways.map(g => selectedIds.includes(g.id) ? { ...g, active: enable } : g);
    updateAndSaveGateways(updated);
    setSelectedIds([]);
  };

  // Drawer handlers
  const openConfigureDrawer = (gw) => {
    setEditingGw(gw);
    setFormData({
      keyId: gw.keyId || '',
      secretKey: gw.secretKey || '',
      merchantId: gw.merchantId || '',
      active: gw.active,
      envMode: mode
    });
    setShowKeySecret({ key: false, secret: false });
    setTestResult(null);
    setSavedSuccess(false);
  };

  const handleSaveDrawer = () => {
    if (!editingGw) return;
    const isConfigured = formData.keyId.trim() !== '' && formData.secretKey.trim() !== '';
    const updated = gateways.map(g => {
      if (g.id === editingGw.id) {
        return {
          ...g,
          keyId: formData.keyId,
          secretKey: formData.secretKey,
          merchantId: formData.merchantId,
          active: formData.active,
          status: isConfigured ? 'configured' : 'needs_keys'
        };
      }
      return g;
    });
    updateAndSaveGateways(updated);
    setSavedSuccess(true);
    Swal.fire({
      icon: 'success',
      title: 'Gateway Configured',
      text: `${editingGw.name} settings saved.`,
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => {
      setSavedSuccess(false);
      setEditingGw(null);
    }, 1200);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      if (formData.keyId && formData.secretKey) {
        setTestResult({ success: true, message: `Connected to ${editingGw.name} API successfully!` });
      } else {
        setTestResult({ success: false, message: `Please enter API key and Secret key to test connection.` });
      }
    }, 1000);
  };

  const handleExportExcel = () => {
    const headers = ['Gateway ID', 'Name', 'Region', 'Country', 'Currencies', 'Flow', 'Status', 'Active Status', 'Schools Using'];
    const rows = filteredGateways.map(g => [
      `"${g.id}"`,
      `"${g.name}"`,
      `"${g.region}"`,
      `"${g.country}"`,
      `"${g.currencies}"`,
      `"${g.flow}"`,
      `"${g.status}"`,
      `"${g.active ? 'Active' : 'Inactive'}"`,
      `"${g.schools || 0}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_gateways_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mainContent = (
    <div className="flex flex-col h-full bg-[#f8fafc] text-gray-800 font-sans overflow-hidden">
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1150px] w-full mx-auto">

          {/* Top Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Payment gateways
              </h1>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Add a gateway = one class plus one seed row. No core code changes.
              </p>
            </div>
            {/* Mode Switcher */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-bold text-gray-500">Mode:</span>
              <button
                onClick={() => setMode(m => m === 'LIVE' ? 'SANDBOX' : 'LIVE')}
                className={`px-3 py-1.5 rounded-none-none text-xs font-black tracking-wide border transition-all flex items-center gap-1.5 shadow-sm ${
                  mode === 'LIVE'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20'
                    : 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                }`}
              >
                <span className="w-2 h-2 rounded-none-none bg-white animate-pulse" />
                {mode === 'LIVE' ? 'Mode: LIVE' : 'Mode: SANDBOX'}
              </button>
            </div>
          </div>



          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Gateways', value: totalCount, icon: <Plug className="w-5 h-5 text-blue-500" /> },
              { label: 'Regions Covered', value: '7', icon: <Globe className="w-5 h-5 text-purple-500" /> },
              { label: 'Configured', value: configuredCount, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
              { label: 'Used By Schools', value: usedBySchoolsCount, icon: <Building className="w-5 h-5 text-amber-500" /> }
            ].map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-none-none p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                  <div className="w-10 h-10 rounded-none-none bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm">
                    {s.icon}
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Sub-Header Active Gateways Notice */}
          <div className="bg-white border border-gray-200/70 rounded-none-none px-4 py-3 mb-6 shadow-sm text-xs font-semibold text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-none-none bg-emerald-500 flex-shrink-0 animate-ping" />
            <span>
              <strong className="text-emerald-700">Active gateways</strong> are the ones schools can choose for online fee collection. Switch a gateway off — or select rows and use Deactivate — to hide it from every school.
            </span>
          </div>

          {/* Filter & Controls Bar */}
          <div className="bg-white border border-gray-200/90 rounded-none-none p-3.5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search gateways..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-none-none text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="border border-gray-200 rounded-none-none px-3 py-2 text-xs font-bold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option>All regions</option>
                <option>North America</option>
                <option>Latin America</option>
                <option>Europe</option>
                <option>South Asia</option>
                <option>Asia Pacific</option>
                <option>Middle East & Africa</option>
                <option>Global</option>
              </select>

              {/* Flow Filter */}
              <select
                value={selectedFlow}
                onChange={e => setSelectedFlow(e.target.value)}
                className="border border-gray-200 rounded-none-none px-3 py-2 text-xs font-bold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option>All flows</option>
                <option>Redirect</option>
                <option>Inline</option>
                <option>Hosted</option>
                <option>SDK</option>
                <option>Direct</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="border border-gray-200 rounded-none-none px-3 py-2 text-xs font-bold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option>All statuses</option>
                <option>Configured</option>
                <option>Needs keys</option>
                <option>Active</option>
                <option>Disabled</option>
              </select>

              {/* Count Tag */}
              <span className="text-xs font-bold text-gray-500 px-2.5 py-1 bg-gray-100 rounded-none-none">
                {filteredGateways.length} shown
              </span>

              {/* Export Excel Button */}
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2 rounded-none-none text-xs font-black transition-all shadow-xs shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Excel / CSV
              </button>

            </div>

          </div>

          {/* Bulk Selection Action Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-600 text-white px-5 py-3 rounded-none-none mb-6 shadow-lg shadow-blue-500/20 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
              <span className="text-xs font-bold">
                {selectedIds.length} gateway{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleBulkActivate(true)}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-none-none text-xs font-black shadow-sm transition-colors"
                >
                  Activate Selected
                </button>
                <button
                  onClick={() => handleBulkActivate(false)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-none-none text-xs font-black transition-colors"
                >
                  Deactivate Selected
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-blue-200 hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Region-Grouped Gateway Lists */}
          <div className="space-y-8 pb-10">
            {Object.keys(groupedRegions).length === 0 ? (
              <div className="bg-white border border-gray-200/80 rounded-none-none p-12 text-center text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <h4 className="text-base font-bold text-gray-700 mb-1">No payment gateways found</h4>
                <p className="text-xs text-gray-400">Try adjusting your search query or filter options.</p>
              </div>
            ) : (
              Object.entries(groupedRegions).map(([regionName, items]) => (
                <div key={regionName} className="bg-white border border-gray-200/90 rounded-none-none overflow-hidden shadow-sm">
                  
                  {/* Region Header */}
                  <div className="bg-gray-50/80 border-b border-gray-200/70 px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-gray-800 uppercase tracking-widest">{regionName}</span>
                      <span className="w-5 h-5 rounded-none-none bg-gray-200 text-gray-700 text-[10px] font-extrabold flex items-center justify-center">
                        {items.length}
                      </span>
                    </div>
                  </div>

                  {/* Gateway Rows */}
                  <div className="divide-y divide-gray-100">
                    {items.map(gw => {
                      const isSelected = selectedIds.includes(gw.id);
                      return (
                        <div
                          key={gw.id}
                          className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-blue-50/30 ${
                            !gw.active ? 'bg-gray-50/40 opacity-75' : ''
                          }`}
                        >
                          
                          {/* Left: Checkbox + Logo + Name & Info */}
                          <div className="flex items-center gap-4 min-w-[260px]">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRow(gw.id)}
                              className="w-4 h-4 rounded-none-none border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                            />
                            {/* Logo Avatar */}
                            <div className={`w-10 h-10 rounded-none-none ${gw.color} text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                              {gw.logo}
                            </div>
                            {/* Title & Currencies */}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-gray-900 leading-tight">{gw.name}</h4>
                                <span className="text-[11px] font-semibold text-gray-400">· {gw.country}</span>
                              </div>
                              <p className="text-xs font-medium text-gray-500 mt-0.5">{gw.currencies}</p>
                            </div>
                          </div>

                          {/* Middle: Badges & Info */}
                          <div className="flex flex-wrap items-center gap-3">
                            
                            {/* Flow Type Tag */}
                            <span className="px-2.5 py-1 rounded-none-none text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
                              {gw.flow}
                            </span>

                            {/* Status Badge */}
                            {gw.status === 'configured' ? (
                              <span className="px-2.5 py-1 rounded-none-none text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-none-none bg-emerald-500" /> Configured
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-none-none text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1">
                                <Key className="w-3 h-3 text-amber-600" /> Needs keys
                              </span>
                            )}

                            {/* Schools count */}
                            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-none-none ${gw.schools > 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                              {gw.schools} schools
                            </span>

                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-3 justify-end flex-shrink-0">
                            
                            {/* Active Toggle Switch */}
                            <button
                              onClick={(e) => handleToggleActiveGateway(gw.id, e)}
                              className={`relative w-10 h-6 rounded-none-none transition-colors duration-200 ease-in-out cursor-pointer flex-shrink-0 ${
                                gw.active ? 'bg-emerald-500' : 'bg-gray-300'
                              }`}
                              title={gw.active ? 'Active (Click to deactivate)' : 'Disabled (Click to activate)'}
                            >
                              <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-none-none bg-white shadow transform transition-transform duration-200 ease-in-out ${
                                  gw.active ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>

                            {/* Configure Button (Matching orange style from screenshot) */}
                            <button
                              onClick={() => openConfigureDrawer(gw)}
                              className="px-4 py-1.5 rounded-none-none bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-black shadow-sm shadow-orange-500/20 transition-all flex items-center gap-1.5"
                            >
                              Configure
                            </button>

                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* Configure Gateway Slide-over Drawer / Modal */}
        {editingGw && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-[1150px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-none-none ${editingGw.color} text-white font-black text-xl flex items-center justify-center shadow-sm`}>
                    {editingGw.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">Configure {editingGw.name}</h3>
                    <p className="text-xs font-semibold text-gray-400">{editingGw.country} · {editingGw.region}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingGw(null)}
                  className="p-2 rounded-none-none text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Form */}
              <div className="p-6 flex-1 overflow-y-auto space-y-5">

                {/* Status Toggle & Environment */}
                <div className="bg-gray-50 border border-gray-200/80 rounded-none-none p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-gray-900">Gateway Status</h4>
                    <p className="text-[11px] font-medium text-gray-500">Allow schools to select this gateway</p>
                  </div>
                  <button
                    onClick={() => setFormData(f => ({ ...f, active: !f.active }))}
                    className={`relative w-11 h-6 rounded-none-none transition-colors duration-200 ease-in-out cursor-pointer ${
                      formData.active ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-none-none bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        formData.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Environment Mode */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Environment Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, envMode: 'LIVE' }))}
                      className={`py-2 rounded-none-none text-xs font-bold border transition-all ${
                        formData.envMode === 'LIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/20'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      🟢 Production (LIVE)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, envMode: 'SANDBOX' }))}
                      className={`py-2 rounded-none-none text-xs font-bold border transition-all ${
                        formData.envMode === 'SANDBOX'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/20'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      🟡 Sandbox (TEST)
                    </button>
                  </div>
                </div>

                {/* Key ID / Publishable Key */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    API Key / Key ID / Publishable Key <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKeySecret.key ? 'text' : 'password'}
                      value={formData.keyId}
                      onChange={e => setFormData(f => ({ ...f, keyId: e.target.value }))}
                      placeholder={`e.g. ${editingGw.id}_live_key_...`}
                      className="w-full border border-gray-300 rounded-none-none px-3.5 py-2.5 pr-10 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeySecret(s => ({ ...s, key: !s.key }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeySecret.key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Secret Key */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Secret Key / Private Key <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKeySecret.secret ? 'text' : 'password'}
                      value={formData.secretKey}
                      onChange={e => setFormData(f => ({ ...f, secretKey: e.target.value }))}
                      placeholder={`e.g. ${editingGw.id}_secret_...`}
                      className="w-full border border-gray-300 rounded-none-none px-3.5 py-2.5 pr-10 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeySecret(s => ({ ...s, secret: !s.secret }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeySecret.secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Merchant ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Merchant ID / Account ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.merchantId}
                    onChange={e => setFormData(f => ({ ...f, merchantId: e.target.value }))}
                    placeholder="e.g. m_account_99812"
                    className="w-full border border-gray-300 rounded-none-none px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Webhook Endpoint */}
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-none-none p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Webhook Callback URL
                    </span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(`https://api.multischoolerp.com/v1/webhooks/${editingGw.id}`)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <code className="text-[11px] text-blue-800 bg-white border border-blue-200 rounded-none-none px-2.5 py-1.5 block break-all font-mono">
                    https://api.multischoolerp.com/v1/webhooks/{editingGw.id}
                  </code>
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div className={`p-3.5 rounded-none-none text-xs font-bold flex items-center gap-2 ${
                    testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                )}

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-4 py-2.5 rounded-none-none text-xs font-bold transition-all shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isTesting ? 'animate-spin' : ''}`} />
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGw(null)}
                    className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDrawer}
                    className={`px-5 py-2.5 rounded-none-none text-xs font-black text-white shadow-md transition-all flex items-center gap-1.5 ${
                      savedSuccess ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                    }`}
                  >
                    {savedSuccess ? (
                      <><Check className="w-4 h-4" /> Saved!</>
                    ) : (
                      'Save Gateway'
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
  );

  if (inSettingsCenter) {
    return <SettingsLayout activeTab="payment-gateways">{mainContent}</SettingsLayout>;
  }

  return mainContent;
}
