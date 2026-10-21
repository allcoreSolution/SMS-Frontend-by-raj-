import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  Wallet, 
  Settings as SettingsIcon, 
  TrendingUp, 
  MessageSquare, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownLeft,
  X, 
  Lock, 
  Check, 
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  CreditCard,
  QrCode,
  Smartphone,
  Mail,
  Zap,
  Download,
  Search,
  Filter,
  CheckCircle2,
  HelpCircle,
  Copy,
  Sliders,
  DollarSign,
  Radio,
  FileText,
  PlusCircle
} from "lucide-react";
import commsWalletService from "../api/commsWalletService";

const PRESET_AMOUNTS = [
  { amount: 1000, label: "Starter Pack", tag: "₹1,000" },
  { amount: 2500, label: "Quarterly Term", tag: "₹2,500" },
  { amount: 5000, label: "Most Popular", tag: "₹5,000", popular: true },
  { amount: 10000, label: "High Volume", tag: "₹10,000" },
  { amount: 25000, label: "Annual Bulk", tag: "₹25,000" }
];

export default function CommsWallet() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Wallet summary state
  const [summary, setSummary] = useState({
    schoolName: "Greenwood International School",
    balance: 55050.00,
    totalRecharged: 55050.00,
    spent30Days: 1420.00,
    messagesSent: 1890,
    rates: {
      whatsapp: 0.78,
      smsTransactional: 0.22,
      smsPromotional: 0.18,
      voiceCall: 0.45
    },
    settings: {
      lowBalanceAlert: true,
      alertThreshold: 500,
      alertEmail: "admin@greenwood.edu",
      alertPhone: "+91 98765 43210",
      autoRecharge: false,
      autoRechargeAmount: 5000
    },
    quotas: {
      availableWhatsapp: 70576,
      availableSms: 250227
    }
  });

  // Transactions list
  const [transactions, setTransactions] = useState([]);
  const [activeTypeTab, setActiveTypeTab] = useState("All"); // 'All' | 'Credit' | 'Debit'
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  // Add money form
  const [customAmount, setCustomAmount] = useState("5000");
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Settings form
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState("500");
  const [alertEmail, setAlertEmail] = useState("admin@greenwood.edu");
  const [alertPhone, setAlertPhone] = useState("+91 98765 43210");
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Calculator state
  const [calcRecipients, setCalcRecipients] = useState(1000);

  // Fetch Wallet Data from MongoDB
  const fetchWalletData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [sumRes, txRes] = await Promise.all([
        commsWalletService.getSummary(),
        commsWalletService.getTransactions()
      ]);

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
        if (sumRes.data.settings) {
          setLowBalanceAlert(sumRes.data.settings.lowBalanceAlert ?? true);
          setAlertThreshold(String(sumRes.data.settings.alertThreshold || 500));
          setAlertEmail(sumRes.data.settings.alertEmail || "admin@greenwood.edu");
          setAlertPhone(sumRes.data.settings.alertPhone || "+91 98765 43210");
          setAutoRecharge(sumRes.data.settings.autoRecharge ?? false);
        }
      }

      if (txRes.success && txRes.data) {
        setTransactions(txRes.data);
      }
    } catch (err) {
      console.error("Failed to load comms wallet from MongoDB:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // Handle Top-Up Recharge
  const handleProceedPay = async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(customAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      Swal.fire({ icon: "warning", title: "Invalid Amount", text: "Please enter an amount greater than ₹0." });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await commsWalletService.topupWallet({
        amount: amountVal,
        paymentMethod,
        notes: `Wallet Recharge via ${paymentMethod}`
      });

      if (res.success) {
        setIsProcessing(false);
        setShowAddMoneyModal(false);
        
        // Refresh live data
        await fetchWalletData(true);

        Swal.fire({
          icon: "success",
          title: "Wallet Recharged!",
          html: `
            <div class="text-left text-xs space-y-2 mt-2">
              <p><strong>Amount Credited:</strong> ₹${amountVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              <p><strong>Payment Channel:</strong> ${paymentMethod}</p>
              <p><strong>New Balance:</strong> ₹${res.data?.newBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              <p><strong>Order ID:</strong> <span class="font-mono">${res.data?.transaction?.orderId}</span></p>
            </div>
          `,
          timer: 3500
        });
      }
    } catch (err) {
      setIsProcessing(false);
      Swal.fire({
        icon: "error",
        title: "Recharge Failed",
        text: err.response?.data?.message || "Payment gateway processing failed."
      });
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await commsWalletService.updateSettings({
        lowBalanceAlert,
        alertThreshold: Number(alertThreshold),
        alertEmail,
        alertPhone,
        autoRecharge
      });

      if (res.success) {
        setSavingSettings(false);
        setShowSettingsModal(false);
        await fetchWalletData(true);

        Swal.fire({
          icon: "success",
          title: "Settings Saved!",
          text: "Wallet notification thresholds updated in MongoDB.",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      setSavingSettings(false);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not save settings."
      });
    }
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesType = activeTypeTab === "All" || tx.type.toLowerCase() === activeTypeTab.toLowerCase();
      const matchesSearch = !searchQuery.trim() ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.orderId && tx.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.channel && tx.channel.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [transactions, activeTypeTab, searchQuery]);

  // Export Statement
  const handleExportStatement = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Transaction ID,Order ID,Date,Type,Channel,Amount,Balance After,Payment Method,Notes\n" +
      transactions.map(t => 
        `"${t.transactionId}","${t.orderId}","${t.date}","${t.type}","${t.channel}","${t.amount}","${t.balanceAfter}","${t.paymentMethod}","${(t.notes || '').replace(/"/g, '""')}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `comms_wallet_statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Statement exported as CSV",
      showConfirmButton: false,
      timer: 2000
    });
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Order ID copied!",
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Multi-Channel Broadcast Ledger
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Live MongoDB Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-indigo-400 inline" />
            Communication & SMS Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Prepaid balance for school-wide WhatsApp Business alerts, transactional DLT SMS, emergency circulars, and student fee due reminders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 self-start md:self-auto">
          <button
            onClick={() => fetchWalletData()}
            disabled={refreshing}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-white cursor-pointer border border-white/10"
            title="Reload from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <SettingsIcon className="w-4 h-4 text-indigo-300" />
            <span>Thresholds</span>
          </button>

          <button 
            onClick={() => setShowAddMoneyModal(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer border-none"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Money</span>
          </button>
        </div>
      </div>

      {/* ─── Top Balance Spotlight & Key Metrics ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Current Balance Glowing Spotlight Card (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-indigo-500/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-4 text-white/10 pointer-events-none">
            <Wallet className="w-36 h-36" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md">
                Available Wallet Balance
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                ₹{summary.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-indigo-150 font-medium mt-1">
                Sufficient for ~{summary.quotas?.availableWhatsapp?.toLocaleString('en-IN') || '70,000'} WhatsApp sends
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex items-center justify-between gap-3">
            <button
              onClick={() => setShowAddMoneyModal(true)}
              className="flex-1 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-center"
            >
              Instant Top-Up
            </button>
            <button
              onClick={() => setShowCalculatorModal(true)}
              className="py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Cost Calculator</span>
            </button>
          </div>
        </div>

        {/* 4 Supporting Metrics Cards (lg:col-span-7) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          
          {/* Card 1: WhatsApp Available */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                ₹{summary.rates?.whatsapp}/msg
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-slate-900">
                {summary.quotas?.availableWhatsapp?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                WhatsApp Sends Left
              </div>
            </div>
          </div>

          {/* Card 2: SMS Available */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                ₹{summary.rates?.smsTransactional}/sms
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-slate-900">
                {summary.quotas?.availableSms?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Transactional SMS Left
              </div>
            </div>
          </div>

          {/* Card 3: Spent 30 Days */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Last 30 Days</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-slate-900">
                ₹{summary.spent30Days?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Broadcast Spend
              </div>
            </div>
          </div>

          {/* Card 4: Total Recharged */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Lifetime</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-slate-900">
                ₹{summary.totalRecharged?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Total Recharged
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ─── Rate Card Pill Strip ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black text-slate-900">Real-Time Messaging Tariff:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Business: ₹0.78 / delivered msg</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Transactional SMS: ₹0.22 / SMS</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>Voice Broadcast: ₹0.45 / min</span>
          </div>
        </div>

        <button
          onClick={() => setShowCalculatorModal(true)}
          className="text-indigo-600 hover:text-indigo-800 text-xs font-black flex items-center gap-1 cursor-pointer bg-transparent border-none"
        >
          Open Campaign Calculator &rarr;
        </button>
      </div>

      {/* ─── Transaction History Ledger ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Filter Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600" />
              Transaction Ledger & Billing Statements
            </h3>
            <p className="text-xs text-slate-400">Chronological statement of all wallet recharges and automated broadcast dispatches</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by notes or Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
              {['All', 'Credit', 'Debit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTypeTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                    activeTypeTab === tab
                      ? 'bg-white text-indigo-700 shadow-xs font-black'
                      : 'bg-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportStatement}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-4">Transaction / Order</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Type</th>
                <th className="p-4">Channel / Campaign</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Balance After</th>
                <th className="p-4">Payment Method / Usage</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 font-semibold">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCredit = tx.type === "Credit";
                  return (
                    <tr key={tx._id || tx.transactionId || tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{tx.orderId || tx.transactionId}</span>
                          <button
                            onClick={() => copyOrderId(tx.orderId || tx.transactionId)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded bg-transparent border-none cursor-pointer"
                            title="Copy Order ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.transactionId}</div>
                      </td>

                      <td className="p-4 text-slate-600 font-semibold">{tx.date}</td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit ${
                          isCredit 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {tx.type}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-800">{tx.channel}</td>

                      <td className="p-4">
                        <span className={`font-black text-sm ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCredit ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-700">
                        ₹{Number(tx.balanceAfter || tx.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4 text-slate-600 font-medium">
                        {tx.paymentMethod || 'Razorpay'}
                        {tx.recipientCount ? <span className="ml-1 text-[11px] text-slate-400">({tx.recipientCount} msgs)</span> : ''}
                      </td>

                      <td className="p-4 text-slate-500 text-xs max-w-xs truncate" title={tx.notes}>
                        {tx.notes}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>Showing {filteredTransactions.length} of {transactions.length} entries</span>
          <span>Verified Cryptographic SHA-256 Ledger</span>
        </div>
      </div>

      {/* ─── ADD MONEY DRAWER / MODAL ─── */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-200" />
                <h3 className="font-black text-base">Top-Up Communication Wallet</h3>
              </div>
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProceedPay} className="p-6 space-y-5 text-xs">
              
              {/* Presets */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Choose Recharge Package</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((p) => {
                    const isSelected = customAmount === p.amount.toString();
                    return (
                      <button
                        key={p.amount}
                        type="button"
                        onClick={() => setCustomAmount(p.amount.toString())}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="font-black text-sm">{p.tag}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100 font-semibold' : 'text-slate-400'}`}>
                          {p.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Or Enter Custom Recharge Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">₹</span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter amount (min ₹100)"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Razorpay', label: 'Razorpay Live', icon: CreditCard },
                    { id: 'UPI Instant', label: 'UPI QR Instant', icon: QrCode },
                    { id: 'Net Banking', label: 'Corporate Banking', icon: Landmark },
                    { id: 'Debit / Card', label: 'Cards (Visa/MC)', icon: CreditCard }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold'
                      }`}
                    >
                      <m.icon className="w-4 h-4 text-indigo-600" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Credits Breakdown */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1 text-[11px] text-indigo-900 font-medium">
                <div className="flex justify-between font-bold">
                  <span>Recharge Amount:</span>
                  <span>₹{Number(customAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-indigo-700">
                  <span>Estimated WhatsApp Messages:</span>
                  <span className="font-bold">~{Math.floor(Number(customAmount || 0) / 0.78).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-indigo-700">
                  <span>Estimated SMS Messages:</span>
                  <span className="font-bold">~{Math.floor(Number(customAmount || 0) / 0.22).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Pay ₹{Number(customAmount || 0).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ─── SETTINGS MODAL ─── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-indigo-200" />
                <h3 className="font-black text-base">Wallet Threshold Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-4 text-xs">
              
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">Low Balance Warnings</div>
                  <div className="text-[11px] text-slate-400">Receive alerts when credits fall below cutoff</div>
                </div>
                <input
                  type="checkbox"
                  checked={lowBalanceAlert}
                  onChange={(e) => setLowBalanceAlert(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Minimum Threshold Amount (₹)</label>
                <select
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="200">₹200 (Emergency only)</option>
                  <option value="500">₹500 (Recommended)</option>
                  <option value="1000">₹1,000 (Early warning)</option>
                  <option value="2000">₹2,000 (High-volume)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Alert Email Destination</label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Alert WhatsApp / SMS Number</label>
                <input
                  type="text"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer border-none"
                >
                  {savingSettings ? "Saving..." : "Save Preferences"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── CALCULATOR MODAL ─── */}
      {showCalculatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-base">Campaign Cost Estimator</h3>
              </div>
              <button
                onClick={() => setShowCalculatorModal(false)}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Intended Recipient Count (Parents/Students)</label>
                <input
                  type="number"
                  min="1"
                  step="50"
                  value={calcRecipients}
                  onChange={(e) => setCalcRecipients(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-900">WhatsApp Business Broadcast</div>
                    <div className="text-[10px] text-emerald-700 font-medium">₹0.78 / delivered msg</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-700">
                      ₹{(calcRecipients * 0.78).toFixed(2)}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600">
                      {summary.balance >= calcRecipients * 0.78 ? '✓ Balance Covered' : '⚠️ Top-up needed'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-purple-900">Transactional DLT SMS</div>
                    <div className="text-[10px] text-purple-700 font-medium">₹0.22 / SMS</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-purple-700">
                      ₹{(calcRecipients * 0.22).toFixed(2)}
                    </div>
                    <div className="text-[10px] font-bold text-purple-600">
                      {summary.balance >= calcRecipients * 0.22 ? '✓ Balance Covered' : '⚠️ Top-up needed'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCalculatorModal(false)}
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-xs cursor-pointer border-none"
                >
                  Close Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
