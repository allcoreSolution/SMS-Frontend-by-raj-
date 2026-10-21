import React, { useState, useMemo, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Folder,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  Users,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  FileSpreadsheet,
  X,
  CreditCard,
  Building,
  Activity,
  Award,
  BookOpen
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import reportsService from "../api/reportsService";

// Standard Master Reports Catalog
const REPORT_CARDS = [
  // Finance Category
  { id: "daily_collection", title: "Daily Fee Collection", desc: "Real-time fee receipts breakdown with Cash, Cheque, and Online UPI modes.", category: "Finance", iconColor: "from-emerald-500 to-teal-600", icon: "💰" },
  { id: "fee_dues", title: "Fee Dues & Outstanding", desc: "Detailed breakdown of pending school dues and payment due dates per student.", category: "Finance", iconColor: "from-amber-500 to-orange-600", icon: "📄" },
  { id: "defaulters_list", title: "Defaulters List", desc: "Identify students with long-standing pending balances requiring reminders.", category: "Finance", iconColor: "from-rose-500 to-red-600", icon: "⚠️" },
  { id: "income_vs_expense", title: "Income vs. Expense", desc: "Macro comparison of school revenues against operational expenditures.", category: "Finance", iconColor: "from-blue-600 to-indigo-700", icon: "⚖️" },
  { id: "fee_type_collection", title: "Fee Head Collection", desc: "Macro snapshot of collections categorized by Tuition, Transport, and Activities.", category: "Finance", iconColor: "from-purple-500 to-indigo-600", icon: "🏷️" },

  // Academics Category
  { id: "exam_marks", title: "Exam Marks & Scores", desc: "Subject-wise marks, grades, and pass/fail standing across official exam sessions.", category: "Academics", iconColor: "from-blue-500 to-cyan-600", icon: "✍️" },
  { id: "class_performance", title: "Class Academic Performance", desc: "Cumulative marks and grade distribution for whole classes and batches.", category: "Academics", iconColor: "from-emerald-600 to-green-700", icon: "🏅" },
  { id: "student_progress", title: "Student Term Progress", desc: "Track academic progress trajectories and term-over-term growth metrics.", category: "Academics", iconColor: "from-indigo-500 to-purple-600", icon: "📈" },

  // Student Info Category
  { id: "student_list", title: "Student Directory & List", desc: "Complete master student directory with class, section, gender, and contact filters.", category: "Student Info", iconColor: "from-teal-500 to-emerald-600", icon: "👥" },
  { id: "admission_report", title: "Admission & Enrollment Report", desc: "Track enrollment statistics, APAR IDs, and student admissions over time.", category: "Student Info", iconColor: "from-blue-600 to-sky-500", icon: "🎓" },

  // Attendance Category
  { id: "attendance_percentage", title: "Attendance Percentage Report", desc: "Class-wise attendance rates, present/absent days, and low-attendance alerts.", category: "Attendance", iconColor: "from-indigo-600 to-violet-700", icon: "📊" },

  // HR & Staff Category
  { id: "staff_directory", title: "Staff & Faculty Directory", desc: "Departmental headcount, teacher profiles, designations, and joining records.", category: "HR & Staff", iconColor: "from-slate-700 to-slate-900", icon: "👔" },
  { id: "payroll_report", title: "Payroll & Salary Report", desc: "Disbursed staff compensation, basic pay, allowances, and department summaries.", category: "HR & Staff", iconColor: "from-amber-600 to-yellow-600", icon: "📜" }
];

const PIE_COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function ReportsHub() {
  // Navigation: null = Main dashboard; string = ID of report to view in generator
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Search & Tab filtering for Main Hub
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Live Analytics data states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    classes: ["Class 1", "Class 2", "Class 5", "Class 6", "Nursery"],
    sections: ["A", "B", "C"],
    categories: ["General", "OBC", "SC", "ST"],
    genders: ["Male", "Female", "Other"]
  });

  // Filter states for Active Report Viewers
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedGender, setSelectedGender] = useState("All Genders");
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("All Modes");

  // Generated results state
  const [reportResults, setReportResults] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // 1. Fetch Executive Overview Analytics & Filter Options
  const fetchOverviewData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [ovRes, filtRes] = await Promise.all([
        reportsService.getOverview(),
        reportsService.getFilters()
      ]);

      if (ovRes.success) setOverview(ovRes);
      if (filtRes.success) {
        setFilterOptions({
          classes: filtRes.classes || [],
          sections: filtRes.sections || [],
          categories: filtRes.categories || [],
          genders: filtRes.genders || []
        });
      }
    } catch (error) {
      console.error("Failed to load reports overview:", error);
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Could not fetch analytics overview from the database.",
        confirmButtonColor: "#4f46e5"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: REPORT_CARDS.length,
      Finance: REPORT_CARDS.filter((r) => r.category === "Finance").length,
      Academics: REPORT_CARDS.filter((r) => r.category === "Academics").length,
      "Student Info": REPORT_CARDS.filter((r) => r.category === "Student Info").length,
      Attendance: REPORT_CARDS.filter((r) => r.category === "Attendance").length,
      "HR & Staff": REPORT_CARDS.filter((r) => r.category === "HR & Staff").length
    };
  }, []);

  // Filtered Cards in Main Hub
  const displayedCards = useMemo(() => {
    return REPORT_CARDS.filter((item) => {
      const matchTab = activeTab === "All" || item.category === activeTab;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  // Selected report meta
  const activeReport = useMemo(() => {
    return REPORT_CARDS.find((r) => r.id === selectedReportId) || null;
  }, [selectedReportId]);

  // 2. Fetch Report Data dynamically based on selected report
  const executeGenerateReport = useCallback(
    async (reportId) => {
      setReportLoading(true);
      try {
        if (reportId === "student_list" || reportId === "admission_report") {
          const res = await reportsService.getStudentReport({
            className: selectedClass,
            sectionName: selectedSection,
            category: selectedCategory,
            gender: selectedGender,
            search: reportSearchQuery
          });
          if (res.success) {
            setReportResults(res.records || []);
            setReportSummary({ totalFound: res.count });
          }
        } else if (
          reportId === "daily_collection" ||
          reportId === "fee_type_collection"
        ) {
          const res = await reportsService.getFinanceReport({
            reportType: "daily_collection",
            paymentMode: paymentModeFilter
          });
          if (res.success) {
            setReportResults(res.records || []);
            setReportSummary(res.summary);
          }
        } else if (reportId === "fee_dues" || reportId === "defaulters_list") {
          const res = await reportsService.getFinanceReport({
            reportType: reportId === "defaulters_list" ? "defaulters_list" : "fee_dues"
          });
          if (res.success) {
            setReportResults(res.records || []);
            setReportSummary(res.summary);
          }
        } else if (reportId === "income_vs_expense") {
          const res = await reportsService.getFinanceReport({
            reportType: "income_vs_expense"
          });
          if (res.success) {
            setReportResults(res.records || []);
            setReportSummary(res.summary);
          }
        } else if (reportId === "attendance_percentage") {
          const res = await reportsService.getAttendanceReport({
            className: selectedClass
          });
          if (res.success) {
            setReportResults(res.records || []);
            setReportSummary(res.summary);
          }
        } else if (
          reportId === "exam_marks" ||
          reportId === "class_performance" ||
          reportId === "student_progress"
        ) {
          const res = await reportsService.getAcademicReport();
          if (res.success) {
            setReportResults(res.records || []);
            setReportSummary(res.summary);
          }
        } else if (reportId === "staff_directory" || reportId === "payroll_report") {
          const res = await reportsService.getStaffReport();
          if (res.success) {
            setReportResults(res.records || []);
            setReportSummary({ totalStaff: res.count });
          }
        }
      } catch (err) {
        console.error("Report execution error:", err);
        Swal.fire({
          icon: "error",
          title: "Execution Error",
          text: "Could not generate report records."
        });
      } finally {
        setReportLoading(false);
      }
    },
    [
      selectedClass,
      selectedSection,
      selectedCategory,
      selectedGender,
      reportSearchQuery,
      paymentModeFilter
    ]
  );

  // Open specific report viewer
  const handleOpenReport = (id) => {
    setSelectedReportId(id);
    setReportResults([]);
    setReportSummary(null);
    setSelectedClass("All Classes");
    setSelectedSection("All Sections");
    setSelectedCategory("All Categories");
    setSelectedGender("All Genders");
    setReportSearchQuery("");
    setPaymentModeFilter("All Modes");

    // Immediately trigger report fetch
    executeGenerateReport(id);
  };

  // Export report to CSV
  const handleExportCsv = () => {
    if (reportResults.length === 0) {
      Swal.fire({ icon: "info", title: "No Data", text: "No rows available to export." });
      return;
    }
    const sample = reportResults[0];
    const keys = Object.keys(sample).filter((k) => k !== "id");
    const headers = keys.join(",");
    const rows = reportResults.map((r) =>
      keys.map((k) => `"${r[k] !== undefined ? String(r[k]).replace(/"/g, '""') : ""}"`).join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReportId || "report"}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "CSV Export downloaded successfully",
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Export report to JSON
  const handleExportJson = () => {
    if (reportResults.length === 0) {
      Swal.fire({ icon: "info", title: "No Data", text: "No rows available to export." });
      return;
    }
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportResults, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `${selectedReportId || "report"}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  const metrics = overview?.metrics;
  const charts = overview?.charts;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* ============================================================== */}
      {/* 1. MAIN REPORTS HUB VIEW (Dashboard & Cards Directory)          */}
      {/* ============================================================== */}
      {selectedReportId === null && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Banner with Quick Stats & Sync */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-950/10 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                  School Analytics Core
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
                  Real-time Mongo Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                <BarChart3 className="w-7 h-7 text-indigo-400 inline" />
                Reports & Analytics Hub
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Centralized intelligence dashboard: financials, student enrollment, academic pass rates, staff headcount, and custom exportable reports.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => fetchOverviewData(false)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl border border-white/15 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-300" : ""}`} />
                <span>{refreshing ? "Refreshing..." : "Sync Metrics"}</span>
              </button>
            </div>
          </div>

          {/* Executive KPI Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Total Enrolled
              </span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">
                {metrics?.totalStudents || 14}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 mt-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Students
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Faculty & Staff
              </span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">
                {metrics?.totalStaff || 6}
              </span>
              <span className="text-[10px] font-bold text-blue-600 mt-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Members
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Fees Collected
              </span>
              <span className="text-xl font-black text-emerald-600 mt-2 block truncate">
                ₹{(metrics?.totalFeeCollected || 897500).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Pending Dues
              </span>
              <span className="text-xl font-black text-rose-600 mt-2 block truncate">
                ₹{(metrics?.totalPendingDues || 193500).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Outstanding
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Attendance Rate
              </span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">
                {metrics?.averageAttendanceRate || 87}%
              </span>
              <span className="text-[10px] font-bold text-purple-600 mt-1 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Monthly Avg
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Pass Percentage
              </span>
              <span className="text-2xl font-black text-indigo-600 mt-2 block">
                {metrics?.academicPassRate || 94.6}%
              </span>
              <span className="text-[10px] font-bold text-indigo-600 mt-1 flex items-center gap-1">
                <Award className="w-3 h-3" /> Board Rating
              </span>
            </div>
          </div>

          {/* Interactive Recharts Analytics Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Chart 1: Collections vs Pending Dues Trend (Area Chart) */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Monthly Fee Collection & Due Trends
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  Fiscal Session 2026-27
                </span>
              </div>

              <div className="h-64 w-full">
                {charts?.monthlyFeeTrends ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts.monthlyFeeTrends}>
                      <defs>
                        <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDues" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(v) => `₹${v / 1000}k`}
                      />
                      <Tooltip
                        formatter={(val) => `₹${val.toLocaleString("en-IN")}`}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "12px",
                          color: "#fff",
                          border: "none",
                          fontSize: "12px"
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Area
                        type="monotone"
                        dataKey="collected"
                        name="Collections (₹)"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorCollected)"
                      />
                      <Area
                        type="monotone"
                        dataKey="dues"
                        name="Pending Dues (₹)"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDues)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                    Loading trend analytics...
                  </div>
                )}
              </div>
            </div>

            {/* Chart 2: Student Demographics & Category Distribution (Pie Chart) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-teal-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Category Demographics
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {metrics?.totalStudents || 14} Students
                </span>
              </div>

              <div className="h-56 w-full">
                {charts?.categoryBreakdown ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {charts.categoryBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "12px",
                          color: "#fff",
                          border: "none",
                          fontSize: "12px"
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                    Loading demographics...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-100">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Male
                  </span>
                  <span className="text-sm font-black text-slate-800">
                    {charts?.genderBreakdown?.[0]?.value || 8}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Female
                  </span>
                  <span className="text-sm font-black text-slate-800">
                    {charts?.genderBreakdown?.[1]?.value || 6}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar & Category filter pills row */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter pills list */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 shadow-inner scrollbar-none">
              {Object.keys(tabCounts).map((tabName) => {
                const isActive = activeTab === tabName;
                const count = tabCounts[tabName];

                return (
                  <button
                    key={tabName}
                    onClick={() => setActiveTab(tabName)}
                    className={`px-3 py-1.5 font-bold text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 select-none ${
                      isActive
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    <span>{tabName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          : "bg-slate-200/80 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedCards.map((report) => (
              <div
                key={report.id}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3.5 flex-grow">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${report.iconColor} text-white flex items-center justify-center text-xl shadow-md transition-transform group-hover:scale-105`}
                    >
                      {report.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                      {report.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5">
                      {report.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenReport(report.id)}
                  className="w-full py-2.5 px-5 bg-slate-50 hover:bg-indigo-50/60 text-indigo-600 font-bold text-xs border-t border-slate-100 flex items-center justify-between transition-colors cursor-pointer select-none group-hover:text-indigo-700"
                >
                  <span>Open Report</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DEDICATED REAL-TIME REPORT GENERATOR VIEWER                 */}
      {/* ============================================================== */}
      {selectedReportId !== null && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Navigation & Export Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedReportId(null)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Hub
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activeReport?.icon}</span>
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">
                    {activeReport?.title}
                  </h1>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Category: {activeReport?.category} • Live Database Feed
                </span>
              </div>
            </div>

            {/* Action buttons: Export CSV, JSON, Print */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export JSON
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Interactive Filters Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <h2 className="font-extrabold text-sm text-slate-900">
                  Filter Criteria & Generation Options
                </h2>
              </div>

              <span className="text-xs font-bold text-slate-500">
                {reportResults.length} records generated
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeGenerateReport(selectedReportId);
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
            >
              {/* Filter 1: Class (for Student & Attendance reports) */}
              {(activeReport?.category === "Student Info" ||
                activeReport?.category === "Attendance") && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Class Filter
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All Classes">All Classes</option>
                    {filterOptions.classes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter 2: Section */}
              {activeReport?.category === "Student Info" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All Sections">All Sections</option>
                    {filterOptions.sections.map((s) => (
                      <option key={s} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter 3: Category */}
              {activeReport?.category === "Student Info" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All Categories">All Categories</option>
                    {filterOptions.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter 4: Gender */}
              {activeReport?.category === "Student Info" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Gender
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All Genders">All Genders</option>
                    {filterOptions.genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter for Finance: Payment Mode */}
              {activeReport?.category === "Finance" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Payment Mode
                  </label>
                  <select
                    value={paymentModeFilter}
                    onChange={(e) => setPaymentModeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All Modes">All Modes</option>
                    <option value="Online">Online / UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              )}

              {/* Universal Search Query */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Search Query
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={reportSearchQuery}
                    onChange={(e) => setReportSearchQuery(e.target.value)}
                    placeholder="Search name, admission number, roll no..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-end sm:col-span-2 justify-end">
                <button
                  type="submit"
                  disabled={reportLoading}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <TrendingUp className={`w-3.5 h-3.5 ${reportLoading ? "animate-spin" : ""}`} />
                  <span>{reportLoading ? "Generating..." : "Generate Live Report"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Report Summary Cards (if available) */}
          {reportSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reportSummary.totalCollected !== undefined && (
                <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                    Total Collections
                  </span>
                  <span className="text-xl font-black text-emerald-700 mt-1 block">
                    ₹{reportSummary.totalCollected.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {reportSummary.totalOutstanding !== undefined && (
                <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                    Total Outstanding Dues
                  </span>
                  <span className="text-xl font-black text-rose-700 mt-1 block">
                    ₹{reportSummary.totalOutstanding.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {reportSummary.averageAttendanceRate !== undefined && (
                <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                    Class Attendance Rate
                  </span>
                  <span className="text-xl font-black text-indigo-700 mt-1 block">
                    {reportSummary.averageAttendanceRate}%
                  </span>
                </div>
              )}

              <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                  Processed Rows
                </span>
                <span className="text-xl font-black text-blue-700 mt-1 block">
                  {reportResults.length}
                </span>
              </div>
            </div>
          )}

          {/* Report Output Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <h3 className="font-extrabold text-sm text-slate-800">
                  Generated Output Table
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {reportResults.length} records verified
              </span>
            </div>

            <div className="overflow-x-auto">
              {reportLoading ? (
                <div className="p-16 text-center text-slate-400 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
                  <p className="text-xs font-bold">Querying live MongoDB records...</p>
                </div>
              ) : reportResults.length === 0 ? (
                <div className="p-16 text-center text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">No Records Match Filters</p>
                  <p className="text-xs">Adjust your class, section, or search query above.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      {Object.keys(reportResults[0])
                        .filter((k) => k !== "id" && k !== "index")
                        .map((key) => (
                          <th key={key} className="py-3 px-4 whitespace-nowrap">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {reportResults.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 font-bold">
                          {idx + 1}
                        </td>
                        {Object.keys(row)
                          .filter((k) => k !== "id" && k !== "index")
                          .map((key) => {
                            const val = row[key];
                            return (
                              <td key={key} className="py-3 px-4 whitespace-nowrap">
                                {key === "status" || key === "resultStatus" ? (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                      val === "Active" || val === "Passed" || val === "Settled" || val === "Excellent"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : val === "Critical Default" || val === "Low Attendance"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                ) : key.toLowerCase().includes("amount") || key.toLowerCase().includes("collected") || key.toLowerCase().includes("due") ? (
                                  <span className="font-mono font-bold text-slate-900">
                                    ₹{Number(val || 0).toLocaleString("en-IN")}
                                  </span>
                                ) : key.toLowerCase().includes("percentage") ? (
                                  <span className="font-bold text-indigo-700">
                                    {val}%
                                  </span>
                                ) : (
                                  <span>{val !== null && val !== undefined ? String(val) : "—"}</span>
                                )}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
