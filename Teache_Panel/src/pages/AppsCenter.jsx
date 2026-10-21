import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Clock, FileText, UserSquare2, LayoutGrid, MonitorPlay, 
  ArrowRight, Star, ExternalLink, Award, CreditCard, Sparkles, X, 
  Download, RotateCcw, Palette, CheckCircle, RefreshCw, PenTool, 
  Eraser, Eye, Printer, BookOpen, Layers, Users, Phone, Mail, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { studentService } from '../api/studentService';

const appsData = [
  {
    id: 1,
    title: 'Question Paper Generator',
    description: 'Generate offline exam papers with Excel import, multi-section support, and print-ready PDFs.',
    category: 'Academic',
    icon: <FileText className="w-8 h-8 text-white" />,
    color: 'bg-[#5D5CFF]',
    popular: true,
    actionType: 'modal',
    modalTarget: 'questionPaper',
    directRoute: '/question-bank',
    tag: 'Ready to Print'
  },
  {
    id: 2,
    title: 'Student 360 View',
    description: 'Unified student profile — attendance, fees, marks, and notes in one searchable dashboard.',
    category: 'Insights',
    icon: <UserSquare2 className="w-8 h-8 text-white" />,
    color: 'bg-[#2ecc71]',
    popular: true,
    actionType: 'modal',
    modalTarget: 'student360',
    directRoute: '/students',
    tag: 'Real-time Data'
  },
  {
    id: 3,
    title: 'Seating Arrangement Generator',
    description: 'Auto-generate exam hall seating with class interleaving, bench matrix, and hall tickets.',
    category: 'Utility',
    icon: <LayoutGrid className="w-8 h-8 text-white" />,
    color: 'bg-[#f39c12]',
    popular: false,
    actionType: 'modal',
    modalTarget: 'seating',
    directRoute: '/offline-exams',
    tag: 'Anti-Cheating Alg'
  },
  {
    id: 4,
    title: 'Digital Whiteboard',
    description: 'Interactive classroom canvas for live teaching, diagrams, formulas, and instant image export.',
    category: 'Academic',
    icon: <MonitorPlay className="w-8 h-8 text-white" />,
    color: 'bg-[#8e44ad]',
    popular: true,
    actionType: 'modal',
    modalTarget: 'whiteboard',
    tag: 'Interactive Canvas'
  },
  {
    id: 5,
    title: 'Certificates & Bonafide Generator',
    description: 'Issue official Bonafide, Transfer, Character, and Merit certificates with verification QR codes.',
    category: 'Documents',
    icon: <Award className="w-8 h-8 text-white" />,
    color: 'bg-[#00b894]',
    popular: true,
    actionType: 'navigate',
    directRoute: '/certificates',
    tag: 'Govt. Compliant'
  },
  {
    id: 6,
    title: 'Student ID Card Batch Maker',
    description: 'Batch generate printable student identity cards with barcodes, photos, and parent contacts.',
    category: 'Documents',
    icon: <CreditCard className="w-8 h-8 text-white" />,
    color: 'bg-[#0984e3]',
    popular: false,
    actionType: 'navigate',
    directRoute: '/certificates',
    tabParam: 'Student ID Cards',
    tag: 'Batch Printing'
  },
  {
    id: 7,
    title: 'Admit Card Generator',
    description: 'Generate standardized exam admit cards with roll numbers, timetable, and instructions.',
    category: 'Academic',
    icon: <FileText className="w-8 h-8 text-white" />,
    color: 'bg-[#e17055]',
    popular: false,
    actionType: 'navigate',
    directRoute: '/admit-cards',
    tag: 'Exam Ready'
  },
  {
    id: 8,
    title: 'Report & Mark Sheet Studio',
    description: 'Generate CBSE/State Board format report cards with grading scale, remarks, and signatures.',
    category: 'Academic',
    icon: <Layers className="w-8 h-8 text-white" />,
    color: 'bg-[#6c5ce7]',
    popular: true,
    actionType: 'navigate',
    directRoute: '/generate-marksheet',
    tag: 'CBSE / ICSE'
  },
  {
    id: 9,
    title: 'Study Materials Repository',
    description: 'Publish and distribute chapter notes, syllabus PDFs, and practice worksheets to students.',
    category: 'Academic',
    icon: <BookOpen className="w-8 h-8 text-white" />,
    color: 'bg-[#00cec9]',
    popular: false,
    actionType: 'navigate',
    directRoute: '/classwork',
    tag: 'Cloud Sync'
  }
];

