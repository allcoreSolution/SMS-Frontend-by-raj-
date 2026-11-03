import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Loans from './pages/Loans';
import AddLoan from './pages/AddLoan';
import Leave from './pages/Leave';
import StudentList from './pages/StudentList';
import CollectFees from './pages/CollectFees';
import SearchDueFees from './pages/SearchDueFees';
import AssignFees from './pages/AssignFees';
import FeeGroups from './pages/FeeGroups';
import FeeTypes from './pages/FeeTypes';
import Income from './pages/Income';
import Expense from './pages/Expense';
import IncomeHeads from './pages/IncomeHeads';
import ExpenseHeads from './pages/ExpenseHeads';
import LeadDashboard from './pages/LeadDashboard';
import LeadPipeline from './pages/LeadPipeline';
import LeadSources from './pages/LeadSources';
import DayBook from './pages/DayBook';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Logout from './pages/Logout';
import MainLayout from './layout/MainLayout';
// Smart AuthGate: redirect to dashboard if authenticated, or login if not
const AuthGate = () => {
  const isAuth = typeof window !== 'undefined' && !!(localStorage.getItem('accountant_token') || localStorage.getItem('token'));
  return isAuth ? <Navigate to="/accounts/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Root & Android WebView launch paths */}
        <Route path="/" element={<AuthGate />} />
        <Route path="/index.html" element={<AuthGate />} />
        <Route path="/accounts/index.html" element={<Navigate to="/accounts/dashboard" replace />} />
        <Route path="/accountant/index.html" element={<Navigate to="/accounts/dashboard" replace />} />
        
        {/* Auth Routes (No Sidebar/Header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Dashboard Routes (With Header/Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/accounts/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Navigate to="/accounts/dashboard" replace />} />
          <Route path="/accountant" element={<Navigate to="/accounts/dashboard" replace />} />
          <Route path="/accountant/dashboard" element={<Dashboard />} />
          
          {/* Placeholder routes matching the dashboard links */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/add" element={<AddLoan />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/students" element={<StudentList />} />

          {/* Accounts & Vouchers */}
          <Route path="/accounts/income" element={<Income />} />
          <Route path="/accounts/expense" element={<Expense />} />
          <Route path="/accounts/income-heads" element={<IncomeHeads />} />
          <Route path="/accounts/expense-heads" element={<ExpenseHeads />} />
          <Route path="/accounts/day-book" element={<DayBook />} />
          <Route path="/accounts/income/add" element={<AddIncome />} />
          <Route path="/accounts/expense/add" element={<AddExpense />} />

          {/* Fees Management */}
          <Route path="/fees" element={<Navigate to="/fees/collect" replace />} />
          <Route path="/fees/collect" element={<CollectFees />} />
          <Route path="/student-fee-collection" element={<Navigate to="/fees/collect" replace />} />
          <Route path="/fees/due" element={<SearchDueFees />} />
          <Route path="/fees/assign" element={<AssignFees />} />
          <Route path="/fees/groups" element={<FeeGroups />} />
          <Route path="/fees/types" element={<FeeTypes />} />
          
          {/* Lead Management */}
          <Route path="/leads" element={<Navigate to="/leads/dashboard" replace />} />
          <Route path="/leads/dashboard" element={<LeadDashboard />} />
          <Route path="/leads/pipeline" element={<LeadPipeline />} />
          <Route path="/leads/sources" element={<LeadSources />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Global Catch-all to eliminate any 404 Route Not Found */}
        <Route path="*" element={<Navigate to="/accounts/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
