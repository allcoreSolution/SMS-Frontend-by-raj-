import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X, 
  Clock, MapPin, Tag, CheckCircle2, Bookmark, Filter, List, Grid3X3, Trash2
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toDateKey(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

const CATEGORY_COLORS = {
  'Holiday': { bg: '#dd4b39', light: '#fde8e4', text: '#c23321' },
  'Exam': { bg: '#f39c12', light: '#fef5e7', text: '#d68100' },
  'Meeting': { bg: '#3c8dbc', light: '#e8f4f8', text: '#286090' },
  'Fee Deadline': { bg: '#00a65a', light: '#e6f7ef', text: '#00733e' },
  'Academic': { bg: '#605ca8', light: '#efedf7', text: '#4e4a88' },
  'Sports': { bg: '#00c0ef', light: '#e5f8fc', text: '#0097bc' },
  'Event': { bg: '#e83e8c', light: '#fdecf3', text: '#c2185b' },
};

const SchoolCalendar = () => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // month | list
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [selectedDateKey, setSelectedDateKey] = useState('');
  
  const [newEvent, setNewEvent] = useState({ 
    date: toDateKey(today.getFullYear(), today.getMonth(), today.getDate()), 
    title: '', 
    category: 'Meeting',
    color: '#3c8dbc',
    time: '10:00 AM',
    note: ''
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const loadEvents = async () => {
    try {
      const res = await accountantService.getCalendarEvents();
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // Build calendar cells
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const result = [];

    // prev month trailing
    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ day: daysInPrev - i, inMonth: false, dateKey: toDateKey(year, month - 1, daysInPrev - i) });
    }
    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, inMonth: true, dateKey: toDateKey(year, month, d) });
    }
    // next month leading
    const remaining = 42 - result.length;
    for (let d = 1; d <= remaining; d++) {
      result.push({ day: d, inMonth: false, dateKey: toDateKey(year, month + 1, d) });
    }
    return result;
  }, [year, month]);

  // Filter events by category
  const filteredEvents = useMemo(() => {
    if (categoryFilter === 'ALL') return events;
    return events.filter(e => e.category === categoryFilter);
  }, [events, categoryFilter]);

  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  const isToday = (dateKey) => {
    const t = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    return dateKey === t;
  };

  const handleDayClick = (dateKey, dayEvents) => {
    setSelectedDateKey(dateKey);
    setSelectedDayEvents(dayEvents || []);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.date || !newEvent.title.trim()) {
      return Swal.fire('Error', 'Date and Title are required', 'error');
    }
    try {
      const catColor = CATEGORY_COLORS[newEvent.category]?.bg || newEvent.color || '#3c8dbc';
      await accountantService.addCalendarEvent({
        ...newEvent,
        color: catColor
      });
      Swal.fire({ title: 'Event Scheduled!', icon: 'success', timer: 1200, showConfirmButton: false });
      setShowAdd(false);
      setNewEvent({ 
        date: toDateKey(today.getFullYear(), today.getMonth(), today.getDate()), 
        title: '', 
        category: 'Meeting',
        color: '#3c8dbc',
        time: '10:00 AM',
        note: ''
      });
      loadEvents();
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to add event', 'error');
    }
  };

  const handleDeleteEvent = async (id, title) => {
    const conf = await Swal.fire({ 
      title: 'Delete Event?', 
      text: `Do you want to remove "${title}" from the calendar?`,
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete'
    });
    if (conf.isConfirmed) {
      await accountantService.deleteCalendarEvent(id);
      loadEvents();
      if (selectedDayEvents) {
        setSelectedDayEvents(prev => (prev ? prev.filter(e => e.id !== id) : []));
      }
    }
  };

  const monthEvents = filteredEvents
    .filter((ev) => {
      const [y, m] = ev.date.split('-').map(Number);
      return y === year && m === month + 1;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full justify-between">
      
      {/* Top Banner Header */}
      <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-white/90" />
          <div>
            <h3 className="text-[16px] font-bold tracking-wide leading-tight">Institutional School Calendar</h3>
            <p className="text-[11px] text-white/80">Examinations, holidays, fee due dates, and academic schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNewEvent(prev => ({ ...prev, date: toDateKey(today.getFullYear(), today.getMonth(), today.getDate()) }));
              setShowAdd(true);
            }}
            className="flex items-center gap-1.5 text-[12px] font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-[3px] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Event
          </button>
        </div>
      </div>

      {/* Navigation & Controls Ribbon */}
      <div className="p-4 border-b border-gray-100 bg-[#fafafa] flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-300 rounded-[3px] overflow-hidden shadow-2xs">
            <button 
              onClick={goPrev} 
              className="p-1.5 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={goToday} 
              className="px-3 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 border-x border-gray-200 uppercase tracking-wider"
            >
              Today
            </button>
            <button 
              onClick={goNext} 
              className="p-1.5 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-[20px] font-bold text-[#333] ml-2">
            {MONTHS[month]} <span className="text-[#3c8dbc]">{year}</span>
          </h2>
        </div>

        {/* View Mode & Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-[3px] px-2.5 py-1 text-[12px] bg-white font-medium focus:outline-none focus:border-[#3c8dbc]"
          >
            <option value="ALL">All Event Categories</option>
            <option value="Holiday">Holidays</option>
            <option value="Exam">Examinations</option>
            <option value="Fee Deadline">Fee Deadlines</option>
            <option value="Meeting">Staff Meetings</option>
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
          </select>

          {/* Month / List Toggle */}
          <div className="flex bg-gray-200 p-0.5 rounded-[3px] text-[12px] font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-[2px] transition-colors ${viewMode === 'month' ? 'bg-white text-[#333] shadow-xs' : 'text-gray-600 hover:text-black'}`}
            >
              <Grid3X3 className="w-3.5 h-3.5" /> Month Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-[2px] transition-colors ${viewMode === 'list' ? 'bg-white text-[#333] shadow-xs' : 'text-gray-600 hover:text-black'}`}
            >
              <List className="w-3.5 h-3.5" /> Schedule List
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-4 bg-white flex-1 flex flex-col justify-between">
        {viewMode === 'month' ? (
          <div className="border border-gray-200 rounded-[3px] overflow-x-auto">
            <div className="min-w-[540px]">
              {/* Day Name Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 bg-[#f8f9fa] text-[11px] font-bold text-gray-600 py-1.5 text-center uppercase tracking-wider">
                {DAYS.map((d, i) => (
                  <div key={d} className={i === 0 ? 'text-red-500' : ''}>{d}</div>
                ))}
              </div>

              {/* Month Grid Cells (Medium Compact Size) */}
              <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 border-b border-gray-100">
                {cells.map((cell, idx) => {
                  const dayEvents = eventsByDate[cell.dateKey] || [];
                  const todayCell = isToday(cell.dateKey);

                  return (
                    <div
                      key={idx}
                      onClick={() => handleDayClick(cell.dateKey, dayEvents)}
                      className={`min-h-[58px] sm:min-h-[64px] p-1 flex flex-col justify-between transition-colors cursor-pointer group ${
                        cell.inMonth ? 'bg-white hover:bg-blue-50/40' : 'bg-gray-50/60 text-gray-400'
                      } ${todayCell ? 'ring-2 ring-inset ring-[#007bff]/50 bg-blue-50/30' : ''}`}
                    >
                      {/* Top Day Number Row */}
                      <div className="flex justify-between items-center">
                        {dayEvents.length > 0 ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3c8dbc]" />
                        ) : <span />}

                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                            todayCell 
                              ? 'bg-[#007bff] text-white shadow-xs' 
                              : cell.inMonth ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          {cell.day}
                        </span>
                      </div>

                      {/* Event Badges List */}
                      <div className="space-y-0.5 mt-0.5">
                        {dayEvents.slice(0, 1).map((ev) => (
                          <div
                            key={ev.id}
                            title={`${ev.title} (${ev.time || 'All Day'})`}
                            className="text-left text-[9.5px] font-semibold text-white rounded px-1 py-0.2 truncate shadow-2xs flex items-center justify-between leading-tight"
                            style={{ backgroundColor: ev.color || '#3c8dbc' }}
                          >
                            <span className="truncate">{ev.title}</span>
                          </div>
                        ))}

                        {dayEvents.length > 1 && (
                          <span className="text-[9px] text-[#3c8dbc] font-bold block text-left pl-0.5">
                            +{dayEvents.length - 1} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* List Mode */
          <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-[3px]">
            {monthEvents.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#3c8dbc]" />
                <p className="font-semibold text-gray-600">No scheduled events for {MONTHS[month]} {year}</p>
                <p className="text-xs text-gray-400 mt-1">Click "Schedule Event" above to create an event.</p>
              </div>
            ) : (
              monthEvents.map((ev) => {
                const conf = CATEGORY_COLORS[ev.category] || { bg: ev.color || '#3c8dbc', text: '#3c8dbc', light: '#f0f4f8' };
                return (
                  <div key={ev.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-[3px] flex flex-col items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: conf.bg }}
                      >
                        <span className="text-[10px] uppercase font-bold leading-none">{ev.date.slice(5, 7)}</span>
                        <span className="text-[15px] font-bold leading-none mt-0.5">{ev.date.slice(8, 10)}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[14px] text-gray-800">{ev.title}</h4>
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                            style={{ backgroundColor: conf.light, color: conf.text }}
                          >
                            {ev.category || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time || 'Full Day'}</span>
                          <span>•</span>
                          <span>{ev.date}</span>
                          {ev.note && <><span>•</span><span>{ev.note}</span></>}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Remove Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Legend Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-600">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00a65a]" /> Fee Deadlines
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f39c12]" /> Exams
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dd4b39]" /> Holidays
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3c8dbc]" /> Meetings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#605ca8]" /> Academic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c0ef]" /> Sports
            </span>
          </div>

          <div className="text-gray-400 font-normal">
            Total {events.length} active events on school file
          </div>
        </div>
      </div>

      {/* ── SCHEDULE EVENT MODAL ────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <h3 className="font-bold text-[#333] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#3c8dbc]" /> Schedule School Calendar Event
              </h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">Event Title / Purpose *</label>
                <input 
                  required 
                  type="text" 
                  value={newEvent.title} 
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g. Term 2 Fee Payment Due Date" 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1">Event Category *</label>
                  <select 
                    value={newEvent.category} 
                    onChange={e => {
                      const cat = e.target.value;
                      setNewEvent({ ...newEvent, category: cat, color: CATEGORY_COLORS[cat]?.bg || '#3c8dbc' });
                    }}
                    className="w-full border border-gray-300 rounded-[3px] px-2.5 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] bg-white"
                  >
                    <option value="Fee Deadline">Fee Deadline</option>
                    <option value="Exam">Exam / Academic</option>
                    <option value="Holiday">School Holiday</option>
                    <option value="Meeting">Staff Meeting</option>
                    <option value="Academic">Academic Event</option>
                    <option value="Sports">Sports Trials</option>
                    <option value="Event">Cultural Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-700 mb-1">Time</label>
                  <input 
                    type="text" 
                    value={newEvent.time} 
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    placeholder="e.g. 10:00 AM or Full Day" 
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">Scheduled Date *</label>
                <input 
                  required 
                  type="date" 
                  value={newEvent.date} 
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">Notes / Description</label>
                <textarea 
                  rows="2"
                  value={newEvent.note} 
                  onChange={e => setNewEvent({...newEvent, note: e.target.value})}
                  placeholder="Optional details, target students/classes..." 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#3c8dbc] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#367fa9] flex-1 shadow-sm"
                >
                  Save Calendar Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DAY DETAILS MODAL (When clicking a date) ───── */}
      {selectedDayEvents !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <div>
                <h3 className="font-bold text-[#333] text-[15px]">Events on {selectedDateKey}</h3>
                <p className="text-[11px] text-gray-500">{selectedDayEvents.length} scheduled item(s)</p>
              </div>
              <button onClick={() => setSelectedDayEvents(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <div className="p-5 max-h-[300px] overflow-y-auto space-y-3">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <p className="text-xs">No events scheduled for this date.</p>
                </div>
              ) : (
                selectedDayEvents.map(ev => (
                  <div key={ev.id} className="p-3 rounded border border-gray-100 bg-gray-50/70 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ev.color || '#3c8dbc' }} />
                        <h4 className="font-bold text-gray-800 text-[13px]">{ev.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 pl-4.5">
                        Category: <span className="font-semibold">{ev.category || 'General'}</span> • Time: {ev.time || 'All Day'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <button
                onClick={() => {
                  setNewEvent({
                    date: selectedDateKey,
                    title: '',
                    category: 'Meeting',
                    color: '#3c8dbc',
                    time: '10:00 AM',
                    note: ''
                  });
                  setSelectedDayEvents(null);
                  setShowAdd(true);
                }}
                className="text-[12px] font-semibold text-[#3c8dbc] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Event for {selectedDateKey}
              </button>
              <button 
                onClick={() => setSelectedDayEvents(null)} 
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SchoolCalendar;