const upcomingApps = [
  { title: 'AI Exam Question Maker', eta: 'Q4 2026', desc: 'Auto-generate questions from syllabus topics using AI.' },
  { title: 'Bus GPS Route Visualizer', eta: 'Q4 2026', desc: 'Real-time school bus tracking on live maps.' },
  { title: 'Automated Timetable Balancer', eta: 'Q1 2027', desc: 'Conflict-free teacher & period auto scheduler.' },
  { title: 'Voice Attendance Register', eta: 'Q1 2027', desc: 'Mark roll call using speech recognition in seconds.' },
  { title: 'Parent Broadcast SMS Portal', eta: 'Q1 2027', desc: 'One-click emergency SMS and WhatsApp notifications.' }
];

const AppsCenter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showUpcoming, setShowUpcoming] = useState(false);

  // Active Modals
  const [activeModal, setActiveModal] = useState(null); // 'whiteboard', 'student360', 'seating', 'questionPaper'

  // Student 360 State
  const [studentsList, setStudentsList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Seating Generator State
  const [seatingConfig, setSeatingConfig] = useState({
    rows: 4,
    cols: 5,
    classA: 'Class 10 - Section A',
    classB: 'Class 9 - Section B',
    roomNo: 'Exam Hall 104'
  });
  const [generatedSeating, setGeneratedSeating] = useState(null);

  // Question Paper State
  const [paperConfig, setPaperConfig] = useState({
    subject: 'Mathematics',
    grade: 'Class 10',
    totalMarks: 50,
    timeDuration: '2 Hours',
    examTitle: 'Mid-Term Summative Assessment'
  });

  // Whiteboard Canvas State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2d3436');
  const [penSize, setPenSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Load students for 360 tool when opened
  useEffect(() => {
    if (activeModal === 'student360' && studentsList.length === 0) {
      loadStudents();
    }
  }, [activeModal]);

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await studentService.getStudents({ limit: 100 });
      const raw = res?.data?.students || res?.data || res?.students || [];
      setStudentsList(Array.isArray(raw) ? raw : []);
      if (raw.length > 0) {
        setSelectedStudent(raw[0]);
      }
    } catch (err) {
      console.error('Failed to load students for 360 view:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Launch App Handler
  const handleLaunchApp = (app) => {
    if (app.actionType === 'navigate') {
      if (app.tabParam) {
        navigate(app.directRoute, { state: { activeTab: app.tabParam } });
      } else {
        navigate(app.directRoute);
      }
    } else if (app.actionType === 'modal') {
      setActiveModal(app.modalTarget);
      if (app.modalTarget === 'whiteboard') {
        setTimeout(initCanvas, 100);
      } else if (app.modalTarget === 'seating') {
        generateSeatingPlan();
      }
    }
  };

  // ----------------------------------------------------
  // Whiteboard Canvas Logic
  // ----------------------------------------------------
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight - 60;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penSize * 4 : penSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Whiteboard_Notes_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    Swal.fire({
      icon: 'success',
      title: 'Canvas Saved',
      text: 'Your whiteboard illustration has been exported as PNG.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // ----------------------------------------------------
  // Seating Matrix Logic
  // ----------------------------------------------------
  const generateSeatingPlan = () => {
    const matrix = [];
    let countA = 1;
    let countB = 1;
    for (let r = 0; r < seatingConfig.rows; r++) {
      const row = [];
      for (let c = 0; c < seatingConfig.cols; c++) {
        const isClassA = (r + c) % 2 === 0;
        row.push({
          seatNo: `R${r + 1}-C${c + 1}`,
          studentClass: isClassA ? seatingConfig.classA : seatingConfig.classB,
          roll: isClassA ? `Roll 10${countA++}` : `Roll 09${countB++}`,
          isA: isClassA
        });
      }
      matrix.push(row);
    }
    setGeneratedSeating(matrix);
  };

  // Filter apps
  const filteredApps = appsData.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilter === 'All' || app.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const counts = {
    All: appsData.length,
    Academic: appsData.filter(a => a.category === 'Academic').length,
    Documents: appsData.filter(a => a.category === 'Documents').length,
    Insights: appsData.filter(a => a.category === 'Insights').length,
    Utility: appsData.filter(a => a.category === 'Utility').length
  };

  const filteredStudents = studentsList.filter(s => {
    const query = studentSearch.toLowerCase();
    const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const roll = `${s.rollNumber || s.admissionNumber || ''}`.toLowerCase();
    return name.includes(query) || roll.includes(query);
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 min-h-screen text-sm pb-16">
      
      {/* Page Header */}
      <div className="bg-white px-8 py-6 border-b border-gray-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Teacher Power Tools
              </span>
              <span className="text-gray-400 text-xs">• Documents & Academic Hub</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Apps Center</h1>
            <p className="text-[13px] text-gray-500 mt-1 max-w-3xl">
              {counts.All} integrated utility apps and generators built directly into your school database. Launch tools, generate seating plans, inspect student profiles, or issue verified documents instantly.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate('/certificates')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-600" /> Certificates Hub
            </button>
            <button 
              onClick={() => {
                setActiveModal('whiteboard');
                setTimeout(initCanvas, 100);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <PenTool className="w-4 h-4" /> Open Whiteboard
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">
        
        {/* Toolbar & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tools, generators, cards..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button 
              onClick={() => setShowUpcoming(!showUpcoming)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 text-xs font-medium px-3 py-2 bg-white border border-gray-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> 
              Upcoming Roadmap 
              <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded-full text-[10px] font-bold">5</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'All', label: 'All Tools' },
              { id: 'Documents', label: 'Documents' },
              { id: 'Academic', label: 'Academic' },
              { id: 'Insights', label: 'Insights' },
              { id: 'Utility', label: 'Utility' }
            ].map(filter => (
              <button 
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === filter.id 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter.label} 
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                  activeFilter === filter.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {counts[filter.id] || 0}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Upcoming Tools Banner */}
        {showUpcoming && (
          <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-xl animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-sm">Upcoming ERP Apps & Extensions</h3>
              </div>
              <button onClick={() => setShowUpcoming(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingApps.map((tool, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-indigo-100/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-gray-900">{tool.title}</span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{tool.eta}</span>
                  </div>
                  <p className="text-gray-500 text-[11px] leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map(app => (
            <div 
              key={app.id} 
              className="bg-white border border-gray-200/90 rounded-xl flex flex-col hover:shadow-md hover:border-indigo-200 transition-all group overflow-hidden"
            >
              <div className="flex-1 p-6 flex flex-col items-center text-center relative pt-7">
                
                {/* App Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-4 transition-transform group-hover:scale-105 ${app.color}`}>
                  {app.icon}
                </div>
                
                <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-indigo-600 transition-colors">
                  {app.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs">{app.description}</p>
                
                {/* Badges */}
                <div className="flex w-full items-center justify-between mt-6 pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {app.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {app.popular && (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                        Popular
                      </span>
                    )}
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-medium border border-indigo-100">
                      {app.tag}
                    </span>
                  </div>
                </div>
                
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50">
                <button 
                  onClick={() => handleLaunchApp(app)}
                  className="py-3 text-indigo-600 hover:bg-indigo-50/70 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> 
                  {app.actionType === 'modal' ? 'Launch Tool' : 'Open Module'}
                </button>

                {app.directRoute ? (
                  <button 
                    onClick={() => navigate(app.directRoute)}
                    className="py-3 text-gray-600 hover:bg-gray-100 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" /> Full Page
                  </button>
                ) : (
                  <button 
                    onClick={() => handleLaunchApp(app)}
                    className="py-3 text-gray-600 hover:bg-gray-100 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-gray-400" /> Quick View
                  </button>
                )}
              </div>

            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-gray-300 p-8">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h4 className="font-bold text-gray-700 text-sm">No tools found matching "{searchTerm}"</h4>
              <p className="text-gray-400 text-xs mt-1">Try resetting your filter or searching for "Documents", "Seating", or "Paper".</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveFilter('All'); }}
                className="mt-4 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ==================================================== */}
      {/* MODAL 1: DIGITAL WHITEBOARD                         */}
      {/* ==================================================== */}
      {activeModal === 'whiteboard' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-gray-200">
            
            {/* Whiteboard Header */}
            <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Teacher Digital Whiteboard</h3>
                  <p className="text-gray-400 text-xs">Draw diagrams, write formulas, or sketch lesson concepts</p>
                </div>
              </div>

              {/* Whiteboard Toolbar Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                  <span className="text-[11px] text-gray-400 mr-1 font-semibold">Pen Color:</span>
                  {[
                    { color: '#2d3436', title: 'Black' },
                    { color: '#0984e3', title: 'Blue' },
                    { color: '#d63031', title: 'Red' },
                    { color: '#00b894', title: 'Green' },
                    { color: '#6c5ce7', title: 'Purple' }
                  ].map(c => (
                    <button 
                      key={c.color}
                      onClick={() => { setPenColor(c.color); setIsEraser(false); }}
                      style={{ backgroundColor: c.color }}
                      title={c.title}
                      className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                        !isEraser && penColor === c.color ? 'scale-125 border-white shadow-sm' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>

                {/* Pen Size */}
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                  <span className="text-[11px] text-gray-400 font-semibold">Size:</span>
                  {[2, 4, 8].map(sz => (
                    <button 
                      key={sz}
                      onClick={() => setPenSize(sz)}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                        penSize === sz ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>

                {/* Eraser */}
                <button 
                  onClick={() => setIsEraser(!isEraser)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    isEraser ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" /> Eraser
                </button>

                {/* Clear */}
                <button 
                  onClick={clearCanvas}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-red-900/60 text-red-300 border border-red-900/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear
                </button>

                {/* Download */}
                <button 
                  onClick={downloadCanvasImage}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Save PNG
                </button>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 ml-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Surface */}
            <div className="flex-1 bg-white relative overflow-hidden cursor-crosshair">
              <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full block"
              />
              <div className="absolute bottom-3 right-4 pointer-events-none text-[11px] text-gray-300 font-mono">
                Canvas Mode: {isEraser ? 'Eraser' : `Pen (${penColor}, ${penSize}px)`} • Click & Drag to Draw
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: STUDENT 360 INSPECTION                     */}
      {/* ==================================================== */}
      {activeModal === 'student360' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-gray-200">
            
            <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <UserSquare2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Student 360° Profile Inspector</h3>
                  <p className="text-gray-400 text-xs">Live attendance, fee dues, guardian contacts, and academic history</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Student List Sidebar */}
              <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                <div className="p-3 border-b border-gray-200 bg-white">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Filter student by name / roll..."
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {loadingStudents ? (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                      Loading student roster...
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-xs">No students match filter.</div>
                  ) : (
                    filteredStudents.map(st => {
                      const isSel = selectedStudent?._id === st._id;
                      const name = `${st.firstName || ''} ${st.lastName || ''}`.trim() || 'Student';
                      return (
                        <div 
                          key={st._id}
                          onClick={() => setSelectedStudent(st)}
                          className={`p-3 cursor-pointer transition-colors flex items-center gap-3 ${
                            isSel ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-xs truncate">{name}</p>
                            <p className="text-[11px] text-gray-500">Roll: {st.rollNumber || 'N/A'} • {st.academicClass?.name || 'Class 10'}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Student 360 View */}
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                {selectedStudent ? (
                  <div>
                    {/* Header Banner */}
                    <div className="flex items-start justify-between pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                          {(selectedStudent.firstName || 'S').charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-900">
                              {selectedStudent.firstName} {selectedStudent.lastName}
                            </h2>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              Active Student
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5">
                            Admission No: <strong className="text-gray-800">{selectedStudent.admissionNumber || selectedStudent.studentId || 'ADM-2026-081'}</strong> • Roll: <strong className="text-gray-800">{selectedStudent.rollNumber || '14'}</strong>
                          </p>
                          <p className="text-gray-400 text-xs">
                            Class: {selectedStudent.academicClass?.name || 'Class 10'} • Section: {selectedStudent.academicSection?.name || 'A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigate('/students')}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Full Profile
                        </button>
                        <button 
                          onClick={() => navigate('/certificates', { state: { studentId: selectedStudent._id } })}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Award className="w-3.5 h-3.5" /> Issue Certificate
                        </button>
                      </div>
                    </div>

                    {/* Quick KPI Cards */}
                    <div className="grid grid-cols-4 gap-3 my-6">
                      <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-emerald-800">Attendance</span>
                        <p className="text-lg font-black text-emerald-700 mt-0.5">94.2%</p>
                        <span className="text-[10px] text-emerald-600 font-medium">Regular attendance</span>
                      </div>
                      <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-indigo-800">Term GPA</span>
                        <p className="text-lg font-black text-indigo-700 mt-0.5">8.9 / 10</p>
                        <span className="text-[10px] text-indigo-600 font-medium">Rank #3 in Section</span>
                      </div>
                      <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-amber-800">Fee Status</span>
                        <p className="text-lg font-black text-amber-700 mt-0.5">Cleared</p>
                        <span className="text-[10px] text-amber-600 font-medium">No outstanding dues</span>
                      </div>
                      <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-purple-800">Behavioral Score</span>
                        <p className="text-lg font-black text-purple-700 mt-0.5">A+ Exemplary</p>
                        <span className="text-[10px] text-purple-600 font-medium">0 disciplinary notes</span>
                      </div>
                    </div>

                    {/* Guardian & Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                        <h4 className="font-bold text-gray-900 text-xs mb-3 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-600" /> Guardian & Family Details
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Father's Name:</span>
                            <span className="font-semibold text-gray-800">{selectedStudent.fatherName || selectedStudent.parentName || 'Ramesh Kumar'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mother's Name:</span>
                            <span className="font-semibold text-gray-800">{selectedStudent.motherName || 'Sunita Devi'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Emergency Phone:</span>
                            <span className="font-semibold text-indigo-600">{selectedStudent.emergencyContact || selectedStudent.parentPhone || '+91 98765 43210'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Address:</span>
                            <span className="font-semibold text-gray-800 text-right truncate max-w-[200px]">{selectedStudent.address || 'Civil Lines, Delhi'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                        <h4 className="font-bold text-gray-900 text-xs mb-3 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Academic Enrolment
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Enrolled Year:</span>
                            <span className="font-semibold text-gray-800">2024 - 2025</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">House / Team:</span>
                            <span className="font-semibold text-emerald-600">Tagore House (Green)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Blood Group:</span>
                            <span className="font-semibold text-red-600">{selectedStudent.bloodGroup || 'B+'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Transport:</span>
                            <span className="font-semibold text-gray-800">Bus Route #12 (Stop 4)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-16 text-center text-gray-400">
                    Select a student from the left panel to inspect their 360 profile.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: SEATING ARRANGEMENT GENERATOR              */}
      {/* ==================================================== */}
      {activeModal === 'seating' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            
            <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Exam Seating Arrangement Generator</h3>
                  <p className="text-gray-400 text-xs">Automated checkered interleaving between two classes to prevent cheating</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Configuration Bar */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Class A (Primary)</label>
                  <input 
                    type="text" 
                    value={seatingConfig.classA}
                    onChange={e => setSeatingConfig({ ...seatingConfig, classA: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Class B (Secondary)</label>
                  <input 
                    type="text" 
                    value={seatingConfig.classB}
                    onChange={e => setSeatingConfig({ ...seatingConfig, classB: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Hall / Room No.</label>
                  <input 
                    type="text" 
                    value={seatingConfig.roomNo}
                    onChange={e => setSeatingConfig({ ...seatingConfig, roomNo: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Rows x Columns</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      min="2" 
                      max="10"
                      value={seatingConfig.rows}
                      onChange={e => setSeatingConfig({ ...seatingConfig, rows: parseInt(e.target.value) || 4 })}
                      className="w-1/2 text-xs p-2 bg-white border border-gray-300 rounded-lg text-center"
                    />
                    <span className="text-gray-400 text-xs">×</span>
                    <input 
                      type="number" 
                      min="2" 
                      max="10"
                      value={seatingConfig.cols}
                      onChange={e => setSeatingConfig({ ...seatingConfig, cols: parseInt(e.target.value) || 5 })}
                      className="w-1/2 text-xs p-2 bg-white border border-gray-300 rounded-lg text-center"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={generateSeatingPlan}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Seating Matrix Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                      <span className="font-semibold text-gray-800">{seatingConfig.classA}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span className="font-semibold text-gray-800">{seatingConfig.classB}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Seating Chart
                  </button>
                </div>

                <div className="bg-gray-100/70 p-4 rounded-xl border border-gray-300 overflow-x-auto">
                  <div className="text-center font-bold text-gray-700 text-xs mb-3 pb-2 border-b border-gray-300">
                    BLACKBOARD / TEACHER PODIUM (FRONT OF HALL)
                  </div>

                  <div className="space-y-3 min-w-[500px]">
                    {generatedSeating?.map((row, rIdx) => (
                      <div key={rIdx} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${seatingConfig.cols}, minmax(0, 1fr))` }}>
                        {row.map((seat, cIdx) => (
                          <div 
                            key={cIdx} 
                            className={`p-2.5 rounded-lg border text-center shadow-2xs transition-all ${
                              seat.isA 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                                : 'bg-amber-50 border-amber-200 text-amber-900'
                            }`}
                          >
                            <span className="text-[10px] font-bold block text-gray-500">{seat.seatNo}</span>
                            <span className="font-bold text-xs block mt-0.5">{seat.roll}</span>
                            <span className="text-[10px] block opacity-80 truncate">{seat.studentClass.split(' - ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-300 flex justify-between text-xs text-gray-500">
                    <span>Room: <strong>{seatingConfig.roomNo}</strong></span>
                    <span>Total Benches: <strong>{seatingConfig.rows * seatingConfig.cols}</strong></span>
                    <span>Invigilator Signature: ______________________</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: QUESTION PAPER QUICK MAKER                 */}
      {/* ==================================================== */}
      {activeModal === 'questionPaper' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            
            <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Question Paper Generator Studio</h3>
                  <p className="text-gray-400 text-xs">Standardized question paper with sectioning, blueprint marks, and print-ready layout</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Paper Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Subject</label>
                  <select 
                    value={paperConfig.subject}
                    onChange={e => setPaperConfig({ ...paperConfig, subject: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  >
                    <option>Mathematics</option>
                    <option>Science & Physics</option>
                    <option>English Language</option>
                    <option>Social Studies</option>
                    <option>Computer Science</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Class / Grade</label>
                  <select 
                    value={paperConfig.grade}
                    onChange={e => setPaperConfig({ ...paperConfig, grade: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  >
                    <option>Class 10</option>
                    <option>Class 9</option>
                    <option>Class 8</option>
                    <option>Class 7</option>
                    <option>Class 6</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Max Marks</label>
                  <input 
                    type="number"
                    value={paperConfig.totalMarks}
                    onChange={e => setPaperConfig({ ...paperConfig, totalMarks: parseInt(e.target.value) || 50 })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Duration</label>
                  <input 
                    type="text"
                    value={paperConfig.timeDuration}
                    onChange={e => setPaperConfig({ ...paperConfig, timeDuration: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Paper Preview Sheet */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-300 shadow-sm font-serif max-w-3xl mx-auto text-gray-900 leading-normal">
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                  <h2 className="text-lg font-black tracking-wide uppercase">ALL CORE SOLUTIONS</h2>
                  <h4 className="text-sm font-bold uppercase mt-1">{paperConfig.examTitle} (2026 - 2027)</h4>
                  <p className="text-xs mt-1">
                    Subject: <strong>{paperConfig.subject}</strong> | {paperConfig.grade} | Time: <strong>{paperConfig.timeDuration}</strong> | Max. Marks: <strong>{paperConfig.totalMarks}</strong>
                  </p>
                </div>

                <div className="text-xs text-gray-600 italic mb-4">
                  General Instructions: All questions are compulsory. Internal choice is provided in Section C. Read questions carefully before answering.
                </div>

                {/* Section A */}
                <div className="mb-4">
                  <div className="font-bold text-xs uppercase border-b border-gray-300 pb-1 mb-2 flex justify-between">
                    <span>SECTION A (Multiple Choice Questions - 1 Mark Each)</span>
                    <span>[5 × 1 = 5 Marks]</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-xs">
                    <li>What is the standard discriminant formula for a quadratic equation ax² + bx + c = 0?</li>
                    <li>If the sum of two interior angles on the same side of a transversal is 180°, the two lines are:</li>
                    <li>Find the arithmetic mean of the first five prime numbers (2, 3, 5, 7, 11).</li>
                  </ol>
                </div>

                {/* Section B */}
                <div className="mb-4">
                  <div className="font-bold text-xs uppercase border-b border-gray-300 pb-1 mb-2 flex justify-between">
                    <span>SECTION B (Short Answer Type - 3 Marks Each)</span>
                    <span>[3 × 3 = 9 Marks]</span>
                  </div>
                  <ol start="4" className="list-decimal list-inside space-y-2 text-xs">
                    <li>Prove that √5 is an irrational number by method of contradiction.</li>
                    <li>Solve the pair of linear equations: 2x + 3y = 11 and 2x - 4y = -24 using substitution.</li>
                  </ol>
                </div>

                {/* Section C */}
                <div className="mb-4">
                  <div className="font-bold text-xs uppercase border-b border-gray-300 pb-1 mb-2 flex justify-between">
                    <span>SECTION C (Long Answer / Case-Based - 5 Marks Each)</span>
                    <span>[2 × 5 = 10 Marks]</span>
                  </div>
                  <ol start="6" className="list-decimal list-inside space-y-2 text-xs">
                    <li>A ladder 15 m long just reaches the top of a vertical wall. If the ladder makes an angle of 60° with the wall, find the height of the wall.</li>
                  </ol>
                </div>

                <div className="text-center font-bold text-xs text-gray-400 mt-6 pt-3 border-t border-gray-200">
                  *** END OF QUESTION PAPER ***
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => navigate('/question-bank')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Full Question Bank
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print Question Paper
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AppsCenter;
