import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { accountantService } from '../api/accountantService';
import localDb from '../api/localDb';
import { 
  Printer, ArrowDown, ArrowUp, Wallet, BarChart, BarChart3, LineChart,
  Megaphone, User, FileText, Send, Users,
  HandCoins, FileSearch, UserPlus, Layers, Tags, Tag, Gauge, 
  LayoutDashboard, SlidersHorizontal, RefreshCw, Plus, 
  ArrowRight, X, UserCircle2, ChevronLeft, ChevronRight, TrendingUp,
  DollarSign, Clock, Pin, Play, Pause, Bell, Sparkles, CheckCircle2,
  Coins, Building2, CalendarCheck, Target, Zap, Receipt, Check, ShieldCheck
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import Swal from 'sweetalert2';
import SchoolCalendar from '../components/SchoolCalendar';

// Animated currency counter for financial numbers
const AnimatedCurrencyCounter = ({ value = 0, duration = 1200 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = typeof value === 'number' ? value : (parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return <span>₹{displayValue.toLocaleString('en-IN')}</span>;
};

const ClassicStatCard = ({ 
  id,
  title, 
  subTitle, 
  numericValue = 0,
  iconBg = 'bg-[#00a65a]', 
  strokeColor = '#00a65a',
  icon: Icon, 
  linkTo, 
  actionText,
  trend,
  trendType = 'positive',
  linePath,
  areaPath,
  delay = 0
}) => {
  return (
    <div 
      style={{ animation: `riseUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }}
      className="bg-white rounded-lg p-2 sm:px-2.5 sm:py-2 shadow-xs border border-slate-100 hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
    >
      {/* Live Indicator */}
      <div className="absolute top-1 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span className="text-[7px] font-bold text-emerald-600 uppercase tracking-tighter">Live</span>
      </div>

      {/* Top Row: Icon Badge & Trend Pill */}
      <div className="flex items-center justify-between mb-1 z-10">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white shadow-xs transition-transform duration-300 group-hover:scale-105 ${iconBg}`}>
          {Icon ? <Icon className="w-3 h-3" /> : null}
        </div>
        {trend && (
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs ${
            trendType === 'positive' 
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
              : trendType === 'alert'
              ? 'text-rose-700 bg-rose-50 border border-rose-200/60'
              : 'text-sky-700 bg-sky-50 border border-sky-200/60'
          }`}>
            <span className="inline-block text-[7.5px] transition-transform duration-300 group-hover:-translate-y-0.5" style={{ animation: 'pulseUp 1.5s infinite ease-in-out' }}>↑</span>
            {trend}
          </span>
        )}
      </div>

      {/* Middle: Big Value + Title + Subtitle on Left, Sparkline on Right */}
      <div className="flex items-end justify-between z-10 gap-1 mb-1">
        <div className="min-w-0 pr-0.5">
          <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-none mb-0.5">
            <AnimatedCurrencyCounter value={numericValue} />
          </h3>
          <p className="text-[10.5px] font-bold text-gray-800 leading-tight truncate">
            {title}
          </p>
          {subTitle && (
            <p className="text-[8.5px] font-medium text-gray-400 mt-0.5 leading-none truncate">
              {subTitle}
            </p>
          )}
        </div>

        {/* Trend Area Chart (Sparkline) */}
        <div className="w-14 sm:w-16 h-5 sm:h-6 relative flex-shrink-0 -mb-0.5">
          <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`spark-acc-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#spark-acc-${id})`} />
            <path 
              d={linePath} 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="transition-all duration-300 group-hover:stroke-[2.5]"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Action Link */}
      <Link 
        to={linkTo} 
        className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px] font-semibold text-gray-500 hover:text-[#ff5c0a] transition-colors z-10"
      >
        <span>{actionText || 'More info'}</span>
        <ArrowRight className="w-2.5 h-2.5 transform group-hover:translate-x-0.5 transition-transform text-gray-400 group-hover:text-[#ff5c0a]" />
      </Link>
    </div>
  );
};

// Custom Tooltip for Chart
const CustomOverviewTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find(p => p.dataKey === 'Income')?.value || 0;
    const expense = payload.find(p => p.dataKey === 'Expense')?.value || 0;
    const net = income - expense;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-xs font-sans">
        <p className="font-bold text-gray-800 border-b border-gray-100 pb-1 mb-1.5">{label} Financial Breakdown</p>
        <div className="space-y-1">
          <p className="text-[#00a65a] font-semibold flex items-center justify-between gap-4">
            <span>Income & Fees:</span>
            <span>₹{income.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-[#dd4b39] font-semibold flex items-center justify-between gap-4">
            <span>Expenditure:</span>
            <span>₹{expense.toLocaleString('en-IN')}</span>
          </p>
          <div className="pt-1 border-t border-gray-100 flex items-center justify-between gap-4 font-bold">
            <span className="text-gray-600">Net Surplus:</span>
            <span className={net >= 0 ? 'text-[#00a65a]' : 'text-[#dd4b39]'}>
              {net >= 0 ? '+' : ''}₹{net.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Universal Quick Action Cards definition with category tabs mapping
const QUICK_ACTION_CARDS = [
  // General
  { id: 'gen-loans', title: 'My Loans', to: '/loans', icon: HandCoins, bg: 'bg-[#605ca8] hover:bg-[#504c90]', text: 'text-white', tabs: ['General'] },
  { id: 'gen-leave', title: 'Apply Leave', to: '/leave', icon: Send, bg: 'bg-[#17a2b8] hover:bg-[#138496]', text: 'text-white', tabs: ['General'] },
  { id: 'gen-students', title: 'Student List', to: '/students', icon: Users, bg: 'bg-[#007bff] hover:bg-[#0069d9]', text: 'text-white', tabs: ['General'] },
  { id: 'gen-profile', title: 'My Profile', to: '/profile', icon: UserCircle2, bg: 'bg-[#dd4b39] hover:bg-[#c23321]', text: 'text-white', tabs: ['General'] },

  // Fees
  { id: 'fees-collect', title: 'Collect Fees', to: '/fees/collect', icon: HandCoins, bg: 'bg-[#28a745] hover:bg-[#218838]', text: 'text-white', tabs: ['Fees'] },
  { id: 'fees-due', title: 'Search Due', to: '/fees/due', icon: FileSearch, bg: 'bg-[#ffc107] hover:bg-[#e0a800]', text: 'text-[#333]', tabs: ['Fees'] },
  { id: 'fees-assign', title: 'Assign Fees', to: '/fees/assign', icon: UserPlus, bg: 'bg-[#17a2b8] hover:bg-[#138496]', text: 'text-white', tabs: ['Fees'] },
  { id: 'fees-groups', title: 'Fee Groups', to: '/fees/groups', icon: Layers, bg: 'bg-[#6f42c1] hover:bg-[#5a32a3]', text: 'text-white', tabs: ['Fees'] },
  { id: 'fees-types', title: 'Fee Types', to: '/fees/types', icon: Tags, bg: 'bg-[#6c757d] hover:bg-[#5a6268]', text: 'text-white', tabs: ['Fees'] },

  // Accounts Management
  { id: 'acc-income', title: 'Income List', to: '/accounts/income', icon: ArrowDown, bg: 'bg-[#00a65a] hover:bg-[#008d4c]', text: 'text-white', tabs: ['Accounts Management'] },
  { id: 'acc-add-income', title: 'Add Income', to: '/accounts/income/add', icon: Plus, bg: 'bg-[#3c8dbc] hover:bg-[#367fa9]', text: 'text-white', tabs: ['Accounts Management'] },
  { id: 'acc-expense', title: 'Expense List', to: '/accounts/expense', icon: ArrowUp, bg: 'bg-[#dd4b39] hover:bg-[#c23321]', text: 'text-white', tabs: ['Accounts Management'] },
  { id: 'acc-add-expense', title: 'Add Expense', to: '/accounts/expense/add', icon: Plus, bg: 'bg-[#e08e0b] hover:bg-[#c67605]', text: 'text-white', tabs: ['Accounts Management'] },
  { id: 'acc-day-book', title: 'Day Book', to: '/accounts/day-book', icon: FileText, bg: 'bg-[#605ca8] hover:bg-[#504c90]', text: 'text-white', tabs: ['Accounts Management'] },
  { id: 'acc-income-heads', title: 'Income Heads', to: '/accounts/income-heads', icon: Tag, bg: 'bg-[#00c0ef] hover:bg-[#00a7d0]', text: 'text-white', tabs: ['Accounts Management'] },
  { id: 'acc-expense-heads', title: 'Expense Heads', to: '/accounts/expense-heads', icon: Tag, bg: 'bg-[#d81b60] hover:bg-[#b5144f]', text: 'text-white', tabs: ['Accounts Management'] },

  // HR & Staff
  { id: 'hr-loans', title: 'My Loans', to: '/loans', icon: HandCoins, bg: 'bg-[#605ca8] hover:bg-[#504c90]', text: 'text-white', tabs: ['HR & Staff'] },
  { id: 'hr-apply-loan', title: 'Apply Loan', to: '/loans/add', icon: Plus, bg: 'bg-[#5a52d7] hover:bg-[#4a42c0]', text: 'text-white', tabs: ['HR & Staff'] },
  { id: 'hr-leave', title: 'Apply Leave', to: '/leave', icon: Send, bg: 'bg-[#17a2b8] hover:bg-[#138496]', text: 'text-white', tabs: ['HR & Staff'] },
  { id: 'hr-profile', title: 'Staff Profile', to: '/profile', icon: User, bg: 'bg-[#dd4b39] hover:bg-[#c23321]', text: 'text-white', tabs: ['HR & Staff'] },

  // Lead Management
  { id: 'lead-dashboard', title: 'Lead Dashboard', to: '/leads/dashboard', icon: Gauge, bg: 'bg-[#007bff] hover:bg-[#0069d9]', text: 'text-white', tabs: ['Lead Management'] },
  { id: 'lead-pipeline', title: 'Pipeline Board', to: '/leads/pipeline', icon: LayoutDashboard, bg: 'bg-[#28a745] hover:bg-[#218838]', text: 'text-white', tabs: ['Lead Management'] },
  { id: 'lead-sources', title: 'Lead Sources', to: '/leads/sources', icon: SlidersHorizontal, bg: 'bg-[#ffc107] hover:bg-[#e0a800]', text: 'text-[#333]', tabs: ['Lead Management'] },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);
  const [voucherFilter, setVoucherFilter] = useState('All'); // All | Income | Expense
  const [voucherSearch, setVoucherSearch] = useState('');
  const [chartType, setChartType] = useState('bar'); // bar | area
  
  // Notice board slider state
  const [notices, setNotices] = useState([]);
  const [currentNoticeIdx, setCurrentNoticeIdx] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [noticeViewMode, setNoticeViewMode] = useState('slider'); // slider | list
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', text: '', tag: 'General Announcement' });

  // Profile info
  const [profile, setProfile] = useState({
    name: 'Accountant', role: 'Accountant', staffId: '',
    department: 'Finance & Accounts',
    basicSalary: '0',
    avatar: ''
  });

  const [stats, setStats] = useState({
    collectedToday: 0,
    incomeMonth: 0,
    expenseMonth: 0,
    cashBankBalance: 0,
    chartData: [],
    recentVouchers: []
  });

  // Fast Fee Collection Terminal state
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickMode, setQuickMode] = useState('Cash');
  const [quickNote, setQuickNote] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);

  // Financial Deadlines state
  const [deadlines, setDeadlines] = useState([]);

  const selectedStudent = useMemo(() => {
    return Array.isArray(studentsList) ? studentsList.find(s => s && ((s.id || s._id) === selectedStudentId)) || null : null;
  }, [studentsList, selectedStudentId]);

  const handleToggleDeadline = (id) => {
    setDeadlines(prev => prev.map(d => {
      if (d && d.id === id) {
        const nextStatus = d.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  const loadStudents = () => {
    try {
      const list = localDb.getAll('students');
      if (Array.isArray(list) && list.length > 0) {
        setStudentsList(list);
        if (!selectedStudentId) {
          const withDue = list.find(s => s && Number(s.due || 0) > 0) || list[0];
          if (withDue) {
            setSelectedStudentId(withDue.id || withDue._id || '');
            setQuickAmount(withDue.due ? String(withDue.due) : '5000');
          }
        }
      } else {
        setStudentsList([]);
      }
    } catch (e) {
      console.error('Error loading students:', e);
      setStudentsList([]);
    }
  };

  const handleStudentSelect = (id) => {
    setSelectedStudentId(id);
    const stu = studentsList.find(s => s.id === id || s._id === id);
    if (stu) {
      setQuickAmount(stu.due ? String(stu.due) : '2500');
    }
  };

  const handleQuickCollect = (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      return Swal.fire('Select Student', 'Please select a student to collect fees from.', 'warning');
    }
    const amt = Number(quickAmount);
    if (!amt || amt <= 0) {
      return Swal.fire('Invalid Amount', 'Please enter a valid collection amount.', 'warning');
    }

    const stu = studentsList.find(s => s.id === selectedStudentId || s._id === selectedStudentId);
    if (!stu) return;

    setIsCollecting(true);
    const receiptNo = `RCP-2026/${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Update Student Due
    const newDue = Math.max(0, Number(stu.due || 0) - amt);
    localDb.update('students', stu.id || stu._id, { due: newDue });

    // 2. Add Collection record
    localDb.create('collections', {
      studentId: stu.id || stu._id,
      studentName: stu.name,
      className: stu.class,
      amount: amt,
      date: new Date().toISOString().slice(0, 10),
      mode: quickMode,
      receipt: receiptNo
    });

    // 3. Add to Incomes
    localDb.create('incomes', {
      head: 'Tuition Fee Collection',
      name: `Fee Collection - ${stu.name} (${stu.class})`,
      amount: amt,
      date: new Date().toISOString().slice(0, 10),
      paymentMode: quickMode,
      note: quickNote || `Counter Receipt ${receiptNo}`,
      invoiceNo: receiptNo
    });

    setIsCollecting(false);
    loadStats();
    loadStudents();

    Swal.fire({
      icon: 'success',
      title: 'Fee Collection Successful!',
      html: `
        <div class="text-left text-[13px] bg-gray-50 p-3 rounded border border-gray-200 mt-2 space-y-1">
          <div><strong>Receipt Number:</strong> <span class="text-[#3c8dbc] font-mono font-bold">${receiptNo}</span></div>
          <div><strong>Student:</strong> ${stu.name} (Class ${stu.class})</div>
          <div><strong>Amount Received:</strong> <span class="text-green-600 font-bold">₹${amt.toLocaleString('en-IN')}</span></div>
          <div><strong>Payment Mode:</strong> ${quickMode}</div>
          <div><strong>Remaining Balance:</strong> ₹${newDue.toLocaleString('en-IN')}</div>
        </div>
      `,
      confirmButtonText: 'Done / Print Receipt',
      confirmButtonColor: '#00a65a',
      showCancelButton: true,
      cancelButtonText: 'Close',
    });
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await accountantService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
      const pRes = await accountantService.getProfile();
      if (pRes?.data) {
        setProfile(pRes.data);
      } else {
        const p = localDb.getProfile();
        if (p) setProfile(p);
      }
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadStudents();
  }, []);

  // Notice Slider Auto-Play Effect (Advances every 4.5s unless paused)
  useEffect(() => {
    if (isSliderPaused || noticeViewMode !== 'slider' || notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNoticeIdx(prev => (prev + 1) % notices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isSliderPaused, noticeViewMode, notices.length]);

  const nextNotice = () => {
    setCurrentNoticeIdx(prev => (prev + 1) % notices.length);
  };

  const prevNotice = () => {
    setCurrentNoticeIdx(prev => (prev - 1 + notices.length) % notices.length);
  };

  // Filter vouchers
  const filteredVouchers = (Array.isArray(stats?.recentVouchers) ? stats.recentVouchers : []).filter(v => {
    if (!v) return false;
    const matchesKind = voucherFilter === 'All' || v.type === voucherFilter;
    const q = (voucherSearch || '').toLowerCase().trim();
    const matchesSearch = !q || 
      (v.head && String(v.head).toLowerCase().includes(q)) ||
      (v.type && String(v.type).toLowerCase().includes(q)) ||
      String(v.amount || '').includes(q);
    return matchesKind && matchesSearch;
  });

  // Calculate 6-month chart statistics
  const chartTotals = useMemo(() => {
    const data = Array.isArray(stats?.chartData) ? stats.chartData : [];
    const totalInc = data.reduce((s, d) => s + (Number(d?.Income) || 0), 0);
    const totalExp = data.reduce((s, d) => s + (Number(d?.Expense) || 0), 0);
    const netSavings = totalInc - totalExp;
    const margin = totalInc > 0 ? Math.round((netSavings / totalInc) * 100) : 0;
    return { totalInc, totalExp, netSavings, margin };
  }, [stats?.chartData]);

  // Post Notice
  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.text.trim()) {
      return Swal.fire('Error', 'Please fill in notice title and message', 'error');
    }
    const newN = {
      id: `n_${Date.now()}`,
      title: noticeForm.title.trim(),
      text: noticeForm.text.trim(),
      tag: noticeForm.tag || 'Announcement',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: 'bg-emerald-500'
    };
    const updated = [newN, ...notices];
    setNotices(updated);
    setCurrentNoticeIdx(0);
    setShowNoticeModal(false);
    setNoticeForm({ title: '', text: '', tag: 'General Announcement' });
    Swal.fire({
      title: 'Notice Published!',
      text: 'New announcement has been published to the notice slider.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleDeleteNotice = (id) => {
    const remaining = notices.filter(n => n.id !== id);
    setNotices(remaining);
    if (currentNoticeIdx >= remaining.length) {
      setCurrentNoticeIdx(Math.max(0, remaining.length - 1));
    }
  };

  const visibleCards = useMemo(() => {
    if (activeTab === 'All') {
      const seen = new Set();
      return QUICK_ACTION_CARDS.filter(card => {
        if (!card || !card.to || seen.has(card.to)) return false;
        seen.add(card.to);
        return true;
      });
    }
    return QUICK_ACTION_CARDS.filter(card => card && card.tabs && card.tabs.includes(activeTab));
  }, [activeTab]);

  const activeNotice = (notices && notices.length > 0 && notices[currentNoticeIdx]) ? notices[currentNoticeIdx] : (notices?.[0] || {});

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans pb-16">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#333] flex items-center gap-2">
            <Gauge className="w-6 h-6 text-[#f39c12]" /> Accountant Dashboard
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Financial summary, daybook transactions, fee collections, staff loans and institutional calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={loadStats}
            title="Refresh Dashboard"
            className="p-2 bg-white border border-gray-300 rounded-[3px] text-gray-600 hover:text-[#5a52d7] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#5a52d7]' : ''}`} />
          </button>
          
          <Link
            to="/fees/collect"
            className="px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white text-[13px] font-semibold rounded-[3px] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Collect Fee
          </Link>
          <Link
            to="/accounts/income/add"
            className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[13px] font-semibold rounded-[3px] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Income
          </Link>
          <Link
            to="/loans/add"
            className="px-3 py-1.5 bg-[#605ca8] hover:bg-[#504c90] text-white text-[13px] font-semibold rounded-[3px] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Apply Loan
          </Link>
        </div>
      </div>

      {/* Modern Financial Trend Stat Cards (Compact Standard Size) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <ClassicStatCard 
          id="collected"
          title="Collected Today" 
          subTitle="Student Fee Collections"
          numericValue={stats.collectedToday || 0}
          icon={Printer} 
          iconBg="bg-[#10b981]" 
          strokeColor="#059669"
          trend="Daily Collection"
          trendType="positive"
          delay={0}
          linkTo="/fees/collect"
          actionText="Collect more fees"
          linePath="M0,32 C20,32 35,38 50,20 C65,12 80,22 100,10"
          areaPath="M0,32 C20,32 35,38 50,20 C65,12 80,22 100,10 L100,45 L0,45 Z"
        />
        <ClassicStatCard 
          id="income"
          title="Income This Month" 
          subTitle="Fees & Misc Receipts"
          numericValue={stats.incomeMonth || 0}
          icon={ArrowDown} 
          iconBg="bg-[#0ea5e9]" 
          strokeColor="#0284c7"
          trend={stats.incomeMonth > 0 ? "Monthly Inflow" : "₹0 Month"}
          trendType="positive"
          delay={80}
          linkTo="/accounts/income"
          actionText="View all income"
          linePath="M0,34 C25,34 40,30 55,16 C70,6 85,14 100,4"
          areaPath="M0,34 C25,34 40,30 55,16 C70,6 85,14 100,4 L100,45 L0,45 Z"
        />
        <ClassicStatCard 
          id="expense"
          title="Expense This Month" 
          subTitle="Salaries & Operations"
          numericValue={stats.expenseMonth || 0}
          icon={ArrowUp} 
          iconBg="bg-[#f43f5e]" 
          strokeColor="#e11d48"
          trend={stats.expenseMonth > 0 ? "Operating Costs" : "₹0 Month"}
          trendType="alert"
          delay={160}
          linkTo="/accounts/expense"
          actionText="View all expenses"
          linePath="M0,30 C20,30 35,18 50,24 C65,28 80,14 100,10"
          areaPath="M0,30 C20,30 35,18 50,24 C65,28 80,14 100,10 L100,45 L0,45 Z"
        />
        <ClassicStatCard 
          id="balance"
          title="Cash & Bank Balance" 
          subTitle="Net Available Liquidity"
          numericValue={stats.cashBankBalance || stats.cashBalance || 0}
          icon={Wallet} 
          iconBg="bg-[#f59e0b]" 
          strokeColor="#d97706"
          trend={stats.cashBankBalance > 0 ? "Net Surplus" : "Zero Balance"}
          trendType="positive"
          delay={240}
          linkTo="/accounts/day-book"
          actionText="Open day book"
          linePath="M0,26 C25,26 40,34 55,20 C70,10 85,18 100,8"
          areaPath="M0,26 C25,26 40,34 55,20 C70,10 85,18 100,8 L100,45 L0,45 Z"
        />
      </div>

      {/* Dynamic Navigation Tabs & Quick Action Blocks */}
      <div className="bg-white rounded-[3px] border-t-[3px] border-t-[#f39c12] shadow-sm mb-6">
        <div className="border-b border-[#f4f4f4] px-4 bg-[#fafafa]">
          <ul className="flex flex-wrap text-[13px] sm:text-[14px] font-semibold m-0 p-0 list-none">
            {['All', 'General', 'Fees', 'Accounts Management', 'HR & Staff', 'Lead Management'].map((tab) => (
              <li key={tab}>
                <button 
                  onClick={() => setActiveTab(tab)}
                  className={`inline-block px-4 py-2.5 transition-colors focus:outline-none ${
                    activeTab === tab 
                      ? 'text-[#f39c12] bg-white border-t-2 border-t-[#f39c12] -mt-[2px] border-l border-r border-[#eee]' 
                      : 'text-gray-600 hover:text-[#f39c12] hover:bg-gray-100/50'
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 sm:p-5">
          {/* Quick Action Tiles - Compact Small Size */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 border-b border-[#f4f4f4] pb-4 mb-5">
            {visibleCards.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`${item.bg} ${item.text || 'text-white'} flex flex-col items-center justify-center p-2 rounded-[4px] transition-all duration-200 h-[68px] w-[96px] sm:w-[102px] shrink-0 shadow-2xs hover:shadow-md hover:-translate-y-0.5 group`}
                  title={item.title}
                >
                  {Icon ? <Icon className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" /> : null}
                  <span className="text-[11px] font-semibold text-center leading-tight tracking-tight px-0.5">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── UPGRADED INCOME & EXPENSE OVERVIEW ────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Area */}
            <div className="lg:col-span-2 flex flex-col">
              
              {/* Chart Card Header */}
              <div className="bg-[#3c8dbc] text-white px-4 py-3 rounded-t-[3px] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5 text-white/90"/> 
                  <div>
                    <h3 className="text-[15px] font-bold tracking-wide">Income & Expense Overview (Real 6-Month Data)</h3>
                    <p className="text-[11px] text-white/80">Historical trend across student fee collections and institutional overheads</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Type Toggle */}
                  <div className="flex bg-black/20 p-0.5 rounded text-[11px] font-semibold">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-2 py-0.5 rounded transition-colors ${chartType === 'bar' ? 'bg-white text-gray-800 shadow-xs' : 'text-white/80 hover:text-white'}`}
                    >
                      Bar
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`px-2 py-0.5 rounded transition-colors ${chartType === 'area' ? 'bg-white text-gray-800 shadow-xs' : 'text-white/80 hover:text-white'}`}
                    >
                      Trend
                    </button>
                  </div>

                  <span className="text-[11px] bg-white/20 text-white px-2.5 py-0.5 rounded font-semibold">
                    May - Oct 2026
                  </span>
                </div>
              </div>

              {/* Chart KPI Metrics Ribbon */}
              <div className="bg-[#fcfcfc] border-x border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00a65a]" />
                  <span className="text-gray-500">6-Mo Inflow:</span>
                  <span className="font-bold text-[#00a65a]">₹{chartTotals.totalInc.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#dd4b39]" />
                  <span className="text-gray-500">6-Mo Outflow:</span>
                  <span className="font-bold text-[#dd4b39]">₹{chartTotals.totalExp.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-gray-500">Net Surplus:</span>
                  <span className="font-bold text-gray-800">₹{chartTotals.netSavings.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] bg-emerald-100 text-[#00a65a] font-bold px-1.5 py-0.2 rounded">
                    +{chartTotals.margin}%
                  </span>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="bg-white border border-[#e0e0e0] border-t-0 p-4 h-[330px] rounded-b-[3px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <RechartsBarChart data={stats.chartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }} barSize={26}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} tickFormatter={(val) => val >= 1000 ? (val/1000) + 'k' : val} />
                      <Tooltip content={<CustomOverviewTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="Income" name="Total Inflow (₹)" fill="#00a65a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expense" name="Expenditure (₹)" fill="#dd4b39" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  ) : (
                    <AreaChart data={stats.chartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00a65a" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#00a65a" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dd4b39" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#dd4b39" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} tickFormatter={(val) => val >= 1000 ? (val/1000) + 'k' : val} />
                      <Tooltip content={<CustomOverviewTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="Income" name="Total Inflow (₹)" stroke="#00a65a" fillOpacity={1} fill="url(#colorInc)" />
                      <Area type="monotone" dataKey="Expense" name="Expenditure (₹)" stroke="#dd4b39" fillOpacity={1} fill="url(#colorExp)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vouchers Table */}
            <div>
              <div className="bg-white border border-[#e0e0e0] rounded-[3px] overflow-hidden flex flex-col h-full shadow-2xs">
                
                {/* Vouchers Header & Filter Tabs */}
                <div className="bg-[#f8f9fa] border-b border-[#e0e0e0] px-3.5 py-2.5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[14px] font-bold text-[#333]">Audit Daybook Vouchers</h3>
                    <Link to="/accounts/day-book" className="text-xs text-[#3c8dbc] hover:underline font-semibold flex items-center gap-1">
                      Day Book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1 bg-gray-200 p-0.5 rounded text-[11px] font-semibold">
                      {['All', 'Income', 'Expense'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setVoucherFilter(tab)}
                          className={`px-2 py-0.5 rounded transition-colors ${voucherFilter === tab ? 'bg-white text-[#333] shadow-xs' : 'text-gray-600 hover:text-black'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <input 
                      type="text" 
                      placeholder="Filter..." 
                      value={voucherSearch}
                      onChange={e => setVoucherSearch(e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-0.5 w-28 bg-white focus:outline-none focus:border-[#3c8dbc]"
                    />
                  </div>
                </div>

                {/* Vouchers List */}
                <div className="h-[315px] overflow-y-auto w-full p-2.5 bg-white divide-y divide-gray-100">
                  {filteredVouchers.length === 0 ? (
                    <div className="text-gray-400 text-center py-10 text-xs flex flex-col items-center justify-center h-full">
                      <FileText className="w-8 h-8 opacity-30 mb-2" />
                      No vouchers match filter
                    </div>
                  ) : filteredVouchers.map((v, i) => (
                    <div 
                      key={i} 
                      onClick={() => navigate(v.type === 'Income' ? '/accounts/income' : '/accounts/expense')}
                      className="flex justify-between items-center p-2.5 hover:bg-[#f8f9fc] rounded cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] px-1.5 py-0.2 font-bold uppercase rounded text-white ${v.type === 'Receipt' || v.type === 'Income' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'}`}>
                            {v.type}
                          </span>
                          <span className="text-[13px] font-bold text-[#333] group-hover:text-[#3c8dbc]">
                            ₹{Number(v.amount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate max-w-[170px]" title={v.head || v.note}>
                          {v.head || v.note || 'Voucher'}
                        </p>
                      </div>
                      <div className="text-[10px] text-gray-400 whitespace-nowrap text-right">
                        {v.date}
                        <span className="block text-[10px] text-gray-300 font-mono">{v.paymentMode || 'Cash'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── SECTION 1: CORE OPERATIONS & CALENDAR (BALANCED EQUAL-HEIGHT GRID) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
        
        {/* Left Column (2/3): School Calendar (Medium Sized) */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <SchoolCalendar />
        </div>

        {/* Right Column (1/3): Fast Fee Collection Desk & Cash Drawer (Equal Height) */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <div className="bg-white rounded-[3px] shadow-sm border border-gray-200 border-t-[3px] border-t-[#00a65a] flex flex-col justify-between h-full overflow-hidden">
            <div>
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-[#fbfcfb] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#00a65a] flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5">
                      Fast Fee Collection Desk
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded font-bold border border-emerald-200">
                        Counter #1
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-400">Instant counter receipt & ledger sync</p>
                  </div>
                </div>
                <Link 
                  to="/fees/collect"
                  className="text-[11px] text-[#00a65a] hover:underline font-bold flex items-center gap-0.5 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200"
                >
                  Full Desk <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Form Body */}
              <form onSubmit={handleQuickCollect} className="p-4 space-y-3">
                {/* Student Picker */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide">
                      Select Student
                    </label>
                    {selectedStudent && (
                      <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                        Number(selectedStudent.due || 0) > 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600'
                      }`}>
                        Due: ₹{Number(selectedStudent.due || 0).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full text-[13px] border border-gray-300 rounded-[3px] p-2 bg-white focus:outline-none focus:border-[#00a65a]"
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {(studentsList || []).filter(Boolean).map((stu) => (
                      <option key={stu.id || stu._id || Math.random()} value={stu.id || stu._id || ''}>
                        {stu.name || 'Student'} ({stu.class || ''} {stu.section ? `- ${stu.section}` : ''}) • Roll: {stu.rollNo || stu.admissionNo || '-'} {Number(stu.due || 0) > 0 ? `[Due ₹${stu.due}]` : '[Clear]'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount & Quick Presets */}
                <div>
                  <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Collection Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter amount..."
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-[14px] font-bold text-gray-800 border border-gray-300 rounded-[3px] focus:outline-none focus:border-[#00a65a]"
                      required
                    />
                  </div>
                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-gray-400 font-medium">Quick:</span>
                    {[1000, 2500, 5000].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setQuickAmount(String(amt))}
                        className="px-2 py-0.5 text-[10.5px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition-colors"
                      >
                        +₹{amt}
                      </button>
                    ))}
                    {selectedStudent && Number(selectedStudent.due || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setQuickAmount(String(selectedStudent.due))}
                        className="px-2 py-0.5 text-[10.5px] bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded transition-colors ml-auto"
                      >
                        Full Due
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div>
                  <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Payment Mode
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Cash', 'UPI/QR', 'Cheque', 'Online'].map(mode => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setQuickMode(mode)}
                        className={`py-1 text-[11px] font-bold rounded transition-all text-center border ${
                          quickMode === mode 
                            ? 'bg-[#00a65a] text-white border-[#00a65a] shadow-xs' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remarks/Note */}
                <div>
                  <input
                    type="text"
                    placeholder="Receipt remark / note (optional)"
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    className="w-full text-[12px] border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#00a65a]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isCollecting}
                  className="w-full py-2 bg-[#00a65a] hover:bg-[#008d4c] active:bg-[#00733e] text-white text-[13px] font-bold rounded-[3px] flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <Receipt className="w-4 h-4" />
                  {isCollecting ? 'Generating Receipt...' : 'Collect Fees & Generate Receipt'}
                </button>
              </form>
            </div>

            {/* Bottom Live Drawer & Daily Target (Ensures exact bottom alignment) */}
            <div className="p-3.5 bg-gray-50/90 border-t border-gray-200 mt-2 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium flex items-center gap-1">
                  💵 Petty Cash Drawer Balance:
                </span>
                <span className="font-mono font-bold text-gray-900">₹{Number(stats.collectedToday || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-[#f39c12]" /> Today's Collection Goal (₹60,000)
                  </span>
                  <span className="font-bold text-[#00a65a]">
                    {Math.min(100, Math.round(((stats.collectedToday || 0) / 60000) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#00a65a] to-[#3c8dbc] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round(((stats.collectedToday || 0) / 60000) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── SECTION 2: TREASURY, COMPLIANCE & STAFF (BALANCED 3-COLUMN EQUAL-HEIGHT GRID) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-6">
        
        {/* Col 1: Treasury Liquidity & Bank Balances */}
        <div className="flex flex-col h-full">
          <div className="bg-white rounded-[3px] shadow-sm border border-gray-200 border-t-[3px] border-t-[#3c8dbc] h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#fbfcfd]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#3c8dbc]" />
                  <h3 className="text-[13.5px] font-bold text-gray-800">Treasury & Bank Liquidity</h3>
                </div>
                <span className="text-[10.5px] font-bold text-[#00a65a] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Live Sync
                </span>
              </div>

              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between p-2.5 bg-gray-50/80 rounded border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      💵
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-800">Petty Cash Counter</p>
                      <p className="text-[10px] text-gray-400">Physical Vault Drawer</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-mono font-bold text-gray-900">₹{Number(stats.collectedToday || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-50/80 rounded border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">
                      🏦
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-800">SBI Fee Current A/c</p>
                      <p className="text-[10px] text-gray-400">A/c: •••• 4892</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-mono font-bold text-[#3c8dbc]">₹0</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-50/80 rounded border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-purple-50 text-purple-700 flex items-center justify-center text-xs font-bold">
                      🏛️
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-800">HDFC Development A/c</p>
                      <p className="text-[10px] text-gray-400">A/c: •••• 1045</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-mono font-bold text-gray-900">₹0</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Total Liquid Capital:</span>
              <span className="font-mono font-bold text-[#00a65a] text-[13px]">₹{Number(stats.cashBankBalance || stats.collectedToday || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Upcoming Financial Deadlines & Statutory Compliance */}
        <div className="flex flex-col h-full">
          <div className="bg-white rounded-[3px] shadow-sm border border-gray-200 border-t-[3px] border-t-[#f39c12] h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#fcfbf9]">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#f39c12]" />
                  <h3 className="text-[13.5px] font-bold text-gray-800">Financial Compliance & Dues</h3>
                </div>
                <span className="text-[10.5px] font-bold text-[#f39c12] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Next 7-14 Days
                </span>
              </div>

              <div className="p-3 space-y-2">
                {deadlines.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    No pending financial deadlines or compliance dues.
                  </div>
                ) : deadlines.map((d) => (
                  <div 
                    key={d.id} 
                    className={`p-2.5 rounded border transition-all flex items-center justify-between gap-2 ${
                      d.status === 'Completed' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-[#f39c12]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${d.color}`}>
                          {d.type}
                        </span>
                        <span className="text-[10.5px] text-gray-400 font-medium">{d.dueDate}</span>
                      </div>
                      <h4 className={`text-[12px] font-bold truncate leading-snug ${d.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {d.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="text-[12px] font-mono font-bold text-gray-800 block">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleDeadline(d.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors flex items-center gap-0.5 ${
                          d.status === 'Completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                        }`}
                      >
                        {d.status === 'Completed' ? <Check className="w-3 h-3" /> : null}
                        {d.status === 'Completed' ? 'Done' : 'Pay'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Pending Statutory Dues:</span>
              <span className="font-mono font-bold text-[#dd4b39] text-[13px]">
                ₹{deadlines.filter(d => d.status !== 'Completed').reduce((s, d) => s + d.amount, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Col 3: Accountant Staff Profile Card */}
        <div className="flex flex-col h-full">
          <div className="bg-white border-t-[3px] border-t-[#605ca8] shadow-sm rounded-[3px] border border-gray-200 h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#faf9fc]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#605ca8]" />
                  <h3 className="text-[#605ca8] font-bold text-[13.5px]">Accountant Staff Profile</h3>
                </div>
                <Link to="/profile" className="text-xs text-[#605ca8] hover:underline font-semibold">
                  Edit Profile
                </Link>
              </div>
              
              <div className="p-4 flex flex-col items-center">
                <div className="relative">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-16 h-16 rounded-full border-[2px] border-purple-200 object-cover shadow-2xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-[2px] border-purple-200 bg-gradient-to-tr from-[#605ca8] to-purple-400 text-white font-bold text-xl flex items-center justify-center shadow-2xs">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" title="Active on duty" />
                </div>

                <h4 className="text-[15px] font-bold text-[#333] mt-2">{profile.name}</h4>
                <p className="text-gray-500 text-[11.5px] font-semibold">{profile.role} • {profile.department}</p>
                <span className="text-[10.5px] bg-purple-50 text-[#605ca8] px-2 py-0.2 rounded font-mono mt-1 font-bold">
                  ID: {profile.staffId}
                </span>
                
                <div className="w-full mt-3 border-t border-gray-100 pt-2 text-[11.5px] space-y-1.5">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500">Monthly Basic Salary:</span>
                    <span className="font-bold text-gray-800">₹{Number(profile.basicSalary || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500">Official Email:</span>
                    <span className="font-medium text-gray-700 truncate max-w-[150px]">{profile.email || 'accountant@allcoresolution.com'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500">Phone Contact:</span>
                    <span className="font-medium text-gray-700">{profile.phone || 'Not configured'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-3 bg-gray-50/80 border-t border-gray-100">
              <Link
                to="/profile"
                className="w-full block text-center py-1.5 bg-white hover:bg-gray-100 text-[#605ca8] text-xs font-semibold rounded border border-gray-200 transition-colors"
              >
                View Full Profile & Salary History
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ── SECTION 3: SCHOOL NOTICE BOARD (FULL-WIDTH BROADCAST CAROUSEL) ── */}
      <div 
        className="bg-white shadow-sm rounded-[3px] overflow-hidden border border-gray-200 mb-6"
        onMouseEnter={() => setIsSliderPaused(true)}
        onMouseLeave={() => setIsSliderPaused(false)}
      >
        {/* Notice Board Header */}
        <div className="bg-[#dd4b39] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 animate-bounce" />
            <div>
              <h3 className="text-[15px] font-bold leading-tight">School Notice Board & Broadcast Center</h3>
              <p className="text-[11px] text-white/80">Official circulars, examination schedules, and institutional announcements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNoticeViewMode(noticeViewMode === 'slider' ? 'list' : 'slider')}
              className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-2.5 py-1 rounded transition-colors"
              title="Toggle Slider / List mode"
            >
              {noticeViewMode === 'slider' ? 'List View' : 'Slider View'}
            </button>
            <button 
              onClick={() => setShowNoticeModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-3 py-1 rounded transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Post Notice
            </button>
          </div>
        </div>

        {noticeViewMode === 'slider' ? (
          /* Wide Slider Container */
          <div className="p-5 relative bg-gradient-to-b from-white to-gray-50/70">
            {notices.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#dd4b39]" />
                <p className="text-xs">No active notices.</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Active Notice Card */}
                <div className="bg-white p-5 rounded border border-gray-200 shadow-xs flex-1 transition-all duration-300 w-full">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#dd4b39] animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#dd4b39] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {activeNotice?.tag || 'Official Announcement'}
                      </span>
                      <span className="text-[11.5px] text-gray-400 font-medium flex items-center gap-1 ml-2">
                        <Clock className="w-3 h-3 text-gray-400" /> {activeNotice?.date}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDeleteNotice(activeNotice.id)}
                      className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      title="Dismiss Notice"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-[17px] text-[#222] leading-snug mb-2">
                    {activeNotice?.title}
                  </h4>
                  <p className="text-gray-600 text-[13.5px] leading-relaxed">
                    {activeNotice?.text}
                  </p>
                </div>

                {/* Slider Controls & Index */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <span className="text-[11.5px] font-mono text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-full">
                    Notice {currentNoticeIdx + 1} of {notices.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevNotice}
                      className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 shadow-2xs transition-colors"
                      title="Previous Notice"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5 px-2">
                      {notices.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentNoticeIdx(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            currentNoticeIdx === idx 
                              ? 'w-6 bg-[#dd4b39]' 
                              : 'w-2 bg-gray-300 hover:bg-gray-400'
                          }`}
                          title={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextNotice}
                      className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 shadow-2xs transition-colors"
                      title="Next Notice"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        ) : (
          /* List Mode: Clean Responsive 4-Column Grid */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#fdfdfd]">
            {notices.map((n) => (
              <div key={n.id} className="border-l-[3px] border-[#3c8dbc] bg-white p-3.5 shadow-xs text-[13px] border-y border-y-gray-200 border-r border-r-gray-200 rounded-r flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#3c8dbc] bg-blue-50 px-1.5 py-0.5 rounded">
                      {n.tag}
                    </span>
                    <button 
                      onClick={() => handleDeleteNotice(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-0.5"
                      title="Dismiss notice"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-[#333] leading-snug mb-1">{n.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{n.text}</p>
                </div>
                <span className="text-[10.5px] text-gray-400 mt-2 block font-mono border-t border-gray-100 pt-1.5">{n.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── POST NOTICE MODAL ────────────────────────────── */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <h3 className="font-bold text-[#333] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#dd4b39]" /> Post Notice to Slider
              </h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleAddNotice} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Notice Headline *</label>
                <input 
                  required 
                  type="text" 
                  value={noticeForm.title} 
                  onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="e.g. Diwali Holiday Announcement" 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#dd4b39]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Category Badge</label>
                <select
                  value={noticeForm.tag}
                  onChange={e => setNoticeForm({ ...noticeForm, tag: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#dd4b39] bg-white"
                >
                  <option value="Finance Notice">Finance Notice</option>
                  <option value="Academic">Academic Notice</option>
                  <option value="Staff Welfare">Staff Welfare</option>
                  <option value="Operations">Operations</option>
                  <option value="General Announcement">General Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Announcement Message *</label>
                <textarea 
                  required
                  rows="3"
                  value={noticeForm.text} 
                  onChange={e => setNoticeForm({ ...noticeForm, text: e.target.value })}
                  placeholder="Type the message for staff and school community..."
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#dd4b39] resize-none"
                />
              </div>
              <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowNoticeModal(false)} 
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#dd4b39] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#c23321] flex-1 shadow-sm"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
