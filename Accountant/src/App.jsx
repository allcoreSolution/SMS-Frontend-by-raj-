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

import { 
  HandHeart, FileSearch, UserPlus, Layers, Tags, 
  ArrowDown, ArrowUp, Tag, Filter
} from 'lucide-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/accounts/dashboard" replace />} />
        
        {/* Auth Routes (No Sidebar/Header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Dashboard Routes (With Header/Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/accounts/dashboard" element={<Dashboard />} />
          
          {/* Placeholder routes matching the dashboard links to prevent 404 */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/add" element={<AddLoan />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/students" element={<StudentList />} />

          {/* Generic/Placeholder Routes for missing modules */}
          <Route path="/accounts/income" element={<Income />} />
          <Route path="/accounts/expense" element={<Expense />} />
          <Route path="/accounts/income-heads" element={<IncomeHeads />} />
          <Route path="/accounts/expense-heads" element={<ExpenseHeads />} />
          <Route path="/accounts/day-book" element={<DayBook />} />
          <Route path="/accounts/income/add" element={<AddIncome />} />
          <Route path="/accounts/expense/add" element={<AddExpense />} />

          <Route path="/fees/collect" element={<CollectFees />} />
          <Route path="/student-fee-collection" element={<Navigate to="/fees/collect" replace />} />
          <Route path="/fees/due" element={<SearchDueFees />} />
          <Route path="/fees/assign" element={<AssignFees />} />
          <Route path="/fees/groups" element={<FeeGroups />} />
          <Route path="/fees/types" element={<FeeTypes />} />
          
          <Route path="/leads/dashboard" element={<LeadDashboard />} />
          <Route path="/leads/pipeline" element={<LeadPipeline />} />
          <Route path="/leads/sources" element={<LeadSources />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          
          <Route path="*" element={<div className="p-10 font-bold text-center text-gray-500">404 - Accountant Route Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
