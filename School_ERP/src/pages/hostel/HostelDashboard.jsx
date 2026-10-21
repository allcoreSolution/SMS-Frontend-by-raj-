import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { hostelService } from '../../api/hostelService';
import HostelTabs from './HostelTabs';
import HostelOverviewTab from './HostelOverviewTab';
import StudentAllocationTab from './StudentAllocationTab';
import ManageRoomsTab from './ManageRoomsTab';
import RoomTypesTab from './RoomTypesTab';
import ManageHostelsTab from './ManageHostelsTab';
import {
  AllocateStudentModal,
  AddEditRoomModal,
  AddEditHostelModal,
  AddEditRoomTypeModal
} from './HostelModals';

export default function HostelDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data states
  const [stats, setStats] = useState({});
  const [hostels, setHostels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedRoomForAllocation, setSelectedRoomForAllocation] = useState(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);

  // Fetch all live data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, hostelsRes, roomTypesRes, roomsRes, allocRes] = await Promise.all([
        hostelService.getStats().catch(() => ({ data: {} })),
        hostelService.getHostels().catch(() => ({ data: [] })),
        hostelService.getRoomTypes().catch(() => ({ data: [] })),
        hostelService.getRooms().catch(() => ({ data: [] })),
        hostelService.getAllocations().catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (hostelsRes?.data) setHostels(hostelsRes.data);
      if (roomTypesRes?.data) setRoomTypes(roomTypesRes.data);
      if (roomsRes?.data) setRooms(roomsRes.data);
      if (allocRes?.data) setAllocations(allocRes.data);
    } catch (err) {
      console.error('Failed to load hostel data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Determine current active subroute
  const pathname = location.pathname.toLowerCase().replace(/\/$/, '');

  // 1. Deallocate / Vacate Handler
  const handleDeallocate = async (allocation) => {
    const studentName = allocation.studentName || 'Student';
    const roomNo = allocation.roomNumber || 'Room';

    const result = await Swal.fire({
      title: 'Vacate Bed?',
      html: `Are you sure you want to de-allocate <b>${studentName}</b> from <b>Room ${roomNo}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Vacate Bed',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await hostelService.deallocateBed({
          allocationId: allocation._id,
          roomId: allocation.room?._id || allocation.room,
          studentId: allocation.student?._id || allocation.student
        });

        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Bed Vacated',
            text: `${studentName} has been checked out successfully.`,
            timer: 1800,
            showConfirmButton: false
          });
          fetchData();
        } else {
          Swal.fire({ icon: 'error', title: 'Action Failed', text: res?.message || 'Could not vacate bed.' });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.response?.data?.message || err.message || 'Error vacating bed.'
        });
      }
    }
  };

  // 2. Direct student deallocation from room card
  const handleDeallocateFromRoom = async (room, student) => {
    const sId = student._id || student;
    const sName = student.firstName ? `${student.firstName} ${student.lastName || ''}` : 'Resident';

    const result = await Swal.fire({
      title: 'Checkout Resident?',
      html: `Vacate <b>${sName}</b> from <b>Room ${room.roomNumber}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Checkout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await hostelService.deallocateBed({
          roomId: room._id,
          studentId: sId
        });

        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Checked Out',
            text: `${sName} deallocated successfully.`,
            timer: 1800,
            showConfirmButton: false
          });
          fetchData();
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: res?.message || 'Failed to checkout resident.' });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.response?.data?.message || err.message || 'Error checking out resident.'
        });
      }
    }
  };

  // 3. Delete Allocation Record
  const handleDeleteAllocation = async (allocation) => {
    const result = await Swal.fire({
      title: 'Delete Allocation Record?',
      text: 'This will remove the allocation history record permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await hostelService.deleteAllocation(allocation._id);
        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Record Deleted',
            timer: 1800,
            showConfirmButton: false
          });
          fetchData();
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.message || 'Failed to delete record.' });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.response?.data?.message || err.message || 'Error deleting allocation.'
        });
      }
    }
  };

  // 4. Delete Room
  const handleDeleteRoom = async (room) => {
    const occ = room.occupiedCount != null ? room.occupiedCount : (room.allocatedStudents?.length || 0);
    if (occ > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Delete Room',
        text: `Room ${room.roomNumber} has ${occ} active student resident(s). Please vacate all beds first.`
      });
      return;
    }

    const result = await Swal.fire({
      title: `Delete Room ${room.roomNumber}?`,
      text: `Are you sure you want to delete Room ${room.roomNumber} under ${room.hostelName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Room',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await hostelService.deleteRoom(room._id);
        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Room Deleted',
            timer: 1800,
            showConfirmButton: false
          });
          fetchData();
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.message || 'Failed to delete room.' });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.response?.data?.message || err.message || 'Error deleting room.'
        });
      }
    }
  };

  // 5. Delete Hostel
  const handleDeleteHostel = async (hostel) => {
    const result = await Swal.fire({
      title: `Delete ${hostel.hostelName}?`,
      text: 'This will remove this hostel building if no rooms are attached.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Hostel',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await hostelService.deleteHostel(hostel._id);
        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Hostel Deleted',
            timer: 1800,
            showConfirmButton: false
          });
          fetchData();
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.message || 'Failed to delete hostel.' });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.response?.data?.message || err.message || 'Error deleting hostel.'
        });
      }
    }
  };

  // 6. Delete Room Type
  const handleDeleteRoomType = async (rt) => {
    const result = await Swal.fire({
      title: `Delete ${rt.roomType}?`,
      text: 'Are you sure you want to remove this room type category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Type',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await hostelService.deleteRoomType(rt._id);
        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Room Type Deleted',
            timer: 1800,
            showConfirmButton: false
          });
          fetchData();
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.message || 'Failed to delete room type.' });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.response?.data?.message || err.message || 'Error deleting room type.'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Top Navigation Tabs */}
      <HostelTabs
        counts={{
          allocations: allocations.filter((a) => a.status === 'Allocated').length,
          rooms: rooms.length,
          roomTypes: roomTypes.length,
          hostels: hostels.length
        }}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Render Current Tab Component */}
      {(pathname === '/hostel' || pathname === '/hostel/dashboard') && (
        <HostelOverviewTab
          stats={stats}
          rooms={rooms}
          hostels={hostels}
          onOpenAllocate={() => {
            setSelectedRoomForAllocation(null);
            setIsAllocateModalOpen(true);
          }}
          onOpenAddRoom={() => {
            setEditingRoom(null);
            setIsRoomModalOpen(true);
          }}
          onOpenAddHostel={() => {
            setEditingHostel(null);
            setIsHostelModalOpen(true);
          }}
          onOpenAddRoomType={() => {
            setEditingRoomType(null);
            setIsRoomTypeModalOpen(true);
          }}
          onDeallocate={handleDeallocate}
        />
      )}

      {pathname === '/hostel/student-allocation' && (
        <StudentAllocationTab
          allocations={allocations}
          hostels={hostels}
          onOpenAllocate={() => {
            setSelectedRoomForAllocation(null);
            setIsAllocateModalOpen(true);
          }}
          onDeallocate={handleDeallocate}
          onDeleteAllocation={handleDeleteAllocation}
          loading={loading}
        />
      )}

      {pathname === '/hostel/manage-rooms' && (
        <ManageRoomsTab
          rooms={rooms}
          hostels={hostels}
          roomTypes={roomTypes}
          onOpenAddRoom={() => {
            setEditingRoom(null);
            setIsRoomModalOpen(true);
          }}
          onOpenEditRoom={(room) => {
            setEditingRoom(room);
            setIsRoomModalOpen(true);
          }}
          onDeleteRoom={handleDeleteRoom}
          onOpenAllocateForRoom={(room) => {
            setSelectedRoomForAllocation(room);
            setIsAllocateModalOpen(true);
          }}
          onDeallocateStudent={handleDeallocateFromRoom}
          loading={loading}
        />
      )}

      {pathname === '/hostel/room-types' && (
        <RoomTypesTab
          roomTypes={roomTypes}
          onOpenAddType={() => {
            setEditingRoomType(null);
            setIsRoomTypeModalOpen(true);
          }}
          onOpenEditType={(rt) => {
            setEditingRoomType(rt);
            setIsRoomTypeModalOpen(true);
          }}
          onDeleteType={handleDeleteRoomType}
          loading={loading}
        />
      )}

      {pathname === '/hostel/manage-hostels' && (
        <ManageHostelsTab
          hostels={hostels}
          onOpenAddHostel={() => {
            setEditingHostel(null);
            setIsHostelModalOpen(true);
          }}
          onOpenEditHostel={(h) => {
            setEditingHostel(h);
            setIsHostelModalOpen(true);
          }}
          onDeleteHostel={handleDeleteHostel}
          loading={loading}
        />
      )}

      {/* MODALS */}
      <AllocateStudentModal
        isOpen={isAllocateModalOpen}
        onClose={() => {
          setIsAllocateModalOpen(false);
          setSelectedRoomForAllocation(null);
        }}
        hostels={hostels}
        rooms={rooms}
        preselectedRoom={selectedRoomForAllocation}
        onSuccess={fetchData}
      />

      <AddEditRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setEditingRoom(null);
        }}
        initialData={editingRoom}
        hostels={hostels}
        roomTypes={roomTypes}
        onSuccess={fetchData}
      />

      <AddEditHostelModal
        isOpen={isHostelModalOpen}
        onClose={() => {
          setIsHostelModalOpen(false);
          setEditingHostel(null);
        }}
        initialData={editingHostel}
        onSuccess={fetchData}
      />

      <AddEditRoomTypeModal
        isOpen={isRoomTypeModalOpen}
        onClose={() => {
          setIsRoomTypeModalOpen(false);
          setEditingRoomType(null);
        }}
        initialData={editingRoomType}
        onSuccess={fetchData}
      />
    </div>
  );
}
