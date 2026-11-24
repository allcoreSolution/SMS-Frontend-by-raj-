import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Search, 
  ShieldAlert, 
  User, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  X,
  MessageCircle,
  Bus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { driverService } from '../api/driverService';
import { getDriverPhoto } from '../utils/photoHelper';
import Swal from 'sweetalert2';

export default function Contacts() {
  const { driver, vehicle } = useAuth();
  const driverPhoto = getDriverPhoto(driver);
  const driverName = driver?.name || 'Driver';
  const driverMobile = driver?.mobile || '';
  const emergencyContact = driver?.emergency || '112';
  const busNo = vehicle?.vehicleNumber || driver?.assignedBus || 'Unassigned';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMessageModal, setActiveMessageModal] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await driverService.getStudentsRoster();
        if (res.success && Array.isArray(res.data)) {
          setParents(res.data.map((s, idx) => ({
            id: s._id || `p-${idx}`,
            initial: (s.studentName || 'S').charAt(0).toUpperCase(),
            studentName: s.studentName,
            classGrade: s.className || 'Student',
            parentName: s.fatherName || s.parentName || s.guardianName || 'Parent / Guardian',
            stopName: s.stopName || 'Designated Stop',
            mobile: s.emergencyContact || s.fatherMobile || s.mobile || ''
          })));
        }
      } catch (err) {
        console.warn('Could not load student roster contacts:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const speedDialContacts = [
    {
      id: 'em-1',
      name: 'Transport Desk',
      fullName: 'School Transport Office',
      role: 'Fleet Manager',
      fullRole: 'Transport Dispatch & Control',
      phone: driverMobile || '+91 98765 43210',
      bgColor: 'bg-orange-50 dark:bg-orange-950/60',
      textColor: 'text-[#ea580c]'
    },
    {
      id: 'em-2',
      name: 'School SOS',
      fullName: 'Central Security Desk',
      role: 'Admin & SOS',
      fullRole: 'Admin & Emergency Dispatch',
      phone: emergencyContact,
      bgColor: 'bg-rose-50 dark:bg-rose-950/60',
      textColor: 'text-rose-600'
    },
    {
      id: 'em-3',
      name: 'Depot Workshop',
      fullName: 'Depot Fleet Workshop',
      role: 'Maintenance',
      fullRole: 'Fleet Mechanic & Recovery',
      phone: '1800-FLEET-CARE',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      textColor: 'text-blue-600'
    },
    {
      id: 'em-4',
      name: 'Highway Patrol',
      fullName: 'Police / Highway Emergency',
      role: 'Emergency',
      fullRole: 'National Emergency Response',
      phone: '112',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      textColor: 'text-emerald-600'
    }
  ];

  const filteredParents = parents.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.parentName.toLowerCase().includes(q) ||
      p.stopName.toLowerCase().includes(q) ||
      p.classGrade.toLowerCase().includes(q)
    );
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Message Sent to Guardian',
      text: `Notification dispatched to ${activeMessageModal.parentName} (${activeMessageModal.studentName}).`,
      timer: 1800,
      showConfirmButton: false
    });
    setActiveMessageModal(null);
    setMessageText('');
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-4 w-full max-w-4xl mx-auto">
      
      {/* ===================== 1. HEADER ===================== */}
      <div className="pt-1">
        <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
          Route Contacts & Emergency
        </h1>
      </div>

      {/* ===================== MY DRIVER IDENTITY CARD ===================== */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-4 text-white shadow-md shadow-orange-500/20 relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl border-2 border-white/80 p-0.5 bg-white/20 shrink-0 overflow-hidden shadow-sm">
            {driverPhoto ? (
              <img src={driverPhoto} alt={driverName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                {driverName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-base truncate leading-tight">{driverName}</h2>
              <span className="text-[10px] bg-white text-orange-700 font-black px-2 py-0.5 rounded-full uppercase">Self</span>
            </div>
            <p className="text-white/90 text-xs font-semibold mt-0.5">Assigned Bus: {busNo} • {driver?.driverId || 'DRV-101'}</p>
            <div className="flex items-center gap-3 text-[11px] text-white/80 font-mono mt-1">
              <span>Mobile: {driverMobile}</span>
              <span>•</span>
              <span>Emergency: {emergencyContact}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 2. EMERGENCY SPEED DIAL (2x2 GRID) ===================== */}
      <section className="space-y-2.5">
        <h2 className="font-serif font-black text-base sm:text-lg text-slate-900 dark:text-white">
          Emergency Speed Dial
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {speedDialContacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone}`}
              className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-slate-700 transition-all flex items-center gap-3 active:scale-95"
            >
              {/* Circular Icon Container */}
              <div className={`w-11 h-11 rounded-full ${contact.bgColor} ${contact.textColor} flex items-center justify-center shrink-0`}>
                <Phone className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="font-serif font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {contact.name}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {contact.role}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===================== 3. ROUTE PARENTS DIRECTORY (6) ===================== */}
      <section className="space-y-3">
        
        <h2 className="font-serif font-black text-base sm:text-lg text-slate-900 dark:text-white">
          Route 12 Parents Directory ({filteredParents.length})
        </h2>

        {/* Pill Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-orange-500 stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, parent name or stop loc..."
            className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
        </div>

        {/* List of Student / Parent Cards */}
        <div className="space-y-3">
          {filteredParents.map((parent) => (
            <div
              key={parent.id}
              className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Circular Initial Avatar */}
                <div className="w-11 h-11 rounded-full bg-[#ffedd5] dark:bg-orange-950/60 text-[#ea580c] font-serif font-black text-base flex items-center justify-center shrink-0">
                  {parent.initial}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {parent.studentName}
                    </h3>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {parent.classGrade}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate">
                    Parent: {parent.parentName}
                  </p>
                  <p className="text-[#ea580c] font-semibold text-xs mt-0.5 truncate">
                    Stop: {parent.stopName}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Phone & Message */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Call Button */}
                <a
                  href={`tel:${parent.mobile}`}
                  className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm"
                  title={`Call ${parent.parentName}`}
                >
                  <Phone className="w-4 h-4 stroke-[2.2]" />
                </a>

                {/* Message Button */}
                <button
                  onClick={() => {
                    setActiveMessageModal(parent);
                    setMessageText(`Dear ${parent.parentName}, ${busNo} is approaching ${parent.stopName}. Please be ready for student pickup.`);
                  }}
                  className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer"
                  title={`Message ${parent.parentName}`}
                >
                  <MessageSquare className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </div>
          ))}

          {filteredParents.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-400 text-xs">
              No contacts found matching "{searchQuery}"
            </div>
          )}
        </div>

      </section>

      {/* ===================== SEND DIRECT NOTICE MODAL ===================== */}
      {activeMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-900 dark:text-white">
                    Send Guardian SMS Alert
                  </h3>
                  <p className="text-[11px] text-slate-400">{activeMessageModal.parentName} ({activeMessageModal.studentName})</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveMessageModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quick Broadcast Message:
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMessageModal(null)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
                >
                  Dispatch SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
