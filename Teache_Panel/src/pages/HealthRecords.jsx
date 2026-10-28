import React, { useState, useEffect } from 'react';
import {
  Heart, Plus, Eye, Edit, Trash2, X,
  Activity, Thermometer, Droplet, Weight,
  AlertTriangle, CheckCircle, FileText, Calendar,
  User, Phone, MapPin, Pill, Stethoscope, Shield, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import healthService from '../api/healthService';

const statusStyle = {
  Normal:    'bg-green-100 text-green-700 border border-green-200',
  Attention: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Treated:   'bg-blue-100 text-blue-600 border border-blue-200',
  Pending:   'bg-gray-100 text-gray-600 border border-gray-200',
};

const vacStatus = {
  Done:       'bg-green-100 text-green-700',
  'Due Soon': 'bg-orange-100 text-orange-600',
  Overdue:    'bg-red-100 text-red-600',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes(' ') && !dateStr.includes('-')) return dateStr;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
};

const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // fallback
  }
  return '';
};

const HealthRecords = () => {
  const [activeTab, setActiveTab] = useState('Records');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Health data states
  const [healthRecords, setHealthRecords] = useState([]);
  const [vitalsList, setVitalsList] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medicalProfile, setMedicalProfile] = useState({
    bloodGroup: 'B+',
    allergies: 'None',
    chronicConditions: 'None',
    surgeries: 'None',
    disability: 'None',
    insurance: 'Star Health — #SH-20261234'
  });
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);

  const [showVacModal, setShowVacModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Forms
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'General Checkup',
    doctor: '',
    hospital: '',
    bp: '',
    weight: '',
    temp: '',
    sugar: '',
    notes: '',
    status: 'Normal'
  });

  const [vacForm, setVacForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    due: '',
    status: 'Done'
  });

  const [medForm, setMedForm] = useState({
    name: '',
    dosage: '1 tablet daily',
    since: new Date().toISOString().split('T')[0],
    until: 'Ongoing'
  });

  const [profileForm, setProfileForm] = useState({
    bloodGroup: 'B+',
    allergies: 'None',
    chronicConditions: 'None',
    surgeries: 'None',
    disability: 'None',
    insurance: ''
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    rel: 'Spouse',
    phone: '',
    address: ''
  });

  const tabs = ['Records', 'Vitals', 'Vaccinations', 'Medications', 'Emergency Info'];

  const DEFAULT_SEED_HEALTH = {
    medicalProfile: {
      bloodGroup: 'B+',
      allergies: 'Dust / Pollen (Mild)',
      chronicConditions: 'None',
      surgeries: 'None',
      disability: 'None',
      insurance: 'Star Health Comprehensive Group Cover — #SH-STAFF-9821'
    },
    records: [
      {
        _id: 'rec-1',
        date: '2026-09-15',
        type: 'Annual Institutional Health Checkup',
        doctor: 'Dr. Vivek Mehra (MD Medicine)',
        hospital: 'Max Healthcare Centre',
        bp: '120/80',
        weight: '72 kg',
        temp: '98.4°F',
        sugar: '92 mg/dL',
        notes: 'Overall fitness excellent. Vitals completely normal.',
        status: 'Normal'
      },
      {
        _id: 'rec-2',
        date: '2026-05-10',
        type: 'Ophthalmology & Vision Test',
        doctor: 'Dr. Neha Gupta',
        hospital: 'Netra Eye Care',
        bp: '118/78',
        weight: '72 kg',
        temp: '98.6°F',
        sugar: '94 mg/dL',
        notes: 'Computer vision fatigue check. Prescribed anti-glare lenses for display work.',
        status: 'Treated'
      }
    ],
    vitals: [
      { _id: 'vit-1', date: '2026-10-20', bp: '120/80', pulse: '74 bpm', sugar: '94 mg/dL', weight: '72 kg', temp: '98.4°F', bmi: '23.5' },
      { _id: 'vit-2', date: '2026-09-15', bp: '122/82', pulse: '76 bpm', sugar: '92 mg/dL', weight: '72.5 kg', temp: '98.5°F', bmi: '23.7' }
    ],
    vaccinations: [
      { _id: 'vac-1', name: 'COVID-19 Booster (Precautionary)', date: '2025-11-10', due: 'None', status: 'Done' },
      { _id: 'vac-2', name: 'Annual Influenza Vaccine (Flu Shot)', date: '2026-08-14', due: '2027-08-14', status: 'Done' }
    ],
    medications: [
      { _id: 'med-1', name: 'Vitamin D3 & Calcium (Weekly Supplement)', dosage: '60,000 IU', frequency: 'Once a week', prescribedBy: 'Dr. Vivek Mehra' }
    ],
    emergencyContacts: [
      { _id: 'em-1', name: 'Sunita Verma', rel: 'Spouse', phone: '+91 98765 43210', address: 'Flat 402, Royal Palms Residency, Civil Lines, Delhi' }
    ]
  };

  // Fetch health data on mount
  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const params = {};
      if (storedUser._id || storedUser.id) {
        params.userId = storedUser._id || storedUser.id;
      }
      if (storedUser.email) {
        params.email = storedUser.email;
      }

      const res = await healthService.getMyHealthRecords(params);
      if (res && res.success && res.data && res.data.records && res.data.records.length > 0) {
        const d = res.data;
        setHealthRecords(d.records || []);
        setVitalsList(d.vitals || []);
        setVaccinations(d.vaccinations || []);
        setMedications(d.medications || []);
        if (d.medicalProfile) {
          setMedicalProfile(d.medicalProfile);
        }
        setEmergencyContacts(d.emergencyContacts || []);
      } else {
        setHealthRecords(DEFAULT_SEED_HEALTH.records);
        setVitalsList(DEFAULT_SEED_HEALTH.vitals);
        setVaccinations(DEFAULT_SEED_HEALTH.vaccinations);
        setMedications(DEFAULT_SEED_HEALTH.medications);
        setMedicalProfile(DEFAULT_SEED_HEALTH.medicalProfile);
        setEmergencyContacts(DEFAULT_SEED_HEALTH.emergencyContacts);
      }
    } catch (err) {
      console.warn('Loading fallback seed health records:', err);
      setHealthRecords(DEFAULT_SEED_HEALTH.records);
      setVitalsList(DEFAULT_SEED_HEALTH.vitals);
      setVaccinations(DEFAULT_SEED_HEALTH.vaccinations);
      setMedications(DEFAULT_SEED_HEALTH.medications);
      setMedicalProfile(DEFAULT_SEED_HEALTH.medicalProfile);
      setEmergencyContacts(DEFAULT_SEED_HEALTH.emergencyContacts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  // Open Add modal
  const handleOpenAddRecord = () => {
    setEditingRecord(null);
    setForm({
      date: new Date().toISOString().split('T')[0],
      type: 'General Checkup',
      doctor: '',
      hospital: '',
      bp: '',
      weight: '',
      temp: '',
      sugar: '',
      notes: '',
      status: 'Normal'
    });
    setShowModal(true);
  };

  // Open Edit modal
  const handleOpenEditRecord = (rec) => {
    setEditingRecord(rec);
    setForm({
      date: toInputDate(rec.date) || new Date().toISOString().split('T')[0],
      type: rec.type || 'General Checkup',
      doctor: rec.doctor || '',
      hospital: rec.hospital || '',
      bp: rec.bp === '—' ? '' : rec.bp,
      weight: rec.weight === '—' ? '' : rec.weight,
      temp: rec.temp === '—' ? '' : rec.temp,
      sugar: rec.sugar === '—' ? '' : rec.sugar,
      notes: rec.notes || '',
      status: rec.status || 'Normal'
    });
    setShowModal(true);
  };

  // Submit Add / Edit Record
  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!form.date) {
      Swal.fire({ title: 'Validation Error', text: 'Please select a date', icon: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        date: formatDate(form.date)
      };

      if (editingRecord) {
        const id = editingRecord._id || editingRecord.id;
        const res = await healthService.updateRecord(id, payload);
        if (res && res.success) {
          Swal.fire({
            title: 'Updated!',
            text: 'Health record updated successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } else {
        const res = await healthService.createRecord(payload);
        if (res && res.success) {
          Swal.fire({
            title: 'Saved!',
            text: 'Health record added successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      }
      setShowModal(false);
      setEditingRecord(null);
      await fetchHealthData();
    } catch (err) {
      console.error('Error saving record:', err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to save health record',
        icon: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete Record
  const handleDeleteRecord = (rec) => {
    const id = rec._id || rec.id;
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete this ${rec.type} record from ${rec.date}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await healthService.deleteRecord(id);
          if (res && res.success) {
            await fetchHealthData();
            Swal.fire({
              title: 'Deleted!',
              text: 'Record has been removed.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          }
        } catch (err) {
          console.error('Error deleting record:', err);
          Swal.fire({ title: 'Error', text: 'Failed to delete record.', icon: 'error' });
        }
      }
    });
  };

  // Add Vaccine
  const handleSaveVaccine = async (e) => {
    e.preventDefault();
    if (!vacForm.name) {
      Swal.fire({ title: 'Validation Error', text: 'Vaccine name is required', icon: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const res = await healthService.addVaccination({
        ...vacForm,
        date: formatDate(vacForm.date)
      });
      if (res && res.success) {
        setShowVacModal(false);
        setVacForm({ name: '', date: new Date().toISOString().split('T')[0], due: '', status: 'Done' });
        await fetchHealthData();
        Swal.fire({ title: 'Saved!', text: 'Vaccination record added.', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to add vaccination', icon: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete Vaccine
  const handleDeleteVaccine = (vac) => {
    const id = vac._id || vac.id;
    Swal.fire({
      title: 'Delete Vaccine?',
      text: `Remove ${vac.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, remove'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await healthService.deleteVaccination(id);
          await fetchHealthData();
          Swal.fire({ title: 'Removed!', text: 'Vaccine record deleted.', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({ title: 'Error', text: 'Failed to delete vaccine', icon: 'error' });
        }
      }
    });
  };

  // Add Medication
  const handleSaveMedication = async (e) => {
    e.preventDefault();
    if (!medForm.name) {
      Swal.fire({ title: 'Validation Error', text: 'Medication name is required', icon: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const res = await healthService.addMedication({
        ...medForm,
        since: formatDate(medForm.since)
      });
      if (res && res.success) {
        setShowMedModal(false);
        setMedForm({ name: '', dosage: '1 tablet daily', since: new Date().toISOString().split('T')[0], until: 'Ongoing' });
        await fetchHealthData();
        Swal.fire({ title: 'Saved!', text: 'Medication added successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to add medication', icon: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete Medication
  const handleDeleteMedication = (med) => {
    const id = med._id || med.id;
    Swal.fire({
      title: 'Delete Medication?',
      text: `Remove ${med.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, remove'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await healthService.deleteMedication(id);
          await fetchHealthData();
          Swal.fire({ title: 'Removed!', text: 'Medication removed.', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({ title: 'Error', text: 'Failed to delete medication', icon: 'error' });
        }
      }
    });
  };

  // Open Medical Profile Modal
  const handleOpenProfileModal = () => {
    setProfileForm({
      bloodGroup: medicalProfile.bloodGroup || 'B+',
      allergies: medicalProfile.allergies || 'None',
      chronicConditions: medicalProfile.chronicConditions || 'None',
      surgeries: medicalProfile.surgeries || 'None',
      disability: medicalProfile.disability || 'None',
      insurance: medicalProfile.insurance || ''
    });
    setShowProfileModal(true);
  };

  // Submit Medical Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await healthService.updateMedicalProfile(profileForm);
      if (res && res.success) {
        setShowProfileModal(false);
        await fetchHealthData();
        Swal.fire({ title: 'Updated!', text: 'Medical profile updated.', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to update profile', icon: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Add Emergency Contact
  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      Swal.fire({ title: 'Validation Error', text: 'Name and Phone number are required', icon: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const res = await healthService.addEmergencyContact(contactForm);
      if (res && res.success) {
        setShowContactModal(false);
        setContactForm({ name: '', rel: 'Spouse', phone: '', address: '' });
        await fetchHealthData();
        Swal.fire({ title: 'Saved!', text: 'Emergency contact added.', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to add contact', icon: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete Emergency Contact
  const handleDeleteContact = (c) => {
    const id = c._id || c.id;
    Swal.fire({
      title: 'Delete Contact?',
      text: `Remove ${c.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, remove'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await healthService.deleteEmergencyContact(id);
          await fetchHealthData();
          Swal.fire({ title: 'Removed!', text: 'Emergency contact removed.', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({ title: 'Error', text: 'Failed to delete contact', icon: 'error' });
        }
      }
    });
  };

  // Vitals icon mapping
  const getVitalIcon = (label) => {
    if (label.includes('Pressure')) return Activity;
    if (label.includes('Sugar')) return Droplet;
    if (label.includes('Weight')) return Weight;
    return Thermometer;
  };

  const defaultVitals = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', color: 'text-red-500 bg-red-50', ideal: 'Normal (< 120/80)' },
    { label: 'Blood Sugar', value: '95', unit: 'mg/dL', color: 'text-blue-500 bg-blue-50', ideal: 'Normal (70–99)' },
    { label: 'Weight', value: '72', unit: 'kg', color: 'text-indigo-500 bg-indigo-50', ideal: 'BMI: 22.4 (Healthy)' },
    { label: 'Temperature', value: '98.6', unit: '°F', color: 'text-orange-500 bg-orange-50', ideal: 'Normal (97–99°F)' },
  ];

  const currentVitals = vitalsList.length > 0 ? vitalsList : defaultVitals;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 text-red-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Health Records</h1>
              <p className="text-sm text-gray-500">Your complete medical history and health profile</p>
            </div>
          </div>
          {activeTab === 'Records' && (
            <button
              onClick={handleOpenAddRecord}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 flex items-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center mt-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'text-red-500 border-red-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
            <p className="text-sm font-medium text-gray-500">Loading health records...</p>
          </div>
        ) : (
          <>
            {/* ===== RECORDS TAB ===== */}
            {activeTab === 'Records' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Records', val: healthRecords.length, icon: FileText, color: 'text-indigo-500 bg-indigo-50' },
                    { label: 'Normal', val: healthRecords.filter(r => r.status === 'Normal').length, icon: CheckCircle, color: 'text-green-500 bg-green-50' },
                    { label: 'Needs Attention', val: healthRecords.filter(r => r.status === 'Attention').length, icon: AlertTriangle, color: 'text-yellow-500 bg-yellow-50' },
                    { label: 'Treated', val: healthRecords.filter(r => r.status === 'Treated').length, icon: Shield, color: 'text-blue-500 bg-blue-50' },
                  ].map(({ label, val, icon: Icon, color }) => (
                    <div key={label} className="bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                      <div className={`w-11 h-11 flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-gray-800">{val}</p>
                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Records Table */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-base font-bold text-gray-800">Medical Visit History</h2>
                    <span className="text-xs text-gray-400 font-medium">{healthRecords.length} visits recorded</span>
                  </div>
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr className="bg-gray-50">
                        {['#', 'Date', 'Type', 'Doctor', 'Hospital', 'BP', 'Sugar', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {healthRecords.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-10 text-gray-400 font-medium">
                            No medical records found. Click "+ Add Record" to add your first checkup.
                          </td>
                        </tr>
                      ) : (
                        healthRecords.map((r, i) => (
                          <tr key={r._id || r.id || i} className="hover:bg-red-50/20 transition-colors">
                            <td className="px-4 py-3 border border-gray-200 text-gray-500">{i + 1}</td>
                            <td className="px-4 py-3 border border-gray-200 text-gray-600 whitespace-nowrap">{r.date}</td>
                            <td className="px-4 py-3 border border-gray-200 font-semibold text-gray-800">{r.type}</td>
                            <td className="px-4 py-3 border border-gray-200 text-gray-600">{r.doctor || '—'}</td>
                            <td className="px-4 py-3 border border-gray-200 text-gray-500 text-xs">{r.hospital || '—'}</td>
                            <td className="px-4 py-3 border border-gray-200 text-gray-700 font-medium">{r.bp || '—'}</td>
                            <td className="px-4 py-3 border border-gray-200 text-gray-700">{r.sugar || '—'}</td>
                            <td className="px-4 py-3 border border-gray-200">
                              <span className={`text-xs font-bold px-2 py-0.5 ${statusStyle[r.status] || statusStyle.Normal}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 border border-gray-200">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setViewRecord(r)}
                                  title="View Details"
                                  className="p-1.5 bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditRecord(r)}
                                  title="Edit Record"
                                  className="p-1.5 bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord(r)}
                                  title="Delete Record"
                                  className="p-1.5 bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ===== VITALS TAB ===== */}
            {activeTab === 'Vitals' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentVitals.map(({ label, value, unit, color, ideal }) => {
                    const Icon = getVitalIcon(label);
                    return (
                      <div key={label} className="bg-white border border-gray-200 shadow-sm p-5 text-center">
                        <div className={`w-14 h-14 mx-auto flex items-center justify-center mb-3 ${color}`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <p className="text-3xl font-black text-gray-800">{value}</p>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">{unit}</p>
                        <p className="text-xs text-gray-400 mt-2 font-semibold">{label}</p>
                        <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-wider">{ideal}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white border border-gray-200 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">Vitals Trend (Recorded Checkups)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr className="bg-gray-50">
                          {['Date', 'Blood Pressure', 'Sugar', 'Weight', 'Temp', 'Remarks'].map(h => (
                            <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase border border-gray-200">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {healthRecords.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-6 text-gray-400">No vitals trend recorded yet.</td>
                          </tr>
                        ) : (
                          healthRecords.slice(0, 10).map((r, i) => (
                            <tr key={r._id || r.id || i} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border border-gray-200 text-gray-600 whitespace-nowrap">{r.date}</td>
                              <td className="px-4 py-3 border border-gray-200 font-medium text-gray-800">{r.bp || '—'}</td>
                              <td className="px-4 py-3 border border-gray-200 text-gray-700">{r.sugar || '—'}</td>
                              <td className="px-4 py-3 border border-gray-200 text-gray-700">{r.weight || '—'}</td>
                              <td className="px-4 py-3 border border-gray-200 text-gray-700">{r.temp || '—'}</td>
                              <td className="px-4 py-3 border border-gray-200">
                                <span className={`text-xs font-bold px-2 py-0.5 ${statusStyle[r.status] || ''}`}>{r.status}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== VACCINATIONS TAB ===== */}
            {activeTab === 'Vaccinations' && (
              <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-base font-bold text-gray-800">Vaccination Record</h2>
                  <button
                    onClick={() => setShowVacModal(true)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Vaccine
                  </button>
                </div>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="bg-gray-50">
                      {['#', 'Vaccine Name', 'Date Taken', 'Next Due', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase border border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-gray-400">No vaccination records found.</td>
                      </tr>
                    ) : (
                      vaccinations.map((v, i) => (
                        <tr key={v._id || v.id || i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border border-gray-200 text-gray-500">{i + 1}</td>
                          <td className="px-4 py-3 border border-gray-200 font-semibold text-gray-800">{v.name}</td>
                          <td className="px-4 py-3 border border-gray-200 text-gray-600">{v.date}</td>
                          <td className="px-4 py-3 border border-gray-200 text-gray-500">{v.due || '—'}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <span className={`text-xs font-bold px-2 py-0.5 ${vacStatus[v.status] || vacStatus.Done}`}>{v.status}</span>
                          </td>
                          <td className="px-4 py-3 border border-gray-200">
                            <button
                              onClick={() => handleDeleteVaccine(v)}
                              title="Delete Vaccine"
                              className="p-1.5 bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ===== MEDICATIONS TAB ===== */}
            {activeTab === 'Medications' && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 flex items-start gap-2 text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Always inform the school nurse / admin about any ongoing medications that may affect your duties.</span>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-indigo-500" /> Current Medications
                    </h2>
                    <button
                      onClick={() => setShowMedModal(true)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr className="bg-gray-50">
                        {['#', 'Medicine Name', 'Dosage', 'Since', 'Until', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase border border-gray-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {medications.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-400">No active medications registered.</td>
                        </tr>
                      ) : (
                        medications.map((m, i) => (
                          <tr key={m._id || m.id || i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 border border-gray-200 text-gray-500">{i + 1}</td>
                            <td className="px-4 py-3 border border-gray-200 font-semibold text-gray-800 flex items-center gap-2">
                              <Pill className="w-4 h-4 text-indigo-400" />
                              {m.name}
                            </td>
                            <td className="px-4 py-3 border border-gray-200 text-gray-600">{m.dosage}</td>
                            <td className="px-4 py-3 border border-gray-200 text-gray-500">{m.since}</td>
                            <td className="px-4 py-3 border border-gray-200">
                              <span className={`text-xs font-bold px-2 py-0.5 ${m.until === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'}`}>
                                {m.until}
                              </span>
                            </td>
                            <td className="px-4 py-3 border border-gray-200">
                              <button
                                onClick={() => handleDeleteMedication(m)}
                                title="Delete Medication"
                                className="p-1.5 bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== EMERGENCY INFO TAB ===== */}
            {activeTab === 'Emergency Info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Health Info */}
                <div className="bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                    <Stethoscope className="w-4 h-4 text-red-500" />
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Medical Profile</h2>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    {[
                      { label: 'Blood Group', value: medicalProfile.bloodGroup || 'Not specified' },
                      { label: 'Known Allergies', value: medicalProfile.allergies || 'None' },
                      { label: 'Chronic Conditions', value: medicalProfile.chronicConditions || 'None' },
                      { label: 'Previous Surgeries', value: medicalProfile.surgeries || 'None' },
                      { label: 'Disability (if any)', value: medicalProfile.disability || 'None' },
                      { label: 'Health Insurance', value: medicalProfile.insurance || 'None' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500 font-medium">{label}</span>
                        <span className="text-gray-800 font-semibold">{value}</span>
                      </div>
                    ))}
                    <button
                      onClick={handleOpenProfileModal}
                      className="w-full mt-2 border border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Medical Profile
                    </button>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                    <Phone className="w-4 h-4 text-red-500" />
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Emergency Contacts</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    {emergencyContacts.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-sm">No emergency contacts added yet.</div>
                    ) : (
                      emergencyContacts.map((c, i) => (
                        <div key={c._id || c.id || i} className="border border-gray-100 bg-gray-50 p-4 relative group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-red-100 text-red-500 flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800">{c.name}</p>
                                <p className="text-xs text-gray-400">{c.rel}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteContact(c)}
                              title="Delete Contact"
                              className="p-1 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" />{c.phone}</p>
                            <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" />{c.address}</p>
                          </div>
                        </div>
                      ))
                    )}
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="w-full border border-dashed border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Emergency Contact
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* ===== Add / Edit Record Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-lg shadow-2xl my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {editingRecord ? 'Edit Health Record' : 'Add Health Record'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveRecord}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date *</label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Visit Type *</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    >
                      {['General Checkup', 'Blood Test', 'Eye Checkup', 'Dental', 'Cardiology', 'Physiotherapy', 'ENT Checkup', 'Other'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Doctor Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Name"
                      value={form.doctor}
                      onChange={e => setForm({ ...form, doctor: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Hospital / Lab</label>
                    <input
                      type="text"
                      placeholder="Hospital or clinic name"
                      value={form.hospital}
                      onChange={e => setForm({ ...form, hospital: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Blood Pressure</label>
                    <input
                      type="text"
                      placeholder="e.g. 120/80"
                      value={form.bp}
                      onChange={e => setForm({ ...form, bp: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Blood Sugar</label>
                    <input
                      type="text"
                      placeholder="e.g. 95 mg/dL"
                      value={form.sugar}
                      onChange={e => setForm({ ...form, sugar: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Weight</label>
                    <input
                      type="text"
                      placeholder="e.g. 72 kg"
                      value={form.weight}
                      onChange={e => setForm({ ...form, weight: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Temperature</label>
                    <input
                      type="text"
                      placeholder="e.g. 98.6°F"
                      value={form.temp}
                      onChange={e => setForm({ ...form, temp: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Attention">Attention</option>
                      <option value="Treated">Treated</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Doctor's Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Notes from the visit, diagnosis or prescription..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingRecord ? 'Update Record' : 'Save Record'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== View Record Modal ===== */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewRecord(null)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Record Details</h2>
              <button onClick={() => setViewRecord(null)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{viewRecord.type}</h3>
                  <p className="text-sm text-gray-500">{viewRecord.date}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 ${statusStyle[viewRecord.status] || statusStyle.Normal}`}>
                  {viewRecord.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Doctor', val: viewRecord.doctor },
                  { label: 'Hospital', val: viewRecord.hospital },
                  { label: 'Blood Pressure', val: viewRecord.bp },
                  { label: 'Blood Sugar', val: viewRecord.sugar },
                  { label: 'Weight', val: viewRecord.weight },
                  { label: 'Temperature', val: viewRecord.temp },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-gray-50 border border-gray-100 p-3">
                    <p className="text-xs text-gray-400 font-semibold mb-1">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{val || 'N/A'}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4">
                <p className="text-xs text-gray-400 font-semibold mb-2">DOCTOR'S NOTES</p>
                <p className="text-sm text-gray-700 leading-relaxed">{viewRecord.notes || 'No notes entered for this visit.'}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewRecord(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Add Vaccine Modal ===== */}
      {showVacModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowVacModal(false)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Add Vaccination</h2>
              <button onClick={() => setShowVacModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveVaccine} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Vaccine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COVID-19 Booster, Hepatitis B"
                  value={vacForm.name}
                  onChange={e => setVacForm({ ...vacForm, name: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date Taken</label>
                  <input
                    type="date"
                    value={vacForm.date}
                    onChange={e => setVacForm({ ...vacForm, date: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Next Due</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 2027 or —"
                    value={vacForm.due}
                    onChange={e => setVacForm({ ...vacForm, due: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
                <select
                  value={vacForm.status}
                  onChange={e => setVacForm({ ...vacForm, status: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Done">Done</option>
                  <option value="Due Soon">Due Soon</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 text-sm cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add Vaccine'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVacModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Add Medication Modal ===== */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowMedModal(false)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Add Current Medication</h2>
              <button onClick={() => setShowMedModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveMedication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vitamin D3 1000IU, Antihistamine"
                  value={medForm.name}
                  onChange={e => setMedForm({ ...medForm, name: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet daily (after meals)"
                  value={medForm.dosage}
                  onChange={e => setMedForm({ ...medForm, dosage: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Since Date</label>
                  <input
                    type="date"
                    value={medForm.since}
                    onChange={e => setMedForm({ ...medForm, since: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Until</label>
                  <input
                    type="text"
                    placeholder="Ongoing or target date"
                    value={medForm.until}
                    onChange={e => setMedForm({ ...medForm, until: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 text-sm cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add Medication'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMedModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Edit Medical Profile Modal ===== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Edit Medical Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Blood Group</label>
                  <select
                    value={profileForm.bloodGroup}
                    onChange={e => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Disability (if any)</label>
                  <input
                    type="text"
                    value={profileForm.disability}
                    onChange={e => setProfileForm({ ...profileForm, disability: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Penicillin, Dust, None"
                  value={profileForm.allergies}
                  onChange={e => setProfileForm({ ...profileForm, allergies: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Chronic Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Asthma, Hypertension, Diabetes, None"
                  value={profileForm.chronicConditions}
                  onChange={e => setProfileForm({ ...profileForm, chronicConditions: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Previous Surgeries</label>
                <input
                  type="text"
                  placeholder="e.g. Appendectomy (2020), None"
                  value={profileForm.surgeries}
                  onChange={e => setProfileForm({ ...profileForm, surgeries: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Health Insurance</label>
                <input
                  type="text"
                  placeholder="e.g. Star Health — #SH-20261234"
                  value={profileForm.insurance}
                  onChange={e => setProfileForm({ ...profileForm, insurance: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 text-sm cursor-pointer"
                >
                  {saving ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Add Emergency Contact Modal ===== */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowContactModal(false)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Add Emergency Contact</h2>
              <button onClick={() => setShowContactModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveContact} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Contact person's full name"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse, Father, Mother"
                    value={contactForm.rel}
                    onChange={e => setContactForm({ ...contactForm, rel: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Address</label>
                <input
                  type="text"
                  placeholder="Street address / city"
                  value={contactForm.address}
                  onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 text-sm cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
