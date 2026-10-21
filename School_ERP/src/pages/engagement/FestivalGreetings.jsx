import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  Calendar,
  Plus,
  Settings2,
  AlertTriangle,
  Send,
  Trash2,
  Sparkles,
  CheckCircle2,
  Users,
  Image as ImageIcon,
  Clock,
  Eye,
  Edit3,
  Search,
  Filter,
  X,
  Smartphone,
  MessageSquare,
  Mail,
  Palette,
  Check,
  LayoutGrid,
  List
} from 'lucide-react';
import Swal from 'sweetalert2';
import engagementService from '../../api/engagementService';
import EngagementTabs from './EngagementTabs';

export default function FestivalGreetings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [festivals, setFestivals] = useState([]);
  const [creatives, setCreatives] = useState([]);
  const [settings, setSettings] = useState({});

  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('All'); // 'All', 'National', 'Regional', 'School Event'

  // Add custom day form state
  const [customDay, setCustomDay] = useState({
    name: '',
    date: new Date().toISOString().slice(0, 10),
    region: 'ALL',
    greetingLine: 'Wishing all our students, faculty and families a joyful, safe and blessed celebration.',
    cardTemplateName: 'Festive Gold (Festival)',
    targetAudience: 'All Users',
    autoSend: true
  });
  const [savingDay, setSavingDay] = useState(false);

  // Send greeting modal state
  const [sendingFest, setSendingFest] = useState(null);
  const [customWish, setCustomWish] = useState('');
  const [audience, setAudience] = useState('All Users');
  const [selectedChannels, setSelectedChannels] = useState(['WhatsApp', 'Mobile App Push']);
  const [isSending, setIsSending] = useState(false);

  // Preview card banner modal state
  const [previewFest, setPreviewFest] = useState(null);

  // Edit festival modal state
  const [editingFest, setEditingFest] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    date: '',
    region: 'ALL',
    greetingLine: '',
    cardTemplateName: '',
    targetAudience: 'All Users',
    autoSend: true
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Fetch all festivals, creatives & settings
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [festRes, creativesRes, settingsRes] = await Promise.all([
        engagementService.getFestivals(),
        engagementService.getCreatives({ type: 'Festival' }),
        engagementService.getSettings()
      ]);

      if (festRes?.success) setFestivals(festRes.data || []);
      if (creativesRes?.success) setCreatives(creativesRes.data || []);
      if (settingsRes?.success) setSettings(settingsRes.data || {});
    } catch (err) {
      console.error('Error loading festival greetings data:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to load festival greetings from server.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Find next upcoming festival
  const nextFestival = useMemo(() => {
    const upcoming = festivals.filter((f) => f.diffDays >= 0);
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [festivals]);

  // Filtered festivals list
  const filteredFestivals = useMemo(() => {
    return festivals.filter((fest) => {
      const matchSearch =
        !searchTerm ||
        fest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.greetingLine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.formattedDate?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRegion =
        filterRegion === 'All' ||
        (filterRegion === 'School Event' && fest.isCustomDay) ||
        (filterRegion === 'National' && (fest.region === 'National' || fest.region === 'ALL')) ||
        (filterRegion === 'Regional' && fest.region !== 'National' && fest.region !== 'ALL');

      return matchSearch && matchRegion;
    });
  }, [festivals, searchTerm, filterRegion]);

  // Auto-send toggle per festival row
  const handleToggleAutoSend = async (fest, e) => {
    e.stopPropagation();
    const newAutoSend = !fest.autoSend;
    try {
      await engagementService.updateFestival(fest._id, { autoSend: newAutoSend });
      setFestivals((prev) =>
        prev.map((f) => (f._id === fest._id ? { ...f, autoSend: newAutoSend } : f))
      );
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Auto-send ${newAutoSend ? 'Enabled' : 'Disabled'} for ${fest.name}`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to update auto-send status', 'error');
    }
  };

  // Change Card Template for Festival
  const handleChangeTemplate = async (fest, newTemplateName) => {
    try {
      await engagementService.updateFestival(fest._id, { cardTemplateName: newTemplateName });
      setFestivals((prev) =>
        prev.map((f) => (f._id === fest._id ? { ...f, cardTemplateName: newTemplateName } : f))
      );
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Design updated to ${newTemplateName}`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to update card design', 'error');
    }
  };

  // Add Custom Day
  const handleAddCustomDay = async (e) => {
    e.preventDefault();
    if (!customDay.name.trim()) {
      Swal.fire('Required Field', 'Please enter a name for the special day.', 'warning');
      return;
    }

    setSavingDay(true);
    try {
      await engagementService.addCustomDay(customDay);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Added "${customDay.name}" to Calendar`,
        timer: 2000,
        showConfirmButton: false
      });

      setCustomDay({
        name: '',
        date: new Date().toISOString().slice(0, 10),
        region: 'ALL',
        greetingLine: 'Wishing all our students, faculty and families a joyful, safe and blessed celebration.',
        cardTemplateName: creatives[0]?.name || 'Festive Gold (Festival)',
        targetAudience: 'All Users',
        autoSend: true
      });

      fetchData(true);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Could not add custom day', 'error');
    } finally {
      setSavingDay(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (fest) => {
    setEditingFest(fest);
    setEditForm({
      name: fest.name || '',
      date: fest.date ? new Date(fest.date).toISOString().slice(0, 10) : '',
      region: fest.region || 'ALL',
      greetingLine: fest.greetingLine || '',
      cardTemplateName: fest.cardTemplateName || creatives[0]?.name || 'Festive Gold (Festival)',
      targetAudience: fest.targetAudience || 'All Users',
      autoSend: fest.autoSend !== false
    });
  };

  // Submit Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingFest) return;

    setSavingEdit(true);
    try {
      await engagementService.updateFestival(editingFest._id, editForm);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Festival details updated',
        timer: 1500,
        showConfirmButton: false
      });
      setEditingFest(null);
      fetchData(true);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Could not update festival', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Festival
  const handleDeleteFestival = (fest) => {
    Swal.fire({
      title: 'Remove Event?',
      text: `Are you sure you want to remove "${fest.name}" from the calendar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Remove'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await engagementService.deleteFestival(fest._id);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Event removed',
            timer: 1500,
            showConfirmButton: false
          });
          fetchData(true);
        } catch (err) {
          Swal.fire('Error', 'Failed to remove event', 'error');
        }
      }
    });
  };

  // Open Send Modal
  const handleOpenSend = (fest) => {
    setSendingFest(fest);
    setCustomWish(fest.greetingLine || 'Wishing peace, prosperity, and joy on this auspicious occasion.');
    setAudience(fest.targetAudience || 'All Users');
    setSelectedChannels(['WhatsApp', 'Mobile App Push']);
  };

  // Toggle delivery channel
  const handleToggleChannel = (ch) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length === 1) {
        Swal.fire('At least one channel', 'Please keep at least one channel selected for delivery.', 'info');
        return;
      }
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  // Dispatch Greeting
  const handleSendWish = async (e) => {
    e.preventDefault();
    if (!sendingFest) return;

    setIsSending(true);
    try {
      await engagementService.sendFestivalGreeting({
        festivalId: sendingFest._id,
        customGreeting: customWish,
        audience
      });

      Swal.fire({
        icon: 'success',
        title: 'Greetings Dispatched!',
        html: `Festival greetings for <strong>${sendingFest.name}</strong> delivered to <strong>${audience}</strong> via ${selectedChannels.join(', ')}.`,
        timer: 2500,
        showConfirmButton: false
      });

      setSendingFest(null);
      fetchData(true);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to dispatch greeting', 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Template lookup helper
  const getTemplateMeta = (name) => {
    return (
      creatives.find((c) => c.name === name) || {
        backgroundGradient: 'from-purple-900 via-indigo-900 to-amber-700',
        textColor: '#fef08a',
        style: 'gold-purple'
      }
    );
  };

  const autoSendGlobal = settings.festivalGreetingsEnabled !== false;

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-64px)] font-sans p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-7 h-7 text-amber-500" />
            Festival Greetings & Special Days
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automate personalized greeting cards for national festivals, cultural celebrations and institutional milestones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/engagement/creatives')}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Palette className="w-4 h-4 text-slate-500" />
            Card Designs
          </button>
          <button
            onClick={() => navigate('/engagement/auto-send-settings')}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <Settings2 className="w-4 h-4" />
            Auto-send Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <EngagementTabs
        counts={{
          festivals: festivals.length,
          creatives: creatives.length
        }}
        onRefresh={() => fetchData(false)}
        loading={loading}
      />

      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Next Upcoming Festival */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-5 text-white shadow-lg shadow-amber-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-amber-100 uppercase tracking-wider">Next Celebration</p>
              <h3 className="text-xl font-extrabold mt-1 line-clamp-1">
                {nextFestival ? nextFestival.name : 'All Celebrations Planned'}
              </h3>
              <p className="text-xs text-amber-200 mt-1 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {nextFestival ? `${nextFestival.when} (${nextFestival.formattedDate})` : 'Calendar Up to Date'}
              </p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
          {nextFestival && (
            <button
              onClick={() => handleOpenSend(nextFestival)}
              className="mt-3 w-full py-1.5 px-3 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1"
            >
              <Send className="w-3 h-3" /> Dispatch Wishes Early
            </button>
          )}
        </div>

        {/* Total Festivals in Calendar */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-5 text-white shadow-lg shadow-indigo-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-indigo-100 uppercase tracking-wider">Scheduled Festivals</p>
              <h3 className="text-3xl font-extrabold mt-1">{festivals.length}</h3>
              <p className="text-xs text-indigo-200 mt-1">National, cultural & school days</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 text-xs text-indigo-100 flex items-center gap-2">
            <span>{festivals.filter((f) => f.isCustomDay).length} Custom School Days</span>
          </div>
        </div>

        {/* Global Auto-Send Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white shadow-lg shadow-emerald-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Morning Auto-Dispatch</p>
              <h3 className="text-2xl font-extrabold mt-1 flex items-center gap-2">
                <span>{autoSendGlobal ? 'Active' : 'Paused'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                At {settings.festivalDefaultTime || '07:30 AM'} on festival days
              </p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => navigate('/engagement/auto-send-settings')}
            className="mt-3 text-xs font-semibold underline underline-offset-2 hover:text-white"
          >
            Configure delivery rules →
          </button>
        </div>

        {/* Creative Templates Count */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-5 text-white shadow-lg shadow-purple-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-purple-100 uppercase tracking-wider">Festival Designs</p>
              <h3 className="text-3xl font-extrabold mt-1">{creatives.length}</h3>
              <p className="text-xs text-purple-200 mt-1">Custom cards ready for broadcast</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Palette className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => navigate('/engagement/creatives')}
            className="mt-3 text-xs font-semibold underline underline-offset-2 hover:text-white"
          >
            Browse banner templates →
          </button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: FESTIVALS LIST + ADD CUSTOM DAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Festivals Table / Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            {/* Header & Controls */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800">
                  Festival Calendar ({filteredFestivals.length})
                </h2>
              </div>

              {/* Search, Region Filter & View Toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative min-w-[180px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search festival..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="All">All Events</option>
                  <option value="National">National Holidays</option>
                  <option value="Regional">Regional Holidays</option>
                  <option value="School Event">School Events</option>
                </select>

                <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                    }`}
                    title="Table View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Festival / Occasion</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4">Card Banner</th>
                      <th className="py-3 px-4 text-center">Auto-Send</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredFestivals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Gift className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-600">No events found matching your filter</p>
                        </td>
                      </tr>
                    ) : (
                      filteredFestivals.map((fest) => {
                        const isToday = fest.diffDays === 0;
                        const isUpcoming = fest.diffDays > 0;
                        const tplMeta = getTemplateMeta(fest.cardTemplateName);

                        return (
                          <tr
                            key={fest._id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isToday ? 'bg-amber-50/50 font-bold' : ''
                            }`}
                          >
                            {/* Festival Name */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{fest.name}</span>
                                {fest.isCustomDay && (
                                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded-md">
                                    School Day
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                                "{fest.greetingLine}"
                              </p>
                            </td>

                            {/* Date */}
                            <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                              {fest.formattedDate}
                            </td>

                            {/* When / Timeline */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                                  isToday
                                    ? 'bg-rose-100 text-rose-700 animate-pulse'
                                    : fest.diffDays <= 7
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {fest.when}
                              </span>
                            </td>

                            {/* Card Banner Dropdown & Quick Preview */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setPreviewFest(fest)}
                                  className="p-1 rounded-lg border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50 text-indigo-600 transition-all flex items-center gap-1 px-2 text-[11px] font-bold shadow-sm"
                                  title="Click to view card banner"
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>{fest.cardTemplateName || 'Festive Gold'}</span>
                                </button>
                              </div>
                            </td>

                            {/* Auto-Send Toggle */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={(e) => handleToggleAutoSend(fest, e)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                                  fest.autoSend
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                {fest.autoSend ? 'ON' : 'OFF'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenSend(fest)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-amber-500/20"
                                  title="Dispatch Greeting"
                                >
                                  <Send className="w-3 h-3" /> Send
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(fest)}
                                  className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                                  title="Edit Festival"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFestival(fest)}
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid View with Visual Banners */
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredFestivals.map((fest) => {
                  const tplMeta = getTemplateMeta(fest.cardTemplateName);
                  return (
                    <div
                      key={fest._id}
                      className="rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden bg-white hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Banner Canvas */}
                      <div
                        className={`h-36 p-4 bg-gradient-to-br ${tplMeta.backgroundGradient} text-white flex flex-col justify-between relative`}
                      >
                        <div className="flex justify-between items-start text-[10px] font-bold">
                          <span className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md">
                            {fest.formattedDate}
                          </span>
                          <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                            {fest.when}
                          </span>
                        </div>
                        <div className="text-center my-auto">
                          <div className="text-[10px] font-black tracking-widest text-yellow-300 uppercase">
                            WARM GREETINGS ON
                          </div>
                          <div className="text-base font-extrabold text-white mt-0.5 line-clamp-1">
                            {fest.name}
                          </div>
                        </div>
                        <div className="text-[10px] text-center text-white/80">
                          Greenwood International School
                        </div>
                      </div>

                      {/* Card Content & Action Bar */}
                      <div className="p-4">
                        <p className="text-xs text-slate-600 line-clamp-2 italic">
                          "{fest.greetingLine}"
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setPreviewFest(fest)}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview Banner
                          </button>
                          <button
                            onClick={() => handleOpenSend(fest)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            <Send className="w-3 h-3" /> Send Wish
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Add Your Own Day & Fast Guidelines */}
        <div className="lg:col-span-4 space-y-5">
          {/* Add Your Own Day Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-800">Add Your Own Special Day</h2>
            </div>

            <form onSubmit={handleAddCustomDay} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Occasion / Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Sports Meet / Founder's Day"
                  value={customDay.name}
                  onChange={(e) => setCustomDay({ ...customDay, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Occasion</label>
                <input
                  type="date"
                  value={customDay.date}
                  onChange={(e) => setCustomDay({ ...customDay, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Recipient Group</label>
                <select
                  value={customDay.targetAudience}
                  onChange={(e) => setCustomDay({ ...customDay, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="All Users">All School (Students, Staff & Parents)</option>
                  <option value="Students">Students Community</option>
                  <option value="Staff">Faculty & Staff</option>
                  <option value="Parents">Parents Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Banner Design</label>
                <select
                  value={customDay.cardTemplateName}
                  onChange={(e) => setCustomDay({ ...customDay, cardTemplateName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                >
                  {creatives.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Personalized Wish Line</label>
                <textarea
                  rows={2}
                  value={customDay.greetingLine}
                  onChange={(e) => setCustomDay({ ...customDay, greetingLine: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-700">Enable Morning Auto-send:</span>
                <input
                  type="checkbox"
                  checked={customDay.autoSend}
                  onChange={(e) => setCustomDay({ ...customDay, autoSend: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={savingDay}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                {savingDay ? 'Scheduling...' : 'Add to Calendar'}
              </button>
            </form>
          </div>

          {/* Guidelines box */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-5 text-white shadow-lg shadow-indigo-900/10 text-xs">
            <div className="flex items-center gap-2 text-indigo-200 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">Festival Broadcast Engine</span>
            </div>
            <p className="text-indigo-200 leading-relaxed">
              When auto-send is enabled, digital banners and custom messages are sent simultaneously via WhatsApp, SMS, and Mobile Push at your configured time on the day of the festival.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SEND GREETINGS MODAL WITH LIVE BANNER PREVIEW */}
      {sendingFest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50/40">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-800">Dispatch Festival Wishes</h2>
              </div>
              <button
                onClick={() => setSendingFest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendWish} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Dynamic Live Banner Preview */}
              <div
                className={`p-6 rounded-2xl bg-gradient-to-br ${
                  getTemplateMeta(sendingFest.cardTemplateName).backgroundGradient
                } text-white text-center shadow-md relative overflow-hidden`}
              >
                <div className="text-[10px] font-mono opacity-80 uppercase tracking-widest">
                  GREENWOOD INTERNATIONAL SCHOOL
                </div>
                <Sparkles className="w-8 h-8 text-yellow-300 mx-auto my-2 animate-bounce" />
                <div className="text-xs font-black uppercase tracking-widest text-yellow-200">
                  HAPPY CELEBRATIONS
                </div>
                <div className="text-xl font-black text-white mt-0.5">
                  {sendingFest.name}
                </div>
                <p className="text-xs text-white/90 italic mt-2 max-w-sm mx-auto">
                  "{customWish}"
                </p>
              </div>

              {/* Recipient Audience */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Group</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white"
                >
                  <option value="All Users">All Users (Students, Staff & Parents)</option>
                  <option value="Students">Students Only</option>
                  <option value="Staff">Faculty & Staff</option>
                  <option value="Parents">Parents Community</option>
                </select>
              </div>

              {/* Delivery Channels */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Delivery Channels</label>
                <div className="flex flex-wrap gap-2">
                  {['WhatsApp', 'Mobile App Push', 'SMS', 'Email'].map((ch) => {
                    const isChecked = selectedChannels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => handleToggleChannel(ch)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all ${
                          isChecked
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isChecked ? 'text-white' : 'text-slate-300'}`} />
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Wish Line */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Greeting Line
                </label>
                <textarea
                  rows={2}
                  value={customWish}
                  onChange={(e) => setCustomWish(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSendingFest(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSending ? 'Dispatching...' : `Dispatch via ${selectedChannels.join(', ')}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PREVIEW FESTIVAL BANNER MODAL */}
      {previewFest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">
                {previewFest.name} — Festival Card Banner
              </h2>
              <button
                onClick={() => setPreviewFest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* High-res rendered banner */}
              <div
                className={`rounded-2xl p-8 bg-gradient-to-br ${
                  getTemplateMeta(previewFest.cardTemplateName).backgroundGradient
                } text-white text-center shadow-xl space-y-3 relative overflow-hidden`}
              >
                <div className="text-[10px] font-mono opacity-80 uppercase tracking-widest">
                  GREENWOOD INTERNATIONAL SCHOOL
                </div>
                <Sparkles className="w-10 h-10 text-yellow-300 mx-auto animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest text-yellow-200">
                  WARMEST GREETINGS ON
                </h3>
                <div className="text-2xl font-black text-white">
                  {previewFest.name}
                </div>
                <p className="text-xs text-white/90 italic max-w-sm mx-auto">
                  "{previewFest.greetingLine}"
                </p>
                <div className="text-[11px] text-white/75 pt-3 border-t border-white/20">
                  Scheduled for {previewFest.formattedDate} · Template: {previewFest.cardTemplateName}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const festToPass = previewFest;
                    setPreviewFest(null);
                    handleOpenSend(festToPass);
                  }}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Wishes Now
                </button>
                <button
                  onClick={() => setPreviewFest(null)}
                  className="px-5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. EDIT FESTIVAL MODAL */}
      {editingFest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">Edit Festival Details</h2>
              <button
                onClick={() => setEditingFest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Festival / Event Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region</label>
                  <input
                    type="text"
                    value={editForm.region}
                    onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Design</label>
                <select
                  value={editForm.cardTemplateName}
                  onChange={(e) => setEditForm({ ...editForm, cardTemplateName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                >
                  {creatives.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Greeting Wish Line</label>
                <textarea
                  rows={2}
                  value={editForm.greetingLine}
                  onChange={(e) => setEditForm({ ...editForm, greetingLine: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFest(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {savingEdit ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
