import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Contact, FileText, Palette, Filter, RotateCcw, 
  Search, LayoutGrid, Info, Eye, Download, Image as ImageIcon, Users,
  FolderOpen, Printer, Edit2, Wand2, Plus, CheckCircle2, ShieldCheck,
  QrCode, Trash2, RefreshCw, Sparkles, School, Phone, HeartPulse,
  Calendar, Check, ChevronRight, Layers, ArrowLeftRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { idCardService } from '../../api/idCardService';
import axiosInstance from '../../api/axios';

export default function IdCardsStudent({ initialTab = 'student' }) {
  const navigate = useNavigate();
  const printAreaRef = useRef(null);

  // Active Tab state
  const [activeTab, setActiveTab] = useState(initialTab);

  // Data states
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic-band-indigo');
  const [issuedCards, setIssuedCards] = useState([]);
  const [stats, setStats] = useState({ totalIssued: 0, studentCards: 0, staffCards: 0, activeTemplates: 6 });

  // Selection states
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [activePersonPreview, setActivePersonPreview] = useState(null);
  const [cardSide, setCardSide] = useState('front'); // 'front' | 'back'

  // Loading & Filter states
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [searchStudentText, setSearchStudentText] = useState('');
  const [searchStaffText, setSearchStaffText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [archiveSearchText, setArchiveSearchText] = useState('');

  // Sheet Print Setup states
  const [showPrintLayout, setShowPrintLayout] = useState(true);
  const [printPaper, setPrintPaper] = useState('A4');
  const [printOrientation, setPrintOrientation] = useState('Portrait');
  const [sheetMargin, setSheetMargin] = useState(10);
  const [sheetGap, setSheetGap] = useState(4);
  const [showCutMarks, setShowCutMarks] = useState(true);
  const [alignCenter, setAlignCenter] = useState(true);
  const [archiveCopy, setArchiveCopy] = useState(true);

  // New Template Modal state
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplateForm, setNewTemplateForm] = useState({
    title: '',
    cardType: 'Student',
    orientation: 'Portrait',
    themeColor: '#5F52FF',
    accentColor: '#E9E7FF',
    inkColor: '#1E1B4B',
    schoolName: 'Greenwood International School',
    schoolTagline: 'Affiliated to CBSE | Affiliation No: 2130894',
    schoolPhone: '+91 98765 43210',
    schoolAddress: 'Sector 12, Knowledge Park, New Delhi',
    principalSignText: 'Authorized Signature'
  });

  // Sync tab with props
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Load initial templates, classes, staff, stats, and issued cards
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch Templates
      const tplRes = await idCardService.getTemplates();
      if (tplRes.success && tplRes.data.length > 0) {
        setTemplates(tplRes.data);
        const def = tplRes.data.find(t => t.isDefault) || tplRes.data[0];
        setSelectedTemplateId(def.templateId);
      }

      // 2. Fetch Classes
      const clsRes = await axiosInstance.get('/academics/classes');
      if (clsRes.data && clsRes.data.data) {
        setClasses(clsRes.data.data);
        if (clsRes.data.data.length > 0) {
          setSelectedClass(clsRes.data.data[0]._id);
          setSections(clsRes.data.data[0].sections || []);
        }
      }

      // 3. Fetch Staff / Teachers
      const staffRes = await axiosInstance.get('/academics/teachers');
      if (staffRes.data && staffRes.data.data) {
        setStaffList(staffRes.data.data);
      }

      // 4. Fetch Stats & Issued Cards
      refreshStatsAndArchive();
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const refreshStatsAndArchive = async () => {
    try {
      const statsRes = await idCardService.getStats();
      if (statsRes.success) setStats(statsRes.data);

      const issuedRes = await idCardService.getIssuedCards();
      if (issuedRes.success) setIssuedCards(issuedRes.data);
    } catch (err) {
      console.error('Failed to refresh stats/archive:', err);
    }
  };

  // Fetch students when selectedClass or selectedSection changes
  useEffect(() => {
    if (!selectedClass) return;
    loadStudentsForClass(selectedClass, selectedSection);
  }, [selectedClass, selectedSection]);

  const loadStudentsForClass = async (classId, sectionId) => {
    setLoadingStudents(true);
    try {
      const params = {};
      if (classId) params.classId = classId;
      if (sectionId) params.sectionId = sectionId;

      const res = await axiosInstance.get('/students', { params });
      const studentData = res.data?.data || [];
      setStudents(studentData);
      
      // Auto-select first student as live preview
      if (studentData.length > 0) {
        setActivePersonPreview({ type: 'Student', data: studentData[0] });
        setSelectedStudentIds([studentData[0]._id]);
      } else {
        setActivePersonPreview(null);
        setSelectedStudentIds([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Handle class dropdown change
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedSection('');
    const cls = classes.find(c => c._id === classId);
    setSections(cls ? cls.sections || [] : []);
  };

  // Active Template object
  const activeTemplate = useMemo(() => {
    return templates.find(t => t.templateId === selectedTemplateId) || templates[0] || {
      templateId: 'classic-band-indigo',
      title: 'Classic Band Indigo',
      cardType: 'Student',
      orientation: 'Portrait',
      themeColor: '#5F52FF',
      accentColor: '#E9E7FF',
      inkColor: '#1E1B4B',
      schoolName: 'Greenwood International School',
      schoolTagline: 'Affiliated to CBSE | Affiliation No: 2130894',
      schoolAddress: 'Sector 12, Knowledge Park, New Delhi',
      schoolPhone: '+91 98765 43210',
      fieldsIncluded: { photo: true, bloodGroup: true, emergencyContact: true, address: true, barcode: true, qrCode: true }
    };
  }, [templates, selectedTemplateId]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const full = `${s.firstName || ''} ${s.lastName || ''} ${s.admissionNo || ''} ${s.rollNo || ''}`.toLowerCase();
      return full.includes(searchStudentText.toLowerCase());
    });
  }, [students, searchStudentText]);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment;
      const full = `${s.fullName || ''} ${s.staffId || ''} ${s.designation || ''} ${s.phone || ''}`.toLowerCase();
      return matchesDept && full.includes(searchStaffText.toLowerCase());
    });
  }, [staffList, selectedDepartment, searchStaffText]);

  // Filtered Issued Archive
  const filteredArchive = useMemo(() => {
    return issuedCards.filter(c => {
      const full = `${c.fullName || ''} ${c.idNumber || ''} ${c.cardNumber || ''} ${c.personType || ''}`.toLowerCase();
      return full.includes(archiveSearchText.toLowerCase());
    });
  }, [issuedCards, archiveSearchText]);

  // Toggle selection for student
  const toggleStudentSelection = (studentId) => {
    setSelectedStudentIds(prev => {
      const exists = prev.includes(studentId);
      const updated = exists ? prev.filter(id => id !== studentId) : [...prev, studentId];
      const clicked = students.find(s => s._id === studentId);
      if (clicked && !exists) {
        setActivePersonPreview({ type: 'Student', data: clicked });
      }
      return updated;
    });
  };

  // Select all students
  const handleSelectAllStudents = (e) => {
    if (e.target.checked) {
      const allIds = filteredStudents.map(s => s._id);
      setSelectedStudentIds(allIds);
      if (filteredStudents.length > 0) {
        setActivePersonPreview({ type: 'Student', data: filteredStudents[0] });
      }
    } else {
      setSelectedStudentIds([]);
    }
  };

  // Toggle selection for staff
  const toggleStaffSelection = (staffId) => {
    setSelectedStaffIds(prev => {
      const exists = prev.includes(staffId);
      const updated = exists ? prev.filter(id => id !== staffId) : [...prev, staffId];
      const clicked = staffList.find(s => s._id === staffId);
      if (clicked && !exists) {
        setActivePersonPreview({ type: 'Staff', data: clicked });
      }
      return updated;
    });
  };

  // Select all staff
  const handleSelectAllStaff = (e) => {
    if (e.target.checked) {
      const allIds = filteredStaff.map(s => s._id);
      setSelectedStaffIds(allIds);
      if (filteredStaff.length > 0) {
        setActivePersonPreview({ type: 'Staff', data: filteredStaff[0] });
      }
    } else {
      setSelectedStaffIds([]);
    }
  };

  // Trigger Auto-Generation for single or bulk
  const handleAutoGenerate = async (isBulk = false) => {
    try {
      setLoadingAction(true);
      const isStudentTab = activeTab === 'student';
      const targetType = isStudentTab ? 'Student' : 'Staff';
      const selectedIds = isStudentTab ? selectedStudentIds : selectedStaffIds;

      if (!isBulk) {
        // Single Generate for current active person preview
        if (!activePersonPreview?.data?._id) {
          Swal.fire('Select Person', 'Please select at least one person to generate their ID card.', 'warning');
          return;
        }

        const res = await idCardService.autoGenerate({
          personType: targetType,
          personId: activePersonPreview.data._id,
          templateId: selectedTemplateId,
          validUntil: '31-Mar-2027',
          academicSession: '2026-2027'
        });

        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'ID Card Auto-Generated!',
            text: `Card ${res.data.cardNumber} for ${res.data.fullName} is ready & archived.`,
            confirmButtonColor: '#5542f6'
          });
          refreshStatsAndArchive();
        }
      } else {
        // Bulk Generate for Class or Department
        if (isStudentTab) {
          if (!selectedClass) {
            Swal.fire('Select Class', 'Please pick a class before bulk generating.', 'warning');
            return;
          }
          const res = await idCardService.bulkAutoGenerate({
            personType: 'Student',
            classId: selectedClass,
            sectionId: selectedSection || undefined,
            templateId: selectedTemplateId,
            validUntil: '31-Mar-2027',
            academicSession: '2026-2027'
          });

          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Bulk Generation Complete!',
              text: `Generated ${res.count} student ID cards successfully.`,
              confirmButtonColor: '#5542f6'
            });
            refreshStatsAndArchive();
          }
        } else {
          // Staff Bulk
          const res = await idCardService.bulkAutoGenerate({
            personType: 'Staff',
            department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
            templateId: selectedTemplateId,
            validUntil: '31-Mar-2027',
            academicSession: '2026-2027'
          });

          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Staff Bulk Complete!',
              text: `Generated ${res.count} staff ID cards successfully.`,
              confirmButtonColor: '#5542f6'
            });
            refreshStatsAndArchive();
          }
        }
      }
    } catch (err) {
      console.error('Generation failed:', err);
      Swal.fire('Generation Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  // Launch browser printing
  const handlePrint = () => {
    window.print();
  };

  // Delete generated card
  const handleDeleteIssued = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete ID Card?',
      text: `Are you sure you want to delete ${name}'s generated ID card?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await idCardService.deleteIssuedCard(id);
        Swal.fire('Deleted!', 'The ID card record has been removed.', 'success');
        refreshStatsAndArchive();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete ID card.', 'error');
      }
    }
  };

  // Mark as printed
  const handleMarkPrinted = async (id) => {
    try {
      await idCardService.markPrinted(id);
      refreshStatsAndArchive();
      Swal.fire('Status Updated', 'Card marked as printed.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to update card status.', 'error');
    }
  };

  // Create new template
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplateForm.title) {
      Swal.fire('Title Required', 'Please enter a name for the design template.', 'warning');
      return;
    }

    try {
      const payload = {
        ...newTemplateForm,
        templateId: newTemplateForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4)
      };
      const res = await idCardService.createTemplate(payload);
      if (res.success) {
        Swal.fire('Template Created!', 'Your new ID card design is now live.', 'success');
        setShowNewTemplateModal(false);
        const tpls = await idCardService.getTemplates();
        if (tpls.success) {
          setTemplates(tpls.data);
          setSelectedTemplateId(res.data.templateId);
        }
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Get people list to print in the printable batch sheet
  const peopleToPrint = useMemo(() => {
    const isStudentTab = activeTab === 'student';
    if (isStudentTab) {
      if (selectedStudentIds.length === 0 && activePersonPreview) {
        return [activePersonPreview.data];
      }
      return students.filter(s => selectedStudentIds.includes(s._id));
    } else {
      if (selectedStaffIds.length === 0 && activePersonPreview) {
        return [activePersonPreview.data];
      }
      return staffList.filter(s => selectedStaffIds.includes(s._id));
    }
  }, [activeTab, selectedStudentIds, selectedStaffIds, students, staffList, activePersonPreview]);

  /* -------------------------------------------------------------
     RENDER SINGLE ID CARD (Front & Back)
     Used for Live Preview and for High-Resolution Sheet Printing
  ------------------------------------------------------------- */
  const renderCard = (person, type, tpl, side = 'front') => {
    if (!person) return null;

    const isStudent = type === 'Student';
    const fullName = isStudent 
      ? `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Student Name'
      : person.fullName || 'Staff Member';
    const idNumber = isStudent ? (person.admissionNo || person.aparId || 'ADM-001') : (person.staffId || 'STF-001');
    const roleOrClass = isStudent 
      ? `${person.classId?.className || 'Class I'} • Sec ${person.sectionId?.sectionName || 'A'}`
      : `${person.designation || 'Faculty'} • ${person.department || 'Academics'}`;
    const rollNo = isStudent ? (person.rollNo || '1') : '-';
    const bloodGroup = person.bloodGroup || 'O+';
    const phone = isStudent ? (person.fatherPhone || person.studentPhone || '+91 98765 43210') : (person.phone || '+91 98765 43210');
    const photo = isStudent 
      ? (person.studentPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80')
      : (person.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
    const isLandscape = tpl.orientation === 'Landscape';

    // QR & Barcode payloads
    const qrData = encodeURIComponent(`https://greenwood.edu/verify?id=${idNumber}&name=${fullName}&type=${type}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`;

    if (side === 'back') {
      // BACK OF CARD
      return (
        <div 
          className={`relative bg-white border border-gray-300 shadow-md flex flex-col overflow-hidden text-gray-800 transition-all select-none ${
            isLandscape ? 'w-[320px] h-[202px]' : 'w-[230px] h-[340px]'
          }`}
          style={{ fontFamily: 'sans-serif' }}
        >
          {/* Top colored accent line */}
          <div className="h-2 w-full" style={{ backgroundColor: tpl.themeColor }} />

          <div className="p-3 flex-1 flex flex-col justify-between text-left text-[9px] leading-tight">
            <div>
              <div className="flex items-center space-x-1.5 pb-2 border-b border-gray-200">
                <School className="w-4 h-4 text-gray-600 flex-shrink-0" style={{ color: tpl.themeColor }} />
                <div>
                  <h4 className="font-extrabold text-[10px] text-gray-800 uppercase tracking-tight">{tpl.schoolName}</h4>
                  <p className="text-[7.5px] text-gray-500">{tpl.schoolTagline}</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-2 text-gray-600 text-[8px] space-y-1">
                <p>1. This card is valid for the academic year 2026-2027.</p>
                <p>2. Must be carried and produced upon demand within campus premises.</p>
                <p>3. If found, please return to school administrative front office.</p>
              </div>
            </div>

            {/* QR Code and Emergency info */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-auto">
              <div className="space-y-0.5 text-[8px]">
                <p className="font-bold text-gray-700 flex items-center">
                  <Phone className="w-2.5 h-2.5 mr-1" /> Help Desk: {tpl.schoolPhone}
                </p>
                <p className="font-semibold text-gray-600 flex items-center">
                  <HeartPulse className="w-2.5 h-2.5 mr-1 text-red-500" /> Blood Group: <span className="font-bold ml-1 text-red-700">{bloodGroup}</span>
                </p>
                <p className="text-[7px] text-gray-400">Emergency: {phone}</p>
              </div>
              <div className="w-14 h-14 bg-white p-1 border border-gray-200 rounded flex items-center justify-center">
                <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Bottom Signature Line */}
            <div className="flex justify-between items-end border-t border-gray-200 pt-1.5 mt-1">
              <span className="text-[7px] text-gray-400">Serial: {idNumber}</span>
              <div className="text-center">
                <div className="text-[8px] font-serif italic font-bold text-gray-700 leading-none">V.K. Sharma</div>
                <div className="text-[6.5px] uppercase font-bold text-gray-500">{tpl.principalSignText}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // FRONT OF CARD
    if (isLandscape) {
      // LANDSCAPE LAYOUT
      return (
        <div 
          className="relative bg-white border border-gray-300 shadow-md flex flex-col overflow-hidden text-gray-800 transition-all select-none w-[320px] h-[202px]"
          style={{ fontFamily: 'sans-serif' }}
        >
          {/* Top Ribbon */}
          <div 
            className="px-3 py-1.5 flex items-center justify-between text-white" 
            style={{ backgroundColor: tpl.themeColor }}
          >
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                G
              </div>
              <div>
                <h3 className="font-extrabold text-[10px] leading-tight tracking-tight uppercase">{tpl.schoolName}</h3>
                <p className="text-[6.5px] opacity-80 leading-none">{tpl.schoolTagline}</p>
              </div>
            </div>
            <span className="text-[7.5px] font-bold bg-white/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {type} ID
            </span>
          </div>

          {/* Body */}
          <div className="p-2.5 flex-1 flex gap-3 items-center">
            {/* Photo */}
            <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-gray-100">
              <img src={photo} alt={fullName} className="w-full h-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between text-left h-full py-0.5">
              <div>
                <h2 className="text-[13px] font-black leading-tight text-gray-900">{fullName}</h2>
                <p className="text-[9px] font-bold mt-0.5" style={{ color: tpl.themeColor }}>{roleOrClass}</p>
              </div>

              <div className="space-y-0.5 text-[8px] text-gray-600 mt-1">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{isStudent ? 'Adm No:' : 'Staff ID:'}</span>
                  <span className="font-bold text-gray-800">{idNumber}</span>
                </div>
                {isStudent && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-semibold">Roll No:</span>
                    <span className="font-bold text-gray-800">{rollNo}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Blood Group:</span>
                  <span className="font-bold text-red-600">{bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Valid Thru:</span>
                  <span className="font-bold text-gray-700">31-Mar-2027</span>
                </div>
              </div>

              {/* Barcode line */}
              <div className="mt-1 pt-1 border-t border-gray-100 flex items-center justify-between">
                <div 
                  className="h-3 w-28 opacity-80" 
                  style={{ 
                    backgroundImage: `repeating-linear-gradient(90deg, ${tpl.inkColor} 0 2px, transparent 2px 4px, ${tpl.inkColor} 4px 6px, transparent 6px 9px, ${tpl.inkColor} 9px 11px)` 
                  }} 
                />
                <span className="text-[6.5px] font-mono text-gray-400">{idNumber}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PORTRAIT LAYOUT
    return (
      <div 
        className="relative bg-white border border-gray-300 shadow-md flex flex-col overflow-hidden text-gray-800 transition-all select-none w-[230px] h-[340px]"
        style={{ fontFamily: 'sans-serif' }}
      >
        {/* Header Ribbon */}
        <div 
          className="p-3 text-center text-white relative"
          style={{ backgroundColor: tpl.themeColor }}
        >
          <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
            G
          </div>
          <h3 className="font-black text-[11px] leading-tight tracking-tight uppercase">{tpl.schoolName}</h3>
          <p className="text-[7px] opacity-80 leading-none mt-0.5">{tpl.schoolTagline}</p>
          <div className="mt-1.5 inline-block bg-white/25 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
            {type} ID CARD
          </div>
        </div>

        {/* Photo Container with overlapping shadow */}
        <div className="flex flex-col items-center -mt-3 z-10">
          <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-white shadow-md bg-gray-100">
            <img src={photo} alt={fullName} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-[12px] font-black text-gray-900 mt-2 text-center px-2 leading-tight">
            {fullName}
          </h2>
          <span 
            className="text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 inline-block"
            style={{ backgroundColor: tpl.accentColor, color: tpl.inkColor }}
          >
            {roleOrClass}
          </span>
        </div>

        {/* Key Fields */}
        <div className="px-4 mt-2 space-y-1 text-[8.5px] text-gray-600 flex-1">
          <div className="flex justify-between border-b border-gray-100 pb-0.5">
            <span className="text-gray-400 font-medium">{isStudent ? 'Admission No' : 'Staff ID'}</span>
            <span className="font-bold text-gray-800">{idNumber}</span>
          </div>
          {isStudent && (
            <div className="flex justify-between border-b border-gray-100 pb-0.5">
              <span className="text-gray-400 font-medium">Roll Number</span>
              <span className="font-bold text-gray-800">{rollNo}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-gray-100 pb-0.5">
            <span className="text-gray-400 font-medium">Blood Group</span>
            <span className="font-bold text-red-600">{bloodGroup}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-0.5">
            <span className="text-gray-400 font-medium">Emergency Ph</span>
            <span className="font-bold text-gray-800">{phone}</span>
          </div>
        </div>

        {/* Footer with barcode */}
        <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex flex-col items-center mt-auto">
          <div 
            className="h-3.5 w-36" 
            style={{ 
              backgroundImage: `repeating-linear-gradient(90deg, ${tpl.inkColor} 0 2px, transparent 2px 4px, ${tpl.inkColor} 4px 6px, transparent 6px 9px, ${tpl.inkColor} 9px 12px)` 
            }} 
          />
          <span className="text-[7.5px] font-mono text-gray-500 mt-0.5 tracking-wider">{idNumber}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f4f7fc] min-h-[calc(100vh-64px)] font-sans flex flex-col p-6">
      
      {/* ----------------- HIDDEN PRINT SHEET ----------------- */}
      <div id="id-card-print-area" className="hidden print:block bg-white w-full">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * { visibility: hidden !important; }
            #id-card-print-area, #id-card-print-area * { visibility: visible !important; }
            #id-card-print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: ${sheetMargin}mm !important;
              background: white !important;
            }
            .print-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: ${sheetGap}mm !important;
              justify-items: center !important;
              align-items: center !important;
            }
            .print-card-box {
              page-break-inside: avoid !important;
              ${showCutMarks ? 'border: 1px dashed #cbd5e1 !important;' : ''}
              padding: 2mm !important;
            }
          }
        `}} />

        <div className="print-grid">
          {peopleToPrint.map((p, idx) => (
            <div key={idx} className="print-card-box">
              {renderCard(p, activeTab === 'student' ? 'Student' : 'Staff', activeTemplate, cardSide)}
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- SCREEN HEADER ----------------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#5542f6] to-[#7f71f8] rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100 mr-3.5">
            <Contact className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tight">Smart ID Card Studio</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-emerald-600" /> Real Auto-Gen Active
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              Live database merge, CR80 standard layouts, QR code synthesis, and edge-accurate batch printing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowNewTemplateModal(true)}
            className="flex items-center px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-[#5542f6]" />
            New Design
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] transition-all shadow-md shadow-indigo-100"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Cards ({peopleToPrint.length})
          </button>
        </div>
      </div>

      {/* ----------------- TOP METRIC BAR ----------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 no-print">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Issued</p>
            <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{stats.totalIssued}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#5542f6] flex items-center justify-center">
            <Contact className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Student Cards</p>
            <h3 className="text-xl font-extrabold text-emerald-600 mt-0.5">{stats.studentCards}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Staff Cards</p>
            <h3 className="text-xl font-extrabold text-amber-600 mt-0.5">{stats.staffCards}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Designs Active</p>
            <h3 className="text-xl font-extrabold text-purple-600 mt-0.5">{templates.length}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ----------------- NAVIGATION TABS ----------------- */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-print space-x-2">
        <button 
          onClick={() => setActiveTab('student')}
          className={`flex items-center px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'student' ? 'border-[#5542f6] text-[#5542f6]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Contact className="w-4 h-4 mr-2" />
          Student ID Cards
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`flex items-center px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'staff' ? 'border-[#5542f6] text-[#5542f6]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Staff ID Cards
        </button>
        <button 
          onClick={() => setActiveTab('designs')}
          className={`flex items-center px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'designs' ? 'border-[#5542f6] text-[#5542f6]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 mr-2" />
          Card Designs ({templates.length})
        </button>
        <button 
          onClick={() => setActiveTab('issued')}
          className={`flex items-center px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'issued' ? 'border-[#5542f6] text-[#5542f6]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Issued Archive ({issuedCards.length})
        </button>
      </div>

      {/* ----------------- TAB CONTENTS ----------------- */}
      <div className="space-y-6 flex-1 no-print">

        {/* ================= TAB 1: STUDENT ID CARDS ================= */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 text-[#5542f6] mr-2" />
                  <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Filter Students by Class & Section</h2>
                </div>
                <span className="text-xs text-gray-400">Class database connected</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Class *</label>
                  <select 
                    value={selectedClass} 
                    onChange={handleClassChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white focus:border-[#5542f6]"
                  >
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.className}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Section</label>
                  <select 
                    value={selectedSection} 
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white focus:border-[#5542f6]"
                  >
                    <option value="">-- All Sections --</option>
                    {sections.map(s => (
                      <option key={s._id} value={s._id}>{s.sectionName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Search Student Name / Adm No</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Type to filter..." 
                      value={searchStudentText}
                      onChange={(e) => setSearchStudentText(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#5542f6]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Studio Grid (Controls + Table on Left, Live Preview on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Student Selection Table & Controls */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Print Controls Header */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Card Template</label>
                      <select 
                        value={selectedTemplateId} 
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 bg-white focus:border-[#5542f6]"
                      >
                        {templates.map(t => (
                          <option key={t.templateId} value={t.templateId}>{t.title} ({t.orientation})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Card Side</label>
                      <button 
                        onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                        className="flex items-center px-2.5 py-1 border border-gray-200 rounded-lg text-xs font-bold bg-gray-50 hover:bg-gray-100 text-gray-700"
                      >
                        <ArrowLeftRight className="w-3 h-3 mr-1 text-[#5542f6]" />
                        Showing: <span className="uppercase ml-1 text-[#5542f6]">{cardSide}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleAutoGenerate(false)}
                      disabled={loadingAction || !activePersonPreview}
                      className="flex items-center px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-[#5542f6] rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <Wand2 className="w-3 h-3 mr-1.5" />
                      Auto-Gen Current
                    </button>
                    <button 
                      onClick={() => handleAutoGenerate(true)}
                      disabled={loadingAction || selectedStudentIds.length === 0}
                      className="flex items-center px-3 py-1.5 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 mr-1.5" />
                      Bulk Gen ({selectedStudentIds.length})
                    </button>
                  </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50/70 p-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-800">
                        Students ({filteredStudents.length})
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-[#5542f6] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                        {selectedStudentIds.length} selected
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">Click row to preview card</span>
                  </div>

                  {loadingStudents ? (
                    <div className="p-12 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5542f6]" />
                      <p className="text-xs font-medium">Loading students from database...</p>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs font-medium">No students found in this class.</p>
                    </div>
                  ) : (
                    <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-gray-50/90 sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                            <th className="p-2.5 w-10">
                              <input 
                                type="checkbox" 
                                onChange={handleSelectAllStudents}
                                checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                                className="rounded text-[#5542f6] focus:ring-[#5542f6]"
                              />
                            </th>
                            <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Student</th>
                            <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Adm No</th>
                            <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Roll</th>
                            <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Blood</th>
                            <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredStudents.map((student) => {
                            const isSelected = selectedStudentIds.includes(student._id);
                            const isCurrentPreview = activePersonPreview?.data?._id === student._id;

                            return (
                              <tr 
                                key={student._id}
                                onClick={() => setActivePersonPreview({ type: 'Student', data: student })}
                                className={`cursor-pointer transition-colors ${
                                  isCurrentPreview 
                                    ? 'bg-indigo-50/60 font-semibold' 
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => toggleStudentSelection(student._id)}
                                    className="rounded text-[#5542f6] focus:ring-[#5542f6]"
                                  />
                                </td>
                                <td className="p-2.5">
                                  <div className="flex items-center space-x-2.5">
                                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                                      <img 
                                        src={student.studentPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80'} 
                                        alt={student.firstName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-bold text-gray-900 leading-tight">
                                        {student.firstName} {student.lastName}
                                      </div>
                                      <div className="text-[10px] text-gray-400 font-normal">
                                        {student.gender || 'Student'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2.5 font-mono text-gray-600">{student.admissionNo || student.aparId}</td>
                                <td className="p-2.5 font-bold text-gray-700">{student.rollNo || '-'}</td>
                                <td className="p-2.5">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                                    {student.bloodGroup || 'O+'}
                                  </span>
                                </td>
                                <td className="p-2.5">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePersonPreview({ type: 'Student', data: student });
                                    }}
                                    className="text-[11px] text-[#5542f6] hover:underline font-bold flex items-center"
                                  >
                                    <Eye className="w-3 h-3 mr-1" /> Preview
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: High-Resolution Live Canvas & Print Sheet Configuration */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Live Preview Card Box */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center text-xs font-bold text-gray-800 uppercase tracking-wider">
                      <Eye className="w-4 h-4 mr-1.5 text-[#5542f6]" />
                      Real-Time Live Preview
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCardSide('front')}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${cardSide === 'front' ? 'bg-[#5542f6] text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        Front
                      </button>
                      <button 
                        onClick={() => setCardSide('back')}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${cardSide === 'back' ? 'bg-[#5542f6] text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        Back
                      </button>
                    </div>
                  </div>

                  {/* Render ID Card Preview */}
                  {activePersonPreview ? (
                    <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200/60 flex items-center justify-center w-full min-h-[360px]">
                      {renderCard(activePersonPreview.data, activePersonPreview.type, activeTemplate, cardSide)}
                    </div>
                  ) : (
                    <div className="h-[360px] w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6">
                      <ImageIcon className="w-12 h-12 mb-2 text-gray-300" />
                      <p className="text-xs font-medium">Select a student from the list to preview</p>
                    </div>
                  )}

                  {/* Single Card Print & Action Footer */}
                  <div className="w-full mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Standard CR80 Size • Edge Accurate
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handlePrint}
                        className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" /> Print This Card
                      </button>
                    </div>
                  </div>
                </div>

                {/* Print Sheet Configuration Accordion */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div 
                    onClick={() => setShowPrintLayout(!showPrintLayout)}
                    className="p-3.5 bg-gray-50/80 cursor-pointer flex items-center justify-between border-b border-gray-100"
                  >
                    <div className="flex items-center text-xs font-bold text-gray-800">
                      <LayoutGrid className="w-4 h-4 mr-2 text-[#5542f6]" />
                      Batch Print Sheet Setup (A4 Grid)
                    </div>
                    <span className="text-xs text-gray-400">{showPrintLayout ? 'Hide' : 'Expand'}</span>
                  </div>

                  {showPrintLayout && (
                    <div className="p-4 space-y-3.5 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Paper Size</label>
                          <select 
                            value={printPaper} 
                            onChange={(e) => setPrintPaper(e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs font-semibold bg-white"
                          >
                            <option value="A4">A4 (210 × 297 mm)</option>
                            <option value="Letter">US Letter</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Orientation</label>
                          <select 
                            value={printOrientation} 
                            onChange={(e) => setPrintOrientation(e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs font-semibold bg-white"
                          >
                            <option value="Portrait">Portrait</option>
                            <option value="Landscape">Landscape</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sheet Margin (mm)</label>
                          <input 
                            type="number" 
                            value={sheetMargin} 
                            onChange={(e) => setSheetMargin(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs font-semibold bg-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Card Gap (mm)</label>
                          <input 
                            type="number" 
                            value={sheetGap} 
                            onChange={(e) => setSheetGap(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs font-semibold bg-white" 
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <label className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={showCutMarks}
                            onChange={(e) => setShowCutMarks(e.target.checked)}
                            className="mr-2 rounded text-[#5542f6]" 
                          /> 
                          Print Cutting Guidelines
                        </label>

                        <label className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={archiveCopy}
                            onChange={(e) => setArchiveCopy(e.target.checked)}
                            className="mr-2 rounded text-[#5542f6]" 
                          /> 
                          Archive in Database
                        </label>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: STAFF ID CARDS ================= */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 text-[#5542f6] mr-2" />
                  <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Filter Staff & Faculty Members</h2>
                </div>
                <span className="text-xs text-gray-400">HR Directory Synced</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Department</label>
                  <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white focus:border-[#5542f6]"
                  >
                    <option value="All">-- All Departments --</option>
                    <option value="Science & Math">Science & Math</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Creative Arts">Creative Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Search Staff Name / ID</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Type staff name or STF-ID..." 
                      value={searchStaffText}
                      onChange={(e) => setSearchStaffText(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#5542f6]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Grid with Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-5">
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Faculty Template</label>
                      <select 
                        value={selectedTemplateId} 
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 bg-white focus:border-[#5542f6]"
                      >
                        {templates.map(t => (
                          <option key={t.templateId} value={t.templateId}>{t.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Card Side</label>
                      <button 
                        onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                        className="flex items-center px-2.5 py-1 border border-gray-200 rounded-lg text-xs font-bold bg-gray-50 hover:bg-gray-100 text-gray-700"
                      >
                        <ArrowLeftRight className="w-3 h-3 mr-1 text-[#5542f6]" />
                        Showing: <span className="uppercase ml-1 text-[#5542f6]">{cardSide}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleAutoGenerate(false)}
                      disabled={loadingAction || !activePersonPreview}
                      className="flex items-center px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100"
                    >
                      <Wand2 className="w-3 h-3 mr-1.5" />
                      Auto-Gen Current
                    </button>
                    <button 
                      onClick={() => handleAutoGenerate(true)}
                      disabled={loadingAction || selectedStaffIds.length === 0}
                      className="flex items-center px-3 py-1.5 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 mr-1.5" />
                      Bulk Gen ({selectedStaffIds.length})
                    </button>
                  </div>
                </div>

                {/* Staff Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50/70 p-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-800">Staff Members ({filteredStaff.length})</span>
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-100">
                        {selectedStaffIds.length} selected
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">Click to preview card</span>
                  </div>

                  <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                          <th className="p-2.5 w-10">
                            <input 
                              type="checkbox" 
                              onChange={handleSelectAllStaff}
                              checked={selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0}
                              className="rounded text-[#5542f6] focus:ring-[#5542f6]"
                            />
                          </th>
                          <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Staff Member</th>
                          <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Staff ID</th>
                          <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Department</th>
                          <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Designation</th>
                          <th className="p-2.5 text-[10px] font-bold text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredStaff.map((staff) => {
                          const isSelected = selectedStaffIds.includes(staff._id);
                          const isCurrentPreview = activePersonPreview?.data?._id === staff._id;

                          return (
                            <tr 
                              key={staff._id}
                              onClick={() => setActivePersonPreview({ type: 'Staff', data: staff })}
                              className={`cursor-pointer transition-colors ${
                                isCurrentPreview ? 'bg-amber-50/50 font-semibold' : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => toggleStaffSelection(staff._id)}
                                  className="rounded text-[#5542f6] focus:ring-[#5542f6]"
                                />
                              </td>
                              <td className="p-2.5">
                                <div className="flex items-center space-x-2.5">
                                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                                    <img 
                                      src={staff.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                                      alt={staff.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900 leading-tight">{staff.fullName}</div>
                                    <div className="text-[10px] text-gray-400 font-normal">{staff.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2.5 font-mono text-gray-600 font-bold">{staff.staffId}</td>
                              <td className="p-2.5 text-gray-600">{staff.department}</td>
                              <td className="p-2.5 text-gray-700 font-medium">{staff.designation}</td>
                              <td className="p-2.5">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePersonPreview({ type: 'Staff', data: staff });
                                  }}
                                  className="text-[11px] text-[#5542f6] hover:underline font-bold flex items-center"
                                >
                                  <Eye className="w-3 h-3 mr-1" /> Preview
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Live Preview */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center text-xs font-bold text-gray-800 uppercase tracking-wider">
                      <Eye className="w-4 h-4 mr-1.5 text-[#5542f6]" />
                      Faculty Live Preview
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCardSide('front')}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${cardSide === 'front' ? 'bg-[#5542f6] text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        Front
                      </button>
                      <button 
                        onClick={() => setCardSide('back')}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${cardSide === 'back' ? 'bg-[#5542f6] text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        Back
                      </button>
                    </div>
                  </div>

                  {activePersonPreview ? (
                    <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200/60 flex items-center justify-center w-full min-h-[360px]">
                      {renderCard(activePersonPreview.data, activePersonPreview.type, activeTemplate, cardSide)}
                    </div>
                  ) : (
                    <div className="h-[360px] w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6">
                      <ImageIcon className="w-12 h-12 mb-2 text-gray-300" />
                      <p className="text-xs font-medium">Select a staff member from the list to preview</p>
                    </div>
                  )}

                  <div className="w-full mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Official Staff Credentials</span>
                    <button 
                      onClick={handlePrint}
                      className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-200"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1" /> Print Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CARD DESIGNS GALLERY ================= */}
        {activeTab === 'designs' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">ID Card Templates Library</h2>
                <p className="text-xs text-gray-500 mt-0.5">Choose or customize pre-designed physical card layouts for students and faculty.</p>
              </div>
              <button 
                onClick={() => setShowNewTemplateModal(true)}
                className="flex items-center px-4 py-2 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add New Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div 
                  key={tpl._id || tpl.templateId}
                  className={`rounded-xl border transition-all p-4 flex flex-col justify-between ${
                    selectedTemplateId === tpl.templateId 
                      ? 'border-[#5542f6] ring-2 ring-[#5542f6]/20 bg-indigo-50/20' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: tpl.accentColor, color: tpl.inkColor }}>
                        {tpl.orientation} • {tpl.cardType}
                      </span>
                      {selectedTemplateId === tpl.templateId && (
                        <span className="text-[10px] font-extrabold text-[#5542f6] flex items-center bg-indigo-50 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 mr-0.5" /> Active Choice
                        </span>
                      )}
                    </div>

                    {/* Miniature Representation */}
                    <div className="bg-slate-100 rounded-lg p-3 flex items-center justify-center min-h-[160px] mb-3">
                      <div className="scale-75 origin-center">
                        {renderCard(
                          students[0] || staffList[0] || { firstName: 'Sample', lastName: 'Student', admissionNo: 'SAMPLE-01', rollNo: '1', bloodGroup: 'B+' },
                          tpl.cardType === 'Staff' ? 'Staff' : 'Student',
                          tpl,
                          'front'
                        )}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-sm text-gray-900">{tpl.title}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{tpl.dimensions}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: tpl.themeColor }} />
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: tpl.accentColor }} />
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: tpl.inkColor }} />
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedTemplateId(tpl.templateId);
                        Swal.fire({
                          title: 'Design Activated!',
                          text: `"${tpl.title}" is now the active template for generation and printing.`,
                          icon: 'success',
                          timer: 1500,
                          showConfirmButton: false
                        });
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-[#5542f6] hover:text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Use Design
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: ISSUED CARDS ARCHIVE ================= */}
        {activeTab === 'issued' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Issued ID Cards Audit Archive</h2>
                <p className="text-xs text-gray-500 mt-0.5">Complete digital history of all identity cards generated and issued across sessions.</p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by card #, name..." 
                    value={archiveSearchText}
                    onChange={(e) => setArchiveSearchText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#5542f6]"
                  />
                </div>
                <button 
                  onClick={refreshStatsAndArchive}
                  className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  title="Refresh Archive"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filteredArchive.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                <FolderOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <h3 className="text-sm font-bold text-gray-700">No Generated ID Cards Found</h3>
                <p className="text-xs text-gray-400 mt-1">Generate individual or bulk student/staff ID cards to see them archived here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Card Serial</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Holder</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Type</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Class / Dept</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Valid Thru</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredArchive.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-[#5542f6]">{card.cardNumber}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                              <img src={card.photoUrl} alt={card.fullName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{card.fullName}</div>
                              <div className="text-[10px] text-gray-400">{card.idNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            card.personType === 'Student' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {card.personType}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {card.personType === 'Student' 
                            ? `${card.className} - ${card.sectionName}` 
                            : `${card.department} (${card.designation})`}
                        </td>
                        <td className="p-3 text-gray-600 font-medium">{card.validUntil}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center w-max ${
                            card.status === 'Printed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> {card.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {card.status !== 'Printed' && (
                              <button 
                                onClick={() => handleMarkPrinted(card._id)}
                                className="p-1 text-gray-400 hover:text-emerald-600"
                                title="Mark Printed"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setActivePersonPreview({ type: card.personType, data: card });
                                setSelectedTemplateId(card.templateId);
                                setActiveTab(card.personType === 'Student' ? 'student' : 'staff');
                              }}
                              className="p-1 text-gray-400 hover:text-[#5542f6]"
                              title="Preview in Studio"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteIssued(card._id, card.fullName)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ----------------- CREATE NEW TEMPLATE MODAL ----------------- */}
      {showNewTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Create Custom ID Card Template</h3>
              <button 
                onClick={() => setShowNewTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Design Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Modern Crimson Faculty Card"
                  value={newTemplateForm.title}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Card Type</label>
                  <select 
                    value={newTemplateForm.cardType}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, cardType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                    <option value="All">All / Universal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Orientation</label>
                  <select 
                    value={newTemplateForm.orientation}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, orientation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                  >
                    <option value="Portrait">Portrait (Standard)</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary Color</label>
                  <input 
                    type="color" 
                    value={newTemplateForm.themeColor}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, themeColor: e.target.value })}
                    className="w-full h-8 border border-gray-300 rounded p-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Accent Soft</label>
                  <input 
                    type="color" 
                    value={newTemplateForm.accentColor}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, accentColor: e.target.value })}
                    className="w-full h-8 border border-gray-300 rounded p-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Text Ink</label>
                  <input 
                    type="color" 
                    value={newTemplateForm.inkColor}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, inkColor: e.target.value })}
                    className="w-full h-8 border border-gray-300 rounded p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">School Name</label>
                <input 
                  type="text" 
                  value={newTemplateForm.schoolName}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, schoolName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tagline / Affiliation</label>
                <input 
                  type="text" 
                  value={newTemplateForm.schoolTagline}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, schoolTagline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowNewTemplateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#5542f6] text-white rounded-lg font-bold hover:bg-[#4533e4]"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
