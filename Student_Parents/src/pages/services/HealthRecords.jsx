import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Heart,
  Activity,
  Syringe,
  AlertTriangle,
  FileText,
  Download,
  Printer,
  Plus,
  X,
  Send,
  Eye,
  Check,
  CheckCircle2,
  Clock,
  RotateCw,
  Info,
  User,
  Phone,
  Ambulance,
  Pill,
  Accessibility,
  Sparkles,
  Scale,
  Ruler,
  Award,
  Calendar,
  ChevronRight,
  Edit3,
  ShieldCheck,
  Building,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function HealthRecords({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'checkups' | 'vaccinations' | 'infirmary'

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bloodGroup: 'A+',
    height: 120,
    weight: 32,
    allergies: '',
    regularMedications: '',
    emergencyInstructions: ''
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [nurseModalOpen, setNurseModalOpen] = useState(false);
  const [nurseForm, setNurseForm] = useState({
    subject: '',
    message: '',
    urgency: 'Normal'
  });
  const [nurseSubmitting, setNurseSubmitting] = useState(false);

  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState(null);

  // Fetch health data
  const fetchHealthRecords = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const params = {};
      if (activeChild) {
        params.studentId = activeChild;
      }

      const res = await parentService.getHealthDashboard(params);
      if (res && res.success && res.data) {
        setHealthData(res.data);
        // Pre-fill profile edit form
        if (res.data.student && res.data.medicalProfile) {
          setProfileForm({
            bloodGroup: res.data.student.bloodGroup || 'A+',
            height: res.data.student.height || 120,
            weight: res.data.student.weight || 32,
            allergies: res.data.medicalProfile.allergies || '',
            regularMedications: res.data.medicalProfile.regularMedications || '',
            emergencyInstructions: res.data.medicalProfile.emergencyInstructions || ''
          });
        }
      } else {
        setError('Unable to load student health records');
      }
    } catch (err) {
      console.error('Error fetching health dashboard:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch student health records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthRecords();
  }, [activeChild]);

  // Handle Medical Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileSubmitting(true);
      const studentId = healthData?.student?.id || activeChild;
      const payload = {
        studentId,
        bloodGroup: profileForm.bloodGroup,
        height: Number(profileForm.height),
        weight: Number(profileForm.weight),
        allergies: profileForm.allergies,
        regularMedications: profileForm.regularMedications,
        emergencyInstructions: profileForm.emergencyInstructions
      };

      const res = await parentService.updateHealthProfile(payload);
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: 'Medical profile and vitals updated successfully! School infirmary synced.'
        });
        setProfileModalOpen(false);
        fetchHealthRecords(true);
      } else {
        alert(res?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating health profile:', err);
      alert(err?.response?.data?.message || 'Error updating health profile');
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Handle Send Nurse Note
  const handleNurseSubmit = async (e) => {
    e.preventDefault();
    if (!nurseForm.message.trim()) {
      alert('Please enter a note or instruction for the nurse');
      return;
    }
    try {
      setNurseSubmitting(true);
      const res = await parentService.sendNurseNote({
        subject: nurseForm.subject || 'Medication Instruction',
        message: nurseForm.message,
        studentName: healthData?.student?.name || 'Aarav Sharma'
      });

      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Note transmitted to School Infirmary successfully!'
        });
        setNurseModalOpen(false);
        setNurseForm({ subject: '', message: '', urgency: 'Normal' });
        // Refresh dashboard to display the new note
        fetchHealthRecords(true);
      } else {
        alert(res?.message || 'Failed to send note');
      }
    } catch (err) {
      console.error('Error sending nurse note:', err);
      alert(err?.response?.data?.message || 'Failed to send nurse note');
    } finally {
      setNurseSubmitting(false);
    }
  };

  const student = healthData?.student || {
    name: 'Aarav Sharma',
    admissionNo: 'YIS-2024-101',
    className: 'Class I (A)',
    bloodGroup: 'A+',
    height: 120,
    weight: 32,
    bmi: '22.2',
    bmiCategory: 'Healthy & Normal',
    dob: '14 May 2018',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  };

  const vitals = healthData?.vitals || {
    bloodGroup: 'A+',
    heightCm: 120,
    weightKg: 32,
    bmi: '22.2',
    bmiStatus: 'Healthy & Normal',
    visionLeft: '6/9',
    visionRight: '6/6',
    dentalStatus: 'Clean, no active caries',
    pulseRate: '82 bpm',
    bloodPressure: '105/70 mmHg'
  };

  const medicalProfile = healthData?.medicalProfile || {
    allergies: 'Dust & Pollen',
    chronicConditions: 'None reported',
    regularMedications: 'None on daily basis',
    specialNeeds: 'None',
    dietaryRestrictions: 'None (Lactose Tolerant)',
    emergencyInstructions: 'In case of dust allergy, inform parents & administer prescribed inhaler.'
  };

  const checkups = healthData?.checkups || [];
  const vaccinations = healthData?.vaccinations || [];
  const infirmary = healthData?.infirmary || {
    facilityName: 'Campus Medical Infirmary (Health Center)',
    location: 'Wing A Ground Floor, Near Administrative Office (#G-08)',
    residentNurse: 'Sister Mary Joseph (RN, B.Sc. Nursing)',
    nurseContact: '+91 11 2808 9012',
    visitingPediatrician: 'Dr. Anita Desai (MD Pediatrics)',
    visitingHours: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)',
    ambulanceTieUp: 'Max Super Speciality Hospital, Saket (108 / +91 11 2651 5050)',
    bedsAvailable: 4,
    firstAidEquipped: 'Automated External Defibrillator (AED), Oxygen Cylinders, Nebulizer'
  };
  const nurseNotes = healthData?.nurseNotes || [];

  return (
    <div className="p-3 sm:p-5 max-w-[1440px] mx-auto min-h-screen bg-slate-50 space-y-5 pb-24">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-all animate-in fade-in ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Royal Blue Hero Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-blue-400/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Glow circle */}
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md text-amber-300 flex items-center justify-center flex-shrink-0 font-bold shadow-md border border-white/20">
              <Stethoscope className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">Health Records & Infirmary Desk</h1>
                <span className="bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  Active Session 2026-27
                </span>
              </div>
              <p className="text-[12px] text-blue-100 mt-1">
                Pediatric clinical vitals, immunization tracker & campus medical infirmary for <strong className="text-white">{student.name || 'Kabir Singh'}</strong> ({student.className || 'Class 10th (A)'})
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={() => fetchHealthRecords(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
            title="Refresh Health Records"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
            <span>Update Profile</span>
          </button>

          <button
            onClick={() => setNurseModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Note to Nurse</span>
          </button>

          <button
            onClick={() => setCertificateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-950 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border border-white/10 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Fitness Certificate</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center text-center space-y-3 shadow-sm min-h-[400px]">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-base font-bold text-gray-800">Loading Student Health Dossier...</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Fetching pediatric clinical checkups, vaccination records, and infirmary reports from database.
          </p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 p-10 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-base font-bold text-gray-800">{error}</h3>
          <button
            onClick={() => fetchHealthRecords(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Main Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Student Profile & Clinical Vitals (4 cols)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Student ID & Blood Group Card */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
              <div className="bg-gradient-to-r from-[#353A40] to-[#25282d] p-5 text-white flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-white/20 bg-gray-100 flex-shrink-0 overflow-hidden relative shadow">
                  <img
                    src={student.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=EEEDFF&color=5F52FF`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                    Admission #{student.admissionNo}
                  </span>
                  <h2 className="text-lg font-bold truncate text-white leading-tight">
                    {student.name}
                  </h2>
                  <p className="text-xs text-gray-300 font-medium">
                    {student.className} • DOB: {student.dob}
                  </p>
                </div>
              </div>

              {/* Blood Group & Primary Indicators */}
              <div className="p-5 border-b border-gray-100 bg-rose-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-rose-500 text-white font-extrabold text-base flex items-center justify-center shadow-sm">
                    {student.bloodGroup || 'A+'}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">
                      Blood Group
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      Rh Positive (Verified)
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 uppercase tracking-wider flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Medical Fit
                </span>
              </div>

              {/* Vitals Key-Value Metrics */}
              <div className="p-5 divide-y divide-gray-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500 flex items-center gap-2">
                    <Ruler className="w-3.5 h-3.5 text-indigo-500" /> Height
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{vitals.heightCm} cm</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500 flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-indigo-500" /> Weight
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{vitals.weightKg} kg</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" /> Body Mass Index (BMI)
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-sm">{vitals.bmi}</span>
                    <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      {vitals.bmiStatus}
                    </span>
                  </div>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-blue-500" /> Visual Acuity
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">L: {vitals.visionLeft} | R: {vitals.visionRight}</span>
                  </div>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500 flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> Blood Pressure & Pulse
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">{vitals.bloodPressure}</span>
                    <span className="block text-[10px] text-gray-500 font-medium">{vitals.pulseRate}</span>
                  </div>
                </div>
              </div>

              {/* BMI Range Visual Indicator */}
              <div className="px-5 pb-5">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 mb-1.5">
                    <span>BMI Status Indicator</span>
                    <span className="text-emerald-700 font-extrabold">{vitals.bmi} ({vitals.bmiStatus})</span>
                  </div>
                  {/* Gauge bar */}
                  <div className="h-2.5 w-full bg-gray-200 flex overflow-hidden">
                    <div className="w-[25%] bg-amber-300" title="Underweight (<14)"></div>
                    <div className="w-[50%] bg-emerald-500" title="Healthy (14 - 25)"></div>
                    <div className="w-[25%] bg-rose-400" title="Overweight (>25)"></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                    <span>Underweight (&lt;14)</span>
                    <span className="text-emerald-700 font-bold">Optimal Range (14-25)</span>
                    <span>Overweight (&gt;25)</span>
                  </div>
                </div>
              </div>

              {/* Edit button footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium">Last updated: 13 Oct 2026</span>
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Vitals
                </button>
              </div>
            </div>

            {/* Campus Infirmary Desk Quick Info */}
            <div className="bg-white border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Building className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                  Campus Medical Infirmary
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Resident Nurse</span>
                  <span className="font-bold text-gray-800">{infirmary.residentNurse}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Direct Infirmary Line</span>
                  <a href={`tel:${infirmary.nurseContact}`} className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {infirmary.nurseContact}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Visiting Pediatrician</span>
                  <span className="font-bold text-gray-800">{infirmary.visitingPediatrician}</span>
                  <span className="text-[10px] text-gray-500 block">{infirmary.visitingHours}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Emergency Ambulance Tie-up</span>
                  <span className="font-bold text-rose-600 flex items-center gap-1">
                    <Ambulance className="w-3.5 h-3.5" /> {infirmary.ambulanceTieUp}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setNurseModalOpen(true)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Transmit Note to Nurse
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Tabbed Navigation & Detailed Records (8 cols)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Tabs Navigation */}
            <div className="bg-white border border-gray-200 shadow-sm p-1.5 flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Health Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('checkups')}
                className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'checkups'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Checkups ({checkups.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('vaccinations')}
                className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'vaccinations'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Syringe className="w-4 h-4" />
                <span>Vaccinations ({vaccinations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('infirmary')}
                className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'infirmary'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Nurse Desk ({nurseNotes.length})</span>
              </button>
            </div>

            {/* TAB 1: HEALTH OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 2x2 Grid of Medical Attributes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Known Allergies */}
                  <div className="bg-white border border-gray-200 p-5 shadow-sm hover:border-rose-300 transition-colors">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                          Known Allergies
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                          {medicalProfile.allergies || 'None reported'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium mt-1">
                          School canteen & teacher notified of dust/pollen precautions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div className="bg-white border border-gray-200 p-5 shadow-sm hover:border-amber-300 transition-colors">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                          Chronic Conditions
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                          {medicalProfile.chronicConditions || 'None reported'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium mt-1">
                          No asthma, diabetes or cardiac issues on clinical record.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Regular Medications */}
                  <div className="bg-white border border-gray-200 p-5 shadow-sm hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Pill className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                          Regular Medications
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                          {medicalProfile.regularMedications || 'None on daily basis'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium mt-1">
                          Temporary medication can be deposited with Sister Mary.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Needs & Diet */}
                  <div className="bg-white border border-gray-200 p-5 shadow-sm hover:border-purple-300 transition-colors">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Accessibility className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                          Special Needs & Diet
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                          {medicalProfile.dietaryRestrictions || 'Lactose Tolerant, No Nut Allergies'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium mt-1">
                          Special accommodations: None required at present.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Emergency Medical Directives Card */}
                <div className="bg-rose-50/60 border border-rose-200 border-l-4 border-l-rose-500 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-2">
                      <Ambulance className="w-4 h-4 text-rose-600" />
                      Parent Emergency Medical Instructions
                    </h3>
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Update Directives
                    </button>
                  </div>
                  <p className="text-xs text-gray-800 font-medium leading-relaxed bg-white/70 p-3.5 border border-rose-100">
                    "{medicalProfile.emergencyInstructions}"
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-rose-900">
                    <span>• Emergency Contact: Father (+91 98765 10000)</span>
                    <span>• Hospital Preference: Max Super Speciality Saket</span>
                    <span>• Authorization: Consent granted for campus first aid</span>
                  </div>
                </div>

                {/* Doctor's Clearance Statement */}
                <div className="bg-white border border-gray-200 p-5 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                        Pediatric Fitness & Sports Clearance Statement
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200">
                        CLEARED FOR ALL SPORTS
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      "Student Aarav Sharma has undergone annual pediatric screening and is certified fit for inter-house athletic meets, swimming classes, physical training (PT), and field excursions. Resting heart rate and respiration are optimal."
                    </p>
                    <div className="mt-2 text-[11px] text-gray-500 font-medium">
                      Endorsed by: <span className="font-bold text-gray-700">Dr. Anita Desai (MD Pediatrics)</span> • License #DMC-68492
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HEALTH CHECKUPS */}
            {activeTab === 'checkups' && (
              <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Pediatric Examination & Screening History
                    </h3>
                    <p className="text-xs text-gray-500">
                      Formal periodic health checkups conducted by school medical officers and visiting specialists
                    </p>
                  </div>
                  <button
                    onClick={() => setCertificateModalOpen(true)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-xs font-bold text-gray-700 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Health Summary
                  </button>
                </div>

                <div className="space-y-4">
                  {checkups.map((chk, idx) => (
                    <div 
                      key={chk._id || idx}
                      className="border border-gray-200 p-5 hover:border-indigo-300 transition-colors bg-white shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-900">
                              {chk.checkupType}
                            </h4>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 uppercase">
                              {chk.status || 'Fit & Normal'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">
                            Examined by: <span className="font-semibold text-gray-700">{chk.doctor}</span> • {chk.clinic}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1">
                            {chk.date}
                          </span>
                        </div>
                      </div>

                      {/* Vitals Summary Pill Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 border border-gray-100 text-xs mb-3">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Height / Weight</span>
                          <span className="font-bold text-gray-900 block">{chk.height} / {chk.weight}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Blood Pressure / Pulse</span>
                          <span className="font-bold text-gray-900 block">{chk.bp} ({chk.pulse})</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Vision (L / R)</span>
                          <span className="font-bold text-gray-900 block">{chk.visionLeft} / {chk.visionRight}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Dental Screening</span>
                          <span className="font-bold text-gray-900 block truncate">{chk.dentalNotes}</span>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-xs text-gray-600">
                          <span className="font-bold text-gray-800">Doctor's Clinical Remarks: </span>
                          <span>{chk.remarks}</span>
                        </div>
                        <button
                          onClick={() => setSelectedCheckup(chk)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 flex-shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: VACCINATIONS & IMMUNIZATION */}
            {activeTab === 'vaccinations' && (
              <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      National Immunization Schedule (NIS) Tracker
                    </h3>
                    <p className="text-xs text-gray-500">
                      Mandatory and optional childhood vaccinations verified by the Campus Health Office
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-3 py-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> All Doses Up-to-date
                    </span>
                  </div>
                </div>

                {/* Vaccinations Table */}
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f2f4ff] border-b border-gray-200 text-[#4f46e5] font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="p-3">Vaccine & Coverage</th>
                        <th className="p-3">Dose / Stage</th>
                        <th className="p-3">Administered Date</th>
                        <th className="p-3">Administered By</th>
                        <th className="p-3">Batch Number</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {vaccinations.map((vac) => (
                        <tr key={vac.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-gray-900 block">{vac.vaccineName}</span>
                            <span className="text-[11px] text-gray-500">{vac.disease}</span>
                          </td>
                          <td className="p-3 font-semibold text-gray-700">
                            {vac.dose}
                          </td>
                          <td className="p-3 font-bold text-gray-800">
                            {vac.administeredDate}
                          </td>
                          <td className="p-3 text-gray-600">
                            {vac.administeredBy}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-gray-500">
                            {vac.batchNo}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {vac.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Schedule Advice Banner */}
                <div className="bg-indigo-50/70 border border-indigo-200 p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-900">
                    <p className="font-bold">Next Recommended Booster Schedule:</p>
                    <p className="text-[11.5px] mt-0.5">
                      DPT 2nd Booster & Td vaccine will become due at age 10 years (approx. May 2028). An automatic SMS alert will be triggered to the registered parent mobile number.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SCHOOL INFIRMARY & NURSE COMMUNICATIONS */}
            {activeTab === 'infirmary' && (
              <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Infirmary Communications & Medication Desk
                    </h3>
                    <p className="text-xs text-gray-500">
                      Direct instructions sent to Sister Mary Joseph regarding daily doses, symptom observations & first aid
                    </p>
                  </div>
                  <button
                    onClick={() => setNurseModalOpen(true)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Send New Instruction</span>
                  </button>
                </div>

                {/* Facility Specs Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 border border-gray-200 p-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Infirmary Incharge</span>
                    <span className="font-bold text-gray-800">{infirmary.residentNurse}</span>
                    <span className="text-[10px] text-gray-500 block">{infirmary.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Medical Facilities</span>
                    <span className="font-bold text-gray-800">{infirmary.bedsAvailable} Rest Beds Available</span>
                    <span className="text-[10px] text-gray-500 block">Nebulizer, AED & Oxygen Equipped</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Direct Emergency Contact</span>
                    <span className="font-bold text-rose-600 block">{infirmary.nurseContact}</span>
                    <span className="text-[10px] text-gray-500 block">Extension #208 (Campus PBX)</span>
                  </div>
                </div>

                {/* Communication Threads */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    Recent Medication & Observation Instructions
                  </h4>

                  {nurseNotes.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-gray-300 text-xs text-gray-500">
                      No communication records found with the School Infirmary yet.
                    </div>
                  ) : (
                    nurseNotes.map((note, idx) => (
                      <div 
                        key={note.noteId || idx}
                        className="border border-gray-200 p-4.5 bg-white shadow-sm hover:border-indigo-200 transition-colors space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 border border-indigo-200">
                              #{note.noteId}
                            </span>
                            <span className="text-xs font-bold text-gray-900">{note.subject}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{note.date} at {note.time}</span>
                          </div>
                        </div>

                        {/* Parent's message */}
                        <div className="bg-gray-50 p-3 border border-gray-200 text-xs">
                          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                            Instruction from Parent (Mr. Rajesh Gupta):
                          </span>
                          <p className="text-gray-800 font-medium">{note.message}</p>
                        </div>

                        {/* Nurse's Acknowledgment */}
                        <div className="bg-emerald-50/70 p-3 border border-emerald-200 text-xs flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-900">
                                Response by {note.nurseName || 'Sister Mary Joseph (RN)'}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5">
                                {note.status}
                              </span>
                            </div>
                            <p className="text-emerald-800 mt-1 font-medium">{note.nurseReply}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: Update Medical Profile & Emergency Directives   */}
      {/* ========================================================= */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">Update Student Medical Profile & Vitals</h3>
              </div>
              <button 
                onClick={() => setProfileModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Blood Group</label>
                  <select
                    value={profileForm.bloodGroup}
                    onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-bold bg-white focus:outline-none focus:border-indigo-600"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={profileForm.height}
                    onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-semibold focus:outline-none focus:border-indigo-600"
                    placeholder="120"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={profileForm.weight}
                    onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-semibold focus:outline-none focus:border-indigo-600"
                    placeholder="32"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Known Allergies (Food, Environmental, Meds)</label>
                <input
                  type="text"
                  value={profileForm.allergies}
                  onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Dust & Pollen, Peanuts, Penicillin"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Regular Medications (if any)</label>
                <input
                  type="text"
                  value={profileForm.regularMedications}
                  onChange={(e) => setProfileForm({ ...profileForm, regularMedications: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Salbutamol inhaler as needed"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Parent Emergency Medical Instructions</label>
                <textarea
                  rows={3}
                  value={profileForm.emergencyInstructions}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyInstructions: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="Instructions for school nurse and class teacher in emergency..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                >
                  {profileSubmitting ? 'Saving to Database...' : 'Save Health Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: Send Note / Medication Instructions to Nurse     */}
      {/* ========================================================= */}
      {nurseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-indigo-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-200" />
                <h3 className="text-sm font-bold">Transmit Instruction to Campus Infirmary Nurse</h3>
              </div>
              <button 
                onClick={() => setNurseModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNurseSubmit} className="p-5 space-y-4 text-xs">
              <div className="bg-indigo-50 border border-indigo-200 p-3 text-indigo-900">
                <p className="font-bold">Attention: Sister Mary Joseph (RN)</p>
                <p className="text-[11px] text-indigo-800">
                  Instructions will be logged into the infirmary logbook for student {student.name} ({student.className}).
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Subject / Category</label>
                <input
                  type="text"
                  value={nurseForm.subject}
                  onChange={(e) => setNurseForm({ ...nurseForm, subject: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Cough syrup (5ml) after lunch break / Rest advice"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Detailed Medication / Observation Note</label>
                <textarea
                  rows={4}
                  value={nurseForm.message}
                  onChange={(e) => setNurseForm({ ...nurseForm, message: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-indigo-600"
                  placeholder="Please state dosage, time, symptoms to observe, and any doctor prescriptions..."
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNurseModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={nurseSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {nurseSubmitting ? 'Transmitting...' : 'Send to Infirmary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: Printable Medical Fitness Certificate            */}
      {/* ========================================================= */}
      {certificateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header / Actions */}
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Official Student Medical Fitness Certificate</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
                <button 
                  onClick={() => setCertificateModalOpen(false)}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Sheet (Printable) */}
            <div className="p-8 space-y-6 text-gray-900 bg-white">
              {/* Institution Header */}
              <div className="text-center border-b-2 border-indigo-900 pb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-700">
                  Campus Health & Wellness Department
                </span>
                <h2 className="text-2xl font-black tracking-tight text-gray-900 mt-0.5">
                  ALL CORE SOLUTIONS
                </h2>
                <p className="text-xs text-gray-600 font-medium">
                  Sector 14, Phase II, New Delhi - 110025 • Affiliation #CBSE-2130849 • Tel: +91 11 2808 9000
                </p>
                <div className="inline-block mt-3 px-4 py-1 bg-indigo-50 border border-indigo-200 text-xs font-black uppercase tracking-wider text-indigo-950">
                  ANNUAL STUDENT MEDICAL FITNESS & HEALTH CERTIFICATE
                </div>
              </div>

              {/* Student Demographics Table */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-gray-200 p-4 bg-gray-50/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Student Full Name</span>
                  <span className="text-sm font-bold text-gray-900">{student.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Admission Number</span>
                  <span className="text-sm font-bold text-indigo-700">{student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Class & Section</span>
                  <span className="font-bold text-gray-800">{student.className}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Date of Birth / Age</span>
                  <span className="font-bold text-gray-800">{student.dob} (8 Years)</span>
                </div>
              </div>

              {/* Clinical Vitals Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 border-b pb-1">
                  Clinical Examination & Vitals Summary
                </h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="border p-2.5">
                    <span className="text-gray-500 block text-[10px] font-bold">Blood Group</span>
                    <span className="font-black text-rose-600 text-sm">{vitals.bloodGroup}</span>
                  </div>
                  <div className="border p-2.5">
                    <span className="text-gray-500 block text-[10px] font-bold">Height & Weight</span>
                    <span className="font-bold text-gray-900">{vitals.heightCm} cm / {vitals.weightKg} kg</span>
                  </div>
                  <div className="border p-2.5">
                    <span className="text-gray-500 block text-[10px] font-bold">BMI Index</span>
                    <span className="font-bold text-emerald-700">{vitals.bmi} ({vitals.bmiStatus})</span>
                  </div>
                  <div className="border p-2.5">
                    <span className="text-gray-500 block text-[10px] font-bold">Visual Acuity</span>
                    <span className="font-bold text-gray-800">L: {vitals.visionLeft} | R: {vitals.visionRight}</span>
                  </div>
                  <div className="border p-2.5">
                    <span className="text-gray-500 block text-[10px] font-bold">Blood Pressure / Pulse</span>
                    <span className="font-bold text-gray-800">{vitals.bloodPressure} ({vitals.pulseRate})</span>
                  </div>
                  <div className="border p-2.5">
                    <span className="text-gray-500 block text-[10px] font-bold">Immunization Status</span>
                    <span className="font-bold text-emerald-700">100% Up-to-date (6 Administered)</span>
                  </div>
                </div>
              </div>

              {/* Medical Doctor Endorsement */}
              <div className="bg-emerald-50/50 border border-emerald-200 p-4 text-xs space-y-2">
                <h4 className="font-bold text-emerald-950 uppercase tracking-wide">
                  Medical Fitness Certification Declaration
                </h4>
                <p className="text-emerald-900 leading-relaxed font-medium">
                  This is to certify that Master <strong>{student.name}</strong> has been clinically examined by the campus medical board. He is found to be in good physical and mental health, free from any contagious diseases, and is hereby declared <strong>FIT</strong> to participate in all school curricula, physical education, sporting competitions, swimming, and educational excursions.
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 grid grid-cols-2 items-end text-xs border-t border-gray-200">
                <div className="space-y-1">
                  <div className="font-serif italic text-gray-800 font-bold text-sm">Dr. Anita Desai</div>
                  <div className="font-bold text-gray-900">Dr. Anita Desai, MD (Pediatrics)</div>
                  <div className="text-gray-500 text-[11px]">Chief Medical Officer • Regn #DMC-68492</div>
                  <div className="text-gray-400 text-[10px]">Campus Infirmary, All Core Solutions</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="inline-block border-2 border-dashed border-gray-300 p-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Official Campus Medical Seal
                  </div>
                  <div className="text-gray-500 text-[11px] mt-1">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: Checkup Details Modal                            */}
      {/* ========================================================= */}
      {selectedCheckup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">{selectedCheckup.checkupType}</h3>
              </div>
              <button 
                onClick={() => setSelectedCheckup(null)}
                className="text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Examined By</span>
                  <p className="font-bold text-gray-900">{selectedCheckup.doctor}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Date</span>
                  <p className="font-bold text-indigo-600">{selectedCheckup.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 border">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Height / Weight</span>
                  <span className="font-bold text-gray-800 block">{selectedCheckup.height} / {selectedCheckup.weight}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">BMI / Blood Pressure</span>
                  <span className="font-bold text-gray-800 block">{selectedCheckup.bmi} ({selectedCheckup.bp})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Vision (L/R)</span>
                  <span className="font-bold text-gray-800 block">{selectedCheckup.visionLeft} / {selectedCheckup.visionRight}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Dental Screening</span>
                  <span className="font-bold text-gray-800 block">{selectedCheckup.dentalNotes}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Doctor's Clinical Notes</span>
                <p className="p-3 bg-indigo-50/50 border border-indigo-100 text-gray-800 font-medium">
                  {selectedCheckup.remarks}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedCheckup(null)}
                  className="px-4 py-2 bg-gray-800 text-white font-bold text-xs"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
