import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FileText, 
  Copy, 
  Printer, 
  CreditCard, 
  ArrowLeft, 
  Download, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from "lucide-react";
import settingsService from "../api/settingsService";

export default function SubscriptionHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSubscriptionHistory();
      if (res.success && res.invoices) {
        setInvoices(res.invoices);
      }
    } catch (error) {
      console.error("Error loading subscription history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Order ID copied to clipboard",
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      inv.plan?.toLowerCase().includes(search.toLowerCase()) ||
      inv.transactionId?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/settings/subscription"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Plans
          </Link>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Subscription Payment History
            </h1>
            <p className="text-xs text-slate-400">
              Verified license invoices, payment receipts, and billing audit records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchInvoices}
            className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            title="Refresh Invoices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Invoices
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, plan, or TXN..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending Payment">Pending Payment</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">SaaS Plan</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Payment Method</th>
                <th className="py-3.5 px-5">Transaction ID</th>
                <th className="py-3.5 px-5">Date & Time</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading subscription history...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No payment invoices match your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv._id || inv.orderId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>{inv.orderId}</span>
                        <button
                          onClick={() => handleCopyOrderId(inv.orderId)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                          title="Copy Order ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-indigo-700">
                      {inv.plan}
                    </td>
                    <td className="py-3.5 px-5 font-mono font-black text-slate-900">
                      ₹{Number(inv.amount || 0).toLocaleString("en-IN")}.00
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {inv.method || "Razorpay"}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">
                      {inv.transactionId || "—"}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          inv.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
