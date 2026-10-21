import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Plus, List, Grid, 
  FileText, Search, Trash2, 
  CalendarDays, MapPin, Users, CheckCircle2, 
  Clock, RefreshCw, X, Tag
} from 'lucide-react';
import Swal from 'sweetalert2';
import { communicateService } from '../api/communicateService';

export default function EventsHolidays() {
  const [isAdding, setIsAdding] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    eventType: 'Event',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    audience: 'All (Entire School)',
    location: 'School Campus',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await communicateService.getEvents();
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to load events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e?.preventDefault();
    if (!newEvent.title.trim()) {
      Swal.fire('Title Required', 'Please provide a title for the event or holiday.', 'warning');
      return;
    }
    if (!newEvent.startDate || !newEvent.endDate) {
      Swal.fire('Dates Required', 'Please set the start and end dates.', 'warning');
      return;
    }

    try {
      await communicateService.createEvent(newEvent);
      Swal.fire({
        icon: 'success',
        title: `${newEvent.eventType} Added!`,
        text: 'The calendar entry has been recorded and published.',
        confirmButtonColor: '#5542f6'
      });
      setIsAdding(false);
      setNewEvent({
        title: '',
        eventType: 'Event',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        audience: 'All (Entire School)',
        location: 'School Campus',
        description: ''
      });
      fetchEvents();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteEvent = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Entry?',
      text: `Remove "${title}" from the school calendar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await communicateService.deleteEvent(id);
        setEvents(prev => prev.filter(e => e._id !== id));
        Swal.fire('Deleted!', 'Event removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete event.', 'error');
      }
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (e.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (e.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || e.eventType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, selectedType]);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Holiday':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">HOLIDAY</span>;
      case 'Seminar':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">SEMINAR / EXPO</span>;
      case 'Meeting':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">MEETING</span>;
      default:
        return <span className="bg-indigo-50 text-[#5542f6] border border-indigo-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">EVENT</span>;
    }
  };

  return (
    <div className="p-6 bg-[#f4f7fc] min-h-[calc(100vh-64px)] font-sans flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Events & School Holidays</h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-100">
              Synced Calendar
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Institutional timeline, cultural fests, sports meets, national holidays, and PTM schedules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchEvents}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 shadow-sm"
            title="Refresh Events"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] transition-all shadow-md shadow-indigo-100"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Event or Holiday
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search title, description, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#5542f6]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Holiday">Holidays</option>
              <option value="Event">Events</option>
              <option value="Seminar">Seminars / Workshops</option>
              <option value="Meeting">PTM / Meetings</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
          Total: {filteredEvents.length} items
        </span>
      </div>

      {/* Grid of Events & Holidays */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5542f6]" />
          <p className="text-xs font-medium">Loading school calendar...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <h3 className="font-bold text-sm text-gray-700">No Events or Holidays Found</h3>
          <p className="text-xs text-gray-400 mt-1">Create an entry to keep parents and staff informed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div 
              key={evt._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {getTypeBadge(evt.eventType)}
                  <span className="text-[10px] font-bold text-gray-400 flex items-center">
                    <Users className="w-3 h-3 mr-1" /> {evt.audience}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-gray-900 leading-snug">{evt.title}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{evt.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center text-gray-600 font-semibold">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#5542f6]" />
                  <span>
                    {evt.startDate ? new Date(evt.startDate).toLocaleDateString('en-GB') : '-'}
                    {evt.endDate && evt.endDate !== evt.startDate && ` → ${new Date(evt.endDate).toLocaleDateString('en-GB')}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center text-[11px]">
                    <MapPin className="w-3 h-3 mr-1 text-gray-400" /> {evt.location || 'School Campus'}
                  </span>
                  <button 
                    onClick={() => handleDeleteEvent(evt._id, evt.title)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- CREATE EVENT MODAL ----------------- */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-[#5542f6]" /> Add Calendar Event / Holiday
              </h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., Annual Sports Day 2026 / Diwali Break"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category Type</label>
                  <select 
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                  >
                    <option value="Event">School Event</option>
                    <option value="Holiday">Official Holiday</option>
                    <option value="Seminar">Seminar / Workshop</option>
                    <option value="Meeting">PTM / Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Audience</label>
                  <select 
                    value={newEvent.audience}
                    onChange={(e) => setNewEvent({ ...newEvent, audience: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                  >
                    <option value="All (Entire School)">All (Entire School)</option>
                    <option value="All Parents">All Parents</option>
                    <option value="All Staff">Faculty & Staff</option>
                    <option value="Students Only">Students Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Date *</label>
                  <input 
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">End Date *</label>
                  <input 
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Venue / Location</label>
                <input 
                  type="text" 
                  placeholder="e.g., Main Auditorium / School Ground"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Details, dress codes, or instructions..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6] resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#5542f6] text-white rounded-lg font-bold hover:bg-[#4533e4]"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
