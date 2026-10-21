import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  CreditCard, 
  ArrowUpCircle, 
  Check, 
  Clock, 
  Users, 
  ChevronRight, 
  Lock, 
  AlertCircle,
  HelpCircle,
  X,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  History,
  RefreshCw,
  Building,
  CheckCircle2
} from "lucide-react";
import settingsService from "../api/settingsService";

export default function Subscription() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({
    planId: "growth",
    planName: "Growth Plan",
    capacity: "Up to 5,000 students",
    activeStudents: 280,
    status: "Active",
    endDate: "2027-02-26",
    billingCycle: "Yearly",
    amount: 10000
  });

  const [plans, setPlans] = useState([]);

  // Modal checkout state
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("Yearly"); // Monthly | Yearly
  const [paymentMethod, setPaymentMethod] = useState("Razorpay"); // Razorpay | UPI | Netbanking
  const [processing, setProcessing] = useState(false);

  // Fetch real subscription data from MongoDB
  const fetchSubscriptionData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [subRes, plansRes] = await Promise.all([
        settingsService.getCurrentSubscription(),
        settingsService.getSubscriptionPlans()
      ]);

      if (subRes.success && subRes.subscription) {
        setCurrentPlan(subRes.subscription);
      }
      if (plansRes.success && plansRes.plans) {
        setPlans(plansRes.plans);
      }
    } catch (error) {
      console.error("Failed to load subscription:", error);
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Could not fetch subscription details from the server."
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  const handlePayClick = (plan, cycle) => {
    if (plan.id === currentPlan.planId) {
      Swal.fire({
        icon: "info",
        title: "Active Plan",
        text: `${plan.name} is already your current active plan.`
      });
      return;
    }
    setCheckoutPlan(plan);
    setBillingCycle(cycle);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const amount = billingCycle === "Yearly" ? checkoutPlan.priceYearly : checkoutPlan.priceMonthly;

      const res = await settingsService.upgradeSubscription({
        planId: checkoutPlan.id,
        planName: checkoutPlan.name,
        capacity: checkoutPlan.capacity,
        billingCycle,
        paymentMethod,
        amount
      });

      if (res.success) {
        setCurrentPlan(res.subscription);
        setCheckoutPlan(null);

        Swal.fire({
          icon: "success",
          title: "Subscription Activated!",
          html: `
            <div class="text-left text-sm space-y-2 mt-2">
              <p><strong>Plan:</strong> ${checkoutPlan.name} (${billingCycle})</p>
              <p><strong>Order ID:</strong> ${res.invoice?.orderId || "N/A"}</p>
              <p><strong>Amount Paid:</strong> ₹${amount.toLocaleString("en-IN")}</p>
              <p class="text-emerald-600 font-bold">✓ License active until ${new Date(res.subscription.endDate).toLocaleDateString()}</p>
            </div>
          `,
          confirmButtonColor: "#4f46e5"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.response?.data?.message || "Failed to process plan upgrade."
      });
    } finally {
      setProcessing(false);
    }
  };

  const formattedEndDate = currentPlan?.endDate
    ? new Date(currentPlan.endDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    : "26 Feb, 2027";

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-950/10 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Billing & SaaS License Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-indigo-400 inline" />
            School Subscription Management
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Manage your campus ERP license tiers, capacity quotas, student seat limits, and automated invoice records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/settings/subscription-history"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl border border-white/15 transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5" />
            <span>Invoices & History</span>
          </Link>
          <button
            onClick={() => fetchSubscriptionData(false)}
            disabled={refreshing}
            className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 cursor-pointer disabled:opacity-50"
            title="Refresh Subscription Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-300" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-slate-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Active Plan Spotlight Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ● {currentPlan?.status || "Active"} License
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Billing: {currentPlan?.billingCycle || "Yearly"}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                {currentPlan?.planName || "Growth Plan"}
              </h2>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                {currentPlan?.desc || "Full school ERP suite with automated admissions, payment gateway integration, parent CCTV feeds, and report generators."}
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white p-4 rounded-2xl border border-indigo-100/80 shadow-xs">
              <div className="space-y-1 border-r border-slate-100 pr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Capacity Limit
                </span>
                <span className="text-sm font-black text-slate-800">
                  {currentPlan?.capacity || "Up to 5,000 students"}
                </span>
              </div>

              <div className="space-y-1 border-r border-slate-100 pr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Current Students
                </span>
                <span className="text-sm font-black text-indigo-600">
                  {currentPlan?.activeStudents || 280} Enrolled
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Valid Until
                </span>
                <span className="text-sm font-black text-slate-900">
                  {formattedEndDate}
                </span>
              </div>
            </div>
          </div>

          {/* SaaS Plans Catalog Grid */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Available Subscription Tiers
              </h3>
              <p className="text-xs text-slate-400">
                Choose the optimal capacity and infrastructure tier for your institution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((p) => {
                const isCurrent = p.id === currentPlan?.planId;
                const isPopular = p.id === "growth";

                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border ${
                      isCurrent
                        ? "bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-md"
                        : isPopular
                        ? "bg-gradient-to-b from-indigo-50/50 to-white border-indigo-200 shadow-sm hover:shadow-md"
                        : "bg-white border-slate-200/80 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                        Current Active Plan
                      </span>
                    )}

                    {!isCurrent && isPopular && (
                      <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                        ★ Most Popular
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{p.name}</h4>
                        <span className="text-xs font-bold text-indigo-600 block mt-0.5">
                          {p.capacity}
                        </span>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                          {p.desc}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">
                          ₹{p.priceMonthly.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-bold text-slate-400">/ month</span>
                        <span className="text-[11px] text-slate-500 font-semibold ml-auto">
                          or ₹{p.priceYearly.toLocaleString("en-IN")}/yr
                        </span>
                      </div>

                      {p.features && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Included Capabilities
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                            {p.features.map((f, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-6">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Currently Subscribed
                        </button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handlePayClick(p, "Monthly")}
                            className="py-2.5 rounded-xl text-xs font-bold border border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer text-center"
                          >
                            Pay Monthly
                          </button>
                          <button
                            onClick={() => handlePayClick(p, "Yearly")}
                            className="py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition-all shadow-sm cursor-pointer text-center"
                          >
                            Pay Yearly (Save 17%)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Subscribe to {checkoutPlan.name}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              {/* Plan Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Selected Plan</span>
                  <span className="font-black text-slate-900">{checkoutPlan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Capacity</span>
                  <span className="font-bold text-slate-800">{checkoutPlan.capacity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Billing Cycle</span>
                  <span className="font-bold text-indigo-600">{billingCycle}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm font-black">
                  <span className="text-slate-900">Total Payable</span>
                  <span className="text-emerald-600">
                    ₹
                    {(billingCycle === "Yearly"
                      ? checkoutPlan.priceYearly
                      : checkoutPlan.priceMonthly
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Razorpay", "UPI", "Netbanking"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === method
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCheckoutPlan(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Pay & Activate License</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
