import React, { useState, useEffect } from 'react';
import { X, UserCheck, DoorOpen, Building2, Layers, DollarSign, Calendar, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { hostelService } from '../../api/hostelService';

// ==========================================
// 1. ALLOCATE STUDENT MODAL
// ==========================================
export function AllocateStudentModal({
  isOpen,
  onClose,
  hostels = [],
  rooms = [],
  preselectedRoom = null,
  onSuccess
}) {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [studentId, setStudentId] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [bedNumber, setBedNumber] = useState('Bed 1');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch real students list
  useEffect(() => {
    if (!isOpen) return;

    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await hostelService.getStudents();
        if (res?.data) {
          setStudents(res.data);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [isOpen]);

  // Set defaults when opening modal or selecting preselectedRoom
  useEffect(() => {
    if (preselectedRoom) {
      setHostelName(preselectedRoom.hostelName);
      setRoomId(preselectedRoom._id);
      setMonthlyFee(preselectedRoom.costPerBed || '');
      const occ = preselectedRoom.occupiedCount != null ? preselectedRoom.occupiedCount : (preselectedRoom.allocatedStudents?.length || 0);
      setBedNumber(`Bed ${occ + 1}`);
    } else if (hostels.length > 0 && !hostelName) {
      setHostelName(hostels[0].hostelName);
    }
  }, [preselectedRoom, hostels, isOpen]);

  // Filter available rooms for the chosen hostel
  const availableRooms = rooms.filter((r) => {
    const isSameHostel = !hostelName || r.hostelName === hostelName;
    const occ = r.occupiedCount != null ? r.occupiedCount : (r.allocatedStudents?.length || 0);
    const cap = r.bedCapacity || 4;
    return isSameHostel && occ < cap;
  });

  // Whenever roomId changes, auto-fill monthlyFee and bed number suggestion
  const handleRoomSelect = (selectedId) => {
    setRoomId(selectedId);
    const r = rooms.find((rm) => rm._id === selectedId);
    if (r) {
      setMonthlyFee(r.costPerBed || '');
      const occ = r.occupiedCount != null ? r.occupiedCount : (r.allocatedStudents?.length || 0);
      setBedNumber(`Bed ${occ + 1}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) {
      Swal.fire({ icon: 'warning', title: 'Missing Student', text: 'Please select a student to allocate.' });
      return;
    }
    if (!roomId) {
      Swal.fire({ icon: 'warning', title: 'Missing Room', text: 'Please select an available room.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await hostelService.allocateBed({
        roomId,
        studentId,
        bedNumber,
        monthlyFee: Number(monthlyFee) || 0,
        remarks
      });

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Student Allocated!',
          text: 'Bed has been assigned successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        onSuccess?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Allocation Failed', text: res?.message || 'Failed to allocate bed.' });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Allocation Error',
        text: err?.response?.data?.message || err.message || 'Error occurred while allocating.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Allocate Student to Bed</h3>
              <p className="text-[11px] text-slate-500">Assign resident student to hostel room</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Select Student */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Select Student <span className="text-rose-500">*</span>
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
            >
              <option value="">-- Choose Resident Student --</option>
              {loadingStudents ? (
                <option disabled>Loading students from database...</option>
              ) : (
                students.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.firstName} {st.lastName || ''} ({st.admissionNo || st.aparId || 'No ID'}) - {st.class ? `${st.class} ${st.section || ''}` : 'General'}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Select Hostel */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Hostel Building <span className="text-rose-500">*</span>
            </label>
            <select
              value={hostelName}
              onChange={(e) => {
                setHostelName(e.target.value);
                setRoomId('');
              }}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
            >
              <option value="">-- Choose Hostel --</option>
              {hostels.map((h) => (
                <option key={h._id} value={h.hostelName}>
                  {h.hostelName} ({h.type} Hostel)
                </option>
              ))}
            </select>
          </div>

          {/* Select Room */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Available Room <span className="text-rose-500">*</span>
            </label>
            <select
              value={roomId}
              onChange={(e) => handleRoomSelect(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
            >
              <option value="">-- Choose Room --</option>
              {availableRooms.map((rm) => {
                const occ = rm.occupiedCount != null ? rm.occupiedCount : (rm.allocatedStudents?.length || 0);
                const cap = rm.bedCapacity || 4;
                return (
                  <option key={rm._id} value={rm._id}>
                    Room {rm.roomNumber} - {rm.roomTypeName || 'Standard'} ({cap - occ} of {cap} beds free) - ₹{rm.costPerBed}/mo
                  </option>
                );
              })}
            </select>
            {availableRooms.length === 0 && hostelName && (
              <p className="text-[11px] text-amber-600 mt-1">
                Notice: No rooms with free beds found in {hostelName}. Please add a room or select another hostel.
              </p>
            )}
          </div>

          {/* Bed Number & Monthly Fee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Bed Number / Label</label>
              <input
                type="text"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                placeholder="e.g. Bed 1, Lower Bed"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Monthly Fee (₹)</label>
              <input
                type="number"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(e.target.value)}
                placeholder="Rent amount"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Remarks / Special Notes</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Prefect quota, Medical priority, Semester 1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. ADD / EDIT ROOM MODAL
// ==========================================
export function AddEditRoomModal({
  isOpen,
  onClose,
  initialData = null,
  hostels = [],
  roomTypes = [],
  onSuccess
}) {
  const [hostelName, setHostelName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomTypeName, setRoomTypeName] = useState('');
  const [bedCapacity, setBedCapacity] = useState('4');
  const [costPerBed, setCostPerBed] = useState('3000');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setHostelName(initialData.hostelName || '');
      setRoomNumber(initialData.roomNumber || '');
      setRoomTypeName(initialData.roomTypeName || '');
      setBedCapacity(String(initialData.bedCapacity || '4'));
      setCostPerBed(String(initialData.costPerBed || '3000'));
      setDescription(initialData.description || '');
    } else {
      setHostelName(hostels[0]?.hostelName || '');
      setRoomNumber('');
      setRoomTypeName(roomTypes[0]?.roomType || 'Standard Non-AC');
      setBedCapacity('4');
      setCostPerBed(roomTypes[0]?.costPerBed ? String(roomTypes[0].costPerBed) : '3000');
      setDescription('');
    }
  }, [initialData, hostels, roomTypes, isOpen]);

  // When room type changes, auto-suggest standard fare
  const handleTypeChange = (selectedType) => {
    setRoomTypeName(selectedType);
    const rt = roomTypes.find((r) => r.roomType === selectedType);
    if (rt && rt.costPerBed) {
      setCostPerBed(String(rt.costPerBed));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hostelName.trim() || !roomNumber.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Information', text: 'Hostel and Room Number are required.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        hostelName,
        roomNumber: roomNumber.trim(),
        roomTypeName,
        bedCapacity: Number(bedCapacity) || 4,
        costPerBed: Number(costPerBed) || 3000,
        description
      };

      let res;
      if (initialData?._id) {
        res = await hostelService.updateRoom(initialData._id, payload);
      } else {
        res = await hostelService.addRoom(payload);
      }

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: initialData ? 'Room Updated!' : 'Room Created!',
          text: `Room ${roomNumber} under ${hostelName} saved successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
        onSuccess?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Operation Failed', text: res?.message || 'Failed to save room.' });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Error',
        text: err?.response?.data?.message || err.message || 'Error occurred while saving room.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                {initialData ? 'Edit Hostel Room' : 'Add New Hostel Room'}
              </h3>
              <p className="text-[11px] text-slate-500">Configure room number, type, capacity & rent</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Hostel Building */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Hostel Building <span className="text-rose-500">*</span>
            </label>
            <select
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
            >
              <option value="">-- Choose Hostel --</option>
              {hostels.map((h) => (
                <option key={h._id} value={h.hostelName}>
                  {h.hostelName} ({h.type})
                </option>
              ))}
            </select>
          </div>

          {/* Room Number & Room Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Room Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 101, 204, A-12"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Room Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={roomTypeName}
                onChange={(e) => handleTypeChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              >
                <option value="">-- Select Type --</option>
                {roomTypes.map((rt) => (
                  <option key={rt._id} value={rt.roomType}>
                    {rt.roomType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bed Capacity & Cost Per Bed */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Bed Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Cost Per Bed / Month (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={costPerBed}
                onChange={(e) => setCostPerBed(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Room Description / Amenities</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Ground floor corner room with attached balcony and garden view."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. ADD / EDIT HOSTEL BUILDING MODAL
// ==========================================
export function AddEditHostelModal({
  isOpen,
  onClose,
  initialData = null,
  onSuccess
}) {
  const [hostelName, setHostelName] = useState('');
  const [type, setType] = useState('Boys');
  const [wardenName, setWardenName] = useState('');
  const [wardenContact, setWardenContact] = useState('');
  const [intakeCapacity, setIntakeCapacity] = useState('50');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setHostelName(initialData.hostelName || '');
      setType(initialData.type || 'Boys');
      setWardenName(initialData.wardenName || '');
      setWardenContact(initialData.wardenContact || '');
      setIntakeCapacity(String(initialData.intakeCapacity || '50'));
      setAddress(initialData.address || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'Active');
    } else {
      setHostelName('');
      setType('Boys');
      setWardenName('');
      setWardenContact('');
      setIntakeCapacity('50');
      setAddress('');
      setDescription('');
      setStatus('Active');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hostelName.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Hostel Name', text: 'Please enter a name for the hostel.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        hostelName: hostelName.trim(),
        type,
        wardenName: wardenName.trim(),
        wardenContact: wardenContact.trim(),
        intakeCapacity: Number(intakeCapacity) || 50,
        address: address.trim(),
        description: description.trim(),
        status
      };

      let res;
      if (initialData?._id) {
        res = await hostelService.updateHostel(initialData._id, payload);
      } else {
        res = await hostelService.createHostel(payload);
      }

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: initialData ? 'Hostel Updated!' : 'Hostel Created!',
          text: `${hostelName} saved successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
        onSuccess?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Operation Failed', text: res?.message || 'Failed to save hostel.' });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Error',
        text: err?.response?.data?.message || err.message || 'Error occurred while saving hostel.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                {initialData ? 'Edit Hostel Building' : 'Add New Hostel Building'}
              </h3>
              <p className="text-[11px] text-slate-500">Configure residential wing, warden & capacity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Hostel Name & Type */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-bold text-slate-700 block mb-1.5">
                Hostel Building Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={hostelName}
                onChange={(e) => setHostelName(e.target.value)}
                placeholder="e.g. Tagore Boys Hostel (Block A)"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Combined">Combined</option>
              </select>
            </div>
          </div>

          {/* Warden Name & Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Warden In-Charge</label>
              <input
                type="text"
                value={wardenName}
                onChange={(e) => setWardenName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Warden Contact Phone</label>
              <input
                type="text"
                value={wardenContact}
                onChange={(e) => setWardenContact(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Intake Capacity & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Intake Bed Capacity</label>
              <input
                type="number"
                min="1"
                value={intakeCapacity}
                onChange={(e) => setIntakeCapacity(e.target.value)}
                placeholder="Total bed capacity"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Campus Location / Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. North Campus, Wing 1, Green Valley Road"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Description & Facilities</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Senior secondary residential block with reading lounge, gym, and 24/7 security."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Hostel' : 'Add Hostel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. ADD / EDIT ROOM TYPE MODAL
// ==========================================
export function AddEditRoomTypeModal({
  isOpen,
  onClose,
  initialData = null,
  onSuccess
}) {
  const [roomType, setRoomType] = useState('');
  const [costPerBed, setCostPerBed] = useState('3000');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRoomType(initialData.roomType || '');
      setCostPerBed(String(initialData.costPerBed || '3000'));
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'Active');
    } else {
      setRoomType('');
      setCostPerBed('3000');
      setDescription('');
      setStatus('Active');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomType.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Room Type', text: 'Please enter room type name.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        roomType: roomType.trim(),
        costPerBed: Number(costPerBed) || 3000,
        description: description.trim(),
        status
      };

      let res;
      if (initialData?._id) {
        res = await hostelService.updateRoomType(initialData._id, payload);
      } else {
        res = await hostelService.createRoomType(payload);
      }

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: initialData ? 'Room Type Updated!' : 'Room Type Created!',
          text: `${roomType} saved successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
        onSuccess?.();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Operation Failed', text: res?.message || 'Failed to save room type.' });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Error',
        text: err?.response?.data?.message || err.message || 'Error occurred while saving room type.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                {initialData ? 'Edit Room Type' : 'Add New Room Type'}
              </h3>
              <p className="text-[11px] text-slate-500">Configure classification, standard tariff & amenities</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Room Type Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Room Type Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              placeholder="e.g. Deluxe AC (2-Bed), Executive Single"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Standard Monthly Fare & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Standard Fare Per Bed / Month (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={costPerBed}
                onChange={(e) => setCostPerBed(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description & Amenities */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Amenities & Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Attached washroom, Split AC, individual wardrobe, study table and chair with Wi-Fi."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Type' : 'Add Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
