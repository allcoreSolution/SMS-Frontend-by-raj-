import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cake,
  Calendar,
  Gift,
  Send,
  Sliders,
  Search,
  CheckCircle2,
  Clock,
  Smartphone,
  MessageSquare,
  Mail,
  User,
  Sparkles,
  X,
  Eye,
  Filter,
  Check
} from 'lucide-react';
import Swal from 'sweetalert2';
import engagementService from '../api/engagementService';
import EngagementTabs from './engagement/EngagementTabs';

export default function BirthdayManager() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: { todayCount: 0, next7DaysCount: 0, thisMonthCount: 0, totalBirthdays: 0 },
    today: [],
    next7Days: [],
    thisMonth: [],
    all: []
  });
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('next-7-days'); // 'today', 'next-7-days', 'this-month', 'all'
  const [roleFilter, setRoleFilter] = useState('All'); // 'All', 'Student', 'Staff'
  const [searchTerm, setSearchTerm] = useState('');

  // Send Card Modal
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState('WhatsApp');
  const [customGreeting, setCustomGreeting] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch birthdays & creative templates
  const fetchBirthdays = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [bdayRes, creativesRes] = await Promise.all([
        engagementService.getBirthdays(),
        engagementService.getCreatives({ type: 'Birthday' })
      ]);

      if (bdayRes?.success) {
        setData(bdayRes.data);
      }
      if (creativesRes?.success) {
        setTemplates(creativesRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load birthday manager data:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to load birthdays from server.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBirthdays();
  }, [fetchBirthdays]);

  // Active records by tab
  const tabRecords = useMemo(() => {
    if (activeTab === 'today') return data.today;
    if (activeTab === 'next-7-days') return data.next7Days;
    if (activeTab === 'this-month') return data.thisMonth;
    return data.all;
  }, [data, activeTab]);

  // Filtered by search & role
  const filteredRecords = useMemo(() => {
    return tabRecords.filter((b) => {
      const matchRole = roleFilter === 'All' || b.personType === roleFilter;
      const matchSearch =
        !searchTerm ||
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.sub?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.date?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [tabRecords, roleFilter, searchTerm]);

  // Open send card modal
  const handleOpenSendCard = (person) => {
    setSelectedPerson(person);
    const defaultTpl = templates.find((t) => t.isDefault) || templates[0] || {
      name: 'Balloon Blue (Birthday)',
      style: 'balloon-blue',
      title: 'Happy Birthday!',
      greetingText: 'Wishing you a fantastic year filled with learning and smiles!'
    };
    setSelectedTemplate(defaultTpl);
    setCustomGreeting(`Wishing you a very Happy Birthday, ${person.name}! Have a wonderful year ahead.`);
    setSelectedChannel('WhatsApp');
    setIsSendModalOpen(true);
  };

  // Submit send greeting
  const handleSendGreeting = async (e) => {
    e.preventDefault();
    if (!selectedPerson) return;

    setSending(true);
    try {
      await engagementService.sendBirthdayGreeting({
        personId: selectedPerson.personId,
        personType: selectedPerson.personType,
        name: selectedPerson.name,
        sub: selectedPerson.sub,
        age: selectedPerson.age,
        cardTemplateName: selectedTemplate?.name || 'Balloon Blue',
        customMessage: customGreeting,
        channel: selectedChannel
      });

      Swal.fire({
        icon: 'success',
        title: 'Birthday Wish Sent!',
        text: `Card "${selectedTemplate?.name}" successfully delivered to ${selectedPerson.name} via ${selectedChannel}.`,
        timer: 2000,
        showConfirmButton: false
      });

      setIsSendModalOpen(false);
      fetchBirthdays(true);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to send greeting', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-64px)] font-sans p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cake className="w-7 h-7 text-rose-500" />
            Birthday Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track student and faculty birthdays, send personalized creative cards & configure automated dispatches
          </p>
        </div>

        <button
          onClick={() => navigate('/engagement/auto-send-settings')}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Sliders className="w-4 h-4 text-slate-500" />
          Auto-send Settings
        </button>
      </div>

      {/* Tabs */}
      <EngagementTabs
        counts={{
          birthdays: data.summary.todayCount > 0 ? `${data.summary.todayCount} Today` : null,
          creatives: templates.length
        }}
        onRefresh={() => fetchBirthdays(false)}
        loading={loading}
      />

      {/* 1. TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Today */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 p-5 text-white shadow-lg shadow-rose-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-rose-100 uppercase tracking-wider">Birthdays Today</p>
              <h3 className="text-3xl font-extrabold mt-1">{data.summary.todayCount}</h3>
              <p className="text-xs text-rose-200 mt-1">Celebrating today!</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('today')}
            className="mt-3 text-xs font-semibold underline underline-offset-2 hover:text-white"
          >
            View today's celebrants →
          </button>
        </div>

        {/* Next 7 Days */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-5 text-white shadow-lg shadow-indigo-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-indigo-100 uppercase tracking-wider">Next 7 Days</p>
              <h3 className="text-3xl font-extrabold mt-1">{data.summary.next7DaysCount}</h3>
              <p className="text-xs text-indigo-200 mt-1">Upcoming this week</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('next-7-days')}
            className="mt-3 text-xs font-semibold underline underline-offset-2 hover:text-white"
          >
            View upcoming →
          </button>
        </div>

        {/* This Month */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 p-5 text-white shadow-lg shadow-blue-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-cyan-100 uppercase tracking-wider">This Month</p>
              <h3 className="text-3xl font-extrabold mt-1">{data.summary.thisMonthCount}</h3>
              <p className="text-xs text-cyan-200 mt-1">Calendar month total</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('this-month')}
            className="mt-3 text-xs font-semibold underline underline-offset-2 hover:text-white"
          >
            Full month list →
          </button>
        </div>

        {/* Total Birthdays in Master */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-5 text-white shadow-lg shadow-amber-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-amber-100 uppercase tracking-wider">Registered Birthdays</p>
              <h3 className="text-3xl font-extrabold mt-1">{data.summary.totalBirthdays}</h3>
              <p className="text-xs text-amber-100 mt-1">Enrolled students & staff</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Cake className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-3 text-xs font-semibold underline underline-offset-2 hover:text-white"
          >
            View master schedule →
          </button>
        </div>
      </div>

      {/* 2. BIRTHDAYS TABLE CONTAINER */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Sub-Tabs & Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          {/* Range tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'today'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Today ({data.summary.todayCount})</span>
              {data.summary.todayCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('next-7-days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'next-7-days'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Next 7 Days ({data.summary.next7DaysCount})
            </button>
            <button
              onClick={() => setActiveTab('this-month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'this-month'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month ({data.summary.thisMonthCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({data.summary.totalBirthdays})
            </button>
          </div>

          {/* Search & Role filter */}
          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Roles</option>
              <option value="Student">Students Only</option>
              <option value="Staff">Faculty / Staff Only</option>
            </select>

            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search person or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Celebrant Name</th>
                <th className="py-3 px-4">Role / Group</th>
                <th className="py-3 px-4">Class / Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Turning Age</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4 text-center">Dispatch Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Cake className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No birthdays found in this timeframe</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Check other tabs or ensure students and staff have their date of birth recorded.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((person) => {
                  const isToday = person.category === 'today';
                  const isStaff = person.personType === 'Staff';

                  return (
                    <tr
                      key={person.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isToday ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isStaff
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{person.name}</span>
                            {person.phone && (
                              <span className="text-[10px] text-slate-400">{person.phone}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            isStaff
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {person.personType}
                        </span>
                      </td>

                      {/* Class / Dept */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                        {person.sub || '—'}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-800">
                        {person.date}
                      </td>

                      {/* Age */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                          {person.age} yrs
                        </span>
                      </td>

                      {/* Timeline / When */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isToday ? 'text-rose-600 animate-pulse' : 'text-slate-600'
                          }`}
                        >
                          {isToday && <Sparkles className="w-3.5 h-3.5" />}
                          {person.when}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            person.isSent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {person.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleOpenSendCard(person)}
                          className="flex items-center gap-1.5 mx-auto px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-rose-500/20 hover:scale-[1.02]"
                        >
                          <Send className="w-3 h-3" />
                          <span>{person.isSent ? 'Resend Card' : 'Send Card'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SEND CARD MODAL WITH LIVE CARD VISUAL PREVIEW */}
      {isSendModalOpen && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500 text-white rounded-xl">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Send Birthday Greeting Card
                  </h2>
                  <p className="text-xs text-slate-500">
                    For {selectedPerson.name} ({selectedPerson.sub}) · Turning {selectedPerson.age}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendGreeting} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Template Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Card Design / Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {templates.map((tpl) => {
                    const isSelected = selectedTemplate?.name === tpl.name;
                    return (
                      <button
                        type="button"
                        key={tpl._id || tpl.name}
                        onClick={() => setSelectedTemplate(tpl)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50/30 shadow-sm ring-2 ring-rose-200'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className={`h-12 rounded-lg bg-gradient-to-r ${tpl.backgroundGradient || 'from-blue-600 to-indigo-600'} flex items-center justify-center text-white font-bold text-[10px] shadow-sm mb-2`}
                        >
                          {tpl.style || 'Creative'}
                        </div>
                        <div className="font-bold text-slate-800 line-clamp-1">{tpl.name}</div>
                        <div className="text-[10px] text-slate-400">{tpl.type}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Rendered Card Visual Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Live Card Preview
                </label>
                <div
                  className={`rounded-2xl p-6 bg-gradient-to-r ${
                    selectedTemplate?.backgroundGradient || 'from-blue-600 via-indigo-600 to-purple-700'
                  } text-white shadow-md relative overflow-hidden text-center`}
                >
                  <div className="absolute top-2 right-3 text-[10px] opacity-75 font-mono">
                    GREENWOOD INT. SCHOOL
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-2 animate-bounce" />
                  <h3 className="text-xl font-black uppercase tracking-wider text-yellow-200">
                    {selectedTemplate?.title || 'HAPPY BIRTHDAY'}
                  </h3>
                  <div className="text-lg font-extrabold mt-1 text-white">
                    {selectedPerson.name}
                  </div>
                  <div className="text-xs text-white/90 font-medium mt-0.5">
                    {selectedPerson.sub} · Turning {selectedPerson.age} Years Young
                  </div>
                  <p className="text-xs text-white/80 italic mt-3 max-w-md mx-auto">
                    "{customGreeting}"
                  </p>
                </div>
              </div>

              {/* Custom message */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Greeting Message
                </label>
                <textarea
                  rows={2}
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-rose-500"
                />
              </div>

              {/* Delivery Channel */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Delivery Channel
                </label>
                <div className="flex flex-wrap gap-2">
                  {['WhatsApp', 'SMS', 'Email', 'Mobile App Push'].map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setSelectedChannel(ch)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedChannel === ch
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {ch === 'WhatsApp' && <Smartphone className="w-3.5 h-3.5" />}
                      {ch === 'SMS' && <MessageSquare className="w-3.5 h-3.5" />}
                      {ch === 'Email' && <Mail className="w-3.5 h-3.5" />}
                      {ch === 'Mobile App Push' && <Sparkles className="w-3.5 h-3.5" />}
                      <span>{ch}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : `Send via ${selectedChannel}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
